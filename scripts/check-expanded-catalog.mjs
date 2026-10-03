import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { VERIFIED_RANGE_ALL } from '../src/songs-verified-all.js'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const valid=/^(low|mid1|mid2|hi)[A-G](?:#)?$/
if(VERIFIED_RANGE_ALL.length!==400)throw new Error(`Expected 400 verified ranges, got ${VERIFIED_RANGE_ALL.length}`)
const keys=VERIFIED_RANGE_ALL.map(s=>`${s.artist}\u0000${s.title}`);if(new Set(keys).size!==400)throw new Error('Duplicate verified artist/title found')
for(const s of VERIFIED_RANGE_ALL){if(!valid.test(s.lowLabel)||!valid.test(s.highLabel)||!/^https?:\/\//.test(s.rangeSource))throw new Error(`Invalid verified data: ${s.artist} / ${s.title}`)}
for(const hub of ['popular-song-ranges','popular-song-ranges-2','popular-song-ranges-3','popular-song-ranges-4']){if(!fs.existsSync(path.join(root,'dist',hub,'index.html')))throw new Error(`Missing generated hub: ${hub}`)}
const assets=path.join(root,'dist','assets');const bundle=fs.readdirSync(assets).filter(n=>n.endsWith('.js')).map(n=>fs.readFileSync(path.join(assets,n),'utf8')).join('\n')
for(const title of ['ultra soul','三日月','奏（かなで）','White Love','きらり','イケナイ太陽','千の夜をこえて','オドループ','CHE.R.RY','Time goes by']){if(!bundle.includes(title))throw new Error(`Search bundle is missing added song: ${title}`)}
const sitemap=fs.readFileSync(path.join(root,'dist','sitemap.xml'),'utf8');for(const hub of ['popular-song-ranges/','popular-song-ranges-2/','popular-song-ranges-3/','popular-song-ranges-4/']){if(!sitemap.includes(`https://kimikey-app.vercel.app/${hub}`))throw new Error(`Sitemap missing ${hub}`)}
console.log('✅ Expanded catalog check passed: 400 verified ranges, 4 SEO hubs, search bundle OK')
