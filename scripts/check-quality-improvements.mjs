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

const priorityPages = [
  {
    file: 'songs/happy-birthday-41/index.html',
    canonical: 'https://kimikey-app.vercel.app/songs/happy-birthday-41/',
    heading: 'HAPPY BIRTHDAY（back number）の音域',
    link: 'https://keytube.net/song/detail/25327',
    legacy: 'gsc-happy-birthday-intent-faq-20261026',
  },
  {
    file: 'songs/song-446/index.html',
    canonical: 'https://kimikey-app.vercel.app/songs/song-446/',
    heading: '花占い（Vaundy）の音域',
    link: 'https://keytube.net/song/detail/57677',
    legacy: 'gsc-opportunity-hanauranai',
  },
]
for (const target of priorityPages) {
  const html = fs.readFileSync(path.join(dist, target.file), 'utf8')
  const all = re => [...html.matchAll(re)].length
  if (all(/<title>[\s\S]*?<\/title>/g) !== 1 ||
      all(/<meta name="description"/g) !== 1 ||
      all(/<h1[^>]*>[\s\S]*?<\/h1>/g) !== 1 ||
      all(/<link rel="canonical"/g) !== 1 ||
      html.includes(target.legacy) ||
      !html.includes(target.heading) ||
      !html.includes('<link rel="canonical" href="' + target.canonical + '">') ||
      !html.includes(target.link) ||
      !html.includes('gsc-quick-answer') ||
      !html.includes('BreadcrumbList') ||
      !html.includes('自分の音域を比較する'))
    throw new Error('GSC landing page regression: ' + target.file)
  const og = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1]
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]
  if (og !== title) throw new Error('OpenGraph title mismatch: ' + target.file)
}
const focusIndex = fs.readFileSync(path.join(dist, 'song-range-index', 'index.html'), 'utf8')
if (!focusIndex.includes('ハッピーバースデーの音域・最高音') ||
    !focusIndex.includes('花占いの音域・最高音'))
  throw new Error('Search-targeted internal links missing')
const assetsJs = fs.readdirSync(path.join(dist, 'assets')).filter(n => n.endsWith('.js'))
  .map(n => fs.readFileSync(path.join(dist, 'assets', n), 'utf8')).join('\n')
if (!assetsJs.includes('popular-search-entrances') ||
    !assetsJs.includes('/songs/happy-birthday-41/') ||
    !assetsJs.includes('/songs/song-446/'))
  throw new Error('Homepage search intent links missing')

console.log('Quality checks passed: '+seen.size+' sourced songs, synthetic pitch tests 50-880Hz, artist range guide')
