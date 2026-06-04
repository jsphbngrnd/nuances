import { NextResponse } from "next/server";
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js");
  return createClient(url, key);
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

async function tryMatch(admin: ReturnType<typeof adminClient>, userId: string, mode: string) {
  const { data: candidates } = await admin!.from("matchmaking_queue")
    .select("*")
    .eq("mode", mode)
    .eq("status", "waiting")
    .neq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1);

  const partner = candidates?.[0];
  if (!partner) return NextResponse.json({ matched: false });

  const { data: room, error: roomErr } = await admin!.from("rooms")
    .insert({ mode, status: "live" })
    .select()
    .single();

  if (roomErr || !room) return NextResponse.json({ matched: false });

  await admin!.from("room_participants").insert([
    { room_id: room.id, user_id: userId },
    { room_id: room.id, user_id: partner.user_id },
  ]);

  await admin!.from("matchmaking_queue")
    .update({ status: "matched", matched_at: new Date().toISOString() })
    .in("user_id", [userId, partner.user_id]);

  return NextResponse.json({ matched: true, roomId: room.id });
}

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());
  const supabase = await authClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = adminClient();
  if (!admin) {
    return NextResponse.json({ matched: false, error: "SUPABASE_SERVICE_ROLE_KEY not set" });
  }

  if (body.action === "enter" && body.mode) {
    // Cancel any existing entry then insert fresh
    await admin.from("matchmaking_queue")
      .update({ status: "cancelled" }).eq("user_id", user.id);
    await admin.from("matchmaking_queue")
      .insert({ user_id: user.id, mode: body.mode, language: "en", country: "unknown", status: "waiting" });
    return tryMatch(admin, user.id, body.mode);
  }

  if (body.action === "poll") {
    const { data: entry } = await admin.from("matchmaking_queue")
      .select("*").eq("user_id", user.id).single();
    if (!entry) return NextResponse.json({ matched: false });
    if (entry.status === "matched") {
      const { data: room } = await admin.from("room_participants")
        .select("room_id").eq("user_id", user.id)
        .order("joined_at", { ascending: false }).limit(1).single();
      return NextResponse.json({ matched: true, roomId: room?.room_id });
    }
    return tryMatch(admin, user.id, entry.mode);
  }

  if (body.action === "leave") {
    await admin.from("matchmaking_queue")
      .update({ status: "cancelled" }).eq("user_id", user.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ matched: false });
}
