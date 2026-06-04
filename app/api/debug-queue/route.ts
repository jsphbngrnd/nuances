import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "No service role key" });

  const { createClient } = require("@supabase/supabase-js");
  const admin = createClient(url, key);

  const [queue, users, rooms] = await Promise.all([
    admin.from("matchmaking_queue").select("*").order("created_at", { ascending: false }).limit(20),
    admin.from("users").select("id, alias, display_name, created_at").order("created_at", { ascending: false }).limit(10),
    admin.from("rooms").select("*").order("created_at", { ascending: false }).limit(10),
  ]);

  return NextResponse.json({
    queue: queue.data,
    queueError: queue.error?.message,
    users: users.data,
    usersError: users.error?.message,
    rooms: rooms.data,
    roomsError: rooms.error?.message,
  });
}
