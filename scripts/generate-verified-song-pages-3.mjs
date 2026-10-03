import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS as BASE_SONGS } from '../src/songs.js'
import { CATALOG_500_SONGS } from '../src/songs-catalog-500.js'
import { VERIFIED_RANGE_100_3 } from '../src/songs-verified-100-3.js'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(rootDir, 'public')
const songsDir = path.join(publicDir, 'songs')
const hubDir = path.join(publicDir, 'popular-song-ranges-3')
const SITE_URL = 'https://kimikey-app.vercel.app'
const GA_ID = 'G-1B35Z51M10'

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

function pitchLabelToMidi(label) {
  const match = String(label).match(/^(low|mid1|mid2|hi)([A-G](?:#)?)$/)
  if (!match) throw new Error(`Unknown pitch label: ${label}`)
  const starts = { low: 33, mid1: 45, mid2: 57, hi: 69 }
  const offsets = { A:0,'A#':1,B:2,C:3,'C#':4,D:5,'D#':6,E:7,F:8,'F#':9,G:10,'G#':11 }
  return starts[match[1]] + offsets[match[2]]
}

function midiToNoteName(midi) {
  const names = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
  return `${names[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`
}

function slug(song) {
  const ascii = String(song.title).normalize('NFKD').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return ascii ? `${ascii}-${song.id}` : `song-${song.id}`
}

const key = song => `${song.artist}\u0000${song.title}`
const baseMap = new Map(BASE_SONGS.map(song => [key(song), song]))
const catalogMap = new Map(CATALOG_500_SONGS.map((song, index) => [
  key(song), { ...song, id: 10000 + index },
]))

const verifiedSongs = VERIFIED_RANGE_100_3.map(verified => {
  const original = baseMap.get(key(verified)) ?? catalogMap.get(key(verified))
  if (!original) throw new Error(`Verified song not found: ${verified.artist} / ${verified.title}`)
  const minMidi = pitchLabelToMidi(verified.lowLabel)
  const maxMidi = pitchLabelToMidi(verified.highLabel)
  return {
    ...original, ...verified, minMidi, maxMidi,
    lowNote: midiToNoteName(minMidi),
    highNote: midiToNoteName(maxMidi),
    semitoneRange: maxMidi - minMidi,
    slug: slug(original),
  }
})

if (verifiedSongs.length !== 100) {
  throw new Error(`Expected 100 third-batch songs, got ${verifiedSongs.length}`)
}

const css = `
*{box-sizing:border-box}body{margin:0;background:#f6f7fb;color:#222;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.75}
.container{width:min(820px,calc(100% - 28px));margin:0 auto;padding:24px 0 60px}.logo{display:inline-block;margin-bottom:16px;color:#222;font-size:21px;font-weight:800;text-decoration:none}
.card{padding:28px;background:#fff;border-radius:20px;box-shadow:0 8px 30px rgba(0,0,0,.06)}h1{margin:0 0 12px;font-size:clamp(26px,6vw,36px);line-height:1.4}h2{margin-top:30px;font-size:21px}
.lead,.notice{color:#666}.range-grid,.cta-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:24px 0}.range-box,.source{padding:16px;border-radius:14px;background:#f7f8fc}.range-box strong{display:block;font-size:25px}
.cta{display:grid;place-items:center;min-height:50px;padding:12px;border-radius:13px;background:#111;color:#fff;font-weight:700;text-align:center;text-decoration:none}.cta.secondary{background:#eef0f6;color:#333}
.song-list{display:grid;gap:9px;margin-top:20px}.song-link{display:flex;justify-content:space-between;gap:12px;padding:14px;border:1px solid #ececf2;border-radius:13px;color:#222;text-decoration:none}.song-link small{color:#777}
@media(max-width:560px){.card{padding:20px 16px}.range-grid,.cta-grid{grid-template-columns:1fr}}
`

const ga = () => `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');</script>`

function songPage(song) {
  const url = `${SITE_URL}/songs/${song.slug}/`
  const title = `${song.title}（${song.artist}）の音域｜最低音${song.lowLabel}・最高音${song.highLabel}｜キミキー`
  const description = `${song.artist}「${song.title}」の音域は${song.lowLabel}〜${song.highLabel}（${song.lowNote}〜${song.highNote}）。出典確認済みの最低音・最高音を掲載し、自分の音域やカラオケキーと比較できます。`
  return `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${ga()}<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${url}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE_URL}/og-image.png"><meta name="twitter:card" content="summary_large_image"><style>${css}</style></head><body><main class="container"><a class="logo" href="/">🎤 キミキー</a><article class="card"><h1>${escapeHtml(song.title)}（${escapeHtml(song.artist)}）の音域</h1><p class="lead">公開されている音域データを参照した最低音・最高音です。</p><div class="range-grid"><div class="range-box"><small>最低音</small><strong>${song.lowLabel}</strong><span>${song.lowNote}</span></div><div class="range-box"><small>最高音</small><strong>${song.highLabel}</strong><span>${song.highNote}</span></div></div><h2>音域の広さ</h2><p>最低音から最高音までは約<strong>${song.semitoneRange}半音</strong>です。自分の快適音域と比較してキー調整の目安にできます。</p><div class="source">音域データ参照：<a href="${escapeHtml(song.rangeSource)}" target="_blank" rel="noopener noreferrer nofollow">参照元を確認</a></div><div class="cta-grid"><a class="cta" href="/?song=${encodeURIComponent(song.id)}">🎤 自分の音域と比較する</a><a class="cta secondary" href="/karaoke-key-check/">🔑 自分に合うキーを調べる</a><a class="cta secondary" href="/vocal-range-table/">🎼 音域表を見る</a><a class="cta secondary" href="/popular-song-ranges-3/">第3弾100曲の一覧</a></div><p class="notice">音源・ライブ版・フェイク・地声と裏声の扱いで集計が異なる場合があります。キミキーでは記載した参照元の値を比較の目安として使用しています。</p></article></main></body></html>`
}

const links = verifiedSongs.map(song => `<a class="song-link" href="/songs/${song.slug}/"><span><strong>${escapeHtml(song.title)}</strong><br><small>${escapeHtml(song.artist)}</small></span><span>${song.lowLabel}〜${song.highLabel}</span></a>`).join('')
const hubTitle = '人気J-POP追加100曲の音域一覧 第3弾｜最低音・最高音｜キミキー'
const hub = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${ga()}<title>${hubTitle}</title><meta name="description" content="絢香、中島美嘉、星野源、コブクロ、ゆず、レミオロメン、スキマスイッチ、秦 基博、Do As Infinity、SPEEDの人気100曲の音域を一覧で比較。"><meta name="robots" content="index, follow"><link rel="canonical" href="${SITE_URL}/popular-song-ranges-3/"><style>${css}</style></head><body><main class="container"><a class="logo" href="/">🎤 キミキー</a><article class="card"><h1>追加100曲の音域一覧 第3弾</h1><p class="lead">出典を確認した100曲の最低音・最高音をまとめました。</p><div class="song-list">${links}</div><div class="cta-grid"><a class="cta" href="/">🎤 自分の音域を測る</a><a class="cta secondary" href="/songs/">全曲の音域一覧</a></div></article></main></body></html>`

fs.mkdirSync(songsDir, { recursive: true })
for (const song of verifiedSongs) {
  const dir = path.join(songsDir, song.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), songPage(song), 'utf8')
}
fs.rmSync(hubDir, { recursive: true, force: true })
fs.mkdirSync(hubDir, { recursive: true })
fs.writeFileSync(path.join(hubDir, 'index.html'), hub, 'utf8')

const sitemapPath = path.join(publicDir, 'sitemap.xml')
let sitemap = fs.readFileSync(sitemapPath, 'utf8')
const urls = [`${SITE_URL}/popular-song-ranges-3/`, ...verifiedSongs.map(song => `${SITE_URL}/songs/${song.slug}/`)]
const additions = urls.filter(url => !sitemap.includes(`<loc>${url}</loc>`)).map(url => `<url><loc>${url}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join('\n')
if (additions) sitemap = sitemap.replace('</urlset>', `${additions}\n</urlset>`)
fs.writeFileSync(sitemapPath, sitemap, 'utf8')
console.log(`✅ Third verified range pages: ${verifiedSongs.length}`)
