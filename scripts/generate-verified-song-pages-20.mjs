import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS as BASE_SONGS } from '../src/songs.js'
import { CATALOG_ALL_SONGS } from '../src/songs-catalog-all.js'
import { VERIFIED_RANGE_BATCH_20 } from '../src/songs-verified-batch-20.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const songsDir = path.join(publicDir, 'songs')
const hubDir = path.join(publicDir, 'popular-song-ranges-20')
const SITE = 'https://kimikey-app.vercel.app'
const key = song => `${song.artist}\u0000${song.title}`

const baseMap = new Map(BASE_SONGS.map(song => [key(song), song]))
const catalogMap = new Map(
  CATALOG_ALL_SONGS.map((song, index) => [
    key(song),
    { ...song, id: 10000 + index },
  ])
)

const bandStartMidi = { low: 33, mid1: 45, mid2: 57, hi: 69, hihi: 81 }
const offsetFromA = {
  A: 0, 'A#': 1, B: 2, C: 3, 'C#': 4, D: 5,
  'D#': 6, E: 7, F: 8, 'F#': 9, G: 10, 'G#': 11,
}
function pitchLabelToMidi(label) {
  const match = label.match(/^(low|mid1|mid2|hi|hihi)([A-G](?:#)?)$/)
  if (!match) throw new Error(`Bad label ${label}`)
  const [, band, note] = match
  return bandStartMidi[band] + offsetFromA[note]
}
function midiToNote(midi) {
  const noteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
  return `${noteNames[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`
}
function songSlug(song) {
  const asciiTitle = String(song.title).normalize('NFKD').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return asciiTitle ? `${asciiTitle}-${song.id}` : `song-${song.id}`
}
function escapeHtml(value) {
  return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;')
}

const songs = VERIFIED_RANGE_BATCH_20.map(verified => {
  const original = baseMap.get(key(verified)) ?? catalogMap.get(key(verified))
  if (!original) throw new Error(`Verified song not found: ${verified.artist} / ${verified.title}`)
  const minMidi = pitchLabelToMidi(verified.lowLabel)
  const maxMidi = pitchLabelToMidi(verified.highLabel)
  if (minMidi > maxMidi) throw new Error(`Invalid range order: ${verified.artist} / ${verified.title}`)
  return {
    ...original, ...verified, minMidi, maxMidi,
    lowNote: midiToNote(minMidi), highNote: midiToNote(maxMidi),
    slug: songSlug(original),
  }
})

if (songs.length !== 100) throw new Error(`Expected 100 twentieth-batch songs, got ${songs.length}`)

const css = '*{box-sizing:border-box}body{margin:0;background:#f6f7fb;color:#222;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.75}.wrap{width:min(900px,calc(100% - 28px));margin:auto;padding:24px 0 60px}.card{padding:28px;background:#fff;border-radius:20px;box-shadow:0 8px 30px #0000000f}a{color:inherit}.logo{font-weight:800;text-decoration:none;font-size:21px}.ranges{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:24px 0}.box{padding:18px;border-radius:14px;background:#f6f7fb}.box strong{display:block;font-size:25px}.songs{display:grid;gap:9px}.song{display:flex;justify-content:space-between;gap:12px;padding:14px;border:1px solid #ececf2;border-radius:13px;text-decoration:none}.artist{margin:30px 0 10px}@media(max-width:560px){.card{padding:20px 16px}.ranges{grid-template-columns:1fr}.song{align-items:flex-start}}'

function songPage(song) {
  const url = `${SITE}/songs/${song.slug}/`
  const title = `${song.title}（${song.artist}）の音域｜最低音${song.lowLabel}・最高音${song.highLabel}｜キミキー`
  const description = `${song.artist}「${song.title}」の音域は${song.lowLabel}〜${song.highLabel}。公開されている曲単位の音域情報を参照した最低音・最高音の目安です。`
  return `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${url}"><meta property="og:image" content="${SITE}/og-image.png"><style>${css}</style></head><body><main class="wrap"><a class="logo" href="/">🎤 キミキー</a><article class="card"><h1>${escapeHtml(song.title)}（${escapeHtml(song.artist)}）の音域</h1><p>公開されている曲単位の音域情報を参照した最低音・最高音です。地声・裏声・フェイク・コーラスなどの扱いは参照元によって異なるため、音域の目安としてご利用ください。</p><div class="ranges"><div class="box">最低音<strong>${song.lowLabel}</strong>${song.lowNote}</div><div class="box">最高音<strong>${song.highLabel}</strong>${song.highNote}</div></div><p>音域幅は約${song.maxMidi-song.minMidi}半音です。</p><p>参照：<a href="${escapeHtml(song.rangeSource)}" rel="noopener noreferrer nofollow" target="_blank">音域データ参照元</a></p><p><a href="/?song=${encodeURIComponent(song.id)}">🎤 自分の音域と比較する</a>　<a href="/karaoke-key-check/">🔑 キーを調べる</a></p><p><a href="/popular-song-ranges-20/">第20弾100曲の一覧へ</a></p></article></main></body></html>`
}

fs.mkdirSync(songsDir,{recursive:true})
for(const song of songs){
  const dir=path.join(songsDir,song.slug)
  fs.mkdirSync(dir,{recursive:true})
  fs.writeFileSync(path.join(dir,'index.html'),songPage(song),'utf8')
}
fs.rmSync(hubDir,{recursive:true,force:true})
fs.mkdirSync(hubDir,{recursive:true})
const byArtist=new Map()
for(const song of songs){
  if(!byArtist.has(song.artist)) byArtist.set(song.artist,[])
  byArtist.get(song.artist).push(song)
}
const artistSections=[...byArtist.entries()].map(([artist,artistSongs])=>{
  const links=artistSongs.map(song=>`<a class="song" href="/songs/${song.slug}/"><span><strong>${escapeHtml(song.title)}</strong></span><span>${song.lowLabel}〜${song.highLabel}</span></a>`).join('')
  return `<h2 class="artist">${escapeHtml(artist)}</h2><div class="songs">${links}</div>`
}).join('')
const hubDescription='Mrs. GREEN APPLE、YOASOBI、米津玄師、Vaundy、あいみょん、HANA、Aimer、IVEなど追加100曲の音域を一覧で掲載。'
fs.writeFileSync(path.join(hubDir,'index.html'),
`<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>人気曲追加100曲の音域一覧 第20弾｜キミキー</title><meta name="description" content="${escapeHtml(hubDescription)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${SITE}/popular-song-ranges-20/"><style>${css}</style></head><body><main class="wrap"><a class="logo" href="/">🎤 キミキー</a><article class="card"><h1>追加100曲の音域一覧 第20弾</h1><p>曲単位の公開情報で確認できた最低音・最高音を、音域の目安として掲載しています。</p>${artistSections}</article></main></body></html>`,'utf8')

const sitemapPath=path.join(publicDir,'sitemap.xml')
let sitemap=fs.readFileSync(sitemapPath,'utf8')
const urls=[`${SITE}/popular-song-ranges-20/`,...songs.map(song=>`${SITE}/songs/${song.slug}/`)]
const additions=urls.filter(url=>!sitemap.includes(`<loc>${url}</loc>`))
  .map(url=>`<url><loc>${url}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join('\n')
if(additions) sitemap=sitemap.replace('</urlset>',`${additions}\n</urlset>`)
fs.writeFileSync(sitemapPath,sitemap,'utf8')
console.log(`✅ Twentieth verified range pages: ${songs.length}`)
