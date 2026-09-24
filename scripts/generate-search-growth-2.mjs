import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')
const SITE_URL = 'https://kimikey-app.vercel.app'
const GA_ID = 'G-1B35Z51M10'

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
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

const CSS = `
*{box-sizing:border-box}
body{margin:0;background:#f6f7fb;color:#222;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.8}
.container{width:min(820px,calc(100% - 28px));margin:0 auto;padding:24px 0 60px}
.logo{display:inline-block;margin-bottom:16px;color:#222;font-size:22px;font-weight:800;text-decoration:none}
.breadcrumb{margin-bottom:14px;color:#777;font-size:13px}.breadcrumb a{color:#555}
.card{padding:30px;background:#fff;border-radius:20px;box-shadow:0 8px 30px rgba(0,0,0,.06)}
h1{margin:0 0 14px;font-size:clamp(28px,6vw,38px);line-height:1.4}
h2{margin-top:36px;padding-bottom:7px;border-bottom:2px solid #eef0f7;font-size:23px;line-height:1.5}
.lead{color:#555;font-size:17px}
.point{margin:22px 0;padding:17px;background:#f7f8fc;border-radius:14px}
.steps{display:grid;gap:10px;margin:20px 0}.step{padding:15px;border:1px solid #e7e9f1;border-radius:13px;background:#fafafd}.step strong{display:block;margin-bottom:3px}
.table-wrap{overflow-x:auto;margin:20px 0;border:1px solid #e7e9f1;border-radius:14px}
table{width:100%;border-collapse:collapse;min-width:520px}th,td{padding:11px 12px;border-bottom:1px solid #eceef4;text-align:left}th{background:#f7f8fc}
.related{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:24px}
.related a{display:grid;place-items:center;min-height:52px;padding:12px;border-radius:13px;background:#f0f1f6;color:#333;font-weight:700;text-align:center;text-decoration:none}
.cta{display:block;margin-top:22px;padding:16px;border-radius:14px;background:#111;color:#fff;font-weight:800;text-align:center;text-decoration:none}
.faq{margin:12px 0;padding:14px;border:1px solid #e7e9f1;border-radius:12px}.faq strong{display:block;margin-bottom:5px}.faq p{margin:0;color:#555}
.notice{margin-top:24px;color:#777;font-size:12px}
@media(max-width:560px){.container{width:calc(100% - 20px);padding-top:16px}.card{padding:22px 15px}.related{grid-template-columns:1fr}h2{font-size:21px}}
`

function structuredData({ url, title, description, faqs }) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
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
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  }).replaceAll('<', '\\u003c')
}

function head({ title, description, url, faqs }) {
  return `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${analyticsTag()}
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta property="og:type" content="article">
<meta property="og:site_name" content="キミキー">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<script type="application/ld+json">${structuredData({ url, title, description, faqs })}</script>
<style>${CSS}</style>`
}

