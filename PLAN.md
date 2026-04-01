# YallaSawa Landing Page — Implementation Plan

**Date:** 2026-04-01
**Status:** Planning
**Target:** Separate repository (`yallasawa-web`)
**Framework:** Next.js 16.2 + Tailwind CSS 4 + TypeScript
**Hosting:** Railway + custom domain

---

## 1. Overview

A public-facing landing page for YallaSawa — the video watch-party desktop app. The site serves as the single download hub, legal/compliance center, and product showcase. It mirrors the desktop app's **Amber Cinema-Glass** design system so visitors feel the product before they install it.

### Goals

- Drive Windows installer downloads (expand to Play Store / App Store later)
- Provide legally sound Privacy Policy, Terms of Service, Disclaimer, and FAQ
- Establish brand presence and product credibility
- Match the desktop app's cinematic amber-glass aesthetic pixel-for-pixel
- Deliver a premium, modern feel inspired by top-tier product landing pages

### Design Inspiration

The layout and interaction patterns draw from these best-in-class dark-themed product sites:

- **Linear** (linear.app) — glass effects, dark theme, smooth scroll animations, gradient glows
- **Arc Browser** (arc.net) — cinematic hero section, bold typography, gradient CTAs
- **Raycast** (raycast.com) — feature card grids, dark glass aesthetic, clean spacing
- **Lemon Squeezy** — warm amber/gold tones on dark backgrounds, friendly yet premium

All share DNA with YallaSawa's design tokens (dark surfaces, glass blur, gradient CTAs, tonal layering). The differentiator is our **Amber Cinema-Glass** identity — warm amber accents on deep navy-black surfaces with cinematic depth.

---

## 2. Repository & Tech Stack

### 2.1 Separate Repository

The landing page lives in its own repo (`yallasawa-web`), **not** inside the YallaForga monorepo.

**Why separate:**
- Zero shared code — no dependency on `@yallasawa/shared`
- Simpler Railway deploy — push to main = deploy, no workspace config
- Independent CI/CD — website deploys don't touch app code
- Cleaner git history — marketing/legal changes isolated from app development
- Different release cadence — site updates (copy, links, legal) happen more often than app releases

### 2.2 Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **Next.js 16.2** (App Router) | Latest — 400% faster dev startup, Turbopack default, SSR/SSG for SEO |
| Styling | **Tailwind CSS 4** | Ships with Next.js 16, CSS-first config, native `@theme` directive |
| Animations | **Framer Motion 12** | Scroll-triggered reveals, smooth transitions, spring physics |
| Language | **TypeScript** (strict) | Consistent with the main app |
| Fonts | Self-hosted via `next/font/local` (Plus Jakarta Sans, Be Vietnam Pro, Cairo) | Same fonts as desktop app, no CLS, no CDN dependency |
| Icons | **Lucide React** | Lightweight, tree-shakable, consistent icon set |
| Deployment | **Railway** | Same platform as the Socket.IO server, separate service |
| Domain | `yalla-sawa.com` | Point DNS to Railway, SSL automatic |

---

## 3. Site Map & Pages

```
/                    → Homepage (hero, features, download CTA)
/about               → About the project, vision, team
/privacy             → Privacy Policy
/terms               → Terms of Service
/disclaimer          → Legal Disclaimer (beta software, liability)
/faq                 → Frequently Asked Questions
/contact             → Contact form / email for support & legal
```

**Total: 7 pages**

---

## 4. Design System Port

The landing page inherits the desktop app's design system from `packages/client/src/renderer/styles/variables.css` and `DESIGN.md`. Below are the key tokens to carry over into the Tailwind CSS 4 theme.

### 4.1 Color Palette (Dark Mode Default)

```
Primary Amber:       #ffe2ab (light), #ffbf00 (deep), #ffdfa0 (glow)
Amber Glow:          rgba(255,226,171,0.2)
Terracotta:          #ffb4ab
Copper:              #e9c349
Success Green:       #22C55E

Surface Base:        #11131b (bg-solid)
Surface Low:         #191b23
Surface Container:   #1d1f27
Surface High:        #272a32
Surface Highest:     #32343d
Surface Lowest:      #0c0e15

Glass:               rgba(39,42,50,0.5)  + backdrop-blur
Glass Border:        rgba(255,226,171,0.1)
Glass Border Hover:  rgba(255,226,171,0.25)

Text Primary:        #e1e2ed
Text Warm:           #d4c5ab
Outline:             #9c8f78
```

