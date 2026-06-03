import { cookies } from "next/headers";
import { generateAlias, getAliasFamilyById, getAliasForFamilyStage, clampAliasStage } from "@/lib/alias";

export type CurrentIdentity = {
  alias: string;
  aliasFamily: string;
  aliasStage: number;
};

const DEFAULT_IDENTITY = generateAlias({ seed: 7, stage: 1 });

export async function getCurrentIdentity(): Promise<CurrentIdentity> {
  const store = await cookies();
  const alias = store.get("nuance-alias")?.value;
  const aliasFamily = store.get("nuance-alias-family")?.value;
  const aliasStage = clampAliasStage(Number(store.get("nuance-alias-stage")?.value));

  if (!alias || !aliasFamily || !getAliasFamilyById(aliasFamily)) {
    return {
      alias: DEFAULT_IDENTITY.alias,
      aliasFamily: DEFAULT_IDENTITY.familyId,
      aliasStage: DEFAULT_IDENTITY.stage,
    };
  }

  return {
    alias: alias || getAliasForFamilyStage(aliasFamily, aliasStage),
    aliasFamily,
    aliasStage,
  };
}
