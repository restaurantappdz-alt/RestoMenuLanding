# DEPLOYMENT — GitHub Pages (custom domain)

## 1. Project & Domain Information

| Item | Value |
| --- | --- |
| Target custom subdomain | `restova.andalussmart.com` |
| GitHub Pages CNAME target | `restaurantappdz-alt.github.io` (domain ONLY — no repo path) |
| Hosting | GitHub Pages, branch `gh-pages` |
| Build tool | Next.js 14.2.35 (App Router) — static export |

Because the site is served at the **domain root** (`restova.andalussmart.com/`), the
export is **root-relative**: `output: 'export'` and **no `basePath`** (see §2).

---

## 2. Changes Summary

### `next.config.mjs`
- `output: "export"` — Next.js produces a fully static site in `out/`
  (no server; no Node runtime required — required for GitHub Pages).
- `images: { unoptimized: true }` — GitHub Pages has no image-optimization
  server, so `next/image` must emit plain `<img>` URLs instead of
  `/_next/image?url=...`.
- **`basePath` removed.** It previously read `"/RestoMenuLanding"` (subpath
  hosting under `restaurantappdz-alt.github.io/RestoMenuLanding`). With a
  custom domain the site lives at the root, so keeping `basePath` would
  prefix every `_next/*`, `/screenshots/*` and `/bg-images/*` URL with
  `/RestoMenuLanding` and 404 everything.
- The `next-intl` plugin (`createNextIntlPlugin`) is preserved unchanged.
- No `rewrites`/`redirects` exist in the config (they would be ignored by
  static export anyway).

### `lib/basePath.ts`
- `BASE_PATH` changed from `"/RestoMenuLanding"` to `""`. The `pub()` helper
  keeps one central place for asset URL generation if hosting ever moves
  back under a subpath. `Hero.tsx`, `Solution.tsx` and `FloatingIcons.tsx`
  use `pub()` for `next/image` srcs (next/image does **not** prefix
  unoptimized srcs itself).

### `package.json`
- Added dev dependency: `gh-pages` (`^6.3.0`).
- Added scripts:
  - `"predeploy": "npm run build && node -e \"require('fs').writeFileSync('out/.nojekyll', '')\""`
  - `"deploy": "gh-pages -d out -b gh-pages"`
- **Do NOT set a `homepage` field** (see §5).

### The `.nojekyll` file
- GitHub Pages runs Jekyll over the deployed branch by default, which can
  break/mangle `_next` folders and files starting with `_` or `.`.
- The `predeploy` script creates an empty `out/.nojekyll` so Jekyll is
  skipped and the export is served byte-for-byte.

### Removed: `.github/workflows/deploy.yml`
- The previous GitHub **Actions-based** deploy (configure-pages/deploy-pages)
  was replaced by `gh-pages` **branch deployment**. Keep the Pages source on
  "Deploy from a branch", otherwise `deploy-pages` runs would fail.

### Note on Next.js middleware (next-intl)
- This project ships `middleware.ts` for next-intl locale routing
  (`localePrefix: "always"`). **Static export disables middleware**
  (Next.js prints a warning at build time — harmless here).
- Impact: bare `/` cannot redirect server-side. It is already compensated
  by a client redirect page at `app/(root)/page.tsx` which sends `/`
  to `/en` after hydration. All locale pages (`/en`, `/fr`, `/ar`) are
  pre-generated statically and work fully.

---

## 3. How to Deploy

```bash
npm run deploy
```

This runs `predeploy` first (build → `out/`, then writes `out/.nojekyll`),
then pushes `out/` to the `gh-pages` branch via `gh-pages`.

> First run only: you may be prompted for Git credentials. The push targets
> the `gh-pages` branch of the `origin` remote — it never touches `main`.

---

## 4. External Infrastructure Setup Checklist

### GitHub Repository Settings
1. **Settings → Pages → Build and deployment → Source:**
   select **"Deploy from a branch"**.
2. **Branch:** `gh-pages` / `(root)`.
3. **Custom domain:** enter `restova.andalussmart.com` and press **Save**
   (GitHub then serves the site at that host and auto-creates the `CNAME`
   file; wait for the DNS check to pass).
4. **Enforce HTTPS:** leave enabled; re-enable/press **Save** after the DNS
   check passes.

### Cloudflare DNS (for `andalussmart.com`)
Add a DNS record:

| Type | Name | Target | Proxy status |
| --- | --- | --- | --- |
| CNAME | `restova` | `restaurantappdz-alt.github.io` | Proxied (orange cloud) |

SSL/TLS settings in Cloudflare:
- **SSL/TLS → Overview → Encryption mode: `Full` (or `Full (Strict)`),**
  **NOT `Flexible`**.
  `Flexible` makes Cloudflare talk to GitHub Pages over plain HTTP while the
  browser is on HTTPS → GitHub Pages redirects to HTTPS → infinite redirect
  loop (`ERR_TOO_MANY_REDIRECTS`).

---

## 5. Troubleshooting

| Symptom | Cause / Fix |
| --- | --- |
| 404 on assets/styles | A `homepage` field in `package.json` prefixes asset URLs and breaks root-relative exports. **Remove the `homepage` field.** |
| `ERR_TOO_MANY_REDIRECTS` | Cloudflare SSL/TLS mode is `Flexible`. Set it to **Full** or **Full (Strict)**. |
| Missing/CSS-less layout or `_next` folder 404s | Jekyll is running over the branch. Ensure **`.nojekyll`** exists in the `gh-pages` branch root (`npm run deploy` creates it automatically). |
| Screenshots/icons 404 on custom domain | Any leftover `basePath`/`BASE_PATH` value — verify `next.config.mjs` has **no `basePath`** and `lib/basePath.ts` is `BASE_PATH = ""`. |
| Custom domain link not saved | DNS must resolve first (`dig restova.andalussmart.com` → `restaurantappdz-alt.github.io`) before GitHub accepts the domain. |

---

## 6. Verify

- `https://restova.andalussmart.com/` → redirects to `/en` (site content).
- `https://restova.andalussmart.com/en` → landing page, dark theme default.
- Dev sanity check on the GitHub URL while DNS propagates:
  `https://restaurantappdz-alt.github.io/RestoMenuLanding/` (this URL still
  works only while no custom domain is enforced — it 404s/redirects once the
  custom domain is active and `basePath` is empty; that is expected).