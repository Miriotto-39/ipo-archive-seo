import type { IpoRecord } from "./types";
import { formatDate, formatPct, formatYen } from "./format";

const siteName = "IPOアーカイブ";

export function absoluteUrl(path: string): string {
  const origin = (import.meta.env.PUBLIC_SITE_URL || "https://miriotto-39.github.io").replace(/\/+$/, "");
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  const clean = path.startsWith("/") ? path : "/" + path;
  return origin + base + clean;
}

export const seo = {
  home() {
    return {
      title: `IPO一覧・初値・公募価格データ | ${siteName}`,
      description:
        "日本のIPO銘柄を年別、月別、主幹事、業種、市場別に探せる静的アーカイブです。フェーズ1は架空サンプルデータで構築しています。"
    };
  },
  ipo(ipo: IpoRecord) {
    return {
      title: `${ipo.code} ${ipo.name} IPO情報・公募価格・初値 | ${siteName}`,
      description: `${ipo.name}のIPO情報。上場日${formatDate(ipo.listing_date)}、市場${ipo.market}、公募価格${formatYen(
        ipo.issue_price
      )}、初値騰落率${formatPct(ipo.initial_return_pct)}を掲載。`
    };
  },
  listing(label: string, keyword: string) {
    return {
      title: `${label} IPO一覧 | ${siteName}`,
      description: `${keyword}に該当するIPO銘柄を一覧で確認できます。上場日、公募価格、初値、初値騰落率を比較できます。`
    };
  },
  ranking(year: string) {
    return {
      title: `${year}年 IPO初値騰落率ランキング | ${siteName}`,
      description: `${year}年に上場したIPO銘柄を初値騰落率順にランキング表示します。公募価格、初値、主幹事も確認できます。`
    };
  },
  staticPage(title: string, description: string) {
    return {
      title: `${title} | ${siteName}`,
      description
    };
  }
};
