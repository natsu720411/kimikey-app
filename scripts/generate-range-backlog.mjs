import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS } from '../src/songs.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const reportsDir = path.join(rootDir, 'reports')
const demandFilePath = path.join(reportsDir, 'range-demand.csv')

function hasRangeData(song) {
  return (
    Number.isFinite(song.minMidi) &&
    Number.isFinite(song.maxMidi)
  )
}

function normalizeKey(artist, title) {
  return `${artist}|||${title}`
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim()
}

function csvEscape(value) {
  const text = String(value ?? '')

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

function htmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const nextChar = text[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(field)
      field = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        index += 1
      }

      row.push(field)
      field = ''

      if (row.some(value => value.trim() !== '')) {
        rows.push(row)
      }

      row = []
      continue
    }

    field += char
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)

    if (row.some(value => value.trim() !== '')) {
      rows.push(row)
    }
  }

  return rows
}

async function loadDemandMap() {
  const demandMap = new Map()

  try {
    const csvText = await fs.readFile(demandFilePath, 'utf8')
    const rows = parseCsv(csvText)

    if (rows.length === 0) {
      return demandMap
    }

    const header = rows[0].map(value =>
      value
        .replace(/^\uFEFF/, '')
        .trim()
        .toLowerCase()
    )

    const artistIndex = header.indexOf('artist')
    const titleIndex = header.indexOf('title')
    const requestsIndex = header.indexOf('requests')

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

    for (const row of rows.slice(1)) {
      const artist = row[artistIndex]?.trim()
      const title = row[titleIndex]?.trim()
      const requests = Number(row[requestsIndex])

      if (
        !artist ||
        !title ||
        !Number.isFinite(requests) ||
        requests < 0
      ) {
        continue
      }

      const key = normalizeKey(artist, title)

      demandMap.set(
        key,
        (demandMap.get(key) ?? 0) + Math.round(requests)
      )
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error
    }
  }

  return demandMap
}

await fs.mkdir(reportsDir, { recursive: true })

const demandMap = await loadDemandMap()

const missingSongs = SONGS
  .filter(song => !hasRangeData(song))
  .map(song => ({
    ...song,
    requestCount:
      demandMap.get(normalizeKey(song.artist, song.title)) ?? 0,
  }))
  .sort((a, b) => {
    const requestDifference = b.requestCount - a.requestCount

    if (requestDifference !== 0) {
      return requestDifference
    }

    const artistCompare = a.artist.localeCompare(b.artist, 'ja')

    if (artistCompare !== 0) {
      return artistCompare
    }

    return a.title.localeCompare(b.title, 'ja')
  })

const registeredCount = SONGS.length - missingSongs.length

const artistMap = new Map()

for (const song of missingSongs) {
  if (!artistMap.has(song.artist)) {
    artistMap.set(song.artist, [])
  }

  artistMap.get(song.artist).push(song)
}

const artistGroups = [...artistMap.entries()].sort(
  ([artistA, songsA], [artistB, songsB]) => {
    const requestsA = songsA.reduce(
      (sum, song) => sum + song.requestCount,
      0
    )

    const requestsB = songsB.reduce(
      (sum, song) => sum + song.requestCount,
      0
    )

    const requestDifference = requestsB - requestsA

    if (requestDifference !== 0) {
      return requestDifference
    }

    const countDifference = songsB.length - songsA.length

    if (countDifference !== 0) {
      return countDifference
    }

    return artistA.localeCompare(artistB, 'ja')
  }
)

const demandedSongs = missingSongs.filter(
  song => song.requestCount > 0
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
  markdownLines.push('## 需要優先ランキング', '')

  demandedSongs.slice(0, 50).forEach((song, index) => {
    markdownLines.push(
      `${index + 1}. **${song.artist} - ${song.title}**（${song.requestCount}件）`
    )
  })

  markdownLines.push('')
}

markdownLines.push('## アーティスト別', '')

if (artistGroups.length === 0) {
  markdownLines.push('音域未登録曲はありません。', '')
} else {
  for (const [artist, artistSongs] of artistGroups) {
    const artistRequests = artistSongs.reduce(
      (sum, song) => sum + song.requestCount,
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

      markdownLines.push(`- [ ] ${song.title}${demandLabel}`)
    }

    markdownLines.push('')
  }
}

const csvRows = [
  ['priority', 'requests', 'artist', 'title', 'status'],
]

missingSongs.forEach((song, index) => {
  csvRows.push([
    index + 1,
    song.requestCount,
    song.artist,
    song.title,
    '音域未登録',
  ])
})

const csvText =
  csvRows
    .map(row => row.map(csvEscape).join(','))
    .join('\n') + '\n'

const artistOptions = [
  '<option value="">すべてのアーティスト</option>',
  ...[...artistMap.keys()]
    .sort((a, b) => a.localeCompare(b, 'ja'))
    .map(
      artist =>
        `<option value="${htmlEscape(artist)}">${htmlEscape(artist)}</option>`
    ),
].join('\n')

