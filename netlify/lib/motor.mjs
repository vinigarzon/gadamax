/**
 * Gadamax · Demo agente de pedidos
 * Motor determinista: normalización, emparejamiento y reglas de negocio.
 *
 * Nada de esto usa el modelo. El modelo solo lee el texto sucio del cliente y
 * devuelve campos. Todo lo que decide (a qué código corresponde, si el precio
 * está bien, si hay cupo, si entra o va a revisión) ocurre aquí, en código
 * auditable y repetible. Es la parte que se puede mostrar línea por línea.
 */

import { MATERIALES, CLIENTES, PARAMETROS, precioEn, DECIMALES, mesesVidaUtil } from "./maestros.mjs";

/* ───────────────────────── normalización ───────────────────────── */

export function normalizar(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")   // quita tildes
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Solo dígitos: sirve para comparar RUC / NIT sin importar guiones ni puntos. */
const soloDigitos = (s) => String(s ?? "").replace(/\D/g, "");

/** Similitud por bigramas (Dice). Estable, explicable, sin dependencias. */
export function similitud(a, b) {
  const x = normalizar(a), y = normalizar(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  const bg = (s) => {
    const t = ` ${s} `, out = new Map();
    for (let i = 0; i < t.length - 1; i++) {
      const g = t.slice(i, i + 2);
      out.set(g, (out.get(g) || 0) + 1);
    }
    return out;
  };
  const A = bg(x), B = bg(y);
  let comunes = 0, totalA = 0, totalB = 0;
  for (const [g, n] of A) { totalA += n; if (B.has(g)) comunes += Math.min(n, B.get(g)); }
  for (const [, n] of B) totalB += n;
  return (2 * comunes) / (totalA + totalB);
}

/* ───────────────────────── clientes ───────────────────────── */

export function emparejarCliente(nombre, identificacion) {
  const idBuscado = soloDigitos(identificacion);
  const candidatos = CLIENTES.map((c) => {
    const idMaestro = soloDigitos(c.id);
    // El identificador tributario manda: es único y no admite interpretación.
    if (idBuscado && idMaestro && idBuscado === idMaestro) {
      return { cliente: c, score: 1, motivo: `identificación tributaria exacta (${c.id})` };
    }
    const s = similitud(nombre, c.nom);
    return { cliente: c, score: s, motivo: `similitud de razón social ${(s * 100).toFixed(0)} %` };
  }).sort((a, b) => b.score - a.score);

  const mejor = candidatos[0];
  const segundo = candidatos[1];
  // Si el primero y el segundo empatan, no hay match confiable: que decida una persona.
  const ambiguo = segundo && mejor.score < 1 && (mejor.score - segundo.score) < 0.08;

  return {
    ...mejor,
    ambiguo: Boolean(ambiguo),
    alternativas: candidatos.slice(1, 4).map((c) => ({ cod: c.cliente.cod, nom: c.cliente.nom, score: +c.score.toFixed(3) }))
  };
}

/* ───────────────────────── materiales ───────────────────────── */

export function emparejarMaterial(codigo, descripcion, cliente = null) {
  const codNorm = normalizar(codigo);

  // 0. Tabla código-del-cliente → referencia B. Braun (existe y está poblada,
  //    según respuesta del levantamiento). Es el camino más corto y más seguro.
  if (codNorm && cliente?.codigos) {
    for (const [propio, ref] of Object.entries(cliente.codigos)) {
      if (normalizar(propio) === codNorm) {
        const m = MATERIALES.find((x) => x.cod === ref);
        if (m) {
          return {
            material: m, score: 1, ambiguo: false,
            motivo: `código propio del cliente (${propio} → ${m.cod}) según su tabla de equivalencias`,
            alternativas: []
          };
        }
      }
    }
  }

  const candidatos = MATERIALES.map((m) => {
    // 1. Referencia B. Braun exacta.
    if (codNorm && normalizar(m.cod) === codNorm) {
      return { material: m, score: 1, motivo: `referencia B. Braun exacta (${m.cod})` };
    }
    // 2. Alias conocido del producto.
    if (codNorm && m.alias.some((a) => normalizar(a) === codNorm)) {
      return { material: m, score: 0.95, motivo: `código del cliente "${codigo}" mapeado a ${m.cod}` };
    }
    // 3. Descripción libre contra descripción y alias del maestro.
    const sDesc = similitud(descripcion, m.desc);
    const sAlias = Math.max(0, ...m.alias.map((a) => similitud(descripcion, a)));
    const s = Math.max(sDesc, sAlias * 0.97);
    return { material: m, score: s, motivo: `descripción similar a "${m.desc}" (${(s * 100).toFixed(0)} %)` };
  }).sort((a, b) => b.score - a.score);

  const mejor = candidatos[0];
  const segundo = candidatos[1];
  const ambiguo = segundo && mejor.score < 0.95 && (mejor.score - segundo.score) < 0.06;

  return {
    ...mejor,
    ambiguo: Boolean(ambiguo),
    alternativas: candidatos.slice(1, 4).map((c) => ({ cod: c.material.cod, desc: c.material.desc, score: +c.score.toFixed(3) }))
  };
}

/* ───────────────────────── reglas de negocio ───────────────────────── */

const hoy = () => new Date().toISOString().slice(0, 10);

/**
 * Aplica todas las reglas sobre lo que extrajo el modelo y devuelve un pedido
 * resuelto: líneas con código real, incidencias por línea y veredicto global.
 */
export function resolver(extraccion, opciones = {}) {
  const P = { ...PARAMETROS, ...(opciones.parametros || {}) };
  const incidencias = [];   // problemas a nivel de cabecera
  const anota = (nivel, regla, texto, ref) => incidencias.push({ nivel, regla, texto, ref: ref ?? null });

  /* --- cabecera: cliente --- */
  const mc = emparejarCliente(extraccion?.cliente?.nombre_detectado, extraccion?.cliente?.identificacion_detectada);
  const cliente = mc.score >= P.umbral_revision ? mc.cliente : null;

  if (!cliente) {
    anota("bloqueo", "cliente_no_identificado",
      `No se pudo identificar al cliente "${extraccion?.cliente?.nombre_detectado ?? "(sin nombre)"}" en el maestro.`);
  } else {
    if (mc.ambiguo) {
      anota("revision", "cliente_ambiguo",
        `Dos clientes del maestro se parecen casi igual (${mc.cliente.nom} vs. ${mc.alternativas[0]?.nom}). Requiere confirmación.`);
    }
    if (mc.score < P.umbral_carga && mc.score >= P.umbral_revision) {
      anota("revision", "cliente_baja_confianza",
        `Cliente emparejado con confianza ${(mc.score * 100).toFixed(0)} %, por debajo del umbral de carga automática.`);
    }
    if (cliente.bloqueado) {
      anota("bloqueo", "cliente_bloqueado",
        `${cliente.nom} está bloqueado en el maestro. No se puede generar pedido hasta liberarlo.`);
    }
  }

  /* --- líneas --- */
  // La lista está en USD; se convierte a la moneda del cliente antes de comparar.
  const moneda = cliente ? cliente.moneda : (extraccion?.documento?.moneda ?? "USD");
  const dec = DECIMALES[moneda] ?? 2;
  const lineasIn = Array.isArray(extraccion?.lineas) ? extraccion.lineas : [];
  const lineas = lineasIn.map((l, i) => {
    const inc = [];
    const anotaL = (nivel, regla, texto) => inc.push({ nivel, regla, texto });

    const mm = emparejarMaterial(l.codigo_detectado, l.descripcion_detectada, cliente);
    const material = mm.score >= P.umbral_revision ? mm.material : null;

    if (!material) {
      anotaL("bloqueo", "material_no_identificado",
        `"${l.descripcion_detectada ?? l.codigo_detectado ?? "(vacío)"}" no corresponde a ningún material del maestro.`);
    } else {
      if (mm.ambiguo) {
        anotaL("revision", "material_ambiguo",
          `Ambiguo entre ${material.cod} (${material.desc}) y ${mm.alternativas[0]?.cod} (${mm.alternativas[0]?.desc}).`);
      }
      if (mm.score < P.umbral_carga && mm.score >= P.umbral_revision) {
        anotaL("revision", "material_baja_confianza",
          `Emparejado con confianza ${(mm.score * 100).toFixed(0)} %, por debajo del umbral de carga automática.`);
      }
    }

    /* cantidad */
    const cantidad = typeof l.cantidad === "number" && isFinite(l.cantidad) ? l.cantidad : null;
    if (cantidad === null) {
      anotaL("bloqueo", "cantidad_ausente", "La línea no trae cantidad. Es obligatoria.");
    } else if (cantidad <= 0) {
      anotaL("bloqueo", "cantidad_invalida", `Cantidad ${cantidad} no es válida.`);
    } else if (!Number.isInteger(cantidad)) {
      anotaL("revision", "cantidad_fraccionada", `Cantidad ${cantidad} no es entera; verificar unidad de medida.`);
    }

    /* precio: contrato o lista, contra lo que escribió el cliente.
     * Si el cliente tiene precio pactado por contrato/licitación para esta
     * referencia, ESE es el precio válido — no la lista general. Así un precio
     * "por debajo de lista" no dispara falsas alarmas en contratos estatales. */
    const precioContrato = (material && cliente?.contrato?.precios?.[material.cod]) ?? null;
    const precioLista = material ? (precioContrato ?? precioEn(material.precio, moneda)) : null;
    const origenPrecio = precioContrato !== null ? `contrato ${cliente.contrato.id}` : "lista";
    const precioCliente = typeof l.precio_unitario === "number" && isFinite(l.precio_unitario) ? l.precio_unitario : null;
    let precioAplicado = precioLista;
    let desvio = null;

    if (material && precioCliente !== null && precioLista) {
      desvio = (precioCliente - precioLista) / precioLista;
      const abs = Math.abs(desvio);
      if (abs >= P.desvio_precio_frena) {
        anotaL("bloqueo", "precio_fuera_de_rango",
          `El cliente pide ${precioCliente.toLocaleString("es-EC", { minimumFractionDigits: dec, maximumFractionDigits: dec })} y el precio de ${origenPrecio} es ${precioLista.toLocaleString("es-EC", { minimumFractionDigits: dec, maximumFractionDigits: dec })} ${moneda} (${(desvio * 100).toFixed(1)} %). Fuera del margen permitido.`);
      } else if (abs >= P.desvio_precio_avisa) {
        anotaL("revision", "precio_con_desvio",
          `Diferencia de ${(desvio * 100).toFixed(1)} % contra ${origenPrecio} (${precioCliente.toLocaleString("es-EC", { minimumFractionDigits: dec, maximumFractionDigits: dec })} vs. ${precioLista.toLocaleString("es-EC", { minimumFractionDigits: dec, maximumFractionDigits: dec })} ${moneda}). Requiere autorización comercial.`);
      } else if (precioContrato !== null) {
        anotaL("informativo", "precio_de_contrato",
          `Precio validado contra el ${origenPrecio}: ${precioLista.toLocaleString("es-EC", { minimumFractionDigits: dec, maximumFractionDigits: dec })} ${moneda}.`);
      }
    } else if (material && precioCliente === null) {
      anotaL("informativo", "precio_desde_lista",
        `El pedido no traía precio; se aplica el de ${origenPrecio}: ${precioLista.toLocaleString("es-EC", { minimumFractionDigits: dec, maximumFractionDigits: dec })} ${moneda}.`);
    }

    /* stock */
    if (material && cantidad !== null && cantidad > material.stock) {
      anotaL("revision", "stock_insuficiente",
        `Se piden ${cantidad} ${material.um} y hay ${material.stock} disponibles. Falta ${cantidad - material.stock}: requiere decisión de despacho parcial o backorder.`);
    }

    /* vida útil del lote contra la política de recepción del cliente.
     * Esto reproduce la exigencia real: "los productos deben contar con una
     * fecha de caducidad mayor a X; si no cumplen, notificar previamente". */
    const mesesLote = material ? mesesVidaUtil(material) : null;
    const minMeses = cliente?.exigencias?.vida_util_min_meses ?? null;
    if (material && minMeses !== null && mesesLote !== null) {
      if (mesesLote < minMeses) {
        anotaL("revision", "lote_bajo_caducidad_minima",
          `El lote disponible ${material.lote.num} vence ${material.lote.vence} (${mesesLote} meses de vida útil) y el cliente exige mínimo ${minMeses}. Notificar y obtener autorización antes de despachar.`);
      }
    }

    /* lote pedido explícitamente (tarjeta de cirugía, reposición de comodato) */
    const loteDetectado = l.lote_detectado ?? null;
    if (material && loteDetectado && material.lote?.num &&
        normalizar(loteDetectado) !== normalizar(material.lote.num)) {
      anotaL("informativo", "lote_distinto_al_disponible",
        `El documento reporta el lote ${loteDetectado}; el lote en inventario es ${material.lote.num}. Se registra el consumo del lote reportado.`);
    }

    /* fecha de entrega propia de la línea (las OC reales la traen por ítem) */
    const fechaLinea = (typeof l.fecha_entrega === "string" && /^\d{4}-\d{2}-\d{2}$/.test(l.fecha_entrega)) ? l.fecha_entrega : null;

    /* impuestos por línea, según el país del cliente */
    const paisCod = cliente?.pais === "Colombia" ? "CO" : "EC";
    const ivaPct = material ? (material.iva?.[paisCod] ?? 0) : 0;

    const importe = (material && cantidad !== null) ? +(precioAplicado * cantidad).toFixed(dec) : null;
    const iva = importe !== null ? +((importe * ivaPct) / 100).toFixed(dec) : null;

    return {
      pos: (i + 1) * 10,
      entrada: {
        codigo: l.codigo_detectado ?? null,
        descripcion: l.descripcion_detectada ?? null,
        cantidad: l.cantidad ?? null,
        unidad: l.unidad ?? null,
        precio: l.precio_unitario ?? null,
        nota: l.nota ?? null
      },
      material: material ? {
        cod: material.cod, desc: material.desc, um: material.um, pres: material.pres, stock: material.stock,
        cum: material.cum ?? null,
        registro: material.registro?.[cliente?.pais === "Colombia" ? "CO" : "EC"] ?? null,
        lote: material.lote ?? null
      } : null,
      match: { score: +mm.score.toFixed(3), motivo: mm.motivo, alternativas: mm.alternativas },
      cantidad,
      precio_lista: precioLista,
      precio_origen: material ? origenPrecio : null,
      precio_cliente: precioCliente,
      precio_aplicado: precioAplicado,
      desvio_precio: desvio === null ? null : +(desvio * 100).toFixed(2),
      iva_pct: ivaPct,
      iva,
      fecha_entrega: fechaLinea,
      lote_reportado: loteDetectado,
      vida_util_meses: mesesLote,
      importe,
      incidencias: inc,
      estado: inc.some((x) => x.nivel === "bloqueo") ? "bloqueada"
            : inc.some((x) => x.nivel === "revision") ? "revision"
            : "ok"
    };
  });

  /* --- cabecera: fecha --- */
  const fecha = extraccion?.documento?.fecha_solicitada ?? null;
  if (fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    const dias = Math.round((new Date(fecha) - new Date(hoy())) / 86400000);
    if (dias < 0) {
      anota("revision", "fecha_pasada", `La fecha de entrega solicitada (${fecha}) ya pasó.`);
    } else if (dias < P.lead_time_dias) {
      anota("revision", "fecha_bajo_lead_time",
        `Entrega pedida para ${fecha}, dentro del lead time de ${P.lead_time_dias} días. Requiere confirmación de logística.`);
    }
  } else if (!fecha) {
    anota("informativo", "fecha_ausente", "El pedido no indica fecha de entrega; se tomará la primera disponible.");
  }

  /* --- cabecera: cupo de crédito ---
   * Se evalúa contra lo que realmente se va a grabar (las líneas limpias),
   * no contra el pedido completo: sería injusto rechazar por cupo un monto
   * que incluye líneas que de todas formas no van a entrar. */
  const total = +lineas.filter((l) => l.estado === "ok").reduce((s, l) => s + (l.importe || 0), 0).toFixed(dec);
  const total_iva = +lineas.filter((l) => l.estado === "ok").reduce((s, l) => s + (l.iva || 0), 0).toFixed(dec);
  const total_solicitado = +lineas.reduce((s, l) => s + (l.importe || 0), 0).toFixed(dec);
  let cupo = null;
  if (cliente) {
    const disponible = cliente.cupo - cliente.saldo;
    cupo = { limite: cliente.cupo, saldo: cliente.saldo, disponible, requerido: total, moneda: cliente.moneda };
    if (total > disponible * (1 + P.tolerancia_cupo)) {
      anota("bloqueo", "cupo_excedido",
        `El pedido suma ${total.toLocaleString("es-EC", { minimumFractionDigits: 2 })} ${cliente.moneda} y el cupo disponible es ${disponible.toLocaleString("es-EC", { minimumFractionDigits: 2 })} ${cliente.moneda}. Faltan ${(total - disponible).toLocaleString("es-EC", { minimumFractionDigits: 2 })}.`);
    } else if (total > disponible * 0.85) {
      anota("informativo", "cupo_ajustado",
        `El pedido consume el ${((total / disponible) * 100).toFixed(0)} % del cupo disponible.`);
    }
  }

  /* --- veredicto --------------------------------------------------------
   * Un problema de cabecera (cliente no identificado, bloqueado, sin cupo)
   * detiene el pedido completo: no hay nada válido que grabar.
   * Un problema de UNA línea no debe tumbar las demás. Las líneas limpias se
   * graban y solo las conflictivas quedan en la cola de excepciones. Así
   * trabaja un buen digitador y así debe trabajar el agente.
   * -------------------------------------------------------------------- */
  const todas = [...incidencias, ...lineas.flatMap((l) => l.incidencias)];
  const bloqueos = todas.filter((x) => x.nivel === "bloqueo");
  const revisiones = todas.filter((x) => x.nivel === "revision");
  const bloqueosCabecera = incidencias.filter((x) => x.nivel === "bloqueo");
  const pendientes = lineas.filter((l) => l.estado !== "ok");
  const grabables = lineas.filter((l) => l.estado === "ok");

  const confianzaLineas = lineas.length ? lineas.reduce((s, l) => s + l.match.score, 0) / lineas.length : 0;
  const confianza = +(((cliente ? mc.score : 0) * 0.4) + (confianzaLineas * 0.6)).toFixed(3);

  const decision = bloqueosCabecera.length ? "rechazado"
                 : !grabables.length       ? "rechazado"
                 : pendientes.length       ? "parcial"
                 : "aprobado";

  const razon = bloqueosCabecera.length
    ? `Detenido en cabecera — ${[...new Set(bloqueosCabecera.map((b) => b.regla))].join(", ")}. No se graba nada.`
    : !grabables.length
      ? "Ninguna línea del pedido superó las validaciones. No hay nada que grabar."
      : pendientes.length
        ? `${grabables.length} de ${lineas.length} líneas se graban; ${pendientes.length} ${pendientes.length === 1 ? "queda" : "quedan"} en cola por ${[...new Set(pendientes.flatMap((l) => l.incidencias.filter((i) => i.nivel !== "informativo").map((i) => i.regla)))].join(", ")}.`
        : revisiones.length
          ? `Se graba completo, con ${revisiones.length} ${revisiones.length === 1 ? "punto marcado" : "puntos marcados"} para revisión: ${[...new Set(revisiones.map((b) => b.regla))].join(", ")}.`
          : `Cliente y ${lineas.length} ${lineas.length === 1 ? "línea" : "líneas"} emparejados sobre el umbral, sin desvíos de precio ni de cupo.`;

  return {
    cliente: cliente ? { ...cliente } : null,
    match_cliente: { score: +mc.score.toFixed(3), motivo: mc.motivo, ambiguo: mc.ambiguo, alternativas: mc.alternativas },
    documento: {
      referencia_cliente: extraccion?.documento?.referencia_cliente ?? null,
      fecha_solicitada: fecha,
      lugar_entrega: extraccion?.documento?.lugar_entrega ?? null,
      condicion_pago: cliente ? cliente.cond : (extraccion?.documento?.condicion_pago ?? null),
      moneda: cliente ? cliente.moneda : (extraccion?.documento?.moneda ?? null)
    },
    lineas,
    incidencias,
    cupo,
    exigencias: cliente?.exigencias ?? null,
    contrato: cliente?.contrato ? { id: cliente.contrato.id, vigencia: cliente.contrato.vigencia } : null,
    total,
    total_iva,
    total_con_iva: +(total + total_iva).toFixed(dec),
    total_solicitado,
    confianza,
    decision,
    razon,
    conteo: {
      lineas: lineas.length,
      ok: lineas.filter((l) => l.estado === "ok").length,
      revision: lineas.filter((l) => l.estado === "revision").length,
      bloqueadas: lineas.filter((l) => l.estado === "bloqueada").length,
      bloqueos: bloqueos.length,
      revisiones: revisiones.length
    },
    parametros: P
  };
}

/* ───────────────────────── destinos ───────────────────────── */

/**
 * A qué sistemas va el pedido — según el levantamiento técnico:
 * Ecuador se digita hoy DOS VECES (INSOFT local + SAP ECC corporativo);
 * Colombia solo a SAP. Ninguno admite integración directa todavía, así que
 * la entrega es por ARCHIVO DE CARGA: INSOFT importa archivos contra su
 * ambiente de pruebas, y SAP recibe el archivo de carga masiva que importa
 * el equipo de IT. Cuando llegue S/4HANA, se cambia el adaptador y ya.
 */
export function destinos(pais) {
  if (pais === "Colombia") return ["SAP"];
  if (pais === "Ecuador")  return ["INSOFT", "SAP"];
  return ["SAP"];
}

/* ───────────────────────── payloads ───────────────────────── */

/** Estructura de una BAPI_SALESORDER_CREATEFROMDAT2 de SAP. */
export function payloadSAP(res, doc) {
  return {
    _sistema: "SAP ECC · archivo de carga masiva (estructura BAPI_SALESORDER_CREATEFROMDAT2)",
    ORDER_HEADER_IN: {
      DOC_TYPE: "TA",
      SALES_ORG: res.cliente?.org ?? null,
      DISTR_CHAN: "10",
      DIVISION: "00",
      PURCH_NO_C: res.documento.referencia_cliente,
      REQ_DATE_H: res.documento.fecha_solicitada ? res.documento.fecha_solicitada.replace(/-/g, "") : null,
      CURRENCY: res.documento.moneda
    },
    ORDER_PARTNERS: [
      { PARTN_ROLE: "AG", PARTN_NUMB: res.cliente?.cod ?? null },
      { PARTN_ROLE: "WE", PARTN_NUMB: res.cliente?.cod ?? null }
    ],
    ORDER_ITEMS_IN: res.lineas.filter((l) => l.estado === "ok").map((l) => ({
      ITM_NUMBER: String(l.pos).padStart(6, "0"),
      MATERIAL: l.material?.cod ?? null,
      TARGET_QTY: l.cantidad,
      TARGET_QU: l.material?.um ?? null
    })),
    ORDER_CONDITIONS_IN: res.lineas.filter((l) => l.estado === "ok").map((l) => ({
      ITM_NUMBER: String(l.pos).padStart(6, "0"),
      COND_TYPE: "PR00",
      COND_VALUE: l.precio_aplicado,
      CURRENCY: res.documento.moneda
    })),
    _resultado: doc ? { VBELN: doc, TYPE: "S", MESSAGE: `Documento de ventas ${doc} generado` } : null
  };
}

/** Estructura del archivo de importación de INSOFT (ERP local de Ecuador). */
export function payloadERP(res, doc) {
  return {
    _sistema: "INSOFT · archivo de importación (contra ambiente de pruebas primero)",
    pedido: {
      numero: doc,
      cliente_id: res.cliente?.cod ?? null,
      cliente_ruc: res.cliente?.id ?? null,
      referencia: res.documento.referencia_cliente,
      fecha_entrega: res.documento.fecha_solicitada,
      lugar_entrega: res.documento.lugar_entrega,
      condicion_pago: res.documento.condicion_pago,
      moneda: res.documento.moneda,
      detalle: res.lineas.filter((l) => l.estado === "ok").map((l) => ({
        linea: l.pos,
        item: l.material?.cod ?? null,
        descripcion: l.material?.desc ?? null,
        cantidad: l.cantidad,
        unidad: l.material?.um ?? null,
        precio: l.precio_aplicado,
        total: l.importe
      })),
      total: +res.lineas.filter((l) => l.estado === "ok").reduce((s, l) => s + (l.importe || 0), 0).toFixed(2)
    }
  };
}

/* ───────────────────────── archivos de carga ─────────────────────────
 * Lo que el equipo del cliente importaría HOY MISMO: un archivo por sistema,
 * generado desde el pedido ya resuelto. Estos son los entregables tangibles
 * del flujo — se pueden descargar desde el demo y abrir en Excel.
 * ------------------------------------------------------------------- */

const okLineas = (res) => res.lineas.filter((l) => l.estado === "ok");

/** Archivo plano de importación de INSOFT (separado por punto y coma). */
export function archivoINSOFT(res, doc) {
  const f = [];
  f.push(["PEDIDO", doc, new Date().toISOString().slice(0, 10),
    res.cliente?.cod ?? "", res.cliente?.id ?? "", res.documento.referencia_cliente ?? "",
    res.documento.condicion_pago ?? "", res.documento.moneda ?? ""].join(";"));
  for (const l of okLineas(res)) {
    f.push(["LINEA", l.pos, l.material.cod, l.material.desc, l.cantidad, l.material.um,
      l.precio_aplicado, l.iva_pct, l.importe, l.material.lote?.num ?? "",
      l.fecha_entrega ?? res.documento.fecha_solicitada ?? ""].join(";"));
  }
  f.push(["TOTAL", okLineas(res).length, res.total, res.total_iva, res.total_con_iva].join(";"));
  return { nombre: `INSOFT_${doc}.txt`, contenido: f.join("\r\n"), mime: "text/plain" };
}

/** Archivo de carga masiva para SAP ECC (CSV, una fila por posición). */
export function archivoSAP(res, doc) {
  const cab = ["TIPO_DOC", "ORG_VENTAS", "CANAL", "SECTOR", "CLIENTE", "NIT_RUC",
    "REF_CLIENTE", "FECHA_ENTREGA", "POSICION", "MATERIAL", "DESCRIPCION",
    "CANTIDAD", "UM", "PRECIO", "MONEDA", "LOTE"];
  const filas = okLineas(res).map((l) => ["TA", res.cliente?.org ?? "", "10", "00",
    res.cliente?.cod ?? "", res.cliente?.id ?? "",
    res.documento.referencia_cliente ?? "",
    (l.fecha_entrega ?? res.documento.fecha_solicitada ?? "").replace(/-/g, ""),
    String(l.pos).padStart(6, "0"), l.material.cod, l.material.desc,
    l.cantidad, l.material.um, l.precio_aplicado, res.documento.moneda ?? "", l.material.lote?.num ?? ""
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";"));
  return { nombre: `SAP_CARGA_${doc}.csv`, contenido: [cab.join(";"), ...filas].join("\r\n"), mime: "text/csv" };
}
