/**
 * Gadamax · Demo agente de pedidos
 * POST /.netlify/functions/agente-pedido
 *
 * Recibe el texto crudo de un pedido y devuelve un flujo SSE con cada etapa:
 * extracción con modelo → emparejamiento determinista → validación → grabado.
 * El streaming no es cosmético: la extracción toma unos segundos y el usuario
 * ve exactamente en qué punto está y qué decidió el sistema en cada paso.
 */

import { resolver, destinos, payloadSAP, payloadERP, archivoINSOFT, archivoSAP } from "../lib/motor.mjs";
import { guardar, leer, listar, siguienteNumero, modoAlmacen } from "../lib/almacen.mjs";
import { MATERIALES, CLIENTES } from "../lib/maestros.mjs";
import { EJEMPLOS, RESPALDOS } from "../lib/ejemplos.mjs";

const MODELO = "claude-sonnet-5";

/* ── esquema de salida estructurada ─────────────────────────────────────── */
const ESQUEMA = {
  type: "object",
  additionalProperties: false,
  required: ["canal", "idioma", "cliente", "documento", "lineas", "exigencias", "cirugia", "observaciones", "campos_ausentes", "confianza_global"],
  properties: {
    canal: { type: "string", description: "correo, whatsapp, portal, excel, foto_crm o desconocido" },
    idioma: { type: "string", description: "código ISO del idioma del texto, ej. es" },
    cliente: {
      type: "object", additionalProperties: false,
      required: ["nombre_detectado", "identificacion_detectada", "pais"],
      properties: {
        nombre_detectado: { type: ["string", "null"], description: "razón social tal como aparece en el texto" },
        identificacion_detectada: { type: ["string", "null"], description: "RUC, NIT, cédula o similar tal como aparece" },
        pais: { type: ["string", "null"], description: "Ecuador, Colombia u otro, deducido del RUC/NIT o del texto; null si no se puede saber" }
      }
    },
    documento: {
      type: "object", additionalProperties: false,
      required: ["referencia_cliente", "fecha_solicitada", "lugar_entrega", "condicion_pago", "moneda"],
      properties: {
        referencia_cliente: { type: ["string", "null"], description: "número de orden de compra del cliente" },
        fecha_solicitada: { type: ["string", "null"], description: "fecha de entrega en formato AAAA-MM-DD; resolver expresiones como 'el viernes' contra la fecha de hoy" },
        lugar_entrega: { type: ["string", "null"] },
        condicion_pago: { type: ["string", "null"] },
        moneda: { type: ["string", "null"] }
      }
    },
    lineas: {
      type: "array",
      description: "una entrada por producto pedido, en el orden del texto",
      items: {
        type: "object", additionalProperties: false,
        required: ["codigo_detectado", "descripcion_detectada", "cantidad", "unidad", "precio_unitario", "lote_detectado", "fecha_entrega", "nota"],
        properties: {
          codigo_detectado: { type: ["string", "null"], description: "código tal como lo escribió el cliente (código propio, referencia B. Braun o CUM); null si no puso" },
          descripcion_detectada: { type: "string", description: "texto del producto tal como aparece" },
          cantidad: { type: ["number", "null"] },
          unidad: { type: ["string", "null"], description: "cajas, unidades, frascos, sobres… tal como lo dijo el cliente" },
          precio_unitario: { type: ["number", "null"], description: "solo si el cliente indicó un precio" },
          lote_detectado: { type: ["string", "null"], description: "número de lote si el documento lo reporta (etiquetas LOT, tarjetas de cirugía)" },
          fecha_entrega: { type: ["string", "null"], description: "fecha de entrega propia de ESTA línea en AAAA-MM-DD, solo si difiere o viene por ítem" },
          nota: { type: ["string", "null"], description: "condición o salvedad que el cliente escribió sobre esta línea" }
        }
      }
    },
    exigencias: {
      type: "array", items: { type: "string" },
      description: "condiciones de recepción que el cliente impone en el documento: caducidad mínima, máximo de lotes, certificados, concordancia OC-factura…"
    },
    cirugia: {
      type: ["object", "null"], additionalProperties: false,
      description: "solo para tarjetas de control de cirugías; null en los demás canales",
      required: ["procedimiento", "fecha", "hospital", "paciente_iniciales"],
      properties: {
        procedimiento: { type: ["string", "null"] },
        fecha: { type: ["string", "null"], description: "AAAA-MM-DD" },
        hospital: { type: ["string", "null"] },
        paciente_iniciales: { type: ["string", "null"], description: "SOLO las iniciales del paciente. NUNCA transcribas el nombre completo ni la cédula: son datos personales protegidos." }
      }
    },
    observaciones: { type: "array", items: { type: "string" }, description: "instrucciones generales del pedido" },
    campos_ausentes: { type: "array", items: { type: "string" }, description: "campos que el pedido no trae y normalmente se necesitan" },
    confianza_global: { type: "number", description: "0 a 1: qué tan legible y completo estaba el pedido" }
  }
};

