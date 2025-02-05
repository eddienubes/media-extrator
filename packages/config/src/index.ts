import path from 'node:path'
import { z } from 'zod'
import util from 'node:util'

const configSchema = z.object({
  bot: z.object({
    token: z.string(),
  }),
  tmdb: z.object({
    apiKey: z.string(),
  }),
  postgres: z.object({
    url: z.string(),
    migrationsTable: z.string(),
    migrationsSchema: z.string(),
  }),
})

export const loadConfig = (): z.infer<typeof configSchema> => {
  const envPath = path.resolve(__dirname, '..', '.env')
  process.loadEnvFile(envPath)

  try {
    const config = configSchema.parse({
      bot: {
        token: process.env.BOT_TOKEN,
      },
      tmdb: {
        apiKey: process.env.TMDB_API_KEY,
      },
      postgres: {
        url: process.env.POSTGRES_URL,
        migrationsTable: 'drizzle_migrations',
        migrationsSchema: 'public',
      },
    } as z.infer<typeof configSchema>)

    return config
  } catch (e) {
    console.log(`${loadConfig.name}: config validation error`)
    throw e
  }
}
