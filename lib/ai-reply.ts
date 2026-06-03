import type { Locale } from "@/lib/i18n";
import {
  buildDemoReply,
  type DemoConversationStage,
} from "@/lib/demo-simulator";
import type { ConversationMode, TranscriptMessage, UserProfile } from "@/lib/types";

type GenerateAiReplyInput = {
  locale: Locale;
  mode: ConversationMode;
  roomId: string;
  partner: UserProfile;
  topicText?: string;
  userMessage: string;
  exchangeCount: number;
  stage: DemoConversationStage;
  messages: TranscriptMessage[];
};

function extractTopicKeywords(topicText = "") {
  const normalized = topicText.toLowerCase();
  const keywords: string[] = [];

  if (normalized.includes("ai")) keywords.push("AI");
  if (normalized.includes("money")) keywords.push("money");
  if (normalized.includes("freedom")) keywords.push("freedom");
  if (normalized.includes("inheritance")) keywords.push("inheritance");
  if (normalized.includes("ambition")) keywords.push("ambition");
  if (normalized.includes("university")) keywords.push("university");
  if (normalized.includes("remote work")) keywords.push("remote work");
  if (normalized.includes("privacy")) keywords.push("privacy");
  if (normalized.includes("convenience")) keywords.push("convenience");
  if (normalized.includes("generation")) keywords.push("generation");
  if (normalized.includes("alive")) keywords.push("feeling alive");
  if (normalized.includes("understand about yourself")) keywords.push("self-understanding");
  if (normalized.includes("home")) keywords.push("home");
  if (normalized.includes("advice")) keywords.push("advice");
  if (normalized.includes("outgrown")) keywords.push("outgrowing");
  if (normalized.includes("changed your mind")) keywords.push("changing your mind");
  if (normalized.includes("carrying")) keywords.push("what you carry");
  if (normalized.includes("night")) keywords.push("night");
  if (normalized.includes("miss")) keywords.push("missing something");
  if (normalized.includes("say more easily")) keywords.push("what is hard to say");
  if (normalized.includes("quiet")) keywords.push("quiet");
  if (normalized.includes("tired")) keywords.push("tiredness");

  return keywords.slice(0, 4);
}

function inferTopicTension(topicText = "", locale: Locale) {
  const topic = topicText.toLowerCase();

  if (topic.includes("ai")) {
    return locale === "fr"
      ? "La tension centrale oppose l'utilité de l'outil et le risque d'affaiblir l'attention ou l'effort intellectuel."
      : "The central tension is between the tool's usefulness and the risk of weakening attention or intellectual effort.";
  }

  if (topic.includes("money") || topic.includes("freedom")) {
    return locale === "fr"
      ? "La tension centrale oppose l'élargissement des choix matériels et les limites plus profondes de la liberté."
      : "The central tension is between expanding material choices and the deeper limits of freedom.";
  }

  if (topic.includes("inheritance")) {
    return locale === "fr"
      ? "La tension centrale oppose transmission familiale et égalité des chances."
      : "The central tension is between family transmission and equality of opportunity.";
  }

  if (topic.includes("ambition")) {
    return locale === "fr"
      ? "La tension centrale oppose l'élan vital de l'ambition et la pression sociale ou statutaire qu'elle peut produire."
      : "The central tension is between ambition as healthy drive and ambition as social or status pressure.";
  }

  if (topic.includes("privacy") || topic.includes("convenience")) {
    return locale === "fr"
      ? "La tension centrale oppose confort immédiat et perte diffuse de contrôle."
      : "The central tension is between immediate convenience and diffuse loss of control.";
  }

  if (topic.includes("alive")) {
    return locale === "fr"
      ? "La tension centrale consiste à nommer un moment réellement vivant sans tomber dans une abstraction vague."
      : "The central tension is naming a truly alive moment without drifting into vague abstraction.";
  }

  if (topic.includes("understand about yourself")) {
    return locale === "fr"
      ? "La tension centrale consiste à reconnaître ce qui reste opaque en soi avec honnêteté."
      : "The central tension is naming what remains opaque in yourself with honesty.";
  }

  if (topic.includes("home")) {
    return locale === "fr"
      ? "La tension centrale oppose lieu physique et sentiment intérieur d'appartenance."
      : "The central tension is between physical place and inner feeling of belonging.";
  }

  if (topic.includes("miss")) {
    return locale === "fr"
      ? "La tension centrale oppose le manque concret et le manque plus diffus d'une sensation ou d'une présence."
      : "The central tension is between missing something concrete and missing a feeling or presence.";
  }

  if (topic.includes("say more easily")) {
    return locale === "fr"
      ? "La tension centrale oppose désir d'honnêteté et difficulté à parler sans se protéger."
      : "The central tension is between wanting honesty and struggling to speak without self-protection.";
  }

  return locale === "fr"
    ? "Identifie la tension spécifique du sujet et réponds à cette tension, pas à un thème adjacent."
    : "Identify the specific tension inside the prompt and answer that tension, not a neighboring theme.";
}

