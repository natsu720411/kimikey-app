# キミキー：無料Google公式APIの週次SEO点検

くらし予報と同じく、GitHub Actions + Google Search Console API + GA4 Data APIを使用します。GSC WizardやWindsor.aiの有料契約は不要です。

## 毎週自動で実行すること

- 月曜08:17（日本時間）にGitHub Actionsが稼働。手動実行も可能。
- サイト全ページを生成してSEOタグ、canonical、内部リンク、音域データを点検。
- 同一canonical・説明文の重複、canonical欠落など**客観的に判定できる技術的不備のみ**生成HTMLで自動修正。曲名、音域、記事の書き換えはしない。
- Google公式APIが接続済みなら、直近3日を除いた直近28日と前28日のクリック・表示・CTR・順位をクエリ・着地ページ・クエリ×ページで比較。
- 表示60回以上、順位5〜20位、低CTRか表示増加のページを改善候補として日本語レポート化。
- GA4接続時は音域測定・曲検索などのイベント数も集計。
- GitHub Actions SummaryとArtifactsにレポートを保存。Google未接続なら設定待ちと明記し実績を偽装しない。

## Googleとの接続：最初の1回だけ必要

くらし予報で用意したサービスアカウントは再利用できますが、**キミキーのSearch Console権限とGitHub Secretは別途設定**する必要があります。JSON秘密鍵はチャットやソースに貼らないでください。

1. https://console.cloud.google.com/ でGoogle Search Console APIとGoogle Analytics Data APIを有効化（新たな課金契約が必要なら中断）。
2. Googleサービスアカウント（…@…iam.gserviceaccount.com）のメールアドレスとJSON鍵を確認。
3. https://search.google.com/search-console で https://kimikey-app.vercel.app/ のプロパティを選択し、設定→ユーザーと権限でそのサービスアカウントを制限付きユーザーに追加。
4. GA4も集計する場合は https://analytics.google.com/ のキミキー用プロパティに同アカウントを閲覧者として追加。
5. https://github.com/natsu720411/kimikey-app/settings/secrets/actions からRepository Secretを作成。名前は GOOGLE_SERVICE_ACCOUNT_JSON、内容はJSON鍵全文。くらし予報のSecretは別リポジトリに自動共有されません。
6. 任意：同じGitHub設定のVariablesで GA4_PROPERTY_ID に数字のGA4プロパティIDを登録。G-から始まる測定IDとは異なります。
7. https://github.com/natsu720411/kimikey-app/actions/workflows/seo-health.yml のRun workflowを実行し、Summaryとkimikey-weekly-seo成果物を確認。

## 安全な運用

- Google APIの分析は読み取り専用で、検索値だけを根拠に音域・曲名・タイトルを自動書き換えしません。
- 14日以内に修正したページのSEO効果は継続観察し、頻繁な再編集を避けます。
- GA4の比率はイベント件数の参考値であり、厳密なユーザー単位の完了率ではありません。
- 歌声・録音・個人のカラオケ履歴をAPIに渡しません。公開GitHubのActionsレポートは第三者が見られる場合があります。
- SEOで順位・クリック増加を保証するものではありません。

公式ドキュメント：https://developers.google.com/webmaster-tools/v1/searchanalytics/query
https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport
https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets
