import { PgService } from '../src/postgres/PgService.js'
import { loadConfig } from '@carny/config'

const main = async (): Promise<void> => {
  const config = loadConfig()
  const pg = new PgService(config.postgres.url)

  await pg.dropSchema()
  process.exit(0)
}

void main()
