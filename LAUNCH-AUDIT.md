# Frilogix Website — Pre-Launch Audit & Production Readiness Plan

**Audit date:** 2026-07-29
**Audited build:** `main` @ `6afcdff` — Next.js 16.1.3, React 19.2.3, Tailwind v4
**Scope:** full codebase (`app/`, `components/`, configs), measured against `spec.md` (PRD v1.0)

> **Update (post-migration):** the site has since been migrated to React Router 7 framework
> mode. That closed **P0 #3** (duplicate titles), part of **P0 #4**, the form-label half of
> **P1 #12**, the JS-disabled risk in **P1 #14**, and the lint + custom-404 items in **P2**.
> Resolved items are struck through and marked ✅ below. Everything else still stands.

> **Update (redesign, 2026-10-01):** the site is now one page with horizontal scrolling on
> desktop and the "Engineered Swiss" design (`spec.md` §11). Measured on the production build:
> Lighthouse desktop 100 / 100 / 100 / 100 and mobile 90–91 performance, 100 accessibility,
> best practices and SEO; zero axe violations. Beyond the strike-throughs below, that change:
>
> - **P0 #1** — the form now posts to a real `action` with validation and a honeypot, and emails
>   via Resend. ⚠️ It needs `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` in
>   production; without them it tells visitors to email instead. No rate limiting yet.
> - **P0 #2** — About now has a CTA and internal links.
> - **P0 #4** — Open Graph + Twitter tags and an OG image on every page. Canonicals, sitemap,
>   robots.txt and JSON-LD are still missing.
> - **P0 #5** — dead `#` links removed: social links render only once URLs are set in
>   `app/content/site.ts`. Privacy/Terms pages are still needed.
> - **P1 #9** — "Sustainable Engineering" removed.
> - **P1 #12** — mobile menu has `aria-expanded`/Esc/focus handling, a skip link exists, the
>   canvas is `aria-hidden`, and every text pairing passes AA.
> - **P1 #13** — reduced motion gets a static vertical layout.
> - **P2** — the connected-dot canvas is gone; the particle X only animates while the mouse
>   is on it. The picsum stock image is gone.
>
> Still open: P0 #6 (business identity), P1 #7 (analytics), P1 #8 (proof — the Proof, Work and
> Team panels are built and wait for real content), P1 #10–11 content.

---

## Verdict

**Not launch-ready.**

The design is genuinely strong — Swiss layout, coherent token system, distinctive particle work. But this is a **lead-generation site that currently cannot generate a lead**, and an **SEO site with one title tag across six pages**. Both are hard blockers, and both are fixable in about a week.

Priority key: **P0** = cannot launch · **P1** = launch week · **P2** = fast-follow.

---

## 🔴 P0 — Launch Blockers

### 1. The contact form silently destroys every lead

`app/contact/page.tsx:8-14` — submission is a 1.5-second `setTimeout`. It then shows **"Inquiry Sent — we will review your request and respond within 24 hours."** No API route, no email, no database, no CRM. The inputs aren't even `name`d or state-bound, so the data never leaves the DOM.

A prospect fills it in, gets told you'll reply in 24 hours, and you never hear from them. That's worse than having no form — it burns the lead *and* your credibility. The PRD names form submissions as KPI #1.

**Fix:** wire a real handler (Server Action or route handler) → transactional email (Resend) + a copy to a CRM/sheet. Add honeypot + rate limit. **~3h**

### 2. Three of six pages have no call-to-action at all — ⚠️ PARTIALLY RESOLVED

~~`/services`, `/ai-engineering`, and `/about` don't import `Link`. Zero CTAs, zero internal links. On Services, the arrow icons in each card are decorative `<div>`s — they look clickable and go nowhere.~~

These are the highest-intent pages. A CTO reads them, is convinced, and has nowhere to go but the nav. This is the single biggest conversion leak on the site, and it's also an internal-linking hole that hurts SEO.

✅ **`/services` fixed** during the AI Engineering merge: the decorative arrows are now real `Link`s (three to `/contact`, one to the in-page AI section), plus a closing "Have a project in mind?" CTA. `/ai-engineering` no longer exists as a page — it redirects into `/services`.

❌ **`/about` still has zero CTAs and zero outbound links.** **~30min**

### 3. ~~Every page shares one title and one description~~ ✅ RESOLVED

~~Only `app/layout.tsx` exports `metadata`, because all six pages are `"use client"`, and Next.js forbids metadata exports from client components. Google sees six pages titled *"Frilogix | Intelligent Software & AI Engineering"* with identical descriptions.~~

**Fixed by the React Router 7 migration.** Route modules render on both server and client, so each one exports its own `meta` alongside its `useEffect`. All six routes now serve unique, keyword-bearing titles and descriptions, verified in SSR output:

| Route | `<title>` |
|---|---|
| `/` | Frilogix \| Software & AI Engineering Company |
| `/services` | Services — Web, Mobile & AI Engineering \| Frilogix |
| `/about` | About Frilogix — Software & AI Engineering Team |
| `/case-studies` | Case Studies \| Frilogix |
| `/contact` | Contact Frilogix — Start Your Project |

