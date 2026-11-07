import type { PayloadRequest } from 'payload'

/**
 * Control de acceso por rol (AGENTS.md §5.2):
 * - `admin` (desarrollador): usuarios, estructura, configuración técnica.
 * - `editor` (representante legal): contenido y ajustes de negocio.
 *
 * `contact-submissions` y `event-registrations` NUNCA se exponen por la API
 * pública: su creación ocurre únicamente desde endpoints de servidor (Fase 5)
 * con `overrideAccess: true`, por eso su `create` es falso para todos.
 *
 * Se tipa como acceso booleano (no queries `Where`) para que el mismo helper
 * sirva en `access` de colecciones, globals y campos.
 */

type BooleanAccess = ({ req }: { req: PayloadRequest }) => boolean
type BooleanFieldAccess = ({ req }: { req: PayloadRequest }) => boolean

/** El rol del usuario autenticado (tipado antes de regenerar payload-types). */
function role(user: unknown): string | undefined {
  return (user as { role?: string } | null | undefined)?.role
}

/** Solo administradores. */
export const adminOnly: BooleanAccess = ({ req }) => role(req.user) === 'admin'

/** Administradores y editores. */
export const adminOrEditor: BooleanAccess = ({ req }) => {
  const userRole = role(req.user)
  return userRole === 'admin' || userRole === 'editor'
}

/** Nadie: la escritura pasa por endpoints de servidor con overrideAccess.
 * Útil en `create`/`update` de colecciones privadas. */
export const deniedForAll: BooleanAccess = () => false

/** A nivel de campo: solo administradores (p. ej. el 18+ fijo en events). */
export const adminOnlyField: BooleanFieldAccess = ({ req }) =>
  role(req.user) === 'admin'
