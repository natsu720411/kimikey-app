import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')
const indexPath = path.join(rootDir, 'index.html')
const mainJsPath = path.join(rootDir, 'src', 'main.js')

const SITE_URL = 'https://kimikey-app.vercel.app'
const SOCIAL_IMAGE = `${SITE_URL}/pwa-512x512.png`

const INDEX_MARKER = '<!-- kimikey-ai-referral-growth -->'
const PUBLIC_META_MARKER = '<!-- kimikey-share-meta -->'
const MAIN_SHARE_MARKER = '<!-- kimikey-range-share -->'
const MAIN_FAQ_MARKER = '<!-- kimikey-trust-faq -->'
const MAIN_LOGIC_MARKER = '// kimikey-range-share-logic'

function walkIndexFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      walkIndexFiles(fullPath, results)
      continue
    }

    if (entry.isFile() && entry.name === 'index.html') {
      results.push(fullPath)
    }
  }

  return results
}

function enhanceRootIndex() {
  let html = fs.readFileSync(indexPath, 'utf8')

  if (html.includes(INDEX_MARKER)) {
    return
  }

  const faqSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'キミキーは無料で使えますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'キミキーはブラウザから無料で使える音域測定サイトです。マイクを使って現在の音程、最低音・最高音、快適音域を確認できます。',
        },
      },
      {
        '@type': 'Question',
        name: 'スマホでも声の音域を測れますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'マイク使用を許可できるスマートフォンのブラウザなら利用できます。アプリのインストールは不要です。',
        },
      },
      {
        '@type': 'Question',
        name: 'マイクの音声はサーバーに送信されますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'キミキーの音程解析はブラウザ内で行います。現在の実装には録音した音声ファイルをサーバーへアップロードする処理はありません。',
        },
      },
      {
        '@type': 'Question',
        name: '自分に合うカラオケキーも分かりますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '音域を測定して曲を選ぶと、登録された曲の最低音・最高音と比較して、おすすめキーの目安を確認できます。',
        },
      },
    ],
  }).replaceAll('<', '\\u003c')

  const headAddition = `
${INDEX_MARKER}
<meta property="og:image" content="${SOCIAL_IMAGE}">
<meta property="og:image:width" content="512">
<meta property="og:image:height" content="512">
<meta property="og:image:alt" content="キミキー - 無料の音域測定サイト">
<meta name="twitter:image" content="${SOCIAL_IMAGE}">
<script type="application/ld+json">${faqSchema}</script>
`

  if (!html.includes('</head>')) {
    throw new Error('index.html: </head> が見つかりません')
  }

  html = html.replace('</head>', `${headAddition}</head>`)

  const fallbackFaq = `
      <section
        aria-labelledby="kimikeyFaqTitle"
        style="margin-top:16px;padding:18px;background:#fff;border:1px solid #e6e8ef;border-radius:20px;text-align:left;"
      >
        <h2 id="kimikeyFaqTitle" style="margin:0 0 12px;font-size:20px;">キミキーについて</h2>
        <p style="margin:0 0 10px;line-height:1.8;"><strong>無料で使える？</strong><br>ブラウザから無料で利用できます。アプリのインストールも不要です。</p>
        <p style="margin:0 0 10px;line-height:1.8;"><strong>スマホでも測れる？</strong><br>マイクを許可できるブラウザなら、声の高さ・最低音・最高音を確認できます。</p>
        <p style="margin:0 0 10px;line-height:1.8;"><strong>マイク音声は送信される？</strong><br>音程解析はブラウザ内で行い、録音した音声ファイルをサーバーへアップロードする仕組みは使っていません。</p>
        <p style="margin:0;line-height:1.8;"><strong>何キー下げればいいか分かる？</strong><br>測定した音域と曲の音域を比較して、おすすめキーの目安を確認できます。</p>
      </section>
`

  if (!html.includes('</main>')) {
    throw new Error('index.html: </main> が見つかりません')
  }

  html = html.replace('</main>', `${fallbackFaq}\n    </main>`)
  fs.writeFileSync(indexPath, html, 'utf8')
}

