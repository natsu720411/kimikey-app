import { SONGS as BASE_SONGS } from '/src/songs.js'
import { VERIFIED_RANGE_ALL } from './songs-verified-all.js'

const verifiedRangeMap =
  new Map(
    VERIFIED_RANGE_ALL.map(
      song => [
        `${song.artist}\u0000${song.title}`,
        song,
      ]
    )
  )

function pitchLabelToMidi(label) {
  const match =
    String(label).match(
      /^(low|mid1|mid2|hi)([A-G](?:#)?)$/
    )

  if (!match) {
    throw new Error(
      `Unknown pitch label: ${label}`
    )
  }

  const [, band, note] = match

  const bandStartMidi = {
    low: 33,
    mid1: 45,
    mid2: 57,
    hi: 69,
  }

  const offsetFromA = {
    A: 0,
    'A#': 1,
    B: 2,
    C: 3,
    'C#': 4,
    D: 5,
    'D#': 6,
    E: 7,
    F: 8,
    'F#': 9,
    G: 10,
    'G#': 11,
  }

  return (
    bandStartMidi[band] +
    offsetFromA[note]
  )
}

export const SONGS =
  BASE_SONGS.map(song => {
    const verified =
      verifiedRangeMap.get(
        `${song.artist}\u0000${song.title}`
      )

    if (!verified) {
      return song
    }

    const minMidi =
      pitchLabelToMidi(
        verified.lowLabel
      )

    const maxMidi =
      pitchLabelToMidi(
        verified.highLabel
      )

    return {
      ...song,
      ...verified,
      minMidi,
      maxMidi,
      lowMidi: minMidi,
      highMidi: maxMidi,
      low: minMidi,
      high: maxMidi,
      catalogOnly: false,
      sourceType: '出典確認済み音域',
    }
  })
