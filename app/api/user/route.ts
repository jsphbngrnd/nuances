import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const profileSchema = z.object({
  displayName: z.string().min(2).max(80),
  alias: z.string(),
  aliasFamily: z.string(),
  aliasStage: z.number().int().min(1).max(3),
  ageRange: z.string(),
  language: z.string(),
  country: z.string(),
  mood: z.string().optional().default(""),
  interests: z.string().optional().default(""),
  voiceEnabled: z.boolean().default(true),
  reconnectEnabled: z.boolean().default(true),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("users")
    .select("*, profiles_optional(*)")
    .eq("id", user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ profile: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = profileSchema.parse(await request.json());
  const interests = body.interests
    ? body.interests.split(",").map((i) => i.trim()).filter(Boolean)
    : [];

  const { error } = await supabase.from("users").upsert({
    id: user.id,
    display_name: body.displayName,
    alias: body.alias,
    alias_family: body.aliasFamily,
    alias_stage: body.aliasStage,
    age_range: body.ageRange,
    language: body.language,
    country: body.country,
    mood_default: body.mood,
    voice_enabled: body.voiceEnabled,
    reconnect_enabled: body.reconnectEnabled,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.from("profiles_optional").upsert({
    user_id: user.id,
    interests_json: interests,
  });

  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = profileSchema.partial().parse(await request.json());

  const update: Record<string, unknown> = {};
  if (body.displayName !== undefined) update.display_name = body.displayName;
  if (body.alias !== undefined) update.alias = body.alias;
  if (body.aliasFamily !== undefined) update.alias_family = body.aliasFamily;
  if (body.aliasStage !== undefined) update.alias_stage = body.aliasStage;
  if (body.ageRange !== undefined) update.age_range = body.ageRange;
  if (body.language !== undefined) update.language = body.language;
  if (body.country !== undefined) update.country = body.country;
  if (body.mood !== undefined) update.mood_default = body.mood;
  if (body.voiceEnabled !== undefined) update.voice_enabled = body.voiceEnabled;
  if (body.reconnectEnabled !== undefined) update.reconnect_enabled = body.reconnectEnabled;

  const { error } = await supabase.from("users").update(update).eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (body.interests !== undefined) {
    const interests = body.interests
      ? body.interests.split(",").map((i) => i.trim()).filter(Boolean)
      : [];
    await supabase.from("profiles_optional").upsert({
      user_id: user.id,
      interests_json: interests,
    });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
