# Developer 1 — algofort

Work plan dated 29 October 2026, Asia/Karachi. GitHub: **algofort**. Partner: **rehan-ayaz**. This is a self-contained planning file, not a claim that features are implemented.

## Your ownership

Foundation/release coordination, school access and migrations, students/guardians, fees/accounting, subscription/operator and financial portal features. You own shared files and merge migration changes. Rehan owns staff/attendance/academic functionality; do not change his module files while he is working.

## Today: exactly two module features after Gate 0

### Feature 1 — Core student admissions/directory

Branch: **feat/algofort-students**. Files: `src/features/students/**`, `src/app/students/**`; any required server endpoints/types follow agreed contracts. Student/enrollment migration is authored with the migration owner (you), separately from Rehan's staff schema.

Build: authenticated school-scoped list/search/class/status filters; create/edit student; unique admission number; create current-session enrollment; class/section/roll validation; statuses with archive/discharge behavior that preserves history. Replace fictional fixture adapter with the dev database adapter only when auth/tenant context is ready. Required fields must use one shared validation contract.

Acceptance: create two fictional students, reload and find them; update persists; duplicate admission/roll rejected according to agreed scope; no cross-school enrollment; invalid class/session rejected; unauthorized users cannot access/change records; responsive table/forms. No fees/receipts, bulk import, photo pipeline, PDF or promotion are required in today's feature.

### Feature 2 — Guardians and explicit child linking

Branch: **feat/algofort-guardians** (create after students PR merges; alternatively stack on students and retarget/rebase after merge). Files: `src/features/guardians/**`, `src/app/parents/**` and small student detail integration owned by you. Share student UUIDs through the agreed adapter, not copied fixture shapes.

Build guardian directory/create/edit, canonical phone/email validation, link/unlink students via relationship table, primary guardian flag and explicit confirmation. Listing students under a guardian must query relationship IDs. Keep unlink audit; no destructive loss of student records. Avoid automatically issuing logins/PINs or sending messages as a side effect.

Acceptance: one guardian links both students; second guardian can link one child; same-name guardians remain distinct; normalized phone changes do not break links; duplicate link blocked; removing one link leaves the other intact; cross-school link rejected in API and DB. Parent activation/login UI, combined family billing and n8n sends are later milestones.

## Your sequence today

1. Lead Gate 0 with Rehan reviewing; review/push foundation and connect Vercel preview when access is available.
2. Agree shared schema and access contracts, then merge baseline before Rehan begins staff work.
3. Complete Feature 1 in its own PR; Rehan reviews. Rehan works on his staff feature concurrently without editing students.
4. Create Feature 2 from updated main; complete/tests/PR; Rehan reviews.
5. Review Rehan's two PRs; merge one at a time, verify migration order and Preview/Production status. Record incomplete work honestly rather than treating a screen as a finished feature.

Do not promise four production-complete modules plus platform/database setup in one day; today's count is four bounded core feature slices across the team, gated by infrastructure readiness.

## Complete product scope — included in both developer plans

The target includes all 29 modules advertised by SchoolApp.pk plus operational capabilities found in research. A reference claim is a requirement candidate, not proof it worked. Both developers must read this full scope; the owner column identifies the primary implementer. The other developer reviews the PR. Product details remain in `research/SCHOOLAPP_RESEARCH.md`.

