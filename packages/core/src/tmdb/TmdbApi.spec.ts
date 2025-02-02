import { TmdbApi } from './TmdbApi.js'
import util from 'node:util'

describe(TmdbApi.name, () => {
  const api = new TmdbApi('')
  describe('searchTvShow', () => {
    it('should search for a tv show', async () => {
      const hits = await api.searchTvShow('Severance')

      console.log(util.inspect(hits, { depth: null }))
    })
  })

  describe('searchTrending', () => {
    it('should search trending', async () => {
      const hits = await api.searchTrending('Severance')

      console.log(hits)
    });
  });
})
