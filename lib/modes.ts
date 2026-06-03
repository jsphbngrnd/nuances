import type { ConversationMode, ModeDefinition } from "@/lib/types";

type LocalizedText = {
  en: string;
  fr: string;
};

type LocalizedList = {
  en: string[];
  fr: string[];
};

export type ExchangeCatalogItem = {
  id: string;
  mode?: ConversationMode;
  active: boolean;
  emoji: string;
  title: LocalizedText;
  description: LocalizedText;
  duration: LocalizedText;
  structure: LocalizedList;
  promptCategory: LocalizedText;
  emotionalTone: LocalizedText;
  reconnectOption: LocalizedText;
  aiSummary: LocalizedText;
  prompts: LocalizedList;
  gradientClass: string;
};

export const MODE_CONFIG: Record<ConversationMode, ModeDefinition> = {
  debate: {
    id: "debate",
    emoji: "⚔️",
    name: "Debate",
    shortLabel: "Structured confrontation",
    tagline: "Two strangers. One idea. Intelligent confrontation.",
    description:
      "Fast, sharp, and replayable. The timer keeps both sides honest while the room stays fair.",
    cadence: "4 min",
    colorClass: "from-[#1b1b1b] via-[#101010] to-[#050505]",
    waitingCopy: "Looking for someone sharp, available now, and ready to defend an idea.",
  },
  funny: {
    id: "funny",
    emoji: "😂",
    name: "Funny",
    shortLabel: "Playful hot takes",
    tagline: "Two strangers. One absurd opinion. Fast social energy.",
    description:
      "Short, opinionated, and culturally alive. Funny is built for playful disagreements that are easy to enter and easy to replay.",
    cadence: "3 min",
    colorClass: "from-[#1a1a1a] via-[#101010] to-[#050505]",
    waitingCopy: "Looking for someone playful, quick, and ready to argue a ridiculous point seriously.",
  },
  deep: {
    id: "deep",
    emoji: "🧠",
    name: "Deep",
    shortLabel: "Reflective exchange",
    tagline: "Two strangers. One meaningful question. Space to go further.",
    description:
      "A guided opening gives both people time to land before the conversation opens into something more natural.",
    cadence: "5 min",
    colorClass: "from-[#181818] via-[#101010] to-[#060606]",
    waitingCopy: "Looking for someone calm, reflective, and willing to stay with a real question.",
  },
  "late-night": {
    id: "late-night",
    emoji: "🌙",
    name: "Late Night",
    shortLabel: "Soft open room",
    tagline: "A warm conversation for the hours when you want presence, not noise.",
    description:
      "Gentle, open, and lightly held. The room stays soft, and AI only steps in if silence lingers too long.",
    cadence: "5 min",
    colorClass: "from-[#151515] via-[#0b0b0b] to-[#020202]",
    waitingCopy: "Looking for someone who wants a real human presence tonight.",
  },
};

export const MODE_ORDER: ConversationMode[] = ["debate", "funny", "deep", "late-night"];

