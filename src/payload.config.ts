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
import { Pages } from './collections/Pages'
import { Programs } from './collections/Programs'
import { Tours } from './collections/Tours'
import { Events } from './collections/Events'
import { EventRegistrations } from './collections/EventRegistrations'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Gallery } from './collections/Gallery'
import { Sponsors } from './collections/Sponsors'
import { SiteSettings } from './globals/SiteSettings'

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
  // Comandos propios del CLI (`npx payload <key>`): el bin entrega la config
  // ya resuelta a `script(config)` — evita el deadlock de getPayload bajo `run`.
  bin: [
    { key: 'seed', scriptPath: './src/scripts/seed.ts' },
    { key: 'db-report', scriptPath: './src/scripts/db-report.ts' },
  ],
  collections: [
    Users,
    Media,
    Pages,
    Programs,
    Tours,
    Events,
    EventRegistrations,
    ContactSubmissions,
    Gallery,
    Sponsors,
  ],
  globals: [SiteSettings],
  // Contenido editable en es/ko (AGENTS.md §5.1): español por defecto y
  // fallback automático al español para campos sin traducción.
  localization: {
    locales: [
      { label: 'Español', code: 'es' },
      { label: '한국어 (coreano)', code: 'ko' },
    ],
    defaultLocale: 'es',
    fallback: true,
  },
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
