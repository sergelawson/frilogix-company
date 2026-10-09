# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev         # Vite dev server + HMR (http://localhost:5173)
yarn build       # Production build -> build/client + build/server
yarn deploy      # Vercel preview deployment (vercel CLI); `yarn deploy:prod` for production
yarn typecheck   # react-router typegen && tsc --noEmit
yarn lint        # ESLint flat config (typescript-eslint + react-hooks)
```

Use **yarn** — a `yarn.lock` is committed. No test framework is configured.

## What this is

A **React Router 7 (framework mode)** / React 19 marketing and lead-generation site for
Frilogix, a software & AI engineering company. `spec.md` is the authoritative PRD — it defines
the page inventory, per-page content requirements, design direction ("Engineered Swiss", §11),
and SEO keywords. Read it before adding or restructuring pages.

It is a **one-page site**: Home, Services, Work, Company and Contact are sections of a single
document, in that order. On desktop they sit side by side and vertical scrolling moves them
horizontally; see "One-page layout" below. Each still has its own URL (`/`, `/services`,
`/work`, `/company`, `/contact`).

`/privacy` (`routes/privacy.tsx`) is a normal standalone page outside the one-page scroll:
it isn't in `pages`, so it isn't in the horizontal track or the navbar, and it is
linked from the footer. Its copy is `app/content/privacy.ts`.

Three routes only redirect (301), preserving inbound links: `/ai-engineering` →
`/services#intelligent-systems` (the AI page was merged into Services), `/case-studies` →
`/work` and `/about` → `/company` (renamed). Don't re-add any of them to the nav.

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
`app/content/site.ts`; the navbar and footer read it, so a new page goes there,
in `routes.ts`, and in `site.tsx`.

SSR is on (`react-router.config.ts`), so modules render on the server *and* hydrate on the
client — the same module can export `meta` and use `useEffect`/`useRef`. There is no
client/server component split and no `"use client"` directive. Server-only code lives in
`*.server.ts` files (e.g. `app/lib/inquiry.server.ts`), which never reach the client bundle.

### Hosting and caching (Vercel)

Deployed to **Vercel** with the `@vercel/react-router` preset, through the `vercel` CLI
(`.vercelignore` keeps `.env*` out of uploads). Content only changes on deploy, so the five
pages are **prerendered** to static HTML at build time (`prerender` in
`react-router.config.ts`, derived from `pages`). Vercel's CDN serves them until the next
deploy; browsers revalidate (`max-age=0, must-revalidate`) so a deploy shows at once, and
hashed `/assets/*` are `immutable` for a year. Only the `/contact` action, the redirect routes
and 404s run as a server function. Because pages are built without a request, absolute URLs
(canonical, Open Graph) use the fixed `site.url`, not the request origin.

`gsap` is bundled into the server build (`ssr.noExternal` in `vite.config.ts`): its
`gsap/ScrollTrigger` entry can't be imported by name from plain Node ESM and crashed the
function on Vercel. Check new client-only packages the same way: `node -e
"import('./build/server/<dir>/index.js')"` after `yarn build`.

Production env vars (set in the Vercel dashboard): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
`SMTP_PASS`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `TURNSTILE_SECRET`,
`TURNSTILE_HOSTNAMES` (`frilogix.com,www.frilogix.com`, never localhost).

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
title, description, canonical link, Open Graph and Twitter tags (absolute URLs from
`site.url`), optional `noindex`, and the structured data. Root's own `meta` is only seen by
the 404 page.

**Structured data** (`app/lib/structured-data.ts`, JSON-LD on every page): an `Organization`
(Frilogix LLC; address El Paso, TX, US; `areaServed: "Worldwide"`, because clients can be
anywhere; the five services as offers) and a `WebSite`. It's built from `site.ts` and
`services.ts`, so it follows the copy. Facts only: no ratings, reviews or client claims, and
never the email. Social profiles join it as `sameAs` once they're in `site.social`.
`/work` is `noindex` only if `app/content/work.ts` has no products.

