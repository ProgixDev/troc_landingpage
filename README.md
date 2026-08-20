# Troc Travail — Landing Page

Premium marketing site for the **Troc Travail** app (Flutter, repo root).
Next.js App Router · TypeScript · Tailwind · GSAP ScrollTrigger · Framer Motion · Lenis.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Design system

Every colour is a CSS variable in `app/globals.css`, lifted verbatim from
`AppColors` in `../lib/splash_screen.dart` — **no hex literal appears in a
component**. Tailwind maps each token to a utility class (`bg-navy`,
`text-orange`, `border-blue-light/30`, …) with alpha support.

| Token | Value | Source |
| --- | --- | --- |
| `--brand-navy` | `#173B72` | `AppColors.navy` |
| `--brand-navy-dark` | `#0E2A54` | `AppColors.navyDark` |
| `--brand-blue-light` | `#2C5AA0` | `AppColors.blueLight` |
| `--brand-blue-soft` | `#EAF1FC` | `AppColors.blueSoft` |
| `--brand-orange` | `#FF6B35` | `AppColors.orange` |
| `--brand-orange-dark` | `#E2521C` | `AppColors.orangeDark` |
| `--brand-orange-soft` | `#FFEADD` | `AppColors.orangeSoft` |
| `--brand-success` | `#34C759` | messages screen |
| `--text-grey` | `#7C89A3` | `AppColors.textGrey` |
| `--surface-mist` | `#EEF2F9` | `AppColors.bg` |

Type: **Space Grotesk** (headings) + **Plus Jakarta Sans** (body), self-hosted
via `next/font/google` — no render-blocking request, no FOUT.

Glass recipe lives in the `.glass` / `.glass-strong` component classes:
`backdrop-filter: blur()`, `rgba(255,255,255,0.1)` border, and an
`inset 0 1px 0` top highlight for the lit edge.

## Structure

```
app/
  layout.tsx        fonts, metadata, LocaleProvider, SplashScreen, SmoothScroll
  page.tsx          section order, wrapped in <DepthSection>
  globals.css       design tokens + glass/eyebrow/gradient-ring primitives
components/
  SplashScreen      360° logo rotation + expanding circular clip-path
  Navbar            sticky glass nav, FR/EN/AR selector, mobile slide-in panel
  Hero              parallax layers, mouse-tilt phone, store badges
  PhoneMockup       the app dashboard, rendered live (not a screenshot)
  FeatureCards      selectable glass cards (Prestation / Objet / Compensation)
  StatsCounter      IntersectionObserver count-up, fires once
  HowItWorks        5-step stepper + stroke-dashoffset connector
  Pricing           Gratuit / Mensuel 2,99 € / Annuel 10,99 €
  Contact           floating labels, focus glow, shake-on-invalid
  DownloadCTA       full-width glass banner + QR
  Footer            columns, socials, language selector
  DepthSection      the scroll "depth" transition (rise → recede)
  SmoothScroll      Lenis ↔ GSAP ticker ↔ ScrollTrigger wiring
lib/
  site.ts           product facts (plans, steps, stats, locales)
  i18n.ts           FR / EN / AR dictionaries, typed against FR
  motion.ts         reduced-motion hook + shared reveal variants
```

## Motion

- **Lenis** drives scroll; its position feeds `ScrollTrigger.update` so
  scrubbed animations stay in sync with the inertia.
- **`DepthSection`** gives the page its signature transition: a section enters
  with `rotateX` + `translateZ` + blur-to-sharp, and leaves by scaling down and
  blurring, so the next one appears to come forward over it.
- Only `transform`, `opacity` and `filter` are animated — never `top`/`left`/
  `width` — and `will-change` is scoped to elements that actually move.

## Accessibility & performance

- `prefers-reduced-motion` is honoured at three levels: the CSS media query
  neutralises loops and `.rm-static` transforms, `useReducedMotion()` swaps
  Framer variants to plain fades, and `SmoothScroll` skips Lenis entirely so
  native scrolling returns.
- Full RTL: choosing **AR** sets `dir="rtl"` on `<html>`; layout uses logical
  properties (`start`/`end`, `ps`/`pe`) so it mirrors without a second stylesheet.
- Breakpoints verified at 375 / 768 / 1024 / 1440 px.
- The splash shows once per session (`sessionStorage`), so repeat navigation
  within the tab goes straight to the hero.

## Before launch

- `SITE.appStoreUrl` / `SITE.playStoreUrl` in `lib/site.ts` are placeholders.
- `components/QRCode.tsx` renders a structurally-correct but **decorative**
  matrix — regenerate it from a real encoder pointed at your store link.
- The contact form is optimistic UI only; wire `handleSubmit` in
  `components/Contact.tsx` to your form endpoint.
- `STATS` in `lib/site.ts` are illustrative figures.
