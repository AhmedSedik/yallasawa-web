# YallaSawa Web — Landing Page

Public-facing landing page for YallaSawa — the video watch-party desktop app.

## Tech Stack

- **Framework**: Next.js 16.2 (App Router, Turbopack)
- **Styling**: Tailwind CSS 4 (CSS-first `@theme` config in `globals.css`)
- **Animations**: Framer Motion 12 (scroll reveals, entrance animations)
- **Language**: TypeScript (strict)
- **Icons**: Lucide React
- **Fonts**: Self-hosted via `next/font/local` — Plus Jakarta Sans, Be Vietnam Pro, Cairo

## Design System — Amber Cinema-Glass

This site mirrors the desktop app's design system. Key principles:

1. **Dark mode only** (v1) — deep navy-black surfaces with warm amber accents
2. **No-Line Rule** — no `1px solid` borders, use surface color shifts and tonal transitions
3. **Glass & Gradient** — CTAs use 135° amber gradient, panels use `backdrop-blur` at 40-50% opacity
4. **Tonal Layering** — depth via luminosity shifts, not drop shadows
5. **Ghost Borders** — 5% white opacity outlines as accessibility fallback only

### Color Tokens

```
Primary:    #ffe2ab (light), #ffbf00 (deep), #ffdfa0 (glow)
Surfaces:   #11131b (base), #191b23 (low), #1d1f27 (container), #272a32 (high), #32343d (highest)
Glass:      rgba(39,42,50,0.5) + backdrop-blur
Text:       #e1e2ed (primary), #d4c5ab (warm)
```

### Typography

| Role | Font | Weight |
|------|------|--------|
| Display / Headlines | Plus Jakarta Sans | 600–800 |
| Body Copy | Be Vietnam Pro | 400–600 |
| Arabic / Bilingual | Cairo | 400–800 |

### Border Radius

```
Small: 10px | Medium: 16px | Large: 24px | XL: 32px
```

## Project Structure

```
app/               — Next.js App Router pages
  layout.tsx       — Root layout (pass-through)
  globals.css      — Tailwind CSS 4 @theme + design tokens
  fonts.ts         — Self-hosted font definitions
  [locale]/        — Locale-aware routes (en, ar)
    layout.tsx     — Main layout (nav + footer, RTL support)
    page.tsx       — Homepage
    about/         — About page
    privacy/       — Privacy Policy
    terms/         — Terms of Service
    disclaimer/    — Legal Disclaimer
    faq/           — FAQ page
    contact/       — Contact page
components/        — Shared React components
i18n/              — next-intl config (routing.ts, request.ts)
messages/          — Translation files (en.json, ar.json)
lib/               — Constants, utilities
public/
  fonts/           — Self-hosted font files
  images/          — Logo, screenshots, OG images
```

## Internationalization (i18n)

- **Library**: next-intl with `[locale]` route segment
- **Locales**: English (`en`) default, Arabic (`ar`)
- **RTL**: Arabic uses `dir="rtl"`, Cairo font, logical CSS properties
- **Domain**: `yalla-sawa.com`

## Essential Commands

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm start          # Start production server
npm run lint       # ESLint
```

## Deployment

- **Platform**: Railway (separate service from Socket.IO server)
- **Config**: `output: 'standalone'` in `next.config.ts`
- **Domain**: `yalla-sawa.com` pointed to Railway (SSL automatic)
- Railway auto-detects Next.js — no Dockerfile needed

## Rules

- Commit message format: `feat:` for features, `fix:` for bug fixes
- Never use Co-Authored-By Claude in commits
- Never commit without user approval first
- Tailwind CSS 4 uses `@theme` in `globals.css` — no `tailwind.config.ts`
- All design tokens must match the desktop app's `variables.css`
- See `PLAN.md` for the full implementation plan with task breakdown