| Area                    | Required capabilities                                                                                                                   | Owner / delivery wave                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Platform foundation     | School onboarding, authentication/recovery, membership, roles, tenant isolation, audit trail, shared components, CI and deployment      | algofort; Gate 0                                                                  |
| Organization            | School settings, multiple branches, multiple shifts, academic sessions and class/section reference data                                 | algofort shared contract; wave 2; Rehan reviews academic requirements             |
| Admissions/students     | Add/edit, search, filters, photos, status/discharge, unique admission/roll numbers, import/export, opening balances                     | algofort; TODAY feature 1 (bounded core below), remaining wave 2                  |
| Guardians/families      | Explicit many-to-many guardian links, sibling grouping with admin confirmation, contact normalization, family billing view              | algofort; TODAY feature 2 (linkage core), billing view after fees                 |
| Teachers/staff          | Staff profiles, employee identifiers, contacts, department/designation, qualification, joining date, base salary, status, import/export | rehan-ayaz; TODAY feature 1 (bounded core below), remaining wave 2                |
| Staff attendance        | Daily register, present/absent/late/leave, date filters, monthly/annual summaries; future time tracking                                 | rehan-ayaz; TODAY feature 2 (daily core), summaries wave 2                        |
| Student attendance      | Class/section/date registers, bulk mark, summaries, absent events and defaulter reports                                                 | rehan-ayaz; wave 2 after student contract merges                                  |
| Fee structures/vouchers | Categories/frequencies, class amounts, fines, discounts, bulk/custom invoices, challans, historical arrears                             | algofort; wave 2 after admissions                                                 |
| Fee collection/ledger   | Partial/full receipts, FIFO/advance credit, transaction-safe numbering, adjustments/voids with audit, passbook, cash closing            | algofort; wave 3                                                                  |
| Payment integrations    | Consumer-number payments, QR/RAAST collections, verified callbacks and reconciliation                                                   | algofort; wave 4; provider agreement required                                     |
| Accounting/profit-loss  | Fee income, other income, expenses, categories, monthly/yearly reports, financial exports and reconciliation                            | algofort; wave 3                                                                  |
| Payroll                 | Salary periods, earnings/deductions, payslips, payment records; salary/attendance rules agreed with Rehan                               | algofort finance; wave 4 after staff contract                                     |
| Academics               | Classes, sections, subjects, syllabus, lesson plans; real editable timetable and shifts                                                 | rehan-ayaz; wave 2–3; shared class schema approved by algofort                    |
| Examinations            | Exam types/schedules/subjects, datesheets, roll slips, marks entry, publication, custom versioned grading policy                        | rehan-ayaz; wave 3                                                                |
| Results/report cards    | Shared grade calculation across every screen, class performance, toppers, English/Urdu reports and batch print                          | rehan-ayaz; wave 3                                                                |
| Learning content        | Homework, diary, assignments, worksheets, video lecture links/uploads and lesson plans                                                  | rehan-ayaz; wave 4                                                                |
| Promotion/alumni        | Promote/repeat/graduate by target session, balances carried safely, previous-session history retained                                   | algofort financial/session rules + Rehan academic review; wave 4                  |
| Library                 | Catalog, copies, borrower issue/return, due dates, overdue behavior and parent visibility                                               | rehan-ayaz; wave 4                                                                |
| Documents               | Student ID cards, QR, themes/orientation; character/leaving/appreciation certificates; print/PDF layouts                                | algofort; wave 3–4                                                                |
| Birthdays               | Student/staff birthday center, age/date rules, scheduled wish events                                                                    | algofort event integration; wave 4                                                |
| Parent portal           | Linked children, profiles, attendance, fees, published results, homework, notices, timetable, leave requests                            | algofort shell/access/fees; Rehan academic APIs; wave 4                           |
| Student portal          | Own profile, published academic content/results, timetable and permitted library data                                                   | rehan-ayaz; wave 4                                                                |
| Parent communication    | Feedback/reviews, teacher contact, leave approval, announcements and preferences                                                        | rehan-ayaz; wave 4; algofort reviews guardian access                              |
| Extended parent modules | Medical records, transport routes/assignment and sports/activities with explicit permissions                                            | rehan-ayaz; wave 5; these were placeholders in reference                          |
| Users/rights            | School roles, granular module permissions, staff invitations, parent activation, approval/revocation                                    | algofort; baseline Gate 0, extended wave 3                                        |
| Dashboard/reports       | School/branch KPIs, cards, attendance, aging including opening arrears, finance, performance and exports                                | algofort finance/dashboard; Rehan academic reports; wave 3                        |
| n8n communication       | All business email/WhatsApp workflows, approved templates, targeting, schedules, opt-outs, retry/dedup, delivery/cost logs              | rehan-ayaz orchestrates n8n; algofort owns outbox/secured app endpoints; wave 3–4 |
| Push/SMS/PWA            | Opt-in browser push/PWA, SMS provider adapter if selected, branded app metadata                                                         | rehan-ayaz; wave 5; separate providers, not promised free                         |
| Subscription/billing    | Trial/plan limits, expiry, upgrade proof/review, history; later automatic billing                                                       | algofort; wave 4                                                                  |
| Operator/admin          | Schools/users, activation/suspension, subscriptions, revenue, support tickets/replies, announcements, audited impersonation             | algofort; wave 4                                                                  |
| Help/training           | Customer support, knowledge base and video training; separate training content from functionality                                       | rehan-ayaz help UI; algofort ticket/operator backend; wave 5                      |

