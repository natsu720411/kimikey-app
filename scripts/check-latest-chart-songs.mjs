import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LATEST_CHART_SONGS_20261022 as latest } from '../src/songs-latest-chart-20261022.js'

const dist = path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), 'dist')
const read = file => fs.readFileSync(path.join(dist,file),'utf8')
const page = read('latest-chart-songs/index.html')
const songs = read('songs/index.html')
const hub = read('song-range-index/index.html')
const sitemap = read('sitemap.xml')
const stats = JSON.parse(read('latest-chart-stats.json'))
const bundle = fs.readdirSync(path.join(dist,'assets')).filter(s=>s.endsWith('.js'))
  .map(s=>read('assets/'+s)).join('\n')
if (!sitemap.includes('<loc>https://kimikey-app.vercel.app/latest-chart-songs/</loc>') ||
    !songs.includes('href="/latest-chart-songs/"') ||
    !hub.includes('href="/latest-chart-songs/"') ||
    !page.includes('音域未確認') || !page.includes('/?search=') ||
    !bundle.includes('URLSearchParams')) throw new Error('Latest chart integration missing')
for (const s of latest) {
  if (!bundle.includes(s.title) || !page.includes(s.title.replaceAll('&','&amp;')))
    throw new Error('Song missing from deployed bundle: '+s.artist+' / '+s.title)
}
if (stats.addedSongs!==27 || stats.newlyVerified!==0 ||
    stats.searchableSongs!==1945 || stats.verifiedSongs!==1738 ||
    stats.unverifiedSongs!==207) throw new Error('Latest chart counts mismatch')
console.log('Latest chart check passed: 27 new, 1945 searchable, 1738 verified, 207 unverified')
