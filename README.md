# School Management System

Local foundation for a multi-school SaaS built with Next.js App Router, React, strict TypeScript and the user-provided Akademi Bootstrap/SCSS visual system. Supabase/PostgreSQL and n8n are the planned data and automation integrations.

## Run locally

Use Node.js 22 LTS (Node 24 is also supported), npm and the committed lockfile.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. The root redirects to `/dashboard`.

Copy `.env.example` to `.env.local` and configure the Supabase URL and publishable key. The workspace now requires sign-in and an active school membership. Without configuration, `/login` explains the missing setup; school pages remain protected. Never paste service-role keys, workflow secrets or email credentials into client code or public environment variables.

## What's included

- Responsive React sidebar/header, mobile navigation with Escape/focus handling, module search and browser-local light/dark preference.
- Akademi stylesheet and editable SCSS source, with React SVG icons replacing the legacy icon-font imports.
- Reusable Button, Card, Badge, PageHeading and EmptyState components.
- Dashboard preview and read-only student directory with working name/guardian/ID and class filters.
- Explicit planned-module routes and integration-readiness page.
- Basic liveness endpoint: `/api/health` (not a database readiness check).
- Lint, typecheck, build, CI, PR template and team guidelines.

Email/password authentication, school onboarding, active membership checks, tenant RLS and academic setup are implemented. Dashboard and student records remain fictional fixtures. There is no real fee calculation, business email sending or connected n8n workflow yet. Read [foundation handoff](docs/FOUNDATION_HANDOFF.md) for release gates and known limits.

## Commands

| Command                | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Local development server bound to loopback       |
| `npm run lint`         | ESLint and Next.js/React checks                  |
| `npm run format`       | Apply shared Prettier formatting                 |
| `npm run format:check` | Check formatting without changing files          |
| `npm run typecheck`    | Strict TypeScript check                          |
| `npm run build`        | Production build                                 |
| `npm run check`        | Formatting, lint, typecheck and production build |
| `npm run theme:build`  | Recompile retained Akademi SCSS                  |
| `npm start`            | Run a previously built production app locally    |

## Structure

```text
src/app/                   Routes and global application styles
src/components/layout/     Shared workspace shell
src/components/ui/         Shared presentation primitives
src/components/dashboard/  Dashboard-specific presentation
src/config/                Shared module navigation
src/features/              Feature-owned components and data adapters
src/lib/                   Cross-feature utilities and integration factories
src/styles/                Compiled Akademi theme
public/vendor/akademi/     Referenced static images
vendor/akademi/            Original SCSS, Bootstrap SCSS and attribution
docs/                     Architecture and team workflow
supabase/migrations/      Reserved for reviewed, versioned schema changes
research/                 Competitor and template assessments
```

Prefer feature components in `src/features/<module>/components`. Shared UI must not fetch domain data. Keep business rules and transactional operations in server-side feature services when those modules are implemented.

## Working together

Read [team workflow](docs/TEAM_WORKFLOW.md), [architecture decisions](docs/ARCHITECTURE.md) and [contributing](CONTRIBUTING.md). Do not edit shared layout, global styling or schema in parallel without coordinating ownership. GitHub remote: https://github.com/algofort/schoolsaas.git . Repository protection and collaborator settings remain unverified.

## Template rights

See [Akademi asset notice](vendor/akademi/NOTICE.md). This project does not grant new rights to the supplied commercial template or third-party assets. Confirm the purchase license before commercial distribution.

## Next implementation phase

Review and release the shared authentication/academic foundation, then implement students/guardians and staff/attendance against its school context and UUID contracts. Notification outbox delivery, n8n and messaging providers come after transactional business events exist.
