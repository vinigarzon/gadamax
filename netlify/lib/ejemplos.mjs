/**
 * Gadamax · Demo agente de pedidos · v2
 * Pedidos de ejemplo calcados de la ESTRUCTURA de la muestra real de
 * B. Braun (cluster andino), con datos 100 % sintéticos: clínicas, RUC/NIT,
 * pacientes y personas son inventados. Cada ejemplo ejercita una ruta
 * distinta del motor, con las complejidades que aparecen en las órdenes
 * reales: doble código, precios de contrato, exigencias de caducidad,
 * lotes, IVA por línea y tarjetas de cirugía manuscritas.
 */

export const EJEMPLOS = [
  {
    id: "correo-ec",
    titulo: "Correo de farmacia",
    subtitulo: "Ecuador · texto libre, nombres coloquiales, un producto ajeno",
    canal: "correo",
    espera: "Debe traducir «VASOCAN», «ESPINOCAN» y «PENCAN No. 27» a referencias B. Braun, tomar la REF cuando viene, y dejar en cola lo que no es del maestro.",
    texto: `De: farmacia@clinicasantamalia.med.ec
Para: Atencion a Clientes — B. Braun Ecuador
Asunto: PEDIDO CLINICA SANTA AMALIA

Estimados de Braum, un cordial saludo, favor su ayuda con el siguiente pedido para q pueda ser procesado lo mas pronto:

VASOCAN # 18 (VASOFIX)                                              6
VASOCAN #22 (VASOFIX)                                               4
AGUJA ESPINOCAN #22                                                 2
MICROGOTERO BRAUN (DOSIFIX) (REF: 4037011)                          50
PENCAN No. 27 X 3 1/2                                               3
EQUIPO SENCILLO-INFUSOMAT SPACE LINE SAFESET PUR (REF: 8700130SP)   200
GUANTES QUIRURGICOS ESTERILES No. 7.5                               10

Adicional, 2 llaves de 3 vias

Les solicito informarnos cualquier novedad en caso de no poder realizar el despacho.
CLINICA SANTA AMALIA S.A. — RUC 1791845632001
Bqf. Responsable de Farmacia`
  },
  {
    id: "oc-co",
    titulo: "OC formal de distribuidor",
    subtitulo: "Colombia · doble código, precios en pesos, un precio fuera de rango",
    canal: "correo",
    espera: "Debe leer el código del cliente Y la referencia B. Braun, validar precios en COP contra la lista, frenar la línea con precio fuera de margen y avisar el stock corto — sin tumbar el resto.",
    texto: `BIOCIENCIA ANDINA S.A.S.
CR 48 # 12 - 30, Medellín, Antioquia — NIT 800654321-9
Proveedor: B.Braun Medical S.A. — NIT: 860026442-5

RECUERDE QUE DEBE DETALLAR ESTA ORDEN DE COMPRA EN LA FACTURA - HORARIO DE RECIBO DE LUN A VIE ENTRE 7 AM Y 3 PM.

Pedido de compra #OC04517
Fecha de la Orden: 01/09/2026     Fecha de entrega esperada: 05/09/2026

Producto                                      Referencia   Ctdad             Precio Unitario   Importe
[6872] Jeringa Omnifix 50 Ml L/L (Und)        4617509F     4,00 Cjax100Und   248.000,00        992.000,00
[9885] Aguja pencan g-27 x 3 1/2" (Und)       4502051      10,00 Cjax25Und   692.000,00        6.920.000,00
[1130] Spinocan G-20 x 3 1/2" (88mm) (Und)    4509900      3,00 Cjax25Und    371.500,00        1.114.500,00
[3892] Stimuplex canula G-21/100mm (Und)      4894260      25,00 Cjax25Und   1.100.000,00      27.500.000,00
[1240] Cateter Introcan Certo G-18 (Und)      4251342      12,00 Cjax50Und   107.000,00        1.284.000,00`
  },
  {
    id: "contrato-co",
    titulo: "Contrato estatal",
    subtitulo: "Colombia · precios pactados, caducidad mínima, IVA por línea",
    canal: "correo",
    espera: "Debe validar contra el precio del contrato (no la lista), aplicar el IVA solo donde va, y detectar que un lote no cumple la vida útil mínima de 15 meses.",
    texto: `ORDEN DE COMPRA NºOC000000123870
E.S.E. HOSPITAL REGIONAL DEL NORTE — NIT 890112233-1
PROVEEDOR: B.BRAUN MEDICAL S.A.   NIT: 860026442
FECHA: 01/09/2026   ENTREGA: 08/09/2026   MONEDA: Pesos
CONTRATO: CE-2026-118

CODIGO     NOMBRE                                        PRESENTACION  CANTIDAD  VALOR/U        %IVA
MQ01C0091  CATETER INTRAVENOSO 18G DE SEGURIDAD          CAJA X50      18        $ 137.000,00   0,00
MQ01C0093  CATETER INTRAVENOSO 22G DE SEGURIDAD          CAJA X50      21        $ 137.000,00   0,00
MQ01A0112  SOLUCION LAVADO DE HERIDAS PRONTOSAN 350mL    FRASCO        12        $ 76.570,00    0,00
MQ01E0036  SET PERFUSOR 50 ML                            UNIDAD        60        $ 35.100,00    0,00
MQ01K0025  KIT DE ANESTESIA EPIDURAL 18GA CON FILTRO     UNIDAD        40        $ 86.840,00    0,00
MQ33ICD2   MATRIZ DE REPARACION DE DURAMADRE 7,5x7,5cm   UNIDAD        2         $ 1.605.300,00 0,00
P011401    ETIQUETA EN ROLLO PAPEL CONTINUO CLASE 1      UNIDAD        3         $ 713.500,00   19,00

CONDICIONES DE RECEPCION: Los productos deben ingresar con vida util minima de quince (15) meses. Maximo dos (2) lotes por item. Cada lote debe venir acompañado de su certificado de calidad. La facturacion debe corresponder exactamente a lo establecido en esta Orden de Compra.`
  },
  {
    id: "whatsapp",
    titulo: "WhatsApp con apuro",
    subtitulo: "Ecuador · sin códigos, sin RUC, «para mañana»",
    canal: "whatsapp",
    espera: "Debe identificar al cliente solo por el nombre, emparejar por descripción y marcar que la entrega pedida está dentro del lead time.",
    texto: `Buenas estimada, le saluda la clinica del austro de cuenca

nos ayuda con esto porfa que estamos cortos:

2 cajas de pencan 25
1 caja espinocan 20
5 prontosan de 350
3 kits epidural con filtro
100 llaves de 3 vias discofix

es URGENTE para manana a primera hora, el doctor opera a las 8
gracias!!`
  },
  {
    id: "tarjeta",
    titulo: "Foto del CRM · tarjeta de cirugía",
    subtitulo: "Ecuador · manuscrito + etiquetas, reposición de comodato",
    canal: "foto_crm",
    espera: "Debe leer la fotografía: etiquetas impresas (REF/LOT) y manuscrito, armar la reposición del consumo y proteger los datos del paciente — solo quedan sus iniciales.",
    imagen: "/pedido-demo/tarjeta-cirugia.jpg",
    texto: "Fotografía publicada en el feed del CRM por el equipo de cirugía. Tarjeta de control de cirugías del Hospital San Gregorio de los Andes: generar el pedido de reposición del consumo."
  }
];

