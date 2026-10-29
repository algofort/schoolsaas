import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const requireUser = cache(async () => {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || data.user.is_anonymous) redirect("/login");
  return { user: data.user, supabase };
});
