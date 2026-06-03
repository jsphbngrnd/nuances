import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAiRoomSummary } from "@/lib/ai-summary";

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

const bodySchema = z.object({
  locale: z.enum(["en", "fr"]).default("en"),
  mode: z.enum(["debate", "funny", "deep", "late-night"]),
  messages: z.array(messageSchema),
  topicText: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = bodySchema.parse(await request.json());

  return NextResponse.json(
    await generateAiRoomSummary({
      roomId: id,
      locale: payload.locale,
      mode: payload.mode,
      messages: payload.messages,
      topicText: payload.topicText ?? "",
    })
  );
}
