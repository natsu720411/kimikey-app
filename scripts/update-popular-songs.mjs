import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'
import { SONGS } from '../src/songs.js'


const __filename =
  fileURLToPath(import.meta.url)

const __dirname =
  path.dirname(__filename)

const rootDir =
  path.resolve(__dirname, '..')

const outputPath =
  path.join(
    rootDir,
    'public',
    'popular-songs.json'
  )


// ==========================================
// URL
// ==========================================

const DAM_URL =
  'https://www.clubdam.com/ranking/?version=pc'

const JOYSOUND_URL =
  'https://www.joysound.com/web/karaoke/ranking/all'


// ==========================================
// 表記揺れ対策
// ==========================================

function normalizeText(value) {

  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[！!]/g, '!')
    .replace(/[～〜]/g, '〜')
    .replace(/[・･]/g, '')
    .replace(/\s+/g, '')
    .replace(/[()（）]/g, '')
    .toLowerCase()
}


// ==========================================
// キミキー収録曲検索
// ==========================================

function findLocalSong(
  title,
  artist
) {

  const normalizedTitle =
    normalizeText(title)

  const normalizedArtist =
    normalizeText(artist)


  // 完全一致優先
  let match =
    SONGS.find(
      song =>
        normalizeText(
          song.title
        ) === normalizedTitle &&
        normalizeText(
          song.artist
        ) === normalizedArtist
    )


  if (match) {
    return match
  }


  // タイトル一致
  match =
    SONGS.find(
      song =>
        normalizeText(
          song.title
        ) === normalizedTitle
    )


  if (match) {
    return match
  }


  // 部分一致
  match =
    SONGS.find(
      song => {

        const localTitle =
          normalizeText(
            song.title
          )

        return (
          localTitle.includes(
            normalizedTitle
          ) ||
          normalizedTitle.includes(
            localTitle
          )
        )

      }
    )


  return match ?? null
}


// ==========================================
// HTML取得
// ==========================================

async function fetchHtml(url) {

  const response =
    await fetch(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 KimiKey Ranking Updater'
        }
      }
    )


  if (!response.ok) {

    throw new Error(
      `${url} : HTTP ${response.status}`
    )
  }


  return response.text()
}


// ==========================================
// DAM解析
// ==========================================

async function fetchDamRanking() {

  const html =
    await fetchHtml(
      DAM_URL
    )

  const $ =
    cheerio.load(html)

  const results = []


  $('a').each(
    (_, element) => {

      const text =
        $(element)
          .text()
          .replace(/\s+/g, ' ')
          .trim()


      const match =
        text.match(
          /^(\d+)\s+(.+?)\s+(.+)$/
        )


      if (!match) {
        return
      }


      const rank =
        Number(match[1])


      if (
        rank < 1 ||
        rank > 100
      ) {
        return
      }


      const fullText =
        match[2] +
        ' ' +
        match[3]


      results.push({
        rank,
        raw:
          fullText,
        source:
          'DAM'
      })

    }
  )


  return results
}


// ==========================================
// JOYSOUND解析
// ==========================================

async function fetchJoysoundRanking() {

  const html =
    await fetchHtml(
      JOYSOUND_URL
    )

  const $ =
    cheerio.load(html)

  const results = []


  $('a').each(
    (_, element) => {

      const text =
        $(element)
          .text()
          .replace(/\s+/g, ' ')
          .trim()


      const rankMatch =
        text.match(
          /^(\d+)\((?:\d+)位\)$/
        )


      if (!rankMatch) {
        return
      }


      const rank =
        Number(rankMatch[1])


      const nextText =
        $(element)
          .next()
          .text()
          .replace(/\s+/g, ' ')
          .trim()


      if (!nextText) {
        return
      }


      results.push({
        rank,
        raw:
          nextText,
        source:
          'JOYSOUND'
      })

    }
  )


  return results
}


// ==========================================
// 収録曲との照合
// ==========================================

