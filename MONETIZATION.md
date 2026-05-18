# 収益化マニュアル（会長作業）

サイトの自動運用（毎日のIPO取込・公開）は完全に自動化済み。
**収益発生に必要な会長作業は以下の2つ、合計 ~30分** で完了します。

公開URL: **https://miriotto-39.github.io/ipo-archive-seo/**

---

## 1. Google Search Console（検索流入のため）所要 ~10分

### 目的
Googleにサイトの存在を伝え、検索結果に表示されるようにする。

### 手順
1. https://search.google.com/search-console にアクセス（haruto.m0413@gmail.com で）
2. 「プロパティを追加」→ **URLプレフィックス** → `https://miriotto-39.github.io/ipo-archive-seo/` 入力
3. 所有権の確認方法 → **HTMLタグ** を選択
4. 表示された `<meta name="google-site-verification" content="XXXXXXXX">` の `content="XXXXXXXX"` の **XXXXXXXX 部分のみコピー**
5. Claude（このセッションか新しいセッション）に **「GSCのトークンは XXXXXXXX です」** と伝える
6. Claudeが GitHub repository variables に `PUBLIC_GSC_VERIFICATION` として登録し、再デプロイ
7. デプロイ完了後、GSC画面に戻り「確認」ボタンを押す
8. 確認OKになったら、左メニューの **Sitemaps** → `sitemap-index.xml` を送信

### 補足
- インデックス登録は通常 1〜2 週間。気長に。
- `https://miriotto-39.github.io/ipo-archive-seo/sitemap-index.xml` は既に生成済みで送信可能。

---

## 2. アフィリエイト口座開設（収益発生のため）所要 ~20分

### 主要 ASP（アフィリエイトサービスプロバイダ）

#### A8.net（最大手、IPO証券の取扱多数）
1. https://www.a8.net/ で無料登録（メール、銀行口座、本人確認）
2. ログイン後 → プログラム検索で「証券」と入力
3. 以下のプログラムに提携申請（即時 or 数日承認）:
   - SBI証券、楽天証券、松井証券、auカブコム証券、マネックス証券
4. 承認後、各プログラムのページから **「広告リンク」コードを取得**
5. リンク先のURL（`https://px.a8.net/...` で始まる長いURL）を Claude に渡す

#### もしもアフィリエイト（A8で見つからない案件用）
1. https://af.moshimo.com/ で無料登録
2. SMBC日興、大和証券などを提携申請（A8と被らない案件）

### Claude への引き渡し方
新しい Claude セッションで以下のように伝えるだけ:

```
data/brokers.json と data/affiliates.json のアフィリエイトリンクを更新してください。
- SBI証券: https://px.a8.net/svt/ejp?a8mat=XXXX
- 楽天証券: https://px.a8.net/svt/ejp?a8mat=YYYY
- 松井証券: https://px.a8.net/svt/ejp?a8mat=ZZZZ
（以下同様）
```

Claudeが `data/brokers.json` の `affiliate_url: "#"` を実リンクに置換し、push → 自動デプロイ → 即時収益化開始。

---

## 自動運用の状況

| 機能 | 状態 | 備考 |
|---|---|---|
| 毎日IRBANK取込 → 自動デプロイ | ✅ 稼働中 | `.github/workflows/daily-ingest.yml` JST 19:00 cron |
| Pages 自動デプロイ | ✅ 稼働中 | `main` push でトリガー |
| サイトマップ自動生成 | ✅ 稼働中 | `dist/sitemap-index.xml` |
| robots.txt | ✅ 配備済み | クローラ歓迎 |
| 構造化データ (BreadcrumbList / FAQPage / ItemList) | ✅ 配備済み | |
| アフィリエイトリンク | ⏳ プレースホルダ | 上記2の作業後に Claude が差し替え |
| GSC verification | ⏳ 環境変数待ち | 上記1の作業後に Claude が登録 |

---

## 期待値（参考）

- 検索インデックス: GSCサイトマップ送信から **1〜2週間** で大半のページがインデックス
- 検索流入の立ち上がり: インデックス後 **1〜3ヶ月** で「銘柄コード+社名」系のロングテール流入が始まる
- 初収益: 流入 **月間 1,000PV** を超えたあたりから A8 経由の口座開設が散発的に発生
- 月¥10,000を超えるには通常 **3〜6ヶ月**（運営継続前提）

実データの正確性（公募価格・初値・主幹事）が SEO 評価に直結するため、Claudeが定期的にデータ補完を進めます。

---

## トラブル時

- Pages が表示されない → リポジトリ Settings → Pages の Source が "GitHub Actions" になっているか確認
- 毎日 ingest が走らない → Actions タブで `Daily ingest` の実行ログ確認、cron は workflow_dispatch で手動実行も可
- データに誤りを発見 → そのままClaudeに伝えれば修正・push まで自動