`public/og.png` (1200×630) is rendered from an HTML template with Playwright; regenerate it if
the headline or brand changes.

### `app/root.tsx`

Owns the whole document: `<html>`/`<head>`, `<Meta />`, `<Links />`, `<Scripts />`, plus the
`Navbar` + `<main id="main">` + `Footer` shell. There is deliberately **no
`<ScrollRestoration />`** — `HorizontalPages` owns scroll position, and RR's
restoration/hash scrolling would fight it.

- Fonts are self-hosted through Fontsource CSS imports (Mona Sans with its width axis, and
  JetBrains Mono); `links` preloads the Latin Mona Sans file.
- `ErrorBoundary` renders both thrown errors and 404s. It re-renders `Navbar`/`Footer` itself
  because it replaces the default export, not the layout.

### Content (`app/content/`)

Copy and facts live in typed data files, not in JSX: `site.ts` (contact details, booking link,
social links, page order), `home.ts`, `services.ts`, `work.ts`, `company.ts`, `contact.ts`.
Values marked `TODO` or `DRAFT` are placeholders awaiting confirmation from Frilogix.

**Proof is never invented.** Frilogix is a new company with no client work to show yet, so its
proof is its own products, `products` in `work.ts` (Uitiful, Vantuu). Home's second panel
(`/#products`) introduces them with screenshots and links to their panels; Work is just one
panel per product (`/work#uitiful`), with no intro panel of its own. There are no client logos, metrics or case studies on the site, and
copy must not imply past client projects. **Frilogix has a solo founder who stays unnamed**:
the company (Frilogix LLC, El Paso, Texas) is the public face. There is no Team section, and
copy must not name people or imply a staff (no "our engineers", "our team of…"); "we" for the
company is fine. Missing content is marked in dev builds with dashed slots
(`~/components/ui/Placeholder`, which renders nothing in production).

Product copy comes from the
product's own site or from Frilogix; `public/work/*.jpg` are screenshots of each product
(Vantuu's from its private staging site, which must never be linked). A product without an
`image` gets a full-width text panel in production.

Each product panel opens with the product's own logo (`public/work/*-logo.svg`, cropped to the
artwork). Uitiful's is drawn for dark backgrounds and Vantuu's for light, so a product's `ink`
flag, not its position, decides which panel is the page's one ink panel. Uitiful's wordmark is
outlined from Sora Bold, its brand font, so it renders without that font loaded.

`site.bookingUrl` is the Cal.com/Calendly link behind every "Book a call" button; while it is
`null` those buttons open the contact form.

### Design tokens (Tailwind v4, no config file)

There is no `tailwind.config.js`. Tailwind is wired through the `@tailwindcss/vite` plugin, and
all tokens are declared in the `@theme` block of `app/app.css`. Colours are named by **role**:

- `bg` (paper), `surface` (form inputs), `fg` (ink text), `fg-muted`, `line`, `line-strong`
  (control borders, ≥ 3:1), `accent` / `accent-strong` / `on-accent` (buttons, focus, active
  nav — only things you click), `accent-ink` (teal text), `tint` (strokes, never text on
  paper), `ink`, `danger`.
- **`.theme-ink`** on any element remaps those roles for a dark panel; the same utilities then
  render light-on-ink. Ink panels, the footer, and the navbar (while over ink) use it.
