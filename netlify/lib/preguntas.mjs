/**
 * Gadamax · Cuestionario técnico Cluster Andino
 *
 * Una sola fuente de verdad: el formulario se dibuja desde acá y la función que
 * recibe las respuestas valida contra esto mismo. Para cambiar una pregunta se
 * toca este archivo y nada más.
 *
 * `critica: true` marca las preguntas sin las cuales no se puede armar un precio.
 * Están resaltadas en el formulario para que, si alguien tiene diez minutos y no
 * veinte, conteste al menos esas.
 */

export const SECCIONES = [
  {
    id: "A",
    titulo: "Volumen y canales",
    quien: "Servicio al cliente · Comercial",
    intro: "Para dimensionar el trabajo y el ahorro. Si un número no es exacto, un estimado sirve."
  },
  {
    id: "B",
    titulo: "El pedido y los maestros",
    quien: "Comercial · Datos maestros",
    intro: "Acá se decide la mayor parte de la tasa de acierto. Es la sección que más influye en si el proyecto sale bien."
  },
  {
    id: "C",
    titulo: "Sistemas y conexión",
    quien: "Tecnología · Basis",
    intro: "El punto que más mueve el precio. Nos interesa especialmente entender la situación con SAP."
  },
  {
    id: "D",
    titulo: "Operación y control",
    quien: "Operaciones · Auditoría",
    intro: "Qué pasa cuando el agente no está seguro, y qué exige la empresa en trazabilidad."
  },
  {
    id: "E",
    titulo: "Alcance y modelo comercial",
    quien: "Dirección",
    intro: "Para armar opciones de precio que tengan sentido para ustedes, no las que nos convengan a nosotros."
  },
  {
    id: "F",
    titulo: "La visión más amplia",
    quien: "Dirección · Tecnología",
    intro: "Sobre lo que conversamos de modernizar los procesos de la compañía con agentes e integración."
  }
];

