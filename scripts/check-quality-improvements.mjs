import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { yinPitchDetection } from '../src/pitch-detection.js'
import { SONGS } from '../src/songs.js'
import { CATALOG_ALL_SONGS } from '../src/songs-catalog-all.js'
import { VERIFIED_RANGE_ALL } from '../src/songs-verified-all.js'

const key = s => s.artist+'\u0000'+s.title
const known = new Set([...SONGS,...CATALOG_ALL_SONGS].map(key))
const seen = new Set()
for (const s of VERIFIED_RANGE_ALL) {
  const id=key(s)
  if (seen.has(id) || !known.has(id) || !s.rangeVerified ||
      !/^(low|mid1|mid2|hi|hihi)[A-G]#?$/.test(s.lowLabel) ||
      !/^(low|mid1|mid2|hi|hihi)[A-G]#?$/.test(s.highLabel) ||
      !/^https:\/\//.test(s.rangeSource)) throw new Error('Broken verified range data: '+id)
  seen.add(id)
}
const sampleRate = 48000
for (const freq of [50, 65, 110, 220, 440, 880]) {
  const buffer = Float32Array.from({length:4096},(_,i)=>0.3*Math.sin(2*Math.PI*freq*i/sampleRate))
  const result = yinPitchDetection(buffer,sampleRate,0.01)
  if (result <= 0 || Math.abs(1200*Math.log2(result/freq)) > 30)
    throw new Error('Pitch regression at '+freq+'Hz: '+result)
}
if (yinPitchDetection(new Float32Array(4096),sampleRate,0.01)!==-1)
  throw new Error('Silent input detected as voice')
const dist=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','dist')
const ranking = JSON.parse(fs.readFileSync(path.resolve(dist, 'popular-songs.json'), 'utf8'))
const popularPage = fs.readFileSync(path.resolve(dist, 'popular', 'index.html'), 'utf8')
if (!popularPage.includes('application/ld+json') ||
    !popularPage.includes('ItemList') ||
    !popularPage.includes('id="popularList"') ||
    !popularPage.includes(String(ranking.songs?.[0]?.title ?? '__unknown__')))
  throw new Error('Popular ranking static page is out of sync with ranking JSON')
const page=fs.readFileSync(path.join(dist,'artist-range-guide','index.html'),'utf8')
const sitemap=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8')
if (!page.includes('アーティスト別の確認済み音域') ||
    !page.includes('href="/songs/') ||
    !sitemap.includes('https://kimikey-app.vercel.app/artist-range-guide/'))
  throw new Error('Artist range guide SEO integration missing')
console.log('Quality checks passed: '+seen.size+' sourced songs, synthetic pitch tests 50-880Hz, artist range guide')
