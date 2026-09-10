import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS } from '../src/songs.js'

const __filename =
  fileURLToPath(import.meta.url)

const __dirname =
  path.dirname(__filename)

const rootDir =
  path.resolve(__dirname, '..')

const publicDir =
  path.join(rootDir, 'public')

const songsDir =
  path.join(publicDir, 'songs')

const artistsDir =
  path.join(publicDir, 'artists')

const guidesDir =
  path.join(publicDir, 'guides')

const SITE_URL =
  'https://kimikey-app.vercel.app'

const GA_ID =
  'G-1B35Z51M10'


// ==========================================
// 音名
// ==========================================

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
  'B',
]


function midiToNoteName(midi) {
  if (!Number.isFinite(midi)) {
    return '不明'
  }

  const note =
    NOTE_NAMES[
      ((midi % 12) + 12) % 12
    ]

  const octave =
    Math.floor(midi / 12) - 1

  return `${note}${octave}`
}


function getSongLowMidi(song) {
  return (
    song.lowestMidi ??
    song.minMidi ??
    song.lowMidi ??
    song.low
  )
}


function getSongHighMidi(song) {
  return (
    song.highestMidi ??
    song.maxMidi ??
    song.highMidi ??
    song.high
  )
}


// ==========================================
// エスケープ
// ==========================================

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}


function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}


// ==========================================
// 曲URL
// ==========================================

function createSlug(song, index) {
  const asciiTitle =
    String(song.title)
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const id =
    song.id ?? index + 1

  if (asciiTitle) {
    return `${asciiTitle}-${id}`
  }

  return `song-${id}`
}


// ==========================================
// アーティストURL
// ==========================================

const ARTIST_SLUGS = {
  'Mrs. GREEN APPLE': 'mrs-green-apple',
  'back number': 'back-number',
  '米津玄師': 'kenshi-yonezu',
  'あいみょん': 'aimyon',
  'Official髭男dism': 'official-hige-dandism',
  'Vaundy': 'vaundy',
  '優里': 'yuuri',
  'Ado': 'ado',
  'YOASOBI': 'yoasobi',
  'King Gnu': 'king-gnu',
  'Snow Man': 'snow-man',
  'スピッツ': 'spitz',
  '宇多田ヒカル': 'hikaru-utada',
  'ちゃんみな': 'chanmina',
  '緑黄色社会': 'ryokushaka',
  'サカナクション': 'sakanaction',
  'ヨルシカ': 'yorushika',
  'SixTONES': 'sixtones',
  '藤井風': 'fuji-kaze',
  'ポルノグラフィティ': 'porno-graffitti',
  '高橋洋子': 'yoko-takahashi',
  'マカロニえんぴつ': 'macaroni-enpitsu',
  'BUMP OF CHICKEN': 'bump-of-chicken',
  'Saucy Dog': 'saucy-dog',
  'aiko': 'aiko',
  '椎名林檎': 'sheena-ringo',
  'ONE OK ROCK': 'one-ok-rock',
}


function hashString(value) {
  let hash = 0

  const text =
    String(value)

  for (
    let i = 0;
    i < text.length;
    i++
  ) {
    hash =
      (
        (hash << 5) -
        hash +
        text.charCodeAt(i)
      ) | 0
  }

  return Math.abs(hash)
    .toString(36)
}


function createArtistSlug(artist) {
  if (ARTIST_SLUGS[artist]) {
    return ARTIST_SLUGS[artist]
  }

  const ascii =
    String(artist)
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  if (ascii) {
    return `${ascii}-${hashString(artist)}`
  }

  return `artist-${hashString(artist)}`
}


// ==========================================
// 音域説明
// ==========================================

function getRangeWidthText(semitones) {
  if (semitones <= 12) {
    return '比較的コンパクトな音域'
  }

  if (semitones <= 18) {
    return '標準的な広さの音域'
  }

  if (semitones <= 24) {
    return 'やや広めの音域'
  }

  return 'かなり広い音域'
}


function getRangeAdvice(semitones) {
  if (semitones <= 12) {
    return `
      最低音から最高音までの幅は約${semitones}半音です。
      音域の幅だけを見ると比較的コンパクトですが、
      実際の歌いやすさは最高音の高さやテンポなどによっても変わります。
    `
  }

  if (semitones <= 18) {
    return `
      最低音から最高音までの幅は約${semitones}半音です。
      自分の出しやすい音域と原曲の音域を比べて
      キーを調整すると歌いやすくなる場合があります。
    `
  }

  if (semitones <= 24) {
    return `
      最低音から最高音までの幅は約${semitones}半音です。
      比較的広い音域を使う曲なので、
      最高音だけでなく最低音も確認しながら
      キーを決めるのがおすすめです。
    `
  }

  return `
    最低音から最高音までの幅は約${semitones}半音です。
    音域の幅がかなり広いため、
    自分の音域を測ってからキーを調整するのがおすすめです。
  `
}


