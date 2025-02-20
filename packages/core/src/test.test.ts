import WebTorrent from 'webtorrent'
import util from 'node:util'
import fs from 'node:fs'
import fsPromise from 'node:fs/promises'
import ffmpegFactory, { FfmpegCommandOptions } from 'fluent-ffmpeg'
import ffmpegBinary from '@ffmpeg-installer/ffmpeg'
import ffmprobeBinary from '@ffprobe-installer/ffprobe'
import { Readable } from 'node:stream'

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
    const wt = new WebTorrent({})
    const torrentId =
      'magnet:?xt=urn:btih:8658293436499D02D1A7679DE69388A7D5BD29A2&amp;dn=Travelers+(2016)+S01-3+S01-S03+(1080p+DS4K+NF+WEB-DL+x265+H&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&amp;tr=udp%3A%2F%2Fopen.tracker.cl%3A1337%2Fannounce&amp;tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&amp;tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&amp;tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Ftracker1.bt.moack.co.kr%3A80%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.theoks.net%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Ftracker-udp.gbitt.info%3A80%2Fannounce'

    wt.add(torrentId, async (torrent) => {
      console.log('torrent added, files:', torrent.files.length)
      // console.log(util.inspect(torrent.files, { depth: null }))
      for (const file of torrent.files) {
        if (!file.name.includes('S01E03')) {
          continue
        }

        const header = file.createReadStream()

        const readableHeader = new Readable().wrap(header)

        const ffmpeg2 = getFfmpeg()

        ffmpeg2
          .input(readableHeader)
          .seekInput('00:20:00')
          .duration('00:00:10')
          .output('segment.mp4')
          .on('start', (cmd) => {
            console.log('start', cmd)
          })
          .on('error', (err) => {
            console.log(err)
          })
          .on('progress', (progress) => {
            console.log('pr', progress)
          })
          .on('end', () => {
            console.log('done')
          })
          .run()

        // const ffmpeg1 = getFfmpeg()
        //
        // ffmpeg1.input(readableHeader).ffprobe((err, data) => {
        //   console.log(err, data.format, data.streams.length, data.streams)
        // })
        //
        // const chunk = file.createReadStream({ start: 100000, end: 200000 })
        // const readable = new Readable().wrap(chunk)
        //
        // const ffmpeg = getFfmpeg()
        //
        // ffmpeg
        //   .input(readable)
        //   .inputFormat('matroska')
        //   .outputFormat('mp4')
        //   .output('output.mp4')
        //   .on('start', (cmd) => {
        //     console.log('start', cmd)
        //   })
        //   .on('error', (err) => {
        //     console.log(err)
        //   })
        //   .on('progress', (progress) => {
        //     console.log('pr', progress)
        //   })
        //   .on('end', () => {
        //     console.log('done')
        //   })
        //   .run()

        // ffmpeg
        //   .input(readable)
        //   .setStartTime('00:25:30')
        //   .setDuration('00:00:15')
        //   // .outputOptions(['-c:v copy', '-c:a copy', '-c:s copy'])
        //   .outputFormat('mp4')
        //   .output('output.mp4')
        //   .audioCodec('copy')
        //   .videoCodec('copy')
        //   .on('start', (cmd) => {
        //     console.log('start', cmd)
        //   })
        //   .on('error', (cmd, stdout, stderr) => {
        //     console.log('err', cmd, stdout, stderr)
        //   })
        //   .on('progress', (progress) => {
        //     console.log('pr', progress)
        //   })
        //   .run()

        // // first 64KB
        // const stream = file.createReadStream({ start: 0, end: 64000 })
        // const ffmpeg = getFfmpeg()
        // const readable = new Readable().wrap(stream)
        //
        // ffmpeg.input(readable).ffprobe((err, data) => {
        //   const fmt = data.format
        //   const codec = data.streams.find((s) => s.codec_type === 'video')!
        //
        //   const durationSec = fmt.duration as number
        //   const fileSizeBytes = file.length
        //
        //   const bps = fileSizeBytes / durationSec
        //
        //   console.log(bps, fmt)
        //
        //   const offsetStartSec = 30
        //   const offsetEndSec = 60
        //
        //   const offsetStartBytes = offsetStartSec * bps
        //   const offsetEndBytes = offsetEndSec * bps
        //
        //   const chunk = file.createReadStream({
        //     start: offsetStartBytes,
        //     end: offsetEndBytes,
        //   })
        //
        //   const readable = new Readable().wrap(chunk)
        //
        //   const ffmpeg = getFfmpeg()
        //
        //   // const writable = fs.createWriteStream('output.mp4')
        //
        //   ffmpeg
        //     .input(readable)
        //     .inputFormat('matroska')
        //     .format('mp4')
        //     .outputOptions(['-c:v copy', '-c:a copy', '-c:s copy'])
        //     .output('output.mp4')
        //     .on('start', (cmd) => {
        //       console.log('start', cmd)
        //     })
        //     .on('error', (err) => {
        //       console.log(err)
        //     })
        //     .on('end', () => {
        //       console.log('done')
        //     })
        //     .run()
        // })
      }
    })

    await new Promise((resolve) => setTimeout(resolve, 600000))
  })
})
