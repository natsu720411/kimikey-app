import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const publicDir=path.join(root,'public')
const reports=path.join(root,'reports')
const SITE='https://kimikey-app.vercel.app'
const indexPages=[]
function collect(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name.startsWith('.'))continue
    const full=path.join(dir,entry.name)
    if(entry.isDirectory())collect(full)
    else if(entry.isFile() && entry.name==='index.html')indexPages.push(full)
  }
}
collect(publicDir)
indexPages.push(path.join(root,'index.html'))
const priorities=['/','/songs/happy-birthday-41/','/songs/song-446/','/popular/','/hia-frequency/','/song-range-index/','/artist-range-guide/','/latest-chart-songs/','/popular-song-ranges-28/']
const metaWarnings=[]
const brokenLinks=[]
const pageData=new Map()
const normalizePath=file=>file===path.join(root,'index.html')
  ?'/' :'/'+path.relative(publicDir,path.dirname(file)).split(path.sep).join('/')+'/'
function getLocation(url){
  try{
    const parsed=new URL(url,SITE)
    return parsed.origin===SITE?parsed.pathname:null
  }catch{return null}
}
function existsAt(url){
  const target=getLocation(url)
  if(!target)return true
  if(target==='/')return fs.existsSync(path.join(root,'index.html'))
  const safe=target.replace(/^\/+/, '')
  if(safe.includes('..'))return false
  return fs.existsSync(path.join(publicDir,safe,'index.html')) ||
    fs.existsSync(path.join(publicDir,safe)) ||
    fs.existsSync(path.join(root,safe))
}
for(const file of indexPages){
  const href=normalizePath(file)
  const html=fs.readFileSync(file,'utf8')
  const titles=html.match(/<title(?:\s[^>]*)?>[\s\S]*?<\/title>/gi)||[]
  const tags=html.match(/<meta\b[^>]*>/gi)||[]
  const descriptions=tags.filter(t=>/\bname=["']description["']/i.test(t))
  const linkTags=html.match(/<link\b[^>]*>/gi)||[]
  const canonicals=linkTags.filter(t=>/\brel=["']canonical["']/i.test(t))
  const indexable=!tags.some(t=>/\bname=["']robots["']/i.test(t) && /noindex/i.test(t))
  const canonical=canonicals[0]?.match(/\bhref=["']([^"']+)["']/i)?.[1]
  pageData.set(href,{titleCount:titles.length,descriptionCount:descriptions.length,canonicalCount:canonicals.length,canonical,indexable})
  if(indexable && (titles.length!==1||descriptions.length!==1||canonicals.length!==1)){
    metaWarnings.push({path:href,title:titles.length,description:descriptions.length,canonical:canonicals.length})
  }
  if(!priorities.includes(href))continue
  const urls=[...html.matchAll(/<a\b[^>]*\bhref=["'](\/[^"']+)["']/gi)].map(m=>m[1])
  for(const url of urls){
    if(!existsAt(url))brokenLinks.push({page:href,link:url})
  }
}
const errors=[]
for(const url of priorities){
  const meta=pageData.get(url)
  if(!meta){errors.push('Missing priority page: '+url);continue}
  if(meta.titleCount!==1||meta.descriptionCount!==1||meta.canonicalCount!==1)
    errors.push('Priority SEO tags missing/duplicated: '+url+' '+JSON.stringify(meta))
  if(meta.canonical!==SITE+url)errors.push('Wrong priority canonical for '+url+': '+meta.canonical)
}
const sitemap=fs.readFileSync(path.join(publicDir,'sitemap.xml'),'utf8')
for(const target of priorities){
  if(!sitemap.includes('<loc>'+SITE+target+'</loc>'))
    errors.push('Priority URL missing from sitemap: '+target)
}
for(const link of brokenLinks)errors.push('Broken priority internal link: '+JSON.stringify(link))
fs.mkdirSync(reports,{recursive:true})
const report={
  inspectedAt:new Date().toISOString(),
  inspectedPages:indexPages.length,
  indexedMetaWarnings:metaWarnings.length,
  metaWarningSamples:metaWarnings.slice(0,30),
  priorityChecked:priorities.length,
  brokenPriorityLinks:brokenLinks.length,
  errors,
}
fs.writeFileSync(path.join(reports,'seo-audit.json'),JSON.stringify(report,null,2)+'\n')
console.log('SEO audit: '+indexPages.length+' HTML pages, '+metaWarnings.length+' metadata warnings, '+brokenLinks.length+' broken priority links, '+errors.length+' critical failures')
if(errors.length)throw new Error('SEO audit failed: '+errors.slice(0,10).join('; '))
