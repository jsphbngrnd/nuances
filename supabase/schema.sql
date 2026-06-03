create extension if not exists pgcrypto;

create type queue_status as enum ('waiting', 'matched', 'cancelled');
create type room_status as enum ('pending_topic', 'live', 'ended', 'cancelled');
create type moderation_status as enum ('pending', 'approved', 'blocked');
create type source_type as enum ('text', 'speech_transcript', 'system');
create type turn_type as enum ('opening', 'reply', 'closing', 'free');
create type room_rating as enum ('good', 'neutral', 'uncomfortable');
create type recommendation_type as enum ('book', 'podcast', 'article', 'film', 'app', 'course');
create type recommendation_action as enum ('click', 'save', 'purchase');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  display_name text not null,
  alias text not null default 'OracleDuVendredi',
  alias_family text,
  alias_stage integer not null default 1,
  age_range text not null,
  language text not null,
  country text not null,
  mood_default text,
  voice_enabled boolean not null default true,
  reconnect_enabled boolean not null default true,
  trust_score numeric(4, 3) not null default 0.900,
  is_banned boolean not null default false
);

alter table public.users add column if not exists alias text not null default 'OracleDuVendredi';
alter table public.users add column if not exists alias_family text;
alter table public.users add column if not exists alias_stage integer not null default 1;

create table if not exists public.profiles_optional (
  user_id uuid primary key references public.users(id) on delete cascade,
  interests_json jsonb not null default '[]'::jsonb,
  bio_short text
);

create table if not exists public.matchmaking_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  mode text not null check (mode in ('debate', 'funny', 'deep', 'late-night')),
  language text not null,
  compatible_languages text[] not null default '{}'::text[],
  country text not null,
  status queue_status not null default 'waiting',
  created_at timestamptz not null default now(),
  matched_at timestamptz
);

create unique index if not exists matchmaking_queue_one_waiting_per_user
  on public.matchmaking_queue(user_id)
  where status = 'waiting';

create index if not exists matchmaking_queue_match_index
  on public.matchmaking_queue(mode, language, status, created_at);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  mode text not null check (mode in ('debate', 'funny', 'deep', 'late-night')),
  text text not null,
  category text,
  difficulty text not null default 'balanced',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  mode text not null check (mode in ('debate', 'funny', 'deep', 'late-night')),
  status room_status not null default 'pending_topic',
  topic_id uuid references public.topics(id),
  livekit_room_name text,
  created_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists public.room_participants (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  reconnect_vote boolean,
  room_rating room_rating,
  unique (room_id, user_id)
);

create table if not exists public.room_topic_votes (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  vote text not null check (vote in ('accept', 'reroll')),
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  source_type source_type not null,
  content text not null,
  moderation_status moderation_status not null default 'pending',
  moderation_reason text,
  created_at timestamptz not null default now()
);

create index if not exists messages_room_created_at_idx
  on public.messages(room_id, created_at);

create table if not exists public.turns (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  round_number integer not null default 1,
  user_id uuid not null references public.users(id) on delete cascade,
  turn_type turn_type not null,
  duration_seconds integer not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  reporter_user_id uuid not null references public.users(id) on delete cascade,
  reported_user_id uuid not null references public.users(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reconnects (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_a_id uuid not null references public.users(id) on delete cascade,
  user_b_id uuid not null references public.users(id) on delete cascade,
  user_a_vote boolean,
  user_b_vote boolean,
  matched_at timestamptz
);

create unique index if not exists reconnects_room_unique on public.reconnects(room_id);

create table if not exists public.summaries (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  summary_text text not null,
  agreement_points_json jsonb not null default '[]'::jsonb,
  disagreement_points_json jsonb not null default '[]'::jsonb,
  summary_tags_json jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now()
);

create unique index if not exists summaries_room_unique on public.summaries(room_id);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type recommendation_type not null,
  short_description text not null,
  conversation_modes text[] not null default '{}'::text[],
  emotional_tones text[] not null default '{}'::text[],
  url text not null,
  image_url text not null,
  affiliate_url text,
  sponsor_label text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists recommendations_active_type_idx
  on public.recommendations(active, type);

create table if not exists public.recommendation_tags (
  id uuid primary key default gen_random_uuid(),
  recommendation_id uuid not null references public.recommendations(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now()
);

create index if not exists recommendation_tags_lookup_idx
  on public.recommendation_tags(tag, recommendation_id);

create table if not exists public.room_recommendations (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  recommendation_id uuid not null references public.recommendations(id) on delete cascade,
  position integer not null check (position between 1 and 3),
  source_surface text not null check (source_surface in ('summary', 'reconnect')),
  sponsor_shown boolean not null default false,
  created_at timestamptz not null default now(),
  unique (room_id, recommendation_id, source_surface)
);

create index if not exists room_recommendations_room_idx
  on public.room_recommendations(room_id, source_surface, position);

create table if not exists public.user_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  room_id uuid references public.rooms(id) on delete set null,
  recommendation_id uuid references public.recommendations(id) on delete set null,
  action recommendation_action not null,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists user_clicks_recommendation_action_idx
  on public.user_clicks(recommendation_id, action, created_at desc);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  room_id uuid references public.rooms(id) on delete set null,
  event_name text not null,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_name_created_at_idx
  on public.analytics_events(event_name, created_at desc);

alter table public.users enable row level security;
alter table public.profiles_optional enable row level security;
alter table public.matchmaking_queue enable row level security;
alter table public.rooms enable row level security;
alter table public.room_participants enable row level security;
alter table public.room_topic_votes enable row level security;
alter table public.messages enable row level security;
alter table public.turns enable row level security;
alter table public.reports enable row level security;
alter table public.reconnects enable row level security;
alter table public.summaries enable row level security;
alter table public.recommendations enable row level security;
alter table public.recommendation_tags enable row level security;
alter table public.room_recommendations enable row level security;
alter table public.user_clicks enable row level security;
alter table public.analytics_events enable row level security;
alter table public.topics enable row level security;

create policy "topics are readable to authenticated users"
  on public.topics for select
  to authenticated
  using (active = true);

create policy "users can read their own profile"
  on public.users for select
  to authenticated
  using (auth.uid() = id);

create policy "users can update their own profile"
  on public.users for update
  to authenticated
  using (auth.uid() = id);

create policy "users can insert their own queue entry"
  on public.matchmaking_queue for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can read their own queue entry"
  on public.matchmaking_queue for select
  to authenticated
  using (auth.uid() = user_id);

create policy "active recommendations are readable to authenticated users"
  on public.recommendations for select
  to authenticated
  using (active = true);

create policy "recommendation tags are readable to authenticated users"
  on public.recommendation_tags for select
  to authenticated
  using (
    exists (
      select 1
      from public.recommendations
      where public.recommendations.id = recommendation_tags.recommendation_id
        and public.recommendations.active = true
    )
  );

create policy "users can read room recommendations for their rooms"
  on public.room_recommendations for select
  to authenticated
  using (
    exists (
      select 1
      from public.room_participants
      where public.room_participants.room_id = room_recommendations.room_id
        and public.room_participants.user_id = auth.uid()
    )
  );

create policy "users can insert their own recommendation events"
  on public.user_clicks for insert
  to authenticated
  with check (user_id = auth.uid() or user_id is null);

create policy "users can read their own recommendation events"
  on public.user_clicks for select
  to authenticated
  using (user_id = auth.uid());
