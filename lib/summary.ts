import type { Locale } from "@/lib/i18n";
import type { ConversationMode, RoomSummary, TranscriptMessage } from "@/lib/types";
import { inferSemanticTags } from "@/lib/recommendations";

function summarizeSnippet(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();

  if (cleaned.length <= 120) return cleaned;

  return `${cleaned.slice(0, 117).trim()}...`;
}

function inferThemes(messages: TranscriptMessage[], locale: Locale) {
  const joined = messages.map((message) => message.content.toLowerCase()).join(" ");
  const themes: string[] = [];

  if (joined.includes("lonely") || joined.includes("alone") || joined.includes("solitude")) {
    themes.push(locale === "fr" ? "Solitude" : "Loneliness");
  }
  if (
    joined.includes("honest") ||
    joined.includes("honesty") ||
    joined.includes("honn") ||
    joined.includes("sinc")
  ) {
    themes.push(locale === "fr" ? "Honnêteté" : "Honesty");
  }
  if (
    joined.includes("presence") ||
    joined.includes("present") ||
    joined.includes("présence")
  ) {
    themes.push(locale === "fr" ? "Présence" : "Presence");
  }
  if (joined.includes("ai") || joined.includes("outil") || joined.includes("technology")) {
    themes.push(locale === "fr" ? "Technologie" : "Technology");
  }
  if (
    joined.includes("alive") ||
    joined.includes("most alive") ||
    joined.includes("vivant") ||
    joined.includes("align")
  ) {
    themes.push(locale === "fr" ? "Vitalité" : "Aliveness");
  }

  return themes.length ? themes.slice(0, 4) : [locale === "fr" ? "Connexion humaine" : "Human connection"];
}

function getSpeakerPoints(messages: TranscriptMessage[]) {
  const participantMessages = messages.filter((message) => message.userId !== "system");
  const bySpeaker = new Map<string, string[]>();

  participantMessages.forEach((message) => {
    const list = bySpeaker.get(message.speaker) ?? [];
    list.push(message.content);
    bySpeaker.set(message.speaker, list);
  });

  return [...bySpeaker.entries()].map(([speaker, snippets]) => ({
    speaker,
    point: summarizeSnippet(snippets[0] ?? ""),
    latest: summarizeSnippet(snippets[snippets.length - 1] ?? ""),
    count: snippets.length,
  }));
}

export function buildRoomSummary(
  roomId: string,
  mode: ConversationMode,
  messages: TranscriptMessage[],
  topicText = "",
  locale: Locale = "en"
): RoomSummary {
  const speakerPoints = getSpeakerPoints(messages);
  const firstSpeaker = speakerPoints[0];
  const secondSpeaker = speakerPoints[1];
  const themes = inferThemes(messages, locale);
  const semanticTags = inferSemanticTags(messages, mode, topicText);

  let summaryText =
    locale === "fr"
      ? "La conversation a gardé un bon niveau de présence et de clarté."
      : "The conversation stayed clear, present, and emotionally readable.";

  if (mode === "debate" && firstSpeaker && secondSpeaker) {
    summaryText =
      locale === "fr"
        ? `${firstSpeaker.speaker} a ouvert avec l'idée suivante : “${firstSpeaker.point}”. ${secondSpeaker.speaker} a répondu en prenant un angle distinct : “${secondSpeaker.point}”.`
        : `${firstSpeaker.speaker} opened with: “${firstSpeaker.point}”. ${secondSpeaker.speaker} answered with a clearly different angle: “${secondSpeaker.point}”.`;
  } else if (mode === "funny" && firstSpeaker && secondSpeaker) {
    summaryText =
      locale === "fr"
        ? `${firstSpeaker.speaker} a lancé la take suivante : “${firstSpeaker.point}”. ${secondSpeaker.speaker} a répliqué avec une version encore plus assumée : “${secondSpeaker.point}”.`
        : `${firstSpeaker.speaker} launched the take: “${firstSpeaker.point}”. ${secondSpeaker.speaker} answered with an even more committed counter-angle: “${secondSpeaker.point}”.`;
  } else if (firstSpeaker && secondSpeaker) {
    summaryText =
      locale === "fr"
        ? `${firstSpeaker.speaker} a apporté “${firstSpeaker.point}”, et ${secondSpeaker.speaker} l'a rejoint avec “${secondSpeaker.point}”.`
        : `${firstSpeaker.speaker} brought “${firstSpeaker.point}”, and ${secondSpeaker.speaker} met it with “${secondSpeaker.point}”.`;
  }

  const agreementPoints =
    mode === "debate"
      ? [
          locale === "fr"
            ? "Les deux personnes sont restées sur le sujet et ont réellement répondu à l'argument en face."
            : "Both people stayed on topic and responded to the argument in front of them.",
          locale === "fr"
            ? "Le désaccord est resté net sans devenir agressif."
            : "The disagreement stayed clear without becoming hostile.",
        ]
      : mode === "funny"
        ? [
            locale === "fr"
              ? "Les deux personnes ont vraiment joué le jeu de la take courte et assumée."
              : "Both people committed to the short-form hot take format.",
            locale === "fr"
              ? "Le ton est resté joueur sans tomber dans la méchanceté."
              : "The tone stayed playful without turning mean.",
          ]
      : [
          locale === "fr"
            ? "Les deux personnes ont donné des réponses précises plutôt que des réponses de façade."
            : "Both people gave specific answers instead of surface-level ones.",
          locale === "fr"
            ? "L'échange a gagné en profondeur à mesure que les messages avançaient."
            : "The exchange became more specific and open as it moved forward.",
        ];

  const disagreementPoints =
    (mode === "debate" || mode === "funny") && firstSpeaker && secondSpeaker
      ? [
          `${firstSpeaker.speaker}: ${firstSpeaker.point}`,
          `${secondSpeaker.speaker}: ${secondSpeaker.point}`,
        ]
      : [];

  return {
    id: `summary-${roomId}`,
    roomId,
    summaryText,
    agreementPoints,
    disagreementPoints,
    mainThemes: themes,
    semanticTags,
    emotionalTone:
      mode === "late-night"
        ? locale === "fr"
          ? "Intime, calme et vulnérable par moments."
          : "Intimate, calm, and lightly vulnerable."
        : mode === "funny"
          ? locale === "fr"
            ? "Joueur, vif et socialement léger."
            : "Playful, quick, and socially alive."
        : mode === "deep"
          ? locale === "fr"
            ? "Réfléchi, précis et ouvert."
            : "Thoughtful, precise, and open."
          : locale === "fr"
            ? "Net, vivant et respectueux."
            : "Sharp, lively, and respectful.",
    followUpQuestion:
      mode === "debate"
        ? locale === "fr"
          ? "Si vous refaisiez ce débat, quelle nuance voudriez-vous mieux défendre ?"
          : "If you revisited this debate, what nuance would you want to defend more clearly?"
        : mode === "funny"
          ? locale === "fr"
            ? "Si vous refaisiez ce round, quelle take pousseriez-vous encore plus loin ?"
            : "If you ran this round again, which take would you push even further?"
        : locale === "fr"
          ? "Si vous reparliez, quelle partie de cet échange voudriez-vous approfondir ?"
          : "If you talked again, what part of this exchange would you want to go deeper on?",
    generatedAt: new Date().toISOString(),
  };
}
