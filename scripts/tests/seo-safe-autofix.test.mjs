import test from 'node:test'
import assert from 'node:assert/strict'
import { repairSeoHtml } from '../seo-safe-fixes.js'

const site = 'https://kimikey-app.vercel.app'
const base = '<!doctype html><html><head><title>試験ページ</title>' +
  '<meta name="description" content="役立つ音域情報"></head><body><h1>試験</h1></body></html>'

test('insert canonical only on valid indexable page with title and description', () => {
  const r = repairSeoHtml(base, '/songs/sample-1/')
  assert.match(r.html, /rel="canonical" href="https:\/\/kimikey-app\.vercel\.app\/songs\/sample-1\/"/)
  assert.equal(r.fixes.length, 1)
  assert.equal(repairSeoHtml(r.html, '/songs/sample-1/').fixes.length, 0)
})
test('deduplicate identical description and canonical but keep unique originals', () => {
  const original = base.replace('</head>',
    '<meta name="description" content="役立つ音域情報">' +
    '<link rel="canonical" href="' + site + '/test/">' +
    '<link rel="canonical" href="' + site + '/test/"></head>')
  const r = repairSeoHtml(original, '/test/')
  assert.equal((r.html.match(/name="description"/g) || []).length, 1)
  assert.equal((r.html.match(/rel="canonical"/g) || []).length, 1)
  assert.equal(r.fixes.length, 2)
})
test('respect existing canonical even if different to self path', () => {
  const other = base.replace('</head>', '<link rel="canonical" href="' + site + '/original/"></head>')
  const r = repairSeoHtml(other, '/copy/')
  assert.equal(r.html, other)
  assert.equal(r.fixes.length, 0)
})
test('skip canonical for noindex documents', () => {
  const noindex = base.replace('</head>', '<meta name="robots" content="noindex, follow"></head>')
  assert.equal(repairSeoHtml(noindex, '/unused/').html, noindex)
})
test('fill missing description only from an existing OG description', () => {
  const source = '<html><head><title>紹介</title><meta property="og:description" content="実際の説明"></head></html>'
  const r = repairSeoHtml(source, '/guide/')
  assert.match(r.html, /name="description" content="実際の説明"/)
  assert.equal(r.fixes.length, 2)
})
test('conflicting canonical or descriptions never overwritten automatically', () => {
  const conflict = base.replace('</head>',
    '<link rel="canonical" href="' + site + '/a/">' +
    '<link rel="canonical" href="' + site + '/b/"></head>')
  const r = repairSeoHtml(conflict, '/abc/')
  assert.equal(r.html, conflict)
  assert.equal(r.warnings.length, 1)
})
