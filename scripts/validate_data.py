from __future__ import annotations

import json
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field, HttpUrl, field_validator


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "ipo.jsonl"


Market = Literal[
    "プライム",
    "スタンダード",
    "グロース",
    "TOKYO PRO",
    "名証",
    "福証",
    "札証",
    "旧マザーズ",
    "旧JASDAQ",
]


class IpoRecord(BaseModel):
    code: str = Field(min_length=4, max_length=4)
    name: str
    name_kana: str | None = None
    listing_date: str
    market: Market
    sector: str | None = None
    sector_slug: str | None = None
    business: str
    url_official: HttpUrl | None = None
    price_band_low: int | None = None
    price_band_high: int | None = None
    issue_price: int | None = None
    initial_price: int | None = None
    initial_return_pct: float | None = None
    public_shares: int | None = None
    offer_shares: int | None = None
    oa_shares: int | None = None
    absorption_oku: float | None = None
    lead_manager: str | None = None
    lead_manager_slug: str | None = None
    managers: list[str] | None = None
    bb_start: str | None = None
    bb_end: str | None = None
    source_urls: list[str]
    updated_at: str

    @field_validator("code")
    @classmethod
    def code_is_numeric(cls, value: str) -> str:
        if not value.isdigit():
            raise ValueError("code must be four digits")
        return value

    @field_validator("listing_date", "bb_start", "bb_end")
    @classmethod
    def date_shape(cls, value: str | None) -> str | None:
        if value is not None and len(value) != 10:
            raise ValueError("date must be YYYY-MM-DD")
        return value


def validate() -> int:
    count = 0
    for line_no, line in enumerate(DATA_FILE.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        try:
            payload = json.loads(line)
            IpoRecord.model_validate(payload)
        except Exception as exc:
            print(f"data/ipo.jsonl:{line_no}: {exc}")
            return 1
        count += 1

    print(f"validated {count} IPO records")
    return 0


if __name__ == "__main__":
    raise SystemExit(validate())
