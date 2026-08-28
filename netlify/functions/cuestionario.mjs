/**
 * Gadamax · Cuestionario técnico B. Braun
 *
 * Trabajo colaborativo sobre un mismo documento: todas las personas a las que
 * se les pasó el enlace ven y completan el mismo formulario. No hay copias por
 * persona ni identidad — lo que importa es que la respuesta esté, no quién la dio.
 *
 * GET  /api/cuestionario              → preguntas + respuestas actuales + versión
 * GET  /api/cuestionario?solo=estado  → solo el estado, para consultar cambios
 * POST /api/cuestionario              → aplica un parche y devuelve el estado
 * POST {reiniciar:true, clave}        → deja el cuestionario en blanco
 * GET  /api/cuestionario?ver=<clave>  → vista de Gadamax, con sellos de tiempo
 *
 * Cada respuesta se guarda sola mientras la persona contesta, y el navegador
 * pregunta cada pocos segundos si alguien más cambió algo. Se envía solo lo que
 * cambió —nunca el formulario entero— para que nadie pise el trabajo de otro.
 */

import { guardar, leer } from "../lib/almacen.mjs";
import { SECCIONES, PREGUNTAS } from "../lib/preguntas.mjs";

const CLAVE_DOC = "estado/cuestionario";

const json = (dato, status = 200) => new Response(JSON.stringify(dato), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "GET, POST, OPTIONS"
  }
});

const IDS = new Set(PREGUNTAS.map((p) => p.id));
const OTROS = new Set(PREGUNTAS.filter((p) => p.otroEn).map((p) => `${p.id}__otro`));
const aceptada = (k) => IDS.has(k) || OTROS.has(k);
const limpiar = (s, max = 2000) => String(s ?? "").slice(0, max).trim();

const vacio = (v) =>
  Array.isArray(v) ? !v.length
  : (v && typeof v === "object") ? !Object.keys(v).length
  : !String(v ?? "").trim();

const nuevoDoc = () => ({
  version: 0,
  creado: new Date().toISOString(),
  actualizado: null,
  terminado: false,
  respuestas: {},
  sellos: {}
});

const cargar = async () => (await leer(CLAVE_DOC)) || nuevoDoc();

