/**
 * Gadamax · Demo agente de pedidos
 * GET /.netlify/functions/ejemplos — pedidos de muestra para la consola.
 */

import { EJEMPLOS } from "../lib/ejemplos.mjs";

export default async () => new Response(JSON.stringify({ ejemplos: EJEMPLOS }), {
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*"
  }
});

export const config = { path: "/api/ejemplos" };
