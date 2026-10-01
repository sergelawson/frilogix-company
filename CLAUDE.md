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

It is a **one-page site**: Home, Services, About, Case Studies (intentional "Coming Soon"
placeholder per PRD Phase 2), and Contact are sections of a single document. On desktop they
sit side by side and vertical scrolling moves them horizontally; see "One-page layout" below.
Each still has its own URL (`/`, `/services`, `/about`, `/case-studies`, `/contact`).

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

The five pages are children of the `routes/site.tsx` layout. **Their route modules export
only `meta` and a default component that returns `null`** — the content lives in
`app/sections/*Section.tsx`, and `site.tsx` renders every section at once, in scroll order.
(The `null` component must stay: a route module with no default export becomes a resource
route.) `routes/contact.tsx` is where the form's future `action` export goes.

SSR is on (`react-router.config.ts`), so modules render on the server *and* hydrate on the
client — the same module can export `meta` and use `useEffect`/`useRef`. There is no
client/server component split and no `"use client"` directive.

Route types are generated into `.react-router/types` and imported per-route:

```tsx
import type { Route } from './+types/home';
export const meta: Route.MetaFunction = () => [{ title: '...' }];
```

`dev` and `build` run typegen automatically. If `./+types/*` imports appear missing, run
`yarn typecheck` once. Do not commit `.react-router/`.

### `app/root.tsx`

Owns the whole document: `<html>`/`<head>`, `<Meta />`, `<Links />`, `<Scripts />`, plus the
`Navbar` + `<Outlet />` + `Footer` shell. There is deliberately **no `<ScrollRestoration />`** —
`HorizontalPages` owns scroll position, and RR's restoration/hash scrolling would fight it.

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

### One-page layout and horizontal scroll — read before adding sections

`app/components/HorizontalPages.tsx` is the scroll engine, built on GSAP ScrollTrigger. In
**horizontal mode** it pins the viewport and translates the track 1px sideways per 1px
scrolled, snapping to whole panels. Otherwise the pages simply stack vertically. Either way it:

- scrolls to the page the URL names on load, link clicks, and back/forward
  (`/services#intelligent-systems` targets a single panel);
- rewrites the URL with a `replace` navigation as pages scroll into view, so the navbar's
  active link and `<title>` follow along. These carry `state.fromScroll`, which the engine
  uses to avoid scrolling in response to its own navigations;
- in horizontal mode only: maps sideways trackpad swipes, ←/→ keys, and focus into
  off-screen panels onto the vertical scroll.

Horizontal mode is the `hscroll:` Tailwind variant, a custom variant in `app/app.css`:
≥1280px wide, ≥700px tall, no reduced-motion preference, and JS enabled. **Its media query
must stay identical to `HORIZONTAL_QUERY` in `HorizontalPages.tsx`**: CSS does the layout,
and JS drives it.

Structure: a section is `<Page path="/x">` containing one or more `<Panel id="…">`
(`app/components/Panel.tsx`). Rules for panels in horizontal mode:

- Every panel is exactly one viewport wide (`100cqw`); snapping assumes equal widths.
- Content must **fit the viewport height**, because overflow is clipped. Use `hscroll:`
  overrides for sizes and spacing; `vh`-based `clamp()` works well for display type. Verify
  at 1280×700, the smallest horizontal viewport.
- Use `panelInner` for the standard content column. It clears the fixed navbar in both modes.
- Don't give elements inside the track a DOM `id` that a URL hash could target. Native
  fragment scrolling would scroll the clipped track. Panels use `data-panel` instead.

### GSAP scroll reveals

`.gsap-reveal` is defined in `app/app.css` as `opacity: 0; transform: translateY(20px)`.
HorizontalPages animates every `.gsap-reveal` inside the track, horizontally (via
`containerAnimation`) or vertically depending on the mode. Just add the class; sections need
no `useEffect` of their own. An `app.css` rule un-hides these elements when JS is off or
the user prefers reduced motion.

If a section does need its own GSAP code (like the hero intro in `HomeSection`), scope it in
`gsap.context()` and `ctx.revert()` on unmount. **Never `ScrollTrigger.getAll().forEach(t =>
t.kill())`**: on a one-page site that kills the scroll engine too. `registerPlugin` must stay
inside an effect, because at module scope it runs during SSR.

Reduced motion gets the vertical layout, no reveals, and no hero intro/parallax. The particle
canvases still animate, so PRD §11 is only partly met.

### Canvas particle components

Two independent `<canvas>` systems in `app/components/`, both plain rAF loops (not GSAP), all
logic inside `useEffect` so they are SSR-safe. Both pause via `IntersectionObserver` when
off-screen, because on the one-page site they stay mounted the whole time:

- `Particles.tsx` — full-viewport connected-dot network, `absolute inset-0` behind the home
  hero. Particle count scales with viewport area, capped at 100.
- `ImageParticles.tsx` — loads `/hero-shape.png`, reads its pixel data off an offscreen canvas
  (sampling every 4th pixel), and turns opaque pixels into spring-damped particles that scatter
  from the cursor. Replacing the hero art means replacing `public/hero-shape.png`; the image
  must have transparency, since particles are only emitted where `alpha > 128`.

### Layout shell

The navbar is `fixed`, so content must clear it: `panelInner` handles that for panels (the
hero pads itself), and panels carry `scroll-mt-20` for vertical-mode scroll targets. The
navbar swaps to a translucent blurred bar past 20px of scroll. It derives its active-link
state from `useLocation()`, which the scroll engine keeps in sync. After the last panel the
pin releases and the `Footer` scrolls up normally.

### Conventions

- Import via the `~/*` alias (maps to `app/*`), e.g. `~/components/Navbar`.
- Use `Link` from `react-router` with `to=` (not `href=`).
- `verbatimModuleSyntax` is on — import types with `import type`.
- Plain `<img>` tags; there is no image optimization pipeline.

## Known incomplete work

See `LAUNCH-AUDIT.md` for the full pre-launch audit. The load-bearing items:

- `app/sections/ContactSection.tsx` **fakes submission with a 1.5s `setTimeout`** and tells the
  user their inquiry was sent. Nothing is transmitted or stored. Fields now carry `name`/`id`,
  so the fix is an `action` export in `routes/contact.tsx` + `<Form method="post"
  action="/contact">` + transactional email.
- Every URL serves the same one-page document, so search engines will likely treat
  `/services`, `/about`, etc. as duplicates of `/`, despite their distinct `<title>`s. No
  canonical tags are set yet.
- Footer social links and legal links (Privacy, Terms) are `href="#"`. The PRD calls for real
  Privacy/Terms pages, and one is legally required once the form works.
- The About section has no CTA and no outbound internal links.
- No `metadataBase`/canonical URLs, no `sitemap.xml`, no `robots.txt`, no OG/Twitter images,
  no JSON-LD. Per-route `<title>`/description **are** done.
- `hello@frilogix.com` and "San Francisco, CA" on the contact page are placeholders.
- `app/sections/AboutSection.tsx` uses a `picsum.photos` stock placeholder image.
- No analytics installed.

## Repo artifacts to ignore

`metadata.json` and `.env.local`'s `GEMINI_API_KEY` are leftovers from a Google AI Studio
scaffold; nothing references them. `assets/frilogix.png` is a byte-identical duplicate of
`public/logo.png`, and `public/{next,vercel,globe,window,file}.svg` are unused.

Note `spec.md` still describes the old stack (Next.js 16, GSAP "loaded via CDN") — it is
authoritative for **content and scope**, not for tech choices.
