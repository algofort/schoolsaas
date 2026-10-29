# Parallel team workflow

## First assign ownership

| Area           | Owner coordinates                                             |
| -------------- | ------------------------------------------------------------- |
| Foundation     | App shell, global theme, shared UI, dependency lockfile       |
| Access/data    | Auth, school context, memberships, migration sequence and RLS |
| Students/staff | Admissions, guardian relationships and staff records          |
| Academic       | Classes, subjects, attendance and examinations                |
| Finance        | Structures, invoices, receipts, ledger and reconciliation     |
| Communication  | Outbox delivery, n8n, provider callbacks and message history  |

These are work boundaries, not assigned people. Agree names when the team is known. One developer can own multiple areas.

## Before coding a feature

- State the feature branch, affected files, required API/types and migration changes.
- Agree dependencies with owners of shared files. Do not let multiple branches independently invent names for the same guardian, class, session or payment concept.
- Define inputs, outputs, validation, permissions, empty/error states and acceptance examples.
- Keep PRs small enough to review; coordinate structural renames separately from feature changes.

## GitHub setup after the user supplies the repository

Connect the remote, review exactly what will be committed, and push the foundation. Then configure main-branch protection: PRs, independent review, passing `checks` CI and resolved review conversations. Those server settings are not created merely by having a workflow file. Use staging for team integration; release production from a reviewed main commit.

CI currently verifies lint, TypeScript and production build. Permission, database/ledger and messaging-deduplication tests must be introduced with their implementations. Automated checks reduce mistakes but cannot guarantee there are none.
