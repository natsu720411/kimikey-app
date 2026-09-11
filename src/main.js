import './style.css'
import { SONGS } from './songs.js'
import {
  calculateSongKey,
  formatKeyShift,
  getSongStars,
  getSongLowMidi,
  getSongHighMidi,
} from './song-key-utils.js'
import {
  RANGE_STORAGE_KEY,
  saveRangeData as saveRangeDataToStorage,
  loadRangeData as loadRangeDataFromStorage,
  updateSavedRangeDisplay as updateSavedRangeDisplayFromStorage,
} from './range-storage.js'
import { initSongSearch } from './song-search.js'
import {
  midiToFrequency,
  frequencyToMidi,
  frequencyToCents,
  calculateRms,
  yinPitchDetection,
  getSmoothedFrequency,
  frequencyHistory,
} from './pitch-detection.js'
import {
  createMicrophoneInput,
  releaseMicrophoneInput,
} from './microphone.js'
import {
  createPianoSampler,
  playTone as playPianoTone,
  initPiano,
  highlightCurrentNote,
  clearCurrentNote,
} from './piano.js'

function playTone(frequency) {
  return playPianoTone(frequency, { frequencyToMidi, midiToNoteName })
}

// ==========================================
// 基本設定
// ==========================================

const app = document.querySelector('#app')

const NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B'
]

const START_MIDI = 36
const END_MIDI = 96

// 一瞬の物音を音域として記録しにくくする
const REQUIRED_STABLE_TIME = 400
const MAX_CENT_DEVIATION = 30
const HISTORY_SIZE = 5

const GRAPH_SECONDS = 6
const GRAPH_RANGE = 6

// 一瞬の雑音を無視
const VOICE_CONFIRM_TIME = 180
const MAX_RAW_JUMP_SEMITONES = 1.5

// 初期マイク感度
let micThreshold = 0.016


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

function isBlackKey(midi) {
  return [1, 3, 6, 8, 10].includes(((midi % 12) + 12) % 12)
}

// ==========================================
// ピアノ鍵盤
// ==========================================

const keys = []

