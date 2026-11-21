import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS as BASE_SONGS } from '../src/songs.js'
import { CATALOG_ALL_SONGS } from '../src/songs-catalog-all.js'
import { VERIFIED_RANGE_ALL } from '../src/songs-verified-all.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://kimikey-app.vercel.app'
const key = s => `${s.artist}\u0000${s.title}`
const base = new Map(BASE_SONGS.map(s => [key(s), s]))
const catalog = new Map(CATALOG_ALL_SONGS.map((s, i) => [key(s), { ...s, id: 10000 + i }]))
const escapeHtml = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;')
  .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')
const href = song => {
  const slug = String(song.title).normalize('NFKD').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return '/songs/' + (slug ? slug + '-' + song.id : 'song-' + song.id) + '/'
}
const groups = new Map()
for (const verified of VERIFIED_RANGE_ALL) {
  const original = base.get(key(verified)) ?? catalog.get(key(verified))
  if (!original) throw new Error('Verified song without catalog entry: ' + key(verified))
  if (!groups.has(verified.artist)) groups.set(verified.artist, [])
  groups.get(verified.artist).push({ ...verified, id: original.id })
}
const sorted = [...groups].sort((a,b)=>b[1].length-a[1].length || a[0].localeCompare(b[0],'ja'))
const featured = sorted.slice(0, 40)
const sections = featured.map(([artist, songs], i) =>
  '<section id="artist-'+i+'"><h2>'+escapeHtml(artist)+'（'+songs.length+'曲）</h2>'+
  '<div class="songs">'+songs.slice(0, 8).map(s =>
    '<a href="'+href(s)+'"><strong>'+escapeHtml(s.title)+'</strong>'+
    '<small>'+escapeHtml(s.lowLabel)+'〜'+escapeHtml(s.highLabel)+'</small></a>'
  ).join('')+'</div><p><a href="/?search='+encodeURIComponent(artist)+'">このアーティストの曲をさらに検索する</a></p></section>'
).join('\n')
const nav = featured.map(([artist, songs],i) =>
  '<a href="#artist-'+i+'">'+escapeHtml(artist)+'（'+songs.length+'曲）</a>').join('')
const html = '<!doctype html><html lang="ja"><head><meta charset="UTF-8">'+
'<meta name="viewport" content="width=device-width,initial-scale=1">'+
'<title>アーティスト別の歌の音域一覧｜確認済み最低音・最高音｜キミキー</title>'+
'<meta name="description" content="キミキーの確認済み音域データからアーティスト別に最低音と最高音を検索。人気アーティストの曲と音域を一覧で確認できます。">'+
'<meta name="robots" content="index, follow"><link rel="canonical" href="'+SITE+'/artist-range-guide/">'+
'<style>*{box-sizing:border-box}body{margin:0;background:#f5f7fc;color:#222;font-family:system-ui,sans-serif;line-height:1.75}main{max-width:1000px;margin:auto;padding:22px 14px 64px}article,section{background:#fff;border-radius:15px;padding:20px;margin:14px 0}a{color:#244b9c}.nav{display:flex;flex-wrap:wrap;gap:9px}.nav a{padding:6px 9px;border:1px solid #e1e6f3;border-radius:9px}.songs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.songs a{display:flex;justify-content:space-between;gap:10px;border:1px solid #edf0f5;border-radius:10px;padding:10px;text-decoration:none}.songs small{color:#555}@media(max-width:600px){.songs{grid-template-columns:1fr}}</style>'+
'</head><body><main><p><a href="/">🎤 キミキー</a> ・ <a href="/song-range-index/">音域一覧</a></p>'+
'<article><h1>アーティスト別の確認済み音域一覧</h1>'+
'<p>最低音・最高音の参照元がある曲から、収録数の多いアーティスト40組を掲載。曲名から詳細ページへ進めます。音域は歌唱時の目安で、地声・裏声の扱いが出典によって異なる場合があります。</p>'+
'<nav class="nav" aria-label="アーティストから選ぶ">'+nav+'</nav></article>'+sections+
'<p><a href="/song-range-index/">全音域一覧に戻る</a> ・ <a href="/highest-note-songs/">最高音別に探す</a></p></main></body></html>'
const out = path.join(root, 'public', 'artist-range-guide')
fs.mkdirSync(out, { recursive:true })
fs.writeFileSync(path.join(out, 'index.html'), html, 'utf8')
const sitemapPath = path.join(root,'public','sitemap.xml')
let sitemap = fs.readFileSync(sitemapPath,'utf8')
const url = SITE+'/artist-range-guide/'
if (!sitemap.includes('<loc>'+url+'</loc>'))
  sitemap = sitemap.replace('</urlset>', '<url><loc>'+url+'</loc><changefreq>monthly</changefreq></url>\n</urlset>')
fs.writeFileSync(sitemapPath, sitemap,'utf8')
console.log('Artist range guide created: '+featured.length+' artist groups, '+VERIFIED_RANGE_ALL.length+' verified ranges')
