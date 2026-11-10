/**
 * Datos de ejemplo (seed) — roadmap Fase 3.
 *
 * Todo el contenido creado aquí es FICTICIO o está marcado como tal, excepto
 * los textos aprobados por el cliente (docs/Contenido_Cliente_Mision_Vision.md).
 * Ejecutar SOLO contra el entorno de desarrollo:
 *
 *   npx payload --use-swc run ./src/scripts/seed.ts
 *
 * Idempotente: salta registros que ya existen (por slug/email).
 *
 * Cuentas que gestiona este script:
 *  - No crea administradores: el admin se restaura desde el respaldo o se crea
 *    a mano. Si EDITOR_TEST_EMAIL / EDITOR_TEST_PASSWORD están definidos (o usa
 *    el valor demo por defecto), crea una cuenta editor de prueba.
 *    La contraseña demo es TEMPORAL solo para desarrollo: NO reutilizar.
 */
import { getPayload } from 'payload'
import type { Payload, SanitizedConfig } from 'payload'

const DEMO_TAG = '[CONTENIDO-FICTICIO-DEMO]'

/* ------------------------------------------------------------------ */
/* Constructor de contenido Lexical (nodos serializados mínimos).      */
/* ------------------------------------------------------------------ */

type LexText = { text: string; format?: number; [k: string]: unknown }
type LexNode = Record<string, unknown>

function lexText(t: string, extra: Partial<LexText> = {}): LexText {
  // `type: 'text'` es obligatorio: sin él el componente RichText del
  // frontend renderiza "unknown node".
  return { type: 'text', text: t, format: 0, indent: 0, style: '', mode: 'normal', detail: 0, version: 1, ...extra }
}

function lexPara(t: string): LexNode {
  return {
    type: 'paragraph', format: '', indent: 0, version: 1,
    direction: 'ltr', textFormat: 0, textStyle: '',
    children: [lexText(t)],
  }
}

function lexHeading(t: string, tag: 'h2' | 'h3'): LexNode {
  return {
    type: 'heading', tag, format: '', indent: 0, version: 1,
    direction: 'ltr', children: [lexText(t)],
  }
}

function lexList(items: string[], listType: 'bullet' | 'number'): LexNode {
  const children = items.map((t, i) => ({
    type: 'listitem', format: '', indent: 0, version: 1,
    // El validador exige value numérico infinito (0 en bullets, 1..n en ordenados).
    value: listType === 'number' ? i + 1 : 0,
    // Los hijos de un listitem son párrafos (texto suelto no valida).
    children: [lexPara(t)],
    direction: 'ltr',
  }))
  // El validador exige tag: 'ol' | 'ul' (cadena vacía falla al publicar).
  return {
    type: 'list', listType, tag: listType === 'number' ? 'ol' : 'ul',
    format: '', indent: 0, version: 1, direction: 'ltr', children,
  }
}

function lexDoc(nodes: LexNode[]): Record<string, unknown> {
  return {
    root: {
      type: 'root', format: '', indent: 0, version: 1,
      direction: 'ltr', children: nodes,
    },
  }
}

function estadoVacio(c: unknown): boolean {
  const root = (c as { root?: { children?: unknown[] } } | null | undefined)?.root
  return !root || !Array.isArray(root.children) || root.children.length === 0
}

/** Campos localizados de un doc que se siembran en coreano (fallback es). */
type DataKo = {
  title?: string
  summary?: string
  content?: unknown
}

/**
 * Escribe los campos localizados en el locale `ko` cuando el doc aún no
 * tiene valor propio (con fallbackLocale off para detectar el estado real;
 * los textos coreanos requieren revisión humana — AGENTS §5.1).
 */
async function applyLocaleKo(
  payload: Payload,
  collection: 'pages',
  id: number | string,
  ko: DataKo,
): Promise<void> {
  const r = await payload.find({
    collection,
    where: { id: { equals: id } },
    locale: 'ko',
    fallbackLocale: 'none',
    limit: 1,
    overrideAccess: true,
    depth: 0,
  })
  const existente = r.docs[0]
  const updates: Record<string, unknown> = {}
  if (ko.title !== undefined && !existente?.title) updates.title = ko.title
  if (ko.summary !== undefined && !existente?.summary) updates.summary = ko.summary
  if (ko.content !== undefined && estadoVacio(existente?.content)) {
    updates.content = ko.content
  }
  if (Object.keys(updates).length === 0) return
  await payload.update({
    collection,
    id,
    locale: 'ko',
    data: updates as never,
    depth: 0,
  })
  payload.logger.info({ msg: `pages/${collection}/${id}: locale ko completado.` })
}

