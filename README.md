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
  routes/           site.tsx (the one-page layout) + one meta-only module per page URL
  sections/         Page layouts — every page is a section of the one-page site
  content/          Copy and facts as typed data (edit text here, not in JSX)
  components/       Navbar, Footer, HorizontalPages (scroll engine), Panel, ContactForm,
                    ImageParticles (hero X), ui/ (buttons, headers, placeholders)
  lib/              meta helper, contact validation, inquiry.server.ts (email)
  app.css           Tailwind v4 entry + @theme design tokens
public/             Static assets served at the web root (og.png = social preview)
docs/               Before/after screenshots of the 2026-10 redesign
react-router.config.ts   SSR config
vite.config.ts      Tailwind, React Router, and tsconfig-paths plugins
```

Imports use the `~/*` alias, which maps to `app/*`.

Route types are generated into `.react-router/types` by `react-router typegen`
(run automatically by `dev` and `build`). If your editor reports missing
`./+types/*` modules, run `yarn typecheck` once.

## Contact form email

The contact form emails each inquiry through [Resend](https://resend.com). Set these
environment variables on the server:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | A Resend API key |
| `CONTACT_TO_EMAIL` | Where inquiries go, e.g. `hello@frilogix.com` |
| `CONTACT_FROM_EMAIL` | Sender on a domain verified in Resend, e.g. `Frilogix <website@frilogix.com>` |

Without them, `yarn dev` logs inquiries to the server console, and a production
build shows visitors an error asking them to email instead.

## Deploying

`yarn build` produces a Node server at `build/server/index.js`, served by
`yarn start`. For Vercel, add the `@vercel/react-router` preset to
`react-router.config.ts` instead.

## Project docs

- `spec.md` — the product requirements document (authoritative for content and scope)
- `LAUNCH-AUDIT.md` — pre-launch audit; **read this before shipping**, several
  launch blockers are open
- `CLAUDE.md` — architecture notes for AI coding agents
