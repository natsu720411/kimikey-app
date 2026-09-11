export const RANGE_STORAGE_KEY = 'kimikey-vocal-range-v1'

export function saveRangeData({
  hasAnyRange,
  limitLowestMidi,
  limitHighestMidi,
  comfortLowestMidi,
  comfortHighestMidi,
}) {
  if (!hasAnyRange()) return

  const data = {
    limitLowestMidi,
    limitHighestMidi,
    comfortLowestMidi,
    comfortHighestMidi,
    savedAt: Date.now(),
  }

  localStorage.setItem(RANGE_STORAGE_KEY, JSON.stringify(data))
}

export function loadRangeData() {
  try {
    const saved = localStorage.getItem(RANGE_STORAGE_KEY)
    if (!saved) return null

    const data = JSON.parse(saved)
    return {
      limitLowestMidi:
        Number.isFinite(data.limitLowestMidi) && Number.isFinite(data.limitHighestMidi)
          ? data.limitLowestMidi
          : null,
      limitHighestMidi:
        Number.isFinite(data.limitLowestMidi) && Number.isFinite(data.limitHighestMidi)
          ? data.limitHighestMidi
          : null,
      comfortLowestMidi:
        Number.isFinite(data.comfortLowestMidi) && Number.isFinite(data.comfortHighestMidi)
          ? data.comfortLowestMidi
          : null,
      comfortHighestMidi:
        Number.isFinite(data.comfortLowestMidi) && Number.isFinite(data.comfortHighestMidi)
          ? data.comfortHighestMidi
          : null,
    }
  } catch (error) {
    console.error('音域データの読み込み失敗', error)
    return null
  }
}

export function updateSavedRangeDisplay({
  hasLimitRange,
  hasComfortRange,
  hasAnyRange,
  limitLowestMidi,
  limitHighestMidi,
  comfortLowestMidi,
  comfortHighestMidi,
  midiToNoteName,
  updateRangeKeys,
  renderRecommendations,
}) {
  if (hasLimitRange()) {
    document.querySelector('#limitLowestNote').textContent = midiToNoteName(limitLowestMidi)
    document.querySelector('#limitHighestNote').textContent = midiToNoteName(limitHighestMidi)
  }

  if (hasComfortRange()) {
    document.querySelector('#comfortLowestNote').textContent = midiToNoteName(comfortLowestMidi)
    document.querySelector('#comfortHighestNote').textContent = midiToNoteName(comfortHighestMidi)
  }

  if (hasAnyRange()) {
    document.querySelector('#status').textContent = '✅ 保存済みの音域を読み込みました'
    document.querySelector('#rangeRequired')?.classList.add('hidden')
  }

  updateRangeKeys()
  renderRecommendations()
}
