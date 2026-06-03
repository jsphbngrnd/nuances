import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAiPartnerReply } from "@/lib/ai-reply";

const messageSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  userId: z.union([z.string(), z.literal("system")]),
  speaker: z.string(),
  sourceType: z.enum(["text", "speech_transcript", "system"]),
  content: z.string(),
  moderationStatus: z.enum(["pending", "approved", "blocked"]),
  createdAt: z.string(),
});

const partnerSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  ageRange: z.string(),
  language: z.string(),
  country: z.string(),
  mood: z.string(),
  interests: z.array(z.string()),
  voiceEnabled: z.boolean(),
  reconnectEnabled: z.boolean(),
  trustScore: z.number(),
});

const bodySchema = z.object({
  locale: z.enum(["en", "fr"]),
  mode: z.enum(["debate", "funny", "deep", "late-night"]),
  roomId: z.string(),
  topicText: z.string().optional(),
  userMessage: z.string(),
  exchangeCount: z.number(),
  stage: z.enum([
    "debate-opening-user",
    "debate-opening-partner",
    "debate-reply-user",
    "debate-reply-partner",
    "debate-closing-user",
    "debate-closing-partner",
    "debate-complete",
    "funny-opening-user",
    "funny-opening-partner",
    "funny-reply-user",
    "funny-reply-partner",
    "funny-complete",
    "deep-opening-user",
    "deep-opening-partner",
    "deep-open",
    "late-night-open",
  ]),
  partner: partnerSchema,
  messages: z.array(messageSchema),
});

export async function POST(request: Request) {
  const payload = bodySchema.parse(await request.json());
  const result = await generateAiPartnerReply(payload);

  return NextResponse.json(result);
}
