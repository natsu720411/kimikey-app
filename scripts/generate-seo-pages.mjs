import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename =
  fileURLToPath(import.meta.url)

const __dirname =
  path.dirname(__filename)

const rootDir =
  path.resolve(__dirname, '..')

const publicDir =
  path.join(rootDir, 'public')

const SITE_URL =
  'https://kimikey-app.vercel.app'

const GA_ID =
  'G-1B35Z51M10'


// ==========================================
// SEO記事
// ==========================================

const pages = [

  // ========================================
  // カラオケのキーの合わせ方
  // ========================================

  {
    slug:
      'karaoke-key-guide',

    title:
      'カラオケのキーの合わせ方｜自分に合うキーを見つける方法｜キミキー',

    h1:
      'カラオケのキーの合わせ方｜自分に合うキーを見つける方法',

    description:
      'カラオケのキーの合わせ方を初心者向けに解説。高すぎる・低すぎる曲をどう調整するか、自分の音域と曲の最高音・最低音を使って決める方法を紹介します。',

    lead:
      '「原曲キーだと高すぎる」「キーを下げたら今度は低くなった」という人向けに、自分に合うカラオケキーの探し方を分かりやすく解説します。',

    conclusion:
      '曲の最高音だけでなく最低音も、自分の無理なく歌える音域に入るように調整するのが基本です。高すぎればキーを下げ、低すぎればキーを上げます。',

    sections: [

      {
        heading:
          'カラオケの「キー」とは？',

        paragraphs: [
          'キーを変更すると、曲全体の音の高さが同じ幅だけ上下します。一般的なカラオケでは「+1」「-1」で半音ずつ動きます。',
          'メロディーの形はそのままなので、自分の声に合う高さへ移動できます。',
        ],
      },

      {
        heading:
          '自分に合うキーの合わせ方',

        paragraphs: [
          'まず原曲キーでサビと低い部分の両方を歌ってみます。',
          '高音が苦しい場合はキーを下げ、低音が苦しい場合はキーを上げます。',
          '1〜2ずつ動かして、最高音と最低音の両方が無理なく出る位置を探します。',
          '最後は1曲通して歌い、最後まで安定して歌えるかを確認します。',
        ],
      },

      {
        heading:
          '高い曲は何キー下げればいい？',

        paragraphs: [
          '「男性なら-4」「女性なら+3」のように、一律で決めることはできません。声の高さや得意な音域は人によって違うためです。',
          'まずは1〜2ずつ動かしてサビを歌い、まだ苦しければさらに下げる方法がおすすめです。',
          'ただし、キーを下げるほどAメロなどの低音も低くなるため、最低音が出るかも確認しましょう。',
        ],
      },

      {
        heading:
          'キーを下げても歌いにくい原因',

        paragraphs: [
          '高音を楽にするためにキーを下げすぎると、低音部分が自分の音域より低くなることがあります。',
          'また、最高音を一度出せても、高い音が何度も続く曲では疲れやすくなります。',
          '限界音域ではなく、安定して歌える快適音域を基準にするのがおすすめです。',
          'テンポ、息継ぎ、音程の跳び方などでも歌いやすさは変わるため、キーだけで解決しない場合もあります。',
        ],
      },

    ],

    faqs: [

      {
        question:
          'カラオケのキーはどうやって合わせますか？',

        answer:
          '原曲の最高音・最低音を自分の快適音域と比べ、曲全体が無理なく歌える位置へ調整します。',
      },

      {
        question:
          'キーを1つ下げるとどれくらい変わりますか？',

        answer:
          '一般的なカラオケでは、1つ下げると半音下がります。',
      },

      {
        question:
          '原曲キーで歌えないのはおかしいですか？',

        answer:
          '珍しいことではありません。原曲歌手と自分では声域が異なるので、自分に合うキーへ調整する方が自然です。',
      },

    ],

    related: [

      {
        href:
          '/vocal-range-check/',

        label:
          '自分の音域を調べる方法',
      },

      {
        href:
          '/song-finder-guide/',

        label:
          '自分に合う曲の調べ方',
      },

      {
        href:
          '/guides/',

        label:
          '音域から曲を探す',
      },

    ],
  },


  // ========================================
  // 自分に合う曲
  // ========================================

  {
    slug:
      'song-finder-guide',

    title:
      '自分に合う曲の調べ方｜歌いやすい曲を音域から探す方法｜キミキー',

    h1:
      '自分に合う曲の調べ方｜歌いやすい曲を音域から探す方法',

    description:
      '自分に合う曲・歌いやすい曲の調べ方を解説。自分の音域と曲の最低音・最高音を比較して、カラオケで歌いやすい曲を探す方法を紹介します。',

    lead:
      '「自分に合う曲が分からない」「カラオケで何を歌えばいいか迷う」という人向けに、音域を使って歌いやすい曲を探す方法を紹介します。',

    conclusion:
      'まず自分の快適音域を測り、曲の最低音と最高音がその範囲に近い曲を探すと、候補を絞りやすくなります。',

    sections: [

      {
        heading:
          '自分に合う曲はどう決める？',

        paragraphs: [
          '歌いやすさは声質やテンポなどでも変わりますが、最初の絞り込みには音域が便利です。',
          '自分の最低音・最高音と、曲の最低音・最高音を比べることで、高すぎる曲や低すぎる曲を避けやすくなります。',
        ],
      },

      {
        heading:
          '自分に合う曲を探す3ステップ',

        paragraphs: [
          'まず自分の快適音域を測ります。頑張れば出る限界音域より、無理なく安定して歌える範囲を使います。',
          '次に、歌いたい曲の最低音と最高音を確認します。',
          '最後に、自分の音域に近い曲から実際に歌ってみます。必要であればカラオケのキーを調整します。',
        ],
      },

      {
        heading:
          '音域が合っていても歌いにくい理由',

        paragraphs: [
          'テンポが速い、息継ぎが難しい、高音が長く続く、音程の上下が大きいなどの要素でも難易度は変わります。',
          '音域は「候補を絞るための目安」として使い、最後は実際に歌った感覚で判断するのがおすすめです。',
        ],
      },

      {
        heading:
          '曲選びで確認したいポイント',

        paragraphs: [
          '最高音が自分の快適音域を大きく超えていないか確認します。',
          '最低音が自分には低すぎないかも確認します。',
          '高音が何度も続く曲の場合は、最高音を一度出せるだけではなく、繰り返し安定して出せるかも重要です。',
          '原曲キーで合わなくても、キー調整によって歌いやすくできる曲もあります。',
        ],
      },

    ],

    faqs: [

      {
        question:
          '自分に合う曲はどうやって調べますか？',

        answer:
          '自分の快適音域と曲の最低音・最高音を比べ、範囲が近い曲から試すと探しやすくなります。',
      },

      {
        question:
          '音域が狭い曲なら必ず歌いやすいですか？',

        answer:
          '必ずではありません。テンポ、声質、息継ぎ、音程変化なども歌いやすさに影響します。',
      },

      {
        question:
          '好きな曲が音域に合わない場合は？',

        answer:
          'カラオケのキーを上下して、自分の快適音域に近づける方法があります。',
      },

    ],

    related: [

      {
        href:
          '/vocal-range-check/',

        label:
          '自分の音域を調べる方法',
      },

      {
        href:
          '/karaoke-key-guide/',

        label:
          'カラオケのキーの合わせ方',
      },

      {
        href:
          '/guides/',

        label:
          '音域別の曲一覧を見る',
      },

    ],
  },


  // ========================================
  // 男性の音域
  // ========================================

  {
    slug:
      'male-vocal-range',

    title:
      '男性の音域の調べ方｜自分の最低音・最高音を測る方法｜キミキー',

    h1:
      '男性の音域の調べ方｜自分の最低音・最高音を測る方法',

    description:
      '男性の音域を調べたい人向けに、自分の最低音・最高音を測る方法と、カラオケの曲選び・キー調整への活かし方を解説します。',

    lead:
      '男性の平均的な声の高さが気になっても、実際に歌いやすい範囲は人によってかなり違います。自分の音域を測って曲選びに使う方法を紹介します。',

    conclusion:
      '平均値だけで決めず、自分で安定して出せる最低音・最高音を測ることが、曲選びやキー調整には一番実用的です。',

    sections: [

      {
        heading:
          '男性の音域は人によって違う',

        paragraphs: [
          '男性の声には低め・高めの傾向がありますが、実際の歌唱音域には大きな個人差があります。',
          '地声と裏声の使い方、発声経験、体調によっても変わるため、平均だけで自分の音域を判断しないことが大切です。',
        ],
      },

      {
        heading:
          '男性が自分の音域を測る方法',

        paragraphs: [
          '普段出しやすい高さから始め、少しずつ低くして安定して出せる最低音を確認します。',
          '次に少しずつ高くして最高音を確認します。',
          '高音では無理に力まず、同じ高さを少し保てるかを基準にしましょう。',
          '限界まで出せる音域と、曲の中で安定して使える快適音域を分けて記録すると実用的です。',
        ],
      },

      {
        heading:
          '男性向けの曲を選ぶときのポイント',

        paragraphs: [
          '男性ボーカル曲でも、最高音がかなり高い曲や広い音域を使う曲があります。',
          '「男性曲だから歌いやすい」と決めつけず、曲ごとの最低音・最高音と自分の快適音域を比較します。',
        ],
      },

      {
        heading:
          '高い男性曲を歌いたい場合',

        paragraphs: [
          '原曲キーが高い場合は、キーを下げる方法があります。',
          'ただし下げすぎると低音が出にくくなるため、最低音も一緒に確認します。',
          '最高音を一度出せるかより、曲の最後まで安定して繰り返せるかを見る方が実践的です。',
        ],
      },

    ],

    faqs: [

      {
        question:
          '男性の平均音域を基準にしてもいいですか？',

        answer:
          '参考にはなりますが個人差が大きいため、曲選びには自分の実測した音域を使う方が実用的です。',
      },

      {
        question:
          '高い声が出ない男性でもカラオケは楽しめますか？',

        answer:
          'はい。低めの曲を選ぶほか、キーを調整して自分の音域へ合わせる方法があります。',
      },

      {
        question:
          '裏声も音域に含めますか？',

        answer:
          '目的によります。曲選びでは、地声・裏声を含めて実際に安定して歌える範囲を把握するのがおすすめです。',
      },

    ],

    related: [

      {
        href:
          '/vocal-range-check/',

        label:
          '自分の音域を調べる方法',
      },

      {
        href:
          '/guides/male-songs/',

        label:
          '男性向けの曲を探す',
      },

      {
        href:
          '/guides/male-high-note-training/',

        label:
          '男性の高音練習向け曲を見る',
      },

    ],
  },


  // ========================================
  // 女性の音域
  // ========================================

  {
    slug:
      'female-vocal-range',

    title:
      '女性の音域の調べ方｜自分の最低音・最高音を測る方法｜キミキー',

    h1:
      '女性の音域の調べ方｜自分の最低音・最高音を測る方法',

    description:
      '女性の音域を調べたい人向けに、自分の最低音・最高音を測る方法と、カラオケの曲選び・キー調整への活かし方を解説します。',

    lead:
      '女性の声も高さには大きな個人差があります。平均だけではなく、自分が安定して歌える最低音・最高音を測って曲選びに活かす方法を紹介します。',

    conclusion:
      '高音が出るかだけでなく、低音から高音まで安定して歌える範囲を測ることが、自分に合う曲を見つける近道です。',

    sections: [

      {
        heading:
          '女性の音域にも大きな個人差がある',

        paragraphs: [
          '女性ボーカル曲は高音を使う曲が多い一方、低めの声質に合う曲もあります。',
          '声の高さ、地声と裏声のつながり、発声経験によって歌いやすい範囲は変わるため、平均値だけで判断しないことが大切です。',
        ],
      },

      {
        heading:
          '女性が自分の音域を測る方法',

        paragraphs: [
          '普段出しやすい高さから始め、少しずつ低くして安定して出せる最低音を確認します。',
          '次に少しずつ高くして最高音を確認します。',
          '高音は一瞬出るだけではなく、少し安定して保てるかを目安にします。',
          '頑張れば出る限界音域と、曲の中で無理なく使える快適音域を分けて記録すると便利です。',
        ],
      },

      {
        heading:
          '女性向けの曲を選ぶときのポイント',

        paragraphs: [
          '女性ボーカル曲でも最高音や最低音には大きな差があります。',
          '高い曲が苦手なら、最高音が比較的低めの曲から探すと選びやすくなります。',
          '自分の快適音域に近い曲を選び、必要ならキーを上下して調整します。',
        ],
      },

      {
        heading:
          '低めの女性の声でも歌いやすい曲はある',

        paragraphs: [
          '高音が得意でなくても問題ありません。',
          '低めの女性ボーカル曲や、キーを下げて歌いやすくできる曲があります。',
          '高音だけでなく最低音とのバランスを確認しながら、自分に合う高さを探します。',
        ],
      },

    ],

    faqs: [

      {
        question:
          '女性の平均音域を基準にしてもいいですか？',

        answer:
          '参考にはなりますが個人差が大きいため、実際の曲選びでは自分で測った快適音域を使うのがおすすめです。',
      },

      {
        question:
          '女性なのに低い声でも大丈夫ですか？',

        answer:
          'もちろんです。声の高さには個人差があり、低めの声に合う曲やキー調整を活用できます。',
      },

      {
        question:
          '高音は裏声で測ってもいいですか？',

        answer:
          '目的によります。カラオケで実際に使える声で、安定して出せる範囲を把握するのが実用的です。',
      },

    ],

    related: [

      {
        href:
          '/vocal-range-check/',

        label:
          '自分の音域を調べる方法',
      },

      {
        href:
          '/guides/female-songs/',

        label:
          '女性向けの曲を探す',
      },

      {
        href:
          '/guides/low-female-songs/',

        label:
          '低めの女性ボーカル曲を見る',
      },

    ],
  },

]


