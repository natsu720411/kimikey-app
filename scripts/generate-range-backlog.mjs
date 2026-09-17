import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS } from '../src/songs.js'

const __filename =
  fileURLToPath(import.meta.url)

const __dirname =
  path.dirname(__filename)

const rootDir =
  path.resolve(__dirname, '..')

const reportsDir =
  path.join(rootDir, 'reports')


function hasRangeData(song) {
  return (
    Number.isFinite(song.minMidi) &&
    Number.isFinite(song.maxMidi)
  )
}


function csvEscape(value) {
  const text = String(value ?? '')

  if (
    /[",\n\r]/.test(text)
  ) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}


const missingSongs =
  SONGS
    .filter(
      song =>
        !hasRangeData(song)
    )
    .sort(
      (a, b) => {
        const artistCompare =
          a.artist.localeCompare(
            b.artist,
            'ja'
          )

        if (artistCompare !== 0) {
          return artistCompare
        }

        return a.title.localeCompare(
          b.title,
          'ja'
        )
      }
    )


const registeredCount =
  SONGS.length -
  missingSongs.length


const artistMap =
  new Map()

for (const song of missingSongs) {
  if (!artistMap.has(song.artist)) {
    artistMap.set(
      song.artist,
      []
    )
  }

  artistMap
    .get(song.artist)
    .push(song)
}


const artistGroups =
  [...artistMap.entries()]
    .sort(
      ([artistA, songsA], [artistB, songsB]) => {
        const countDifference =
          songsB.length -
          songsA.length

        if (countDifference !== 0) {
          return countDifference
        }

        return artistA.localeCompare(
          artistB,
          'ja'
        )
      }
    )


const markdownLines = [
  '# キミキー 音域未登録曲バックログ',
  '',
  '> このファイルは `npm run report:ranges` で自動生成されます。',
  '> 曲の最低音・最高音は推測で入力せず、信頼できる情報源で確認してから `src/songs.js` または `src/songs-extra.js` を更新してください。',
  '',
  '## 集計',
  '',
  `- 登録曲総数: ${SONGS.length}曲`,
  `- 音域登録済み: ${registeredCount}曲`,
  `- 音域未登録: ${missingSongs.length}曲`,
  `- 音域未登録アーティスト数: ${artistGroups.length}`,
  '',
  '## アーティスト別',
  '',
]


if (artistGroups.length === 0) {
  markdownLines.push(
    '音域未登録曲はありません。',
    ''
  )
} else {
  for (
    const [artist, artistSongs]
    of artistGroups
  ) {
    markdownLines.push(
      `### ${artist}（${artistSongs.length}曲）`,
      ''
    )

    for (const song of artistSongs) {
      markdownLines.push(
        `- [ ] ${song.title}`
      )
    }

    markdownLines.push('')
  }
}


const csvRows = [
  [
    'priority',
    'artist',
    'title',
    'status',
  ],
]

missingSongs.forEach(
  (song, index) => {
    csvRows.push([
      index + 1,
      song.artist,
      song.title,
      '音域未登録',
    ])
  }
)


const csvText =
  csvRows
    .map(
      row =>
        row
          .map(csvEscape)
          .join(',')
    )
    .join('\n') +
  '\n'


await fs.mkdir(
  reportsDir,
  { recursive: true }
)

await Promise.all([
  fs.writeFile(
    path.join(
      reportsDir,
      'range-backlog.md'
    ),
    markdownLines.join('\n'),
    'utf8'
  ),
  fs.writeFile(
    path.join(
      reportsDir,
      'range-backlog.csv'
    ),
    csvText,
    'utf8'
  ),
])


console.log(
  '🎵 音域バックログを生成しました'
)

console.log(
  `登録曲総数: ${SONGS.length}曲`
)

console.log(
  `音域登録済み: ${registeredCount}曲`
)

console.log(
  `音域未登録: ${missingSongs.length}曲`
)

console.log(
  '出力: reports/range-backlog.md'
)

console.log(
  '出力: reports/range-backlog.csv'
)
