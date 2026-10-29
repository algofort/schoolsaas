import { PGlite } from "@electric-sql/pglite";
import { readFile, readdir } from "node:fs/promises";
import assert from "node:assert/strict";

// Embedded PostgreSQL runs the actual migration/RLS as non-superuser roles.
// Auth schema here is a test stub, not a replacement for live GoTrue integration tests.
const db = new PGlite();
try {
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create schema auth;
    create table auth.users (id uuid primary key, email_confirmed_at timestamptz);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create function auth.jwt() returns jsonb language sql stable as
      $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
    grant usage on schema auth to anon, authenticated;
    grant execute on function auth.uid(), auth.jwt() to anon, authenticated;
  `);
  const dir = new URL("../supabase/migrations/", import.meta.url);
  for (const file of (await readdir(dir)).filter((x) => x.endsWith(".sql")).sort()) {
    await db.exec(await readFile(new URL(file, dir), "utf8"));
  }
  const owner = "10000000-0000-4000-8000-000000000001";
  const outsider = "10000000-0000-4000-8000-000000000002";
  const teacher = "10000000-0000-4000-8000-000000000003";
  const unconfirmed = "10000000-0000-4000-8000-000000000004";
  await db.exec(
    `insert into auth.users values ('${owner}',now()),('${outsider}',now()),('${teacher}',now()),('${unconfirmed}',null)`,
  );
  async function asUser(user, role = "authenticated") {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [user]);
    await db.exec(`set role ${role}`);
  }
  let checks = 0;
  async function denied(query, params = []) {
    await assert.rejects(db.query(query, params));
    checks++;
  }
  await asUser("", "anon");
  await denied("select public.create_school('Test School','Main Campus')");
  await denied("select * from public.schools");
  await asUser(unconfirmed);
  await denied("select public.create_school('Test School','Main Campus')");
  await asUser(owner);
  await denied("select public.create_school('x','Main Campus')");
  const school = (await db.query("select public.create_school('Test School','Main Campus') as id"))
    .rows[0].id;
  assert.equal((await db.query("select * from public.school_memberships")).rows[0].role, "owner");
  checks++;
  const branch = (await db.query("select id from public.branches")).rows[0].id;
  await denied("select public.create_school('Duplicate School','Main Campus')");
  assert.equal((await db.query("select * from public.schools")).rows.length, 1);
  checks++;
  await denied(
    "insert into public.school_memberships(school_id,user_id,role) values ($1,$2,'owner')",
    [school, outsider],
  );
  await denied("update public.school_memberships set role = 'owner'");
  await denied("update public.schools set created_by = $1", [outsider]);
  await denied(
    "insert into public.academic_sessions(school_id,name,starts_on,ends_on) values ($1,'Invalid','2027-01-01','2026-01-01')",
    [school],
  );
  await db.query(
    "insert into public.academic_sessions(school_id,name,starts_on,ends_on) values ($1,'2026–2027','2026-04-01','2027-03-31')",
    [school],
  );
  const klass = (
    await db.query(
      "insert into public.classes(school_id,branch_id,name) values ($1,$2,'Grade 1') returning id",
      [school, branch],
    )
  ).rows[0].id;
  await db.query("insert into public.sections(school_id,class_id,name) values ($1,$2,'A')", [
    school,
    klass,
  ]);
  checks++;
  await asUser(outsider);
  for (const t of [
    "schools",
    "school_memberships",
    "branches",
    "academic_sessions",
    "classes",
    "sections",
    "audit_events",
  ]) {
    assert.equal((await db.query(`select * from public.${t}`)).rows.length, 0);
    checks++;
  }
  await denied("insert into public.branches(school_id,name) values ($1,'Intruder')", [school]);
  assert.equal(
    (await db.query("update public.branches set name='Intruder' returning id")).rows.length,
    0,
  );
  checks++;
  const school2 = (
    await db.query("select public.create_school('Other School','Other Campus') as id")
  ).rows[0].id;
  await denied(
    "insert into public.classes(school_id,branch_id,name) values ($1,$2,'Cross school')",
    [school2, branch],
  );
  await db.exec("reset role");
  await db.query(
    "insert into public.school_memberships(school_id,user_id,role) values ($1,$2,'teacher')",
    [school, teacher],
  );
  // Even an admin in two schools cannot move a record's tenant.
  await db.query(
    "insert into public.school_memberships(school_id,user_id,role) values ($1,$2,'admin')",
    [school2, owner],
  );
  await asUser(owner);
  await denied("update public.branches set school_id=$1 where id=$2", [school2, branch]);
  await asUser(teacher);
  assert.equal((await db.query("select * from public.classes")).rows.length, 1);
  checks++;
  assert.equal((await db.query("select * from public.audit_events")).rows.length, 0);
  checks++;
  await denied("insert into public.branches(school_id,name) values ($1,'Teacher change')", [
    school,
  ]);
  assert.equal(
    (await db.query("update public.schools set name='Teacher change' returning id")).rows.length,
    0,
  );
  checks++;
  await denied("delete from public.classes");
  await db.exec("reset role");
  await db.query("update public.school_memberships set active=false where user_id=$1", [teacher]);
  await asUser(teacher);
  assert.equal((await db.query("select * from public.classes")).rows.length, 0);
  checks++;
  const rls = await db.query(
    "select relname,relrowsecurity from pg_class where relnamespace='public'::regnamespace and relkind='r'",
  );
  assert.equal(rls.rows.length, 7);
  assert.ok(rls.rows.every((r) => r.relrowsecurity));
  checks++;
  console.log(`Database: ${checks} authorization, constraint and bootstrap checks passed.`);
} finally {
  await db.close();
}
