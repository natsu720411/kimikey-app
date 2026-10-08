import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const songsDir = path.join(publicDir, 'songs')
const SITE = 'https://kimikey-app.vercel.app'

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function write(filePath, html) {
  fs.writeFileSync(filePath, html, 'utf8')
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function insertBeforeArticleEnd(html, marker, block) {
  if (html.includes(marker)) return html
  if (html.includes('</article>')) return html.replace('</article>', block + '\n</article>')
  if (html.includes('</main>')) return html.replace('</main>', block + '\n</main>')
  return html
}

function walkIndexFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) walkIndexFiles(fullPath, results)
    if (entry.isFile() && entry.name === 'index.html') results.push(fullPath)
  }
  return results
}

function findSongHref(title) {
  for (const filePath of walkIndexFiles(songsDir)) {
    const html = read(filePath)
    if (html.includes('<h1') && html.includes(title)) {
      const relativeDir = path.relative(publicDir, path.dirname(filePath))
      return '/' + relativeDir.split(path.sep).join('/') + '/'
    }
  }
  return null
}

const rangeHubPaths = Array.from({ length: 23 }, (_, index) =>
  index === 0 ? 'popular-song-ranges' : 'popular-song-ranges-' + (index + 1)
)

const priorityPages = [
  ['/songs/happy-birthday-41/', 'HAPPY BIRTHDAY / ハッピーバースデー', 'back number'],
  ['/songs/song-446/', '花占い', 'Vaundy'],
  ['/songs/song-306/', '唱', 'Ado'],
  ['/hia-frequency/', 'hiAは何Hz？', 'hiA = 440Hz'],
]

const venusHref = findSongHref('星屑ビーナス')
if (venusHref) priorityPages.push([venusHref, '星屑ビーナス', 'Aimer'])
const kizunaHref = findSongHref('絆ノ奇跡')
if (kizunaHref) priorityPages.push([kizunaHref, '絆ノ奇跡', 'MAN WITH A MISSION × milet'])

const hubCards = rangeHubPaths.map((hub, index) =>
  '<a class="hub-card" href="/' + hub + '/"><strong>音域一覧 第' + (index + 1) + '弾</strong><span>確認済みの曲別音域ページを見る</span></a>'
).join('')

const priorityCards = priorityPages.map(([href, title, artist]) =>
  '<a class="priority-card" href="' + href + '"><strong>' + escapeHtml(title) + '</strong><span>' + escapeHtml(artist) + '</span></a>'
).join('')

const indexDir = path.join(publicDir, 'song-range-index')
fs.mkdirSync(indexDir, { recursive: true })

const html = [
  '<!doctype html>',
  '<html lang="ja">',
  '<head>',
  '  <meta charset="UTF-8">',
  '  <meta name="viewport" content="width=device-width,initial-scale=1">',
  '  <title>曲の音域一覧｜最低音・最高音から探す｜キミキー</title>',
  '  <meta name="description" content="キミキーで公開している確認済み曲の音域ページをまとめた一覧です。最低音・最高音を確認し、歌いやすいキーや自分の音域との比較に使えます。">',
  '  <meta name="robots" content="index, follow">',
  '  <link rel="canonical" href="' + SITE + '/song-range-index/">',
  '  <meta property="og:title" content="曲の音域一覧｜最低音・最高音から探す｜キミキー">',
  '  <meta property="og:description" content="確認済みの曲別音域ページをまとめて探せる一覧です。">',
  '  <meta property="og:image" content="' + SITE + '/og-image.png">',
  '  <style>*{box-sizing:border-box}body{margin:0;background:#f6f7fb;color:#222;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.75}.wrap{width:min(980px,calc(100% - 28px));margin:auto;padding:24px 0 60px}.card{background:#fff;border-radius:20px;padding:28px;box-shadow:0 8px 30px #0000000f}.logo{font-size:21px;font-weight:800;text-decoration:none;color:inherit}.lead{color:#555}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.hub-card,.priority-card{display:flex;flex-direction:column;gap:4px;padding:16px;border:1px solid #e6e8ef;border-radius:14px;text-decoration:none;color:inherit;background:#fff}.hub-card:hover,.priority-card:hover{border-color:#a8bdf5;background:#f8faff}.hub-card span,.priority-card span{font-size:13px;color:#666}.priority{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.nav{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.nav a{padding:10px 14px;border-radius:10px;background:#f2f6ff;text-decoration:none;color:#244b8a}@media(max-width:720px){.grid{grid-template-columns:1fr 1fr}.priority{grid-template-columns:1fr}}@media(max-width:480px){.card{padding:20px 16px}.grid{grid-template-columns:1fr}}</style>',
  '</head>',
  '<body>',
  '<main class="wrap">',
  '  <a class="logo" href="/">🎤 キミキー</a>',
  '  <article class="card">',
  '    <h1>曲の音域一覧</h1>',
  '    <p class="lead">最低音・最高音を確認できる曲ページをまとめています。各一覧ページから、曲ごとの音域・最高音・最低音ページへ移動できます。</p>',
  '    <h2>検索されている音域ページ</h2>',
  '    <div class="priority">' + priorityCards + '</div>',
  '    <h2>確認済み音域ページ一覧</h2>',
  '    <div class="grid">' + hubCards + '</div>',
  '    <div class="nav"><a href="/vocal-range-table/">low・mid・hiの音域表</a><a href="/hia-frequency/">hiAの周波数一覧</a><a href="/vocal-range-check/">自分の音域を測る</a></div>',
  '  </article>',
  '</main>',
  '</body>',
  '</html>',
].join('\n')

write(path.join(indexDir, 'index.html'), html)

for (const hub of rangeHubPaths) {
  const hubPath = path.join(publicDir, hub, 'index.html')
  if (!fs.existsSync(hubPath)) continue
  let hubHtml = read(hubPath)
  const marker = '<!-- song-range-index-backlink -->'
  const block = marker + '\n<section><p><a href="/song-range-index/"><strong>← 曲の音域一覧へ戻る</strong></a></p></section>'
  hubHtml = insertBeforeArticleEnd(hubHtml, marker, block)
  write(hubPath, hubHtml)
}

const rangeTablePath = path.join(publicDir, 'vocal-range-table', 'index.html')
if (fs.existsSync(rangeTablePath)) {
  let tableHtml = read(rangeTablePath)
  const marker = '<!-- song-range-index-link -->'
  const block = marker + '\n<section><h2>曲ごとの音域を探す</h2><p>最低音・最高音を確認できる曲ページは、<a href="/song-range-index/"><strong>曲の音域一覧</strong></a>からまとめて探せます。</p></section>'
  tableHtml = insertBeforeArticleEnd(tableHtml, marker, block)
  write(rangeTablePath, tableHtml)
}

const sitemapPath = path.join(publicDir, 'sitemap.xml')
if (fs.existsSync(sitemapPath)) {
  let sitemap = read(sitemapPath)
  const url = SITE + '/song-range-index/'
  if (!sitemap.includes('<loc>' + url + '</loc>')) {
    sitemap = sitemap.replace('</urlset>', '<url><loc>' + url + '</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n</urlset>')
    write(sitemapPath, sitemap)
  }
}

console.log('✅ Song range crawl index generated: 23 hubs linked')
