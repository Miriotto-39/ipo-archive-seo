# ipo-archive-seo

日本のIPO銘柄を網羅した、検索流入特化の静的アーカイブサイト。
過去〜現在の全IPOデータをDB化し、銘柄別・年別・主幹事別・業種別・市場別に
programmatic SEO で大量ページを自動生成する。

- 詳細仕様: `../../02_designs/ipo-archive-seo/PRD.md`
- 運用方針: 月額 ¥0、Claude単独運用、顧客対応ゼロ

## 技術スタック

- Astro 5 + Tailwind CSS v4 + TypeScript
- Cloudflare Pages（無料枠）
- GitHub Actions（無料枠、daily ingest cron）
- Python 3.11（データ取得スクリプト）

## クイックスタート

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 静的サイト生成 -> dist/
npm run preview
```

## データ更新

```bash
# Python 3.11 + uv 推奨
uv venv && source .venv/bin/activate   # Windowsは .venv\Scripts\activate
uv pip install -r scripts/requirements.txt

python scripts/ingest_jpx_csv.py  data/seed/jpx_listed.csv
python scripts/validate_data.py
```

## デプロイ

1. Cloudflare Pages で本リポジトリを接続
2. Build command: `npm run build`
3. Output directory: `dist`
4. 環境変数は不要（完全静的）

## ディレクトリ構成

`../../02_designs/ipo-archive-seo/PRD.md` の §8 参照

## 法的注意

- カブタン等への HTTP リクエストは 3秒以上の間隔、robots.txt 遵守
- 全ページに「投資勧誘ではない」「正確性無保証」「最終確認は公式IRで」の免責を明示
- データソース URL を各ページに明記

## フェーズ1の状態

このリポジトリはフェーズ1 MVPとして、Astro 5 + Tailwind CSS + TypeScript の静的サイト雛形、JSONLベースのIPOデータ読み込み、主要URLテンプレート、SEOメタ情報、データ検証スクリプト、GitHub Actions雛形を実装しています。

`data/ipo.jsonl` は実在企業ではなく、銘柄コード9001〜9010の架空サンプルIPOデータです。投資判断や実データ確認には使えません。

本番データの取得、JPX CSV取込、Kabutan等からの補完、初値情報の自動更新、実アフィリエイトリンクの差し替えはフェーズ2で実装予定です。
