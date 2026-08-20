/**
 * Gadamax · Demo agente de pedidos
 * Pedidos de ejemplo — escritos como llegan de verdad, no como conviene al demo.
 * Cada uno ejercita una ruta distinta del motor.
 */

export const EJEMPLOS = [
  {
    id: "whatsapp",
    titulo: "WhatsApp de vendedor",
    subtitulo: "Ecuador · sin códigos, sin formato, fecha relativa",
    canal: "whatsapp",
    espera: "Debe emparejar por descripción y resolver «para el viernes» a una fecha real.",
    texto: `Buenas don Marco, le paso el pedido de comercial vega

50 cajas de aceite de 900
20 sacos arroz extra 5k
15 cajas de fideo espagueti 400
8 cajas cafe molido

es para entregar en la bodega de Durán, si puede el viernes mejor
gracias`
  },
  {
    id: "excel",
    titulo: "Tabla pegada de Excel",
    subtitulo: "Ecuador · códigos propios del cliente, un producto que no existe",
    canal: "excel",
    espera: "Debe mapear los códigos del cliente al maestro, dejar fuera el producto inexistente y cargar el resto.",
    texto: `PEDIDO N° 8891 - MAYORISTA DEL PACIFICO CIA LTDA - RUC 0992345678001

CODIGO	DESCRIPCION	CANT	PRECIO
A-900	ACEITE VEGETAL 900ML CAJA	60	28.40
ARR-5	ARROZ EXTRA SACO 5KG	100	21.75
DET-P2	DETERGENTE POLVO 2KG	35	34.10
XYZ-999	GALLETAS SURTIDAS 500G	20	18.00
PH-12	PAPEL HIGIENICO DOBLE HOJA	45

Entrega: bodega Manta
Observacion: el papel higienico confirmar precio antes de despachar`
  },
  {
    id: "correo-co",
    titulo: "Correo formal de Colombia",
    subtitulo: "Colombia · precios negociados fuera de lista",
    canal: "correo",
    espera: "Debe detectar el desvío de precio y frenar esa línea sin tumbar las demás.",
    texto: `De: compras@superandinos.com.co
Asunto: OC 77-4412 — despacho semana entrante

Cordial saludo,

Adjunto relación de la orden de compra 77-4412 a nombre de SUPERMERCADOS ANDINOS S.A.S., NIT 900123456-7.

- Detergente líquido 3 litros, 40 cajas, a $171.800 c/u
- Jabón de tocador 90 gr, 25 cajas, a $158.000
- Atún lomitos 170 gr, 30 cajas, precio acordado $205.000 c/u
- Leche entera UHT litro, 60 cajas

Favor despachar al CEDI Funza. Requerimos entrega el 2026-08-28.

Atentamente,
Área de Compras`
  },
  {
    id: "cupo",
    titulo: "Cliente sin cupo disponible",
    subtitulo: "Ecuador · el pedido supera el crédito",
    canal: "correo",
    espera: "Debe detenerse en cabecera y no grabar nada: el cliente no tiene cupo.",
    texto: `Buenos días,

De parte de FERRETERIA LOS ANDES S.A. (RUC 0991234567001) necesitamos:

30 cajas de detergente en polvo 2kg
25 cajas de jabón de tocador
40 pacas papel higiénico doble hoja
20 cajas café molido 340

Para entrega inmediata en Quito.`
  },
  {
    id: "manuscrito",
    titulo: "Pedido dictado por teléfono",
    subtitulo: "Ecuador · transcripción con errores, cantidades ambiguas",
    canal: "correo",
    espera: "Debe leer una transcripción sucia sin inventar lo que no está.",
    texto: `nota de pedido tomada x telefono - cliente mayorista del pacifico

- aceite 1 litro ... 25 cjs
- azucar blanca 1k .... 40
- harina de trigo 1kg 30 cajas
- atun lomitos 170 20 cajas
- leche uht 1l  ??? cliente va a confirmar cantidad

entregar en manta, el cliente pregunta si hay descuento por volumen`
  }
];

