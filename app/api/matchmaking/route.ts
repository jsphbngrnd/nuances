import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const bodySchema = z.object({
  action: z.enum(["enter", "poll", "leave"]),
  mode: z.string().optional(),
});

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function authClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) => c.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        ),
      },
    }
  );
}

async function ensureUserExists(admin: ReturnType<typeof adminClient>, userId: string) {
  if (!admin) return;
  const { data } = await admin.from("users").select("id").eq("id", userId).maybeSingle();
  if (!data) {
    const adj = ["Wandering","Quiet","Patient","Curious","Silent","Distant","Gentle","Pensive"][Math.floor(Math.random()*8)];
    const noun = ["Echo","Mist","Fox","Moon","Tide","Cloud","Compass","Oracle"][Math.floor(Math.random()*8)];
    const alias = adj + noun;
    const { error } = await admin.from("users").insert({
      id: userId, display_name: alias, alias,
      alias_family: "mixed", alias_stage: 1,
      age_range: "25-34", language: "en", country: "unknown", trust_score: 0.9,
    });
    if (error) console.error("[matchmaking] ensureUser error:", error.message);
    else console.log("[matchmaking] created user record for", userId, "as", alias);
  }
}

// Check if user is already in a live room (created in last 30 min)
async function checkExistingRoom(admin: ReturnType<typeof adminClient>, userId: string) {
  if (!admin) return null;
  const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { data } = await admin
    .from("room_participants")
    .select("room_id, rooms!inner(status, created_at)")
    .eq("user_id", userId)
    .eq("rooms.status", "live")
    .gte("rooms.created_at", cutoff)
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.room_id ?? null;
}

async function tryMatch(admin: ReturnType<typeof adminClient>, userId: string, mode: string) {
  if (!admin) return NextResponse.json({ matched: false, error: "No admin client" });

  // First check if already in a room
  const existingRoom = await checkExistingRoom(admin, userId);
  if (existingRoom) {
    console.log("[matchmaking] user", userId, "already in room", existingRoom);
    return NextResponse.json({ matched: true, roomId: existingRoom });
  }

  // Find a partner — try same mode first, then any mode
  let partner = null;
  for (const filter of [
    (q: any) => q.eq("mode", mode),
    (q: any) => q, // any mode
  ]) {
    const { data, error } = await filter(
      admin.from("matchmaking_queue")
        .select("*")
        .eq("status", "waiting")
        .neq("user_id", userId)
    ).order("created_at", { ascending: true }).limit(1);

    if (error) console.error("[matchmaking] query error:", error.message);
    if (data?.[0]) { partner = data[0]; break; }
  }

  if (!partner) {
    console.log("[matchmaking] no partner for", userId, "(mode:", mode, ")");
    return NextResponse.json({ matched: false });
  }

  console.log("[matchmaking] matched", userId, "with", partner.user_id);

  const { data: room, error: roomErr } = await admin.from("rooms")
    .insert({ mode, status: "live" })
    .select().single();

  if (roomErr || !room) {
    console.error("[matchmaking] room creation failed:", roomErr?.message);
    return NextResponse.json({ matched: false, error: roomErr?.message });
  }

  await admin.from("room_participants").insert([
    { room_id: room.id, user_id: userId },
    { room_id: room.id, user_id: partner.user_id },
  ]);

  // Mark matched entries (use maybeSingle-safe bulk update)
  await admin.from("matchmaking_queue")
    .update({ status: "matched", matched_at: new Date().toISOString() })
    .eq("user_id", userId).eq("status", "waiting");
  await admin.from("matchmaking_queue")
    .update({ status: "matched", matched_at: new Date().toISOString() })
    .eq("user_id", partner.user_id).eq("status", "waiting");

  console.log("[matchmaking] room created:", room.id);
  return NextResponse.json({ matched: true, roomId: room.id });
}

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());
  const supabase = await authClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = adminClient();
  if (!admin) {
    return NextResponse.json({ matched: false, error: "SUPABASE_SERVICE_ROLE_KEY not configured" });
  }

  if (body.action === "enter" && body.mode) {
    await ensureUserExists(admin, user.id);

    // Cancel only existing WAITING entries (never cancel matched ones)
    await admin.from("matchmaking_queue")
      .update({ status: "cancelled" })
      .eq("user_id", user.id)
      .eq("status", "waiting");

    const { error: insertErr } = await admin.from("matchmaking_queue")
      .insert({ user_id: user.id, mode: body.mode, language: "en", country: "unknown", status: "waiting" });

    if (insertErr) {
      console.error("[matchmaking] insert error:", insertErr.message);
      return NextResponse.json({ matched: false, error: insertErr.message });
    }

    return tryMatch(admin, user.id, body.mode);
  }

  if (body.action === "poll") {
    // Primary: check room_participants (most reliable — not affected by queue corruption)
    const roomId = await checkExistingRoom(admin, user.id);
    if (roomId) return NextResponse.json({ matched: true, roomId });

    // Fallback: try to find a match
    const { data: waiting } = await admin.from("matchmaking_queue")
      .select("mode").eq("user_id", user.id).eq("status", "waiting")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (!waiting) return NextResponse.json({ matched: false });
    return tryMatch(admin, user.id, waiting.mode);
  }

  if (body.action === "leave") {
    await admin.from("matchmaking_queue")
      .update({ status: "cancelled" }).eq("user_id", user.id).eq("status", "waiting");
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ matched: false });
}
