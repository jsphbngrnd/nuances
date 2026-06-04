import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const bodySchema = z.object({
  mode: z.string(),
  topic: z.string(),
  partnerAlias: z.string(),
  roomId: z.string().optional(),
  locale: z.string().optional().default("en"),
  messages: z.array(z.object({
    who: z.enum(["you", "them"]),
    text: z.string(),
  })),
});

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());
  const { mode, topic, partnerAlias, roomId, locale, messages } = body;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No OpenAI API key — add OPENAI_API_KEY to Vercel environment variables" }, { status: 500 });
  }

  const transcript = messages
    .map(m => `${m.who === "you" ? "You" : partnerAlias}: ${m.text}`)
    .join("\n");

  const systemPrompt = `You are generating a brief post-conversation summary for Between Us. Respond entirely in ${locale === "fr" ? "French" : "English"}.
The conversation was in "${mode}" mode on the topic: "${topic}".

Return a JSON object with exactly these fields — keep everything short and grounded in what was actually said:
{
  "summary": "One sentence. What was the core of this exchange? Be specific, not generic.",
  "agreement": ["One thing they actually agreed on — quote or paraphrase from the conversation"],
  "disagreement": ["One real point of tension or divergence from the conversation"],
  "tags": ["2-3 short theme words or phrases"],
  "tone": "Two adjectives separated by · (e.g. Sharp · Honest)",
  "followup": "One short follow-up question that flows naturally from where they left off.",
  "recommendations": [
    {"kind": "Book or Essay or Film", "title": "real title", "source": "author or source", "reason": "one short sentence"}
  ]
}

Rules:
- Short. One entry per list. No padding.
- Only include what's directly supported by the transcript.
- If the conversation was brief, reflect that honestly — don't inflate.
- Return only valid JSON, no markdown, no extra text.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Transcript:\n${transcript}` },
      ],
      max_tokens: 800,
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[generate-summary] OpenAI error:", err?.error?.message);
    return NextResponse.json({ error: err?.error?.message ?? "OpenAI error" }, { status: 502 });
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "{}";

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Failed to parse summary" }, { status: 500 });
  }

  // Persist to summaries table so account stats (reach end) can be computed
  if (roomId) {
    try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
      );
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const admin = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { autoRefreshToken: false, persistSession: false } }
        );
        // Upsert so re-generating doesn't create duplicates
        await admin.from("summaries").upsert({
          room_id: roomId,
          summary_text: (parsed.summary as string) ?? "",
          agreement_points_json: parsed.agreement ?? [],
          disagreement_points_json: parsed.disagreement ?? [],
          summary_tags_json: parsed.tags ?? [],
        }, { onConflict: "room_id" });
      }
    } catch (e) {
      console.error("[generate-summary] persist error:", e);
      // Don't fail the request — summary is still returned to client
    }
  }

  return NextResponse.json(parsed);
}
