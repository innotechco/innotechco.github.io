# innotech.global

Marketing site for Innotech, built with React 19, Vite and Tailwind 4.
Single-page app in English, Arabic and Turkish, deployed as a static site to
GitHub Pages, with article content pulled from a headless WordPress install.

## Running it

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm test` | Smoke tests (`node --test`) |
| `npm run lint` | ESLint |

`npm test` and `npm run lint` both run in CI before every deploy.

## Layout

```
src/
  app/            Entry point, routes, and the theme/language/contact providers
  features/       One directory per page or section of the site
  shared/         Layout, reusable components, hooks, i18n, brand assets
  content/        Page copy as JSON, one tree per locale (en, ar, tr)
  integrations/   WordPress client and adapters, form delivery
  styles/         Global CSS imported from src/index.css
tools/
  scripts/        Build-time scripts
  wordpress/      WordPress import tooling and the article-fields plugin
docs/             Project documentation
```

Features follow a consistent shape: `Feature.jsx` for the component,
`feature.content.js` for copy, `feature.assets.js` for images, and
`feature.config.js` for anything structural. Path aliases `@app`, `@features`,
`@shared`, `@content` and `@integrations` are defined in both `vite.config.js`
and `jsconfig.json`.

## Content and locales

Page copy lives in `src/content/<locale>/` and is loaded with
`import.meta.glob`. All three locales carry identical key shapes - a test
enforces this - so adding a key means adding it to `en`, `ar` and `tr`.

Locale is stored in `localStorage` under `innotech-language`, and switching it
reloads the page, so locale is resolved once at module load. Arabic sets
`dir="rtl"` on the document.

Article content is fetched from WordPress at runtime, falling back to the
bundled JSON when the CMS is unavailable. See
[docs/wordpress/cms-contract.md](docs/wordpress/cms-contract.md) for the shape
the CMS is expected to return.

## Environment

Copy `.env.example` to `.env.local`. The `VITE_CMS_*` variables control the
WordPress integration; with `VITE_CMS_ENABLED=false` the site runs entirely on
bundled content.

## Deploying

`.github/workflows/deploy-pages.yml` builds and deploys to GitHub Pages on push
to `main`, and hourly on a schedule that only deploys when WordPress has
articles the live site does not yet serve.

Because the site is a single-page app on static hosting, every route needs a
real file or a direct link to it returns 404.
`tools/scripts/generate-static-route-fallbacks.mjs` handles that: it writes an
`index.html` for each route, gives each one its own title and meta tags, and
generates `sitemap.xml` and `404.html`. **A new page needs its route added to
that script's `staticRoutes` list** - a test fails if you forget.

The base path is computed per repository: the organization site
`innotechco.github.io` builds for `/`, while a project site such as
`IconicCerberrus/InnoTech-Website` builds for `/InnoTech-Website/`, so
deploying one does not affect the other.

One-time setup for a fresh Pages site: run the workflow once, then set
**Settings → Pages → Source** to **GitHub Actions** and re-run it. The
workflow's token cannot change that setting itself.
