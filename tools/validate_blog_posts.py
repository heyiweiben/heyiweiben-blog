#!/usr/bin/env python3
"""Validate Hugo blog post metadata before automated publishing."""

from __future__ import annotations

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path


ALLOWED_CATEGORIES = {
    "AI 工具与实践",
    "技术折腾",
    "项目复盘",
    "创业观察",
    "生活札记",
    "AI札记",
}


def scalar(front_matter: str, name: str) -> str | None:
    match = re.search(rf"(?m)^\s*{re.escape(name)}\s*:\s*(.+?)\s*$", front_matter)
    if not match:
        return None
    return match.group(1).strip().strip('"').strip("'")


def categories(front_matter: str) -> list[str]:
    array_match = re.search(r"(?m)^\s*categories\s*:\s*\[(.*?)\]\s*$", front_matter)
    if array_match:
        return [
            item.strip().strip('"').strip("'")
            for item in array_match.group(1).split(",")
            if item.strip().strip('"').strip("'")
        ]

    single = scalar(front_matter, "category")
    return [single] if single else []


def countable_length(text: str) -> int:
    return len(re.sub(r"[\s\W_]+", "", text, flags=re.UNICODE))


def validate(posts_dir: Path) -> list[str]:
    errors: list[str] = []
    daily_ai_by_date: dict[str, list[str]] = defaultdict(list)

    if not posts_dir.exists():
        return [f"Posts directory does not exist: {posts_dir}"]

    for post in sorted(posts_dir.glob("*.md")):
        if post.name == "_index.md":
            continue

        text = post.read_text(encoding="utf-8")
        match = re.match(r"(?s)^---\r?\n(.*?)\r?\n---\r?\n(.*)$", text)
        if not match:
            errors.append(f"{post.name}: missing YAML front matter delimited by ---")
            continue

        front_matter = match.group(1)
        body = match.group(2).strip()

        title = scalar(front_matter, "title")
        date = scalar(front_matter, "date")
        draft = scalar(front_matter, "draft")
        summary = scalar(front_matter, "summary")
        post_categories = categories(front_matter)

        if not title:
            errors.append(f"{post.name}: missing title")
        if not summary:
            errors.append(f"{post.name}: missing summary")
        if not date or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date):
            errors.append(f"{post.name}: date must use YYYY-MM-DD")
        if draft != "false":
            errors.append(f"{post.name}: draft must be false")
        if len(post_categories) != 1:
            errors.append(f"{post.name}: exactly one category is required")
        elif post_categories[0] not in ALLOWED_CATEGORIES:
            errors.append(f"{post.name}: unsupported category '{post_categories[0]}'")
        if not body:
            errors.append(f"{post.name}: body must not be empty")

        if len(post_categories) == 1 and post_categories[0] == "AI札记":
            if date and re.fullmatch(r"\d{4}-\d{2}-\d{2}", date):
                daily_ai_by_date[date].append(post.name)
                expected_name = f"{date}-ai-notes.md"
                if post.name != expected_name:
                    errors.append(f"{post.name}: AI札记 filename must be {expected_name}")

            body_length = countable_length(body)
            if body_length < 1200 or body_length > 2500:
                errors.append(
                    f"{post.name}: AI札记 body must be 1200-2500 countable characters, got {body_length}"
                )

    for date, names in daily_ai_by_date.items():
        if len(names) > 1:
            errors.append(f"AI札记 has multiple posts for {date}: {', '.join(names)}")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--posts-dir", default="content/posts")
    args = parser.parse_args()

    errors = validate(Path(args.posts_dir))
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print("Blog post validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
