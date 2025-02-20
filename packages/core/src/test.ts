import WebTorrent from 'webtorrent'
import util from 'node:util'

const wt = new WebTorrent()
const torrentId =
  'magnet:?xt=urn:btih:8658293436499D02D1A7679DE69388A7D5BD29A2&amp;dn=Travelers+(2016)+S01-3+S01-S03+(1080p+DS4K+NF+WEB-DL+x265+H&amp;tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&amp;tr=udp%3A%2F%2Fopen.tracker.cl%3A1337%2Fannounce&amp;tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&amp;tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&amp;tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Ftracker1.bt.moack.co.kr%3A80%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.theoks.net%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Ftracker-udp.gbitt.info%3A80%2Fannounce'

wt.add(torrentId, (torrent) => {
  console.log(util.inspect(torrent, { depth: null }))
})

await new Promise((resolve) => setTimeout(resolve, 60000))
