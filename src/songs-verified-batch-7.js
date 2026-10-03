// 出典確認済みの人気曲 第7弾
// 第7弾は100曲に無理に合わせず、公開情報で最低音・最高音を確認できた曲だけを追加します。
// 参照元によって地声・裏声・フェイクの扱いが異なるため、各 rangeSource の値を音域の目安として採用します。

function rows(artist, source, entries) {
  return entries.map(([title, lowLabel, highLabel, customSource]) => ({
    artist,
    title,
    lowLabel,
    highLabel,
    rangeVerified: true,
    rangeSource: customSource || source,
  }))
}

export const VERIFIED_RANGE_BATCH_7 = [
  ...rows('THE BLUE HEARTS', 'https://w.atwiki.jp/saikouon_dokoda/pages/209.html', [
    ['リンダ リンダ', 'mid1B', 'mid2G'],
    ['TRAIN-TRAIN', 'mid1G#', 'mid2F#'],
    ['情熱の薔薇', 'mid1F', 'mid2G'],
    ['1000のバイオリン', 'mid2A', 'mid2F#'],
    ['人にやさしく', 'mid1C#', 'mid2F#'],
    ['青空', 'mid1E', 'mid2F#'],
    ['終わらない歌', 'mid1G#', 'mid2E'],
    ['夢', 'mid1F#', 'mid2F#'],
    ['ラブレター', 'mid1D', 'mid2F'],
    ['キスしてほしい', 'mid1E', 'mid2F#'],
  ]),

  ...rows('My Hair is Bad', 'https://w.atwiki.jp/saikouon_dokoda/pages/1419.html', [
    ['真赤', 'mid1D#', 'mid2G#'],
    ['告白', 'mid1F', 'mid2G#'],
    ['歓声をさがして', 'mid1G', 'hiA#'],
    ['元彼氏として', 'mid1D#', 'mid2F#'],
    ['恋人ができたんだ', 'mid1F#', 'mid2G#'],
    ['接吻とフレンド', 'mid1G#', 'mid2F#'],
    ['いつか結婚しても', 'mid1C#', 'mid2F#'],
    ['ドラマみたいだ', 'mid1F#', 'hiA#', 'https://vocal-range.com/archives/post-7163.html'],
  ]),

  ...rows('BTS', 'https://keytube.net/artist/detail/4004', [
    ['Dynamite', 'mid1F#', 'hiD#'],
    ['Butter', 'mid1E', 'hiC'],
    ['Permission to Dance', 'mid1E', 'hiC#'],
    ['DNA', 'mid1C#', 'hiC'],
    ['Boy With Luv feat. Halsey', 'mid1E', 'hiB'],
    ['FAKE LOVE', 'mid1D#', 'hiC'],
    ['MIC Drop', 'mid1A#', 'hiB'],
  ]),

  ...rows('EXILE', 'https://w.atwiki.jp/saikouon_dokoda/pages/163.html', [
    ['道', 'mid1D', 'hiA'],
    ['Lovers Again', 'mid1D#', 'mid2G#'],
    ['Ti Amo', 'mid1B', 'hiA'],
    ['Choo Choo TRAIN', 'mid1F', 'mid2G#'],
    ['Rising Sun', 'mid1C', 'hiA'],
    ['ただ…逢いたくて', 'mid1A', 'hiA'],
    ['I Wish For You', 'mid1F#', 'hiB'],
    ['Someday', 'mid1F', 'hiA#'],
    ['もっと強く', 'mid1A', 'hiD'],
    ["Each Other's Way 〜旅の途中〜", 'mid1D#', 'hiA#'],
  ]),

  ...rows('BLACKPINK', 'https://keytube.net/', [
    ["As If It's Your Last", 'mid1F', 'hiC#', 'https://keytube.net/song/detail/1025'],
    ['Playing with Fire', 'mid1G', 'hiE', 'https://keytube.net/song/detail/1023'],
  ]),
]