export const EXCHANGE_CATALOG: ExchangeCatalogItem[] = [
  {
    id: "debate",
    mode: "debate",
    active: true,
    emoji: "⚔️",
    title: {
      en: "Debate",
      fr: "Débat",
    },
    description: {
      en: "Intelligent confrontation of ideas with clear turns and enough edge to stay energizing.",
      fr: "Une confrontation intelligente des idées, avec des tours clairs et juste assez de tension pour rester stimulante.",
    },
    duration: {
      en: "4 min",
      fr: "4 min",
    },
    structure: {
      en: [
        "Topic appears for both people and both accept it.",
        "Round 1: User A speaks 60 sec, User B speaks 60 sec.",
        "Round 2: User A replies 30 sec, User B replies 30 sec.",
        "Optional final reply: 20 sec each.",
      ],
      fr: [
        "Le sujet apparaît pour les deux personnes, puis chacune l'accepte.",
        "Round 1 : Utilisateur A parle 60 s, Utilisateur B parle 60 s.",
        "Round 2 : Utilisateur A répond 30 s, Utilisateur B répond 30 s.",
        "Réplique finale optionnelle : 20 s chacun.",
      ],
    },
    promptCategory: {
      en: "Ideas, ethics, society, technology",
      fr: "Idées, éthique, société, technologie",
    },
    emotionalTone: {
      en: "Energetic, stimulating, sharp",
      fr: "Énergique, stimulant, vif",
    },
    reconnectOption: {
      en: "Mutual talk-again request after the summary.",
      fr: "Demande mutuelle pour reparler après le résumé.",
    },
    aiSummary: {
      en: "Strongest point from each side, agreement points, disagreement points, and a mind-change check.",
      fr: "Point fort de chaque côté, points d'accord, points de désaccord, et question sur un éventuel changement d'avis.",
    },
    prompts: {
      en: [
        "Should inheritance be limited?",
        "Does money buy freedom?",
        "Is ambition overrated?",
      ],
      fr: [
        "Faut-il limiter l'héritage ?",
        "L'argent achète-t-il la liberté ?",
        "L'ambition est-elle surestimée ?",
      ],
    },
    gradientClass: "from-[#1b1b1b] via-[#101010] to-[#050505]",
  },
  {
    id: "deep",
    mode: "deep",
    active: true,
    emoji: "🧠",
    title: {
      en: "Deep",
      fr: "Deep",
    },
    description: {
      en: "A meaningful conversation format with enough structure to create calm, depth, and emotional attachment.",
      fr: "Un format de conversation profond, avec assez de structure pour créer du calme, de la profondeur et un vrai attachement.",
    },
    duration: {
      en: "5 min",
      fr: "5 min",
    },
    structure: {
      en: [
        "Topic appears for both people.",
        "User A speaks 90 sec, then User B speaks 90 sec.",
        "The room opens for a 2-minute free exchange.",
      ],
      fr: [
        "Le sujet apparaît pour les deux personnes.",
        "L'utilisateur A parle 90 s, puis l'utilisateur B parle 90 s.",
        "Le salon s'ouvre ensuite sur 2 minutes d'échange libre.",
      ],
    },
    promptCategory: {
      en: "Identity, growth, meaning, emotional clarity",
      fr: "Identité, évolution, sens, clarté émotionnelle",
    },
    emotionalTone: {
      en: "Calm, reflective, intimate",
      fr: "Calme, réfléchi, intime",
    },
    reconnectOption: {
      en: "Mutual reconnect request if the exchange deserves more time.",
      fr: "Recontact mutuel si l'échange mérite plus de temps.",
    },
    aiSummary: {
      en: "Common themes, emotional tone, and one follow-up question if both reconnect.",
      fr: "Thèmes communs, tonalité émotionnelle et une question de suivi si les deux personnes se reconnectent.",
    },
    prompts: {
      en: [
        "What changed your mind recently?",
        "What do people misunderstand about you?",
        "When do you feel most alive?",
      ],
      fr: [
        "Qu'est-ce qui a récemment changé ton regard ?",
        "Que comprennent mal les gens chez toi ?",
        "Quand te sens-tu le plus vivant ?",
      ],
    },
    gradientClass: "from-[#181818] via-[#101010] to-[#060606]",
  },
  {
    id: "late-night",
    mode: "late-night",
    active: true,
    emoji: "🌙",
    title: {
      en: "Late Night",
      fr: "Late Night",
    },
    description: {
      en: "A softer open room built to reduce loneliness and create the feeling of real presence at night.",
      fr: "Un salon plus doux, pensé pour réduire la solitude et recréer une vraie présence humaine la nuit.",
    },
    duration: {
      en: "5 min",
      fr: "5 min",
    },
    structure: {
      en: [
        "A gentle prompt appears for both people.",
        "The room stays open and unforced.",
        "If silence lasts more than 15 sec, AI injects one gentle follow-up.",
      ],
      fr: [
        "Un prompt doux apparaît pour les deux personnes.",
        "Le salon reste ouvert, sans pression.",
        "Si le silence dure plus de 15 s, l'IA injecte une relance douce.",
      ],
    },
    promptCategory: {
      en: "Presence, vulnerability, night thoughts, emotional check-ins",
      fr: "Présence, vulnérabilité, pensées nocturnes, check-in émotionnel",
    },
    emotionalTone: {
      en: "Soft, warm, vulnerable",
      fr: "Doux, chaleureux, vulnérable",
    },
    reconnectOption: {
      en: "Warm reconnect request after the closing summary.",
      fr: "Demande douce de recontact après le résumé de fin.",
    },
    aiSummary: {
      en: "Warm summary, emotional check-out, and a reconnect invitation.",
      fr: "Résumé chaleureux, ressenti de fin et invitation à se reconnecter.",
    },
    prompts: {
      en: [
        "What kind of night are you having?",
        "What's on your mind right now?",
        "What do you wish someone asked you?",
      ],
      fr: [
        "Quel genre de nuit es-tu en train de vivre ?",
        "Qu'est-ce qui t'occupe l'esprit en ce moment ?",
        "Qu'aimerais-tu que quelqu'un te demande ?",
      ],
    },
    gradientClass: "from-[#151515] via-[#0b0b0b] to-[#020202]",
  },
  {
    id: "chemistry",
    active: false,
    emoji: "❤️",
    title: {
      en: "Chemistry",
      fr: "Chemistry",
    },
    description: {
      en: "Romantic or emotional connection without turning NUANCE into a profile-first dating app.",
      fr: "Une connexion romantique ou émotionnelle, sans transformer NUANCE en app de dating centrée sur le profil.",
    },
    duration: {
      en: "4 min",
      fr: "4 min",
    },
    structure: {
      en: ["Five guided intimate questions in sequence."],
      fr: ["Cinq questions intimes guidées, en séquence."],
    },
    promptCategory: {
      en: "Love, attraction, emotional needs",
      fr: "Amour, attirance, besoins émotionnels",
    },
    emotionalTone: {
      en: "Tender, direct, emotionally open",
      fr: "Tendre, direct, émotionnellement ouvert",
    },
    reconnectOption: {
      en: "Mutual reconnect if both people want another conversation.",
      fr: "Recontact mutuel si les deux personnes veulent poursuivre.",
    },
    aiSummary: {
      en: "Compatibility snapshot and a suggested follow-up.",
      fr: "Aperçu de compatibilité et suggestion de suite.",
    },
    prompts: {
      en: ["What attracts you in someone?", "What do you need emotionally?"],
      fr: ["Qu'est-ce qui t'attire chez quelqu'un ?", "De quoi as-tu besoin émotionnellement ?"],
    },
    gradientClass: "from-[#1c1c1c] via-[#101010] to-[#050505]",
  },
  {
    id: "funny",
    mode: "funny",
    active: true,
    emoji: "😂",
    title: {
      en: "Funny",
      fr: "Funny",
    },
    description: {
      en: "A lighter room designed for absurd takes, humor, and short bursts of social energy.",
      fr: "Un salon plus léger, pensé pour les takes absurdes, l'humour et les petites décharges d'énergie sociale.",
    },
    duration: {
      en: "3 min",
      fr: "3 min",
    },
    structure: {
      en: ["Quick absurd rounds with punchy prompts and fast replies."],
      fr: ["Rounds absurdes et rapides, avec prompts punchy et réponses courtes."],
    },
    promptCategory: {
      en: "Humor, absurdity, social play",
      fr: "Humour, absurdité, jeu social",
    },
    emotionalTone: {
      en: "Playful, weird, fast",
      fr: "Joueur, étrange, rapide",
    },
    reconnectOption: {
      en: "Optional if the vibe lands.",
      fr: "Optionnel si l'énergie fonctionne.",
    },
    aiSummary: {
      en: "Most absurd moment and shared comedic angle.",
      fr: "Moment le plus absurde et angle comique partagé.",
    },
    prompts: {
      en: ["Should pigeons vote?", "Is Monday immoral?"],
      fr: ["Les pigeons devraient-ils voter ?", "Le lundi est-il immoral ?"],
    },
    gradientClass: "from-[#1a1a1a] via-[#0f0f0f] to-[#050505]",
  },
  {
    id: "learn",
    active: false,
    emoji: "📚",
    title: {
      en: "Learn",
      fr: "Learn",
    },
    description: {
      en: "A stranger-to-stranger teaching format for practical knowledge, lived lessons, and curiosity.",
      fr: "Un format pour apprendre entre inconnus, autour de savoirs concrets, de leçons vécues et de curiosité.",
    },
    duration: {
      en: "5 min",
      fr: "5 min",
    },
    structure: {
      en: [
        "User A teaches something for 2 min.",
        "User B asks questions.",
        "Then roles switch.",
      ],
      fr: [
        "L'utilisateur A explique quelque chose pendant 2 min.",
        "L'utilisateur B pose des questions.",
        "Puis les rôles s'inversent.",
      ],
    },
    promptCategory: {
      en: "Skills, lessons, expertise, lived knowledge",
      fr: "Compétences, leçons, expertise, savoir vécu",
    },
    emotionalTone: {
      en: "Curious, generous, useful",
      fr: "Curieux, généreux, utile",
    },
    reconnectOption: {
      en: "Optional if both want a longer exchange.",
      fr: "Optionnel si les deux veulent prolonger l'échange.",
    },
    aiSummary: {
      en: "What each person taught and what was worth remembering.",
      fr: "Ce que chacun a transmis et ce qu'il faut retenir.",
    },
    prompts: {
      en: ["Teach me one life lesson.", "What skill changed your life?"],
      fr: ["Apprends-moi une leçon de vie.", "Quelle compétence a changé ta vie ?"],
    },
    gradientClass: "from-[#181818] via-[#101010] to-[#060606]",
  },
  {
    id: "change-my-mind",
    active: false,
    emoji: "🔄",
    title: {
      en: "Change My Mind",
      fr: "Change My Mind",
    },
    description: {
      en: "A persuasion game where one person arrives with a conviction and the other tries to move it.",
      fr: "Un jeu de persuasion où une personne arrive avec une conviction et l'autre essaie de la déplacer.",
    },
    duration: {
      en: "4 min",
      fr: "4 min",
    },
    structure: {
      en: ["One user enters with an opinion. The other tries to change it. End with a yes-or-no result."],
      fr: ["Une personne arrive avec une opinion. L'autre tente de la faire évoluer. Fin sur un résultat oui/non."],
    },
    promptCategory: {
      en: "Persuasion, rhetoric, argument",
      fr: "Persuasion, rhétorique, argumentation",
    },
    emotionalTone: {
      en: "Competitive, sharp, playful",
      fr: "Compétitif, vif, joueur",
    },
    reconnectOption: {
      en: "Optional rematch if both want round two.",
      fr: "Revanche optionnelle si les deux veulent un second round.",
    },
    aiSummary: {
      en: "Did the opinion move and which argument mattered most?",
      fr: "L'opinion a-t-elle bougé et quel argument a le plus compté ?",
    },
    prompts: {
      en: ["Bring an opinion you hold strongly.", "Can the other person move it?"],
      fr: ["Arrive avec une opinion forte.", "L'autre peut-il la faire évoluer ?"],
    },
    gradientClass: "from-[#1b1b1b] via-[#101010] to-[#050505]",
  },
];

export const LIVE_EXCHANGE_CATALOG = EXCHANGE_CATALOG.filter((item) => item.active);
export const FUTURE_EXCHANGE_CATALOG = EXCHANGE_CATALOG.filter((item) => !item.active);

export function localizeModeText(locale: "en" | "fr", value: LocalizedText) {
  return value[locale];
}

export function localizeModeList(locale: "en" | "fr", value: LocalizedList) {
  return value[locale];
}
