import { z } from "zod";

export const schoolRoleSchema = z.enum(["owner", "admin", "teacher", "staff", "accountant"]);
export type SchoolRole = z.infer<typeof schoolRoleSchema>;
export function canManageSchool(role: SchoolRole) {
  return role === "owner" || role === "admin";
}
export const membershipSchema = z.object({
  school_id: z.uuid(),
  role: schoolRoleSchema,
  schools: z.object({
    id: z.uuid(),
    name: z.string(),
    timezone: z.literal("Asia/Karachi"),
    currency: z.literal("PKR"),
  }),
});
export type Membership = z.infer<typeof membershipSchema>;
export const schoolSetupSchema = z.object({
  name: z.string().trim().min(2).max(120),
  branch: z.string().trim().min(2).max(100),
});
const name = z.string().trim().min(2).max(60);
const isoDate = z.iso.date();
export const academicInputSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("branch"), name: z.string().trim().min(2).max(100) }),
  z
    .object({ kind: z.literal("session"), name, starts_on: isoDate, ends_on: isoDate })
    .refine((x) => x.ends_on >= x.starts_on, {
      message: "Session end date must be after its start date.",
    }),
  z.object({
    kind: z.literal("class"),
    name: z.string().trim().min(1).max(60),
    branch_id: z.uuid(),
  }),
  z.object({
    kind: z.literal("section"),
    name: z.string().trim().min(1).max(40),
    class_id: z.uuid(),
  }),
]);
export const namedRowSchema = z.object({ id: z.uuid(), name: z.string() });
export const classRowSchema = namedRowSchema.extend({ branch_id: z.uuid() });
export const sectionRowSchema = namedRowSchema.extend({ class_id: z.uuid() });
export const sessionRowSchema = namedRowSchema.extend({
  starts_on: z.iso.date(),
  ends_on: z.iso.date(),
});
export type NamedRow = z.infer<typeof namedRowSchema>;
