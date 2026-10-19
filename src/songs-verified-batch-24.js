// 出典確認済み音域 第24弾
// 2026年の人気新曲から、公開情報で最低音・最高音を確認できた11曲を追加します。
// 地声・裏声・フェイク・解析手法の扱いは参照元ごとに異なるため、音域の目安として扱います。

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

export const VERIFIED_RANGE_BATCH_24 = [
  ...rows("Ayumu Imazu", [
    ["結び", "mid1B", "hiB", "https://keytube.net/song/detail/193170"],
  ]),

  ...rows("YAO", [
    ["ありふれた世界の果てに (feat. Awich, CHICO CARLITO, ONE OK ROCK & Paledusk)", "mid1E", "hiC#", "https://keytube.net/song/detail/189921"],
  ]),

  ...rows("KAITO", [
    ["swim?", "mid1C#", "hiA#", "https://keytube.net/song/detail/193169"],
  ]),

  ...rows("ずっと真夜中でいいのに。", [
    ["あかねさす頃", "mid2A", "hiE", "https://keytube.net/song/detail/193559"],
  ]),

  ...rows("RADWIMPS", [
    ["夕星-ゆうづつ-", "mid1A", "hiA", "https://w.atwiki.jp/saikouon_dokoda/pages/344.html"],
  ]),

  ...rows("MAZZEL × STARGLOW", [
    ["Nameless MythS", "mid1C#", "hiA#", "https://keytube.net/song/detail/192572"],
  ]),

  ...rows("CANDY TUNE", [
    ["総意♡So Free", "mid2A", "hiD", "https://keytube.net/song/detail/192390"],
  ]),

  ...rows("日向坂46", [
    ["イチャイチャ虫", "mid2B", "hiC#", "https://keytube.net/song/detail/189855"],
  ]),

  ...rows("超ときめき♡宣伝部", [
    ["大盛りハッピー", "mid2A#", "hiD#", "https://keytube.net/artist/detail/4782"],
  ]),

  ...rows("OWV", [
    ["Lovey-Dovey", "mid2A", "hiD", "https://keytube.net/artist/detail/5118"],
  ]),

  ...rows("櫻坂46", [
    ["愛MUST BE", "mid1G", "hiD", "https://w.atwiki.jp/saikouon_dokoda/pages/1054.html"],
  ]),

]