// ==========================================
// HTMLエスケープ
// ==========================================

function escapeHtml(value) {

  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}


// ==========================================
// Google Analytics
// ==========================================

function googleAnalyticsTag() {

  return `
  <!-- Google tag (gtag.js) -->

  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"
  ></script>

  <script>

    window.dataLayer =
      window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag(
      'js',
      new Date()
    );

    gtag(
      'config',
      '${GA_ID}'
    );

  </script>
  `
}


// ==========================================
// 共通CSS
// ==========================================

const CSS = `

* {
  box-sizing: border-box;
}

body {
  margin: 0;

  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  background: #f6f7fb;

  color: #222;

  line-height: 1.8;
}

.container {
  width:
    min(
      780px,
      calc(100% - 30px)
    );

  margin: 0 auto;

  padding:
    24px 0 60px;
}

.logo {
  display: inline-block;

  margin-bottom: 18px;

  color: #222;

  font-size: 22px;

  font-weight: 800;

  text-decoration: none;
}

.breadcrumb {
  margin-bottom: 15px;

  color: #777;

  font-size: 13px;
}

.breadcrumb a {
  color: #555;
}

.card {
  padding: 30px;

  background: white;

  border-radius: 20px;

  box-shadow:
    0 8px 30px
    rgba(0, 0, 0, 0.06);
}

h1 {
  margin:
    0 0 15px;

  font-size: 34px;

  line-height: 1.4;
}

h2 {
  margin-top: 42px;

  padding-bottom: 8px;

  border-bottom:
    2px solid #eef0f7;

  font-size: 23px;

  line-height: 1.5;
}

.lead {
  color: #555;

  font-size: 17px;
}

.point {
  margin:
    25px 0;

  padding: 18px;

  background: #f7f8fc;

  border-radius: 14px;
}

.cta-box {
  margin:
    32px 0;

  padding: 24px;

  background:
    linear-gradient(
      135deg,
      #f1efff,
      #eef6ff
    );

  border-radius: 18px;

  text-align: center;
}

.cta-box h2 {
  margin:
    0 0 8px;

  padding: 0;

  border: 0;
}

.cta {
  display: block;

  margin-top: 16px;

  padding: 16px;

  background: #111;

  border-radius: 14px;

  color: white;

  font-weight: 800;

  text-decoration: none;
}

.faq {
  margin:
    15px 0;

  padding: 16px;

  border:
    1px solid #e7e9f1;

  border-radius: 14px;
}

.faq h3 {
  margin:
    0 0 8px;

  font-size: 18px;
}

.faq p {
  margin: 0;

  color: #555;
}

.related {
  display: grid;

  gap: 10px;
}

.related a {
  display: block;

  padding: 14px;

  background: #f7f8fc;

  border-radius: 12px;

  color: #222;

  font-weight: 700;

  text-decoration: none;
}

.notice {
  margin-top: 30px;

  color: #777;

  font-size: 12px;
}

.back {
  display: block;

  margin-top: 20px;

  text-align: center;

  color: #555;
}

@media (
  max-width: 520px
) {

  .container {
    width:
      calc(100% - 20px);

    padding-top: 16px;
  }

  .card {
    padding:
      22px 16px;
  }

  h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 21px;
  }

}

`


