/**
 * Gadamax · Demo agente de pedidos
 * Maestros de ejemplo.
 *
 * ESTOS DATOS SON INVENTADOS. El día que el cliente entregue un extracto de sus
 * maestros reales (MARA/KNA1 en SAP, o el equivalente del ERP de Ecuador),
 * este archivo se reemplaza y no cambia una sola línea del motor.
 */

export const MATERIALES = [
  { cod: "MAT-40011", desc: "Aceite vegetal 900 ml",        pres: "caja x12",  um: "CJ", precio: 28.40, stock: 1800, alias: ["aceite 900", "aceite vegetal 900", "aceite girasol 900", "a-900", "ac 900"] },
  { cod: "MAT-40012", desc: "Aceite vegetal 1 L",           pres: "caja x12",  um: "CJ", precio: 31.20, stock: 940,  alias: ["aceite 1 litro", "aceite 1l", "a-1000"] },
  { cod: "MAT-40025", desc: "Arroz extra 5 kg",             pres: "saco",      um: "SC", precio: 21.75, stock: 2400, alias: ["arroz 5k", "arroz extra 5", "arr-5"] },
  { cod: "MAT-40026", desc: "Arroz extra 2 kg",             pres: "funda",     um: "UN", precio: 9.10,  stock: 5100, alias: ["arroz 2k", "arr-2"] },
  { cod: "MAT-40033", desc: "Azúcar blanca 1 kg",           pres: "caja x24",  um: "CJ", precio: 26.80, stock: 1250, alias: ["azucar 1k", "azucar blanca", "az-1"] },
  { cod: "MAT-40041", desc: "Atún lomitos 170 g",           pres: "caja x48",  um: "CJ", precio: 62.50, stock: 610,  alias: ["atun 170", "atun lomitos", "at-170"] },
  { cod: "MAT-40052", desc: "Detergente en polvo 2 kg",     pres: "caja x8",   um: "CJ", precio: 34.10, stock: 780,  alias: ["detergente polvo", "deter polvo 2k", "det-p2"] },
  { cod: "MAT-40053", desc: "Detergente líquido 3 L",       pres: "caja x6",   um: "CJ", precio: 41.90, stock: 430,  alias: ["deter liquido", "detergente liquido 3", "det-l3"] },
  { cod: "MAT-40061", desc: "Jabón de tocador 90 g",        pres: "caja x72",  um: "CJ", precio: 38.60, stock: 1520, alias: ["jabon tocador", "jabon 90", "jb-90"] },
  { cod: "MAT-40074", desc: "Papel higiénico doble hoja",   pres: "paca x12",  um: "PC", precio: 19.40, stock: 2050, alias: ["papel higienico", "papel doble hoja", "ph doble hoja", "ph-12"] },
  { cod: "MAT-40088", desc: "Fideo espagueti 400 g",        pres: "caja x20",  um: "CJ", precio: 17.25, stock: 3300, alias: ["fideo 400", "espagueti 400", "tallarin 400", "fd-400"] },
  { cod: "MAT-40095", desc: "Café molido 340 g",            pres: "caja x12",  um: "CJ", precio: 74.80, stock: 290,  alias: ["cafe molido", "cafe 340", "cf-340"] },
  { cod: "MAT-40102", desc: "Leche entera UHT 1 L",         pres: "caja x12",  um: "CJ", precio: 15.90, stock: 4200, alias: ["leche uht", "leche entera 1l", "lc-1"] },
  { cod: "MAT-40118", desc: "Harina de trigo 1 kg",         pres: "caja x25",  um: "CJ", precio: 22.30, stock: 1680, alias: ["harina 1k", "harina trigo", "hr-1"] }
];

export const CLIENTES = [
  { cod: "CL-1001", nom: "Comercial Vega Cía. Ltda.",       id: "1791122334001", pais: "Ecuador",  org: "EC01", cond: "30 días", moneda: "USD", cupo: 120000, saldo:  38400, bloqueado: false },
  { cod: "CL-1002", nom: "Supermercados Andinos S.A.S.",    id: "900123456-7",   pais: "Colombia", org: "CO01", cond: "45 días", moneda: "COP", cupo: 900000000, saldo: 240000000, bloqueado: false },
  { cod: "CL-1003", nom: "Ferretería Los Andes S.A.",       id: "0991234567001", pais: "Ecuador",  org: "EC01", cond: "contado", moneda: "USD", cupo:  15000, saldo:  14200, bloqueado: false },
  { cod: "CL-1004", nom: "Distribuciones Caribe S.A.S.",    id: "901987654-3",   pais: "Colombia", org: "CO01", cond: "30 días", moneda: "COP", cupo: 300000000, saldo: 296000000, bloqueado: false },
  { cod: "CL-1005", nom: "Mayorista del Pacífico Cía. Ltda.", id: "0992345678001", pais: "Ecuador", org: "EC01", cond: "60 días", moneda: "USD", cupo:  90000, saldo:  11500, bloqueado: false },
  { cod: "CL-1006", nom: "Autoservicios El Rosado del Sur S.A.", id: "0993456789001", pais: "Ecuador", org: "EC01", cond: "30 días", moneda: "USD", cupo: 45000, saldo: 44100, bloqueado: true }
];

/**
 * Los precios del maestro están en USD. Cada cliente compra en su moneda, así
 * que la lista se convierte antes de comparar contra lo que pidió el cliente.
 * Sin esto, un pedido colombiano en pesos se compara contra dólares y todo se
 * bloquea por "precio fuera de rango".
 */
export const TASAS = { USD: 1, COP: 4100 };
export const DECIMALES = { USD: 2, COP: 0 };

export function precioEn(precioUSD, moneda) {
  const tasa = TASAS[moneda] ?? 1;
  const dec = DECIMALES[moneda] ?? 2;
  return +(precioUSD * tasa).toFixed(dec);
}

/** Parámetros de negocio. Cambiarlos aquí cambia el comportamiento de todo el motor. */
export const PARAMETROS = {
  umbral_carga:        0.72,  // ≥ esto entra solo
  umbral_revision:     0.42,  // entre revisión y carga: cola humana
  desvio_precio_avisa: 0.05,  // 5 % de diferencia contra lista: advertencia
  desvio_precio_frena: 0.15,  // 15 %: bloquea la línea
  lead_time_dias:      2,     // entrega mínima razonable
  tolerancia_cupo:     0.00   // sin colchón: pasarse del cupo bloquea
};
