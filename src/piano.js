let toneModule = null
let toneModulePromise = null

let pianoSampler = null
let pianoSamplerPromise = null
let pianoLoaded = false

async function getTone() {
  if (toneModule) {
    return toneModule
  }

  if (!toneModulePromise) {
    toneModulePromise = import('tone')
  }

  toneModule = await toneModulePromise
  return toneModule
}

function setPianoStatus(message) {
  const status = document.querySelector('#status')
  if (status) {
    status.textContent = message
  }
}

export async function createPianoSampler() {
  if (pianoSampler) {
    return pianoSampler
  }

  if (pianoSamplerPromise) {
    return pianoSamplerPromise
  }

  pianoSamplerPromise = (async () => {
    const Tone = await getTone()

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
        setPianoStatus('🎹 ピアノ音源を読み込みました')
      },
    }).toDestination()

    return pianoSampler
  })()

  try {
    return await pianoSamplerPromise
  } catch (error) {
    pianoSamplerPromise = null
    throw error
  }
}

export async function playTone(frequency, { frequencyToMidi, midiToNoteName }) {
  try {
    setPianoStatus('🎹 ピアノ音源を読み込み中...')

    const Tone = await getTone()
    await Tone.start()

    if (!pianoSampler) {
      await createPianoSampler()
    }

    if (!pianoLoaded) {
      await Tone.loaded()
      pianoLoaded = true
      setPianoStatus('🎹 ピアノ音源を読み込みました')
    }

    const midi = Math.round(frequencyToMidi(frequency))
    pianoSampler.triggerAttackRelease(midiToNoteName(midi), 1.5)
  } catch (error) {
    console.error(error)
    setPianoStatus('ピアノ音源を読み込めませんでした')
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

  // 初回表示ではTone.jsやピアノ音源を読み込まない。
  // 鍵盤を初めて押したタイミングで必要なファイルだけ読み込み始める。
  setPianoStatus('🎹 鍵盤を押すとピアノ音源を読み込みます')
}

export function highlightCurrentNote(midi) {
  clearCurrentNote()
  const key = document.querySelector(`[data-midi="${midi}"]`)
  if (key) key.classList.add('current-note')
}

export function clearCurrentNote() {
  document.querySelectorAll('.piano-key').forEach(key => key.classList.remove('current-note'))
}
