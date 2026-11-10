import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor, deniedForAll } from '../lib/access'

/**
 * `contact-submissions`: contactos de interés, voluntariado, alianzas,
 * donaciones y patrocinio (remitente: formulario de contacto, fase 5).
 *
 * ACCESO: lectura solo admin y editor autorizado; nunca por API pública.
 */
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'email', 'acceptedAt'],
    description: 'Confidenciales; no visibles en el sitio público.',
  },
  access: {
    read: adminOrEditor,
    create: deniedForAll,
    update: deniedForAll,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'interes',
      options: [
        { label: 'Interés general', value: 'interes' },
        { label: 'Voluntariado', value: 'voluntariado' },
        { label: 'Alianza / patrocinio', value: 'alianza' },
        { label: 'Donación', value: 'donacion' },
        { label: 'Prensa / medios', value: 'prensa' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre',
    },
    {
      name: 'ageRange',
      type: 'select',
      required: true,
      label: 'Rango de edad',
      options: [
        { label: 'Menos de 18', value: 'u18' },
        { label: '18–24', value: '18-24' },
        { label: '25–34', value: '25-34' },
        { label: '35–44', value: '35-44' },
        { label: '45–54', value: '45-54' },
        { label: '55–64', value: '55-64' },
        { label: '65 o más', value: '65+' },
      ],
      admin: {
        description: 'Dato demográfico de la spec funcional §7.1. Contacto no está restringido a mayores de edad.',
      },
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
      required: true,
      label: 'Teléfono',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 2000,
      label: 'Mensaje',
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
