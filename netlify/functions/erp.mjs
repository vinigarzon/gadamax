/**
 * Gadamax · Demo agente de pedidos
 * GET/POST /.netlify/functions/erp
 *
 * Consulta y escritura sobre el "ERP" simulado. Existe para poder demostrar que
 * lo que grabó el agente quedó guardado de verdad: se puede recargar la página,
 * abrir el enlace en otro computador, y los pedidos siguen ahí.
 */

import { leer, listar, guardar } from "../lib/almacen.mjs";
import { MATERIALES, CLIENTES, PARAMETROS } from "../lib/maestros.mjs";

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

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: json({}).headers });

  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "ordenes";

  try {
    /* ── escritura: resolver una excepción ─────────────────────────────── */
    if (req.method === "POST") {
      const cuerpo = await req.json();

      if (cuerpo.accion === "resolver-excepcion") {
        const exc = await leer(`excepcion/${cuerpo.id}`);
        if (!exc) return json({ error: "Excepción no encontrada." }, 404);
        if (exc.estado === "resuelta") return json({ error: "Esa excepción ya fue resuelta." }, 409);

        const decisiones = Array.isArray(cuerpo.decisiones) ? cuerpo.decisiones : [];
        const agregadas = [];

        for (const d of decisiones) {
          if (d.accion !== "asignar") continue;
          const mat = MATERIALES.find((m) => m.cod === d.material);
          const lin = exc.lineas.find((l) => l.pos === d.pos);
          if (!mat || !lin) continue;
          const cantidad = typeof d.cantidad === "number" ? d.cantidad : lin.entrada.cantidad;
          if (!cantidad || cantidad <= 0) continue;
          agregadas.push({
            pos: lin.pos, material: mat.cod, desc: mat.desc,
            cantidad, um: mat.um, precio: mat.precio,
            importe: +(mat.precio * cantidad).toFixed(2),
            origen: "resuelta manualmente"
          });
        }

        /* Las líneas aprobadas se anexan a los documentos ya generados. */
        const tocados = [];
        if (agregadas.length) {
          for (const ref of exc.documentos_generados) {
            const clave = `orden/${ref.sistema}/${ref.documento}`;
            const orden = await leer(clave);
            if (!orden) continue;
            const existentes = new Set(orden.lineas.map((l) => l.pos));
            const nuevas = agregadas.filter((a) => !existentes.has(a.pos));
            if (!nuevas.length) continue;
            orden.lineas.push(...nuevas);
            orden.total = +orden.lineas.reduce((s, l) => s + l.importe, 0).toFixed(2);
            orden.modificado = new Date().toISOString();
            orden.historial = orden.historial || [];
            orden.historial.push({
              fecha: new Date().toISOString(),
              accion: `${nuevas.length} ${nuevas.length === 1 ? "línea añadida" : "líneas añadidas"} tras revisión humana de ${exc.id}`
            });
            await guardar(clave, orden);
            tocados.push({ sistema: ref.sistema, documento: ref.documento, total: orden.total, lineas: orden.lineas.length });
          }
        }

        exc.estado = "resuelta";
        exc.resuelto = new Date().toISOString();
        exc.decisiones = decisiones;
        exc.resultado = { lineas_agregadas: agregadas.length, documentos: tocados };
        await guardar(`excepcion/${cuerpo.id}`, exc);

        return json({ ok: true, excepcion: exc.id, agregadas: agregadas.length, documentos: tocados });
      }

      return json({ error: "Acción no reconocida." }, 400);
    }

    /* ── lecturas ───────────────────────────────────────────────────────── */
    if (q === "maestros") {
      return json({ materiales: MATERIALES, clientes: CLIENTES, parametros: PARAMETROS });
    }

    if (q === "ordenes") {
      const claves = await listar("orden/");
      const ordenes = (await Promise.all(claves.map((k) => leer(k)))).filter(Boolean);
      ordenes.sort((a, b) => String(b.creado).localeCompare(String(a.creado)));
      return json({
        total: ordenes.length,
        ordenes: ordenes.map((o) => ({
          documento: o.documento, sistema: o.sistema, creado: o.creado, modificado: o.modificado ?? null,
          cliente: o.cliente, referencia: o.referencia, moneda: o.moneda,
          total: o.total, lineas: o.lineas.length, intake: o.intake
        }))
      });
    }

    if (q === "orden") {
      const sistema = url.searchParams.get("sistema");
      const doc = url.searchParams.get("doc");
      if (!sistema || !doc) return json({ error: "Faltan los parámetros sistema y doc." }, 400);
      const orden = await leer(`orden/${sistema}/${doc}`);
      return orden ? json(orden) : json({ error: "Documento no encontrado." }, 404);
    }

    if (q === "excepciones") {
      const claves = await listar("excepcion/");
      const excs = (await Promise.all(claves.map((k) => leer(k)))).filter(Boolean);
      excs.sort((a, b) => String(b.creado).localeCompare(String(a.creado)));
      return json({
        total: excs.length,
        abiertas: excs.filter((e) => e.estado === "abierta").length,
        excepciones: excs.map((e) => ({
          id: e.id, creado: e.creado, estado: e.estado, cliente: e.cliente,
          referencia: e.referencia, decision: e.decision, razon: e.razon,
          pendientes: e.lineas.length + (e.incidencias_cabecera?.length || 0)
        }))
      });
    }

    if (q === "excepcion") {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "Falta el parámetro id." }, 400);
      const exc = await leer(`excepcion/${id}`);
      return exc ? json(exc) : json({ error: "Excepción no encontrada." }, 404);
    }

    if (q === "intake") {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "Falta el parámetro id." }, 400);
      const it = await leer(`intake/${id}`);
      return it ? json(it) : json({ error: "Recepción no encontrada." }, 404);
    }

    if (q === "resumen") {
      const [co, ce] = await Promise.all([listar("orden/"), listar("excepcion/")]);
      const ordenes = (await Promise.all(co.map((k) => leer(k)))).filter(Boolean);
      const excs = (await Promise.all(ce.map((k) => leer(k)))).filter(Boolean);
      const intakes = new Set(ordenes.map((o) => o.intake));
      return json({
        pedidos_procesados: intakes.size,
        documentos: ordenes.length,
        documentos_sap: ordenes.filter((o) => o.sistema === "SAP").length,
        documentos_erp_ec: ordenes.filter((o) => o.sistema === "ERP_EC").length,
        lineas: ordenes.reduce((s, o) => s + o.lineas.length, 0),
        excepciones_abiertas: excs.filter((e) => e.estado === "abierta").length,
        excepciones_resueltas: excs.filter((e) => e.estado === "resuelta").length
      });
    }

    return json({ error: `Consulta "${q}" no reconocida.` }, 400);
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 500);
  }
};

export const config = { path: "/api/erp" };
