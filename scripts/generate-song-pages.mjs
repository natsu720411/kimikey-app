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
// HTMLエスケープ
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
  'Mrs. GREEN APPLE':
    'mrs-green-apple',

  'back number':
    'back-number',

  '米津玄師':
    'kenshi-yonezu',

  'あいみょん':
    'aimyon',

  'Official髭男dism':
    'official-hige-dandism',

  'Vaundy':
    'vaundy',

  '優里':
    'yuuri',

  'Ado':
    'ado',

  'YOASOBI':
    'yoasobi',

  'King Gnu':
    'king-gnu',

  'Snow Man':
    'snow-man',

  'スピッツ':
    'spitz',

  '宇多田ヒカル':
    'hikaru-utada',

  'ちゃんみな':
    'chanmina',

  '緑黄色社会':
    'ryokushaka',

  'サカナクション':
    'sakanaction',

  'ヨルシカ':
    'yorushika',

  'SixTONES':
    'sixtones',

  '藤井風':
    'fuji-kaze',

  'ポルノグラフィティ':
    'porno-graffitti',

  '高橋洋子':
    'yoko-takahashi',

  'マカロニえんぴつ':
    'macaroni-enpitsu',

  'BUMP OF CHICKEN':
    'bump-of-chicken',

  'Saucy Dog':
    'saucy-dog',

  'aiko':
    'aiko',

  '椎名林檎':
    'sheena-ringo',

  'ONE OK ROCK':
    'one-ok-rock',
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

