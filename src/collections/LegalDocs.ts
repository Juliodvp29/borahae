import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor } from '../lib/access'
import { seoFields } from '../lib/fields'
import { revalidateHooks } from '../lib/revalidate'

/**
 * Los 3 únicos documentos legales de la fase 1 (AGENTS §4). El slug es
 * radio fijo: el editor no crea slugs nuevos ni borra el conocimiento de
 * estas URLs (el consentimiento del formulario apunta a la política).
 */
export const LEGAL_SLUG_OPTIONS = [
  {
    label: 'Política de tratamiento de datos',
    value: 'politica-de-tratamiento-de-datos',
  },
  { label: 'Términos y condiciones', value: 'terminos-y-condiciones' },
  { label: 'Condiciones de viaje', value: 'condiciones-de-viaje' },
] as const

const { afterChange, afterDelete } = revalidateHooks(
  ['/legal'],
  (doc) => [`/legal/${doc.slug ?? ''}`],
)

/**
 * `legal-docs`: textos legales es/ko editados desde /admin por el editor
 * (o el admin), con trazabilidad de versión. REGLA (AGENTS §5.1 y §10):
 * el contenido lo aprueba el cliente — nada se redacta desde el código;
 * mientras un documento no se publique, su ruta muestra el estado
 * "pendiente" en lugar de inventar texto.
 */
export const LegalDocs: CollectionConfig = {
  slug: 'legal-docs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'version', '_status'],
    description:
      'Textos legales del sitio. Publica solo contenido aprobado por el cliente; la versión quedará referenciada en el consentimiento del formulario de contacto cuando sea la política de datos.',
  },
  access: {
    read: () => true,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOnly,
  },
  versions: { drafts: true },
  hooks: { afterChange: [afterChange], afterDelete: [afterDelete] },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Título',
      required: true,
      admin: { description: 'Si falta el coreano, el sitio muestra el español.' },
    },
    {
      name: 'slug',
      type: 'radio',
      label: 'Documento',
      required: true,
      options: [...LEGAL_SLUG_OPTIONS],
      admin: {
        description:
          'Determina la URL /legal/[documento]. Un documento por opción (p. ej. upsert: guardar sobre el slug existente).',
      },
    },
    {
      name: 'version',
      type: 'text',
      label: 'Versión',
      maxLength: 40,
      admin: {
        description:
          'Identificador del texto aprobado, p. ej. "2026-06-01-v1". Para la política de tratamiento de datos queda referenciado en cada consentimiento del formulario de contacto.',
      },
    },
    {
      name: 'effectiveDate',
      type: 'date',
      label: 'Vigente desde',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: 'Contenido',
    },
    ...seoFields(),
  ],
}
