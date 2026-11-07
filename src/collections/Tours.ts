import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor } from '../lib/access'
import { seoFields } from '../lib/fields'
import { revalidateHooks } from '../lib/revalidate'

const { afterChange, afterDelete } = revalidateHooks(
  ['/viajes'],
  (doc) => [`/viajes/${doc.slug ?? ''}`],
)

/**
 * `tours`: viajes organizados (BORAHAE TRIP). Contenido informativo;
 * la inscripción formal al viaje queda fuera de alcance (Fase 2 del negocio),
 * solo botón de interés que redirige al formulario de contacto.
 * Precio/condiciones solo si el cliente aprueba publicarlos.
 */
export const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'state', '_status'],
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
      label: 'Nombre del viaje',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Determina la URL /viajes/[slug]. Fijado con el seed.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Resumen',
          fields: [
            {
              name: 'summary',
              type: 'textarea',
              localized: true,
              label: 'Resumen',
              maxLength: 400,
            },
            {
              name: 'destination',
              type: 'text',
              localized: true,
              label: 'Destino',
              admin: { description: 'P. ej. «Seúl, Corea del Sur».' },
            },
            {
              name: 'dateStart',
              type: 'date',
              label: 'Fecha de inicio',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'dateEnd',
              type: 'date',
              label: 'Fecha de fin',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
              validate: (value: Date | null | undefined, options) => {
                const start = (options?.siblingData as { dateStart?: Date } | undefined)?.dateStart
                if (value && start && value.getTime() < new Date(start).getTime()) {
                  return 'La fecha de fin no puede ser anterior a la de inicio.'
                }
                return true
              },
            },
            {
              name: 'state', // evita colisionar con el enum "_status" de publicación
              type: 'select',
              label: 'Estado',
              required: true,
              defaultValue: 'upcoming',
              options: [
                { label: 'Próximamente', value: 'upcoming' },
                { label: 'Inscripción abierta', value: 'open' },
                { label: 'En curso / finalizado', value: 'closed' },
              ],
            },
            {
              name: 'priceNote',
              type: 'text',
              localized: true,
              label: 'Nota de precio (opcional)',
              admin: {
                description: 'Solo publicar precios/condiciones con aprobación escrita del cliente [PENDIENTE-CLIENTE]. Ejemplo: «Consultar precios por correo».',
              },
            },
          ],
        },
        {
          label: 'Itinerario',
          fields: [
            {
              name: 'itinerary',
              type: 'array',
              localized: true,
              label: 'Itinerario por día',
              labels: { singular: 'Día', plural: 'Días' },
              fields: [
                { name: 'day', type: 'number', label: 'Día #', required: true },
                { name: 'title', type: 'text', localized: true, label: 'Título del día' },
                { name: 'description', type: 'textarea', localized: true, label: 'Descripción' },
              ],
            },
          ],
        },
        {
          label: 'Qué incluye',
          fields: [
            {
              name: 'includes',
              type: 'textarea',
              localized: true,
              label: 'Incluye (un punto por línea)',
              admin: { description: 'Un ítem por línea; se mostrará como lista.' },
            },
            {
              name: 'excludes',
              type: 'textarea',
              localized: true,
              label: 'No incluye (un punto por línea)',
            },
          ],
        },
        {
          label: 'Contenido',
          fields: [
            {
              name: 'content',
              type: 'richText',
              localized: true,
              label: 'Descripción larga',
            },
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagen principal',
            },
            {
              name: 'galeria',
              type: 'upload',
              hasMany: true,
              relationTo: 'media',
              label: 'Galería de fotos del viaje',
            },
          ],
        },
      ],
    },
    ...seoFields(),
  ],
}
