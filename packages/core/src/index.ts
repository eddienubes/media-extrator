import { TmdbService as TmdbServiceRoot } from './tmdb/TmdbService.js'
import { TmdbApi, TmdbApiError } from './tmdb/TmdbApi.js'

export class TmdbService extends TmdbServiceRoot {
  constructor(apiKey: string) {
    super(new TmdbApi(apiKey))
  }
}

export { TmdbApi, TmdbApiError }
