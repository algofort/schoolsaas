import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseConfig } from "@/lib/supabase/config";

// Refresh only. Server components/actions independently validate the user and membership.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  if (!isSupabaseConfigured()) return response;
  const { url, key } = supabaseConfig();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values, headers) {
        for (const { name, value } of values) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of values) response.cookies.set(name, value, options);
        for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
        response.headers.set("Cache-Control", "private, no-store, max-age=0");
      },
    },
  });
  try {
    await supabase.auth.getClaims();
  } catch {
    // Authenticated routes fail closed in requireUser; never grant access on refresh failure.
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!api/health|_next/static|_next/image|favicon.ico|vendor/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
