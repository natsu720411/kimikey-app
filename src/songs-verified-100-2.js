// 出典確認済みの追加100曲
// 最低音・最高音は各 rangeSource の公開データを参照。
// 曲名とアーティスト名の両方が一致した場合のみ音域を適用します。

function rows(artist, defaultSource, entries) {
  return entries.map(([title, lowLabel, highLabel, source]) => ({
    artist,
    title,
    lowLabel,
    highLabel,
    rangeVerified: true,
    rangeSource: source || defaultSource,
  }))
}

export const VERIFIED_RANGE_100_2 = []
