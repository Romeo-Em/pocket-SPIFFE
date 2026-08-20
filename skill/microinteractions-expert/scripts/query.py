#!/usr/bin/env python3
"""Local retrieval for microinteraction patterns and playbooks."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


SCRIPT_PATH = Path(__file__).resolve()
REPO_ROOT = SCRIPT_PATH.parents[3]
SKILL_ROOT = REPO_ROOT / "skill" / "microinteractions-expert"
INDEX_PATH = SKILL_ROOT / "resources" / "index.json"


@dataclass
class Match:
    item_id: str
    item_type: str
    name: str
    family: str
    tags: list[str]
    path: Path
    score: float
    matched_terms: list[str]
    summary: str


def tokenize(value: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", value.lower()))


def strip_frontmatter(markdown: str) -> str:
    if markdown.startswith("---\n"):
        parts = markdown.split("\n---\n", 1)
        if len(parts) == 2:
            return parts[1]
    return markdown


def read_summary(path: Path, max_lines: int = 6) -> str:
    try:
        raw = path.read_text(encoding="utf-8")
    except Exception:
        return ""
    body = strip_frontmatter(raw)
    lines = [line.strip() for line in body.splitlines() if line.strip()]
    lines = [line for line in lines if not line.startswith("#")][:max_lines]
    return " ".join(lines)[:320]


def item_search_text(item: dict, path: Path, summary: str) -> str:
    values: list[str] = [
        str(item.get("id", "")),
        str(item.get("name", "")),
        str(item.get("family", "")),
        " ".join(item.get("tags", []) or []),
        str(path),
        summary,
    ]
    return " ".join(values).lower()


def score_item(item: dict, item_type: str, query_text: str, query_tokens: set[str]) -> Match | None:
    rel_path = item.get("path")
    if not rel_path:
        return None
    abs_path = SKILL_ROOT / rel_path
    summary = read_summary(abs_path)
    search_text = item_search_text(item, abs_path, summary)
    search_tokens = tokenize(search_text)

    if not search_tokens:
        return None

    matched = sorted(query_tokens.intersection(search_tokens))
    if not matched and query_text.lower() not in search_text:
        return None

    overlap_score = len(matched)
    phrase_bonus = 2.0 if query_text.lower() in search_text else 0.0
    family_bonus = 1.0 if str(item.get("family", "")).lower() in query_text.lower() else 0.0
    type_bonus = 0.3 if item_type == "playbook" else 0.0

    total_score = overlap_score + phrase_bonus + family_bonus + type_bonus

    return Match(
        item_id=str(item.get("id", "")),
        item_type=item_type,
        name=str(item.get("name", "")),
        family=str(item.get("family", "")),
        tags=list(item.get("tags", []) or []),
        path=abs_path,
        score=total_score,
        matched_terms=matched,
        summary=summary,
    )


def load_index(index_path: Path) -> dict:
    if not index_path.exists():
        raise FileNotFoundError(f"index not found: {index_path}")
    return json.loads(index_path.read_text(encoding="utf-8"))


def collect_matches(index: dict, query_text: str) -> list[Match]:
    query_tokens = tokenize(query_text)
    if not query_tokens:
        return []

    matches: list[Match] = []

    for item in index.get("patterns", []):
        match = score_item(item, "pattern", query_text, query_tokens)
        if match:
            matches.append(match)

    for item in index.get("playbooks", []):
        match = score_item(item, "playbook", query_text, query_tokens)
        if match:
            matches.append(match)

    matches.sort(key=lambda m: (-m.score, m.item_id))
    return matches


def print_prompt(matches: Iterable[Match], query_text: str) -> None:
    print(f"QUERY: {query_text}")
    print("TOP MATCHES:")
    for idx, match in enumerate(matches, start=1):
        short_path = match.path.relative_to(REPO_ROOT)
        matched = ", ".join(match.matched_terms) if match.matched_terms else "phrase match"
        print(f"{idx}. {match.item_id} [{match.item_type}] - {match.name}")
        print(f"   tags: {', '.join(match.tags)}")
        print(f"   matched: {matched}")
        print(f"   file: {short_path}")
        if match.summary:
            print(f"   summary: {match.summary}")


def print_json(matches: Iterable[Match], query_text: str) -> None:
    payload = {
        "query": query_text,
        "results": [
            {
                "id": m.item_id,
                "type": m.item_type,
                "name": m.name,
                "family": m.family,
                "tags": m.tags,
                "score": m.score,
                "matched_terms": m.matched_terms,
                "path": str(m.path.relative_to(REPO_ROOT)),
                "summary": m.summary,
            }
            for m in matches
        ],
    }
    print(json.dumps(payload, indent=2))


def print_ids(matches: Iterable[Match]) -> None:
    for match in matches:
        print(match.item_id)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Query internal microinteraction patterns")
    parser.add_argument("--q", required=True, help="query text")
    parser.add_argument("--k", type=int, default=5, help="number of results")
    parser.add_argument(
        "--format",
        choices=["prompt", "json", "ids"],
        default="prompt",
        help="output format",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        index = load_index(INDEX_PATH)
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    matches = collect_matches(index, args.q)
    if not matches:
        print("No matches found.")
        return 0

    top = matches[: max(args.k, 1)]
    if args.format == "prompt":
        print_prompt(top, args.q)
    elif args.format == "json":
        print_json(top, args.q)
    else:
        print_ids(top)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
