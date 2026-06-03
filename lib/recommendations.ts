import type {
  ConversationMode,
  RecommendationAction,
  RecommendationItem,
  RecommendationType,
  RoomSummary,
  TranscriptMessage,
} from "@/lib/types";
import type { Locale } from "@/lib/i18n";

const STORAGE_KEY = "nuance-recommendation-events";
const SAVED_KEY = "nuance-saved-recommendations";

function buildRecommendation(
  item: RecommendationItem
): RecommendationItem {
  return item;
}

export const RECOMMENDATION_DATABASE: RecommendationItem[] = [
  buildRecommendation({
    id: "book-course-of-love",
    title: "The Course of Love",
    type: "book",
    shortDescription:
      "A literary look at love, miscommunication, and the skills required to stay emotionally honest with another person.",
    tags: ["love", "relationships", "vulnerability", "honesty", "connection"],
    conversationModes: ["deep", "late-night"],
    emotionalTones: ["reflective", "soft"],
    url: "https://example.com/nuance/the-course-of-love",
    imageUrl: "https://images.example.com/nuance/the-course-of-love.jpg",
    affiliateUrl: "https://example.com/affiliate/the-course-of-love",
    active: true,
  }),
  buildRecommendation({
    id: "podcast-modern-love",
    title: "On Love and Modern Relationships",
    type: "podcast",
    shortDescription:
      "A long-form conversation about emotional honesty, closeness, and the friction of contemporary intimacy.",
    tags: ["love", "relationships", "vulnerability", "modern relationships"],
    conversationModes: ["deep", "late-night"],
    emotionalTones: ["soft", "reflective"],
    url: "https://example.com/nuance/on-love-and-modern-relationships",
    imageUrl: "https://images.example.com/nuance/on-love-and-modern-relationships.jpg",
    active: true,
  }),
  buildRecommendation({
    id: "article-say-what-we-feel",
    title: "Why We Struggle to Say What We Feel",
    type: "article",
    shortDescription:
      "An essay on silence, emotional protection, and why vulnerability often arrives late.",
    tags: ["vulnerability", "silence", "intimacy", "honesty", "loneliness"],
    conversationModes: ["deep", "late-night"],
    emotionalTones: ["soft", "reflective"],
    url: "https://example.com/nuance/why-we-struggle-to-say-what-we-feel",
    imageUrl: "https://images.example.com/nuance/why-we-struggle-to-say-what-we-feel.jpg",
    active: true,
  }),
  buildRecommendation({
    id: "book-private-truths",
    title: "Private Truths, Public Lies",
    type: "book",
    shortDescription:
      "A sharp book on preference falsification, social pressure, and why people hide what they really think.",
    tags: ["truth", "honesty", "society", "power", "identity"],
    conversationModes: ["debate", "deep"],
    emotionalTones: ["sharp", "reflective"],
    url: "https://example.com/nuance/private-truths-public-lies",
    imageUrl: "https://images.example.com/nuance/private-truths-public-lies.jpg",
    affiliateUrl: "https://example.com/affiliate/private-truths-public-lies",
    active: true,
  }),
  buildRecommendation({
    id: "podcast-money-freedom",
    title: "Does Wealth Create Freedom?",
    type: "podcast",
    shortDescription:
      "A two-sided discussion on money, autonomy, class, and the limits of economic freedom.",
    tags: ["money", "freedom", "class", "inequality", "power"],
    conversationModes: ["debate"],
    emotionalTones: ["sharp"],
    url: "https://example.com/nuance/does-wealth-create-freedom",
    imageUrl: "https://images.example.com/nuance/does-wealth-create-freedom.jpg",
    sponsorLabel: "Sponsored",
    active: true,
  }),
  buildRecommendation({
    id: "article-tax-fairness",
    title: "Inheritance, Taxation, and Fairness",
    type: "article",
    shortDescription:
      "A concise explainer on why inheritance keeps resurfacing whenever fairness and opportunity collide.",
    tags: ["inheritance", "fairness", "inequality", "money", "justice"],
    conversationModes: ["debate"],
    emotionalTones: ["sharp"],
    url: "https://example.com/nuance/inheritance-taxation-and-fairness",
    imageUrl: "https://images.example.com/nuance/inheritance-taxation-and-fairness.jpg",
    active: true,
  }),
  buildRecommendation({
    id: "book-self-knowledge",
    title: "The Examined Life",
    type: "book",
    shortDescription:
      "Reflections on identity, self-knowledge, and the ongoing work of understanding one's own contradictions.",
    tags: ["identity", "self-knowledge", "purpose", "change", "growth"],
    conversationModes: ["deep"],
    emotionalTones: ["reflective"],
    url: "https://example.com/nuance/the-examined-life",
    imageUrl: "https://images.example.com/nuance/the-examined-life.jpg",
    affiliateUrl: "https://example.com/affiliate/the-examined-life",
    active: true,
  }),
  buildRecommendation({
    id: "podcast-trying-to-understand-yourself",
    title: "Trying to Understand Yourself",
    type: "podcast",
    shortDescription:
      "A reflective episode on identity shifts, personal narratives, and what changes when we outgrow old versions of ourselves.",
    tags: ["identity", "change", "self-knowledge", "growth"],
    conversationModes: ["deep"],
    emotionalTones: ["reflective"],
    url: "https://example.com/nuance/trying-to-understand-yourself",
    imageUrl: "https://images.example.com/nuance/trying-to-understand-yourself.jpg",
    active: true,
  }),
  buildRecommendation({
    id: "article-becoming",
    title: "On Becoming Someone New",
    type: "article",
    shortDescription:
      "A literary essay about evolution, self-permission, and the discomfort of leaving old identities behind.",
    tags: ["identity", "becoming", "growth", "purpose"],
    conversationModes: ["deep"],
    emotionalTones: ["reflective"],
    url: "https://example.com/nuance/on-becoming-someone-new",
    imageUrl: "https://images.example.com/nuance/on-becoming-someone-new.jpg",
    active: true,
  }),
  buildRecommendation({
    id: "book-loneliness",
    title: "A Philosophy of Loneliness",
    type: "book",
    shortDescription:
      "A gentle, non-clinical meditation on solitude, belonging, and what modern loneliness can reveal.",
    tags: ["loneliness", "solitude", "connection", "presence", "belonging"],
    conversationModes: ["late-night", "deep"],
    emotionalTones: ["soft", "reflective"],
    url: "https://example.com/nuance/a-philosophy-of-loneliness",
    imageUrl: "https://images.example.com/nuance/a-philosophy-of-loneliness.jpg",
    affiliateUrl: "https://example.com/affiliate/a-philosophy-of-loneliness",
    active: true,
  }),
  buildRecommendation({
    id: "podcast-quiet-loneliness",
    title: "The Quiet Forms of Loneliness",
    type: "podcast",
    shortDescription:
      "A warm episode on competent-looking lives, hidden loneliness, and how people create small rituals of connection.",
    tags: ["loneliness", "connection", "presence", "vulnerability"],
    conversationModes: ["late-night"],
    emotionalTones: ["soft"],
    url: "https://example.com/nuance/the-quiet-forms-of-loneliness",
    imageUrl: "https://images.example.com/nuance/the-quiet-forms-of-loneliness.jpg",
    active: true,
  }),
  buildRecommendation({
    id: "article-modern-isolation",
    title: "Modern Isolation and the Need for Presence",
    type: "article",
    shortDescription:
      "An introspective essay on contemporary isolation, emotional distance, and the relief of being met directly.",
    tags: ["loneliness", "presence", "isolation", "connection", "honesty"],
    conversationModes: ["late-night", "deep"],
    emotionalTones: ["soft", "reflective"],
    url: "https://example.com/nuance/modern-isolation-and-the-need-for-presence",
    imageUrl: "https://images.example.com/nuance/modern-isolation-and-the-need-for-presence.jpg",
    active: true,
  }),
  buildRecommendation({
    id: "book-power-and-ambition",
    title: "Power, Ambition, and the Good Life",
    type: "book",
    shortDescription:
      "A philosophical take on ambition, social mobility, and the cost of chasing status without reflection.",
    tags: ["ambition", "power", "success", "freedom", "purpose"],
    conversationModes: ["debate", "deep"],
    emotionalTones: ["sharp", "reflective"],
    url: "https://example.com/nuance/power-ambition-and-the-good-life",
    imageUrl: "https://images.example.com/nuance/power-ambition-and-the-good-life.jpg",
    active: true,
  }),
  buildRecommendation({
    id: "podcast-ai-laziness",
    title: "Are Tools Making Us Passive Thinkers?",
    type: "podcast",
    shortDescription:
      "A balanced conversation about AI, convenience, cognition, and whether tools are making thought shallower or simply different.",
    tags: ["ai", "technology", "thinking", "freedom", "ambition"],
    conversationModes: ["debate"],
    emotionalTones: ["sharp"],
    url: "https://example.com/nuance/are-tools-making-us-passive-thinkers",
    imageUrl: "https://images.example.com/nuance/are-tools-making-us-passive-thinkers.jpg",
    active: true,
  }),
  buildRecommendation({
    id: "article-friction-thinking",
    title: "The Value of Friction in Thought",
    type: "article",
    shortDescription:
      "An essay arguing that mental ease is not always intellectual weakness, but that some forms of friction still matter.",
    tags: ["ai", "technology", "thinking", "discipline", "attention"],
    conversationModes: ["debate"],
    emotionalTones: ["sharp"],
    url: "https://example.com/nuance/the-value-of-friction-in-thought",
    imageUrl: "https://images.example.com/nuance/the-value-of-friction-in-thought.jpg",
    active: true,
  }),
];

