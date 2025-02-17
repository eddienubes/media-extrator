import { defineConfig } from 'drizzle-kit'
import { loadConfig } from '@carny/config'
import path from 'node:path'

const config = loadConfig()

// https://github.com/drizzle-team/drizzle-orm/issues/3807
// Remove first slash to fix the issue above.
const migrationsPath = path.join(__dirname, 'migrations').replace('/', '')

const schemaPath = path.join(__dirname, 'schema.ts')

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
