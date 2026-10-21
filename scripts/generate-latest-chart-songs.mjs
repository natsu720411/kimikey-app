import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS } from '../src/songs.js'
import { CATALOG_ALL_SONGS } from '../src/songs-catalog-all.js'
import { VERIFIED_RANGE_ALL } from '../src/songs-verified-all.js'
import { LATEST_CHART_SONGS_20261022 as latest } from '../src/songs-latest-chart-20261022.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(root, 'public')
const key = s => s.artist + '\u0000' + s.title
const escape = s => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;')
  .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')
const chartNames = { digital:'週間デジタルシングル', single:'週間シングル', streaming:'週間ストリーミング' }
const urls = {
  digital:'https://www.oricon.co.jp/music/rankinglab/dis/2026-10-26/',
  single:'https://www.oricon.co.jp/music/rankinglab/js/2026-10-26/',
  streaming:'https://www.oricon.co.jp/music/rankinglab/st/2026-10-26/',
}
if (latest.length !== 27 || new Set(latest.map(key)).size !== latest.length)
  throw new Error('Latest chart batch is not 27 unique songs')
const normalize = s => String(s).normalize('NFKC').toLowerCase()
  .replace(/[\s・･._\-‐‑–—'’"“”!?！？。、「」()（）&＆+＋]/g,'')
if (new Set(latest.map(s => normalize(s.artist) + '\u0000' + normalize(s.title))).size !== latest.length)
  throw new Error('Near-duplicate chart songs')
for (const s of latest) {
  if (!s.artist || !s.title || s.rangeVerified !== false ||
      s.lowLabel != null || s.highLabel != null || s.rangeSource != null ||
      urls[s.chartType] !== s.chartSource || !Number.isInteger(s.chartRank) ||
      s.chartRank < 1 || s.chartRank > 50)
    throw new Error('Invalid chart entry: ' + s.artist + ' / ' + s.title)
}
const known = new Set([...SONGS, ...CATALOG_ALL_SONGS].map(key))
const verified = new Set(VERIFIED_RANGE_ALL.map(key))
if (SONGS.length !== 971 || known.size !== 1945)
  throw new Error('Search count mismatch: ' + SONGS.length + '/' + known.size)
if ([...known].filter(k => verified.has(k)).length !== 1738)
  throw new Error('Verified count mismatch')
for (const s of latest) {
  if (!known.has(key(s)) || verified.has(key(s)))
    throw new Error('New song missing or incorrectly verified: ' + s.artist + ' / ' + s.title)
}
const cards = latest.map(s =>
  '<li><a class="title" href="/?search=' + encodeURIComponent(s.title) + '">' +
  escape(s.title) + '</a><span>' + escape(s.artist) +
  ' ・ <strong>音域未確認</strong></span><small><a href="' + s.chartSource +
  '" rel="noopener noreferrer" target="_blank">オリコン' + chartNames[s.chartType] +
  ' ' + s.chartRank + '位</a></small></li>'
).join('\n')
const css = '*{box-sizing:border-box}body{margin:0;background:#f6f7fb;color:#222;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.7}main{max-width:900px;margin:25px auto;padding:0 14px}article{padding:24px;background:white;border-radius:18px}a{color:#2948a8}ul{list-style:none;padding:0;display:grid;gap:10px}li{border:1px solid #e8e9ef;border-radius:12px;padding:13px;display:flex;flex-direction:column;gap:3px}.title{font-size:1.1rem;font-weight:700}li span{font-size:.92rem;color:#555}li strong{color:#98671b}small{font-size:.8rem}'
const html = [
  '<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
  '<title>2026年10月の人気新曲27曲｜キミキー</title>',
  '<meta name="description" content="2026年10月26日付オリコンの最新ランキングから新規追加した人気新曲27曲を掲載。曲名から検索でき、音域の確認状況もわかります。">',
  '<meta name="robots" content="index, follow"><link rel="canonical" href="https://kimikey-app.vercel.app/latest-chart-songs/">',
  '<style>' + css + '</style></head><body><main><a href="/">🎤 キミキー</a><article>',
  '<h1>2026年10月の人気新曲27曲</h1>',
  '<p>2026年10月26日付のオリコン週間デジタルシングル・週間シングル・週間ストリーミングのチャート掲載曲から、キミキー未登録の曲だけを追加しました。</p>',
  '<p>追加27曲、音域確認済み0曲。音域を推測せず、確認できるまで「音域未確認」と表示します。曲名を押すとキミキーの検索画面で探せます。</p>',
  '<ul>' + cards + '</ul>',
  '<p><a href="/song-range-index/">確認済み音域一覧</a> ・ <a href="/highest-note-songs/">最高音別一覧</a> ・ <a href="/">音域測定</a></p>',
  '</article></main></body></html>',
].join('\n')
const dir = path.join(pub,'latest-chart-songs')
fs.mkdirSync(dir,{recursive:true})
fs.writeFileSync(path.join(dir,'index.html'),html,'utf8')
const stats = { checkedAt:'2026-10-22',chartDate:'2026-10-26',addedSongs:27,newlyVerified:0,
  searchableSongs:known.size,verifiedSongs:1738,unverifiedSongs:known.size-1738 }
fs.writeFileSync(path.join(pub,'latest-chart-stats.json'),JSON.stringify(stats,null,2)+'\n','utf8')
for (const relative of ['songs/index.html','song-range-index/index.html']) {
  const file = path.join(pub,relative)
  const content = fs.readFileSync(file,'utf8')
  if (!content.includes('</main>')) throw new Error('Missing main in '+relative)
  const block = '<section><h2>最新チャートから追加した人気新曲</h2><p><a href="/latest-chart-songs/">2026年10月の新着27曲を探す</a>（音域未確認曲は検索のみ）</p></section>'
  fs.writeFileSync(file,content.replace('</main>',block+'</main>'),'utf8')
}
const sitemapFile = path.join(pub,'sitemap.xml')
let sitemap = fs.readFileSync(sitemapFile,'utf8')
const url = 'https://kimikey-app.vercel.app/latest-chart-songs/'
if (!sitemap.includes('<loc>'+url+'</loc>'))
  sitemap = sitemap.replace('</urlset>','<url><loc>'+url+'</loc><changefreq>weekly</changefreq></url>\n</urlset>')
fs.writeFileSync(sitemapFile,sitemap,'utf8')
console.log('Latest chart songs: 27 added, 0 verified, 1945 searchable, 1738 verified, 207 unverified')
