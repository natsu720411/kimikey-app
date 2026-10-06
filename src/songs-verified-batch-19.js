// 出典確認済み音域 第19弾
// 曲単位の公開情報で最低音・最高音を確認できた26曲を追加します。
// 無理に100曲へ合わせず、確認できた曲だけを音域の目安として掲載します。

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

export const VERIFIED_RANGE_BATCH_19 = [
  ...rows("スピッツ", [
    ["優しいあの子", "mid1G", "hiA", "https://keytube.net/song/detail/333"],
    ["魔法のコトバ", "mid1F", "hiA", "https://keytube.net/song/detail/320"],
    ["みなと", "mid1G#", "hiA", "https://keytube.net/song/detail/329"],
    ["運命の人", "mid1F#", "hiB", "https://keytube.net/song/detail/309"],
    ["正夢", "mid1E", "hiA", "https://keytube.net/song/detail/296"],
    ["愛のことば", "mid1D", "hiA#", "https://keytube.net/song/detail/289"],
  ]),

  ...rows("B'z", [
    ["孤独のRunaway", "mid1E", "hiB", "https://keytube.net/song/detail/42979"],
    ["愛のバクダン", "mid1F#", "hiD#", "https://keytube.net/song/detail/89713"],
    ["C'mon", "mid1D", "hiA#", "https://keytube.net/song/detail/914"],
    ["消えない虹", "mid1C", "hiA", "https://keytube.net/song/detail/42965"],
    ["TIME", "mid1G", "hiB", "https://keytube.net/song/detail/42971"],
    ["HOME", "mid1C", "hiB", "https://keytube.net/song/detail/16468"],
    ["YOU & I", "mid1F", "hiC", "https://keytube.net/song/detail/42982"],
    ["衝動", "mid1G", "hiC", "https://keytube.net/song/detail/48085"],
  ]),

  ...rows("HANA", [
    ["Burning Flower", "mid1F", "hiF", "https://keytube.net/song/detail/138714"],
    ["Drop", "mid1F", "hiA#", "https://keytube.net/song/detail/118873"],
  ]),

  ...rows("Snow Man", [
    ["We'll go together", "mid1D", "hiC#", "https://keytube.net/song/detail/150479"],
    ["LOVE TRIGGER", "mid1C#", "hiC#", "https://keytube.net/song/detail/150444"],
    ["SBY", "mid1D#", "hiA", "https://keytube.net/song/detail/136818"],
    ["カリスマックス", "mid1A#", "hiD", "https://keytube.net/song/detail/144792"],
    ["BREAKOUT", "mid1C", "hiC", "https://keytube.net/song/detail/168171"],
  ]),

  ...rows("NiziU", [
    ["Take a picture", "mid1G#", "hiD#", "https://keytube.net/song/detail/53843"],
    ["Poppin' Shakin'", "mid2B", "hiC#", "https://keytube.net/song/detail/51961"],
    ["SWEET NONFICTION", "mid1G#", "hiF", "https://keytube.net/song/detail/108828"],
    ["Paradise", "mid1F#", "hiF", "https://keytube.net/song/detail/109157"],
    ["Rise Up", "mid1G", "hiD#", "https://keytube.net/song/detail/114231"],
  ]),

]
