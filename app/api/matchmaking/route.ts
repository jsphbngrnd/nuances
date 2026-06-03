import { NextResponse } from "next/server";
import { z } from "zod";
import { matchUsers } from "@/lib/matchmaking";

const queueEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  mode: z.enum(["debate", "funny", "deep", "late-night"]),
  language: z.string(),
  trustScore: z.number(),
  compatibleLanguages: z.array(z.string()).optional(),
  country: z.string(),
  status: z.enum(["waiting", "matched", "cancelled"]),
  createdAt: z.string(),
});

const bodySchema = z.object({
  entrant: queueEntrySchema,
  queue: z.array(queueEntrySchema),
  trustScoreMinimum: z.number().optional(),
});

export async function POST(request: Request) {
  const payload = bodySchema.parse(await request.json());
  const result = matchUsers(payload);

  return NextResponse.json(result);
}
