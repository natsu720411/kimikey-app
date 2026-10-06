// 出典確認済み音域 第12弾
// 検索カタログ第2弾から、最低音・最高音を確認できた100曲を追加します。
// 参照元の地声最低音・地声最高音を音域の目安として採用します。

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

export const VERIFIED_RANGE_BATCH_12 = [
  ...rows("サカナクション", "https://w.atwiki.jp/saikouon_dokoda/pages/621.html", [
    ["新宝島", "mid1F", "hiA#"],
    ["アイデンティティ", "mid1F#", "hiA"],
    ["夜の踊り子", "mid1D", "hiA"],
    ["ミュージック", "mid1C#", "mid2G#"],
    ["アルクアラウンド", "mid1E", "hiA"],
    ["ルーキー", "mid1G#", "hiA"],
    ["モス", "mid1F", "hiC"],
    ["忘れられないの", "mid1E", "hiA"],
    ["怪獣", "mid1F#", "hiA#"],
    ["さよならはエモーション", "mid1D", "hiB"],
  ]),

  ...rows("UNISON SQUARE GARDEN", "https://w.atwiki.jp/saikouon_dokoda/pages/577.html", [
    ["シュガーソングとビターステップ", "mid1F#", "hiB"],
    ["オリオンをなぞる", "mid1G#", "hiB"],
    ["桜のあと (all quartets lead to the?)", "mid1G#", "hiB"],
    ["harmonized finale", "mid1F", "hiC"],
    ["mix juiceのいうとおり", "mid1F", "hiA#"],
    ["10% roll, 10% romance", "mid1G#", "hiC"],
    ["Phantom Joke", "mid2A", "hiC"],
    ["kaleido proud fiesta", "mid1F", "hiC#"],
    ["センチメンタルピリオド", "mid1F", "hiB"],
    ["リニアブルーを聴きながら", "mid1G#", "hiC"],
  ]),

  ...rows("小田和正", "https://w.atwiki.jp/saikouon_dokoda/pages/172.html", [
    ["ラブ・ストーリーは突然に", "mid1E", "hiB"],
    ["たしかなこと", "mid1F", "hiA#"],
    ["キラキラ", "mid1F", "hiA#"],
    ["こころ", "mid1C#", "hiB"],
    ["woh woh", "mid1F", "hiA#"],
    ["伝えたいことがあるんだ", "mid1F#", "hiB"],
    ["緑の街", "mid1F#", "hiA"],
    ["ダイジョウブ", "mid1D#", "hiA#"],
    ["今日も どこかで", "mid1D", "hiA"],
    ["その日が来るまで", "mid1D", "mid2F#"],
  ]),

  ...rows("宇多田ヒカル", "https://w.atwiki.jp/saikouon_dokoda/pages/159.html", [
    ["First Love", "mid1E", "hiD#"],
    ["Automatic", "mid1F", "hiE"],
    ["traveling", "mid2B", "hiE"],
    ["Can You Keep A Secret?", "mid2C", "hiE"],
    ["光", "mid2A", "hiD#"],
    ["Beautiful World", "mid2B", "hiC"],
    ["Prisoner Of Love", "mid1F", "hiD#"],
    ["Flavor Of Life", "mid1D#", "hiC"],
    ["One Last Kiss", "mid1G#", "hiC#"],
    ["君に夢中", "mid1D#", "hiD#"],
  ]),

  ...rows("aiko", "https://w.atwiki.jp/saikouon_dokoda/pages/21.html", [
    ["カブトムシ", "mid1F", "hiC"],
    ["花火", "mid2A", "hiD#"],
    ["ボーイフレンド", "mid1F#", "hiD"],
    ["キラキラ", "mid1G#", "hiC"],
    ["えりあし", "mid1F#", "hiC#"],
    ["スター", "mid1A", "hiC#"],
    ["桜の時", "mid1G#", "hiC#"],
    ["恋のスーパーボール", "mid1E", "hiB"],
    ["相思相愛", "mid1G#", "hiB"],
    ["ストロー", "mid1F#", "hiB"],
  ]),

  ...rows("椎名林檎", "https://w.atwiki.jp/saikouon_dokoda/pages/212.html", [
    ["丸ノ内サディスティック", "mid2A#", "hiC"],
    ["ここでキスして。", "mid1G#", "hiD"],
    ["歌舞伎町の女王", "mid2B", "hiC#"],
    ["ギブス", "mid2A", "hiD"],
    ["本能", "mid1G", "hiD"],
    ["罪と罰", "mid1D", "hiD#"],
    ["茎(STEM)〜大名遊ビ編〜", "mid1D", "hiE"],
    ["長く短い祭", "mid2A", "hiD#"],
    ["NIPPON", "mid2B", "hiF"],
    ["人生は夢だらけ", "mid2A#", "hiC#"],
  ]),

  ...rows("FUNKY MONKEY BABYS", "https://w.atwiki.jp/saikouon_dokoda/pages/603.html", [
    ["あとひとつ", "mid1D", "hiA"],
    ["ちっぽけな勇気", "mid1G", "hiA"],
    ["ヒーロー", "mid1G", "mid2G"],
    ["告白", "mid1G", "hiA#"],
    ["旅立ち", "mid1G", "mid2G"],
    ["桜", "mid1F#", "hiA"],
    ["希望の唄", "mid1G#", "mid2G#"],
    ["大切", "mid1D#", "hiA"],
    ["悲しみなんて笑い飛ばせ", "mid1F", "mid2G"],
    ["サヨナラじゃない", "mid1G#", "mid2G#"],
  ]),

  ...rows("flumpool", "https://w.atwiki.jp/saikouon_dokoda/pages/518.html", [
    ["君に届け", "mid1A#", "mid2G#"],
    ["花になれ", "mid1E", "hiA"],
    ["証", "mid1A#", "hiA"],
    ["星に願いを", "mid1F#", "hiA"],
    ["MW 〜Dear Mr. & Ms. ピカレスク〜", "mid1B", "hiA"],
    ["Over the rain 〜ひかりの橋〜", "mid1C#", "hiA#"],
    ["残像", "lowG", "mid2G"],
    ["春風", "mid1A", "hiA"],
    ["夜は眠れるかい？", "mid1B", "hiB"],
  ]),

  ...rows("SHISHAMO", "https://w.atwiki.jp/saikouon_dokoda/pages/1058.html", [
    ["明日も", "mid1G#", "hiC"],
    ["君と夏フェス", "mid2B", "hiC"],
    ["恋する", "mid1G#", "hiC#"],
    ["量産型彼氏", "mid1G#", "hiC#"],
    ["熱帯夜", "mid2A", "hiA"],
    ["僕に彼女ができたんだ", "mid2A#", "hiC#"],
    ["ほら、笑ってる", "mid1G#", "hiC#"],
    ["水色の日々", "mid2B", "hiC#"],
  ]),

  ...rows("東京事変", "https://w.atwiki.jp/saikouon_dokoda/pages/250.html", [
    ["群青日和", "mid2A#", "hiD#"],
    ["遭難", "mid2B", "hiD"],
    ["能動的三分間", "mid1F#", "hiE"],
    ["閃光少女", "mid1G#", "hiD#"],
    ["キラーチューン", "mid1F#", "hiC#"],
    ["修羅場", "mid2A", "hiE"],
    ["透明人間", "mid2A", "hiD"],
    ["新しい文明開化", "mid2A#", "hiC#"],
  ]),

  ...rows("ゲスの極み乙女。", "https://w.atwiki.jp/saikouon_dokoda/pages/893.html", [
    ["私以外私じゃないの", "mid1G", "hiA"],
    ["ロマンスがありあまる", "mid1E", "hiA"],
    ["キラーボール", "mid1C#", "mid2G#"],
    ["猟奇的なキスを私にして", "mid1F", "hiB"],
    ["デジタルモグラ", "mid1F", "hiA"],
  ]),

]
