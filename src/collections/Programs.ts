import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor } from '../lib/access'
import { seoFields } from '../lib/fields'
import { revalidateHooks } from '../lib/revalidate'

const { afterChange, afterDelete } = revalidateHooks(
  ['/programas'],
  (doc) => [`/programas/${doc.slug ?? ''}`],
)

/**
 * `programs`: curso de coreano, becas y talleres. Los slugs son fijos
 * (rutas de la spec); el editor edita contenido, no estructura.
 * Estado 'upcoming' → la página muestra "próximamente".
 */
export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'state', '_status'],
    description: 'Programas del sitio. El slug es fijo (rutas estables); edita el contenido.',
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
      label: 'Nombre del programa',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Determina la URL. Fijado con el seed.' },
    },
    {
      name: 'state', // evita colisionar con el enum "_status" de publicación
      type: 'select',
      label: 'Estado del programa',
      required: true,
      defaultValue: 'upcoming',
      options: [
        { label: 'Próximamente', value: 'upcoming' },
        { label: 'Activo', value: 'active' },
        { label: 'Pausado', value: 'paused' },
      ],
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
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen principal',
    },
    ...seoFields(),
  ],
}
