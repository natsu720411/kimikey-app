import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { repairSeoHtml } from './seo-safe-fixes.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const reportDir = path.join(root, 'reports')
const counters = { scanned: 0, correctedPages: 0, fixes: 0, warnings: 0 }
const changes = []
const warnings = []

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const filename = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(filename)
    else if (entry.name === 'index.html' && entry.isFile()) {
      const route = '/' + path.relative(publicDir, path.dirname(filename))
        .split(path.sep).filter(Boolean).join('/') + '/'
      const before = fs.readFileSync(filename, 'utf8')
      const outcome = repairSeoHtml(before, route === '//' ? '/' : route)
      counters.scanned++
      counters.fixes += outcome.fixes.length
      counters.warnings += outcome.warnings.length
      if (outcome.html !== before) {
        fs.writeFileSync(filename, outcome.html, 'utf8')
        counters.correctedPages++
        changes.push({ route, fixes: outcome.fixes })
      }
      if (outcome.warnings.length) warnings.push({ route, warnings: outcome.warnings })
    }
  }
}
walk(publicDir)
fs.mkdirSync(reportDir, { recursive: true })
fs.writeFileSync(path.join(reportDir, 'seo-auto-fix.json'),
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    ...counters, changes: changes.slice(0, 60), warnings: warnings.slice(0, 30),
    policy: 'Generated HTML metadata only. Never edit song data or title text.'
  }, null, 2) + '\n')
console.log('SEO safe auto-fix: ' + counters.scanned + ' pages, ' +
  counters.correctedPages + ' corrected, ' + counters.fixes + ' fixes, ' +
  counters.warnings + ' review warnings')
