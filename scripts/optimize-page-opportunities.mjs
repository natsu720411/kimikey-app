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

function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8')
}

function replaceOnce(content, from, to, label) {
  if (!content.includes(from)) {
    console.warn(`⚠️ ${label} は見つからなかったためスキップしました`)
    return content
  }

  return content.replace(from, to)
}

function optimizeRangeTableSnippet() {
  const filePath = path.join(publicDir, 'vocal-range-table', 'index.html')
  if (!fs.existsSync(filePath)) return

  let html = read(filePath)

  const title = '音域表｜lowA・mid1E・hiAの高さとHz一覧｜キミキー'
  const description = 'lowA=55.0Hz、mid1E=164.8Hz、hiA=440Hz。low・mid1・mid2・hiの音域表記を、音名と周波数Hzで一覧確認できます。low a・low-a・mid1eの表記にも対応。'

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*>/i,
    `<meta name="description" content="${description}">`
  )
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*>/i,
    `<meta property="og:title" content="${title}">`
  )
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*>/i,
    `<meta property="og:description" content="${description}">`
  )

  html = html.replace(
    /<h1>[^<]*<\/h1>/i,
    '<h1>音域表｜lowA・mid1E・hiAの高さとHz一覧</h1>'
  )

  const marker = '<!-- range-table-click-summary -->'
  if (!html.includes(marker)) {
    const summary = `
    ${marker}
    <div class="point">
      <strong>よく調べられている音をすぐ確認</strong>
      <p><strong>lowA = A1 = 55.0Hz</strong> ／ <strong>mid1E = E3 = 164.8Hz</strong> ／ <strong>hiA = A4 = 440Hz</strong></p>
      <p class="muted">「low a」「low-a」「mid1e」のような表記でも、このページでは同じ音として確認できます。</p>
    </div>
`

    html = replaceOnce(
      html,
      '<div class="point">\n      <strong>よく見る表記</strong>',
      `${summary}\n    <div class="point">\n      <strong>よく見る表記</strong>`,
      '音域表クリック用要約'
    )
  }

  write(filePath, html)
}

function optimizeOctaveSnippet() {
  const filePath = path.join(publicDir, 'vocal-range-octaves', 'index.html')
  if (!fs.existsSync(filePath)) return

  let html = read(filePath)

  const title = '1オクターブは何半音？12半音・音域の数え方早見表｜キミキー'
  const description = '1オクターブは12半音です。C3→C4は1オクターブ、C3→C5は2オクターブ。最低音と最高音から音域が何オクターブあるか早見表で確認できます。'

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*>/i,
    `<meta name="description" content="${description}">`
  )
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*>/i,
    `<meta property="og:title" content="${title}">`
  )
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*>/i,
    `<meta property="og:description" content="${description}">`
  )

  write(filePath, html)
}

function optimizeHomepageDiscoveryAndGraph() {
  const mainPath = path.join(rootDir, 'src', 'main.js')
  const stylePath = path.join(rootDir, 'src', 'style.css')

  if (!fs.existsSync(mainPath) || !fs.existsSync(stylePath)) return

  let main = read(mainPath)
  let css = read(stylePath)

  const navMarker = '<!-- search-entry-links -->'
  if (!main.includes(navMarker)) {
    const target = `    <button id="micButton" class="main-button top-mic-button">🎤 マイクを開始</button>\n  </section>`
    const replacement = `${target}\n\n  ${navMarker}\n  <nav class="search-entry-links" aria-label="音域のお役立ちページ">\n    <a href="/vocal-range-table/"><strong>🎼 音域表</strong><span>lowA・mid1E・hiA・Hz</span></a>\n    <a href="/vocal-range-octaves/"><strong>↕ 1オクターブ</strong><span>12半音・音域の幅</span></a>\n    <a href="/voice-pitch-check/"><strong>🎤 声の高さ</strong><span>今の音程を測る</span></a>\n    <a href="/karaoke-key-check/"><strong>🔑 カラオケキー</strong><span>自分に合うキー</span></a>\n  </nav>`

    main = replaceOnce(main, target, replacement, 'トップ検索入口')
  }

  const graphDetailsTarget = `  <!-- 音程グラフ -->\n\n  <details class="collapsible-panel">`
  const graphDetailsReplacement = `  <!-- 音程グラフ -->\n\n  <details id="pitchGraphPanel" class="collapsible-panel">`
  if (!main.includes('id="pitchGraphPanel"')) {
    main = replaceOnce(main, graphDetailsTarget, graphDetailsReplacement, '音程グラフID')
  }

  const graphLoopTarget = `function graphLoop() {\n\n  drawPitchGraph()\n\n  requestAnimationFrame(\n    graphLoop\n  )\n}`
  const graphLoopReplacement = `function graphLoop() {\n\n  const pitchGraphPanel =\n    document.querySelector(\n      '#pitchGraphPanel'\n    )\n\n  if (pitchGraphPanel?.open) {\n    drawPitchGraph()\n  }\n\n  requestAnimationFrame(\n    graphLoop\n  )\n}`

  if (!main.includes("document.querySelector(\n      '#pitchGraphPanel'")) {
    main = replaceOnce(main, graphLoopTarget, graphLoopReplacement, '閉じたグラフの描画停止')
  }

  const cssMarker = '/* search-entry-links */'
  if (!css.includes(cssMarker)) {
    css += `\n\n${cssMarker}\n.search-entry-links {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 9px;\n  margin: 0 0 14px;\n}\n\n.search-entry-links a {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  min-height: 68px;\n  padding: 11px 10px;\n  border: 1px solid #e6e8ef;\n  border-radius: 15px;\n  background: rgba(255, 255, 255, 0.9);\n  color: #2c2d31;\n  text-decoration: none;\n  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.035);\n}\n\n.search-entry-links strong {\n  font-size: 14px;\n}\n\n.search-entry-links span {\n  margin-top: 3px;\n  color: #7b7e86;\n  font-size: 11px;\n}\n\n@media (max-width: 420px) {\n  .search-entry-links {\n    gap: 7px;\n  }\n\n  .search-entry-links a {\n    min-height: 64px;\n    padding: 9px 7px;\n  }\n}\n`
  }

  write(mainPath, main)
  write(stylePath, css)
}

optimizeRangeTableSnippet()
optimizeOctaveSnippet()
optimizeHomepageDiscoveryAndGraph()

console.log('✅ 表示が伸びているページとトップ導線を最適化しました')
