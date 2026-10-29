# GitHub, Vercel and Supabase rollout

Owners: algofort (setup/release), rehan-ayaz (review/module work). Date: 29 October 2026.

Current baseline deployment: https://schoolsaas-lake.vercel.app/ . Health endpoint verified HTTP 200 on 29 October 2026, reporting foundation mode. Database project `schoolsaas-dev` is selected and its first schema is applied; the auth/academic code on `chore/platform-foundation` still needs release. Read [foundation handoff](FOUNDATION_HANDOFF.md), including migration-history reconciliation. Git integration, production branch selection, collaborator access and required checks still need account-level verification.

## First do this, in order

1. Review the existing foundation and both developer plans, then push the clean baseline to https://github.com/algofort/schoolsaas.git . No credentials or competitor archives in Git.
2. Give rehan-ayaz repository collaborator access using the repository owner's GitHub settings. Repository access is separate from Vercel team access. Each developer clones independently and uses their own commit identity.
3. Import this Git repo into Vercel, framework Next.js, project root repository root, install `npm ci`, build `npm run build`, default framework output, supported Node 22. Set main as Production branch. Initial deployment is only the fictional-data foundation. Verify account/team/plan supports both private-repo committers before relying on automatic deployment.
4. Enable GitHub PR review/required checks and restrict main pushes. Existing GitHub Actions `checks` verifies formatting/lint/types/build. Vercel may build in parallel; require both checks before main merge. No deploy hook secrets are needed for ordinary Git integration.
5. Configure development Supabase and authenticated tenant foundation. A visual Vercel URL can exist before DB setup, but DB-backed feature work must wait for Gate 0 in both plans. Keep production data separate from feature previews.
6. Merge Gate 0, update the two developers' starting branches, then execute the bounded two-feature allocations. Integrate and review through PR previews.

## Auto-deploy explained

```text
algofort feature push    -> checks + its Preview URL
rehan-ayaz feature push  -> checks + its Preview URL
PR approved + merged main -> Production deployment
```

Only Git pushes reach Vercel; local edits/commits do not. A feature preview does not replace the main URL. Failed builds, author/team access issues, ignored builds or disabled Git integration prevent a successful new deployment. The Vercel domain points to the last successfully assigned production deployment; verify the actual returned status. Do not assume that code deployment runs SQL migrations or n8n workflow deployment.

## Branches and starting state

- `main`: production foundation and integrated releases.
- `chore/platform-foundation`: shared database/auth/context contract work, algofort owner/Rehan reviewer.
- `feat/algofort-students`: today's student core.
- `feat/algofort-guardians`: today's guardian linkage, after student contract.
- `feat/rehan-staff`: today's staff core.
- `feat/rehan-staff-attendance`: today's daily attendance, after staff contract.

Branches created now are starting refs only. Before work starts on any one, incorporate the merged platform-foundation baseline. The second feature branch must also incorporate its first feature's merged schema/API. Creating all refs does not remove these dependencies.

Rehan first clones the repo and checks out his staff branch. Before development, update it from main after Gate 0 merges:

```sh
git clone https://github.com/algofort/schoolsaas.git
cd schoolsaas
git switch feat/rehan-staff
git fetch origin
git merge origin/main
npm ci
npm run dev
```

Use your own name/email verified on GitHub; do not impersonate the repository owner to make Vercel deploy. Use your private `.env.local`, copied from `.env.example` and configured for the dev project only.

## Environment map

| Runtime            | App                                      | Database                                     | Messages                                |
| ------------------ | ---------------------------------------- | -------------------------------------------- | --------------------------------------- |
| Local              | next dev                                 | local developer DB or designated dev project | disabled/test recipients                |
| Feature preview    | Vercel Preview                           | dev/test, never prod                         | disabled/test recipients                |
| Main preview-stage | first production URL with fictional data | none until foundation                        | disabled                                |
| Real production    | reviewed main deployment                 | separate production Supabase                 | explicit production providers/templates |

Supabase URL/publishable key can be public; service keys, webhook secrets and email tokens cannot. Configure environment scopes in Vercel and redeploy affected builds. Auth redirect allowlists must match intended origins; do not broadly allow arbitrary production redirects.

## Database rollout

Use reviewed migration files and validated contracts, one migration owner, local replay and tenant-policy tests. Verify new Data API grants separately from RLS. Do not directly reset a hosted database. The first foundation migration is now applied to dev through the SQL editor; reconcile its CLI history as described in FOUNDATION_HANDOFF.md before `db push`. CLI-generated database types remain a follow-up to the validated runtime contracts. Introduce deployment workflows only after staging/production credentials, migration approval and rollout order are known. Database changes need their own test gate; old frontend previews may still run, so keep migrations backward compatible.

## n8n rollout

Run n8n on persistent hosting or n8n Cloud, separately from Vercel. Configure a signed/authenticated server dispatcher and delivery callbacks. Export workflow definitions without credentials; version them alongside event schema contracts when implemented. Configure real provider credentials outside Git. No actual messages should be sent by today's development deployments. Review n8n licensing for the intended SaaS and per-school credentials model before commercial release.

## What still requires connected account access

Vercel Git/team settings, repository collaborator/protection settings, Supabase organization/project selection and cloud database configuration. The initial Vercel URL is live. Repository branches and local documents alone do not create these account settings. No new paid service/project should be chosen without the user's account/project/budget context.

Official references: https://vercel.com/docs/deployments/git ; https://vercel.com/docs/deployments/environments ; https://supabase.com/docs/guides/deployment/managing-environments .
