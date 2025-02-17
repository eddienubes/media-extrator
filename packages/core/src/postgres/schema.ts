import {
  integer,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const tvShowsTable = pgTable('tv_shows', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  tmdbId: varchar().notNull().unique(),
  title: varchar().notNull(),
  overview: varchar().notNull(),
  releaseDate: timestamp().notNull(),
  posterUrl: varchar().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow(),
})

export const tvShowEpisodesTable = pgTable('tv_show_episodes', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  tvShowUuid: uuid().references(() => tvShowsTable.uuid),
  season: integer().notNull(),
  episode: integer().notNull(),
  subtitles: jsonb().notNull().$type<any>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow(),
})

export const tvShowsRelations = relations(tvShowsTable, ({ many }) => ({
  episodes: many(tvShowEpisodesTable),
}))

export const moviesTable = pgTable('movies', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  tmdbId: varchar().notNull().unique(),
  title: varchar().notNull(),
  overview: varchar().notNull(),
  releaseDate: timestamp().notNull(),
  subtitles: jsonb().notNull().$type<any>(),
  posterUrl: varchar().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow(),
})
