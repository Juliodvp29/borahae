import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor } from '../lib/access'
import { revalidateHooks } from '../lib/revalidate'

const { afterChange, afterDelete } = revalidateHooks(['/galeria'])

/**
 * `gallery`: fotos autorizadas publicadas en la galería. La sección entera
 * solo se muestra si `site-settings.galleryEnabled` está activo.
 */
export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['image', 'caption', 'order'],
    description: 'Solo fotos con autorización de uso del cliente.',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Foto',
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      label: 'Pie de foto',
      admin: { description: 'Opcional; si falta el coreano se usa el español.' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Orden',
      admin: { position: 'sidebar', step: 10 },
    },
  ],
}
