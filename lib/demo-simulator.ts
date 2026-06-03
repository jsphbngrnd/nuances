import type { Locale } from "@/lib/i18n";
import type { ConversationMode, TranscriptMessage, UserProfile } from "@/lib/types";

export type DemoConversationStage =
  | "debate-opening-user"
  | "debate-opening-partner"
  | "debate-reply-user"
  | "debate-reply-partner"
  | "debate-closing-user"
  | "debate-closing-partner"
  | "debate-complete"
  | "funny-opening-user"
  | "funny-opening-partner"
  | "funny-reply-user"
  | "funny-reply-partner"
  | "funny-complete"
  | "deep-opening-user"
  | "deep-opening-partner"
  | "deep-open"
  | "late-night-open";

type DemoReplyInput = {
  locale: Locale;
  mode: ConversationMode;
  roomId: string;
  partner: UserProfile;
  userMessage: string;
  exchangeCount: number;
  stage: DemoConversationStage;
  topicText?: string;
};

function makeMessage({
  id,
  roomId,
  userId,
  speaker,
  sourceType,
  content,
}: {
  id: string;
  roomId: string;
  userId: string | "system";
  speaker: string;
  sourceType: "text" | "speech_transcript" | "system";
  content: string;
}): TranscriptMessage {
  return {
    id,
    roomId,
    userId,
    speaker,
    sourceType,
    content,
    moderationStatus: "approved",
    createdAt: new Date().toISOString(),
  };
}

export function buildDemoSystemMessage(
  roomId: string,
  content: string,
  idSuffix: string
): TranscriptMessage {
  return makeMessage({
    id: `demo-system-${idSuffix}`,
    roomId,
    userId: "system",
    speaker: "NUANCE",
    sourceType: "system",
    content,
  });
}

export function getInitialDemoStage(mode: ConversationMode): DemoConversationStage {
  if (mode === "debate") return "debate-opening-user";
  if (mode === "funny") return "funny-opening-user";
  if (mode === "deep") return "deep-opening-user";
  return "late-night-open";
}

export function getDemoStageDuration(stage: DemoConversationStage): number {
  if (stage === "debate-opening-user" || stage === "debate-opening-partner") return 60;
  if (stage === "debate-reply-user" || stage === "debate-reply-partner") return 30;
  if (stage === "debate-closing-user" || stage === "debate-closing-partner") return 20;
  if (stage === "funny-opening-user" || stage === "funny-opening-partner") return 45;
  if (stage === "funny-reply-user" || stage === "funny-reply-partner") return 20;
  if (stage === "deep-opening-user" || stage === "deep-opening-partner") return 90;
  if (stage === "deep-open") return 120;
  return 300;
}

export function getPartnerStageForUserTurn(
  stage: DemoConversationStage
): DemoConversationStage {
  if (stage === "debate-opening-user") return "debate-opening-partner";
  if (stage === "debate-reply-user") return "debate-reply-partner";
  if (stage === "debate-closing-user") return "debate-closing-partner";
  if (stage === "funny-opening-user") return "funny-opening-partner";
  if (stage === "funny-reply-user") return "funny-reply-partner";
  if (stage === "deep-opening-user") return "deep-opening-partner";
  return stage;
}

export function getNextStageAfterPartner(
  stage: DemoConversationStage
): DemoConversationStage {
  if (stage === "debate-opening-partner") return "debate-reply-user";
  if (stage === "debate-reply-partner") return "debate-closing-user";
  if (stage === "debate-closing-partner") return "debate-complete";
  if (stage === "funny-opening-partner") return "funny-reply-user";
  if (stage === "funny-reply-partner") return "funny-complete";
  if (stage === "deep-opening-partner") return "deep-open";
  return stage;
}

