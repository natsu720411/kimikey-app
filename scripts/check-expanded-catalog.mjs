import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { VERIFIED_RANGE_ALL } from '../src/songs-verified-all.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const validLabel = /^(low|mid1|mid2|hi)[A-G](?:#)?$/

if (VERIFIED_RANGE_ALL.length !== 300) {
  throw new Error(`Expected 300 verified ranges, got ${VERIFIED_RANGE_ALL.length}`)
}

const keys = VERIFIED_RANGE_ALL.map(song => `${song.artist}\u0000${song.title}`)
if (new Set(keys).size !== 300) {
  throw new Error('Duplicate verified artist/title found')
}

for (const song of VERIFIED_RANGE_ALL) {
  if (
    !validLabel.test(song.lowLabel) ||
    !validLabel.test(song.highLabel) ||
    !/^https?:\/\//.test(song.rangeSource)
  ) {
    throw new Error(`Invalid verified data: ${song.artist} / ${song.title}`)
  }
}

for (const hub of [
  'popular-song-ranges',
  'popular-song-ranges-2',
  'popular-song-ranges-3',
]) {
  const file = path.join(root, 'dist', hub, 'index.html')
  if (!fs.existsSync(file)) {
    throw new Error(`Missing generated hub: ${hub}`)
  }
}

const assetsDir = path.join(root, 'dist', 'assets')
const bundle = fs.readdirSync(assetsDir)
  .filter(name => name.endsWith('.js'))
  .map(name => fs.readFileSync(path.join(assetsDir, name), 'utf8'))
  .join('\n')

for (const title of [
  'ultra soul',
  '三日月',
  '奏（かなで）',
  'ひまわりの約束',
  'White Love',
]) {
  if (!bundle.includes(title)) {
    throw new Error(`Search bundle is missing added song: ${title}`)
  }
}

const sitemap = fs.readFileSync(path.join(root, 'dist', 'sitemap.xml'), 'utf8')
for (const hub of [
  'popular-song-ranges/',
  'popular-song-ranges-2/',
  'popular-song-ranges-3/',
]) {
  if (!sitemap.includes(`https://kimikey-app.vercel.app/${hub}`)) {
    throw new Error(`Sitemap missing ${hub}`)
  }
}

console.log('✅ Expanded catalog check passed: search bundle contains added songs, 300 verified ranges, 3 SEO hubs')
