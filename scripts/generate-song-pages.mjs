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
const GA_ID = 'G-1B35Z51M10'

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
    NOTE_NAMES[((midi % 12) + 12) % 12]

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

/*
  URLの重複防止のため、
  必ず曲IDまたは連番を最後につけます。

  Lemon
  → /songs/lemon-2/

  日本語タイトル
  → /songs/song-15/
*/
function createSlug(song, index) {
  const asciiTitle =
    String(song.title)
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const id = song.id ?? index + 1

  if (asciiTitle) {
    return `${asciiTitle}-${id}`
  }

  return `song-${id}`
}

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
      実際の歌いやすさは最高音の高さや曲中で高音が続く時間、
      テンポなどによっても変わります。
    `
  }

  if (semitones <= 18) {
    return `
      最低音から最高音までの幅は約${semitones}半音です。
      低音から高音まである程度の幅があるため、
      自分の出しやすい音域と原曲の音域を比べて
      キーを調整すると歌いやすくなる場合があります。
    `
  }

  if (semitones <= 24) {
    return `
      最低音から最高音までの幅は約${semitones}半音です。
      比較的広い音域を使う曲なので、
      最高音だけでなく最低音が無理なく出せるかも
      確認しながらキーを決めるのがおすすめです。
    `
  }

  return `
    最低音から最高音までの幅は約${semitones}半音です。
    音域の幅がかなり広いため、
    原曲キーでは低音または高音のどちらかが
    出しにくくなる可能性があります。
    自分の音域を測ってからキーを調整するのがおすすめです。
  `
}

function googleAnalyticsTag() {
  return `
    <!-- Google tag (gtag.js) -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"
    ></script>

    <script>
      window.dataLayer = window.dataLayer || [];

      function gtag() {
        dataLayer.push(arguments);
      }

      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    </script>
  `
}

const songMeta = SONGS.map(
  (song, index) => {
    const lowMidi = getSongLowMidi(song)
    const highMidi = getSongHighMidi(song)

    return {
      ...song,
      index,
      slug: createSlug(song, index),
      lowMidi,
      highMidi,
      lowNote: midiToNoteName(lowMidi),
      highNote: midiToNoteName(highMidi),
      semitoneRange: highMidi - lowMidi,
    }
  }
)

/*
  音域が近い曲を関連曲として表示
*/
function getRelatedSongs(currentSong, count = 4) {
  return songMeta
    .filter(
      song =>
        song.slug !== currentSong.slug
    )
    .map(song => {
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
    })
    .sort(
      (a, b) =>
        a.difference -
        b.difference
    )
    .slice(0, count)
}

function createSongPage(song) {
  const {
    title: songTitle,
    artist,
    slug,
    lowNote,
    highNote,
    semitoneRange,
  } = song

  const songUrl =
    `${SITE_URL}/songs/${slug}/`

  const pageTitle =
    `${songTitle}の音域は？最低音・最高音とおすすめキー｜キミキー`

  const description =
    `${artist}「${songTitle}」の音域は${lowNote}〜${highNote}が目安。最低音・最高音、音域の広さを確認し、キミキーで自分の声に合うキーを無料でチェックできます。`

  const rangeWidthText =
    getRangeWidthText(semitoneRange)

  const rangeAdvice =
    getRangeAdvice(semitoneRange)

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
              ${escapeHtml(related.title)}
            </strong>

            <span>
              ${escapeHtml(related.artist)}
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
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': songUrl,
        url: songUrl,
        name: pageTitle,
        description,
        inLanguage: 'ja',
        isPartOf: {
          '@type': 'WebSite',
          name: 'キミキー',
          url: SITE_URL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'キミキー',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '曲別音域一覧',
            item: `${SITE_URL}/songs/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${songTitle}の音域`,
            item: songUrl,
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

  <title>${escapeHtml(pageTitle)}</title>

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

  <script type="application/ld+json">
${JSON.stringify(
  structuredData,
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
      line-height: 1.75;
    }

    .container {
      width: min(
        760px,
        calc(100% - 32px)
      );
      margin: 0 auto;
      padding: 22px 0 60px;
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
      margin-bottom: 12px;
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
        rgba(0, 0, 0, 0.06);
    }

    h1 {
      margin: 0 0 7px;
      font-size:
        clamp(
          26px,
          7vw,
          38px
        );
      line-height: 1.35;
    }

    h2 {
      margin-top: 0;
      font-size: 21px;
    }

    .artist {
      margin-bottom: 25px;
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
      font-size: 14px;
    }

    .info {
      margin: 30px 0;
    }

    .info p {
      margin:
        8px 0 12px;
    }

    .cta-area {
      margin: 30px 0;
      padding: 22px;
      background: #f2f3f8;
      border-radius: 18px;
    }

    .cta-area h2 {
      margin-bottom: 8px;
    }

    .cta {
      display: block;
      margin-top: 16px;
      padding: 17px 20px;
      background: #111;
      border-radius: 14px;
      color: white;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
    }

    .related {
      margin-top: 35px;
    }

    .related-list {
      display: grid;
      gap: 10px;
    }

    .related-song {
      display: block;
      padding: 14px 16px;
      background: #f7f8fc;
      border-radius: 12px;
      color: #222;
      text-decoration: none;
    }

    .related-song strong {
      display: block;
      margin-bottom: 3px;
    }

    .related-song span {
      color: #777;
      font-size: 13px;
    }

    .back {
      display: block;
      margin-top: 24px;
      text-align: center;
      color: #555;
    }

    .notice {
      margin-top: 28px;
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
            calc(100% - 20px),
            760px
          );
        padding-top: 14px;
      }

      .card {
        padding: 22px 17px;
        border-radius: 16px;
      }

      .range-item strong {
        font-size: 23px;
      }

      .cta-area {
        padding: 18px;
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
      <a href="/">トップ</a>
      ＞
      <a href="/songs/">曲別音域</a>
      ＞
      ${escapeHtml(songTitle)}
    </div>

    <article class="card">

      <h1>
        ${escapeHtml(songTitle)}の音域は？
      </h1>

      <div class="artist">
        ${escapeHtml(artist)}
      </div>

      <p>
        ${escapeHtml(artist)}「${escapeHtml(songTitle)}」の
        最低音・最高音と、歌うときのキー調整の考え方を紹介します。
      </p>

      <div class="range-box">

        <div class="range-item">
          <span>最低音</span>
          <strong>${lowNote}</strong>
        </div>

        <div class="arrow">
          〜
        </div>

        <div class="range-item">
          <span>最高音</span>
          <strong>${highNote}</strong>
        </div>

      </div>

      <div class="summary">
        音域：
        <strong>${lowNote}〜${highNote}</strong>
        ／
        約${semitoneRange}半音
        ／
        ${rangeWidthText}
      </div>

      <section class="info">

        <h2>
          ${escapeHtml(songTitle)}の最低音・最高音
        </h2>

        <p>
          ${escapeHtml(artist)}の
          「${escapeHtml(songTitle)}」の音域は、
          <strong>${lowNote}〜${highNote}</strong>
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
          ${escapeHtml(songTitle)}の音域の広さ
        </h2>

        <p>
          ${rangeAdvice}
        </p>

        <p>
          なお、同じ最高音でも、
          一瞬だけ登場する場合と高音が連続する場合では
          歌いやすさが異なります。
          ここでの判定は音域データを基にした目安です。
        </p>

      </section>

      <section class="info">

        <h2>
          原曲キーが高い・低いと感じたら
        </h2>

        <p>
          原曲キーで最高音が出しにくい場合は
          キーを下げる方法があります。
          一方で、下げすぎると最低音が
          出しにくくなることもあります。
        </p>

        <p>
          そのため、
          <strong>
            最高音だけではなく最低音も含めて
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
          キミキーではスマートフォンやPCのマイクを使って
          自分の声の音域を測定できます。
          測定した音域と曲の音域を比較して、
          おすすめキーの目安を確認できます。
        </p>

        <a
          class="cta"
          href="/"
          data-song="${escapeHtml(songTitle)}"
        >
          🎤 自分の音域とおすすめキーを調べる
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
        歌唱方法、裏声の扱い、音源、
        データの取得方法などによって
        情報が異なる場合があります。
      </div>

    </article>

  </main>

  <script>
    const cta =
      document.querySelector('.cta');

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

/*
  既存の /public/songs を削除して
  新しく作り直す
*/
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

/*
  各曲ページを生成
*/
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

/*
  /songs/ 一覧ページ
*/
const songLinks =
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

const songsIndexTitle =
  'J-POP曲別音域一覧｜最低音・最高音を調べる｜キミキー'

const songsIndexDescription =
  'J-POPの曲別音域一覧。各曲の最低音・最高音を確認し、自分の声の音域に合うおすすめキーをキミキーで調べられます。'

const songsIndexStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: songsIndexTitle,
  description: songsIndexDescription,
  url: `${SITE_URL}/songs/`,
  inLanguage: 'ja',
  isPartOf: {
    '@type': 'WebSite',
    name: 'キミキー',
    url: SITE_URL,
  },
}

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
    property="og:type"
    content="website"
  >

  <meta
    property="og:title"
    content="${songsIndexTitle}"
  >

  <meta
    property="og:description"
    content="${songsIndexDescription}"
  >

  <meta
    property="og:url"
    content="${SITE_URL}/songs/"
  >

  <meta
    property="og:site_name"
    content="キミキー"
  >

  <meta
    name="theme-color"
    content="#111111"
  >

  <script type="application/ld+json">
${JSON.stringify(
  songsIndexStructuredData,
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
      line-height: 1.4;
    }

    .description {
      margin-bottom: 25px;
      color: #666;
    }

    .app-link {
      display: block;
      margin-bottom: 28px;
      padding: 16px;
      background: #111;
      border-radius: 14px;
      color: white;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
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
        rgba(0, 0, 0, 0.04);
    }

    .song strong {
      display: block;
      margin-bottom: 3px;
    }

    .song span {
      color: #777;
      font-size: 13px;
    }

    .notice {
      margin-top: 28px;
      color: #777;
      font-size: 12px;
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
      曲名を選ぶと、
      最低音・最高音・音域の広さを確認できます。
      自分に合うキーを知りたい場合は、
      キミキーで自分の声の音域も測定できます。
    </p>

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
      楽曲音域は音域データを基にした目安です。
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

/*
  sitemap.xml生成
*/
const sitemapUrls = [
  `${SITE_URL}/`,
  `${SITE_URL}/songs/`,
  ...songMeta.map(
    song =>
      `${SITE_URL}/songs/${song.slug}/`
  ),
]

const today =
  new Date()
    .toISOString()
    .slice(0, 10)

const sitemap =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    url => `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join('\n')}
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
  `✅ ${songMeta.length}曲のSEOページを生成しました`
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