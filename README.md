# NUANCE

NUANCE is a mobile-first web MVP for structured conversations between strangers. The product is designed around one core idea: meet through ideas, not profiles.

This scaffold includes:

- a polished App Router frontend for the main MVP screens
- mocked product flows for Debate, Deep, and Late Night
- typed route handlers for matchmaking, moderation, and summaries
- a Supabase schema for the MVP data model
- a topic seed script
- environment variable template for Supabase, LiveKit, and OpenAI

## Stack

- Next.js App Router
- Tailwind CSS
- Supabase for auth, Postgres, and realtime-ready data
- LiveKit integration seam for audio rooms
- OpenAI integration seams for moderation, transcription, and summaries

## Screens included

- landing page
- auth page
- onboarding flow
- home screen
- matchmaking waiting screen
- topic acceptance screen
- live room UI
- summary screen
- reconnects
- safety and settings

## Local setup

1. Install dependencies

```bash
npm install
```

2. Copy the environment template

```bash
cp .env.example .env.local
```

3. Start the app

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Key files

- `app/` contains the App Router screens and route handlers
- `components/` contains shared UI pieces
- `lib/` contains typed models, mock data, and backend-oriented helpers
- `supabase/schema.sql` contains the MVP schema
- `scripts/seed-topics.ts` prints topic seed SQL

## Seeding topics

Generate SQL for the initial topic library:

```bash
npm run seed:topics
```

Pipe the output into Supabase SQL if you want a ready-to-run insert script.

## Backend notes

- `app/api/matchmaking/route.ts` demonstrates the match contract and fallback logic.
- `app/api/messages/moderate/route.ts` demonstrates pre-delivery moderation behavior.
- `app/api/rooms/[id]/summary/route.ts` demonstrates end-of-room summary generation.
- `app/api/demo/reply/route.ts` generates a partner reply from the recent transcript, using OpenAI when `OPENAI_API_KEY` is configured and falling back to local simulation otherwise.

These handlers currently use local logic so the product can be reviewed without live credentials. They are structured to be replaced with Supabase queries, LiveKit room orchestration, and OpenAI API calls.

## Product decisions reflected here

- no video
- no public profiles
- no feed
- no open DMs outside mutual reconnect
- report and block affordances inside the room
- editorial, premium, black-and-bone visual direction

## Notes

- The older static prototype files already present in the workspace were left untouched.
- This scaffold is intended to be a solid internal prototype and implementation starting point, not a fully wired production app yet.
