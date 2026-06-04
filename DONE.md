# NUANCE — Done Manifest

Reference before making any change. Check here first to avoid repeating work or undoing decisions.

---

## Auth

- **Sign up / sign in form** — `app/auth/page.tsx` + `components/auth-form.tsx`
  - Email + password only (Google/Apple = future)
  - Sign in → `/home`, Sign up → sends confirmation email → `/auth/callback?next=/onboarding`
  - Error display, loading state ("Just a moment…"), success state after signup

- **Email callback** — `app/auth/callback/route.ts`
  - Exchanges Supabase code for session, redirects to `next` param

- **Middleware** — `middleware.ts`
  - Protected routes: `/home`, `/matchmaking`, `/room`, `/settings`, `/reconnects`, `/start`, `/topic`, `/summary`, `/onboarding`, `/account`
  - Unauthenticated → redirect to `/auth`
  - Authenticated on `/auth` → redirect to `/home`
  - Runtime: Node.js (not Edge — Supabase uses Node APIs)
  - Wrapped in try/catch so Supabase errors never cause 500s

- **Supabase clients**
  - Browser: `lib/supabase/client.ts` — `createBrowserClient`
  - Server: `lib/supabase/server.ts` — `createServerClient` with `await cookies()`

---

## Onboarding

- **5-step flow** — `components/onboarding-flow.tsx`, mounted at `app/onboarding/page.tsx`
  1. Language (EN / FR) — sets local state, passed to all steps
  2. Platform intro — 4 emoji point cards
  3. Conduct rules — 8 rules, scrollable, must reach bottom, checkbox accept
  4. Alias — generated alias, 2 rerolls, family/stage stored
  5. Profile — display name (optional), age range, country, mood, interests, voice + reconnect toggles

- **Saves to Supabase** via `POST /api/user`
  - Tables: `public.users` (upsert) + `public.profiles_optional` (upsert)
  - Requires RLS insert policy (already exists in schema.sql)

- **Old component** — `components/onboarding-identity-client.tsx` still exists but is no longer mounted anywhere. Can be deleted.

---

## Account Page

- **Route**: `app/account/page.tsx` (server) + `components/account-client.tsx` (client)
- Reads profile from Supabase on server render
- Editable fields: display name, age range, mood, country, interests
- Toggles: voice input, reconnect requests
- Language switcher: EN / FR (calls `POST /api/locale`, then `router.refresh()`)
- Theme switcher: Dark / Light (writes to localStorage, toggles `.dark` class on `<html>`)
- Sign out: Supabase `signOut()` → redirect to `/`
- Delete account: `DELETE /api/user` → sign out → redirect to `/`
  - Two-step confirmation (first click shows warning, second click executes)

---

## API Routes

- `GET/POST/PUT/DELETE /api/user` — full user profile CRUD
- `POST /api/locale` — sets `nuance-locale` cookie
- `POST /api/identity` — sets alias cookies (legacy, used by old onboarding)
- `POST /api/matchmaking` — prototype stub
- `POST /api/messages/moderate` — OpenAI moderation (wired but not called in UI)
- `POST /api/rooms/[id]/summary` — OpenAI summary (wired but not called in UI)
- `POST /api/demo/reply` — OpenAI reply for autonomous demo

---

## Home Page

- **Route**: `app/home/page.tsx`
- Profile chip: avatar initial / "GOOD EVENING · ALIAS" / chevron → links to `/account`
- Hero: centered `screen-heading`, body text, online count pill with green dot
- Mode grid: 2×2, each card: emoji + duration (top row), display name, short label
  - Cards link to `/start`
  - CTA button: "Open exchange modes →" → `/start`
- Quote of the day: italic display font, mode chip, glass panel
- **No reconnects or safety section** on home (moved to dedicated nav items)

---

## Marketing / Landing Page

- **Route**: `app/(marketing)/page.tsx`
- Dark default, no device shell wrapper
- Header: NUANCE wordmark + eyebrow + Sign in link
- Hero glass panel: eyebrow, heading (2.2rem), body, stats grid (2-col), CTA buttons (stacked)
- Modes section: eyebrow + heading (1.9rem) + body (stacked, NOT side by side), then mode cards
- Mode cards: `grid-cols-1` default, `sm:grid-cols-2` — emoji/duration row + name + label only

