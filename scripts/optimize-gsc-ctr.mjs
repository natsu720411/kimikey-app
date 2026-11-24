import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { VERIFIED_RANGE_ALL } from '../src/songs-verified-all.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const SITE = 'https://kimikey-app.vercel.app'
const escapeHtml = value => String(value ?? '').replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

function exactlyOne(html, pattern, replacement, label) {
  const all = [...html.matchAll(new RegExp(pattern.source, 'g'))]
  if (all.length !== 1) throw new Error('Expected one ' + label + ', got ' + all.length)
  return html.replace(pattern, replacement)
}

const configs = [
  {
    slug: 'happy-birthday-41',
    artist: 'back number',
    song: 'HAPPY BIRTHDAY',
    id: 41,
    expectedLow: 'lowG#',
    expectedHigh: 'hiB',
    lowNote: 'G#2',
    highNote: 'B4',
    songSource: 'https://keytube.net/song/detail/25327',
    title: 'ハッピーバースデーの音域｜back number「HAPPY BIRTHDAY」最高音hiB',
    description: 'back number「HAPPY BIRTHDAY（ハッピーバースデー）」の音域は最低音lowG#（G#2）〜最高音hiB（B4）。キー調整のポイントと、地声・裏声の解釈の違いも紹介します。',
    heading: 'HAPPY BIRTHDAY（back number）の音域｜ハッピーバースデーの最高音・最低音',
    answerLabel: 'back number「HAPPY BIRTHDAY（ハッピーバースデー）」',
    legacyMarkers: [
      'gsc-opportunity-happy-birthday',
      'gsc-happy-birthday-intent-faq-20261026',
      'gsc-intent-clarity-202611',
    ],
    article: [
      '<h2>「HAPPY BIRTHDAY」の音域と、歌いやすいキーの考え方</h2>',
      '<p>このページはback numberの楽曲「HAPPY BIRTHDAY」の音域です。<a href="https://keytube.net/song/detail/25327" target="_blank" rel="noopener noreferrer nofollow">KeyTubeの曲別分析</a>に掲載されている最低音lowG#・最高音hiBを基準にしています。</p>',
      '<h3>地声・裏声の最高音も知りたい場合は？</h3>',
      '<p>音域の調査方法によって値が異なります。たとえば<a href="https://stepupkaraoke.com/song-introduction/back-number/happy-birthday" target="_blank" rel="noopener noreferrer nofollow">別の音域解説</a>では最低音lowF#・地声最高音mid2G#・裏声最高音hiBとして区分されています。ここに掲載したlowG#〜hiBはKeyTubeの集計に基づく目安であり、地声だけの音域とは限りません。</p>',
      '<h3>原曲キーがきついときは？</h3>',
      '<p>キーを下げると最高音だけでなく最低音も同じだけ下がります。この曲は低音側も広く使うため、<a href="/?song=41">自分の音域と照らしておすすめキーを確認</a>するときは、最高音と最低音の両方を見比べましょう。</p>',
      '<h3>誕生日の定番曲「Happy Birthday to You」と同じ曲ですか？</h3>',
      '<p>いいえ。back number「HAPPY BIRTHDAY」と、誕生日に歌う定番曲「Happy Birthday to You」は別の曲です。このページはback numberの楽曲を対象にしています。</p>',
      '<p><a href="/artists/back-number/">back numberの別の曲の音域を見る</a> ・ <a href="/vocal-range-table/">low・mid・hi表記の意味を調べる</a></p>',
    ],
  },
  {
    slug: 'song-446',
    artist: 'Vaundy',
    song: '花占い',
    id: 446,
    expectedLow: 'mid1F',
    expectedHigh: 'hiD',
    lowNote: 'F3',
    highNote: 'D5',
    songSource: 'https://keytube.net/song/detail/57677',
    title: '花占い（Vaundy）の音域｜最高音hiD・最低音mid1F',
    description: 'Vaundy「花占い」の音域は最低音mid1F（F3）〜最高音hiD（D5）。自分の音域との比べ方、キーを下げる際の注意点と参照元を掲載しています。',
    heading: '花占い（Vaundy）の音域｜最高音・最低音とキー調整',
    answerLabel: 'Vaundy「花占い」',
    legacyMarkers: ['gsc-opportunity-hanauranai'],
    article: [
      '<h2>Vaundy「花占い」をカラオケで歌うときのポイント</h2>',
      '<p><a href="https://keytube.net/song/detail/57677" target="_blank" rel="noopener noreferrer nofollow">KeyTubeの「花占い」曲別分析</a>では最低音mid1F・最高音hiDです。集計上の最高音には、地声・裏声・フェイクなどがどのように扱われたかによって差が出るため、全体の音域の目安としてご覧ください。</p>',
      '<h3>原曲キーが高く感じたら？</h3>',
      '<p>キーを下げると最高音も最低音も下がります。<a href="/?song=446">自分の声の音域と比較</a>して、最高音hiDだけでなく最低音mid1Fも無理なく出せるか確認してください。</p>',
      '<p><a href="/artists/vaundy/">Vaundyの他の曲を探す</a> ・ <a href="/hia-frequency/">hiAなどの音域表記と周波数を調べる</a></p>',
    ],
  },
]

