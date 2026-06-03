import type {
  ConversationRoom,
  ConversationMode,
  ConversationTopic,
  ConversationTurn,
  QueueEntry,
  RoomSummary,
  TranscriptMessage,
  UserProfile,
} from "@/lib/types";
import type { Locale } from "@/lib/i18n";

const now = "2026-04-17T22:18:00.000Z";

export const mockUsers: UserProfile[] = [
  {
    id: "user-nova",
    displayName: "Nova",
    alias: "OracleDuVendredi",
    aliasFamily: "oracle",
    aliasStage: 1,
    ageRange: "25-29",
    language: "English",
    country: "France",
    mood: "Curious",
    interests: ["Ideas", "Cities", "Identity"],
    voiceEnabled: true,
    reconnectEnabled: true,
    trustScore: 0.96,
  },
  {
    id: "user-mara",
    displayName: "Mara",
    alias: "BrumeDesQuestions",
    aliasFamily: "brume",
    aliasStage: 2,
    ageRange: "30-34",
    language: "English",
    country: "Belgium",
    mood: "Reflective",
    interests: ["Psychology", "Books", "Night walks"],
    voiceEnabled: true,
    reconnectEnabled: true,
    trustScore: 0.92,
  },
];

export const mockTopics: ConversationTopic[] = [
  {
    id: "topic-debate-ai",
    mode: "debate",
    text: "Is AI making us intellectually lazy?",
    category: "Technology",
    difficulty: "sharp",
    active: true,
  },
  {
    id: "topic-debate-money",
    mode: "debate",
    text: "Does money make people freer?",
    category: "Society",
    difficulty: "sharp",
    active: true,
  },
  {
    id: "topic-debate-inheritance",
    mode: "debate",
    text: "Should inheritance be limited?",
    category: "Justice",
    difficulty: "sharp",
    active: true,
  },
  {
    id: "topic-debate-ambition",
    mode: "debate",
    text: "Is ambition overrated?",
    category: "Work",
    difficulty: "sharp",
    active: true,
  },
  {
    id: "topic-debate-university",
    mode: "debate",
    text: "Should university be free for everyone?",
    category: "Education",
    difficulty: "sharp",
    active: true,
  },
  {
    id: "topic-debate-remote-work",
    mode: "debate",
    text: "Has remote work made life better overall?",
    category: "Work",
    difficulty: "sharp",
    active: true,
  },
  {
    id: "topic-debate-cancel-culture",
    mode: "debate",
    text: "Does cancel culture hold people accountable or make honest conversation harder?",
    category: "Culture",
    difficulty: "sharp",
    active: true,
  },
  {
    id: "topic-debate-privacy",
    mode: "debate",
    text: "Should privacy matter more than convenience online?",
    category: "Technology",
    difficulty: "sharp",
    active: true,
  },
  {
    id: "topic-debate-growth",
    mode: "debate",
    text: "Can endless personal growth become another form of pressure?",
    category: "Culture",
    difficulty: "sharp",
    active: true,
  },
  {
    id: "topic-funny-pigeons",
    mode: "funny",
    text: "Should pigeons vote?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-monday",
    mode: "funny",
    text: "Is Monday immoral?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-voice-notes",
    mode: "funny",
    text: "Are voice notes better than texts?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-ghosting",
    mode: "funny",
    text: "Is ghosting ever acceptable?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-brunch",
    mode: "funny",
    text: "Is brunch overrated?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-memes",
    mode: "funny",
    text: "Are memes a real form of intelligence?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-pizza",
    mode: "funny",
    text: "Pineapple on pizza: crime or genius?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-morning",
    mode: "funny",
    text: "Are morning people secretly insufferable?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-phone-codes",
    mode: "funny",
    text: "Should couples share their phone codes?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-networking",
    mode: "funny",
    text: "Is everyone pretending to like networking?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-walk",
    mode: "funny",
    text: "Can someone be cool if they walk too slowly?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-oversharing",
    mode: "funny",
    text: "Is oversharing online making everyone less mysterious?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-scorpios",
    mode: "funny",
    text: "Are Scorpios really a sign apart?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-geminis",
    mode: "funny",
    text: "Are Geminis unfairly judged?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-signs",
    mode: "funny",
    text: "Can you guess someone’s sign too fast?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-astrology-therapy",
    mode: "funny",
    text: "Is astrology just therapy in disguise?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-reply-fast",
    mode: "funny",
    text: "Is replying too fast unattractive?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-flirt-irony",
    mode: "funny",
    text: "Can you flirt without irony anymore?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-honest-rude",
    mode: "funny",
    text: "Are people who say “I’m just honest” usually rude?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-charisma",
    mode: "funny",
    text: "Is charisma more powerful than intelligence?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-coffee-tea",
    mode: "funny",
    text: "Is coffee actually better than tea?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-sweet-salty",
    mode: "funny",
    text: "Is sweet-and-salty always a good idea?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-run-6am",
    mode: "funny",
    text: "Are people who run at 6am morally superior?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-booked-busy",
    mode: "funny",
    text: "Is being “booked and busy” just a modern flex?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-paris",
    mode: "funny",
    text: "Is Paris better without Parisians?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-metro",
    mode: "funny",
    text: "Does the metro build character?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-city-30",
    mode: "funny",
    text: "Is city life overrated after 30?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-rooftop-bars",
    mode: "funny",
    text: "Are rooftop bars all the same?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-irony",
    mode: "funny",
    text: "Is irony ruining sincerity?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-funny-dating-branding",
    mode: "funny",
    text: "Has dating become a branding exercise?",
    category: "Funny",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-deep-alive",
    mode: "deep",
    text: "When do you feel most alive?",
    category: "Identity",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-deep-change",
    mode: "deep",
    text: "What has changed your mind recently?",
    category: "Identity",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-deep-outgrown",
    mode: "deep",
    text: "What have you outgrown lately?",
    category: "Growth",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-deep-understand-yourself",
    mode: "deep",
    text: "What are you still trying to understand about yourself?",
    category: "Identity",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-deep-generation",
    mode: "deep",
    text: "What do people misunderstand about your generation?",
    category: "Society",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-deep-lying-to-yourself",
    mode: "deep",
    text: "Where in your life do you think you might still be lying to yourself a little?",
    category: "Honesty",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-deep-chasing",
    mode: "deep",
    text: "What are you chasing right now, and why does it matter to you?",
    category: "Purpose",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-deep-home",
    mode: "deep",
    text: "What makes a place feel like home to you now?",
    category: "Belonging",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-deep-change-advice",
    mode: "deep",
    text: "What advice did you reject for years before finally understanding it?",
    category: "Growth",
    difficulty: "balanced",
    active: true,
  },
  {
    id: "topic-late-night-carry",
    mode: "late-night",
    text: "What are you carrying that people do not see?",
    category: "Late Night",
    difficulty: "gentle",
    active: true,
  },
  {
    id: "topic-late-night-night",
    mode: "late-night",
    text: "What kind of night are you having?",
    category: "Late Night",
    difficulty: "gentle",
    active: true,
  },
  {
    id: "topic-late-night-miss",
    mode: "late-night",
    text: "What do you miss right now?",
    category: "Late Night",
    difficulty: "gentle",
    active: true,
  },
  {
    id: "topic-late-night-say",
    mode: "late-night",
    text: "What do you wish you could say more easily?",
    category: "Late Night",
    difficulty: "gentle",
    active: true,
  },
  {
    id: "topic-late-night-mind",
    mode: "late-night",
    text: "What has been on your mind today that you have not really said out loud?",
    category: "Late Night",
    difficulty: "gentle",
    active: true,
  },
  {
    id: "topic-late-night-asked",
    mode: "late-night",
    text: "What do you wish someone would ask you tonight?",
    category: "Late Night",
    difficulty: "gentle",
    active: true,
  },
  {
    id: "topic-late-night-tired",
    mode: "late-night",
    text: "What kind of tired are you right now?",
    category: "Late Night",
    difficulty: "gentle",
    active: true,
  },
  {
    id: "topic-late-night-softness",
    mode: "late-night",
    text: "What helps you soften when life has made you tense all day?",
    category: "Late Night",
    difficulty: "gentle",
    active: true,
  },
  {
    id: "topic-late-night-quiet",
    mode: "late-night",
    text: "What do you notice only when everything finally gets quiet?",
    category: "Late Night",
    difficulty: "gentle",
    active: true,
  },
];

