import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS as BASE_SONGS } from '../src/songs.js'
import { CATALOG_500_SONGS } from '../src/songs-catalog-500.js'
import { CATALOG_500_2_SONGS } from '../src/songs-catalog-500-2.js'

const key = song => `${song.artist}\u0000${song.title}`

if (CATALOG_500_2_SONGS.length !== 550) {
  throw new Error(
    `Expected 550 second-catalog entries, got ${CATALOG_500_2_SONGS.length}`
  )
}

const secondKeys = CATALOG_500_2_SONGS.map(key)

if (new Set(secondKeys).size !== CATALOG_500_2_SONGS.length) {
  throw new Error('Duplicate artist/title found inside second search catalog')
}

for (const song of CATALOG_500_2_SONGS) {
  if (!song.artist?.trim() || !song.title?.trim()) {
    throw new Error('Second search catalog contains a blank artist/title')
  }

  if (song.rangeVerified !== false || song.catalogOnly !== true) {
    throw new Error(
      `Unsafe catalog flags: ${song.artist} / ${song.title}`
    )
  }
}

const beforeKeys = new Set([
  ...BASE_SONGS.map(key),
  ...CATALOG_500_SONGS.map(key),
])

const afterKeys = new Set([
  ...beforeKeys,
  ...CATALOG_500_2_SONGS.map(key),
])

const netAdded = afterKeys.size - beforeKeys.size
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
)
const statsPath = path.join(root, 'public', 'catalog-stats.json')

fs.writeFileSync(
  statsPath,
  `${JSON.stringify({
    secondCatalogCandidates: CATALOG_500_2_SONGS.length,
    netAddedUniqueSongs: netAdded,
    searchableUniqueSongs: afterKeys.size,
  }, null, 2)}\n`,
  'utf8'
)

console.log(
  `✅ Search catalog expansion passed: 550 candidates, ${netAdded} net-new unique songs, ${afterKeys.size} searchable unique songs in base + catalogs`
)