- Fluid type: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lede`. Each scales with
  `min(vw, vh)` so headings fit one panel on short desktop screens. `font-wide` uses Mona
  Sans' width axis for headings.
- `animate-fade-up` (CSS-only entrance), `animate-nudge-x`.

**Swiss, not cards.** Structure comes from hairline rules (`border-t border-line-strong` above
a column or row), mono index numbers and type size: no rounded corners, no card backgrounds,
no shadows, no pills. Buttons and inputs are square.

Every text pairing is checked against WCAG AA (4.5:1). Add colours to `@theme`, never inline
hex, and keep that check passing.

### Shared components (`app/components/ui/`)

`ButtonLink` / `buttonClass()` / `BookCallButton` (square buttons; `ButtonLink` renders a
router `Link` or, for `http…` URLs, a plain `<a>`), `SectionHeader` (eyebrow + h2 + lede, and an
optional `aside` illustration;
every page title is an **h2** — the hero headline is the document's only h1), `Eyebrow`,
`ArrowLink`, `Placeholder`, `icons`.

### One-page layout and horizontal scroll — read before adding sections

`app/components/HorizontalPages.tsx` is the scroll engine, built on GSAP ScrollTrigger. In
**horizontal mode** it pins the viewport and translates the track 1px sideways per 1px
scrolled, snapping to whole panels. Otherwise the pages simply stack vertically. Either way it:

- scrolls to the page the URL names on load, link clicks, and back/forward
  (`/services#intelligent-systems` targets a single panel). On a **deep link** an inline
  script in root.tsx marks `<html>` with `.deep-link` before first paint, which hides the
  track (`[data-track]` in `app.css`) so the home page never flashes first; the engine removes
  the mark once it has moved, and the page fades up into place (CSS shows it after 2.5s
  anyway if JS is slow or broken);
- rewrites the URL with a `replace` navigation as pages scroll into view, so the navbar's
  active link and `<title>` follow along. These carry `state.fromScroll`, which the engine
  uses to avoid scrolling in response to its own navigations. They're made a frame after a
  page toggles, and only while the engine is still set up: tearing it down (a link to
  `/privacy`, crossing the breakpoint, React's dev double mount) toggles every trigger one last
  time, which used to rewrite the URL to `/`. Standalone pages (`/privacy`) open at the top
  (root.tsx);
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

Reduced motion gets the vertical layout, no reveals, no hero fade, a still particle X, 3D
drawings in their end state, and no heartbeat.

### Particle X (`ImageParticles.tsx`)

Loads `/hero-shape.png` (640 px), reads its pixel data off an offscreen canvas (sampling every
4th pixel), and turns opaque pixels into spring-damped particles that scatter from the cursor.
It shows only from `lg` up, beside the headline; below that (phones, tablets) its column is
hidden and nothing is built. It draws once and **only runs frames while the mouse stirs it or
particles are settling** — idle, on touch screens, off-screen, and under reduced motion it
costs nothing per frame.
Replacing the hero art means replacing `public/hero-shape.png`; the image must have
transparency, since particles are only emitted where `alpha > 128`, and near-white pixels
(every channel above 200) are skipped too: the X is white in the image, so it stays a cut-out.

### Illustrations (`app/components/art/`)

Text-only panels carry one explanatory drawing each, in one house style: **matte ink for
software, frosted glass for AI**, soft shadows, mono callouts, one teal "signal". The test for
any drawing: **if it were deleted, would a visitor understand less?** If not, it doesn't ship.
(Services had an exploded 3D stack of layers; it failed that test and was removed. Its
`scenes/stack.ts` is no longer used.)

| Panel | Drawing | Scene |
|---|---|---|
| AI engineering (ink) | a bridge over the prototype→production gap; glass segments rise, a request crosses | `scenes/bridge.ts` |
| Company | the X as four arms gliding together, read as a two-by-two: ink on the left (software: apps, backend), glass on the right (AI: agents, models); on top what people use, underneath what runs it; a key under each half | `scenes/xMark.ts` |
| The plan (ink) | experiments stream into a glass block (our products); three survivors land on yours | `scenes/survivors.ts` |

- `Art3D` mounts a scene and its callouts (`side`: left/right edge, or a short leader
  above/below), plus an optional `legend` (a key saying what matte and glass stand for). **three.js lives only in the lazy chunk shared by `runtime.ts` and the scenes**
  (~145 kB gzip), imported once a drawing is within a screen of the viewport. Never import
  `three` from anything that reaches the main bundle or the server. Pass `load` and
  `callouts` as module-level constants: they're effect dependencies.
- A scene is `defineScene(background, build)`: build objects on `kit.root` from the kit's
  materials and helpers, return a `SceneSpec` (tilt, frame to fit, callout anchors,
  `update(elapsed)`). The entrance plays the first time the drawing is 80% in view (as a page
  turn lands); like the particles, a scene **renders only while something moves** (entrance,
  highlight, tilt while the mouse is over it) **and only while on screen**.
- **Performance rules** (each was a measured freeze; see the comment at the top of `runtime.ts`):
  - **One WebGL context for every drawing** (the engine): it renders into an `OffscreenCanvas`
    and hands frames to each drawing's `bitmaprenderer` canvas (`transferToImageBitmap`, no
    copy). One context per drawing meant every drawing paid ~0.5s of setup and compiling.
    Don't `drawImage` a WebGL canvas: it waits for the GPU (~2.5ms a frame).
  - **Shaders compile ahead, off the main thread** (`compileAsync`), including the variants
    three.js otherwise compiles mid-frame: the glass's back faces and everything seen through
    glass (render target, no tone mapping). The engine's warm-up scene holds one of every kit
    material; **a new material type, or a new map on one, must be added there too**, or its
    first frame freezes the page while it compiles. Lights must match `addLights`.
  - Scenes are imported and built in idle time (`requestIdleCallback`), never mid page-turn.
  - Rendering at ≤1.5× pixel ratio, glass transmission at half resolution.
