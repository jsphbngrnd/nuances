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
    return NextResponse.json({ error: "No API key" }, { status: 500 });
  }

  const transcript = messages
    .map(m => `${m.who === "you" ? "You" : partnerAlias}: ${m.text}`)
    .join("\n");

  const systemPrompt = `You are generating a post-conversation summary for NUANCE, a structured conversation app.
The conversation was in "${mode}" mode on the topic: "${topic}".

Analyze the transcript and return a JSON object with exactly these fields:
{
  "summary": "2-3 sentence paragraph summarizing what happened in the conversation. Be specific about what was actually said — not generic.",
  "agreement": ["point where they aligned — specific, 1 sentence each", "..."],
  "disagreement": ["point where they diverged — specific, 1 sentence each"],
  "tags": ["3-5 single-word or short-phrase themes from the conversation"],
  "tone": "Two adjectives separated by · (e.g. Warm · Reflective)",
  "followup": "One thoughtful follow-up question based on where the conversation left off.",
  "recommendations": [
    {"kind": "Book", "title": "exact book title", "source": "Author name", "reason": "one sentence why this fits"},
    {"kind": "Podcast", "title": "podcast episode or show", "source": "show name", "reason": "one sentence why"},
    {"kind": "Essay", "title": "essay or article title", "source": "author or publication", "reason": "one sentence why"}
  ]
}

Rules:
- Be specific to what was actually discussed, not generic.
- Recommendations must be real, well-known works that genuinely relate to the conversation themes.
- If the conversation was short or didn't have much depth, be honest about that in the summary.
- Return only valid JSON, no markdown, no explanation.`;

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
