# S2IMS Next Renovation Steps

## Purpose

This document recommends the next architecture renovation sequence after Phase 1 documentation maps. It does not authorize implementation. It exists to make the next decision safer.

## Recommended Phase 2 Sequence

### 1. Centralize read-only config first

Safest targets:

- Role labels and route groups.
- Status labels and colors.
- Sensitive action names.
- Privacy warning copy keys.
- Candidate token format constants.
- Table action labels where repeated.

Why first:

- Low behavior risk.
- Reduces duplication.
- Makes policy and tests easier later.

### 2. Add privacy boundary documentation checks

Before code refactors, add or propose:

- Provider-to-Student import boundary rule.
- Provider candidate DTO field allowlist.
- Staff identity reveal reason requirement checklist.
- Admin export field allowlist draft.

### 3. Extract pure selector services

Start with read-only services that wrap existing mock data:

- `providerCandidateService`
- `providerScholarshipService`
- `studentApplicationService`
- `matchingService`
- `adminAuditService`

No API/backend changes yet.

### 4. Add shared display primitives gradually

Safe UI primitives:

- `FormField`
- `StatusConfig` or `getStatusBadgeProps`
- `DataTableShell`
- `ReasonRequiredField`
- `PrivacyNotice` variants
- `DataFreshnessIndicator`

Move only one route at a time.

## What Can Be Safely Centralized First

Good Phase 2 candidates:

- `src/config/roles.ts`
- `src/config/statuses.ts`
- `src/config/privacy.ts`
- `src/config/sensitive-actions.ts`
- `src/config/candidate-tokens.ts`
- `src/config/export-fields.ts` as a draft allowlist

Keep behavior unchanged:

- Existing labels should match current UI.
- Existing colors should match current UI.
- Existing route URLs should not change.
- Existing mock data should not be reshaped unless required and approved.

## What Should Not Be Touched Yet

Do not touch yet:

- Auth behavior.
- `localStorage` role behavior.
- Route structure.
- Database or API design.
- Real file upload/storage.
- Staff disclosure approval behavior.
- Provider identity disclosure.
- Admin export behavior beyond documentation.
- Large component moves.
- Global design rework.
- Backend integration.

## Suggested Config Files To Create Later

| File | Purpose |
|---|---|
| `src/config/roles.ts` | Role IDs, labels, route groups, home routes |
| `src/config/statuses.ts` | Application, scholarship, announcement, shortlist status maps |
| `src/config/privacy.ts` | Masking categories, allowed display levels, provider field allowlists |
| `src/config/navigation.ts` | Future home for navigation config if moved from `src/lib/navigation.ts` |
| `src/config/sensitive-actions.ts` | Action names that require reason/audit |
| `src/config/export-fields.ts` | Export field allowlists by role and export type |

## Suggested Service Layer Boundaries

| Service | Boundary |
|---|---|
| `authAccessService` | Route/action permission helpers, no UI |
| `privacyService` | Masking, tokenization, banding, field allowlists |
| `auditService` | Audit event creation contract and mock writer |
| `studentProfileService` | Student profile selectors and future update boundary |
| `studentApplicationService` | Student application selectors and future mutations |
| `scholarshipService` | Public and role-specific scholarship lookup/filtering |
| `matchingService` | Match score and explanation selectors by role |
| `providerService` | Provider dashboard and portfolio selectors |
| `providerCandidateService` | Token-only candidate pool DTOs |
| `staffReviewService` | Staff review queues and document verification selectors |
| `adminAuditService` | Audit log selectors and filters |
| `exportService` | CSV/JSON formatting, field allowlist, audit requirement |

## Suggested Masking And Audit Utilities

Future utilities:

- `maskEmail(email)`
- `maskStudentId(studentId)`
- `toStudentToken(studentId)`
- `toCandidateToken(sequence)`
- `toAcademicBand(value)`
- `toNeedBand(value)`
- `requireReason(action, reason)`
- `createAuditEvent(action, actor, entity, reason)`
- `assertExportAllowed(role, exportType)`
- `filterExportFields(exportType, row)`

These should begin as pure functions with tests before being wired into behavior.

## Risks Before Production

High risks:

- Client-only auth is not a real security boundary.
- Sensitive staff/admin pages can expose raw student identifiers.
- Admin export can include PII-like fields.
- Sensitive actions do not write real audit events.
- Provider candidate privacy is convention-based, not enforced by lint/test yet.
- No automated tests exist.
- Lint is not configured.

Medium risks:

- Mock data imports are scattered.
- Inline validation rules can drift.
- Status labels/colors are duplicated.
- Role-specific components overlap with potential shared primitives.

## Relationship To PROJELEARNT Lessons

PROJELEARNT principle:

`Route -> Middleware -> Controller -> FormRequest -> Service -> Model -> Database -> View -> Audit Log`

S2IMS adaptation:

`Route/Page -> Middleware/Auth -> Validation -> Service -> Data Access/API -> Component/View -> Audit Log if sensitive`

Direct lesson application:

- Laravel `FormRequest` maps to schema/validation helpers.
- Laravel `Service` maps to pure domain services in `src/services`.
- Laravel `Policy` maps to role/action permission helpers and future middleware.
- Laravel `config/pdpa.php` maps to `src/config/privacy.ts`, roles, statuses, and sensitive action configs.
- Laravel audit services map to an S2IMS `auditService`.
- Laravel masking services map to an S2IMS `privacyService`.

## Recommended Next Approval

Recommended next phase:

Phase 2A: Create read-only config files for roles, statuses, privacy categories, and sensitive action names.

Why:

- Lowest code risk.
- Helps future permission, masking, and service extraction.
- Does not require route or auth changes.
- Keeps current UI behavior stable.

Do not implement Phase 2A until approved.

## Phase 2D Result (Token Formatting Policy & Lightweight Checks)

Completed in this branch:

- Added token formatting policy document: `docs/architecture/TOKEN_FORMATTING_POLICY_PHASE_2D.md`.
- Added lightweight token output checks: `scripts/check-token-formats.mjs`.
- Added npm script: `npm run check:tokens`.

Phase 2D intent was guardrails only:

- No route changes.
- No auth/role-guard changes.
- No status label/color changes.
- No disclosure/export behavior changes.

## Recommended Next Phase After 2D

Recommended: Option A

Phase 2E — Sensitive action reason rule inventory + policy doc only.

Why Option A is safest now:

- It is documentation and policy-first, with no UI behavior changes.
- It reduces compliance/audit ambiguity before any additional formatter/config migration.
- It clarifies which actions must require explicit reason capture before broader refactors.
- It helps avoid accidental regression in disclosure/export or admin audit workflows.

