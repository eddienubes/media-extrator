import { TmdbApi } from './TmdbApi.js'
import { TmdbEntityType, TmdbSearchEntry } from './types.js'

export class TmdbService {
  constructor(private readonly tmdbApi: TmdbApi) {}

  async searchTvShowsAndMovies(query: string): Promise<TmdbSearchEntry[]> {
    const [tvShowsRes, moviesRes] = await Promise.all([
      await this.tmdbApi.searchTvShow(query),
      await this.tmdbApi.searchMovies(query),
    ])

    const tvShowEntries =
      tvShowsRes.results?.reduce((acc, show) => {
        if (
          !show.name ||
          !show.overview ||
          !show.poster_path ||
          !show.first_air_date
        ) {
          return acc
        }

        acc.push({
          title: show.name,
          id: show.id.toString(),
          overview: show.overview,
          posterUrl: this.tmdbApi.getPosterUrl(show.poster_path),
          popularity: show.popularity,
          type: TmdbEntityType.TV_SHOW,
          releaseDate: new Date(show.first_air_date),
        })
        return acc
      }, [] as TmdbSearchEntry[]) || []

    const movieEntries =
      moviesRes.results?.reduce((acc, movie) => {
        if (
          !movie.title ||
          !movie.overview ||
          !movie.poster_path ||
          !movie.release_date
        ) {
          return acc
        }

        acc.push({
          title: movie.title,
          id: movie.id.toString(),
          overview: movie.overview,
          posterUrl: this.tmdbApi.getPosterUrl(movie.poster_path),
          popularity: movie.popularity,
          type: TmdbEntityType.MOVIE,
          releaseDate: new Date(movie.release_date),
        })
        return acc
      }, [] as TmdbSearchEntry[]) || []

    const entries = [...tvShowEntries, ...movieEntries].sort(
      (a, b) => b.popularity - a.popularity,
    )

    return entries
  }
}
