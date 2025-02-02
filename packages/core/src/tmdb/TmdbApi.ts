import createClient, { Middleware } from 'openapi-fetch'
import type { paths } from './tmdb-types/types.js'
import { TMDB_POSTER_SIZES } from './constants.js'
import util from 'node:util'

export class TmdbApi {
  private readonly client = createClient<paths>({
    baseUrl: 'https://api.themoviedb.org',
  })

  private readonly imagesBaseUrl = 'https://image.tmdb.org/t/p'

  constructor(apiKey: string) {
    const authMiddleware: Middleware = {
      async onRequest({ request, options }) {
        const url = new URL(request.url)
        url.searchParams.set('api_key', apiKey)
        // https://stackoverflow.com/a/72570138
        return new Request(url.toString(), request)
      },
      onError: ({ error }) => {
        return new TmdbApiError('Tmdb API Error', error)
      },
      onResponse: async ({ response }) => {
        if (response.status >= 400) {
          const json = await response.json()
          throw new TmdbApiError(
            `Unable to call Tmdb API \n${util.inspect(json, {
              maxStringLength: 100,
              maxArrayLength: 10,
            })}`,
            response,
          )
        }

        return response
      },
    }

    this.client.use(authMiddleware)
  }

  async getTrending(): Promise<
    paths['/3/trending/all/{time_window}']['get']['responses']['200']['content']['application/json']
  > {
    const res = await this.client.GET('/3/trending/all/{time_window}', {
      params: {
        path: {
          time_window: 'week',
        },
      },
    })

    return res.data!
  }

  async searchTrending(query: string): Promise<any> {
    const url = new URL('https://www.themoviedb.org/search/trending')
    url.searchParams.set('query', query)
    const res = await fetch(url.toString())

    if (!res.ok) {
      const text = await res.text()
      throw new TmdbApiError(text, {})
    }

    return await res.json()
  }

  async searchMulti(
    query: string,
  ): Promise<
    paths['/3/search/multi']['get']['responses']['200']['content']['application/json']
  > {
    const res = await this.client.GET('/3/search/multi', {
      params: {
        query: {
          query,
        },
      },
    })

    return res.data!
  }

  async searchTvShow(
    query: string,
  ): Promise<
    paths['/3/search/tv']['get']['responses']['200']['content']['application/json']
  > {
    const res = await this.client.GET('/3/search/tv', {
      params: {
        query: {
          query,
        },
      },
    })

    return res.data!
  }

  async searchMovies(
    query: string,
  ): Promise<
    paths['/3/search/movie']['get']['responses']['200']['content']['application/json']
  > {
    const res = await this.client.GET('/3/search/movie', {
      params: {
        query: {
          query,
        },
      },
    })

    return res.data!
  }

  async getTvShow(
    id: number,
  ): Promise<
    paths['/3/tv/{series_id}']['get']['responses']['200']['content']['application/json']
  > {
    const res = await this.client.GET('/3/tv/{series_id}', {
      params: {
        path: {
          series_id: id,
        },
      },
    })

    return res.data!
  }

  async getTvShowSeason(
    id: number,
    season: number,
  ): Promise<
    paths['/3/tv/{series_id}/season/{season_number}']['get']['responses']['200']['content']['application/json']
  > {
    const res = await this.client.GET(
      '/3/tv/{series_id}/season/{season_number}',
      {
        params: {
          path: {
            series_id: id,
            season_number: season,
          },
        },
      },
    )

    return res.data!
  }

  /**
   * @param path starts with a slash
   */
  getPosterUrl(path: string): string {
    return `${this.imagesBaseUrl}/${TMDB_POSTER_SIZES.w342}${path}`
  }
}

export class TmdbApiError extends Error {
  constructor(
    message: string,
    public cause: unknown,
  ) {
    super(message)
    this.cause = cause
    this.name = TmdbApiError.name
  }
}