/** Lo que ve el formulario. */
const paraTodos = (doc) => ({
  version: doc.version,
  actualizado: doc.actualizado,
  terminado: doc.terminado,
  respuestas: doc.respuestas
});

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: json({}).headers });

  const url = new URL(req.url);

  /* ── vista de Gadamax, con clave ────────────────────────────────────── */
  const ver = url.searchParams.get("ver");
  if (ver !== null) {
    const clave = process.env.CUESTIONARIO_CLAVE;
    if (!clave) return json({ error: "La lectura está cerrada: falta definir CUESTIONARIO_CLAVE en las variables de entorno." }, 503);
    if (ver !== clave) return json({ error: "Clave incorrecta." }, 403);

    const doc = await cargar();
    const consolidado = PREGUNTAS.map((p) => ({
      id: p.id,
      seccion: p.seccion,
      critica: Boolean(p.critica),
      pregunta: p.pregunta,
      valor: doc.respuestas[p.id] ?? null,
      otro: doc.respuestas[`${p.id}__otro`] ?? null,
      respondida: !vacio(doc.respuestas[p.id]),
      sello: doc.sellos[p.id] ?? null
    }));

    return json({
      version: doc.version,
      creado: doc.creado,
      archivado: Boolean(doc.archivado),
      actualizado: doc.actualizado,
      terminado: doc.terminado,
      total: PREGUNTAS.length,
      respondidas: consolidado.filter((c) => c.respondida).length,
      criticas_pendientes: consolidado.filter((c) => c.critica && !c.respondida)
        .map((c) => ({ id: c.id, pregunta: c.pregunta })),
      consolidado
    });
  }

  /* ── estado para el formulario ──────────────────────────────────────── */
  if (req.method === "GET") {
    const doc = await cargar();
    /* Dado de baja: el enlace ya no muestra preguntas ni respuestas. */
    if (doc.archivado) {
      return json({ archivado: true, fecha: doc.actualizado || doc.creado, version: doc.version });
    }
    /* Con ?solo=estado se consulta si hubo cambios sin volver a bajar las
       preguntas, que no cambian nunca. */
    if (url.searchParams.get("solo") === "estado") return json(paraTodos(doc));
    return json({ secciones: SECCIONES, preguntas: PREGUNTAS, ...paraTodos(doc) });
  }

  /* ── parche ─────────────────────────────────────────────────────────── */
  if (req.method === "POST") {
    let cuerpo;
    try { cuerpo = await req.json(); } catch { return json({ error: "No se pudo leer el envío." }, 400); }

    if (limpiar(cuerpo.sitio_web)) return json({ ok: true });   // trampa para robots

    /* ── reinicio, solo desde el panel de Gadamax ─────────────────────
     * Antes de vaciar se guarda una copia con la fecha, por si alguna vez
     * hace falta recuperar algo que se borró por error. */
    if (cuerpo.reiniciar === true) {
      const clave = process.env.CUESTIONARIO_CLAVE;
      if (!clave) return json({ error: "Falta definir CUESTIONARIO_CLAVE." }, 503);
      if (cuerpo.clave !== clave) return json({ error: "Clave incorrecta." }, 403);

      const anterior = await cargar();
      const habia = Object.keys(anterior.respuestas || {}).length;
      if (habia) {
        await guardar(`respaldo/${new Date().toISOString().replace(/[:.]/g, "-")}`, anterior);
      }
      const limpio = nuevoDoc();
      limpio.version = (anterior.version || 0) + 1;   // los formularios abiertos lo notan
      await guardar(CLAVE_DOC, limpio);
      return json({ ok: true, reiniciado: true, respaldadas: habia, ...paraTodos(limpio) });
    }

    const doc = await cargar();

    /* Dar de baja o reabrir, solo desde el panel de Gadamax. */
    if (typeof cuerpo.archivar === "boolean") {
      const clave = process.env.CUESTIONARIO_CLAVE;
      if (!clave || cuerpo.clave !== clave) return json({ error: "Clave incorrecta." }, 403);
      doc.archivado = cuerpo.archivar;
      doc.version = (doc.version || 0) + 1;
      await guardar(CLAVE_DOC, doc);
      return json({ ok: true, archivado: doc.archivado });
    }

    /* Dado de baja, el formulario ya no acepta cambios. */
    if (doc.archivado) {
      return json({ archivado: true, error: "El cuestionario fue cerrado y ya no acepta cambios." }, 409);
    }

    const ahora = new Date().toISOString();
    let cambios = 0;

    for (const [k, v] of Object.entries(cuerpo.parche || {})) {
      if (!aceptada(k)) continue;

      let valor;
      if (Array.isArray(v)) valor = v.slice(0, 30).map((x) => limpiar(x, 300));
      else if (v && typeof v === "object") {
        valor = {};
        for (const [ok, ov] of Object.entries(v).slice(0, 30)) valor[limpiar(ok, 120)] = limpiar(ov, 120);
      } else valor = limpiar(v);

      const nuevo = vacio(valor) ? null : valor;
      if (JSON.stringify(doc.respuestas[k] ?? null) === JSON.stringify(nuevo)) continue;

      if (nuevo === null) { delete doc.respuestas[k]; delete doc.sellos[k]; }
      else { doc.respuestas[k] = nuevo; doc.sellos[k] = ahora; }
      cambios++;
    }

    if (typeof cuerpo.terminado === "boolean" && cuerpo.terminado !== doc.terminado) {
      doc.terminado = cuerpo.terminado;
      cambios++;
    }

    if (cambios) {
      doc.version = (doc.version || 0) + 1;
      doc.actualizado = ahora;
      await guardar(CLAVE_DOC, doc);
    }

    return json({ ok: true, cambios, ...paraTodos(doc) });
  }

  return json({ error: "Método no permitido." }, 405);
};

export const config = { path: "/api/cuestionario" };
