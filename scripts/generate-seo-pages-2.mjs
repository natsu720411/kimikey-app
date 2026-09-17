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
  // 高音が出ない
  // ========================================

  {
    slug:
      'karaoke-high-note-problem',

    title:
      'カラオケで高音が出ないときは？原因と曲・キーの選び方｜キミキー',

    h1:
      'カラオケで高音が出ないときは？原因と曲・キーの選び方',

    description:
      'カラオケで高音が出ない、サビだけ苦しいという人向けに、音域の確認方法、キー調整、曲選びのポイントを初心者向けに解説します。',

    lead:
      '「Aメロは歌えるのにサビになると声が出ない」「高音になると苦しくなる」という場合、曲の最高音が自分の歌いやすい音域を超えている可能性があります。',

    conclusion:
      'まず自分の最高音を確認し、曲の最高音と比較します。高すぎる場合は、無理に原曲キーで歌わず、キーを下げたり別の曲を選んだりする方法があります。',

    sections: [

      {
        heading:
          'なぜカラオケで高音が出ない？',

        paragraphs: [
          '曲の最高音が自分の快適音域より高いと、サビだけ急に苦しくなることがあります。',
          'また、一度だけ出せる高音でも、曲の中で何度も続くと疲れやすくなります。',
          '音域だけではなく、テンポや息継ぎ、高音が続く長さによっても難しさは変わります。',
        ],
      },

      {
        heading:
          'まず自分の最高音を確認する',

        paragraphs: [
          '普段出しやすい高さから少しずつ声を高くして、無理なく安定して出せる最高音を確認します。',
          '一瞬だけ出せる音ではなく、曲の中でも使えそうな高さを基準にするのがおすすめです。',
          'キミキーではマイクを使って、自分の音程や音域を確認できます。',
        ],
      },

      {
        heading:
          '高い曲はキーを下げる',

        paragraphs: [
          '原曲の最高音が高すぎる場合は、カラオケのキーを下げることで曲全体を低くできます。',
          'まずは-1〜-2程度から試し、まだ高ければ少しずつ下げます。',
          'ただし、下げすぎると低音部分が低くなりすぎるため、最低音も確認することが大切です。',
        ],
      },

      {
        heading:
          '高音が苦手な人の曲選び',

        paragraphs: [
          '最高音が低めの曲や、音域の幅が狭めの曲から選ぶと候補を絞りやすくなります。',
          '男性曲・女性曲という分類だけで判断せず、実際の最低音と最高音を見ることが重要です。',
          '原曲キーで合わなくても、キー調整によって歌いやすくできる曲もあります。',
        ],
      },

    ],

    faqs: [

      {
        question:
          '高音が出ない場合はキーを何個下げればいいですか？',

        answer:
          '決まった数はありません。まず1〜2ずつ下げ、最高音と最低音の両方が無理なく歌えるか確認します。',
      },

      {
        question:
          '高音は無理に練習して出した方がいいですか？',

        answer:
          '無理に力を入れて発声する必要はありません。痛みや強い違和感がある場合は発声をやめて休みましょう。',
      },

      {
        question:
          '高い曲でもキーを下げれば歌えますか？',

        answer:
          '歌いやすくなる場合があります。ただし、下げすぎると最低音が低くなりすぎる場合があります。',
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
          '/guides/high-note-songs/',

        label:
          '高音が高い曲を確認する',
      },

    ],
  },


  // ========================================
  // 音域を広げる
  // ========================================

  {
    slug:
      'vocal-range-training',

    title:
      '音域を広げるには？無理なく練習する方法と音域チェック｜キミキー',

    h1:
      '音域を広げるには？無理なく練習する方法と音域チェック',

    description:
      '歌の音域を広げたい人向けに、現在の音域の測り方、低音・高音練習の考え方、無理なく続けるためのポイントを紹介します。',

    lead:
      '「もっと高い曲を歌いたい」「低い音も安定して出したい」というときは、まず現在の音域を把握してから少しずつ練習することが大切です。',

    conclusion:
      '最初に現在の最低音・最高音を記録し、無理のない範囲で少しずつ練習します。毎回限界まで声を出すより、安定して歌える範囲を広げていく考え方がおすすめです。',

    sections: [

      {
        heading:
          '最初に現在の音域を測る',

        paragraphs: [
          '音域を広げたい場合でも、最初に今どこまで安定して声を出せるか確認することが重要です。',
          '最低音と最高音を記録しておくと、練習後に変化を比較できます。',
          '限界音域と、曲の中で使える快適音域を分けて記録すると分かりやすくなります。',
        ],
      },

      {
        heading:
          '高音は少しずつ確認する',

        paragraphs: [
          '普段出しやすい高さから少しずつ上げていき、苦しくなる前の高さを確認します。',
          '首や喉に強く力を入れて無理に高い音を出すのではなく、安定して出せる音を増やしていくことが大切です。',
          'その日の体調によっても声の出やすさは変わるため、一回の測定だけで判断しないようにします。',
        ],
      },

      {
        heading:
          '低音も忘れずに確認する',

        paragraphs: [
          '音域というと高音だけに注目しがちですが、カラオケでは最低音も重要です。',
          '高音を出しやすくするためにキーを下げると、曲の最低音も低くなります。',
          '高音と低音の両方を確認することで、自分に合う曲やキーを探しやすくなります。',
        ],
      },

      {
        heading:
          '定期的に音域を測る',

        paragraphs: [
          '同じ条件で定期的に測ると、以前より安定して出せる音が増えたか確認できます。',
          '単に最高音の数字だけを見るのではなく、その音を無理なく維持できるかも確認しましょう。',
        ],
      },

    ],

    faqs: [

      {
        question:
          '音域は広げることができますか？',

        answer:
          '発声練習によって、安定して使える範囲が変わることはあります。ただし変化には個人差があります。',
      },

      {
        question:
          '毎日最高音まで声を出した方がいいですか？',

        answer:
          '無理に限界まで声を出す必要はありません。痛みや強い違和感がある場合は休みましょう。',
      },

      {
        question:
          '音域が広がったかどうやって確認しますか？',

        answer:
          '最低音と最高音を同じような条件で定期的に測り、安定して出せる範囲を比較すると確認しやすくなります。',
      },

    ],

        related: [

      {
        href:
          '/pitch-training/',

        label:
          '音程を合わせる練習をする',
      },

      {
        href:
          '/vocal-range-check/',

        label:
          '自分の音域を調べる方法',
      },

      {
        href:
          '/karaoke-high-note-problem/',

        label:
          '高音が出ないときの対処',
      },

      {
        href:
          '/guides/male-high-note-training/',

        label:
          '高音練習向けの曲を見る',
      },

    ],
  },


  // ========================================
  // 地声と裏声
  // ========================================

  {
    slug:
      'chest-falsetto-difference',

    title:
      '地声と裏声の違いは？音域を測るときはどちらを使う？｜キミキー',

    h1:
      '地声と裏声の違いは？音域を測るときはどちらを使う？',

    description:
      '地声と裏声の違いを初心者向けに解説。自分の音域を測るときに地声・裏声をどう扱うか、カラオケの曲選びにどう使うかを紹介します。',

    lead:
      '音域を測っていると「裏声で出た高音も自分の音域に入れていいの？」と迷うことがあります。大切なのは、何のために音域を測るかです。',

    conclusion:
      'カラオケの曲選びでは、地声・裏声を含めて実際に曲の中で安定して使える範囲を把握するのがおすすめです。地声だけの範囲も別に記録しておくとさらに便利です。',

    sections: [

      {
        heading:
          '地声とは？',

        paragraphs: [
          '普段の会話に近い感覚で使う声を、歌では地声として扱うことがあります。',
          '低音から中音では地声を使いやすい人が多く、カラオケでも重要な音域です。',
        ],
      },

      {
        heading:
          '裏声とは？',

        paragraphs: [
          '高い音を出すときに、地声とは違う軽い感覚の声へ切り替わることがあります。',
          '曲によっては裏声を使うことを前提にした高音もあるため、歌える曲を考える場合は裏声も重要です。',
        ],
      },

      {
        heading:
          '音域測定ではどちらを使う？',

        paragraphs: [
          '曲選びが目的なら、実際に歌の中で使える地声・裏声の両方を確認すると便利です。',
          'ただし「地声でどこまで出せるか」を知りたい場合は、地声だけを別に測定します。',
          '限界音域、快適音域、地声音域のように分けて記録すると、自分の声を把握しやすくなります。',
        ],
      },

      {
        heading:
          'カラオケでは使い分けが大切',

        paragraphs: [
          '原曲歌手が高音で裏声を使っている曲を、すべて地声で歌おうとすると苦しくなる場合があります。',
          '逆に、自分が安定して使える裏声を活用することで、歌える曲の幅が広がることもあります。',
          '無理に原曲と同じ歌い方をする必要はなく、自分の声に合う方法を選ぶことが大切です。',
        ],
      },

    ],

    faqs: [

      {
        question:
          '裏声も自分の音域に入りますか？',

        answer:
          '目的によります。カラオケで歌える範囲を知る場合は、安定して使える裏声も含めて考える方法があります。',
      },

      {
        question:
          '地声の最高音だけ測ることもできますか？',

        answer:
          'できます。地声から裏声に切り替わる前までを別に記録すると、自分の地声音域を把握しやすくなります。',
      },

      {
        question:
          '裏声を使うのは良くないですか？',

        answer:
          '裏声は歌で一般的に使われる表現方法の一つです。曲や自分の声に合わせて使い分けます。',
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
          '/vocal-range-training/',

        label:
          '音域を広げるときの考え方',
      },

      {
        href:
          '/karaoke-high-note-problem/',

        label:
          '高音が出ないときの対処',
      },

    ],
  },


  // ========================================
  // 声が低い人のカラオケ
  // ========================================

  {
    slug:
      'low-voice-karaoke-guide',

    title:
      '声が低い人のカラオケ曲の選び方｜高音が苦手でも歌いやすくする方法｜キミキー',

    h1:
      '声が低い人のカラオケ曲の選び方',

    description:
      '声が低くてカラオケで歌える曲が見つからない人向けに、最高音・最低音を使った曲選びとキー調整の方法を解説します。',

    lead:
      '「人気曲はどれもサビが高い」「声が低くて歌える曲がない」と感じる場合は、曲名ではなく最高音と最低音から選ぶ方法があります。',

    conclusion:
      '声が低い人は、最高音が比較的低い曲から探し、自分の最低音・最高音と比較します。原曲キーが高い場合は、キーを下げる方法もあります。',

    sections: [

      {
        heading:
          '声が低い人は最高音を見る',

        paragraphs: [
          'Aメロが低くても、サビだけ急に高くなる曲は多くあります。',
          '声が低い人が曲を選ぶ場合は、曲全体の印象だけではなく最高音を確認することが重要です。',
          '自分の快適音域より最高音が大きく高い曲は、原曲キーでは苦しくなる可能性があります。',
        ],
      },

      {
        heading:
          '最低音も確認する',

        paragraphs: [
          '最高音だけでなく、最低音も曲選びには重要です。',
          'キーを下げると最高音は楽になりますが、最低音も同じだけ下がります。',
          '低すぎる音が増えると逆に歌いにくくなるため、両方を比較します。',
        ],
      },

      {
        heading:
          '男性曲・女性曲だけで判断しない',

        paragraphs: [
          '男性ボーカル曲でも非常に高い曲があります。また女性ボーカル曲でも比較的低い曲があります。',
          '歌手の性別だけで選ぶのではなく、実際の曲の音域と自分の音域を比較する方が確実です。',
        ],
      },

      {
        heading:
          'キー調整を使う',

        paragraphs: [
          '好きな曲が少し高い場合は、カラオケのキーを1〜2ずつ下げながら試します。',
          '高音が楽になったら、今度はAメロなどの低音が出るか確認します。',
          '最高音と最低音の両方を無理なく歌える位置が、自分に合うキーの目安になります。',
        ],
      },

    ],

    faqs: [

      {
        question:
          '声が低い人はどんな曲を選べばいいですか？',

        answer:
          '最高音が比較的低く、自分の最低音・最高音に近い曲から選ぶと探しやすくなります。',
      },

      {
        question:
          '男性でも男性曲が高すぎることはありますか？',

        answer:
          'あります。男性ボーカル曲でも高音を多く使う曲があるため、歌手の性別だけでは判断できません。',
      },

      {
        question:
          'キーを下げればどんな曲でも歌えますか？',

        answer:
          '必ずではありません。キーを下げると最低音も低くなるため、自分の低音域とのバランスも確認する必要があります。',
      },

    ],

    related: [

      {
        href:
          '/guides/low-voice-songs/',

        label:
          '最高音が低めの曲を見る',
      },

      {
        href:
          '/male-vocal-range/',

        label:
          '男性の音域の調べ方',
      },

      {
        href:
          '/female-vocal-range/',

        label:
          '女性の音域の調べ方',
      },

      {
        href:
          '/karaoke-key-guide/',

        label:
          'カラオケのキーの合わせ方',
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

function analytics() {

  return `
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"
></script>

<script>
  window.dataLayer =
    window.dataLayer || []

  function gtag() {
    dataLayer.push(arguments)
  }

  gtag(
    'js',
    new Date()
  )

  gtag(
    'config',
    '${GA_ID}'
  )
</script>
`
}


// ==========================================
// CSS
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
// ページ生成
// ==========================================

function createPage(page) {

  const sectionHtml =
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
    text => `
<p>
  ${escapeHtml(text)}
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

<a href="${item.href}">
  ${escapeHtml(
    item.label
  )}
  →
</a>
`
      )
      .join('')


  const faqJson =
    JSON.stringify({

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


  return `
<!doctype html>

<html lang="ja">

<head>

${analytics()}

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
${faqJson}
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


${sectionHtml}


<div class="cta-box">

<h2>
  自分の音域を確認する
</h2>

<p>
  キミキーなら、
  マイクを使って
  自分の音域を測定できます。
</p>

<a
  class="cta"
  href="/"
>
  🎤 キミキーで音域を測る
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
  自分に合う曲を探してみる
</h2>

<p>
  自分の音域が分かると、
  曲選びやキー調整が
  しやすくなります。
</p>

<a
  class="cta"
  href="/"
>
  🎤 キミキーを使ってみる
</a>

</div>


<p class="notice">

※ 音域や声の出しやすさには
個人差があります。
痛みや強い違和感がある場合は
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
// 記事ファイル生成
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
// guidesへ内部リンク
// ==========================================

const guidesPath =
  path.join(
    publicDir,
    'guides',
    'index.html'
  )


if (
  fs.existsSync(
    guidesPath
  )
) {

  let html =
    fs.readFileSync(
      guidesPath,
      'utf8'
    )


  const marker =
    '<div class="songs">'


  if (
    html.includes(marker) &&
    !html.includes(
      '/karaoke-high-note-problem/'
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
      guidesPath,
      html,
      'utf8'
    )

  }

}


// ==========================================
// sitemapへ追加
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
        `${additions}</urlset>`
      )


    fs.writeFileSync(
      sitemapPath,
      sitemap,
      'utf8'
    )

  }

}


console.log(
  `✅ SEO記事を${pages.length}ページ追加しました`
)

console.log(
  '✅ guides内部リンク追加'
)

console.log(
  '✅ sitemap追加'
)