### 4.2 Typography

| Role | Font | Weight |
|------|------|--------|
| Display / Headlines | Plus Jakarta Sans | 600–800 |
| Body Copy | Be Vietnam Pro | 400–600 |
| Arabic / Bilingual | Cairo | 400–800 |

### 4.3 Design Principles

1. **No-Line Rule** — No `1px solid` borders. Use surface color shifts and tonal transitions
2. **Glass & Gradient** — CTAs use 135° gradient (amber-d → amber). Floating panels use `backdrop-blur: 20px` at 40–50% opacity
3. **Tonal Layering** — Depth via luminosity shifts, not drop shadows
4. **Intentional Asymmetry** — Hero layouts break the grid with overlapping elements and weighted floats
5. **Ghost Borders** — 5% white opacity outlines as accessibility fallback only
6. **Cinematic Motion** — Framer Motion scroll-triggered fade-ins, parallax floats, spring-based hover states

### 4.4 Border Radius

```
Small:   10px  (buttons, chips)
Medium:  16px  (cards, inputs)
Large:   24px  (panels, modals)
XL:      32px  (hero containers)
```

---

## 5. Page Specifications

### 5.1 Homepage (`/`)

The most important page — first impression and conversion funnel.

**Sections (top to bottom):**

1. **Navigation Bar** — Glass-blur sticky header. Logo (left), nav links (center: About, FAQ, Contact), Download button (right, amber gradient CTA). Mobile: hamburger menu with slide-in drawer
2. **Hero Section** — Large display heading ("Watch Together, No Matter Where"), subheading explaining the product, animated app screenshot/mockup floating in glass container with ambient amber glow, primary Download CTA button (amber gradient), secondary "Learn More" ghost button. Framer Motion entrance animation (fade-up + scale)
3. **Feature Cards** — 3–4 glass cards with icons highlighting key features (staggered scroll reveal):
   - Synchronized Playback (real-time sync across devices)
   - Room-Based Watch Parties (create/join with room codes)
   - Built-in Chat (text, emoji, GIF support)
   - Queue System (line up what to watch next)
4. **How It Works** — 3-step visual flow: Download → Create a Room → Watch Together (numbered steps with connecting line/gradient)
5. **Platform Availability** — Windows download button (primary), "Coming soon" badges for Android/iOS
6. **Footer** — Logo, nav columns, legal links (Privacy, Terms, Disclaimer), copyright, social links

### 5.2 About Page (`/about`)

- Product story and vision ("Why we built YallaSawa")
- What makes it different (real-time sync, latency compensation, DRM support)
- Team section (optional — can be generic or named)
- Link to FAQ and Contact

### 5.3 Privacy Policy (`/privacy`)

Must cover:

- What data is collected (display names, room codes, chat messages, IP addresses for Socket.IO)
- How data is used (real-time sync, room management, chat delivery)
- Data storage and retention (Firebase, server-side)
- Third-party services (Firebase, Railway hosting, Widevine DRM/CDM)
- Cookies and local storage (Electron app specifics)
- User rights (data deletion, access requests)
- Children's privacy (age restrictions)
- Contact info for privacy concerns
- Last updated date

### 5.4 Terms of Service (`/terms`)

Must cover:

- Acceptance of terms
- Description of service (beta software, video watch-party synchronization)
- User accounts and responsibilities
- Acceptable use policy (no piracy, no harassment, no illegal content sharing)
- Intellectual property (YallaSawa does not host or distribute video content)
- Disclaimer of warranties (beta software, provided "as is")
- Limitation of liability
- Termination rights
- Governing law
- Changes to terms
- Contact information

### 5.5 Disclaimer (`/disclaimer`)

Must cover:

- Beta software status and expectations
- No warranties (express or implied)
- Limitation of liability (damages cap)
- Third-party content (videos watched are from external platforms, not YallaSawa)
- DRM and content licensing (YallaSawa does not circumvent DRM)
- Network and connectivity (no guarantee of uptime)
- Use at your own risk

### 5.6 FAQ (`/faq`)

Organized by category:

**Getting Started:**
- What is YallaSawa?
- How do I install it?
- What platforms are supported?
- Is it free?

