"use client";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { createAcademicRecord } from "../actions";
import type { NamedRow } from "../contracts";

export function AcademicForm({
  kind,
  options = [],
}: {
  kind: "branch" | "session" | "class" | "section";
  options?: NamedRow[];
}) {
  const [state, action, pending] = useActionState(createAcademicRecord, {});
  const [parent, setParent] = useState("");
  const needsParent = kind === "class" || kind === "section";
  return (
    <form action={action} className="school-form compact-form">
      <input type="hidden" name="kind" value={kind} />
      <div>
        <label htmlFor={`${kind}-name`}>Name</label>
        <input
          id={`${kind}-name`}
          name="name"
          required
          minLength={kind === "class" || kind === "section" ? 1 : 2}
          maxLength={kind === "branch" ? 100 : kind === "section" ? 40 : 60}
        />
      </div>
      {needsParent && (
        <div>
          <label htmlFor={`${kind}-parent`}>{kind === "class" ? "Campus" : "Class"}</label>
          <Select
            id={`${kind}-parent`}
            name={kind === "class" ? "branch_id" : "class_id"}
            label={kind === "class" ? "Campus" : "Class"}
            value={parent}
            onValueChange={setParent}
            options={options.map((x) => ({ value: x.id, label: x.name }))}
            required
            placeholder={kind === "class" ? "Choose campus" : "Choose class"}
          />
        </div>
      )}
      {kind === "session" && (
        <div className="form-columns">
          <div>
            <label htmlFor="starts-on">Starts on</label>
            <input type="date" id="starts-on" name="starts_on" required />
          </div>
          <div>
            <label htmlFor="ends-on">Ends on</label>
            <input type="date" id="ends-on" name="ends_on" required />
          </div>
        </div>
      )}
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
      <Button disabled={pending || (needsParent && !parent)} type="submit">
        {pending ? "Saving…" : `Add ${kind === "branch" ? "campus" : kind}`}
      </Button>
    </form>
  );
}
