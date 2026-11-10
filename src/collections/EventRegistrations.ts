import type { CollectionConfig } from 'payload'
import { adminOrEditor, deniedForAll, adminOnly } from '../lib/access'

/**
 * `event-registrations`: registros de inscripción a eventos (Fase 5 conecta
 * el formulario). Datos mínimos; la fecha de nacimiento NO se persiste —
 * solo la trazabilidad de la comprobación de mayoría de edad y la versión
 * del texto de política aceptado (AGENTS.md §5.3, §11).
 *
 * ACCESO: lectura solo admin y editor autorizado; nunca por API pública.
 * La creación ocurre exclusivamente desde el endpoint del servidor con
 * overrideAccess — por eso `create` es falso para todo rol del panel.
 */
export const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'event', 'email', 'acceptedAt'],
    description:
      'Inscripciones a eventos. Confidenciales; no visibles en el sitio público.',
  },
  access: {
    read: adminOrEditor,
    // Creación/actualización/borrado solo vía endpoints de servidor.
    create: deniedForAll,
    update: deniedForAll,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      label: 'Evento',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Correo',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Teléfono (opcional)',
    },
    {
      name: 'city',
      type: 'text',
      label: 'Ciudad (opcional)',
      maxLength: 80,
    },
    {
      name: 'modality',
      type: 'radio',
      label: 'Modalidad de asistencia',
      required: true,
      options: [
        { label: 'Presencial', value: 'presencial' },
        { label: 'Virtual', value: 'virtual' },
      ],
      admin: {
        description:
          'La fija el endpoint: la del evento, o la que elige el visitante en eventos híbridos.',
      },
    },
    {
      name: 'adultEligibilityConfirmedAt',
      type: 'date',
      label: 'Declaración de mayoría de edad',
      admin: {
        readOnly: true,
        description: 'Fecha/hora del envío del formulario con la declaración 18+.',
      },
    },
    {
      name: 'policyVersion',
      type: 'text',
      label: 'Versión de política aceptada',
      admin: {
        readOnly: true,
        description: 'Guardado por el endpoint con la versión del texto publicado.',
      },
    },
    {
      name: 'acceptedAt',
      type: 'date',
      label: 'Consentimiento aceptado',
      admin: { readOnly: true },
    },
  ],
}
