import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const bodySchema = z.object({
  action: z.enum(["enter", "poll", "leave"]),
  mode: z.string().optional(),
});

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function ensureUser(db: any, userId: string) {
  const { data } = await db.from("users").select("id").eq("id", userId).maybeSingle();
  if (data) return;
  const adj = ["Wandering","Quiet","Patient","Curious","Silent"][Math.floor(Math.random()*5)];
  const noun = ["Echo","Mist","Fox","Moon","Tide"][Math.floor(Math.random()*5)];
  await db.from("users").insert({
    id: userId, display_name: adj+noun, alias: adj+noun,
    alias_family: "mixed", alias_stage: 1,
    age_range: "25-34", language: "en", country: "unknown", trust_score: 0.9,
  });
}

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = admin();
  if (!db) return NextResponse.json({ matched: false, error: "SUPABASE_SERVICE_ROLE_KEY missing" });

  // ── ENTER ────────────────────────────────────────────────────
  if (body.action === "enter" && body.mode) {
    await ensureUser(db, user.id);

    // Cancel only this user's waiting entries
    await db.from("matchmaking_queue")
      .update({ status: "cancelled" })
      .eq("user_id", user.id)
      .eq("status", "waiting");

    const { error: ie } = await db.from("matchmaking_queue")
      .insert({ user_id: user.id, mode: body.mode, language: "en", country: "unknown", status: "waiting" });
    if (ie) return NextResponse.json({ matched: false, error: `Insert failed: ${ie.message}` });

    return doMatch(db, user.id, body.mode);
  }

  // ── POLL ─────────────────────────────────────────────────────
  if (body.action === "poll") {
    // Find user's current waiting entry first — needed for time anchor
    const { data: entry } = await db.from("matchmaking_queue")
      .select("id, mode, created_at").eq("user_id", user.id).eq("status", "waiting")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();

    // Check room_participants — only rooms joined AFTER this queue entry was created
    // (prevents old rooms from hijacking new matchmaking attempts)
    if (entry) {
      const { data: rp } = await db.from("room_participants")
        .select("room_id").eq("user_id", user.id)
        .gte("joined_at", entry.created_at)
        .order("joined_at", { ascending: false }).limit(1).maybeSingle();
      if (rp?.room_id) return NextResponse.json({ matched: true, roomId: rp.room_id });
      return doMatch(db, user.id, entry.mode);
    }

    // No waiting entry — check for a very recent match (last 60s)
    const { data: rp } = await db.from("room_participants")
      .select("room_id").eq("user_id", user.id)
      .gte("joined_at", new Date(Date.now() - 60_000).toISOString())
      .order("joined_at", { ascending: false }).limit(1).maybeSingle();
    if (rp?.room_id) return NextResponse.json({ matched: true, roomId: rp.room_id });

    return NextResponse.json({ matched: false });
  }

  // ── LEAVE ────────────────────────────────────────────────────
  if (body.action === "leave") {
    await db.from("matchmaking_queue")
      .update({ status: "cancelled" }).eq("user_id", user.id).eq("status", "waiting");
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ matched: false });
}

async function doMatch(db: any, userId: string, mode: string) {
  // Use atomic Postgres function — SELECT FOR UPDATE SKIP LOCKED prevents
  // two concurrent calls from matching the same pair into different rooms
  const { data, error } = await db.rpc("try_match_user", {
    p_user_id: userId,
    p_mode: mode,
  });

  if (error) {
    console.error("[match] rpc error:", error.message);
    return NextResponse.json({ matched: false, error: error.message });
  }

  const result = Array.isArray(data) ? data[0] : data;
  if (!result?.matched) return NextResponse.json({ matched: false });

  console.log(`[match] ${userId} → room ${result.room_id}`);
  return NextResponse.json({ matched: true, roomId: result.room_id });
}