## How both developers work without colliding

- Two separate clones/workspaces, one GitHub repository. Never share a live checkout across two human developers.
- Freeze Gate 0 contracts before today's module work. Full independence is impossible: staff attendance depends on staff; fees depends on students. Today's split keeps those dependencies inside each developer's own work.
- Use `src/features/students` + `guardians` for algofort; `src/features/staff` + `staff-attendance` for rehan-ayaz. Route entry files only compose their modules.
- Shared files (`src/components/ui`, layout, global CSS, typography, navigation config, auth clients, generated DB types, package lock, migrations) have one merge owner: algofort. Rehan requests a small shared change rather than rewriting them on his feature branch.
- Never copy the reference's phone-based guardian authorization. Link by UUIDs. No secrets or school/customer data in Git. Use fictional seed data only.
- Preserve current Akademi typography and approved light palette, hidden sidebar scrollbar, no field focus outlines/glow, shared custom list Select, smooth row hover, and reduced-motion behavior. No native visible selects or jQuery scripts.
- Run `npm ci`; then `npm run check` before PR. Add meaningful persistence, validation and authorization tests with real features; visual demo rows do not count as completion.
- Separate commits/PRs for the two features. Rehan reviews algofort; algofort reviews Rehan. Rebase/merge latest main before integration, rerun migrations/tests, resolve conflicts with the shared owner.
- Vercel Preview is for review. A passed Vercel build is not a passed permission or accounting test. Main merges require CI and review. Production migration rollout is separate from Vercel code rollout.

## Gate 0 — shared prerequisite, not one of today's two feature allocations

Owner **algofort**, reviewer **rehan-ayaz**. Finish before either starts DB-backed module work. If time runs out, carry features forward; do not bypass access policies to meet today's count.

1. Review/push existing foundation to the supplied GitHub repo, invite Rehan, verify commit-author identities and CI. Import main into Vercel for a sample-data preview. No real records until authentication/policies exist.
2. Configure a development Supabase project plus local developer instances (local requires supported Docker/Supabase tooling). Keep a separate production project when launching live data. Vercel preview branches use dev/test data, never production credentials.
3. Agree shared schema/contracts; provision minimal school, branch, session, classes/sections, profiles and school memberships. Seed one fictional school/branch/session for integration. Detailed migrations created through the Supabase CLI, reviewed and replayed locally before promotion; no applied schema is included in these planning files.
4. Implement server-verified session and membership context, explicit API authorization, and RLS on every exposed table. A user-supplied school ID or user-editable metadata is never authority. Test school A cannot read/write school B.
5. Explicitly review Data API grants as well as policies; current Supabase may not expose new tables automatically. Avoid privileged keys in browsers, and review helper functions/views for accidental RLS bypass.
6. Freeze request/response types, table/column names and migration ownership; publish generated DB types once. Only then create feature branches from this merged baseline.

### Shared data contracts to approve

- UUID identifiers; `school_id` on tenant records; branch/session columns where the concept applies; creator/timestamps and explicit lifecycle status.
- `schools`, `branches`, `academic_sessions`, `classes`, `sections`, `profiles` (auth user link) and `school_memberships` (user/school/role/status). Membership roles owned by foundation, not independently invented by each module.
- `students`: stable school identity and unique school admission number. `student_enrollments`: student/session/class/section/roll, so promotion does not overwrite history.
- `guardians` and `student_guardians`: explicit link, relationship and primary/contact permissions. Guardian portal identity links to profile/auth user, separately from phone/email contact. A guardian may link multiple students and a student multiple guardians.
- `staff`: school-scoped employee identifier, optional profile/login link, role-independent directory data. `staff_attendance`: staff/date/status with a unique staff/date record in the agreed school context. A directory record does not silently grant login access.
- Foreign keys and uniqueness constraints must prevent cross-school links; index tenant filters and relevant FKs; write multi-row admissions/linking/fee operations transactionally. Finance stores PKR amounts in integer minor units, not floating point; currency and conversion rules documented before finance work.
- Date-only attendance uses school timezone `Asia/Karachi`; audit/delivery timestamps use UTC. Normalized phones are contact values, not guardian authorization.
- Server context returns validated school/user/membership; module services do not trust client role or school selection. No generic admin service key for frontend CRUD.

