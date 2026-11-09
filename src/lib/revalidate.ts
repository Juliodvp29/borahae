import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  Locale,
} from 'payload'

/**
 * Revalidación de rutas públicas al publicar/despublicar contenido.
 * Siempre regenera las rutas **en ambos idiomas** (AGENTS.md §5.2).
 *
 * IMPORTANTE: `next/cache` se importa de forma dinámica dentro del hook —
 * el CLI de Payload (typegen/migraciones) corre fuera del contexto Next y
 * fallaría con un import estático (ERR_MODULE_NOT_FOUND).
 */

export const SITE_LOCALES = ['es', 'ko'] as const

/** Envuelve un prefijo por idioma: '/programas' → ['/es/programas', '/ko/programas']. */
export function withLocales(paths: string[]): string[] {
  return SITE_LOCALES.flatMap((locale) => paths.map((path) => `/${locale}${path}`))
}

type DocLike = {
  _status?: string
  slug?: string
}

async function revalidate(direct: string[]): Promise<void> {
  // Sandbox del CLI: si no existe el contexto Next, se ignora silenciosamente
  // (log de error ya no aplica; revalidatePath no es necesario allí).
  const { revalidatePath } = await import('next/cache')
  for (const path of direct) revalidatePath(path)
}

export function revalidateHooks(
  /** Rutas base a revalidar para cualquier documento. */
  fixedPaths: string[] = [],
  /** Rutas adicionales derivadas del documento (p. ej. su detalle por slug). */
  pathForDoc: (doc: DocLike) => string[] = () => [],
): { afterChange: CollectionAfterChangeHook; afterDelete: CollectionAfterDeleteHook } {
  const compute = (doc: DocLike): string[] => {
    // Con borradores activos: solo revalidar al publicar; los cambios en
    // borrador no afectan el sitio público.
    if (doc._status && doc._status !== 'published') return []
    return withLocales([...fixedPaths, ...pathForDoc(doc)])
  }

  return {
    afterChange: async ({ doc, req }) => {
      const paths = compute(doc as DocLike)
      if (paths.length === 0) return
      try {
        await revalidate(paths)
      } catch (error) {
        // El guardado no debe fallar por la revalidación.
        req.payload.logger.error({
          msg: 'No se pudieron revalidar rutas',
          err: error,
          paths,
        })
      }
    },
    afterDelete: async ({ doc, req }) => {
      const paths = compute(doc as DocLike)
      if (paths.length === 0) return
      try {
        await revalidate(paths)
      } catch (error) {
        req.payload.logger.error({
          msg: 'No se pudieron revalidar rutas tras eliminar',
          err: error,
          paths,
        })
      }
    },
  }
}

/**
 * Rutas públicas actuales del sitio (AGENTS §4). Se usa para revalidar
 * el layout entero cuando cambia una global (site-settings).
 */
export const PUBLIC_ROUTES = [
  '/',
  '/nosotros',
  '/programas',
  '/programas/curso-coreano',
  '/programas/becas',
  '/programas/talleres',
  '/viajes',
  '/viajes/[slug]',
  '/eventos',
  '/eventos/[slug]',
  '/galeria',
  '/donaciones',
  '/patrocinio',
  '/contacto',
  '/legal',
]

export type LocaleCode = (typeof SITE_LOCALES)[number]
export type { Locale }

/**
 * Hook de revalidación para **globals** (p. ej. `site-settings`). La global
 * alimenta el header/footer de todas las páginas públicas, así que al
 * guardarla se revalida el listado completo de rutas en ambos idiomas.
 */
export function revalidateGlobalHooks(
  fixedPaths: string[],
): { afterChange: GlobalAfterChangeHook[] } {
  return {
    afterChange: [
      async ({ req }) => {
        // Las globals no tienen _status: revalidar siempre el listado completo.
        const paths = withLocales(fixedPaths)
        try {
          await revalidate(paths)
        } catch (error) {
          req.payload.logger.error({
            msg: 'No se pudieron revalidar rutas de la global',
            err: error,
            paths,
          })
        }
      },
    ],
  }
}