/* ─────────────────────────────────────────────────────────────────────────
 * Extracciones precalculadas: la red de seguridad del demo en vivo.
 * Si la API no responde, el flujo continúa con esto — declarándolo en
 * pantalla. Mismo esquema que la salida estructurada del modelo.
 * ──────────────────────────────────────────────────────────────────────── */

const L = (codigo, desc, cant, unidad, precio = null, lote = null, fecha = null, nota = null) => ({
  codigo_detectado: codigo, descripcion_detectada: desc, cantidad: cant, unidad,
  precio_unitario: precio, lote_detectado: lote, fecha_entrega: fecha, nota
});

export const RESPALDOS = {
  "correo-ec": {
    canal: "correo", idioma: "es",
    cliente: { nombre_detectado: "CLINICA SANTA AMALIA S.A.", identificacion_detectada: "1791845632001", pais: "Ecuador" },
    documento: { referencia_cliente: null, fecha_solicitada: null, lugar_entrega: null, condicion_pago: null, moneda: null },
    lineas: [
      L(null, "VASOCAN # 18 (VASOFIX)", 6, null),
      L(null, "VASOCAN #22 (VASOFIX)", 4, null),
      L(null, "AGUJA ESPINOCAN #22", 2, null),
      L("4037011", "MICROGOTERO BRAUN (DOSIFIX)", 50, null),
      L(null, "PENCAN No. 27 X 3 1/2", 3, null),
      L("8700130SP", "EQUIPO SENCILLO-INFUSOMAT SPACE LINE SAFESET PUR", 200, null),
      L(null, "GUANTES QUIRURGICOS ESTERILES No. 7.5", 10, null),
      L(null, "llaves de 3 vias", 2, null)
    ],
    exigencias: [], cirugia: null,
    observaciones: ["Solicitan informar cualquier novedad si no se puede despachar."],
    campos_ausentes: ["referencia_cliente", "fecha_solicitada", "lugar_entrega"],
    confianza_global: 0.9
  },

  "oc-co": {
    canal: "correo", idioma: "es",
    cliente: { nombre_detectado: "BIOCIENCIA ANDINA S.A.S.", identificacion_detectada: "800654321-9", pais: "Colombia" },
    documento: { referencia_cliente: "OC04517", fecha_solicitada: "2026-09-05", lugar_entrega: "CR 48 # 12 - 30, Medellín", condicion_pago: null, moneda: "COP" },
    lineas: [
      L("6872", "Jeringa Omnifix 50 Ml L/L (Und) — Ref 4617509F", 4, "Cjax100Und", 248000),
      L("9885", "Aguja pencan g-27 x 3 1/2\" (Und) — Ref 4502051", 10, "Cjax25Und", 692000),
      L("1130", "Spinocan G-20 x 3 1/2\" (88mm) (Und) — Ref 4509900", 3, "Cjax25Und", 371500),
      L("3892", "Stimuplex canula G-21/100mm (Und) — Ref 4894260", 25, "Cjax25Und", 1100000),
      L("1240", "Cateter Introcan Certo G-18 (Und) — Ref 4251342", 12, "Cjax50Und", 107000)
    ],
    exigencias: ["Detallar la orden de compra en la factura.", "Horario de recibo de lunes a viernes entre 7 AM y 3 PM."],
    cirugia: null,
    observaciones: [],
    campos_ausentes: ["condicion_pago"],
    confianza_global: 0.95
  },

  "contrato-co": {
    canal: "correo", idioma: "es",
    cliente: { nombre_detectado: "E.S.E. HOSPITAL REGIONAL DEL NORTE", identificacion_detectada: "890112233-1", pais: "Colombia" },
    documento: { referencia_cliente: "OC000000123870", fecha_solicitada: "2026-09-08", lugar_entrega: null, condicion_pago: null, moneda: "COP" },
    lineas: [
      L("MQ01C0091", "CATETER INTRAVENOSO 18G DE SEGURIDAD", 18, "CAJA X50", 137000),
      L("MQ01C0093", "CATETER INTRAVENOSO 22G DE SEGURIDAD", 21, "CAJA X50", 137000),
      L("MQ01A0112", "SOLUCION LAVADO DE HERIDAS PRONTOSAN 350mL", 12, "FRASCO", 76570),
      L("MQ01E0036", "SET PERFUSOR 50 ML", 60, "UNIDAD", 35100),
      L("MQ01K0025", "KIT DE ANESTESIA EPIDURAL 18GA CON FILTRO", 40, "UNIDAD", 86840),
      L("MQ33ICD2", "MATRIZ DE REPARACION DE DURAMADRE 7,5x7,5cm", 2, "UNIDAD", 1605300),
      L("P011401", "ETIQUETA EN ROLLO PAPEL CONTINUO CLASE 1", 3, "UNIDAD", 713500)
    ],
    exigencias: [
      "Vida útil mínima de quince (15) meses al ingreso.",
      "Máximo dos (2) lotes por ítem.",
      "Certificado de calidad por cada lote.",
      "La facturación debe corresponder exactamente a la orden de compra."
    ],
    cirugia: null,
    observaciones: ["Compra amparada en el contrato CE-2026-118."],
    campos_ausentes: ["condicion_pago"],
    confianza_global: 0.95
  },

  "whatsapp": {
    canal: "whatsapp", idioma: "es",
    cliente: { nombre_detectado: "clinica del austro", identificacion_detectada: null, pais: "Ecuador" },
    documento: { referencia_cliente: null, fecha_solicitada: "2026-09-03", lugar_entrega: "Cuenca", condicion_pago: null, moneda: null },
    lineas: [
      L(null, "pencan 25", 2, "cajas"),
      L(null, "espinocan 20", 1, "caja"),
      L(null, "prontosan de 350", 5, null),
      L(null, "kits epidural con filtro", 3, null),
      L(null, "llaves de 3 vias discofix", 100, null)
    ],
    exigencias: [], cirugia: null,
    observaciones: ["Urgente: entrega para mañana a primera hora, cirugía a las 8."],
    campos_ausentes: ["identificacion_detectada", "referencia_cliente"],
    confianza_global: 0.82
  },

  "tarjeta": {
    canal: "foto_crm", idioma: "es",
    cliente: { nombre_detectado: "Hospital San Gregorio de los Andes", identificacion_detectada: null, pais: "Ecuador" },
    documento: { referencia_cliente: "TCC-0906", fecha_solicitada: null, lugar_entrega: null, condicion_pago: null, moneda: null },
    lineas: [
      L("1069810", "Lyoplant matriz de duramadre 7,5 x 7,5 cm", 1, "unidad", null, "25K0087"),
      L("C0121401", "Sutura Monomax HR48", 1, "sobre", null, "26B0929"),
      L(null, "Prontosan 350", 1, "frasco", null, "26E0644"),
      L(null, "Spinocan G20", 2, "unidades")
    ],
    exigencias: [],
    cirugia: { procedimiento: "Craneotomía", fecha: "2026-09-01", hospital: "Hospital San Gregorio de los Andes", paciente_iniciales: "M.F.L.Z." },
    observaciones: ["Reposición de consumo en comodato según tarjeta de control de cirugías."],
    campos_ausentes: ["identificacion_detectada", "precios"],
    confianza_global: 0.85
  }
};
