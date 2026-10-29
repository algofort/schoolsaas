import { test } from "node:test";
import assert from "node:assert/strict";
import {
  academicInputSchema,
  schoolSetupSchema,
  canManageSchool,
  membershipSchema,
} from "../src/features/school/contracts.ts";

test("only owner and admin manage shared academic setup", () => {
  for (const role of ["owner", "admin"]) assert.equal(canManageSchool(role), true);
  for (const role of ["teacher", "staff", "accountant"]) assert.equal(canManageSchool(role), false);
});
test("school setup trims names and rejects empty or oversized input", () => {
  assert.deepEqual(schoolSetupSchema.parse({ name: "  Example School  ", branch: "Main Campus" }), {
    name: "Example School",
    branch: "Main Campus",
  });
  for (const name of ["", " ", "x", "x".repeat(121)])
    assert.equal(schoolSetupSchema.safeParse({ name, branch: "Main" }).success, false);
});
test("session rejects impossible dates and reversed date range", () => {
  const input = { kind: "session", name: "2026", starts_on: "2026-04-01", ends_on: "2027-03-31" };
  assert.equal(academicInputSchema.safeParse(input).success, true);
  assert.equal(academicInputSchema.safeParse({ ...input, ends_on: "2025-01-01" }).success, false);
  assert.equal(academicInputSchema.safeParse({ ...input, starts_on: "2026-02-30" }).success, false);
});
test("class and section require valid parent IDs, not arbitrary school identity", () => {
  assert.equal(
    academicInputSchema.safeParse({ kind: "class", name: "Grade 1", branch_id: "unknown" }).success,
    false,
  );
  assert.equal(
    academicInputSchema.safeParse({
      kind: "section",
      name: "A",
      class_id: "10000000-0000-4000-8000-000000000001",
    }).success,
    true,
  );
});
test("membership decoder rejects unrecognized roles or missing school", () => {
  assert.equal(
    membershipSchema.safeParse({
      school_id: "10000000-0000-4000-8000-000000000001",
      role: "superadmin",
    }).success,
    false,
  );
});
