import {
  buildProviders,
  makeStandardFetcher,
  targets,
  makeProviders,
} from '@movie-web/providers'
import util from 'node:util'

// const providers = buildProviders()
//   .setTarget(targets.ANY)
//   .setFetcher(makeStandardFetcher(fetch))
//   .addBuiltinProviders()
//   .build()
const providers = makeProviders({
  // consistentIpForRequests: undefined,
  // externalSources: undefined,
  fetcher: makeStandardFetcher(fetch),
  target: targets.ANY,
  // https://sussy-code.github.io/providers/in-depth/flags
  consistentIpForRequests: true,
})

const main = async () => {
  console.log(providers.listSources())
  const res = await providers.runSourceScraper({
    media: {
      type: 'show',
      season: {
        number: 2,
        tmdbId: '2',
      },
      episode: {
        number: 2,
        tmdbId: '2',
      },
      releaseYear: 2022,
      title: 'Severance',
      tmdbId: '95396',
    },
    id: 'hdrezka'
  })

  console.log(util.inspect(res, { depth: null }))
}

main()
