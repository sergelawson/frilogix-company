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
the page inventory, per-page content requirements, design direction ("Engineered Swiss", §11),
and SEO keywords. Read it before adding or restructuring pages.

It is a **one-page site**: Home, Services, Work, About and Contact are sections of a single
document, in that order. On desktop they sit side by side and vertical scrolling moves them
horizontally; see "One-page layout" below. Each still has its own URL (`/`, `/services`,
`/work`, `/about`, `/contact`).

Two routes only redirect (301), preserving inbound links: `/ai-engineering` →
`/services#intelligent-systems` (the AI page was merged into Services) and `/case-studies` →
`/work` (renamed). Don't re-add either to the nav.

Migrated from Next.js 16 App Router. If you find Next.js idioms (`next/link`, `next/image`,
`"use client"`, `export const metadata`), they are leftovers — remove them.

## Architecture

### Routing and route modules

`app/routes.ts` is the route table — **a new page is not reachable until it's registered
there**, regardless of filename. There is no filesystem-based routing.

The five pages are children of the `routes/site.tsx` layout. **Their route modules export
only `meta` (and, for contact, the form `action`) plus a default component that returns
`null`** — the content lives in `app/sections/*Section.tsx`, and `site.tsx` renders every
section at once, in scroll order. (The `null` component must stay: a route module with no
default export becomes a resource route.) The page list, in order, is `pages` in
`app/content/site.ts`; the navbar, footer and page counter read it, so a new page goes there,
in `routes.ts`, and in `site.tsx`.

SSR is on (`react-router.config.ts`), so modules render on the server *and* hydrate on the
client — the same module can export `meta` and use `useEffect`/`useRef`. There is no
client/server component split and no `"use client"` directive. Server-only code lives in
`*.server.ts` files (e.g. `app/lib/inquiry.server.ts`), which never reach the client bundle.

Route types are generated into `.react-router/types` and imported per-route:

```tsx
import type { Route } from './+types/home';
export const meta: Route.MetaFunction = ({ matches }) => pageMeta({ title, description, path: '/', matches });
```

`dev` and `build` run typegen automatically. If `./+types/*` imports appear missing, run
`yarn typecheck` once. Do not commit `.react-router/`.

### Meta and social previews

React Router renders **only the deepest matching route's `meta`** — nothing is merged from
root. So every page route returns its complete set from `pageMeta()` (`app/lib/meta.ts`):
title, description, Open Graph and Twitter tags (absolute URLs, using the origin from the
root `loader`), and optional `noindex`. Root's own `meta` is only seen by the 404 page.
`/work` is `noindex` while `app/content/work.ts` has no case studies.

`public/og.png` (1200×630) is rendered from an HTML template with Playwright; regenerate it if
the headline or brand changes.

### `app/root.tsx`

Owns the whole document: `<html>`/`<head>`, `<Meta />`, `<Links />`, `<Scripts />`, plus the
`Navbar` + `<main id="main">` + `Footer` shell. There is deliberately **no
`<ScrollRestoration />`** — `HorizontalPages` owns scroll position, and RR's
restoration/hash scrolling would fight it.

- Fonts are self-hosted through Fontsource CSS imports (Mona Sans with its width axis, and
  JetBrains Mono); `links` preloads the Latin Mona Sans file.
- A tiny `loader` returns the request origin for `pageMeta()`; `shouldRevalidate` keeps it from
  re-running after form submissions.
- `ErrorBoundary` renders both thrown errors and 404s. It re-renders `Navbar`/`Footer` itself
  because it replaces the default export, not the layout.

### Content (`app/content/`)

Copy and facts live in typed data files, not in JSX: `site.ts` (contact details, booking link,
social links, page order), `home.ts`, `services.ts`, `work.ts`, `about.ts`, `contact.ts`.
Values marked `TODO` or `DRAFT` are placeholders awaiting confirmation from Frilogix.

**Proof is never invented.** `proof` (logos, metrics), `caseStudies` and `team` are empty
until real content arrives. While empty, the Proof and Team panels are omitted from production
builds, Work shows a single "being written up" panel, and dev builds draw dashed placeholder
slots (`~/components/ui/Placeholder`, which renders nothing in production). Fill the arrays and
the panels appear.

`site.bookingUrl` is the Cal.com/Calendly link behind every "Book a call" button; while it is
`null` those buttons open the contact form.

