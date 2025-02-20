import WebTorrent from 'webtorrent'
import util from 'node:util'
import fs from 'node:fs'
import fsPromise from 'node:fs/promises'
import ffmpegFactory, { FfmpegCommandOptions } from 'fluent-ffmpeg'
import ffmpegBinary from '@ffmpeg-installer/ffmpeg'
import ffmprobeBinary from '@ffprobe-installer/ffprobe'
import { Readable } from 'node:stream'
import { ReadableStream } from 'node:stream/web'

const getFfmpeg = () => {
  const ffmpeg = ffmpegFactory()

  // await fsPromise.chmod(ffmpegBinary.path, '777')
  // await fsPromise.chmod(ffmprobeBinary.path, '777')

  ffmpeg.setFfmpegPath(ffmpegBinary.path)
  ffmpeg.setFfprobePath(ffmprobeBinary.path)

  return ffmpeg
}

describe('something', () => {
  it('should ', async () => {
    const wt = new WebTorrent()
    const torrentId =
      'magnet:?xt=urn:btih:8658293436499D02D1A7679DE69388A7D5BD29A2&amp;dn=Travelers+(2016)+S01-3+S01-S03+(1080p+DS4K+NF+WEB-DL+x265+H&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&amp;tr=udp%3A%2F%2Fopen.tracker.cl%3A1337%2Fannounce&amp;tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&amp;tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&amp;tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Ftracker1.bt.moack.co.kr%3A80%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.theoks.net%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Ftracker-udp.gbitt.info%3A80%2Fannounce'

    console.log('starting')
    wt.add(torrentId, async (torrent) => {
      const server = torrent.createServer()

      await new Promise((resolve) => server.listen(7777, () => resolve(null)))

      console.log('torrent added, files:', torrent.files.length)
      // console.log(util.inspect(torrent.files, { depth: null }))
      for (const [idx, file] of torrent.files.entries()) {
        if (!file.name.includes('S01E03')) {
          continue
        }

        // let currentOffset = 0

        // const stream = new Readable({
        //   read(size: number) {
        //     console.log('Requesting chunk', size)
        //     const piece = file.createReadStream({
        //       start: currentOffset,
        //       end: currentOffset + size,
        //     })
        //
        //     const readable = new Readable().wrap(piece)
        //   },
        // })
      }
    })

    await new Promise((resolve) => setTimeout(resolve, 600000))
  })
})
