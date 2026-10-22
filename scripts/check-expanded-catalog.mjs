import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS as BASE_SONGS } from '../src/songs.js'
import { CATALOG_ALL_SONGS } from '../src/songs-catalog-all.js'
import { VERIFIED_RANGE_ALL } from '../src/songs-verified-all.js'
import { VERIFIED_RANGE_BATCH_12 } from '../src/songs-verified-batch-12.js'
import { VERIFIED_RANGE_BATCH_13 } from '../src/songs-verified-batch-13.js'
import { VERIFIED_RANGE_BATCH_14 } from '../src/songs-verified-batch-14.js'
import { VERIFIED_RANGE_BATCH_15 } from '../src/songs-verified-batch-15.js'
import { VERIFIED_RANGE_BATCH_16 } from '../src/songs-verified-batch-16.js'
import { VERIFIED_RANGE_BATCH_17 } from '../src/songs-verified-batch-17.js'
import { VERIFIED_RANGE_BATCH_18 } from '../src/songs-verified-batch-18.js'
import { VERIFIED_RANGE_BATCH_19 } from '../src/songs-verified-batch-19.js'
import { VERIFIED_RANGE_BATCH_20 } from '../src/songs-verified-batch-20.js'
import { VERIFIED_RANGE_BATCH_21 } from '../src/songs-verified-batch-21.js'
import { VERIFIED_RANGE_BATCH_22 } from '../src/songs-verified-batch-22.js'
import { VERIFIED_RANGE_BATCH_23 } from '../src/songs-verified-batch-23.js'
import { VERIFIED_RANGE_BATCH_24 } from '../src/songs-verified-batch-24.js'
import { VERIFIED_RANGE_BATCH_25 } from '../src/songs-verified-batch-25.js'

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
)

