import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor } from '../lib/access'
import { seoFields } from '../lib/fields'
import { revalidateHooks } from '../lib/revalidate'

const { afterChange, afterDelete } = revalidateHooks(
  ['/eventos'],
  (doc) => [`/eventos/${doc.slug ?? ''}`],
)

/**
 * `events`: eventos gratuitos con inscripción (Fase 5 conecta el formulario).
 *
 * REGLA 18+ (AGENTS.md §5.3): la comprobación de mayoría de edad es obligatoria
 * en fase 1. El campo es de solo lectura en el admin y no se puede desactivar;
 * la validación real ocurre en el endpoint de registro.
 */
export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'modality', 'dateStart', '_status'],
    description:
      'Eventos con inscripción gratuita para mayores de 18 años. El cupo es opcional.',
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
      label: 'Título del evento',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Determina la URL /eventos/[slug]. Fijado con el seed.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Detalles',
          fields: [
            {
              name: 'modality',
              type: 'radio',
              label: 'Modalidad',
              required: true,
              defaultValue: 'presencial',
              options: [
                { label: 'Presencial', value: 'presencial' },
                { label: 'Virtual', value: 'virtual' },
                { label: 'Híbrido', value: 'hibrido' },
              ],
            },
            {
              name: 'location',
              type: 'text',
              localized: true,
              label: 'Lugar / plataforma',
              admin: {
                description: 'Dirección para presencial, nombre de plataforma para virtual.',
              },
            },
            {
              name: 'locationUrl',
              type: 'text',
              label: 'Enlace del lugar o sala virtual',
              admin: { description: 'Opcional: Maps o enlace de la sala virtual.' },
            },
            {
              name: 'dateStart',
              type: 'date',
              label: 'Inicio',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'dateEnd',
              type: 'date',
              label: 'Fin',
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
              name: 'summary',
              type: 'textarea',
              localized: true,
              label: 'Descripción breve',
              maxLength: 400,
            },
            {
              name: 'content',
              type: 'richText',
              localized: true,
              label: 'Descripción completa',
            },
          ],
        },
        {
          label: 'Inscripción',
          fields: [
            {
              name: 'capacityEnabled',
              type: 'checkbox',
              label: 'Limitar el cupo',
              defaultValue: false,
            },
            {
              name: 'capacity',
              type: 'number',
              label: 'Cupo de personas',
              admin: {
                condition: (_data, siblingData) => Boolean(siblingData?.capacityEnabled),
                description: 'Al alcanzarse, el formulario mostrará el evento como agotado (sin lista de espera).',
              },
              validate: (value: number | null | undefined) => {
                if (value !== null && value !== undefined && (!Number.isInteger(value) || value < 1)) {
                  return 'El cupo debe ser un número entero mayor o igual a 1.'
                }
                return true
              },
            },
            {
              name: 'requiresAdultConfirmation',
              type: 'checkbox',
              label: 'Solo mayores de 18 años (fijo en fase 1)',
              defaultValue: true,
              access: { update: () => false },
              admin: {
                readOnly: true,
                description:
                  'La inscripción pide una declaración de mayoría de edad validada en servidor. No se persiste la fecha de nacimiento.',
              },
            },
          ],
        },
        {
          label: 'Contenido visual',
          fields: [
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagen principal',
            },
          ],
        },
      ],
    },
    ...seoFields(),
  ],
}
