import './style.css'
import * as Tone from 'tone'
import { SONGS } from './songs.js'

// ==========================================
// 基本設定
// ==========================================

const app = document.querySelector('#app')

const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B'
]

// C2 ～ C7
const START_MIDI = 36
const END_MIDI = 96

// 音を認定するまでの時間
const REQUIRED_STABLE_TIME = 250

// 認定可能な音程のズレ
const MAX_CENT_DEVIATION = 30

// 音程平滑化
const HISTORY_SIZE = 5

// グラフ
const GRAPH_SECONDS = 6
const GRAPH_RANGE = 6

// マイク感度
let micThreshold = 0.007

// ==========================================
// 音程変換
// ==========================================

function midiToNoteName(midi) {
  const name =
    NOTE_NAMES[((midi % 12) + 12) % 12]

  const octave =
    Math.floor(midi / 12) - 1

  return `${name}${octave}`
}

function midiToFrequency(midi) {
  return (
    440 *
    Math.pow(
      2,
      (midi - 69) / 12
    )
  )
}

function frequencyToMidi(frequency) {
  return (
    69 +
    12 *
      Math.log2(
        frequency / 440
      )
  )
}

function frequencyToCents(
  frequency,
  midi
) {
  const target =
    midiToFrequency(midi)

  return (
    1200 *
    Math.log2(
      frequency / target
    )
  )
}

function isBlackKey(midi) {
  return [
    1,
    3,
    6,
    8,
    10
  ].includes(
    ((midi % 12) + 12) % 12
  )
}

function formatKeyShift(shift) {
  if (shift === 0) {
    return '原キー'
  }

  if (shift > 0) {
    return `+${shift}`
  }

  return `${shift}`
}

// ==========================================
// ピアノ鍵盤データ
// ==========================================

const keys = []

for (
  let midi = START_MIDI;
  midi <= END_MIDI;
  midi++
) {
  keys.push({
    midi,
    name:
      midiToNoteName(midi),

    frequency:
      midiToFrequency(midi),

    black:
      isBlackKey(midi)
  })
}

const whiteKeys =
  keys.filter(
    key => !key.black
  )

const blackKeys =
  keys.filter(
    key => key.black
  )

// ==========================================
// HTML
// ==========================================

app.innerHTML = `
  <main class="container">

    <header class="app-header">

     <h1>🎤 キミキー</h1>

      <p class="subtitle">
        声の音程・音域・歌いやすいJ-POPをチェック
      </p>

    </header>


    <!-- 現在の音 -->

    <section class="pitch-card">

      <div
        id="noteDisplay"
        class="note-display"
      >
        ---
      </div>

      <div
        id="frequencyDisplay"
        class="frequency-display"
      >
        --- Hz
      </div>

      <div class="pitch-guide">

        <span>低い</span>

        <div class="pitch-meter">

          <div
            class="center-line"
          ></div>

          <div
            id="pitchIndicator"
            class="pitch-indicator"
          ></div>

        </div>

        <span>高い</span>

      </div>

      <div
        id="pitchMessage"
        class="pitch-message"
      >
        マイクを開始してください
      </div>

    </section>


    <!-- ピッチ練習 -->

    <section class="practice-card">

      <div class="practice-top">

        <div>

          <div class="practice-title">
            🎯 ピッチ練習
          </div>

          <div class="practice-subtitle">
            練習モードON後、鍵盤を押して目標音を設定
          </div>

        </div>

        <button
          id="practiceButton"
          class="practice-button"
        >
          練習モード OFF
        </button>

      </div>


      <div class="practice-result">

        <div class="practice-item">

          <span>
            目標
          </span>

          <strong id="targetNote">
            ---
          </strong>

        </div>


        <div class="practice-item">

          <span>
            現在
          </span>

          <strong
            id="practiceCurrentNote"
          >
            ---
          </strong>

        </div>


        <div class="practice-item">

          <span>
            差
          </span>

          <strong
            id="practiceCents"
          >
            ---
          </strong>

        </div>

      </div>


      <div
        id="practiceFeedback"
        class="practice-feedback"
      >
        練習モードをONにしてください
      </div>

    </section>


    <!-- 音程グラフ -->

    <section class="pitch-graph-card">

      <div class="graph-header">

        <div>

          <div class="graph-title">
            〰️ 声の音程
          </div>

          <div class="graph-description">
            縦が音の高さ・横が時間です
          </div>

        </div>

        <div
          id="graphCurrentNote"
          class="graph-current-note"
        >
          ---
        </div>

      </div>


      <div class="graph-wrapper">

        <canvas
          id="pitchCanvas"
        ></canvas>

      </div>


      <div class="graph-bottom">

        <span>
          ← 6秒前
        </span>

        <span>
          現在 →
        </span>

      </div>

    </section>


    <!-- マイク -->

    <section class="microphone-card">

      <div class="mic-title">
        🎤 マイク入力
      </div>

      <div class="volume-label-row">

        <span>
          入力音量
        </span>

        <span id="volumePercent">
          0%
        </span>

      </div>

      <div class="volume-meter">

        <div
          id="volumeBar"
          class="volume-bar"
        ></div>

      </div>


      <div class="sensitivity-row">

        <span>
          感度
        </span>

        <input
          id="sensitivitySlider"
          type="range"
          min="1"
          max="10"
          value="6"
          step="1"
        >

        <span id="sensitivityValue">
          6
        </span>

      </div>


      <p class="mic-help">
        声を拾いにくい場合は感度を高くしてください
      </p>

    </section>


    <!-- 音程安定ゲージ -->

    <section class="stable-card">

      <div class="stable-title">
        音の認定
      </div>

      <div class="stable-bar">

        <div
          id="stableProgress"
          class="stable-progress"
        ></div>

      </div>

      <div
        id="stableText"
        class="stable-text"
      >
        音域測定を開始すると認定ゲージが動きます
      </div>

    </section>


    <!-- オクターブ移動 -->

    <div class="octave-buttons">

      ${[2, 3, 4, 5, 6, 7]
        .map(
          octave => `
            <button
              class="octave-button"
              data-octave="${octave}"
            >
              C${octave}
            </button>
          `
        )
        .join('')}

    </div>


    <!-- ピアノ -->

    <section class="keyboard-section">

      <div
        id="keyboard"
        class="keyboard"
      >

        <div class="white-keys">

          ${whiteKeys
            .map(
              key => `
                <button
                  class="piano-key white-key"
                  data-midi="${key.midi}"
                  data-frequency="${key.frequency}"
                >
                  <span>
                    ${key.name}
                  </span>
                </button>
              `
            )
            .join('')}

        </div>


        <div class="black-keys">

          ${blackKeys
            .map(
              key => {

                const previousWhites =
                  keys.filter(
                    k =>
                      k.midi <
                        key.midi &&
                      !k.black
                  ).length

                const leftPercent =
                  (
                    previousWhites /
                    whiteKeys.length
                  ) *
                  100

                return `
                  <button
                    class="piano-key black-key"
                    data-midi="${key.midi}"
                    data-frequency="${key.frequency}"
                    style="left:${leftPercent}%"
                  >
                    <span>
                      ${key.name}
                    </span>
                  </button>
                `
              }
            )
            .join('')}

        </div>

      </div>

    </section>


    <!-- 鍵盤色の説明 -->

    <div class="range-legend">

      <span>
        <i class="legend-comfort"></i>
        快適
      </span>

      <span>
        <i class="legend-limit"></i>
        出せる
      </span>

      <span>
        <i class="legend-edge"></i>
        限界
      </span>

    </div>


    <!-- マイク開始 -->

    <button
      id="micButton"
      class="main-button"
    >
      🎤 マイク開始
    </button>


    <!-- 音域測定 -->

    <section class="range-measure-section">

      <h2>
        🎤 あなたの音域
      </h2>

      <p class="range-description">
        2種類の音域を測ると、曲とキーの判定がより正確になります
      </p>


      <button
        id="limitRangeButton"
        class="range-button"
      >
        🔥 限界音域を測定
      </button>

      <p class="button-description">
        頑張れば出せる最低音〜最高音を測定
      </p>


      <button
        id="comfortRangeButton"
        class="comfort-range-button"
      >
        😊 快適音域を測定
      </button>

      <p class="button-description">
        無理なく安定して歌える最低音〜最高音を測定
      </p>

    </section>


    <!-- 測定結果 -->

    <section class="range-card range-card-double">

      <div class="range-group limit-group">

        <div class="range-label">
          🔥 限界音域
        </div>

        <div class="range-values">

          <strong id="limitLowestNote">
            ---
          </strong>

          <span>
            〜
          </span>

          <strong id="limitHighestNote">
            ---
          </strong>

        </div>

        <p>
          頑張れば出せる範囲
        </p>

      </div>


      <div class="range-group comfort-group">

        <div class="range-label">
          😊 快適音域
        </div>

        <div class="range-values">

          <strong id="comfortLowestNote">
            ---
          </strong>

          <span>
            〜
          </span>

          <strong id="comfortHighestNote">
            ---
          </strong>

        </div>

        <p>
          無理なく安定して歌える範囲
        </p>

      </div>

    </section>


    <button
      id="resetRange"
      class="reset-button"
    >
      音域をリセット
    </button>


    <!-- おすすめ曲 -->

    <section class="song-section">

      <div class="section-heading">

        <span class="section-icon">
          🎵
        </span>

        <div>

          <h2>
            あなたに歌いやすいJ-POP
          </h2>

          <p>
            快適音域を優先しておすすめキーを計算します
          </p>

        </div>

      </div>


      <div
        id="rangeRequired"
        class="range-required"
      >
        まず音域を測定してください
      </div>


      <div
        id="recommendations"
        class="recommendations"
      ></div>

    </section>


    <!-- 曲検索 -->

    <section class="song-section">

      <div class="section-heading">

        <span class="section-icon">
          🔍
        </span>

        <div>

          <h2>
            歌いたい曲を調べる
          </h2>

          <p>
            曲名またはアーティスト名で検索
          </p>

        </div>

      </div>


      <input
        id="songSearch"
        class="song-search"
        type="text"
        placeholder="例：Pretender / Vaundy"
      >


      <div
        id="songSearchResults"
        class="song-search-results"
      ></div>

    </section>


    <!-- 曲診断 -->

    <section
      id="songAnalysisCard"
      class="song-analysis-card hidden"
    >

      <div class="analysis-label">
        選択した曲
      </div>

      <h2 id="analysisTitle">
        ---
      </h2>

      <div
        id="analysisArtist"
        class="analysis-artist"
      >
        ---
      </div>


      <div class="analysis-grid">

        <div>

          <span>
            原曲音域
          </span>

          <strong id="originalRange">
            ---
          </strong>

        </div>


        <div>

          <span>
            おすすめキー
          </span>

          <strong
            id="recommendedKey"
            class="key-result"
          >
            ---
          </strong>

        </div>


        <div>

          <span>
            変更後
          </span>

          <strong id="shiftedRange">
            ---
          </strong>

        </div>

      </div>


      <div
        id="keyJudgement"
        class="key-judgement"
      ></div>


      <button
        id="practiceSongKey"
        class="song-practice-button"
      >
        🎹 このキーで最高音を練習
      </button>

    </section>


    <p
      id="status"
      class="status"
    >
      ピアノ音源を読み込んでいます...
    </p>

  </main>
`

