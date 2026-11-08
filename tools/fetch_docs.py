#!/usr/bin/env python3
"""Pulls the Markdown docs of the Falcon repositories into src/docs/ before build.py runs.

    python3 tools/fetch_docs.py

Each repository's docs/*.md becomes src/docs/NN-slug.md. A file that already starts with "title:" and
"section:" lines is kept as written; otherwise the title is its first "# " heading and the section the
repository's. Set GITHUB_TOKEN (or GH_TOKEN) to avoid the anonymous API rate limit.
"""
import base64
import json
import os
import pathlib
import re
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
TARGET = ROOT / "src" / "docs"

# repository, branch, sidebar section, first page number: numbers stay above the hand-written pages
SOURCES = [
    ("Falcon-MC/Falcon", "dev", "Server reference", 70),
    ("Falcon-MC/PluginAPI", "main", "Plugin API reference", 80),
]

GENERATED = re.compile(r"^(7|8)\d-")


def request(url):
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "falcon-site-docs"}
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as response:
        return json.load(response)


def listing(repository, branch):
    try:
        entries = request(f"https://api.github.com/repos/{repository}/contents/docs?ref={branch}")
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return []
        raise
    return sorted((e for e in entries if e["type"] == "file" and e["name"].endswith(".md")),
                  key=lambda e: e["name"])


def page(text, section):
    if re.match(r"title: .+\nsection: .+\n", text):
        return text
    lines = text.strip("\n").split("\n")
    title = None
    for index, line in enumerate(lines):
        if line.startswith("# "):
            title = line[2:].strip()
            del lines[index]
            break
    if title is None:
        return None
    return f"title: {title}\nsection: {section}\n---\n" + "\n".join(lines).strip("\n") + "\n"


def main():
    for stale in TARGET.glob("*.md"):
        if GENERATED.match(stale.name):
            stale.unlink()
    written = 0
    for repository, branch, section, first in SOURCES:
        for offset, entry in enumerate(listing(repository, branch)[:10]):
            blob = request(entry["url"])
            text = base64.b64decode(blob["content"]).decode("utf-8")
            body = page(text, section)
            if body is None:
                print(f"skipped {repository}/{entry['path']}: no title")
                continue
            slug = re.sub(r"[^a-z0-9]+", "-", entry["name"][:-3].lower()).strip("-")
            (TARGET / f"{first + offset}-{slug}.md").write_text(body)
            written += 1
    print(f"Fetched {written} docs pages")


if __name__ == "__main__":
    main()
