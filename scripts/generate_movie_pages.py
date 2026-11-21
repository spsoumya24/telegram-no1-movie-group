import json
from pathlib import Path
from html import escape
from urllib.parse import quote
BASE = 'https://maitihub24.dpdns.org'
ROOT = Path(__file__).resolve().parents[1]
movies = json.loads((ROOT / 'movies.json').read_text(encoding='utf-8'))
urls = [f'  <url><loc>{BASE}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>']
for movie in movies:
    movie_id = str(movie.get('id', '')).strip()
    if not movie_id:
        continue
    title = str(movie.get('title') or 'Movie').strip()
    image = str(movie.get('image') or 'og.png').strip()
    safe_id = quote(movie_id, safe='-._~')
    page_url = f'{BASE}/movie/{safe_id}/'
    image_url = f'{BASE}/{quote(image, safe="/-._~")}'
    app_url = f'{BASE}/?movie={quote(movie_id, safe="-._~")}'
    page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow"><title>{escape(title)} | MaitiHub24</title><meta name="description" content="View {escape(title)} on MaitiHub24. Movie poster, details and updates."><link rel="canonical" href="{escape(page_url, quote=True)}"><meta property="og:site_name" content="MaitiHub24"><meta property="og:type" content="website"><meta property="og:title" content="{escape(title)} | MaitiHub24"><meta property="og:description" content="Explore {escape(title)} on MaitiHub24."><meta property="og:url" content="{escape(page_url, quote=True)}"><meta property="og:image" content="{escape(image_url, quote=True)}"><meta property="og:image:secure_url" content="{escape(image_url, quote=True)}"><meta property="og:image:alt" content="{escape(title)} movie poster"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{escape(title)} | MaitiHub24"><meta name="twitter:description" content="Explore {escape(title)} on MaitiHub24."><meta name="twitter:image" content="{escape(image_url, quote=True)}"><meta http-equiv="refresh" content="2;url={escape(app_url, quote=True)}"><style>body{{margin:0;background:#080d13;color:#fff;font:16px system-ui;display:grid;min-height:100vh;place-items:center;text-align:center}}main{{max-width:560px;padding:24px}}img{{max-width:min(78vw,300px);max-height:55vh;object-fit:contain;border-radius:12px}}a{{color:#42b9f5}}</style></head>
    <body><main><img src="{escape(image_url, quote=True)}" alt="{escape(title)} poster"><h1>{escape(title)}</h1><p>Opening MaitiHub24 movie page…</p><p><a href="{escape(app_url, quote=True)}">Open movie now</a></p></main><script>location.replace({json.dumps(app_url)});</script></body></html>'''
    target = ROOT / 'movie' / movie_id / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(page, encoding='utf-8')
    urls.append(f'  <url><loc>{escape(page_url)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>')
sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '\n'.join(urls) + '\n</urlset>\n'
(ROOT / 'sitemap.xml').write_text(sitemap, encoding='utf-8')
  
