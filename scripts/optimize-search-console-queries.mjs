import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function write(filePath, html) {
  fs.writeFileSync(filePath, html, 'utf8')
}

function replaceOnce(html, from, to, label) {
  if (!html.includes(from)) {
    console.warn(`⚠️ ${label} は見つからなかったためスキップしました`)
    return html
  }
  return html.replace(from, to)
}

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

function optimizeRangeTable() {
  const filePath = path.join(publicDir, 'vocal-range-table', 'index.html')
  if (!fs.existsSync(filePath)) return

  let html = read(filePath)

  const title = 'lowA・mid1E・hiAは何Hz？カラオケ音域表と音域表記｜キミキー'
  const description = 'lowA（low a・low-a）、mid1E、hiAなどのカラオケ音域表記を一覧で確認。lowA=A1、mid1E=E3、hiA=A4=440Hz。low・mid1・mid2・hiと音名・周波数Hzの対応が分かります。'

  html = setTitle(html, title)
  html = setMetaDescription(html, description)
  html = setOg(html, 'og:title', title)
  html = setOg(html, 'og:description', description)

  html = replaceOnce(
    html,
    '<h1>カラオケ音域表｜low・mid1・mid2・hiの見方</h1>',
    '<h1>カラオケ音域表｜lowA・mid1E・hiAは何Hz？</h1>',
    '音域表H1'
  )

  html = replaceOnce(
    html,
    '<p class="lead">曲の音域ページに出てくる「mid1C」「mid2G」「hiA」などが、鍵盤のどの音なのかを一覧で確認できます。キミキーでは下の対応で表示しています。</p>',
    '<p class="lead">「lowAはどの高さ？」「mid1Eは何の音？」「hiAは何ヘルツ？」をすぐ確認できる音域表です。検索では low a・low-a のように書かれることもありますが、このページでは lowA と表記します。</p>',
    '音域表リード文'
  )

  const marker = '<!-- search-console-query-block -->'
  if (!html.includes(marker)) {
    const block = `
    ${marker}
    <section>
      <h2>lowA・mid1E・hiAをすぐ確認</h2>
      <div class="examples">
        <div class="example"><strong>lowA = A1</strong><span>55.0 Hz｜「low a」「low-a」と検索されることもあります</span></div>
        <div class="example"><strong>mid1E = E3</strong><span>164.8 Hz｜mid1e と小文字で検索しても同じ音です</span></div>
        <div class="example"><strong>hiA = A4</strong><span>440.0 Hz｜「hiA 何ヘルツ？」の答え</span></div>
        <div class="example"><strong>1オクターブ = 12半音</strong><span>同じ音名が1段上がると1オクターブです</span></div>
      </div>
    </section>

    <section>
      <h2>lowA（low a・low-a）とは？</h2>
      <p><strong>lowAはA1で約55.0Hz</strong>です。スペースを入れた「low a」やハイフンを入れた「low-a」と検索される場合もありますが、キミキーでは <strong>lowA</strong> と続けて表記します。</p>
    </section>

    <section>
      <h2>mid1E（mid1e）とは？</h2>
      <p><strong>mid1EはE3で約164.8Hz</strong>です。アルファベットの大文字・小文字が違う「mid1e」も、ここでは同じ音を指すものとして確認できます。</p>
    </section>

    <section>
      <h2>hiAは何ヘルツ？</h2>
      <p><strong>hiAはA4で440Hz</strong>です。ピアノやチューナーの基準音としてよく使われるA4と同じ高さです。</p>
    </section>
`

    html = replaceOnce(
      html,
      '    <h2>low・mid1・mid2・hi 音域対応表</h2>',
      `${block}\n    <h2>low・mid1・mid2・hi 音域対応表</h2>`,
      '検索クエリ説明ブロック'
    )
  }

  write(filePath, html)
}

