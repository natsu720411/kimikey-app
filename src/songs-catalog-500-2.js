// キミキー 検索用追加カタログ 第2弾
//
// 約500曲追加のための検索カタログです（55アーティスト × 10曲 = 550曲）。
// 音域は推測で登録せず、確認済み音域がない曲は検索・アーティスト一覧のみ対象です。
// 既存曲との重複は統合時に除外されます。

const CATALOG_500_2 = {
  "Mr.Children": [
    "Tomorrow never knows", "名もなき詩", "終わりなき旅", "Sign", "抱きしめたい",
    "シーソーゲーム〜勇敢な恋の歌〜", "innocent world", "しるし", "HANABI", "365日",
  ],
  "スピッツ": [
    "ロビンソン", "チェリー", "空も飛べるはず", "楓", "スパイダー",
    "渚", "涙がキラリ☆", "スターゲイザー", "君が思い出になる前に", "美しい鰭",
  ],
  "サザンオールスターズ": [
    "真夏の果実", "TSUNAMI", "いとしのエリー", "希望の轍", "涙のキッス",
    "LOVE AFFAIR〜秘密のデート〜", "勝手にシンドバッド", "エロティカ・セブン", "東京VICTORY", "みんなのうた",
  ],
  "ポルノグラフィティ": [
    "サウダージ", "アゲハ蝶", "ミュージック・アワー", "メリッサ", "ハネウマライダー",
    "アポロ", "ヒトリノ夜", "ジョバイロ", "オー！リバル", "THE DAY",
  ],
  "GLAY": [
    "HOWEVER", "誘惑", "Winter, again", "BELOVED", "SOUL LOVE",
    "グロリアス", "口唇", "春を愛する人", "とまどい", "Way of Difference",
  ],
  "L'Arc-en-Ciel": [
    "HONEY", "Driver's High", "READY STEADY GO", "flower", "虹",
    "winter fall", "STAY AWAY", "NEO UNIVERSE", "Link", "DAYBREAK'S BELL",
  ],
  "BUMP OF CHICKEN": [
    "天体観測", "カルマ", "ray", "車輪の唄", "スノースマイル",
    "花の名", "メーデー", "Hello,world!", "アカシア", "SOUVENIR",
  ],
  "SEKAI NO OWARI": [
    "RPG", "Dragon Night", "スターライトパレード", "眠り姫", "RAIN",
    "サザンカ", "Hey Ho", "Habit", "最高到達点", "ターコイズ",
  ],
  "ONE OK ROCK": [
    "Wherever you are", "The Beginning", "完全感覚Dreamer", "Clock Strikes", "Stand Out Fit In",
    "Wasted Nights", "Renegades", "We are", "Re:make", "Mighty Long Fall",
  ],
  "RADWIMPS": [
    "前前前世", "スパークル", "なんでもないや", "有心論", "ふたりごと",
    "おしゃかしゃま", "DADA", "君と羊と青", "会心の一撃", "愛にできることはまだあるかい",
  ],
  "サカナクション": [
    "新宝島", "アイデンティティ", "夜の踊り子", "ミュージック", "アルクアラウンド",
    "ルーキー", "モス", "忘れられないの", "怪獣", "さよならはエモーション",
  ],
  "UNISON SQUARE GARDEN": [
    "シュガーソングとビターステップ", "オリオンをなぞる", "桜のあと (all quartets lead to the?)", "harmonized finale", "mix juiceのいうとおり",
    "10% roll, 10% romance", "Phantom Joke", "kaleido proud fiesta", "センチメンタルピリオド", "リニアブルーを聴きながら",
  ],
  "DA PUMP": [
    "U.S.A.", "if...", "ごきげんだぜっ!〜Nothing But Something〜", "Rhapsody in Blue", "We can't stop the music",
    "P.A.R.T.Y. 〜ユニバース・フェスティバル〜", "Feelin' Good -It's PARADISE-", "Purple The Orion", "Steppin' and Shakin'", "CORAZON",
  ],
  "WANDS": [
    "世界が終るまでは…", "もっと強く抱きしめたなら", "時の扉", "愛を語るより口づけをかわそう", "恋せよ乙女",
    "Jumpin' Jack Boy", "錆びついたマシンガンで今を撃ち抜こう", "真っ赤なLip", "大胆", "カナリア鳴いた頃に",
  ],
  "DEEN": [
    "このまま君だけを奪い去りたい", "瞳そらさないで", "ひとりじゃない", "夢であるように", "Teenage dream",
    "未来のために", "翼を広げて", "永遠をあずけてくれ", "君さえいれば", "Memories",
  ],
  "T-BOLAN": [
    "離したくはない", "じれったい愛", "Bye For Now", "サヨナラから始めよう", "おさえきれない この気持ち",
    "刹那さを消せやしない", "すれ違いの純情", "わがままに抱き合えたなら", "マリア", "LOVE",
  ],
  "シャ乱Q": [
    "シングルベッド", "ズルい女", "いいわけ", "上・京・物・語", "My Babe 君が眠るまで",
    "空を見なよ", "涙の影", "NICE BOY!", "大阪エレジー", "18ヶ月",
  ],
  "X JAPAN": [
    "紅", "Forever Love", "ENDLESS RAIN", "Silent Jealousy", "Tears",
    "Rusty Nail", "DAHLIA", "Say Anything", "WEEK END", "SCARS",
  ],
  "LUNA SEA": [
    "ROSIER", "TRUE BLUE", "I for You", "DESIRE", "STORM",
    "gravity", "TONIGHT", "END OF SORROW", "IN SILENCE", "LOVE SONG",
  ],
  "THE YELLOW MONKEY": [
    "JAM", "SPARK", "BURN", "楽園", "LOVE LOVE SHOW",
    "球根", "太陽が燃えている", "バラ色の日々", "プライマル。", "追憶のマーメイド",
  ],
  "エレファントカシマシ": [
    "今宵の月のように", "悲しみの果て", "俺たちの明日", "風に吹かれて", "桜の花、舞い上がる道を",
    "笑顔の未来へ", "ガストロンジャー", "四月の風", "デーデ", "ハナウタ〜遠い昔からの物語〜",
  ],
  "ウルフルズ": [
    "ガッツだぜ!!", "バンザイ〜好きでよかった〜", "ええねん", "借金大王", "それが答えだ!",
    "笑えれば", "サムライソウル", "かわいいひと", "大阪ストラット", "明日があるさ",
  ],
  "福山雅治": [
    "桜坂", "家族になろうよ", "HELLO", "虹", "IT'S ONLY LOVE",
    "Squall", "化身", "最愛", "道標", "少年",
  ],
  "平井堅": [
    "瞳をとじて", "POP STAR", "楽園", "大きな古時計", "哀歌（エレジー）",
    "KISS OF LIFE", "even if", "思いがかさなるその前に…", "君の好きなとこ", "ノンフィクション",
  ],
  "槇原敬之": [
    "どんなときも。", "もう恋なんてしない", "遠く遠く", "SPY", "冬がはじまるよ",
    "北風〜君にとどきますように〜", "No.1", "僕が一番欲しかったもの", "彼女の恋人", "ANSWER",
  ],
  "小田和正": [
    "ラブ・ストーリーは突然に", "たしかなこと", "キラキラ", "こころ", "woh woh",
    "伝えたいことがあるんだ", "緑の街", "ダイジョウブ", "今日も どこかで", "その日が来るまで",
  ],
  "森山直太朗": [
    "さくら（独唱）", "夏の終わり", "生きとし生ける物へ", "愛し君へ", "風花",
    "太陽", "虹", "生きてることが辛いなら", "若者たち", "花",
  ],
  "ケツメイシ": [
    "さくら", "夏の思い出", "涙", "トモダチ", "君にBUMP",
    "バラード", "出会いのかけら", "また君に会える", "仲間", "友よ 〜 この先もずっと…",
  ],
  "湘南乃風": [
    "純恋歌", "睡蓮花", "黄金魂", "曖歌", "恋時雨",
    "応援歌", "炎天夏", "雪月花", "パズル", "親友よ",
  ],
  "FUNKY MONKEY BABYS": [
    "あとひとつ", "ちっぽけな勇気", "ヒーロー", "告白", "旅立ち",
    "桜", "希望の唄", "大切", "悲しみなんて笑い飛ばせ", "サヨナラじゃない",
  ],
  "flumpool": [
    "君に届け", "花になれ", "証", "星に願いを", "MW 〜Dear Mr. & Ms. ピカレスク〜",
    "Over the rain 〜ひかりの橋〜", "残像", "春風", "大切なものは君以外に見当たらなくて", "夜は眠れるかい？",
  ],
  "ゲスの極み乙女。": [
    "私以外私じゃないの", "ロマンスがありあまる", "キラーボール", "猟奇的なキスを私にして", "デジタルモグラ",
    "両成敗でいいじゃない", "戦ってしまうよ", "人生の針", "ドグマン", "DARUMASAN",
  ],
  "SHISHAMO": [
    "明日も", "君と夏フェス", "恋する", "量産型彼氏", "熱帯夜",
    "僕に彼女ができたんだ", "ほら、笑ってる", "水色の日々", "君の隣にいたいから", "最高速度",
  ],
  "SCANDAL": [
    "少女S", "瞬間センチメンタル", "HARUKAZE", "太陽スキャンダラス", "会わないつもりの、元気でね",
    "Departure", "Stamp!", "Image", "LOVE SURVIVE", "テイクミーアウト",
  ],
  "Little Glee Monster": [
    "世界はあなたに笑いかけている", "ECHO", "好きだ。", "青春フォトグラフ", "だから、ひとりじゃない",
    "ギュッと", "OVER", "君に届くまで", "足跡", "Join Us!",
  ],
  "miwa": [
    "ヒカリヘ", "don't cry anymore", "441", "春になったら", "片想い",
    "ミラクル", "Faith", "君に出会えたから", "夜空。feat. ハジ→", "chAngE",
  ],
  "大塚愛": [
    "さくらんぼ", "プラネタリウム", "SMILY", "PEACH", "恋愛写真",
    "金魚花火", "甘えんぼ", "Happy Days", "黒毛和牛上塩タン焼680円", "フレンジャー",
  ],
  "木村カエラ": [
    "リルラ リルハ", "Butterfly", "Magic Music", "TREE CLIMBERS", "Jasper",
    "Ring a Ding Dong", "You", "Yellow", "どこ", "Sun shower",
  ],
  "宇多田ヒカル": [
    "First Love", "Automatic", "traveling", "Can You Keep A Secret?", "光",
    "Beautiful World", "Prisoner Of Love", "Flavor Of Life", "One Last Kiss", "君に夢中",
  ],
  "aiko": [
    "カブトムシ", "花火", "ボーイフレンド", "キラキラ", "えりあし",
    "スター", "桜の時", "恋のスーパーボール", "相思相愛", "ストロー",
  ],
  "椎名林檎": [
    "丸ノ内サディスティック", "ここでキスして。", "歌舞伎町の女王", "ギブス", "本能",
    "罪と罰", "茎(STEM)〜大名遊ビ編〜", "長く短い祭", "NIPPON", "人生は夢だらけ",
  ],
  "東京事変": [
    "群青日和", "遭難", "能動的三分間", "閃光少女", "キラーチューン",
    "修羅場", "透明人間", "女の子は誰でも", "新しい文明開化", "永遠の不在証明",
  ],
  "倉木麻衣": [
    "Love, Day After Tomorrow", "Secret of my heart", "Stay by my side", "Stand Up", "always",
    "Winter Bells", "Feel fine!", "Time after time〜花舞う街で〜", "渡月橋 〜君 想ふ〜", "Reach for the sky",
  ],
  "大黒摩季": [
    "ら・ら・ら", "あなただけ見つめてる", "夏が来る", "チョット", "DA・KA・RA",
    "熱くなれ", "永遠の夢に向かって", "いちばん近くにいて", "別れましょう私から消えましょうあなたから", "ゲンキダシテ",
  ],
  "JUDY AND MARY": [
    "そばかす", "Over Drive", "クラシック", "くじら12号", "散歩道",
    "LOVER SOUL", "小さな頃から", "ドキドキ", "RADIO", "BLUE TEARS",
  ],
  "PUFFY": [
    "アジアの純真", "これが私の生きる道", "渚にまつわるエトセトラ", "愛のしるし", "サーキットの娘",
    "日曜日の娘", "MOTHER", "誰かが", "ハズムリズム", "オリエンタル・ダイヤモンド",
  ],
  "モーニング娘。": [
    "LOVEマシーン", "恋愛レボリューション21", "ザ☆ピ〜ス!", "ハッピーサマーウェディング", "恋のダンスサイト",
    "I WISH", "そうだ! We're ALIVE", "シャボン玉", "Go Girl〜恋のヴィクトリー〜", "One・Two・Three",
  ],
  "中島みゆき": [
    "糸", "時代", "地上の星", "ファイト!", "空と君のあいだに",
    "悪女", "わかれうた", "銀の龍の背に乗って", "旅人のうた", "麦の唄",
  ],
  "松任谷由実": [
    "真夏の夜の夢", "春よ、来い", "Hello, my friend", "守ってあげたい", "恋人がサンタクロース",
    "ANNIVERSARY〜無限にCALLING YOU〜", "リフレインが叫んでる", "DESTINY", "DANG DANG", "Valentine's RADIO",
  ],
  "竹内まりや": [
    "元気を出して", "駅", "シングル・アゲイン", "告白", "純愛ラプソディ",
    "家に帰ろう（マイ・スイート・ホーム）", "カムフラージュ", "マンハッタン・キス", "すてきなホリデイ", "Plastic Love",
  ],
  "DECO*27": [
    "モニタリング", "ヴァンパイア", "ヒバナ", "ゴーストルール", "妄想感傷代償連盟",
    "乙女解剖", "愛言葉III", "サラマンダー", "ラビットホール", "二息歩行",
  ],
  "=LOVE": [
    "絶対アイドル辞めないで", "とくべチュ、して", "青春“サブリミナル”", "ズルいよ ズルいね", "あの子コンプレックス",
    "Want you! Want you!", "しゅきぴ", "手遅れcaution", "ナツマトペ", "ラストノートしか知らない",
  ],
  "INI": [
    "Rocketeer", "Brighter", "CALL 119", "We Are", "Password",
    "SPECTRA", "FANFARE", "TAG", "LOUD", "LEGIT",
  ],
  "SEVENTEEN": [
    "VERY NICE", "Don't Wanna Cry", "CLAP", "HOME;RUN", "Left & Right",
    "Rock with you", "HOT", "Super", "God of Music", "MAESTRO",
  ],
  "Stray Kids": [
    "God's Menu", "Back Door", "Thunderous", "MANIAC", "CASE 143",
    "S-Class", "LALALALA", "Chk Chk Boom", "GIANT", "Social Path (feat. LiSA)",
  ],
}

export const CATALOG_500_2_SONGS =
  Object.entries(CATALOG_500_2).flatMap(
    ([artist, titles]) =>
      titles.map(title => ({
        title,
        artist,
        rangeVerified: false,
        catalogOnly: true,
      }))
  )