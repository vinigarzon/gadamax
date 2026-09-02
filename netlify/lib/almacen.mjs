/**
 * Gadamax · Demo agente de pedidos
 * Almacenamiento del "ERP" simulado.
 *
 * Usa Netlify Blobs: los pedidos que grabe el agente quedan guardados de verdad
 * y siguen ahí cuando se recarga la página o se entra desde otro computador.
 * No es una simulación en memoria del navegador.
 */

import { getStore } from "@netlify/blobs";

/* Respaldo en memoria: solo aplica al correr fuera de Netlify (pruebas locales). */
const memoria = new Map();
let modo = "blobs";

function almacen() {
  try {
    return getStore({ name: "erp-demo", consistency: "strong" });
  } catch {
    modo = "memoria";
    return null;
  }
}

export function modoAlmacen() { return modo; }

export async function guardar(clave, valor) {
  const s = almacen();
  if (!s) { memoria.set(clave, valor); return; }
  try {
    await s.setJSON(clave, valor);
  } catch (e) {
    modo = "memoria";
    memoria.set(clave, valor);
  }
}

export async function leer(clave) {
  const s = almacen();
  if (!s) return memoria.get(clave) ?? null;
  try {
    return await s.get(clave, { type: "json" });
  } catch {
    return memoria.get(clave) ?? null;
  }
}

export async function listar(prefijo) {
  const s = almacen();
  if (!s) return [...memoria.keys()].filter((k) => k.startsWith(prefijo));
  try {
    const { blobs } = await s.list({ prefix: prefijo });
    return blobs.map((b) => b.key);
  } catch {
    return [...memoria.keys()].filter((k) => k.startsWith(prefijo));
  }
}

export async function borrar(clave) {
  const s = almacen();
  if (!s) { memoria.delete(clave); return; }
  try { await s.delete(clave); } catch { memoria.delete(clave); }
}

/**
 * Numeración de documentos. SAP arranca en 4500000001 (rango típico de pedidos
 * de venta) y el ERP de Ecuador usa una serie propia por año.
 */
export async function siguienteNumero(sistema) {
  const clave = "_secuencias";
  const sec = (await leer(clave)) || { SAP: 4500000000, INSOFT: 0 };
  let doc;
  if (sistema === "SAP") {
    sec.SAP += 1;
    doc = String(sec.SAP);
  } else {
    sec.INSOFT = (sec.INSOFT ?? sec.ERP_EC ?? 0) + 1;
    doc = `INS-${new Date().getFullYear()}-${String(sec.INSOFT).padStart(5, "0")}`;
  }
  await guardar(clave, sec);
  return doc;
}
