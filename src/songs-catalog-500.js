// キミキー 検索用追加カタログ
//
// 既存データと重複する曲は songs.js 側の重複除外で1件にまとまります。
// このファイルでは音域を推測で登録しません。
// 音域未確認の曲は検索・アーティスト一覧には表示し、
// 音域診断・SEO個別ページは確認済みデータが入るまで対象外です。

const CATALOG_500 = {
  "藤井風": [
    "きらり", "何なんw", "旅路", "帰ろう", "優しさ",
    "まつり", "damn", "grace", "花", "Workin' Hard",
  ],
  "B'z": [
    "ultra soul", "LOVE PHANTOM", "イチブトゼンブ", "OCEAN", "愛のままにわがままに 僕は君だけを傷つけない",
    "裸足の女神", "今夜月の見える丘に", "兵、走る", "ALONE", "いつかのメリークリスマス",
  ],
  "DREAMS COME TRUE": [
    "何度でも", "LOVE LOVE LOVE", "未来予想図II", "やさしいキスをして", "うれしい!たのしい!大好き!",
    "大阪LOVER", "サンキュ.", "決戦は金曜日", "朝がまた来る", "晴れたらいいね",
  ],
  "ZARD": [
    "負けないで", "揺れる想い", "マイ フレンド", "心を開いて", "Don't you see!",
    "きっと忘れない", "君がいない", "もう少し あと少し…", "永遠", "息もできない",
  ],
  "THE BLUE HEARTS": [
    "リンダ リンダ", "TRAIN-TRAIN", "情熱の薔薇", "1000のバイオリン", "人にやさしく",
    "青空", "終わらない歌", "夢", "ラブレター", "キスしてほしい",
  ],
  "ASIAN KUNG-FU GENERATION": [
    "リライト", "ソラニン", "君という花", "遥か彼方", "アフターダーク",
    "ブルートレイン", "ループ&ループ", "転がる岩、君に朝が降る", "ワールドアパート", "Re:Re:",
  ],
  "ORANGE RANGE": [
    "花", "上海ハニー", "ロコローション", "イケナイ太陽", "＊〜アスタリスク〜",
    "キリキリマイ", "ラヴ・パレード", "チャンピオーネ", "お願い!セニョリータ", "以心電信",
  ],
  "GReeeeN": [
    "キセキ", "愛唄", "遥か", "オレンジ", "歩み",
    "扉", "道", "旅立ち", "雪の音", "星影のエール",
  ],
  "Aqua Timez": [
    "虹", "千の夜をこえて", "決意の朝に", "等身大のラブソング", "ALONES",
    "Velonica", "プルメリア〜花唄〜", "真夜中のオーケストラ", "MASK", "しおり",
  ],
  "HY": [
    "AM11:00", "366日", "NAO", "Song for...", "ホワイトビーチ",
    "隆福丸", "あなた", "モノクロ", "てがみ", "Street Story",
  ],
  "MONGOL800": [
    "小さな恋のうた", "あなたに", "琉球愛歌", "DON'T WORRY BE HAPPY", "夢叶う",
    "矛盾の上に咲く花", "月灯りの下で", "愛する花", "Special Thanks", "ヨロコビノウタ",
  ],
  "ELLEGARDEN": [
    "Missing", "ジターバグ", "風の日", "Space Sonic", "Salamander",
    "Supernova", "Make A Wish", "Red Hot", "高架線", "The Autumn Song",
  ],
  "[Alexandros]": [
    "ワタリドリ", "閃光", "Adventure", "Dracula La", "Girl A",
    "Mosquito Bite", "Kick&Spin", "Swan", "Famous Day", "月色ホライズン",
  ],
  "sumika": [
    "Lovers", "フィクション", "願い", "ファンファーレ", "Starting Over",
    "ふっかつのじゅもん", "運命", "春風", "Shake & Shake", "Familia",
  ],
  "Novelbright": [
    "Walking with you", "ツキミソウ", "愛とか恋とか", "Sunny drop", "Morning Light",
    "開幕宣言", "夢花火", "seeker", "Cantabile", "雪の音",
  ],
  "MY FIRST STORY": [
    "I'm a mess", "Missing You", "REVIVER", "不可逆リプレイス", "ALONE",
    "ACCIDENT", "1,000,000 TIMES", "モノクロエフェクター", "告白", "Home",
  ],
  "MAN WITH A MISSION": [
    "Raise your flag", "Emotions", "database feat. TAKUMA", "Seven Deadly Sins", "FLY AGAIN",
    "Remember Me", "My Hero", "Winding Road", "Dead End in Tokyo", "INTO THE DEEP",
  ],
  "SPYAIR": [
    "サムライハート (Some Like It Hot!!)", "イマジネーション", "RAGE OF DUST", "現状ディストラクション", "サクラミツツキ",
    "オレンジ", "BEAUTIFUL DAYS", "ROCKIN' OUT", "LIAR", "JUST ONE LIFE",
  ],
  "UVERworld": [
    "CORE PRIDE", "D-tecnoLife", "儚くも永久のカナシ", "一滴の影響", "Touch off",
    "THE OVER", "IMPACT", "激動", "ODD FUTURE", "EN",
  ],
  "フレデリック": [
    "オドループ", "オンリーワンダー", "KITAKU BEATS", "スパークルダンサー", "名悪役",
    "TOGENKYO", "リリリピート", "飄々とエモーション", "かなしいうれしい", "CYAN",
  ],
  "KANA-BOON": [
    "シルエット", "ないものねだり", "フルドライブ", "スターマーカー", "ソングオブザデッド",
    "バトンロード", "Torch of Liberty", "まっさら", "結晶星", "盛者必衰の理、お断り",
  ],
  "THE ORAL CIGARETTES": [
    "狂乱 Hey Kids!!", "BLACK MEMORY", "5150", "容姿端麗な嘘", "ワガママで誤魔化さないで",
    "Dream In Drive", "起死回生STORY", "カンタンナコト", "Shala La", "DIP-BAP",
  ],
  "BLUE ENCOUNT": [
    "ポラリス", "DAY×DAY", "バッドパラドックス", "もっと光を", "VS",
    "FREEDOM", "Survivor", "はじまり", "HEART", "LAST HERO",
  ],
  "クリープハイプ": [
    "栞", "社会の窓", "おやすみ泣き声、さよなら歌姫", "憂、燦々", "寝癖",
    "愛の標識", "ナイトオンザプラネット", "二十九、三十", "イト", "ex ダーリン",
  ],
  "My Hair is Bad": [
    "真赤", "告白", "歓声をさがして", "元彼氏として", "恋人ができたんだ",
    "接吻とフレンド", "いつか結婚しても", "ドラマみたいだ", "フロムナウオン", "宿り",
  ],
  "SUPER BEAVER": [
    "名前を呼ぶよ", "青い春", "突破口", "ひたむき", "美しい日",
    "東京", "小さな革命", "人として", "アイラヴユー", "予感",
  ],
  "DISH//": [
    "猫", "沈丁花", "No.1", "僕らが強く。", "勝手にMY SOUL",
    "Starting Over", "HAPPY", "万々歳", "Replay", "プランA",
  ],
  "wacci": [
    "別の人の彼女になったよ", "恋だろ", "空に笑えば", "大丈夫", "感情",
    "足りない", "最上級", "宝物", "まばたき", "東京",
  ],
  "Omoinotake": [
    "幾億光年", "EVERBLUE", "蕾", "モラトリアム", "心音",
    "産声", "One Day", "トニカ", "By My Side", "So Far So Good",
  ],
  "キタニタツヤ": [
    "青のすみか", "悪魔の踊り方", "Rapport", "聖者の行進", "スカー",
    "化け猫", "私が明日死ぬなら", "Moonthief", "キュートアグレッション", "次回予告",
  ],
  "Eve": [
    "廻廻奇譚", "ドラマツルギー", "心予報", "ナンセンス文学", "ぼくらの",
    "ファイトソング", "アウトサイダー", "いのちの食べ方", "虎狼来", "蒼のワルツ",
  ],
  "yama": [
    "春を告げる", "色彩", "Oz.", "麻痺", "くびったけ",
    "a.m.3:21", "slash", "偽顔", "血流", "クリーム",
  ],
  "ずっと真夜中でいいのに。": [
    "秒針を噛む", "正しくなれない", "お勉強しといてよ", "残機", "暗く黒く",
    "MILABO", "あいつら全員同窓会", "TAIDADA", "勘冴えて悔しいわ", "脳裏上のクラッカー",
  ],
  "羊文学": [
    "光るとき", "more than words", "1999", "Burning", "FOOL",
    "OOPARTS", "マヨイガ", "永遠のブルー", "砂漠のきみへ", "Addiction",
  ],
  "milet": [
    "us", "inside you", "Ordinary days", "Anytime Anywhere", "Fly High",
    "Final Call", "Who I Am", "Drown", "Prover", "checkmate",
  ],
  "MISIA": [
    "Everything", "アイノカタチ feat.HIDE(GReeeeN)", "逢いたくていま", "つつみ込むように…", "BELIEVE",
    "果てなく続くストーリー", "名前のない空を見上げて", "忘れない日々", "オルフェンズの涙", "明日へ",
  ],
  "JUJU": [
    "やさしさで溢れるように", "この夜を止めてよ", "明日がくるなら", "奇跡を望むなら...", "Hello, Again 〜昔からある場所〜",
    "守ってあげたい", "ありがとう", "ラストシーン", "東京", "What You Want",
  ],
  "西野カナ": [
    "トリセツ", "会いたくて 会いたくて", "Darling", "Best Friend", "if",
    "GO FOR IT!!", "Dear...", "君って", "Esperanza", "Have a nice day",
  ],
  "倖田來未": [
    "愛のうた", "Butterfly", "キューティーハニー", "Moon Crying", "恋のつぼみ",
    "you", "夢のうた", "Someday", "real Emotion", "好きで、好きで、好きで。",
  ],
  "浜崎あゆみ": [
    "SEASONS", "M", "Voyage", "BLUE BIRD", "evolution",
    "Boys & Girls", "Dearest", "HEAVEN", "appears", "A Song for ××",
  ],
  "安室奈美恵": [
    "CAN YOU CELEBRATE?", "Hero", "Love Story", "Baby Don't Cry", "Chase the Chance",
    "Body Feels EXIT", "SWEET 19 BLUES", "NEVER END", "a walk in the park", "Fight Together",
  ],
  "Every Little Thing": [
    "Time goes by", "fragile", "Dear My Friend", "For the moment", "出逢った頃のように",
    "Shapes Of Love", "Face the change", "Over and Over", "恋文", "スイミー",
  ],
  "Do As Infinity": [
    "深い森", "陽のあたる坂道", "Yesterday & Today", "本日ハ晴天ナリ", "冒険者たち",
    "柊", "遠くまで", "魔法の言葉〜Would you marry me?〜", "君がいない未来", "Week!",
  ],
  "SPEED": [
    "White Love", "my graduation", "Body & Soul", "STEADY", "Wake Me Up!",
    "ALIVE", "Go! Go! Heaven", "ALL MY TRUE LOVE", "Long Way Home", "Precious Time",
  ],
  "AKB48": [
    "ヘビーローテーション", "恋するフォーチュンクッキー", "365日の紙飛行機", "ポニーテールとシュシュ", "フライングゲット",
    "会いたかった", "大声ダイヤモンド", "Everyday、カチューシャ", "真夏のSounds good!", "涙サプライズ!",
  ],
  "乃木坂46": [
    "インフルエンサー", "シンクロニシティ", "サヨナラの意味", "帰り道は遠回りしたくなる", "きっかけ",
    "裸足でSummer", "君の名は希望", "ガールズルール", "何度目の青空か?", "Monopoly",
  ],
  "Snow Man": [
    "ブラザービート", "Dangerholic", "タペストリー", "オレンジkiss", "Grandeur",
    "HELLO HELLO", "Secret Touch", "D.D.", "KISSIN' MY LIPS", "W",
  ],
  "SixTONES": [
    "Imitation Rain", "マスカラ", "こっから", "NAVIGATOR", "僕が僕じゃないみたいだ",
    "わたし", "Good Luck!", "ABARERO", "CREAK", "音色",
  ],
  "King & Prince": [
    "シンデレラガール", "koi-wazurai", "恋降る月夜に君想ふ", "ichiban", "ツキヨミ",
    "TraceTrace", "Life goes on", "Magic Touch", "なにもの", "愛し生きること",
  ],
  "なにわ男子": [
    "初心LOVE", "The Answer", "サチアレ", "Special Kiss", "Make Up Day",
    "I Wish", "Poppin' Hoppin' Lovin'", "ハッピーサプライズ", "Missing", "Alpha",
  ],
  "BE:FIRST": [
    "Bye-Good-Bye", "Boom Boom Back", "Mainstream", "Gifted.", "Smile Again",
    "Shining One", "Masterplan", "Sailing", "Blissful", "Spacecraft",
  ],
  "JO1": [
    "無限大", "Born To Be Wild", "SuperCali", "Trigger", "Tiger",
    "With Us", "Love seeker", "WHERE DO WE GO", "Gradation", "飛べるから",
  ],
  "BTS": [
    "Dynamite", "Butter", "Permission to Dance", "DNA", "Boy With Luv feat. Halsey",
    "FAKE LOVE", "Spring Day", "MIC Drop", "Life Goes On", "Yet To Come",
  ],
  "TWICE": [
    "TT", "What is Love?", "FANCY", "Feel Special", "The Feels",
    "I CAN'T STOP ME", "LIKEY", "CHEER UP", "Dance The Night Away", "YES or YES",
  ],
  "BLACKPINK": [
    "DDU-DU DDU-DU", "Kill This Love", "How You Like That", "Lovesick Girls", "Pink Venom",
    "Shut Down", "BOOMBAYAH", "As If It's Your Last", "Playing with Fire", "WHISTLE",
  ],
  "YUI": [
    "CHE.R.RY", "Good-bye days", "SUMMER SONG", "again", "Rolling star",
    "GLORIA", "LIFE", "HELLO", "feel my soul", "Namidairo",
  ],
  "絢香": [
    "三日月", "にじいろ", "I believe", "みんな空の下", "おかえり",
    "夢を味方に", "Real voice", "Jewelry day", "はじまりのとき", "number one",
  ],
  "中島美嘉": [
    "雪の華", "ORION", "STARS", "LIFE", "WILL",
    "桜色舞うころ", "FIND THE WAY", "一番綺麗な私を", "愛してる", "火の鳥",
  ],
  "星野源": [
    "恋", "SUN", "不思議", "創造", "アイデア",
    "ドラえもん", "Family Song", "Pop Virus", "喜劇", "光の跡",
  ],
  "コブクロ": [
    "蕾", "桜", "ここにしか咲かない花", "流星", "赤い糸",
    "永遠にともに", "YELL〜エール〜", "君という名の翼", "未来", "風",
  ],
  "EXILE": [
    "道", "Lovers Again", "Ti Amo", "Choo Choo TRAIN", "Rising Sun",
    "ただ…逢いたくて", "I Wish For You", "Someday", "もっと強く", "Each Other's Way 〜旅の途中〜",
  ],
  "ゆず": [
    "夏色", "栄光の架橋", "ヒカレ", "表裏一体", "虹",
    "友 〜旅立ちの時〜", "雨のち晴レルヤ", "桜木町", "いつか", "からっぽ",
  ],
  "レミオロメン": [
    "3月9日", "粉雪", "南風", "太陽の下", "電話",
    "雨上がり", "Wonderful & Beautiful", "茜空", "モラトリアム", "もっと遠くへ",
  ],
  "スキマスイッチ": [
    "奏（かなで）", "全力少年", "ボクノート", "ガラナ", "藍",
    "雫", "ゴールデンタイムラバー", "星のうつわ", "Ah Yeah!!", "view",
  ],
  "秦 基博": [
    "ひまわりの約束", "鱗", "アイ", "朝が来る前に", "Rain",
    "スミレ", "水彩の月", "70億のピース", "初恋", "Girl",
  ],
}

export const CATALOG_500_SONGS =
  Object.entries(CATALOG_500).flatMap(
    ([artist, titles]) =>
      titles.map(title => ({
        title,
        artist,
        rangeVerified: false,
        catalogOnly: true,
      }))
  )
