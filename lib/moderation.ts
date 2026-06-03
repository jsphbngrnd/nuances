import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1),
  sourceType: z.enum(["text", "speech_transcript"]),
});

const blockedPatterns = [
  /kill yourself/i,
  /send nudes/i,
  /where do you live exactly/i,
  /i know where you live/i,
];

export function moderateTranscriptChunk(input: unknown) {
  const parsed = messageSchema.parse(input);
  const severePattern = blockedPatterns.find((pattern) => pattern.test(parsed.content));

  if (severePattern) {
    return {
      status: "blocked" as const,
      deliver: false,
      explanation:
        "This message could not be sent because it breaks the conversation rules.",
      severity: "high" as const,
    };
  }

  return {
    status: "approved" as const,
    deliver: true,
    explanation: null,
    severity: "none" as const,
  };
}