const sourceToLabel = new Map(VERIFIED_RANGE_ALL.map(song => [song.artist + '\u0000' + song.title, song]))

for (const config of configs) {
  const filePath = path.join(publicDir, 'songs', config.slug, 'index.html')
  if (!fs.existsSync(filePath)) throw new Error('SEO target missing: ' + filePath)
  const verified = sourceToLabel.get(config.artist + '\u0000' + config.song)
  if (!verified || verified.lowLabel !== config.expectedLow || verified.highLabel !== config.expectedHigh)
    throw new Error('Verified song labels changed, review SEO copy: ' + config.song)
  let html = fs.readFileSync(filePath, 'utf8')
  const canonical = SITE + '/songs/' + config.slug + '/'
  if (!html.includes('<link rel="canonical" href="' + canonical + '">'))
    throw new Error('Canonical changed for ' + config.slug)

  // Consolidate legacy, near-duplicate keyword paragraphs into one useful answer section.
  for (const marker of config.legacyMarkers) {
    const re = new RegExp('<!-- ' + marker + ' -->\\s*<section\\b[^>]*>[\\s\\S]*?<\\/section>\\s*', 'g')
    const matches = [...html.matchAll(re)]
    if (matches.length !== 1) throw new Error('Legacy SEO section changed: ' + marker + ', count=' + matches.length)
    html = html.replace(re, '')
  }

  html = exactlyOne(html, /<title>[\s\S]*?<\/title>/, '<title>' + escapeHtml(config.title) + '</title>', 'title')
  html = exactlyOne(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    '<meta name="description" content="' + escapeHtml(config.description) + '">', 'description')
  html = exactlyOne(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    '<meta property="og:title" content="' + escapeHtml(config.title) + '">', 'og:title')
  html = exactlyOne(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    '<meta property="og:description" content="' + escapeHtml(config.description) + '">', 'og:description')

  const referenceFromData = 'href="' + verified.rangeSource + '"'
  const updatedReference = 'href="' + config.songSource + '"'
  if (html.includes(referenceFromData)) {
    html = html.replace(referenceFromData, updatedReference)
  } else if (!html.includes(updatedReference)) {
    throw new Error('Song-specific source missing from ' + config.slug)
  }

  const shortAnswer = '<div class="gsc-quick-answer" aria-label="最低音と最高音の早見表">'
    + '<p class="gsc-answer-label">' + escapeHtml(config.answerLabel) + ' の音域</p>'
    + '<p><strong>最低音 ' + escapeHtml(verified.lowLabel) + '（' + config.lowNote + '）'
    + ' ／ 最高音 ' + escapeHtml(verified.highLabel) + '（' + config.highNote + '）</strong></p>'
    + '<p class="gsc-answer-small">音域は参照元の曲別データに基づく目安です。歌い方や地声・裏声の扱いで変わる場合があります。</p>'
    + '<a href="/?song=' + config.id + '">🎤 この曲と自分の音域を比較する</a>'
    + '</div>'
  html = exactlyOne(html, /<h1[^>]*>[\s\S]*?<\/h1>/,
    '<h1>' + escapeHtml(config.heading) + '</h1>' + shortAnswer, 'h1')
  const faq = '<section class="gsc-song-answers" aria-label="音域とカラオケの解説">'
    + config.article.join('\n') + '</section>\n'
  const similar = '<!-- similar-range-songs -->'
  if (!html.includes(similar)) throw new Error('Expected similar-range links for ' + config.slug)
  html = html.replace(similar, faq + similar)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'キミキー', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: '曲の音域一覧', item: SITE + '/song-range-index/' },
      { '@type': 'ListItem', position: 3, name: config.answerLabel + 'の音域', item: canonical },
    ],
  }
  const css = '.gsc-quick-answer{margin:20px 0 16px;padding:18px;border:1px solid #dfe5f3;border-radius:14px;background:#f7f9ff}'
    + '.gsc-quick-answer p{margin:0 0 10px}.gsc-quick-answer strong{font-size:clamp(16px,3vw,23px)}'
    + '.gsc-answer-label{font-weight:700}.gsc-quick-answer .gsc-answer-small{font-size:13px;color:#5c6471}'
    + '.gsc-quick-answer a{display:inline-block;margin-top:4px;padding:9px 13px;border-radius:10px;background:#294e96;color:#fff;text-decoration:none}'
    + '.gsc-song-answers{margin-top:24px}.gsc-song-answers h2{margin:12px 0}.gsc-song-answers h3{margin:18px 0 6px}'
  if (!html.includes('</style>')) throw new Error('Style block missing: ' + config.slug)
  html = html.replace('</style>', css + '</style>')
  html = html.replace('</head>',
    '<script type="application/ld+json">' + JSON.stringify(schema) + '</script></head>')

  fs.writeFileSync(filePath, html, 'utf8')
  console.log('GSC search-intent SEO ready: ' + config.slug + ', ' + config.expectedLow + ' to ' + config.expectedHigh)
}