// ==========================================
// 状態
// ==========================================

let audioContext = null
let analyser = null
let microphone = null
let stream = null

let running = false
let animationId = null

// 音域測定モード
// null / limit / comfort
let measuringMode = null

// 限界音域
let limitLowestMidi = null
let limitHighestMidi = null

// 快適音域
let comfortLowestMidi = null
let comfortHighestMidi = null

// 認定処理
let candidateMidi = null
let candidateStartTime = null

const confirmedNotes =
  new Set()

let lastValidPitchTime = 0

const frequencyHistory = []

// ピアノ
let pianoSampler = null
let pianoLoaded = false

// 練習
let practiceMode = false
let targetMidi = null

// 曲
let selectedSong = null
let selectedSongAnalysis = null

// ==========================================
// 音域があるか
// ==========================================

function hasLimitRange() {
  return (
    limitLowestMidi !== null &&
    limitHighestMidi !== null
  )
}

function hasComfortRange() {
  return (
    comfortLowestMidi !== null &&
    comfortHighestMidi !== null
  )
}

function hasAnyRange() {
  return (
    hasLimitRange() ||
    hasComfortRange()
  )
}

// ==========================================
// おすすめキー計算
// ==========================================

function calculateSongKey(song) {
  if (!hasAnyRange()) {
    return null
  }

  // 快適音域があれば快適音域を最優先
  const targetLow =
    hasComfortRange()
      ? comfortLowestMidi
      : limitLowestMidi

  const targetHigh =
    hasComfortRange()
      ? comfortHighestMidi
      : limitHighestMidi

  const targetCenter =
    (
      targetLow +
      targetHigh
    ) / 2

  let best = null

  // カラオケで使いやすい範囲
  for (
    let shift = -6;
    shift <= 6;
    shift++
  ) {
    const shiftedLow =
      song.lowestMidi +
      shift

    const shiftedHigh =
      song.highestMidi +
      shift

    // 快適音域からはみ出した量
    const lowOverflow =
      Math.max(
        0,
        targetLow -
          shiftedLow
      )

    const highOverflow =
      Math.max(
        0,
        shiftedHigh -
          targetHigh
      )

    const overflow =
      lowOverflow +
      highOverflow

    const shiftedCenter =
      (
        shiftedLow +
        shiftedHigh
      ) / 2

    const centerDistance =
      Math.abs(
        shiftedCenter -
        targetCenter
      )

    const fitsComfort =
      hasComfortRange() &&
      shiftedLow >=
        comfortLowestMidi &&
      shiftedHigh <=
        comfortHighestMidi

    const fitsLimit =
      hasLimitRange() &&
      shiftedLow >=
        limitLowestMidi &&
      shiftedHigh <=
        limitHighestMidi

    // 高音側を少し重く評価
    const score =
      lowOverflow * 100 +
      highOverflow * 140 +
      centerDistance * 2 +
      Math.abs(shift) * 0.25

    if (
      best === null ||
      score < best.score
    ) {
      best = {
        shift,
        shiftedLow,
        shiftedHigh,
        lowOverflow,
        highOverflow,
        overflow,
        fitsComfort,
        fitsLimit,
        score
      }
    }
  }

  return best
}

