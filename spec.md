# Product Requirements Document (PRD)

## Product Name

Frilogix Company Website

## Product Type

Marketing & Lead-Generation Website

## Company

Frilogix

## Version

v1.0

## Author

Frilogix Product Team

## Last Updated

2026-10-01 (site structure, tech stack and design direction; earlier: 2026-01-18)

---

## 1. Purpose & Vision

The Frilogix website is the official online presence of the company. Its primary purpose is to:

* Clearly communicate Frilogix’s value proposition
* Present services and technical expertise
* Establish credibility and trust
* Generate qualified leads
* Serve as a foundation for future content (blog, case studies, careers)

**Vision:**
Create a clean, modern, high-performance website that reflects Frilogix’s engineering excellence and AI-first mindset.

---

## 2. Goals & Success Metrics

### Business Goals

* Attract startups, SMEs, and enterprise clients
* Convert visitors into leads
* Position Frilogix as a modern software & AI engineering company

### Success Metrics (KPIs)

* Conversion rate (contact form submissions)
* Average session duration
* Bounce rate
* Number of inbound leads per month
* Page load performance (Core Web Vitals)

---

## 3. Target Audience

### Primary Users

* Startup founders
* CTOs / Technical leads
* Product managers
* Business owners seeking digital solutions

### Secondary Users

* Potential partners
* Developers interested in Frilogix
* Recruiters (future use)

---

## 4. Value Proposition

**Frilogix builds intelligent, scalable web, mobile, and AI-powered applications using modern technologies such as React, Node.js, Go, React Native, and LLM-based systems.**

---

## 5. Scope

### In Scope (v1)

* Marketing pages
* Service descriptions
* Contact & lead capture
* Company positioning

### Out of Scope (v1)

* Client portal
* Authentication system
* Payment processing
* Full blog CMS (can be added later)

---

## 6. Site Structure (Information Architecture)

### Pages

The site is a **single page**. Each page below is a section of one document with its own URL
(`/`, `/services`, `/work`, `/about`, `/contact`); on desktop the sections sit side by side and
vertical scrolling moves them horizontally. The navigation order is the scroll order:

1. Home
2. Services (includes AI Engineering — see 7.3)
3. Work (formerly "Case Studies"; `/case-studies` redirects here)
4. About Us
5. Contact
6. Privacy Policy & Legal (to be written; not linked until they exist)

---

## 7. Page Requirements

### 7.1 Home Page

**Objective:** Instantly communicate who Frilogix is and what it does.

**Sections:**

* Hero section

  * Headline (value proposition)
  * Short subheading
  * Primary CTA: "Contact Us" or "Start a Project"
* Services overview
* AI focus highlight
* Why Frilogix (key differentiators)
* Tech stack logos
* Call to action

---

### 7.2 Services Page

**Objective:** Clearly explain Frilogix’s core offerings.

**Services:**

* Frontend Development (React)
* Backend Development (Node.js / Go)
* Mobile App Development (React Native)
* AI Application Development

**Each service section includes:**

* Description
* Key benefits
* Example use cases

---

### 7.3 AI Engineering Page

> Merged into Services as its "AI in production" panel; `/ai-engineering` redirects to
> `/services#intelligent-systems`. The content requirements below still apply to that panel.

**Objective:** Position Frilogix as an advanced AI engineering company.

**Content:**

* AI philosophy & approach
* LLM-based systems
* Retrieval-Augmented Generation (RAG) systems
* Multi-agent systems (collaborative AI agents)
* LangChain workflows
* AI agents & automation
* Use cases:

  * Chatbots & virtual assistants
  * AI copilots
  * Knowledge-based systems
  * Internal automation tools

---

### 7.4 About Us Page

**Objective:** Build trust and credibility.

**Content:**

* Company mission & vision
* Company story (why Frilogix exists)
* Engineering principles
* Optional: Founder section

---

### 7.5 Work Page (formerly Case Studies, Phase 2)

**Objective:** Demonstrate real-world impact.

**Each case study:** client type (anonymised is fine), problem, approach, stack, and an outcome
with a number. One case study per panel.