**Using the App:**
- How do I create a watch party?
- How does sync work?
- Can I use it with any video?
- What is the queue system?
- How does chat work?

**Technical:**
- Why does it need DRM/Widevine?
- What about latency?
- Is my data secure?
- Does it work behind a VPN?

**Legal:**
- Is this legal?
- Does YallaSawa host video content?
- What data do you collect?

### 5.7 Contact Page (`/contact`)

- Contact email address for support
- Contact email for legal/privacy inquiries
- Optional: simple contact form (name, email, subject, message)
- Links to FAQ for common questions
- Response time expectations

---

## 6. Project Structure

```
yallasawa-web/                      # Standalone repository
├── public/
│   ├── fonts/                      # Self-hosted font files
│   │   ├── PlusJakartaSans/
│   │   ├── BeVietnamPro/
│   │   └── Cairo/
│   ├── images/
│   │   ├── logo-dark.png
│   │   ├── logo-light.png
│   │   ├── lockup-dark.png
│   │   ├── lockup-light.png
│   │   ├── brand-card.png
│   │   ├── app-screenshot.png      # Desktop app screenshot for hero
│   │   └── og-image.png            # Open Graph social sharing image
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (nav + footer)
│   │   ├── page.tsx                # Homepage
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   ├── disclaimer/
│   │   │   └── page.tsx
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   └── globals.css             # Tailwind CSS 4 theme + design tokens
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── DownloadButton.tsx
│   │   ├── FAQAccordion.tsx
│   │   ├── ContactForm.tsx
│   │   ├── ScrollReveal.tsx        # Framer Motion scroll-triggered wrapper
│   │   └── GlassCard.tsx           # Reusable glass-effect container
│   ├── lib/
│   │   └── constants.ts            # Download URLs, version numbers, links
│   └── fonts.ts                    # next/font/local config
├── next.config.ts                  # Next.js 16 config (TypeScript)
├── tsconfig.json
├── package.json
├── .gitignore
└── .env.example                    # Environment variables template
```

**Key differences from old plan:**
- Standalone repo root (not `packages/web/`)
- `globals.css` uses Tailwind CSS 4 `@theme` directive (no `tailwind.config.ts` needed)
- Added `ScrollReveal.tsx` and `GlassCard.tsx` shared components
- Added `MobileMenu.tsx` for responsive nav
- `next.config.ts` (TypeScript, Next.js 16 default)
- No `Dockerfile` needed — Railway auto-detects Next.js

---

## 7. Tailwind CSS 4 Theme Configuration

Tailwind CSS 4 uses CSS-first configuration via `@theme` in `globals.css`. No `tailwind.config.ts` file needed.

```css
@import "tailwindcss";

@theme {
  /* Colors — Amber Cinema-Glass */
  --color-amber-light: #ffe2ab;
  --color-amber-deep: #ffbf00;
  --color-amber-glow: #ffdfa0;
  --color-terracotta: #ffb4ab;
  --color-copper: #e9c349;
  --color-success: #22C55E;

  --color-surface-base: #11131b;
  --color-surface-low: #191b23;
  --color-surface-container: #1d1f27;
  --color-surface-high: #272a32;
  --color-surface-highest: #32343d;
  --color-surface-lowest: #0c0e15;

  --color-text-primary: #e1e2ed;
  --color-text-warm: #d4c5ab;
  --color-outline: #9c8f78;

  /* Border Radius */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;

  /* Fonts (registered via next/font/local) */
  --font-display: var(--font-jakarta);
  --font-body: var(--font-vietnam);
  --font-arabic: var(--font-cairo);
}
```

---

## 8. Railway Deployment

### 8.1 Why Railway

- Already using Railway for the Socket.IO server — familiar platform
- Auto-detects Next.js apps — zero config needed
- Custom domains with automatic SSL
- $5/mo Hobby plan is plenty for a marketing site
- Instant deploys on git push

### 8.2 Service Configuration

Railway auto-detects Next.js. No Dockerfile needed for a standalone repo.

```
Repository:        github.com/youruser/yallasawa-web
Branch:            main
Build Command:     (auto-detected) npm run build
Start Command:     (auto-detected) npm start
Node Version:      22.x
```

### 8.3 Next.js Config

