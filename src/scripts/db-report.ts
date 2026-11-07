/**
 * Informe de conteo por colección. Bin script (npx payload db-report) —
 * NO modifica datos.
 */
import { getPayload } from 'payload'
import type { SanitizedConfig } from 'payload'

export async function script(siteConfig: SanitizedConfig): Promise<void> {
  const payload = await getPayload({ config: siteConfig })
  const users = await payload.count({ collection: 'users', overrideAccess: true })
  const media = await payload.count({ collection: 'media', overrideAccess: true })
  const pages = await payload.count({ collection: 'pages', overrideAccess: true })
  const programs = await payload.count({ collection: 'programs', overrideAccess: true })
  const events = await payload.count({ collection: 'events', overrideAccess: true })
  const tours = await payload.count({ collection: 'tours', overrideAccess: true })

  // `payload run` silencia stdout; escribir a archivo temporal hace la
  // salida verificable siempre.
  const resumen = [
    `users: ${users.totalDocs}`,
    `media: ${media.totalDocs}`,
    `pages: ${pages.totalDocs}`,
    `programs: ${programs.totalDocs}`,
    `events: ${events.totalDocs}`,
    `tours: ${tours.totalDocs}`,
  ]
  console.info(resumen.join(' | '))
}
