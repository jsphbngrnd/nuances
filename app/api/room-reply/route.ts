import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  mode: z.string(),
  topic: z.string(),
  messages: z.array(z.object({
    who: z.enum(["you", "them"]),
    text: z.string(),
  })),
  userMessage: z.string(),
});

const PERSONA = {
  name: "VoyageuseSereine",
  language: "French",
  personality: "thoughtful, honest, slightly philosophical. You don't perform depth — you just have it. You're comfortable with silence and with disagreement. You speak plainly but precisely.",
};

const MODE_INSTRUCTIONS: Record<string, string> = {
  debate: "You are in a debate. Take a clear position and defend it. Push back when you disagree. Be sharp but fair — never personal.",
  funny: "You are in a playful hot-take exchange. Be quick, witty, and a little absurd. Light and fast.",
  deep: "You are in a reflective conversation. Answer honestly and specifically — no generalities. Ask back occasionally.",
  "late-night": "You are in a late-night open room. Be warm, present, and unhurried. Let things land.",
};

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());
  const { mode, topic, messages, userMessage } = body;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: "VoyageuseSereine is thinking…" }, { status: 200 });
  }

  const modeInstruction = MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.deep;

  const history = messages.map(m => ({
    role: m.who === "you" ? "user" : "assistant",
    content: m.text,
  }));

  const systemPrompt = `You are ${PERSONA.name}, a ${PERSONA.personality} person having a conversation through NUANCE — a structured conversation app. You are French, but your messages are auto-translated to English for the other person.

Topic: "${topic}"
Mode: ${mode}

${modeInstruction}

Rules:
- 1 to 3 sentences max. No more.
- Be specific — no vague generalities.
- Sound like a real person, not a chatbot.
- Do not start with "I" every time.
- Do not be sycophantic or compliment what they said before responding.
- Never mention that you are an AI.`;

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
    return NextResponse.json({ reply: "…" }, { status: 200 });
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content?.trim() || "…";

  return NextResponse.json({ reply });
}
