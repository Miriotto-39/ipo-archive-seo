"""IRBANK のIPO一覧から実IPOデータを取得し data/ipo.jsonl を更新する。

取得可能な情報:
- 銘柄コード（3桁+英字 or 4桁数字）
- 社名
- 上場日（YYYY-MM-DD）
- 外部参照URL（IRBANK 個別ページ）

取得不可（IRBANK のIPO個別ページに掲載なし、別ソース必要）:
- 市場区分（プライム/スタンダード/グロース）
- 業種
- 公募価格、初値、初値騰落率
- 主幹事、幹事団
- 吸収金額

これらは null として保存し、各銘柄ページ上では「公式IRで確認」リンクへ誘導する。
"""
from __future__ import annotations

import json
import re
import sys
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "ipo.jsonl"
JST = timezone(timedelta(hours=9))

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
}

REQUEST_INTERVAL = 2.5


def fetch(url: str) -> BeautifulSoup:
    time.sleep(REQUEST_INTERVAL)
    r = requests.get(url, headers=HEADERS, timeout=20)
    r.raise_for_status()
    return BeautifulSoup(r.text, "html.parser")


def parse_irbank_ipo_top() -> list[dict]:
    """IRBANK の /ipo トップから IPO 銘柄一覧を取得"""
    soup = fetch("https://irbank.net/ipo")
    table = soup.select_one("table.cs")
    if not table:
        return []

    out: list[dict] = []
    last_year: str | None = None
    for tr in table.select("tr"):
        cells = tr.select("th,td")
        if not cells:
            continue
        text_list = [c.get_text(strip=True) for c in cells]

        # 年度マーカー行（単独セルで '20xx'）
        if len(text_list) == 1 and re.fullmatch(r"20\d{2}", text_list[0]):
            last_year = text_list[0]
            continue
        if not last_year:
            continue

        # 銘柄ヘッダ行: "MM/DD<code> <name>IPO情報資料" 形式
        first = text_list[0]
        m = re.match(r"(\d{2})/(\d{2})\s*(\S+?)\s+(.+)", first)
        if not m:
            continue

        link = tr.select_one("a")
        href = link.get("href") if link else None
        edinet = None
        if href:
            em = re.match(r"/?(E\d+)", href.lstrip("/"))
            if em:
                edinet = em.group(1)

        # 銘柄名の末尾 "IPO情報資料" / "IPO情報" / "IPO" を除去
        raw_name = m.group(4).strip()
        name = re.sub(r"IPO情報資料$", "", raw_name)
        name = re.sub(r"IPO情報$", "", name)
        name = re.sub(r"IPO$", "", name).strip()
        if not name:
            continue

        code = m.group(3).strip()
        # IRBANK の表記揺れ対策（記号で囲われた場合に備える）
        if not (code.isdigit() or (code[:-1].isdigit() and code[-1].isalpha())):
            continue

        out.append({
            "year": last_year,
            "date_md": f"{m.group(1)}/{m.group(2)}",
            "code": code,
            "name": name,
            "edinet": edinet,
        })

    return out


def to_record(item: dict) -> dict:
    """IRBANK 抽出データを IpoRecord 形式に変換"""
    yyyy = item["year"]
    md = item["date_md"]
    listing_date = f"{yyyy}-{md.replace('/', '-')}"
    source_urls = []
    if item["edinet"]:
        source_urls.append(f"https://irbank.net/{item['edinet']}/results")
        source_urls.append(f"https://irbank.net/ipo/{item['edinet']}")
    source_urls.append(f"https://kabutan.jp/stock/?code={item['code']}")

    return {
        "code": item["code"],
        "name": item["name"],
        "listing_date": listing_date,
        "market": None,             # 取得不可、null
        "business": None,
        "source_urls": source_urls,
        "updated_at": datetime.now(JST).isoformat(),
    }


def main() -> int:
    items = parse_irbank_ipo_top()
    print(f"fetched {len(items)} items from IRBANK")
    if not items:
        print("no items, aborting", file=sys.stderr)
        return 1

    # 銘柄コード重複除去（上位優先）
    seen = set()
    unique = []
    for it in items:
        if it["code"] in seen:
            continue
        seen.add(it["code"])
        unique.append(it)

    # 上場日 降順（新しい順）
    unique.sort(key=lambda x: (x["year"], x["date_md"]), reverse=True)

    records = [to_record(it) for it in unique]

    DATA_FILE.write_text(
        "\n".join(json.dumps(r, ensure_ascii=False) for r in records) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {len(records)} records to {DATA_FILE.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
