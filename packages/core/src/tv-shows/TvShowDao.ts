import { Dao } from '../postgres/Dao.js'
import { PgService } from '../postgres/PgService.js'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { tvShowsTable } from '../postgres/schema.js'
import falso from '@ngneat/falso'
import { timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export type TvShowInsert = InferInsertModel<typeof tvShowsTable>
export type TvShowSelect = InferSelectModel<typeof tvShowsTable>

export class TvShowDao extends Dao {
  constructor(pgService: PgService) {
    super(pgService)
  }

  async createTestInstance(
    attrs: Partial<TvShowInsert>,
  ): Promise<TvShowSelect> {
    const hit = await this.client
      .insert(tvShowsTable)
      .values({
        tmdbId: falso.randAlpha({ maxCharCount: 10 }),
        title: falso.randMovie(),
        overview: falso.randText(),
        releaseDate: falso.randPastDate(),
        posterUrl: falso.randUrl(),
        ...attrs,
      })
      .returning()

    return hit[0]
  }

  async create(attrs: TvShowInsert): Promise<TvShowInsert> {
    const hit = await this.client.insert(tvShowsTable).values(attrs).returning()

    return hit[0]
  }

  async getById(uuid: string): Promise<TvShowSelect> {

  }
}