async function ensurePage(payload: Payload, data: Record<string, unknown>): Promise<void> {
  const slug = data.slug as string
  const existentes = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existentes.docs.length > 0) {
    payload.logger.info({ msg: `pages/${slug}: ya existe, se omite.` })
    return
  }
  // `as never`: DatatypeFromCollectionSlug es una unión que exige `draft`
  // cuando se incluye `_status`; el cast simplifica el helper genérico del seed.
  const { ko, ...esData } = data as { ko?: DataKo } & Record<string, unknown>
  const creado = await payload.create({ collection: 'pages', data: esData as never })
  if (ko) await applyLocaleKo(payload, 'pages', creado.id, ko)
  payload.logger.info({ msg: `pages/${slug}: creado.` })
}

/**
 * Crea la página si no existe; si ya existe, la completa:
 *  - `summary`: solo si está vacío o aún lleva el tag DEMO (el texto real
 *    aprobado reemplaza el marcador del seed anterior).
 *  - `content`: solo si está vacío — no pisa ediciones del editor en el admin.
 */
async function ensurePageFill(
  payload: Payload,
  data: Record<string, unknown>,
): Promise<void> {
  const slug = data.slug as string
  const existentes = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  const existente = existentes.docs[0]
  if (!existente) {
    await payload.create({ collection: 'pages', data: { ...data } as never })
    payload.logger.info({ msg: `pages/${slug}: creado.` })
    return
  }

  const updates: Record<string, unknown> = {}
  const summary = data.summary as string | undefined
  if (
    summary &&
    (!existente.summary || existente.summary.includes(DEMO_TAG))
  ) {
    updates.summary = summary
  }
  if (data.content !== undefined && estadoVacio(existente.content)) {
    updates.content = data.content
  }
  if (Object.keys(updates).length === 0) {
    payload.logger.info({ msg: `pages/${slug}: ya existe, se omite.` })
  } else {
    await payload.update({
      collection: 'pages',
      id: existente.id,
      data: updates as never,
      depth: 0,
    })
    payload.logger.info({ msg: `pages/${slug}: actualizado (campos vacíos).` })
  }
  const ko = (data as { ko?: DataKo }).ko
  if (ko) await applyLocaleKo(payload, 'pages', existente.id, ko)
}

async function ensureProgram(payload: Payload, data: Record<string, unknown>): Promise<void> {  const slug = data.slug as string
  const existentes = await payload.find({
    collection: 'programs',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existentes.docs.length > 0) {
    payload.logger.info({ msg: `programs/${slug}: ya existe, se omite.` })
    return
  }
  await payload.create({ collection: 'programs', data: { ...data } as never })
  payload.logger.info({ msg: `programs/${slug}: creado.` })
}

async function ensureEditorAccount(payload: Payload): Promise<void> {
  const email = process.env.EDITOR_TEST_EMAIL ?? 'editor.demo@borahae.dev'
  const existentes = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })
  if (existentes.docs.length > 0) {
    payload.logger.info({ msg: `users/${email}: ya existe, se omite.` })
    return
  }
  await payload.create({
    collection: 'users',
    data: {
      email,
      password: process.env.EDITOR_TEST_PASSWORD ?? 'Demo-pls-cambiarme-2030',
      role: 'editor',
      name: '[DEMO] Editor de prueba',
    },
    overrideAccess: true,
  })
  payload.logger.info({ msg: `users/${email}: editor de prueba creado (contraseña TEMPORAL para dev).` })
}

/**
 * Punto de entrada como bin script (`npx payload seed`): el CLI entrega la
 * config ya resuelta — importarla aquí de nuevo causa un deadlock bajo `run`.
 */