function getSongStars(result) {
  if (!result) {
    return 0
  }

  if (
    result.fitsComfort &&
    Math.abs(
      result.shift
    ) <= 1
  ) {
    return 5
  }

  if (result.fitsComfort) {
    return 4
  }

  if (result.fitsLimit) {
    return 3
  }

  if (
    result.overflow <= 2
  ) {
    return 2
  }

  return 1
}

function starText(number) {
  return (
    '★'.repeat(number) +
    '☆'.repeat(
      5 - number
    )
  )
}

// ==========================================
// おすすめ曲表示
// ==========================================

function renderRecommendations() {
  const container =
    document.querySelector(
      '#recommendations'
    )

  const required =
    document.querySelector(
      '#rangeRequired'
    )

  container.innerHTML = ''

  if (!hasAnyRange()) {
    required.classList.remove(
      'hidden'
    )

    return
  }

  required.classList.add(
    'hidden'
  )

  const analysed =
    SONGS.map(song => {
      const result =
        calculateSongKey(song)

      return {
        song,
        result,
        stars:
          getSongStars(result)
      }
    })

  analysed.sort(
    (a, b) => {
      if (
        b.stars !==
        a.stars
      ) {
        return (
          b.stars -
          a.stars
        )
      }

      return (
        a.result.score -
        b.result.score
      )
    }
  )

  analysed.forEach(
    ({
      song,
      result,
      stars
    }) => {
      const card =
        document.createElement(
          'button'
        )

      card.className =
        'song-card'

      let badgeText =
        '音域ベース'

      if (
        result.fitsComfort
      ) {
        badgeText =
          '快適音域に収まる'
      } else if (
        result.fitsLimit
      ) {
        badgeText =
          '限界音域に収まる'
      } else {
        badgeText =
          '一部音域外'
      }

      card.innerHTML = `
        <div class="song-card-main">

          <strong>
            ${song.title}
          </strong>

          <span>
            ${song.artist}
          </span>

          <small>
            ${badgeText}
          </small>

        </div>

        <div class="song-card-right">

          <div class="stars">
            ${starText(stars)}
          </div>

          <strong class="mini-key">
            ${formatKeyShift(
              result.shift
            )}
          </strong>

        </div>
      `

      card.addEventListener(
        'click',
        () => {
          showSongAnalysis(
            song
          )
        }
      )

      container.appendChild(
        card
      )
    }
  )
}

// ==========================================
// 曲検索
// ==========================================

function renderSearchResults(
  searchText = ''
) {
  const container =
    document.querySelector(
      '#songSearchResults'
    )

  container.innerHTML = ''

  const query =
    searchText
      .trim()
      .toLowerCase()

  let results = SONGS

  if (query) {
    results =
      SONGS.filter(song => {
        return (
          song.title
            .toLowerCase()
            .includes(query) ||
          song.artist
            .toLowerCase()
            .includes(query)
        )
      })
  }

  if (
    results.length === 0
  ) {
    container.innerHTML = `
      <div class="no-song">
        曲が見つかりません
      </div>
    `

    return
  }

  results.forEach(song => {
    const item =
      document.createElement(
        'button'
      )

    item.className =
      'search-song-item'

    item.innerHTML = `
      <div>

        <strong>
          ${song.title}
        </strong>

        <span>
          ${song.artist}
        </span>

      </div>

      <span class="search-arrow">
        ›
      </span>
    `

    item.addEventListener(
      'click',
      () => {
        showSongAnalysis(
          song
        )
      }
    )

    container.appendChild(
      item
    )
  })
}

document.querySelector(
  '#songSearch'
).addEventListener(
  'input',
  event => {
    renderSearchResults(
      event.target.value
    )
  }
)

// ==========================================
// 曲分析
// ==========================================

function showSongAnalysis(song) {
  selectedSong = song

  const card =
    document.querySelector(
      '#songAnalysisCard'
    )

  card.classList.remove(
    'hidden'
  )

  document.querySelector(
    '#analysisTitle'
  ).textContent =
    song.title

  document.querySelector(
    '#analysisArtist'
  ).textContent =
    song.artist

  document.querySelector(
    '#originalRange'
  ).textContent =
    `${midiToNoteName(
      song.lowestMidi
    )} 〜 ${midiToNoteName(
      song.highestMidi
    )}`

  const keyElement =
    document.querySelector(
      '#recommendedKey'
    )

  const shiftedElement =
    document.querySelector(
      '#shiftedRange'
    )

  const judgement =
    document.querySelector(
      '#keyJudgement'
    )

  if (!hasAnyRange()) {
    selectedSongAnalysis =
      null

    keyElement.textContent =
      '---'

    shiftedElement.textContent =
      '---'

    judgement.className =
      'key-judgement warning'

    judgement.textContent =
      '先にあなたの音域を測定してください'

    card.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })

    return
  }

  const result =
    calculateSongKey(song)

  selectedSongAnalysis =
    result

  keyElement.textContent =
    formatKeyShift(
      result.shift
    )

  shiftedElement.textContent =
    `${midiToNoteName(
      result.shiftedLow
    )} 〜 ${midiToNoteName(
      result.shiftedHigh
    )}`

  if (
    result.fitsComfort
  ) {
    judgement.className =
      'key-judgement good'

    if (
      result.shift === 0
    ) {
      judgement.textContent =
        '✓ 原キーで快適音域に収まります。かなり歌いやすい候補です。'
    } else {
      judgement.textContent =
        `✓ キー${formatKeyShift(
          result.shift
        )}なら快適音域に収まります。`
    }
  } else if (
    result.fitsLimit
  ) {
    judgement.className =
      'key-judgement caution'

    judgement.textContent =
      `△ キー${formatKeyShift(
        result.shift
      )}なら限界音域には収まりますが、一部きつく感じる可能性があります。`
  } else {
    judgement.className =
      'key-judgement warning'

    if (
      result.highOverflow >
      result.lowOverflow
    ) {
      judgement.textContent =
        `高音側が約${result.highOverflow}半音ほど厳しいです。キー${formatKeyShift(
          result.shift
        )}が最も近い候補です。`
    } else if (
      result.lowOverflow > 0
    ) {
      judgement.textContent =
        `低音側が約${result.lowOverflow}半音ほど厳しいです。キー${formatKeyShift(
          result.shift
        )}が最も近い候補です。`
    } else {
      judgement.textContent =
        `キー${formatKeyShift(
          result.shift
        )}が最も歌いやすい候補です。`
    }
  }

  card.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
}

// ==========================================
// 曲の最高音を練習
// ==========================================

document.querySelector(
  '#practiceSongKey'
).addEventListener(
  'click',
  async () => {
    if (
      !selectedSong ||
      !selectedSongAnalysis
    ) {
      document.querySelector(
        '#status'
      ).textContent =
        '先に音域を測定して曲を選択してください'

      return
    }

    practiceMode = true

    const button =
      document.querySelector(
        '#practiceButton'
      )

    button.textContent =
      '練習モード ON'

    button.classList.add(
      'active'
    )

    const practiceMidi =
      selectedSong.highestMidi +
      selectedSongAnalysis.shift

    setTargetNote(
      practiceMidi
    )

    await playTone(
      midiToFrequency(
        practiceMidi
      )
    )

    document.querySelector(
      '#practiceFeedback'
    ).textContent =
      `${selectedSong.title}の最高音 ${midiToNoteName(
        practiceMidi
      )} を練習してみましょう`

    document.querySelector(
      '.practice-card'
    ).scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }
)