const SISTEMA = `Eres el componente de lectura de un agente de pedidos de dispositivos médicos que opera en Ecuador y Colombia.

Recibes un pedido tal como llegó: un correo, un WhatsApp, una orden de compra en PDF, una tabla de Excel, o la FOTOGRAFÍA de una tarjeta de control de cirugías escrita a mano — a veces con faltas de ortografía, sin tildes, en mayúsculas, torcida o con el formato roto.

Tu único trabajo es LEER y ESTRUCTURAR. Reglas:
- No inventes nada. Si un dato no está en el documento, pon null y anótalo en campos_ausentes.
- NUNCA adivines códigos de material. Copia el código tal como lo escribió el cliente (su código propio, una referencia B. Braun, un CUM), o null. Otro componente hace el emparejamiento contra el maestro.
- Transcribe cantidades y precios exactamente como están. No conviertas unidades ni calcules totales.
- Formato numérico de Ecuador y Colombia: el punto separa los miles y la coma los decimales. "$171.800" son ciento setenta y un mil ochocientos, no 171,8. Devuelve siempre el número real.
- Si una línea trae lote (LOT en una etiqueta, "lote:" manuscrito), ponlo en lote_detectado.
- Si el documento impone condiciones de recepción (caducidad mínima, máximo de lotes, certificados por lote, concordancia OC-factura), lístalas en exigencias.
- Si una línea trae una condición propia ("confirmar precio", "solo si hay stock"), ponla en nota; una fecha de entrega por ítem va en fecha_entrega de esa línea.
- Si el cliente pide algo que no es un producto (una pregunta, un reclamo), no lo conviertas en línea: ponlo en observaciones.
- Separa correctamente cuando el cliente junta varios productos en un renglón.

Tarjetas de control de cirugías (fotografía): son reposición de consumo en comodato. Cada componente usado es una línea, con cantidad 1 salvo que se indique otra cosa; toma REF y LOT de las etiquetas impresas y del manuscrito. El hospital/clínica de la tarjeta es el cliente. PROTECCIÓN DE DATOS PERSONALES: del paciente devuelve SOLO iniciales en cirugia.paciente_iniciales — nunca el nombre completo, nunca la cédula, ni en observaciones ni en ningún campo. Los nombres de cirujano e instrumentista tampoco se transcriben.`;

/* ── utilidades SSE ─────────────────────────────────────────────────────── */
const enc = new TextEncoder();
const sse = (ctrl, evento, dato) =>
  ctrl.enqueue(enc.encode(`event: ${evento}\ndata: ${JSON.stringify(dato)}\n\n`));

/* ── llamada al modelo ──────────────────────────────────────────────────── */
async function extraer(texto, apiKey, imagen = null) {
  const hoy = new Date().toISOString().slice(0, 10);

  /* El contenido puede ser texto, o una fotografía con un texto de contexto
     (el canal CRM: tarjetas de cirugía). El modelo lee la imagen directamente. */
  const contenido = imagen
    ? [
        { type: "image", source: { type: "base64", media_type: imagen.media_type, data: imagen.b64 } },
        { type: "text", text: `<pedido canal="foto_crm">\n${texto || "Fotografía de tarjeta de control de cirugías publicada en el CRM. Extrae el pedido de reposición."}\n</pedido>` }
      ]
    : `<pedido>\n${texto}\n</pedido>`;

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: MODELO,
      max_tokens: 4000,
      thinking: { type: "disabled" },
      system: `${SISTEMA}\n\nHoy es ${hoy}.`,
      messages: [{ role: "user", content: contenido }],
      output_config: { format: { type: "json_schema", schema: ESQUEMA } }
    })
  });

  if (!r.ok) {
    const detalle = await r.text();
    throw new Error(`La API respondió ${r.status}: ${detalle.slice(0, 400)}`);
  }
  const d = await r.json();
  const txt = (d.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  return { extraccion: JSON.parse(txt), uso: d.usage, modelo: d.model };
}