for (
  let midi = START_MIDI;
  midi <= END_MIDI;
  midi++
) {
  keys.push({
    midi,
    name: midiToNoteName(midi),
    frequency: midiToFrequency(midi),
    black: isBlackKey(midi)
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

        <div class="center-line"></div>

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
        <span>目標</span>
        <strong id="targetNote">---</strong>
      </div>

      <div class="practice-item">
        <span>現在</span>
        <strong id="practiceCurrentNote">---</strong>
      </div>

      <div class="practice-item">
        <span>差</span>
        <strong id="practiceCents">---</strong>
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
      <span>← 6秒前</span>
      <span>現在 →</span>
    </div>

  </section>


  <!-- マイク -->

  <section class="microphone-card">

    <div class="mic-title">
      🎤 マイク入力
    </div>


    <div class="volume-label-row">
      <span>入力音量</span>
      <span id="volumePercent">0%</span>
    </div>


    <div class="volume-meter">

      <div
        id="volumeBar"
        class="volume-bar"
      ></div>

    </div>


    <div class="sensitivity-row">

      <span>感度</span>

      <input
        id="sensitivitySlider"
        type="range"
        min="1"
        max="10"
        value="5"
        step="1"
      >

      <span id="sensitivityValue">
        5
      </span>

    </div>


    <p class="mic-help">
      周囲の音を拾いすぎる場合は感度を下げてください。
      スマホでは4〜5がおすすめです
    </p>

  </section>


  <!-- 音の認定 -->

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


  <!-- オクターブ -->

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
                    k.midi < key.midi &&
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


  <button
    id="micButton"
    class="main-button"
  >
    🎤 マイク開始
  </button>


  <!-- 音域 -->

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

        <span>〜</span>

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

        <span>〜</span>

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
          あなたの音域に合うおすすめ5曲を表示します
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


  <!-- 曲一覧へのリンク -->

  <section class="song-section" aria-labelledby="songBrowseTitle">
    <div class="section-heading">
      <span class="section-icon" aria-hidden="true">🎵</span>
      <div>
        <h2 id="songBrowseTitle">曲を探す</h2>
        <p>曲名が決まっていないときは、気になる一覧から探せます</p>
      </div>
    </div>

    <nav class="song-browse-links" aria-label="曲の種類から探す">
      <a class="song-browse-link" href="/guides/male-songs/">男性向けの曲</a>
      <a class="song-browse-link" href="/guides/female-songs/">女性向けの曲</a>
      <a class="song-browse-link" href="/guides/low-voice-songs/">低音向けの曲</a>
      <a class="song-browse-link" href="/guides/high-note-songs/">高音向けの曲</a>
    </nav>
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
      placeholder="例：Lemon / 米津玄師"
    >


    <div
      id="songSearchResults"
      class="song-search-results"
    ></div>
<div class="popular-songs-block">

<div class="popular-songs-title">
  🔥 今日の人気曲10選
</div>

<p class="popular-songs-description">
  人気曲候補から毎日10曲をピックアップ
</p>

  <div
    id="popularSongs"
    class="song-search-results"
  ></div>

</div>
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
        <span>原曲音域</span>
        <strong id="originalRange">---</strong>
      </div>

      <div>
        <span>おすすめキー</span>
        <strong
          id="recommendedKey"
          class="key-result"
        >
          ---
        </strong>
      </div>

      <div>
        <span>変更後</span>
        <strong id="shiftedRange">---</strong>
      </div>

    </div>


    <div
      id="keyJudgement"
      class="key-judgement"
    ></div>
<div class="key-table-section">

  <div class="key-table-title">
    🎼 キー変更表
  </div>

  <p class="key-table-description">
    キーを変えたときの最低音・最高音
  </p>

  <div
    id="keyShiftTable"
    class="key-shift-table"
  ></div>

</div>

    <button
      id="practiceSongKey"
      class="song-practice-button"
    >
      🎹 このキーで最高音を練習
    </button>

  </section>


  <footer
    style="
      margin:30px 0 15px;
      text-align:center;
      font-size:12px;
      line-height:1.7;
      color:#777;
    "
  >

    <div>
      楽曲音域・おすすめキーは音域データを基にした目安です。
    </div>

    <div>
      Piano samples: Salamander Grand Piano V3 by Alexander Holm — CC BY 3.0
    </div>

    <div>
      Audio playback powered by Tone.js
    </div>

  </footer>


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

let measuringMode = null

let limitLowestMidi = null
let limitHighestMidi = null

let comfortLowestMidi = null
let comfortHighestMidi = null

let candidateMidi = null
let candidateStartTime = null

const confirmedNotes =
  new Set()

let lastValidPitchTime = 0


let voiceCandidateStart = null
let lastRawMidi = null


let practiceMode = false
let targetMidi = null

let selectedSong = null
let selectedSongAnalysis = null
// ==========================================
// 音域保存
// ==========================================

function saveRangeData() {
  saveRangeDataToStorage({ hasAnyRange, limitLowestMidi, limitHighestMidi, comfortLowestMidi, comfortHighestMidi })
}

function loadRangeData() {
  const data = loadRangeDataFromStorage()
  if (!data) return false
  limitLowestMidi = data.limitLowestMidi
  limitHighestMidi = data.limitHighestMidi
  comfortLowestMidi = data.comfortLowestMidi
  comfortHighestMidi = data.comfortHighestMidi
  return hasAnyRange()
}

function updateSavedRangeDisplay() {
  updateSavedRangeDisplayFromStorage({ hasLimitRange, hasComfortRange, hasAnyRange, limitLowestMidi, limitHighestMidi, comfortLowestMidi, comfortHighestMidi, midiToNoteName, updateRangeKeys, renderRecommendations })
}
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

function starText(number) {
  return (
    '★'.repeat(number) +
    '☆'.repeat(
      5 - number
    )
  )
}


// ==========================================
// おすすめ曲
// ★ 上位5曲だけ表示
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
    SONGS
      .map(
        song => {

          const result =
            calculateSongKey(song, { limitLowestMidi, limitHighestMidi, comfortLowestMidi, comfortHighestMidi })

          return {
            song,
            result
          }
        }
      )
      .filter(
        item =>
          item.result !== null
      )
      .map(
        item => ({
          ...item,
          stars:
            getSongStars(
              item.result
            )
        })
      )


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


  // ★ ここで5曲だけにする
  const recommendations =
    analysed.slice(0, 5)


  recommendations.forEach(
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


      if (result.fitsComfort) {

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
// ★ 入力するまで一覧を表示しない
// ==========================================
// ==========================================
// 人気10曲
// ==========================================

// ==========================================
// 人気曲候補
// 毎日この中から10曲を自動表示
// ==========================================

const POPULAR_SONGS_POOL = [

  {
    title: 'ライラック',
    artist: 'Mrs. GREEN APPLE'
  },

  {
    title: '怪獣の花唄',
    artist: 'Vaundy'
  },

  {
    title: 'Bling-Bang-Bang-Born',
    artist: 'Creepy Nuts'
  },

  {
    title: '幾億光年',
    artist: 'Omoinotake'
  },

  {
    title: '晩餐歌',
    artist: 'tuki.'
  },

  {
    title: 'Subtitle',
    artist: 'Official髭男dism'
  },

  {
    title: 'アイドル',
    artist: 'YOASOBI'
  },

  {
    title: 'ドライフラワー',
    artist: '優里'
  },

  {
    title: '残響散歌',
    artist: 'Aimer'
  },

  {
    title: 'マリーゴールド',
    artist: 'あいみょん'
  },

  {
    title: 'ケセラセラ',
    artist: 'Mrs. GREEN APPLE'
  },

  {
    title: '青と夏',
    artist: 'Mrs. GREEN APPLE'
  },

  {
    title: 'ダーリン',
    artist: 'Mrs. GREEN APPLE'
  },

  {
    title: '僕のこと',
    artist: 'Mrs. GREEN APPLE'
  },

  {
    title: 'ダンスホール',
    artist: 'Mrs. GREEN APPLE'
  },

  {
    title: '新時代',
    artist: 'Ado'
  },

  {
    title: '唱',
    artist: 'Ado'
  },

  {
    title: '私は最強',
    artist: 'Ado'
  },

  {
    title: '踊',
    artist: 'Ado'
  },

  {
    title: '夜に駆ける',
    artist: 'YOASOBI'
  },

  {
    title: '怪物',
    artist: 'YOASOBI'
  },

  {
    title: '群青',
    artist: 'YOASOBI'
  },

  {
    title: 'ベテルギウス',
    artist: '優里'
  },

  {
    title: '水平線',
    artist: 'back number'
  },

  {
    title: '高嶺の花子さん',
    artist: 'back number'
  },

  {
    title: 'Lemon',
    artist: '米津玄師'
  },

  {
    title: 'きらり',
    artist: '藤井風'
  },

  {
    title: '花',
    artist: '藤井風'
  },

  {
    title: 'SPECIALZ',
    artist: 'King Gnu'
  },

  {
    title: '花になって',
    artist: '緑黄色社会'
  }

]


// ==========================================
// 日付から固定乱数を作る
// 同じ日は同じ10曲
// 翌日になると自動で変わる
// ==========================================

function getDailySeed() {

  const now =
    new Date()


  const dateText =
    `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`


  let seed = 0


  for (
    let i = 0;
    i < dateText.length;
    i++
  ) {

    seed =
      (
        seed * 31 +
        dateText.charCodeAt(i)
      ) >>> 0

  }


  return seed
}


function seededRandom(seed) {

  let value =
    seed >>> 0


  return function () {

    value +=
      0x6D2B79F5


    let t =
      value


    t =
      Math.imul(
        t ^ (t >>> 15),
        t | 1
      )


    t ^=
      t +
      Math.imul(
        t ^ (t >>> 7),
        t | 61
      )


    return (
      (
        t ^ (t >>> 14)
      ) >>> 0
    ) / 4294967296

  }
}


// ==========================================
// 今日の人気10曲
// ==========================================

function getDailyPopularSongs() {

  const availableSongs =
    POPULAR_SONGS_POOL
      .map(
        popular => {

          return SONGS.find(
            song =>
              song.title ===
                popular.title &&
              song.artist ===
                popular.artist
          )

        }
      )
      .filter(Boolean)


  const random =
    seededRandom(
      getDailySeed()
    )


  const shuffled =
    [...availableSongs]


  for (
    let i =
      shuffled.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        random() *
        (i + 1)
      )


    const temp =
      shuffled[i]

    shuffled[i] =
      shuffled[j]

    shuffled[j] =
      temp
  }


  return shuffled.slice(
    0,
    10
  )
}


// ==========================================
// 人気10曲表示
// ==========================================

// ==========================================
// 最新人気10曲
// ==========================================

async function renderPopularSongs() {

  const container =
    document.querySelector(
      '#popularSongs'
    )


  if (!container) {
    return
  }


  container.innerHTML = `
    <div class="popular-loading">
      人気ランキングを読み込んでいます...
    </div>
  `


  try {

    const response =
      await fetch(
        `/popular-songs.json?t=${Date.now()}`
      )


    if (!response.ok) {

      throw new Error(
        'ランキング取得失敗'
      )

    }


    const data =
      await response.json()


    container.innerHTML = ''


    let displayed =
      0


    for (
      const popular of
      data.songs
    ) {

      const song =
        SONGS.find(
          item =>
            item.title ===
              popular.title &&
            item.artist ===
              popular.artist
        )


      if (!song) {
        continue
      }


      displayed++


      const item =
        document.createElement(
          'button'
        )


      item.className =
        'search-song-item'


      let rankDetail = ''


      if (
        popular.damRank ||
        popular.joysoundRank
      ) {

        const details = []


        if (
          popular.damRank
        ) {

          details.push(
            `DAM ${popular.damRank}位`
          )

        }


        if (
          popular.joysoundRank
        ) {

          details.push(
            `JOYSOUND ${popular.joysoundRank}位`
          )

        }


        rankDetail =
          details.join(' / ')

      }


      item.innerHTML = `

        <div
          style="
            display:flex;
            align-items:center;
            gap:12px;
          "
        >

          <div
            class="popular-rank"
          >
            ${displayed}
          </div>


          <div>

            <strong>
              ${song.title}
            </strong>


            <span>
              ${song.artist}
            </span>


            ${
              rankDetail
                ? `
                  <small
                    class="popular-source"
                  >
                    ${rankDetail}
                  </small>
                `
                : ''
            }

          </div>

        </div>


        <span
          class="search-arrow"
        >
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

    }


    const description =
      document.querySelector(
        '.popular-songs-description'
      )


    if (
      description &&
      data.updatedAt
    ) {

      const date =
        new Date(
          data.updatedAt
        )


      description.textContent =
        `DAM・JOYSOUNDランキング参考 / ${date.toLocaleDateString('ja-JP')}更新`

    }

  } catch (error) {

    console.error(
      error
    )


    container.innerHTML = `
      <div class="no-song">
        人気曲ランキングを読み込めませんでした
      </div>
    `

  }
}



// ==========================================
// キー変更表
// ==========================================

function renderKeyShiftTable(
  song,
  recommendedShift = null
) {

  const container =
    document.querySelector(
      '#keyShiftTable'
    )


  if (!container) {
    return
  }


  const songLow =
    getSongLowMidi(song)

  const songHigh =
    getSongHighMidi(song)


  if (
    !Number.isFinite(songLow) ||
    !Number.isFinite(songHigh)
  ) {

    container.innerHTML =
      '音域データがありません'

    return
  }


  container.innerHTML = ''


  for (
    let shift = -6;
    shift <= 6;
    shift++
  ) {

    const shiftedLow =
      songLow + shift

    const shiftedHigh =
      songHigh + shift


    const row =
      document.createElement(
        'div'
      )


    row.className =
      'key-shift-row'


    if (
      recommendedShift !== null &&
      shift === recommendedShift
    ) {

      row.classList.add(
        'recommended'
      )

    }


    const recommendedBadge =
      recommendedShift !== null &&
      shift === recommendedShift
        ? '<span class="recommended-badge">おすすめ</span>'
        : ''


    row.innerHTML = `

      <div class="key-shift-name">

        <strong>
          ${formatKeyShift(
            shift
          )}
        </strong>

        ${recommendedBadge}

      </div>


      <div class="key-shift-range">

        ${midiToNoteName(
          shiftedLow
        )}

        <span>〜</span>

        ${midiToNoteName(
          shiftedHigh
        )}

      </div>

    `


    container.appendChild(
      row
    )

  }
}
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


  const songLow =
    getSongLowMidi(song)

  const songHigh =
    getSongHighMidi(song)


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
      songLow
    )} 〜 ${midiToNoteName(
      songHigh
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

    document.querySelector(
      '#keyShiftTable'
    ).innerHTML = ''

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
    calculateSongKey(song, { limitLowestMidi, limitHighestMidi, comfortLowestMidi, comfortHighestMidi })

  selectedSongAnalysis =
    result

    renderKeyShiftTable(
      song,
      result.shift
    )

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
    GRAPH_SECONDS * 1000


  while (
    pitchHistory.length > 0 &&
    pitchHistory[0].time < oldest
  ) {

    pitchHistory.shift()

  }
}


function addPitchPoint(frequency) {

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

    graphCenterMidi =
      graphCenterMidi *
      0.85 +
      midi *
      0.15
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
      pitchHistory.length - 1
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
    width - rightPadding

  const graphTop =
    topPadding

  const graphBottom =
    height - bottomPadding

  const graphHeight =
    graphBottom - graphTop

  const graphWidth =
    graphRight - graphLeft


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
      isC
        ? 1.5
        : 1

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

    canvasContext.lineWidth =
      3

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


  const now =
    performance.now()

  const startTime =
    now -
    GRAPH_SECONDS * 1000

  let segment = []


  function drawSegment() {

    if (
      segment.length < 2
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

      previousTime = null

      continue
    }


    if (
      point.midi <
        minMidi - 1 ||
      point.midi >
        maxMidi + 1
    ) {

      drawSegment()

      previousTime = null

      continue
    }


    if (
      previousTime !== null &&
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
}


function graphLoop() {

  drawPitchGraph()

  requestAnimationFrame(
    graphLoop
  )
}


// ==========================================
// ピッチ練習
// ==========================================

function updateTargetKey() {

  document.querySelectorAll(
    '.piano-key'
  ).forEach(
    key => {

      key.classList.remove(
        'target-note'
      )
    }
  )


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

  graphCenterMidi = midi


  document.querySelector(
    '#targetNote'
  ).textContent =
    midiToNoteName(midi)


  const feedback =
    document.querySelector(
      '#practiceFeedback'
    )

  feedback.textContent =
    `${midiToNoteName(
      midi
    )} を声で出してみましょう`

  feedback.className =
    'practice-feedback'


  updateTargetKey()
}


function updatePractice(frequency) {

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
    ) * 100


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
    differenceCents < 0
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
      ).textContent =
        '---'

      document.querySelector(
        '#practiceCurrentNote'
      ).textContent =
        '---'

      document.querySelector(
        '#practiceCents'
      ).textContent =
        '---'

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
      getSongHighMidi(
        selectedSong
      ) +
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
// マイク感度
// ==========================================

function updateSensitivity(value) {

  const sensitivity =
    Number(value)


  document.querySelector(
    '#sensitivityValue'
  ).textContent =
    sensitivity


  const thresholds = {
    1: 0.040,
    2: 0.032,
    3: 0.026,
    4: 0.020,
    5: 0.016,
    6: 0.012,
    7: 0.009,
    8: 0.007,
    9: 0.0055,
    10: 0.0045
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


updateSensitivity(5)


// ==========================================
// 曲紹介ページから引き継いだ曲を、保存音域の読み込み後に診断
const linkedSongId =
  new URLSearchParams(window.location.search).get('song')

const linkedSong =
  SONGS.find(song => String(song.id) === linkedSongId)

if (linkedSong) {
  showSongAnalysis(linkedSong)
}


// ==========================================

// オクターブボタン
// ==========================================

document.querySelectorAll(
  '.octave-button'
).forEach(
  button => {

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
  }
)


// ==========================================
// RMS
// ==========================================

function updateVolumeMeter(rms) {
  let percent = rms * 800
  percent = Math.max(0, Math.min(100, percent))

  document.querySelector('#volumeBar').style.width = `${percent}%`
  document.querySelector('#volumePercent').textContent = `${Math.round(percent)}%`
}

// ==========================================
// YIN
// ==========================================

// ==========================================
// 音程平滑化
// ==========================================

// ==========================================
// 現在音の鍵盤
// ==========================================

// ==========================================
// 音域鍵盤色
// ==========================================

function updateRangeKeys() {

  document.querySelectorAll(
    '.piano-key'
  ).forEach(
    key => {

      key.classList.remove(
        'in-limit-range',
        'in-comfort-range',
        'limit-edge'
      )


      const midi =
        Number(
          key.dataset.midi
        )


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
    }
  )
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
// 音域記録
// ==========================================

function recordRange(
  midi,
  cents
) {

  if (!measuringMode) {

    candidateMidi = null
    candidateStartTime = null

    return
  }


  if (
    midi <
      START_MIDI ||
    midi >
      END_MIDI
  ) {
    return
  }


  if (
    Math.abs(cents) >
    MAX_CENT_DEVIATION
  ) {

    candidateMidi = null
    candidateStartTime = null


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

    candidateMidi =
      midi

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


  if (
    measuringMode ===
    'limit'
  ) {

    if (
      limitLowestMidi === null ||
      midi <
        limitLowestMidi
    ) {

      limitLowestMidi =
        midi
    }


    if (
      limitHighestMidi === null ||
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


  if (
    measuringMode ===
    'comfort'
  ) {

    if (
      comfortLowestMidi === null ||
      midi <
        comfortLowestMidi
    ) {

      comfortLowestMidi =
        midi
    }


    if (
      comfortHighestMidi === null ||
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
    Math.abs(cents) <= 8
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
// マイク検出
// ==========================================

function detectPitch() {

  if (!running) {
    return
  }


  const buffer =
    new Float32Array(
      analyser.fftSize
    )


  analyser.getFloatTimeDomainData(
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
      audioContext.sampleRate,
      micThreshold
    )


  if (
    frequency > 0
  ) {

    const now =
      performance.now()


    const rawMidi =
      frequencyToMidi(
        frequency
      )


    if (
      lastRawMidi === null ||
      Math.abs(
        rawMidi -
        lastRawMidi
      ) >
      MAX_RAW_JUMP_SEMITONES
    ) {

      voiceCandidateStart =
        now

      frequencyHistory.length =
        0
    }


    lastRawMidi =
      rawMidi


    if (
      voiceCandidateStart !== null &&
      now -
        voiceCandidateStart >=
        VOICE_CONFIRM_TIME
    ) {

      lastValidPitchTime =
        now

      updatePitchDisplay(
        frequency
      )
    }

  } else {

    voiceCandidateStart =
      null

    lastRawMidi =
      null


    const silenceTime =
      performance.now() -
      lastValidPitchTime


    if (
      silenceTime > 200
    ) {

      frequencyHistory.length =
        0

      candidateMidi =
        null

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

    const input = await createMicrophoneInput()

    stream = input.stream
    audioContext = input.audioContext
    analyser = input.analyser
    microphone = input.microphone


    running = true

    frequencyHistory.length = 0

    pitchHistory.length = 0

    lastValidPitchTime =
      performance.now()

    voiceCandidateStart = null
    lastRawMidi = null


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


// ==========================================
// マイク停止
// ==========================================

function stopMicrophone() {

  if (measuringMode) {
    stopRangeMeasurement()
    return
  }

  stopMicrophoneInput()
}


// マイク入力だけを停止する共通処理
function stopMicrophoneInput() {

  running = false


  if (animationId) {

    cancelAnimationFrame(
      animationId
    )
  }


  releaseMicrophoneInput({ stream, audioContext })

  clearCurrentNote()

  frequencyHistory.length = 0

  voiceCandidateStart = null
  lastRawMidi = null


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
// 音域測定
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


  measuringMode =
    mode


  if (
    mode === 'limit'
  ) {

    limitLowestMidi = null
    limitHighestMidi = null


    document.querySelector(
      '#limitLowestNote'
    ).textContent =
      '---'

    document.querySelector(
      '#limitHighestNote'
    ).textContent =
      '---'


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
      '低い声から高い声まで「あー」と伸ばしてください'
    )


    document.querySelector(
      '#status'
    ).textContent =
      '🔥 限界音域を測定中'
  }


  if (
    mode === 'comfort'
  ) {

    comfortLowestMidi = null
    comfortHighestMidi = null


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
      '楽に出せる低い声から高い声まで出してください'
    )


    document.querySelector(
      '#status'
    ).textContent =
      '😊 快適音域を測定中'
  }
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

  stopMicrophoneInput()

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
    oldMode === 'comfort' &&
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


  for (const [selector, midi] of [
    ['#limitLowestNote', limitLowestMidi],
    ['#limitHighestNote', limitHighestMidi],
    ['#comfortLowestNote', comfortLowestMidi],
    ['#comfortHighestNote', comfortHighestMidi]
  ]) {
    document.querySelector(selector).textContent =
      midi === null ? '---' : midiToNoteName(midi)
  }

  updateRangeKeys()

  saveRangeData()

  renderRecommendations()


  if (selectedSong) {

    showSongAnalysis(
      selectedSong
    )
  }
}


// ==========================================
// 音域ボタン
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
// リセット
// ==========================================

document.querySelector(
  '#resetRange'
).addEventListener(
  'click',
  () => {

    measuringMode = null

    limitLowestMidi = null
    limitHighestMidi = null

    comfortLowestMidi = null
    comfortHighestMidi = null

    candidateMidi = null
    candidateStartTime = null

    confirmedNotes.clear()
localStorage.removeItem(
  RANGE_STORAGE_KEY
)

    document.querySelector(
      '#limitLowestNote'
    ).textContent =
      '---'

    document.querySelector(
      '#limitHighestNote'
    ).textContent =
      '---'

    document.querySelector(
      '#comfortLowestNote'
    ).textContent =
      '---'

    document.querySelector(
      '#comfortHighestNote'
    ).textContent =
      '---'


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

// 人気10曲
renderPopularSongs()

// 検索欄
const renderSearchResults = initSongSearch({
  songs: SONGS,
  onSongSelected: showSongAnalysis,
})
renderSearchResults('')

// 前回の音域を読み込み
const restoredRange =
  loadRangeData()


if (restoredRange) {

  updateSavedRangeDisplay()

} else {

  renderRecommendations()

}


// ピアノ音源
initPiano({ frequencyToMidi, midiToNoteName, onPracticeNote: midi => { if (practiceMode) setTargetNote(midi) } })


requestAnimationFrame(
  () => {

    resizeCanvas()

    graphLoop()

  }
)