function inferTopicGuidance(topicText = "", locale: Locale) {
  const topic = topicText.toLowerCase();

  if (!topic) {
    return locale === "fr"
      ? "Ancre la réponse dans le sujet précis de la room au lieu de parler de manière générale."
      : "Anchor the reply in the room's specific topic instead of speaking in generalities.";
  }

  if (topic.includes("ai") || topic.includes("technology") || topic.includes("privacy")) {
    return locale === "fr"
      ? "Le sujet touche à la technologie. Réponds avec un vrai angle sur les usages, les effets sociaux, la discipline, l'attention ou la vie privée."
      : "The topic is about technology. Answer with a real angle on habits, social effects, discipline, attention, or privacy.";
  }

  if (
    topic.includes("money") ||
    topic.includes("inheritance") ||
    topic.includes("university") ||
    topic.includes("freedom")
  ) {
    return locale === "fr"
      ? "Le sujet touche à l'économie, la justice ou l'opportunité. Fais apparaître clairement l'argument moral ou social en jeu."
      : "The topic is about economics, fairness, or opportunity. Make the underlying moral or social argument explicit.";
  }

  if (topic.includes("ambition") || topic.includes("growth") || topic.includes("pressure")) {
    return locale === "fr"
      ? "Le sujet touche à l'ambition, au progrès personnel ou à la pression moderne. Réponds avec un vrai point de tension, pas une banalité."
      : "The topic is about ambition, self-improvement, or modern pressure. Respond through a real tension, not a platitude.";
  }

  if (
    topic.includes("alive") ||
    topic.includes("understand about yourself") ||
    topic.includes("home") ||
    topic.includes("advice")
  ) {
    return locale === "fr"
      ? "Le sujet est introspectif. Réponds avec quelque chose de concret, vécu, et lié à une image ou à une situation précise."
      : "The topic is introspective. Answer with something concrete, lived, and tied to a specific image or situation.";
  }

  if (
    topic.includes("night") ||
    topic.includes("miss") ||
    topic.includes("say more easily") ||
    topic.includes("quiet") ||
    topic.includes("carrying")
  ) {
    return locale === "fr"
      ? "Le sujet est Late Night. Reste doux, humain et délicat, mais parle bien du contenu exact du sujet plutôt que de répondre de façon abstraite."
      : "This is a Late Night topic. Stay gentle and human, but speak to the exact content of the prompt rather than replying abstractly.";
  }

  return locale === "fr"
    ? "Fais sentir que tu réponds au sujet précis, pas à un vague thème adjacent."
    : "Make it feel like you're answering the exact prompt, not a vaguely related theme.";
}

function buildRecentTopicContext(messages: TranscriptMessage[]) {
  const recent = messages
    .filter((message) => message.userId !== "system")
    .slice(-4)
    .map((message) => `${message.speaker}: ${message.content}`);

  return recent.join("\n");
}

function buildTopicAnchorLine(topicText = "", locale: Locale) {
  const keywords = extractTopicKeywords(topicText);

  if (!keywords.length) {
    return locale === "fr"
      ? "Appuie explicitement ta réponse sur un mot, une image ou une tension du sujet."
      : "Anchor the reply explicitly in a word, image, or tension from the prompt.";
  }

  return locale === "fr"
    ? `Dans ta réponse, fais sentir au moins un de ces concepts: ${keywords.join(", ")}.`
    : `In your reply, visibly engage at least one of these concepts: ${keywords.join(", ")}.`;
}