// ==========================================
// グラフ
// ==========================================

const pitchCanvas =
  document.querySelector(
    '#pitchCanvas'
  )

const canvasContext =
  pitchCanvas.getContext(
    '2d'
  )

const pitchHistory = []

let graphCenterMidi = 60

function resizeCanvas() {
  const rect =
    pitchCanvas
      .getBoundingClientRect()

  const dpr =
    window.devicePixelRatio ||
    1

  pitchCanvas.width =
    Math.round(
      rect.width * dpr
    )

  pitchCanvas.height =
    Math.round(
      rect.height * dpr
    )

  canvasContext.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  )

  drawPitchGraph()
}

window.addEventListener(
  'resize',
  resizeCanvas
)

function trimPitchHistory() {
  const oldest =
    performance.now() -
    GRAPH_SECONDS *
      1000

  while (
    pitchHistory.length >
      0 &&
    pitchHistory[0].time <
      oldest
  ) {
    pitchHistory.shift()
  }
}

function addPitchPoint(
  frequency
) {
  const now =
    performance.now()

  const midi =
    frequencyToMidi(
      frequency
    )

  pitchHistory.push({
    time: now,
    midi
  })

  trimPitchHistory()

  if (
    practiceMode &&
    targetMidi !== null
  ) {
    graphCenterMidi =
      targetMidi
  } else {
    // 急にグラフが動きすぎないよう少し滑らかに
    graphCenterMidi =
      graphCenterMidi *
        0.85 +
      midi * 0.15
  }

  document.querySelector(
    '#graphCurrentNote'
  ).textContent =
    midiToNoteName(
      Math.round(midi)
    )
}

function addGraphGap() {
  trimPitchHistory()

  const now =
    performance.now()

  const last =
    pitchHistory[
      pitchHistory.length -
        1
    ]

  if (
    !last ||
    last.midi !== null
  ) {
    pitchHistory.push({
      time: now,
      midi: null
    })
  }
}

function drawPitchGraph() {
  trimPitchHistory()

  const rect =
    pitchCanvas
      .getBoundingClientRect()

  const width =
    rect.width

  const height =
    rect.height

  if (
    width <= 0 ||
    height <= 0
  ) {
    return
  }

  canvasContext.clearRect(
    0,
    0,
    width,
    height
  )

  const labelWidth = 48
  const rightPadding = 10
  const topPadding = 12
  const bottomPadding = 12

  const graphLeft =
    labelWidth

  const graphRight =
    width -
    rightPadding

  const graphTop =
    topPadding

  const graphBottom =
    height -
    bottomPadding

  const graphHeight =
    graphBottom -
    graphTop

  const graphWidth =
    graphRight -
    graphLeft

  canvasContext.fillStyle =
    '#fafbfc'

  canvasContext.fillRect(
    graphLeft,
    graphTop,
    graphWidth,
    graphHeight
  )

  const minMidi =
    Math.floor(
      graphCenterMidi -
      GRAPH_RANGE
    )

  const maxMidi =
    Math.ceil(
      graphCenterMidi +
      GRAPH_RANGE
    )

  // 音程ライン
  for (
    let midi = minMidi;
    midi <= maxMidi;
    midi++
  ) {
    const ratio =
      (maxMidi - midi) /
      (maxMidi - minMidi)

    const y =
      graphTop +
      ratio *
        graphHeight

    const isC =
      midi % 12 === 0

    canvasContext.beginPath()

    canvasContext.strokeStyle =
      isC
        ? '#c7cbd1'
        : '#e7e9ed'

    canvasContext.lineWidth =
      isC ? 1.5 : 1

    canvasContext.moveTo(
      graphLeft,
      y
    )

    canvasContext.lineTo(
      graphRight,
      y
    )

    canvasContext.stroke()

    canvasContext.fillStyle =
      isC
        ? '#36383d'
        : '#858991'

    canvasContext.font =
      isC
        ? 'bold 11px Arial'
        : '10px Arial'

    canvasContext.textAlign =
      'right'

    canvasContext.textBaseline =
      'middle'

    canvasContext.fillText(
      midiToNoteName(midi),
      graphLeft - 7,
      y
    )
  }

  // 練習目標ライン
  if (
    practiceMode &&
    targetMidi !== null &&
    targetMidi >= minMidi &&
    targetMidi <= maxMidi
  ) {
    const ratio =
      (
        maxMidi -
        targetMidi
      ) /
      (
        maxMidi -
        minMidi
      )

    const y =
      graphTop +
      ratio *
        graphHeight

    canvasContext.save()

    canvasContext.beginPath()

    canvasContext.setLineDash([
      8,
      6
    ])

    canvasContext.strokeStyle =
      '#7c4dff'

    canvasContext.lineWidth = 3

    canvasContext.moveTo(
      graphLeft,
      y
    )

    canvasContext.lineTo(
      graphRight,
      y
    )

    canvasContext.stroke()

    canvasContext.setLineDash(
      []
    )

    canvasContext.fillStyle =
      '#7c4dff'

    canvasContext.font =
      'bold 11px Arial'

    canvasContext.textAlign =
      'left'

    canvasContext.textBaseline =
      'bottom'

    canvasContext.fillText(
      `TARGET ${midiToNoteName(
        targetMidi
      )}`,
      graphLeft + 6,
      y - 5
    )

    canvasContext.restore()
  }

  // 声の線
  const now =
    performance.now()

  const startTime =
    now -
    GRAPH_SECONDS *
      1000

  let segment = []

  function drawSegment() {
    if (
      segment.length <
      2
    ) {
      segment = []
      return
    }

    canvasContext.beginPath()

    canvasContext.strokeStyle =
      '#27ae60'

    canvasContext.lineWidth =
      3

    canvasContext.lineJoin =
      'round'

    canvasContext.lineCap =
      'round'

    segment.forEach(
      (point, index) => {
        if (
          index === 0
        ) {
          canvasContext.moveTo(
            point.x,
            point.y
          )
        } else {
          canvasContext.lineTo(
            point.x,
            point.y
          )
        }
      }
    )

    canvasContext.stroke()

    segment = []
  }

  let previousTime = null

  for (
    const point of
      pitchHistory
  ) {
    if (
      point.midi === null
    ) {
      drawSegment()

      previousTime =
        null

      continue
    }

    if (
      point.midi <
        minMidi - 1 ||
      point.midi >
        maxMidi + 1
    ) {
      drawSegment()

      previousTime =
        null

      continue
    }

    if (
      previousTime !==
        null &&
      point.time -
        previousTime >
        250
    ) {
      drawSegment()
    }

    const xRatio =
      (
        point.time -
        startTime
      ) /
      (
        GRAPH_SECONDS *
        1000
      )

    const x =
      graphLeft +
      xRatio *
        graphWidth

    const yRatio =
      (
        maxMidi -
        point.midi
      ) /
      (
        maxMidi -
        minMidi
      )

    const y =
      graphTop +
      yRatio *
        graphHeight

    segment.push({
      x,
      y
    })

    previousTime =
      point.time
  }

  drawSegment()

  // 現在位置の丸
  const validPoints =
    pitchHistory.filter(
      point =>
        point.midi !== null
    )

  const latestPoint =
    validPoints[
      validPoints.length -
        1
    ]

  if (
    latestPoint &&
    now -
      latestPoint.time <
      300 &&
    latestPoint.midi >=
      minMidi &&
    latestPoint.midi <=
      maxMidi
  ) {
    const yRatio =
      (
        maxMidi -
        latestPoint.midi
      ) /
      (
        maxMidi -
        minMidi
      )

    const y =
      graphTop +
      yRatio *
        graphHeight

    canvasContext.beginPath()

    canvasContext.arc(
      graphRight - 4,
      y,
      7,
      0,
      Math.PI * 2
    )

    canvasContext.fillStyle =
      '#111'

    canvasContext.fill()

    canvasContext.beginPath()

    canvasContext.arc(
      graphRight - 4,
      y,
      3,
      0,
      Math.PI * 2
    )

    canvasContext.fillStyle =
      '#fff'

    canvasContext.fill()
  }
}

