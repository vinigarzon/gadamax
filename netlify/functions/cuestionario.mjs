/**
 * Gadamax · Cuestionario técnico Cluster Andino
 *
 * GET  /api/cuestionario                 → las preguntas, para dibujar el formulario
 * POST /api/cuestionario                 → guarda una respuesta
 * GET  /api/cuestionario?ver=<clave>     → lee todo lo recibido (solo con la clave)
 *
 * Las respuestas se guardan en el mismo almacén que usa el demo de pedidos.
 * La lectura exige la variable de entorno CUESTIONARIO_CLAVE; sin ella el
 * endpoint de lectura queda cerrado, no abierto.
 */

import { guardar, leer, listar } from "../lib/almacen.mjs";
import { SECCIONES, PREGUNTAS } from "../lib/preguntas.mjs";

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
const limpiar = (s, max = 2000) => String(s ?? "").slice(0, max).trim();

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: json({}).headers });

  const url = new URL(req.url);

  /* ── lectura protegida ──────────────────────────────────────────────── */
  const ver = url.searchParams.get("ver");
  if (ver !== null) {
    const clave = process.env.CUESTIONARIO_CLAVE;
    if (!clave) {
      return json({ error: "La lectura está cerrada: falta definir CUESTIONARIO_CLAVE en las variables de entorno." }, 503);
    }
    if (ver !== clave) return json({ error: "Clave incorrecta." }, 403);

    const claves = await listar("respuesta/");
    const todas = (await Promise.all(claves.map((k) => leer(k)))).filter(Boolean);
    todas.sort((a, b) => String(b.recibido).localeCompare(String(a.recibido)));

    /* Consolidado: por cada pregunta, quién contestó qué. */
    const consolidado = PREGUNTAS.map((p) => ({
      id: p.id,
      seccion: p.seccion,
      critica: Boolean(p.critica),
      pregunta: p.pregunta,
      respuestas: todas
        .filter((r) => r.respuestas?.[p.id] !== undefined && r.respuestas[p.id] !== "" &&
                       !(Array.isArray(r.respuestas[p.id]) && !r.respuestas[p.id].length))
        .map((r) => ({ de: r.quien?.nombre || "sin nombre", rol: r.quien?.rol || "", valor: r.respuestas[p.id] }))
    }));

    const criticasSinResponder = consolidado.filter((c) => c.critica && !c.respuestas.length);

    return json({
      envios: todas.length,
      criticas_pendientes: criticasSinResponder.map((c) => ({ id: c.id, pregunta: c.pregunta })),
      consolidado,
      crudo: todas
    });
  }

  /* ── entrega de las preguntas ───────────────────────────────────────── */
  if (req.method === "GET") {
    return json({ secciones: SECCIONES, preguntas: PREGUNTAS });
  }

  /* ── recepción ──────────────────────────────────────────────────────── */
  if (req.method === "POST") {
    let cuerpo;
    try { cuerpo = await req.json(); } catch { return json({ error: "No se pudo leer el envío." }, 400); }

    /* trampa para robots: si viene lleno, se descarta en silencio */
    if (limpiar(cuerpo.sitio_web)) return json({ ok: true });

    const nombre = limpiar(cuerpo?.quien?.nombre, 120);
    if (!nombre) return json({ error: "Falta el nombre de quien responde." }, 400);

    const respuestas = {};
    for (const [k, v] of Object.entries(cuerpo.respuestas || {})) {
      if (!IDS.has(k)) continue;
      if (Array.isArray(v)) respuestas[k] = v.slice(0, 30).map((x) => limpiar(x, 300));
      else if (v && typeof v === "object") {
        const o = {};
        for (const [ok, ov] of Object.entries(v).slice(0, 30)) o[limpiar(ok, 120)] = limpiar(ov, 120);
        respuestas[k] = o;
      } else respuestas[k] = limpiar(v);
    }

    const contestadas = Object.values(respuestas).filter((v) =>
      Array.isArray(v) ? v.length : (v && typeof v === "object" ? Object.keys(v).length : String(v).trim())
    ).length;

    if (!contestadas) return json({ error: "El formulario llegó vacío." }, 400);

    const id = `${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const registro = {
      id,
      recibido: new Date().toISOString(),
      quien: {
        nombre,
        rol: limpiar(cuerpo?.quien?.rol, 120),
        correo: limpiar(cuerpo?.quien?.correo, 160)
      },
      contestadas,
      respuestas
    };

    await guardar(`respuesta/${id}`, registro);
    return json({ ok: true, id, contestadas });
  }

  return json({ error: "Método no permitido." }, 405);
};

export const config = { path: "/api/cuestionario" };
