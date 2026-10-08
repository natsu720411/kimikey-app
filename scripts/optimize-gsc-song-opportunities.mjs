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
  <p><a href="/vocal-range-check/">自分の音域を無料で測る</a> ・ <a href="/vocal-range-table/">low・mid・hiの音域表を見る</a> ・ <a href="/song-range-index/">曲の音域一覧を見る</a></p>
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
  title: '花占い（Vaundy）の音域はmid1F〜hiD｜最高音・最低音・キー｜キミキー',
  description: 'Vaundy「花占い」の音域はmid1F〜hiD。最低音mid1F・最高音hiDを確認し、自分の音域との比較やカラオケのキー調整に使えます。',
  heading: '花占い（Vaundy）の音域・最高音・キー',
  sectionHeading: '「花占い」の音域・最高音を調べる方へ',
  sectionBody: 'Vaundy「花占い」をカラオケで歌う前に、曲の最低音・最高音と自分の音域を比較できます。原曲キーが高く感じる場合は、高音だけでなく低音側も確認してキーを調整するのがおすすめです。',
  marker: 'gsc-opportunity-hanauranai',
})

optimizeSongPage({
  filePath: path.join(songsDir, 'happy-birthday-41', 'index.html'),
  title: 'ハッピーバースデー / HAPPY BIRTHDAY（back number）の音域｜lowG#〜hiB｜キミキー',
  description: 'back number「HAPPY BIRTHDAY（ハッピーバースデー）」の音域はlowG#〜hiB。最低音・最高音と、自分に合うカラオケキーを確認できます。',
  heading: 'ハッピーバースデー / HAPPY BIRTHDAY（back number）の音域・最高音',
  sectionHeading: '「ハッピーバースデー 音域」で探している方へ',
  sectionBody: '曲名の英字表記は「HAPPY BIRTHDAY」です。「ハッピーバースデー 音域」「happy birthday 音域」「ハッピーバースデー 最高音」で探している場合も、このページで曲の音域と自分の声域を比較できます。',
  marker: 'gsc-opportunity-happy-birthday',
})

optimizeSongPage({
  filePath: path.join(songsDir, 'song-306', 'index.html'),
  title: '唱（Ado）の音域はmid1D〜hihiA#｜最高音・最低音・キー｜キミキー',
  description: 'Ado「唱」の音域はmid1D〜hihiA#。最低音mid1D・最高音hihiA#を確認し、自分の音域との比較やキー調整に使えます。',
  heading: '唱（Ado）の音域・最高音・最低音',
  sectionHeading: '「唱」の音域を調べる方へ',
  sectionBody: 'Ado「唱」は声の使い方やテンポも歌いやすさに影響します。まず曲の最低音・最高音と自分の音域を比べて、原曲キーのまま歌えそうか確認してみてください。',
  marker: 'gsc-opportunity-show',
})


const venusPage = findSongPageByH1('星屑ビーナス')