const EXPECTED_VERIFIED_COUNT = 1743
const validLabel = /^(low|mid1|mid2|hi|hihi)[A-G](?:#)?$/

const bandStartMidi = {
  low: 33,
  mid1: 45,
  mid2: 57,
  hi: 69,
  hihi: 81,
}

const offsetFromA = {
  A: 0,
  'A#': 1,
  B: 2,
  C: 3,
  'C#': 4,
  D: 5,
  'D#': 6,
  E: 7,
  F: 8,
  'F#': 9,
  G: 10,
  'G#': 11,
}

function key(song) {
  return `${song.artist}\u0000${song.title}`
}

function pitchLabelToMidi(label) {
  const match = String(label).match(
    /^(low|mid1|mid2|hi|hihi)([A-G](?:#)?)$/
  )

  if (!match) return Number.NaN

  const [, band, note] = match
  return bandStartMidi[band] + offsetFromA[note]
}

if (VERIFIED_RANGE_ALL.length !== EXPECTED_VERIFIED_COUNT) {
  throw new Error(
    `Expected ${EXPECTED_VERIFIED_COUNT} verified ranges, got ${VERIFIED_RANGE_ALL.length}`
  )
}

const keys = VERIFIED_RANGE_ALL.map(key)

if (new Set(keys).size !== EXPECTED_VERIFIED_COUNT) {
  throw new Error(
    'Duplicate verified artist/title found'
  )
}

const knownSongKeys = new Set([
  ...BASE_SONGS.map(key),
  ...CATALOG_ALL_SONGS.map(key),
])

for (const song of VERIFIED_RANGE_ALL) {
  if (
    !validLabel.test(song.lowLabel) ||
    !validLabel.test(song.highLabel) ||
    !/^https?:\/\//.test(song.rangeSource)
  ) {
    throw new Error(
      `Invalid verified data: ${song.artist} / ${song.title}`
    )
  }

  if (!knownSongKeys.has(key(song))) {
    throw new Error(
      `Verified song does not exist in app data: ${song.artist} / ${song.title}`
    )
  }

  const lowMidi = pitchLabelToMidi(song.lowLabel)
  const highMidi = pitchLabelToMidi(song.highLabel)

  if (
    !Number.isFinite(lowMidi) ||
    !Number.isFinite(highMidi) ||
    lowMidi > highMidi
  ) {
    throw new Error(
      `Invalid range order: ${song.artist} / ${song.title} (${song.lowLabel} - ${song.highLabel})`
    )
  }
}

const hubs = [
  'popular-song-ranges',
  'popular-song-ranges-2',
  'popular-song-ranges-3',
  'popular-song-ranges-4',
  'popular-song-ranges-5',
  'popular-song-ranges-6',
  'popular-song-ranges-7',
  'popular-song-ranges-8',
  'popular-song-ranges-9',
  'popular-song-ranges-10',
  'popular-song-ranges-11',
  'popular-song-ranges-12',
  'popular-song-ranges-13',
  'popular-song-ranges-14',
  'popular-song-ranges-15',
  'popular-song-ranges-16',
  'popular-song-ranges-17',
  'popular-song-ranges-18',
  'popular-song-ranges-19',
  'popular-song-ranges-20',
  'popular-song-ranges-21',
  'popular-song-ranges-22',
  'popular-song-ranges-23',
  'popular-song-ranges-24',
  'popular-song-ranges-25',
]

for (const hub of hubs) {
  const hubFile = path.join(
    root,
    'dist',
    hub,
    'index.html'
  )

  if (!fs.existsSync(hubFile)) {
    throw new Error(
      `Missing generated hub: ${hub}`
    )
  }
}

const songRangeIndexFile = path.join(
  root,
  'dist',
  'song-range-index',
  'index.html'
)

if (!fs.existsSync(songRangeIndexFile)) {
  throw new Error('Missing generated song-range-index hub')
}

const songRangeIndexHtml = fs.readFileSync(
  songRangeIndexFile,
  'utf8'
)

for (const hub of hubs) {
  if (!songRangeIndexHtml.includes(`/${hub}/`)) {
    throw new Error(
      `Song range index is missing hub link: ${hub}`
    )
  }

  const hubHtml = fs.readFileSync(
    path.join(root, 'dist', hub, 'index.html'),
    'utf8'
  )

  if (!hubHtml.includes('/song-range-index/')) {
    throw new Error(
      `Hub is missing song-range-index backlink: ${hub}`
    )
  }
}

const assetsDir = path.join(
  root,
  'dist',
  'assets'
)

const bundle = fs
  .readdirSync(assetsDir)
  .filter(name => name.endsWith('.js'))
  .map(name =>
    fs.readFileSync(
      path.join(assetsDir, name),
      'utf8'
    )
  )
  .join('\n')

for (const title of [
  'ultra soul',
  '三日月',
  '奏（かなで）',
  'White Love',
  'きらり',
  'イケナイ太陽',
  '千の夜をこえて',
  'オドループ',
  'CHE.R.RY',
  'Time goes by',
  'Raise your flag',
  '沈丁花',
  '別の人の彼女になったよ',
  '幾億光年',
  '青のすみか',
  '秒針を噛む',
  '栞',
  '愛のうた',
  'SEASONS',
  'CAN YOU CELEBRATE?',
  'ヘビーローテーション',
  'インフルエンサー',
  'ブラザービート',
  'Imitation Rain',
  'シンデレラガール',
  '初心LOVE',
  '無限大',
  '光るとき',
  'Bye-Good-Bye',
  'FANCY',
  'DDU-DU DDU-DU',
  'リンダ リンダ',
  '真赤',
  'Dynamite',
  '道',
  "As If It's Your Last",
  'Spring Day',
  'Life Goes On',
  'Yet To Come',
  'Feel Special',
  'YES or YES',
  'Kill This Love',
  'Lovesick Girls',
  'TT',
  "I CAN'T STOP ME",
  'Tomorrow never knows',
  '天体観測',
  'U.S.A.',
  '純恋歌',
  'ヒカリヘ',
  'First Love',
  'モニタリング',
  '絶対アイドル辞めないで',
  'MAESTRO',
  'Chk Chk Boom',
  '世界が終るまでは…',
  '紅',
  'ROSIER',
  'JAM',
  '桜坂',
  '瞳をとじて',
  'ガッツだぜ!!',
]) {
  if (!bundle.includes(title)) {
    throw new Error(
      `Search bundle is missing added song: ${title}`
    )
  }
}

for (const song of VERIFIED_RANGE_BATCH_12) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-12 song: ${song.artist} / ${song.title}`
    )
  }
}

for (const song of VERIFIED_RANGE_BATCH_13) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-13 song: ${song.artist} / ${song.title}`
    )
  }
}

