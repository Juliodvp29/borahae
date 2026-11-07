import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor } from '../lib/access'
import { seoFields } from '../lib/fields'
import { revalidateHooks } from '../lib/revalidate'

const { afterChange, afterDelete } = revalidateHooks([], (doc) => [
  '/',
  `/${doc.slug ?? ''}`,
])

/**
 * `pages`: páginas institucionales con slug fijo (p. ej. nosotros, legal).
 * Los slugs no se editan desde el admin para preservar las URLs del AGENTS §4.
 * Todo el texto es localizado; el coreano cae al español si falta.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    description: 'Páginas fijas del sitio (el slug no se edita para mantener URLs estables).',
  },
  access: {
    read: () => true,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOnly,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Título',
      admin: { description: 'Si falta el coreano, el sitio muestra el español.' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Definido por el desarrollador; determina la URL.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      label: 'Resumen',
      maxLength: 400,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      label: 'Contenido',
    },
    ...seoFields(),
  ],
}