```ts
// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'standalone',  // Optimized for Railway/Docker deployment
}

export default config
```

### 8.4 Custom Domain Setup

1. **Buy a domain** — Recommended registrars:
   - **Cloudflare Registrar** — cheapest renewal, great DNS, free privacy
   - **Namecheap** — affordable, good UI
   - **Porkbun** — cheap `.com` (~$10/year)

2. **Point DNS to Railway:**
   - Add custom domain in Railway service settings
   - Railway provides a CNAME target (e.g. `xxx.up.railway.app`)
   - Add CNAME record: `www` → Railway CNAME target
   - Add CNAME or ALIAS record: `@` (root) → Railway CNAME target
   - Railway handles SSL/TLS automatically (Let's Encrypt)

3. **Domain:** `yalla-sawa.com`

---

## 9. SEO & Metadata

Every page gets proper metadata via the Next.js Metadata API:

```ts
// Example for homepage
export const metadata: Metadata = {
  title: 'YallaSawa — Watch Together, No Matter Where',
  description: 'Synchronized video watch parties with real-time chat. Download for Windows.',
  openGraph: {
    title: 'YallaSawa',
    description: 'Watch videos together in perfect sync.',
    images: ['/images/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}
```

---

## 10. Task Breakdown & Assignments

All tasks are assigned to **Claude Code** for implementation. Tasks are ordered by dependency — each phase should be completed before the next begins.

### Phase 1: Scaffolding & Setup

| # | Task | Priority |
|---|------|----------|
| 1.1 | Create new repo `yallasawa-web`, scaffold with `npx create-next-app@latest` (TypeScript, Tailwind CSS 4, App Router, Turbopack) | Critical |
| 1.2 | Install dependencies: `framer-motion`, `lucide-react` | Critical |
| 1.3 | Copy font files from YallaForga `packages/client/src/renderer/assets/fonts/` to `public/fonts/` | High |
| 1.4 | Copy logo/brand assets from YallaForga `/logo/` to `public/images/` | High |
| 1.5 | Configure `next/font/local` with Plus Jakarta Sans, Be Vietnam Pro, and Cairo in `src/fonts.ts` | High |
| 1.6 | Set up Tailwind CSS 4 `@theme` in `globals.css` with YallaSawa design tokens (colors, fonts, radii) | Critical |
| 1.7 | Configure `next.config.ts` with `output: 'standalone'` | High |
| 1.8 | Verify local dev server runs with `npm run dev` | Critical |

### Phase 2: Layout & Shared Components

| # | Task | Priority |
|---|------|----------|
| 2.1 | Build root `layout.tsx` with dark theme, font classes, metadata | Critical |
| 2.2 | Build `Navbar.tsx` — glass-blur sticky nav, logo, links, download CTA | Critical |
| 2.3 | Build `MobileMenu.tsx` — slide-in responsive menu drawer | High |
| 2.4 | Build `Footer.tsx` — logo, nav columns, legal links, copyright | Critical |
| 2.5 | Build `DownloadButton.tsx` — amber gradient button with Windows icon | High |
| 2.6 | Build `GlassCard.tsx` — reusable glass-effect container component | High |
| 2.7 | Build `ScrollReveal.tsx` — Framer Motion scroll-triggered fade-in wrapper | High |
| 2.8 | Set up `globals.css` with glass utilities, gradient classes, and base styles | Critical |

### Phase 3: Homepage

| # | Task | Priority |
|---|------|----------|
| 3.1 | Build `Hero.tsx` — display heading, subheading, CTA, app mockup with ambient glow + Framer Motion entrance | Critical |
| 3.2 | Build `FeatureCard.tsx` — glass card with icon, title, description, hover glow effect | High |
| 3.3 | Build features section with 4 feature cards (staggered scroll reveal) | High |
| 3.4 | Build `HowItWorks.tsx` — 3-step visual flow with connecting gradient line | Medium |
| 3.5 | Build platform availability section with Windows CTA + coming-soon badges | Medium |
| 3.6 | Assemble homepage `page.tsx` with all sections | Critical |

### Phase 4: Legal Pages (Privacy, Terms, Disclaimer)

| # | Task | Priority |
|---|------|----------|
| 4.1 | Research and draft **Privacy Policy** tailored to YallaSawa (Socket.IO, Firebase, chat data, DRM) | Critical |
| 4.2 | Research and draft **Terms of Service** (beta software, acceptable use, IP, liability) | Critical |
| 4.3 | Research and draft **Disclaimer** (beta status, no warranties, third-party content) | Critical |
| 4.4 | Build shared legal page layout component (consistent formatting, last-updated date, TOC) | High |
| 4.5 | Implement `/privacy`, `/terms`, `/disclaimer` pages with full content | Critical |
| 4.6 | Cross-reference all legal pages for consistency (same definitions, same contact info) | High |

### Phase 5: About, FAQ & Contact Pages

| # | Task | Priority |
|---|------|----------|
| 5.1 | Write About page content (product story, vision, what makes it different) | High |
| 5.2 | Implement `/about` page with content and team section | High |
| 5.3 | Write FAQ content organized by category (Getting Started, Using the App, Technical, Legal) | High |
| 5.4 | Build `FAQAccordion.tsx` — expandable Q&A component with Framer Motion animations | High |
| 5.5 | Implement `/faq` page with accordion sections | High |
| 5.6 | Build `ContactForm.tsx` — name, email, subject, message fields | Medium |
| 5.7 | Implement `/contact` page with form and email info | Medium |

### Phase 6: Polish & Deployment

| # | Task | Priority |
|---|------|----------|
| 6.1 | Capture desktop app screenshot for hero section mockup | High |
| 6.2 | Create Open Graph image (`og-image.png`) for social sharing | Medium |
| 6.3 | Add SEO metadata to every page (title, description, OG tags) | High |
| 6.4 | Full responsive test pass (mobile 375px, tablet 768px, desktop 1440px) | High |
| 6.5 | Accessibility audit (contrast ratios, keyboard navigation, screen reader) | Medium |
| 6.6 | Performance check (Lighthouse score > 90) | Medium |
| 6.7 | Push repo to GitHub, connect to Railway, deploy | Critical |
| 6.8 | Buy domain, configure DNS, verify live site with custom domain | Critical |

---

## 11. Execution Order

```
Phase 1 (Setup)           ████████░░░░░░░░░░░░  ~1 hr
Phase 2 (Layout)          ░░░░░░░░████████░░░░  ~2 hrs
Phase 3 (Homepage)        ░░░░░░░░░░░░████████  ~2 hrs
Phase 4 (Legal)           ████████████░░░░░░░░  ~2.5 hrs
Phase 5 (Content Pages)   ░░░░░░░░████████████  ~2 hrs
Phase 6 (Polish/Deploy)   ░░░░░░░░░░░░████████  ~2 hrs
                                               ─────────
                                         Total: ~11.5 hrs
```

Phases 1→2→3 are sequential (each depends on the previous). Phases 4 and 5 can be parallelized — legal content writing can happen alongside About/FAQ content writing. Phase 6 comes last.

---

## 12. Dependencies & Prerequisites

Before starting implementation:

- [x] Domain: `yalla-sawa.com`
- [ ] Decide on contact email address for legal/support pages
- [ ] Confirm team/founder info for the About page (or keep it generic)
- [ ] Provide or approve an app screenshot for the hero section
- [ ] Create GitHub repo (`yallasawa-web`)
- [ ] Railway account access for creating the new web service

---

## 13. Future Enhancements (Post-Launch)

These are out of scope for v1 but worth planning for:

- **i18n (Arabic)** — RTL support with Cairo font already in the system, use `next-intl`
- **Blog / Changelog** — MDX-powered blog for release notes
- **Android / iOS store links** — When mobile apps are ready
- **Analytics** — Privacy-friendly analytics (Plausible or Umami)
- **Auto-update download links** — Pull latest version from GitHub Releases API
- **Dark/Light toggle** — Currently dark-only, add light mode later

---

## 14. Notes

- The site is dark mode only for v1 (matching the desktop app's primary theme)
- All legal content should be reviewed by a qualified attorney before going fully live — the AI-drafted versions serve as a strong starting foundation
- Font files are copied from the client repo — no cross-repo dependency
- The landing page has zero dependency on `@yallasawa/shared` — it's fully standalone
- Tailwind CSS 4 uses CSS-first config (`@theme` in `globals.css`) — no `tailwind.config.ts` needed
- Railway auto-detects Next.js — no Dockerfile required for the standalone repo
