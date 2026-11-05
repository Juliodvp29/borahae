import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import dotenv from 'dotenv'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// El .env de este proyecto pisa cualquier DATABASE_URL heredada de la máquina
// (dotenv no sobrescribe variables ya definidas; override:true lo fuerza solo aquí).
dotenv.config({
  path: path.resolve(dirname, '../.env'),
  override: true,
})

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // El esquema se controla con migraciones; sin modo push (AGENTS 5.2).
  db: postgresAdapter({
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      max: 2,
    },
  }),
  sharp,
  plugins: [
    // Sin token (desarrollo local) el plugin se deshabilita y Media usa disco.
    // En Vercel, BLOB_READ_WRITE_TOKEN se inyecta automáticamente.
    vercelBlobStorage({
      collections: {
        media: true,
      },
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