const TAG_PATTERNS: Array<{ tag: string; patterns: RegExp[] }> = [
  { tag: "money", patterns: [/money/i, /wealth/i, /argent/i, /rich/i] },
  { tag: "freedom", patterns: [/freedom/i, /free/i, /libert/i, /libre/i] },
  { tag: "inheritance", patterns: [/inheritance/i, /héritage/i] },
  { tag: "inequality", patterns: [/inequal/i, /class/i, /classe/i, /wealth gap/i] },
  { tag: "justice", patterns: [/justice/i, /fairness/i, /fair/i, /équité/i] },
  { tag: "ai", patterns: [/\bai\b/i, /artificial intelligence/i, /\bia\b/i] },
  { tag: "technology", patterns: [/technology/i, /tech/i, /outil/i, /tool/i] },
  { tag: "ambition", patterns: [/ambition/i, /status/i, /success/i, /réussite/i] },
  { tag: "identity", patterns: [/identity/i, /identit/i, /myself/i, /yourself/i, /soi/i] },
  { tag: "change", patterns: [/changed your mind/i, /change/i, /outgrown/i, /evolve/i, /évol/i] },
  { tag: "purpose", patterns: [/purpose/i, /meaning/i, /alive/i, /vivant/i, /sens/i] },
  { tag: "loneliness", patterns: [/lonely/i, /alone/i, /solitude/i, /loneliness/i, /solitaire/i] },
  { tag: "connection", patterns: [/connection/i, /connect/i, /lien/i, /presence/i, /présence/i] },
  { tag: "vulnerability", patterns: [/vulnerab/i, /open up/i, /say what/i, /fragile/i] },
  { tag: "honesty", patterns: [/honest/i, /honesty/i, /sinc/i, /honn/i, /truth/i] },
  { tag: "relationships", patterns: [/relationship/i, /love/i, /intim/i, /romance/i, /couple/i] },
];