- Hovering or focusing an AI pipeline step `highlight`s its segment (it lifts and glows).
- **Services** has no 3D drawing: each column carries a pictogram of what it delivers
  (`ServiceGlyph`, keyed by service `id`; a new service needs one there), 72×40px at 1:1 so
  hairlines stay on whole pixels: white surfaces with an offset shadow, one teal signal. Each
  loops a few seconds of the service at work (SMIL, no JS per frame), paused off screen; under
  reduced motion it holds a finished frame (`still`). Motion must show the service, not decorate.
- Canvases are opaque, painted the panel's colour (`PAPER` / `INK` in `runtime.ts`), because
  glass can only show what's rendered behind it. Keep them in sync with the `.theme-ink` and
  `--color-bg` values. Glass on ink panels is `kit.glowGlass()`.
- Shadows are blurred silhouettes on planes, not shadow maps (cheaper, and VSM streaked the paper).
- **Height:** Services and AI are already full at 700px, so `SectionHeader` puts their drawing
  in an `.art-slot` above the lede that takes only the height left over (the header grows into
  spare space, `max-h-[30rem]`), and a container query hides it below 11rem; it then never loads.
  Company and The plan have room, so their drawings have fixed heights, checked at 1280×700.
- Without JS (`.needs-js`) or WebGL a drawing isn't shown; under reduced motion it renders its
  end state and doesn't tilt.

Smaller pieces, CSS/SVG only: `EvidenceRule` (How we work: each step's rule gets more solid, the
last one carries a live heartbeat, paused off-screen), `ui/XGlyph` (the X's four arms flat:
assembling on the contact form's "sent" state, and as a hairline outline cropped by the footer),
the hero particles flying in on first load, and product screenshots on Home panning down on hover.

### Layout shell

The navbar is `fixed` at 72 px (`h-18`), so content must clear it: `panelInner` handles that
for panels (the hero pads itself), and panels carry `scroll-mt-20` for vertical-mode scroll
targets. The navbar turns translucent past 20px of scroll, switches to the ink theme (and
`public/logo-on-dark.png`) when an ink panel or the footer is under it, links every page but
Contact (Home, Services, Work, Company; "Book a call" sits beside them),
and has an accessible mobile menu (`aria-expanded`, Esc, scroll lock) and a skip link that
focuses `<main>`. After the last panel the pin releases and the `Footer` scrolls up normally.

### Contact form

`~/components/ContactForm` posts to the `/contact` route `action` through a **fetcher**, so
submitting never navigates away from the one-page site. Validation (`app/lib/inquiry.ts`) runs
on blur and on submit in the browser and again in the action. A hidden `website` field is a
honeypot, and Cloudflare Turnstile (`~/components/TurnstileWidget`, checked in
`app/lib/turnstile.server.ts` before sending) stops bots; the widget is `frilogix-contact`,
its site key is in `site.ts`. `sendInquiry()` (`app/lib/inquiry.server.ts`) emails over SMTP
with Nodemailer when the `SMTP_*` and `CONTACT_*` env vars are set. Without them, dev logs
the inquiry to the server console, and **production returns an error that tells the visitor to
email instead** — the form never claims a message was sent when it wasn't.

### Cookie consent and analytics

Google Analytics 4 (`site.gaMeasurementId`) follows **two regimes**, decided in the browser
from the device's time zone (`analyticsNeedsOptIn` in `~/lib/consent`; any `Europe/*` zone
plus a few EEA zones elsewhere):

