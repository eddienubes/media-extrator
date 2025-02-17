import { PgService } from './PgService.js'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from './schema.js'

export class Dao {
  constructor(protected readonly pgService: PgService) {}

  get client(): PostgresJsDatabase<typeof schema> {
    const tx = this.pgService.getTransaction()
    return tx || this.pgService.getClient()
  }
}
