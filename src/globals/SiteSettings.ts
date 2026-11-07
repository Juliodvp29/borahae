import type { GlobalConfig } from 'payload'
import { adminOrEditor } from '../lib/access'

/**
 * `site-settings`: ajustes del sitio. El editor puede administrarlo — son
 * decisiones de negocio (toggles, contacto, donaciones) — pero contiene
 * `[PENDIENTE-CLIENTE]` para correo institucional, logo, NIT y PayPal.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Ajustes del sitio',
  admin: {
    description: 'Interruptores y datos de contacto. Afectan al menú/footer público.',
  },
  access: {
    read: () => true, // el frontend lo lee del servidor
    update: adminOrEditor,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identidad',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              admin: { description: '[PENDIENTE-CLIENTE] Logo oficial cuando llegue el archivo vectorial.' },
            },
            {
              name: 'legalName',
              type: 'text',
              localized: false, // dato legal invariante
              label: 'Razón social',
              admin: { description: '[PENDIENTE-CLIENTE] Dato legal. Se muestra en el pie/legal.' },
            },
            {
              name: 'nit',
              type: 'text',
              label: 'NIT',
              admin: { description: '[PENDIENTE-CLIENTE]' },
            },
            {
              name: 'city',
              type: 'text',
              label: 'Ciudad de operación',
              admin: { description: '[PENDIENTE-CLIENTE]' },
            },
          ],
        },
        {
          label: 'Contacto y redes',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              label: 'Correo institucional',
              admin: { description: '[PENDIENTE-CLIENTE] Se usa en botones de contacto y como remitente visible del footer.' },
            },
            {
              type: 'array',
              name: 'socialLinks',
              label: 'Redes sociales',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  validate: (value: string | null | undefined) => {
                    if (!value) return true
                    try {
                      new URL(value)
                      return true
                    } catch {
                      return 'Ingresa la URL completa, incluido https://.'
                    }
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Donaciones',
          fields: [
            {
              name: 'paypalUrl',
              type: 'text',
              label: 'Enlace PayPal',
              admin: { description: '[PENDIENTE-CLIENTE]' },
            },
            {
              name: 'transferInfo',
              type: 'text',
              localized: true,
              label: 'Datos de transferencia (texto)',
              admin: { description: '[PENDIENTE-CLIENTE] Banco, tipo de cuenta, número, beneficiario. Visible solo si se llena.' },
            },
            {
              name: 'donationNote',
              type: 'textarea',
              localized: true,
              label: 'Mensaje de destino de las donaciones',
              admin: { description: 'En qué destina fondos la organización. Editable en es/ko.' },
            },
          ],
        },
        {
          label: 'Secciones',
          fields: [
            {
              name: 'galleryEnabled',
              type: 'checkbox',
              label: 'Mostrar Galería en el menú',
              defaultValue: false,
              admin: {
                description: 'Oculta el ítem de nav y la página queda disponible pero sin contenido destacado.',
              },
            },
            {
              name: 'sponsorshipEnabled',
              type: 'checkbox',
              label: 'Mostrar Patrocinio en el menú',
              defaultValue: false,
            },
            {
              name: 'whatsAppEnabled',
              type: 'checkbox',
              label: 'Mostrar botón de WhatsApp',
              defaultValue: false,
            },
            {
              name: 'whatsAppNumber',
              type: 'text',
              label: 'Número de WhatsApp',
              admin: {
                condition: (data) => Boolean(data.whatsAppEnabled),
                description: 'Formato internacional sin + ni espacios, p. ej. 573001234567.',
              },
            },
            {
              name: 'whatsAppMessage',
              type: 'text',
              label: 'Mensaje precargado de WhatsApp',
              admin: { condition: (data) => Boolean(data.whatsAppEnabled) },
            },
          ],
        },
      ],
    },
  ],
}