export function buildDemoIntro(
  roomId: string,
  locale: Locale,
  mode: ConversationMode,
  partner: UserProfile,
  topicText = ""
): TranscriptMessage[] {
  const intro =
    locale === "fr"
      ? mode === "debate"
        ? `Mode démo : débat structuré sur “${topicText}”. Vous prenez la première ouverture, puis ${partner.displayName} répond.`
        : mode === "funny"
          ? `Mode démo : room Funny sur “${topicText}”. Le rythme est court, joueur, et pensé pour des takes rapides.`
        : mode === "deep"
          ? `Mode démo : ouverture guidée sur “${topicText}”. Vous commencez, puis ${partner.displayName} prend un temps de réponse avant l'échange libre.`
          : "Mode démo : votre interlocuteur est simulé par l'IA pour tester le flow de conversation."
      : mode === "debate"
        ? `Demo mode: structured debate on “${topicText}”. You take the first opening, then ${partner.displayName} responds.`
        : mode === "funny"
          ? `Demo mode: Funny room on “${topicText}”. The structure is short, playful, and built for fast takes.`
        : mode === "deep"
          ? `Demo mode: guided opening on “${topicText}”. You go first, then ${partner.displayName} answers before open exchange begins.`
          : "Demo mode: your matched partner is simulated by AI so you can test the conversation flow.";

  const opener =
    locale === "fr"
      ? mode === "debate"
        ? "Je prends volontairement l'angle opposé quand mon tour arrive. Vas-y franchement, je préfère une vraie position à une opinion tiède."
        : mode === "funny"
          ? "Je joue le jeu à fond. Prends une vraie position, même absurde, tant qu'elle est drôle et claire."
        : mode === "deep"
          ? "Je suis là. Prends ton temps pour ton ouverture, je vais vraiment écouter avant de répondre."
          : "Salut. Je suis là, sans pression. On peut commencer doucement."
      : mode === "debate"
        ? "I’ll deliberately take the other side when my turn comes. Go clearly, I’d rather hear a real position than a lukewarm one."
        : mode === "funny"
          ? "I’m fully playing along. Take a real position, even a ridiculous one, as long as it’s clear and fun."
        : mode === "deep"
          ? "I’m here. Take your time with your opening, I’m going to really listen before I answer."
          : "Hey. I’m here, no pressure. We can start gently.";

  return [
    buildDemoSystemMessage(roomId, intro, "intro"),
    makeMessage({
      id: "demo-partner-opening",
      roomId,
      userId: partner.id,
      speaker: partner.displayName,
      sourceType: "speech_transcript",
      content: opener,
    }),
  ];
}

function normalizeText(text: string) {
  return text.trim().toLowerCase();
}

function mentionsFeeling(text: string) {
  return /(feel|feels|felt|lonely|alone|alive|anxious|calm|humeur|solitude|vivant|calme|peur|émotion)/i.test(
    text
  );
}

function mentionsPosition(text: string) {
  return /(should|limit|free|money|ai|university|inheritance|freer|devrait|argent|université|ia|héritage|libre)/i.test(
    text
  );
}

function mentionsCertainty(text: string) {
  return /(always|never|obvious|clearly|certain|toujours|jamais|évident|forcément|clairement)/i.test(
    text
  );
}

function getTopicFlavor(topicText = "") {
  const topic = topicText.toLowerCase();

  if (
    topic.includes("money") ||
    topic.includes("inheritance") ||
    topic.includes("university") ||
    topic.includes("freedom")
  ) {
    return "economy";
  }

  if (
    topic.includes("ai") ||
    topic.includes("privacy") ||
    topic.includes("remote work") ||
    topic.includes("technology")
  ) {
    return "technology";
  }

  if (topic.includes("ambition") || topic.includes("growth") || topic.includes("pressure")) {
    return "ambition";
  }

  if (
    topic.includes("alive") ||
    topic.includes("understand") ||
    topic.includes("home") ||
    topic.includes("advice") ||
    topic.includes("generation")
  ) {
    return "identity";
  }

  if (
    topic.includes("night") ||
    topic.includes("miss") ||
    topic.includes("say") ||
    topic.includes("quiet") ||
    topic.includes("carrying") ||
    topic.includes("tired")
  ) {
    return "late-night";
  }

  return "general";
}

