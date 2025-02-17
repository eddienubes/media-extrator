import { TmdbApi } from './TmdbApi.js'
import {
  buildProviders,
  makeStandardFetcher,
  targets,
  makeProviders,
} from '@movie-web/providers'
import util from 'node:util'

const providers = makeProviders({
  // consistentIpForRequests: undefined,
  // externalSources: undefined,
  fetcher: makeStandardFetcher(fetch),
  target: targets.ANY,
  // https://sussy-code.github.io/providers/in-depth/flags
  consistentIpForRequests: true,
})

describe(TmdbApi.name, () => {
  const api = new TmdbApi('5ca16d9e86f95a55ccbfba391a40d8c8')
  describe('searchTvShow', () => {
    it('should search for a tv show', async () => {
      const hits = await api.searchTvShow('Travelers')

      console.log(util.inspect(hits, { depth: null }))
    })
  })

  describe('searchTrending', () => {
    it('should search trending', async () => {
      const hits = await api.searchTrending('Severance')

      console.log(hits)
    })
  })

  describe('getTvShow', () => {
    it('should ', async () => {
      const showId = 67683
      const show = await api.getTvShow(showId)
      const hit = await api.getTvShowSeason(showId, 1)
      const firstEpisode = hit.episodes?.[0].id
      // console.log(util.inspect(hit, { depth: null }))

      const res = await providers.runAll({
        media: {
          type: 'show',
          season: {
            number: 1,
            tmdbId: hit.id.toString(),
          },
          episode: {
            number: 11,
            tmdbId: firstEpisode?.toString() as string,
          },
          releaseYear: new Date(show.first_air_date as string).getFullYear(),
          title: 'Travelers',
          tmdbId: showId.toString(),
        },
      })

      console.log(res)
    })
  })
})
