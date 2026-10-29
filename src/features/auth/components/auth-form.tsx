"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "../actions";

export function AuthForm({ mode, configured }: { mode: "login" | "signup"; configured: boolean }) {
  const [state, action, pending] = useActionState(mode === "login" ? signIn : signUp, {});
  return (
    <form action={action} className="school-form">
      <div>
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={8}
          maxLength={128}
        />
      </div>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      {state.message && (
        <p className="form-message" role="status">
          {state.message}
        </p>
      )}
      {!configured && (
        <p role="status">Sign-in setup is pending. Configure the Supabase environment variables.</p>
      )}
      <Button disabled={pending || !configured} type="submit">
        {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </Button>
      <p>
        {mode === "login" ? "New school administrator? " : "Already have an account? "}
        <Link href={mode === "login" ? "/signup" : "/login"}>
          {mode === "login" ? "Create account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
