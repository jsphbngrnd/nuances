import type { MatchmakingRequest, MatchmakingResult, QueueEntry } from "@/lib/types";

function sameLanguage(a: QueueEntry, b: QueueEntry) {
  return a.language === b.language;
}

function compatibleLanguage(a: QueueEntry, b: QueueEntry) {
  const aCompat = new Set([a.language, ...(a.compatibleLanguages ?? [])]);
  const bCompat = new Set([b.language, ...(b.compatibleLanguages ?? [])]);

  return [...aCompat].some((language) => bCompat.has(language));
}

export function matchUsers({
  entrant,
  queue,
  trustScoreMinimum = 0.45,
}: MatchmakingRequest): MatchmakingResult {
  if (entrant.status !== "waiting") {
    return {
      matched: false,
      reason: "Entrant is not currently available for matching.",
    };
  }

  const candidates = queue.filter(
    (candidate) =>
      candidate.userId !== entrant.userId &&
      candidate.status === "waiting" &&
      candidate.mode === entrant.mode &&
      candidate.trustScore >= trustScoreMinimum
  );

  if (entrant.trustScore < trustScoreMinimum) {
    return {
      matched: false,
      reason: "Entrant is below the trust threshold for live matching.",
    };
  }

  const exactMatch = candidates.find((candidate) => sameLanguage(candidate, entrant));
  const languageFallback = candidates.find((candidate) =>
    compatibleLanguage(candidate, entrant)
  );

  const chosen = exactMatch ?? languageFallback;

  if (!chosen) {
    return {
      matched: false,
      reason: "No compatible user is available yet.",
    };
  }
  return {
    matched: true,
    room: {
      id: `room-${entrant.mode}-${entrant.userId}-${chosen.userId}`,
      status: "pending_topic",
      mode: entrant.mode,
      matchedUserIds: [entrant.userId, chosen.userId],
    },
  };
}
