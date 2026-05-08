# S²IMS Architecture Renovation Audit

## 1. Purpose

This audit uses the PROJELEARNT Laravel PDPA learning project as an architecture reference, then adapts its lessons to the actual S²IMS stack.

PROJELEARNT teaches a clear responsibility chain:

`Route -> Middleware/Auth/Policy -> Controller -> FormRequest -> Service -> Model/Database -> View -> Audit Log`

S²IMS is not Laravel and should not be forced into Laravel shapes. The useful lesson is responsibility separation: routes should be easy to trace, sensitive access should be guarded and auditable, validation should be explicit, data access should not be scattered through pages, and UI components should not own business rules that belong in services or policy-like helpers.

This is an audit and renovation plan only. It does not propose a rewrite, route redesign, schema change, auth behavior change, or feature expansion.

## 2. Current Project Summary

| Area | Current S²IMS status |
|---|---|
| Framework | Next.js `14.2.3` |
| Routing style | App Router under `src/app` |
| Language | TypeScript with `strict: true`, `allowJs: true` |
| UI stack | React 18, Tailwind CSS 3.4.1, lucide-react, Recharts |
| Auth approach | Client-side mock auth in `src/lib/auth.tsx`, role stored in `localStorage` as `s2ims_role` |
| Route protection | `AppShell requiredRole` redirects mismatched or missing roles to `/login` on the client |
| Middleware | No `middleware.ts` detected |
| API routes | No `src/app/api` routes detected |
| Data approach | Local mock data under `src/data/mock` imported directly by pages/components |
| Validation approach | Mostly inline client-side validation in components/forms; no schema validation library detected |
| Service layer | No `services/` directory detected |
| Repository/data access layer | No repository/API/database client layer detected |
| Shared UI | `src/components/ui/index.tsx`, layout shell, role-specific component folders |
| Build scripts | `dev`, `build`, `start`, `lint` |
| Typecheck/test scripts | No standalone `typecheck` or `test` scripts |
| Tests | No tests detected |
| Build health | `npm run build` passed |
| Lint health | `npm run lint` opens Next.js ESLint setup prompt because no ESLint config exists |

Known structure:

- `src/app`: public, student, provider, staff, ESQ, and admin routes.
- `src/components`: shared, layout, student, provider, staff, admin, and UI components.
- `src/lib`: auth, i18n, navigation, types, utilities, and student prompt copy.
- `src/data/mock`: role and domain mock data.
- `messages`: Thai and English message JSON files.
- `docs`: design specs, QA docs, phase summaries, and daily reports.

## 3. Current Request/Data Flow

The observed S²IMS flow is:

`URL/Page -> App Router page.tsx -> AppShell requiredRole client guard -> direct mock data import -> local component state/inline validation -> React component rendering`

For sensitive-looking screens, the flow is usually:

`Role page -> AppShell requiredRole -> mock staff/admin/provider data -> visual privacy/audit warning component -> mock UI action`

Current confirmation:

- Role is selected on `/login` and stored in `localStorage`.
- `AuthProvider` loads the role from `localStorage` and finds a matching mock user.
- `AppShell` performs client-side redirects if the user is missing or role mismatches.
- Data is read from local mock modules.
- Some UI interactions simulate submission, export, reveal, or shortlist state locally.

Needs confirmation before production architecture:

- Real backend/API ownership.
- Real session/auth provider.
- Real database schema.
- Real audit log storage.
- Real PDPA retention and masking rules.
- Whether App Router server actions or API routes should be used for mutations.

## 4. Mapping From PROJELEARNT Concepts To S²IMS

| Learning concept from PROJELEARNT | Equivalent in S²IMS | Current status | Gap |
|---|---|---|---|
| Route | `src/app/**/page.tsx` | Present and easy to locate | Route inventory exists only informally |
| Middleware/Auth | `AppShell requiredRole`, `AuthProvider` | Client-side only | No server middleware, no session validation, no policy layer |
| Controller/Page Handler | App Router page component | Present | Many pages mix UI, filtering, mock data access, and action logic |
| FormRequest/Validation | Validation schema or form validation helper | Mostly inline | No central schema layer; no reusable validation contracts |
| Service Layer | Domain functions such as `ScholarshipService` or `PrivacyMaskingService` | Mostly absent | Business rules are scattered in pages/components/mock helpers |
| Model/Data Access | Mock data modules, future DB/API client | Mock modules present | No repository/API boundary; pages import mock data directly |
| View/Component | React components and layout shell | Present and improving | Some components remain large or role-specific when patterns could be shared |
| Audit Log | Mock audit data and warning UI | Present visually in some places | No central audit service or guaranteed audit side effect |
| Data Masking | Staff/provider masking cards and candidate tokens | Partially present | Rules are not centralized or testable |
| Config-driven options | `navigation.ts`, role tokens, status maps, mock labels | Partially present | Status/role/PDPA options are split across `types`, `utils`, mock data, and components |
| Role-based access control | `requiredRole` prop | Present at UI-shell level | No route-level server enforcement or permission granularity |
| DRY shared components | `StatusBadge`, `PrivacyNotice`, `MatchScoreRing`, shell components | Partially present | Tables, forms, filters, exports, and disclosure patterns still vary by page |

