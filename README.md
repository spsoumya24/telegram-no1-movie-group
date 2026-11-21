# MaitiHub24

Static GitHub Pages movie hub for `https://maitihub24.dpdns.org/`.

## Add a movie

1. Add an object to `movies.json` with a unique `id`, `title`, `image`, and optional `link`.
2. Upload the matching poster image file to the repository root.
3. Commit/push to `main`.
4. GitHub Actions automatically creates `movie/<id>/index.html` with movie-specific Open Graph and Twitter metadata and updates `sitemap.xml`.
5. Share `https://maitihub24.dpdns.org/movie/<id>/` to show that movie's poster preview.

The old query-style URL `/?movie=<id>` remains supported for opening a selected movie in the homepage app, but it cannot reliably provide per-movie social previews on static hosting. Use the generated `/movie/<id>/` URL for WhatsApp, Telegram, and Facebook sharing.

Homepage social preview uses `og.png`.
