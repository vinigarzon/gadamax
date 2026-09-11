/**
 * Netlify Function · Almacenamiento del cuestionario colaborativo
 * Ruta pública: /.netlify/functions/cuestionario-banco
 *
 * Guarda las respuestas en Netlify Blobs (almacenamiento incluido en el sitio,
 * sin base de datos externa). Un "documento" por cliente: ?doc=banco (por defecto).
 *
 * Dependencia: en el repo `gadamax` ejecutar una vez   npm install @netlify/blobs
 *
 * Variables de entorno (Netlify → Site configuration → Environment variables):
 *   CUESTIONARIO_CLAVE   ← clave para la vista de administración (?clave=...).
 *                          Si no existe, la vista admin queda desactivada; el
 *                          cuestionario sigue funcionando.
 *
 * Métodos:
 *   GET    ?doc=banco               → { answers:{qid:{v,by,at}}, updated }
 *   GET    ?doc=banco&clave=XXX     → lo mismo + admin:true (la página muestra quién/cuándo y descargas)
 *   POST   {doc,qid,v,by,at}        → fusiona una respuesta (gana la más reciente por `at`)
 *   DELETE ?doc=banco&clave=XXX     → borra el documento (para reiniciar antes de enviarlo al cliente)
 */
import { getStore } from "@netlify/blobs";

const CORS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: CORS });
const limpiarDoc = (d) => (String(d || "banco").replace(/[^a-z0-9-]/gi, "").slice(0, 40) || "banco");

export default async (req) => {
  const url = new URL(req.url);
  const store = getStore("cuestionarios");
  const clave = process.env.CUESTIONARIO_CLAVE || "";

  if (req.method === "GET") {
    const doc = limpiarDoc(url.searchParams.get("doc"));
    const data = (await store.get(doc, { type: "json" })) || { answers: {}, updated: null };
    const esAdmin = !!clave && url.searchParams.get("clave") === clave;
    return json({ doc, answers: data.answers || {}, updated: data.updated, admin: esAdmin });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }
    const doc = limpiarDoc(body.doc);
    const qid = String(body.qid || "").replace(/[^a-z0-9_-]/gi, "").slice(0, 40);
    if (!qid) return json({ error: "qid requerido" }, 400);

    // Sanidad básica del valor: string o {sel, otro}
    let v = body.v;
    if (typeof v === "string") v = v.slice(0, 4000);
    else if (v && typeof v === "object") {
      v = {
        sel: Array.isArray(v.sel) ? v.sel.map((s) => String(s).slice(0, 200)).slice(0, 40) : String(v.sel || "").slice(0, 200),
        otro: String(v.otro || "").slice(0, 1000),
      };
    } else v = "";

    const by = String(body.by || "Sin nombre").slice(0, 80);
    const at = Number(body.at) || Date.now();

    // Lectura → fusión → escritura. Gana la respuesta más reciente.
    const data = (await store.get(doc, { type: "json" })) || { answers: {} };
    data.answers = data.answers || {};
    const prev = data.answers[qid];
    if (!prev || (prev.at || 0) <= at) data.answers[qid] = { v, by, at };
    data.updated = Date.now();
    await store.setJSON(doc, data);
    return json({ ok: true, at: data.updated });
  }

  if (req.method === "DELETE") {
    const doc = limpiarDoc(url.searchParams.get("doc"));
    if (!clave || url.searchParams.get("clave") !== clave) return json({ error: "No autorizado" }, 401);
    await store.delete(doc);
    return json({ ok: true, borrado: doc });
  }

  return json({ error: "Método no permitido" }, 405);
};
