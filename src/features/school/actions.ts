"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/features/auth/session";
import type { FormState } from "@/features/auth/actions";
import { getMemberships, requireSchool } from "./context";
import { academicInputSchema, canManageSchool, schoolSetupSchema } from "./contracts";

async function selectSchool(id: string) {
  (await cookies()).set("school-id", id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function createSchool(_: FormState, form: FormData): Promise<FormState> {
  const { user, supabase } = await requireUser();
  if (!user.email_confirmed_at) return { error: "Confirm your email before creating a school." };
  const input = schoolSetupSchema.safeParse({ name: form.get("name"), branch: form.get("branch") });
  if (!input.success)
    return { error: "School name must be 2–120 characters and campus name 2–100 characters." };
  const { data, error } = await supabase.rpc("create_school", {
    school_name: input.data.name,
    branch_name: input.data.branch,
  });
  if (error)
    return {
      error:
        error.code === "23505"
          ? "This account already owns a school. Open your workspace or contact the owner for team access."
          : "School setup failed. Check your confirmed account and foundation migration, then try again.",
    };
  const id = z.uuid().safeParse(data);
  if (!id.success)
    return { error: "School setup returned an unexpected response. Refresh before retrying." };
  await selectSchool(id.data);
  revalidatePath("/", "layout");
  redirect("/settings");
}

export async function switchSchool(form: FormData) {
  const id = z.uuid().safeParse(form.get("school_id"));
  const memberships = await getMemberships();
  if (!id.success || !memberships.some((x) => x.school_id === id.data))
    throw new Error("School access denied.");
  await selectSchool(id.data);
  revalidatePath("/", "layout");
  redirect("/settings");
}

export async function createAcademicRecord(_: FormState, form: FormData): Promise<FormState> {
  const { supabase, schoolId, membership } = await requireSchool();
  if (!canManageSchool(membership.role))
    return { error: "Only the school owner or administrator can change academic setup." };
  const parsed = academicInputSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success)
    return { error: "Check the name, campus/class selection and session date range." };
  const input = parsed.data;
  let result;
  if (input.kind === "branch")
    result = await supabase.from("branches").insert({ school_id: schoolId, name: input.name });
  else if (input.kind === "session")
    result = await supabase.from("academic_sessions").insert({
      school_id: schoolId,
      name: input.name,
      starts_on: input.starts_on,
      ends_on: input.ends_on,
    });
  else if (input.kind === "class")
    result = await supabase
      .from("classes")
      .insert({ school_id: schoolId, name: input.name, branch_id: input.branch_id });
  else
    result = await supabase
      .from("sections")
      .insert({ school_id: schoolId, name: input.name, class_id: input.class_id });
  if (result.error)
    return {
      error:
        result.error.code === "23505"
          ? "That name already exists in this campus/class."
          : "Could not save. Check the selected record belongs to this school and try again.",
    };
  revalidatePath("/settings");
  return { message: "Saved to your school." };
}
