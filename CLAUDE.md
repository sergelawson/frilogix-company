# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev         # Vite dev server + HMR (http://localhost:5173)
yarn build       # Production build -> build/client + build/server
yarn start       # Serve the production build via react-router-serve
yarn typecheck   # react-router typegen && tsc --noEmit
yarn lint        # ESLint flat config (typescript-eslint + react-hooks)
```

Use **yarn** — a `yarn.lock` is committed. No test framework is configured.

## What this is

A **React Router 7 (framework mode)** / React 19 marketing and lead-generation site for
Frilogix, a software & AI engineering company. `spec.md` is the authoritative PRD — it defines
the page inventory, per-page content requirements, design language, and SEO keywords. Read it
before adding or restructuring pages.

Routes: `/` (home), `/services`, `/about`, `/case-studies` (intentional "Coming Soon"
placeholder per PRD Phase 2), `/contact`.

The standalone AI Engineering page was **merged into `/services`** — it is now the
"AI Engineering" service card plus the `#intelligent-systems` deep-dive section.
`app/routes/ai-engineering.tsx` still exists but contains only a `loader` that 301-redirects
to `/services#intelligent-systems`, preserving inbound links. Do not re-add it to the nav;
`spec.md` §7.3 still lists it as a separate page and is out of date on this point.

Migrated from Next.js 16 App Router. If you find Next.js idioms (`next/link`, `next/image`,
`"use client"`, `export const metadata`), they are leftovers — remove them.

## Architecture

### Routing and route modules

`app/routes.ts` is the route table — **a new page is not reachable until it's registered
there**, regardless of filename. There is no filesystem-based routing.

Every page in `app/routes/` is a route module exporting a default component plus a `meta`
function. SSR is on (`react-router.config.ts`), so route modules render on the server *and*
hydrate on the client — the same module can export `meta` and use `useEffect`/`useRef`. There
is no client/server component split and no `"use client"` directive.

Route types are generated into `.react-router/types` and imported per-route:

```tsx
import type { Route } from './+types/home';
export const meta: Route.MetaFunction = () => [{ title: '...' }];
```

`dev` and `build` run typegen automatically. If `./+types/*` imports appear missing, run
`yarn typecheck` once. Do not commit `.react-router/`.

### `app/root.tsx`

Owns the whole document: `<html>`/`<head>`, `<Meta />`, `<Links />`, `<ScrollRestoration />`,
`<Scripts />`, plus the `Navbar` + `<Outlet />` + `Footer` shell.

- `links` export loads the favicon and Inter from Google Fonts (there is no `next/font`
  equivalent; the font must stay declared here or `--font-sans` falls back to system sans).
- Root `meta` provides site-wide defaults; per-route `meta` overrides by key.
- `ErrorBoundary` renders both thrown errors and 404s. It re-renders `Navbar`/`Footer` itself
  because it replaces the default export, not the layout.

### Design tokens (Tailwind v4, no config file)

There is no `tailwind.config.js`. Tailwind is wired through the `@tailwindcss/vite` plugin, and
all tokens are declared in the `@theme` block of `app/app.css`, consumed as ordinary utilities:

- `primary` / `primary-dark` / `primary-light` — `#007ea7` family, used for CTAs, links, accents
- `secondary` / `secondary-light` / `secondary-dim` — `#9ad1d4` family, used for hairline
  borders (`border-secondary/30`), dots, and de-emphasized text on dark backgrounds
- `brand-black` `brand-dark` `brand-gray` `brand-light` — text ramp + `#F0F4F8` page background
- `surface` — `#FFFFFF`, used for cards sitting on `brand-light`

Add new colors to the `@theme` block, not inline hex. `.studio-shadow` (also in `app.css`) is
the standard soft card shadow.

### GSAP scroll reveals — read before adding sections

`.gsap-reveal` is defined in `app/app.css` as `opacity: 0; transform: translateY(20px)`.
Elements with this class are **invisible until JavaScript animates them in**. Each animated
route repeats the same `useEffect` that registers the plugin, queries `.gsap-reveal`, wires a
`ScrollTrigger` per element, and kills all triggers on unmount:

```tsx
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);
  const reveals = gsap.utils.toArray('.gsap-reveal') as HTMLElement[];
  reveals.forEach((elem) => { gsap.fromTo(elem, {...}, { scrollTrigger: { trigger: elem, start: "top 85%" } }); });
  return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
}, []);
```

Adding `.gsap-reveal` to a route without that `useEffect` means the content never appears.
`registerPlugin` must stay **inside** `useEffect` — at module scope it runs during SSR.

A `@media (scripting: none)` rule in `app.css` un-hides these elements when JS is disabled.

The PRD requires honoring `prefers-reduced-motion` (§11); the current implementation does not.

### Canvas particle components

Two independent `<canvas>` systems in `app/components/`, both plain rAF loops (not GSAP), all
logic inside `useEffect` so they are SSR-safe:

- `Particles.tsx` — full-viewport connected-dot network, `absolute inset-0` behind the home
  hero. Particle count scales with viewport area, capped at 100.
- `ImageParticles.tsx` — loads `/hero-shape.png`, reads its pixel data off an offscreen canvas
  (sampling every 4th pixel), and turns opaque pixels into spring-damped particles that scatter
  from the cursor. Replacing the hero art means replacing `public/hero-shape.png`; the image
  must have transparency, since particles are only emitted where `alpha > 128`.

### Layout shell

The navbar is `fixed`, so **each route must supply its own top padding** — existing routes use
`pt-32`/`pt-40`/`pt-48`. The navbar swaps to a translucent blurred bar past 20px of scroll and
derives its active-link state from `useLocation()`.

### Conventions

- Import via the `~/*` alias (maps to `app/*`), e.g. `~/components/Navbar`.
- Use `Link` from `react-router` with `to=` (not `href=`).
- `verbatimModuleSyntax` is on — import types with `import type`.
- Plain `<img>` tags; there is no image optimization pipeline.

## Known incomplete work

See `LAUNCH-AUDIT.md` for the full pre-launch audit. The load-bearing items:

- `app/routes/contact.tsx` **fakes submission with a 1.5s `setTimeout`** and tells the user
  their inquiry was sent. Nothing is transmitted or stored. Fields now carry `name`/`id`, so
  the fix is an `action` export + `<Form method="post">` + transactional email.
- Footer social links and legal links (Privacy, Terms) are `href="#"`. The PRD calls for real
  Privacy/Terms pages, and one is legally required once the form works.
- `/about` has no CTA and no outbound internal links. (`/services` now has both.)
- No `metadataBase`/canonical URLs, no `sitemap.xml`, no `robots.txt`, no OG/Twitter images,
  no JSON-LD. Per-route `<title>`/description **are** done.
- `hello@frilogix.com` and "San Francisco, CA" on the contact page are placeholders.
- `app/routes/about.tsx` uses a `picsum.photos` stock placeholder image.
- No analytics installed.

## Repo artifacts to ignore

`metadata.json` and `.env.local`'s `GEMINI_API_KEY` are leftovers from a Google AI Studio
scaffold; nothing references them. `assets/frilogix.png` is a byte-identical duplicate of
`public/logo.png`, and `public/{next,vercel,globe,window,file}.svg` are unused.

Note `spec.md` still describes the old stack (Next.js 16, GSAP "loaded via CDN") — it is
authoritative for **content and scope**, not for tech choices.
