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

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
)

const EXPECTED_VERIFIED_COUNT = 1727
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

console.log(
  `✅ Expanded catalog check passed: ${EXPECTED_VERIFIED_COUNT} verified ranges, 23 SEO hubs, expanded search catalog present, range ordering and app-data mapping OK`
)
