/**
 * Gadamax · Demo agente de pedidos · v2 "supuestos complejos"
 * Maestros de trabajo construidos desde la estructura REAL de los pedidos de
 * B. Braun (cluster andino), con datos 100 % SINTÉTICOS.
 *
 * Las referencias de producto son referencias públicas de catálogo B. Braun
 * (Omnifix, Pencan, Vasofix, Introcan, Infusomat…) tal como aparecen en las
 * órdenes de compra de la muestra. Los clientes, RUC/NIT, precios, cupos,
 * lotes y condiciones son inventados: nada de este archivo proviene de
 * información confidencial. El día que el cliente entregue extractos reales
 * (MARA/KNA1 de SAP, maestros de INSOFT), se reemplaza este archivo y no
 * cambia una sola línea del motor.
 */

export const MATERIALES = [
  { cod: "4617509F",   desc: "Jeringa Omnifix 50 ml Luer Lock",                    pres: "caja x100", um: "CJ", precio: 60.50,  stock: 240,  iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2019DM-0019876", EC: "ARCSA 04531-DM" }, cum: "20099324-1", lote: { num: "26G1147", vence: "2028-11-30" },
    alias: ["jeringa omnifix 50", "omnifix 50 ml", "jeringa 50ml luer", "jeringa omnifix"] },
  { cod: "4502051",    desc: "Aguja Pencan G-27 x 3 1/2\" (0.42 x 88 mm) con introductor", pres: "caja x25", um: "CJ", precio: 168.80, stock: 96, iva: { EC: 0, CO: 0 }, registro: { CO: "INVIMA 2020DM-0021341", EC: "ARCSA 05112-DM" }, cum: "20104417-3", lote: { num: "26F0233", vence: "2029-04-30" },
    alias: ["pencan 27", "pencan no 27", "pencan g27", "aguja pencan g-27", "pencan 27 x 3 1/2"] },
  { cod: "4502043",    desc: "Aguja Pencan G-25 x 3 1/2\" (0.53 x 88 mm) con introductor", pres: "caja x25", um: "CJ", precio: 168.80, stock: 44, iva: { EC: 0, CO: 0 }, registro: { CO: "INVIMA 2020DM-0021341", EC: "ARCSA 05112-DM" }, cum: "20104417-1", lote: { num: "26D0918", vence: "2029-01-31" },
    alias: ["pencan 25", "pencan g25", "aguja pencan 25"] },
  { cod: "4509900",    desc: "Aguja espinal Spinocan G-20 x 3 1/2\" (88 mm)",       pres: "caja x25",  um: "CJ", precio: 90.60,  stock: 130, iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2018DM-0017732", EC: "ARCSA 03987-DM" }, cum: "20087215-2", lote: { num: "26E1502", vence: "2028-08-31" },
    alias: ["spinocan 20", "espinocan 20", "aguja espinocan #20", "spinocan g-20"] },
  { cod: "4503902",    desc: "Aguja espinal Spinocan G-22 x 3 1/2\" (88 mm)",       pres: "caja x25",  um: "CJ", precio: 89.30,  stock: 85,  iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2018DM-0017732", EC: "ARCSA 03987-DM" }, cum: "20087215-4", lote: { num: "26C0771", vence: "2028-06-30" },
    alias: ["spinocan 22", "espinocan 22", "aguja espinocan #22", "espinocan no 22"] },
  { cod: "4894260",    desc: "Cánula Stimuplex G-21 x 100 mm bisel 30° para plexos", pres: "caja x25", um: "CJ", precio: 405.00, stock: 18,  iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2021DM-0024118", EC: "ARCSA 05873-DM" }, cum: "20112264-1", lote: { num: "26B0405", vence: "2027-12-31" },
    alias: ["stimuplex canula", "stimuplex g21", "canula stimuplex 100"] },
  { cod: "4892505-04", desc: "Aguja Stimuplex Ultra 360° G-22 x 2\" (0.7 x 50 mm)",  pres: "caja x25", um: "CJ", precio: 388.00, stock: 12,  iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2021DM-0024118", EC: "ARCSA 05873-DM" }, cum: "20112264-5", lote: { num: "25L1980", vence: "2027-03-31" },
    alias: ["stimuplex ultra 22", "stimuplex ultra 360 22g", "aguja stimuplex ultra"] },
  { cod: "4251342",    desc: "Catéter IV Introcan Certo G-18 x 1 1/4\" poliuretano", pres: "caja x50",  um: "CJ", precio: 26.10,  stock: 380, iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2017DM-0015540", EC: "ARCSA 03214-DM" }, cum: "20076651-3", lote: { num: "26G0092", vence: "2029-06-30" },
    alias: ["introcan certo 18", "introcan g18", "cateter introcan 18"] },
  { cod: "4268113S",   desc: "Catéter IV de seguridad Vasofix Safety G-18",          pres: "caja x50",  um: "CJ", precio: 34.00,  stock: 520, iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2019DM-0018997", EC: "ARCSA 04102-DM" }, cum: "20095513-2", lote: { num: "26F1730", vence: "2029-02-28" },
    alias: ["vasocan 18", "vasocan #18", "vasofix 18", "cathlon simple no 18", "cateter 18 seguridad", "cateter intravenoso 18g de seguridad"] },
  { cod: "4268213S",   desc: "Catéter IV de seguridad Vasofix Safety G-22",          pres: "caja x50",  um: "CJ", precio: 34.00,  stock: 610, iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2019DM-0018997", EC: "ARCSA 04102-DM" }, cum: "20095513-4", lote: { num: "26F1731", vence: "2029-02-28" },
    alias: ["vasocan 22", "vasocan #22", "vasofix 22", "cathlon simple no 22", "cateter 22 seguridad", "cateter intravenoso 22g de seguridad"] },
  { cod: "4268063S",   desc: "Catéter IV de seguridad Vasofix Safety G-24",          pres: "caja x50",  um: "CJ", precio: 34.80,  stock: 95,  iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2019DM-0018997", EC: "ARCSA 04102-DM" }, cum: "20095513-6", lote: { num: "26A0518", vence: "2028-10-31" },
    alias: ["vasocan 24", "vasocan #24", "cathlon simple no 24", "vasofix 24", "cateter intravenoso 24g de seguridad"] },
  { cod: "400400",     desc: "Prontosan solución para irrigación de heridas 350 ml", pres: "frasco",   um: "UN", precio: 18.70,  stock: 800, iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2016DM-0014215", EC: "ARCSA 02876-DM" }, cum: "20068821-1", lote: { num: "26E0644", vence: "2028-05-31" },
    alias: ["prontosan 350", "prontosan solucion", "solucion prontosan"] },
  { cod: "8700128SP",  desc: "Equipo Infusomat Space Line fotosensible",             pres: "unidad",   um: "UN", precio: 6.20,   stock: 1400, iva: { EC: 0, CO: 0 }, registro: { CO: "INVIMA 2020DM-0022810", EC: "ARCSA 05340-DM" }, cum: "20107733-2", lote: { num: "26G0233", vence: "2029-05-31" },
    alias: ["infusomat fotosensible", "equipo infusomat fotosensible", "linea fotosensible infusomat"] },
  { cod: "8700130SP",  desc: "Equipo Infusomat Space Line SafeSet PUR",              pres: "unidad",   um: "UN", precio: 5.10,   stock: 2600, iva: { EC: 0, CO: 0 }, registro: { CO: "INVIMA 2020DM-0022810", EC: "ARCSA 05340-DM" }, cum: "20107733-4", lote: { num: "26G0234", vence: "2029-05-31" },
    alias: ["infusomat safeset", "equipo sencillo infusomat", "space line safeset"] },
  { cod: "8700141SP",  desc: "Bureta Infusomat Dosifix Neutrapur 150 ml",            pres: "unidad",   um: "UN", precio: 7.40,   stock: 420, iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2020DM-0022810", EC: "ARCSA 05340-DM" }, cum: "20107733-6", lote: { num: "26D1109", vence: "2028-12-31" },
    alias: ["bureta dosifix", "bureta infusomat", "dosifix neutrapur"] },
  { cod: "4037011",    desc: "Microgotero Dosifix con cámara graduada",              pres: "unidad",   um: "UN", precio: 3.90,   stock: 900, iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2018DM-0016654", EC: "ARCSA 03555-DM" }, cum: "20081190-1", lote: { num: "26F0810", vence: "2029-01-31" },
    alias: ["microgotero dosifix", "microgotero braun", "dosifix microgotero"] },
  { cod: "16500C",     desc: "Llave de 3 vías Discofix C-3",                         pres: "unidad",   um: "UN", precio: 1.20,   stock: 5200, iva: { EC: 0, CO: 0 }, registro: { CO: "INVIMA 2015DM-0012238", EC: "ARCSA 02310-DM" }, cum: "20055102-1", lote: { num: "26G1901", vence: "2029-08-31" },
    alias: ["discofix c3", "llave 3 vias", "llave de tres vias braun"] },
  { cod: "8722935",    desc: "Extensión para bomba Perfusor 150 cm",                 pres: "unidad",   um: "UN", precio: 2.80,   stock: 1100, iva: { EC: 0, CO: 0 }, registro: { CO: "INVIMA 2019DM-0019233", EC: "ARCSA 04466-DM" }, cum: "20096420-1", lote: { num: "26E1288", vence: "2028-09-30" },
    alias: ["extension perfusor", "equipo para perfusor 150", "extension de perfusor"] },
  { cod: "8728810",    desc: "Jeringa para bomba Perfusor 50 ml con aguja",          pres: "unidad",   um: "UN", precio: 8.60,   stock: 750, iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2019DM-0019233", EC: "ARCSA 04466-DM" }, cum: "20096420-3", lote: { num: "26F0466", vence: "2028-11-30" },
    alias: ["set perfusor 50", "jeringa perfusor 50 ml", "perfusor 50"] },
  { cod: "4899109",    desc: "Kit de anestesia epidural Perifix G-18 con filtro",    pres: "unidad",   um: "UN", precio: 21.20,  stock: 260, iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2021DM-0023904", EC: "ARCSA 05611-DM" }, cum: "20110877-1", lote: { num: "26C1350", vence: "2028-02-29" },
    alias: ["kit epidural 18", "perifix 18", "kit de anestesia epidural 18ga con filtro"] },
  { cod: "1069810",    desc: "Lyoplant matriz de reparación de duramadre 7,5 x 7,5 cm", pres: "unidad", um: "UN", precio: 391.50, stock: 6, iva: { EC: 0, CO: 0 }, registro: { CO: "INVIMA 2022DM-0026451", EC: "ARCSA 06122-DM" }, cum: "20118809-1", lote: { num: "25K0087", vence: "2027-02-28" },
    alias: ["lyoplant", "matriz duramadre", "matriz de reparacion de duramadre"] },
  { cod: "C0121401",   desc: "Sutura Monomax HR48 monofilamento absorbible",         pres: "sobre",    um: "UN", precio: 9.80,   stock: 340, iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2020DM-0022107", EC: "ARCSA 05018-DM" }, cum: "20106112-1", lote: { num: "26B0929", vence: "2028-04-30" },
    alias: ["monomax hr48", "sutura monomax", "monomax sobre"] },
  { cod: "3538squ",    desc: "Propofol 1 % B. Braun emulsión inyectable 20 ml",      pres: "caja x5",  um: "CJ", precio: 12.40,  stock: 480, iva: { EC: 0, CO: 0 },  registro: { CO: "INVIMA 2019M-0011223", EC: "ARCSA 917-MEE" }, cum: "19962331-2", lote: { num: "26F1015", vence: "2027-11-30" },
    alias: ["propofol 1%", "propofol braun", "propofol 20 ml"] },
  { cod: "P011401",    desc: "Etiqueta en rollo papel continuo clase 1 x 2000",      pres: "rollo",    um: "UN", precio: 174.00, stock: 40,  iva: { EC: 15, CO: 19 }, registro: { CO: "N/A", EC: "N/A" }, cum: null, lote: { num: "26A0001", vence: "2031-12-31" },
    alias: ["etiqueta rollo papel continuo", "rollo etiquetas clase 1"] }
];