// ==========================================
// Google Analytics
// ==========================================

function googleAnalyticsTag() {
  return `
    <!-- Google tag (gtag.js) -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"
    ></script>

    <script>
      window.dataLayer =
        window.dataLayer || [];

      function gtag() {
        dataLayer.push(arguments);
      }

      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    </script>
  `
}


// ==========================================
// 共通CSS
// ==========================================

const COMMON_CSS = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family:
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    background: #f6f7fb;
    color: #222;
    line-height: 1.75;
  }

  .container {
    width:
      min(
        760px,
        calc(100% - 30px)
      );
    margin: 0 auto;
    padding: 25px 0 60px;
  }

  .logo {
    display: inline-block;
    margin-bottom: 18px;
    color: #222;
    font-size: 22px;
    font-weight: 800;
    text-decoration: none;
  }

  .breadcrumb {
    margin-bottom: 15px;
    color: #777;
    font-size: 13px;
  }

  .breadcrumb a {
    color: #555;
  }

  .card {
    padding: 28px;
    background: white;
    border-radius: 20px;
    box-shadow:
      0 8px 30px
      rgba(0,0,0,.06);
  }

  h1 {
    margin: 0 0 10px;
    line-height: 1.4;
  }

  h2 {
    font-size: 21px;
  }

  .description {
    color: #666;
  }

  .songs {
    display: grid;
    gap: 10px;
  }

  .song {
    display: block;
    padding: 16px;
    background: #f7f8fc;
    border-radius: 14px;
    color: #222;
    text-decoration: none;
  }

  .song strong {
    display: block;
    margin-bottom: 3px;
  }

  .song span {
    color: #777;
    font-size: 13px;
  }

  .cta {
    display: block;
    margin-top: 28px;
    padding: 17px;
    background: #111;
    border-radius: 14px;
    color: white;
    font-weight: 700;
    text-align: center;
    text-decoration: none;
  }

  .back {
    display: block;
    margin-top: 20px;
    text-align: center;
    color: #555;
  }

  .notice {
    margin-top: 25px;
    color: #777;
    font-size: 12px;
  }

  @media (
    max-width: 520px
  ) {
    .card {
      padding: 20px 16px;
    }
  }
