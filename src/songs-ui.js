import { SONGS as BASE_SONGS } from './songs.js'
import { CATALOG_ALL_SONGS } from './songs-catalog-all.js'
import { VERIFIED_RANGE_ALL } from './songs-verified-all.js'

// Single source of truth for the interactive catalog. Keeps generated SEO IDs stable.
const idKey = song => song.artist + '\u0000' + song.title
const verified = new Map(VERIFIED_RANGE_ALL.map(song => [idKey(song), song]))
const bandStart = {low:33,mid1:45,mid2:57,hi:69,hihi:81}
const noteOffset = {A:0,'A#':1,B:2,C:3,'C#':4,D:5,'D#':6,E:7,F:8,'F#':9,G:10,'G#':11}
function pitchToMidi(label) {
  const m = String(label ?? '').match(/^(low|mid1|mid2|hi|hihi)([A-G]#?)$/)
  if (!m) throw new Error('Invalid sourced range: ' + label)
  return bandStart[m[1]] + noteOffset[m[2]]
}
const all = new Map()
for (const song of BASE_SONGS) if (!all.has(idKey(song))) all.set(idKey(song),song)
CATALOG_ALL_SONGS.forEach((song,index) => {
  if (!all.has(idKey(song))) all.set(idKey(song),{...song,id:10000+index})
})
export const SONGS = [...all.values()].map(song => {
  const fromSource = verified.get(idKey(song))
  if (!fromSource) return song
  const minMidi = pitchToMidi(fromSource.lowLabel)
  const maxMidi = pitchToMidi(fromSource.highLabel)
  if (minMidi > maxMidi) throw new Error('Invalid verified range order for ' + idKey(song))
  return {
    ...song,...fromSource,minMidi,maxMidi,
    lowMidi:minMidi,highMidi:maxMidi,low:minMidi,high:maxMidi,
    sourceType:'出典確認済み音域',catalogOnly:false,
  }
})
