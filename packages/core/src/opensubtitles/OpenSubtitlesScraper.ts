import axios from 'axios'
import { OpenSubtitlesSearchEntry } from './types.js'

export class OpenSubtitlesScraper {
  /**
   * Returns download link for subtitles
   * @param imdbId
   */
  async get(imdbId: string): Promise<string> {
    const hit = await this.getSearchEntry(imdbId)
  }

  private async getSearchEntry(
    imdbId: string,
  ): Promise<OpenSubtitlesSearchEntry> {
    const res = await axios.get(
      `https://www.opensubtitles.org/libs/suggest.php`,
      {
        params: {
          format: 'json3',
          MovieName: imdbId,
          SubLanguageID: 'eng'
        },
      },
    )

    return res.data[0]
  }
}
