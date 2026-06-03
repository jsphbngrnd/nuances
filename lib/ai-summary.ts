import { z } from "zod";
import type { Locale } from "@/lib/i18n";
import { buildRoomSummary } from "@/lib/summary";
import type { ConversationMode, RoomSummary, TranscriptMessage } from "@/lib/types";

const roomSummarySchema = z.object({
  summaryText: z.string().min(1),
  agreementPoints: z.array(z.string()).max(4),
  disagreementPoints: z.array(z.string()).max(4),
  mainThemes: z.array(z.string()).max(5),
  semanticTags: z.array(z.string()).max(8),
  emotionalTone: z.string().min(1),
  followUpQuestion: z.string().optional(),
});

type GenerateAiRoomSummaryInput = {
  roomId: string;
  mode: ConversationMode;
  messages: TranscriptMessage[];
  topicText?: string;
  locale: Locale;
};

function buildSpeakerHighlights(messages: TranscriptMessage[]) {
  const bySpeaker = new Map<string, string[]>();

  for (const message of messages) {
    if (message.userId === "system" || message.moderationStatus === "blocked") continue;

    const current = bySpeaker.get(message.speaker) ?? [];
    current.push(message.content.trim());
    bySpeaker.set(message.speaker, current);
  }

  return [...bySpeaker.entries()].map(([speaker, entries]) => {
    const first = entries[0] ?? "";
    const last = entries[entries.length - 1] ?? "";

    return {
      speaker,
      first,
      last,
      count: entries.length,
    };
  });
}

function buildSummarySystemPrompt({
  mode,
  topicText,
  locale,
}: Omit<GenerateAiRoomSummaryInput, "roomId" | "messages">) {
  const languageLine =
    locale === "fr"
      ? "Réponds uniquement en français."
      : "Reply only in English.";

  const toneLine =
    locale === "fr"
      ? "Le produit doit sembler intelligent, chaleureux et éditorial. Ne sois ni clinique, ni creux, ni promotionnel."
      : "The product should feel intelligent, warm, and editorial. Do not sound clinical, vague, or promotional.";

  const modeLine =
    mode === "debate"
      ? locale === "fr"
        ? "C'est un résumé de débat. Mets en avant le meilleur point de chaque côté, les points d'accord réels, les désaccords, et garde une vraie précision argumentative. Si un point n'apparaît pas dans le transcript, ne l'invente pas."
        : "This is a debate summary. Surface the strongest point from each side, real agreement points, and real disagreements with argumentative precision. If a point is not in the transcript, do not invent it."
      : mode === "funny"
        ? locale === "fr"
          ? "C'est une conversation Funny. Garde le ton léger et vif. Fais ressortir la meilleure take de chaque côté, l'angle le plus drôle ou le plus absurde, et évite toute prose trop sérieuse."
          : "This is a Funny conversation. Keep the tone light and quick. Surface the best take from each side, the funniest or most absurd angle, and avoid overly serious prose."
      : mode === "deep"
        ? locale === "fr"
          ? "C'est une conversation Deep. Résume les thèmes communs, la tonalité émotionnelle et une question de suivi naturelle si les deux personnes se reconnectent. Chaque élément doit pouvoir être rattaché à quelque chose d'explicite dans le transcript."
          : "This is a Deep conversation. Summarize the shared themes, emotional tone, and one natural follow-up question if both people reconnect. Every element must be traceable to something explicit in the transcript."
        : locale === "fr"
          ? "C'est une conversation Late Night. Garde le ton doux, humain et non thérapeutique. Évite toute impression de psychoanalyse. Reste proche des mots réellement employés."
          : "This is a Late Night conversation. Keep the tone soft, human, and non-therapeutic. Avoid anything that feels like psychoanalysis. Stay close to the words that were actually used.";

  const topicLine = topicText
    ? locale === "fr"
      ? `Sujet: ${topicText}`
      : `Topic: ${topicText}`
    : locale === "fr"
      ? "Le sujet n'est pas précisé explicitement."
      : "The topic is not explicitly provided.";

  const outputLine =
    locale === "fr"
      ? "Retourne uniquement un objet JSON valide avec les champs: summaryText, agreementPoints, disagreementPoints, mainThemes, semanticTags, emotionalTone, followUpQuestion."
      : "Return only a valid JSON object with the fields: summaryText, agreementPoints, disagreementPoints, mainThemes, semanticTags, emotionalTone, followUpQuestion.";

  const tagLine =
    locale === "fr"
      ? "Les semanticTags doivent être courts, minuscules, utiles pour une couche de recommandations éditoriales. Exemples: loneliness, money, identity, ambition, purpose, vulnerability."
      : "semanticTags should be short, lowercase, and useful for an editorial recommendation layer. Examples: loneliness, money, identity, ambition, purpose, vulnerability.";

  const guardrailLine =
    locale === "fr"
      ? "N'invente pas de trauma, de diagnostic, ni de compatibilité romantique. Sois fidèle au transcript. Si l'évidence est faible, écris moins de choses au lieu de combler."
      : "Do not invent trauma, diagnosis, or romantic compatibility. Stay faithful to the transcript. If the evidence is weak, write less instead of filling gaps.";

  const precisionLine =
    locale === "fr"
      ? "Le summaryText doit mentionner au moins un détail concret ou un angle réel du transcript. Les agreementPoints et disagreementPoints peuvent être vides si la conversation ne les soutient pas clairement."
      : "The summaryText must mention at least one concrete detail or real angle from the transcript. agreementPoints and disagreementPoints may be empty if the conversation does not clearly support them.";

  const styleLine =
    locale === "fr"
      ? "Écris court, naturel, utile. Pas de prose gonflée, pas de formule vague du type 'ils ont exploré des thèmes profonds'."
      : "Write briefly, naturally, and usefully. No inflated prose, and no vague phrases like 'they explored deep themes'.";

  return [
    languageLine,
    toneLine,
    modeLine,
    topicLine,
    outputLine,
    tagLine,
    precisionLine,
    styleLine,
    guardrailLine,
  ].join("\n");
}

