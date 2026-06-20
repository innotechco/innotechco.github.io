# React + Vite

## Deploying to GitHub Pages with a custom domain

The GitHub Actions workflow in `.github/workflows/deploy-pages.yml` builds and
deploys the site after each push to `main`. It uses `/` as its Vite base path,
which is required when a custom domain serves the site from its root.

One-time GitHub setup:

1. Open **Settings → Pages** in `rdfco/innotech-website`.
2. Set **Source** to **GitHub Actions**.
3. Enter the company's chosen domain under **Custom domain**, save it, and enable
   **Enforce HTTPS** once GitHub verifies the DNS records.

DNS setup (at the domain's DNS provider):

- Add these four `A` records for `@`:
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and
  `185.199.111.153`.
- Optionally add `www` as a `CNAME` pointing to `rdfco.github.io`.

After DNS propagation, GitHub Pages will serve the site at
the custom domain configured in GitHub Pages.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
