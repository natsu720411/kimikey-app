import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const input=path.join(root,'data','gsc-baseline-20261124.csv')
const output=path.join(root,'reports','seo-opportunities.md')
const rows=fs.readFileSync(input,'utf8').trim().split(/\r?\n/).slice(1).map(line=>{
  const [query,clicks,impressions,position,page]=line.split(',')
  return {query,clicks:Number(clicks),impressions:Number(impressions),
    position:position?Number(position):null,page,
    estimatedGap:Math.max(0,Math.ceil(Number(impressions)*0.02-Number(clicks)))}
}).filter(r=>Number.isFinite(r.clicks)&&Number.isFinite(r.impressions)&&r.page.startsWith('/'))
rows.sort((a,b)=>b.estimatedGap-a.estimatedGap)
const lines=['# キミキー Search Console 対策候補','',
  '> 2026-11-24時点に共有されたスクリーンショット由来の**手動スナップショット**。最新GSC値ではありません。',
  '> クリック機会 = 表示回数×2% - 実際のクリック数（参考用の仮定であり予測・保証ではありません）。',
  '> メタ情報を変更したページは、再評価されるまで頻繁に書き換えないでください。',
  '',
  '| 検索語 | 表示 | クリック | 平均掲載順位 | 対象ページ | クリック機会の概算 |',
  '|---|---:|---:|---:|---|---:|',
  ...rows.map(r=>'| '+r.query+' | '+r.impressions+' | '+r.clicks+' | '+
    (r.position?.toFixed(1)??'未確認')+' | '+r.page+' | '+r.estimatedGap+' |'),
  '','## 次回更新時','同じ検索語・同じ集計期間のSearch Console値をCSVに入力し、前回との掲載順位とCTRを比較します。']
fs.mkdirSync(path.dirname(output),{recursive:true})
fs.writeFileSync(output,lines.join('\n')+'\n')
console.log('GSC opportunity snapshot: '+rows.length+' search queries; top: '+(rows[0]?.query??'none')+' (manual, not live)')
