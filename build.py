#!/usr/bin/env python3
"""Builds the Falcon site from src/ using only the standard library.

    python3 build.py

src/home.html        -> index.html
src/docs/NN-slug.md  -> docs/slug.html (the "getting-started" page becomes docs/index.html)
Each file starts with "title: ...", "section: ..." and a "---" line; files sort into the sidebar by NN.

Markdown subset: # headings, paragraphs, - lists, 1. lists, > notes, ``` code, | tables,
`code`, **bold** and [links](url).
"""
import html
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent
REPO = "https://github.com/Falcon-MC/Falcon"

def logo(prefix, css=""):
    """The project logo, switching to the dark variant if the visitor's system prefers a light scheme."""
    return (f'<picture><source media="(prefers-color-scheme: light)" srcset="{prefix}assets/logo.png">'
            f'<img class="{css}" src="{prefix}assets/logo-white.png" alt="Falcon"></picture>')


def inline(text):
    parts = re.split(r"(`[^`]+`)", text)
    out = []
    for part in parts:
        if len(part) > 1 and part.startswith("`"):
            out.append(f"<code>{html.escape(part[1:-1], quote=False)}</code>")
            continue
        part = html.escape(part, quote=False)
        part = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", part)
        part = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', part)
        out.append(part)
    return "".join(out)


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", re.sub(r"`", "", text).lower()).strip("-")


def split_row(line):
    cells = re.split(r"(?<!\\)\|", line.strip().strip("|"))
    return [cell.strip().replace("\\|", "|") for cell in cells]


def render(markdown):
    lines = markdown.split("\n")
    out, toc, i = [], [], 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
        elif line.startswith("```"):
            i += 1
            code = []
            while not lines[i].startswith("```"):
                code.append(lines[i])
                i += 1
            i += 1
            out.append(f'<pre tabindex="0"><code>{html.escape(chr(10).join(code), quote=False)}</code></pre>')
        elif line.startswith("#"):
            level = len(line) - len(line.lstrip("#"))
            text = line[level:].strip()
            anchor = slugify(text)
            if level == 2:
                toc.append((anchor, text))
            out.append(f'<h{level} id="{anchor}">{inline(text)}</h{level}>')
            i += 1
        elif line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append(split_row(lines[i]))
                i += 1
            head = "".join(f"<th>{inline(c)}</th>" for c in rows[0])
            body = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in row) + "</tr>" for row in rows[2:])
            out.append(f'<div class="table"><table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table></div>')
        elif line.startswith("> "):
            note = []
            while i < len(lines) and lines[i].startswith("> "):
                note.append(lines[i][2:])
                i += 1
            out.append(f'<aside class="note">{inline(" ".join(note))}</aside>')
        elif re.match(r"(- |\d+\. )", line):
            tag = "ul" if line.startswith("- ") else "ol"
            items = []
            while i < len(lines) and re.match(r"(- |\d+\. |  )", lines[i]):
                if lines[i].startswith("  "):
                    items[-1] += " " + lines[i].strip()
                else:
                    items.append(re.sub(r"^(- |\d+\. )", "", lines[i]))
                i += 1
            out.append(f"<{tag}>" + "".join(f"<li>{inline(item)}</li>" for item in items) + f"</{tag}>")
        else:
            para = []
            while i < len(lines) and lines[i].strip() and not re.match(r"(#|```|\||> |- |\d+\. )", lines[i]):
                para.append(lines[i])
                i += 1
            out.append(f"<p>{inline(' '.join(para))}</p>")
    return "\n".join(out), toc


def head(title, prefix):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="Falcon is a Minecraft: Bedrock Edition server written from scratch in C++17.">
<link rel="icon" href="{prefix}assets/logo-white.png" type="image/png" media="(prefers-color-scheme: dark)">
<link rel="icon" href="{prefix}assets/logo.png" type="image/png" media="(prefers-color-scheme: light)">
<link rel="stylesheet" href="{prefix}assets/style.css">
</head>
"""


def topbar(prefix, active):
    docs = ' aria-current="page"' if active == "docs" else ""
    return f"""<header class="topbar"><div class="topbar-in">
<a class="brand" href="{prefix}index.html" aria-label="Falcon home">{logo(prefix)}<span>Falcon</span></a>
<nav aria-label="Main"><a href="{prefix}docs/index.html"{docs}>Docs</a><a href="{REPO}">GitHub</a></nav>
</div></header>
"""


FOOTER = f"""<footer class="footer"><div class="footer-in">
<p>Falcon is licensed under the <a href="{REPO}/blob/main/LICENSE">LGPL-3.0</a>.
Not affiliated with Mojang. All brands and trademarks belong to their respective owners.</p>
</div></footer>
"""


def main():
    home = (ROOT / "src" / "home.html").read_text().replace("{{logo}}", logo("", "hero-logo"))
    (ROOT / "index.html").write_text(
        head("Falcon: a Bedrock server written from scratch in C++", "")
        + "<body>\n" + topbar("", "home") + home + FOOTER
        + '<script src="assets/download.js"></script>\n' + "</body>\n</html>\n")

    pages = []
    for source in sorted((ROOT / "src" / "docs").glob("*.md")):
        meta, body = source.read_text().split("\n---\n", 1)
        fields = dict(line.split(": ", 1) for line in meta.splitlines())
        slug = source.stem.split("-", 1)[1]
        pages.append({
            "title": fields["title"],
            "section": fields["section"],
            "file": "index.html" if slug == "getting-started" else slug + ".html",
            "body": body,
        })

    (ROOT / "docs").mkdir(exist_ok=True)
    for stale in (ROOT / "docs").glob("*.html"):
        stale.unlink()

    def menu(active):
        out, section = [], None
        for p in pages:
            if p["section"] != section:
                if section is not None:
                    out.append("</ul>")
                section = p["section"]
                out.append(f"<h2>{section}</h2><ul>")
            current = ' aria-current="page"' if p is active else ""
            out.append(f'<li><a href="{p["file"]}"{current}>{p["title"]}</a></li>')
        return "".join(out) + "</ul>"

    for index, page in enumerate(pages):
        links = menu(page)
        content, toc = render(page["body"])
        contents = ""
        if len(toc) > 2:
            items = "".join(f'<li><a href="#{a}">{inline(t)}</a></li>' for a, t in toc)
            contents = f'<nav class="toc" aria-label="On this page"><h2>On this page</h2><ul>{items}</ul></nav>'
        pager = ""
        if index > 0:
            prev = pages[index - 1]
            pager += f'<a class="prev" href="{prev["file"]}"><span>Previous</span>{prev["title"]}</a>'
        if index + 1 < len(pages):
            nxt = pages[index + 1]
            pager += f'<a class="next" href="{nxt["file"]}"><span>Next</span>{nxt["title"]}</a>'
        document = (
            head(f'{page["title"]} - Falcon docs', "../") + "<body>\n" + topbar("../", "docs")
            + f"""<details class="docs-menu"><summary>Docs menu<span>{page["title"]}</span></summary>
<div class="menu-in">{links}</div></details>
<div class="docs">
<nav class="sidebar" aria-label="Documentation"><div class="sidebar-in">{links}</div></nav>
<main class="doc"><p class="crumb">{page["section"]}</p><h1>{page["title"]}</h1>
{contents}
{content}
<div class="pager">{pager}</div>
</main>
</div>
""" + FOOTER + "</body>\n</html>\n")
        (ROOT / "docs" / page["file"]).write_text(document)
    print(f"Built index.html and {len(pages)} docs pages")


if __name__ == "__main__":
    main()