/**
 * Clientes sintéticos, calcados de los PERFILES reales de la muestra:
 * distribuidor con OC formal (códigos propios), hospital estatal con contrato
 * (exigencias de lote y caducidad), clínicas privadas de correo libre y
 * WhatsApp, y el hospital del canal CRM con tarjetas de cirugía.
 *
 * `codigos`     : tabla código-del-cliente → referencia B. Braun (respuesta E?)
 * `contrato`    : precios pactados por referencia, EN LA MONEDA del cliente.
 * `exigencias`  : reglas de recepción del cliente (caducidad mínima, lotes).
 */
export const CLIENTES = [
  {
    cod: "CL-3001", nom: "Clínica Santa Amalia S.A.", id: "1791845632001",
    pais: "Ecuador", org: "EC01", cond: "30 días", moneda: "USD",
    cupo: 80000, saldo: 21500, bloqueado: false,
    codigos: {}, contrato: null, exigencias: null,
    nota: "Pedidos por correo en texto libre, con nombres coloquiales de producto."
  },
  {
    cod: "CL-3002", nom: "Biociencia Andina S.A.S.", id: "800654321-9",
    pais: "Colombia", org: "CO01", cond: "45 días", moneda: "COP",
    cupo: 900000000, saldo: 312000000, bloqueado: false,
    codigos: {
      "6872": "4617509F", "9885": "4502051", "9891": "4502043",
      "1130": "4509900",  "1134": "4503902", "3892": "4894260",
      "1240": "4251342",  "9682": "4892505-04"
    },
    contrato: null, exigencias: null,
    nota: "Distribuidor. OC formal con doble código: el suyo y la referencia B. Braun."
  },
  {
    cod: "CL-3003", nom: "E.S.E. Hospital Regional del Norte", id: "890112233-1",
    pais: "Colombia", org: "CO01", cond: "60 días", moneda: "COP",
    cupo: 600000000, saldo: 95000000, bloqueado: false,
    codigos: {
      "MQ01C0091": "4268113S", "MQ01C0093": "4268213S", "MQ01C0094": "4268063S",
      "MQ01E0036": "8728810",  "MQ01A0112": "400400",   "MQ01K0025": "4899109",
      "MQ33ICD2": "1069810",   "P011401":   "P011401"
    },
    contrato: {
      id: "CE-2026-118", vigencia: "2026-12-31",
      precios: {
        "4268113S": 137000, "4268213S": 137000, "4268063S": 140000,
        "8728810": 35100,   "400400": 76570,    "4899109": 86840,
        "1069810": 1605300, "P011401": 713500
      }
    },
    exigencias: { vida_util_min_meses: 15, max_lotes: 2, cert_lote: true },
    nota: "Contrato estatal: precios pactados, caducidad mínima 15 meses, máximo 2 lotes por ítem, certificado de calidad por lote."
  },
  {
    cod: "CL-3004", nom: "VidaSalud Specialty Care S.A.", id: "1792233445001",
    pais: "Ecuador", org: "EC01", cond: "contado", moneda: "USD",
    cupo: 15000, saldo: 13800, bloqueado: false,
    codigos: {}, contrato: null,
    exigencias: { vida_util_min_meses: 12, max_lotes: null, cert_lote: false },
    nota: "Política de recepción: caducidad mayor a un año; si un lote no cumple, notificar antes de despachar."
  },
  {
    cod: "CL-3005", nom: "Clínica del Austro Cía. Ltda.", id: "0190456789001",
    pais: "Ecuador", org: "EC01", cond: "30 días", moneda: "USD",
    cupo: 40000, saldo: 8200, bloqueado: false,
    codigos: {}, contrato: null, exigencias: null,
    nota: "Pide por WhatsApp, sin códigos y con apuro."
  },
  {
    cod: "CL-3006", nom: "Hospital San Gregorio de los Andes", id: "1790998877001",
    pais: "Ecuador", org: "EC01", cond: "45 días", moneda: "USD",
    cupo: 120000, saldo: 34600, bloqueado: false,
    codigos: {}, contrato: null, exigencias: null,
    comodato: true,
    nota: "Canal CRM: tarjetas de control de cirugías fotografiadas. Reposición de consumo en comodato."
  }
];

