import { defineConfig } from 'drizzle-kit'
import { loadConfig } from '@carny/config'
import path from 'node:path'

const config = loadConfig()

const schemaPath = path.resolve(__dirname, 'schema.ts')
const migrationsPath = path.resolve(__dirname, 'migrations')

export default defineConfig({
  dialect: 'postgresql',
  schema: schemaPath,
  out: migrationsPath,
  migrations: {
    table: config.postgres.migrationsTable,
    schema: config.postgres.migrationsSchema,
  },
  dbCredentials: {
    url: config.postgres.url,
  },
})
