# React + Vite

## Deploying to GitHub Pages

The GitHub Actions workflow in `.github/workflows/deploy-pages.yml` builds and
deploys the site after each push to `main`. Because this repository is named
`innotechco.github.io`, it is an organization site and is built for the root URL:
https://innotechco.github.io/.

One-time GitHub setup:

1. Push the workflow to `main` or run **Deploy to GitHub Pages** manually. The
   workflow requests Pages enablement when the site does not exist yet.
2. If organization policy prevents automatic enablement, open **Settings →
   Pages** in `innotechco/innotechco.github.io` and set **Source** to **GitHub
   Actions**, then re-run the workflow.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
