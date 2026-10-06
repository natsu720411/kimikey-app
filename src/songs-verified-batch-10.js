// 出典確認済み音域 第10弾
// 追加検索カタログから、曲単位の最低音・最高音を確認できた曲だけを追加します。
// atwiki の地声最低音・地声最高音を音域の目安として採用しています。

function rows(artist, source, entries) {
  return entries.map(([title, lowLabel, highLabel]) => ({
    artist,
    title,
    lowLabel,
    highLabel,
    rangeVerified: true,
    rangeSource: source,
  }))
}

export const VERIFIED_RANGE_BATCH_10 = [
  ...rows("WANDS", "https://w.atwiki.jp/saikouon_dokoda/pages/140.html", [
    ["世界が終るまでは…", "mid1E", "hiA"],
    ["もっと強く抱きしめたなら", "mid1A", "mid2G"],
    ["時の扉", "mid1E", "mid2G#"],
    ["愛を語るより口づけをかわそう", "mid1G", "mid2G#"],
    ["恋せよ乙女", "mid1G#", "hiB"],
    ["Jumpin' Jack Boy", "mid1D", "hiA"],
    ["錆びついたマシンガンで今を撃ち抜こう", "mid1E", "hiB"],
    ["真っ赤なLip", "mid1C", "hiC"],
    ["カナリア鳴いた頃に", "mid1D", "hiA"],
  ]),

  ...rows("DEEN", "https://w.atwiki.jp/saikouon_dokoda/pages/242.html", [
    ["このまま君だけを奪い去りたい", "mid1C#", "mid2G#"],
    ["瞳そらさないで", "mid1D#", "hiA"],
    ["ひとりじゃない", "mid1D#", "mid2G#"],
    ["夢であるように", "mid1F", "mid2G"],
    ["Teenage dream", "mid1E", "mid2G"],
    ["未来のために", "mid1D#", "mid2G#"],
    ["翼を広げて", "lowG#", "mid2G#"],
    ["永遠をあずけてくれ", "mid1B", "mid2G#"],
    ["君さえいれば", "mid1E", "mid2G"],
    ["Memories", "mid1F", "mid2G#"],
  ]),

  ...rows("T-BOLAN", "https://w.atwiki.jp/saikouon_dokoda/pages/246.html", [
    ["離したくはない", "mid1C", "mid2G#"],
    ["じれったい愛", "mid1G#", "mid2G#"],
    ["Bye For Now", "mid1F#", "mid2G#"],
    ["サヨナラから始めよう", "mid1D", "mid2G"],
    ["おさえきれない この気持ち", "mid1A", "mid2G"],
    ["刹那さを消せやしない", "mid1D", "mid2G"],
    ["すれ違いの純情", "mid1C", "mid2G"],
    ["わがままに抱き合えたなら", "mid1D#", "hiA"],
    ["マリア", "mid1A#", "hiA"],
    ["LOVE", "mid1A#", "hiA#"],
  ]),

  ...rows("シャ乱Q", "https://w.atwiki.jp/saikouon_dokoda/pages/59.html", [
    ["シングルベッド", "mid1C#", "mid2G#"],
    ["ズルい女", "mid1E", "mid2G"],
    ["いいわけ", "mid1G", "mid2F"],
    ["上・京・物・語", "mid1G#", "mid2G#"],
    ["My Babe 君が眠るまで", "mid1D#", "mid2F#"],
    ["空を見なよ", "mid1D#", "mid2G#"],
    ["涙の影", "mid1B", "mid2F#"],
    ["大阪エレジー", "mid1D", "mid2F"],
    ["18ヶ月", "mid1E", "hiA"],
  ]),

  ...rows("X JAPAN", "https://w.atwiki.jp/saikouon_dokoda/pages/164.html", [
    ["紅", "mid1D#", "hiD#"],
    ["Forever Love", "mid1C", "hiD"],
    ["ENDLESS RAIN", "mid1F#", "hiD"],
    ["Silent Jealousy", "mid2B", "hiC#"],
    ["Tears", "mid2A", "hiC"],
    ["Rusty Nail", "mid2A", "hiC"],
    ["DAHLIA", "mid2A#", "hiB"],
    ["Say Anything", "mid1G#", "hiD#"],
    ["WEEK END", "mid1F#", "hiC#"],
    ["SCARS", "mid2A", "hiC#"],
  ]),

  ...rows("LUNA SEA", "https://w.atwiki.jp/saikouon_dokoda/pages/292.html", [
    ["ROSIER", "mid1B", "mid2G#"],
    ["TRUE BLUE", "mid1G", "hiB"],
    ["I for You", "mid1B", "hiA"],
    ["DESIRE", "mid1E", "mid2G"],
    ["STORM", "mid1C#", "mid2F#"],
    ["gravity", "mid1D", "mid2E"],
    ["TONIGHT", "mid1F#", "hiA"],
    ["END OF SORROW", "mid1F#", "mid2G"],
    ["IN SILENCE", "mid1B", "mid2G"],
    ["LOVE SONG", "mid1D#", "mid2G#"],
  ]),

  ...rows("THE YELLOW MONKEY", "https://w.atwiki.jp/saikouon_dokoda/pages/200.html", [
    ["JAM", "mid1C", "mid2F"],
    ["SPARK", "mid1E", "mid2F#"],
    ["BURN", "mid1C", "mid2G"],
    ["楽園", "mid1E", "mid2F#"],
    ["LOVE LOVE SHOW", "mid1E", "mid2F#"],
    ["球根", "mid1C", "mid2G"],
    ["太陽が燃えている", "mid1E", "mid2E"],
    ["バラ色の日々", "mid1G", "hiA"],
    ["プライマル。", "mid1F#", "mid2F#"],
    ["追憶のマーメイド", "mid1E", "mid2F#"],
  ]),

  ...rows("エレファントカシマシ", "https://w.atwiki.jp/saikouon_dokoda/pages/166.html", [
    ["今宵の月のように", "mid1D", "hiA"],
    ["悲しみの果て", "mid1D#", "hiA#"],
    ["俺たちの明日", "lowG#", "hiC#"],
    ["風に吹かれて", "mid1D#", "hiB"],
    ["桜の花、舞い上がる道を", "mid1B", "hiC"],
    ["笑顔の未来へ", "mid1B", "hiC#"],
    ["四月の風", "mid1F#", "hiB"],
  ]),

  ...rows("福山雅治", "https://w.atwiki.jp/saikouon_dokoda/pages/271.html", [
    ["桜坂", "mid1D", "mid2F#"],
    ["家族になろうよ", "lowG#", "mid2E"],
    ["HELLO", "mid1D#", "mid2F#"],
    ["虹", "mid1A", "mid2E"],
    ["IT'S ONLY LOVE", "mid1E", "mid2F"],
    ["Squall", "lowE", "mid2E"],
    ["化身", "mid1B", "mid2E"],
    ["最愛", "mid1A", "mid2F"],
    ["道標", "mid1C", "mid2F"],
    ["少年", "mid1D", "mid2D#"],
  ]),

  ...rows("平井堅", "https://w.atwiki.jp/saikouon_dokoda/pages/267.html", [
    ["瞳をとじて", "mid1C", "mid2G#"],
    ["POP STAR", "mid1C", "mid2G"],
    ["楽園", "mid1G", "mid2G#"],
    ["大きな古時計", "mid1D#", "mid2F#"],
    ["哀歌（エレジー）", "mid1C", "hiA"],
    ["KISS OF LIFE", "mid1F#", "mid2G#"],
    ["even if", "mid1E", "hiA"],
    ["思いがかさなるその前に…", "lowG#", "mid2F#"],
    ["君の好きなとこ", "mid1A#", "mid2G"],
    ["ノンフィクション", "mid1A", "mid2G"],
  ]),

  ...rows("ウルフルズ", "https://w.atwiki.jp/saikouon_dokoda/pages/300.html", [
    ["ガッツだぜ!!", "mid2B", "hiA"],
    ["バンザイ〜好きでよかった〜", "mid1E", "hiA"],
    ["ええねん", "mid2B", "hiA"],
    ["借金大王", "mid1F#", "mid2E"],
    ["それが答えだ!", "mid1F#", "mid2G#"],
    ["笑えれば", "mid2A", "hiA"],
    ["かわいいひと", "mid1D", "mid2E"],
  ]),

]
