import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SONGS as BASE_SONGS } from '../src/songs.js'
import { CATALOG_500_SONGS } from '../src/songs-catalog-500.js'
import { VERIFIED_RANGE_100 } from '../src/songs-verified-100.js'

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

const hubDir =
  path.join(
    publicDir,
    'popular-song-ranges'
  )

const SITE_URL =
  'https://kimikey-app.vercel.app'

const GA_ID =
  'G-1B35Z51M10'

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

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

function midiToNoteName(midi) {
  const names = [
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

  const note =
    names[
      ((midi % 12) + 12) % 12
    ]

  const octave =
    Math.floor(midi / 12) - 1

  return `${note}${octave}`
}

function createSlug(song) {
  const asciiTitle =
    String(song.title)
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  if (asciiTitle) {
    return (
      `${asciiTitle}-${song.id}`
    )
  }

  return `song-${song.id}`
}

function songKey(song) {
  return (
    `${song.artist}\u0000${song.title}`
  )
}

const baseSongMap =
  new Map(
    BASE_SONGS.map(
      song => [
        songKey(song),
        song,
      ]
    )
  )

const catalogSongMap =
  new Map(
    CATALOG_500_SONGS.map(
      (song, index) => [
        songKey(song),
        {
          ...song,
          id: 10000 + index,
        },
      ]
    )
  )

const verifiedSongs =
  VERIFIED_RANGE_100.map(
    verified => {
      const original =
        baseSongMap.get(
          songKey(verified)
        ) ??
        catalogSongMap.get(
          songKey(verified)
        )

      if (!original) {
        throw new Error(
          `Verified song not found in catalog: ${verified.artist} / ${verified.title}`
        )
      }

      const minMidi =
        pitchLabelToMidi(
          verified.lowLabel
        )

      const maxMidi =
        pitchLabelToMidi(
          verified.highLabel
        )

      const song = {
        ...original,
        ...verified,
        minMidi,
        maxMidi,
        lowMidi: minMidi,
        highMidi: maxMidi,
        low: minMidi,
        high: maxMidi,
        sourceType:
          '出典確認済み音域',
      }

      return {
        ...song,
        slug:
          createSlug(song),
        lowNote:
          midiToNoteName(minMidi),
        highNote:
          midiToNoteName(maxMidi),
        semitoneRange:
          maxMidi - minMidi,
      }
    }
  )

if (verifiedSongs.length !== 100) {
  throw new Error(
    `Expected 100 verified songs, got ${verifiedSongs.length}`
  )
}

const COMMON_CSS = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #f6f7fb;
    color: #222;
    font-family:
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    line-height: 1.75;
  }

  .container {
    width:
      min(
        820px,
        calc(100% - 28px)
      );
    margin: 0 auto;
    padding: 24px 0 60px;
  }

  .logo {
    display: inline-block;
    margin-bottom: 16px;
    color: #222;
    font-size: 21px;
    font-weight: 800;
    text-decoration: none;
  }

  .breadcrumb {
    margin-bottom: 14px;
    color: #777;
    font-size: 13px;
  }

  .breadcrumb a {
    color: #555;
  }

  .card {
    padding: 28px;
    background: #fff;
    border-radius: 20px;
    box-shadow:
      0 8px 30px
      rgba(0,0,0,.06);
  }

  h1 {
    margin: 0 0 12px;
    font-size:
      clamp(26px, 6vw, 36px);
    line-height: 1.4;
  }

  h2 {
    margin-top: 30px;
    font-size: 21px;
  }

  .lead {
    color: #666;
  }

  .range-grid {
    display: grid;
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
    gap: 12px;
    margin: 24px 0;
  }

  .range-box {
    padding: 18px;
    border:
      1px solid #e8e8ef;
    border-radius: 15px;
    background: #fafafd;
  }

  .range-box small {
    display: block;
    color: #777;
  }

  .range-box strong {
    display: block;
    margin-top: 4px;
    font-size: 25px;
  }

  .source {
    padding: 14px 16px;
    border-radius: 12px;
    background: #f6f7fb;
    color: #666;
    font-size: 13px;
  }

  .source a {
    color: inherit;
  }

  .cta-grid {
    display: grid;
    grid-template-columns:
      repeat(
        2,
        minmax(0,1fr)
      );
    gap: 10px;
    margin-top: 26px;
  }

  .cta {
    display: grid;
    place-items: center;
    min-height: 50px;
    padding: 12px 14px;
    border-radius: 13px;
    background: #111;
    color: #fff;
    font-weight: 700;
    text-align: center;
    text-decoration: none;
  }

  .cta.secondary {
    background: #f0f1f6;
    color: #333;
  }

  .song-list {
    display: grid;
    gap: 9px;
    margin-top: 20px;
  }

  .song-link {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 15px;
    border:
      1px solid #ececf2;
    border-radius: 13px;
    color: #222;
    text-decoration: none;
  }

  .song-link small {
    color: #777;
  }

  .notice {
    margin-top: 24px;
    color: #777;
    font-size: 12px;
  }

  @media (
    max-width: 560px
  ) {
    .card {
      padding: 20px 16px;
    }

    .range-grid,
    .cta-grid {
      grid-template-columns: 1fr;
    }
  }
