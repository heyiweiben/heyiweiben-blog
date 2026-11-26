#!/usr/bin/env python3
"""按当前构建产物重新生成中文字体子集（Noto Sans SC / Noto Serif SC 变量字体）。

为什么要这个脚本：站点原先用 @fontsource-variable 的 CJK 分片，一个首页要下 20 个
woff2、约 1.2MB，微信里打开很慢。现在改为「只保留全站实际用到的字」的两个 woff2。

用法（需要有 fonttools + brotli，建议独立 venv）：

    python3 -m venv .fontenv
    .fontenv/bin/pip install fonttools brotli
    corepack pnpm build            # 先构建，脚本从 build/client/*.html 取字
    .fontenv/bin/python scripts/subset-fonts.py

产物：static/fonts/noto-sans-sc-var.woff2、static/fonts/noto-serif-sc-var.woff2
注意：新增文章/页面后必须重跑，否则新出现的字会回退到系统字体。
"""

from __future__ import annotations

import html
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "build" / "client"
CACHE = ROOT / ".fontcache"
OUT = ROOT / "static" / "fonts"
CACHE.mkdir(exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

SOURCES = {
    "NotoSansSC": "https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf",
    "NotoSerifSC": "https://github.com/google/fonts/raw/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf",
}
TARGETS = {
    "NotoSansSC": "noto-sans-sc-var.woff2",
    "NotoSerifSC": "noto-serif-sc-var.woff2",
}
# 站点实际用到的字重范围（正文 400，标题 500—800）
WEIGHT_RANGE = (400, 800)
# 保留的 OpenType 特性：中文竖排/比例宽度 + 基本连字与本地化
FEATURES = "kern,liga,locl,ccmp,vert,vrt2,palt,halt"


def collect_chars() -> str:
    if not BUILD.exists():
        sys.exit("缺少 build/client，请先运行 corepack pnpm build")
    chars: set[str] = set()
    for f in BUILD.rglob("*.html"):
        text = f.read_text(errors="ignore")
        text = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", text, flags=re.S)
        text = re.sub(r"<[^>]+>", " ", text)
        chars |= set(html.unescape(text))
    chars |= {chr(c) for c in range(32, 127)}
    chars |= set("　、。，．·—–…“”‘’《》〈〉「」『』【】（）·―～％℃")
    chars = {c for c in chars if c.strip() or c == " "}
    return "".join(sorted(chars))


def ensure_source(name: str) -> Path:
    path = CACHE / f"{name}.ttf"
    if not path.exists():
        print(f"下载 {name} …")
        urllib.request.urlretrieve(SOURCES[name], path)
    return path


def main() -> None:
    try:
        from fontTools.ttLib import TTFont
        from fontTools.varLib import instancer
    except ImportError:
        sys.exit("缺少 fonttools：python3 -m venv .fontenv && .fontenv/bin/pip install fonttools brotli")

    chars = collect_chars()
    cjk = sum(1 for c in chars if "\u4e00" <= c <= "\u9fff")
    chars_file = CACHE / "chars.txt"
    chars_file.write_text(chars)
    print(f"字符集：{len(chars)} 个，其中汉字 {cjk} 个")

    for name, out_name in TARGETS.items():
        src = ensure_source(name)
        font = TTFont(src)
        limited = instancer.instantiateVariableFont(
            font, {"wght": WEIGHT_RANGE}, inplace=False, updateFontNames=False
        )
        limited_path = CACHE / f"{name}-lim.ttf"
        limited.save(limited_path)

        out = OUT / out_name
        subprocess.run(
            [
                sys.executable,
                "-m",
                "fontTools.subset",
                str(limited_path),
                f"--text-file={chars_file}",
                "--flavor=woff2",
                f"--layout-features={FEATURES}",
                "--no-hinting",
                "--desubroutinize",
                f"--output-file={out}",
            ],
            check=True,
        )
        print(f"{out_name}: {out.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
