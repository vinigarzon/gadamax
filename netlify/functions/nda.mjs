/**
 * Gadamax · NDA con firma electrónica
 *
 * GET  /api/nda               → documento + estado (firmado o no)
 * POST /api/nda               → registra la firma de la Contraparte
 * POST {reiniciar, clave}     → borra la firma (solo pruebas; guarda respaldo)
 * GET  /api/nda?ver=<clave>   → registro completo, para Gadamax
 *
 * Lo que hace válida la firma (E-SIGN Act / UETA): la intención declarada con
 * una casilla expresa, el nombre tecleado como firma, y un registro que ata
 * todo a la versión exacta del documento mediante su huella SHA-256, con fecha,
 * hora, IP y navegador. Firmada una vez, el documento queda sellado: cualquier
 * intento posterior devuelve el ejecutado, no una segunda firma.
 */

import { createHash } from "node:crypto";
import { guardar, leer } from "../lib/almacen.mjs";
import { VERSION, FECHA_VERSION, GADAMAX, TITULO, PREAMBULO, CLAUSULAS, textoCanonico } from "../lib/nda-texto.mjs";

const CLAVE_DOC = "nda/firma";
const HASH = createHash("sha256").update(textoCanonico(), "utf8").digest("hex");

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

const limpiar = (s, max = 200) => String(s ?? "").slice(0, max).trim();

const documento = () => ({
  titulo: TITULO,
  version: VERSION,
  fecha_version: FECHA_VERSION,
  hash: HASH,
  preambulo: PREAMBULO,
  clausulas: CLAUSULAS,
  gadamax: GADAMAX
});

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: json({}).headers });

  const url = new URL(req.url);
  const firma = await leer(CLAVE_DOC);

  /* ── vista de Gadamax ───────────────────────────────────────────────── */
  const ver = url.searchParams.get("ver");
  if (ver !== null) {
    const clave = process.env.CUESTIONARIO_CLAVE;
    if (!clave) return json({ error: "Falta definir CUESTIONARIO_CLAVE." }, 503);
    if (ver !== clave) return json({ error: "Clave incorrecta." }, 403);
    return json({ firmado: Boolean(firma), registro: firma ?? null, hash_actual: HASH });
  }

  /* ── documento + estado ─────────────────────────────────────────────── */
  if (req.method === "GET") {
    return json({
      documento: documento(),
      firmado: Boolean(firma),
      firma: firma ? publica(firma) : null
    });
  }

  /* ── firmar ─────────────────────────────────────────────────────────── */
  if (req.method === "POST") {
    let cuerpo;
    try { cuerpo = await req.json(); } catch { return json({ error: "No se pudo leer el envío." }, 400); }

    if (limpiar(cuerpo.sitio_web)) return json({ ok: true });   // trampa para robots

    /* reinicio para pruebas, con la clave del panel */
    if (cuerpo.reiniciar === true) {
      const clave = process.env.CUESTIONARIO_CLAVE;
      if (!clave) return json({ error: "Falta definir CUESTIONARIO_CLAVE." }, 503);
      if (cuerpo.clave !== clave) return json({ error: "Clave incorrecta." }, 403);
      if (firma) await guardar(`nda/respaldo/${new Date().toISOString().replace(/[:.]/g, "-")}`, firma);
      await guardar(CLAVE_DOC, null);
      return json({ ok: true, reiniciado: true });
    }

    if (firma) {
      return json({ error: "El acuerdo ya fue firmado.", firmado: true, firma: publica(firma) }, 409);
    }

    const empresa = limpiar(cuerpo.empresa);
    const nombre = limpiar(cuerpo.nombre, 120);
    const cargo = limpiar(cuerpo.cargo, 120);
    const correo = limpiar(cuerpo.correo, 160);
    const identificacion = limpiar(cuerpo.identificacion, 60);

    if (!empresa) return json({ error: "Falta la razón social de la empresa." }, 400);
    if (!nombre) return json({ error: "Falta el nombre de quien firma." }, 400);
    if (!cargo) return json({ error: "Falta el cargo de quien firma." }, 400);
    if (!correo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) return json({ error: "Falta un correo válido." }, 400);
    if (cuerpo.acepta !== true) return json({ error: "Debe marcarse la aceptación expresa para firmar." }, 400);
    if (cuerpo.hash !== HASH) {
      return json({ error: "La versión del documento cambió mientras estaba abierto. Recarguen la página y vuelvan a leerlo." }, 409);
    }

    const ahora = new Date().toISOString();
    const registro = {
      id: `NDA-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      version: VERSION,
      hash: HASH,
      firmado_el: ahora,
      contraparte: { empresa, identificacion: identificacion || null, nombre, cargo, correo },
      gadamax: {
        razon: GADAMAX.razon,
        firmante: GADAMAX.firmante,
        cargo: GADAMAX.cargo,
        correo: GADAMAX.correo,
        /* Contrafirma registrada automáticamente al momento de la suscripción,
           por instrucción previa y expresa del firmante de Gadamax. */
        firmado_el: ahora
      },
      evidencia: {
        ip: req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || null,
        navegador: limpiar(req.headers.get("user-agent"), 300) || null,
        aceptacion: "Casilla de aceptación expresa marcada y nombre tecleado como firma electrónica (E-SIGN Act / UETA)."
      }
    };

    await guardar(CLAVE_DOC, registro);
    return json({ ok: true, firmado: true, firma: publica(registro) });
  }

  return json({ error: "Método no permitido." }, 405);
};

/** Lo que ve cualquiera con el enlace una vez firmado: sin IP ni navegador. */
function publica(r) {
  return {
    id: r.id,
    version: r.version,
    hash: r.hash,
    firmado_el: r.firmado_el,
    contraparte: r.contraparte,
    gadamax: r.gadamax
  };
}

export const config = { path: "/api/nda" };