`


// ==========================================
// 人気曲SEO
// ==========================================

const FEATURED_SEO = {

  '怪獣の花唄': {
    heading:
      '「怪獣の花唄」が高いと感じるときの考え方',

    body:
      '原曲の最高音が自分の安定して出せる最高音より上にある場合は、キーを下げる候補になります。ただし、下げすぎると最低音側が苦しくなることもあります。',
  },

  'マリーゴールド': {
    heading:
      '「マリーゴールド」を自分の声に合わせるには',

    body:
      '歌いやすいキーを考えるときは、最高音だけでなく最低音も確認するのがポイントです。',
  },

  '水平線': {
    heading:
      '「水平線」のキーを決めるポイント',

    body:
      '自分に合うキーは、原曲の最高音が出るかだけでは決まりません。低い部分まで無理なく出せることも大切です。',
  },

  'ダーリン': {
    heading:
      '「ダーリン」が歌いにくいと感じたら',

    body:
      '最高音が上にはみ出す場合はキーを下げる、最低音が下にはみ出す場合はキーを上げる、という考え方が基本です。',
  },

  'サウダージ': {
    heading:
      '「サウダージ」のおすすめキーの考え方',

    body:
      '曲の最低音・最高音を自分の音域の中央付近に収めるイメージで調整すると考えやすくなります。',
  },

  '高嶺の花子さん': {
    heading:
      '「高嶺の花子さん」が高い場合のキー調整',

    body:
      '最高音が限界音域には入っていても、快適音域を超えていると安定して歌いにくいことがあります。',
  },

  'ドライフラワー': {
    heading:
      '「ドライフラワー」を歌いやすくするキーの考え方',

    body:
      'キー調整では最高音だけでなく最低音も確認し、曲の音域全体が自分に収まりやすい位置を探すのがおすすめです。',
  },

  '残酷な天使のテーゼ': {
    heading:
      '「残酷な天使のテーゼ」を自分の音域で歌うには',

    body:
      '原曲キーが合うかどうかは性別だけではなく個人の音域によって変わります。',
  },

  'ライラック': {
    heading:
      '「ライラック」のキー選びで見るポイント',

    body:
      '最高音が出せても限界に近い場合は安定しにくいため、快適音域も確認するのがおすすめです。',
  },

  'Lemon': {
    heading:
      '「Lemon」の原曲キーが合わないときは',

    body:
      '高音側が不足しているならキーを下げる、低音側が不足しているならキーを上げる、という方向から試すと調整しやすくなります。',
  },

}


function createFeaturedSection(song) {
  const featured =
    FEATURED_SEO[
      String(song.title).trim()
    ]

  if (!featured) {
    return ''
  }

  return `
    <section class="featured-info">

      <div class="featured-badge">
        人気曲ピックアップ
      </div>

      <h2>
        ${escapeHtml(featured.heading)}
      </h2>

      <p>
        ${escapeHtml(featured.body)}
      </p>

      <p>
        この曲の目安音域は
        <strong>
          ${song.lowNote}〜${song.highNote}
        </strong>
        です。
      </p>

    </section>
  `
}


// ==========================================
// 全曲データ
// ==========================================

const songMeta =
  SONGS.map(
    (song, index) => {

      const lowMidi =
        getSongLowMidi(song)

      const highMidi =
        getSongHighMidi(song)

      return {
        ...song,

        index,

        slug:
          createSlug(
            song,
            index
          ),

        lowMidi,

        highMidi,

        lowNote:
          midiToNoteName(
            lowMidi
          ),

        highNote:
          midiToNoteName(
            highMidi
          ),

        semitoneRange:
          highMidi -
          lowMidi,
      }
    }
  )


// ==========================================
// アーティストデータ
// ==========================================

const artistNames = [
  ...new Set(
    songMeta.map(
      song =>
        song.artist
    )
  ),
]


const artistMeta =
  artistNames.map(
    artist => {

      const songs =
        songMeta.filter(
          song =>
            song.artist === artist
        )

      return {
        artist,

        slug:
          createArtistSlug(
            artist
          ),

        songs,
      }
    }
  )


const artistSlugMap =
  new Map(
    artistMeta.map(
      item => [
        item.artist,
        item.slug,
      ]
    )
  )


// ==========================================
// 関連曲
// ==========================================

function getRelatedSongs(
  currentSong,
  count = 4
) {
  return songMeta
    .filter(
      song =>
        song.slug !==
        currentSong.slug
    )
    .map(
      song => ({
        ...song,

        difference:
          Math.abs(
            song.lowMidi -
            currentSong.lowMidi
          ) +
          Math.abs(
            song.highMidi -
            currentSong.highMidi
          ),
      })
    )
    .sort(
      (a, b) =>
        a.difference -
        b.difference
    )
    .slice(
      0,
      count
    )
}


// ==========================================
// 8つのまとめページ生成
// ==========================================

const guidePages = [

  // 1
  {
    slug: 'male-songs',

    title:
      '男性向けJ-POP音域一覧｜低い曲・高い曲を比較｜キミキー',

    heading:
      '男性ボーカル中心のJ-POP音域一覧',

    description:
      '男性ボーカルを中心に、J-POPの最低音・最高音を一覧で比較できます。',

    intro:
      '男性ボーカル曲を中心に最低音・最高音を比較できます。実際の歌いやすさには個人差があるため、自分の音域と比較して選ぶのがおすすめです。',

    songs:
      songMeta.filter(
        song =>
          song.gender === 'male'
      ),
  },


  // 2
  {
    slug: 'female-songs',

    title:
      '女性向けJ-POP音域一覧｜低い曲・高い曲を比較｜キミキー',

    heading:
      '女性ボーカル中心のJ-POP音域一覧',

    description:
      '女性ボーカルを中心に、J-POPの最低音・最高音を一覧で比較できます。',

    intro:
      '女性ボーカル曲を中心に最低音・最高音を比較できます。実際の歌いやすさには個人差があります。',

    songs:
      songMeta.filter(
        song =>
          song.gender === 'female'
      ),
  },


  // 3
  {
    slug: 'narrow-range-songs',

    title:
      '音域が狭いJ-POP曲一覧｜カラオケ選曲の目安｜キミキー',

    heading:
      '音域が狭めのJ-POP曲',

    description:
      '最低音から最高音までの幅が比較的狭いJ-POPを一覧で紹介します。',

    intro:
      '最低音から最高音までの幅が15半音以内の曲をまとめています。音域が狭いだけで必ず歌いやすいとは限りませんが、選曲の参考になります。',

    songs:
      [...songMeta]
        .filter(
          song =>
            song.semitoneRange <= 15
        )
        .sort(
          (a, b) =>
            a.semitoneRange -
            b.semitoneRange
        ),
  },


  // 4
  {
    slug: 'high-note-songs',

    title:
      '高音が高いJ-POP曲一覧｜最高音を比較｜キミキー',

    heading:
      '高音が高いJ-POP曲',

    description:
      'J-POPの最高音を比較して、高音が高い曲を一覧で紹介します。',

    intro:
      '収録曲の中から最高音が高い曲を順番に掲載しています。高音練習や原曲キーとの比較に利用できます。',

    songs:
      [...songMeta]
        .sort(
          (a, b) =>
            b.highMidi -
            a.highMidi
        )
        .slice(0, 50),
  },


  // 5
  {
    slug: 'low-voice-songs',

    title:
      '低い声で選びやすいJ-POP曲一覧｜最高音が低めの曲｜キミキー',

    heading:
      '低めの声で選びやすいJ-POP曲',

    description:
      '最高音が比較的低めのJ-POPを一覧で紹介します。',

    intro:
      '最高音が比較的低めの曲をまとめています。最低音も確認しながら、自分の音域に合う曲を探してみてください。',

    songs:
      [...songMeta]
        .filter(
          song =>
            song.highMidi <= 68
        )
        .sort(
          (a, b) =>
            a.highMidi -
            b.highMidi
        ),
  },


  // 6
  {
    slug: 'low-female-songs',

    title:
      '女性ボーカルで比較的低いJ-POP曲一覧｜キミキー',

    heading:
      '女性ボーカルの比較的低めのJ-POP曲',

    description:
      '女性ボーカル曲の中から最高音が比較的低めの曲を一覧で紹介します。',

    intro:
      '女性ボーカル曲の中から、最高音が比較的低めの曲をまとめています。',

    songs:
      [...songMeta]
        .filter(
          song =>
            song.gender === 'female' &&
            song.highMidi <= 73
        )
        .sort(
          (a, b) =>
            a.highMidi -
            b.highMidi
        ),
  },


  // 7
  {
    slug: 'male-high-note-training',

    title:
      '男性の高音練習向けJ-POP曲一覧｜最高音が高い曲｜キミキー',

    heading:
      '男性ボーカルの高音練習向けJ-POP曲',

    description:
      '男性ボーカル曲の中から最高音が高めの曲を一覧で紹介します。',

    intro:
      '男性ボーカル曲の中から高音が高めの曲をまとめています。無理に高音を出さず、自分の音域と比較しながら練習してください。',

    songs:
      [...songMeta]
        .filter(
          song =>
            song.gender === 'male' &&
            song.highMidi >= 69
        )
        .sort(
          (a, b) =>
            b.highMidi -
            a.highMidi
        ),
  },


  // 8
  {
    slug: 'one-octave-songs',

    title:
      '約1オクターブのJ-POP曲一覧｜音域が狭めの曲｜キミキー',

    heading:
      '約1オクターブ前後のJ-POP曲',

    description:
      '最低音から最高音までが約1オクターブ前後のJ-POPを紹介します。',

    intro:
      '音域の幅が10〜14半音程度の曲をまとめています。1オクターブは12半音です。',

    songs:
      [...songMeta]
        .filter(
          song =>
            song.semitoneRange >= 10 &&
            song.semitoneRange <= 14
        )
        .sort(
          (a, b) =>
            Math.abs(
              a.semitoneRange - 12
            ) -
            Math.abs(
              b.semitoneRange - 12
            )
        ),
  },


  // 9
  {
    slug: 'low-male-songs',

    title:
      '低音男性向けJ-POP曲一覧｜最高音が低めの男性曲｜キミキー',

    heading:
      '最高音が低めの男性ボーカル曲',

    description:
      '男性ボーカル曲の中から最高音が比較的低めの曲を一覧で比較できます。',

    intro:
      '高音が苦手な人の選曲候補として、男性ボーカル曲の中から最高音が比較的低めの曲をまとめています。',

    songs:
      [...songMeta]
        .filter(
          song =>
            song.gender === 'male' &&
            song.highMidi <= 68
        )
        .sort(
          (a, b) =>
            a.highMidi -
            b.highMidi
        ),
  },


  // 10
  {
    slug: 'high-female-songs',

    title:
      '高音女性向けJ-POP曲一覧｜最高音が高い女性曲｜キミキー',

    heading:
      '最高音が高い女性ボーカル曲',

    description:
      '女性ボーカル曲の中から最高音が高い曲を一覧で比較できます。',

    intro:
      '高音練習の候補として、女性ボーカル曲の中から最高音が高い曲をまとめています。',

    songs:
      [...songMeta]
        .filter(
          song =>
            song.gender === 'female' &&
            song.highMidi >= 74
        )
        .sort(
          (a, b) =>
            b.highMidi -
            a.highMidi
        ),
  },


  // 11
  {
    slug: 'beginner-range-songs',

    title:
      'カラオケ初心者の選曲候補｜音域が比較的狭いJ-POP｜キミキー',

    heading:
      'カラオケ初心者の選曲候補',

    description:
      '音域の幅が比較的狭いJ-POPを中心に、カラオケ初心者の選曲候補を紹介します。',

    intro:
      'カラオケ初心者の選曲候補として、音域の幅が比較的狭い曲を掲載しています。テンポ・音程変化・声質なども歌いやすさに影響するため、音域だけで必ず歌いやすいとは限りません。',

    songs:
      [...songMeta]
        .filter(
          song =>
            song.semitoneRange <= 14
        )
        .sort(
          (a, b) =>
            a.semitoneRange -
            b.semitoneRange
        )
        .slice(0, 50),
  },


  // 12
  {
    slug: 'wide-range-songs',

    title:
      '音域が広いJ-POP曲一覧｜最低音と最高音を比較｜キミキー',

    heading:
      '音域が広いJ-POP曲',

    description:
      '最低音から最高音までの幅が広いJ-POPを一覧で比較できます。',

    intro:
      '幅広い音域を使う曲をまとめています。最低音と最高音の両方を確認して、自分の音域と比較してみてください。',

    songs:
      [...songMeta]
        .filter(
          song =>
            song.semitoneRange >= 20
        )
        .sort(
          (a, b) =>
            b.semitoneRange -
            a.semitoneRange
        )
        .slice(0, 50),
  },

]

// ==========================================
// 曲ページ
// ==========================================

function createSongPage(song) {

  const songUrl =
    `${SITE_URL}/songs/${song.slug}/`

  const artistSlug =
    artistSlugMap.get(
      song.artist
    )

  const pageTitle =
    `${song.title}の音域は？最低音・最高音とおすすめキー｜キミキー`

  const description =
    `${song.artist}「${song.title}」の音域は${song.lowNote}〜${song.highNote}が目安。最低音・最高音を確認し、キミキーで自分の声に合うキーをチェックできます。`

  const relatedLinks =
    getRelatedSongs(song)
      .map(
        related => `
          <a
            class="song"
            href="/songs/${related.slug}/"
          >

            <strong>
              ${escapeHtml(
                related.title
              )}
            </strong>

            <span>
              ${escapeHtml(
                related.artist
              )}
              ・
              ${related.lowNote}
              〜
              ${related.highNote}
            </span>

          </a>
        `
      )
      .join('')

  return `