function writePage(slug, html) {
  const dir = path.join(publicDir, slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8')
}

function createVoicePitchCheckPage() {
  const slug = 'voice-pitch-check'
  const url = `${SITE_URL}/${slug}/`
  const title = '声の高さ測定サイト｜マイクで今の音程・最低音・最高音を確認｜キミキー'
  const description = 'スマホやパソコンのマイクで声の高さ・音程を確認する方法を解説。今出している音、最低音・最高音、歌いやすい音域を無料のキミキーで測れます。'
  const faqs = [
    { question: '声の高さはスマホで測れますか？', answer: 'マイクを許可できるブラウザなら、キミキーで今出している声の音程を確認できます。' },
    { question: '音程と音域は違いますか？', answer: '音程は今出している1つの音の高さ、音域は最低音から最高音までの範囲を指します。' },
    { question: '最低音と最高音はどう測りますか？', answer: '出しやすい高さから少しずつ低く・高くして、安定して出せる端の音を確認します。無理な発声は避けてください。' },
  ]

  const html = `<!doctype html>
<html lang="ja">
<head>
${head({ title, description, url, faqs })}
</head>
<body>
<main class="container">
  <a class="logo" href="/">🎤 キミキー</a>
  <div class="breadcrumb"><a href="/">トップ</a> ＞ 声の高さを測る</div>

  <article class="card">
    <h1>声の高さ・音程をマイクで測る</h1>
    <p class="lead">「今の声は何の音？」「自分の最低音・最高音はどこ？」を確認したい人向けのページです。キミキーはブラウザのマイクを使って、声の音程と音域を無料で確認できます。</p>

    <div class="point">
      <strong>キミキーで確認できること</strong>
      <p>現在の音程、頑張れば出せる限界音域、無理なく歌いやすい快適音域を分けて確認できます。</p>
    </div>

    <h2>声の高さを測る3ステップ</h2>
    <div class="steps">
      <div class="step"><strong>1. マイクを許可する</strong>スマホまたはパソコンのブラウザでキミキーを開き、マイク使用を許可します。</div>
      <div class="step"><strong>2. 普段の声で「あー」と発声する</strong>画面に表示される音名を見ながら、無理のない高さで声を出します。</div>
      <div class="step"><strong>3. 低い音・高い音を少しずつ確認する</strong>限界まで力まず、安定して出せる最低音と最高音を記録します。</div>
    </div>

    <h2>音程と音域の違い</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>言葉</th><th>意味</th><th>例</th></tr></thead>
        <tbody>
          <tr><td><strong>音程・ピッチ</strong></td><td>今出している音の高さ</td><td>C4、A4など</td></tr>
          <tr><td><strong>音域</strong></td><td>出せる最低音から最高音までの範囲</td><td>C3〜A4など</td></tr>
          <tr><td><strong>快適音域</strong></td><td>曲の中で無理なく使いやすい範囲</td><td>選曲・キー調整の目安</td></tr>
        </tbody>
      </table>
    </div>

    <h2>声の高さが分かると曲選びに使える</h2>
    <p>自分の最低音・最高音が分かれば、歌いたい曲の音域と比較できます。原曲が高すぎる場合はキーを下げる、低すぎる場合は上げる、といった判断もしやすくなります。</p>

    <h2>測定するときの注意</h2>
    <p>高音や低音を無理に出す必要はありません。喉に痛みや強い違和感がある場合は発声をやめてください。曲選びには「一瞬だけ出る音」より、安定して出せる範囲を使う方が実用的です。</p>

    <h2>よくある質問</h2>
    ${faqs.map(item => `<div class="faq"><strong>${escapeHtml(item.question)}</strong><p>${escapeHtml(item.answer)}</p></div>`).join('')}

    <div class="related">
      <a href="/vocal-range-check/">自分の音域の測り方</a>
      <a href="/vocal-range-table/">音域表を見る</a>
      <a href="/pitch-training/">音程を合わせる練習</a>
      <a href="/songs/">曲別の音域一覧</a>
    </div>
    <a class="cta" href="/">🎤 マイクで声の高さを測る</a>
  </article>
</main>
</body>
</html>`

  writePage(slug, html)
}

function createKaraokeKeyCheckPage() {
  const slug = 'karaoke-key-check'
  const url = `${SITE_URL}/${slug}/`
  const title = '自分に合うカラオケキーを調べる｜何キー下げる？音域から確認｜キミキー'
  const description = 'カラオケで自分に合うキーを調べる方法を解説。自分の最低音・最高音と曲の音域を比べ、何キー下げる・上げるかの目安をキミキーで確認できます。'
  const faqs = [
    { question: '何キー下げれば歌いやすくなりますか？', answer: '人や曲によって異なります。自分の快適最高音と曲の最高音の差を目安にし、最低音が低くなりすぎないかも確認します。' },
    { question: 'キーを1つ下げるとどれくらい変わりますか？', answer: '一般的なカラオケではキー-1で曲全体が半音1つ下がります。' },
    { question: 'キミキーでおすすめキーを確認できますか？', answer: '音域を測定して曲を選ぶと、登録された曲の音域と比較しておすすめキーの目安を確認できます。' },
  ]

  const html = `<!doctype html>
<html lang="ja">
<head>
${head({ title, description, url, faqs })}
</head>
<body>
<main class="container">
  <a class="logo" href="/">🎤 キミキー</a>
  <div class="breadcrumb"><a href="/">トップ</a> ＞ 自分に合うカラオケキー</div>

  <article class="card">
    <h1>自分に合うカラオケキーを調べる</h1>
    <p class="lead">原曲キーでサビが高い、キーを下げたらAメロが低すぎる――そんなときは、自分の音域と曲の最低音・最高音を比べると調整の方向を決めやすくなります。</p>

    <div class="point">
      <strong>基本</strong>
      <p>キー-1で曲全体が半音1つ下がり、キー+1で半音1つ上がります。最高音だけでなく最低音も同じだけ動きます。</p>
    </div>

    <h2>自分に合うキーを探す3ステップ</h2>
    <div class="steps">
      <div class="step"><strong>1. 自分の快適音域を測る</strong>最低音と最高音を確認します。限界音域より、無理なく歌える範囲を基準にします。</div>
      <div class="step"><strong>2. 歌いたい曲の音域を見る</strong>曲の最低音・最高音を確認し、自分の範囲からどれくらい外れているか比べます。</div>
      <div class="step"><strong>3. キーを少しずつ上下する</strong>高すぎれば下げ、低すぎれば上げます。サビと低い部分の両方を歌って確認します。</div>
    </div>

    <h2>何キー下げる？考え方の目安</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>状態</th><th>最初に試す方向</th><th>確認すること</th></tr></thead>
        <tbody>
          <tr><td>最高音が1半音高い</td><td>キー -1付近</td><td>最低音が低すぎないか</td></tr>
          <tr><td>最高音が2半音高い</td><td>キー -2付近</td><td>Aメロ・Bメロも出るか</td></tr>
          <tr><td>曲全体が低い</td><td>キーを上げる</td><td>最高音が苦しくならないか</td></tr>
          <tr><td>高音も低音も厳しい</td><td>別の曲も候補にする</td><td>曲の音域幅そのもの</td></tr>
        </tbody>
      </table>
    </div>
    <p class="notice">上の数字は考え方を示す目安です。実際の歌いやすさは声質、発声、テンポ、高音の長さなどでも変わります。</p>

    <h2>キミキーなら測定→曲選択→キー確認までできる</h2>
    <p>キミキーで快適音域を測定したあと、曲名またはアーティスト名から歌いたい曲を選ぶと、その曲の音域との比較とおすすめキーの目安を確認できます。</p>

    <h2>キーを下げすぎると低音が出なくなる</h2>
    <p>サビを楽にするためにキーを下げると、曲の最低音も同じだけ下がります。最高音だけを基準にせず、最低音まで自分の快適音域に入るか確認することが重要です。</p>

    <h2>よくある質問</h2>
    ${faqs.map(item => `<div class="faq"><strong>${escapeHtml(item.question)}</strong><p>${escapeHtml(item.answer)}</p></div>`).join('')}

    <div class="related">
      <a href="/karaoke-key-guide/">キーの合わせ方を詳しく見る</a>
      <a href="/vocal-range-check/">自分の音域を測る方法</a>
      <a href="/songs/">曲の最低音・最高音を探す</a>
      <a href="/guides/">音域から曲を探す</a>
    </div>
    <a class="cta" href="/">🎤 自分の音域とおすすめキーを確認する</a>
  </article>
</main>
</body>
</html>`

  writePage(slug, html)
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

function injectLinksIntoPublicPages() {
  const files = walkIndexFiles(publicDir)

  for (const filePath of files) {
    let html = fs.readFileSync(filePath, 'utf8')

    if (
      html.includes('href="/vocal-range-table/"') &&
      !html.includes('href="/voice-pitch-check/"')
    ) {
      html = html.replace(
        '<a href="/vocal-range-table/" style="color:#333">音域表</a>',
        '<a href="/vocal-range-table/" style="color:#333">音域表</a>\n    <a href="/voice-pitch-check/" style="color:#333">声の高さ測定</a>\n    <a href="/karaoke-key-check/" style="color:#333">おすすめキー</a>'
      )
    }

    fs.writeFileSync(filePath, html, 'utf8')
  }
}

function injectRootLinks() {
  const indexPath = path.join(rootDir, 'index.html')
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8')
    if (!html.includes('href="/voice-pitch-check/"')) {
      html = html.replace(
        '<a href="/vocal-range-check/">無料の音域測定サイトで自分の音域を調べる</a>',
        '<a href="/vocal-range-check/">無料の音域測定サイトで自分の音域を調べる</a>\n          <a href="/voice-pitch-check/">マイクで声の高さ・音程を測る</a>\n          <a href="/karaoke-key-check/">自分に合うカラオケキーを調べる</a>'
      )
    }
    fs.writeFileSync(indexPath, html, 'utf8')
  }

  const mainPath = path.join(rootDir, 'src', 'main.js')
  if (fs.existsSync(mainPath)) {
    let source = fs.readFileSync(mainPath, 'utf8')
    if (!source.includes('href="/voice-pitch-check/"')) {
      source = source.replace(
        `      <a
        class="song-browse-link"
        href="/vocal-range-check/"
      >
        自分の音域を調べる
      </a>`,
        `      <a
        class="song-browse-link"
        href="/vocal-range-check/"
      >
        自分の音域を調べる
      </a>

      <a
        class="song-browse-link"
        href="/voice-pitch-check/"
      >
        声の高さ・音程を測る
      </a>

      <a
        class="song-browse-link"
        href="/karaoke-key-check/"
      >
        自分に合うキーを調べる
      </a>`
      )
    }
    fs.writeFileSync(mainPath, source, 'utf8')
  }
}

function updateSitemap() {
  const sitemapPath = path.join(publicDir, 'sitemap.xml')
  if (!fs.existsSync(sitemapPath)) {
    return
  }

  let xml = fs.readFileSync(sitemapPath, 'utf8')
  const urls = [
    `${SITE_URL}/voice-pitch-check/`,
    `${SITE_URL}/karaoke-key-check/`,
  ]

  const additions = urls
    .filter(url => !xml.includes(`<loc>${url}</loc>`))
    .map(url => `  <url>\n    <loc>${url}</loc>\n  </url>`)
    .join('\n')

  if (additions) {
    xml = xml.replace('</urlset>', `${additions}\n</urlset>`)
    fs.writeFileSync(sitemapPath, xml, 'utf8')
  }
}

createVoicePitchCheckPage()
createKaraokeKeyCheckPage()
injectLinksIntoPublicPages()
injectRootLinks()
updateSitemap()

console.log('✅ 声の高さ測定・カラオケキー向け検索ページを生成しました')
