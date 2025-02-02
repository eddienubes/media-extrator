export interface TmdbSearchEntry {
  id: string
  title: string
  overview: string
  posterUrl: string
  popularity: number
  type: TmdbEntityType
  releaseDate: Date
}

export enum TmdbEntityType {
  MOVIE = 'MOVIE',
  TV_SHOW = 'TV_SHOW',
}
