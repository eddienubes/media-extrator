import { TmdbApi } from './TmdbApi.js'
import {
  makeStandardFetcher,
  targets,
  makeProviders,
  ScrapeMedia,
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
      const episode = hit.episodes?.[1]
      // console.log(util.inspect(hit, { depth: null }))

      const media: ScrapeMedia = {
        type: 'show',
        season: {
          number: 1,
          tmdbId: hit.id.toString(),
        },
        episode: {
          number: episode?.episode_number as number,
          tmdbId: episode?.id?.toString() as string,
        },
        releaseYear: new Date(show.first_air_date as string).getFullYear(),
        title: 'Travelers',
        tmdbId: showId.toString(),
      }

      console.log(media)

      const res = await providers.runAll({
        media,
      })

      console.log(res)
    })
  })
})
