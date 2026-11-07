import path from 'path'
import { fileURLToPath } from 'url'

import type { CollectionConfig } from 'payload'
import { adminOrEditor } from '../lib/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    // Las imágenes públicas pueden leerse por REST (next/image las sirve de local/Blob).
    read: () => true,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
      localized: true,
      // Localizado pero no obligatorio: el editor sube primero en es y puede
      // completar ko después (el frontend cae al español si falta la versión).
      required: false,
      admin: {
        description: 'Describe la imagen. Obligatorio al publicar; si falta una versión, se usa el español.',
      },
      validate: (value: string | null | undefined) => {
        if (!value || value.trim().length === 0) {
          return 'Describe la imagen para lectores de pantalla.'
        }
        return true
      },
    },
  ],
  upload: {
    // Local: archivos servidos desde ./media en desarrollo.
    // Con BLOB_READ_WRITE_TOKEN, Vercel Blob toma el control (ver payload.config).
    staticDir: path.resolve(dirname, '../media'),
    mimeTypes: ['image/*'],
    // Se publica en WebP (AGENTS.md §5.4): tamaño adaptado por componente.
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        formatOptions: { format: 'webp', options: { quality: 70 } },
      },
      {
        name: 'card',
        width: 900,
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
      {
        name: 'banner',
        width: 2400,
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        // 1.91:1 para og:image de Facebook/X y tarjeta estándar.
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'centre',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
    ],
    // Nota: Payload no trae límite de peso nativo; la validación de tamaño
    // ocurre en el endpoint de Fase 5 y en la guía del editor.
  },
}
