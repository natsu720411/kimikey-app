// 出典確認済みの人気曲 第8弾
// 公開された曲単位の音域情報を確認できた曲だけを追加します。
// hihi帯（A5以上）も正しく扱えるようにしています。

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

export const VERIFIED_RANGE_BATCH_8 = [
  ...rows('BTS', 'https://singingcarrots.com/artist-range?artist=BTS', [
    ['Spring Day', 'mid2A#', 'hihiA#', 'https://www.musicnotes.com/sheetmusic/mtd.asp?ppn=MN0174508'],
    ['Life Goes On', 'mid1C', 'hiG#', 'https://singingcarrots.com/song?song=bts-life-goes-on'],
    ['Yet To Come', 'mid2G#', 'hihiA#', 'https://singingcarrots.com/song?song=bts-yet-to-come'],
  ]),

  ...rows('TWICE', 'https://singingcarrots.com/artist-range?artist=Twice', [
    ['Feel Special', 'mid1G#', 'hiC#', 'https://www.musicnotes.com/sheetmusic/twice/feel-special/MN0202213'],
    ['YES or YES', 'mid2A', 'hiD#', 'https://www.musicnotes.com/sheetmusic/twice/yes-or-yes/MN0202767'],
  ]),

  ...rows('BLACKPINK', 'https://singingcarrots.com/artist-range?artist=BLACKPINK', [
    ['Kill This Love', 'mid2C', 'hiD', 'https://singingcarrots.com/song?song=blackpink-kill-this-love'],
    ['Lovesick Girls', 'mid1G#', 'hiD#', 'https://singingcarrots.com/song?song=blackpink-lovesick-girls'],
  ]),
]
