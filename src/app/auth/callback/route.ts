import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function returnTo(path: "/dashboard" | "/login?error=confirmation") {
  // Relative Location preserves the actual browser origin, including loopback/preview hosts.
  // Never accept a redirect destination from the query string or forwarded host headers.
  return new NextResponse(null, {
    status: 303,
    headers: { Location: path, "Cache-Control": "private, no-store" },
  });
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code && isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return returnTo("/dashboard");
    } catch {
      // Expired links and provider failures return to the same safe sign-in destination.
    }
  }
  return returnTo("/login?error=confirmation");
}
