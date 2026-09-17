import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const backlogPath = path.join(rootDir, 'reports', 'range-backlog.html')

const html = await fs.readFile(backlogPath, 'utf8')

const bridgeScript = `
  <script>
    document.querySelectorAll('.code-button').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault()
        event.stopImmediatePropagation()

        const artist = button.dataset.artist || ''
        const title = button.dataset.title || ''
        const params = new URLSearchParams({ artist, title })

        window.location.href =
          'range-entry-helper.html?' + params.toString()
      }, true)
    })
  </script>
`

if (!html.includes('</body>')) {
  throw new Error('range-backlog.html に </body> が見つかりません')
}

const updatedHtml = html.replace(
  '</body>',
  `${bridgeScript}\n</body>`
)

await fs.writeFile(
  backlogPath,
  updatedHtml,
  'utf8'
)

console.log('🔗 登録ヘルパーへのリンクを追加しました')