function getRangeWidthText(
  semitones
) {
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


function getRangeAdvice(
  semitones
) {
  if (semitones <= 12) {
    return `
      最低音から最高音までの幅は
      約${semitones}半音です。
      音域の幅だけを見ると比較的コンパクトですが、
      実際の歌いやすさは最高音の高さや
      曲中で高音が続く時間、
      テンポなどによっても変わります。
    `
  }

  if (semitones <= 18) {
    return `
      最低音から最高音までの幅は
      約${semitones}半音です。
      低音から高音まである程度の幅があるため、
      自分の出しやすい音域と
      原曲の音域を比べて
      キーを調整すると
      歌いやすくなる場合があります。
    `
  }

  if (semitones <= 24) {
    return `
      最低音から最高音までの幅は
      約${semitones}半音です。
      比較的広い音域を使う曲なので、
      最高音だけでなく
      最低音が無理なく出せるかも
      確認しながらキーを決めるのがおすすめです。
    `
  }

  return `
    最低音から最高音までの幅は
    約${semitones}半音です。
    音域の幅がかなり広いため、
    原曲キーでは低音または高音のどちらかが
    出しにくくなる可能性があります。
    自分の音域を測ってから
    キーを調整するのがおすすめです。
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

      gtag(
        'js',
        new Date()
      );

      gtag(
        'config',
        '${GA_ID}'
      );
    </script>
  `
}


// ==========================================
// 人気曲SEO
// ==========================================

const FEATURED_SEO = {

  '怪獣の花唄': {
    heading:
      '「怪獣の花唄」が高いと感じるときの考え方',

    body:
      '原曲の最高音が自分の安定して出せる最高音より上にある場合は、キーを下げる候補になります。ただし、下げすぎると最低音側が苦しくなることもあります。キミキーで自分の最低音・最高音を測り、曲全体の音域と比べて調整するのがおすすめです。',
  },

  'マリーゴールド': {
    heading:
      '「マリーゴールド」を自分の声に合わせるには',

    body:
      '歌いやすいキーを考えるときは、最高音だけでなく最低音も確認するのがポイントです。原曲の音域が自分の快適音域からはみ出している場合は、その差を目安にキー変更を検討できます。',
  },

  '水平線': {
    heading:
      '「水平線」のキーを決めるポイント',

    body:
      '自分に合うキーは、原曲の最高音が出るかだけでは決まりません。低い部分まで無理なく出せることも大切です。キミキーでは自分の音域と曲の最低音・最高音を見比べながらキーの目安を確認できます。',
  },

  'ダーリン': {
    heading:
      '「ダーリン」が歌いにくいと感じたら',

    body:
      'まず原曲の音域と自分の快適音域を比較してみましょう。最高音が上にはみ出す場合はキーを下げる、最低音が下にはみ出す場合はキーを上げる、という考え方が基本です。',
  },

  'サウダージ': {
    heading:
      '「サウダージ」のおすすめキーの考え方',

    body:
      '原曲キーが合わないと感じる場合は、曲の最低音・最高音を自分の音域の中央付近に収めるイメージで調整すると考えやすくなります。キミキーでは測定結果を使ってキー変更の目安を確認できます。',
  },

  '高嶺の花子さん': {
    heading:
      '「高嶺の花子さん」が高い場合のキー調整',

    body:
      '最高音が自分の限界音域には入っていても、快適音域を超えていると安定して歌いにくいことがあります。無理に原曲キーに合わせず、快適音域に近づくようにキーを調整する方法があります。',
  },

  'ドライフラワー': {
    heading:
      '「ドライフラワー」を歌いやすくするキーの考え方',

    body:
      'キー調整では、曲の最高音を下げることだけに注目すると最低音が低くなりすぎる場合があります。自分の最低音と最高音の両方を測定し、曲の音域全体が収まりやすい位置を探すのがおすすめです。',
  },

  '残酷な天使のテーゼ': {
    heading:
      '「残酷な天使のテーゼ」を自分の音域で歌うには',

    body:
      '原曲キーが合うかどうかは、声質や性別だけではなく個人の音域によって変わります。自分の快適音域と曲の音域を比較して、必要なら半音単位でキーを動かしてみましょう。',
  },

  'ライラック': {
    heading:
      '「ライラック」のキー選びで見るポイント',

    body:
      '自分の最高音が原曲の最高音に届いていても、それが限界に近い場合は安定しにくいことがあります。キミキーでは限界音域と快適音域を分けて測れるため、より余裕を持ったキー選びの目安にできます。',
  },

  'Lemon': {
    heading:
      '「Lemon」の原曲キーが合わないときは',

    body:
      '原曲の最低音から最高音までを自分の音域と比べると、どちら側が不足しているかを確認できます。高音側が不足しているならキーを下げる、低音側が不足しているならキーを上げる、という方向から試すと調整しやすくなります。',
  },

}


function createFeaturedSection(
  song
) {
  const songTitle =
    String(song.title)
      .trim()

  const featured =
    FEATURED_SEO[songTitle]

  if (!featured) {
    return ''
  }

  return `
    <section
      class="info featured-info"
    >

      <div
        class="featured-badge"
      >
        人気曲ピックアップ
      </div>

      <h2>
        ${escapeHtml(
          featured.heading
        )}
      </h2>

      <p>
        ${escapeHtml(
          featured.body
        )}
      </p>

      <p>
        この曲の目安音域は

        <strong>
          ${song.lowNote}
          〜
          ${song.highNote}
        </strong>

        です。

        自分の音域を測定して、
        この範囲と比較してみてください。
      </p>

    </section>
  `
}


// ==========================================
// 全曲データ整理
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
// アーティスト別データ
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
            song.artist ===
            artist
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
      song => {

        const lowDifference =
          Math.abs(
            song.lowMidi -
            currentSong.lowMidi
          )

        const highDifference =
          Math.abs(
            song.highMidi -
            currentSong.highMidi
          )

        return {
          ...song,

          difference:
            lowDifference +
            highDifference,
        }
      }
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
// 曲ページ
// ==========================================

function createSongPage(song) {

  const {
    title: songTitle,
    artist,
    slug,
    lowNote,
    highNote,
    semitoneRange,
  } = song

  const featuredHtml =
    createFeaturedSection(
      song
    )

  const artistSlug =
    artistSlugMap.get(
      artist
    )

  const songUrl =
    `${SITE_URL}/songs/${slug}/`

  const pageTitle =
    `${songTitle}の音域は？最低音・最高音とおすすめキー｜キミキー`

  const description =
    `${artist}「${songTitle}」の音域は${lowNote}〜${highNote}が目安。最低音・最高音、音域の広さを確認し、キミキーで自分の声に合うキーを無料でチェックできます。`

  const rangeWidthText =
    getRangeWidthText(
      semitoneRange
    )

  const rangeAdvice =
    getRangeAdvice(
      semitoneRange
    )

  const relatedSongs =
    getRelatedSongs(song)

  const relatedLinks =
    relatedSongs
      .map(
        related => `
          <a
            class="related-song"
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


  const structuredData = {
    '@context':
      'https://schema.org',

    '@graph': [

      {
        '@type':
          'WebPage',

        '@id':
          songUrl,

        url:
          songUrl,

        name:
          pageTitle,

        description,

        inLanguage:
          'ja',

        isPartOf: {
          '@type':
            'WebSite',

          name:
            'キミキー',

          url:
            SITE_URL,
        },
      },

      {
        '@type':
          'BreadcrumbList',

        itemListElement: [

          {
            '@type':
              'ListItem',

            position:
              1,

            name:
              'キミキー',

            item:
              `${SITE_URL}/`,
          },

          {
            '@type':
              'ListItem',

            position:
              2,

            name:
              '曲別音域一覧',

            item:
              `${SITE_URL}/songs/`,
          },

          {
            '@type':
              'ListItem',

            position:
              3,

            name:
              `${songTitle}の音域`,

            item:
              songUrl,
          },

        ],
      },

    ],
  }


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

  <meta
    property="og:type"
    content="website"
  >

  <meta
    property="og:title"
    content="${escapeHtml(pageTitle)}"
  >

  <meta
    property="og:description"
    content="${escapeHtml(description)}"
  >

  <meta
    property="og:url"
    content="${songUrl}"
  >

  <meta
    property="og:site_name"
    content="キミキー"
  >

  <meta
    name="twitter:card"
    content="summary"
  >

  <meta
    name="theme-color"
    content="#111111"
  >

  <script
    type="application/ld+json"
  >
${JSON.stringify(
  structuredData,
  null,
  2
)}
  </script>


  <style>

    * {
      box-sizing:
        border-box;
    }

    body {
      margin:
        0;

      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      background:
        #f6f7fb;

      color:
        #222;

      line-height:
        1.75;
    }

    .container {
      width:
        min(
          760px,
          calc(100% - 32px)
        );

      margin:
        0 auto;

      padding:
        22px 0 60px;
    }

    .logo {
      display:
        inline-block;

      margin-bottom:
        18px;

      color:
        #222;

      font-size:
        22px;

      font-weight:
        800;

      text-decoration:
        none;
    }

    .breadcrumb {
      margin-bottom:
        12px;

      color:
        #777;

      font-size:
        13px;
    }

    .breadcrumb a {
      color:
        #555;
    }

    .card {
      padding:
        28px;

      background:
        white;

      border-radius:
        20px;

      box-shadow:
        0 8px 30px
        rgba(0, 0, 0, 0.06);
    }

    h1 {
      margin:
        0 0 7px;

      font-size:
        clamp(
          26px,
          7vw,
          38px
        );

      line-height:
        1.35;
    }

    h2 {
      margin-top:
        0;

      font-size:
        21px;
    }

    .artist {
      margin-bottom:
        25px;

      color:
        #666;

      font-size:
        18px;
    }

    .artist a {
      color:
        inherit;

      text-decoration:
        underline;
    }

    .range-box {
      display:
        grid;

      grid-template-columns:
        1fr auto 1fr;

      gap:
        12px;

      align-items:
        center;

      margin:
        24px 0;

      padding:
        22px;

      background:
        #f7f8fc;

      border-radius:
        16px;

      text-align:
        center;
    }

    .range-item span {
      display:
        block;

      margin-bottom:
        4px;

      color:
        #777;

      font-size:
        13px;
    }

    .range-item strong {
      font-size:
        29px;
    }

    .arrow {
      color:
        #aaa;

      font-size:
        24px;
    }

    .summary {
      margin:
        18px 0 28px;

      padding:
        14px 16px;

      background:
        #fafafa;

      border-radius:
        12px;

      font-size:
        14px;
    }

    .info {
      margin:
        30px 0;
    }

    .info p {
      margin:
        8px 0 12px;
    }

    .featured-info {
      padding:
        20px;

      background:
        #fff8e8;

      border-radius:
        16px;
    }

    .featured-badge {
      display:
        inline-block;

      margin-bottom:
        10px;

      padding:
        4px 9px;

      background:
        #111;

      border-radius:
        999px;

      color:
        white;

      font-size:
        12px;

      font-weight:
        700;
    }

    .cta-area {
      margin:
        30px 0;

      padding:
        22px;

      background:
        #f2f3f8;

      border-radius:
        18px;
    }

    .cta {
      display:
        block;

      margin-top:
        16px;

      padding:
        17px 20px;

      background:
        #111;

      border-radius:
        14px;

      color:
        white;

      font-weight:
        700;

      text-align:
        center;

      text-decoration:
        none;
    }

    .related {
      margin-top:
        35px;
    }

    .related-list {
      display:
        grid;

      gap:
        10px;
    }

    .related-song {
      display:
        block;

      padding:
        14px 16px;

      background:
        #f7f8fc;

      border-radius:
        12px;

      color:
        #222;

      text-decoration:
        none;
    }

    .related-song strong {
      display:
        block;

      margin-bottom:
        3px;
    }

    .related-song span {
      color:
        #777;

      font-size:
        13px;
    }

    .back {
      display:
        block;

      margin-top:
        24px;

      text-align:
        center;

      color:
        #555;
    }

    .notice {
      margin-top:
        28px;

      padding-top:
        18px;

      border-top:
        1px solid #eee;

      color:
        #777;

      font-size:
        12px;
    }

    @media (
      max-width: 520px
    ) {

      .container {
        width:
          min(
            calc(100% - 20px),
            760px
          );

        padding-top:
          14px;
      }

      .card {
        padding:
          22px 17px;

        border-radius:
          16px;
      }

      .range-item strong {
        font-size:
          23px;
      }

      .cta-area {
        padding:
          18px;
      }

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

      ${escapeHtml(songTitle)}

    </div>


    <article class="card">

      <h1>
        ${escapeHtml(songTitle)}
        の音域は？
      </h1>


      <div class="artist">

        <a
          href="/artists/${artistSlug}/"
        >
          ${escapeHtml(artist)}
        </a>

      </div>


      <p>
        ${escapeHtml(artist)}
        「${escapeHtml(songTitle)}」の
        最低音・最高音と、
        歌うときのキー調整の考え方を紹介します。
      </p>


      <div class="range-box">

        <div class="range-item">

          <span>
            最低音
          </span>

          <strong>
            ${lowNote}
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
            ${highNote}
          </strong>

        </div>

      </div>


      <div class="summary">

        音域：

        <strong>
          ${lowNote}
          〜
          ${highNote}
        </strong>

        ／
        約${semitoneRange}半音

        ／
        ${rangeWidthText}

      </div>


      <section class="info">

        <h2>
          ${escapeHtml(songTitle)}
          の最低音・最高音
        </h2>

        <p>
          ${escapeHtml(artist)}の
          「${escapeHtml(songTitle)}」
          の音域は、

          <strong>
            ${lowNote}
            〜
            ${highNote}
          </strong>

          が目安です。
        </p>

        <p>
          最低音は
          <strong>${lowNote}</strong>、

          最高音は
          <strong>${highNote}</strong>
          です。
        </p>

      </section>


      <section class="info">

        <h2>
          ${escapeHtml(songTitle)}
          の音域の広さ
        </h2>

        <p>
          ${rangeAdvice}
        </p>

        <p>
          同じ最高音でも、
          一瞬だけ登場する場合と
          高音が連続する場合では
          歌いやすさが異なります。

          ここでの判定は
          音域データを基にした目安です。
        </p>

      </section>


      ${featuredHtml}


      <section class="info">

        <h2>
          原曲キーが高い・低いと感じたら
        </h2>

        <p>
          原曲キーで最高音が
          出しにくい場合は
          キーを下げる方法があります。

          一方で、
          下げすぎると最低音が
          出しにくくなることもあります。
        </p>

        <p>
          そのため、

          <strong>
            最高音だけではなく
            最低音も含めて
            自分の音域と比較する
          </strong>

          ことが重要です。
        </p>

      </section>


      <section class="cta-area">

        <h2>
          自分なら何キーが歌いやすい？
        </h2>

        <p>
          キミキーでは
          スマートフォンやPCのマイクを使って
          自分の声の音域を測定できます。

          測定した音域と曲の音域を比較して、
          おすすめキーの目安を確認できます。
        </p>

        <a
          class="cta"
          href="/"
          data-song="${escapeHtml(songTitle)}"
        >
          🎤 自分の音域と
          おすすめキーを調べる
        </a>

      </section>


      <section class="related">

        <h2>
          音域が近い曲
        </h2>

        <div class="related-list">
          ${relatedLinks}
        </div>

      </section>


      <a
        class="back"
        href="/songs/"
      >
        ← J-POP曲別音域一覧を見る
      </a>


      <div class="notice">

        楽曲音域・おすすめキーは
        音域データを基にした目安です。

        歌唱方法、
        裏声の扱い、
        音源、
        データの取得方法などによって
        情報が異なる場合があります。

      </div>

    </article>

  </main>


  <script>

    const cta =
      document.querySelector(
        '.cta'
      );

    if (cta) {

      cta.addEventListener(
        'click',
        () => {

          if (
            typeof window.gtag ===
            'function'
          ) {

            window.gtag(
              'event',
              'song_page_cta_click',
              {
                song_title:
                  cta.dataset.song
              }
            );

          }

        }
      );

    }

  </script>

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

  const {
    artist,
    slug,
    songs,
  } = artistData

  const artistUrl =
    `${SITE_URL}/artists/${slug}/`

  const title =
    `${artist}の曲の音域一覧｜最低音・最高音・おすすめキー｜キミキー`

  const description =
    `${artist}の楽曲の音域一覧です。最低音・最高音を比較し、キミキーで自分の声に合う曲やおすすめキーの目安を確認できます。`


  const songLinks =
    songs
      .map(
        song => `
          <a
            class="song"
            href="/songs/${song.slug}/"
          >

            <strong>
              ${escapeHtml(
                song.title
              )}
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


  const structuredData = {

    '@context':
      'https://schema.org',

    '@type':
      'CollectionPage',

    name:
      title,

    description,

    url:
      artistUrl,

    inLanguage:
      'ja',

    isPartOf: {

      '@type':
        'WebSite',

      name:
        'キミキー',

      url:
        SITE_URL,

    },

  }


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

  <meta
    property="og:type"
    content="website"
  >

  <meta
    property="og:title"
    content="${escapeHtml(title)}"
  >

  <meta
    property="og:description"
    content="${escapeHtml(description)}"
  >

  <meta
    property="og:url"
    content="${artistUrl}"
  >

  <meta
    property="og:site_name"
    content="キミキー"
  >

  <meta
    name="theme-color"
    content="#111111"
  >

  <script
    type="application/ld+json"
  >
${JSON.stringify(
  structuredData,
  null,
  2
)}
  </script>


  <style>

    * {
      box-sizing:
        border-box;
    }

    body {
      margin:
        0;

      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      background:
        #f6f7fb;

      color:
        #222;

      line-height:
        1.7;
    }

    .container {
      width:
        min(
          760px,
          calc(100% - 30px)
        );

      margin:
        0 auto;

      padding:
        25px 0 60px;
    }

    .logo {
      color:
        #222;

      font-size:
        22px;

      font-weight:
        800;

      text-decoration:
        none;
    }

    .breadcrumb {
      margin:
        18px 0;

      color:
        #777;

      font-size:
        13px;
    }

    .breadcrumb a {
      color:
        #555;
    }

    .card {
      padding:
        26px;

      background:
        white;

      border-radius:
        20px;

      box-shadow:
        0 8px 30px
        rgba(0,0,0,.06);
    }

    h1 {
      margin:
        0 0 8px;

      line-height:
        1.4;
    }

    .description {
      margin-bottom:
        25px;

      color:
        #666;
    }

    .count {
      margin:
        20px 0;

      padding:
        12px 15px;

      background:
        #f7f8fc;

      border-radius:
        12px;

      font-size:
        14px;
    }

    .songs {
      display:
        grid;

      gap:
        10px;
    }

    .song {
      display:
        block;

      padding:
        16px;

      background:
        #f7f8fc;

      border-radius:
        14px;

      color:
        #222;

      text-decoration:
        none;
    }

    .song strong {
      display:
        block;

      margin-bottom:
        3px;
    }

    .song span {
      color:
        #777;

      font-size:
        13px;
    }

    .cta {
      display:
        block;

      margin-top:
        28px;

      padding:
        17px;

      background:
        #111;

      border-radius:
        14px;

      color:
        white;

      text-align:
        center;

      font-weight:
        700;

      text-decoration:
        none;
    }

    .back {
      display:
        block;

      margin-top:
        20px;

      text-align:
        center;

      color:
        #555;
    }

    .notice {
      margin-top:
        25px;

      color:
        #777;

      font-size:
        12px;
    }

    @media (
      max-width: 520px
    ) {

      .card {
        padding:
          20px 16px;
      }

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

      <a href="/artists/">
        アーティスト
      </a>

      ＞

      ${escapeHtml(artist)}

    </div>


    <article class="card">

      <h1>
        ${escapeHtml(artist)}
        の曲の音域一覧
      </h1>


      <p class="description">

        ${escapeHtml(artist)}の楽曲について、

        最低音・最高音・音域の広さを
        一覧で比較できます。

      </p>


      <div class="count">

        キミキー収録：

        <strong>
          ${songs.length}曲
        </strong>

      </div>


      <div class="songs">
        ${songLinks}
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


      <p class="notice">

        楽曲音域は
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
// フォルダ作り直し
// ==========================================

fs.rmSync(
  songsDir,
  {
    recursive:
      true,

    force:
      true,
  }
)


fs.rmSync(
  artistsDir,
  {
    recursive:
      true,

    force:
      true,
  }
)


fs.mkdirSync(
  songsDir,
  {
    recursive:
      true,
  }
)


fs.mkdirSync(
  artistsDir,
  {
    recursive:
      true,
  }
)


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
        recursive:
          true,
      }
    )

    fs.writeFileSync(
      path.join(
        folder,
        'index.html'
      ),

      createSongPage(
        song
      ),

      'utf8'
    )
  }
)


