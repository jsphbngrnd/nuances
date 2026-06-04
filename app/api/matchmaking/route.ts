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
    // Check room_participants first — most reliable
    const { data: rp } = await db.from("room_participants")
      .select("room_id").eq("user_id", user.id)
      .order("joined_at", { ascending: false }).limit(1).maybeSingle();
    if (rp?.room_id) return NextResponse.json({ matched: true, roomId: rp.room_id });

    // Find user's waiting entry
    const { data: entry } = await db.from("matchmaking_queue")
      .select("mode").eq("user_id", user.id).eq("status", "waiting")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!entry) return NextResponse.json({ matched: false });

    return doMatch(db, user.id, entry.mode);
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
  // Find any waiting partner (same mode preferred)
  const { data: allWaiting, error: qe } = await db
    .from("matchmaking_queue")
    .select("*")
    .eq("status", "waiting")
    .neq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(10);

  if (qe) return NextResponse.json({ matched: false, error: `Queue query: ${qe.message}` });

  if (!allWaiting || allWaiting.length === 0) {
    return NextResponse.json({ matched: false, waiting: 0 });
  }

  // Prefer same mode, fall back to any
  const partner = allWaiting.find((r: any) => r.mode === mode) ?? allWaiting[0];

  // Create room
  const { data: room, error: re } = await db.from("rooms")
    .insert({ mode, status: "live" }).select().single();
  if (re || !room) return NextResponse.json({ matched: false, error: `Room: ${re?.message}` });

  // Add participants
  const { error: pe } = await db.from("room_participants").insert([
    { room_id: room.id, user_id: userId },
    { room_id: room.id, user_id: partner.user_id },
  ]);
  if (pe) return NextResponse.json({ matched: false, error: `Participants: ${pe.message}` });

  // Mark queue entries matched
  await db.from("matchmaking_queue")
    .update({ status: "matched", matched_at: new Date().toISOString() })
    .eq("user_id", userId).eq("status", "waiting");
  await db.from("matchmaking_queue")
    .update({ status: "matched", matched_at: new Date().toISOString() })
    .eq("user_id", partner.user_id).eq("status", "waiting");

  console.log(`[match] ${userId} ↔ ${partner.user_id} → room ${room.id}`);
  return NextResponse.json({ matched: true, roomId: room.id });
}