// ==========================================
// FAQ 構造化データ
// ==========================================

function createFaqJson(page) {

  return JSON.stringify({

    '@context':
      'https://schema.org',

    '@type':
      'FAQPage',

    mainEntity:
      page.faqs.map(
        faq => ({

          '@type':
            'Question',

          name:
            faq.question,

          acceptedAnswer: {

            '@type':
              'Answer',

            text:
              faq.answer,

          },

        })
      ),

  })
}


// ==========================================
// SEOページHTML
// ==========================================

function createPage(page) {

  const sections =
    page.sections
      .map(
        section => `

      <h2>
        ${escapeHtml(
          section.heading
        )}
      </h2>

      ${section.paragraphs
        .map(
          paragraph => `
      <p>
        ${escapeHtml(
          paragraph
        )}
      </p>
      `
        )
        .join('')}

        `
      )
      .join('')


  const faqHtml =
    page.faqs
      .map(
        faq => `

      <div class="faq">

        <h3>
          ${escapeHtml(
            faq.question
          )}
        </h3>

        <p>
          ${escapeHtml(
            faq.answer
          )}
        </p>

      </div>

        `
      )
      .join('')


  const relatedHtml =
    page.related
      .map(
        item => `

      <a
        href="${item.href}"
      >
        ${escapeHtml(
          item.label
        )}
        →
      </a>

        `
      )
      .join('')


  return `
<!doctype html>

<html lang="ja">

<head>

  ${googleAnalyticsTag()}

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>
    ${escapeHtml(
      page.title
    )}
  </title>

  <meta
    name="description"
    content="${escapeHtml(
      page.description
    )}"
  >

  <meta
    name="robots"
    content="index, follow"
  >

  <link
    rel="canonical"
    href="${SITE_URL}/${page.slug}/"
  >

  <link
    rel="icon"
    type="image/svg+xml"
    href="/favicon.svg"
  >

  <meta
    property="og:type"
    content="article"
  >

  <meta
    property="og:site_name"
    content="キミキー"
  >

  <meta
    property="og:title"
    content="${escapeHtml(
      page.h1
    )}"
  >

  <meta
    property="og:description"
    content="${escapeHtml(
      page.description
    )}"
  >

  <meta
    property="og:url"
    content="${SITE_URL}/${page.slug}/"
  >

  <meta
    name="twitter:card"
    content="summary"
  >

  <script type="application/ld+json">
    ${createFaqJson(page)}
  </script>

  <style>
    ${CSS}
  </style>

</head>


<body>

  <main class="container">

    <a
      class="logo"
      href="/"
    >
      🎤 キミキー
    </a>


    <div class="breadcrumb">

      <a href="/">
        トップ
      </a>

      ＞

      ${escapeHtml(
        page.h1
      )}

    </div>


    <article class="card">

      <h1>
        ${escapeHtml(
          page.h1
        )}
      </h1>


      <p class="lead">

        ${escapeHtml(
          page.lead
        )}

      </p>


      <div class="point">

        <strong>
          先に結論
        </strong>

        <p>

          ${escapeHtml(
            page.conclusion
          )}

        </p>

      </div>


      ${sections}


      <div class="cta-box">

        <h2>
          自分の音域を測ってみる
        </h2>

        <p>
          キミキーなら、
          マイクを使って最低音・最高音を確認できます。
        </p>

        <a
          class="cta"
          href="/"
        >
          🎤 キミキーで音域を測定する
        </a>

      </div>


      <h2>
        よくある質問
      </h2>


      ${faqHtml}


      <h2>
        関連記事
      </h2>


      <div class="related">

        ${relatedHtml}

      </div>


      <div class="cta-box">

        <h2>
          自分に合う曲・キーを探す
        </h2>

        <p>
          まず自分の音域を確認して、
          曲の音域と比べてみましょう。
        </p>

        <a
          class="cta"
          href="/"
        >
          🎤 キミキーを使ってみる
        </a>

      </div>


      <p class="notice">

        ※ 音域や歌いやすさには
        個人差があります。
        喉に痛みや強い違和感がある場合は
        無理に発声しないでください。

      </p>

    </article>


    <a
      class="back"
      href="/"
    >
      ← キミキーのトップへ戻る
    </a>

  </main>

</body>

</html>
`
}