export const mockQueue: QueueEntry[] = [
  {
    id: "queue-1",
    userId: "user-nova",
    mode: "late-night",
    language: "English",
    trustScore: 0.96,
    compatibleLanguages: ["French"],
    country: "France",
    status: "waiting",
    createdAt: now,
  },
  {
    id: "queue-2",
    userId: "user-mara",
    mode: "late-night",
    language: "English",
    trustScore: 0.92,
    compatibleLanguages: ["Dutch"],
    country: "Belgium",
    status: "waiting",
    createdAt: now,
  },
];

function buildParticipants(roomId: string) {
  return [
    {
      id: `${roomId}-rp-1`,
      roomId,
      userId: "user-nova",
      joinedAt: now,
    },
    {
      id: `${roomId}-rp-2`,
      roomId,
      userId: "user-mara",
      joinedAt: now,
    },
  ];
}

export const mockRooms: ConversationRoom[] = [
  {
    id: "room-debate-17",
    mode: "debate",
    status: "live",
    topicId: "topic-debate-ai",
    createdAt: now,
    users: mockUsers,
    participants: buildParticipants("room-debate-17"),
  },
  {
    id: "room-deep-17",
    mode: "deep",
    status: "live",
    topicId: "topic-deep-alive",
    createdAt: now,
    users: mockUsers,
    participants: buildParticipants("room-deep-17"),
  },
  {
    id: "room-funny-17",
    mode: "funny",
    status: "live",
    topicId: "topic-funny-pigeons",
    createdAt: now,
    users: mockUsers,
    participants: buildParticipants("room-funny-17"),
  },
  {
    id: "room-late-night-17",
    mode: "late-night",
    status: "live",
    topicId: "topic-late-night-carry",
    createdAt: now,
    users: mockUsers,
    participants: buildParticipants("room-late-night-17"),
  },
];

