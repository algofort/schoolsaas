# Architecture decisions — foundation

## Accepted direction

- Next.js App Router, React and TypeScript in a single modular application.
- Akademi Bootstrap/SCSS for the visual foundation; React owns DOM state and interactions. No global jQuery runtime, duplicate Tailwind reset or legacy template plugin initialization.
- Supabase-managed PostgreSQL and Supabase Auth. The designated development project is `schoolsaas-dev` (`fmiexnuyseqxvrcrkvrd`). See FOUNDATION_HANDOFF.md for the implemented schema and release verification.
- Tenant identity will come from authenticated, validated school membership. A client-supplied school ID must never establish access by itself.
- Explicit guardian–student relationships through IDs, not phone equality or matching father's names. Phone normalization is a contact/login concern, not authorization.
- Schema changes will be reviewed SQL migrations under `supabase/migrations`.
- UI preview fixtures are visibly marked and kept in `src/features/students/data`; replace them with data adapters when implementing real features.

## Boundaries

`app` composes routes. `components/ui` supplies domain-independent presentation. `components/layout` handles navigation/appearance. `features/<module>` owns its domain behavior, forms, types and server-side services. `lib` contains genuinely shared helpers/integration factories. Navigation is centralized in `src/config/modules.ts`.

Planned feature areas: school context/access, students/guardians, staff, academics, attendance, fees/accounting, reports and notifications. Separate microservices are not required for this foundation.

## Integration policy

Credentials remain server-side except the publishable Supabase project URL/key. Publishable keys are not permission checks: enforce API authorization and database policies. Server-rendered school routes require a provider-validated user and a current database membership. Proxy refreshes cookies and disables response caching; it is not the authorization boundary. Server Actions repeat authorization and PostgreSQL RLS provides an independent boundary.

Core business writes and calculations belong in the application/database. A future notification outbox will be written in the same transaction as the business event. A dispatcher will deliver authenticated events to n8n, with event IDs, deduplication, retry limits and delivery status. n8n will orchestrate communication, not maintain the authoritative student ledger. Use separate credentials/database ownership for n8n's own runtime data.

## Data design still to agree

The first migration defines school membership, campuses, sessions, classes, sections and a bootstrap audit store. All rows have school UUIDs; composite foreign keys prevent cross-school parents. Owner/admin may maintain academic setup; other active roles may read it. Membership changes are not exposed to clients. Detailed guardian, student, staff, financial, branch-scoped permissions and notification contracts remain for their feature migrations. See FOUNDATION_HANDOFF.md.

## Presentation and accessibility

Reference-inspired light palette: primary #5546FF, white sidebar/cards, background #F3F5FB, heading #101B62 and muted text #7886B4; coral #FB7D5B; Poppins typography with a system fallback. Source tokens remain in Akademi SCSS; application refinements use `--school-*` variables. Typography is centralized in `src/styles/typography.css` and follows the original responsive root scale (16px, reduced to 14px at <=1600px), Poppins, text colors inherited from the shared palette (the later user-supplied color reference supersedes the original template colors). Do not add independently reduced px font sizes to component/layout CSS. Honor reduced motion. Every interactive control needs a meaningful accessible name. Verify keyboard navigation and mobile overflow for shared changes.

## Production readiness

School routes are protected; dashboard/student content remains a sample. This development foundation is not a complete production school service. Release still requires a real account/confirmation/onboarding smoke test, reviewed merge/deployment, separate production database, backup/recovery planning, broader business tests, audited integrations and the appropriate template license. Team invitations and password recovery are not implemented yet.
