export type AliasFamily = {
  id: string;
  stages: [string, string, string];
};

export const ALIAS_FAMILIES: AliasFamily[] = [
  { id: "mist", stages: ["RisingMist", "QuestingMist", "MetaphysicalMist"] },
  { id: "oracle", stages: ["FridayOracle", "IntervalOracle", "DissentingOracle"] },
  { id: "pigeon", stages: ["ExistentialPigeon", "PhilosophicalPigeon", "MetaphysicalPigeon"] },
  { id: "feather", stages: ["QuietFeather", "EveningFeather", "DesertFeather"] },
  { id: "fox", stages: ["EveningFox", "MidnightFox", "OffpeakFox"] },
  { id: "echo", stages: ["PatientEcho", "SilentEcho", "LongNightEcho"] },
  { id: "hummingbird", stages: ["MorningHumming", "EveningHumming", "LateHumming"] },
  { id: "scorpion", stages: ["LateScorpion", "DiplomaticScorpion", "NuancedScorpion"] },
  { id: "cloud", stages: ["PensiveCloud", "IdeaCloud", "IntervalCloud"] },
  { id: "compass", stages: ["CuriousCompass", "EveningCompass", "OpenCompass"] },
  { id: "lantern", stages: ["MetaphysicalLantern", "TheoreticalLantern", "VertigoLantern"] },
  { id: "moon", stages: ["CuriousMoon", "IdeaMoon", "GentleMoon"] },
];

export const MAX_ALIAS_STAGE = 3;

export function clampAliasStage(value?: number | null) {
  if (!value || Number.isNaN(value)) return 1;
  return Math.min(MAX_ALIAS_STAGE, Math.max(1, Math.round(value)));
}

export function getAliasFamilyById(id?: string | null) {
  if (!id) return null;
  return ALIAS_FAMILIES.find((family) => family.id === id) ?? null;
}

export function getAliasForFamilyStage(familyId: string, stage = 1) {
  const family = getAliasFamilyById(familyId) ?? ALIAS_FAMILIES[0];
  return family.stages[clampAliasStage(stage) - 1];
}

export function generateAlias(options?: {
  excludeFamilyId?: string | null;
  stage?: number;
  seed?: number;
}) {
  const stage = clampAliasStage(options?.stage);
  const pool = ALIAS_FAMILIES.filter((family) => family.id !== options?.excludeFamilyId);
  const families = pool.length ? pool : ALIAS_FAMILIES;
  const rawSeed =
    options?.seed ??
    Date.now() + Math.floor(Math.random() * 10_000);
  const family = families[Math.abs(rawSeed) % families.length];

  return {
    familyId: family.id,
    stage,
    alias: family.stages[stage - 1],
  };
}

export function evolveAlias(familyId: string, currentStage: number) {
  const nextStage = Math.min(MAX_ALIAS_STAGE, clampAliasStage(currentStage) + 1);

  return {
    familyId,
    stage: nextStage,
    alias: getAliasForFamilyStage(familyId, nextStage),
  };
}
