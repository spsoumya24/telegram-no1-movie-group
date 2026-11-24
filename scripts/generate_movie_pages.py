#!/usr/bin/env python3
# Generate MaitiHub24 movie detail pages and sitemap from movies.json.
# Place at scripts/generate_movie_pages.py and run:
# python scripts/generate_movie_pages.py

import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

SITE = "https://maitihub24.dpdns.org"
HERE = Path(__file__).resolve()
ROOT = HERE.parent.parent if HERE.parent.name == "scripts" else HERE.parent
MOVIES_JSON = ROOT / "movies.json"
MOVIE_ROOT = ROOT / "movie"
SITEMAP = ROOT / "sitemap.xml"


def slugify(value):
    slug = re.sub(r"[^a-z0-9]+", "-", str(value or "").strip().lower()).strip("-")
    return slug or "movie"


def image_url(value):
    value = str(value or "").strip()
    if not value:
        return SITE + "/logo.png"
    if value.startswith(("https://", "http://")):
        return value
    return SITE + "/" + quote(value.lstrip("/"), safe="/")


def page_html(movie, slug):
    title = str(movie.get("title") or "Movie").strip()
    destination = str(movie.get("link") or "").strip()
    poster = image_url(movie.get("image"))
    page_url = f"{SITE}/movie/{quote(slug)}/"
    description = f"View {title} on MaitiHub24. Tap the movie banner to open its destination link."

    t = html.escape(title, quote=True)
    d = html.escape(description, quote=True)
    pu = html.escape(page_url, quote=True)
    im = html.escape(poster, quote=True)

    if destination:
        link = html.escape(destination, quote=True)
        action = (
            f'<a class="poster" href="{link}" target="_blank" rel="noopener noreferrer">'
            f'<img src="{im}" alt="{t} poster"><span>OPEN LINK ↗</span></a>'
            f'<a class="button" href="{link}" target="_blank" rel="noopener noreferrer">OPEN LINK ↗</a>'
        )
        note = "Tap the movie banner or button to open the destination link."
    else:
        action = f'<div class="poster"><img src="{im}" alt="{t} poster"></div>'
        note = "The destination link will be added soon."

    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="index,follow">
<title>{t} | MaitiHub24</title>
<meta name="description" content="{d}">
<link rel="canonical" href="{pu}">
<link rel="stylesheet" href="/advanced-search.css">
<meta property="og:site_name" content="MaitiHub24">
<meta property="og:type" content="website">
<meta property="og:title" content="{t} | MaitiHub24">
<meta property="og:description" content="{d}">
<meta property="og:url" content="{pu}">
<meta property="og:image" content="{im}">
<meta property="og:image:secure_url" content="{im}">
<meta property="og:image:alt" content="{t} movie poster">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{t} | MaitiHub24">
<meta name="twitter:description" content="{d}">
<meta name="twitter:image" content="{im}">
<style>
*{{box-sizing:border-box}}
body{{margin:0;min-height:100vh;background:#080d13;color:#fff;font:16px system-ui;display:grid;place-items:center;text-align:center;padding:20px}}
main{{width:min(100%,560px);padding:20px}}
h1{{font-size:clamp(22px,5vw,32px);margin:18px 0 8px}}
p{{color:#b9c4ce;line-height:1.5}}
.poster{{display:block;position:relative;max-width:420px;margin:0 auto;border-radius:14px;overflow:hidden;text-decoration:none;color:#fff;box-shadow:0 12px 36px #0009}}
img{{display:block;width:100%;max-height:65vh;object-fit:contain;background:#111923}}
.poster span{{display:block;padding:14px;background:#168dcc;font-weight:800;letter-spacing:.04em}}
.button{{display:inline-block;margin-top:18px;padding:13px 22px;border-radius:10px;background:#168dcc;color:#fff;text-decoration:none;font-weight:800}}
.home{{display:inline-block;margin-top:22px;color:#8fcfff;text-decoration:none}}
</style>
</head>
<body>
<header class="detail-topbar">
  <a class="detail-brand" href="{SITE}/" aria-label="MaitiHub24 home">
    <img src="{SITE}/logo.gif" alt="MaitiHub24 logo">
    <span>MAITI<span>HUB24</span></span>
  </a>
  <button type="button" class="maiti-search-trigger" id="open-movie-search"
    aria-label="Open advanced movie search" aria-haspopup="dialog" aria-controls="movie-search-panel">
    <span class="maiti-search-glass" aria-hidden="true">🔎</span><span>Search</span>
  </button>
</header>
<div class="maiti-search-panel" id="movie-search-panel" hidden>
  <section class="maiti-search-dialog" role="dialog" aria-modal="true" aria-labelledby="maiti-search-heading">
    <div class="maiti-search-heading">
      <span id="maiti-search-heading">Advanced Movie Search</span>
      <button type="button" class="maiti-search-close" id="close-movie-search" aria-label="Close search">×</button>
    </div>
    <div class="maiti-search-input-wrap">
      <span class="maiti-search-glass" aria-hidden="true">⌕</span>
      <input type="search" id="movie-search-input" placeholder="Search movies... / মুভি খুঁজুন" autocomplete="off" aria-label="Search movies">
    </div>
    <div class="maiti-search-results" id="movie-search-results" role="listbox" aria-label="Movie search results"></div>
  </section>
</div>
<main>
{action}
<h1>{t}</h1>
<p>{html.escape(note)}</p>
<a class="home" href="{SITE}/#movies">← Back to MaitiHub24</a>
</main>
<script src="/advanced-search.js" defer></script>
</body></html>
'''


def main():
    if not MOVIES_JSON.is_file():
        print(f"ERROR: movies.json not found at {MOVIES_JSON}", file=sys.stderr)
        return 1
    try:
        movies = json.loads(MOVIES_JSON.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"ERROR reading movies.json: {exc}", file=sys.stderr)
        return 1
    if not isinstance(movies, list):
        print("ERROR: movies.json must be a JSON array.", file=sys.stderr)
        return 1

    MOVIE_ROOT.mkdir(parents=True, exist_ok=True)
    urls = [SITE + "/"]
    used = set()
    count = 0

    for movie in movies:
        if not isinstance(movie, dict) or not movie.get("id"):
            print("Skipping entry without a valid id.")
            continue
        slug = slugify(movie["id"])
        if slug in used:
            print(f"Skipping duplicate movie id: {slug}")
            continue
        used.add(slug)
        folder = MOVIE_ROOT / slug
        folder.mkdir(parents=True, exist_ok=True)
        (folder / "index.html").write_text(page_html(movie, slug), encoding="utf-8")
        urls.append(f"{SITE}/movie/{quote(slug)}/")
        count += 1
        print(f"Created movie/{slug}/index.html")

    entries = []
    for url in urls:
        priority = "1.0" if url == SITE + "/" else "0.8"
        entries.append(
            f"  <url><loc>{html.escape(url)}</loc>"
            f"<changefreq>weekly</changefreq><priority>{priority}</priority></url>"
        )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )
    SITEMAP.write_text(xml, encoding="utf-8")
    print(f"Finished: {count} movie pages created; sitemap.xml updated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
