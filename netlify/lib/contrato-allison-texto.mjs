/**
 * Gadamax · Contrato de Servicios Independientes — Host y Conductora de Gurumba
 * Contratista: Allison Corral Terán
 *
 * Igual que el NDA: este archivo es la única fuente de verdad del texto. La
 * página lo dibuja desde acá y la función calcula la huella SHA-256 sobre esto
 * mismo, de modo que el registro de firma queda atado a la versión exacta que
 * se firmó. Cualquier cambio de texto o de tarifas debe subir VERSION.
 */

export const VERSION = "1.0";
export const FECHA_VERSION = "3 de septiembre de 2026";

export const GADAMAX = {
  razon: "Gadamax LLC",
  descripcion: "sociedad de responsabilidad limitada constituida bajo las leyes del Estado de Illinois, Estados Unidos de América, operadora de la plataforma Gurumba (gurumba.com)",
  direccion: "2735 Hassert Blvd, Ste 135 #874, Naperville, IL 60564, Estados Unidos",
  firmante: "Marco Garzón",
  cargo: "Managing Member",
  correo: "mvg@gadamax.com"
};

/* Datos que se precargan en el bloque de firma; la Contratista los confirma o corrige. */
export const CONTRATISTA = {
  nombre: "Allison Corral Terán",
  correo: "allison.corral@gmail.com",
  ciudad: "Quito, Ecuador"
};

/* Honorarios por pieza. Una pieza se paga una sola vez, por el rol desempeñado. */
export const TARIFAS = [
  { pieza: "Episodio de podcast conducido", monto: 200, unidad: "por episodio grabado y aprobado",
    nota: "Incluye preparación, pre-entrevista con el guru invitado y conducción." },
  { pieza: "Evento o panel en vivo conducido", monto: 300, unidad: "por evento",
    nota: "Presencial o virtual. Incluye moderación y coordinación previa con los panelistas." },
  { pieza: "Masterclass o charla principal conducida", monto: 250, unidad: "por sesión",
    nota: "Presentación, moderación de preguntas y cierre." }
];

export const TITULO = "Contrato de Servicios Independientes · Host y Conductora de Gurumba";

export const PREAMBULO = `Este Contrato de Servicios Independientes (el «Contrato») se celebra entre ${GADAMAX.razon}, ${GADAMAX.descripcion}, con domicilio en ${GADAMAX.direccion} («Gadamax» o «Gurumba»), y la persona natural identificada en el bloque de firma de este documento (la «Contratista»). Gadamax y la Contratista se denominan conjuntamente las «Partes».`;

