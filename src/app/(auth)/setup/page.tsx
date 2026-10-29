import Link from "next/link";
import { SetupForm } from "@/features/school/components/setup-form";
import { getMemberships } from "@/features/school/context";
import { requireUser } from "@/features/auth/session";
import { signOut } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

export const metadata = { title: "School setup" };
export default async function SetupPage() {
  const { user } = await requireUser();
  const memberships = await getMemberships();
  return (
    <>
      <h1>Set up your school</h1>
      <p className="auth-description">
        Signed in as {user.email}. Create your own school, or ask the school owner to arrange team
        access.
      </p>
      {memberships.length ? (
        <p>
          You already have school access. <Link href="/dashboard">Open workspace →</Link>
        </p>
      ) : (
        <SetupForm />
      )}
      <form action={signOut} className="auth-signout">
        <Button variant="ghost">Sign out</Button>
      </form>
    </>
  );
}
