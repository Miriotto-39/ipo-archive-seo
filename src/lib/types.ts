export type Market =
  | "プライム"
  | "スタンダード"
  | "グロース"
  | "TOKYO PRO"
  | "名証"
  | "福証"
  | "札証"
  | "旧マザーズ"
  | "旧JASDAQ";

export interface IpoRecord {
  code: string;
  name: string;
  name_kana?: string;
  listing_date: string;
  market: Market;
  sector?: string;
  sector_slug?: string;
  business: string;
  url_official?: string;
  price_band_low?: number;
  price_band_high?: number;
  issue_price?: number;
  initial_price?: number;
  initial_return_pct?: number;
  public_shares?: number;
  offer_shares?: number;
  oa_shares?: number;
  absorption_oku?: number;
  lead_manager?: string;
  lead_manager_slug?: string;
  managers?: string[];
  bb_start?: string;
  bb_end?: string;
  source_urls: string[];
  updated_at: string;
}

export interface Broker {
  slug: string;
  name: string;
  affiliate_url: string;
}

export interface Sector {
  slug: string;
  name: string;
}

export interface AffiliateCopy {
  broker_slug: string;
  catch: string;
  cta: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}
