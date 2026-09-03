/**
 * Gadamax · Contrato de Host (Allison) con firma electrónica
 *
 * GET  /api/contracts/allison              → documento + estado (firmado o no)
 * POST /api/contracts/allison              → registra la firma de la Contratista
 * POST {reiniciar:true, clave}             → borra la firma (solo pruebas; guarda respaldo)
 * GET  /api/contracts/allison?ver=<clave>  → registro completo con evidencia, para Gadamax
 *
 * Mismo mecanismo del NDA: casilla de aceptación expresa, nombre tecleado como
 * firma, y un registro atado a la huella SHA-256 de la versión exacta del texto,
 * con fecha, hora, IP y navegador. Firmado una vez, queda sellado.
 *
 * Clave del panel: CONTRATOS_CLAVE en Netlify; si no existe, usa CUESTIONARIO_CLAVE.
 */

import { createHash } from "node:crypto";
import { guardar, leer } from "../lib/almacen.mjs";
import {
  VERSION, FECHA_VERSION, GADAMAX, CONTRATISTA, TARIFAS, TITULO, PREAMBULO, CLAUSULAS, textoCanonico
} from "../lib/contrato-allison-texto.mjs";

const CLAVE_DOC = "contracts/allison/firma";
const HASH = createHash("sha256").update(textoCanonico(), "utf8").digest("hex");
const claveAdmin = () => process.env.CONTRATOS_CLAVE || process.env.CUESTIONARIO_CLAVE || "";

const json = (dato, status = 200) => new Response(JSON.stringify(dato), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-robots-tag": "noindex, nofollow",
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
  tarifas: TARIFAS,
  gadamax: GADAMAX,
  contratista: CONTRATISTA
});

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: json({}).headers });

  const url = new URL(req.url);
  const firma = await leer(CLAVE_DOC);

  /* ── vista de Gadamax: registro completo con evidencia ─────────────── */
  const ver = url.searchParams.get("ver");
  if (ver !== null) {
    const clave = claveAdmin();
    if (!clave) return json({ error: "Falta definir CONTRATOS_CLAVE (o CUESTIONARIO_CLAVE) en Netlify." }, 503);
    if (ver !== clave) return json({ error: "Clave incorrecta." }, 403);
    return json({ documento: documento(), firmado: Boolean(firma), registro: firma ?? null, hash_actual: HASH });
  }

  /* ── documento + estado ─────────────────────────────────────────────── */
  if (req.method === "GET") {
    return json({ documento: documento(), firmado: Boolean(firma), firma: firma ? publica(firma) : null });
  }

  /* ── firmar ─────────────────────────────────────────────────────────── */
  if (req.method === "POST") {
    let cuerpo;
    try { cuerpo = await req.json(); } catch { return json({ error: "No se pudo leer el envío." }, 400); }

    if (limpiar(cuerpo.sitio_web)) return json({ ok: true });   // trampa para robots

    /* reinicio para pruebas, con la clave del panel */
    if (cuerpo.reiniciar === true) {
      const clave = claveAdmin();
      if (!clave) return json({ error: "Falta definir CONTRATOS_CLAVE." }, 503);
      if (cuerpo.clave !== clave) return json({ error: "Clave incorrecta." }, 403);
      if (firma) await guardar(`contracts/allison/respaldo/${new Date().toISOString().replace(/[:.]/g, "-")}`, firma);
      await guardar(CLAVE_DOC, null);
      return json({ ok: true, reiniciado: true });
    }

    if (firma) return json({ error: "El contrato ya fue firmado.", firmado: true, firma: publica(firma) }, 409);

    const nombre = limpiar(cuerpo.nombre, 120);
    const identificacion = limpiar(cuerpo.identificacion, 60);
    const correo = limpiar(cuerpo.correo, 160);
    const ciudad = limpiar(cuerpo.ciudad, 120);

    if (!nombre) return json({ error: "Falta el nombre completo de quien firma." }, 400);
    if (!correo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) return json({ error: "Falta un correo válido." }, 400);
    if (!ciudad) return json({ error: "Falta la ciudad y país de residencia." }, 400);
    if (cuerpo.acepta !== true) return json({ error: "Debe marcarse la aceptación expresa para firmar." }, 400);
    if (cuerpo.hash !== HASH) {
      return json({ error: "La versión del documento cambió mientras estaba abierto. Recarga la página y vuelve a leerlo." }, 409);
    }

    const ahora = new Date().toISOString();
    const registro = {
      id: `HOST-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      version: VERSION,
      hash: HASH,
      firmado_el: ahora,
      contratista: { nombre, identificacion: identificacion || null, correo, ciudad },
      tarifas: TARIFAS.map((t) => ({ pieza: t.pieza, monto: t.monto, unidad: t.unidad })),
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
        aceptacion: "Casilla de aceptación expresa marcada y nombre tecleado como firma electrónica (E-SIGN Act / UETA / Ley de Comercio Electrónico del Ecuador)."
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
    contratista: r.contratista,
    tarifas: r.tarifas,
    gadamax: r.gadamax
  };
}

export const config = { path: "/api/contracts/allison" };