/* ── handler ────────────────────────────────────────────────────────────── */
export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors() });
  if (req.method !== "POST") return new Response("Método no permitido", { status: 405, headers: cors() });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Falta la variable de entorno ANTHROPIC_API_KEY en Netlify." }),
      { status: 500, headers: { ...cors(), "content-type": "application/json" } }
    );
  }

  let cuerpo;
  try { cuerpo = await req.json(); } catch { cuerpo = {}; }
  const texto = String(cuerpo.texto ?? "").trim();
  const canalDeclarado = cuerpo.canal ?? null;

  /* Canal fotografía: llega la imagen en base64 desde el navegador. */
  let imagen = null;
  if (cuerpo.imagen && typeof cuerpo.imagen.b64 === "string") {
    const mt = String(cuerpo.imagen.media_type || "image/jpeg");
    if (!/^image\/(jpeg|png|webp)$/.test(mt)) {
      return new Response(JSON.stringify({ error: "Formato de imagen no admitido." }),
        { status: 400, headers: { ...cors(), "content-type": "application/json" } });
    }
    if (cuerpo.imagen.b64.length > 2_800_000) {
      return new Response(JSON.stringify({ error: "La imagen excede el tamaño máximo (2 MB)." }),
        { status: 400, headers: { ...cors(), "content-type": "application/json" } });
    }
    imagen = { b64: cuerpo.imagen.b64.replace(/^data:[^,]+,/, ""), media_type: mt };
  }

  if (!texto && !imagen) {
    return new Response(JSON.stringify({ error: "No llegó texto ni imagen del pedido." }),
      { status: 400, headers: { ...cors(), "content-type": "application/json" } });
  }
  if (texto.length > 20000) {
    return new Response(JSON.stringify({ error: "El texto excede 20 000 caracteres." }),
      { status: 400, headers: { ...cors(), "content-type": "application/json" } });
  }

  const t0 = Date.now();
  const idIntake = `IN-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

  const flujo = new ReadableStream({
    async start(ctrl) {
      const paso = (n, etiqueta, estado, extra = {}) =>
        sse(ctrl, "paso", { n, etiqueta, estado, ms: Date.now() - t0, ...extra });

      try {
        /* 1 · recepción */
        paso(1, "Pedido recibido", "listo", {
          detalle: imagen
            ? `Fotografía (${imagen.media_type}, ${Math.round(imagen.b64.length * 3 / 4 / 1024)} KB)${texto ? " + nota de contexto" : ""}`
            : `${texto.length} caracteres, ${texto.split("\n").length} líneas de texto crudo`,
          id: idIntake
        });

        /* 2 · lectura con modelo */
        paso(2, imagen ? "Leyendo la fotografía con el modelo" : "Leyendo el pedido con el modelo", "corriendo", {
          detalle: `${MODELO} · ${imagen ? "visión + " : ""}salida estructurada contra esquema de ${Object.keys(ESQUEMA.properties).length} campos`
        });

        let extraccion, uso = null, modelo = MODELO, respaldo = false;
        try {
          ({ extraccion, uso, modelo } = await extraer(texto, apiKey, imagen));
        } catch (fallo) {
          /* Red de seguridad para una demostración en vivo: si la API no
             responde, seguimos con la extracción precalculada del ejemplo —
             declarándolo en pantalla, nunca haciéndolo pasar por real. */
          const ej = EJEMPLOS.find((e) => e.id === cuerpo.ejemplo) ||
                     EJEMPLOS.find((e) => e.texto && e.texto.trim() === texto);
          if (!ej || !RESPALDOS[ej.id]) throw fallo;
          extraccion = JSON.parse(JSON.stringify(RESPALDOS[ej.id]));
          respaldo = true;
          paso(2, "Leyendo el pedido con el modelo", "fallo", {
            detalle: `La API no respondió (${String(fallo.message).slice(0, 120)}). Se continúa con la extracción precalculada de este ejemplo.`
          });
        }

        if (canalDeclarado) extraccion.canal = canalDeclarado;

        if (!respaldo) {
          paso(2, "Leyendo el pedido con el modelo", "listo", {
            detalle: `${extraccion.lineas.length} ${extraccion.lineas.length === 1 ? "línea detectada" : "líneas detectadas"} · ${uso.input_tokens} tokens de entrada, ${uso.output_tokens} de salida`,
            modelo
          });
        }
        sse(ctrl, "extraccion", { extraccion, uso, modelo, respaldo });

        /* 3 · emparejamiento y reglas */
        paso(3, "Emparejando contra maestros y aplicando reglas", "corriendo", {
          detalle: `${CLIENTES.length} clientes y ${MATERIALES.length} materiales en el maestro`
        });

        const res = resolver(extraccion);

        paso(3, "Emparejando contra maestros y aplicando reglas", "listo", {
          detalle: res.razon
        });
        sse(ctrl, "resolucion", res);

        /* 4 · grabado */
        const dest = res.cliente ? destinos(res.cliente.pais) : [];
        const documentos = [];

        if (res.decision === "rechazado" || !dest.length) {
          paso(4, "Grabando en los sistemas", "omitido", {
            detalle: "No se graba nada: el pedido no superó las validaciones de cabecera."
          });
        } else {
          paso(4, "Grabando en los sistemas", "corriendo", {
            detalle: `Destinos: ${dest.join(" + ")}`
          });

          for (const sistema of dest) {
            const doc = await siguienteNumero(sistema);
            const payload = sistema === "SAP" ? payloadSAP(res, doc) : payloadERP(res, doc);
            const archivo = sistema === "SAP" ? archivoSAP(res, doc) : archivoINSOFT(res, doc);
            const registro = {
              documento: doc,
              sistema,
              creado: new Date().toISOString(),
              intake: idIntake,
              cliente: { cod: res.cliente.cod, nom: res.cliente.nom, id: res.cliente.id, pais: res.cliente.pais },
              referencia: res.documento.referencia_cliente,
              moneda: res.documento.moneda,
              total: res.total,
              lineas: res.lineas.filter((l) => l.estado === "ok").map((l) => ({
                pos: l.pos, material: l.material.cod, desc: l.material.desc,
                cantidad: l.cantidad, um: l.material.um, precio: l.precio_aplicado,
                iva: l.iva, lote: l.material.lote?.num ?? null, importe: l.importe
              })),
              cirugia: extraccion.cirugia ?? null,
              payload, archivo
            };
            await guardar(`orden/${sistema}/${doc}`, registro);
            documentos.push({ sistema, documento: doc, lineas: registro.lineas.length, total: registro.total, payload, archivo });
          }

          paso(4, "Grabando en los sistemas", "listo", {
            detalle: documentos.map((d) => `${d.sistema} ${d.documento}`).join(" · ")
          });
        }

        /* 5 · cola de excepciones */
        const pendientes = res.lineas.filter((l) => l.estado !== "ok");
        const bloqueosCab = res.incidencias.filter((i) => i.nivel !== "informativo");
        let excepcion = null;

        if (pendientes.length || bloqueosCab.length) {
          excepcion = {
            id: idIntake,
            creado: new Date().toISOString(),
            estado: "abierta",
            cliente: res.cliente ? { cod: res.cliente.cod, nom: res.cliente.nom } : { cod: null, nom: extraccion.cliente?.nombre_detectado ?? "(sin identificar)" },
            referencia: res.documento.referencia_cliente,
            decision: res.decision,
            razon: res.razon,
            incidencias_cabecera: bloqueosCab,
            lineas: pendientes.map((l) => ({
              pos: l.pos, entrada: l.entrada, sugerencia: l.material, score: l.match.score,
              alternativas: l.match.alternativas, incidencias: l.incidencias
            })),
            documentos_generados: documentos.map((d) => ({ sistema: d.sistema, documento: d.documento })),
            texto_original: imagen ? "(fotografía del canal CRM)" : texto
          };
          await guardar(`excepcion/${idIntake}`, excepcion);
          paso(5, "Cola de excepciones", "listo", {
            detalle: `${pendientes.length + bloqueosCab.length} ${pendientes.length + bloqueosCab.length === 1 ? "punto queda" : "puntos quedan"} esperando a una persona`
          });
        } else {
          paso(5, "Cola de excepciones", "omitido", { detalle: "Nada quedó pendiente de revisión humana." });
        }

        /* registro de la recepción, para trazabilidad */
        await guardar(`intake/${idIntake}`, {
          id: idIntake, creado: new Date().toISOString(), canal: extraccion.canal,
          texto: imagen ? "(fotografía del canal CRM — el archivo original queda en el repositorio documental)" : texto,
          extraccion, resolucion: res, respaldo,
          documentos: documentos.map((d) => ({ sistema: d.sistema, documento: d.documento })),
          excepcion: excepcion ? excepcion.id : null,
          ms: Date.now() - t0, modelo
        });

        sse(ctrl, "fin", {
          id: idIntake,
          decision: res.decision,
          documentos,
          excepcion: excepcion ? excepcion.id : null,
          ms: Date.now() - t0,
          almacen: modoAlmacen(),
          respaldo
        });
      } catch (e) {
        sse(ctrl, "error", { mensaje: String(e?.message ?? e) });
      } finally {
        ctrl.close();
      }
    }
  });

  return new Response(flujo, {
    headers: {
      ...cors(),
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "connection": "keep-alive"
    }
  });
};

function cors() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "POST, OPTIONS"
  };
}

export const config = { path: "/api/agente-pedido" };
