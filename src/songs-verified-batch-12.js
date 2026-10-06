// 出典確認済み音域 第12弾
// 検索カタログから、最低音・最高音を曲単位で確認できた100曲を追加します。
// 主に地声最低音・地声最高音を音域の目安として採用します。

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
    ["君の隣にいたいから", "mid1G", "hiD", "https://keytube.net/song/detail/2070"],
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
    ["相思相愛", "mid1G#", "hiC#", "https://keytube.net/song/detail/111905"],
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

  ...rows("DA PUMP", "https://w.atwiki.jp/saikouon_dokoda/pages/237.html", [
    ["if...", "mid1E", "hiA"],
    ["U.S.A.", "mid2B", "hiB"],
    ["P.A.R.T.Y. 〜ユニバース・フェスティバル〜", "mid1E", "hiC#"],
    ["Purple The Orion", "mid1E", "hiA"],
    ["ごきげんだぜっ!〜Nothing But Something〜", "mid2A#", "hiA"],
  ]),

]
