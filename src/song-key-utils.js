export function getSongLowMidi(song) {
  return song.lowestMidi ?? song.minMidi ?? song.lowMidi ?? song.low
}

export function getSongHighMidi(song) {
  return song.highestMidi ?? song.maxMidi ?? song.highMidi ?? song.high
}

export function formatKeyShift(shift) {
  if (shift === 0) return '原キー'
  if (shift > 0) return `+${shift}`
  return `${shift}`
}

export function calculateSongKey(song, range) {
  const { limitLowestMidi, limitHighestMidi, comfortLowestMidi, comfortHighestMidi } = range
  const hasLimitRange = limitLowestMidi !== null && limitHighestMidi !== null
  const hasComfortRange = comfortLowestMidi !== null && comfortHighestMidi !== null
  if (!hasLimitRange && !hasComfortRange) return null

  const songLow = getSongLowMidi(song)
  const songHigh = getSongHighMidi(song)
  if (!Number.isFinite(songLow) || !Number.isFinite(songHigh)) return null

  const targetLow = hasComfortRange ? comfortLowestMidi : limitLowestMidi
  const targetHigh = hasComfortRange ? comfortHighestMidi : limitHighestMidi
  const targetCenter = (targetLow + targetHigh) / 2
  let best = null
  for (let shift = -6; shift <= 6; shift++) {
    const shiftedLow = songLow + shift
    const shiftedHigh = songHigh + shift
    const lowOverflow = Math.max(0, targetLow - shiftedLow)
    const highOverflow = Math.max(0, shiftedHigh - targetHigh)
    const overflow = lowOverflow + highOverflow
    const shiftedCenter = (shiftedLow + shiftedHigh) / 2
    const centerDistance = Math.abs(shiftedCenter - targetCenter)
    const fitsComfort = hasComfortRange && shiftedLow >= comfortLowestMidi && shiftedHigh <= comfortHighestMidi
    const fitsLimit = hasLimitRange && shiftedLow >= limitLowestMidi && shiftedHigh <= limitHighestMidi
    const score = lowOverflow * 100 + highOverflow * 140 + centerDistance * 2 + Math.abs(shift) * 0.25
    if (best === null || score < best.score) best = { shift, shiftedLow, shiftedHigh, lowOverflow, highOverflow, overflow, fitsComfort, fitsLimit, score }
  }
  return best
}

export function getSongStars(result) {
  if (!result) return 0
  if (result.fitsComfort && Math.abs(result.shift) <= 1) return 5
  if (result.fitsComfort) return 4
  if (result.fitsLimit) return 3
  if (result.overflow <= 2) return 2
  return 1
}
