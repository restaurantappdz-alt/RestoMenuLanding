#### RestoMenu Landing — Project Notes

Marketing landing page for **RestoMenu** — a mobile app that lets restaurant
owners manage digital menus and broadcast them live to TV screens. Built with
Next.js 14 (App Router), Tailwind CSS, Framer Motion, `next-intl` (real i18n)
and `next-themes` (dark/light).

---

## 1. File structure

```
.
├── i18n.ts                  # Locale list + getRequestConfig (next-intl)
├── navigation.ts            # Locale-aware Link/useRouter/usePathname
├── middleware.ts            # Locale routing: / → /en, /en|fr|ar/* prefix
├── next.config.mjs          # Wrapped with createNextIntlPlugin
├── messages/
│   ├── en.json              # English translations (source of truth for keys)
│   ├── fr.json              # French
│   └── ar.json              # Arabic (RTL)
├── app/
│   ├── globals.css          # Theme tokens (CSS vars) + .glass/.btn-gold/.btn-ghost
│   ├── favicon.ico
│   └── [locale]/
│       ├── layout.tsx       # <html lang/dir>, Outfit font, NextIntlClientProvider,
│       │                    #   ThemeProvider, per-locale metadata, generateStaticParams
│       └── page.tsx         # Server component assembling all sections
├── components/
│   ├── Providers.tsx        # next-themes provider (class strategy, dark default)
│   ├── Navbar.tsx           # Sticky glass nav (desktop section links + hamburger)
│   ├── MobileMenu.tsx       # Spring slide-in drawer (mirrored in RTL)
│   ├── LanguageSwitcher.tsx # Locale dropdown (flags + native names)
│   ├── ThemeToggle.tsx      # Sun/moon toggle
│   ├── Hero.tsx             # Staggered headline, CTAs, tilting phone/TV mockups
│   ├── Problem.tsx          # Two-column comparison
│   ├── Solution.tsx         # Phone screenshot carousel → arrows → TV menu
│   ├── Features.tsx         # 1/2/3-column responsive grid
│   ├── Templates.tsx        # Built-in templates vs custom design
│   ├── HowItWorks.tsx       # 3 numbered steps
│   ├── Pricing.tsx          # Starter / Pro / Premium
│   ├── Contact.tsx          # Contact info card + message form
│   ├── Footer.tsx           # Links, language switcher, theme toggle
│   ├── FloatingIcons.tsx     # Real icon PNGs floating in the background
│   ├── SectionHeading.tsx / SectionDivider.tsx
│   ├── Magnetic.tsx         # Cursor-magnetic wrapper for CTAs
│   └── motion.ts            # SPRING_SOFT + fadeUp shared variants
├── public/screenshots/
│   ├── phone/  # Real phone screenshots (phone-1..3.jpg, 1080×2243, ~9:16)
│   └── tv/     # Real TV menu screenshots (tv-1..3.png, 3406×1956, ~16:9)
└── public/bg-images/        # Restaurant icon PNGs for the floating background
    (copied from the repo-root `bg icons/` stash: fork, coffee-cup,
    coffee-machine, cooking, food-and-restaurant, juce)
```

## 2. Internationalization (next-intl)

- **Locales**: `en`, `fr`, `ar` (defined in `i18n.ts`, used by middleware,
  `navigation.ts` and `generateStaticParams`).
- **URL scheme**: locale is always a path prefix (`localePrefix: "always"` in
  `middleware.ts`). `/` redirects to `/en`; `/ar` etc. are statically
  prerendered per locale.
- **RTL**: `app/[locale]/layout.tsx` sets `dir={locale === "ar" ? "rtl" : "ltr"}`
  on `<html>`. Layouts mirror automatically; where an explicit flip is needed,
  components use Tailwind `rtl:` variants (e.g. arrows `rtl:lg:rotate-180`,
  `rtl:-scale-x-100`, logical props like `start-0`/`end-0`, `text-start`,
  `ms-auto`).
- **Adding/editing text**: edit the matching key in all three `messages/*.json`
  (keys must stay identical). `en.json` is the key reference.
- **How the switcher works**: `LanguageSwitcher` uses `useRouter` +
  `usePathname` from `next-intl/navigation` (`navigation.ts`), so switching
  keeps the current page and only swaps the locale prefix
  (`router.replace(pathname, { locale })`). The active locale comes from
  `useLocale()`; the dropdown is `AnimatePresence`-animated with flags 🇬🇧/🇫🇷/🇸🇦
  and native names (English / Français / العربية).
- **Translating a component**: `const t = useTranslations("section")` then
  `t("key")`; arrays are read with `t.raw("key")` (hero words, feature items,
  pricing plans, solution categories…).
- **Metadata**: `generateMetadata` in the layout reads `meta.title` /
  `meta.description` per locale.

## 3. Dark / light theme (next-themes)

- **Provider**: `components/Providers.tsx` — `attribute="class"`,
  `defaultTheme="dark"`, `enableSystem={false}`. The toggle writes to
  `localStorage` via next-themes.
