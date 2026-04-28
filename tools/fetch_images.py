from __future__ import annotations

import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
APP_JS = ROOT / "app.js"
OUT_DIR = ROOT / "assets" / "productos"


def slugify(text: str) -> str:
    value = text.strip().lower()
    value = (
        value.replace("á", "a")
        .replace("é", "e")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ú", "u")
        .replace("ü", "u")
        .replace("ñ", "n")
    )
    value = re.sub(r"[^a-z0-9]+", "_", value)
    value = re.sub(r"_{2,}", "_", value).strip("_")
    return value or "item"


def parse_menu_items(js: str) -> list[str]:
    # Simple regex to extract `name: "..."` strings. Good enough for our data structure.
    return re.findall(r'name:\s*"([^"]+)"', js)


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 Safari/537.36"
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        dest.write_bytes(resp.read())


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    js = APP_JS.read_text(encoding="utf-8")
    names = sorted(set(parse_menu_items(js)))

    # Uses loremflickr endpoint. It returns an image stream (jpg) for given keywords.
    base = "https://loremflickr.com/800/600/food,"

    fetched = 0
    skipped = 0

    for name in names:
        slug = slugify(name)
        dest = OUT_DIR / f"{slug}.jpg"
        if dest.exists():
            skipped += 1
            continue
        query = urllib.parse.quote(name)
        url = f"{base}{query}"
        try:
            download(url, dest)
            fetched += 1
            print(f"OK  {name} -> {dest.relative_to(ROOT)}")
        except Exception as exc:  # noqa: BLE001
            print(f"ERR {name}: {exc}", file=sys.stderr)

    print(f"Done. fetched={fetched} skipped={skipped} total={len(names)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
