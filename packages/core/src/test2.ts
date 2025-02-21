import { chromium } from 'patchright'
import util from 'node:util'
import { PlaywrightBlocker } from '@ghostery/adblocker-playwright'
import { Page } from 'playwright'
import path from 'node:path'

const main = async () => {
  // GoT https://vidsrc.xyz/embed/tv?imdb=tt0944947&season=1&episode=1
  // Fringe https://vidsrc.xyz/embed/tv?imdb=tt1119644&season=1&episode=1
  // Severance https://vidsrc.xyz/embed/tv?imdb=tt11280740&season=2&episode=6

  const blocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch)

  const browser = await chromium.launchPersistentContext('', {
    headless: true,
    channel: 'chrome',
    viewport: null,
  })

  const page = await browser.newPage()

  await blocker.enableBlockingInPage(page as Page)

  // const testPage = await browser.newPage()
  // await testPage.goto('https://fingerprint.com/products/bot-detection/')

  page.on('request', async (req) => {
    const url = req.url()
    if (url.includes('.m3u8')) {
      console.log('m3u8 request url or rcp')
      console.log(req.url())
      console.log(req.headers())
      console.log(req.postData())
    } else {
      // console.log('generic request url')
      // console.log(req)
      // console.log(req.headers())
      // console.log(req.postData())
    }
  })

  await page.goto(
    'https://vidsrc.xyz/embed/tv?imdb=tt11280740&season=2&episode=6',
  )

  const serverLocators = await page.locator('.server').all()
  const serverHashes = (await Promise.all(
    serverLocators.map(
      async (server) => await server.getAttribute('data-hash'),
    ),
  )) as string[]

  const initialIframeSrc = (
    await page.locator('#player_iframe').getAttribute('src')
  )?.replace('//', '') as string

  const delimiter = '/rcp/'

  const [domain, hash] = initialIframeSrc.split(delimiter)

  // const bestServerHash = serverHashes[serverHashes.length - 1]

  for (const hash of serverHashes) {
    const url = new URL(`https://${domain}${delimiter}${hash}`)
    console.log('Navigating to', url.toString().substring(0, 50))
    await page.goto(url.toString())

    const body = page.locator('body')
    await body.click()
    await body.click()
    await body.click()
    await page.waitForTimeout(5000)
    await body.click()
    console.log('Clicked body')
  }


  // console.log(await iframeLocator1.locator('#player_iframe').getAttribute('src'))
  // const secondIframe = iframeLocator1.locator('#player_iframe')
  // const src = await secondIframe.getAttribute('src')
  //
  // console.log('iframe src', src)

  // console.log('Clicking server 3')
  // await servers[2].click()
  // await servers[2].click()
  // await servers[2].click()
  // await servers[2].click()

  await page.waitForTimeout(5000)
}

main()
