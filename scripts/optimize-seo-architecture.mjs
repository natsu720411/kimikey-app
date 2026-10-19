import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS as BASE_SONGS } from '../src/songs.js'
import { CATALOG_ALL_SONGS } from '../src/songs-catalog-all.js'
import { VERIFIED_RANGE_ALL } from '../src/songs-verified-all.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const songsDir = path.join(publicDir, 'songs')
const artistsDir = path.join(publicDir, 'artists')
const SITE = 'https://kimikey-app.vercel.app'

const bandStartMidi = { low: 33, mid1: 45, mid2: 57, hi: 69, hihi: 81 }
const offsetFromA = {
  A: 0, 'A#': 1, B: 2, C: 3, 'C#': 4, D: 5,
  'D#': 6, E: 7, F: 8, 'F#': 9, G: 10, 'G#': 11,
}

function key(song) {
  return `${song.artist}\u0000${song.title}`
}

function pitchLabelToMidi(label) {
  const match = String(label).match(/^(low|mid1|mid2|hi|hihi)([A-G](?:#)?)$/)
  if (!match) return Number.NaN
  return bandStartMidi[match[1]] + offsetFromA[match[2]]
}

function songSlug(song) {
  const asciiTitle = String(song.title).normalize('NFKD').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return asciiTitle ? `${asciiTitle}-${song.id}` : `song-${song.id}`
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function setRobots(html, value) {
  const tag = `<meta name="robots" content="${value}">`
  if (/<meta\s+name="robots"\s+content="[^"]*"\s*\/?\s*>/i.test(html)) {
    return html.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?\s*>/i, tag)
  }
  return html.replace('</head>', `${tag}</head>`)
}

function setTitle(html, title) {
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  }
  return html
}

function setDescription(html, description) {
  const tag = `<meta name="description" content="${escapeHtml(description)}">`
  if (/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i.test(html)) {
    return html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, tag)
  }
  return html.replace('</head>', `${tag}</head>`)
}

function insertBeforeArticleEnd(html, marker, block) {
  if (html.includes(marker)) return html
  if (html.includes('</article>')) return html.replace('</article>', `${block}\n</article>`)
  if (html.includes('</main>')) return html.replace('</main>', `${block}\n</main>`)
  return html
}

function walkIndexFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkIndexFiles(full, results)
    if (entry.isFile() && entry.name === 'index.html') results.push(full)
  }
  return results
}

function labelSlug(label) {
  return String(label).toLowerCase().replace('#', '-sharp')
}

const baseMap = new Map(BASE_SONGS.map(song => [key(song), song]))
const catalogMap = new Map(
  CATALOG_ALL_SONGS.map((song, index) => [
    key(song),
    { ...song, id: 10000 + index },
  ])
)

const verifiedSongs = VERIFIED_RANGE_ALL.map(verified => {
  const original = baseMap.get(key(verified)) ?? catalogMap.get(key(verified))
  if (!original) throw new Error(`Verified song missing from app data: ${verified.artist} / ${verified.title}`)
  const lowMidi = pitchLabelToMidi(verified.lowLabel)
  const highMidi = pitchLabelToMidi(verified.highLabel)
  if (!Number.isFinite(lowMidi) || !Number.isFinite(highMidi) || lowMidi > highMidi) {
    throw new Error(`Bad verified range: ${verified.artist} / ${verified.title}`)
  }
  const slug = songSlug(original)
  return {
    ...verified,
    id: original.id,
    slug,
    href: `/songs/${slug}/`,
    lowMidi,
    highMidi,
  }
})

const verifiedByKey = new Map(verifiedSongs.map(song => [key(song), song]))
const verifiedUrlSet = new Set(verifiedSongs.map(song => `${SITE}${song.href}`))

// 1) Every verified song gets six nearby-range recommendations.
for (const song of verifiedSongs) {
  const filePath = path.join(songsDir, song.slug, 'index.html')
  if (!fs.existsSync(filePath)) {
    throw new Error(`Verified SEO page missing: ${song.artist} / ${song.title} -> ${song.slug}`)
  }

  const recommendations = verifiedSongs
    .filter(candidate => key(candidate) !== key(song))
    .map(candidate => ({
      ...candidate,
      distance:
        Math.abs(candidate.highMidi - song.highMidi) * 2 +
        Math.abs(candidate.lowMidi - song.lowMidi),
    }))
    .sort((a, b) =>
      a.distance - b.distance ||
      Math.abs(a.highMidi - song.highMidi) - Math.abs(b.highMidi - song.highMidi) ||
      a.title.localeCompare(b.title, 'ja')
    )
    .slice(0, 6)

  const links = recommendations.map(candidate =>
    `<a href="${candidate.href}" style="display:block;padding:12px 14px;border:1px solid #ececf2;border-radius:12px;text-decoration:none;color:inherit"><strong>${escapeHtml(candidate.title)}</strong><br><small>${escapeHtml(candidate.artist)} ・ ${candidate.lowLabel}〜${candidate.highLabel}</small></a>`
  ).join('')

  const marker = '<!-- similar-range-songs -->'
  const block = `
${marker}
<section>
  <h2>この曲と音域が近い曲</h2>
  <p>${escapeHtml(song.title)}（${escapeHtml(song.artist)}）と最低音・最高音が近い確認済み曲です。歌いやすい曲探しの目安にしてください。</p>
  <div style="display:grid;gap:9px">${links}</div>
  <p><a href="/highest-note-songs/">最高音から曲を探す</a> ・ <a href="/song-range-index/">曲の音域一覧を見る</a></p>
</section>`

  let html = fs.readFileSync(filePath, 'utf8')
  html = insertBeforeArticleEnd(html, marker, block)
  fs.writeFileSync(filePath, html, 'utf8')
}