- **Europe (EEA, UK, Switzerland): opt-in**, as EU law and Google's EU consent policy require.
  The notice asks first, with two identical buttons, "Reject" and "Accept"; until "Accept" no
  Google script loads and no cookie is set; a "yes" expires after 6 months.
- **Everywhere else: opt-out.** GA runs from the first page; the notice says so, with an
  "Opt out" link and "OK".

Both are the same small, quiet notice centred at the bottom (`~/components/CookieConsent`,
rendered in root `Layout`). It **doesn't name the provider**; the privacy policy does, as the law requires. "Cookie settings" in the footer (and
on /privacy) reopens it; opting out deletes the `_ga` cookies, and **an opt-out is kept for
good** (never expired, never reset by a version bump). The choice is in localStorage; a "yes"
resets when `POLICY_VERSION` changes: **bump it whenever cookies or analytics change**, and
update `app/content/privacy.ts` (processing activities, cookie table, `lastUpdated`) to match.
GA loads only on the production hostnames listed in `~/components/GoogleAnalytics`. Never add
a tracker, embed or third-party script without covering it in this consent flow (or
documenting why it's strictly necessary) and listing it in the privacy policy.

**The contact email never ships as text.** It is drawn as SVG outlines by
`~/components/ui/EmailAddress` from `app/content/email-glyphs.ts`, which
`scripts/email-svg.py <address>` generates (Mona Sans 500). Don't add the address to any
source file, `mailto:` link, meta tag or doc; to change it, rerun the script.

### Conventions

- Import via the `~/*` alias (maps to `app/*`), e.g. `~/components/Navbar`.
- Use `Link` from `react-router` with `to=` (not `href=`).
- `verbatimModuleSyntax` is on — import types with `import type`.
- Plain `<img>` tags; there is no image optimization pipeline, so size files for their
  display size (logos are 320 px wide).

## Known incomplete work

See `LAUNCH-AUDIT.md` for the full pre-launch audit. The load-bearing items:

- **Email isn't configured.** Set the `SMTP_*` / `CONTACT_*` and `TURNSTILE_*` env vars in
  Vercel, or the form reports failure.
- Vantuu's `url` stays `null` until vantuu.com is live.
- Terms page doesn't exist. The privacy policy has DRAFT points to confirm (retention
  period, email provider) and should get a legal review.
- The contact mailbox is unconfirmed (check it receives mail), and the social links in
  `app/content/site.ts` are placeholders; `bookingUrl` is unset.
- Every URL serves the same one-page document, so search engines will likely treat
  `/services`, `/company`, etc. as near-duplicates of `/`; each now has its own canonical tag.
  No `sitemap.xml` or `robots.txt` yet (JSON-LD is in place: `app/lib/structured-data.ts`).
- No SVG logo or SVG favicon (needs a vector wordmark). The favicon set (`favicon.ico`,
  `icon-192/512.png`, `apple-touch-icon.png`) is rendered from `public/hero-shape.png`.

## Repo artifacts to ignore

`metadata.json` and `.env.local`'s `GEMINI_API_KEY` are leftovers from a Google AI Studio
scaffold; nothing references them. `assets/frilogix.png` is the full-size (1024 px) original of
the wordmark; `public/logo.png` is a 320 px copy and `public/logo-on-dark.png` is derived from
it (navy pixels recoloured to paper). `public/{next,vercel,globe,window,file}.svg` are unused.
`docs/before/` and `docs/after/` hold screenshots from before and after the 2026-10 redesign.
