"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { createSchool } from "../actions";

export function SetupForm() {
  const [state, action, pending] = useActionState(createSchool, {});
  return (
    <form action={action} className="school-form">
      <div>
        <label htmlFor="school-name">School name</label>
        <input
          id="school-name"
          name="name"
          required
          minLength={2}
          maxLength={120}
          placeholder="Your school name"
        />
      </div>
      <div>
        <label htmlFor="branch-name">First campus</label>
        <input
          id="branch-name"
          name="branch"
          required
          minLength={2}
          maxLength={100}
          defaultValue="Main Campus"
        />
      </div>
      <p>Currency: PKR · Timezone: Asia/Karachi</p>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Creating school…" : "Create school workspace"}
      </Button>
    </form>
  );
}
