# NUANCE — Product Specification

## Concept

NUANCE matches two strangers for short, structured conversations around a shared topic.
No profiles. No feed. No follower counts. No public identity.
You enter with an alias. You talk to one person. You leave with a summary.

The product is dark-first, mobile-first, bilingual (EN/FR), and runs inside a device shell UI on desktop.

---

## User Flows

### 1. Sign Up
Landing (`/`) → Auth (`/auth`, sign up tab) → Email confirmation → Onboarding (`/onboarding`, 5 steps) → Home (`/home`)

### 2. Sign In
Landing (`/`) → Auth (`/auth`, sign in tab) → Home (`/home`)

### 3. Start a Conversation
Home → Start (`/start`) → Matchmaking (`/matchmaking?mode=X`) → Topic (`/topic?mode=X`) → Room (`/room/[id]`) → Summary (`/summary/[id]`)

### 4. Reconnect
Summary → vote to reconnect → Reconnects (`/reconnects`) → Room (reopen thread)

### 5. Account Management
Anywhere via nav → Account (`/account`) → edit profile, change language/theme, sign out, delete account

---

## Screens

### Public
| Route | Description | Status |
|---|---|---|
| `/` | Marketing landing page. Hero, stats, mode grid, CTAs. | ✅ Built |
| `/auth` | Sign in / create account. Email + password. | ✅ Built |
| `/auth/callback` | Supabase email confirmation redirect. | ✅ Built |
| `/demo` | Autonomous demo — 4 AI personas talking. Self-running prototype. | ✅ Built (mock) |

### Onboarding (post-signup, unauthenticated users blocked)
| Route | Description | Status |
|---|---|---|
| `/onboarding` | 5-step flow: Language → Platform intro → Conduct rules → Alias → Profile | ✅ Built |

### App (authenticated)
| Route | Description | Status |
|---|---|---|
| `/home` | Profile chip, mode grid (2×2), online count, quote of the day. | ✅ Built |
| `/start` | Detailed mode cards with structure, duration, tone. Launch matchmaking. | ✅ Built (prototype) |
| `/matchmaking` | Searching animation. Shows mode being searched. Cancel or simulate match. | ⚠️ Prototype only |
| `/topic` | Topic acceptance. Both users see the topic, can reroll (max 2) or accept. | ⚠️ Prototype only |
| `/room/[id]` | Live conversation room. Text + voice (LiveKit). Moderation. Timer. | ⚠️ Prototype only |
| `/summary/[id]` | Post-conversation summary. Themes, tags, tone. Reconnect option. | ⚠️ Prototype only |
| `/reconnects` | Mutual reconnect threads. Shows alias, last topic, status. | ⚠️ Mock data |
| `/account` | Edit profile, preferences, language, theme, sign out, delete account. | ✅ Built |
| `/settings` | Legacy safety settings page. Should be merged into /account. | ⚠️ Legacy |

---

## Onboarding Steps (detail)

1. **Language** — Pick EN or FR. Sets locale cookie.
2. **Intro** — 4 key points: two strangers / one topic / full structure / no profiles.
3. **Conduct rules** — 8 rules. Must scroll to bottom, then accept checkbox.
4. **Alias** — Generated alias with 2 rerolls. "OracleDuVendredi" style.
5. **Profile** — Display name (optional), age range, country, mood, interests, toggles (voice, reconnects).
On completion: saves to `public.users` + `public.profiles_optional`. Redirects to `/home`.

---

## Conversation Flow (detail)

### Matchmaking (`/matchmaking`)
- User selects a mode on `/start`
- Enters matchmaking queue in Supabase (`matchmaking_queue` table)
- System finds another user: same mode + same language + trust score ≥ minimum
- Creates a `room` record, two `room_participants` records
- Both users redirect to `/topic?mode=X`

### Topic Acceptance (`/topic`)
- Server fetches a random active topic from `public.topics` for the mode
- Both users see the same topic simultaneously (via polling or realtime)
- Each user votes: accept or reroll
- If either rerolls → new topic (max 2 rerolls total per pair per session)
- After 2 rerolls with no match → rematch (back to matchmaking)
- Both accept → redirect to `/room/[id]`

### Live Room (`/room/[id]`)
- LiveKit room for voice; text fallback in parallel
- Timer per mode: Debate 4min / Funny 3min / Deep 5min / Late Night 5min
- Structured turns (opening → reply → closing → free) except Late Night (free)
- Messages written to `public.messages` with `moderation_status = 'pending'`
- AI moderation via `/api/messages/moderate` → marks messages approved/blocked
- Blocked messages shown with explanation to sender
- Users can report or block at any time → writes to `public.reports`
- Room ends when timer expires or either user hits End
- Room status → `ended`, redirect to `/summary/[id]`

### Summary (`/summary/[id]`)
- AI summary generated via `/api/rooms/[id]/summary` (OpenAI)
- Stores in `public.summaries`: text, agreement_points, disagreement_points, tags, emotional_tone
- Shows: themes, tags, tone, follow-up question, recommendations
- Reconnect vote: each user can vote to reconnect (mutual opt-in only)
- If both vote yes → creates `public.reconnects` record with `matched_at`

