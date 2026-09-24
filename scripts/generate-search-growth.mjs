import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')
const SITE_URL = 'https://kimikey-app.vercel.app'
const GA_ID = 'G-1B35Z51M10'

const NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B',
]

const KARAOKE_NOTES = [
  'A', 'A#', 'B', 'C', 'C#', 'D',
  'D#', 'E', 'F', 'F#', 'G', 'G#',
]

const BANDS = [
  { prefix: 'low', startMidi: 33 },
  { prefix: 'mid1', startMidi: 45 },
  { prefix: 'mid2', startMidi: 57 },
  { prefix: 'hi', startMidi: 69 },
]

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function midiToNoteName(midi) {
  const note = NOTE_NAMES[((midi % 12) + 12) % 12]
  const octave = Math.floor(midi / 12) - 1
  return `${note}${octave}`
}

function midiToFrequency(midi) {
  return 440 * (2 ** ((midi - 69) / 12))
}

function analyticsTag() {
  return `
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  </script>`
}

function commonHead({ title, description, canonical, structuredData }) {
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${analyticsTag()}
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="キミキー">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  <script type="application/ld+json">${structuredData}</script>`
}

const COMMON_CSS = `
*{box-sizing:border-box}
body{margin:0;background:#f6f7fb;color:#222;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.8}
.container{width:min(860px,calc(100% - 28px));margin:0 auto;padding:24px 0 60px}
.logo{display:inline-block;margin-bottom:16px;color:#222;font-size:22px;font-weight:800;text-decoration:none}
.breadcrumb{margin-bottom:14px;color:#777;font-size:13px}.breadcrumb a{color:#555}
.card{padding:30px;background:white;border-radius:20px;box-shadow:0 8px 30px rgba(0,0,0,.06)}
h1{margin:0 0 14px;font-size:clamp(28px,6vw,38px);line-height:1.4}h2{margin-top:36px;padding-bottom:7px;border-bottom:2px solid #eef0f7;font-size:23px;line-height:1.5}
.lead{color:#555;font-size:17px}.point{margin:22px 0;padding:17px;background:#f7f8fc;border-radius:14px}
.table-wrap{overflow-x:auto;margin:20px 0;border:1px solid #e7e9f1;border-radius:14px}table{width:100%;border-collapse:collapse;min-width:560px}th,td{padding:10px 12px;border-bottom:1px solid #eceef4;text-align:left}th{background:#f7f8fc;font-size:13px}td strong{font-size:15px}.muted{color:#777;font-size:13px}
.examples{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.example{padding:14px;border:1px solid #e7e9f1;border-radius:12px;background:#fafafd}.example strong{display:block;font-size:18px}.example span{color:#666;font-size:13px}
.related{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.related a{display:grid;place-items:center;min-height:52px;padding:12px;border-radius:13px;background:#f0f1f6;color:#333;font-weight:700;text-align:center;text-decoration:none}
.cta{display:block;margin-top:22px;padding:15px;border-radius:14px;background:#111;color:#fff;font-weight:800;text-align:center;text-decoration:none}.notice{margin-top:24px;color:#777;font-size:12px}
@media(max-width:560px){.container{width:calc(100% - 20px);padding-top:16px}.card{padding:22px 15px}.examples,.related{grid-template-columns:1fr}h2{font-size:21px}}
`

function pageStructuredData({ url, title, description, faqs = [] }) {
  const graph = [
    {
      '@type': 'WebPage',
      '@id': url,
      url,
      name: title,
      description,
      inLanguage: 'ja',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'トップ', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: title, item: url },
      ],
    },
  ]

  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    })
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
    .replaceAll('<', '\\u003c')
}

function createRangeTablePage() {
  const slug = 'vocal-range-table'
  const url = `${SITE_URL}/${slug}/`
  const title = 'カラオケ音域表｜low・mid1・mid2・hiとC3・A4・Hzの対応｜キミキー'
  const description = 'カラオケで使われるlow・mid1・mid2・hiの音域表記を、C3・A4などの音名と周波数Hzに対応させて一覧で確認できます。hiA、mid2Gなどの高さを調べたい人向けです。'
  const faqs = [
    { question: 'hiAは何の音ですか？', answer: 'キミキーの表記ではhiAはA4で、周波数は440Hzです。' },
    { question: 'mid2Cは何の音ですか？', answer: 'キミキーの表記ではmid2CはC4です。一般に中央のドとして扱われる高さです。' },
    { question: '1オクターブは何半音ですか？', answer: '1オクターブは12半音です。同じ音名が1つ上の高さになると1オクターブ上がります。' },
  ]

  const rows = BANDS.flatMap(band =>
    KARAOKE_NOTES.map((note, index) => {
      const midi = band.startMidi + index
      const label = `${band.prefix}${note}`
      return `
        <tr>
          <td><strong>${label}</strong></td>
          <td>${midiToNoteName(midi)}</td>
          <td>${midiToFrequency(midi).toFixed(1)} Hz</td>
        </tr>`
    })
  ).join('')

  const examples = [
    ['mid1C', 'C3', 48],
    ['mid2C', 'C4', 60],
    ['mid2G', 'G4', 67],
    ['hiA', 'A4', 69],
    ['hiC', 'C5', 72],
    ['hiE', 'E5', 76],
  ].map(([label, note, midi]) => `
    <div class="example">
      <strong>${label} = ${note}</strong>
      <span>${midiToFrequency(midi).toFixed(1)} Hz</span>
    </div>`).join('')

  const html = `<!doctype html>
<html lang="ja">
<head>
${commonHead({
  title,
  description,
  canonical: url,
  structuredData: pageStructuredData({ url, title, description, faqs }),
})}
<style>${COMMON_CSS}</style>
</head>
<body>
<main class="container">
  <a class="logo" href="/">🎤 キミキー</a>
  <div class="breadcrumb"><a href="/">トップ</a> ＞ カラオケ音域表</div>
  <article class="card">
    <h1>カラオケ音域表｜low・mid1・mid2・hiの見方</h1>
    <p class="lead">曲の音域ページに出てくる「mid1C」「mid2G」「hiA」などが、鍵盤のどの音なのかを一覧で確認できます。キミキーでは下の対応で表示しています。</p>

    <div class="point">
      <strong>よく見る表記</strong>
      <div class="examples">${examples}</div>
    </div>

    <h2>low・mid1・mid2・hi 音域対応表</h2>
    <p>表記はAから始まり、A#、B、C…G#の順に12半音で1オクターブ進みます。</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>カラオケ表記</th><th>音名</th><th>周波数</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <h2>mid1・mid2・hiはどう読む？</h2>
    <p><strong>mid1</strong>はA2から、<strong>mid2</strong>はA3から、<strong>hi</strong>はA4から始まる表記としてキミキーでは扱っています。例えばmid2CはC4、hiCはC5です。</p>
    <p>同じ「C」でも、mid1C → mid2C → hiCと1段上がるごとに1オクターブ高くなります。</p>

    <h2>hiAは440Hz</h2>
    <p>hiAはA4で440Hzです。ピアノやチューナーで基準音として使われるA4と同じ高さです。</p>

    <h2>自分の音域と曲の音域を比べる</h2>
    <p>曲ページの最低音・最高音をこの表で確認したら、自分が無理なく出せる最低音・最高音と比較します。最高音だけでなく最低音も見ると、カラオケのキーを調整しやすくなります。</p>

    <div class="related">
      <a href="/vocal-range-check/">自分の音域を測る方法</a>
      <a href="/karaoke-key-guide/">カラオケのキー調整</a>
      <a href="/songs/">曲別の音域一覧</a>
      <a href="/guides/">音域から曲を探す</a>
    </div>
    <a class="cta" href="/">🎤 キミキーで自分の音域を測定する</a>
    <p class="notice">音域表記にはサイトや資料による表記差があります。このページはキミキー内で使用している対応を示しています。</p>
  </article>
</main>
</body>
</html>`

  const dir = path.join(publicDir, slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8')
}

function createOctaveGuidePage() {
  const slug = 'vocal-range-octaves'
  const url = `${SITE_URL}/${slug}/`
  const title = '音域は何オクターブ？1オクターブは12半音｜音域の幅の数え方｜キミキー'
  const description = '自分の音域が何オクターブあるか調べる方法を解説。1オクターブ=12半音として、最低音と最高音から音域の幅を数える方法や具体例を紹介します。'
  const faqs = [
    { question: '1オクターブは何半音ですか？', answer: '1オクターブは12半音です。' },
    { question: 'C3からC5は何オクターブですか？', answer: 'C3からC5までは24半音なので2オクターブです。' },
    { question: '音域の幅はどう計算しますか？', answer: '最低音から最高音までの半音数を数え、12で割るとオクターブ数の目安になります。' },
  ]

  const html = `<!doctype html>
<html lang="ja">
<head>
${commonHead({
  title,
  description,
  canonical: url,
  structuredData: pageStructuredData({ url, title, description, faqs }),
})}
<style>${COMMON_CSS}</style>
</head>
<body>
<main class="container">
  <a class="logo" href="/">🎤 キミキー</a>
  <div class="breadcrumb"><a href="/">トップ</a> ＞ 音域は何オクターブ？</div>
  <article class="card">
    <h1>音域は何オクターブ？幅の数え方</h1>
    <p class="lead">最低音と最高音が分かれば、自分の音域が何オクターブあるか計算できます。基本は<strong>1オクターブ＝12半音</strong>です。</p>

    <div class="point">
      <strong>計算方法</strong>
      <p>最低音から最高音までの半音数 ÷ 12 ＝ 音域のオクターブ数の目安</p>
    </div>

    <h2>1オクターブは12半音</h2>
    <p>C3からC4、A3からA4のように、同じ音名が1つ上の高さになると1オクターブです。鍵盤では12半音分の差があります。</p>

    <h2>音域の具体例</h2>
    <div class="examples">
      <div class="example"><strong>C3 → C4</strong><span>12半音 = 1オクターブ</span></div>
      <div class="example"><strong>C3 → C5</strong><span>24半音 = 2オクターブ</span></div>
      <div class="example"><strong>A3 → A4</strong><span>12半音 = 1オクターブ</span></div>
      <div class="example"><strong>mid1C → hiC</strong><span>C3 → C5 = 2オクターブ</span></div>
    </div>

    <h2>曲の音域幅も同じ方法で比べられる</h2>
    <p>キミキーの曲ページでは最低音と最高音を掲載しています。幅が狭い曲を探したい場合は、約1オクターブ前後の曲一覧や音域が狭めの曲一覧から探せます。</p>

    <h2>「出せる音域」と「歌いやすい音域」は分けて考える</h2>
    <p>一瞬だけ出せる最低音・最高音まで含めた幅と、曲の中で無理なく使える幅は同じとは限りません。キミキーでは限界音域と快適音域を分けて測定できます。</p>

    <div class="related">
      <a href="/vocal-range-table/">low・mid1・mid2・hi音域表</a>
      <a href="/guides/one-octave-songs/">約1オクターブの曲</a>
      <a href="/guides/narrow-range-songs/">音域が狭めの曲</a>
      <a href="/guides/wide-range-songs/">音域が広い曲</a>
    </div>
    <a class="cta" href="/">🎤 自分の最低音・最高音を測定する</a>
  </article>
</main>
</body>
</html>`

  const dir = path.join(publicDir, slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8')
}

function walkIndexFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkIndexFiles(fullPath, results)
    } else if (entry.isFile() && entry.name === 'index.html') {
      results.push(fullPath)
    }
  }
  return results
}

const DISCOVERY_MARKER = '<!-- kimikey-discovery-nav -->'

function injectDiscoveryNavigation() {
  const indexFiles = walkIndexFiles(publicDir)
  const nav = `
${DISCOVERY_MARKER}
<nav aria-label="キミキーの主要ページ" style="margin:28px auto 0;padding:16px;border:1px solid #e7e9f1;border-radius:14px;background:#fff;text-align:center;line-height:1.8">
  <strong style="display:block;margin-bottom:8px">キミキーで探す</strong>
  <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px 14px;font-size:14px">
    <a href="/" style="color:#333">音域測定</a>
    <a href="/vocal-range-table/" style="color:#333">音域表</a>
    <a href="/vocal-range-octaves/" style="color:#333">何オクターブ？</a>
    <a href="/popular/" style="color:#333">人気曲</a>
    <a href="/songs/" style="color:#333">曲別音域</a>
    <a href="/artists/" style="color:#333">アーティスト別</a>
    <a href="/guides/" style="color:#333">歌いやすい曲</a>
  </div>
</nav>`

  for (const filePath of indexFiles) {
    let html = fs.readFileSync(filePath, 'utf8')
    if (html.includes(DISCOVERY_MARKER) || !html.includes('</main>')) {
      continue
    }
    html = html.replace('</main>', `${nav}\n</main>`)
    fs.writeFileSync(filePath, html, 'utf8')
  }
}

function pageUrlFromIndex(filePath) {
  const relative = path.relative(publicDir, filePath).replaceAll(path.sep, '/')
  const directory = path.posix.dirname(relative)
  return directory === '.' ? `${SITE_URL}/` : `${SITE_URL}/${directory}/`
}

function updateSitemap() {
  const sitemapPath = path.join(publicDir, 'sitemap.xml')
  if (!fs.existsSync(sitemapPath)) {
    return
  }

  let xml = fs.readFileSync(sitemapPath, 'utf8')
  const existing = new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
  )

  const discovered = walkIndexFiles(publicDir)
    .map(pageUrlFromIndex)
    .filter(url => !existing.has(url))
    .sort((a, b) => a.localeCompare(b, 'ja'))

  if (!discovered.length) {
    return
  }

  const additions = discovered
    .map(url => `  <url>\n    <loc>${url}</loc>\n  </url>`)
    .join('\n')

  xml = xml.replace('</urlset>', `${additions}\n</urlset>`)
  fs.writeFileSync(sitemapPath, xml, 'utf8')
  console.log(`✅ sitemap に未掲載ページを ${discovered.length} 件追加しました`)
}

createRangeTablePage()
createOctaveGuidePage()
injectDiscoveryNavigation()
updateSitemap()

console.log('✅ 検索流入向けページと内部リンクを生成しました')