<!doctype html>

<html lang="ja">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  ${googleAnalyticsTag()}

  <title>
    ${escapeHtml(pageTitle)}
  </title>

  <meta
    name="description"
    content="${escapeHtml(description)}"
  >

  <meta
    name="robots"
    content="index, follow"
  >

  <link
    rel="canonical"
    href="${songUrl}"
  >

  <style>

    ${COMMON_CSS}

    .artist {
      margin-bottom: 25px;
      color: #666;
      font-size: 18px;
    }

    .artist a {
      color: inherit;
    }

    .range-box {
      display: grid;
      grid-template-columns:
        1fr auto 1fr;
      gap: 12px;
      align-items: center;
      margin: 24px 0;
      padding: 22px;
      background: #f7f8fc;
      border-radius: 16px;
      text-align: center;
    }

    .range-item span {
      display: block;
      color: #777;
      font-size: 13px;
    }

    .range-item strong {
      font-size: 29px;
    }

    .arrow {
      color: #aaa;
      font-size: 24px;
    }

    .summary {
      margin: 18px 0 28px;
      padding: 14px 16px;
      background: #fafafa;
      border-radius: 12px;
    }

    .info {
      margin: 30px 0;
    }

    .featured-info {
      margin: 30px 0;
      padding: 20px;
      background: #fff8e8;
      border-radius: 16px;
    }

    .featured-badge {
      display: inline-block;
      margin-bottom: 10px;
      padding: 4px 9px;
      background: #111;
      border-radius: 999px;
      color: white;
      font-size: 12px;
      font-weight: 700;
    }

    .cta-area {
      margin: 30px 0;
      padding: 22px;
      background: #f2f3f8;
      border-radius: 18px;
    }

  </style>

