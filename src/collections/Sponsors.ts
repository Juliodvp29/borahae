import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor } from '../lib/access'
import { revalidateHooks } from '../lib/revalidate'

const { afterChange, afterDelete } = revalidateHooks(['/patrocinio'])

/**
 * `sponsors`: patrocinadores y aliados. La sección solo se publica si
 * `site-settings.sponsorshipEnabled` está activo (Fase 4).
 */
export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'website', 'order'],
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'website',
      type: 'text',
      label: 'Sitio web',
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          new URL(value)
          return true
        } catch {
          return 'Ingresa la URL completa, por ejemplo https://www.ejemplo.com.'
        }
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Descripción',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Orden',
      admin: { position: 'sidebar', step: 10 },
    },
  ],
}
