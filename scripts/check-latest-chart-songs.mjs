import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS } from '../src/songs.js'
import { CATALOG_ALL_SONGS } from '../src/songs-catalog-all.js'
import { VERIFIED_RANGE_ALL } from '../src/songs-verified-all.js'
import { LATEST_CHART_SONGS_20261112 as latest } from '../src/songs-latest-chart-20261112.js'

const dist = path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), 'dist')
const read = file => fs.readFileSync(path.join(dist, file), 'utf8')
const page = read('latest-chart-songs/index.html')
const songsPage = read('songs/index.html')
const hub = read('song-range-index/index.html')
const sitemap = read('sitemap.xml')
const stats = JSON.parse(read('latest-chart-stats.json'))
const bundle = fs.readdirSync(path.join(dist, 'assets')).filter(s => s.endsWith('.js')).map(s => read('assets/' + s)).join('\n')
const key = song => song.artist + '\u0000' + song.title
const known = new Set([...SONGS, ...CATALOG_ALL_SONGS].map(key))
const verified = new Set(VERIFIED_RANGE_ALL.map(key))
const latestVerified = latest.filter(s => verified.has(key(s))).length
if (!sitemap.includes('<loc>https://kimikey-app.vercel.app/latest-chart-songs/</loc>') ||
    !songsPage.includes('href="/latest-chart-songs/"') ||
    !hub.includes('href="/latest-chart-songs/"') ||
    !page.includes('2026年11月') || !page.includes('音域未確認') ||
    !page.includes('音域確認済み') || !page.includes('/?search=') ||
    !bundle.includes('URLSearchParams')) throw new Error('Latest chart integration missing')
for (const song of latest) {
  if (!known.has(key(song)) || !bundle.includes(song.title) || !page.includes(song.title.replaceAll('&', '&amp;')))
    throw new Error('Song missing from deployed bundle: ' + song.artist + ' / ' + song.title)
}
if (stats.addedSongs !== latest.length || stats.newlyVerified !== latestVerified ||
    stats.searchableSongs !== known.size || stats.verifiedSongs !== VERIFIED_RANGE_ALL.length ||
    stats.unverifiedSongs !== known.size - VERIFIED_RANGE_ALL.length ||
    stats.chartDate !== '2026-11-16') throw new Error('Latest chart counts mismatch')
console.log(`Latest chart check passed: ${latest.length} new chart songs, ${latestVerified} verified, ${known.size} searchable, ${VERIFIED_RANGE_ALL.length} verified total`)
