// 出典確認済み音域 第11弾
// 検索カタログ第2弾から、曲単位の最低音・最高音を確認できた100曲を追加します。
// 原則として参照元の地声最低音・地声最高音を音域の目安として採用します。

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

export const VERIFIED_RANGE_BATCH_11 = [
  ...rows("Mr.Children", "https://w.atwiki.jp/saikouon_dokoda/pages/281.html", [
    ["Tomorrow never knows", "mid1F", "hiB"],
    ["名もなき詩", "mid1C", "hiA#"],
    ["終わりなき旅", "mid1B", "hiC#"],
    ["Sign", "mid1B", "hiB"],
    ["抱きしめたい", "mid1D", "hiA"],
    ["シーソーゲーム〜勇敢な恋の歌〜", "mid1B", "hiB"],
    ["innocent world", "mid1C#", "hiB"],
    ["しるし", "mid1C", "hiB"],
    ["HANABI", "lowG#", "hiA"],
    ["365日", "mid1A#", "hiA#"],
  ]),

  ...rows("スピッツ", "https://w.atwiki.jp/saikouon_dokoda/pages/227.html", [
    ["ロビンソン", "mid1F#", "hiB"],
    ["チェリー", "mid1E", "hiA"],
    ["空も飛べるはず", "mid1G", "hiA"],
    ["楓", "mid1F", "hiA#"],
    ["スパイダー", "mid1E", "hiA"],
    ["渚", "mid1E", "hiB"],
    ["涙がキラリ☆", "mid1F#", "hiB"],
    ["スターゲイザー", "mid1F#", "hiB"],
    ["君が思い出になる前に", "mid1B", "hiA"],
    ["美しい鰭", "mid1F", "mid2G#"],
  ]),

  ...rows("サザンオールスターズ", "https://w.atwiki.jp/saikouon_dokoda/pages/203.html", [
    ["真夏の果実", "mid1A", "hiA"],
    ["TSUNAMI", "mid1A", "hiA#"],
    ["いとしのエリー", "mid1F#", "hiA"],
    ["希望の轍", "mid1B", "hiB"],
    ["涙のキッス", "mid1E", "mid2G"],
    ["LOVE AFFAIR〜秘密のデート〜", "mid1A", "hiA"],
    ["勝手にシンドバッド", "mid1D", "hiB"],
    ["エロティカ・セブン", "mid1G", "mid2G#"],
    ["東京VICTORY", "mid1E", "hiA"],
    ["みんなのうた", "mid1G", "hiA"],
  ]),

  ...rows("ポルノグラフィティ", "https://w.atwiki.jp/saikouon_dokoda/pages/274.html", [
    ["サウダージ", "mid2B", "mid2G#"],
    ["アゲハ蝶", "mid1G", "mid2G#"],
    ["ミュージック・アワー", "mid1G", "hiA#"],
    ["メリッサ", "mid2A", "hiA"],
    ["ハネウマライダー", "mid1F#", "hiA"],
    ["アポロ", "mid2A", "hiA"],
    ["ヒトリノ夜", "mid2A", "hiA"],
    ["ジョバイロ", "mid1G#", "hiA#"],
    ["オー！リバル", "mid1G#", "hiA"],
    ["THE DAY", "mid1E", "hiA"],
  ]),

  ...rows("GLAY", "https://w.atwiki.jp/saikouon_dokoda/pages/190.html", [
    ["HOWEVER", "mid1E", "hiD"],
    ["誘惑", "mid1F", "hiA"],
    ["Winter, again", "mid1F#", "hiD"],
    ["BELOVED", "mid1D", "hiA#"],
    ["SOUL LOVE", "mid1D#", "hiC#"],
    ["グロリアス", "mid1C", "hiA#"],
    ["口唇", "mid1G", "hiB"],
    ["春を愛する人", "mid1D", "hiB"],
    ["とまどい", "mid1E", "hiC"],
    ["Way of Difference", "mid1E", "hiD"],
  ]),

  ...rows("L'Arc-en-Ciel", "https://w.atwiki.jp/saikouon_dokoda/pages/291.html", [
    ["HONEY", "mid1F", "hiA"],
    ["Driver's High", "mid1E", "hiB", "https://vocal-range.com/archives/post-4778.html"],
    ["READY STEADY GO", "mid1F", "hiA#"],
    ["flower", "mid1F#", "hiB"],
    ["虹", "mid1D", "hiB", "https://vocal-range.com/archives/post-11952.html"],
    ["winter fall", "lowG#", "hiB"],
    ["STAY AWAY", "lowF#", "mid2G#"],
    ["NEO UNIVERSE", "mid1D#", "hiB"],
    ["Link", "mid1C", "hiC"],
    ["DAYBREAK'S BELL", "lowF#", "mid2G"],
  ]),

  ...rows("BUMP OF CHICKEN", "https://w.atwiki.jp/saikouon_dokoda/pages/262.html", [
    ["天体観測", "lowG#", "mid2G#"],
    ["カルマ", "mid1C#", "mid2F#"],
    ["ray", "mid1A#", "mid2G"],
    ["車輪の唄", "mid1C#", "mid2F#"],
    ["スノースマイル", "mid1C#", "mid2F#"],
    ["花の名", "mid1D#", "mid2F#"],
    ["メーデー", "mid1A#", "mid2G#"],
    ["Hello,world!", "mid1A#", "mid2G"],
    ["アカシア", "mid1D", "mid2G"],
    ["SOUVENIR", "mid1A", "mid2F#"],
  ]),

  ...rows("SEKAI NO OWARI", "https://w.atwiki.jp/saikouon_dokoda/pages/779.html", [
    ["RPG", "mid1C#", "hiA"],
    ["Dragon Night", "mid1F", "mid2G"],
    ["スターライトパレード", "mid2A", "hiA"],
    ["眠り姫", "mid1D", "mid2F"],
    ["RAIN", "mid1D#", "mid2F#"],
    ["サザンカ", "mid1C", "hiA"],
    ["Hey Ho", "mid1B", "hiA"],
    ["Habit", "mid1C", "mid2F"],
    ["最高到達点", "mid1F", "mid2F#"],
    ["ターコイズ", "mid1G#", "mid2G"],
  ]),

  ...rows("ONE OK ROCK", "https://w.atwiki.jp/saikouon_dokoda/pages/546.html", [
    ["Wherever you are", "mid1F#", "hiC#"],
    ["The Beginning", "mid1C", "hiC"],
    ["完全感覚Dreamer", "mid2A", "hiE"],
    ["Clock Strikes", "mid2A#", "hiA#", "https://vocal-range.com/archives/18683248.html"],
    ["Stand Out Fit In", "mid1F#", "hiB"],
    ["Wasted Nights", "mid1F", "hiA#"],
    ["Renegades", "mid1D", "hiC"],
    ["We are", "mid1D", "hiD"],
    ["Re:make", "mid1B", "hiB"],
    ["Mighty Long Fall", "mid1F#", "hiC#"],
  ]),

  ...rows("RADWIMPS", "https://w.atwiki.jp/saikouon_dokoda/pages/344.html", [
    ["前前前世", "mid1F#", "mid2F#"],
    ["スパークル", "mid1B", "mid2G#"],
    ["なんでもないや", "mid1C#", "hiA#"],
    ["有心論", "mid1A", "mid2G"],
    ["ふたりごと", "mid1F", "mid2G"],
    ["おしゃかしゃま", "mid1F", "mid2G#"],
    ["DADA", "mid1D", "hiA"],
    ["君と羊と青", "mid1D#", "hiA#"],
    ["会心の一撃", "mid1F", "mid2G#"],
    ["愛にできることはまだあるかい", "mid1C#", "mid2F#"],
  ]),

]
