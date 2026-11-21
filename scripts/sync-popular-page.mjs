import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(root,'public')
const data = JSON.parse(fs.readFileSync(path.join(pub,'popular-songs.json'),'utf8'))
const pagePath = path.join(pub,'popular','index.html')
const escape = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;')
  .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')
if (!Array.isArray(data.songs) || data.songs.length === 0)
  throw new Error('Ranking JSON missing songs')
const songs=data.songs.filter(s=>s.title && s.artist && /^\/songs\/[a-z0-9-]+\/$/.test(s.songUrl))
if (songs.length !== data.songs.length) throw new Error('Ranking has invalid song links')
const ageDays=(Date.now()-Date.parse(data.updatedAt))/(24*60*60*1000)
const isReferenceOnly=data.isFallback===true || !Number.isFinite(ageDays) || ageDays>14
const date = Number.isFinite(ageDays)
  ? new Date(data.updatedAt).toLocaleDateString('ja-JP', {timeZone:'Asia/Tokyo'}) : '不明'
const updatedLabel = isReferenceOnly
  ? '人気曲の参考リスト（最新ランキングの取得を確認できていません・更新 '+date+'）'
  : 'DAM・JOYSOUNDの公開ランキング（'+date+' 更新）'
const rows=songs.map((s,i)=>{
  const rank=[s.damRank?'DAM '+s.damRank+'位':'',s.joysoundRank?'JOYSOUND '+s.joysoundRank+'位':''].filter(Boolean).join(' / ')
  return '        <a class="song" href="'+escape(s.songUrl)+'"><span class="rank">'+(i+1)+
    '</span><span class="song-main"><strong>'+escape(s.title)+'</strong><small>'+
    escape(s.artist)+(rank?' ・ '+escape(rank):'')+
    '</small></span><span class="arrow">›</span></a>'
}).join('\n')
const structured = JSON.stringify({
  '@context':'https://schema.org','@type':'ItemList','name':'今人気のカラオケ曲の音域一覧',
  itemListElement:songs.map((s,i)=>({'@type':'ListItem',position:i+1,name:s.title+' - '+s.artist,url:'https://kimikey-app.vercel.app'+s.songUrl}))
},null,2).replaceAll('<','\\u003c')
let html=fs.readFileSync(pagePath,'utf8')
const jsonMatch=/<script type="application\/ld\+json">[\s\S]*?<\/script>/
if(!jsonMatch.test(html))throw new Error('popular page JSON-LD block missing')
html=html.replace(jsonMatch,'<script type="application/ld+json">\n'+structured+'\n  </script>')
const begin='<div id="popularList" class="songs">'
const end='\n      </div>\n      <div class="cta-grid">'
if(!html.includes(begin)||!html.includes(end))throw new Error('popular list block missing')
const beginIndex=html.indexOf(begin)+begin.length
const endIndex=html.indexOf(end,beginIndex)
if(endIndex<0)throw new Error('popular list end missing')
html=html.slice(0,beginIndex)+'\n'+rows+html.slice(endIndex)
const updated=/<p id="updated" class="updated">[^<]*<\/p>/
if(!updated.test(html))throw new Error('popular updated label missing')
html=html.replace(updated,'<p id="updated" class="updated">'+escape(updatedLabel)+'</p>')
// Updates on first paint, but also refresh if the ranking JSON changes while open.
html=html.replace("if (!response.ok) return","if (!response.ok) throw new Error('Ranking fetch failed')")
  .replace("if (!Array.isArray(data.songs) || !data.songs.length) return","if (!Array.isArray(data.songs) || !data.songs.length) throw new Error('Ranking JSON invalid')")
  .replace("if (!data.songs.every(song => song.songUrl)) return","if (!data.songs.every(song => song.songUrl)) throw new Error('Ranking URLs missing')")
  .replace("document.querySelector('#updated').textContent = new Date(data.updatedAt).toLocaleDateString('ja-JP') + ' 更新'",
    "const days = (Date.now() - Date.parse(data.updatedAt)) / 86400000; document.querySelector('#updated').textContent = (data.isFallback === true || !Number.isFinite(days) || days > 14) ? '人気曲の参考リスト（最新ランキング取得未確認）' : 'DAM・JOYSOUNDの公開ランキング（' + new Date(data.updatedAt).toLocaleDateString('ja-JP') + ' 更新）'")
fs.writeFileSync(pagePath,html,'utf8')
console.log('Popular ranking static page synced: '+songs.length+' songs, referenceOnly='+isReferenceOnly)