export const mockRoom = mockRooms.find((room) => room.mode === "late-night") ?? mockRooms[0];

export function getDemoRoomIdForMode(mode: "debate" | "funny" | "deep" | "late-night") {
  if (mode === "debate") return "room-debate-17";
  if (mode === "funny") return "room-funny-17";
  if (mode === "deep") return "room-deep-17";
  return "room-late-night-17";
}

export function getDemoRoomById(roomId: string) {
  return mockRooms.find((room) => room.id === roomId) ?? mockRoom;
}

export function getTopicsForMode(mode: "debate" | "funny" | "deep" | "late-night") {
  return mockTopics.filter((topic) => topic.mode === mode && topic.active);
}

export type ConversationQuoteOfDay = {
  id: string;
  mode: ConversationMode;
  quote: string;
  topic: string;
  sourceLabel: string;
};

const conversationQuoteArchive = [
  {
    id: "quote-late-night-precision",
    mode: "late-night" as const,
    quote: {
      en: "Honestly, hearing someone answer with precision instead of performance.",
      fr: "Honnêtement, entendre quelqu'un répondre avec précision plutôt qu'avec performance.",
    },
    topic: {
      en: "What usually helps you feel less alone, even briefly?",
      fr: "Qu'est-ce qui vous aide à vous sentir moins seul, même brièvement ?",
    },
  },
  {
    id: "quote-debate-freedom",
    mode: "debate" as const,
    quote: {
      en: "I do not think freedom starts with money. I think money mostly changes the kinds of fear you can ignore.",
      fr: "Je ne crois pas que la liberté commence avec l'argent. Je crois surtout que l'argent change les peurs qu'on peut se permettre d'ignorer.",
    },
    topic: {
      en: "Does money make people freer?",
      fr: "Est-ce que l'argent rend vraiment plus libre ?",
    },
  },
  {
    id: "quote-deep-alive",
    mode: "deep" as const,
    quote: {
      en: "I feel most alive when I stop editing myself in real time.",
      fr: "Je me sens le plus vivant quand j'arrête de me corriger en temps réel.",
    },
    topic: {
      en: "When do you feel most alive?",
      fr: "Quand vous sentez-vous le plus vivant ?",
    },
  },
  {
    id: "quote-late-night-presence",
    mode: "late-night" as const,
    quote: {
      en: "Some nights I do not need advice. I just need someone to stay in the conversation long enough.",
      fr: "Certaines nuits, je n'ai pas besoin de conseils. J'ai juste besoin que quelqu'un reste assez longtemps dans la conversation.",
    },
    topic: {
      en: "What kind of night are you having?",
      fr: "Quel genre de nuit êtes-vous en train de vivre ?",
    },
  },
  {
    id: "quote-debate-ambition",
    mode: "debate" as const,
    quote: {
      en: "Ambition feels healthy until your inner voice starts sounding like a quarterly report.",
      fr: "L'ambition semble saine jusqu'au moment où votre voix intérieure commence à ressembler à un rapport trimestriel.",
    },
    topic: {
      en: "Is ambition overrated?",
      fr: "L'ambition est-elle surestimée ?",
    },
  },
  {
    id: "quote-deep-peace",
    mode: "deep" as const,
    quote: {
      en: "What changed my mind recently is realizing that peace and excitement do not always live in the same room.",
      fr: "Ce qui m'a fait changer d'avis récemment, c'est de comprendre que la paix et l'excitation n'habitent pas toujours la même pièce.",
    },
    topic: {
      en: "What has changed your mind recently?",
      fr: "Qu'est-ce qui a récemment changé votre regard ?",
    },
  },
];