</head>


<body>

  <main class="container">

    <a
      class="logo"
      href="/"
    >
      🎤 キミキー
    </a>


    <div class="breadcrumb">

      <a href="/">
        トップ
      </a>

      ＞

      <a href="/songs/">
        曲別音域
      </a>

      ＞

      ${escapeHtml(song.title)}

    </div>


    <article class="card">

      <h1>
        ${escapeHtml(song.title)}
        の音域は？
      </h1>


      <div class="artist">

        <a
          href="/artists/${artistSlug}/"
        >
          ${escapeHtml(song.artist)}
        </a>

      </div>


      <div class="range-box">

        <div class="range-item">

          <span>
            最低音
          </span>

          <strong>
            ${song.lowNote}
          </strong>

        </div>


        <div class="arrow">
          〜
        </div>


        <div class="range-item">

          <span>
            最高音
          </span>

          <strong>
            ${song.highNote}
          </strong>

        </div>

      </div>


      <div class="summary">

        音域：

        <strong>
          ${song.lowNote}
          〜
          ${song.highNote}
        </strong>

        ／

        約${song.semitoneRange}半音

        ／

        ${getRangeWidthText(
          song.semitoneRange
        )}

      </div>


      <section class="info">

        <h2>
          ${escapeHtml(song.title)}
          の最低音・最高音
        </h2>

        <p>
          ${escapeHtml(song.artist)}の
          「${escapeHtml(song.title)}」
          の音域は

          <strong>
            ${song.lowNote}
            〜
            ${song.highNote}
          </strong>

          が目安です。
        </p>

      </section>


      <section class="info">

        <h2>
          ${escapeHtml(song.title)}
          の音域の広さ
        </h2>

        <p>
          ${getRangeAdvice(
            song.semitoneRange
          )}
        </p>

      </section>


      ${createFeaturedSection(song)}


      <section class="info">

        <h2>
          原曲キーが高い・低いと感じたら
        </h2>

        <p>
          最高音だけではなく、
          最低音も含めて自分の音域と
          比較することが大切です。
        </p>

      </section>


      <section class="cta-area">

        <h2>
          自分なら何キーが歌いやすい？
        </h2>

        <p>
          キミキーで自分の音域を測定して、
          この曲の音域と比較できます。
        </p>

        <a
          class="cta"
          href="/"
        >
          🎤 自分の音域とおすすめキーを調べる
        </a>

      </section>


      <section>

        <h2>
          音域が近い曲
        </h2>

        <div class="songs">
          ${relatedLinks}
        </div>

      </section>


      <a
        class="back"
        href="/songs/"
      >
        ← 曲別音域一覧を見る
      </a>


      <p class="notice">

        楽曲音域・おすすめキーは
        音域データを基にした目安です。

        歌唱方法・裏声・音源などによって
        情報が異なる場合があります。

      </p>

    </article>

  </main>