**Initial State:**

* A "case studies are being written up" panel, kept out of the search index until real case
  studies exist

---

### 7.6 Contact Page

**Objective:** Capture qualified leads.

**Features:**

* Contact form

  * Name
  * Email
  * Company (optional)
  * Project description
* Email contact option
* Success confirmation message

---

## 8. Functional Requirements

* Responsive design (mobile-first)
* Fast load time (<2s)
* SEO-friendly structure
* Accessible (WCAG basics)
* Contact form submission handling

---

## 9. Non-Functional Requirements

* Performance optimized (Lighthouse score >90)
* Secure (HTTPS, basic spam protection)
* Scalable architecture
* Easy to maintain and extend

---

## 10. Technical Stack (Implemented)

### Frontend

* **Framework:** React Router 7 (framework mode, SSR)
* **React:** React 19
* **Styling:** Tailwind CSS v4
* **Animations:** GSAP + ScrollTrigger (npm package)
* **Fonts:** Mona Sans and JetBrains Mono, self-hosted via Fontsource
* **Language:** TypeScript

### Backend (Planned/Mocked)

* Node.js / Go (Future integration)
* REST & event-driven APIs

### AI Stack (Concept/Future)

* Large Language Models (LLMs)
* Retrieval-Augmented Generation (RAG)
* Vector databases
* Multi-agent orchestration frameworks
* LangChain

### Hosting

* Vercel (recommended) / Cloudflare / Netlify / AWS

### Analytics

* Google Analytics or Plausible

---

## 11. Design Requirements

Direction: **"Engineered Swiss"** (adopted 2026-10-01; replaces the earlier sage-green
"Clean-Tech" brief). Keep the Swiss structure — grid, hairlines, whitespace, glass navbar — and
let neutrals carry the page, teal mark only what you can click, and proof replace decoration.

* **Palette by role** (tokens in `app/app.css`): ink `#00171f` for text and dark panels, a
  near-neutral paper `#f6f7f7` background, white cards, teal `#007ea7` for buttons, focus and
  active navigation only, `#005f7f` for teal text, tint `#9ad1d4` for strokes (never text on
  paper). Every text pairing meets WCAG AA 4.5:1; borders of controls meet 3:1.
* **Rhythm:** paper panels with one ink panel per page where the page has more than one panel;
  the footer is ink.
* **Typography:** Mona Sans for display and body — display at semibold, slightly expanded, with
  tight tracking, sentence case; body 16–18 px regular. JetBrains Mono only for small technical
  labels. Display sizes scale with both width and height so each screen fits one viewport.
* **Imagery:** evidence over decoration — diagrams of how systems are built, monochrome stack
  logos, client logos, case-study numbers, and real team photos. No stock photography, no fake
  terminals. The particle "X" in the hero is the single signature visual.
* **Navigation:** a 72 px top bar, transparent at the top and translucent once scrolled (ink over
  ink panels), with a page counter and a single primary CTA, "Book a call".

### Animation Requirements

* The horizontal page scroll is the site's main motion (GSAP ScrollTrigger, npm package); other
  motion stays quiet: at most one reveal per panel, 150–300 ms hover feedback, no parallax
* Micro-interactions for CTAs and buttons
* Animations must:

  * Not block page rendering
  * Respect user motion preferences (`prefers-reduced-motion`)
  * Maintain high performance (60fps target)

---

## 12. SEO & Content Requirements

* Clear H1–H3 hierarchy
* Optimized meta titles & descriptions
* Keywords:

  * Software development company
  * AI engineering
  * React development
  * Backend development
  * Mobile app development

---

## 13. Risks & Mitigations

| Risk                | Mitigation                       |
| ------------------- | -------------------------------- |
| Unclear positioning | Strong homepage messaging        |
| Low conversion      | Clear CTAs & contact forms       |
| Performance issues  | Static generation & optimization |

---

## 14. Future Enhancements

* Blog & technical articles
* Case studies CMS
* Careers page
* AI demo playground
* Multi-language support

---

## 15. Approval

Stakeholders: Frilogix Leadership
Status: Draft