function getModeTone(mode: ConversationMode) {
  if (mode === "debate") return "sharp";
  if (mode === "deep") return "reflective";
  return "soft";
}

function normalizeTopicText(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function inferSemanticTags(
  messages: TranscriptMessage[],
  mode: ConversationMode,
  topicText: string
) {
  const source = `${topicText} ${messages.map((message) => message.content).join(" ")}`;
  const tags = new Set<string>([getModeTone(mode)]);

  for (const matcher of TAG_PATTERNS) {
    if (matcher.patterns.some((pattern) => pattern.test(source))) {
      tags.add(matcher.tag);
    }
  }

  const normalizedTopic = normalizeTopicText(topicText);

  if (normalizedTopic.includes("night")) tags.add("loneliness");
  if (normalizedTopic.includes("alive")) tags.add("purpose");
  if (normalizedTopic.includes("mind")) tags.add("change");
  if (normalizedTopic.includes("wish")) tags.add("vulnerability");
  if (normalizedTopic.includes("money")) tags.add("money");

  return [...tags].slice(0, 8);
}

function scoreRecommendation(
  recommendation: RecommendationItem,
  input: {
    mode: ConversationMode;
    tags: string[];
    emotionalTone: string;
    topicText: string;
  }
) {
  let score = 0;

  if (recommendation.conversationModes.includes(input.mode)) score += 4;
  if (recommendation.emotionalTones.includes(input.emotionalTone)) score += 3;

  const tagOverlap = recommendation.tags.filter((tag) => input.tags.includes(tag)).length;
  score += tagOverlap * 5;

  const normalizedTopic = normalizeTopicText(input.topicText);
  if (recommendation.tags.some((tag) => normalizedTopic.includes(tag))) score += 2;

  if (input.mode === "late-night" && recommendation.sponsorLabel) score -= 3;

  return score;
}

function preferTypeMix(items: RecommendationItem[]) {
  const orderedTypes: RecommendationType[] = ["book", "podcast", "article"];
  const picked: RecommendationItem[] = [];
  const seenTypes = new Set<RecommendationType>();
  let sponsoredCount = 0;

  for (const preferredType of orderedTypes) {
    const candidate = items.find((item) => {
      if (seenTypes.has(item.type)) return false;
      if (item.type !== preferredType) return false;
      if (item.sponsorLabel && sponsoredCount >= 1) return false;
      return true;
    });

    if (!candidate) continue;

    picked.push(candidate);
    seenTypes.add(candidate.type);
    if (candidate.sponsorLabel) sponsoredCount += 1;
  }

  for (const candidate of items) {
    if (picked.length >= 3) break;
    if (picked.some((item) => item.id === candidate.id)) continue;
    if (candidate.sponsorLabel && sponsoredCount >= 1) continue;

    picked.push(candidate);
    if (candidate.sponsorLabel) sponsoredCount += 1;
  }

  return picked.slice(0, 3);
}

export function selectGoFurtherRecommendations(input: {
  mode: ConversationMode;
  topicText: string;
  summary: RoomSummary;
}) {
  const emotionalTone = getModeTone(input.mode);
  const scored = RECOMMENDATION_DATABASE.filter((item) => item.active)
    .map((item) => ({
      item,
      score: scoreRecommendation(item, {
        mode: input.mode,
        tags: input.summary.semanticTags,
        emotionalTone,
        topicText: input.topicText,
      }),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);

  if (scored.length >= 3) return preferTypeMix(scored);

  const fallback = RECOMMENDATION_DATABASE.filter(
    (item) => item.active && item.conversationModes.includes(input.mode)
  ).sort((a, b) => Number(Boolean(a.sponsorLabel)) - Number(Boolean(b.sponsorLabel)));

  const merged = [...scored];

  for (const candidate of fallback) {
    if (merged.some((item) => item.id === candidate.id)) continue;
    merged.push(candidate);
  }

  return preferTypeMix(merged);
}

export function selectReconnectRecommendation(input: {
  mode: ConversationMode;
  topicText: string;
  tags?: string[];
}) {
  const summary: RoomSummary = {
    id: "reconnect-preview",
    roomId: "reconnect-preview",
    summaryText: "",
    agreementPoints: [],
    disagreementPoints: [],
    mainThemes: [],
    semanticTags: input.tags ?? inferSemanticTags([], input.mode, input.topicText),
    emotionalTone: getModeTone(input.mode),
    generatedAt: new Date().toISOString(),
  };

  return selectGoFurtherRecommendations({
    mode: input.mode,
    topicText: input.topicText,
    summary,
  })[0];
}

export function localizeRecommendationType(type: RecommendationType, locale: Locale) {
  if (locale === "fr") {
    if (type === "book") return "Livre";
    if (type === "podcast") return "Podcast";
    if (type === "article") return "Article";
    if (type === "film") return "Film";
    if (type === "app") return "App";
    return "Cours";
  }

  if (type === "book") return "Book";
  if (type === "podcast") return "Podcast";
  if (type === "article") return "Article";
  if (type === "film") return "Film";
  if (type === "app") return "App";
  return "Course";
}

export function localizeSemanticTag(tag: string, locale: Locale) {
  if (locale === "en") return tag;

  const translations: Record<string, string> = {
    sharp: "vif",
    reflective: "réflexif",
    soft: "doux",
    money: "argent",
    freedom: "liberté",
    inheritance: "héritage",
    inequality: "inégalité",
    justice: "justice",
    ai: "IA",
    technology: "technologie",
    ambition: "ambition",
    identity: "identité",
    change: "changement",
    purpose: "sens",
    loneliness: "solitude",
    connection: "lien",
    vulnerability: "vulnérabilité",
    honesty: "honnêteté",
    relationships: "relations",
    presence: "présence",
    solitude: "solitude",
    class: "classe",
    power: "pouvoir",
    truth: "vérité",
    becoming: "devenir",
    growth: "évolution",
    isolation: "isolement",
    intimacy: "intimité",
    thinking: "pensée",
    discipline: "discipline",
    attention: "attention",
    "modern relationships": "relations modernes",
  };

  return translations[tag] ?? tag;
}

export function trackRecommendationEvent(payload: {
  recommendationId: string;
  roomId?: string;
  action: RecommendationAction;
}) {
  if (typeof window === "undefined") return;

  const current = readRecommendationEvents();
  current.push({
    id: `${payload.recommendationId}-${payload.action}-${Date.now()}`,
    recommendationId: payload.recommendationId,
    roomId: payload.roomId,
    action: payload.action,
    createdAt: new Date().toISOString(),
  });
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function readRecommendationEvents() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function readSavedRecommendations() {
  if (typeof window === "undefined") return [] as string[];

  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleSavedRecommendation(recommendationId: string) {
  if (typeof window === "undefined") return [] as string[];

  const current = new Set(readSavedRecommendations());

  if (current.has(recommendationId)) {
    current.delete(recommendationId);
  } else {
    current.add(recommendationId);
    trackRecommendationEvent({ recommendationId, action: "save" });
  }

  const next = [...current];
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next;
}