</body>

</html>
`
}


// ==========================================
// アーティストページ
// ==========================================

function createArtistPage(
  artistData
) {

  const artistUrl =
    `${SITE_URL}/artists/${artistData.slug}/`

  const title =
    `${artistData.artist}の曲の音域一覧｜最低音・最高音｜キミキー`

  const description =
    `${artistData.artist}の楽曲の最低音・最高音を一覧で比較できます。`

  const links =
    artistData.songs
      .map(
        song => `
          <a
            class="song"
            href="/songs/${song.slug}/"
          >

            <strong>
              ${escapeHtml(song.title)}
            </strong>

            <span>
              ${song.lowNote}
              〜
              ${song.highNote}

              ・

              約${song.semitoneRange}半音
            </span>

          </a>
        `
      )
      .join('')

  return `
<!doctype html>

<html lang="ja">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  ${googleAnalyticsTag()}

  <title>
    ${escapeHtml(title)}
  </title>

  <meta
    name="description"
    content="${escapeHtml(description)}"
  >

  <meta
    name="robots"
    content="index, follow"
  >

  <link
    rel="canonical"
    href="${artistUrl}"
  >

  <style>
    ${COMMON_CSS}
  </style>

</head>


<body>

  <main class="container">

    <a
      class="logo"
      href="/"
    >
      🎤 キミキー
    </a>


    <div class="breadcrumb">

      <a href="/">
        トップ
      </a>

      ＞

      <a href="/artists/">
        アーティスト
      </a>

      ＞

      ${escapeHtml(
        artistData.artist
      )}

    </div>


    <article class="card">

      <h1>
        ${escapeHtml(
          artistData.artist
        )}
        の曲の音域一覧
      </h1>


      <p class="description">

        キミキーに収録されている
        ${artistData.artist}の楽曲は

        <strong>
          ${artistData.songs.length}曲
        </strong>

        です。

      </p>


      <div class="songs">
        ${links}
      </div>


      <a
        class="cta"
        href="/"
      >
        🎤 自分の音域を測定する
      </a>


      <a
        class="back"
        href="/artists/"
      >
        ← アーティスト一覧を見る
      </a>

    </article>

  </main>

</body>

</html>
`
}


// ==========================================
// まとめページ
// ==========================================

function createGuidePage(guide) {

  const guideUrl =
    `${SITE_URL}/guides/${guide.slug}/`

  const links =
    guide.songs
      .map(
        song => `
          <a
            class="song"
            href="/songs/${song.slug}/"
          >

            <strong>
              ${escapeHtml(song.title)}
            </strong>

            <span>
              ${escapeHtml(song.artist)}

              ・

              ${song.lowNote}
              〜
              ${song.highNote}

              ・

              約${song.semitoneRange}半音
            </span>

          </a>
        `
      )
      .join('')

  return `
<!doctype html>