// 2) Strengthen existing artist pages with verified range summaries.
const byArtist = new Map()
for (const song of verifiedSongs) {
  if (!byArtist.has(song.artist)) byArtist.set(song.artist, [])
  byArtist.get(song.artist).push(song)
}

const artistFiles = walkIndexFiles(artistsDir)
let strengthenedArtists = 0
for (const [artist, artistSongs] of byArtist) {
  if (artistSongs.length < 3) continue

  const artistFile = artistFiles.find(filePath => {
    const html = fs.readFileSync(filePath, 'utf8')
    return html.includes(artist)
  })
  if (!artistFile) continue

  const sortedByHigh = [...artistSongs].sort((a, b) =>
    b.highMidi - a.highMidi || a.title.localeCompare(b.title, 'ja')
  )
  const minLow = [...artistSongs].sort((a, b) => a.lowMidi - b.lowMidi)[0]
  const maxHigh = sortedByHigh[0]
  const list = sortedByHigh.slice(0, 15).map(song =>
    `<a href="${song.href}" style="display:flex;justify-content:space-between;gap:10px;padding:11px 13px;border:1px solid #ececf2;border-radius:11px;text-decoration:none;color:inherit"><span><strong>${escapeHtml(song.title)}</strong></span><span>${song.lowLabel}〜${song.highLabel}</span></a>`
  ).join('')

  let html = fs.readFileSync(artistFile, 'utf8')
  html = setTitle(html, `${artist}の音域一覧｜曲ごとの最高音・最低音｜キミキー`)
  html = setDescription(
    html,
    `${artist}の確認済み${artistSongs.length}曲の音域一覧。最低音・最高音を曲ごとに比較し、カラオケのキー選びや歌いやすい曲探しに使えます。`
  )

  const marker = '<!-- verified-artist-range-summary -->'
  const block = `
${marker}
<section>
  <h2>${escapeHtml(artist)}の曲別音域一覧</h2>
  <p>確認済み音域は<strong>${artistSongs.length}曲</strong>です。登録曲の中では最低音が${minLow.lowLabel}、最高音が${maxHigh.highLabel}まであります。</p>
  <div style="display:grid;gap:8px">${list}</div>
  <p><a href="/song-range-index/">全曲の音域一覧を見る</a> ・ <a href="/vocal-range-check/">自分の音域を測る</a></p>
</section>`

  html = insertBeforeArticleEnd(html, marker, block)
  fs.writeFileSync(artistFile, html, 'utf8')
  strengthenedArtists += 1
}

// 3) Generate high-note index pages from verified data.
const highGroups = new Map()
for (const song of verifiedSongs) {
  if (!highGroups.has(song.highLabel)) highGroups.set(song.highLabel, [])
  highGroups.get(song.highLabel).push(song)
}

const eligibleHighGroups = [...highGroups.entries()]
  .filter(([, songs]) => songs.length >= 5)
  .sort((a, b) => pitchLabelToMidi(a[0]) - pitchLabelToMidi(b[0]))

const highIndexDir = path.join(publicDir, 'highest-note-songs')
fs.rmSync(highIndexDir, { recursive: true, force: true })
fs.mkdirSync(highIndexDir, { recursive: true })

const cards = eligibleHighGroups.map(([label, songs]) =>
  `<a href="/highest-note-${labelSlug(label)}/" style="display:block;padding:15px;border:1px solid #e7e9f1;border-radius:13px;text-decoration:none;color:inherit"><strong>最高音${label}の曲</strong><br><span>${songs.length}曲</span></a>`
).join('')

const commonStyle = '*{box-sizing:border-box}body{margin:0;background:#f6f7fb;color:#222;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.75}.wrap{width:min(900px,calc(100% - 28px));margin:auto;padding:24px 0 60px}.card{padding:28px;background:#fff;border-radius:20px;box-shadow:0 8px 30px #0000000f}.logo{font-weight:800;text-decoration:none;color:inherit}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.songs{display:grid;gap:8px}.song{display:flex;justify-content:space-between;gap:12px;padding:13px;border:1px solid #ececf2;border-radius:12px;text-decoration:none;color:inherit}@media(max-width:560px){.card{padding:20px 16px}.grid{grid-template-columns:1fr}.song{align-items:flex-start}}'