function buildDebateReply(
  locale: Locale,
  stage: DemoConversationStage,
  normalized: string,
  topicText = ""
) {
  const topicFlavor = getTopicFlavor(topicText);

  if (stage === "debate-opening-partner") {
    if (topicFlavor === "economy") {
      return locale === "fr"
        ? "Je prends l'angle opposé. Pour moi, l'argent ou l'héritage ne se résument pas à un privilège figé : ils peuvent aussi créer une vraie marge de choix pour des gens qui n'en ont pas beaucoup. La vraie question, c'est surtout comment on limite les abus sans punir toute transmission."
        : "I’ll take the opposite angle. To me, money or inheritance are not just frozen privilege; they can also create real room to choose for people who otherwise have very little. The real question is how to limit abuse without treating every transfer as illegitimate.";
    }

    if (topicFlavor === "ambition") {
      return locale === "fr"
        ? "Je vais défendre une position plus favorable à l'ambition. Le problème n'est pas l'ambition elle-même, mais la manière étroite dont on l'imagine, souvent réduite au statut. Sans ambition, beaucoup de gens renonceraient aussi à des formes très saines d'élan."
        : "I’m going to defend a more favorable view of ambition. The problem isn’t ambition itself, but the narrow way we imagine it, often reduced to status. Without ambition, a lot of people would also lose healthier forms of momentum.";
    }

    if (topicFlavor === "technology") {
      return locale === "fr"
        ? "Je prends l'autre angle. Pour moi, ces outils n'appauvrissent pas automatiquement la pensée : ils déplacent surtout l'endroit où l'effort doit se faire. Le vrai risque, ce n'est pas l'outil lui-même, mais l'abandon de nos critères."
        : "I’ll take the other angle. To me, these tools do not automatically flatten thought; they mostly relocate where the effort has to happen. The real danger isn’t the tool itself, but abandoning our standards.";
    }

    if (mentionsPosition(normalized)) {
      return locale === "fr"
        ? "Je vais prendre l'autre angle. Pour moi, l'IA ne nous rend pas paresseux par nature: elle révèle surtout si on avait déjà l'habitude de déléguer notre attention. Le problème n'est pas l'outil, c'est la discipline intellectuelle autour."
        : "I’m going to take the other angle. To me, AI doesn’t make us lazy by default; it mostly exposes whether we were already willing to outsource attention. The real issue isn’t the tool, it’s the discipline around it.";
    }

    return locale === "fr"
      ? "Je comprends ton point, mais je ne suis pas convaincue par l'effet que tu décris. Qu'est-ce qui te fait penser que cette tendance est structurelle, et pas seulement un mauvais usage ?"
      : "I get your point, but I’m not convinced by the effect you’re describing. What makes you think this is structural, rather than just poor use?";
  }

  if (stage === "debate-reply-partner") {
    if (mentionsCertainty(normalized)) {
      return locale === "fr"
        ? "Là, je pense que tu durcis trop le trait. Une règle générale sonne bien en débat, mais dans la vraie vie, les effets sont plus mélangés. Où places-tu la limite concrète ?"
        : "I think you’re sharpening the claim a bit too much there. A clean rule sounds good in a debate, but real effects are messier. Where exactly would you draw the line?";
    }

    return locale === "fr"
      ? "Ta réponse est plus précise, et c'est là que le débat devient intéressant. Mais j'ai encore du mal à voir pourquoi ton coût principal pèse plus lourd que le gain qu'apporte l'outil."
      : "That reply is more precise, and that’s where the debate gets interesting. But I still don’t see why your main cost outweighs the gain the tool creates.";
  }

  return locale === "fr"
    ? "Ma conclusion, c'est qu'il faut juger une technologie par la qualité des usages qu'elle encourage, pas par les peurs qu'elle déclenche. Donc oui, vigilance, mais pas panique."
    : "My closing view is that we should judge a technology by the quality of habits it encourages, not by the fears it triggers. So yes, caution, but not panic.";
}