<html lang="ja">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  ${googleAnalyticsTag()}

  <title>
    ${escapeHtml(guide.title)}
  </title>

  <meta
    name="description"
    content="${escapeHtml(
      guide.description
    )}"
  >

  <meta
    name="robots"
    content="index, follow"
  >

  <link
    rel="canonical"
    href="${guideUrl}"
  >

  <style>
    ${COMMON_CSS}
  </style>

</head>


<body>

  <main class="container">

    <a
      class="logo"
      href="/"
    >
      🎤 キミキー
    </a>


    <div class="breadcrumb">

      <a href="/">
        トップ
      </a>

      ＞

      <a href="/guides/">
        音域から曲を探す
      </a>

      ＞

      ${escapeHtml(guide.heading)}

    </div>


    <article class="card">

      <h1>
        ${escapeHtml(guide.heading)}
      </h1>


      <p class="description">
        ${escapeHtml(guide.intro)}
      </p>


      <p>
        掲載：
        <strong>
          ${guide.songs.length}曲
        </strong>
      </p>


      <div class="songs">
        ${links}
      </div>


      <a
        class="cta"
        href="/"
      >
        🎤 自分の音域を測定する
      </a>


      <a
        class="back"
        href="/guides/"
      >
        ← 音域から曲を探す
      </a>


      <p class="notice">

        楽曲音域や歌いやすさは
        音域データを基にした目安です。

        声質・歌唱方法などによって
        実際の歌いやすさは異なります。

      </p>

    </article>

  </main>

</body>

</html>
`
}


// ==========================================
// フォルダ作成
// ==========================================

for (
  const dir of [
    songsDir,
    artistsDir,
    guidesDir,
  ]
) {
  fs.rmSync(
    dir,
    {
      recursive: true,
      force: true,
    }
  )

  fs.mkdirSync(
    dir,
    {
      recursive: true,
    }
  )
}


// ==========================================
// 曲ページ生成
// ==========================================

songMeta.forEach(
  song => {

    const folder =
      path.join(
        songsDir,
        song.slug
      )

    fs.mkdirSync(
      folder,
      {
        recursive: true,
      }
    )

    fs.writeFileSync(
      path.join(
        folder,
        'index.html'
      ),
      createSongPage(song),
      'utf8'
    )
  }
)


// ==========================================
// アーティストページ生成
// ==========================================

artistMeta.forEach(
  artist => {

    const folder =
      path.join(
        artistsDir,
        artist.slug
      )

    fs.mkdirSync(
      folder,
      {
        recursive: true,
      }
    )

    fs.writeFileSync(
      path.join(
        folder,
        'index.html'
      ),
      createArtistPage(
        artist
      ),
      'utf8'
    )
  }
)


// ==========================================
// 4まとめページ生成
// ==========================================

guidePages.forEach(
  guide => {

    const folder =
      path.join(
        guidesDir,
        guide.slug
      )

    fs.mkdirSync(
      folder,
      {
        recursive: true,
      }
    )

    fs.writeFileSync(
      path.join(
        folder,
        'index.html'
      ),
      createGuidePage(
        guide
      ),
      'utf8'
    )
  }
)


// ==========================================
// 曲一覧ページ
// ==========================================

const allSongLinks =
  songMeta
    .map(
      song => `
        <a
          class="song"
          href="/songs/${song.slug}/"
        >

          <strong>
            ${escapeHtml(song.title)}
          </strong>

          <span>
            ${escapeHtml(song.artist)}
            ・
            ${song.lowNote}
            〜
            ${song.highNote}
          </span>

        </a>
      `
    )
    .join('')


const songsIndexHtml = `
<!doctype html>

<html lang="ja">

<head>

  <meta charset="UTF-8">

  ${googleAnalyticsTag()}

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>
    J-POP曲別音域一覧｜キミキー
  </title>

  <meta
    name="description"
    content="J-POPの最低音・最高音を曲別に確認できます。"
  >

  <meta
    name="robots"
    content="index, follow"
  >

  <link
    rel="canonical"
    href="${SITE_URL}/songs/"
  >

  <style>
    ${COMMON_CSS}
  </style>

</head>

<body>

  <main class="container">

    <a
      class="logo"
      href="/"
    >
      🎤 キミキー
    </a>


    <h1>
      J-POP 曲別音域一覧
    </h1>


    <p>
      ${songMeta.length}曲を掲載しています。
    </p>


    <p>
      <a href="/artists/">
        👤 アーティスト別に探す
      </a>
    </p>

    <p>
      <a href="/guides/">
        🎵 音域から曲を探す
      </a>
    </p>


    <div class="songs">
      ${allSongLinks}
    </div>

  </main>

</body>

