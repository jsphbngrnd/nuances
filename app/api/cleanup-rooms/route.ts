import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "No service role key" });

  const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

  // Mark all rooms older than 30 minutes as ended
  const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { data, error } = await db
    .from("rooms")
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("status", "live")
    .lt("created_at", cutoff)
    .select("id");

  if (error) return NextResponse.json({ error: error.message });
  return NextResponse.json({ cleaned: data?.length ?? 0, rooms: data?.map(r => r.id) });
}