`

function googleAnalyticsTag() {
  return `
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
      gtag(
        'config',
        '${GA_ID}'
      );
    </script>
  `
}

function createSongPage(song) {
  const url =
    `${SITE_URL}/songs/${song.slug}/`

  const pageTitle =
    `${song.title}（${song.artist}）の音域｜最低音${song.lowLabel}・最高音${song.highLabel}｜キミキー`

  const description =
    `${song.artist}「${song.title}」の音域は${song.lowLabel}〜${song.highLabel}（${song.lowNote}〜${song.highNote}）。最低音・最高音を出典確認済みデータで掲載し、自分の音域との比較やカラオケのキー調整に使えます。`

  const structuredData =
    JSON.stringify({
      '@context':
        'https://schema.org',
      '@graph': [
        {
          '@type':
            'WebPage',
          '@id':
            url,
          url,
          name:
            pageTitle,
          description,
          inLanguage:
            'ja',
        },
        {
          '@type':
            'MusicRecording',
          name:
            song.title,
          byArtist: {
            '@type':
              'MusicGroup',
            name:
              song.artist,
          },
        },
        {
          '@type':
            'BreadcrumbList',
          itemListElement: [
            {
              '@type':
                'ListItem',
              position: 1,
              name:
                'トップ',
              item:
                `${SITE_URL}/`,
            },
            {
              '@type':
                'ListItem',
              position: 2,
              name:
                '人気曲100曲の音域',
              item:
                `${SITE_URL}/popular-song-ranges/`,
            },
            {
              '@type':
                'ListItem',
              position: 3,
              name:
                song.title,
              item:
                url,
            },
          ],
        },
      ],
    })
      .replaceAll(
        '<',
        '\\u003c'
      )

  return `<!doctype html>
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
    href="${url}"
  >
  <meta
    property="og:type"
    content="article"
  >
  <meta
    property="og:site_name"
    content="キミキー"
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
    content="${url}"
  >
  <meta
    property="og:image"
    content="${SITE_URL}/og-image.png"
  >
  <meta
    name="twitter:card"
    content="summary_large_image"
  >
  <script type="application/ld+json">
    ${structuredData}
  </script>
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
      <a href="/">トップ</a>
      ＞
      <a href="/popular-song-ranges/">
        人気曲100曲の音域
      </a>
      ＞
      ${escapeHtml(song.title)}
    </div>

    <article class="card">
      <h1>
        ${escapeHtml(song.title)}
        （${escapeHtml(song.artist)}）の音域
      </h1>

      <p class="lead">
        最低音・最高音を公開されている音域データで確認し、
        キミキーの診断に使える形で登録しています。
      </p>

      <div class="range-grid">
        <div class="range-box">
          <small>最低音</small>
          <strong>
            ${escapeHtml(song.lowLabel)}
          </strong>
          <span>
            ${escapeHtml(song.lowNote)}
          </span>
        </div>

        <div class="range-box">
          <small>最高音</small>
          <strong>
            ${escapeHtml(song.highLabel)}
          </strong>
          <span>
            ${escapeHtml(song.highNote)}
          </span>
        </div>
      </div>

      <h2>音域の広さ</h2>
      <p>
        最低音から最高音までは
        <strong>
          約${song.semitoneRange}半音
        </strong>
        です。
        自分の快適音域と比較すると、
        原曲キーのまま歌うか、
        キーを調整するかの目安にできます。
      </p>

      <div class="source">
        音域データ参照：
        <a
          href="${escapeHtml(song.rangeSource)}"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          参照元を確認
        </a>
      </div>

      <div class="cta-grid">
        <a
          class="cta"
          href="/?song=${encodeURIComponent(song.id)}"
        >
          🎤 自分の音域と比較する
        </a>

        <a
          class="cta secondary"
          href="/karaoke-key-check/"
        >
          🔑 自分に合うキーを調べる
        </a>

        <a
          class="cta secondary"
          href="/vocal-range-table/"
        >
          🎼 音域表を見る
        </a>

        <a
          class="cta secondary"
          href="/popular-song-ranges/"
        >
          人気100曲の音域一覧
        </a>
      </div>

      <p class="notice">
        音源・ライブ版・フェイク・地声と裏声の扱いなどで、
        音域の集計方法が異なる場合があります。
        キミキーでは参照元に掲載された曲全体の最低音・最高音を
        音域比較の目安として使用しています。
      </p>
    </article>
  </main>