// ==========================================
// 4ページ生成
// ==========================================

pages.forEach(
  page => {

    const folder =
      path.join(
        publicDir,
        page.slug
      )

    fs.mkdirSync(
      folder,
      {
        recursive: true,
      }
    )

    fs.writeFileSync(
      path.join(
        folder,
        'index.html'
      ),
      createPage(page),
      'utf8'
    )

  }
)


// ==========================================
// guides一覧に内部リンク追加
// ==========================================

const guidesIndexPath =
  path.join(
    publicDir,
    'guides',
    'index.html'
  )


if (
  fs.existsSync(
    guidesIndexPath
  )
) {

  let html =
    fs.readFileSync(
      guidesIndexPath,
      'utf8'
    )


  const marker =
    '<div class="songs">'


  if (
    html.includes(marker) &&
    !html.includes(
      '/karaoke-key-guide/'
    )
  ) {

    const links =
      pages
        .map(
          page => `

      <a
        class="song"
        href="/${page.slug}/"
      >

        <strong>
          ${escapeHtml(
            page.h1
          )}
        </strong>

        <span>
          キミキーの解説記事
        </span>

      </a>

          `
        )
        .join('')


    html =
      html.replace(
        marker,
        `${marker}${links}`
      )


    fs.writeFileSync(
      guidesIndexPath,
      html,
      'utf8'
    )

  }

}


// ==========================================
// sitemap.xmlに追加
// ==========================================

const sitemapPath =
  path.join(
    publicDir,
    'sitemap.xml'
  )


if (
  fs.existsSync(
    sitemapPath
  )
) {

  let sitemap =
    fs.readFileSync(
      sitemapPath,
      'utf8'
    )


  const today =
    new Date()
      .toISOString()
      .slice(0, 10)


  const additions =
    pages
      .filter(
        page =>
          !sitemap.includes(
            `${SITE_URL}/${page.slug}/`
          )
      )
      .map(
        page => `

  <url>

    <loc>${SITE_URL}/${page.slug}/</loc>

    <lastmod>${today}</lastmod>

  </url>

        `
      )
      .join('')


  if (additions) {

    sitemap =
      sitemap.replace(
        '</urlset>',
        `${additions}\n</urlset>`
      )


    fs.writeFileSync(
      sitemapPath,
      sitemap,
      'utf8'
    )

  }

}


// ==========================================
// 完了表示
// ==========================================

console.log(
  `✅ SEO記事を${pages.length}ページ生成しました`
)

console.log(
  '✅ guides一覧へ内部リンクを追加しました'
)

console.log(
  '✅ sitemap.xmlへSEO記事URLを追加しました'
)
