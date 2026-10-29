import { AuthForm } from "@/features/auth/components/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      <h1>Welcome back</h1>
      <p className="auth-description">Sign in to your school workspace.</p>
      {error && (
        <p className="form-error" role="alert">
          Email confirmation failed or expired. Try signing in, or request a fresh confirmation
          through account support.
        </p>
      )}
      <AuthForm mode="login" configured={isSupabaseConfigured()} />
    </>
  );
}
