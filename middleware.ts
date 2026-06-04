import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

const FRENCH_COUNTRIES = new Set([
  "FR", "BE", "CH", "LU", "MC", "CA", "SN", "CI", "ML", "BF",
  "NE", "TG", "BJ", "GA", "CG", "CD", "CM", "MG", "MU", "RE",
  "GP", "MQ", "GF", "NC", "PF", "HT",
]);

function detectLocale(request: NextRequest): "fr" | "en" {
  // 1. Vercel injects IP country on every request at the edge
  const country = (
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ?? // Cloudflare fallback
    ""
  ).toUpperCase();

  if (country && FRENCH_COUNTRIES.has(country)) return "fr";

  // 2. Accept-Language header
  const acceptLang = request.headers.get("accept-language") ?? "";
  if (acceptLang.split(",")[0]?.trim().toLowerCase().startsWith("fr")) return "fr";

  return "en";
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Auto-set locale cookie on first visit (no cookie yet)
  if (!request.cookies.get("nuance-locale")) {
    const locale = detectLocale(request);
    supabaseResponse = NextResponse.next({ request });
    supabaseResponse.cookies.set("nuance-locale", locale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    const { pathname } = request.nextUrl;

    const protectedPaths = [
      "/home", "/matchmaking", "/room", "/settings",
      "/reconnects", "/start", "/topic", "/summary",
      "/onboarding", "/account",
    ];

    if (!user && protectedPaths.some(p => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    if (user && pathname === "/auth") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  } catch {
    // Supabase unreachable — let request through
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
