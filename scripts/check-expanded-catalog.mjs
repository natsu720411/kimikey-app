import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { VERIFIED_RANGE_ALL } from '../src/songs-verified-all.js'

const root =
  path.resolve(
    path.dirname(
      fileURLToPath(
        import.meta.url
      )
    ),
    '..'
  )

const validLabel =
  /^(low|mid1|mid2|hi)[A-G](?:#)?$/

if (
  VERIFIED_RANGE_ALL.length !==
  500
) {
  throw new Error(
    `Expected 500 verified ranges, got ${VERIFIED_RANGE_ALL.length}`
  )
}

const keys =
  VERIFIED_RANGE_ALL.map(
    song =>
      `${song.artist}\u0000${song.title}`
  )

if (
  new Set(keys).size !==
  500
) {
  throw new Error(
    'Duplicate verified artist/title found'
  )
}

for (
  const song of
  VERIFIED_RANGE_ALL
) {
  if (
    !validLabel.test(
      song.lowLabel
    ) ||
    !validLabel.test(
      song.highLabel
    ) ||
    !/^https?:\/\//.test(
      song.rangeSource
    )
  ) {
    throw new Error(
      `Invalid verified data: ${song.artist} / ${song.title}`
    )
  }
}

const hubs = [
  'popular-song-ranges',
  'popular-song-ranges-2',
  'popular-song-ranges-3',
  'popular-song-ranges-4',
  'popular-song-ranges-5',
]

for (
  const hub of hubs
) {
  const hubFile =
    path.join(
      root,
      'dist',
      hub,
      'index.html'
    )

  if (
    !fs.existsSync(
      hubFile
    )
  ) {
    throw new Error(
      `Missing generated hub: ${hub}`
    )
  }
}

const assetsDir =
  path.join(
    root,
    'dist',
    'assets'
  )

const bundle =
  fs.readdirSync(
    assetsDir
  )
    .filter(
      name =>
        name.endsWith(
          '.js'
        )
    )
    .map(
      name =>
        fs.readFileSync(
          path.join(
            assetsDir,
            name
          ),
          'utf8'
        )
    )
    .join('\n')

for (
  const title of [
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
  ]
) {
  if (
    !bundle.includes(
      title
    )
  ) {
    throw new Error(
      `Search bundle is missing added song: ${title}`
    )
  }
}

const sitemap =
  fs.readFileSync(
    path.join(
      root,
      'dist',
      'sitemap.xml'
    ),
    'utf8'
  )

for (
  const hub of hubs
) {
  const hubUrl =
    `https://kimikey-app.vercel.app/${hub}/`

  if (
    !sitemap.includes(
      hubUrl
    )
  ) {
    throw new Error(
      `Sitemap missing ${hub}/`
    )
  }
}

console.log(
  '✅ Expanded catalog check passed: 500 verified ranges, 5 SEO hubs, search bundle OK'
)
