import WebTorrent from 'webtorrent'
import util from 'node:util'
import fs from 'node:fs'
import fsPromise from 'node:fs/promises'
import ffmpegFactory, { FfmpegCommandOptions } from 'fluent-ffmpeg'
import ffmpegBinary from '@ffmpeg-installer/ffmpeg'
import ffmprobeBinary from '@ffprobe-installer/ffprobe'
import { Readable } from 'node:stream'
import { ReadableStream } from 'node:stream/web'
import path from 'node:path'
import subtitle from 'subtitle'

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
      console.log('torrent added, files:', torrent.files.length)
      // console.log(util.inspect(torrent.files, { depth: null }))
      for (const file of torrent.files) {
        if (!file.name.includes('S01E03')) {
          continue
        }

        let currentOffset = 0

        const stream = new Readable({
          read(size: number) {
            console.log('Requesting chunk', size)
            const piece = file.createReadStream({
              start: currentOffset,
              end: currentOffset + size,
            })

            const readable = new Readable().wrap(piece)

            readable.on('data', (chunk: Buffer) => {
              console.log('Pushing chunk', chunk.byteLength)
              currentOffset += chunk.byteLength
              // readable.
              if (!this.push(chunk)) {
                // if push returns false, pause the subStream until _read is called again
                readable.pause()
              }
            })

            piece.on('end', () => {
              console.log('piece end')
            })

            // readable.on('end', () => {
            //   console.log('readable end')
            //   this.push(null)
            // })

            readable.on('error', (err) => {
              console.log('readable error', err)
              this.emit('error', err)
            })
          },
        })

        const ffmpeg2 = getFfmpeg()

        ffmpeg2
          .input(stream)
          .seekInput('00:01:00')
          .duration('00:00:11')
          .output('segment.mp4', { end: true })
          /*  We can't use WebM as it's not compatible with Safari/iOS : https://caniuse.com/#feat=webm
          .videoCodec('libvpx')
          .audioCodec('libvorbis')
          .addOption('-threads', '0')
          .format('webm')*/
          .videoCodec('libx264')
          .audioCodec('aac')
          // TODO: check settings for quality
          .addOption([
            // Try to remove green artifacts when seeking
            //'-vf yadif',
            //'-flags2 -fastpskip',
            //'-fast-pskip 0',
            //'-g 30', // Forces (at least) every 30nd frame to be a keyframe

            /*'-map_metadata -1',
            '-pix_fmt yuv420p',
            '-ac 2',
            '-copyts',
            '-mpegts_copyts 1',
            '-f mpegts',*/

            '-threads 1', // 0
            '-crf 22', // https://trac.ffmpeg.org/wiki/Encode/H.264#a1.ChooseaCRFvalue
            //'-movflags faststart', // https://superuser.com/questions/438390/creating-mp4-videos-ready-for-http-streaming
            '-preset veryfast', // https://trac.ffmpeg.org/wiki/Encode/H.264#a2.Chooseapreset
            '-tune zerolatency', // https://superuser.com/a/564404,
            '-movflags isml+frag_keyframe+empty_moov+faststart', //+dash
            '-f ismv',

            // Probably don't need this as we are outputing to a temp file
            '-maxrate 2500k', // https://trac.ffmpeg.org/wiki/EncodingForStreamingSites#a-maxrate
            '-bufsize 5000k', // https://trac.ffmpeg.org/wiki/EncodingForStreamingSites#a-bufsize
          ])
          .format('mp4')
          .on('start', (cmd) => {
            console.log('start', cmd)
          })
          .on('error', (err, stdout, stderr) => {
            console.log(err, stdout, stderr)
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

  it('should convert hls to mp4', async () => {
    const cutSomething = async (
      inputs: string[],
      output: string,
      start: string,
      duration: string,
    ) => {
      const ffmpeg = getFfmpeg()

      for (const input of inputs) {
        ffmpeg
          .input(input)
          .inputOptions(['-protocol_whitelist file,http,https,tcp,tls'])
      }

      ffmpeg
        .seekInput(start)
        .duration(duration)
        .output(output)
        // .outputOptions(['-c:s mov_text'])
        // .outputOptions(['-c copy'])
        .on('start', (cmd) => {
          console.log('start', cmd)
        })
        .on('error', (err, stdout, stderr) => {
          console.log(err, stdout, stderr)
        })
        .on('end', () => {
          console.log('done')
        })
        .run()
    }

    const videoPath = path.join(__dirname, 'master.m3u8')

    await cutSomething([videoPath], './src/cut.mp4', '00:09:20', '00:00:45')

    const subPath = path.join(__dirname, 'subtitles.srt')
    await cutSomething([subPath], './src/cut.srt', '00:09:20', '00:00:45')

    await new Promise((resolve) => {})
  })

  it('should try to sync subtitles', async () => {
    const ogSubtitlesPath = path.join(__dirname, 'subtitles.srt')
    const ogSubtitlesContent = await fsPromise.readFile(
      ogSubtitlesPath,
      'utf-8',
    )

    const ogParsedSubtitles = subtitle
      .parseSync(ogSubtitlesContent)
      .filter((s) => s.type === 'cue')

    const whisperSubtitlesPath = path.join(__dirname, '..', 'output.srt')
    const whisperSubtitles = await fsPromise.readFile(
      whisperSubtitlesPath,
      'utf-8',
    )

    const parsedWhisperSubtitles = subtitle
      .parseSync(whisperSubtitles)
      .filter((s) => s.type === 'cue')

    const wordsSearchMin = 3
    const diffs: {
      delta: number
      text: string
    }[] = []

    for (const row of parsedWhisperSubtitles) {
      const text = row.data.text
      const words = text.split(' ').slice(0, wordsSearchMin)

      if (words.length < wordsSearchMin) {
        continue
      }

      const keyword = words.join(' ')
      console.log(keyword)

      const ogRow = ogParsedSubtitles.find((r) => r.data.text.includes(keyword))

      if (ogRow) {
        diffs.push({
          delta: row.data.start - ogRow.data.start,
          text: ogRow.data.text,
        })
      }
    }

    console.log(diffs)
  })
})