function graphLoop() {
  drawPitchGraph()

  requestAnimationFrame(
    graphLoop
  )
}

// ==========================================
// 練習モード
// ==========================================

function updateTargetKey() {
  document.querySelectorAll(
    '.piano-key'
  ).forEach(key => {
    key.classList.remove(
      'target-note'
    )
  })

  if (
    !practiceMode ||
    targetMidi === null
  ) {
    return
  }

  const key =
    document.querySelector(
      `[data-midi="${targetMidi}"]`
    )

  if (key) {
    key.classList.add(
      'target-note'
    )
  }
}

function setTargetNote(midi) {
  targetMidi = midi

  graphCenterMidi =
    midi

  document.querySelector(
    '#targetNote'
  ).textContent =
    midiToNoteName(midi)

  document.querySelector(
    '#practiceFeedback'
  ).textContent =
    `${midiToNoteName(
      midi
    )} を声で出してみましょう`

  document.querySelector(
    '#practiceFeedback'
  ).className =
    'practice-feedback'

  updateTargetKey()
}

function updatePractice(
  frequency
) {
  if (
    !practiceMode ||
    targetMidi === null
  ) {
    return
  }

  const exactMidi =
    frequencyToMidi(
      frequency
    )

  const currentMidi =
    Math.round(
      exactMidi
    )

  const differenceCents =
    (
      exactMidi -
      targetMidi
    ) *
    100

  document.querySelector(
    '#practiceCurrentNote'
  ).textContent =
    midiToNoteName(
      currentMidi
    )

  const rounded =
    Math.round(
      differenceCents
    )

  document.querySelector(
    '#practiceCents'
  ).textContent =
    rounded > 0
      ? `+${rounded}`
      : `${rounded}`

  const feedback =
    document.querySelector(
      '#practiceFeedback'
    )

  const abs =
    Math.abs(
      differenceCents
    )

  if (abs <= 5) {
    feedback.textContent =
      'PERFECT! 🎉'

    feedback.className =
      'practice-feedback perfect'
  } else if (
    abs <= 10
  ) {
    feedback.textContent =
      'GOOD! ✓'

    feedback.className =
      'practice-feedback good'
  } else if (
    differenceCents <
    0
  ) {
    feedback.textContent =
      'もう少し高く ↑'

    feedback.className =
      'practice-feedback adjust'
  } else {
    feedback.textContent =
      'もう少し低く ↓'

    feedback.className =
      'practice-feedback adjust'
  }
}

document.querySelector(
  '#practiceButton'
).addEventListener(
  'click',
  () => {
    practiceMode =
      !practiceMode

    const button =
      document.querySelector(
        '#practiceButton'
      )

    if (practiceMode) {
      button.textContent =
        '練習モード ON'

      button.classList.add(
        'active'
      )

      document.querySelector(
        '#practiceFeedback'
      ).textContent =
        '鍵盤から練習したい音を選んでください'
    } else {
      button.textContent =
        '練習モード OFF'

      button.classList.remove(
        'active'
      )

      targetMidi = null

      document.querySelector(
        '#targetNote'
      ).textContent = '---'

      document.querySelector(
        '#practiceCurrentNote'
      ).textContent = '---'

      document.querySelector(
        '#practiceCents'
      ).textContent = '---'

      document.querySelector(
        '#practiceFeedback'
      ).textContent =
        '練習モードをONにしてください'

      document.querySelector(
        '#practiceFeedback'
      ).className =
        'practice-feedback'

      updateTargetKey()
    }
  }
)

// ==========================================
// マイク感度
// ==========================================

function updateSensitivity(
  value
) {
  const sensitivity =
    Number(value)

  document.querySelector(
    '#sensitivityValue'
  ).textContent =
    sensitivity

  const thresholds = {
    1: 0.025,
    2: 0.020,
    3: 0.016,
    4: 0.012,
    5: 0.009,
    6: 0.007,
    7: 0.0055,
    8: 0.004,
    9: 0.003,
    10: 0.002
  }

  micThreshold =
    thresholds[
      sensitivity
    ]
}

document.querySelector(
  '#sensitivitySlider'
).addEventListener(
  'input',
  event => {
    updateSensitivity(
      event.target.value
    )
  }
)

updateSensitivity(6)

// ==========================================
// ピアノ音源
// ==========================================

function createPianoSampler() {
  if (pianoSampler) {
    return
  }

  pianoSampler =
    new Tone.Sampler({
      urls: {
        A0: 'A0.mp3',

        C1: 'C1.mp3',
        'D#1': 'Ds1.mp3',
        'F#1': 'Fs1.mp3',
        A1: 'A1.mp3',

        C2: 'C2.mp3',
        'D#2': 'Ds2.mp3',
        'F#2': 'Fs2.mp3',
        A2: 'A2.mp3',

        C3: 'C3.mp3',
        'D#3': 'Ds3.mp3',
        'F#3': 'Fs3.mp3',
        A3: 'A3.mp3',

        C4: 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
        A4: 'A4.mp3',

        C5: 'C5.mp3',
        'D#5': 'Ds5.mp3',
        'F#5': 'Fs5.mp3',
        A5: 'A5.mp3',

        C6: 'C6.mp3',
        'D#6': 'Ds6.mp3',
        'F#6': 'Fs6.mp3',
        A6: 'A6.mp3',

        C7: 'C7.mp3'
      },

      release: 1.5,

      baseUrl:
        'https://tonejs.github.io/audio/salamander/',

      onload: () => {
        pianoLoaded = true

        document.querySelector(
          '#status'
        ).textContent =
          '🎹 ピアノ音源を読み込みました'
      }
    }).toDestination()
}