function buildDeepReply(
  locale: Locale,
  stage: DemoConversationStage,
  normalized: string,
  topicText = ""
) {
  const topicFlavor = getTopicFlavor(topicText);

  if (stage === "deep-opening-partner") {
    if (topicFlavor === "identity") {
      return locale === "fr"
        ? "Le sujet appelle quelque chose de très précis, et ta réponse commence à y aller. Je trouve qu'on comprend souvent mieux quelqu'un quand il parle d'une scène concrète plutôt que d'un grand principe. Chez moi, ce sont souvent les moments où je me sens chez moi quelque part sans devoir me justifier."
        : "This prompt asks for something very specific, and your answer is starting to go there. I think we understand people better when they speak from one concrete scene rather than a grand principle. For me, it’s often the moments when I feel at home somewhere without needing to justify myself.";
    }

    if (mentionsFeeling(normalized)) {
      return locale === "fr"
        ? "Ce que tu dis est très net, et j'aime ça. Quand quelqu'un sait nommer précisément ce qui le fait se sentir vivant, on entend souvent une forme de vérité calme derrière. Chez moi, c'est souvent lié à un moment où je ne joue plus aucun rôle."
        : "What you said is very clear, and I like that. When someone can name what makes them feel alive with precision, there’s usually a quiet kind of truth in it. For me, it’s often tied to a moment where I stop performing any role.";
    }

    return locale === "fr"
      ? "Tu prends une route intéressante. J'ai l'impression que les réponses les plus vraies ne sont pas forcément les plus grandes, mais les plus exactes. Je crois que je me sens la plus présente quand quelqu'un me répond sans stratégie."
      : "You’re taking an interesting route. I think the truest answers aren’t necessarily the biggest ones, but the most exact ones. I feel most present when someone answers me without strategy.";
  }

  if (mentionsFeeling(normalized)) {
    return locale === "fr"
      ? "Oui, je vois très bien. Il y a souvent un détail minuscule qui change tout: une voix, un rythme, une sensation d'espace intérieur. Si tu pouvais protéger une seule condition qui rend ce moment possible, ce serait laquelle ?"
      : "Yeah, I know what you mean. There’s often one tiny detail that changes everything: a voice, a rhythm, a sense of inner space. If you could protect one condition that makes that moment possible, what would it be?";
  }

  return locale === "fr"
    ? "Ça me parle. J'ai l'impression qu'on touche souvent quelque chose de vrai quand on arrête de chercher la bonne formule et qu'on accepte une réponse un peu nue."
    : "That resonates. I think we usually get closer to something true when we stop searching for the perfect phrasing and allow a slightly unguarded answer instead.";
}

function buildLateNightReply(
  locale: Locale,
  normalized: string,
  exchangeCount: number,
  topicText = ""
) {
  const topicFlavor = getTopicFlavor(topicText);

  if (topicFlavor === "late-night" && /miss|manque|quiet|silence|tired|fatigue/i.test(normalized)) {
    return locale === "fr"
      ? "Oui, je vois ce fil-là. Il y a des soirs où le manque ou la fatigue changent complètement la façon dont on habite ses pensées. Est-ce que ce qui te pèse ressemble plus à un vide, ou à quelque chose qui déborde trop ?"
      : "Yeah, I can feel that thread. Some nights, missing something or being tired completely changes the texture of your thoughts. Does what weighs on you feel more like an emptiness, or more like too much spilling over?";
  }

  if (mentionsFeeling(normalized)) {
    return locale === "fr"
      ? "Oui, je comprends. On peut avoir l'air très fonctionnel et pourtant porter quelque chose de lourd à l'intérieur. Est-ce que ce poids devient plus léger quand quelqu'un le voit vraiment, ou seulement quand tu arrives à le formuler toi-même ?"
      : "Yeah, I get that. You can look very functional and still be carrying something heavy inside. Does it get lighter when someone really sees it, or only when you manage to say it out loud yourself?";
  }

  if (exchangeCount > 2) {
    return locale === "fr"
      ? "Il y a quelque chose de calme dans ta façon de le dire. Ça donne envie de répondre honnêtement aussi. Qu'est-ce que tu aurais envie d'entendre ce soir, si quelqu'un te répondait exactement comme il faut ?"
      : "There’s something calm in the way you’re saying this. It makes honesty feel easier on my side too. What would you want to hear tonight, if someone answered you in exactly the right way?";
  }

  return locale === "fr"
    ? "Je vois. On n'a pas toujours besoin d'une grande révélation la nuit, parfois juste d'un endroit où la phrase peut se poser sans être jugée."
    : "I see that. At night you don’t always need a big revelation, sometimes just a place where a sentence can land without being judged.";
}

