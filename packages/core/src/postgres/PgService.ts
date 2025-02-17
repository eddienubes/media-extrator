import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { AsyncLocalStorage } from 'node:async_hooks'
import * as schema from './schema.js'

export class PgService {
  private readonly db: PostgresJsDatabase<typeof schema>
  private readonly connection
  private readonly txStorage = new AsyncLocalStorage<
    PostgresJsDatabase<typeof schema>
  >()

  constructor(connectionUrl: string) {
    this.connection = postgres(connectionUrl)
    this.db = drizzle(this.connection, {
      schema,
    })
  }

  getClient(): PostgresJsDatabase<typeof schema> {
    return this.db
  }

  getTransaction(): PostgresJsDatabase<typeof schema> | null {
    return this.txStorage.getStore() || null
  }

  /**
   * Drop schema, only allowed in development environment
   */
  async dropSchema(): Promise<void> {
    // if (
    //   !['development', 'test'].includes(this.config.get('server.nodeEnv')) ||
    //   !this.config.get('postgres.host').includes('localhost')
    // ) {
    //   throw new Error(
    //     'Database reset is only allowed in development environment',
    //   )
    // }

    // We're using raw (unsafe) here since DDL statements cannot have parameters
    const hits = await this.connection.unsafe(`
            SELECT exists(select schema_name FROM information_schema.schemata WHERE schema_name = 'public') 
        `)
    const exists = hits?.[0]?.exists

    if (exists) {
      await this.connection.unsafe(`DROP SCHEMA public CASCADE;`)
      await this.connection.unsafe(`CREATE SCHEMA public;`)
    }
  }
}