### Design tokens (Tailwind v4, no config file)

There is no `tailwind.config.js`. Tailwind is wired through the `@tailwindcss/vite` plugin, and
all tokens are declared in the `@theme` block of `app/app.css`. Colours are named by **role**:

- `bg` (paper), `surface` (cards), `fg` (ink text), `fg-muted`, `line`, `line-strong`
  (control borders, ≥ 3:1), `accent` / `accent-strong` / `on-accent` (buttons, focus, active
  nav — only things you click), `accent-ink` (teal text), `tint` (strokes, never text on
  paper), `ink`, `danger`.
- **`.theme-ink`** on any element remaps those roles for a dark panel; the same utilities then
  render light-on-ink. Ink panels, the footer, and the navbar (while over ink) use it.
- Fluid type: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lede`. Each scales with
  `min(vw, vh)` so headings fit one panel on short desktop screens. `font-wide` uses Mona
  Sans' width axis for headings.
- `shadow-card`, `animate-fade-up` (CSS-only entrance), `animate-nudge-x`.

Every text pairing is checked against WCAG AA (4.5:1). Add colours to `@theme`, never inline
hex, and keep that check passing.

### Shared components (`app/components/ui/`)

`ButtonLink` / `buttonClass()` / `BookCallButton` (pill buttons; `ButtonLink` renders a
router `Link` or, for `http…` URLs, a plain `<a>`), `SectionHeader` (eyebrow + h2 + lede;
every page title is an **h2** — the hero headline is the document's only h1), `Eyebrow`,
`ArrowLink`, `Placeholder`, `icons`.

### One-page layout and horizontal scroll — read before adding sections

`app/components/HorizontalPages.tsx` is the scroll engine, built on GSAP ScrollTrigger. In
**horizontal mode** it pins the viewport and translates the track 1px sideways per 1px
scrolled, snapping to whole panels. Otherwise the pages simply stack vertically. Either way it:

- scrolls to the page the URL names on load, link clicks, and back/forward
  (`/services#intelligent-systems` targets a single panel);
- rewrites the URL with a `replace` navigation as pages scroll into view, so the navbar's
  active link and `<title>` follow along. These carry `state.fromScroll`, which the engine
  uses to avoid scrolling in response to its own navigations;
- in horizontal mode only, **pages one panel per gesture**: wheel and trackpad input
  accumulates until it passes `PAGE_THRESHOLD` (30% of a screen, capped at 200 px of wheel
  travel), then glides exactly one page and ignores the rest of that gesture, so trackpad
  momentum can't skip pages. The lock ends after 200 ms of wheel silence, or when a new swipe
  is detected inside the momentum — never within `PAGE_COOLDOWN_MS` (700 ms) of a turn, and
  only on a sustained ramp (3 rising events, ≥ 12 px, smoothed speed 2.5× its low point), so
  wobbles in real trackpad momentum can't count as a second gesture.
  Below the threshold the track leans with the gesture (up to 80 px) and springs back; on the
  first page, pushing backwards gives a small rubber-band lean. Arrow keys, PageUp/Down and Space page one at a time. Native
  scrolling (scrollbar, touch) snaps back to the starting page unless it moved ≥ 30%. Focus
  moving into an off-screen panel brings it into view. Tuning constants sit at the top of
  `HorizontalPages.tsx`.

Horizontal mode is the `hscroll:` Tailwind variant, a custom variant in `app/app.css`:
≥1280px wide, ≥700px tall, no reduced-motion preference, and JS enabled. **Its media query
must stay identical to `HORIZONTAL_QUERY` in `HorizontalPages.tsx`**: CSS does the layout,
and JS drives it.

Structure: a section is `<Page path="/x">` containing one or more `<Panel id="…">`
(`app/components/Panel.tsx`). Rules for panels in horizontal mode:

- Every panel is exactly one viewport wide (`100cqw`); snapping assumes equal widths.
- Content must **fit the viewport height**, because overflow is clipped. Verify at 1280×700,
  the smallest horizontal viewport (content budget ≈ 560 px under the 72 px navbar).
- Use `panelInner` for the standard content column. It clears the fixed navbar in both modes.
- Don't give elements inside the track a DOM `id` that a URL hash could target. Native
  fragment scrolling would scroll the clipped track. Panels use `data-panel` instead.

### Motion