export async function script(seedConfig: SanitizedConfig): Promise<void> {
  const payload = await getPayload({ config: seedConfig })

  await ensureEditorAccount(payload)

  await ensurePage(payload, {
    slug: 'inicio',
    title: 'Intercambio cultural entre Colombia y Corea del Sur',
    // copy visual autorizado del cliente (nota 2026-11-06: libertad creativa
    // para copy dentro de la idea principal de inclusión + intercambio).
    summary:
      'Promovemos y difundimos la cultura coreana a través del Hallyu, la gastronomía y la sociedad, en un espacio de aprendizaje y conexión plenamente inclusivo.',
    content: lexDoc([
      lexPara(
        'BORAHAE es una entidad sin ánimo de lucro dedicada al intercambio cultural entre Colombia y Corea del Sur. Acompañamos el entusiasmo por la cultura coreana con programas concretos: clases de idioma, talleres, eventos comunitarios y becas.',
      ),
      lexPara(
        'Nuestro proyecto insignia es la misión cultural a Seúl, diseñada bajo un modelo logístico de inclusión general: un viaje donde la pasión por Corea se convierte en experiencia de aprendizaje, diplomacia ciudadana y encuentro entre dos comunidades.',
      ),
    ]),
    // Traducción coreana del mismo copy, provista por el desarrollador el
    // 2026-11-10; pendiente de revisión humana formal (AGENTS §5.1).
    ko: {
      title: '콜롬비아와 대한민국 간의 문화 교류',
      summary:
        '한류를 비롯한 음식 문화와 사회 전반을 통해 한국 문화를 알리고 확산하며, 모두가 온전히 포용되는 배움과 연결의 공간을 만들어 갑니다.',
      content: lexDoc([
        lexPara(
          'BORAHAE는 콜롬비아와 대한민국 간의 문화 교류를 위해 설립된 비영리 단체입니다. 한국 문화에 대한 열정을 구체적인 프로그램으로 실현하며, 한국어 강좌, 워크숍, 지역사회 행사 및 장학금 지원 등을 통해 양국 간의 문화적 이해와 교류를 촉진합니다.',
        ),
        lexPara(
          'BORAHAE의 대표 프로젝트는 서울 문화 사절단 프로그램입니다. 이 프로젝트는 모든 참가자를 포용하는 통합적인 물류 운영 모델을 기반으로 기획되었습니다. 한국을 향한 열정이 배움의 경험이자 시민 외교의 실천으로 이어지고, 서로 다른 두 공동체가 만나 소통하고 교류하는 특별한 여정입니다.',
        ),
      ]),
    },
  })

  await ensurePageFill(payload, {
    slug: 'nosotros',
    title: 'Nosotros',
    // Textos reales aprobados por el cliente (docs/Contenido_Cliente_Mision_Vision.md).
    summary:
      'Misión, visión y objetivos de BORAHAE: inclusión y accesibilidad como pilares del intercambio cultural Colombia—Corea del Sur.',
    content: lexDoc([
      lexHeading('Misión', 'h2'),
      lexPara(
        'Promover y difundir la cultura coreana a través del fenómeno Hallyu, la gastronomía y la sociedad, construyendo un espacio de aprendizaje y conexión plenamente inclusivo. Nos comprometemos a diseñar entornos accesibles, dinámicos y seguros que respeten y valoren la diversidad. Buscamos que cada actividad sea un puente cultural donde todas las personas, sin importar sus formas de percibir y procesar el mundo, puedan participar, aportar y desarrollar su máximo potencial en igualdad de condiciones.',
      ),
      lexHeading('Visión', 'h2'),
      lexPara(
        'Consolidarnos como el proyecto referente de intercambio cultural colombo-coreano que lidera la inclusión social y la accesibilidad metodológica. Para el año 2027, aspiramos a ser un modelo de diplomacia pública donde la pasión por la cultura y la gastronomía coreana sirva como motor de integración para la comunidad diversidad. Queremos demostrar que la diversidad de mentes enriquece el entendimiento global, creando metodologías replicables que unan a ambas naciones bajo los valores del respeto, la equidad y la empatía de sus sociedades.',
      ),
      lexHeading('Objetivo general', 'h2'),
      lexPara(
        'Desplegar una Misión Cultural y de Intercambio Internacional a Seúl, Corea del Sur, integrada por una delegación de 25 personas procedentes de Colombia, con el fin de asimilar de primera mano las dinámicas socioculturales, la industria del entretenimiento (Hallyu) y la gastronomía tradicional (Hansik), bajo un modelo logístico de inclusión general y protección de la salud mental.',
      ),
      lexHeading('Objetivos específicos', 'h2'),
      lexList(
        [
          'Ejecutar un itinerario de inmersión cultural de 12 días en Seúl que balancee visitas a industrias creativas de vanguardia con espacios de desconexión en entornos naturales e históricos.',
          'Implementar metodologías de aprendizaje activo e inclusión cognitiva en los talleres de gastronomía tradicional (Hansik), permitiendo que todos los participantes asimilen la cocina como una terapia de atención plena (Mindful Eating).',
          'Establecer espacios de diálogo formal y diplomacia ciudadana con organizaciones juveniles y centros comunitarios coreanos para intercambiar experiencias sobre el manejo de la presión social y el fomento del bienestar psicológico.',
          'Garantizar un entorno de cero barreras y de contención emocional continuo durante toda la misión, utilizando coordinadores especializados en primeros auxilios psicológicos y gestión de grupos vulnerables o neurodivergentes.',
        ],
        'number',
      ),
      lexHeading('Pilares', 'h2'),
      lexList(
        [
          'Dimensión Psicosocial: canalizar el entusiasmo y la pasión por Corea hacia una experiencia académica, vivencial y transformadora que aleje a los participantes de lógicas de aislamiento y fomente liderazgos comunitarios.',
          'Dimensión de Inclusión Universal: democratizar el acceso a intercambios internacionales de gran envergadura mediante un diseño logístico que contempla la inclusión general, permitiendo que personas con diversas realidades psicosociales puedan viajar en condiciones de absoluta dignidad.',
          'Dimensión Diplomática Ciudadana: robustecer la relación bilateral entre Colombia y Corea del Sur desde las bases ciudadanas, dinamizando el concepto de «Soft Power» o poder blando impulsado por el gobierno coreano.',
        ],
        'bullet',
      ),
    ]),
  })

  await ensurePage(payload, {
    slug: 'legal',
    title: 'Información legal',
    summary: `${DEMO_TAG} Índice de textos legales. Contenido real pendiente del cliente [PENDIENTE-CLIENTE].`,
  })

  await ensureProgram(payload, {
    slug: 'curso-coreano',
    title: 'Curso de coreano',
    state: 'active',
    summary: `${DEMO_TAG} Clases de idioma coreano para principiantes e intermedios, con enfoque comunicativo y horarios compatibles con jornadas de trabajo.`,
  })

  await ensureProgram(payload, {
    slug: 'becas',
    title: 'Becas',
    state: 'upcoming',
    summary: `${DEMO_TAG} Convocatoria de becas de estudio del idioma y de intercambio, con criterios públicos que priorizan la inclusión.`,
  })

  await ensureProgram(payload, {
    slug: 'talleres',
    title: 'Talleres',
    state: 'upcoming',
    summary: `${DEMO_TAG} Talleres de cocina coreana, caligrafía, K-pop y historia, gratuitos o de bajo costo, abiertos al público.`,
  })

  // Evento demo con cupo limitado y 18+ fijo (fechas relativas para que no caduque).
  const existingEvents = await payload.count({ collection: 'events' })
  if (existingEvents.totalDocs === 0) {
    const dateStart = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
    const dateEnd = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString()
    await payload.create({
      collection: 'events',
      data: {
        title: 'Conversatorio: Hallyu y comunidad [DEMO]',
        slug: 'conversatorio-hallyu-demo',
        modality: 'hibrido',
        location: 'Café cultural (por confirmar) y sala virtual',
        dateStart,
        dateEnd,
        summary: `${DEMO_TAG} Encuentro abierto sobre el impacto del Hallyu en la comunidad colombiana. Inscripción gratuita para mayores de 18 años.`,
        capacityEnabled: true,
        capacity: 30,
        requiresAdultConfirmation: true,
        _status: 'published',
      },
    })
    payload.logger.info({ msg: 'events/conversatorio-hallyu-demo: creado.' })
  } else {
    payload.logger.info({ msg: 'events: ya hay datos, se omite.' })
  }

  // Tour con texto REAL aprobado por el cliente (docs/Contenido_Cliente_Mision_Vision.md):
  // el resumen es el objetivo general verbatim — no es ficticio.
  const existingTours = await payload.count({ collection: 'tours' })
  if (existingTours.totalDocs === 0) {
    await payload.create({
      collection: 'tours',
      data: {
        title: 'BORAHAE TRIP 2027',
        slug: 'borahae-trip-2027',
        destination: 'Seúl, Corea del Sur',
        dateStart: new Date('2027-06-06T09:00:00-05:00').toISOString(),
        dateEnd: new Date('2027-06-21T18:00:00-05:00').toISOString(),
        state: 'upcoming',
        summary:
          'Misión Cultural y de Intercambio Internacional a Seúl, integrada por una delegación de 25 personas procedentes de Colombia, para conocer de primera mano las dinámicas socioculturales, la industria del entretenimiento (Hallyu) y la gastronomía tradicional (Hansik), con un modelo logístico de inclusión general y protección de la salud mental.',
        priceNote: 'Consultar precios y condiciones por correo [PENDIENTE-CLIENTE]',
        _status: 'published',
      },
    })
    payload.logger.info({ msg: 'tours/borahae-trip-2027: creado (texto del objetivo general del cliente).' })
  } else {
    payload.logger.info({ msg: 'tours: ya hay datos, se omite.' })
  }

  // Toggles de negocio: deliberadamente todos apagados hasta que el cliente decida.
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      galleryEnabled: false,
      sponsorshipEnabled: false,
      whatsAppEnabled: false,
    },
    overrideAccess: true,
  })
  payload.logger.info({ msg: 'site-settings: toggles en false.' })

  payload.logger.info({ msg: 'Seed completado.' })
}


