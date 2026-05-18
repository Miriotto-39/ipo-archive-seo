from __future__ import annotations

from pathlib import Path


def ingest_jpx_csv(csv_path: Path) -> None:
    """Convert a JPX CSV export into normalized IPO records.

    TODO: Phase 2でJPXの実CSV列定義を確認し、data/ipo.jsonlへの差分反映を実装する。
    """
    raise NotImplementedError("Phase 2 TODO: JPX CSV ingest")


if __name__ == "__main__":
    print("TODO: Phase 2でJPX CSV取込を実装します")