// ==========================================
// アーティストページ生成
// ==========================================

artistMeta.forEach(
  artistData => {

    const folder =
      path.join(
        artistsDir,
        artistData.slug
      )

    fs.mkdirSync(
      folder,
      {
        recursive:
          true,
      }
    )

    fs.writeFileSync(
      path.join(
        folder,
        'index.html'
      ),

      createArtistPage(
        artistData
      ),

      'utf8'
    )
  }
)


// ==========================================
// 曲一覧ページ
// ==========================================

const songLinks =
  songMeta
    .map(
      song => `
        <a
          class="song"
          href="/songs/${song.slug}/"
        >

          <strong>
            ${escapeHtml(
              song.title
            )}
          </strong>

          <span>
            ${escapeHtml(
              song.artist
            )}
            ・
            ${song.lowNote}
            〜
            ${song.highNote}
          </span>

        </a>
      `
    )
    .join('')


const songsIndexTitle =
  'J-POP曲別音域一覧｜最低音・最高音を調べる｜キミキー'


const songsIndexDescription =
  'J-POPの曲別音域一覧。各曲の最低音・最高音を確認し、自分の声の音域に合うおすすめキーをキミキーで調べられます。'


const songsIndexHtml = `
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
    ${songsIndexTitle}
  </title>

  <meta
    name="description"
    content="${songsIndexDescription}"
  >

  <meta
    name="robots"
    content="index, follow"
  >

  <link
    rel="canonical"
    href="${SITE_URL}/songs/"
  >

  <meta
    name="theme-color"
    content="#111111"
  >

  <style>

    * {
      box-sizing:
        border-box;
    }

    body {
      margin:
        0;

      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      background:
        #f6f7fb;

      color:
        #222;

      line-height:
        1.7;
    }

    .container {
      width:
        min(
          760px,
          calc(100% - 30px)
        );

      margin:
        0 auto;

      padding:
        25px 0 60px;
    }

    .logo {
      color:
        #222;

      font-size:
        22px;

      font-weight:
        800;

      text-decoration:
        none;
    }

    h1 {
      margin:
        25px 0 5px;
    }

    .description {
      margin-bottom:
        25px;

      color:
        #666;
    }

    .nav-link {
      display:
        block;

      margin-bottom:
        12px;

      padding:
        15px;

      background:
        white;

      border-radius:
        14px;

      color:
        #222;

      font-weight:
        700;

      text-align:
        center;

      text-decoration:
        none;
    }

    .app-link {
      display:
        block;

      margin-bottom:
        28px;

      padding:
        16px;

      background:
        #111;

      border-radius:
        14px;

      color:
        white;

      font-weight:
        700;

      text-align:
        center;

      text-decoration:
        none;
    }

    .songs {
      display:
        grid;

      gap:
        10px;
    }

    .song {
      display:
        block;

      padding:
        16px;

      background:
        white;

      border-radius:
        14px;

      color:
        #222;

      text-decoration:
        none;

      box-shadow:
        0 3px 15px
        rgba(0,0,0,.04);
    }

    .song strong {
      display:
        block;

      margin-bottom:
        3px;
    }

    .song span {
      color:
        #777;

      font-size:
        13px;
    }

    .notice {
      margin-top:
        28px;

      color:
        #777;

      font-size:
        12px;
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


    <h1>
      J-POP 曲別音域一覧
    </h1>


    <p class="description">

      ${songMeta.length}曲の
      最低音・最高音・音域の広さを
      確認できます。

    </p>


    <a
      class="nav-link"
      href="/artists/"
    >
      👤 アーティスト別に探す
    </a>


    <a
      class="app-link"
      href="/"
    >
      🎤 自分の音域を測定する
    </a>


    <div class="songs">
      ${songLinks}
    </div>


    <p class="notice">

      楽曲音域は
      音域データを基にした目安です。

      歌唱方法や裏声の扱いなどによって
      情報が異なる場合があります。

    </p>

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
// アーティスト一覧ページ
// ==========================================

const artistLinks =
  [...artistMeta]
    .sort(
      (a, b) =>
        b.songs.length -
        a.songs.length
    )
    .map(
      item => `
        <a
          class="artist-item"
          href="/artists/${item.slug}/"
        >

          <strong>
            ${escapeHtml(
              item.artist
            )}
          </strong>

          <span>
            ${item.songs.length}曲
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

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  ${googleAnalyticsTag()}

  <title>
    アーティスト別J-POP音域一覧｜キミキー
  </title>

  <meta
    name="description"
    content="J-POPのアーティスト別音域一覧。アーティストごとにキミキー収録曲の最低音・最高音をまとめて確認できます。"
  >

  <meta
    name="robots"
    content="index, follow"
  >

  <link
    rel="canonical"
    href="${SITE_URL}/artists/"
  >

  <meta
    name="theme-color"
    content="#111111"
  >

  <style>

    * {
      box-sizing:
        border-box;
    }

    body {
      margin:
        0;

      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      background:
        #f6f7fb;

      color:
        #222;

      line-height:
        1.7;
    }

    .container {
      width:
        min(
          760px,
          calc(100% - 30px)
        );

      margin:
        0 auto;

      padding:
        25px 0 60px;
    }

    .logo {
      color:
        #222;

      font-size:
        22px;

      font-weight:
        800;

      text-decoration:
        none;
    }

    h1 {
      margin:
        25px 0 8px;
    }

    .description {
      margin-bottom:
        25px;

      color:
        #666;
    }

    .back {
      display:
        block;

      margin-bottom:
        20px;

      color:
        #555;
    }

    .artists {
      display:
        grid;

      gap:
        10px;
    }

    .artist-item {
      display:
        flex;

      justify-content:
        space-between;

      align-items:
        center;

      padding:
        16px;

      background:
        white;

      border-radius:
        14px;

      color:
        #222;

      text-decoration:
        none;

      box-shadow:
        0 3px 15px
        rgba(0,0,0,.04);
    }

    .artist-item span {
      color:
        #777;

      font-size:
        13px;
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


    <h1>
      アーティスト別 音域一覧
    </h1>


    <p class="description">

      ${artistMeta.length}組の
      アーティストから曲を探せます。

      アーティストを選ぶと、
      キミキーに収録されている曲の
      最低音・最高音を確認できます。

    </p>


    <a
      class="back"
      href="/songs/"
    >
      ← 曲別音域一覧を見る
    </a>


    <div class="artists">
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
// sitemap.xml
// ==========================================

const sitemapUrls = [

  `${SITE_URL}/`,

  `${SITE_URL}/songs/`,

  `${SITE_URL}/artists/`,

  ...songMeta.map(
    song =>
      `${SITE_URL}/songs/${song.slug}/`
  ),

  ...artistMeta.map(
    artist =>
      `${SITE_URL}/artists/${artist.slug}/`
  ),

]


const today =
  new Date()
    .toISOString()
    .slice(
      0,
      10
    )


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
  </url>
`
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
// 確認ログ
// ==========================================

const featuredSongs =
  songMeta.filter(
    song =>
      FEATURED_SEO[
        String(
          song.title
        ).trim()
      ]
  )


console.log(
  `✅ ${songMeta.length}曲のSEOページを生成しました`
)


console.log(
  `✅ アーティストページ：${artistMeta.length}ページ`
)


console.log(
  `✅ sitemap.xml：${sitemapUrls.length}ページ`
)


console.log(
  `✅ Google Analytics：${GA_ID}`
)


console.log(
  '✅ 関連曲リンクを生成しました'
)


console.log(
  `✅ 人気曲SEO強化：${featuredSongs.length}曲`
)