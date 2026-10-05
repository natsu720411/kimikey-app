import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const filePath = path.join(rootDir, 'public', 'vocal-range-table', 'index.html')

if (!fs.existsSync(filePath)) {
  throw new Error(`Range table page not found: ${filePath}`)
}

let html = fs.readFileSync(filePath, 'utf8')

const title = 'hiAは何Hz？lowA・G4・mid1Eの高さ｜カラオケ音域表｜キミキー'
const description = 'hiAは何ヘルツ？G4はhi帯？lowAはどの高さ？カラオケで使うlow・mid1・mid2・hi表記を、音名と周波数Hzで一覧確認できます。'
const heading = 'hiAは何Hz？lowA・G4・mid1Eも分かるカラオケ音域表'

html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
html = html.replace(
  /<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i,
  `<meta name="description" content="${description}">`
)
html = html.replace(
  /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?\s*>/i,
  `<meta property="og:title" content="${title}">`
)
html = html.replace(
  /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?\s*>/i,
  `<meta property="og:description" content="${description}">`
)
html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, `<h1>${heading}</h1>`)

html = html.replace(
  '<p class="lead">「lowAはどの高さ？」「mid1Eは何の音？」「hiAは何ヘルツ？」をすぐ確認できる音域表です。検索では low a・low-a のように書かれることもありますが、このページでは lowA と表記します。</p>',
  '<p class="lead">「hiAは何ヘルツ？」「G4はhi帯？」「lowAはどの高さ？」「mid1Eは何の音？」をすぐ確認できる音域表です。検索では low a・low-a のように書かれることもありますが、このページでは lowA と表記します。</p>'
)

html = html.replace(
  '<p><strong>lowA = A1 = 55.0Hz</strong> ／ <strong>mid1E = E3 = 164.8Hz</strong> ／ <strong>hiA = A4 = 440Hz</strong></p>',
  '<p><strong>lowA = A1 = 55.0Hz</strong> ／ <strong>mid1E = E3 = 164.8Hz</strong> ／ <strong>G4 = mid2G = 約392Hz</strong> ／ <strong>hiA = A4 = 440Hz</strong></p>'
)

const marker = '<!-- gsc-range-table-ctr-20261006 -->'
if (!html.includes(marker)) {
  const target = '<p class="muted">「low a」「low-a」「mid1e」のような表記でも、このページでは同じ音として確認できます。</p>'
  const replacement = `${target}\n      ${marker}\n      <p class="muted"><strong>G4はmid2G</strong>で、hiA（A4）より全音低い音です。「G4 音域 hi」と調べた場合も、この対応で確認できます。</p>`

  if (!html.includes(target)) {
    throw new Error('Range table click summary target was not found')
  }

  html = html.replace(target, replacement)
}

fs.writeFileSync(filePath, html, 'utf8')
console.log('✅ vocal-range-table CTR intent optimized for hiA / G4 / lowA')