for (const song of VERIFIED_RANGE_BATCH_14) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-14 song: ${song.artist} / ${song.title}`
    )
  }
}

if (VERIFIED_RANGE_BATCH_15.length !== 100) {
  throw new Error(
    `Expected 100 batch-15 songs, got ${VERIFIED_RANGE_BATCH_15.length}`
  )
}

for (const song of VERIFIED_RANGE_BATCH_15) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-15 song: ${song.artist} / ${song.title}`
    )
  }
}

if (VERIFIED_RANGE_BATCH_16.length !== 100) {
  throw new Error(
    `Expected 100 batch-16 songs, got ${VERIFIED_RANGE_BATCH_16.length}`
  )
}

for (const song of VERIFIED_RANGE_BATCH_16) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-16 song: ${song.artist} / ${song.title}`
    )
  }
}

if (VERIFIED_RANGE_BATCH_17.length !== 100) {
  throw new Error(
    `Expected 100 batch-17 songs, got ${VERIFIED_RANGE_BATCH_17.length}`
  )
}

for (const song of VERIFIED_RANGE_BATCH_17) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-17 song: ${song.artist} / ${song.title}`
    )
  }
}

if (VERIFIED_RANGE_BATCH_18.length !== 100) {
  throw new Error(
    `Expected 100 batch-18 songs, got ${VERIFIED_RANGE_BATCH_18.length}`
  )
}

for (const song of VERIFIED_RANGE_BATCH_18) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-18 song: ${song.artist} / ${song.title}`
    )
  }
}

if (VERIFIED_RANGE_BATCH_19.length !== 26) {
  throw new Error(
    `Expected 26 batch-19 songs, got ${VERIFIED_RANGE_BATCH_19.length}`
  )
}

for (const song of VERIFIED_RANGE_BATCH_19) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-19 song: ${song.artist} / ${song.title}`
    )
  }
}

if (VERIFIED_RANGE_BATCH_20.length !== 100) {
  throw new Error(
    `Expected 100 batch-20 songs, got ${VERIFIED_RANGE_BATCH_20.length}`
  )
}

for (const song of VERIFIED_RANGE_BATCH_20) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-20 song: ${song.artist} / ${song.title}`
    )
  }
}

if (VERIFIED_RANGE_BATCH_21.length !== 33) {
  throw new Error(
    `Expected 33 batch-21 songs, got ${VERIFIED_RANGE_BATCH_21.length}`
  )
}

for (const song of VERIFIED_RANGE_BATCH_21) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-21 song: ${song.artist} / ${song.title}`
    )
  }
}

if (VERIFIED_RANGE_BATCH_22.length !== 16) {
  throw new Error(
    `Expected 16 batch-22 songs, got ${VERIFIED_RANGE_BATCH_22.length}`
  )
}

for (const song of VERIFIED_RANGE_BATCH_22) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-22 song: ${song.artist} / ${song.title}`
    )
  }
}

if (VERIFIED_RANGE_BATCH_23.length !== 4) {
  throw new Error(
    `Expected 4 batch-23 songs, got ${VERIFIED_RANGE_BATCH_23.length}`
  )
}

for (const song of VERIFIED_RANGE_BATCH_23) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-23 song: ${song.artist} / ${song.title}`
    )
  }
}

