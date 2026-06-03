import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeLocale } from "@/lib/i18n";

const bodySchema = z.object({
  locale: z.string(),
});

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());
  const locale = normalizeLocale(body.locale);

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set("nuance-locale", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
