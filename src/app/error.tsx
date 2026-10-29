"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="workspace auth-layout">
      <div className="school-card">
        <h1>Workspace unavailable</h1>
        <p className="auth-description">
          Please retry. If this continues, check the database connection and foundation migration.
        </p>
        <Button onClick={reset}>Try again</Button>
        <p>
          <Link href="/login">Return to sign in</Link>
        </p>
      </div>
    </main>
  );
}