function enhanceMainApp() {
  let source = fs.readFileSync(mainJsPath, 'utf8')

  if (!source.includes(MAIN_SHARE_MARKER)) {
    const shareSection = `

  ${MAIN_SHARE_MARKER}
  <section
    class="share-result-section"
    style="margin:0 0 14px;padding:16px;background:#fff;border:1px solid #e6e8ef;border-radius:20px;box-shadow:0 7px 24px rgba(0,0,0,.05);"
  >
    <button
      id="shareRangeButton"
      type="button"
      style="width:100%;padding:14px 16px;border:0;border-radius:14px;background:#111;color:#fff;font-size:15px;font-weight:800;"
    >
      🔗 音域結果をシェア
    </button>
    <p style="margin:8px 0 0;color:#888;font-size:11px;">
      測定した最低音・最高音とキミキーのURLを共有できます
    </p>
  </section>
`

    const resetNeedle = `

  <button
    id="resetRange"`

    if (!source.includes(resetNeedle)) {
      throw new Error('main.js: resetRange ボタン位置が見つかりません')
    }

    source = source.replace(resetNeedle, `${shareSection}${resetNeedle}`)
  }

  if (!source.includes(MAIN_FAQ_MARKER)) {
    const faqSection = `

  ${MAIN_FAQ_MARKER}
  <section
    class="song-section"
    aria-labelledby="kimikeyAboutTitle"
    style="text-align:left;"
  >
    <div class="section-heading">
      <span class="section-icon" aria-hidden="true">💡</span>
      <div>
        <h2 id="kimikeyAboutTitle">キミキーについて</h2>
        <p>音域測定を安心して使うためのよくある質問</p>
      </div>
    </div>

    <details style="margin:8px 0;padding:13px 14px;background:#fff;border:1px solid #e6e8ef;border-radius:14px;">
      <summary style="cursor:pointer;font-weight:800;">無料で使えますか？</summary>
      <p style="margin:9px 0 0;color:#666;line-height:1.7;">無料で使えます。ブラウザから利用でき、アプリのインストールは不要です。</p>
    </details>

    <details style="margin:8px 0;padding:13px 14px;background:#fff;border:1px solid #e6e8ef;border-radius:14px;">
      <summary style="cursor:pointer;font-weight:800;">スマホでも音域を測れますか？</summary>
      <p style="margin:9px 0 0;color:#666;line-height:1.7;">マイク使用を許可できるブラウザなら、現在の音程・最低音・最高音を確認できます。</p>
    </details>

    <details style="margin:8px 0;padding:13px 14px;background:#fff;border:1px solid #e6e8ef;border-radius:14px;">
      <summary style="cursor:pointer;font-weight:800;">マイク音声はサーバーに送られますか？</summary>
      <p style="margin:9px 0 0;color:#666;line-height:1.7;">音程解析はブラウザ内で行います。録音した音声ファイルをサーバーへアップロードする仕組みは使っていません。</p>
    </details>

    <details style="margin:8px 0;padding:13px 14px;background:#fff;border:1px solid #e6e8ef;border-radius:14px;">
      <summary style="cursor:pointer;font-weight:800;">自分に合うカラオケキーも分かりますか？</summary>
      <p style="margin:9px 0 0;color:#666;line-height:1.7;">音域を測って曲を選ぶと、曲の最低音・最高音と比較したおすすめキーの目安を確認できます。</p>
    </details>

    <nav class="song-browse-links" aria-label="キミキーの詳しい使い方" style="margin-top:12px;">
      <a class="song-browse-link" href="/voice-pitch-check/">声の高さを測る方法</a>
      <a class="song-browse-link" href="/karaoke-key-check/">自分に合うキーを調べる</a>
      <a class="song-browse-link" href="/vocal-range-table/">音域表を見る</a>
      <a class="song-browse-link" href="/vocal-range-check/">音域測定のやり方</a>
    </nav>
  </section>
`

    const footerNeedle = `

  <footer`

    if (!source.includes(footerNeedle)) {
      throw new Error('main.js: footer位置が見つかりません')
    }

    source = source.replace(footerNeedle, `${faqSection}${footerNeedle}`)
  }

  if (!source.includes(MAIN_LOGIC_MARKER)) {
    const shareLogic = `

${MAIN_LOGIC_MARKER}
const shareRangeButton = document.querySelector('#shareRangeButton')

shareRangeButton?.addEventListener('click', async () => {
  const limitLow = document.querySelector('#limitLowestNote')?.textContent?.trim()
  const limitHigh = document.querySelector('#limitHighestNote')?.textContent?.trim()
  const comfortLow = document.querySelector('#comfortLowestNote')?.textContent?.trim()
  const comfortHigh = document.querySelector('#comfortHighestNote')?.textContent?.trim()

  const ranges = []

  if (limitLow && limitHigh && limitLow !== '---' && limitHigh !== '---') {
    ranges.push('限界音域 ' + limitLow + '〜' + limitHigh)
  }

  if (comfortLow && comfortHigh && comfortLow !== '---' && comfortHigh !== '---') {
    ranges.push('快適音域 ' + comfortLow + '〜' + comfortHigh)
  }

  if (!ranges.length) {
    window.alert('まず音域を測定してください')
    return
  }

  const text = 'キミキーで声の音域を測ってみた！\\n' + ranges.join('\\n')
  const shareUrl = window.location.origin + '/'
  let method = 'clipboard'

  try {
    if (navigator.share) {
      method = 'web_share'
      await navigator.share({
        title: 'キミキー｜無料の音域測定サイト',
        text,
        url: shareUrl,
      })
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text + '\\n' + shareUrl)
      const previous = shareRangeButton.textContent
      shareRangeButton.textContent = '✅ 結果とURLをコピーしました'
      window.setTimeout(() => {
        shareRangeButton.textContent = previous
      }, 1800)
    } else {
      window.prompt('この内容をコピーして共有してください', text + '\\n' + shareUrl)
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'share_range_result', {
        method,
      })
    }
  } catch (error) {
    if (error?.name !== 'AbortError') {
      console.error(error)
    }
  }
})
`

    const logicNeedle = `// ==========================================\n// ピッチ練習ページから来た場合`

    if (!source.includes(logicNeedle)) {
      throw new Error('main.js: 初期化コード位置が見つかりません')
    }

    source = source.replace(logicNeedle, `${shareLogic}\n\n${logicNeedle}`)
  }

  fs.writeFileSync(mainJsPath, source, 'utf8')
}

