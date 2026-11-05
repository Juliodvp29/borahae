import path from 'path'
import { fileURLToPath } from 'url'

import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Local: archivos servidos desde ./media en desarrollo.
    // Con BLOB_READ_WRITE_TOKEN, Vercel Blob toma el control (ver payload.config).
    staticDir: path.resolve(dirname, '../media'),
    mimeTypes: ['image/*'],
  },
}
