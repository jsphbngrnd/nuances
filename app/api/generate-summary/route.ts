import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  mode: z.string(),
  topic: z.string(),
  partnerAlias: z.string(),
  messages: z.array(z.object({
    who: z.enum(["you", "them"]),
    text: z.string(),
  })),
});

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());
  const { mode, topic, partnerAlias, messages } = body;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No OpenAI API key — add OPENAI_API_KEY to Vercel environment variables" }, { status: 500 });
  }

  const transcript = messages
    .map(m => `${m.who === "you" ? "You" : partnerAlias}: ${m.text}`)
    .join("\n");

  const systemPrompt = `You are generating a brief post-conversation summary for NUANCE.
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

  try {
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to parse summary" }, { status: 500 });
  }
}