### Laravel-to-Next Adapted Flow

| Laravel learning model | Next.js/S²IMS equivalent | Recommended future target |
|---|---|---|
| Route | App Router route segment | Keep current route URLs stable |
| Middleware/Auth/Policy | `middleware.ts`, session provider, policy/access helpers | Add documented access boundary before production |
| Controller | Page loader, server action, or API route handler | Keep pages thin and orchestration-focused |
| FormRequest | Zod/schema validation or typed validation helpers | Centralize form validation gradually |
| Service | Domain service functions | Extract repeated business rules safely |
| Model/Database | API client, DB client, repository | Add only when backend architecture is approved |
| View | React components | Keep components focused on presentation and interaction |
| Audit Log | Audit service/event writer | Add for sensitive access and export workflows |

## 5. Problems Found

### 1. Routing problems

- Role route groups are clear, but route maps are not documented in a durable architecture file.
- Some legacy provider routes, such as `provider/insights` and `provider/outcomes`, appear adjacent to newer Phase 4 routes and need scope clarification.
- Dynamic route param style varies, with some pages using Promise params and others plain params.

Risk: Low to medium. Current build passes, but future route growth may become hard to reason about.

### 2. Auth/middleware problems

- Role auth is client-side mock state in `localStorage`.
- No `middleware.ts` exists.
- `AppShell requiredRole` protects rendered shells, but it is not a server-side security boundary.

Risk: High for production, medium for prototype. It is acceptable for mock development but not enough for real PDPA-sensitive data.

### 3. Fat page/component problems

- Large pages/components mix UI, data selection, state transitions, validation, and mock actions.
- Examples include `src/app/student/applications/new/page.tsx`, `src/app/staff/applications/[id]/page.tsx`, and `src/components/admin/RoleAssignmentPanel.tsx`.

Risk: Medium. This slows development and makes privacy-sensitive changes harder to review.

### 4. Duplicate logic

- Status labels and colors appear in `src/lib/utils.ts`, student application data, provider components, and admin/staff components.
- Export/download logic appears inside admin pages rather than a shared utility.
- Form field layout and validation messaging are repeated.

Risk: Medium. Duplicate status and privacy copy can drift.

### 5. Mixed business logic and UI

- Pages often filter, aggregate, and transform mock data directly.
- Components sometimes compute workflow rules, such as shortlist readiness, document status presentation, or form validity.

Risk: Medium. This makes future backend integration more fragile.

### 6. Scattered data fetching

- Pages and components import `src/data/mock/*` directly.
- There is no repository or service boundary that could later swap mock data for API/database data.

Risk: Medium. Direct imports are fine for a prototype, but they create migration friction.

### 7. Missing validation layer

- No schema validation library or central validation helpers were detected.
- Provider forms use inline `useMemo` error construction.
- Student/staff forms use local component state and ad hoc validation.

Risk: Medium now, high before real writes.

### 8. Missing/incomplete service layer

- No `src/services` directory detected.
- Domain ideas such as matching, scholarship criteria, masking, audit, dashboard stats, and export are not centralized.

Risk: Medium. This is the main renovation opportunity.

### 9. Missing/weak access control

- Role guard exists only at component shell level.
- There is no permission map for fine-grained actions such as export, identity reveal, disclosure approval, role assignment, or shortlist request.

Risk: High for production-like use.

### 10. PDPA/privacy risks

- Admin export can export user emails and application student IDs from mock data.
- Staff student profile page says data is masked but displays student ID and email.
- Staff application detail shows `app.student_id` in the title and route context.
- Provider Phase 4 candidate pool is token-only, but this privacy boundary is currently a convention, not enforced by lint/test policy.

Risk: High for production, medium for prototype. These are exactly the areas that need policy and masking rules before real data.

### 11. Data masking gaps

