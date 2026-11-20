# MaitiHub24

Upload all files in this folder to the root of your existing GitHub Pages repository, replacing the old site files.

- Original `logo.png` retained in header and footer.
- Existing Google Search Console verification and Analytics tags retained.
- Existing Telegram and WhatsApp contact destinations retained.
- Shorter hero banner and responsive movie cards.
- Two blank advertisement slots, with no visible section heading or placeholder text.
- To add, edit, or remove advertisements, update the `MAITIHUB_ADS` array in `ads.js`. `script.js` reads that configuration and renders the ad slots.

For an ad slot, set `image` to the banner filename and `url` to the destination URL. Upload the image to the repository root. Only advertise websites and materials you are authorized to promote.


## SEO and sitemap

The sitemap is `sitemap.xml`. It lists the canonical homepage. Movie selections currently use query parameters in the same single-page app, so they are not listed as separate canonical HTML pages.