function matchRankingEntry(
  raw,
  source,
  rank
) {

  let bestMatch = null


  for (
    const song of SONGS
  ) {

    const title =
      normalizeText(
        song.title
      )

    const artist =
      normalizeText(
        song.artist
      )

    const rawText =
      normalizeText(raw)


    const titleIncluded =
      rawText.includes(
        title
      )

    const artistIncluded =
      rawText.includes(
        artist
      )


    if (
      titleIncluded &&
      artistIncluded
    ) {

      bestMatch = song

      break
    }


    if (
      titleIncluded &&
      !bestMatch
    ) {

      bestMatch = song
    }

  }


  if (!bestMatch) {
    return null
  }


  return {
    title:
      bestMatch.title,

    artist:
      bestMatch.artist,

    source,

    rank
  }
}


// ==========================================
// メイン
// ==========================================

async function main() {

  console.log(
    '🎤 人気曲ランキング更新開始'
  )


  let dam = []
  let joysound = []


  try {

    dam =
      await fetchDamRanking()

    console.log(
      `DAM取得：${dam.length}件`
    )

  } catch (error) {

    console.error(
      'DAM取得失敗',
      error.message
    )
  }


  try {

    joysound =
      await fetchJoysoundRanking()

    console.log(
      `JOYSOUND取得：${joysound.length}件`
    )

  } catch (error) {

    console.error(
      'JOYSOUND取得失敗',
      error.message
    )
  }


  const matched = []


  for (
    const item of [
      ...dam,
      ...joysound
    ]
  ) {

    const result =
      matchRankingEntry(
        item.raw,
        item.source,
        item.rank
      )


    if (result) {
      matched.push(result)
    }

  }


  // ==========================================
  // 同じ曲をまとめる
  // ==========================================

  const map =
    new Map()


  for (
    const item of matched
  ) {

    const key =
      `${item.artist}|||${item.title}`


    if (
      !map.has(key)
    ) {

      map.set(
        key,
        {
          title:
            item.title,

          artist:
            item.artist,

          damRank:
            null,

          joysoundRank:
            null
        }
      )

    }


    const target =
      map.get(key)


    if (
      item.source ===
      'DAM'
    ) {

      target.damRank =
        item.rank

    }


    if (
      item.source ===
      'JOYSOUND'
    ) {

      target.joysoundRank =
        item.rank

    }

  }


  // ==========================================
  // 総合スコア
  // ==========================================

  const songs =
    [...map.values()]
      .map(
        song => {

          const damScore =
            song.damRank
              ? 101 -
                song.damRank
              : 0


          const joyScore =
            song.joysoundRank
              ? 101 -
                song.joysoundRank
              : 0


          return {
            ...song,

            score:
              damScore +
              joyScore
          }

        }
      )
      .sort(
        (a, b) =>
          b.score -
          a.score
      )
      .slice(
        0,
        10
      )


  // ==========================================
  // 取得失敗時の保険
  // ==========================================

  const fallback = [

    {
      title:
        'マリーゴールド',
      artist:
        'あいみょん'
    },

    {
      title:
        '怪獣の花唄',
      artist:
        'Vaundy'
    },

    {
      title:
        '好きすぎて滅!',
      artist:
        'M!LK'
    },

    {
      title:
        '残酷な天使のテーゼ',
      artist:
        '高橋洋子'
    },

    {
      title:
        '水平線',
      artist:
        'back number'
    },

    {
      title:
        'ダーリン',
      artist:
        'Mrs. GREEN APPLE'
    },

    {
      title:
        'サウダージ',
      artist:
        'ポルノグラフィティ'
    },

    {
      title:
        'ドライフラワー',
      artist:
        '優里'
    },

    {
      title:
        '高嶺の花子さん',
      artist:
        'back number'
    },

    {
      title:
        'IRIS OUT',
      artist:
        '米津玄師'
    }

  ]


  const finalSongs =
    songs.length >= 5
      ? songs
      : fallback


  const data = {

    updatedAt:
      new Date()
        .toISOString(),

    sources: [
      'DAM',
      'JOYSOUND'
    ],

    songs:
      finalSongs

  }


  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      data,
      null,
      2
    ),
    'utf8'
  )


  console.log(
    `✅ 人気曲${finalSongs.length}曲を書き出しました`
  )


  finalSongs.forEach(
    (song, index) => {

      console.log(
        `${index + 1}. ${song.title} / ${song.artist}`
      )

    }
  )

}


main()
  .catch(
    error => {

      console.error(
        error
      )

      process.exit(1)

    }
  )