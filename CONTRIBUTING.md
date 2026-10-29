# Contributing

1. Read `docs/ARCHITECTURE.md` before changing shared behavior.
2. Create a branch such as `feat/student-admissions` or `fix/sidebar-focus` from the current main branch once the Git repository is connected.
3. Declare the module/files you own before parallel work. Use one workspace/checkout per developer; local agents sharing a checkout must coordinate non-overlapping edits.
4. Install with `npm ci`. Add dependencies through npm and commit `package.json` and `package-lock.json` together. One owner resolves lockfile updates at a time.
5. Reuse the existing UI components and theme. Shared API/type/schema changes must be agreed before consumers depend on them.
6. Run `npm run check`. Add behavior tests for meaningful business/permission changes when those features are implemented.
7. Open a PR with the problem, final behavior and validation. Include desktop/mobile screenshots for UI changes, and migration/rollback notes for schema changes.
8. Require another team member's review before merging. CI and branch protection enforce this only after configured on GitHub.

Never commit real school data, API credentials, `.env.local` or research-account credentials. Never edit the production database directly to keep a feature working; use reviewed migrations and feature services.
