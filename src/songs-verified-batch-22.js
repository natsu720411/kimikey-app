// 出典確認済み音域 第22弾
// 曲単位ページまたは曲名付き一覧で最低音・最高音を確認できた16曲を追加します。
// 地声・裏声・解析手法の扱いは参照元ごとに異なるため、音域の目安として扱います。

function rows(artist, entries) {
  return entries.map(([title, lowLabel, highLabel, rangeSource]) => ({
    artist,
    title,
    lowLabel,
    highLabel,
    rangeVerified: true,
    rangeSource,
  }))
}

export const VERIFIED_RANGE_BATCH_22 = [
  ...rows("ILLIT", [
    ["Magnetic", "mid1G#", "hiA#", "https://w.atwiki.jp/kk0201kk0714/pages/3035.html"],
  ]),

  ...rows("LE SSERAFIM", [
    ["CRAZY", "mid1E", "hiB", "https://w.atwiki.jp/kk0201kk0714/pages/4769.html"],
  ]),

  ...rows("King & Prince", [
    ["moooove!!", "mid1C", "hiB", "https://keytube.net/song/detail/112677"],
    ["halfmoon", "mid1D", "mid2F#", "https://keytube.net/song/detail/112805"],
  ]),

  ...rows("iLiFE!", [
    ["きゃわぽっぴんどぅー", "mid1G", "hiF", "https://keytube.net/artist/detail/10830"],
    ["アイドルライフメガパック", "mid2A#", "hiD#", "https://keytube.net/artist/detail/10830"],
  ]),

  ...rows("ATEEZ", [
    ["BAD", "mid1F#", "hiC", "https://keytube.net/song/detail/182775"],
  ]),

  ...rows("Kvi Baba", [
    ["BPM (feat. KREVA)", "mid1D", "mid2G#", "https://keytube.net/song/detail/176652"],
  ]),

  ...rows("LANA", [
    ["Truth in the dark", "mid1E", "hiF#", "https://keytube.net/artist/detail/12096"],
    ["翼の折れたエンジェル", "mid2B", "hiC#", "https://keytube.net/artist/detail/12096"],
  ]),

  ...rows("Kis-My-Ft2", [
    ["My Affection", "mid1C", "hiA#", "https://keytube.net/artist/detail/9287"],
  ]),

  ...rows("Perfume", [
    ["コールドスリープ", "mid2C", "hiG", "https://keytube.net/artist/detail/93"],
  ]),

  ...rows("Ayase", [
    ["うるさ", "lowG", "mid2D#", "https://keytube.net/ranking/detail/50"],
  ]),

  ...rows("JI BLUE, JO1 & INI", [
    ["景色", "mid1B", "hiB", "https://keytube.net/ranking/detail/50"],
  ]),

  ...rows("BMSG STRIKERS", [
    ["Standing Here", "lowF", "hiE", "https://keytube.net/song/detail/180169"],
  ]),

  ...rows("大森元貴", [
    ["灰色", "mid1G", "hiE", "https://keytube.net/artist/detail/7384"],
  ]),

]