function buildConversationPayload(messages: TranscriptMessage[]) {
  const filtered = messages
    .filter((message) => message.moderationStatus !== "blocked")
    .slice(-24)
    .map((message, index) => `[${index + 1}] ${message.speaker} (${message.sourceType}): ${message.content}`);

  return filtered.join("\n");
}

function buildSpeakerHighlightsPayload(messages: TranscriptMessage[], locale: Locale) {
  const highlights = buildSpeakerHighlights(messages);

  if (!highlights.length) {
    return locale === "fr" ? "Aucun point saillant détecté." : "No speaker highlights detected.";
  }

  return highlights
    .map((highlight) =>
      locale === "fr"
        ? `${highlight.speaker} · ${highlight.count} message(s) · premier point: ${highlight.first} · dernier point: ${highlight.last}`
        : `${highlight.speaker} · ${highlight.count} message(s) · first point: ${highlight.first} · last point: ${highlight.last}`
    )
    .join("\n");
}

function coerceSummary(
  payload: z.infer<typeof roomSummarySchema>,
  roomId: string
): RoomSummary {
  return {
    id: `summary-${roomId}`,
    roomId,
    summaryText: payload.summaryText,
    agreementPoints: payload.agreementPoints,
    disagreementPoints: payload.disagreementPoints,
    mainThemes: payload.mainThemes,
    semanticTags: payload.semanticTags,
    emotionalTone: payload.emotionalTone,
    followUpQuestion: payload.followUpQuestion,
    generatedAt: new Date().toISOString(),
  };
}

function extractJsonObject(content: string) {
  const match = content.match(/\{[\s\S]*\}/);
  return match ? match[0] : content;
}

export async function generateAiRoomSummary(
  input: GenerateAiRoomSummaryInput
): Promise<{ summary: RoomSummary; usedFallback: boolean }> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_SUMMARY_MODEL || process.env.OPENAI_CHAT_MODEL || "gpt-4.1-mini";

  if (!apiKey) {
    return {
      summary: buildRoomSummary(input.roomId, input.mode, input.messages, input.topicText ?? "", input.locale),
      usedFallback: true,
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: buildSummarySystemPrompt(input),
          },
          {
            role: "user",
            content:
              input.locale === "fr"
                ? `Voici le transcript récent de la conversation:\n\n${buildConversationPayload(input.messages)}\n\nRepères par personne:\n${buildSpeakerHighlightsPayload(input.messages, input.locale)}`
                : `Here is the recent conversation transcript:\n\n${buildConversationPayload(input.messages)}\n\nSpeaker highlights:\n${buildSpeakerHighlightsPayload(input.messages, input.locale)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI summary request failed with status ${response.status}`);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };

    const content = json.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenAI summary request returned empty content");
    }

    const parsed = roomSummarySchema.parse(JSON.parse(extractJsonObject(content)));

    return {
      summary: coerceSummary(parsed, input.roomId),
      usedFallback: false,
    };
  } catch {
    return {
      summary: buildRoomSummary(input.roomId, input.mode, input.messages, input.topicText ?? "", input.locale),
      usedFallback: true,
    };
  }
}
