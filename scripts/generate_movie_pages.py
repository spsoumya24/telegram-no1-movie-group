import json
from pathlib import Path
from html import escape
from urllib.parse import quote

BASE = 'https://maitihub24.dpdns.org'
ROOT = Path(__file__).resolve().parents[1]
movies = json.loads((ROOT / 'movies.json').read_text(encoding='utf-8'))

urls = [
    f'  <url><loc>{BASE}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>'
]

for movie in movies:
    movie_id = str(movie.get('id', '')).strip()
    if not movie_id:
        continue

    title = str(movie.get('title') or 'Movie').strip()
    image = str(movie.get('image') or 'og.png').strip()
    download_url = str(movie.get('link') or '').strip()

    safe_id = quote(movie_id, safe='-._~')
    page_url = f'{BASE}/movie/{safe_id}/'
    image_url = f'{BASE}/{quote(image.lstrip("/"), safe="/-._~")}'
    app_url = f'{BASE}/?movie={quote(movie_id, safe="-._~")}'

    safe_title = escape(title)
    safe_page_url = escape(page_url, quote=True)
    safe_image_url = escape(image_url, quote=True)
    safe_download_url = escape(download_url, quote=True)

    if download_url:
        banner = (
            f'<a class="poster-link" href="{safe_download_url}" '
            'target="_blank" rel="noopener noreferrer">'
            f'<img src="{safe_image_url}" alt="{safe_title} poster">'
            '<span class="download-label">OPEN DOWNLOAD LINK ↗</span></a>'
        )
        action = (
            f'<a class="download-button" href="{safe_download_url}" '
            'target="_blank" rel="noopener noreferrer">'
            'OPEN DOWNLOAD LINK ↗</a>'
        )
    else:
        banner = f'<img src="{safe_image_url}" alt="{safe_title} poster">'
        action = '<p class="missing-link">Download link will be added soon.</p>'

    page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="index,follow">
<title>{safe_title} | MaitiHub24</title>
<meta name="description" content="View {safe_title} on MaitiHub24. Tap the movie banner to open its download link.">
<link rel="canonical" href="{safe_page_url}">
<meta property="og:site_name" content="MaitiHub24">
<meta property="og:type" content="website">
<meta property="og:title" content="{safe_title} | MaitiHub24">
<meta property="og:description" content="Tap to view {safe_title} on MaitiHub24.">
<meta property="og:url" content="{safe_page_url}">
<meta property="og:image" content="{safe_image_url}">
<meta property="og:image:secure_url" content="{safe_image_url}">
<meta property="og:image:alt" content="{safe_title} movie poster">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{safe_title} | MaitiHub24">
<meta name="twitter:description" content="Tap to view {safe_title} on MaitiHub24.">
<meta name="twitter:image" content="{safe_image_url}">
<style>
*{{box-sizing:border-box}}
body{{margin:0;min-height:100vh;background:#080d13;color:#fff;font:16px system-ui;display:grid;place-items:center;text-align:center;padding:20px}}
main{{width:min(100%,560px);padding:20px}}
h1{{font-size:clamp(22px,5vw,32px);margin:18px 0 8px}}
p{{color:#b9c4ce;line-height:1.5}}
.poster-link{{display:block;position:relative;max-width:360px;margin:0 auto;border-radius:14px;overflow:hidden;text-decoration:none;color:#fff;box-shadow:0 12px 36px #0009}}
img{{display:block;width:100%;max-height:65vh;object-fit:contain;background:#111923}}
.download-label{{display:block;padding:14px;background:#168dcc;font-weight:800;letter-spacing:.04em}}
.download-button{{display:inline-block;margin-top:18px;padding:13px 22px;border-radius:10px;background:#168dcc;color:#fff;text-decoration:none;font-weight:800}}
.home-link{{display:inline-block;margin-top:22px;color:#8fcfff;text-decoration:none}}
.missing-link{{color:#ffc66d}}
</style>
</head>
<body>
<main>
{banner}
<h1>{safe_title}</h1>
<p>Tap the movie banner or the button below to open the download destination.</p>
{action}
<br><a class="home-link" href="{BASE}/#movies">← Back to MaitiHub24</a>
</main>
</body>
</html>
'''

    target = ROOT / 'movie' / movie_id / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(page, encoding='utf-8')
    urls.append(
        f'  <url><loc>{escape(page_url)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>'
    )

sitemap = (
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + '\n'.join(urls)
    + '\n</urlset>\n'
)
(ROOT / 'sitemap.xml').write_text(sitemap, encoding='utf-8')
print(f'Generated {len(movies)} movie pages and sitemap.')
