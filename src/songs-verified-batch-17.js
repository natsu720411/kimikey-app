// 出典確認済み音域 第17弾
// アプリ内で既に出典確認済みの曲から、曲単位の最低音・最高音が登録されている100曲を昇格します。
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

export const VERIFIED_RANGE_BATCH_17 = [
  ...rows("米津玄師", [
    ["KICK BACK", "lowF", "hiA#", "https://keytube.net/song/detail/88446"],
    ["感電", "mid1A#", "hiC#", "https://keytube.net/song/detail/27410"],
    ["馬と鹿", "mid1C", "hiA#", "https://keytube.net/song/detail/23"],
    ["アイネクライネ", "mid1C#", "mid2G#", "https://keytube.net/song/detail/2605"],
    ["ピースサイン", "mid1D#", "mid2G#", "https://keytube.net/song/detail/15"],
    ["LOSER", "mid1C#", "hiA#", "https://keytube.net/song/detail/13"],
    ["Flamingo", "mid1A", "hiA", "https://keytube.net/song/detail/20"],
    ["M八七", "mid1C#", "hiB", "https://keytube.net/song/detail/105405"],
    ["地球儀", "mid1C", "hiA#", "https://keytube.net/song/detail/107094"],
    ["さよーならまたいつか！", "mid1D", "hiD", "https://keytube.net/song/detail/109852"],
    ["POP SONG", "mid1D", "mid2G", "https://keytube.net/song/detail/72532"],
    ["春雷", "mid1C", "mid2G#", "https://keytube.net/song/detail/17"],
  ]),

  ...rows("緑黄色社会", [
    ["キャラクター", "mid2A", "hiD", "https://keytube.net/song/detail/68078"],
    ["Shout Baby", "mid1D", "hiE", "https://keytube.net/song/detail/18878"],
    ["陽はまた昇るから", "mid1G", "hiD#", "https://keytube.net/song/detail/76999"],
    ["sabotage", "mid2A", "hiD#", "https://keytube.net/song/detail/10484"],
    ["ずっとずっとずっと", "mid1G#", "hiD", "https://keytube.net/song/detail/55802"],
    ["LITMUS", "mid2B", "hiE", "https://keytube.net/song/detail/58153"],
    ["これからのこと、それからのこと", "mid1F", "hiF#", "https://keytube.net/song/detail/68085"],
    ["Party!!", "mid1G#", "hiF", "https://keytube.net/song/detail/108961"],
    ["恥ずかしいか青春は", "mid1F", "hiD#", "https://keytube.net/song/detail/114479"],
    ["始まりの歌", "mid2A#", "hiF", "https://keytube.net/song/detail/13003"],
    ["想い人", "mid1F#", "hiD#", "https://keytube.net/song/detail/10658"],
    ["夏を生きる", "mid1G", "hiF", "https://keytube.net/song/detail/29510"],
  ]),

  ...rows("Saucy Dog", [
    ["いつか", "mid1D", "hiE", "https://keytube.net/song/detail/2965"],
    ["結", "mid1D", "hiD#", "https://keytube.net/song/detail/23743"],
    ["魔法にかけられて", "mid1D", "hiD", "https://keytube.net/song/detail/82256"],
    ["雀ノ欠伸", "mid1E", "hiD", "https://keytube.net/song/detail/2969"],
    ["あぁ、もう。", "mid1B", "hiD#", "https://keytube.net/song/detail/67476"],
    ["ゴーストバスター", "mid1D#", "hiD#", "https://keytube.net/song/detail/2968"],
    ["優しさに溢れた世界で", "mid1D", "hiC#", "https://keytube.net/song/detail/82252"],
    ["紫苑", "mid1G", "hiF", "https://keytube.net/song/detail/87062"],
    ["雷に打たれて", "mid1F", "hiC#", "https://keytube.net/song/detail/155788"],
    ["Be yourself", "mid1C#", "hiD#", "https://keytube.net/song/detail/82255"],
    ["コンタクトケース", "mid1D", "hiD#", "https://keytube.net/song/detail/27123"],
    ["リスポーン", "mid1F", "hiC#", "https://keytube.net/song/detail/84809"],
  ]),

  ...rows("Creepy Nuts", [
    ["オトノケ", "mid1C#", "hiA", "https://keytube.net/song/detail/116120"],
    ["のびしろ", "mid1B", "hiA", "https://keytube.net/song/detail/58625"],
    ["かつて天才だった俺たちへ", "mid1G", "mid2G#", "https://keytube.net/song/detail/32866"],
    ["堕天", "mid1F#", "hiA#", "https://keytube.net/song/detail/106190"],
    ["よふかしのうた", "mid1C#", "mid2F#", "https://keytube.net/song/detail/3174"],
    ["合法的トビ方ノススメ", "mid1C", "mid2F", "https://keytube.net/song/detail/3166"],
    ["助演男優賞", "mid1F", "hiB", "https://keytube.net/song/detail/12915"],
    ["ビリケン", "mid1C", "hiC#", "https://keytube.net/song/detail/104697"],
    ["生業", "mid1D", "mid2G#", "https://keytube.net/song/detail/3176"],
    ["板の上の魔物", "mid1B", "hiA#", "https://keytube.net/song/detail/3175"],
    ["バレる！", "mid1B", "mid2G", "https://keytube.net/song/detail/79012"],
  ]),

  ...rows("Da-iCE", [
    ["DREAMIN’ ON", "mid1F", "hiD", "https://keytube.net/song/detail/33386"],
    ["BACK TO BACK", "mid1F#", "hiC", "https://keytube.net/song/detail/9888"],
    ["Kartell", "mid1G", "hiD#", "https://keytube.net/song/detail/57665"],
    ["FAKE ME FAKE ME OUT", "mid1D", "hiD", "https://w.atwiki.jp/saikouon_dokoda/pages/1250.html"],
    ["ダンデライオン", "mid1E", "hiD#", "https://keytube.net/song/detail/116391"],
    ["Clap and Clap", "mid1B", "hiE", "https://keytube.net/song/detail/69777"],
    ["Promise", "mid1D#", "hiD", "https://keytube.net/song/detail/67478"],
    ["ナイモノネダリ", "mid1A#", "hiD#", "https://keytube.net/song/detail/104484"],
    ["TAKE IT BACK", "mid1D", "hiD#", "https://keytube.net/song/detail/168006"],
    ["Story", "mid1C#", "hiE", "https://keytube.net/song/detail/114114"],
    ["TOKI", "mid1G", "hiC#", "https://keytube.net/song/detail/6228"],
  ]),

  ...rows("あいみょん", [
    ["君はロックを聴かない", "mid1E", "hiC#", "https://keytube.net/song/detail/50"],
    ["愛を伝えたいだとか", "mid1F#", "hiC#", "https://keytube.net/song/detail/49"],
    ["ハルノヒ", "mid1G#", "hiC#", "https://keytube.net/song/detail/58"],
    ["貴方解剖純愛歌〜死ね〜", "mid1G", "hiD", "https://keytube.net/song/detail/2607"],
    ["空の青さを知る人よ", "mid1E", "hiD", "https://keytube.net/song/detail/59"],
    ["さよならの今日に", "mid1G#", "hiC", "https://utastep.com/songs/sayonara-no-kyo-ni"],
    ["会いに行くのに", "mid1F", "hiC#", "https://keytube.net/song/detail/113571"],
    ["双葉", "mid1F", "hiC", "https://keytube.net/song/detail/84685"],
    ["桜が降る夜は", "mid1G#", "hiD", "https://keytube.net/song/detail/51926"],
    ["初恋が泣いている", "mid1F#", "hiC#", "https://keytube.net/song/detail/84684"],
  ]),

  ...rows("マカロニえんぴつ", [
    ["ブルーベリー・ナイツ", "mid1C", "hiC", "https://keytube.net/song/detail/11241"],
    ["洗濯機と君とラヂオ", "mid2A#", "hiA", "https://keytube.net/song/detail/13453"],
    ["ヤングアダルト", "mid1C", "hiB", "https://keytube.net/song/detail/10626"],
    ["はしりがき", "mid1B", "hiC#", "https://keytube.net/song/detail/54118"],
    ["レモンパイ", "mid1D", "hiA", "https://keytube.net/song/detail/11757"],
    ["然らば", "mid1D", "hiA#", "https://keytube.net/song/detail/117768"],
    ["青春と一瞬", "mid1F", "hiC#", "https://keytube.net/song/detail/11212"],
    ["hope", "mid1A", "hiC", "https://keytube.net/song/detail/33423"],
    ["月へ行こう", "mid1D#", "hiC#", "https://keytube.net/song/detail/108367"],
  ]),

  ...rows("King Gnu", [
    ["白日", "mid1A#", "hiF#", "https://keytube.net/song/detail/67"],
    ["飛行艇", "mid1D", "hiE", "https://keytube.net/song/detail/9780"],
    ["Teenager Forever", "mid1C#", "hiB", "https://keytube.net/song/detail/9778"],
    ["傘", "mid1A#", "hiD", "https://keytube.net/song/detail/9779"],
    ["Prayer X", "mid1C#", "hiD#", "https://keytube.net/song/detail/64"],
    ["BOY", "mid1F#", "hiF", "https://keytube.net/song/detail/59372"],
    ["Vinyl", "mid1F", "hiB", "https://keytube.net/song/detail/61"],
    ["Tokyo Rendez-Vous", "mid1C", "mid2G#", "https://keytube.net/song/detail/60"],
  ]),

  ...rows("優里", [
    ["かくれんぼ", "lowF", "mid2G", "https://keytube.net/song/detail/27596"],
    ["ピーターパン", "mid1D", "hiB", "https://keytube.net/song/detail/33819"],
    ["インフィニティ", "mid1E", "hiB", "https://utastep.com/songs/infiniti"],
    ["桜晴", "mid1D#", "mid2G#", "https://keytube.net/song/detail/96731"],
    ["ミズキリ", "mid1F#", "hiD", "https://keytube.net/song/detail/67318"],
    ["カーテンコール", "mid1E", "hiA", "https://utastep.com/songs/katenkoru-yuuri"],
    ["おにごっこ", "mid1C#", "hiA#", "https://utastep.com/songs/o-ni-gokko"],
  ]),

  ...rows("aiko", [
    ["milk", "mid1F", "hiD#", "https://keytube.net/song/detail/16207"],
    ["二人", "mid1G", "hiD#", "https://keytube.net/song/detail/16283"],
    ["KissHug", "mid1E", "hiD#", "https://keytube.net/song/detail/16206"],
    ["横顔", "mid2A", "hiD", "https://keytube.net/song/detail/16286"],
    ["戻れない明日", "mid1F", "hiC", "https://keytube.net/song/detail/16216"],
    ["もっと", "mid1F#", "hiC#", "https://keytube.net/song/detail/21314"],
    ["くちびる", "mid2A#", "hiD#", "https://keytube.net/song/detail/19636"],
  ]),

  ...rows("Vaundy", [
    ["不可幸力", "mid1A#", "hiC", "https://keytube.net/song/detail/34830"],
  ]),

]