if (VERIFIED_RANGE_BATCH_24.length !== 11) {
  throw new Error(
    `Expected 11 batch-24 songs, got ${VERIFIED_RANGE_BATCH_24.length}`
  )
}

for (const song of VERIFIED_RANGE_BATCH_24) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-24 song: ${song.artist} / ${song.title}`
    )
  }
}

if (VERIFIED_RANGE_BATCH_25.length !== 5) {
  throw new Error(
    `Expected 5 batch-25 songs, got ${VERIFIED_RANGE_BATCH_25.length}`
  )
}

for (const song of VERIFIED_RANGE_BATCH_25) {
  if (!bundle.includes(song.title)) {
    throw new Error(
      `Search bundle is missing batch-25 song: ${song.artist} / ${song.title}`
    )
  }
}

for (const song of [
  ...VERIFIED_RANGE_BATCH_24,
  ...VERIFIED_RANGE_BATCH_25,
]) {
  const appSong = BASE_SONGS.find(
    candidate =>
      candidate.artist === song.artist &&
      candidate.title === song.title
  )

  if (
    !appSong ||
    appSong.rangeVerified !== true ||
    !Number.isFinite(appSong.minMidi) ||
    !Number.isFinite(appSong.maxMidi)
  ) {
    throw new Error(
      `Verified range is not available in app search data: ${song.artist} / ${song.title}`
    )
  }
}

const sitemap = fs.readFileSync(
  path.join(root, 'dist', 'sitemap.xml'),
  'utf8'
)

for (const hub of hubs) {
  const hubUrl =
    `https://kimikey-app.vercel.app/${hub}/`

  if (!sitemap.includes(hubUrl)) {
    throw new Error(
      `Sitemap missing ${hub}/`
    )
  }
}

if (!sitemap.includes('https://kimikey-app.vercel.app/song-range-index/')) {
  throw new Error('Sitemap missing song-range-index/')
}


const vocalCheckFile = path.join(
  root,
  'dist',
  'vocal-range-check',
  'index.html'
)

if (!fs.existsSync(vocalCheckFile)) {
  throw new Error('Missing vocal-range-check page')
}

const vocalCheckHtml = fs.readFileSync(
  vocalCheckFile,
  'utf8'
)

for (const requiredText of [
  '音域測定・声の高さ測定',
  'マイクで声を測る',
  '"@type": "FAQPage"',
]) {
  if (!vocalCheckHtml.includes(requiredText)) {
    throw new Error(
      `vocal-range-check SEO text missing: ${requiredText}`
    )
  }
}

for (const requiredText of [
  '狭心症',
  '絆ノ奇跡',
  '唱',
]) {
  if (!songRangeIndexHtml.includes(requiredText)) {
    throw new Error(
      `Song range index missing priority SEO target: ${requiredText}`
    )
  }
}


const highestNoteIndexFile = path.join(
  root,
  'dist',
  'highest-note-songs',
  'index.html'
)

if (!fs.existsSync(highestNoteIndexFile)) {
  throw new Error('Missing highest-note-songs index')
}

const highestNoteIndexHtml = fs.readFileSync(
  highestNoteIndexFile,
  'utf8'
)

if (!highestNoteIndexHtml.includes('最高音から曲を探す')) {
  throw new Error('Highest-note index content missing')
}

let verifiedPagesWithRecommendations = 0
for (const song of VERIFIED_RANGE_ALL.slice(0, 50)) {
  const match = bundle.includes(song.title)
  if (!match) continue
  verifiedPagesWithRecommendations += 1
}

if (verifiedPagesWithRecommendations < 40) {
  throw new Error('Verified song bundle coverage unexpectedly low')
}

if (!songRangeIndexHtml.includes('/highest-note-songs/')) {
  throw new Error('Song range index missing highest-note link')
}

console.log(
  `✅ Expanded catalog check passed: ${EXPECTED_VERIFIED_COUNT} verified ranges, 25 SEO hubs + crawl/range architecture, expanded search catalog present, range ordering and app-data mapping OK`
)
