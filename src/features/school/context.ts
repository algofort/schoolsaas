import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireUser } from "@/features/auth/session";
import { membershipSchema } from "./contracts";

export const getMemberships = cache(async () => {
  const { user, supabase } = await requireUser();
  const { data, error } = await supabase
    .from("school_memberships")
    .select("school_id,role,schools!inner(id,name,timezone,currency)")
    .eq("user_id", user.id)
    .eq("active", true)
    .order("created_at");
  if (error)
    throw new Error(
      "School access is unavailable. Check the foundation migration and database connection.",
    );
  return membershipSchema.array().parse(data);
});

export const requireSchool = cache(async () => {
  const { user, supabase } = await requireUser();
  const memberships = await getMemberships();
  if (!memberships.length) redirect("/setup");
  const selected = (await cookies()).get("school-id")?.value;
  // A cookie is a preference, never authorization. Membership is checked again on every request.
  const membership = memberships.find((x) => x.school_id === selected) || memberships[0];
  return { user, supabase, membership, schoolId: membership.school_id };
});
