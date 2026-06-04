import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const roomId = request.nextUrl.searchParams.get("roomId");
  if (!roomId) return NextResponse.json({ error: "roomId required" }, { status: 400 });

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Ordered by joined_at — earliest entry speaks first
  const { data: participants } = await admin
    .from("room_participants")
    .select("user_id, joined_at, users(alias, display_name)")
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true });

  if (!participants || participants.length === 0) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const myIndex = participants.findIndex(p => p.user_id === user.id);
  const partnerEntry = participants.find(p => p.user_id !== user.id);
  const partnerUsers = partnerEntry?.users as any;

  return NextResponse.json({
    alias: partnerUsers?.alias ?? null,
    displayName: partnerUsers?.display_name ?? null,
    isFirst: myIndex === 0, // first joined = first to speak
  });
}
