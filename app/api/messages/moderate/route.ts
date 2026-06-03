import { NextResponse } from "next/server";
import { z } from "zod";
import { moderateTranscriptChunk } from "@/lib/moderation";

const messageSchema = z.object({
  content: z.string(),
  sourceType: z.enum(["text", "speech_transcript"]),
});

export async function POST(request: Request) {
  const payload = messageSchema.parse(await request.json());
  return NextResponse.json(moderateTranscriptChunk(payload));
}
