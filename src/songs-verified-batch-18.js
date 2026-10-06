// 出典確認済み音域 第18弾
// 既存の曲単位出典付きデータと、追加で曲別確認したデータから100曲を追加します。
// 地声・裏声・フェイク等の扱いは参照元ごとに異なるため、音域の目安として扱います。

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

export const VERIFIED_RANGE_BATCH_18 = [
  ...rows("Mrs. GREEN APPLE", [
    ["Attitude", "mid1G", "hiD", "https://keytube.net/song/detail/2614"],
    ["点描の唄", "mid1G", "hiF", "https://keytube.net/song/detail/46108"],
    ["WanteD! WanteD!", "mid1E", "hiF", "https://keytube.net/song/detail/119"],
    ["春愁", "mid1C", "mid2G", "https://keytube.net/song/detail/121"],
    ["ナハトムジーク", "mid1C#", "hiF", "https://keytube.net/song/detail/106300"],
    ["コロンブス", "mid1D", "hiC#", "https://keytube.net/song/detail/115025"],
    ["Dear", "mid1F", "hiD#", "https://keytube.net/song/detail/112281"],
    ["familie", "mid1D#", "hiB", "https://keytube.net/song/detail/114842"],
    ["ANTENNA", "mid1D#", "hiE", "https://keytube.net/song/detail/101468"],
    ["ビターバカンス", "mid1E", "hiA", "https://keytube.net/song/detail/116158"],
  ]),

  ...rows("YOASOBI", [
    ["祝福", "mid1G", "hiF", "https://keytube.net/song/detail/87453"],
    ["アンコール", "mid1F#", "hiG", "https://keytube.net/song/detail/45069"],
    ["好きだ", "mid1G", "hiF", "https://keytube.net/song/detail/80257"],
    ["ミスター", "mid1F#", "hiE", "https://keytube.net/song/detail/97045"],
    ["アドベンチャー", "mid1G#", "hiF", "https://keytube.net/song/detail/95414"],
    ["怪物", "mid1F#", "hiF", "https://keytube.net/song/detail/45070"],
    ["優しい彗星", "mid2C", "hiF", "https://keytube.net/song/detail/61559"],
    ["三原色", "mid1F", "hiF#", "https://keytube.net/song/detail/61552"],
    ["もう少しだけ", "mid1G", "hiE", "https://keytube.net/song/detail/54911"],
    ["たぶん", "mid1F", "hiD#", "https://keytube.net/song/detail/28574"],
    ["ハルジオン", "mid1G", "hiD#", "https://keytube.net/song/detail/20494"],
  ]),

  ...rows("Vaundy", [
    ["瞳惚れ", "mid1E", "hiB", "https://keytube.net/song/detail/88693"],
    ["トドメの一撃", "mid1F#", "hiC#", "https://keytube.net/song/detail/104211"],
    ["ホムンクルス", "mid1E", "hiB", "https://keytube.net/song/detail/113979"],
    ["napori", "mid1B", "hiB", "https://keytube.net/song/detail/24118"],
    ["東京フラッシュ", "mid1F", "hiC#", "https://keytube.net/song/detail/24495"],
    ["タイムパラドックス", "mid1D", "hiD", "https://keytube.net/song/detail/106264"],
    ["花占い", "mid1F", "hiD", "https://keytube.net/song/detail/57677"],
    ["しわあわせ", "mid1C", "hiF", "https://keytube.net/song/detail/54111"],
    ["踊り子", "mid1D", "mid2G", "https://keytube.net/song/detail/60035"],
    ["恋風邪にのせて", "mid1C#", "hiC#", "https://keytube.net/song/detail/75236"],
    ["裸の勇者", "mid1G", "hiC", "https://keytube.net/song/detail/67448"],
    ["CHAINSAW BLOOD", "mid1F", "hiB", "https://keytube.net/song/detail/109075"],
  ]),

  ...rows("King Gnu", [
    ["三文小説", "mid2B", "hiG", "https://vocal-range.com/archives/25277716.html"],
    ["一途", "mid1F#", "hiD", "https://keytube.net/song/detail/63952"],
    ["逆夢", "mid1D", "hiC#", "https://keytube.net/song/detail/67049"],
    ["カメレオン", "mid1F", "hiD", "https://keytube.net/song/detail/80284"],
    ["雨燦々", "mid1D", "hiD#", "https://keytube.net/song/detail/104108"],
    ["Stardom", "mid1E", "hiE", "https://keytube.net/song/detail/104100"],
    ["硝子窓", "mid1F", "hiC", "https://keytube.net/song/detail/106183"],
  ]),

  ...rows("優里", [
    ["メリーゴーランド", "mid1A#", "hiC", "https://vocal-range.com/archives/post-9320.html"],
  ]),

  ...rows("椎名林檎", [
    ["公然の秘密", "mid1G", "hiC", "https://keytube.net/song/detail/9784"],
    ["ありあまる富", "mid1G", "hiC#", "https://keytube.net/song/detail/224"],
    ["幸福論", "mid2A", "hiD", "https://keytube.net/song/detail/209"],
    ["正しい街", "mid2A", "hiC#", "https://keytube.net/song/detail/30344"],
    ["カーネーション", "mid2A", "hiD", "https://keytube.net/song/detail/228"],
    ["自由へ道連れ", "mid2B", "hiD#", "https://keytube.net/song/detail/232"],
  ]),

  ...rows("宇多田ヒカル", [
    ["花束を君に", "mid1D#", "hiE", "https://keytube.net/song/detail/1111"],
    ["Addicted To You", "mid1F", "hiF", "https://keytube.net/song/detail/1090"],
    ["COLORS", "mid2A", "hiD", "https://keytube.net/song/detail/1099"],
    ["SAKURAドロップス", "mid1F", "hiF", "https://keytube.net/song/detail/1097"],
    ["Keep Tryin’", "mid1G", "hiF", "https://keytube.net/song/detail/1103"],
    ["あなた", "mid2C", "hiF", "https://keytube.net/song/detail/12619"],
  ]),

  ...rows("BUMP OF CHICKEN", [
    ["なないろ", "mid1C#", "hiA", "https://keytube.net/song/detail/55153"],
    ["クロノスタシス", "mid1C", "hiC", "https://w.atwiki.jp/saikouon_dokoda/pages/262.html"],
    ["Sleep Walking Orchestra", "lowG#", "hiC#", "https://utastep.com/songs/sleep-walking-orchestra"],
    ["新世界", "mid1C", "hiC", "https://keytube.net/song/detail/76388"],
    ["記念撮影", "mid1C#", "mid2F#", "https://vocal-range.com/archives/16475486.html"],
    ["才悩人応援歌", "mid1C", "hiA", "https://keytube.net/song/detail/16501"],
    ["sailing day", "lowG#", "mid2G#", "https://keytube.net/song/detail/610"],
  ]),

  ...rows("ONE OK ROCK", [
    ["Heartache", "mid1G#", "hiC#", "https://keytube.net/song/detail/479"],
    ["Taking Off", "mid1E", "hiB", "https://keytube.net/song/detail/484"],
    ["Save Yourself", "mid1G", "hiD", "https://keytube.net/song/detail/105108"],
    ["Vandalize", "mid1G", "hiC", "https://keytube.net/song/detail/85925"],
    ["キミシダイ列車", "mid1G#", "hiA#", "https://keytube.net/song/detail/467"],
  ]),

  ...rows("SEKAI NO OWARI", [
    ["炎と森のカーニバル", "mid1C#", "hiA", "https://keytube.net/song/detail/885"],
    ["虹色の戦争", "mid1F#", "hiB", "https://utastep.com/songs/niji-shoku-no-senso"],
    ["SOS", "mid1G", "hiB", "https://keytube.net/song/detail/891"],
    ["silent", "mid1E", "hiA", "https://keytube.net/song/detail/36251"],
    ["プレゼント", "mid1D", "hiA", "https://keytube.net/song/detail/890"],
  ]),

  ...rows("サカナクション", [
    ["ネイティブダンサー", "mid1B", "hiA#", "https://keytube.net/song/detail/1039"],
    ["多分、風。", "mid1D", "hiC#", "https://keytube.net/song/detail/1056"],
    ["グッドバイ", "mid1C#", "hiC", "https://keytube.net/song/detail/1052"],
    ["ユリイカ", "mid1E", "mid2G#", "https://keytube.net/song/detail/1053"],
    ["僕と花", "mid1D#", "mid2G#", "https://keytube.net/song/detail/1049"],
    ["Aoi", "mid2A#", "hiA#", "https://keytube.net/song/detail/17254"],
  ]),

  ...rows("ポルノグラフィティ", [
    ["愛が呼ぶほうへ", "mid1D", "hiA", "https://keytube.net/song/detail/17350"],
    ["シスター", "mid1D", "hiA", "https://keytube.net/song/detail/637"],
    ["ネオメロドラマティック", "mid1E", "mid2G", "https://keytube.net/song/detail/31152"],
    ["今宵、月が見えずとも", "mid1D", "hiA#", "https://keytube.net/song/detail/640"],
    ["瞬く星の下で", "mid1F#", "hiA", "https://keytube.net/song/detail/963"],
  ]),

  ...rows("Mr.Children", [
    ["GIFT", "mid1B", "hiB", "https://keytube.net/song/detail/16756"],
    ["youthful days", "mid1C", "hiB", "https://keytube.net/song/detail/416"],
    ["口笛", "lowG", "hiA", "https://keytube.net/song/detail/412"],
    ["CROSS ROAD", "mid1D", "hiD", "https://keytube.net/song/detail/20100"],
    ["箒星", "mid1A", "hiB", "https://keytube.net/song/detail/16726"],
  ]),

  ...rows("サザンオールスターズ", [
    ["HOTEL PACIFIC", "mid1C", "hiA", "https://keytube.net/song/detail/87759"],
    ["太陽は罪な奴", "mid1C#", "hiA", "https://keytube.net/song/detail/66588"],
    ["ミス・ブランニュー・デイ", "mid1D#", "mid2G", "https://keytube.net/song/detail/70203"],
    ["栄光の男", "lowF", "mid2G", "https://keytube.net/song/detail/23210"],
  ]),

  ...rows("GLAY", [
    ["pure soul", "mid1D#", "hiB", "https://keytube.net/song/detail/38936"],
    ["BEAUTIFUL DREAMER", "mid1D", "hiB", "https://keytube.net/song/detail/1337"],
    ["時の雫", "mid1D#", "hiD", "https://keytube.net/song/detail/74496"],
    ["逢いたい気持ち", "mid1A", "hiB", "https://keytube.net/song/detail/1336"],
    ["生きてく強さ", "mid1D", "hiC#", "https://keytube.net/song/detail/1317"],
  ]),

  ...rows("L'Arc-en-Ciel", [
    ["HEAVEN'S DRIVE", "mid1D", "hiA", "https://keytube.net/song/detail/16772"],
    ["Pieces", "mid1D#", "hiC#", "https://keytube.net/song/detail/90027"],
    ["snow drop", "mid1C", "hiD", "https://keytube.net/song/detail/2726"],
    ["Blurry Eyes", "mid1C", "hiA#", "https://keytube.net/song/detail/33359"],
    ["MY HEART DRAWS A DREAM", "mid1A", "hiD#", "https://keytube.net/song/detail/33335"],
  ]),

]
