export type AliasFamily = {
  id: string;
  stages: [string, string, string];
};

export const ALIAS_FAMILIES: AliasFamily[] = [
  { id: "brume", stages: ["BrumeNaissante", "BrumeDesQuestions", "BrumeMetaphysique"] },
  { id: "oracle", stages: ["OracleDuVendredi", "OracleDesIntervalles", "OracleDuDesaccord"] },
  { id: "pigeon", stages: ["PigeonExistentiel", "PigeonPhilosophe", "PigeonExistentialiste"] },
  { id: "plume", stages: ["PlumeDiscrete", "PlumeDuSoir", "PlumeBleueDuDesert"] },
  { id: "renard", stages: ["RenardDuSoir", "RenardDeMinuit", "RenardDesHeuresCreuses"] },
  { id: "echo", stages: ["EchoPatient", "EchoDesSilences", "EchoDesNuitsLongues"] },
  { id: "colibri", stages: ["ColibriDuMatin", "ColibriDuSoir", "ColibriDe22h17"] },
  { id: "scorpion", stages: ["ScorpionEnRetard", "ScorpionDiplomate", "ScorpionDesNuances"] },
  { id: "nuage", stages: ["NuagePensif", "NuageDesIdees", "NuageDesIntervalles"] },
  { id: "boussole", stages: ["BoussoleCurieuse", "BoussoleDuSoir", "BoussoleDesPossibles"] },
  { id: "croissant", stages: ["CroissantMetaphysique", "CroissantDesTheories", "CroissantDuVertige"] },
  { id: "lune", stages: ["LuneCurieuse", "LuneDesIdees", "LuneQuiRitDoucement"] },
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
