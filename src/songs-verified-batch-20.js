// 出典確認済み音域 第20弾
// 曲単位の公開情報または曲別一覧で最低音・最高音を確認できた100曲を追加します。
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

export const VERIFIED_RANGE_BATCH_20 = [
  ...rows("Mrs. GREEN APPLE", "https://keytube.net/artist/detail/6", [
    ["Brand New", "mid1D", "hiE"],
    ["Soranji", "mid1C", "hiF#"],
    ["lulu.", "mid1C#", "hiD#"],
    ["ケセラセラ", "mid1D", "hiF"],
    ["ダーリン", "mid1D", "hiC#"],
    ["Magic", "mid1C#", "hiF"],
    ["ダンスホール", "mid2A", "hiF#"],
    ["ブルーアンビエンス (feat. asmi)", "mid1F", "hiF"],
    ["StaRt", "mid1F#", "hiB"],
    ["クスシキ", "mid1E", "hiF"],
    ["ロマンチシズム", "mid1C", "hiD#"],
    ["GOOD DAY", "mid1D", "hiD"],
  ]),

  ...rows("YOASOBI", "https://keytube.net/artist/detail/3414", [
    ["夜に駆ける", "mid1G", "hiF"],
    ["群青", "mid1F", "hiF"],
    ["劇上", "mid1G", "hiF#"],
    ["アイドル", "mid1F#", "hiF"],
    ["勇者", "mid1G", "hiF"],
    ["セブンティーン", "mid1F", "hiF", "https://keytube.net/song/detail/109076"],
    ["Biri-Biri", "mid1G#", "hiD#"],
  ]),

  ...rows("Vaundy", "https://keytube.net/artist/detail/3411", [
    ["怪獣の花唄", "mid1D", "hiD", "https://keytube.net/song/detail/24128"],
    ["そんなbitterな話", "mid1E", "hiE"],
    ["トドメの一撃 feat. Cory Wong", "mid1F#", "hiC#", "https://keytube.net/song/detail/104211"],
    ["mabataki", "mid1C", "hiB"],
  ]),

  ...rows("B'z", "https://keytube.net/artist/detail/70", [
    ["WILD LIFE", "mid1G#", "hiB"],
    ["もう一度キスしたかった", "mid1G", "hiA"],
  ]),

  ...rows("米津玄師", "https://keytube.net/artist/detail/1", [
    ["IRIS OUT", "mid1A#", "hiA"],
    ["Lemon", "mid1B", "hiB"],
    ["LADY", "mid1D", "hiB"],
    ["BOW AND ARROW", "mid1D", "hiC#"],
    ["Plazma", "mid1D", "hiA#"],
    ["月を見ていた", "mid1A", "hiD"],
    ["Pale Blue", "mid1D", "hiC#"],
    ["死神", "lowG", "mid2G"],
    ["ゆめうつつ", "mid1C", "hiA#", "https://keytube.net/song/detail/56790"],
  ]),

  ...rows("King Gnu", "https://keytube.net/artist/detail/4", [
    ["AIZO", "mid1D", "hiA#"],
    ["SPECIALZ", "mid1C#", "mid2F#", "https://keytube.net/song/detail/104101"],
  ]),

  ...rows("HANA", "https://keytube.net/artist/detail/13888", [
    ["Blue Jeans", "mid1E", "hiB"],
    ["ROSE", "mid1G", "hiF", "https://keytube.net/song/detail/161602"],
    ["Bad Girl", "mid1G", "hiC"],
    ["Tiger", "mid1G", "hiE", "https://keytube.net/song/detail/159408"],
    ["NON STOP", "mid1F#", "hiA#"],
  ]),

  ...rows("Snow Man", "https://keytube.net/artist/detail/10121", [
    ["グッタイム", "mid1F", "hiC"],
    ["slow...", "mid1C", "mid2F#"],
    ["君の彼氏になりたい。", "mid1C", "mid2G"],
  ]),

  ...rows("あいみょん", "https://keytube.net/artist/detail/3", [
    ["今夜このまま", "mid1G#", "hiD#"],
    ["マリーゴールド", "mid1F", "hiB"],
    ["裸の心", "mid1F", "hiD#"],
    ["愛の花", "mid1D#", "hiD#"],
    ["あのね", "mid1F#", "hiD#"],
    ["ハート", "mid1F#", "hiD#"],
    ["愛を知るまでは", "mid1F", "hiB"],
  ]),

  ...rows("マカロニえんぴつ", "https://keytube.net/artist/detail/1664", [
    ["恋人ごっこ", "mid1F#", "hiC#"],
    ["リンジュー・ラヴ", "mid1D", "hiA"],
    ["愛の波", "mid1D", "hiB"],
    ["悲しみはバスに乗って", "lowF#", "hiC#"],
    ["星が泳ぐ", "mid1C", "hiC#"],
    ["たましいの居場所", "mid1B", "hiA#"],
  ]),

  ...rows("Aimer", "https://keytube.net/artist/detail/34", [
    ["Live to Survive", "mid2B", "hiC"],
    ["残響散歌", "mid1G#", "hiD#", "https://keytube.net/song/detail/63886"],
    ["朝が来る", "mid2A", "hiD#"],
  ]),

  ...rows("Saucy Dog", "https://keytube.net/artist/detail/237", [
    ["シンデレラボーイ", "mid1D#", "hiC#"],
    ["現在を生きるのだ。", "mid1F", "hiC#", "https://keytube.net/song/detail/107512"],
    ["夢みるスーパーマン", "mid1D#", "hiD#", "https://keytube.net/song/detail/107516"],
  ]),

  ...rows("Creepy Nuts", "https://keytube.net/artist/detail/262", [
    ["Bling-Bang-Bang-Born", "mid1D", "hiA"],
    ["二度寝", "mid1D", "mid2F", "https://keytube.net/song/detail/106948"],
  ]),

  ...rows("Da-iCE", "https://keytube.net/artist/detail/765", [
    ["I wonder", "mid1A#", "hiD#", "https://keytube.net/song/detail/166320"],
    ["CITRUS", "mid1F", "hiD", "https://keytube.net/song/detail/40444"],
    ["スターマイン", "mid1C#", "hiD#", "https://keytube.net/song/detail/84750"],
  ]),

  ...rows("SixTONES", "https://keytube.net/artist/detail/8779", [
    ["マイオンリー", "mid1C#", "hiB"],
    ["Dance Forever", "mid1D", "hiC"],
    ["GONG", "mid1E", "mid2F"],
  ]),

  ...rows("藤井風", "https://keytube.net/artist/detail/3197", [
    ["満ちてゆく", "lowF#", "hiC#", "https://keytube.net/song/detail/154573"],
    ["Feelin' Go(o)d", "mid1C", "hiA", "https://keytube.net/song/detail/163811"],
    ["燃えよ", "mid1D#", "hiB", "https://keytube.net/song/detail/74823"],
  ]),

  ...rows("NiziU", "https://keytube.net/artist/detail/4328", [
    ["HEARTRIS", "mid2A", "hiG"],
    ["Chopstick", "mid2A", "hiE"],
  ]),

  ...rows("=LOVE", "https://keytube.net/artist/detail/247", [
    ["恋、はじめました。", "mid2A", "hiD#"],
    ["劇薬中毒", "mid2A", "hiC#"],
    ["お姫様の作り方", "mid1G#", "hiD"],
  ]),

  ...rows("アイナ・ジ・エンド", "https://keytube.net/artist/detail/2101", [
    ["Blue Shining Star", "mid1B", "hiE"],
    ["ルミナス - Luminous", "mid1D#", "hiD#"],
    ["革命道中 - On The Way", "mid1D", "hiC"],
  ]),

  ...rows("菅田将暉", "https://keytube.net/artist/detail/486", [
    ["さよならエレジー", "mid1C#", "hiA#", "https://keytube.net/song/detail/152"],
    ["虹", "mid1C", "hiB", "https://keytube.net/song/detail/45979"],
    ["まちがいさがし", "mid1A", "hiB", "https://keytube.net/song/detail/154"],
  ]),

  ...rows("なとり", "https://keytube.net/artist/detail/11230", [
    ["フライデー・ナイト", "lowG#", "mid2G#", "https://keytube.net/song/detail/97754"],
    ["猿芝居", "mid1A", "mid2E"],
    ["プロポーズ", "mid1C", "hiA#", "https://keytube.net/song/detail/137280"],
  ]),

  ...rows("tuki.", "https://keytube.net/artist/detail/12921", [
    ["SOS", "mid2A", "hiD"],
    ["晩餐歌", "mid1G", "hiF#", "https://keytube.net/song/detail/104411"],
  ]),

  ...rows("嵐", "https://keytube.net/artist/detail/108", [
    ["Love so sweet", "mid1D", "hiA", "https://keytube.net/song/detail/3179"],
    ["One Love", "mid1D", "mid2G", "https://keytube.net/song/detail/17942"],
  ]),

  ...rows("Tani Yuuki", "https://keytube.net/artist/detail/6152", [
    ["W / X / Y", "mid1D", "hiA#", "https://keytube.net/song/detail/78426"],
    ["愛言葉", "mid1F", "hiC", "https://keytube.net/song/detail/85033"],
  ]),

  ...rows("友成空", "https://keytube.net/artist/detail/12728", [
    ["鬼ノ宴", "lowG#", "hiA#", "https://keytube.net/song/detail/106262"],
  ]),

  ...rows("新しい学校のリーダーズ", "https://keytube.net/artist/detail/4694", [
    ["オトナブルー", "mid1E", "hiC", "https://keytube.net/song/detail/94696"],
  ]),

  ...rows("こっちのけんと", "https://keytube.net/artist/detail/12649", [
    ["はいよろこんで", "mid1D", "mid2G", "https://keytube.net/song/detail/116035"],
  ]),

  ...rows("IVE", "https://keytube.net/artist/detail/8496", [
    ["I AM", "mid1E", "hiF#", "https://keytube.net/song/detail/114652"],
    ["HEYA", "mid1G", "hiD#", "https://keytube.net/song/detail/114508"],
    ["Accendio", "mid1G", "hiD#", "https://keytube.net/song/detail/114849"],
  ]),

]
