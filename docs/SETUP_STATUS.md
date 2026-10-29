# Foundation handoff

## Implemented

- Local Next.js 16.4.3 / React 19.3.1 / TypeScript 5.9 foundation with npm lockfile, Node 22 LTS baseline and local-only server binding.
- Akademi SCSS and Bootstrap SCSS retained; compiled stylesheet is imported through Next.js. Theme/font imports are cleaned, Poppins is bundled locally, and all retained image URLs resolve to supplied files.
- Shared React workspace shell and five UI primitives, SVG trend presentation, explicit sample fixtures, student filters, planned-module routes and setup status UI.
- Formatting, lint, typecheck and production-build commands; PR/CI templates; ownership and architecture documentation.
- Local Git initialized on main. No commits, remote, push or repository branch-protection configuration yet.
- Research credentials, real environment files and raw competitor archives excluded by Git ignore rules. A scan found no known research-account password in publishable files.

## Verification

- `npm run theme:build` succeeded; generated theme has no unresolved CSS imports or missing referenced image files.
- Final `npm run check` passed after the mobile accessibility refinement: formatting, ESLint, strict TypeScript and production build.
- Production preview rendered without console errors. Production dependency audit reported zero vulnerabilities at setup time; this is not a complete security audit.
- Desktop and phone breakpoints inspected; phone layout had no horizontal page overflow, with wide student tables scrolling inside their container.
- Name search reduced the directory to one expected row; Grade 7 filter produced the two expected rows. Module search returned Automations.
- Light/dark toggle changed the UI. Mobile sidebar opened, Escape closed it and focus returned to the menu button.
- Dashboard, students, settings, fees placeholder and liveness returned HTTP 200; an unknown module returned 404. Health response explicitly reports foundation mode. Closed mobile navigation was visually hidden; dark-mode preference survived reload. Browser viewport override was reset after testing.

## Explicitly not implemented

Real sign-in, tenant/school authorization, database provisioning/migrations, guardian relationships, business calculations, live admissions, financial transactions, sending email/WhatsApp, n8n workflow delivery, payments, production deployment and GitHub repository settings.

Review README.md to run the local preview. Configure integrations only after the schema, authorization contracts and environment ownership are agreed. Template commercial usage rights remain a separately documented prerequisite.