const tableRows = missingSongs
  .map(
    (song, index) => `
      <tr
        data-artist="${htmlEscape(song.artist)}"
        data-search="${htmlEscape(`${song.artist} ${song.title}`.toLowerCase())}"
        data-requests="${song.requestCount}"
      >
        <td>${index + 1}</td>
        <td class="requests">${song.requestCount}</td>
        <td>${htmlEscape(song.artist)}</td>
        <td>${htmlEscape(song.title)}</td>
        <td><span class="status">音域未登録</span></td>
      </tr>
    `
  )
  .join('')

const htmlText = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>キミキー 音域未登録曲バックログ</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f5f6fa;
      color: #20222a;
    }
    main {
      width: min(1180px, calc(100% - 32px));
      margin: 32px auto 64px;
    }
    h1 { margin-bottom: 8px; }
    .note {
      margin: 0 0 24px;
      color: #5e6472;
      line-height: 1.7;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }
    .card {
      background: white;
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,.06);
    }
    .card strong {
      display: block;
      font-size: 24px;
      margin-top: 4px;
    }
    .filters {
      display: grid;
      grid-template-columns: 1fr minmax(220px, 320px);
      gap: 12px;
      margin-bottom: 16px;
    }
    input, select {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #d8dbe5;
      border-radius: 10px;
      background: white;
      font: inherit;
    }
    .table-wrap {
      overflow-x: auto;
      background: white;
      border-radius: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,.06);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 760px;
    }
    th, td {
      padding: 12px 14px;
      text-align: left;
      border-bottom: 1px solid #eceef3;
    }
    th {
      position: sticky;
      top: 0;
      background: #fafbfe;
      font-size: 13px;
      color: #606675;
    }
    .requests {
      font-weight: 700;
    }
    .status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 999px;
      background: #fff4d8;
      color: #7a5410;
      font-size: 12px;
      white-space: nowrap;
    }
    #visibleCount {
      margin: 0 0 10px;
      color: #606675;
      font-size: 14px;
    }
    @media (max-width: 700px) {
      main {
        width: min(100% - 20px, 1180px);
        margin-top: 20px;
      }
      .filters {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <main>
    <h1>キミキー 音域未登録曲バックログ</h1>
    <p class="note">
      音域データを追加する順番を決めるためのローカル管理画面です。<br />
      requests が多い曲ほど、実際のユーザー需要が高い候補です。
    </p>

    <section class="stats">
      <div class="card">登録曲総数<strong>${SONGS.length}</strong></div>
      <div class="card">音域登録済み<strong>${registeredCount}</strong></div>
      <div class="card">音域未登録<strong>${missingSongs.length}</strong></div>
      <div class="card">需要データあり<strong>${demandedSongs.length}</strong></div>
    </section>

    <section class="filters">
      <input
        id="searchInput"
        type="search"
        placeholder="曲名・アーティスト名で検索"
      />
      <select id="artistFilter">
        ${artistOptions}
      </select>
    </section>

    <p id="visibleCount"></p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>優先順位</th>
            <th>requests</th>
            <th>アーティスト</th>
            <th>曲名</th>
            <th>状態</th>
          </tr>
        </thead>
        <tbody id="backlogBody">
          ${tableRows}
        </tbody>
      </table>
    </div>
  </main>

  <script>
    const searchInput = document.querySelector('#searchInput')
    const artistFilter = document.querySelector('#artistFilter')
    const rows = [...document.querySelectorAll('#backlogBody tr')]
    const visibleCount = document.querySelector('#visibleCount')

    function normalize(value) {
      return String(value || '')
        .normalize('NFKC')
        .toLowerCase()
        .replace(/\\s+/g, '')
    }

    function filterRows() {
      const query = normalize(searchInput.value)
      const artist = artistFilter.value
      let count = 0

      rows.forEach(row => {
        const searchable = normalize(row.dataset.search)
        const matchesQuery = !query || searchable.includes(query)
        const matchesArtist = !artist || row.dataset.artist === artist
        const visible = matchesQuery && matchesArtist

        row.hidden = !visible

        if (visible) {
          count += 1
        }
      })

      visibleCount.textContent = count + '曲を表示中'
    }

    searchInput.addEventListener('input', filterRows)
    artistFilter.addEventListener('change', filterRows)
    filterRows()
  </script>
</body>
</html>
`

await Promise.all([
  fs.writeFile(
    path.join(reportsDir, 'range-backlog.md'),
    markdownLines.join('\n'),
    'utf8'
  ),
  fs.writeFile(
    path.join(reportsDir, 'range-backlog.csv'),
    csvText,
    'utf8'
  ),
  fs.writeFile(
    path.join(reportsDir, 'range-backlog.html'),
    htmlText,
    'utf8'
  ),
])

console.log('🎵 音域バックログを生成しました')
console.log(`登録曲総数: ${SONGS.length}曲`)
console.log(`音域登録済み: ${registeredCount}曲`)
console.log(`音域未登録: ${missingSongs.length}曲`)
console.log(`需要データあり: ${demandedSongs.length}曲`)
console.log('入力: reports/range-demand.csv')
console.log('出力: reports/range-backlog.md')
console.log('出力: reports/range-backlog.csv')
console.log('出力: reports/range-backlog.html')