function enhancePublicPages() {
  const pages = walkIndexFiles(publicDir)

  for (const filePath of pages) {
    let html = fs.readFileSync(filePath, 'utf8')

    if (html.includes(PUBLIC_META_MARKER) || !html.includes('</head>')) {
      continue
    }

    const meta = `
${PUBLIC_META_MARKER}
<meta property="og:image" content="${SOCIAL_IMAGE}">
<meta property="og:image:width" content="512">
<meta property="og:image:height" content="512">
<meta property="og:image:alt" content="キミキー - 声の音域とカラオケキーを調べる">
<meta name="twitter:image" content="${SOCIAL_IMAGE}">
`

    html = html.replace('</head>', `${meta}</head>`)
    fs.writeFileSync(filePath, html, 'utf8')
  }
}

function writeLlmsTxt() {
  const content = `# キミキー

> キミキーは、スマートフォンやパソコンのマイクを使って、声の音程・最低音・最高音・快適音域を確認できる日本語の無料Webアプリです。測定した音域とJ-POPの曲別音域を比較して、歌いやすい曲やカラオケのおすすめキーの目安も確認できます。

Canonical site: ${SITE_URL}/
Language: Japanese
Access: Free, browser-based, no app installation required

## 主な機能
- マイクで現在の声の音程を表示
- 限界音域と快適音域を分けて測定
- J-POPの最低音・最高音を曲別に確認
- 測定した音域に合う曲を提案
- 曲ごとのカラオケキー調整の目安を表示
- ピアノ鍵盤と音程練習

## 主要ページ
- 音域測定: ${SITE_URL}/
- 声の高さを測る方法: ${SITE_URL}/voice-pitch-check/
- 自分の音域を調べる方法: ${SITE_URL}/vocal-range-check/
- カラオケ音域表: ${SITE_URL}/vocal-range-table/
- 自分に合うカラオケキー: ${SITE_URL}/karaoke-key-check/
- カラオケのキーの合わせ方: ${SITE_URL}/karaoke-key-guide/
- 人気カラオケ曲: ${SITE_URL}/popular/
- 曲別音域一覧: ${SITE_URL}/songs/
- アーティスト別音域: ${SITE_URL}/artists/
- 音域から曲を探す: ${SITE_URL}/guides/

## マイクとプライバシー
音程解析はWeb Audio APIを利用してブラウザ内で行います。現在の実装には、録音した音声ファイルをサーバーへアップロードする処理はありません。

## データについて
楽曲の音域やおすすめキーは、登録された音域データを基にした目安です。声質、歌唱方法、裏声の使い方、音源などによって実際の歌いやすさは変わります。
`

  fs.writeFileSync(path.join(publicDir, 'llms.txt'), content, 'utf8')
}

enhanceRootIndex()
enhanceMainApp()
enhancePublicPages()
writeLlmsTxt()

console.log('✅ AI紹介・共有導線・OGPメタ情報を強化しました')
