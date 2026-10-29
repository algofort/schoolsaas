import { AuthForm } from "@/features/auth/components/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
export const metadata = { title: "Create account" };
export default function SignupPage() {
  return (
    <>
      <h1>Create your account</h1>
      <p className="auth-description">
        Confirm your email, then set up your school. Team access is assigned separately by the
        school owner.
      </p>
      <AuthForm mode="signup" configured={isSupabaseConfigured()} />
    </>
  );
}