async function playTone(
  frequency
) {
  try {
    await Tone.start()

    if (!pianoSampler) {
      createPianoSampler()
    }

    if (!pianoLoaded) {
      document.querySelector(
        '#status'
      ).textContent =
        '🎹 ピアノ音源を読み込み中...'

      await Tone.loaded()

      pianoLoaded = true
    }

    const midi =
      Math.round(
        frequencyToMidi(
          frequency
        )
      )

    pianoSampler
      .triggerAttackRelease(
        midiToNoteName(
          midi
        ),
        1.5
      )
  } catch (error) {
    console.error(error)
  }
}

// ==========================================
// 鍵盤操作
// ==========================================

document.querySelectorAll(
  '.piano-key'
).forEach(key => {
  key.addEventListener(
    'click',
    async () => {
      const frequency =
        Number(
          key.dataset.frequency
        )

      const midi =
        Number(
          key.dataset.midi
        )

      await playTone(
        frequency
      )

      if (practiceMode) {
        setTargetNote(
          midi
        )
      }
    }
  )
})

// ==========================================
// オクターブボタン
// ==========================================

document.querySelectorAll(
  '.octave-button'
).forEach(button => {
  button.addEventListener(
    'click',
    () => {
      const octave =
        Number(
          button.dataset.octave
        )

      const midi =
        12 *
        (octave + 1)

      const key =
        document.querySelector(
          `[data-midi="${midi}"]`
        )

      if (key) {
        key.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        })
      }
    }
  )
})

// ==========================================
// マイク音量
// ==========================================

function calculateRms(
  buffer
) {
  let sum = 0

  for (
    let i = 0;
    i < buffer.length;
    i++
  ) {
    sum +=
      buffer[i] *
      buffer[i]
  }

  return Math.sqrt(
    sum /
    buffer.length
  )
}

function updateVolumeMeter(
  rms
) {
  let percent =
    rms * 800

  percent =
    Math.max(
      0,
      Math.min(
        100,
        percent
      )
    )

  document.querySelector(
    '#volumeBar'
  ).style.width =
    `${percent}%`

  document.querySelector(
    '#volumePercent'
  ).textContent =
    `${Math.round(
      percent
    )}%`
}

// ==========================================
// YIN 音程検出
// ==========================================

function yinPitchDetection(
  buffer,
  sampleRate
) {
  const rms =
    calculateRms(
      buffer
    )

  if (
    rms <
    micThreshold
  ) {
    return -1
  }

  const threshold = 0.12

  const minFrequency = 60
  const maxFrequency = 1600

  const minTau =
    Math.floor(
      sampleRate /
      maxFrequency
    )

  const maxTau =
    Math.min(
      Math.floor(
        sampleRate /
        minFrequency
      ),
      Math.floor(
        buffer.length /
        2
      )
    )

  const yinBuffer =
    new Float32Array(
      maxTau + 1
    )

  for (
    let tau = 1;
    tau <= maxTau;
    tau++
  ) {
    let sum = 0

    for (
      let i = 0;
      i <
      buffer.length -
        tau;
      i++
    ) {
      const delta =
        buffer[i] -
        buffer[
          i + tau
        ]

      sum +=
        delta *
        delta
    }

    yinBuffer[tau] =
      sum
  }

  yinBuffer[0] = 1

  let runningSum = 0

  for (
    let tau = 1;
    tau <= maxTau;
    tau++
  ) {
    runningSum +=
      yinBuffer[tau]

    yinBuffer[tau] =
      runningSum === 0
        ? 1
        : (
            yinBuffer[tau] *
            tau
          ) /
          runningSum
  }

  let tauEstimate = -1

  for (
    let tau = minTau;
    tau < maxTau;
    tau++
  ) {
    if (
      yinBuffer[tau] <
      threshold
    ) {
      while (
        tau + 1 <
          maxTau &&
        yinBuffer[
          tau + 1
        ] <
          yinBuffer[tau]
      ) {
        tau++
      }

      tauEstimate = tau

      break
    }
  }

  if (
    tauEstimate === -1
  ) {
    return -1
  }

  let betterTau =
    tauEstimate

  if (
    tauEstimate > 1 &&
    tauEstimate + 1 <
      yinBuffer.length
  ) {
    const s0 =
      yinBuffer[
        tauEstimate - 1
      ]

    const s1 =
      yinBuffer[
        tauEstimate
      ]

    const s2 =
      yinBuffer[
        tauEstimate + 1
      ]

    const denominator =
      2 *
      (
        2 * s1 -
        s2 -
        s0
      )

    if (
      denominator !== 0
    ) {
      betterTau =
        tauEstimate +
        (
          s2 -
          s0
        ) /
        denominator
    }
  }

  const frequency =
    sampleRate /
    betterTau

  if (
    frequency <
      minFrequency ||
    frequency >
      maxFrequency
  ) {
    return -1
  }

  return frequency
}

// ==========================================
// 音程平滑化
// ==========================================

function getSmoothedFrequency(
  frequency
) {
  frequencyHistory.push(
    frequency
  )

  if (
    frequencyHistory.length >
    HISTORY_SIZE
  ) {
    frequencyHistory.shift()
  }

  const sorted =
    [
      ...frequencyHistory
    ].sort(
      (a, b) =>
        a - b
    )

  return sorted[
    Math.floor(
      sorted.length / 2
    )
  ]
}

// ==========================================
// 鍵盤の現在音
// ==========================================

function clearCurrentNote() {
  document.querySelectorAll(
    '.piano-key'
  ).forEach(key => {
    key.classList.remove(
      'current-note'
    )
  })
}

function highlightCurrentNote(
  midi
) {
  clearCurrentNote()

  const key =
    document.querySelector(
      `[data-midi="${midi}"]`
    )

  if (key) {
    key.classList.add(
      'current-note'
    )
  }
}

// ==========================================
// 限界・快適音域を鍵盤表示
// ==========================================

function updateRangeKeys() {
  document.querySelectorAll(
    '.piano-key'
  ).forEach(key => {
    key.classList.remove(
      'in-limit-range',
      'in-comfort-range',
      'limit-edge'
    )

    const midi =
      Number(
        key.dataset.midi
      )

    // 限界音域
    if (
      hasLimitRange() &&
      midi >=
        limitLowestMidi &&
      midi <=
        limitHighestMidi
    ) {
      key.classList.add(
        'in-limit-range'
      )
    }

    // 快適音域
    if (
      hasComfortRange() &&
      midi >=
        comfortLowestMidi &&
      midi <=
        comfortHighestMidi
    ) {
      key.classList.add(
        'in-comfort-range'
      )
    }

    // 限界の端
    if (
      hasLimitRange() &&
      (
        midi ===
          limitLowestMidi ||
        midi ===
          limitHighestMidi
      )
    ) {
      key.classList.add(
        'limit-edge'
      )
    }
  })
}

// ==========================================
// 安定ゲージ
// ==========================================

function updateStableProgress(
  progress,
  text
) {
  const safeProgress =
    Math.max(
      0,
      Math.min(
        100,
        progress
      )
    )

  document.querySelector(
    '#stableProgress'
  ).style.width =
    `${safeProgress}%`

  document.querySelector(
    '#stableText'
  ).textContent =
    text
}

// ==========================================
// 音域認定
// ==========================================

