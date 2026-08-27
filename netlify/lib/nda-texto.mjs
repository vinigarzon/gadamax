/**
 * Gadamax · Acuerdo de confidencialidad (NDA) — B. Braun
 *
 * El texto vive acá como única fuente de verdad: la página lo dibuja desde
 * este archivo y la función calcula la huella (hash) sobre esto mismo, de modo
 * que el registro de firma queda atado a la versión exacta que se firmó.
 * Cualquier cambio de texto debe subir VERSION.
 */

export const VERSION = "1.0";
export const FECHA_VERSION = "27 de agosto de 2026";

export const GADAMAX = {
  razon: "Gadamax LLC",
  descripcion: "sociedad de responsabilidad limitada constituida bajo las leyes del Estado de Illinois, Estados Unidos de América",
  direccion: "2735 Hassert Blvd, Ste 135 #874, Naperville, IL 60564, Estados Unidos",
  firmante: "Marco Garzón",
  cargo: "Managing Member",
  correo: "mvg@gadamax.com"
};

export const TITULO = "Acuerdo Mutuo de Confidencialidad";

export const PREAMBULO = `Este Acuerdo Mutuo de Confidencialidad (el «Acuerdo») se celebra entre ${GADAMAX.razon}, ${GADAMAX.descripcion}, con domicilio en ${GADAMAX.direccion} («Gadamax»), y la entidad identificada en el bloque de firma de este documento (la «Contraparte»). Gadamax y la Contraparte se denominan conjuntamente las «Partes» y cada una, indistintamente, la «Parte Reveladora» cuando entrega información y la «Parte Receptora» cuando la recibe.`;