export const CLAUSULAS = [
  {
    t: "1. Objeto",
    c: `Gadamax contrata a la Contratista, y esta acepta, para desempeñarse como Host y Conductora de los contenidos y encuentros de Gurumba: el podcast, los eventos y paneles en vivo, las masterclasses y charlas principales, y las demás piezas de contenido que las Partes acuerden (los «Servicios de Host»). En ese rol la Contratista es la voz y el rostro que conduce, entrevista a los gurus y guía los programas ante la audiencia de Gurumba.`
  },
  {
    t: "2. Alcance de los Servicios de Host",
    c: `Los Servicios de Host comprenden, para cada pieza encargada: (a) la preparación editorial, incluida la pre-entrevista o coordinación previa con el guru o los panelistas invitados; (b) la conducción de la grabación o del encuentro en vivo, presencial o virtual; (c) la participación en la planificación de la programación de contenidos y en la propuesta de temas e invitados; y (d) la relación cordial y profesional con los gurus de la red en todo lo relativo a las piezas que conduce. Gadamax aporta la producción: plataforma, estudio o sala virtual, edición, publicación y difusión. La Contratista no está obligada a asumir tareas administrativas, de venta ni de soporte a usuarios.`
  },
  {
    t: "3. Doble rol: Host y Guru",
    c: `La Contratista participa además en Gurumba como Guru, con su propia ficha, sesiones, cursos y participaciones. Ese rol se rige por el Guru Service Agreement y los Términos para Gurus vigentes en la plataforma, que se aceptan en el onboarding, y se remunera según las tarifas y comisiones allí publicadas (a la fecha de este Contrato: 70 % de cada sesión 1:1 y de cada venta de curso para el Guru, y honorarios fijos por participar como invitada en podcasts, paneles, charlas y masterclasses). Este Contrato regula únicamente los Servicios de Host y prevalece sobre aquellos documentos en todo lo que se refiera a ese rol. Una misma pieza se paga una sola vez, según el rol que la Contratista desempeñe en ella.`
  },
  {
    t: "4. Encargo de piezas y programación",
    c: `Cada pieza se encarga por escrito —correo electrónico o herramienta de la plataforma— indicando formato, tema, invitados, fecha y modalidad. Los eventos y paneles se programan con al menos treinta (30) días de anticipación y los episodios de podcast con al menos siete (7) días, salvo acuerdo distinto en cada caso. La Contratista puede declinar cualquier encargo que no le sea posible atender, avisando con la mayor anticipación posible. Gadamax no garantiza un número mínimo de piezas y la Contratista no queda obligada a un mínimo de entregas; las Partes procurarán mantener un ritmo regular de contenido, que revisarán conforme a la cláusula 7.`
  },
  {
    t: "5. Honorarios por pieza",
    c: `Gadamax pagará a la Contratista, por cada pieza conducida y aprobada, los honorarios siguientes, en dólares de los Estados Unidos: ${TARIFAS.map((x) => `${x.pieza.toLowerCase()}: USD ${x.monto} ${x.unidad}`).join("; ")}. Una pieza se considera entregada cuando fue grabada o realizada en la fecha acordada; la aprobación de Gadamax no se negará sin causa razonable y se entenderá otorgada si no hay observaciones dentro de los cinco (5) días hábiles siguientes. Los honorarios cubren íntegramente la preparación, la conducción y la licencia de la cláusula 9. Gadamax cubrirá los costos de producción; cualquier gasto de viaje, alojamiento u otro desembolso de la Contratista solo será reembolsable si Gadamax lo aprobó por escrito antes de incurrirlo.`
  },
  {
    t: "6. Liquidación, forma de pago e impuestos",
    c: `Gadamax cerrará cada mes calendario, emitirá a la Contratista una liquidación con el detalle de las piezas entregadas y le pagará dentro de los treinta (30) días siguientes, en dólares, por el método elegido por la Contratista (transferencia bancaria, PayPal, Wise, Zelle u otro acordado). Los honorarios de Host se liquidan en el mismo ciclo y por el mismo medio que sus ganancias como Guru. La Contratista presta los Servicios desde fuera de los Estados Unidos y entregará el Formulario W-8BEN; en consecuencia, sus honorarios constituyen ingreso de fuente extranjera y Gadamax no practicará retenciones de impuestos de los Estados Unidos. La Contratista es la única responsable de los impuestos, contribuciones y obligaciones que le correspondan en su país de residencia. Nada en este Contrato constituye asesoría fiscal.`
  },
  {
    t: "7. Revisión del esquema de honorarios",
    c: `Las Partes reconocen que este esquema por pieza es el punto de partida de una relación que esperan de largo plazo. Cada seis (6) meses, o antes si cualquiera lo solicita, revisarán de buena fe el volumen de piezas, los resultados y el alcance obtenidos, y podrán acordar por escrito un nuevo esquema —por ejemplo, un honorario fijo mensual combinado con honorarios por pieza distintos— mediante un anexo firmado por ambas Partes, que reemplazará la cláusula 5 desde la fecha que allí se indique. Mientras no se firme un anexo, rigen los honorarios de la cláusula 5.`
  },
  {
    t: "8. Naturaleza de la relación y no exclusividad",
    c: `La Contratista es una contratista independiente y no empleada, socia, agente ni representante legal de Gadamax. No tiene autoridad para obligar a Gadamax ni para hacer declaraciones en su nombre. Controla la manera, el método y el horario en que presta los Servicios, dentro de las fechas acordadas para cada pieza y de los estándares de calidad de la plataforma. Este Contrato no es exclusivo: la Contratista puede seguir desarrollando su programa, su consultoría, sus proyectos y cualquier otra actividad, con la sola limitación de las cláusulas 11 y 12. Gadamax, por su parte, puede trabajar con otros conductores, hosts o presentadores.`
  },
  {
    t: "9. Propiedad intelectual y licencia",
    c: `Las grabaciones, transmisiones, clips, transcripciones y demás materiales producidos en las piezas que la Contratista conduzca en ejercicio de este Contrato son obras producidas por encargo para Gadamax, que será su titular y podrá alojarlas, publicarlas, editarlas para formato, distribuirlas, promocionarlas y ponerlas a disposición en la plataforma Gurumba y en sus canales de difusión, sin límite de territorio ni de tiempo, incluso después de terminado el Contrato. La Contratista conserva la propiedad de su nombre, su marca personal, su programa «Bien-Estar con Ally», sus materiales preexistentes y todo contenido que cree fuera de este Contrato. Nada en esta cláusula transfiere a Gadamax derechos sobre las sesiones 1:1 de la Contratista como Guru, que nunca se graban.`
  },
  {
    t: "10. Nombre, imagen y voz",
    c: `La Contratista autoriza a Gadamax a usar su nombre, imagen, voz, biografía y trayectoria para identificarla como Host de Gurumba, presentarla en la plataforma y en los canales de Gurumba, y promocionar las piezas en las que participó. Gadamax se obliga a: (a) no usar inteligencia artificial u otros medios para atribuirle expresiones que no dijo; (b) no atribuirle respaldos, opiniones ni testimonios que no dio; (c) no grabar ni difundir sus sesiones privadas como Guru; y (d) al terminar el Contrato, cesar el uso de su imagen en nuevas promociones dentro de los treinta (30) días siguientes, sin perjuicio de mantener publicadas las piezas ya producidas conforme a la cláusula 9.`
  },
  {
    t: "11. Confidencialidad",
    c: `La Contratista puede conocer, con ocasión de los Servicios, información no pública de Gadamax, de Gurumba, de sus socios, de los gurus y de los usuarios —incluidos datos de negocio, cifras, planes de programación, contactos y contenido no publicado—. Se obliga a mantenerla en reserva, a usarla únicamente para prestar los Servicios y a no divulgarla a terceros sin autorización escrita, durante la vigencia del Contrato y por tres (3) años después. Esta obligación no alcanza a la información que sea de dominio público sin culpa de la Contratista, ni a la que deba revelarse por mandato de autoridad competente, en cuyo caso avisará previamente a Gadamax cuando la ley lo permita.`
  },
  {
    t: "12. No circunvención",
    c: `Durante la vigencia del Contrato y por veinticuatro (24) meses después, la Contratista no ofrecerá ni prestará por fuera de Gurumba servicios pagos de mentoría, cursos, eventos o contenidos a los gurus, clientes, empresas o usuarios que haya conocido a través de Gurumba, ni intermediará para que otros lo hagan, sin autorización escrita de Gadamax. Esta cláusula no restringe las relaciones profesionales que la Contratista tuviera con anterioridad, y así lo podrá acreditar, ni su actividad independiente con personas ajenas a la red de Gurumba.`
  },
  {
    t: "13. Estándares profesionales y cancelaciones",
    c: `La Contratista prestará los Servicios con profesionalismo, puntualidad y neutralidad editorial, respetando a los gurus y a la audiencia; evitará afirmaciones engañosas y garantías de resultados, y cumplirá las políticas de la plataforma y la ley aplicable. Si no puede atender una pieza ya programada, avisará con al menos cuarenta y ocho (48) horas de anticipación para reprogramarla o reemplazar la conducción; las ausencias sin aviso o las cancelaciones reiteradas facultan a Gadamax para terminar el Contrato conforme a la cláusula 14. Gadamax, a su vez, avisará con la misma anticipación si cancela o reprograma una pieza; una pieza cancelada por Gadamax con menos de veinticuatro (24) horas de anticipación, sin causa imputable a la Contratista, se pagará al cincuenta por ciento (50 %).`
  },
  {
    t: "14. Plazo y terminación",
    c: `Este Contrato rige desde su firma por un plazo inicial de doce (12) meses y se renovará automáticamente por períodos iguales, salvo que una de las Partes comunique a la otra por escrito, con al menos treinta (30) días de anticipación al vencimiento, su decisión de no renovarlo. Cualquiera de las Partes podrá además terminarlo en cualquier momento, sin expresión de causa, con treinta (30) días de aviso escrito. Gadamax podrá terminarlo de inmediato ante incumplimiento grave, conducta que dañe la reputación de Gurumba, fraude o violación de las cláusulas 11 o 12. En todos los casos se pagarán las piezas ya entregadas y las Partes cumplirán las piezas programadas dentro del período de aviso, salvo acuerdo distinto. Sobreviven a la terminación las cláusulas 6, 9, 10, 11, 12, 16, 17 y 18.`
  },
  {
    t: "15. Sin empleo ni beneficios",
    c: `La Contratista no tendrá derecho a salario, horas extras, seguro de desempleo, indemnizaciones laborales, seguro de salud, beneficios de jubilación, licencias pagadas ni ningún otro beneficio propio de una relación de empleo, con Gadamax ni con Gurumba, en los Estados Unidos ni en ningún otro país.`
  },
  {
    t: "16. Responsabilidad e indemnidad",
    c: `Ninguna de las Partes será responsable frente a la otra por daños indirectos, incidentales, consecuentes, punitivos, lucro cesante ni pérdida de oportunidades. La responsabilidad total de Gadamax bajo este Contrato se limita a los honorarios devengados y no pagados a la Contratista. Cada Parte mantendrá indemne a la otra frente a reclamos de terceros que se originen en su propio incumplimiento, negligencia o violación de la ley.`
  },
  {
    t: "17. Ley aplicable y controversias",
    c: `Este Contrato se rige por las leyes del Estado de Illinois, Estados Unidos de América, sin atender a sus normas de conflicto de leyes. Las Partes procurarán resolver de buena fe y por vía directa cualquier controversia dentro de los treinta (30) días siguientes a que una de ellas la plantee por escrito; agotada esa instancia, se someten a la jurisdicción de los tribunales estatales o federales del Estado de Illinois.`
  },
  {
    t: "18. Firma electrónica",
    c: `Las Partes acuerdan celebrar este Contrato por medios electrónicos y consienten el uso de registros y firmas electrónicas, de conformidad con la Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. § 7001 y siguientes) y la Uniform Electronic Transactions Act (UETA), así como con la Ley de Comercio Electrónico, Firmas Electrónicas y Mensajes de Datos del Ecuador. La escritura del nombre de la Contratista en el bloque de firma, junto con la aceptación expresa registrada en esta página, constituye una firma electrónica válida y vinculante con el mismo efecto que una firma manuscrita. El registro electrónico de la firma —fecha y hora, huella criptográfica de esta versión del documento y datos del firmante— constituye el original del Contrato; cada Parte podrá conservar una copia en PDF generada desde esta misma página.`
  },
  {
    t: "19. Acuerdo completo y notificaciones",
    c: `Este documento, junto con los anexos que las Partes firmen conforme a la cláusula 7, constituye el acuerdo íntegro entre ellas respecto de los Servicios de Host y reemplaza cualquier conversación o entendimiento previo sobre la misma materia. Solo podrá modificarse por escrito firmado por ambas Partes. Si alguna disposición fuera declarada inválida, las demás conservarán plena vigencia. Las notificaciones se harán por correo electrónico a las direcciones indicadas en el bloque de firma, y se tendrán por recibidas el día hábil siguiente a su envío.`
  }
];

/** Texto canónico sobre el que se calcula la huella firmada. */
export function textoCanonico() {
  return [
    `${TITULO} · versión ${VERSION} · ${FECHA_VERSION}`,
    PREAMBULO,
    ...CLAUSULAS.map((x) => `${x.t}\n${x.c}`),
    "Tarifas\n" + TARIFAS.map((x) => `${x.pieza}: USD ${x.monto} ${x.unidad}`).join("\n")
  ].join("\n\n");
}
