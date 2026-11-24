export const KARAOKE_NOTES_KEY = 'kimikey-karaoke-notes-v1'
export const KARAOKE_STATUSES = ['練習中', '歌えた', '高かった', '低かった']
function validEntry(value) {
  if (!value || typeof value !== 'object' || !KARAOKE_STATUSES.includes(value.status)) return null
  const shift = Number(value.keyShift)
  if (!Number.isInteger(shift) || shift < -12 || shift > 12) return null
  return { status: value.status, keyShift: shift, updatedAt: Number(value.updatedAt) || 0 }
}
export function loadKaraokeNotes(storage = globalThis.localStorage) {
  try {
    const obj = JSON.parse(storage.getItem(KARAOKE_NOTES_KEY) || '{}')
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {}
    return Object.fromEntries(Object.entries(obj)
      .map(([id,note])=>[id,validEntry(note)])
      .filter(([id,note])=>id.length>2 && id.length<300 && note))
  } catch { return {} }
}
export function saveKaraokeNote(id, status, keyShift, storage = globalThis.localStorage) {
  if (typeof id !== 'string' || id.length < 3 || id.length > 299) return false
  const note = validEntry({ status, keyShift, updatedAt: Date.now() })
  if (!note) return false
  try {
    const current = loadKaraokeNotes(storage)
    current[id] = note
    storage.setItem(KARAOKE_NOTES_KEY, JSON.stringify(current))
    return true
  } catch { return false }
}
export function removeKaraokeNote(id, storage = globalThis.localStorage) {
  try {
    const current = loadKaraokeNotes(storage)
    delete current[id]
    storage.setItem(KARAOKE_NOTES_KEY, JSON.stringify(current))
    return true
  } catch { return false }
}
function escapeCsv(value) {
  const text = String(value ?? '')
  const safe = /^[=+@-]/.test(text) ? "'" + text : text
  return '"' + safe.replaceAll('"','""') + '"'
}
export function karaokeNotesCsv(notes = loadKaraokeNotes()) {
  const rows = [['アーティスト','曲名','記録','キー変更','最終更新']]
  for (const [id,note] of Object.entries(notes)) {
    const [artist,title] = id.split('\u0000')
    if (!artist || !title) continue
    rows.push([artist,title,note.status,note.keyShift,note.updatedAt ? new Date(note.updatedAt).toISOString() : ''])
  }
  return '\uFEFF'+rows.map(row=>row.map(escapeCsv).join(',')).join('\r\n')+'\r\n'
}
