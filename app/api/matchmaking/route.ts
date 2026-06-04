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
  const { data } = await admin.from("users").select("id").eq("id", userId).single();
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

async function tryMatch(admin: ReturnType<typeof adminClient>, userId: string, mode: string) {
  if (!admin) return NextResponse.json({ matched: false, error: "No admin client" });

  // Try same mode first, then any mode as fallback
  const queries = [
    admin.from("matchmaking_queue").select("*").eq("mode", mode).eq("status", "waiting").neq("user_id", userId).order("created_at", { ascending: true }).limit(1),
    admin.from("matchmaking_queue").select("*").eq("status", "waiting").neq("user_id", userId).order("created_at", { ascending: true }).limit(1),
  ];

  let partner = null;
  for (const query of queries) {
    const { data, error } = await query;
    if (error) console.error("[matchmaking] candidate query error:", error.message);
    if (data?.[0]) { partner = data[0]; break; }
  }

  if (!partner) {
    console.log("[matchmaking] no partner found for", userId, "mode:", mode);
    return NextResponse.json({ matched: false });
  }

  console.log("[matchmaking] found partner", partner.user_id, "for", userId);

  const { data: room, error: roomErr } = await admin.from("rooms")
    .insert({ mode: partner.mode === mode ? mode : mode, status: "live" })
    .select().single();

  if (roomErr || !room) {
    console.error("[matchmaking] room creation error:", roomErr?.message);
    return NextResponse.json({ matched: false, error: roomErr?.message });
  }

  const { error: partErr } = await admin.from("room_participants").insert([
    { room_id: room.id, user_id: userId },
    { room_id: room.id, user_id: partner.user_id },
  ]);

  if (partErr) console.error("[matchmaking] participants error:", partErr.message);

  await admin.from("matchmaking_queue")
    .update({ status: "matched", matched_at: new Date().toISOString() })
    .in("user_id", [userId, partner.user_id]);

  console.log("[matchmaking] matched", userId, "with", partner.user_id, "in room", room.id);
  return NextResponse.json({ matched: true, roomId: room.id });
}

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());
  const supabase = await authClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = adminClient();
  if (!admin) {
    console.error("[matchmaking] SUPABASE_SERVICE_ROLE_KEY not set");
    return NextResponse.json({ matched: false, error: "SUPABASE_SERVICE_ROLE_KEY not set in Vercel env vars" });
  }

  if (body.action === "enter" && body.mode) {
    await ensureUserExists(admin, user.id);

    // Cancel existing waiting entry
    const { error: cancelErr } = await admin.from("matchmaking_queue")
      .update({ status: "cancelled" })
      .eq("user_id", user.id)
      .eq("status", "waiting");
    if (cancelErr) console.error("[matchmaking] cancel error:", cancelErr.message);

    const { error: insertErr } = await admin.from("matchmaking_queue")
      .insert({ user_id: user.id, mode: body.mode, language: "en", country: "unknown", status: "waiting" });

    if (insertErr) {
      console.error("[matchmaking] queue insert error:", insertErr.message);
      return NextResponse.json({ matched: false, error: insertErr.message });
    }

    console.log("[matchmaking] user", user.id, "entered queue for mode:", body.mode);
    return tryMatch(admin, user.id, body.mode);
  }

  if (body.action === "poll") {
    const { data: entry, error: entryErr } = await admin.from("matchmaking_queue")
      .select("*").eq("user_id", user.id).eq("status", "waiting").single();

    // Check if already matched
    const { data: matched } = await admin.from("matchmaking_queue")
      .select("*").eq("user_id", user.id).eq("status", "matched")
      .order("matched_at", { ascending: false }).limit(1).single();

    if (matched) {
      const { data: room } = await admin.from("room_participants")
        .select("room_id").eq("user_id", user.id)
        .order("joined_at", { ascending: false }).limit(1).single();
      return NextResponse.json({ matched: true, roomId: room?.room_id });
    }

    if (!entry) return NextResponse.json({ matched: false });
    return tryMatch(admin, user.id, entry.mode);
  }

  if (body.action === "leave") {
    await admin.from("matchmaking_queue")
      .update({ status: "cancelled" }).eq("user_id", user.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ matched: false });
}
