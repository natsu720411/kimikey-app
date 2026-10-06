// 出典確認済み音域 第13弾
// 検索カタログ第2弾から、曲単位で最低音・最高音を確認できた100曲を追加します。
// 地声・裏声・フェイク等の扱いは参照元ごとに異なるため、音域の目安として扱います。

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

export const VERIFIED_RANGE_BATCH_13 = [
  ...rows("中島みゆき", "https://w.atwiki.jp/saikouon_dokoda/pages/357.html", [
    ["糸", "mid1F", "hiA#"],
    ["時代", "mid1F", "hiA#"],
    ["地上の星", "mid1F", "hiA#"],
    ["ファイト!", "mid1G", "mid2G#"],
    ["空と君のあいだに", "mid1F#", "hiB"],
    ["悪女", "mid1E", "hiA"],
    ["わかれうた", "mid1D", "hiA#"],
    ["銀の龍の背に乗って", "mid1E", "hiB"],
    ["旅人のうた", "mid1G", "hiA#"],
    ["麦の唄", "mid1F", "hiB"],
  ]),

  ...rows("松任谷由実", "https://w.atwiki.jp/saikouon_dokoda/pages/929.html", [
    ["真夏の夜の夢", "mid1G", "mid2G#"],
    ["春よ、来い", "mid1F", "mid2G#"],
    ["Hello, my friend", "mid1E", "mid2G#"],
    ["守ってあげたい", "mid1G", "hiA"],
    ["恋人がサンタクロース", "mid1E", "hiA"],
    ["ANNIVERSARY〜無限にCALLING YOU〜", "mid1F", "hiA"],
    ["リフレインが叫んでる", "mid1G", "hiA"],
    ["DESTINY", "mid1F#", "hiA"],
    ["DANG DANG", "mid1F", "hiA"],
    ["Valentine's RADIO", "mid1E", "hiA"],
  ]),

  ...rows("竹内まりや", "https://w.atwiki.jp/saikouon_dokoda/pages/484.html", [
    ["元気を出して", "mid2A", "hiA#"],
    ["駅", "mid1F#", "hiA"],
    ["シングル・アゲイン", "mid1E", "hiB"],
    ["告白", "mid1E", "hiA"],
    ["純愛ラプソディ", "mid1E", "hiA"],
    ["カムフラージュ", "mid1E", "hiA"],
    ["マンハッタン・キス", "mid1E", "hiA#"],
    ["すてきなホリデイ", "mid1E", "hiA"],
  ]),

  ...rows("槇原敬之", "https://w.atwiki.jp/saikouon_dokoda/pages/277.html", [
    ["どんなときも。", "mid1F", "hiA#"],
    ["もう恋なんてしない", "mid1C#", "hiA"],
    ["遠く遠く", "mid1F#", "mid2F#"],
    ["SPY", "mid1F", "mid2G"],
    ["冬がはじまるよ", "mid1E", "mid2G"],
    ["北風〜君にとどきますように〜", "mid1E", "mid2F#"],
    ["No.1", "mid1F", "mid2G#"],
    ["僕が一番欲しかったもの", "mid1C", "hiA#"],
    ["ANSWER", "mid1F#", "hiA"],
  ]),

  ...rows("大黒摩季", "https://w.atwiki.jp/saikouon_dokoda/pages/169.html", [
    ["ら・ら・ら", "mid2C", "hiD"],
    ["あなただけ見つめてる", "mid2B", "hiE"],
    ["夏が来る", "mid2A", "hihiA"],
    ["チョット", "mid2A", "hiE"],
    ["DA・KA・RA", "mid1F", "hiD"],
    ["熱くなれ", "mid1F#", "hiG#"],
    ["永遠の夢に向かって", "mid1F#", "hiF#"],
    ["別れましょう私から消えましょうあなたから", "mid1F#", "hiC#"],
    ["ゲンキダシテ", "mid2B", "hiE"],
  ]),

  ...rows("大塚愛", "https://w.atwiki.jp/saikouon_dokoda/pages/170.html", [
    ["プラネタリウム", "mid2A", "hiC#"],
    ["PEACH", "mid1G#", "hiC"],
    ["恋愛写真", "mid2A", "hiD"],
    ["甘えんぼ", "mid2A", "hiD#"],
    ["Happy Days", "mid1G", "hiD"],
  ]),

  ...rows("PUFFY", "https://w.atwiki.jp/saikouon_dokoda/pages/804.html", [
    ["愛のしるし", "mid2B", "hiB"],
    ["アジアの純真", "mid2C#", "hiB"],
    ["これが私の生きる道", "mid2B", "hiA"],
    ["サーキットの娘", "mid1G", "hiB"],
    ["渚にまつわるエトセトラ", "mid2B", "hiC#"],
    ["MOTHER", "mid2C", "hiA"],
  ]),

  ...rows("木村カエラ", "https://w.atwiki.jp/saikouon_dokoda/pages/181.html", [
    ["Yellow", "mid2A", "hiD"],
    ["TREE CLIMBERS", "mid2B", "hiC"],
    ["Butterfly", "mid2A#", "hiB"],
    ["Magic Music", "mid1G", "hiC#"],
  ]),

  ...rows("SCANDAL", "https://w.atwiki.jp/saikouon_dokoda/pages/1358.html", [
    ["会わないつもりの、元気でね", "mid2A", "hiD"],
    ["瞬間センチメンタル", "mid2A", "hiD"],
    ["少女S", "mid2C#", "hiC"],
    ["HARUKAZE", "mid2B", "hiC#"],
  ]),

  ...rows("モーニング娘。", "https://keytube.net/artist/detail/91", [
    ["LOVEマシーン", "mid1D#", "hiC"],
    ["恋愛レボリューション21", "mid1F#", "hiD#"],
    ["ザ☆ピ〜ス!", "mid2A", "hiC"],
    ["ハッピーサマーウェディング", "mid1E", "hiD"],
    ["恋のダンスサイト", "mid1G", "hiD"],
    ["I WISH", "mid2A#", "mid2F#"],
    ["そうだ! We're ALIVE", "lowF", "hiB"],
    ["シャボン玉", "mid2B", "hiD"],
    ["Go Girl〜恋のヴィクトリー〜", "mid2B", "hiB"],
    ["One・Two・Three", "mid2C#", "hiC"],
  ]),

  ...rows("森山直太朗", "https://w.atwiki.jp/saikouon_dokoda/pages/128.html", [
    ["さくら（独唱）", "mid1F", "mid2F"],
    ["夏の終わり", "mid1B", "mid2E"],
    ["風花", "mid1B", "mid2G"],
  ]),

  ...rows("ケツメイシ", "https://w.atwiki.jp/saikouon_dokoda/pages/193.html", [
    ["さくら", "mid1D#", "mid2G"],
    ["夏の思い出", "mid1D#", "mid2F#"],
    ["君にBUMP", "mid1A#", "hiB"],
  ]),

  ...rows("miwa", "https://w.atwiki.jp/saikouon_dokoda/pages/851.html", [
    ["ヒカリヘ", "mid2B", "hiE"],
    ["don't cry anymore", "mid2C", "hiF"],
    ["chAngE", "mid2B", "hiD#"],
    ["片想い", "mid1G", "hiE"],
  ]),

  ...rows("Little Glee Monster", "https://w.atwiki.jp/saikouon_dokoda/pages/949.html", [
    ["ギュッと", "mid2B", "hiE"],
    ["好きだ。", "mid2G#", "hiC#"],
  ]),

  ...rows("倉木麻衣", "https://keytube.net/song/detail/17385", [
    ["Love, Day After Tomorrow", "mid1G", "hiD#"],
    ["Secret of my heart", "mid2A", "hiC#", "https://keytube.net/song/detail/17387"],
    ["always", "mid2A", "hiC", "https://keytube.net/song/detail/17393"],
    ["Winter Bells", "mid1G#", "hiD", "https://keytube.net/song/detail/17394"],
    ["Feel fine!", "mid1G", "hiD", "https://keytube.net/song/detail/17395"],
    ["Time after time〜花舞う街で〜", "mid1G#", "hiD", "https://keytube.net/song/detail/17397"],
    ["Reach for the sky", "mid1G#", "hiD#", "https://keytube.net/song/detail/17390"],
  ]),

  ...rows("DA PUMP", "https://w.atwiki.jp/saikouon_dokoda/pages/237.html", [
    ["ごきげんだぜっ!〜Nothing But Something〜", "mid2A#", "hiA"],
    ["P.A.R.T.Y. 〜ユニバース・フェスティバル〜", "mid1E", "hiC#"],
    ["Purple The Orion", "mid1E", "hiA"],
    ["Rhapsody in Blue", "mid1F", "hiC", "https://keytube.net/artist/detail/87"],
    ["We can't stop the music", "mid1F", "hiC", "https://keytube.net/artist/detail/87"],
    ["CORAZON", "mid1G", "hiA", "https://keytube.net/artist/detail/87"],
  ]),

]
