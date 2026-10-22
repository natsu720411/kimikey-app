import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

const files = fs.readdirSync(path.join(dist, 'assets'))
const js = files
  .filter(name => name.endsWith('.js'))
  .map(name => fs.readFileSync(path.join(dist, 'assets', name), 'utf8'))
  .join('\n')
const css = files
  .filter(name => name.endsWith('.css'))
  .map(name => fs.readFileSync(path.join(dist, 'assets', name), 'utf8'))
  .join('\n')

for (const requiredText of [
  'かんたん音域測定',
  'お気に入り・最近見た曲',
  '音域ありのみ',
  'お気に入りに追加',
  'おすすめをもっと見る',
  'kimikey-favorite-songs-v1',
  'kimikey-recent-songs-v1',
]) {
  if (!js.includes(requiredText)) {
    throw new Error(`UX feature missing from built JS: ${requiredText}`)
  }
}

for (const requiredClass of [
  '.quick-measure-button',
  '.result-summary-card',
  '.song-filter-panel',
  '.personal-song-columns',
  '.analysis-actions',
]) {
  if (!css.includes(requiredClass)) {
    throw new Error(`UX style missing from built CSS: ${requiredClass}`)
  }
}

console.log('✅ UX feature check passed: quick measurement, result card, favorites/history, filters, share')