`.gsap-reveal` is defined in `app/app.css` as `opacity: 0; transform: translateY(20px)`.
HorizontalPages animates every `.gsap-reveal` inside the track, horizontally (via
`containerAnimation`) or vertically depending on the mode. Just add the class — **at most one
per panel** — and sections need no `useEffect` of their own. An `app.css` rule un-hides these
elements when JS is off or the user prefers reduced motion.

The hero uses CSS `motion-safe:animate-fade-up` instead, so server-rendered content never
flashes out while JS loads; its h1 (the LCP element) is not animated.

If a section does need its own GSAP code, scope it in `gsap.context()` and `ctx.revert()` on
unmount. **Never `ScrollTrigger.getAll().forEach(t => t.kill())`**: on a one-page site that
kills the scroll engine too. `registerPlugin` must stay inside an effect, because at module
scope it runs during SSR.

Reduced motion gets the vertical layout, no reveals, no hero fade, and a still particle X.

### Particle X (`ImageParticles.tsx`)

Loads `/hero-shape.png` (640 px), reads its pixel data off an offscreen canvas (sampling every
4th pixel), and turns opaque pixels into spring-damped particles that scatter from the cursor.
It draws once and **only runs frames while the mouse stirs it or particles are settling** —
idle, on touch screens, off-screen, and under reduced motion it costs nothing per frame.
Replacing the hero art means replacing `public/hero-shape.png`; the image must have
transparency, since particles are only emitted where `alpha > 128`.

### Layout shell

The navbar is `fixed` at 72 px (`h-18`), so content must clear it: `panelInner` handles that
for panels (the hero pads itself), and panels carry `scroll-mt-20` for vertical-mode scroll
targets. The navbar turns translucent past 20px of scroll, switches to the ink theme (and
`public/logo-on-dark.png`) when an ink panel or the footer is under it, shows a page counter,
and has an accessible mobile menu (`aria-expanded`, Esc, scroll lock) and a skip link that
focuses `<main>`. After the last panel the pin releases and the `Footer` scrolls up normally.

### Contact form

`~/components/ContactForm` posts to the `/contact` route `action` through a **fetcher**, so
submitting never navigates away from the one-page site. Validation (`app/lib/inquiry.ts`) runs
on blur and on submit in the browser and again in the action. A hidden `website` field is a
honeypot. `sendInquiry()` (`app/lib/inquiry.server.ts`) emails through Resend's REST API when
`RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are set. Without them, dev logs
the inquiry to the server console, and **production returns an error that tells the visitor to
email instead** — the form never claims a message was sent when it wasn't.

### Conventions

- Import via the `~/*` alias (maps to `app/*`), e.g. `~/components/Navbar`.
- Use `Link` from `react-router` with `to=` (not `href=`).
- `verbatimModuleSyntax` is on — import types with `import type`.
- Plain `<img>` tags; there is no image optimization pipeline, so size files for their
  display size (logos are 320 px wide).

## Known incomplete work

See `LAUNCH-AUDIT.md` for the full pre-launch audit. The load-bearing items:

- **Email isn't configured.** Set the three `RESEND_*` / `CONTACT_*` env vars in production,
  or the form reports failure.
- **Real proof, case studies and team** are needed (see `app/content/`); until then Home has
  one panel and Work is a placeholder.
- Privacy and Terms pages don't exist; they're needed once the form collects data, and should
  be linked from the footer.
- `hello@frilogix.com`, "San Francisco, CA" and the social links in `app/content/site.ts` are
  unconfirmed placeholders; `bookingUrl` is unset.
- Every URL serves the same one-page document, so search engines will likely treat
  `/services`, `/about`, etc. as duplicates of `/`, despite their distinct `<title>`s. No
  canonical tags, `sitemap.xml`, `robots.txt` or JSON-LD yet.
- No analytics installed. No SVG logo or SVG favicon (needs a vector wordmark).

## Repo artifacts to ignore

`metadata.json` and `.env.local`'s `GEMINI_API_KEY` are leftovers from a Google AI Studio
scaffold; nothing references them. `assets/frilogix.png` is the full-size (1024 px) original of
the wordmark; `public/logo.png` is a 320 px copy and `public/logo-on-dark.png` is derived from
it (navy pixels recoloured to paper). `public/{next,vercel,globe,window,file}.svg` are unused.
`docs/before/` and `docs/after/` hold screenshots from before and after the 2026-10 redesign.