/**
 * Los precios del maestro están en USD. Cada cliente compra en su moneda, así
 * que la lista se convierte antes de comparar contra lo que pidió el cliente.
 */
export const TASAS = { USD: 1, COP: 4100 };
export const DECIMALES = { USD: 2, COP: 0 };

export function precioEn(precioUSD, moneda) {
  const tasa = TASAS[moneda] ?? 1;
  const dec = DECIMALES[moneda] ?? 2;
  return +(precioUSD * tasa).toFixed(dec);
}

/** Meses de vida útil que le quedan al lote actual de un material. */
export function mesesVidaUtil(material, desde = new Date()) {
  if (!material?.lote?.vence) return null;
  const v = new Date(material.lote.vence + "T00:00:00Z");
  return Math.floor((v - desde) / (30.44 * 86400000));
}

/** Parámetros de negocio. Cambiarlos aquí cambia el comportamiento de todo el motor. */
export const PARAMETROS = {
  umbral_carga:        0.72,  // ≥ esto entra solo
  umbral_revision:     0.42,  // entre revisión y carga: cola humana
  desvio_precio_avisa: 0.05,  // 5 % de diferencia contra lista/contrato: advertencia
  desvio_precio_frena: 0.15,  // 15 %: bloquea la línea
  lead_time_dias:      2,     // entrega mínima razonable
  tolerancia_cupo:     0.00   // sin colchón: pasarse del cupo bloquea
};
