import { createBrowserClient } from "@supabase/ssr";

// Call only when implementing a connected feature. The preview needs no secrets.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    throw new Error(
      "Configure the Supabase environment variables before connecting authentication or data.",
    );
  return createBrowserClient(url, key);
}
