import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const pagePath = path.join(rootDir, 'public', 'vocal-range-check', 'index.html')
const homePath = path.join(rootDir, 'index.html')

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
}

function setMetaDescription(html, description) {
  return html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*>/i,
    `<meta name="description" content="${description}">`
  )
}

function setOg(html, property, value) {
  const pattern = new RegExp(
    `<meta\\s+property="${property}"\\s+content="[^"]*"\\s*>`,
    'i'
  )
  return html.replace(pattern, `<meta property="${property}" content="${value}">`)
}

if (!fs.existsSync(pagePath)) {
  throw new Error(`Vocal range check page not found: ${pagePath}`)
}

let html = fs.readFileSync(pagePath, 'utf8')

const title = '音域チェック｜無料で声の最低音・最高音を測定｜キミキー'
const description = '無料の音域チェックで自分の声の最低音・最高音を確認。スマホやパソコンのマイクを使い、ブラウザですぐ音域を測定できます。登録不要で、限界音域・快適音域やカラオケのキー選びにも使えます。'
const heading = '無料の音域チェック｜自分の最低音・最高音を測る'

html = setTitle(html, title)
html = setMetaDescription(html, description)
html = setOg(html, 'og:title', title)
html = setOg(html, 'og:description', description)
html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, `<h1>${heading}</h1>`)

html = html.replace(
  /<p class="lead">[\s\S]*?<\/p>/i,
  `<p class="lead">\n        「自分の音域をチェックしたい」「最低音と最高音を無料で測りたい」という人向けの音域チェックです。スマホやパソコンのマイクを使って、今出している声の高さを確認しながら自分の音域を調べられます。\n      </p>`
)

html = html.replace(
  /<h2>\s*無料の音域測定サイト「キミキー」でできること\s*<\/h2>/i,
  '<h2>無料の音域チェック「キミキー」でできること</h2>'
)

const marker = '<!-- vocal-range-check-seo-20261006 -->'
if (!html.includes(marker)) {
  const block = `\n      ${marker}\n      <section>\n        <h2>音域チェックで分かること</h2>\n        <p>キミキーの音域チェックでは、声を低い方から高い方へ出しながら、<strong>最低音・最高音</strong>を確認できます。さらに、頑張れば出せる<strong>限界音域</strong>と、歌の中で使いやすい<strong>快適音域</strong>を分けて記録できます。</p>\n        <p>測定した音域は、曲の最低音・最高音との比較や、カラオケで自分に合うキーを考える目安として使えます。アプリのインストールは不要で、ブラウザからそのまま利用できます。</p>\n        <div class="point">\n          <strong>音域チェックの流れ</strong>\n          <p>① マイクを開始 → ② 低い声を出す → ③ 高い声を出す → ④ 最低音・最高音を確認、の順で進めます。</p>\n        </div>\n        <a class="cta" href="/">🎤 無料で音域チェックを始める</a>\n      </section>\n`

  const anchor = '<h2>無料の音域チェック「キミキー」でできること</h2>'
  if (!html.includes(anchor)) {
    throw new Error('Vocal range check content anchor was not found')
  }
  html = html.replace(anchor, `${block}\n      ${anchor}`)
}

const schemaMarker = '"name": "キミキー 音域チェック"'
if (!html.includes(schemaMarker)) {
  const schema = `\n  <script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@type": "WebApplication",\n    "name": "キミキー 音域チェック",\n    "url": "https://kimikey-app.vercel.app/vocal-range-check/",\n    "applicationCategory": "UtilitiesApplication",\n    "operatingSystem": "Web",\n    "description": "ブラウザのマイクを使って自分の声の最低音・最高音を確認できる無料の音域チェックです。",\n    "offers": {\n      "@type": "Offer",\n      "price": "0",\n      "priceCurrency": "JPY"\n    }\n  }\n  </script>\n`
  html = html.replace('</head>', `${schema}\n</head>`)
}

fs.writeFileSync(pagePath, html, 'utf8')

if (fs.existsSync(homePath)) {
  let home = fs.readFileSync(homePath, 'utf8')
  home = home.replace(
    /(<a\s+href="\/vocal-range-check\/"[^>]*>)[\s\S]*?(<\/a>)/i,
    '$1無料の音域チェックで最低音・最高音を調べる$2'
  )
  fs.writeFileSync(homePath, home, 'utf8')
}

console.log('✅ 「音域チェック」検索向けに vocal-range-check を最適化しました')
