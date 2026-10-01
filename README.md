# Frilogix Company Website

Marketing and lead-generation site for Frilogix — a software & AI engineering company.

Built with **React Router 7** (framework mode), React 19, Tailwind CSS v4, and GSAP.
Server-rendered by default so every page is crawlable.

## Requirements

- Node.js 20+
- Yarn 1.x (a `yarn.lock` is committed)

## Run locally

```bash
yarn install
yarn dev          # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Vite dev server with HMR |
| `yarn build` | Production build → `build/client` + `build/server` |
| `yarn start` | Serve the production build (`react-router-serve`) |
| `yarn typecheck` | Regenerate route types, then run `tsc --noEmit` |
| `yarn lint` | ESLint (flat config, typescript-eslint + react-hooks) |

There is no test suite yet.

## Project layout

```
app/
  root.tsx          Document shell, <Meta>/<Links>, nav + footer, ErrorBoundary (404)
  routes.ts         Route table
  routes/           One module per page, each exporting `meta` + a default component
  components/       Navbar, Footer, and the two canvas particle systems
  app.css           Tailwind v4 entry + @theme design tokens
public/             Static assets served at the web root
react-router.config.ts   SSR config
vite.config.ts      Tailwind, React Router, and tsconfig-paths plugins
```

Imports use the `~/*` alias, which maps to `app/*`.

Route types are generated into `.react-router/types` by `react-router typegen`
(run automatically by `dev` and `build`). If your editor reports missing
`./+types/*` modules, run `yarn typecheck` once.

## Deploying

`yarn build` produces a Node server at `build/server/index.js`, served by
`yarn start`. For Vercel, add the `@vercel/react-router` preset to
`react-router.config.ts` instead.

## Project docs

- `spec.md` — the product requirements document (authoritative for content and scope)
- `LAUNCH-AUDIT.md` — pre-launch audit; **read this before shipping**, the contact
  form is still a mock and several launch blockers are open
- `CLAUDE.md` — architecture notes for AI coding agents
