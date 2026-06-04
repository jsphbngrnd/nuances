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

  const { data } = await admin
    .from("room_participants")
    .select("user_id, users(alias, display_name)")
    .eq("room_id", roomId)
    .neq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  const users = data?.users as any;
  return NextResponse.json({ alias: users?.alias ?? null, displayName: users?.display_name ?? null });
}
