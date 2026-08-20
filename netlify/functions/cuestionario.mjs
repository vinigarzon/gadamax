/**
 * Gadamax · Cuestionario técnico Cluster Andino
 *
 * Las respuestas son anónimas: no se pide ni se guarda quién las envió.
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
/* Las respuestas de tipo «Otro, ¿cuál?» llegan como <id>__otro. */
const OTROS = new Set(PREGUNTAS.filter((p) => p.otroEn).map((p) => `${p.id}__otro`));
const aceptada = (k) => IDS.has(k) || OTROS.has(k);
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
    const terminados = todas.filter((r) => r.terminado).length;

    /* Consolidado: por cada pregunta, quién contestó qué. */
    const consolidado = PREGUNTAS.map((p) => ({
      id: p.id,
      seccion: p.seccion,
      critica: Boolean(p.critica),
      pregunta: p.pregunta,
      respuestas: todas
        .filter((r) => r.respuestas?.[p.id] !== undefined && r.respuestas[p.id] !== "" &&
                       !(Array.isArray(r.respuestas[p.id]) && !r.respuestas[p.id].length))
        .map((r) => {
          const fila = { recibido: r.recibido, valor: r.respuestas[p.id] };
          const otro = r.respuestas[`${p.id}__otro`];
          if (otro) fila.otro = otro;
          return fila;
        })
    }));

    const criticasSinResponder = consolidado.filter((c) => c.critica && !c.respuestas.length);

    return json({
      envios: todas.length,
      terminados,
      criticas_pendientes: criticasSinResponder.map((c) => ({ id: c.id, pregunta: c.pregunta })),
      consolidado,
      crudo: todas
    });
  }

  /* ── entrega de las preguntas ───────────────────────────────────────── */
  if (req.method === "GET") {
    return json({ secciones: SECCIONES, preguntas: PREGUNTAS });
  }

  /* ── recepción ──────────────────────────────────────────────────────────
   * El formulario guarda solo, mientras la persona responde. Para que eso no
   * genere decenas de registros, cada navegador manda su propio `sid` y acá
   * se actualiza siempre el mismo registro, fusionando lo que llega con lo
   * que ya había. Así, si alguien cierra la pestaña a la mitad, lo que
   * alcanzó a contestar ya está guardado.
   * ------------------------------------------------------------------- */
  if (req.method === "POST") {
    let cuerpo;
    try { cuerpo = await req.json(); } catch { return json({ error: "No se pudo leer el envío." }, 400); }

    /* trampa para robots: si viene lleno, se descarta en silencio */
    if (limpiar(cuerpo.sitio_web)) return json({ ok: true });

    const sid = /^[A-Za-z0-9_-]{6,40}$/.test(String(cuerpo.sid || "")) ? cuerpo.sid : null;
    if (!sid) return json({ error: "Falta el identificador de la sesión." }, 400);

    const entrantes = {};
    for (const [k, v] of Object.entries(cuerpo.respuestas || {})) {
      if (!aceptada(k)) continue;
      if (Array.isArray(v)) entrantes[k] = v.slice(0, 30).map((x) => limpiar(x, 300));
      else if (v && typeof v === "object") {
        const o = {};
        for (const [ok, ov] of Object.entries(v).slice(0, 30)) o[limpiar(ok, 120)] = limpiar(ov, 120);
        entrantes[k] = o;
      } else entrantes[k] = limpiar(v);
    }

    const previo = (await leer(`respuesta/${sid}`)) || null;
    const respuestas = { ...(previo?.respuestas || {}), ...entrantes };

    /* Lo que se borró en el formulario también se borra acá. */
    for (const k of Object.keys(respuestas)) {
      const v = respuestas[k];
      const vacio = Array.isArray(v) ? !v.length
        : (v && typeof v === "object") ? !Object.keys(v).length
        : !String(v ?? "").trim();
      if (vacio) delete respuestas[k];
    }

    /* El texto de un «Otro» no cuenta como pregunta aparte. */
    const contestadas = Object.entries(respuestas).filter(([k]) => IDS.has(k)).length;

    const registro = {
      id: sid,
      creado: previo?.creado || new Date().toISOString(),
      recibido: new Date().toISOString(),
      terminado: Boolean(cuerpo.final) || Boolean(previo?.terminado),
      contestadas,
      respuestas
    };

    await guardar(`respuesta/${sid}`, registro);
    return json({ ok: true, id: sid, contestadas, guardado: registro.recibido });
  }

  return json({ error: "Método no permitido." }, 405);
};

export const config = { path: "/api/cuestionario" };
