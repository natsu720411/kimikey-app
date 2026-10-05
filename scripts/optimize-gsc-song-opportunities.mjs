import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')
const songsDir = path.join(publicDir, 'songs')

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
    .replaceAll("'", '&#039;')
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function setTitle(html, title) {
  const safeTitle = escapeHtml(title)
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
  }
  return html.replace('</head>', `<title>${safeTitle}</title></head>`)
}

function setMetaDescription(html, description) {
  const safeDescription = escapeHtml(description)
  const pattern = /<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i
  if (pattern.test(html)) {
    return html.replace(pattern, `<meta name="description" content="${safeDescription}">`)
  }
  return html.replace('</head>', `<meta name="description" content="${safeDescription}"></head>`)
}

function setOg(html, property, value) {
  const safeValue = escapeHtml(value)
  const pattern = new RegExp(
    `<meta\\s+property="${property}"\\s+content="[^"]*"\\s*\\/?\\s*>`,
    'i'
  )
  if (pattern.test(html)) {
    return html.replace(pattern, `<meta property="${property}" content="${safeValue}">`)
  }
  return html.replace('</head>', `<meta property="${property}" content="${safeValue}"></head>`)
}

function setFirstH1(html, heading) {
  const safeHeading = escapeHtml(heading)
  if (/<h1[^>]*>[\s\S]*?<\/h1>/i.test(html)) {
    return html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, `<h1>${safeHeading}</h1>`)
  }
  return html
}

function insertBeforeArticleEnd(html, marker, block) {
  if (html.includes(marker)) return html
  if (html.includes('</article>')) {
    return html.replace('</article>', `${block}\n</article>`)
  }
  if (html.includes('</main>')) {
    return html.replace('</main>', `${block}\n</main>`)
  }
  return html
}

function optimizeSongPage({
  filePath,
  title,
  description,
  heading,
  sectionHeading,
  sectionBody,
  marker,
}) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`GSC target page not found: ${filePath}`)
  }

  let html = read(filePath)
  html = setTitle(html, title)
  html = setMetaDescription(html, description)
  html = setOg(html, 'og:title', title)
  html = setOg(html, 'og:description', description)
  html = setFirstH1(html, heading)

  const block = `
<!-- ${marker} -->
<section>
  <h2>${escapeHtml(sectionHeading)}</h2>
  <p>${sectionBody}</p>
  <p><a href="/vocal-range-check/">自分の音域を無料で測る</a> ・ <a href="/vocal-range-table/">low・mid・hiの音域表を見る</a></p>
</section>`

  html = insertBeforeArticleEnd(html, `<!-- ${marker} -->`, block)
  write(filePath, html)
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

function findSongPageByH1(songTitle) {
  const pattern = new RegExp(
    `<h1[^>]*>[\\s\\S]{0,240}${escapeRegExp(songTitle)}`,
    'i'
  )

  for (const filePath of walkIndexFiles(songsDir)) {
    const html = read(filePath)
    if (pattern.test(html)) return filePath
  }

  throw new Error(`Song page not found by H1: ${songTitle}`)
}

function publicHref(filePath) {
  const relativeDir = path.relative(publicDir, path.dirname(filePath))
  return `/${relativeDir.split(path.sep).join('/')}/`
}

optimizeSongPage({
  filePath: path.join(songsDir, 'song-446', 'index.html'),
  title: '花占い（Vaundy）の音域・最高音・キー｜カラオケで歌える？｜キミキー',
  description: 'Vaundy「花占い」の音域、最低音・最高音、キー調整の考え方を確認。自分の音域と比較して、原曲キーで歌えそうかチェックできます。',
  heading: '花占い（Vaundy）の音域・最高音・キー',
  sectionHeading: '「花占い」の音域・最高音を調べる方へ',
  sectionBody: 'Vaundy「花占い」をカラオケで歌う前に、曲の最低音・最高音と自分の音域を比較できます。原曲キーが高く感じる場合は、高音だけでなく低音側も確認してキーを調整するのがおすすめです。',
  marker: 'gsc-opportunity-hanauranai',
})

optimizeSongPage({
  filePath: path.join(songsDir, 'happy-birthday-41', 'index.html'),
  title: 'HAPPY BIRTHDAY（back number）の音域・最高音｜ハッピーバースデーのキー｜キミキー',
  description: 'back number「HAPPY BIRTHDAY（ハッピーバースデー）」の音域、最低音・最高音、カラオケキーの考え方を確認。自分の音域とも比較できます。',
  heading: 'HAPPY BIRTHDAY（back number）の音域・最高音',
  sectionHeading: '「ハッピーバースデー 音域」で探している方へ',
  sectionBody: '曲名の英字表記は「HAPPY BIRTHDAY」です。「ハッピーバースデー 音域」「happy birthday 音域」「ハッピーバースデー 最高音」で探している場合も、このページで曲の音域と自分の声域を比較できます。',
  marker: 'gsc-opportunity-happy-birthday',
})

optimizeSongPage({
  filePath: path.join(songsDir, 'song-306', 'index.html'),
  title: '唱（Ado）の音域・最高音・最低音｜カラオケキーの目安｜キミキー',
  description: 'Ado「唱」の音域、最高音・最低音、キー調整の考え方を確認。自分の音域と比較して、カラオケで歌いやすいキーを考える目安にできます。',
  heading: '唱（Ado）の音域・最高音・最低音',
  sectionHeading: '「唱」の音域を調べる方へ',
  sectionBody: 'Ado「唱」は声の使い方やテンポも歌いやすさに影響します。まず曲の最低音・最高音と自分の音域を比べて、原曲キーのまま歌えそうか確認してみてください。',
  marker: 'gsc-opportunity-show',
})

const kizunaPage = findSongPageByH1('絆ノ奇跡')
const kizunaHref = publicHref(kizunaPage)

optimizeSongPage({
  filePath: kizunaPage,
  title: '絆ノ奇跡（絆の奇跡）の音域・最高音｜MAN WITH A MISSION × milet｜キミキー',
  description: 'MAN WITH A MISSION × milet「絆ノ奇跡」の音域、最低音・最高音を確認。「絆の奇跡 音域」で検索した方も、自分の音域と比較できます。',
  heading: '絆ノ奇跡（絆の奇跡）の音域・最高音',
  sectionHeading: '「絆の奇跡 音域」で探している方へ',
  sectionBody: '正式な曲名表記は「絆ノ奇跡」です。「絆の奇跡」とひらがなの「の」で検索した場合も、この曲の音域ページで最低音・最高音と自分の音域を比較できます。',
  marker: 'gsc-opportunity-kizuna',
})

const kizunaArtistPage = path.join(
  publicDir,
  'artists',
  'man-with-a-mission-milet-4o8282',
  'index.html'
)

if (fs.existsSync(kizunaArtistPage)) {
  let html = read(kizunaArtistPage)
  const marker = '<!-- gsc-kizuna-song-route -->'
  const block = `
${marker}
<section>
  <h2>絆ノ奇跡（絆の奇跡）の音域を調べる</h2>
  <p>「絆の奇跡 音域」を探している方は、<a href="${kizunaHref}"><strong>「絆ノ奇跡」の個別音域ページ</strong></a>で最低音・最高音と自分の音域を比較できます。</p>
</section>`
  html = insertBeforeArticleEnd(html, marker, block)
  write(kizunaArtistPage, html)
} else {
  throw new Error(`GSC target artist page not found: ${kizunaArtistPage}`)
}

console.log(
  `✅ GSC opportunities optimized: 花占い, HAPPY BIRTHDAY, 唱, 絆ノ奇跡 (${kizunaHref})`
)
