import { BrowserContext, chromium } from 'patchright'
import { PlaywrightBlocker } from '@ghostery/adblocker-playwright'

export class Playwright {
  private readonly browserCtx: BrowserContext | null = null

  async getBrowser() {
    const blocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch)

    const browser = await chromium.launchPersistentContext('', {
      headless: true,
      channel: 'chrome',
      viewport: null,
    })

    this.browser = browser

    return browser
  }
}