function getDateSeed(timeZone = "Europe/Paris") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value ?? "2026";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

function hashSeed(value: string) {
  return value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function getConversationQuoteOfTheDay(locale: Locale): ConversationQuoteOfDay {
  const index = hashSeed(getDateSeed()) % conversationQuoteArchive.length;
  const entry = conversationQuoteArchive[index];

  return {
    id: entry.id,
    mode: entry.mode,
    quote: entry.quote[locale],
    topic: entry.topic[locale],
    sourceLabel:
      locale === "fr"
        ? "Extrait de la communauté NUANCE"
        : "From the NUANCE community",
  };
}

export const mockTranscript: TranscriptMessage[] = [
  {
    id: "msg-system-1",
    roomId: mockRoom.id,
    userId: "system",
    speaker: "NUANCE",
    sourceType: "system",
    content: "Late Night is open. Speak naturally. If the room goes quiet, I can offer one gentle follow-up.",
    moderationStatus: "approved",
    createdAt: now,
  },
  {
    id: "msg-1",
    roomId: mockRoom.id,
    userId: "user-nova",
    speaker: "Nova",
    sourceType: "speech_transcript",
    content: "I keep acting calm in busy weeks, but really I miss having the kind of conversations that slow me down.",
    moderationStatus: "approved",
    createdAt: now,
  },
  {
    id: "msg-2",
    roomId: mockRoom.id,
    userId: "user-mara",
    speaker: "Mara",
    sourceType: "speech_transcript",
    content: "That makes sense. I think a lot of us look functional while carrying a low hum of loneliness underneath.",
    moderationStatus: "approved",
    createdAt: now,
  },
  {
    id: "msg-3",
    roomId: mockRoom.id,
    userId: "system",
    speaker: "NUANCE",
    sourceType: "system",
    content: "Gentle follow-up: what usually helps you feel less alone, even briefly?",
    moderationStatus: "approved",
    createdAt: now,
  },
  {
    id: "msg-4",
    roomId: mockRoom.id,
    userId: "user-nova",
    speaker: "Nova",
    sourceType: "text",
    content: "Honestly, hearing someone answer with precision instead of performance.",
    moderationStatus: "approved",
    createdAt: now,
  },
];

export const mockTurns: ConversationTurn[] = [
  {
    id: "turn-1",
    roomId: mockRoom.id,
    roundNumber: 1,
    userId: "user-nova",
    turnType: "free",
    durationSeconds: 300,
    startedAt: now,
  },
];

export const mockSummary: RoomSummary = {
  id: "summary-1",
  roomId: mockRoom.id,
  summaryText:
    "Both people spoke about the quiet forms of loneliness that can hide inside competent-looking lives, and the relief of being met with honesty instead of performance.",
  agreementPoints: [
    "Connection feels better when the other person answers precisely and without social theater.",
    "Loneliness often appears in subtle forms rather than dramatic ones.",
  ],
  disagreementPoints: [],
  mainThemes: ["Hidden loneliness", "Honesty", "Emotional relief"],
  semanticTags: ["loneliness", "connection", "honesty", "vulnerability", "soft"],
  emotionalTone: "Warm, candid, and gently vulnerable.",
  followUpQuestion: "What kind of conversation do you wish existed more often in your everyday life?",
  generatedAt: now,
};

export const mockReconnects = [
  {
    id: "reconnect-1",
    displayName: "Mara",
    mode: "Late Night",
    lastTopic: "What are you carrying that people do not see?",
    lastMet: "2 nights ago",
    status: "Mutual",
  },
  {
    id: "reconnect-2",
    displayName: "Ilan",
    mode: "Debate",
    lastTopic: "Does money make people freer?",
    lastMet: "Last week",
    status: "Pending",
  },
];

export const liveStats = {
  onlineNow: 142,
  activeDebates: 28,
  activeDeep: 19,
  activeLateNight: 41,
  completionRate: "72%",
};
