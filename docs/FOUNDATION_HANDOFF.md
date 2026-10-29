# Shared database and access foundation

29 October 2026. Branch: `chore/platform-foundation`. Owner: algofort; reviewer: rehan-ayaz.

## Implemented contracts

- `src/features/auth/session.ts`: `requireUser()` validates the Supabase user with `getUser`, never trusts cookie user data alone.
- `src/features/school/context.ts`: `requireSchool()` returns `user`, a request-specific `supabase` client, `schoolId` and `membership`. Use it inside **every** server data operation/action. Do not rely on a layout check alone.
- `src/features/school/contracts.ts`: Zod-validated runtime types for roles, membership, parent IDs and academic input. These are explicit application contracts, not CLI-generated database types.
- `school-id` is an HttpOnly selection preference. Changing it never establishes school access; active membership is read again from the database. No school identity is accepted from academic forms.
- Shared routes live under `src/app/(workspace)`; the route group does not alter public URLs. Login/signup/setup use `src/app/(auth)`. Auth callback is `/auth/callback`.

## Database

Migration: `20261029093439_platform_foundation.sql`, created using the Supabase CLI. Seven tables:

| Table              | Purpose / key                                      |
| ------------------ | -------------------------------------------------- |
| schools            | School identity, PKR, Asia/Karachi, unique creator |
| school_memberships | `(school_id,user_id)`, role, active flag           |
| branches           | Campus, unique name per school                     |
| academic_sessions  | Name, inclusive start/end dates                    |
| classes            | School + campus, unique class name per campus      |
| sections           | School + class, unique section name per class      |
| audit_events       | Append-only store, currently school bootstrap only |

Owner/admin can add/update academic setup; other active roles can read it. Roles are `owner`, `admin`, `teacher`, `staff`, `accountant`; these are school-wide, not campus-scoped. No direct membership, school creation or audit writes are granted to ordinary clients. Academic deletion is not granted. The UI currently supports listing/adding, not update/delete.

All seven tables enable RLS and explicitly deny anonymous access. Parent links include school ID in composite foreign keys. Academic record IDs/school IDs cannot be reassigned. Internal membership helpers use a locked search path in the non-exposed `school_private` schema and only inspect `auth.uid()`; no user-provided role or user ID can authorize access.

`public.create_school(school_name,branch_name)` is an invoker wrapper around a restricted private bootstrap transaction. It requires a confirmed, non-anonymous account and atomically creates a new school, its owner membership, first campus and audit event. One owned school per account is the bounded rule for this gate. Existing-school access must be provisioned separately; signup never joins an existing school automatically.

## Hosted state

- Development project `schoolsaas-dev`, ref `fmiexnuyseqxvrcrkvrd`, Free organization AddizTech School SaaS, Ireland `eu-west-1`.
- Foundation SQL applied successfully through the authenticated Supabase SQL editor. No real school/user data was inserted.
- Live inspection confirmed 7 RLS-enabled tables, no anonymous bootstrap execution, and no client membership INSERT privilege. The public API independently denied anonymous reads to all seven tables.
- Security Advisor was rerun after application and reported zero errors/warnings in the UI. This is a point-in-time check, not a complete security audit.
- Site URL saved as `https://schoolsaas-lake.vercel.app`; exact redirect allowlist contains its `/auth/callback` and `http://127.0.0.1:3000/auth/callback`, with user approval. No wildcard preview redirects.
- Local `.env.local` has only the URL and publishable key. The owner reports configuring Vercel environment variables/redeploying the previous baseline; new code still needs review/push/merge.

### One-time migration history reconciliation

The SQL editor does **not** populate CLI migration history. Live verification found no `supabase_migrations.schema_migrations` table. Before using `db push` against this existing dev database, the migration owner must authenticate/link the CLI and mark the already-applied version using the supported repair command. Do not rerun the CREATE statements or reset the hosted database.

```sh
npx supabase login
npx supabase link --project-ref fmiexnuyseqxvrcrkvrd
npx supabase migration repair 20261029093439 --status applied --linked
npx supabase migration list --linked
```

Read the current CLI `--help` before running account commands. If this checkout needs `supabase init`, generate/review its config first. Keep credentials in the CLI/password manager, never in command examples or Git. The repair has not been executed by this task because no CLI account connection is available. Subsequent feature migrations must keep one owner and pass local replay/tests before applying.

## Release and acceptance

1. Review/push this branch; verify CI and Vercel preview. Merge through a PR into main only after review. Main has not been modified by this implementation.
2. From the deployed canonical site or local port 3000, create your own app account. A Supabase dashboard account is separate from an app Auth account. Enter/save the password yourself; no password needs to be sent in chat.
3. Confirm the email in the same browser used for signup (PKCE verifier cookie), sign in, create the school, then add one session/class/section in Settings. Verify persistence after reload and sign-out/login. Auth service confirmation mail uses Supabase; future business email/WhatsApp uses n8n.
4. Test a second account: it must not see the first school's records. It should see its own empty onboarding until explicitly assigned membership. Do not create unrelated school data merely to grant Rehan access.
5. Reconcile migration history before shared remote migrations. Provision reviewed team membership, then both developers update their feature branches from the merged foundation. No team access was granted by this task.

Feature preview signup requires that specific preview callback to be approved in Supabase; broad preview wildcards are intentionally not configured. Use the canonical deployment or local origin for the initial confirmation test. An explicit `NEXT_PUBLIC_APP_URL` can pin the origin when needed.

## Verification and limits

- `npm run test`: actual embedded PostgreSQL migration replay plus 30 RLS/bootstrap/constraint checks; five application-contract tests. Auth in embedded tests is a minimal test stub, not live GoTrue.
- `node --env-file=.env.local scripts/verify-supabase.mjs`: optional live reachability and anonymous permission verification; no school writes/messages.
- `npm run check`: formatting, ESLint, tests, TypeScript and production build. CI includes these tests automatically.
- Unauthenticated workspace navigation is checked in the local production build. A real email-confirmation/account/onboarding end-to-end test requires the owner's account action and is still pending; do not claim it passed.
- Dashboard/students are fictional fixtures; staff/attendance, guardian access, invites, password recovery, full audit coverage, granular permissions, production DB/backups, n8n, business messaging and financial logic are not implemented here.