export const PREGUNTAS = [
  /* ── A · Volumen y canales ─────────────────────────────────────────── */
  {
    id: "A1", seccion: "A", tipo: "reparto", critica: true,
    pregunta: "De los ~1.200 pedidos al mes, ¿cómo se reparten por canal?",
    ayuda: "Aproximado en porcentaje o en cantidad. No tiene que sumar exacto.",
    otroEn: "Otro",
    opciones: ["Correo con el pedido escrito en el cuerpo", "Correo con Excel o PDF adjunto", "WhatsApp", "Portal o e-commerce propio", "EDI", "Teléfono", "Otro"]
  },
  {
    id: "A2", seccion: "A", tipo: "check",
    pregunta: "¿En qué países ocurre hoy esta carga manual?",
    opciones: ["Ecuador", "Colombia", "Venezuela"]
  },
  {
    id: "A3", seccion: "A", tipo: "radio",
    pregunta: "¿Cuántas personas dedican parte de su día a digitar pedidos?",
    opciones: ["1 o 2", "3 a 5", "6 a 10", "Más de 10"]
  },
  {
    id: "A4", seccion: "A", tipo: "radio",
    pregunta: "¿Cuánto tarda una persona en cargar un pedido promedio en los dos sistemas?",
    opciones: ["Menos de 5 minutos", "Entre 5 y 15 minutos", "Entre 15 y 30 minutos", "Más de 30 minutos"]
  },
  {
    id: "A5", seccion: "A", tipo: "radio",
    pregunta: "¿Los pedidos llegan a una casilla compartida o a correos personales?",
    opciones: ["Una casilla compartida", "Correos personales de cada vendedor", "Las dos cosas"]
  },
  {
    id: "A6", seccion: "A", tipo: "texto",
    pregunta: "¿Hay picos de volumen? ¿Cuándo?",
    ayuda: "Fin de mes, temporadas, promociones. Una línea basta."
  },

  /* ── B · El pedido y los maestros ──────────────────────────────────── */
  {
    id: "B1", seccion: "B", tipo: "radio",
    pregunta: "¿Cuántos clientes distintos emiten pedidos en un mes?",
    opciones: ["Menos de 50", "Entre 50 y 200", "Entre 200 y 500", "Más de 500"]
  },
  {
    id: "B2", seccion: "B", tipo: "radio",
    pregunta: "¿Cuántos SKUs activos manejan?",
    opciones: ["Menos de 200", "Entre 200 y 1.000", "Entre 1.000 y 5.000", "Más de 5.000"]
  },
  {
    id: "B3", seccion: "B", tipo: "radio", critica: true,
    pregunta: "¿Los clientes piden usando sus propios códigos de producto?",
    ayuda: "Es decir, códigos que no son los de ustedes.",
    opciones: ["Casi siempre", "Algunos clientes sí", "Casi nunca: usan nuestros códigos o la descripción"]
  },
  {
    id: "B4", seccion: "B", tipo: "radio", critica: true,
    pregunta: "¿Existe una tabla que relacione el código del cliente con el código de ustedes?",
    ayuda: "En SAP se llama «registro info de material del cliente». Si existe y está poblada, se ahorran semanas de trabajo.",
    opciones: ["Sí, existe y está poblada", "Existe pero está casi vacía", "No existe", "No sé"]
  },
  {
    id: "B5", seccion: "B", tipo: "radio",
    pregunta: "¿Los precios salen de lista o hay condiciones negociadas por cliente?",
    opciones: ["Lista única", "Mayormente lista, con excepciones", "Cada cliente tiene condiciones negociadas"]
  },
  {
    id: "B6", seccion: "B", tipo: "radio",
    pregunta: "¿Hoy se valida cupo de crédito antes de cargar el pedido?",
    opciones: ["Sí, el sistema lo bloquea solo", "Sí, pero la persona lo revisa manualmente", "No se valida en ese momento"]
  },
  {
    id: "B7", seccion: "B", tipo: "radio", critica: true,
    pregunta: "¿Nos pueden enviar entre 20 y 30 pedidos reales, tal como llegaron?",
    ayuda: "Sin limpiar ni corregir. Es lo único que permite medir tasa de acierto de verdad, y sin eso cualquier precio es un invento.",
    opciones: ["Sí, esta semana", "Sí, pero hay que anonimizar datos del cliente", "Sí, más adelante", "No es posible"]
  },
  {
    id: "B8", seccion: "B", tipo: "radio", critica: true,
    pregunta: "¿Nos pueden enviar un extracto de maestros de clientes y materiales?",
    ayuda: "Aunque sea de una sola filial y solo con los campos que necesitamos: código, descripción, unidad, precio de lista.",
    opciones: ["Sí", "Sí, con acuerdo de confidencialidad firmado primero", "Solo una muestra reducida", "No es posible"]
  },

  {
    id: "B9", seccion: "B", tipo: "radio", critica: true,
    pregunta: "¿El pedido exige control de lote o número de serie?",
    ayuda: "Cambia por completo lo que el agente tiene que resolver antes de grabar una línea.",
    opciones: ["Sí, en todos los productos", "Solo en algunas familias de producto", "No, se asigna después en bodega"]
  },
  {
    id: "B10", seccion: "B", tipo: "radio",
    pregunta: "¿Hay que validar fecha de caducidad o vida útil mínima al momento del pedido?",
    ayuda: "Por ejemplo, clientes que exigen por contrato un porcentaje mínimo de vida útil restante.",
    opciones: ["Sí, algunos clientes lo exigen por contrato", "Se revisa, pero no es una regla formal", "No aplica en este momento"]
  },
  {
    id: "B11", seccion: "B", tipo: "check",
    pregunta: "¿Qué tipo de clientes emiten estos pedidos?",
    ayuda: "El formato del pedido cambia mucho entre un hospital público y un distribuidor.",
    otroEn: "Otro",
    opciones: ["Hospitales y clínicas privadas", "Hospitales o entidades públicas", "Distribuidores mayoristas", "Farmacias", "Otro"]
  },
  {
    id: "B12", seccion: "B", tipo: "radio", critica: true,
    pregunta: "¿Hay pedidos que vienen de licitaciones o contratos marco con precios ya fijados?",
    ayuda: "Si el precio viene de un contrato y no de la lista, la validación de precio es distinta.",
    opciones: ["Sí, una parte importante", "Sí, pero son pocos", "No, todo sale de lista o de condiciones del cliente", "No sé"]
  },

  /* ── C · Sistemas y conexión ───────────────────────────────────────── */
  {
    id: "C1", seccion: "C", tipo: "texto", critica: true,
    pregunta: "¿Cómo se llama exactamente el ERP que usan en Ecuador?",
    ayuda: "Nombre del producto y versión si la saben."
  },
  {
    id: "C2", seccion: "C", tipo: "check", critica: true,
    pregunta: "¿De qué formas se puede escribir en ese ERP?",
    ayuda: "Marquen todas las que apliquen, aunque no estén seguros.",
    otroEn: "Otro",
    opciones: ["API REST", "Servicio SOAP / web service", "Acceso directo a base de datos", "Importación de archivos (CSV, Excel, XML)", "Solo por pantalla", "Otro", "No sabemos todavía"]
  },
  {
    id: "C3", seccion: "C", tipo: "radio",
    pregunta: "¿Existe un ambiente de pruebas de ese ERP contra el que podamos trabajar?",
    opciones: ["Sí", "No, solo producción", "No sé"]
  },
  {
    id: "C4", seccion: "C", tipo: "check", critica: true,
    pregunta: "Nos comentaron que hoy conectarse a SAP no es posible. ¿Cuál es la razón?",
    ayuda: "Entender esto bien es lo que más cambia la propuesta. Marquen todas las que apliquen.",
    otroEn: "Otra razón",
    opciones: [
      "Política corporativa: no se permiten integraciones externas",
      "No hay quién autorice el acceso desde la región",
      "El contrato con el implementador no lo contempla",
      "Tema de licenciamiento o de versión",
      "No existe ambiente de pruebas disponible",
      "Seguridad de la información no lo aprueba",
      "Otra razón"
    ]
  },
  {
    id: "C5", seccion: "C", tipo: "radio",
    pregunta: "¿Esa situación con SAP es definitiva o podría cambiar?",
    opciones: ["Es definitiva", "Podría cambiar, se está gestionando", "Podría cambiar en 6 a 12 meses", "No sé"]
  },
  {
    id: "C6", seccion: "C", tipo: "check", critica: true,
    pregunta: "Si SAP no se puede escribir por integración, ¿cuál de estas alternativas les serviría?",
    ayuda: "Esto define si el proyecto elimina el trabajo manual o solo la mitad. Marquen todas las aceptables.",
    opciones: [
      "El agente genera un archivo de carga masiva que alguien importa a SAP",
      "El agente deja el pedido listo y una persona solo confirma en SAP",
      "El ERP de Ecuador queda como sistema de registro y SAP se alimenta después",
      "Automatizar la pantalla de SAP (RPA), asumiendo que es más frágil",
      "Ninguna: SAP se sigue cargando a mano como hoy"
    ]
  },
  {
    id: "C6b", seccion: "C", tipo: "check", critica: true,
    pregunta: "Si el camino fuera un archivo de importación a SAP, ¿qué mecanismo existe hoy en la compañía?",
    ayuda: "Aunque hoy lo use otra área para otra cosa. Si ya hay una vía de carga masiva funcionando, es la puerta más rápida.",
    opciones: [
      "LSMW",
      "Una transacción propia (Z) que carga desde Excel",
      "Migration Cockpit / Legacy Transfer de S/4",
      "Batch input grabado",
      "Dejar un archivo IDoc en una carpeta que SAP levanta",
      "No sabemos cuál, pero alguien lo hace hoy",
      "No sabemos"
    ]
  },
  {
    id: "C6c", seccion: "C", tipo: "radio",
    pregunta: "¿En qué formato tendría que salir ese archivo?",
    opciones: ["Excel", "CSV o texto separado", "Texto de ancho fijo", "XML o IDoc", "No sabemos todavía"]
  },
  {
    id: "C6d", seccion: "C", tipo: "radio", critica: true,
    pregunta: "¿Con qué frecuencia se puede correr esa importación?",
    ayuda: "Define cuánto tarda un pedido en aparecer en SAP, y eso cambia el diseño.",
    opciones: ["Varias veces al día", "Una vez al día", "Una vez por semana", "Cuando se necesite, sin restricción", "No sabemos"]
  },
  {
    id: "C6e", seccion: "C", tipo: "radio",
    pregunta: "Esa importación, ¿la corre una persona o está automatizada?",
    opciones: ["La corre una persona", "Está programada automáticamente", "No sabemos"]
  },
  {
    id: "C7", seccion: "C", tipo: "radio",
    pregunta: "¿Qué versión de SAP usan?",
    opciones: ["ECC", "S/4HANA", "S/4HANA Cloud", "No sé"]
  },
  {
    id: "C8", seccion: "C", tipo: "check",
    pregunta: "Además del ERP de Ecuador y SAP, ¿qué otros sistemas deberían conectarse más adelante?",
    otroEn: "Otro",
    opciones: ["CRM", "WMS o gestión de bodega", "Facturación electrónica (SRI / DIAN)", "Business intelligence o reportería", "Compras y abastecimiento", "Recursos humanos", "Transporte y logística", "Otro", "Todavía no lo tenemos claro"]
  },
  {
    id: "C9", seccion: "C", tipo: "radio", critica: true,
    pregunta: "¿Dónde puede vivir la plataforma que conecte todo?",
    ayuda: "Cambia el modelo de costo de forma importante.",
    opciones: ["En nuestro tenant de Microsoft Azure", "En infraestructura de Gadamax, como servicio", "En nuestros servidores propios", "Nos da igual, propongan ustedes"]
  },
  {
    id: "C10", seccion: "C", tipo: "texto",
    pregunta: "¿Quién es la persona que autoriza accesos técnicos a los sistemas?",
    ayuda: "Nombre y área. Sin esa persona identificada no hay piloto posible."
  },

  /* ── D · Operación y control ───────────────────────────────────────── */
  {
    id: "D1", seccion: "D", tipo: "texto",
    pregunta: "Cuando el agente no esté seguro de algo, ¿quién lo revisa?",
    ayuda: "Área o cargo. Un agente sin nadie atendiendo la cola de dudas no sirve de nada."
  },
  {
    id: "D2", seccion: "D", tipo: "radio",
    pregunta: "¿En cuánto tiempo debería resolverse una duda para no afectar el despacho?",
    opciones: ["En menos de una hora", "El mismo día", "Dentro de 24 horas", "No es crítico"]
  },
  {
    id: "D3", seccion: "D", tipo: "radio", critica: true,
    pregunta: "¿Qué nivel de acierto haría que valga la pena?",
    ayuda: "Sean realistas: exigir 100 % automático encarece el proyecto sin que necesariamente convenga.",
    opciones: [
      "Más del 99 % sin intervención",
      "Entre 95 y 99 %, el resto revisado por una persona",
      "Entre 90 y 95 %",
      "Con que reduzca a la mitad el trabajo manual ya sirve"
    ]
  },
  {
    id: "D4", seccion: "D", tipo: "check",
    pregunta: "¿Qué exige auditoría o control interno?",
    otroEn: "Otro",
    opciones: ["Registro de cada decisión del sistema", "Quién aprobó qué y cuándo", "Conservar los documentos originales por X años", "Poder revertir una carga equivocada", "Otro", "Nada en particular", "No sé"]
  },

  {
    id: "D5", seccion: "D", tipo: "check", critica: true,
    pregunta: "¿Este proceso entra en el alcance de alguna certificación o auditoría regulatoria?",
    ayuda: "En un fabricante de dispositivos médicos esto puede condicionar cómo se valida y documenta el sistema.",
    otroEn: "Otra",
    opciones: ["ISO 13485", "Buenas prácticas de manufactura o almacenamiento", "Auditoría corporativa interna", "Requisitos de la autoridad sanitaria local", "Otra", "No aplica", "No sé"]
  },

  /* ── E · Alcance y modelo comercial ────────────────────────────────── */
  {
    id: "E1", seccion: "E", tipo: "radio", critica: true,
    pregunta: "¿Con qué alcance arrancarían?",
    opciones: ["Solo Ecuador", "Ecuador y Colombia", "Los tres países desde el inicio", "Una prueba acotada primero, luego se decide"]
  },
  {
    id: "E2", seccion: "E", tipo: "check", critica: true,
    pregunta: "¿Qué modelos comerciales quieren ver en la propuesta?",
    ayuda: "Marquen todos los que quieran comparar. Vamos a costear los que elijan.",
    opciones: [
      "Pago único de desarrollo, más un mantenimiento mensual",
      "Suscripción mensual todo incluido, sin inversión inicial",
      "Desarrollo, más un costo variable por pedido procesado",
      "Consultoría por horas o por fases",
      "Muestren las opciones que tengan sentido y comparamos"
    ]
  },
  {
    id: "E3", seccion: "E", tipo: "radio",
    pregunta: "¿Les conviene más inversión de capital o gasto operativo?",
    opciones: ["Inversión de capital", "Gasto operativo mensual", "Nos da igual"]
  },
  {
    id: "E4", seccion: "E", tipo: "radio",
    pregunta: "Al final del proyecto, ¿la plataforma debe quedar en propiedad de ustedes?",
    opciones: ["Sí, tiene que ser nuestra", "No hace falta, puede ser un servicio contratado", "Nos da igual si el costo lo justifica"]
  },
  {
    id: "E5", seccion: "E", tipo: "radio",
    pregunta: "¿Hay presupuesto asignado para esto?",
    opciones: ["Sí, ya está asignado", "Hay que gestionarlo internamente", "Se decide cuando llegue la propuesta"]
  },
  {
    id: "E6", seccion: "E", tipo: "radio",
    pregunta: "¿Para cuándo necesitan esto funcionando?",
    opciones: ["Este trimestre", "El próximo trimestre", "Dentro de este año", "Sin fecha definida"]
  },

  /* ── F · La visión más amplia ──────────────────────────────────────── */
  {
    id: "F1", seccion: "F", tipo: "check",
    pregunta: "Además de pedidos, ¿qué procesos duelen más hoy?",
    otroEn: "Otro",
    opciones: ["Conciliación entre sistemas", "Reportería y consolidación regional", "Cuentas por cobrar y cartera", "Compras y abastecimiento", "Inventarios entre filiales", "Atención al cliente", "Cierre contable", "Otro"]
  },
  {
    id: "F2", seccion: "F", tipo: "radio",
    pregunta: "Sobre la idea de tener una sola base de datos e interconectar departamentos, ¿cómo prefieren avanzar?",
    opciones: [
      "Primero resolver pedidos, después ampliar",
      "Un diagnóstico transversal en paralelo, para no construir dos veces",
      "Todavía no lo tenemos definido"
    ]
  },
  {
    id: "F3", seccion: "F", tipo: "texto",
    pregunta: "¿Hay algún proyecto de modernización o integración ya en curso que debamos conocer?",
    ayuda: "Para no chocar con algo que ya está andando."
  },
  {
    id: "F4", seccion: "F", tipo: "texto",
    pregunta: "¿Algo que no preguntamos y que deberíamos saber?"
  }
];

export const CRITICAS = PREGUNTAS.filter((p) => p.critica).map((p) => p.id);