fs.writeFileSync(
  path.join(highIndexDir, 'index.html'),
  `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>最高音から曲を探す｜hiA・hiB・hiCなど音域別一覧｜キミキー</title><meta name="description" content="最高音hiA・hiB・hiCなど、曲の最高音から歌いたい曲を探せる一覧です。出典確認済みの曲だけを音域別に掲載しています。"><meta name="robots" content="index, follow"><link rel="canonical" href="${SITE}/highest-note-songs/"><style>${commonStyle}</style></head><body><main class="wrap"><a class="logo" href="/">🎤 キミキー</a><article class="card"><h1>最高音から曲を探す</h1><p>出典確認済みの曲を最高音ごとにまとめています。自分が出しやすい最高音に近い曲探しに使えます。</p><div class="grid">${cards}</div><p><a href="/vocal-range-table/">音域表を見る</a> ・ <a href="/song-range-index/">曲の音域一覧</a> ・ <a href="/vocal-range-check/">自分の音域を測る</a></p></article></main></body></html>`,
  'utf8'
)

const highPageUrls = [`${SITE}/highest-note-songs/`]
for (const [label, songs] of eligibleHighGroups) {
  const dirName = `highest-note-${labelSlug(label)}`
  const dir = path.join(publicDir, dirName)
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })

  const sorted = [...songs].sort((a, b) =>
    a.lowMidi - b.lowMidi || a.artist.localeCompare(b.artist, 'ja') || a.title.localeCompare(b.title, 'ja')
  )
  const links = sorted.map(song =>
    `<a class="song" href="${song.href}"><span><strong>${escapeHtml(song.title)}</strong><br><small>${escapeHtml(song.artist)}</small></span><span>${song.lowLabel}〜${song.highLabel}</span></a>`
  ).join('')

  fs.writeFileSync(
    path.join(dir, 'index.html'),
    `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>最高音${label}の曲一覧｜歌いやすい曲を音域から探す｜キミキー</title><meta name="description" content="最高音が${label}の確認済み${songs.length}曲を一覧掲載。最低音も比較しながら、自分の音域に合う曲やカラオケ曲を探せます。"><meta name="robots" content="index, follow"><link rel="canonical" href="${SITE}/${dirName}/"><style>${commonStyle}</style></head><body><main class="wrap"><a class="logo" href="/">🎤 キミキー</a><article class="card"><h1>最高音${label}の曲一覧</h1><p>最高音が<strong>${label}</strong>の出典確認済み曲は${songs.length}曲あります。最低音もあわせて比較してください。</p><div class="songs">${links}</div><p><a href="/highest-note-songs/">← 最高音別一覧へ</a> ・ <a href="/vocal-range-check/">自分の音域を測る</a></p></article></main></body></html>`,
    'utf8'
  )
  highPageUrls.push(`${SITE}/${dirName}/`)
}

// Link the central song-range index to the new high-note index.
const songRangeIndexPath = path.join(publicDir, 'song-range-index', 'index.html')
if (fs.existsSync(songRangeIndexPath)) {
  let html = fs.readFileSync(songRangeIndexPath, 'utf8')
  const marker = '<!-- highest-note-index-link -->'
  const block = `
${marker}
<section>
  <h2>最高音から曲を探す</h2>
  <p><a href="/highest-note-songs/"><strong>hiA・hiB・hiCなど最高音別の曲一覧</strong></a>から、自分の音域に近い曲を探せます。</p>
</section>`
  html = insertBeforeArticleEnd(html, marker, block)
  fs.writeFileSync(songRangeIndexPath, html, 'utf8')
}

// 4) Unverified song pages stay usable via search but are noindex, follow.
// Also remove those song URLs from sitemap so crawl budget is concentrated on verified pages.
const songFiles = walkIndexFiles(songsDir)
let noindexedSongPages = 0
for (const filePath of songFiles) {
  let html = fs.readFileSync(filePath, 'utf8')
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?\s*>/i)
  if (!canonicalMatch) continue
  const canonical = canonicalMatch[1]
  if (verifiedUrlSet.has(canonical)) {
    html = setRobots(html, 'index, follow')
  } else {
    html = setRobots(html, 'noindex, follow')
    noindexedSongPages += 1
  }
  fs.writeFileSync(filePath, html, 'utf8')
}

const sitemapPath = path.join(publicDir, 'sitemap.xml')
let sitemap = fs.readFileSync(sitemapPath, 'utf8')
sitemap = sitemap.replace(/<url>\s*<loc>(https:\/\/kimikey-app\.vercel\.app\/songs\/[^<]+)<\/loc>[\s\S]*?<\/url>/g, (entry, url) => {
  return verifiedUrlSet.has(url) ? entry : ''
})

for (const url of highPageUrls) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) {
    sitemap = sitemap.replace(
      '</urlset>',
      `<url><loc>${url}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n</urlset>`
    )
  }
}
fs.writeFileSync(sitemapPath, sitemap, 'utf8')

console.log(
  `✅ SEO architecture optimized: ${verifiedSongs.length} verified song pages, ${strengthenedArtists} artist pages strengthened, ${eligibleHighGroups.length} high-note pages, ${noindexedSongPages} unverified/stale song pages noindexed`
)
