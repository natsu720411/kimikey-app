import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS } from '../src/songs.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')
const songsDir = path.join(publicDir, 'songs')

const SITE_URL = 'https://kimikey-app.vercel.app'

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

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function createSlug(song, index) {

  const asciiTitle =
    String(song.title)
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  if (asciiTitle) {
    return asciiTitle
  }

  return `song-${index + 1}`
}

function createSongPage(
  song,
  index
) {

  const lowMidi =
    getSongLowMidi(song)

  const highMidi =
    getSongHighMidi(song)

  const lowNote =
    midiToNoteName(lowMidi)

  const highNote =
    midiToNoteName(highMidi)

  const semitoneRange =
    highMidi - lowMidi

  const slug =
    createSlug(song, index)

  const songUrl =
    `${SITE_URL}/songs/${slug}/`

  const title =
    `${song.title}の音域は？最低音・最高音とおすすめキー｜キミキー`

  const description =
    `${song.artist}「${song.title}」の音域は${lowNote}〜${highNote}。最低音・最高音を確認し、キミキーで自分の声の音域に合うキーを無料でチェックできます。`

  const html = `
<!doctype html>

<html lang="ja">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

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
    href="${songUrl}"
  >

  <meta
    property="og:type"
    content="article"
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
    content="${songUrl}"
  >

  <meta
    name="theme-color"
    content="#111111"
  >

  <script type="application/ld+json">
  ${JSON.stringify(
    {
      '@context':
        'https://schema.org',

      '@type':
        'Article',

      headline:
        `${song.title}の音域・最低音・最高音`,

      description,

      mainEntityOfPage:
        songUrl,

      inLanguage:
        'ja',

      publisher: {
        '@type':
          'Organization',

        name:
          'キミキー',
      },
    },
    null,
    2
  )}
  </script>


  <style>

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
      line-height: 1.7;
    }

    .container {
      width: min(
        760px,
        calc(100% - 32px)
      );
      margin: 0 auto;
      padding: 24px 0 60px;
    }

    .logo {
      display: inline-block;
      margin-bottom: 20px;
      font-size: 22px;
      font-weight: 800;
      text-decoration: none;
      color: #222;
    }

    .card {
      background: white;
      border-radius: 20px;
      padding: 28px;
      box-shadow:
        0 8px 30px
        rgba(0, 0, 0, 0.06);
    }

    h1 {
      margin:
        0 0 8px;
      font-size:
        clamp(
          25px,
          7vw,
          38px
        );
      line-height: 1.35;
    }

    .artist {
      margin-bottom: 28px;
      color: #666;
      font-size: 18px;
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
      margin-bottom: 4px;
      color: #777;
      font-size: 13px;
    }

    .range-item strong {
      font-size: 28px;
    }

    .arrow {
      color: #aaa;
      font-size: 24px;
    }

    .info {
      margin: 25px 0;
    }

    .info h2 {
      margin-bottom: 8px;
      font-size: 21px;
    }

    .cta {
      display: block;
      margin-top: 28px;
      padding: 17px 20px;
      border-radius: 14px;
      background: #111;
      color: white;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
    }

    .back {
      display: block;
      margin-top: 15px;
      text-align: center;
      color: #555;
    }

    .notice {
      margin-top: 25px;
      padding-top: 18px;
      border-top:
        1px solid #eee;
      color: #777;
      font-size: 12px;
    }

    @media (
      max-width: 520px
    ) {

      .container {
        width:
          min(
            100% - 20px,
            760px
          );
        padding-top: 14px;
      }

      .card {
        padding:
          22px 17px;
        border-radius: 16px;
      }

      .range-item strong {
        font-size: 23px;
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


    <article class="card">

      <h1>
        ${escapeHtml(song.title)}の音域
      </h1>

      <div class="artist">
        ${escapeHtml(song.artist)}
      </div>


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


      <section class="info">

        <h2>
          ${escapeHtml(song.title)}の音域
        </h2>

        <p>
          ${escapeHtml(song.artist)}の
          「${escapeHtml(song.title)}」の音域データは、
          <strong>${lowNote}〜${highNote}</strong>
          です。
        </p>

        <p>
          最低音から最高音までの幅は、
          約${semitoneRange}半音です。
        </p>

      </section>


      <section class="info">

        <h2>
          自分に合うキーを調べる
        </h2>

        <p>
          同じ曲でも、自分の声の音域によって
          歌いやすいキーは変わります。
          キミキーではスマートフォンやPCのマイクを使って
          自分の音域を測定し、この曲に合うキーの目安を
          チェックできます。
        </p>

      </section>


      <a
        class="cta"
        href="/"
      >
        🎤 自分の音域とおすすめキーを調べる
      </a>


      <a
        class="back"
        href="/songs/"
      >
        他の曲の音域を見る
      </a>


      <div class="notice">
        楽曲音域・おすすめキーは音域データを基にした目安です。
        歌唱方法、裏声の扱い、音源などにより情報が異なる場合があります。
      </div>

    </article>

  </main>

</body>

</html>
`

  return {
    html,
    slug,
    lowNote,
    highNote,
  }
}


// ==========================================
// 既存のsongsフォルダを作り直す
// ==========================================

fs.rmSync(
  songsDir,
  {
    recursive: true,
    force: true,
  }
)

fs.mkdirSync(
  songsDir,
  {
    recursive: true,
  }
)


// ==========================================
// 曲ページ生成
// ==========================================

const generatedSongs = []

SONGS.forEach(
  (song, index) => {

    const result =
      createSongPage(
        song,
        index
      )

    const folder =
      path.join(
        songsDir,
        result.slug
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
      result.html,
      'utf8'
    )

    generatedSongs.push({
      ...song,
      slug: result.slug,
      lowNote: result.lowNote,
      highNote: result.highNote,
    })
  }
)


// ==========================================
// /songs/ 一覧ページ
// ==========================================

const songLinks =
  generatedSongs
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

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>
    J-POP曲別音域一覧｜最低音・最高音を調べる｜キミキー
  </title>

  <meta
    name="description"
    content="J-POPの曲別音域一覧。各曲の最低音・最高音を確認し、キミキーで自分の音域に合うおすすめキーを調べられます。"
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
      color: #222;
      font-size: 22px;
      font-weight: 800;
      text-decoration: none;
    }

    h1 {
      margin:
        25px 0 5px;
    }

    .description {
      margin-bottom: 25px;
      color: #666;
    }

    .songs {
      display: grid;
      gap: 10px;
    }

    .song {
      display: block;
      padding: 16px;
      background: white;
      border-radius: 14px;
      color: #222;
      text-decoration: none;
      box-shadow:
        0 3px 15px
        rgba(0,0,0,.04);
    }

    .song strong {
      display: block;
      margin-bottom: 3px;
    }

    .song span {
      color: #777;
      font-size: 13px;
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
      曲名を選ぶと最低音・最高音を確認できます。
    </p>


    <div class="songs">
      ${songLinks}
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
// sitemap.xmlも自動生成
// ==========================================

const sitemapUrls = [

  `${SITE_URL}/`,

  `${SITE_URL}/songs/`,

  ...generatedSongs.map(
    song =>
      `${SITE_URL}/songs/${song.slug}/`
  ),

]


const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    url => `
  <url>
    <loc>${url}</loc>
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


console.log(
  `✅ ${generatedSongs.length}曲のSEOページを生成しました`
)

console.log(
  `✅ sitemap.xml：${sitemapUrls.length}ページ`
)