---

## Modes

| Mode | Emoji | Duration | Structure | Cadence |
|---|---|---|---|---|
| Debate | ⚔️ | 4 min | Structured turns | Fast |
| Funny | 😂 | 3 min | Open exchange | Fast |
| Deep | 🧠 | 5 min | Guided opening then free | Slow |
| Late Night | 🌙 | 5 min | Open, AI-prompted if silent | Soft |

---

## Alias System

- Each user gets a generated alias from 12 alias families (e.g. "OracleDuVendredi")
- Stage 1→2→3 as user accumulates conversations
- Stored in `public.users`: `alias`, `alias_family`, `alias_stage`
- Max 2 rerolls during onboarding

---

## Trust Score

- Each user starts at 0.900 (out of 1.000)
- Decreased by: blocked messages, reports, severe violations
- Minimum to enter queue: configurable (`TRUST_SCORE_MINIMUM` env var, default 0.45)
- Users below minimum cannot join matchmaking

---

## Data Model (Supabase)

```
auth.users                  ← Supabase Auth
public.users                ← profile, alias, trust_score, settings
public.profiles_optional    ← interests_json, bio_short
public.topics               ← conversation topics per mode
public.matchmaking_queue    ← users waiting for a match
public.rooms                ← conversation sessions
public.room_participants    ← who was in each room
public.room_topic_votes     ← accept/reroll votes per topic
public.messages             ← all text/voice transcript messages
public.turns                ← structured turn records
public.reports              ← user reports
public.reconnects           ← mutual reconnect records
public.summaries            ← AI-generated post-conversation summaries
public.recommendations      ← content recommendations
public.recommendation_tags  ← tags on recommendations
public.room_recommendations ← which recs shown in which room
public.user_clicks          ← recommendation interactions
public.analytics_events     ← general event tracking
```

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/user` | GET / POST / PUT / DELETE | User profile CRUD |
| `/api/locale` | POST | Set language cookie |
| `/api/identity` | POST | Set alias cookie (legacy) |
| `/api/matchmaking` | POST | Enter/check matchmaking queue |
| `/api/messages/moderate` | POST | Run OpenAI moderation on a message |
| `/api/rooms/[id]/summary` | POST | Generate AI summary for a room |
| `/api/demo/reply` | POST | AI reply for autonomous demo |
| `/auth/callback` | GET | Supabase email confirmation exchange |

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (server only) |
| `LIVEKIT_URL` | LiveKit WebSocket URL |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit secret |
| `OPENAI_API_KEY` | OpenAI key |
| `OPENAI_CHAT_MODEL` | Chat model (gpt-4.1-mini) |
| `OPENAI_MODERATION_MODEL` | Moderation model |
| `OPENAI_TRANSCRIPTION_MODEL` | Voice transcription model |
| `OPENAI_SUMMARY_MODEL` | Summary generation model |
| `TRUST_SCORE_MINIMUM` | Min trust score for matchmaking (0.45) |
| `NEXT_PUBLIC_APP_URL` | Deployed URL (for email redirects) |

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Auth + DB**: Supabase (PostgreSQL + Auth + RLS)
- **Voice**: LiveKit
- **AI**: OpenAI (chat, moderation, transcription, summary)
- **Styling**: Tailwind CSS v3 + custom design tokens (NUANCE Style Guide)
- **Fonts**: Concrette (display serif) + Beausite (sans + caps)
- **Deploy**: Vercel

---

## Design System

- **Token file**: `app/globals.css` — CSS vars for dark (default) + day theme
- **Tailwind config**: `tailwind.config.ts` — semantic colors, type scale, radii, shadows
- **Dark first**: `<html class="dark">` by default; day only if user sets it in Account
- **Theme switch**: Account page → Display section
- **Language switch**: Account page → Display section (sets cookie via `/api/locale`)
- **Fonts registered**: `app/layout.tsx` via `next/font/local`

---

## What Still Needs to Be Built

### High priority (core product)
- [ ] Real matchmaking — connect `/api/matchmaking` to Supabase queue, polling or realtime
- [ ] Real topic system — seed topics via `npm run seed:topics`, serve from DB not mock data
- [ ] Real room — wire LiveKit session creation to matched room, pass token to `LiveRoom`
- [ ] Real voice — LiveKit voice integration in `LiveRoom` component
- [ ] Real moderation — call `/api/messages/moderate` on every message, enforce blocks
- [ ] Real summary — auto-trigger `/api/rooms/[id]/summary` when room ends
- [ ] Real reconnects — read from `public.reconnects` not mock data

### Medium priority
- [ ] Trust score enforcement in matchmaking queue
- [ ] Topic reroll logic — real two-user coordination (Supabase realtime or polling)
- [ ] Report flow — UI for reporting a user mid-room
- [ ] Room timer — live countdown that ends room when it hits zero
- [ ] Structured turn enforcement — for Debate/Deep modes

### Lower priority
- [ ] Recommendations system — post-summary content recommendations
- [ ] Analytics events — track key actions
- [ ] Merge `/settings` into `/account` (legacy page)
- [ ] Push notifications (reconnect alerts)
