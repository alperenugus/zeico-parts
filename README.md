# Zeico Auto Parts — website

- `public/` — static storefront (Turkish at `/`, English at `/en/`) and the admin panel (`/admin/`).
- `functions/`, `lib/` — Cloudflare Pages Functions: admin login, stock/price/photo API (KV storage).
- `scripts/build-gh-pages.py` — builds the static GitHub Pages copy (storefront only; reads live data from Cloudflare).

## Deploy

- Cloudflare Pages: `wrangler pages deploy --project-name zeico-parts --branch main`
- GitHub Pages: automatic on every push to `main` (`.github/workflows/gh-pages.yml`).

Product content lives in `public/assets/js/products.js`; prices, stock and photos are managed in the admin panel.
Secrets (`ADMIN_PASSWORD`, `SESSION_SECRET`) are set in Cloudflare; for local dev put them in `.dev.vars` (git-ignored).
