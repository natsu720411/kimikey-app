// 出典確認済み音域 第21弾
// 曲単位の公開情報または音域一覧で最低音・最高音を確認できた33曲を追加します。
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

export const VERIFIED_RANGE_BATCH_21 = [
  ...rows("FRUITS ZIPPER", [
    ["NEW KAWAII", "mid1G#", "hiF", "https://keytube.net/song/detail/109244"],
    ["かがみ", "mid1G", "hiE", "https://keytube.net/song/detail/161129"],
  ]),

  ...rows("CANDY TUNE", [
    ["倍倍FIGHT!", "mid1G#", "hiD#", "https://keytube.net/song/detail/161721"],
    ["キス・ミー・パティシエ", "mid2A#", "hiC", "https://keytube.net/song/detail/161719"],
  ]),

  ...rows("ILLIT", [
    ["Almond Chocolate", "mid1F", "hiD", "https://keytube.net/song/detail/128807"],
  ]),

  ...rows("M!LK", [
    ["イイじゃん", "lowG#", "hiA", "https://w.atwiki.jp/saikouon_dokoda/pages/1245.html"],
  ]),

  ...rows("TWICE", [
    ["Hare Hare", "mid1G", "hiE", "https://keytube.net/song/detail/107319"],
  ]),

  ...rows("嵐", [
    ["Happiness", "mid1D", "hiA#", "https://keytube.net/song/detail/3180"],
  ]),

  ...rows("aespa", [
    ["Supernova", "mid1G", "hiC", "https://keytube.net/song/detail/114312"],
    ["Whiplash", "mid1G", "hiC#", "https://keytube.net/song/detail/115908"],
    ["Armageddon", "mid2A", "hiD", "https://keytube.net/song/detail/159843"],
  ]),

  ...rows("ロクデナシ", [
    ["愛が灯る", "mid1G#", "hihiA", "https://keytube.net/song/detail/106713"],
  ]),

  ...rows("Kiroro", [
    ["未来へ", "mid1G", "hiD", "https://keytube.net/song/detail/4871"],
    ["長い間", "mid2A#", "hiC", "https://keytube.net/song/detail/20159"],
  ]),

  ...rows("imase", [
    ["NIGHT DANCER", "mid1A#", "hiD#", "https://keytube.net/song/detail/113535"],
    ["Nagisa", "mid1F", "mid1G#", "https://keytube.net/song/detail/113540"],
    ["ユートピア", "lowF", "hiF#", "https://keytube.net/song/detail/101548"],
  ]),

  ...rows("DECO*27", [
    ["テレパシ", "mid1G", "hiD", "https://keytube.net/song/detail/126078"],
    ["モニタリング", "mid2A", "hihiA", "https://w.atwiki.jp/saikouon_dokoda/pages/472.html"],
  ]),

  ...rows("チャットモンチー", [
    ["風吹けば恋", "mid2F", "hiD", "https://w.atwiki.jp/saikouon_dokoda/pages/371.html"],
    ["シャングリラ", "mid2C", "hiD#", "https://w.atwiki.jp/saikouon_dokoda/pages/371.html"],
  ]),

  ...rows("TOMOO", [
    ["Super Ball", "mid1F", "hiC#", "https://keytube.net/song/detail/103938"],
    ["Ginger", "mid1F", "hiC#", "https://keytube.net/song/detail/87194"],
    ["Present", "mid1E", "hiC", "https://keytube.net/song/detail/157498"],
  ]),

  ...rows("Number_i", [
    ["BON", "lowG#", "mid2F", "https://utastep.com/songs/bon"],
  ]),

  ...rows("こっちのけんと", [
    ["もういいよ", "lowF#", "hiA", "https://keytube.net/song/detail/116080"],
  ]),

  ...rows("友成空", [
    ["睨めっ娘", "mid1A", "hiA", "https://vocal-range.com/archives/post-13543.html"],
  ]),

  ...rows("LE SSERAFIM", [
    ["Perfect Night", "mid2A", "hiC", "https://w.atwiki.jp/saikouon_dokoda/pages/1219.html"],
  ]),

  ...rows("SMAP", [
    ["世界に一つだけの花", "mid1E", "mid2F#", "https://w.atwiki.jp/saikouon_dokoda/pages/225.html"],
    ["夜空ノムコウ", "mid1F", "mid2G", "https://w.atwiki.jp/saikouon_dokoda/pages/225.html"],
  ]),

  ...rows("尾崎豊", [
    ["I LOVE YOU", "mid1E", "mid2F#", "https://w.atwiki.jp/saikouon_dokoda/pages/171.html"],
    ["卒業", "mid1E", "hiA", "https://w.atwiki.jp/saikouon_dokoda/pages/171.html"],
  ]),

  ...rows("新しい学校のリーダーズ", [
    ["Suki Lie", "mid2A", "hiB", "https://keytube.net/song/detail/111818"],
  ]),

]