</html>
`


fs.writeFileSync(
  path.join(
    songsDir,
    'index.html'
  ),
  songsIndexHtml,
  'utf8'
)


// ==========================================
// アーティスト一覧
// ==========================================

const artistLinks =
  [...artistMeta]
    .sort(
      (a, b) =>
        b.songs.length -
        a.songs.length
    )
    .map(
      artist => `
        <a
          class="song"
          href="/artists/${artist.slug}/"
        >

          <strong>
            ${escapeHtml(
              artist.artist
            )}
          </strong>

          <span>
            ${artist.songs.length}曲
          </span>

        </a>
      `
    )
    .join('')


const artistsIndexHtml = `
<!doctype html>

<html lang="ja">

<head>

  <meta charset="UTF-8">

  ${googleAnalyticsTag()}

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>
    アーティスト別J-POP音域一覧｜キミキー
  </title>

  <meta
    name="description"
    content="アーティスト別にJ-POPの音域を確認できます。"
  >

  <meta
    name="robots"
    content="index, follow"
  >

  <link
    rel="canonical"
    href="${SITE_URL}/artists/"
  >

  <style>
    ${COMMON_CSS}
  </style>

</head>

<body>

  <main class="container">

    <a
      class="logo"
      href="/"
    >
      🎤 キミキー
    </a>

    <h1>
      アーティスト別 音域一覧
    </h1>

    <p>
      ${artistMeta.length}組の
      アーティストを掲載しています。
    </p>

    <div class="songs">
      ${artistLinks}
    </div>

  </main>

</body>

</html>
`


fs.writeFileSync(
  path.join(
    artistsDir,
    'index.html'
  ),
  artistsIndexHtml,
  'utf8'
)


// ==========================================
// guides一覧
// ==========================================

const guideLinks =
  guidePages
    .map(
      guide => `
        <a
          class="song"
          href="/guides/${guide.slug}/"
        >

          <strong>
            ${escapeHtml(
              guide.heading
            )}
          </strong>

          <span>
            ${guide.songs.length}曲
          </span>

        </a>
      `
    )
    .join('')


const guidesIndexHtml = `
<!doctype html>

<html lang="ja">

<head>

  <meta charset="UTF-8">

  ${googleAnalyticsTag()}

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>
    歌いやすいJ-POP・音域別の曲一覧｜キミキー
  </title>

  <meta
    name="description"
    content="男性ボーカル、女性ボーカル、音域が狭い曲、高音が高い曲など、J-POPを音域から探せます。"
  >

  <meta
    name="robots"
    content="index, follow"
  >

  <link
    rel="canonical"
    href="${SITE_URL}/guides/"
  >

  <style>
    ${COMMON_CSS}
  </style>

</head>

<body>

  <main class="container">

    <a
      class="logo"
      href="/"
    >
      🎤 キミキー
    </a>

    <h1>
      音域からJ-POPを探す
    </h1>

    <p>
      条件別に曲を探せます。
    </p>

    <div class="songs">
      ${guideLinks}
    </div>

    <a
      class="cta"
      href="/"
    >
      🎤 自分の音域を測定する
    </a>

  </main>

</body>

</html>
`


fs.writeFileSync(
  path.join(
    guidesDir,
    'index.html'
  ),
  guidesIndexHtml,
  'utf8'
)


// ==========================================
// sitemap.xml
// ==========================================

const sitemapUrls = [

  `${SITE_URL}/`,

  `${SITE_URL}/songs/`,

  `${SITE_URL}/artists/`,

  `${SITE_URL}/guides/`,

  ...songMeta.map(
    song =>
      `${SITE_URL}/songs/${song.slug}/`
  ),

  ...artistMeta.map(
    artist =>
      `${SITE_URL}/artists/${artist.slug}/`
  ),

  ...guidePages.map(
    guide =>
      `${SITE_URL}/guides/${guide.slug}/`
  ),

]


const today =
  new Date()
    .toISOString()
    .slice(0, 10)


const sitemap =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${sitemapUrls
  .map(
    url => `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join('')}
</urlset>
`


fs.writeFileSync(
  path.join(
    publicDir,
    'sitemap.xml'
  ),
  sitemap,
  'utf8'
)


// ==========================================
// 確認
// ==========================================

const featuredCount =
  songMeta.filter(
    song =>
      FEATURED_SEO[
        String(song.title).trim()
      ]
  ).length


console.log(
  `✅ ${songMeta.length}曲のSEOページを生成しました`
)

console.log(
  `✅ アーティストページ：${artistMeta.length}ページ`
)

console.log(
  `✅ まとめページ：${guidePages.length}ページ`
)

console.log(
  `✅ sitemap.xml：${sitemapUrls.length}ページ`
)

console.log(
  `✅ Google Analytics：${GA_ID}`
)

console.log(
  `✅ 人気曲SEO強化：${featuredCount}曲`
)