</body>
</html>
`
}

function createHubPage() {
  const url =
    `${SITE_URL}/popular-song-ranges/`

  const title =
    '人気J-POP100曲の音域一覧｜最低音・最高音を比較｜キミキー'

  const description =
    '人気・定番J-POP100曲の最低音と最高音を一覧で比較。アジカン、ELLEGARDEN、UVERworld、SUPER BEAVER、Eve、西野カナ、MISIAなどの音域を出典確認済みデータで掲載しています。'

  const links =
    verifiedSongs
      .map(
        song => `
          <a
            class="song-link"
            href="/songs/${song.slug}/"
          >
            <span>
              <strong>
                ${escapeHtml(song.title)}
              </strong>
              <br>
              <small>
                ${escapeHtml(song.artist)}
              </small>
            </span>

            <span>
              ${escapeHtml(song.lowLabel)}
              〜
              ${escapeHtml(song.highLabel)}
            </span>
          </a>
        `
      )
      .join('')

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >
  ${googleAnalyticsTag()}
  <title>${title}</title>
  <meta
    name="description"
    content="${description}"
  >
  <meta
    name="robots"
    content="index, follow"
  >
  <link
    rel="canonical"
    href="${url}"
  >
  <meta
    property="og:type"
    content="website"
  >
  <meta
    property="og:site_name"
    content="キミキー"
  >
  <meta
    property="og:title"
    content="${title}"
  >
  <meta
    property="og:description"
    content="${description}"
  >
  <meta
    property="og:url"
    content="${url}"
  >
  <meta
    property="og:image"
    content="${SITE_URL}/og-image.png"
  >
  <meta
    name="twitter:card"
    content="summary_large_image"
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

    <article class="card">
      <h1>
        人気J-POP100曲の音域一覧
      </h1>

      <p class="lead">
        検索需要の高いアーティストを中心に、
        出典を確認した100曲の最低音・最高音をまとめました。
        曲名を押すと個別の音域ページを確認できます。
      </p>

      <div class="song-list">
        ${links}
      </div>

      <div class="cta-grid">
        <a
          class="cta"
          href="/"
        >
          🎤 自分の音域を測る
        </a>

        <a
          class="cta secondary"
          href="/songs/"
        >
          全曲の音域一覧
        </a>
      </div>

      <p class="notice">
        音域は公開されている音域データを参照しています。
        音源・ライブ版・地声と裏声の扱いなどによって
        集計結果が異なる場合があります。
      </p>
    </article>
  </main>
</body>
</html>
`
}

fs.mkdirSync(
  songsDir,
  {
    recursive: true,
  }
)

for (const song of verifiedSongs) {
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

fs.rmSync(
  hubDir,
  {
    recursive: true,
    force: true,
  }
)

fs.mkdirSync(
  hubDir,
  {
    recursive: true,
  }
)

fs.writeFileSync(
  path.join(
    hubDir,
    'index.html'
  ),
  createHubPage(),
  'utf8'
)

const sitemapPath =
  path.join(
    publicDir,
    'sitemap.xml'
  )

let sitemap =
  fs.readFileSync(
    sitemapPath,
    'utf8'
  )

const urls = [
  `${SITE_URL}/popular-song-ranges/`,
  ...verifiedSongs.map(
    song =>
      `${SITE_URL}/songs/${song.slug}/`
  ),
]

const additions =
  urls
    .filter(
      url =>
        !sitemap.includes(
          `<loc>${url}</loc>`
        )
    )
    .map(
      url => `
  <url>
    <loc>${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')

if (
  additions &&
  sitemap.includes(
    '</urlset>'
  )
) {
  sitemap =
    sitemap.replace(
      '</urlset>',
      `${additions}\n</urlset>`
    )

  fs.writeFileSync(
    sitemapPath,
    sitemap,
    'utf8'
  )
}

console.log(
  `✅ Verified range pages: ${verifiedSongs.length}`
)