function optimizeOctavePage() {
  const filePath = path.join(publicDir, 'vocal-range-octaves', 'index.html')
  if (!fs.existsSync(filePath)) return

  let html = read(filePath)
  const title = '1オクターブは何半音？音域が何オクターブか数える方法｜キミキー'
  const description = '1オクターブは12半音。C3からC4は1オクターブ、C3からC5は2オクターブです。最低音と最高音から自分の音域が何オクターブあるか数える方法を解説します。'

  html = setTitle(html, title)
  html = setMetaDescription(html, description)
  html = setOg(html, 'og:title', title)
  html = setOg(html, 'og:description', description)

  html = replaceOnce(
    html,
    '<h1>音域は何オクターブ？幅の数え方</h1>',
    '<h1>1オクターブは何半音？音域が何オクターブか数える方法</h1>',
    'オクターブH1'
  )

  html = replaceOnce(
    html,
    '<p class="lead">最低音と最高音が分かれば、自分の音域が何オクターブあるか計算できます。基本は<strong>1オクターブ＝12半音</strong>です。</p>',
    '<p class="lead"><strong>1オクターブは12半音</strong>です。最低音と最高音が分かれば、その差を半音で数えて、自分の音域が何オクターブあるか確認できます。</p>',
    'オクターブリード文'
  )

  const quickMarker = '<!-- octave-quick-table -->'
  if (!html.includes(quickMarker)) {
    const table = `
    ${quickMarker}
    <h2>オクターブ早見表</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>音域の幅</th><th>半音数</th></tr></thead>
        <tbody>
          <tr><td><strong>1オクターブ</strong></td><td>12半音</td></tr>
          <tr><td><strong>1.5オクターブ</strong></td><td>18半音</td></tr>
          <tr><td><strong>2オクターブ</strong></td><td>24半音</td></tr>
          <tr><td><strong>2.5オクターブ</strong></td><td>30半音</td></tr>
          <tr><td><strong>3オクターブ</strong></td><td>36半音</td></tr>
        </tbody>
      </table>
    </div>
`
    html = replaceOnce(
      html,
      '    <h2>1オクターブは12半音</h2>',
      `${table}\n    <h2>1オクターブは12半音</h2>`,
      'オクターブ早見表'
    )
  }

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

function strengthenInternalLinks() {
  const files = walkIndexFiles(publicDir)
  for (const filePath of files) {
    let html = read(filePath)
    html = html.replace(
      /(<a[^>]*href="\/vocal-range-table\/"[^>]*>)(?:音域表|low・mid1・mid2・hi音域表)(<\/a>)/g,
      (_match, open, close) => `${open}lowA・mid1E・hiA音域表${close}`
    )
    html = html.replace(
      /(<a[^>]*href="\/vocal-range-octaves\/"[^>]*>)(?:何オクターブ？|音域は何オクターブ？)(<\/a>)/g,
      (_match, open, close) => `${open}1オクターブは何半音？${close}`
    )
    write(filePath, html)
  }
}

function strengthenHomepageFallback() {
  const filePath = path.join(rootDir, 'index.html')
  if (!fs.existsSync(filePath)) return

  let html = read(filePath)
  const marker = '<!-- search-console-query-links -->'
  if (html.includes(marker)) return

  const target = '<a href="/vocal-range-check/">無料の音域測定サイトで自分の音域を調べる</a>'
  const replacement = `${target}\n          ${marker}\n          <a href="/vocal-range-table/">lowA・mid1E・hiAの音域表記とHzを調べる</a>\n          <a href="/vocal-range-octaves/">1オクターブは何半音か調べる</a>`

  html = replaceOnce(html, target, replacement, 'トップページ検索クエリリンク')
  write(filePath, html)
}

optimizeRangeTable()
optimizeOctavePage()
strengthenInternalLinks()
strengthenHomepageFallback()

console.log('✅ Search Console の実クエリに合わせて音域ページを最適化しました')
