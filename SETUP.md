# セットアップ・デプロイ手順

会長（アカウント所有者）が実施する初期セットアップ手順をまとめています。
**Claudeはコード/データ更新は自動でできますが、Cloudflare / GitHub アカウント連携や DNS は会長作業です。**

---

## ステップ 0: ローカル動作確認（既に完了）

```powershell
cd "C:\Users\mizuta\Documents\ドキュメント\projects\claude code\03_projects\ipo-archive-seo"
npm install       # 完了
npm run build     # 完了（59ページ生成OK）
npm run dev       # http://localhost:4321 で確認可
```

---

## ステップ 1: GitHub リポジトリ作成

1. GitHub にログイン（会長アカウントまたは新規ポートフォリオ用アカウント）
2. 新規 Private リポジトリ `ipo-archive-seo` を作成（README/.gitignore はチェック入れない）
3. ローカルから push:
   ```powershell
   cd "C:\Users\mizuta\Documents\ドキュメント\projects\claude code\03_projects\ipo-archive-seo"
   git init
   git checkout -b main
   git add .
   git commit -m "feat: phase1 MVP scaffold"
   git remote add origin https://github.com/<your-account>/ipo-archive-seo.git
   git push -u origin main
   ```

> `node_modules/` `dist/` `.npm-cache/` は `.gitignore` 済み。`data/` 配下はコミットする（IPOレコード本体のため）。

---

## ステップ 2: Cloudflare Pages 接続

1. Cloudflare ダッシュボード → Workers & Pages → Pages → **Create application** → **Connect to Git**
2. GitHub と認可、`ipo-archive-seo` リポジトリを選択
3. **Build settings**:
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 環境変数 `NODE_VERSION=20`（Variables and secrets で追加）
4. **環境変数**:
   - `PUBLIC_SITE_URL` = `https://ipo-archive-seo.pages.dev`（プロジェクト名に応じて）
5. **Deploy** → 初回ビルド成功を確認 → URL を控える

> Pages 無料枠: 500ビルド/月、帯域無制限。daily-ingest を回しても余裕。

---

## ステップ 3: Search Console 登録

1. https://search.google.com/search-console にアクセス
2. プロパティ追加 → URLプレフィックス → Cloudflare PagesのURLを入力
3. 所有権確認: HTMLタグ方式を選択 → `src/layouts/BaseLayout.astro` の `<head>` 内に `<meta name="google-site-verification" ...>` を追加 → push → デプロイ完了後に「確認」
4. サイトマップ送信: `sitemap-index.xml` を送信
5. インデックス登録のリクエスト（主要ページ数件）

---

## ステップ 4: Cloudflare Web Analytics（任意・無料）

1. Cloudflare → Analytics & Logs → Web Analytics → サイトを追加
2. 取得したスクリプトタグを `BaseLayout.astro` に追加（Cookie不要）

---

## ステップ 5: アフィリエイト連携（収益化）

1. **A8.net** 登録（無料）→ 各証券会社プログラムに提携申請（SBI、楽天、マネックス等）
2. **もしもアフィリエイト** 登録 → 同様に証券会社プログラム
3. **バリューコマース** 登録 → SMBC日興、大和等
4. 取得したリンクで `data/affiliates.json` の `cta_url` プレースホルダを差し替え
5. Claude（私）に変更内容を指示すれば編集します

---

## ステップ 6: GitHub Actions シークレット設定

`.github/workflows/daily-ingest.yml` を本稼働させるとき:

1. リポジトリの Settings → Secrets and variables → Actions
2. 必要に応じて `KABUTAN_USER_AGENT` 等を追加（フェーズ2で必要になれば）
3. Actions タブから `Daily IPO ingest` を手動実行（workflow_dispatch）して動作確認

---

## カスタムドメイン（MRR ≥ ¥3,000 達成後）

- お名前.com / Cloudflare Registrar で取得（候補: `ipo-archive.jp`, `ipo-data.jp` 等）
- Cloudflare Pages → Custom domains で DNS 接続
- 環境変数 `PUBLIC_SITE_URL` を新ドメインに更新 → 再デプロイ

---

## 運用フロー（フェーズ2以降、Claudeが回す）

- 毎日 GitHub Actions の `daily-ingest.yml` が JST 19:00 に発火（フェーズ2でingest本実装）
- ingest スクリプトが `data/ipo.jsonl` を更新 → commit → push → Cloudflare Pages が自動デプロイ
- 会長介入は **アフィリエイト承認** と **収益受取確認** のみ

---

## トラブルシュート

| 症状 | 対処 |
|---|---|
| `npm install` が ERESOLVE | `package.json` の依存を確認、特に `tailwindcss` v4 で `@tailwindcss/vite` を使う構成か |
| build エラー `brokerList is not defined` 等 | `getStaticPaths` 関数の **内側** で変数宣言する。Astro制約 |
| Cloudflare ビルドで Node エラー | 環境変数 `NODE_VERSION=20` 設定済みか確認 |
| サイトマップに古いページ | `dist/sitemap-index.xml` を消して再ビルド、または環境変数 `PUBLIC_SITE_URL` を確認 |
