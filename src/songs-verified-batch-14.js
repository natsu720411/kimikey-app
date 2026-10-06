// 出典確認済み音域 第14弾
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

export const VERIFIED_RANGE_BATCH_14 = [
  ...rows("JUDY AND MARY", "https://keytube.net/artist/detail/1401", [
    ["そばかす", "mid2C#", "hiE"],
    ["Over Drive", "mid1G", "hiF"],
    ["クラシック", "mid2C", "hiD#"],
    ["くじら12号", "mid1F", "hiD#"],
    ["散歩道", "mid1G#", "hiD#"],
    ["LOVER SOUL", "mid2A", "hiD#"],
    ["小さな頃から", "mid2A", "hiF"],
    ["ドキドキ", "mid2C#", "hiC#"],
    ["RADIO", "mid1G", "hiE"],
    ["BLUE TEARS", "mid2B", "hiD"],
  ]),

  ...rows("=LOVE", "https://keytube.net/artist/detail/247", [
    ["絶対アイドル辞めないで", "mid1G#", "hiE"],
    ["ズルいよ ズルいね", "mid1G#", "hiD#"],
    ["あの子コンプレックス", "mid2A", "hiD"],
    ["しゅきぴ", "mid2A", "hiD#"],
    ["手遅れcaution", "mid1F", "hiC#"],
    ["ナツマトペ", "mid2A", "hiD#"],
    ["ラストノートしか知らない", "mid1G#", "hiC#"],
  ]),

  ...rows("湘南乃風", "https://keytube.net/artist/detail/160", [
    ["純恋歌", "mid1D", "hiA"],
    ["睡蓮花", "mid1F", "hiA"],
    ["黄金魂", "mid1C", "hiA#"],
    ["曖歌", "mid1E", "hiA"],
    ["恋時雨", "lowF", "hiC#"],
    ["炎天夏", "mid1D", "hiC#"],
    ["雪月花", "mid1C#", "hiA"],
    ["パズル", "mid1D", "mid2G"],
    ["親友よ", "mid1B", "hiA"],
  ]),

  ...rows("SCANDAL", "https://keytube.net/artist/detail/687", [
    ["太陽スキャンダラス", "mid1G", "hiC#"],
    ["Departure", "mid1F#", "hiC"],
    ["Stamp!", "mid1G#", "hiD#"],
    ["Image", "mid1G#", "hiC#"],
    ["LOVE SURVIVE", "mid1G", "hiC"],
    ["テイクミーアウト", "mid2A", "hiC"],
  ]),

  ...rows("miwa", "https://keytube.net/artist/detail/68", [
    ["441", "mid2A#", "hiE"],
    ["春になったら", "mid2A#", "hiD#"],
    ["ミラクル", "mid2B", "hiD"],
    ["Faith", "mid2A", "hiD#"],
    ["君に出会えたから", "mid2B", "hiD#"],
    ["夜空。feat. ハジ→", "mid1A", "hiD#"],
  ]),

  ...rows("大塚愛", "https://keytube.net/artist/detail/424", [
    ["さくらんぼ", "mid2A", "hiD"],
    ["SMILY", "mid2C#", "hiC"],
    ["黒毛和牛上塩タン焼680円", "mid1G", "hiD"],
  ]),

  ...rows("Little Glee Monster", "https://keytube.net/artist/detail/102", [
    ["世界はあなたに笑いかけている", "mid1G", "hiF"],
    ["ECHO", "mid1D", "hiD"],
    ["青春フォトグラフ", "mid2A#", "hiF#"],
    ["だから、ひとりじゃない", "mid2A#", "hiC#"],
    ["OVER", "mid2C", "hiD"],
    ["君に届くまで", "mid1F#", "hiE"],
    ["足跡", "mid1G", "hiG"],
    ["Join Us!", "mid1F", "hiF"],
  ]),

  ...rows("森山直太朗", "https://keytube.net/artist/detail/1195", [
    ["生きとし生ける物へ", "mid1D", "hiA"],
    ["愛し君へ", "mid1D", "mid2G#"],
    ["太陽", "mid1E", "hiA"],
  ]),

  ...rows("ケツメイシ", "https://keytube.net/artist/detail/95", [
    ["トモダチ", "mid1D", "hiA"],
    ["バラード", "mid1A#", "mid2G"],
    ["出会いのかけら", "mid1G", "mid2G#"],
    ["また君に会える", "mid1D#", "mid2F#"],
    ["仲間", "lowG", "mid2G"],
  ]),

  ...rows("倉木麻衣", "https://keytube.net/artist/detail/531", [
    ["Stay by my side", "mid1F", "hiC"],
    ["Stand Up", "mid1G", "hiD#"],
  ]),

  ...rows("DA PUMP", "https://keytube.net/artist/detail/87", [
    ["U.S.A.", "mid2B", "hiB"],
    ["Feelin' Good -It's PARADISE-", "mid1F", "hiA#"],
    ["Steppin' and Shakin'", "mid2A", "hiC"],
  ]),

  ...rows("東京事変", "https://keytube.net/artist/detail/2619", [
    ["女の子は誰でも", "mid1G#", "hiD#"],
    ["永遠の不在証明", "mid1E", "hiB"],
  ]),

  ...rows("INI", "https://keytube.net/artist/detail/8339", [
    ["Rocketeer", "mid1G", "hiC#"],
    ["Brighter", "mid1C#", "hiC#"],
    ["CALL 119", "mid1B", "hiA"],
    ["We Are", "mid1D", "hiB"],
    ["Password", "mid1A", "hiD#"],
    ["SPECTRA", "mid1D", "hiB"],
    ["FANFARE", "mid1C", "hiD#"],
    ["TAG", "mid1C#", "hiC#"],
    ["LOUD", "mid1D", "hiB"],
    ["LEGIT", "lowG#", "hiD#"],
  ]),

  ...rows("DECO*27", "https://keytube.net/artist/detail/109", [
    ["ヴァンパイア", "mid2B", "hiG#", "https://keytube.net/song/detail/57937"],
    ["ヒバナ", "mid2B", "hiD", "https://w.atwiki.jp/saikouon_dokoda/pages/472.html"],
    ["ゴーストルール", "mid2A", "hiF#"],
    ["妄想感傷代償連盟", "mid2A#", "hiD#"],
    ["乙女解剖", "mid2B", "hihiC#", "https://keytube.net/song/detail/1521"],
    ["愛言葉III", "mid1G#", "hiE", "https://w.atwiki.jp/saikouon_dokoda/pages/472.html"],
    ["サラマンダー", "mid2D", "hiD#"],
    ["ラビットホール", "mid1G", "hiE", "https://keytube.net/song/detail/157067"],
    ["二息歩行", "mid2B", "hiB", "https://keytube.net/song/detail/156706"],
  ]),

  ...rows("ゲスの極み乙女。", "https://keytube.net/artist/detail/150", [
    ["両成敗でいいじゃない", "mid1D#", "hiC#"],
    ["戦ってしまうよ", "mid1D", "hiD"],
    ["人生の針", "mid1D#", "hiD#"],
    ["ドグマン", "mid1D", "hiC"],
    ["DARUMASAN", "mid1G", "hiC"],
  ]),

  ...rows("SHISHAMO", "https://keytube.net/artist/detail/156", [
    ["君の隣にいたいから", "mid1G", "hiD"],
    ["最高速度", "mid2A", "hiD"],
  ]),

  ...rows("PUFFY", "https://keytube.net/artist/detail/988", [
    ["日曜日の娘", "mid1G", "hiC"],
    ["誰かが", "mid1G#", "hiB"],
    ["オリエンタル・ダイヤモンド", "mid1F", "hiC"],
  ]),

  ...rows("竹内まりや", "https://keytube.net/artist/detail/746", [
    ["家に帰ろう（マイ・スイート・ホーム）", "mid1F#", "hiA"],
  ]),

  ...rows("木村カエラ", "https://keytube.net/artist/detail/516", [
    ["リルラ リルハ", "mid1G#", "hiC#", "https://keytube.net/song/detail/17484"],
    ["Ring a Ding Dong", "mid2B", "hiC#", "https://keytube.net/song/detail/143824"],
    ["Jasper", "mid2B", "hiB", "https://keytube.net/song/detail/93899"],
  ]),

  ...rows("WANDS", "https://keytube.net/artist/detail/2653", [
    ["大胆", "mid1D", "hiB"],
  ]),

  ...rows("槇原敬之", "https://keytube.net/artist/detail/166", [
    ["彼女の恋人", "mid1D#", "hiA#", "https://keytube.net/song/detail/1743"],
  ]),

  ...rows("flumpool", "https://keytube.net/artist/detail/278", [
    ["大切なものは君以外に見当たらなくて", "lowF", "hiA#", "https://keytube.net/song/detail/8063"],
  ]),
]
