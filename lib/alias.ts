// ── Word pools — mix freely for 450+ unique aliases ──────────────

const ADJECTIVES = [
  "Rising", "Quiet", "Patient", "Curious", "Pensive",
  "Wandering", "Silent", "Distant", "Drifting", "Restless",
  "Gentle", "Midnight", "Twilight", "Hollow", "Muted",
  "Still", "Fading", "Waking", "Shifting", "Fleeting",
  "Dissenting", "Philosophical", "Theoretical", "Diplomatic", "Liminal",
  "Oblique", "Fractured", "Seasonal", "Marginal", "Latent",
];

const NOUNS = [
  "Mist", "Oracle", "Feather", "Fox", "Echo",
  "Compass", "Moon", "Cloud", "Lantern", "Pigeon",
  "Tide", "Signal", "Interval", "Archive", "Meridian",
];

// ── Legacy family structure — kept for existing users in DB ───────

export type AliasFamily = {
  id: string;
  stages: [string, string, string];
};

export const ALIAS_FAMILIES: AliasFamily[] = [
  { id: "mist",        stages: ["RisingMist",          "QuestingMist",        "MetaphysicalMist"] },
  { id: "oracle",      stages: ["FridayOracle",         "IntervalOracle",      "DissentingOracle"] },
  { id: "pigeon",      stages: ["ExistentialPigeon",    "PhilosophicalPigeon", "MetaphysicalPigeon"] },
  { id: "feather",     stages: ["QuietFeather",         "EveningFeather",      "DesertFeather"] },
  { id: "fox",         stages: ["EveningFox",           "MidnightFox",         "OffpeakFox"] },
  { id: "echo",        stages: ["PatientEcho",          "SilentEcho",          "LongNightEcho"] },
  { id: "hummingbird", stages: ["MorningHumming",       "EveningHumming",      "LateHumming"] },
  { id: "scorpion",    stages: ["LateScorpion",         "DiplomaticScorpion",  "NuancedScorpion"] },
  { id: "cloud",       stages: ["PensiveCloud",         "IdeaCloud",           "IntervalCloud"] },
  { id: "compass",     stages: ["CuriousCompass",       "EveningCompass",      "OpenCompass"] },
  { id: "lantern",     stages: ["MetaphysicalLantern",  "TheoreticalLantern",  "VertigoLantern"] },
  { id: "moon",        stages: ["CuriousMoon",          "IdeaMoon",            "GentleMoon"] },
];

export const MAX_ALIAS_STAGE = 3;

export function clampAliasStage(value?: number | null) {
  if (!value || Number.isNaN(value)) return 1;
  return Math.min(MAX_ALIAS_STAGE, Math.max(1, Math.round(value)));
}

export function getAliasFamilyById(id?: string | null) {
  if (!id) return null;
  return ALIAS_FAMILIES.find((f) => f.id === id) ?? null;
}

export function getAliasForFamilyStage(familyId: string, stage = 1) {
  const family = getAliasFamilyById(familyId) ?? ALIAS_FAMILIES[0];
  return family.stages[clampAliasStage(stage) - 1];
}

// ── New generation — picks from full word pools ───────────────────

export function generateAlias(options?: {
  excludeAlias?: string | null;   // avoid repeating same combo on reroll
  excludeFamilyId?: string | null; // legacy compat
  stage?: number;
  seed?: number;
}) {
  const adj = pick(ADJECTIVES, options?.excludeAlias?.replace(/[A-Z][a-z]+$/, ""));
  const noun = pick(NOUNS, options?.excludeAlias?.replace(/^[A-Z][a-z]+/, ""));
  const alias = adj + noun;

  return {
    familyId: "mixed",   // stored in DB as aliasFamily
    stage: clampAliasStage(options?.stage ?? 1),
    alias,
  };
}

function pick(pool: string[], exclude?: string): string {
  const filtered = exclude ? pool.filter(w => w !== exclude) : pool;
  const source = filtered.length ? filtered : pool;
  return source[Math.floor(Math.random() * source.length)];
}

export function evolveAlias(familyId: string, currentStage: number) {
  const nextStage = Math.min(MAX_ALIAS_STAGE, clampAliasStage(currentStage) + 1);

  // For mixed aliases, generate a new random one at the next stage
  if (familyId === "mixed" || !getAliasFamilyById(familyId)) {
    return { familyId: "mixed", stage: nextStage, alias: generateAlias({ stage: nextStage }).alias };
  }

  return {
    familyId,
    stage: nextStage,
    alias: getAliasForFamilyStage(familyId, nextStage),
  };
}