## n8n architecture — agreed direction for both developers

`App transaction -> notification outbox -> server dispatcher -> authenticated n8n webhook -> email/WhatsApp provider -> delivery callback -> application delivery log`.

- n8n is deployed separately on persistent hosting or n8n Cloud; it is not a long-running process inside a Vercel function. Queue workers/Redis are a later scale choice, not a prerequisite for today's features.
- Fees, attendance, family links and balances remain authoritative in PostgreSQL/app services. n8n consumes business events and returns delivery status.
- Outbox event contract: event ID, schema version, school ID, event type, subject ID, occurred-at and minimal data/reference. Dispatcher authenticates server-to-server calls. Recipient IDs are resolved under tenant/guardian permissions; no browser-submitted arbitrary recipient lists.
- Relevant events: `student.admitted.v1`, `guardian.linked.v1`, `staff.created.v1`, `staff.attendance.recorded.v1`, `student.absent.v1`, `fee.invoice.created.v1`, `fee.receipt.recorded.v1`, `exam.results.published.v1`, `school.announcement.created.v1`, `subscription.expiring.v1`.
- Delivery deduplication key includes school, event, channel, recipient and template/version. Retry with bounded backoff; dead-letter failures; out-of-order/repeated callbacks must not duplicate messages or downgrade final status.
- Email via Resend (or agreed provider); WhatsApp via official Meta Cloud API/approved provider and approved templates where required. Use authorized test recipients until production enabled. Authentication/security emails require a separately agreed Supabase Auth email strategy; business n8n workflows are not proof OTP/recovery is configured.
- Per-school secrets isolated server-side, preferences/consent respected, recipient data minimized, execution-log retention set. Verify n8n licensing against intended SaaS/credential/embedding model before commercial launch; do not promise free white-label workflow hosting.
- Today: agree event names and interfaces; no real sends, provider provisioning or full automation feature counted as completed.

## Deployment and branch rules

Repository: https://github.com/algofort/schoolsaas.git . Production branch **main**. No develop branch initially; each feature branch has its Vercel Preview. Avoid two sources of integration truth for a two-person team.

- Push feature branch -> GitHub CI + Vercel Preview (after Git integration/access is configured).
- Review Preview/PR -> other developer approves -> checks pass -> merge main -> Vercel Production build/deploy.
- Local commit alone does not deploy. Failed/canceled/blocked build does not publish the new version. Ignored build rules, disabled integrations, author permissions or plan limits can prevent deployment.
- Current CI is formatting/lint/typecheck/build only. PR rules and required checks must actually be enabled on GitHub; a YAML file alone does not enforce them. Avoid direct pushes to main.
- Vercel does not automatically apply Supabase migrations or activate n8n workflows. Roll these out explicitly: compatible additive DB migration -> compatible app -> workflow version -> later cleanup. Never run destructive DB reset on a hosted project. App rollback does not restore database state.
- Configure Development/Preview/Production env scopes independently; auth redirect URLs must include only intended local/preview/production origins. Redeploy when necessary after environment changes; keep secrets out of files and browser bundles.
- Verify both GitHub committers can trigger deployments under the selected Vercel team/plan. Hobby private-repo collaboration has author/organization restrictions; do not misattribute commits to work around them.

## Completion checklist shared by both

- [ ] Gate 0 merged and contracts read.
- [ ] Both assigned feature PRs have bounded acceptance criteria and no shared-file collisions.
- [ ] Writes survive reload; validation/empty/loading/error states verified.
- [ ] Cross-school read/write and role restrictions tested, including link reassignment attempts.
- [ ] Required uniqueness, date and foreign-key edge cases tested.
- [ ] UI matches shared typography, custom dropdown and field focus preferences on desktop/mobile.
- [ ] `npm run check` passes; other developer reviews PR; Preview URL included.
- [ ] Migration replay and staging integration verified before release; no customer messages sent during tests.

Sources checked 29 October 2026: [Vercel Git deployments](https://vercel.com/docs/deployments/git), [Vercel environments](https://vercel.com/docs/deployments/environments), [Supabase environments and migrations](https://supabase.com/docs/guides/deployment/managing-environments), [Supabase API security](https://supabase.com/docs/guides/api/securing-your-api), [Data API grant change](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically).
