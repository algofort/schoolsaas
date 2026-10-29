# Akademi HTML template suitability review

Reviewed: 29 October 2026.
Source: `C:\Users\AddizTech\Downloads\Akademi-v1.1-14-August-2023\xhtml`

## Verdict

**Technically suitable as our visual foundation.** Keep its visual styling and assets, convert page layouts into React components, and build actual functionality against our application backend. This is a static admin template, not a school-management backend. No implementation or modification of the original template was performed during this review.

## Evidence from the local files

- Product: Akademi School and Education Management Admin Dashboard Template, DexignLab, package version 1.1.0.
- Documentation release: v1.1, 14 August 2023; included package tooling may have been modified after that release (Dart Sass scripts are present while documentation still describes node-sass).
- 79 top-level HTML pages, plus AJAX fragments.
- Bootstrap 5.2.3 and jQuery 3.6.4 identified in `vendor/global/global.min.js`.
- SCSS source and compiled CSS included. `scss/main.scss` imports local Bootstrap SCSS and theme/component/page styles.
- Poppins font, purple primary `#4D44B5`, coral secondary `#FB7D5B`, and CSS custom properties for theme shades.
- Theme configuration includes light/dark, horizontal/vertical navigation, sidebar variants, fixed/static layout and color choices. RTL-related files exist, but Urdu rendering and complete RTL behavior were not tested.
- Chart.js, ApexCharts, DataTables, Swiper, WOW/animate.css, date pickers and jQuery select plugins are referenced by representative pages.
- Compiled `css/style.css` is approximately 1.05 MB uncompressed; vendor directory approximately 27.5 MB on disk. These are file sizes, not the measured transfer size of every page.

## Useful existing designs

| Our area | Existing starting point |
|---|---|
| Admin dashboard | `index.html`, `index-2.html` |
| Student directory/detail/admission | `student.html`, `student-detail.html`, `add-student.html` |
| Staff directory/detail/forms | `teacher.html`, `teacher-detail.html`, `add-teacher.html` |
| Finance overview | `finance.html` |
| Invoice appearance | `ecom-invoice.html` (generic commerce design; adapt school fields) |
| Calendar | `app-calender.html`, `celandar.html` |
| Account/profile | `app-profile.html`, `edit-profile.html` |
| Authentication screens | `page-login.html`, `page-register.html`, `page-forgot-password.html` |
| Communication presentation | `chat.html`, email screens (visual examples only) |
| Shared UI | Cards, tables, modals, alerts, typography, widgets, form examples |

## Browser checks performed

Served the original files read-only through a localhost-only static server and inspected dashboard and admission-page rendering. The dashboard rendered its branded sidebar, summary cards, charts, calendar, tables and right-side student/message panels. The admission page rendered student/guardian fields and Save/Draft controls.

This establishes that representative layouts can render, not that all 79 pages or all interactive plugins pass testing. Full mobile, accessibility, print, RTL and cross-browser checks remain for implementation.

The dashboard and message data are sample content. Login's form action points to `index.html`; it is not real authentication. The inspected admission page has fields/buttons without a surrounding form element, and no operational school backend was identified in this template.

## Next.js adaptation approach

1. Extract shared `AppShell`, `Sidebar`, `Header`, page title, card, table, form-field and modal components.
2. Convert HTML to JSX: attributes, labels, inline styles, links, lists and repeated components.
3. Keep the Akademi SCSS/design tokens and required static assets to preserve its appearance. Scope dashboard styles so public marketing pages can have their own layout.
4. Use application state for navigation, dropdowns, modals, selection and forms. Avoid global jQuery scripts mutating React-owned DOM.
5. Replace jQuery DataTables/select/date-picker behavior with React-controlled equivalents while matching the template styling. Keep chart libraries only through maintained React-compatible integration, loaded where needed.
6. Reuse appropriate CSS transitions and animation styles; reimplement scroll/entry triggers with React lifecycle/IntersectionObserver and respect reduced-motion preferences.
7. Load browser-only widgets on client boundaries; initialize and clean up any retained third-party widget correctly on route changes.
8. Connect forms, tables and charts to PostgreSQL-backed APIs, authentication and school-scoped permissions. n8n integrations remain independent of the presentation layer.

### Adjustment to the earlier stack recommendation

For a faithful Akademi appearance, start with **Next.js + TypeScript + Akademi Bootstrap/SCSS styling**. PostgreSQL/Supabase and n8n recommendations remain unchanged. Do not immediately combine the full Bootstrap theme with a second global Tailwind/shadcn design system; that adds resets, competing styles and redundant components. React/headless components can still be styled to match Akademi. A future Tailwind conversion is possible, but would be a separate design-system rewrite.

## Product features we still have to build

School tenancy/branches, roles and permissions, guardian–student relationships, sessions, attendance rules, exams/grading, fee invoices and transaction-safe receipts, accounting, promotion, reports, document generation, parent/student portals, subscription enforcement, audits and messaging are application work. The template supplies visual examples for some areas, not the working business logic for these modules.

## Findings and limitations

- `add-student.html` references missing `js/styleSwitcher.js`. Correct/remove that reference during migration.
- Documentation still recommends node-sass, while package scripts already use Dart Sass. Use a reviewed, fresh application toolchain rather than copying the bundled `node_modules` or installing legacy tooling from the documentation blindly.
- Templates load several libraries on the dashboard. Remove unused demo plugins and page-specific assets; optimize images/fonts and measure actual bundle sizes during migration.
- A 2023 template release date does not itself prove vulnerabilities. Dependency/license review is still needed before production; no dependency security audit was performed here.
- Phone fields in the inspected admission page are numeric inputs. Our production form should use telephone/text inputs with normalization and validation so plus signs and leading zeroes are handled correctly.
- The parent portal, attendance registers, detailed fee operations and other missing screens will need new layouts built from the same visual components.

## License evidence

Local `package.json` says `ISC`, while the documentation identifies DexignLab and carries a copyright notice. No template-specific purchase certificate or commercial SaaS license grant was found in the inspected package outside dependency/icon licenses. The package metadata alone is insufficient to establish rights for the whole template, demo images and bundled assets. Commercial usage entitlement remains unverified; retain the actual vendor/purchase license for the intended SaaS use. No conclusion about required license tier is made in this review.

## Recommended next deliverable

Before converting all pages, build one reviewed dashboard shell and one student directory/admission flow using the actual theme assets. Validate visual fidelity, responsive sidebar, route transitions, forms and CSS isolation. Then apply the components consistently to the remaining school modules.
