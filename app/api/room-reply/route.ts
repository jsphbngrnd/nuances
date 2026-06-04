import { NextResponse } from "next/server";
import { z } from "zod";
import { AI_PERSONAS } from "@/lib/nuance-data";

const bodySchema = z.object({
  mode: z.string(),
  topic: z.string(),
  personaId: z.string().optional(),
  locale: z.string().optional().default("en"),
  messages: z.array(z.object({
    who: z.enum(["you", "them"]),
    text: z.string(),
  })),
  userMessage: z.string(),
});

const MODE_INSTRUCTIONS: Record<string, string> = {
  debate: "You are in a structured debate. Take a clear position and defend it. Push back when you disagree. Be sharp but fair.",
  funny: "You are in a playful hot-take exchange. Be quick, witty, a little absurd. Light and fast.",
  deep: "You are in a reflective conversation. Answer honestly and specifically. Ask back occasionally.",
  "late-night": "You are in a late-night open room. Be warm, present, and unhurried. Let things land.",
};

// Default persona when no AI_PERSONAS are specified or none match the mode
const DEFAULT_PERSONA_PROMPT = `You are VoyageuseSereine — thoughtful, honest, slightly philosophical. You don't perform depth, you just have it. You are French but your messages are translated to English.`;

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());
  const { mode, topic, personaId, locale, messages, userMessage } = body;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: "(No OpenAI API key — add OPENAI_API_KEY to your environment variables)" });
  }

  // Select persona: use specified one, or pick best match for mode, or random
  let persona = AI_PERSONAS.find(p => p.id === personaId);
  if (!persona) {
    const modeMatches = AI_PERSONAS.filter(p => p.modes.includes(mode as any));
    const pool = modeMatches.length > 0 ? modeMatches : AI_PERSONAS;
    if (pool.length > 0) {
      persona = pool[Math.floor(Math.random() * pool.length)];
    }
  }

  const personaPrompt = persona?.systemPrompt ?? DEFAULT_PERSONA_PROMPT;
  const modeInstruction = MODE_INSTRUCTIONS[mode] ?? MODE_INSTRUCTIONS.deep;

  const history = messages.map(m => ({
    role: m.who === "you" ? ("user" as const) : ("assistant" as const),
    content: m.text,
  }));

  const systemPrompt = `${personaPrompt}

Topic: "${topic}"
Mode: ${mode}

${modeInstruction}

Language: Respond ONLY in ${locale === "fr" ? "French" : "English"}. Always.

Critical rules:
- Always lead with YOUR OWN genuine opinion or position first. Say what you actually think before reacting to theirs.
- Only challenge or question AFTER stating your own view. Don't just reflect their words back — take a stand.
- 1 to 3 sentences. No more.
- Be specific and concrete — no vague generalities.
- Vary your sentence starters — don't begin with "I" every time.
- Never compliment what they said. Never say "That's interesting" or similar filler.
- If you agree, say so briefly and then add something they didn't say.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: userMessage },
      ],
      max_tokens: 150,
      temperature: 0.85,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const isQuota = errData?.error?.code === "insufficient_quota";
    const reply = isQuota
      ? "(OpenAI quota exceeded — add credits at platform.openai.com/settings/billing)"
      : "Sorry, something went wrong. Try again.";
    console.error("[room-reply] OpenAI error:", errData?.error?.message);
    return NextResponse.json({ reply, persona: persona?.alias ?? "VoyageuseSereine" });
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content?.trim() ?? "…";

  return NextResponse.json({
    reply,
    persona: persona?.alias ?? "VoyageuseSereine",
    personaId: persona?.id,
    language: persona?.language ?? "French",
  });
}