- **CSS variables** (`app/globals.css`): light values live in `:root`, dark
  overrides in `.dark`. Tokens: `--gold`, `--gold-rgb`, `--gold-ink`,
  `--surface`, `--line`, `--text-heading/body/faint`, `--bg`, `--bg-image`,
  `--shape`, `--shape-op`, `--shape-op-hero`, `--shadow-card`,
  `--shadow-card-lg`.
  - **Dark**: obsidian gradient `#0B0C10 → #14171F`, gold `#F5B041`,
    glass surfaces, white text, **no** card shadows.
  - **Light**: `#F3F4F6` background, solid white cards, `#E5E7EB` borders,
    `#111827` text, gold `#F5B041`. **Not flat** — cards get real depth:
    `--shadow-card` (soft `shadow-sm`-style) via `.glass`, and a hover lift
    (`translateY(-4px)` + `--shadow-card-lg`) via the `.card-lift` class
    (added to Features + Templates cards). In dark mode both token shadows
    are `none`.
- **Why `--gold-rgb`**: Tailwind's `gold` color is defined as
  `rgb(var(--gold-rgb) / <alpha-value>)` so utilities like `bg-gold/10`,
  `border-gold/40`, `text-gold/25` resolve at runtime per theme. Gold is
  unified at `#F5B041` in both themes.
- **Semantic classes**: `text-heading`, `text-body`, `text-faint`,
  `.glass`, `.btn-gold`, `.btn-ghost`, `.card-lift` — these read the CSS
  vars, so components usually don't need `dark:` variants at all. Use
  `dark:` only for edge cases.
- **Floating background icons** (`components/FloatingIcons.tsx`): 10 instances
  of real restaurant icon PNGs from `public/bg-images/`, each 30–50px, placed
  absolutely in a `pointer-events-none fixed inset-0 z-0` overlay. They float
  with `animate={{ y: [0, -15, 0], x: [0, 5, -5] }}` (unique duration/delay
  per instance for organic motion) and fade via `--shape-op` /
  `--shape-op-hero` (0.12/0.16 light, 0.07/0.1 dark). To swap icons, replace
  files in `public/bg-images/` (source stash: repo-root `bg icons/`).

## 3b. Fonts & Arabic

- `app/[locale]/layout.tsx` loads **two** next/font variables: `Outfit`
  (`--font-outfit`, latin) and `Noto Naskh Arabic` (`--font-arabic`, arabic
  subset). Both are output as `__variable_*` classes on `<body>`.
- `globals.css`: `html[lang="ar"] body { font-family: var(--font-arabic), … }`
  switches the whole document to Noto Naskh Arabic so Arabic letters join
  correctly, while en/fr keep Outfit. Tailwind also exposes
  `font-arabic` if you ever need it on a specific node.
- **Hero title animation adapts per language** (`components/Hero.tsx`):
  - `en` / `fr`: letters are split and staggered individually (spring,
    slide-up from a clipped box — each letter also fades in).
  - `ar`: the heading renders as a **single block** (no letter split) with a
    soft `opacity 0→1` + `y 24→0` + `scale 0.98→1` entrance — this keeps
    Arabic ligatures intact and avoids clipping diacritics.
  - The check is `const isArabic = locale === "ar"`.
- `dir="rtl"` is set on `<html>` in the layout for Arabic; Tailwind `rtl:`
  variants mirror everything.
- **Hero mockups use real screenshots** (`components/Hero.tsx`):
  - **Phone**: auto-cycles `public/screenshots/phone/phone-{1,2,3}.jpg` via
    `AnimatePresence` fade (0.55s easeInOut), every 2.6s, gated by `useInView`.
    `aspect-[9/16]`, `<Image width=270 height=480>`; pulsing gold frame +
    LIVE badge + carousel dots.
  - **TV**: auto-cycles `/screenshots/tv/tv-{1,2,3}.png` (fade 0.55s, 2.6s
    interval, `useInView` gate) inside a TV-style bezel: dark gradient frame,
    brand strip + pulsing power LED on the bottom bezel, pedestal stand
    (neck + base). `aspect-video`, Image 640×360.
  - Edit `PHONE_IMAGES` / `TV_IMAGES` to point elsewhere.

## 4. Mobile responsiveness

- Hero mockups stack vertically on mobile (flex-col; absolute side-by-side
  only from `lg:`).
- Solution: phone → arrows → TV become a column; arrows rotate 90° on mobile
  (`rotate-90 lg:rotate-0`) to point down toward the TV, and 180° in RTL.
- Feature grid: 2 columns on mobile (`grid-cols-2`) → 3 (`md:grid-cols-3`)
  with compact cards (small icon, `text-sm` body). Pricing: stacked →
  3 columns (`md:`). Templates/HowItWorks: stacked → side-by-side.