### 4. No SEO infrastructure whatsoever — ⚠️ PARTIALLY RESOLVED

Still missing: `metadataBase` / canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph images, Twitter cards, JSON-LD.

The OG gap has immediate commercial cost: **when anyone shares frilogix.com in LinkedIn, Slack, or WhatsApp — the primary way B2B services get referred — the preview renders blank.** **~3h**

✅ Done: per-route titles and descriptions (see #3), and `/case-studies` now emits `noindex, follow` so the thin placeholder stays out of the index.

### 5. Dead legal and social links

Footer Privacy, Terms, LinkedIn, Twitter, GitHub are all `href="#"` (`components/Footer.tsx:31-44`).

The site collects name, email, company, and project details. A privacy policy is a **legal requirement** under GDPR/CCPA the moment that form works — not a nice-to-have. It's also mandatory for Google Ads and most enterprise procurement reviews. Dead social links on a footer read as abandoned. **~2h**

### 6. Unverified business identity

`hello@frilogix.com` and "San Francisco, CA" (`app/contact/page.tsx:30-34`) are placeholders. Confirm the mailbox actually receives mail, and either commit to the address or drop it. No phone, no company entity, no registration number.

---

## 🟠 P1 — Launch Week

### 7. You cannot measure a single one of your own KPIs

No analytics anywhere. The PRD tracks conversion rate, session duration, bounce rate, and leads/month. Today that's flying blind from day one.

Add Vercel Analytics + Speed Insights (10 minutes) and/or GA4/Plausible, plus a form-submit conversion event.

### 8. Zero proof — the biggest marketing gap on the site

For a B2B engineering firm, **proof is the conversion driver**, and there is none:

- No case studies (nav actively promotes an empty "Coming Soon" page)
- No client logos
- No testimonials
- No outcome metrics anywhere ("cut inference costs 40%", "shipped in 6 weeks")
- No named humans — About claims *"a remote-first team of elite engineers, designers, and AI researchers working from three continents"* and shows not one face or name

A CTO evaluating a vendor asks *"who are these people and what have they shipped?"* Today the site answers neither.

If real case studies aren't ready, ship **two anonymized problem → approach → outcome write-ups** ("A Series-A fintech came to us with…"). That's enough to convert.

### 9. The positioning contradicts itself

The homepage's second section is **"Sustainable Engineering — we treat code as a resource… smaller carbon footprint."** Nothing else on the site mentions sustainability. Services doesn't. AI Engineering doesn't. About doesn't.

This traces back to `spec.md:272`, whose design brief describes *"laboratory glassware and recycled plastic flakes"* — a brief written for a sustainability company that leaked into the copy. It's off-strategy for an AI engineering firm and it dilutes the actual differentiator.

Either commit to green-software as a real position (then carry it through every page) or replace that section with proof, process, or outcomes.

**Recommendation: replace it.** The buyer isn't purchasing carbon reduction; they're purchasing shipping velocity and AI capability.

### 10. Missing content the PRD itself requires

| PRD section | Requirement | Status |
|---|---|---|
| §7.2 Services | "example use cases" per service | ❌ Absent — each service gets three words and a bullet list |
| §7.3 AI Engineering | chatbots, copilots, knowledge systems, internal automation | ❌ None present |
| §7.4 About | optional founder section | ❌ Absent — and it's exactly what the trust gap needs |

### 11. Missing content the PRD doesn't require but buyers expect

- **How we work** — engagement model, timeline, what a first project looks like. The #1 unasked question for services buyers.
- **Pricing signal** — not a price list; a range or model ("projects typically start at $X" / "dedicated team from $Y/mo"). Without it you'll field unqualified inquiries all day.
- **FAQ** — converts, and feeds Google featured snippets and AI search answers.
- **Book-a-call** (Cal.com/Calendly) — B2B services convert materially better on a booked call than a contact form. Add it as the primary CTA and keep the form as fallback.

### 12. Accessibility failures

- ~~**Form labels aren't associated with inputs**~~ ✅ **RESOLVED** — all four fields now carry matching `htmlFor`/`id`, plus `name` and `autoComplete` (which also preps them for the real submit handler).
- **Mobile menu button** has no `aria-label` and no `aria-expanded` (`components/Navbar.tsx:73`), plus `focus:outline-none` with no replacement ring.
- **Contrast:** `brand-gray` on `brand-light` measures **4.42:1** — just under the 4.5:1 AA threshold for body text. `text-brand-gray/50` (tech stack) and `text-secondary/80` on `bg-primary` (footer, ~2.7:1) fail clearly.
- **Canvases** aren't `aria-hidden`, so they're exposed to assistive tech as meaningless nodes.
- **No skip-to-content link.**

The PRD commits to WCAG basics, and Services literally advertises "WCAG Compliant" as a selling point. Shipping an inaccessible site while selling accessibility is a credibility risk.

### 13. No `prefers-reduced-motion` handling

Nothing in `app/` or `components/` checks it. The PRD explicitly requires it (§11). Between GSAP reveals, mouse parallax, and two continuous canvas animations, this site is genuinely uncomfortable for motion-sensitive users.

### 14. Content is invisible if JavaScript fails — ✅ MITIGATED

`.gsap-reveal` is `opacity: 0` in CSS (`app/app.css`). If GSAP fails to load or errors, most of the site's body copy never becomes visible.

A `@media (scripting: none)` rule in `app.css` now un-hides these elements when JS is disabled, and SSR means the copy is in the served HTML either way. A GSAP *runtime* error (as opposed to JS being off) would still leave content hidden — animating from a visible base state remains the fully robust fix.

---

## 🟡 P2 — Fast Follow

**Performance.** `Particles.tsx` runs an O(n²) neighbor check — 100 particles = ~10,000 distance calculations *per frame*, forever, never pausing off-screen or on hidden tabs. Measurable battery and INP cost on mobile. Add an IntersectionObserver pause and a spatial grid or lower cap. `hero-shape.png` is 221KB for a decorative element.

**Repo hygiene.** `assets/frilogix.png` is a byte-identical duplicate of `public/logo.png`. Leftover default SVGs (`next.svg`, `vercel.svg`, `globe.svg`, `window.svg`, `file.svg`) are unused. `metadata.json` and `GEMINI_API_KEY` in `.env.local` are Google AI Studio scaffold leftovers. ✅ `README.md` has been rewritten for the current stack.

**~~Lint is failing.~~** ✅ **RESOLVED** — the 4 issues in `ImageParticles.tsx` are fixed (`prefer-const` ×3, plus removal of the unused `dimensions` state, which was also triggering a needless React re-render on every resize). `yarn lint`, `yarn typecheck`, and `yarn build` all pass clean.

**Other.** Stock `picsum.photos` placeholder on About (`app/routes/about.tsx`) — a random photo from a placeholder service, in production. Weak alt text ("Frilogix", "Clean Architecture"). No security headers. ✅ Custom 404 now handled by the root `ErrorBoundary`. ✅ `/case-studies` now emits `noindex, follow`.

---

## 📋 Recommended Sequence — 5 working days

| Day | Focus | Ships |
|---|---|---|
| **1** | Make it functional | Contact form → Resend + CRM, honeypot, validation, CTAs on all pages, service cards linked |
| **2** | SEO foundation | Split client/server pages, per-page metadata w/ target keywords, sitemap, robots, canonicals, OG images, Organization + Service JSON-LD |
| **3** | Credibility | Privacy + Terms, 2 anonymized case studies, founder/team section, real social links, service use cases, FAQ |
| **4** | Quality | Form label a11y, aria on menu, contrast fixes, skip link, `prefers-reduced-motion`, particle perf pause, lint clean, replace placeholder image |
| **5** | Launch ops | Analytics + conversion events, Cal.com booking, domain + DNS, Search Console + sitemap submit, Bing, LinkedIn company page, staging QA on real devices |

**Fastest honest path to launch:** Day 1 + Day 2 + Privacy Policy gets you live in **~2 days** without misleading anyone or torching SEO. Days 3–5 then run against live traffic.

---

## The one thing I'd change about the message

The homepage H1 is *"Engineering Intelligent Futures."* It's beautiful and it says nothing a buyer can search for or evaluate. The actual value proposition — already written in `spec.md:81` — is sharper:

> **Web, mobile, and AI systems that ship.**
> React, Go, and LLM engineering for startups and scale-ups.

That version carries the keywords, names the ICP, and makes a promise. Keep "Engineering Intelligent Futures" as the tagline; lead with the claim.

---

## Appendix — SEO checklist

| Item | Status |
|---|---|
| Unique `<title>` per page | ✅ All six unique (verified in SSR output) |
| Unique meta description per page | ✅ All six unique |
| Target keywords in titles | ✅ React, Go, mobile, LLM/RAG all covered |
| One `<h1>` per page | ✅ Correct on all six |
| Keyword-bearing H1s | ⚠️ Home H1 has zero keywords; Services H1 is just "Services" |
| `metadataBase` / canonical URLs | ❌ Missing |
| `sitemap.xml` | ❌ Missing |
| `robots.txt` | ❌ Missing |
| Open Graph tags + image | ❌ Missing — link previews render blank |
| Twitter card | ❌ Missing |
| JSON-LD (Organization, Service, FAQPage, Breadcrumb) | ❌ Missing |
| Internal linking | ❌ 3 of 6 pages have zero outbound links |
| Image alt text | ⚠️ Present but weak |
| Thin content control | ✅ `/case-studies` sends `noindex, follow` |
| Custom 404 | ✅ Root `ErrorBoundary`, returns real 404 status |
| Analytics / Search Console | ❌ Not installed |
| `lang` attribute | ✅ `lang="en"` set |
| Server rendering | ✅ SSR on for all six routes; full copy in served HTML |