function recordRange(
  midi,
  cents
) {
  if (!measuringMode) {
    candidateMidi = null
    candidateStartTime =
      null

    return
  }

  if (
    midi < START_MIDI ||
    midi > END_MIDI
  ) {
    return
  }

  if (
    Math.abs(cents) >
    MAX_CENT_DEVIATION
  ) {
    candidateMidi = null
    candidateStartTime =
      null

    updateStableProgress(
      0,
      `${midiToNoteName(
        midi
      )}：音程を安定させてください`
    )

    return
  }

  const now =
    performance.now()

  if (
    candidateMidi !==
    midi
  ) {
    candidateMidi = midi

    candidateStartTime =
      now

    updateStableProgress(
      0,
      `${midiToNoteName(
        midi
      )} を判定中`
    )

    return
  }

  const stableTime =
    now -
    candidateStartTime

  const progress =
    (
      stableTime /
      REQUIRED_STABLE_TIME
    ) *
    100

  updateStableProgress(
    progress,
    `${midiToNoteName(
      midi
    )} を判定中`
  )

  if (
    stableTime <
    REQUIRED_STABLE_TIME
  ) {
    return
  }

  const noteKey =
    `${measuringMode}-${midi}`

  if (
    confirmedNotes.has(
      noteKey
    )
  ) {
    updateStableProgress(
      100,
      `${midiToNoteName(
        midi
      )} 認定済み ✓`
    )

    return
  }

  confirmedNotes.add(
    noteKey
  )

  // 限界音域
  if (
    measuringMode ===
    'limit'
  ) {
    if (
      limitLowestMidi ===
        null ||
      midi <
        limitLowestMidi
    ) {
      limitLowestMidi =
        midi
    }

    if (
      limitHighestMidi ===
        null ||
      midi >
        limitHighestMidi
    ) {
      limitHighestMidi =
        midi
    }

    document.querySelector(
      '#limitLowestNote'
    ).textContent =
      midiToNoteName(
        limitLowestMidi
      )

    document.querySelector(
      '#limitHighestNote'
    ).textContent =
      midiToNoteName(
        limitHighestMidi
      )
  }

  // 快適音域
  if (
    measuringMode ===
    'comfort'
  ) {
    if (
      comfortLowestMidi ===
        null ||
      midi <
        comfortLowestMidi
    ) {
      comfortLowestMidi =
        midi
    }

    if (
      comfortHighestMidi ===
        null ||
      midi >
        comfortHighestMidi
    ) {
      comfortHighestMidi =
        midi
    }

    document.querySelector(
      '#comfortLowestNote'
    ).textContent =
      midiToNoteName(
        comfortLowestMidi
      )

    document.querySelector(
      '#comfortHighestNote'
    ).textContent =
      midiToNoteName(
        comfortHighestMidi
      )
  }

  updateRangeKeys()

  updateStableProgress(
    100,
    `${midiToNoteName(
      midi
    )} を認定しました ✓`
  )

  renderRecommendations()

  if (selectedSong) {
    showSongAnalysis(
      selectedSong
    )
  }
}

// ==========================================
// 音程表示
// ==========================================

function updatePitchDisplay(
  frequency
) {
  const smoothedFrequency =
    getSmoothedFrequency(
      frequency
    )

  const exactMidi =
    frequencyToMidi(
      smoothedFrequency
    )

  const midi =
    Math.round(
      exactMidi
    )

  const cents =
    frequencyToCents(
      smoothedFrequency,
      midi
    )

  document.querySelector(
    '#noteDisplay'
  ).textContent =
    midiToNoteName(
      midi
    )

  document.querySelector(
    '#frequencyDisplay'
  ).textContent =
    `${smoothedFrequency.toFixed(
      1
    )} Hz`

  highlightCurrentNote(
    midi
  )

  recordRange(
    midi,
    cents
  )

  addPitchPoint(
    smoothedFrequency
  )

  updatePractice(
    smoothedFrequency
  )

  const limitedCents =
    Math.max(
      -50,
      Math.min(
        50,
        cents
      )
    )

  document.querySelector(
    '#pitchIndicator'
  ).style.left =
    `${limitedCents + 50}%`

  const message =
    document.querySelector(
      '#pitchMessage'
    )

  if (
    Math.abs(cents) <=
    8
  ) {
    message.textContent =
      '✓ 音程ぴったり'

    message.className =
      'pitch-message correct'
  } else if (
    cents < 0
  ) {
    message.textContent =
      `少し低い (${Math.round(
        cents
      )} cent)`

    message.className =
      'pitch-message warning'
  } else {
    message.textContent =
      `少し高い (+${Math.round(
        cents
      )} cent)`

    message.className =
      'pitch-message warning'
  }
}

// ==========================================
// マイク検出ループ
// ==========================================

function detectPitch() {
  if (!running) {
    return
  }

  const buffer =
    new Float32Array(
      analyser.fftSize
    )

  analyser
    .getFloatTimeDomainData(
      buffer
    )

  const rms =
    calculateRms(
      buffer
    )

  updateVolumeMeter(
    rms
  )

  const frequency =
    yinPitchDetection(
      buffer,
      audioContext.sampleRate
    )

  if (
    frequency > 0
  ) {
    lastValidPitchTime =
      performance.now()

    updatePitchDisplay(
      frequency
    )
  } else {
    const silenceTime =
      performance.now() -
      lastValidPitchTime

    if (
      silenceTime > 200
    ) {
      frequencyHistory.length =
        0

      candidateMidi = null

      candidateStartTime =
        null

      clearCurrentNote()

      addGraphGap()

      document.querySelector(
        '#noteDisplay'
      ).textContent =
        '---'

      document.querySelector(
        '#frequencyDisplay'
      ).textContent =
        '--- Hz'

      document.querySelector(
        '#graphCurrentNote'
      ).textContent =
        '---'
    }
  }

  animationId =
    requestAnimationFrame(
      detectPitch
    )
}

// ==========================================
// マイク開始
// ==========================================

async function startMicrophone() {
  try {
    stream =
      await navigator
        .mediaDevices
        .getUserMedia({
          audio: {
            echoCancellation:
              false,

            noiseSuppression:
              false,

            autoGainControl:
              true,

            channelCount: 1
          }
        })

    audioContext =
      new AudioContext()

    analyser =
      audioContext
        .createAnalyser()

    analyser.fftSize =
      4096

    analyser.smoothingTimeConstant =
      0

    microphone =
      audioContext
        .createMediaStreamSource(
          stream
        )

    microphone.connect(
      analyser
    )

    running = true

    frequencyHistory.length =
      0

    pitchHistory.length =
      0

    lastValidPitchTime =
      performance.now()

    document.querySelector(
      '#micButton'
    ).textContent =
      '⏹ マイク停止'

    document.querySelector(
      '#status'
    ).textContent =
      '声を「あーー」と伸ばしてください'

    detectPitch()
  } catch (error) {
    console.error(error)

    document.querySelector(
      '#status'
    ).textContent =
      'マイクを使用できません。ブラウザのマイク許可を確認してください。'
  }
}