- Navbar: always glass (`glass border-x-0 border-t-0`, `z-[60]`) — solid
  white + border in light mode, translucent glass in dark. Desktop shows
  section links (Problem → Contact, from `lg:`) + theme toggle, language
  switcher and a Contact CTA. Below `lg` a hamburger (`HiOutlineMenu`)
  opens `MobileMenu`, a **full-screen drawer** (`inset-0`, `z-50`) that slides
  from the inline-end (mirrored in RTL) with `SPRING_SOFT`. The backdrop
  (`z-40`) dims the page; the navbar keeps a higher z-index (`z-[60]`) and
  stays visible **above** the overlay (this fixes the old drawer-on-top-of-
  navbar bug). Drawer holds a close (X) button, section links, language
  switcher (active language golds itself), a duplicated theme toggle and the
  Contact CTA; body scroll is locked while open. Anchored sections sit clear
  of the fixed navbar via `scroll-padding-top`.
- Contact form is the last section (after Pricing); all CTAs scroll to
  `#contact`.
- All buttons/links have ≥44px touch targets (hamburger + theme toggle are
  `h-11` on mobile, `h-9` on `md:`; pills use `py-3`) and `whileTap`
  feedback on CTAs.

## 5. Solution section & screenshots

- **Phone**: cycles the 3 real images in `public/screenshots/phone/`
  (`phone-1.jpg` → `phone-2.jpg` → `phone-3.jpg`, 1080×2243) with an
  `AnimatePresence` crossfade (fade + `scale 0.92→1` in / `1.05` out, 0.45s),
  every 2.5s, paused when off-screen (`useInView` gate). Frame has a
  mouse-driven 3D tilt (±5°, springs 120/18) and a pulsing gold-edge glow.
  Slide captions come from `solution.screens` in the messages.
  - **To swap images**: overwrite files in `public/screenshots/phone/` or
    edit `SCREEN_SRCS` in `components/Solution.tsx`. To reorder/relabel, edit
    the `screens` array in the three message files.
- **Arrows**: three gold `HiOutlineArrowRight` chips pulsing
  `x: [0, 10, 0]` + opacity, 1.2s loop, staggered delays in `FLOW_ARROWS`.
- **TV**: cycles the 3 real screenshots `/screenshots/tv/tv-{1,2,3}.png`
  (3406×1956) with an `AnimatePresence` crossfade (0.5s), every 2.5s, gated
  by `useInView`, inside a TV-style bezel — dark gradient frame with brand
  strip + pulsing power LED on the bottom bezel, pedestal stand (neck +
  base) — plus the live "TV 1 · Counter" overlay and carousel dots. To swap
  the demo looks, replace files in `public/screenshots/tv/` or edit
  `TV_IMAGES` in `components/Solution.tsx`.
- **Cloud note**: italic `text-faint` line under the composition
  (`solution.cloudNote`).

## 6. Customization cheat sheet

| Want to… | Edit |
|---|---|
| Change pricing | `pricing.*` in the three `messages/*.json` (name, price, period, cta, badge, features) |
| Change feature cards | `features.items` in messages (order matters — icons are positional in `Features.tsx`) |
| Change hero headline | `hero.words` (words ending in `.` get the gold accent) |
| Change TV menu screenshots | replace files in `public/screenshots/tv/` (all 3 cycle in Hero + Solution) |
| Change locale list | `i18n.ts` (locales), `middleware.ts`, `navigation.ts`; add `messages/<x>.json` |
| Change contact details | `contact.info.*` in messages (email/phone/location/hours) — form texts too |
| Wire the contact form | `components/Contact.tsx` `submit()` — currently a 1.6s fake timeout |
| Link "Watch Demo" | `Hero.tsx` — currently anchors to `#solution` |
| Link "Request Custom Design" / pricing CTAs | `Templates.tsx` / `Pricing.tsx` — currently `#contact` |

## 7. Dependencies

| Package | Version | Role |
|---|---|---|
| `next` | 14.2.35 | App Router framework |
| `react` / `react-dom` | 18 | Runtime |
| `framer-motion` | 13 | Springs, whileInView, AnimatePresence, pathLength |
| `react-icons` | 5.7 | Heroicons outline (`react-icons/hi`) |
| `next-intl` | 3.26 | i18n: middleware routing, messages, RTL |
| `next-themes` | 0.4 | Dark/light class toggling + persistence |
| `tailwindcss` | 3.4 | Utility styling |

Notes:
- **tsparticles is not installed** (spec: no particles). Don't re-add.
- Heroicons v1 has no `HiOutlineTv`/`HiOutlineSmartphone` — use
  `HiOutlineDesktopComputer` and `HiOutlineDeviceMobile`.
- `IconType` is exported from `react-icons` (root), not `react-icons/hi`.
- Don't use opacity modifiers (`bg-gold/10`) on colors defined as plain
  `var(--x)` in Tailwind — define them as `rgb(var(--x-rgb) / <alpha-value>)`
  (see `--gold-rgb`).
- Build/lint/smoke: `npm run build`, `npm run lint`,
  `npx next start -p <port>` + curl `/`, `/en`, `/fr`, `/ar`.