export const CLAUSULAS = [
  {
    t: "1. Propósito",
    c: `Las Partes desean intercambiar información con el fin de evaluar, diseñar y eventualmente ejecutar un proyecto de automatización del proceso de entrada de pedidos e integración de sistemas de la Contraparte y sus afiliadas en Ecuador, Colombia y Venezuela (el «Propósito»). Este Acuerdo protege la información que se intercambie con ocasión del Propósito.`
  },
  {
    t: "2. Información Confidencial",
    c: `«Información Confidencial» significa toda información no pública que una Parte revele a la otra, en cualquier formato (documentos, archivos, correos, fotografías, accesos a sistemas o verbalmente), relacionada con el Propósito, incluyendo sin limitación: pedidos de clientes y sus datos, maestros de clientes y de materiales, listas y condiciones de precios, contratos y licitaciones, volúmenes y métricas de operación, información técnica sobre sistemas (incluidos SAP y el ERP local), procesos internos, y cualquier análisis o documento que la Parte Receptora prepare a partir de esa información. La Información Confidencial no requiere estar marcada como tal para quedar protegida.`
  },
  {
    t: "3. Obligaciones de la Parte Receptora",
    c: `La Parte Receptora se obliga a: (a) usar la Información Confidencial exclusivamente para el Propósito; (b) no divulgarla a terceros sin consentimiento previo y escrito de la Parte Reveladora; (c) protegerla con al menos el mismo grado de cuidado con que protege su propia información confidencial, y nunca menos que un cuidado razonable; y (d) limitar el acceso a sus empleados, asesores o contratistas que necesiten conocerla para el Propósito y que estén sujetos a obligaciones de confidencialidad al menos tan protectoras como las de este Acuerdo, respondiendo la Parte Receptora por el cumplimiento de dichas personas.`
  },
  {
    t: "4. Exclusiones",
    c: `No constituye Información Confidencial aquella que la Parte Receptora demuestre que: (a) era o llegó a ser de dominio público sin incumplimiento de este Acuerdo; (b) ya obraba lícitamente en su poder antes de recibirla; (c) fue recibida lícitamente de un tercero sin obligación de confidencialidad; o (d) fue desarrollada de forma independiente sin uso de la Información Confidencial. Si una autoridad competente exige la divulgación, la Parte Receptora podrá divulgar lo estrictamente requerido, notificando previamente a la Parte Reveladora cuando la ley lo permita, para que esta pueda procurar medidas de protección.`
  },
  {
    t: "5. Datos personales",
    c: `En la medida en que la Información Confidencial incluya datos personales, las Partes procurarán su anonimización o seudonimización previa a la entrega. Los datos personales que aun así se compartan serán tratados únicamente para el Propósito y conforme a la normativa aplicable, incluyendo la Ley Orgánica de Protección de Datos Personales de Ecuador y la Ley 1581 de 2012 de Colombia, según corresponda.`
  },
  {
    t: "6. Propiedad y devolución",
    c: `La Información Confidencial es y seguirá siendo propiedad de la Parte Reveladora. Nada en este Acuerdo transfiere derechos de propiedad intelectual ni concede licencias, salvo el uso limitado necesario para el Propósito. A solicitud escrita de la Parte Reveladora, la Parte Receptora devolverá o destruirá la Información Confidencial y certificará su destrucción, pudiendo conservar una copia únicamente para fines de cumplimiento legal o archivo regulatorio, sujeta a este Acuerdo mientras exista.`
  },
  {
    t: "7. Vigencia",
    c: `Este Acuerdo rige desde su firma y por tres (3) años. Las obligaciones de confidencialidad sobre la Información Confidencial recibida durante la vigencia sobrevivirán por cinco (5) años contados desde la terminación, y respecto de secretos empresariales, mientras conserven tal carácter conforme a la ley aplicable.`
  },
  {
    t: "8. Sin otras obligaciones",
    c: `Este Acuerdo no obliga a ninguna de las Partes a celebrar contrato alguno, a revelar información determinada, ni a abstenerse de negociar con terceros. La Información Confidencial se entrega «tal cual», sin garantía de exactitud o completitud, sin perjuicio de la buena fe de las Partes.`
  },
  {
    t: "9. Incumplimiento",
    c: `Las Partes reconocen que la divulgación no autorizada de Información Confidencial puede causar un daño irreparable no compensable únicamente con dinero, por lo que la Parte Reveladora podrá solicitar medidas cautelares o de cumplimiento específico, además de las demás acciones que le correspondan en derecho.`
  },
  {
    t: "10. Firma electrónica",
    c: `Las Partes acuerdan celebrar este Acuerdo por medios electrónicos y consienten el uso de registros y firmas electrónicas, de conformidad con la Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. § 7001 y siguientes) y la Uniform Electronic Transactions Act (UETA), así como con las normas de comercio electrónico aplicables en el domicilio de la Contraparte. La escritura del nombre del firmante en el bloque de firma, junto con la aceptación expresa registrada en esta página, constituye una firma electrónica válida y vinculante con el mismo efecto que una firma manuscrita. El registro electrónico de la firma —incluyendo fecha y hora, y la huella criptográfica de esta versión del documento— constituye el original del Acuerdo.`
  },
  {
    t: "11. Ley aplicable",
    c: `Este Acuerdo se rige por las leyes del Estado de Illinois, Estados Unidos de América, sin atender a sus normas de conflicto de leyes. Las Partes procurarán resolver de buena fe cualquier controversia antes de acudir a los tribunales competentes.`
  },
  {
    t: "12. Acuerdo completo",
    c: `Este documento constituye el acuerdo íntegro entre las Partes respecto de su objeto y reemplaza cualquier entendimiento previo sobre la misma materia. Solo podrá modificarse por escrito firmado por ambas Partes. Si alguna disposición fuera declarada inválida, las demás conservarán plena vigencia.`
  }
];

/** Texto canónico sobre el que se calcula la huella firmada. */
export function textoCanonico() {
  return [
    `${TITULO} · versión ${VERSION} · ${FECHA_VERSION}`,
    PREAMBULO,
    ...CLAUSULAS.map((x) => `${x.t}\n${x.c}`)
  ].join("\n\n");
}
