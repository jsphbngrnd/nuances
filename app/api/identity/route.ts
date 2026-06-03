import { NextResponse } from "next/server";
import { z } from "zod";
import { getAliasFamilyById, getAliasForFamilyStage, clampAliasStage } from "@/lib/alias";

const bodySchema = z.object({
  alias: z.string().min(3).max(80),
  aliasFamily: z.string().min(2).max(40),
  aliasStage: z.number().int().min(1).max(3),
});

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());
  const family = getAliasFamilyById(body.aliasFamily);

  if (!family) {
    return NextResponse.json({ ok: false, error: "Invalid alias family." }, { status: 400 });
  }

  const stage = clampAliasStage(body.aliasStage);
  const expectedAlias = getAliasForFamilyStage(family.id, stage);
  const alias = body.alias === expectedAlias ? body.alias : expectedAlias;

  const response = NextResponse.json({
    ok: true,
    identity: {
      alias,
      aliasFamily: family.id,
      aliasStage: stage,
    },
  });

  const cookieBase = {
    path: "/",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 365,
  };

  response.cookies.set("nuance-alias", alias, cookieBase);
  response.cookies.set("nuance-alias-family", family.id, cookieBase);
  response.cookies.set("nuance-alias-stage", String(stage), cookieBase);

  return response;
}
