#!/usr/bin/env python3
"""Fail if prohibited source-reference artifacts appear in repo-visible files."""

from __future__ import annotations

import re
import sys
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve()
REPO_ROOT = SCRIPT_PATH.parents[3]
SKILL_ROOT = REPO_ROOT / "skill" / "microinteractions-expert"
HASHI_RESOURCES = REPO_ROOT / "skill" / "hashi-designer" / "resources"
CORPUS_PATHS = [
    SKILL_ROOT / "resources",
]

TEXT_EXTENSIONS = {".md", ".txt", ".json", ".yaml", ".yml", ".py", ".sh"}

BANNED_PATTERNS = [
    re.compile(r"https?://", re.IGNORECASE),
    re.compile(r"\[[^\]]+\]\([^\)]+\)"),
    re.compile(r"\baccording to\b", re.IGNORECASE),
    re.compile(r"\bcitation(s)?\b", re.IGNORECASE),
    re.compile(r"\bbibliograph(y|ies)\b", re.IGNORECASE),
    re.compile(r"\bisbn\b", re.IGNORECASE),
]


def iter_files(root: Path):
    if not root.exists():
        return
    for path in root.rglob("*"):
        if path.is_dir():
            continue
        if any(part in {".git", "node_modules", "dist", "storybook-static"} for part in path.parts):
            continue
        yield path


def check_no_pdf(paths: list[Path]) -> list[str]:
    errors: list[str] = []
    for directory in paths:
        if not directory.exists():
            continue
        for pdf in directory.rglob("*.pdf"):
            rel = pdf.relative_to(REPO_ROOT)
            errors.append(f"PDF file not allowed: {rel}")
    return errors


def check_banned_text(paths: list[Path]) -> list[str]:
    errors: list[str] = []
    for directory in paths:
        for file_path in iter_files(directory):
            if file_path.suffix.lower() not in TEXT_EXTENSIONS:
                continue
            try:
                text = file_path.read_text(encoding="utf-8")
            except Exception:
                continue
            for pattern in BANNED_PATTERNS:
                for match in pattern.finditer(text):
                    rel = file_path.relative_to(REPO_ROOT)
                    errors.append(
                        f"Banned text '{match.group(0)}' in {rel}"
                    )
                    break
    return errors


def main() -> int:
    errors: list[str] = []

    errors.extend(check_no_pdf([SKILL_ROOT, HASHI_RESOURCES]))
    errors.extend(check_banned_text(CORPUS_PATHS))

    if errors:
        print("lint-no-refs: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1

    print("lint-no-refs: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
