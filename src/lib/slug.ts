import { createHash } from "node:crypto";

const knownSlugs: Record<string, string> = {
  "SBI証券": "sbi",
  "楽天証券": "rakuten",
  "松井証券": "matsui",
  "SMBC日興証券": "smbc-nikko",
  "大和証券": "daiwa",
  "みずほ証券": "mizuho",
  "マネックス証券": "monex",
  "auカブコム証券": "au-kabucom",
  "野村證券": "nomura",
  "情報・通信業": "information-communication",
  "サービス業": "services",
  "小売業": "retail",
  "卸売業": "wholesale",
  "電気機器": "electric-appliances",
  "機械": "machinery",
  "医薬品": "pharmaceutical",
  "不動産業": "real-estate",
  "食料品": "foods",
  "化学": "chemicals",
  "プライム": "prime",
  "スタンダード": "standard",
  "グロース": "growth",
  "TOKYO PRO": "tokyo-pro",
  "名証": "nagoya",
  "福証": "fukuoka",
  "札証": "sapporo",
  "旧マザーズ": "mothers",
  "旧JASDAQ": "jasdaq"
};

export function toSlug(input: string): string {
  const known = knownSlugs[input];
  if (known) {
    return known;
  }

  const normalized = input
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");

  if (normalized) {
    return normalized;
  }

  const hash = createHash("sha1").update(input).digest("base64url").slice(0, 10);
  return `jp-${hash}`;
}
