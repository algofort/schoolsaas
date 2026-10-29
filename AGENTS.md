# Project instructions

- Use the shared custom list Select from src/components/ui/select.tsx for dropdowns, never a visible native select. Inputs, search fields and dropdowns must not show focus outlines or glow, per the user preference; keep this centralized in src/styles/form-controls.css.

- Read README.md, docs/ARCHITECTURE.md and docs/TEAM_WORKFLOW.md before changing architecture or shared components.
- Typography must match the original Akademi family, responsive sizes, weights and text colors. Use src/styles/typography.css; do not introduce smaller independent component font sizes.
- Keep the Akademi appearance and SCSS foundation; use React for interactions. Do not inject legacy jQuery page scripts or a second global CSS framework.
- Domain-specific work belongs in src/features/<module>. Shared UI must stay reusable and independent of database fetching.
- Preview data must remain explicitly fictional. Do not imply authentication, tenant isolation or integrations exist until implemented and verified.
- Keep secrets and real school records out of source, logs and screenshots. Preserve .gitignore rules for credentials, environment files and raw competitor archives.
- Coordinate changes to the app shell, global CSS, navigation configuration, migration sequence and dependency lockfile.
- Run npm run check before handoff. Verify changed interactive UI at desktop and mobile sizes. Add meaningful behavior tests when implementing business logic and permissions.
- Never deploy, push to an unspecified remote, provision a cloud database or contact message recipients as a side effect of local development.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
