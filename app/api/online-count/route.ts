import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ count: 0 });

  const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

  // Count distinct users: in matchmaking queue (last 5 min) OR in active rooms
  const [{ count: q }, { count: r }] = await Promise.all([
    db.from("matchmaking_queue")
      .select("user_id", { count: "exact", head: true })
      .eq("status", "waiting")
      .gte("created_at", new Date(Date.now() - 5 * 60_000).toISOString()),
    db.from("room_participants")
      .select("user_id", { count: "exact", head: true })
      .eq("rooms.status", "live")
      .not("rooms", "is", null),
  ]);

  return NextResponse.json({ count: (q ?? 0) + (r ?? 0) });
}