- Masking exists in specific UI components, but there is no central `PrivacyMaskingService` or shared masking utility.
- Some pages show raw fields directly from mock data.

Risk: High for sensitive data screens.

### 12. Audit/logging gaps

- Audit logs exist as mock data and visual warnings.
- Sensitive actions state that they are logged, but there is no central audit writer.
- Export and reveal actions do not create a real audit event.

Risk: High before production.

### 13. Naming inconsistencies

- Status names vary across domains: `OPEN`, `ACTIVE`, `PENDING_REVIEW`, `pending_staff_approval`, `UNDER_REVIEW`, etc.
- Provider data has its own `ProviderScholarshipStatus` separate from general `ScholarshipStatus`.
- Some route params use `[id]`, others `[scholarshipId]` or `[applicationId]`.

Risk: Low to medium.

### 14. UI/component inconsistency

- Foundation visual system is much improved, but table, form, modal, and alert patterns still vary across roles.
- Some components still use hardcoded colors or status strings.

Risk: Medium.

### 15. Table/form inconsistency

- Tables are hand-built per page.
- Forms do not share a field wrapper, error message component, or validation contract.

Risk: Medium.

### 16. Testing gaps

- No tests detected.
- No `npm test` script.
- No route smoke test script.
- No privacy boundary test for Provider-to-Student imports.
- No masking tests.

Risk: High as app complexity grows.

### 17. Documentation gaps

- Phase docs are strong, but there is no central architecture map, route inventory, role/permission matrix, or personal data exposure map.

Risk: Medium.

### 18. Build/lint/typecheck issues

- `npm run build` passes.
- `npm run lint` prompts to configure ESLint and exits without running lint.
- No standalone `typecheck` script.
- No `test` script.
- `npm install` completed but reported 8 vulnerabilities: 1 moderate, 6 high, 1 critical.

Risk: Medium. Build is healthy, but lint/test gates are not ready.

## 6. Risk Level

| Issue | Risk level | Why |
|---|---|---|
| Client-only mock auth | High | Not a real security boundary for protected data |
| Missing middleware/policy layer | High | Role and permission rules are not enforced centrally |
| PDPA export and raw identity exposure | High | Admin/staff pages can show or export identifiable data |
| No audit service | High | Sensitive actions are not guaranteed to be logged |
| No masking service | High | Privacy controls are component-specific and hard to verify |
| No tests | High | Regression risk grows with each phase |
| Direct mock imports in pages | Medium | Future API/database migration will be more expensive |
| Inline validation | Medium | Validation rules can drift and are hard to reuse |
| Fat pages/components | Medium | Maintainers must inspect too much UI code to understand business behavior |
| Duplicate statuses/labels | Medium | Inconsistent state language across roles |
| Inconsistent table/form patterns | Medium | UX and implementation drift |
| Missing architecture docs | Medium | New work has to infer structure from code |
| Route param inconsistency | Low | Mostly readability unless route contracts change |
| Current build state | Low | Build passes |

## 7. What Should Not Be Changed Yet

Do not change these without approval:

- Authentication behavior.
- `localStorage` role selection behavior.
- Route structure or route URLs.
- Database schema or API contracts.
- Production-like environment config.
- Existing user-facing flows.
- Large UI redesigns or visual rebrands.
- Mock data shape that existing pages depend on.
- Admin/staff sensitive workflows.
- Provider candidate privacy logic.
- Any real identity disclosure behavior.

## 8. Quick Wins

Safe first improvements:

- Add a route map document.
- Add a component inventory document.
- Add a role/permission map.
- Add a personal data exposure map.
- Document current request/data flow.
- Centralize role and status labels gradually.
- Add a shared privacy masking utility for display-only masking.
- Add a shared export utility with audit hook placeholders.
- Add a shared table pattern for admin/staff/provider lists.
- Add a shared form field wrapper and error message pattern.
- Add route smoke test documentation or a small script after approval.
- Add ESLint config and a Provider-to-Student no-restricted-imports rule after approval.
- Update README with current scripts, architecture, and safety notes.

## 9. Major Refactors Requiring Approval

These should be planned and approved before implementation:

- Moving data selection and business logic from pages into service functions.
- Creating `src/services` and `src/repositories` boundaries.
- Changing auth to server-backed sessions.
- Adding `middleware.ts` route protection.
- Adding policy/permission helpers.
- Adding a real audit log layer.
- Adding a real privacy masking layer.
- Changing forms to schema validation.
- Changing route structure.
- Changing mock data contracts used by multiple pages.
- Introducing backend/API/database integration.
- Adding new test framework or CI workflow.

