import { Context, Middleware } from 'grammy'
import { TmdbService } from '@carny/core'
import { MyContext } from '../bot.js'

export type DependenciesContext<T extends Context> = T & {
  injected: {
    tmdbService: TmdbService
  }
}

const tmdbService = new TmdbService(process.env.TMDB_API_KEY as string)

export const injectionMiddleware: Middleware<MyContext> = async (ctx, next) => {
  ctx.injected = {
    tmdbService,
  }
  await next()
}
