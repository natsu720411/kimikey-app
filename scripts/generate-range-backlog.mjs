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

const demandFilePath =
  path.join(
    reportsDir,
    'range-demand.csv'
  )


function hasRangeData(song) {
  return (
    Number.isFinite(song.minMidi) &&
    Number.isFinite(song.maxMidi)
  )
}


function normalizeKey(
  artist,
  title
) {
  return `${artist}|||${title}`
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim()
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


function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (
    let index = 0;
    index < text.length;
    index += 1
  ) {
    const char = text[index]
    const nextChar =
      text[index + 1]

    if (char === '"') {
      if (
        inQuotes &&
        nextChar === '"'
      ) {
        field += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }

      continue
    }

    if (
      char === ',' &&
      !inQuotes
    ) {
      row.push(field)
      field = ''
      continue
    }

    if (
      (char === '\n' || char === '\r') &&
      !inQuotes
    ) {
      if (
        char === '\r' &&
        nextChar === '\n'
      ) {
        index += 1
      }

      row.push(field)
      field = ''

      if (
        row.some(
          value =>
            value.trim() !== ''
        )
      ) {
        rows.push(row)
      }

      row = []
      continue
    }

    field += char
  }

  if (
    field.length > 0 ||
    row.length > 0
  ) {
    row.push(field)

    if (
      row.some(
        value =>
          value.trim() !== ''
      )
    ) {
      rows.push(row)
    }
  }

  return rows
}


async function loadDemandMap() {
  const demandMap =
    new Map()

  try {
    const csvText =
      await fs.readFile(
        demandFilePath,
        'utf8'
      )

    const rows =
      parseCsv(csvText)

    if (rows.length === 0) {
      return demandMap
    }

    const header =
      rows[0].map(
        value =>
          value
            .replace(/^\uFEFF/, '')
            .trim()
            .toLowerCase()
      )

    const artistIndex =
      header.indexOf('artist')

    const titleIndex =
      header.indexOf('title')

    const requestsIndex =
      header.indexOf('requests')

    if (
      artistIndex === -1 ||
      titleIndex === -1 ||
      requestsIndex === -1
    ) {
      console.warn(
        '⚠️ reports/range-demand.csv の列は artist,title,requests にしてください'
      )

      return demandMap
    }

    for (
      const row of rows.slice(1)
    ) {
      const artist =
        row[artistIndex]?.trim()

      const title =
        row[titleIndex]?.trim()

      const requests =
        Number(
          row[requestsIndex]
        )

      if (
        !artist ||
        !title ||
        !Number.isFinite(requests) ||
        requests < 0
      ) {
        continue
      }

      const key =
        normalizeKey(
          artist,
          title
        )

      demandMap.set(
        key,
        (demandMap.get(key) ?? 0) +
          Math.round(requests)
      )
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error
    }
  }

  return demandMap
}


await fs.mkdir(
  reportsDir,
  { recursive: true }
)

const demandMap =
  await loadDemandMap()


const missingSongs =
  SONGS
    .filter(
      song =>
        !hasRangeData(song)
    )
    .map(
      song => ({
        ...song,
        requestCount:
          demandMap.get(
            normalizeKey(
              song.artist,
              song.title
            )
          ) ?? 0,
      })
    )
    .sort(
      (a, b) => {
        const requestDifference =
          b.requestCount -
          a.requestCount

        if (requestDifference !== 0) {
          return requestDifference
        }

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
        const requestsA =
          songsA.reduce(
            (sum, song) =>
              sum + song.requestCount,
            0
          )

        const requestsB =
          songsB.reduce(
            (sum, song) =>
              sum + song.requestCount,
            0
          )

        const requestDifference =
          requestsB - requestsA

        if (requestDifference !== 0) {
          return requestDifference
        }

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


const demandedSongs =
  missingSongs.filter(
    song =>
      song.requestCount > 0
  )


const markdownLines = [
  '# キミキー 音域未登録曲バックログ',
  '',
  '> このファイルは `npm run report:ranges` で自動生成されます。',
  '> 曲の最低音・最高音は推測で入力せず、信頼できる情報源で確認してから `src/songs.js` または `src/songs-extra.js` を更新してください。',
  '> `reports/range-demand.csv` に Analytics の需要件数を入れると、リクエストが多い曲ほど上位になります。',
  '',
  '## 集計',
  '',
  `- 登録曲総数: ${SONGS.length}曲`,
  `- 音域登録済み: ${registeredCount}曲`,
  `- 音域未登録: ${missingSongs.length}曲`,
  `- 音域未登録アーティスト数: ${artistGroups.length}`,
  `- 需要データあり: ${demandedSongs.length}曲`,
  '',
]


if (demandedSongs.length > 0) {
  markdownLines.push(
    '## 需要優先ランキング',
    ''
  )

  demandedSongs
    .slice(0, 50)
    .forEach(
      (song, index) => {
        markdownLines.push(
          `${index + 1}. **${song.artist} - ${song.title}**（${song.requestCount}件）`
        )
      }
    )

  markdownLines.push('')
}


markdownLines.push(
  '## アーティスト別',
  ''
)


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
    const artistRequests =
      artistSongs.reduce(
        (sum, song) =>
          sum + song.requestCount,
        0
      )

    const requestLabel =
      artistRequests > 0
        ? `・需要${artistRequests}件`
        : ''

    markdownLines.push(
      `### ${artist}（${artistSongs.length}曲${requestLabel}）`,
      ''
    )

    for (const song of artistSongs) {
      const demandLabel =
        song.requestCount > 0
          ? ` — **${song.requestCount}件**`
          : ''

      markdownLines.push(
        `- [ ] ${song.title}${demandLabel}`
      )
    }

    markdownLines.push('')
  }
}


const csvRows = [
  [
    'priority',
    'requests',
    'artist',
    'title',
    'status',
  ],
]

missingSongs.forEach(
  (song, index) => {
    csvRows.push([
      index + 1,
      song.requestCount,
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
  `需要データあり: ${demandedSongs.length}曲`
)

console.log(
  '入力: reports/range-demand.csv'
)

console.log(
  '出力: reports/range-backlog.md'
)

console.log(
  '出力: reports/range-backlog.csv'
)
