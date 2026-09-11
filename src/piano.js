import * as Tone from 'tone'

let pianoSampler = null
let pianoLoaded = false

export function createPianoSampler() {
  if (pianoSampler) return

  pianoSampler = new Tone.Sampler({
    urls: {
      A0: 'A0.mp3', C1: 'C1.mp3', 'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3', A1: 'A1.mp3',
      C2: 'C2.mp3', 'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3', A2: 'A2.mp3',
      C3: 'C3.mp3', 'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3', A3: 'A3.mp3',
      C4: 'C4.mp3', 'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3', A4: 'A4.mp3',
      C5: 'C5.mp3', 'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3', A5: 'A5.mp3',
      C6: 'C6.mp3', 'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3', A6: 'A6.mp3',
      C7: 'C7.mp3',
    },
    release: 1.5,
    baseUrl: 'https://tonejs.github.io/audio/salamander/',
    onload: () => {
      pianoLoaded = true
      document.querySelector('#status').textContent = '🎹 ピアノ音源を読み込みました'
    },
  }).toDestination()
}

export async function playTone(frequency, { frequencyToMidi, midiToNoteName }) {
  try {
    await Tone.start()
    if (!pianoSampler) createPianoSampler()
    if (!pianoLoaded) {
      document.querySelector('#status').textContent = '🎹 ピアノ音源を読み込み中...'
      await Tone.loaded()
      pianoLoaded = true
    }
    const midi = Math.round(frequencyToMidi(frequency))
    pianoSampler.triggerAttackRelease(midiToNoteName(midi), 1.5)
  } catch (error) {
    console.error(error)
  }
}

export function initPiano({ frequencyToMidi, midiToNoteName, onPracticeNote }) {
  document.querySelectorAll('.piano-key').forEach(key => {
    key.addEventListener('click', async () => {
      const frequency = Number(key.dataset.frequency)
      const midi = Number(key.dataset.midi)
      await playTone(frequency, { frequencyToMidi, midiToNoteName })
      onPracticeNote?.(midi)
    })
  })
  return createPianoSampler()
}

export function highlightCurrentNote(midi) {
  clearCurrentNote()
  const key = document.querySelector(`[data-midi="${midi}"]`)
  if (key) key.classList.add('current-note')
}

export function clearCurrentNote() {
  document.querySelectorAll('.piano-key').forEach(key => key.classList.remove('current-note'))
}
