// 出典確認済み音域 第23弾
// 曲名付き音域一覧で最低音・最高音を確認できた4曲を追加します。
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

export const VERIFIED_RANGE_BATCH_23 = [
  ...rows("Creepy Nuts", [
    ["顔役", "mid1B", "hiC", "https://keytube.net/artist/detail/262"],
  ]),

  ...rows("Da-iCE", [
    ["ハッシュ ハッシュ", "mid1F", "hiB", "https://keytube.net/artist/detail/765"],
  ]),

  ...rows("LiSA", [
    ["YES", "mid1G", "hiE", "https://keytube.net/artist/detail/22"],
  ]),

  ...rows("中島健人", [
    ["Fiction Love", "mid1C", "hiC", "https://keytube.net/artist/detail/13526"],
  ]),

]