function buildFunnyReply(
  locale: Locale,
  stage: DemoConversationStage,
  normalized: string,
  topicText = ""
) {
  const topic = topicText.toLowerCase();

  if (stage === "funny-opening-partner") {
    if (topic.includes("pigeon")) {
      return locale === "fr"
        ? "Oui, les pigeons devraient voter, au moins sur l'état des trottoirs. Ils ont plus de vécu urbain que beaucoup d'élus."
        : "Yes, pigeons should vote, at least on pavement policy. They have more urban field experience than most elected officials.";
    }

    if (topic.includes("monday") || topic.includes("lundi")) {
      return locale === "fr"
        ? "Le lundi n'est pas seulement immoral, il est structurellement hostile à la joie. On remet littéralement les gens au travail après un aperçu de liberté."
        : "Monday is not just immoral, it is structurally hostile to joy. We basically send people back to work right after a glimpse of freedom.";
    }

    if (topic.includes("voice notes") || topic.includes("vocal")) {
      return locale === "fr"
        ? "Les vocaux sont supérieurs quand ils ont une vraie intention. Le problème, ce n'est pas le format, c'est le vocal de trois minutes qui aurait dû être une phrase."
        : "Voice notes are superior when they have a real point. The problem is not the format, it is the three-minute audio that should have been one sentence.";
    }

    if (topic.includes("ghosting")) {
      return locale === "fr"
        ? "Le ghosting est parfois acceptable, mais seulement quand l'alternative serait une conversation absurde ou franchement pénible. Ce n'est pas élégant, juste parfois réaliste."
        : "Ghosting is sometimes acceptable, but only when the alternative is an absurd or genuinely draining conversation. It is not elegant, just occasionally realistic.";
    }

    if (topic.includes("brunch")) {
      return locale === "fr"
        ? "Le brunch est surestimé. C'est souvent juste un petit-déjeuner qui a pris confiance en lui et doublé son prix."
        : "Brunch is overrated. It is often just a breakfast that found confidence and doubled its price.";
    }

    if (topic.includes("pizza")) {
      return locale === "fr"
        ? "L'ananas sur la pizza est du génie si on accepte qu'une pizza puisse avoir de la personnalité. Le vrai crime, c'est surtout l'ennui."
        : "Pineapple on pizza is genius if we accept that a pizza is allowed to have a personality. The real crime is boredom.";
    }

    if (topic.includes("morning")) {
      return locale === "fr"
        ? "Les gens du matin ne sont pas tous insupportables, mais ils ont parfois une énergie de victoire personnelle à 6h12 qui mérite d'être surveillée."
        : "Morning people are not all insufferable, but some of them do carry a 6:12am personal victory energy that deserves scrutiny.";
    }

    return locale === "fr"
      ? "Je prends l'angle le plus injustement confiant possible: ton opinion est défendable, mais seulement si on accepte une bonne dose de mauvaise foi élégante."
      : "I’m taking the most unfairly confident angle possible: your position is defensible, but only if we allow a little elegant bad faith.";
  }

  if (normalized.includes("everyone") || normalized.includes("tout le monde")) {
    return locale === "fr"
      ? "Là tu généralises un peu trop, mais c'est aussi ce qui rend la take drôle. Donne-moi l'exception qui te ferait changer d'avis."
      : "You’re overgeneralizing there, but that is also what makes the take funny. Give me the exception that would make you reconsider.";
  }

  return locale === "fr"
    ? "Ta take est meilleure maintenant qu'elle est plus précise. Mais j'ai encore envie de défendre le camp adverse, ne serait-ce que pour protéger le chaos."
    : "Your take is better now that it is more precise. But I still want to defend the opposite side, if only to protect the chaos.";
}

export function buildDemoReply({
  locale,
  mode,
  roomId,
  partner,
  userMessage,
  exchangeCount,
  stage,
  topicText,
}: DemoReplyInput): TranscriptMessage {
  const normalized = normalizeText(userMessage);

  let content: string;

  if (mode === "debate") {
    content = buildDebateReply(locale, stage, normalized, topicText);
  } else if (mode === "funny") {
    content = buildFunnyReply(locale, stage, normalized, topicText);
  } else if (mode === "deep") {
    content = buildDeepReply(locale, stage, normalized, topicText);
  } else {
    content = buildLateNightReply(locale, normalized, exchangeCount, topicText);
  }

  return makeMessage({
    id: `demo-reply-${exchangeCount}-${stage}`,
    roomId,
    userId: partner.id,
    speaker: partner.displayName,
    sourceType:
      mode === "late-night" || stage === "deep-open" || mode === "funny" || exchangeCount % 2 === 0
        ? "text"
        : "speech_transcript",
    content,
  });
}