---

## Navigation

- **Bottom nav** — `components/mini-nav.tsx`
  - 4 items: Home / Start / Reconnects / Account
  - Icons: house / star / heart / person
  - **Removed**: Settings/Safety from nav (use Account instead)
  - Active state: bone background, dark text

---

## Design System

- **globals.css**: Rewritten against NUANCE Style Guide. ~220 lines. Only canonical tokens.
  - CSS vars: `--background`, `--foreground`, `--surface`, `--surface-strong`, `--border`, `--border-soft`, `--primary`, `--primary-foreground`, `--muted-foreground`, `--positive`, `--text-faint`, `--glow`, `--radius`
  - Dark default (`:root` = dark, `.dark` = dark for shadcn compat)
  - Day theme via `body[data-theme="day"]` — overrides all vars
  - Components: `.glass-panel`, `.eyebrow`, `.screen-heading`, `.app-section-title`, `.hairline`, `.soft-link`, `.mini-nav-*`, `.screen-card`, `.screen-stack`, `.device-shell`, `.app-shell-*`

- **tailwind.config.ts**: `darkMode: ["class"]`, semantic color tokens, font families (display/sans/caps), type scale (display-1/2/3, quote, label, micro), radii (sm/md/lg/xl/2xl/pill), shadows (pop/card/device), animations (rise, pulse-dot)

- **Fonts** (via `next/font/local` in `app/layout.tsx`):
  - `--font-display`: ConcretteS-TRIAL-Light.woff2 (serif display)
  - `--font-sans`: Beausite-Classic-Clear.ttf
  - `--font-caps`: Beausite-Classic-Medium.ttf

- **Theme toggle**: `components/day-night-theme.tsx` — default always night, day only if localStorage has "day"

- **Removed from globals.css**: mode-carousel-*, launch-panel, liquid-panel, editorial-grid, app-topbar, app-kicker, app-metric-*, theme-toggle-*, all hacky Tailwind class overrides

---

## Database

- **Schema**: `supabase/schema.sql` — run once in Supabase SQL Editor
- **RLS**: All tables have RLS enabled. Insert/select/update policies set per table.
- **Key constraint**: `public.users.id` references `auth.users.id` on delete cascade

---

## Supabase Config

- Project ref: `loitfvqwekoxbamsoynd`
- Auth Site URL: `https://nuances-rosy.vercel.app`
- Redirect URLs: `https://nuances-rosy.vercel.app/**`
- Email confirmation: enabled (users must confirm before signing in)
- Key names: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (new format, not anon key)

---

## Dead Code (exists but unused — candidates for deletion)

- `components/onboarding-identity-client.tsx` — replaced by `onboarding-flow.tsx`
- `components/mode-carousel.tsx` — carousel removed from all screens
- `components/language-toggle.tsx` — floating toggle removed from layout
- `components/theme-toggle.tsx` — floating toggle removed from layout
- `app/settings/page.tsx` — legacy, should be merged into `/account`

---

## Deployment

- **Platform**: Vercel (auto-deploys on push to `main`)
- **URL**: https://nuances-rosy.vercel.app
- **Repo**: https://github.com/jsphbngrnd/nuances (private)
- **Env vars set in Vercel**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **Still needed in Vercel**: `NEXT_PUBLIC_APP_URL`, `LIVEKIT_*`, `OPENAI_*`, `TRUST_SCORE_MINIMUM`, `SUPABASE_SERVICE_ROLE_KEY`

---

## Decisions Made

| Decision | Rationale |
|---|---|
| Middleware runs Node.js runtime (not Edge) | Supabase JS uses Node APIs not available in Edge runtime |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` not `ANON_KEY` | Supabase new key format (sb_publishable_*) |
| Dark mode always default | User preference — time-based logic removed |
| Language + theme in Account settings | Removed floating toggles that cluttered the UI |
| Mode cards: emoji/duration + name + short label only | Design from Direction C — no tagline in card |
| No carousel anywhere | User decision — use 2×2 grid or stacked list |
| Bottom nav: Home/Start/Reconnects/Account | Settings replaced by Account — more useful |
| `next.config.ts` typedRoutes: true | Enforces typed `href` on all `<Link>` — requires `as const` on href arrays |
