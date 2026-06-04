import { NextResponse, type NextRequest } from "next/server";

// French-speaking countries by ISO code
const FRENCH_COUNTRIES = new Set([
  "FR", "BE", "CH", "LU", "MC", "CA", "SN", "CI", "ML", "BF",
  "NE", "TG", "BJ", "GA", "CG", "CD", "CM", "MG", "MU", "RE",
  "GP", "MQ", "GF", "NC", "PF", "HT",
]);

export async function GET(request: NextRequest) {
  // 1. Vercel provides country from IP via this header in production
  const country = request.headers.get("x-vercel-ip-country") ?? "";

  if (country && FRENCH_COUNTRIES.has(country.toUpperCase())) {
    return NextResponse.json({ locale: "fr", source: "ip", country });
  }

  // 2. Fall back to Accept-Language header
  const acceptLang = request.headers.get("accept-language") ?? "";
  const primary = acceptLang.split(",")[0]?.split(";")[0]?.trim().toLowerCase() ?? "";
  if (primary.startsWith("fr")) {
    return NextResponse.json({ locale: "fr", source: "accept-language" });
  }

  return NextResponse.json({ locale: "en", source: country ? "ip" : "default", country });
}
