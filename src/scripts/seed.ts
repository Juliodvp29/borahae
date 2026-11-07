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
  await payload.create({ collection: 'pages', data: { ...data } as never })
  payload.logger.info({ msg: `pages/${slug}: creado.` })
}

async function ensureProgram(payload: Payload, data: Record<string, unknown>): Promise<void> {
  const slug = data.slug as string
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
    slug: 'nosotros',
    title: 'Nosotros',
    summary: `${DEMO_TAG} Presentación institucional de BORAHAE: historia, propósito, misión y visión.`,
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