optimizeSongPage({
  filePath: venusPage,
  title: '星屑ビーナス（Aimer）の音域はmid1F〜hiD｜最高音・最低音・キー｜キミキー',
  description: 'Aimer「星屑ビーナス」の音域はmid1F〜hiD。最低音mid1F・最高音hiDを確認し、自分の音域との比較やカラオケのキー調整に使えます。',
  heading: '星屑ビーナス（Aimer）の音域・最高音・最低音',
  sectionHeading: '「星屑ビーナス 音域」で探している方へ',
  sectionBody: 'Aimer「星屑ビーナス」の音域はmid1F〜hiDです。最低音と最高音を自分の声域と比べると、原曲キーのまま歌えるか判断しやすくなります。',
  marker: 'gsc-opportunity-hoshikuzu-venus',
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


const hiaDir = path.join(publicDir, 'hia-frequency')
fs.mkdirSync(hiaDir, { recursive: true })

const hiaRows = [
  ['hiA', 'A4', '440.00 Hz'],
  ['hiA#', 'A#4', '466.16 Hz'],
  ['hiB', 'B4', '493.88 Hz'],
  ['hiC', 'C5', '523.25 Hz'],
  ['hiC#', 'C#5', '554.37 Hz'],
  ['hiD', 'D5', '587.33 Hz'],
  ['hiD#', 'D#5', '622.25 Hz'],
  ['hiE', 'E5', '659.25 Hz'],
  ['hiF', 'F5', '698.46 Hz'],
  ['hiF#', 'F#5', '739.99 Hz'],
  ['hiG', 'G5', '783.99 Hz'],
  ['hiG#', 'G#5', '830.61 Hz'],
]

const hiaTableRows = hiaRows
  .map(([label, note, hz]) => `<tr><td><strong>${label}</strong></td><td>${note}</td><td>${hz}</td></tr>`)
  .join('')

const hiaHtml = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>hiAは何Hz？440Hz｜mid1・mid2・hiの周波数一覧｜キミキー</title>
  <meta name="description" content="hiAは440Hz（A4）です。mid1A=110Hz、mid2A=220Hz、hiA=440Hz、hihiA=880Hz。hiA〜hiG#の周波数一覧と音域表記の見方をわかりやすく紹介します。">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://kimikey-app.vercel.app/hia-frequency/">
  <meta property="og:title" content="hiAは何Hz？440Hz｜音域と周波数一覧｜キミキー">
  <meta property="og:description" content="hiA=440Hz。mid1・mid2・hi・hihiの周波数と音域表記を一覧で確認できます。">
  <meta property="og:image" content="https://kimikey-app.vercel.app/og-image.png">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"hiAは何Hzですか？","acceptedAnswer":{"@type":"Answer","text":"hiAは440Hzです。国際式音名ではA4に相当します。"}},{"@type":"Question","name":"mid2Aは何Hzですか？","acceptedAnswer":{"@type":"Answer","text":"mid2Aは220Hzです。国際式音名ではA3に相当します。"}},{"@type":"Question","name":"hihiAは何Hzですか？","acceptedAnswer":{"@type":"Answer","text":"hihiAは880Hzです。国際式音名ではA5に相当します。"}}]}
  </script>
  <style>
    *{box-sizing:border-box}body{margin:0;background:#f6f7fb;color:#222;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.8}.wrap{width:min(860px,calc(100% - 28px));margin:auto;padding:24px 0 60px}.card{background:#fff;border-radius:20px;padding:28px;box-shadow:0 8px 30px #0000000f}.logo{font-size:21px;font-weight:800;text-decoration:none;color:inherit}.answer{font-size:22px;background:#f2f6ff;border-radius:14px;padding:18px;margin:20px 0}.answer strong{font-size:32px}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{padding:12px;border-bottom:1px solid #e8e8ef;text-align:left}th{background:#f7f7fb}.links{display:flex;gap:12px;flex-wrap:wrap}.links a{display:inline-block;padding:10px 14px;border-radius:10px;background:#f2f6ff;color:#244b8a;text-decoration:none}@media(max-width:560px){.card{padding:20px 16px}th,td{padding:10px 8px}}
  </style>
</head>
<body>
<main class="wrap">
  <a class="logo" href="/">🎤 キミキー</a>
  <article class="card">
    <h1>hiAは何Hz？音域表記と周波数一覧</h1>
    <div class="answer"><strong>hiA = 440Hz</strong><br>国際式音名では A4 です。</div>
    <p>カラオケやボーカルの音域で使われる「hiA」は440Hzです。キミキーでは、lowA・mid1A・mid2A・hiA・hihiAを1オクターブずつ区切って扱っています。</p>

    <h2>mid1・mid2・hi・hihiのAは何Hz？</h2>
    <table>
      <thead><tr><th>音域表記</th><th>国際式音名</th><th>周波数</th></tr></thead>
      <tbody>
        <tr><td>lowA</td><td>A1</td><td>55Hz</td></tr>
        <tr><td>mid1A</td><td>A2</td><td>110Hz</td></tr>
        <tr><td>mid2A</td><td>A3</td><td>220Hz</td></tr>
        <tr><td><strong>hiA</strong></td><td><strong>A4</strong></td><td><strong>440Hz</strong></td></tr>
        <tr><td>hihiA</td><td>A5</td><td>880Hz</td></tr>
      </tbody>
    </table>

    <h2>hiA〜hiG#の周波数一覧</h2>
    <table>
      <thead><tr><th>音域表記</th><th>音名</th><th>周波数</th></tr></thead>
      <tbody>${hiaTableRows}</tbody>
    </table>

    <h2>hiAが出るか確認するには？</h2>
    <p>周波数だけでなく、実際に自分が安定して出せる最低音・最高音を測るのがおすすめです。キミキーではマイクを使って声の高さを測り、曲の音域と比較できます。</p>
    <div class="links">
      <a href="/vocal-range-check/">自分の音域を測る</a>
      <a href="/vocal-range-table/">low・mid・hiの音域表を見る</a>
      <a href="/">歌いやすい曲を探す</a>\n      <a href="/song-range-index/">曲の音域一覧を見る</a>
    </div>
  </article>
</main>
</body>
</html>`

write(path.join(hiaDir, 'index.html'), hiaHtml)

const rangeTablePath = path.join(publicDir, 'vocal-range-table', 'index.html')
if (fs.existsSync(rangeTablePath)) {
  let html = read(rangeTablePath)
  const marker = '<!-- gsc-hia-frequency-link -->'
  const block = `
${marker}
<section>
  <h2>hiAは何Hz？</h2>
  <p><strong>hiAは440Hz（A4）</strong>です。mid1A・mid2A・hiA・hihiAの周波数や、hiA〜hiG#の一覧は<a href="/hia-frequency/">「hiAは何Hz？」周波数一覧</a>で確認できます。</p>
</section>`
  html = insertBeforeArticleEnd(html, marker, block)
  write(rangeTablePath, html)
}

const sitemapPath = path.join(publicDir, 'sitemap.xml')
if (fs.existsSync(sitemapPath)) {
  let sitemap = read(sitemapPath)
  const hiaUrl = 'https://kimikey-app.vercel.app/hia-frequency/'
  if (!sitemap.includes(`<loc>${hiaUrl}</loc>`)) {
    sitemap = sitemap.replace(
      '</urlset>',
      `<url><loc>${hiaUrl}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n</urlset>`
    )
    write(sitemapPath, sitemap)
  }
}

console.log(
  `✅ GSC opportunities optimized: 花占い, HAPPY BIRTHDAY, 唱, 星屑ビーナス, 絆ノ奇跡 (${kizunaHref}), hiA frequency`
)