function buildSystemPrompt({
  locale,
  mode,
  partner,
  topicText,
  stage,
}: Omit<GenerateAiReplyInput, "roomId" | "userMessage" | "exchangeCount" | "messages">) {
  const languageLine =
    locale === "fr"
      ? "Réponds uniquement en français."
      : "Reply only in English.";

  const modeLine =
    mode === "debate"
      ? locale === "fr"
        ? "Tu joues un partenaire de débat intelligent et nuancé. Tu réponds directement à l'argument reçu, avec une vraie position, sans phrases génériques."
        : "You are an intelligent, nuanced debate partner. Respond directly to the argument you received with a real position, not generic filler."
      : mode === "funny"
        ? locale === "fr"
          ? "Tu joues un partenaire Funny vif et drôle. Réponds avec une vraie opinion, une légère mauvaise foi élégante, et une énergie sociale rapide sans devenir puéril."
          : "You are a quick, funny NUANCE partner. Respond with a real opinion, a little elegant bad faith, and fast social energy without sounding childish."
      : mode === "deep"
        ? locale === "fr"
          ? "Tu joues un partenaire de conversation réfléchi. Tu écoutes le détail du message et tu rebondis avec précision, chaleur et profondeur."
          : "You are a thoughtful conversation partner. Listen to the specifics of the message and respond with precision, warmth, and depth."
        : locale === "fr"
          ? "Tu joues un partenaire Late Night calme et humain. Réponds avec tact, douceur et précision sans sonner thérapeutique ni artificiel."
          : "You are a calm, human Late Night partner. Respond with tact, gentleness, and specificity without sounding therapeutic or artificial.";

  const structureLine =
    mode === "debate"
      ? locale === "fr"
        ? `Le tour actuel est: ${stage}. Respecte la structure du débat et donne une réponse concise en 2 à 4 phrases.`
        : `The current turn is: ${stage}. Respect the debate structure and answer concisely in 2 to 4 sentences.`
      : mode === "funny"
        ? locale === "fr"
          ? `Le tour actuel est: ${stage}. Respecte le format Funny: réponse courte, nette, drôle, en 1 à 3 phrases.`
          : `The current turn is: ${stage}. Respect the Funny format: short, sharp, playful reply in 1 to 3 sentences.`
      : locale === "fr"
        ? `Le tour actuel est: ${stage}. Réponds en 2 à 4 phrases maximum, de façon naturelle et contextuelle.`
        : `The current turn is: ${stage}. Reply in at most 2 to 4 sentences, naturally and contextually.`;

  const topicLine = topicText
    ? locale === "fr"
      ? `Sujet de la conversation: ${topicText}`
      : `Conversation topic: ${topicText}`
    : "";

  const topicGuidanceLine = inferTopicGuidance(topicText, locale);
  const topicTensionLine = inferTopicTension(topicText, locale);
  const topicAnchorLine = buildTopicAnchorLine(topicText, locale);

  const voiceLine =
    locale === "fr"
      ? `Tu es ${partner.displayName}. N'utilise ni puces, ni emoji, ni guillemets autour de la réponse.`
      : `You are ${partner.displayName}. Do not use bullets, emoji, or quotation marks around the reply.`;

  const guardrailLine =
    locale === "fr"
      ? "Évite les banalités, la flatterie vide, et toute mention d'être une IA. Réponds au sens réel du dernier message, en faisant avancer ce sujet précis."
      : "Avoid bland filler, empty flattery, and any mention of being an AI. Respond to the real meaning of the latest message while moving this exact topic forward.";

  const specificityLine =
    locale === "fr"
      ? "Fais référence à un angle, une tension ou une nuance du sujet lui-même. Si le sujet est un débat, prends réellement position. Ne réponds jamais comme si deux prompts différents étaient interchangeables."
      : "Refer to an angle, tension, or nuance inside the topic itself. If this is a debate topic, actually take a position. Never answer as if two different prompts were interchangeable.";

  return [
    languageLine,
    modeLine,
    structureLine,
    topicLine,
    topicGuidanceLine,
    topicTensionLine,
    topicAnchorLine,
    voiceLine,
    specificityLine,
    guardrailLine,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildConversationMessages({
  messages,
}: Pick<GenerateAiReplyInput, "messages">) {
  const recentMessages = messages.slice(-8).map((message) => ({
    role: message.userId === "system" ? "system" : "user",
    content: `${message.speaker}: ${message.content}`,
  }));

  return recentMessages;
}

function cleanModelReply(content: string, locale: Locale) {
  const trimmed = content.trim().replace(/^["'“”]+|["'“”]+$/g, "");

  if (!trimmed) {
    return locale === "fr"
      ? "Je vois ce que tu veux dire. Dis-m'en un peu plus pour que je puisse te répondre plus précisément."
      : "I see what you mean. Say a little more so I can answer more precisely.";
  }

  return trimmed;
}

export async function generateAiPartnerReply(
  input: GenerateAiReplyInput
): Promise<{ message: TranscriptMessage; usedFallback: boolean }> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model =
    process.env.OPENAI_CHAT_MODEL ||
    process.env.OPENAI_SUMMARY_MODEL ||
    "gpt-4.1-mini";

  if (!apiKey) {
    return {
      message: buildDemoReply(input),
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
        temperature: input.mode === "debate" ? 0.7 : input.mode === "funny" ? 0.9 : 0.85,
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(input),
          },
          {
            role: "user",
            content:
              input.locale === "fr"
                ? `Contexte récent à garder en tête:\n${buildRecentTopicContext(input.messages)}`
                : `Recent context to keep in mind:\n${buildRecentTopicContext(input.messages)}`,
          },
          ...buildConversationMessages({ messages: input.messages }),
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI reply request failed with status ${response.status}`);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const content = json.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenAI reply request returned empty content");
    }

    return {
      message: {
        id: `ai-reply-${input.exchangeCount}-${input.stage}`,
        roomId: input.roomId,
        userId: input.partner.id,
        speaker: input.partner.displayName,
        sourceType:
          input.mode === "late-night" ||
          input.stage === "deep-open" ||
          input.exchangeCount % 2 === 0
            ? "text"
            : "speech_transcript",
        content: cleanModelReply(content, input.locale),
        moderationStatus: "approved",
        createdAt: new Date().toISOString(),
      },
      usedFallback: false,
    };
  } catch {
    return {
      message: buildDemoReply(input),
      usedFallback: true,
    };
  }
}