/**
 * Extracciones precalculadas de los ejemplos de arriba.
 * Red de seguridad: si la API no responde durante una demostración en vivo,
 * el pipeline sigue corriendo con esto y la pantalla lo declara en ámbar.
 * Solo aplica a los ejemplos precargados; un texto nuevo no tiene respaldo.
 */
export const RESPALDOS = {
  "whatsapp": {
    "canal": "whatsapp",
    "idioma": "es",
    "cliente": {
      "nombre_detectado": "comercial vega",
      "identificacion_detectada": null,
      "pais": "Ecuador"
    },
    "documento": {
      "referencia_cliente": null,
      "fecha_solicitada": "2026-08-21",
      "lugar_entrega": "bodega de Durán",
      "condicion_pago": null,
      "moneda": null
    },
    "lineas": [
      {
        "codigo_detectado": null,
        "descripcion_detectada": "aceite de 900",
        "cantidad": 50,
        "unidad": "cajas",
        "precio_unitario": null,
        "nota": null
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "arroz extra 5k",
        "cantidad": 20,
        "unidad": "sacos",
        "precio_unitario": null,
        "nota": null
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "fideo espagueti 400",
        "cantidad": 15,
        "unidad": "cajas",
        "precio_unitario": null,
        "nota": null
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "cafe molido",
        "cantidad": 8,
        "unidad": "cajas",
        "precio_unitario": null,
        "nota": null
      }
    ],
    "observaciones": [
      "Entregar en la bodega de Durán, si es posible el viernes"
    ],
    "campos_ausentes": [
      "identificacion_detectada",
      "referencia_cliente",
      "condicion_pago",
      "moneda",
      "precio_unitario en todas las líneas",
      "codigo_detectado en todas las líneas"
    ],
    "confianza_global": 0.72
  },
  "excel": {
    "canal": "excel",
    "idioma": "es",
    "cliente": {
      "nombre_detectado": "MAYORISTA DEL PACIFICO CIA LTDA",
      "identificacion_detectada": "0992345678001",
      "pais": "Ecuador"
    },
    "documento": {
      "referencia_cliente": "8891",
      "fecha_solicitada": null,
      "lugar_entrega": "bodega Manta",
      "condicion_pago": null,
      "moneda": null
    },
    "lineas": [
      {
        "codigo_detectado": "A-900",
        "descripcion_detectada": "ACEITE VEGETAL 900ML CAJA",
        "cantidad": 60,
        "unidad": null,
        "precio_unitario": 28.4,
        "nota": null
      },
      {
        "codigo_detectado": "ARR-5",
        "descripcion_detectada": "ARROZ EXTRA SACO 5KG",
        "cantidad": 100,
        "unidad": null,
        "precio_unitario": 21.75,
        "nota": null
      },
      {
        "codigo_detectado": "DET-P2",
        "descripcion_detectada": "DETERGENTE POLVO 2KG",
        "cantidad": 35,
        "unidad": null,
        "precio_unitario": 34.1,
        "nota": null
      },
      {
        "codigo_detectado": "XYZ-999",
        "descripcion_detectada": "GALLETAS SURTIDAS 500G",
        "cantidad": 20,
        "unidad": null,
        "precio_unitario": 18,
        "nota": null
      },
      {
        "codigo_detectado": "PH-12",
        "descripcion_detectada": "PAPEL HIGIENICO DOBLE HOJA",
        "cantidad": 45,
        "unidad": null,
        "precio_unitario": null,
        "nota": "confirmar precio antes de despachar"
      }
    ],
    "observaciones": [],
    "campos_ausentes": [
      "fecha_solicitada",
      "condicion_pago",
      "moneda"
    ],
    "confianza_global": 0.9
  },
  "correo-co": {
    "canal": "correo",
    "idioma": "es",
    "cliente": {
      "nombre_detectado": "SUPERMERCADOS ANDINOS S.A.S.",
      "identificacion_detectada": "900123456-7",
      "pais": "Colombia"
    },
    "documento": {
      "referencia_cliente": "77-4412",
      "fecha_solicitada": "2026-08-28",
      "lugar_entrega": "CEDI Funza",
      "condicion_pago": null,
      "moneda": null
    },
    "lineas": [
      {
        "codigo_detectado": null,
        "descripcion_detectada": "Detergente líquido 3 litros",
        "cantidad": 40,
        "unidad": "cajas",
        "precio_unitario": 171800,
        "nota": null
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "Jabón de tocador 90 gr",
        "cantidad": 25,
        "unidad": "cajas",
        "precio_unitario": 158000,
        "nota": null
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "Atún lomitos 170 gr",
        "cantidad": 30,
        "unidad": "cajas",
        "precio_unitario": 205000,
        "nota": "precio acordado"
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "Leche entera UHT litro",
        "cantidad": 60,
        "unidad": "cajas",
        "precio_unitario": null,
        "nota": null
      }
    ],
    "observaciones": [],
    "campos_ausentes": [
      "condicion_pago",
      "moneda",
      "precio_unitario de Leche entera UHT litro"
    ],
    "confianza_global": 0.9
  },
  "cupo": {
    "canal": "correo",
    "idioma": "es",
    "cliente": {
      "nombre_detectado": "FERRETERIA LOS ANDES S.A.",
      "identificacion_detectada": "0991234567001",
      "pais": "Ecuador"
    },
    "documento": {
      "referencia_cliente": null,
      "fecha_solicitada": null,
      "lugar_entrega": "Quito",
      "condicion_pago": null,
      "moneda": null
    },
    "lineas": [
      {
        "codigo_detectado": null,
        "descripcion_detectada": "detergente en polvo 2kg",
        "cantidad": 30,
        "unidad": "cajas",
        "precio_unitario": null,
        "nota": null
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "jabón de tocador",
        "cantidad": 25,
        "unidad": "cajas",
        "precio_unitario": null,
        "nota": null
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "papel higiénico doble hoja",
        "cantidad": 40,
        "unidad": "pacas",
        "precio_unitario": null,
        "nota": null
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "café molido 340",
        "cantidad": 20,
        "unidad": "cajas",
        "precio_unitario": null,
        "nota": null
      }
    ],
    "observaciones": [
      "Solicitan entrega inmediata en Quito"
    ],
    "campos_ausentes": [
      "referencia_cliente",
      "fecha_solicitada",
      "condicion_pago",
      "moneda"
    ],
    "confianza_global": 0.8
  },
  "manuscrito": {
    "canal": "desconocido",
    "idioma": "es",
    "cliente": {
      "nombre_detectado": "mayorista del pacifico",
      "identificacion_detectada": null,
      "pais": "Ecuador"
    },
    "documento": {
      "referencia_cliente": null,
      "fecha_solicitada": null,
      "lugar_entrega": "Manta",
      "condicion_pago": null,
      "moneda": null
    },
    "lineas": [
      {
        "codigo_detectado": null,
        "descripcion_detectada": "aceite 1 litro",
        "cantidad": 25,
        "unidad": "cjs",
        "precio_unitario": null,
        "nota": null
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "azucar blanca 1k",
        "cantidad": 40,
        "unidad": null,
        "precio_unitario": null,
        "nota": null
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "harina de trigo 1kg",
        "cantidad": 30,
        "unidad": "cajas",
        "precio_unitario": null,
        "nota": null
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "atun lomitos 170",
        "cantidad": 20,
        "unidad": "cajas",
        "precio_unitario": null,
        "nota": null
      },
      {
        "codigo_detectado": null,
        "descripcion_detectada": "leche uht 1l",
        "cantidad": null,
        "unidad": null,
        "precio_unitario": null,
        "nota": "cliente va a confirmar cantidad"
      }
    ],
    "observaciones": [
      "el cliente pregunta si hay descuento por volumen"
    ],
    "campos_ausentes": [
      "identificacion_detectada",
      "referencia_cliente",
      "fecha_solicitada",
      "condicion_pago",
      "moneda",
      "unidad en azucar blanca",
      "precio_unitario en todas las lineas"
    ],
    "confianza_global": 0.6
  }
};