function stopMicrophone() {
  running = false

  measuringMode = null

  if (animationId) {
    cancelAnimationFrame(
      animationId
    )
  }

  if (stream) {
    stream
      .getTracks()
      .forEach(
        track =>
          track.stop()
      )
  }

  if (audioContext) {
    audioContext
      .close()
      .catch(
        () => {}
      )
  }

  clearCurrentNote()

  frequencyHistory.length =
    0

  document.querySelector(
    '#volumeBar'
  ).style.width =
    '0%'

  document.querySelector(
    '#volumePercent'
  ).textContent =
    '0%'

  document.querySelector(
    '#noteDisplay'
  ).textContent =
    '---'

  document.querySelector(
    '#frequencyDisplay'
  ).textContent =
    '--- Hz'

  document.querySelector(
    '#graphCurrentNote'
  ).textContent =
    '---'

  document.querySelector(
    '#micButton'
  ).textContent =
    '🎤 マイク開始'

  document.querySelector(
    '#limitRangeButton'
  ).classList.remove(
    'measuring'
  )

  document.querySelector(
    '#comfortRangeButton'
  ).classList.remove(
    'measuring'
  )

  document.querySelector(
    '#status'
  ).textContent =
    'マイクを停止しました'
}

document.querySelector(
  '#micButton'
).addEventListener(
  'click',
  async () => {
    if (running) {
      stopMicrophone()
    } else {
      await startMicrophone()
    }
  }
)

// ==========================================
// 音域測定開始
// ==========================================

async function startRangeMeasurement(
  mode
) {
  if (!running) {
    await startMicrophone()
  }

  if (!running) {
    return
  }

  candidateMidi = null
  candidateStartTime = null

  confirmedNotes.clear()

  document.querySelector(
    '#limitRangeButton'
  ).classList.remove(
    'measuring'
  )

  document.querySelector(
    '#comfortRangeButton'
  ).classList.remove(
    'measuring'
  )

  // 限界音域を新しく測る
  if (
    mode === 'limit'
  ) {
    limitLowestMidi =
      null

    limitHighestMidi =
      null

    document.querySelector(
      '#limitLowestNote'
    ).textContent = '---'

    document.querySelector(
      '#limitHighestNote'
    ).textContent = '---'

    document.querySelector(
      '#limitRangeButton'
    ).classList.add(
      'measuring'
    )

    document.querySelector(
      '#limitRangeButton'
    ).textContent =
      '⏹ 限界音域の測定を終了'

    document.querySelector(
      '#comfortRangeButton'
    ).textContent =
      '😊 快適音域を測定'

    updateStableProgress(
      0,
      '無理をしすぎず、低い声から高い声まで出してください'
    )

    document.querySelector(
      '#status'
    ).textContent =
      '🔥 限界音域を測定中'
  }

  // 快適音域を新しく測る
  if (
    mode === 'comfort'
  ) {
    comfortLowestMidi =
      null

    comfortHighestMidi =
      null

    document.querySelector(
      '#comfortLowestNote'
    ).textContent =
      '---'

    document.querySelector(
      '#comfortHighestNote'
    ).textContent =
      '---'

    document.querySelector(
      '#comfortRangeButton'
    ).classList.add(
      'measuring'
    )

    document.querySelector(
      '#comfortRangeButton'
    ).textContent =
      '⏹ 快適音域の測定を終了'

    document.querySelector(
      '#limitRangeButton'
    ).textContent =
      '🔥 限界音域を測定'

    updateStableProgress(
      0,
      '楽に歌える低い声から高い声まで出してください'
    )

    document.querySelector(
      '#status'
    ).textContent =
      '😊 快適音域を測定中'
  }

  measuringMode = mode

  updateRangeKeys()

  renderRecommendations()
}

// ==========================================
// 音域測定終了
// ==========================================

function stopRangeMeasurement() {
  if (!measuringMode) {
    return
  }

  const oldMode =
    measuringMode

  measuringMode = null

  candidateMidi = null
  candidateStartTime = null

  document.querySelector(
    '#limitRangeButton'
  ).classList.remove(
    'measuring'
  )

  document.querySelector(
    '#comfortRangeButton'
  ).classList.remove(
    'measuring'
  )

  document.querySelector(
    '#limitRangeButton'
  ).textContent =
    '🔥 限界音域を測定'

  document.querySelector(
    '#comfortRangeButton'
  ).textContent =
    '😊 快適音域を測定'

  if (
    oldMode === 'limit' &&
    hasLimitRange()
  ) {
    document.querySelector(
      '#status'
    ).textContent =
      `🔥 限界音域：${midiToNoteName(
        limitLowestMidi
      )} 〜 ${midiToNoteName(
        limitHighestMidi
      )}`
  } else if (
    oldMode ===
      'comfort' &&
    hasComfortRange()
  ) {
    document.querySelector(
      '#status'
    ).textContent =
      `😊 快適音域：${midiToNoteName(
        comfortLowestMidi
      )} 〜 ${midiToNoteName(
        comfortHighestMidi
      )}`
  } else {
    document.querySelector(
      '#status'
    ).textContent =
      '音域測定を終了しました'
  }

  updateStableProgress(
    0,
    '測定が完了しました'
  )

  updateRangeKeys()

  renderRecommendations()

  if (selectedSong) {
    showSongAnalysis(
      selectedSong
    )
  }
}

// ==========================================
// 限界音域ボタン
// ==========================================

document.querySelector(
  '#limitRangeButton'
).addEventListener(
  'click',
  async () => {
    if (
      measuringMode ===
      'limit'
    ) {
      stopRangeMeasurement()
    } else {
      await startRangeMeasurement(
        'limit'
      )
    }
  }
)

// ==========================================
// 快適音域ボタン
// ==========================================

document.querySelector(
  '#comfortRangeButton'
).addEventListener(
  'click',
  async () => {
    if (
      measuringMode ===
      'comfort'
    ) {
      stopRangeMeasurement()
    } else {
      await startRangeMeasurement(
        'comfort'
      )
    }
  }
)

// ==========================================
// 音域リセット
// ==========================================

document.querySelector(
  '#resetRange'
).addEventListener(
  'click',
  () => {
    measuringMode = null

    limitLowestMidi = null
    limitHighestMidi = null

    comfortLowestMidi =
      null

    comfortHighestMidi =
      null

    candidateMidi = null

    candidateStartTime =
      null

    confirmedNotes.clear()

    document.querySelector(
      '#limitLowestNote'
    ).textContent = '---'

    document.querySelector(
      '#limitHighestNote'
    ).textContent = '---'

    document.querySelector(
      '#comfortLowestNote'
    ).textContent = '---'

    document.querySelector(
      '#comfortHighestNote'
    ).textContent = '---'

    document.querySelector(
      '#limitRangeButton'
    ).textContent =
      '🔥 限界音域を測定'

    document.querySelector(
      '#comfortRangeButton'
    ).textContent =
      '😊 快適音域を測定'

    document.querySelector(
      '#limitRangeButton'
    ).classList.remove(
      'measuring'
    )

    document.querySelector(
      '#comfortRangeButton'
    ).classList.remove(
      'measuring'
    )

    updateRangeKeys()

    renderRecommendations()

    if (selectedSong) {
      showSongAnalysis(
        selectedSong
      )
    }

    document.querySelector(
      '#status'
    ).textContent =
      '音域をリセットしました'
  }
)

// ==========================================
// 起動
// ==========================================

renderSearchResults()

renderRecommendations()

createPianoSampler()

requestAnimationFrame(
  () => {
    resizeCanvas()

    graphLoop()
  }
)