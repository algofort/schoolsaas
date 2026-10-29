"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type FormState = { error?: string; message?: string };
const credentials = z.object({ email: z.email().max(254), password: z.string().min(8).max(128) });

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  const parsed = credentials.safeParse({
    email: String(form.get("email") || "").trim(),
    password: form.get("password"),
  });
  if (!parsed.success)
    return { error: "Enter a valid email and a password of at least 8 characters." };
  if (!isSupabaseConfigured())
    return { error: "Sign-in is unavailable until the Supabase environment is configured." };
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error)
      return { error: "Unable to sign in. Check your email, password and email confirmation." };
  } catch {
    return { error: "Unable to reach sign-in. Please try again." };
  }
  redirect("/dashboard");
}

export async function signUp(_: FormState, form: FormData): Promise<FormState> {
  const parsed = credentials.safeParse({
    email: String(form.get("email") || "").trim(),
    password: form.get("password"),
  });
  if (!parsed.success)
    return { error: "Enter a valid email and a password between 8 and 128 characters." };
  if (!isSupabaseConfigured())
    return { error: "Account creation is unavailable until Supabase is configured." };
  // Server Actions enforce same-origin submission; Supabase additionally enforces its exact
  // redirect allowlist. Use the actual app origin rather than Vercel's per-deployment alias.
  const origin =
    process.env.NEXT_PUBLIC_APP_URL || (await headers()).get("origin") || "http://127.0.0.1:3000";
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      ...parsed.data,
      options: { emailRedirectTo: new URL("/auth/callback", origin).toString() },
    });
    if (error)
      return { error: "Unable to create an account. Try again later or use an existing account." };
    if (!data.session)
      return {
        message:
          "Check your email to confirm your account, then sign in. If you already have an account, use Sign in.",
      };
  } catch {
    return { error: "Unable to reach account creation. Please try again." };
  }
  redirect("/setup");
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) throw new Error("Sign-out failed. Please try again.");
  (await cookies()).delete("school-id");
  redirect("/login");
}
