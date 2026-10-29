import assert from "node:assert/strict";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
assert.ok(url && key, "Configure .env.local first.");
const headers = { apikey: key };
const auth = await fetch(`${url}/auth/v1/settings`, { headers });
assert.equal(auth.status, 200, "Auth service must respond with a valid publishable key.");
for (const table of [
  "schools",
  "school_memberships",
  "branches",
  "academic_sessions",
  "classes",
  "sections",
  "audit_events",
]) {
  const response = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, { headers });
  const body = await response.json();
  assert.ok(
    [401, 403].includes(response.status),
    `Anonymous ${table} access must be denied, got ${response.status}.`,
  );
  assert.equal(
    body.code,
    "42501",
    `${table} should exist but deny access (not a missing-table error).`,
  );
}
console.log("Hosted database: Auth reachable; anonymous access denied on all 7 foundation tables.");
