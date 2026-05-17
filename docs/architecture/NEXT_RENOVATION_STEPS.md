# S²IMS Next Renovation Steps

## Purpose

This document recommends the next architecture renovation sequence after Phase 1 documentation maps. It does not authorize implementation. It exists to make the next decision safer.

## Current MC9 Planning Status

**MC9 — Candidate Review Audit Event Plan** is a documentation-only planning session completed on branch `architecture/s2ims-candidate-review-audit-event-plan-mc9`.

Completed documents:

- `docs/architecture/S2IMS_CANDIDATE_REVIEW_AUDIT_EVENT_PLAN_MC9.md` — Master plan: event names, metadata contract, QA checklist
- `docs/architecture/S2IMS_CANDIDATE_REVIEW_AUDIT_METADATA_CONTRACT_MC9.md` — Metadata contract with examples
- `docs/architecture/S2IMS_CANDIDATE_REVIEW_AUDIT_WRITE_SAFETY_CHECKLIST_MC9.md` — Safety checklist for future implementation branch

MC9 constraints:

- Documentation-only. No runtime code, audit writes, or persistence activation.
- Source baseline: MC8 local state runtime (`candidateReviewState.ts`, `CandidateSelectionReviewShell.tsx`).
- Build 40/40, tokens 4/4, audit checks 216/216, route smoke 5×200 OK, dev log clean.
- AP-10B gate unchanged: 0/7 owners, 0/7 approvals, 9/9 blockers.
- AP-10C blocked. AP-11 blocked.

Recommended next step after MC9 merge:

- A separate runtime branch for audit-write implementation. Do not introduce audit writes on this planning branch.
- Operate from MC8 source baseline; use MC9 plan docs as the authoritative event name and metadata specification before writing any audit-write code.

---

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

| File | Purpose |
|---|---|
| `src/config/roles.ts` | Role IDs, labels, route groups, home routes |
| `src/config/statuses.ts` | Application, scholarship, announcement, shortlist status maps |
| `src/config/privacy.ts` | Masking categories, allowed display levels, provider field allowlists |
| `src/config/navigation.ts` | Future home for navigation config if moved from `src/lib/navigation.ts` |
| `src/config/sensitive-actions.ts` | Action names that require reason/audit |
| `src/config/export-fields.ts` | Export field allowlists by role and export type |

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

## Historical Renovation Phase Summary

### Phase 2D — Token Formatting Policy

Completed: Added `docs/architecture/TOKEN_FORMATTING_POLICY_PHASE_2D.md`, `scripts/check-token-formats.mjs`, `npm run check:tokens` script.

### Phase 2E — Sensitive Action Reason Inventory

Completed: Added `docs/architecture/SENSITIVE_ACTION_REASON_INVENTORY_PHASE_2E.md`, `docs/architecture/SENSITIVE_ACTION_POLICY_PHASE_2E.md`, `docs/architecture/REASON_REQUIRED_MODAL_PROPOSAL_PHASE_2E.md`.

### Phase 2F — Status Config Migration Plan

Completed: Added `docs/architecture/STATUS_USAGE_INVENTORY_PHASE_2F.md`, `docs/architecture/STATUS_MIGRATION_PLAN_PHASE_2F.md`. Found 15 status inconsistencies, 2 parallel status systems, and tone/role label variations across 8 domains.

### AP-3 — Mock Audit Writer Contract

Completed: Added mock audit writer plan, UI copy rules, admin display plan, and first wiring decision documents. No runtime code changed.

### AP-4 — Pure Mock Audit Writer

Completed: Added `src/lib/audit/mockAuditWriter.ts`, expanded `check-audit-events.mjs` to 37 checks. In-memory only, no UI wiring.

### AP-5 — Admin Mock Audit Display Plan

Completed: Added admin mock audit display, copy rules, privacy rules, and runtime sequence documents. Batch display badge/detail drawer plan.

### AP-6A — Admin Mock Audit Badge/Filter Runtime

Completed: Added mock/demo badge to Admin audit log table, persistence mode filter, header copy update, CSV export changes. All Admin display changes confined to `src/app/admin/audit-log/page.tsx`.

### AP-6B — Admin Audit Event Detail Drawer Runtime

Completed: Added read-only mock-safe event detail drawer component. Forbidden metadata keys filtering, source badges, mock-safe copy sections.

### AP-6C — Admin Writer Mock Event Display

Completed: Added adapter that merges fixture mock + writer mock rows for Admin display. 9 rows visible. Source badge per row. Filter and empty-state for real persisted preserved.

### Admin Audit UX Polish

Completed: Must-have polish items M1–M5 (banner simplification, source badge color indigo, Thai translations for source labels, drawer icon dedup, drawer bottom note removal).

### AP-6D — Staff Document Mock Audit Wiring

Completed: Staff `onReject` and `onRequestReplacement` wired to `sharedMockAuditWriter.write()` in try/catch. Admin adapter reads shared writer. AP-6D QA passed with known limitations.

### AP-7 — Audit Persistence Strategy Plan

Completed: 7-stage migration sequence defined (Stage 0 mock-only → Stage 7 real persistence + reason validation). Repository abstraction, writer interface, Laravel/PHP mapping, and QA checklist defined.

### AP-8 — Audit Repository/Service Contract

Completed: TypeScript interface contracts for AuditService, AuditWriter, AuditRepository, AuditPolicyGuard, AuditDisplayPresenter, AuditCopyStageResolver, AuditEventFactory.

### AP-8A — Audit Service/Repository Runtime Skeleton

Completed: Skeleton TypeScript modules created. InMemoryAuditRepository, AuditPolicy, AuditDisplayPresenter, AuditCopyStage, AuditService with factory helper. Check script updated to 49 checks.

### AP-9A through AP-9D — Prototype Persistence and Shadow Write

Completed: Prototype persistence intentionally disabled by default. Shadow write runtime proven with guard evaluations. Feature flag `prototypeEnabled === false` in default config. AP-9D QA passed.

### AP-10B — Production Persistence Evidence Pack

Completed (docs-only): Evidence pack, sign-off template, approval tracker, and daily report. Door is open for owner identification only. No approvals collected, no schema/migration/runtime work performed.

### MC8 — Candidate Review Local State Runtime

Completed and merged to main: Local-only React state for candidate review. No persistence, no API, no audit writes. MC8 Post-Merge QA passed.

### MC9 — Candidate Review Audit Event Plan (this document)

Completed: Master plan, metadata contract, and safety checklist created for future audit-write design. Docs-only branch; no runtime changes.
