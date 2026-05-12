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

## Phase 2E Result (Sensitive Action Reason Inventory & Policy)

Completed in this branch:

- Added sensitive action inventory:
	- `docs/architecture/SENSITIVE_ACTION_REASON_INVENTORY_PHASE_2E.md`
- Added sensitive action policy:
	- `docs/architecture/SENSITIVE_ACTION_POLICY_PHASE_2E.md`
- Added ReasonRequiredModal proposal:
	- `docs/architecture/REASON_REQUIRED_MODAL_PROPOSAL_PHASE_2E.md`

Phase 2E constraints honored:

- Documentation/inventory only.
- No route/auth/role/nav/status/disclosure/export behavior changes.
- No wiring of `src/config/sensitiveActions.ts` into existing modals yet.

## Phase 2F Result (Status Config Migration Plan)

Completed in this branch:

- Added status usage inventory:
	- `docs/architecture/STATUS_USAGE_INVENTORY_PHASE_2F.md`
- Added status migration plan:
	- `docs/architecture/STATUS_MIGRATION_PLAN_PHASE_2F.md`

Phase 2F constraints honored:

- Documentation and inventory only.
- No runtime status logic changed.
- No components wired to `src/config/statuses.ts`.
- No route/auth/role/nav/disclosure/export behavior changes.

Key findings:

- 15 significant status inconsistencies found across 8 active domains.
- Two parallel application status systems exist with incompatible key conventions (`UNDER_REVIEW` vs `in_review`).
- Document `rejected` label and tone differ by role (intentional privacy distinction — must be preserved).
- Audit/risk `critical` level is absent from all three admin components — governance gap.
- `staffData.ts` uses `current` for freshness; every other source uses `fresh`.
- Announcement statuses are entirely absent from `statuses.ts`.

## Phase 2G-2J Result (Low-Risk Runtime Status Migrations)

Completed in this branch:

- Phase 2G — Data freshness status handling:
	- `docs/architecture/DATA_FRESHNESS_MIGRATION_PHASE_2G.md`
- Phase 2H — Shortlist request status display:
	- `docs/architecture/SHORTLIST_STATUS_MIGRATION_PHASE_2H.md`
- Phase 2I — Provider scholarship status display:
	- `docs/architecture/PROVIDER_SCHOLARSHIP_STATUS_MIGRATION_PHASE_2I.md`
- Phase 2J — Provider candidate pool status display:
	- `docs/architecture/CANDIDATE_POOL_STATUS_MIGRATION_PHASE_2J.md`

Runtime status domains now partially or fully using `src/config/statusHelpers.ts`:

- `dataFreshness`
- `shortlistRequest`
- `scholarship` for provider-facing scholarship status display
- `candidatePool`

Phase 2G-2J constraints honored:

- No route/auth/role/nav changes.
- No disclosure/export behavior changes.
- No backend/API/database changes.
- No public scholarship, application, document, disclosure, or audit/security risk migration.

## Phase 2K Result (Status Migration Review & Stabilization Summary)

Completed in this branch:

- Added status migration review:
	- `docs/architecture/STATUS_MIGRATION_REVIEW_PHASE_2K.md`
- Added status helper pattern guide:
	- `docs/architecture/STATUS_HELPER_PATTERN_PHASE_2K.md`

Phase 2K constraints honored:

- Documentation/review only.
- No runtime status migration.
- No component refactor.
- No route/auth/role/nav/disclosure/export behavior changes.

## Recommended Next Phase After 2K

Recommended: Option C

Phase 2L — Pause renovation branch and prepare PR/merge review.

Why Option C is safest now:

- The branch contains several incremental runtime migrations and should be reviewed before more
  status domains are wired.
- Remaining domains carry higher privacy, governance, or behavior risk.
- The helper pattern is established but still adapter-heavy and has no unit tests yet.
- A PR/merge review can validate the low-risk approach before applying it to documents,
  applications, disclosure, audit/security, admin export, or OCR/job states.

If migration must continue, use a plan-only phase for document statuses rather than immediate
runtime wiring.

## Phase 2L Result (Renovation Branch Review Package)

Completed in this branch:

- Added renovation branch review package:
	- `docs/architecture/RENOVATION_BRANCH_REVIEW_PHASE_2L.md`
- Added merge checklist:
	- `docs/architecture/RENOVATION_MERGE_CHECKLIST_PHASE_2L.md`

Phase 2L constraints honored:

- Documentation/review only.
- No runtime code changes.
- No additional status migration.
- No route/auth/role/nav/disclosure/export behavior changes.
- No merge into `main`.

## Recommended Next Step After 2L

Recommended: Option A

Open PR / merge review for `audit/architecture-renovation-plan` into `main`.

Alternative: Option B

Continue with a docs-only plan for document statuses if merge review must wait.

Why Option A is recommended:

- The branch now has a complete review package and merge checklist.
- Runtime migration should pause until reviewers approve the helper/config pattern.
- Merging the reviewed foundation reduces long-lived branch drift before any higher-risk domain
  work continues.

---

## Document Status Planning — Branch Result (renovation/document-status-planning)

Completed and merged into main. See merge checkpoint:
`docs/daily-reports/2026-05-08-document-status-merge.md`

Included in merge:
- `docs/architecture/DOCUMENT_STATUS_MIGRATION_PLAN.md`
- `docs/architecture/DOCUMENT_STATUS_STUDENT_ADAPTER_PHASE_1.md`
- `docs/architecture/DOCUMENT_STATUS_STUDENT_UPLOAD_CARD_PHASE_2.md`
- `docs/architecture/DOCUMENT_STATUS_BRANCH_REVIEW.md`
- `docs/architecture/DOCUMENT_STATUS_MERGE_CHECKLIST.md`
- `docs/qa/document-status-student-adapter/` (5 screenshots)
- `src/config/documentStatusDisplay.ts` (student-facing adapter)
- `src/components/student/RequiredDocumentsList.tsx` (migrated)
- `src/components/student/DocumentUploadCard.tsx` (migrated)

Constraints honored:
- `DocumentVerificationPanel` untouched
- Routes, auth, backend, upload behavior, validation behavior unchanged
- `pending` and `verification_pending` remain separate
- `invalid_file_type` remains a UI validation/display state only
- Student-facing `rejected` maps to "Needs replacement"

---

## Staff Document Status Policy + DRY Audit (renovation/staff-document-status-policy)

**Started:** 2026-05-11

Completed in this branch:

- Staff document status policy planning:
  `docs/architecture/STAFF_DOCUMENT_STATUS_POLICY_PLAN.md`
- System-wide DRY audit:
  `docs/architecture/DRY_SYSTEM_AUDIT.md`
- Phased DRY refactor roadmap:
  `docs/architecture/DRY_REFACTOR_ROADMAP.md`
- Do Not DRY Yet list:
  `docs/architecture/DO_NOT_DRY_YET.md`

Key DRY findings:
- 6+ components with inline `getStatusLabel()` / `getStatusIcon()` / `getStatusColor()` functions
- 5 modals with identical shell structure and no shared wrapper
- 3 different reason field minimum lengths (none/10/20) — governance gap
- `RoleBadge.tsx` hardcodes role colors instead of using CSS vars
- 20+ dynamic route pages write their own `.find()` / `.filter()` queries with no data layer
- `AuditWarningCard` and `AdminAuditWarningCard` are separate but structurally identical
- Amber hex `#FFFBEB / #FDE68A / #78350F` used in 10+ locations

Do Not DRY highlights:
- Student vs staff `rejected` wording must remain separate (finalized product decision)
- `pending` vs `verification_pending` must stay separate until backend schema is agreed
- Application statuses must not be adapted until key inconsistency and wording are resolved
- Disclosure approval vs rejection flows must stay separate (independent governance paths)
- ESQ aggregate and admin raw views must never share data access logic (privacy boundary)

Constraints honored:
- Documentation and planning only
- No runtime behavior changes
- `DocumentVerificationPanel` untouched
- No routes, auth, role guards, backend, export, upload, or validation changes

---

## Recommended Next Phase After Staff Policy + DRY Audit

**Recommended: Option D — Open PR for this documentation branch**

Rationale:

- The branch now contains a complete staff document status policy, a full DRY audit,
  a phased refactor roadmap, and a clear "do not DRY yet" list.
- These four documents represent the planning foundation needed before any further
  runtime extraction or refactoring can proceed safely.
- Merging now reduces branch drift and gives reviewers a chance to validate the
  policy decisions (especially staff label ratification and role-specific wording rules)
  before DRY-2A (staff display adapter extraction) begins.
- No implementation has been done — this is a pure documentation branch with low
  review risk.

Alternative: Option A — Begin DRY-2A (staff document display adapter extraction)

- Only if staff label decisions in `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md` are approved
  without changes.
- Risk: if label decisions change after adapter is extracted, the config will need
  to be updated before any component is wired.
- Safest approach: approve policy plan first, then extract.

Alternative: Option B — Begin DRY-1 (consume existing configs — role labels, CSS vars)

- DRY-1 does not depend on staff document label decisions.
- Could start in parallel if PR review is delayed.
- Low risk; no behavioral changes.

Alternative: Option C — Begin `ReasonRequiredModal` planning (shared governance primitive)

- Depends on `REASON_REQUIRED_MODAL_PROPOSAL_PHASE_2E.md` decisions being approved.
- Higher value if document rejection and replacement flows will use the modal.
- Should wait until staff document policy is approved.

---

## Staff Document Evidence Workbench Planning Result

**Started:** 2026-05-11

Completed in this branch:

- Staff document evidence workbench plan:
  `docs/design/STAFF_DOCUMENT_EVIDENCE_WORKBENCH_PLAN.md`
- Staff document workbench component plan:
  `docs/design/STAFF_DOCUMENT_WORKBENCH_COMPONENT_PLAN.md`
- Staff document workbench behavior contract:
  `docs/design/STAFF_DOCUMENT_WORKBENCH_BEHAVIOR_CONTRACT.md`
- Staff document workbench QA plan:
  `docs/design/STAFF_DOCUMENT_WORKBENCH_QA_PLAN.md`
- Staff document workbench implementation sequence:
  `docs/design/STAFF_DOCUMENT_WORKBENCH_IMPLEMENTATION_SEQUENCE.md`

Planning conclusion:

- This branch is planning only.
- No runtime UI was changed.
- No staff document verification behavior was changed.
- The recommended next runtime branch after merge is:
  `design/staff-document-evidence-workbench-runtime`

Recommended first runtime phase:

- Phase SW-1 — layout-only workbench shell around the existing `DocumentVerificationPanel`.

Why:

- Staff workflows carry higher audit and operational risk than the completed Student refresh.
- The current staff application detail page has correct pieces but separates evidence, actions, notes,
  timeline, audit context, and masked student context into generic card columns.
- A layout-only shell can test the workbench model without changing callbacks, status keys, reason
  validation, audit behavior, or mock data.

Runtime warning:

- Staff workflow runtime changes require screenshot QA and reason/audit review.
- Required QA should include desktop, mobile 375px, Thai locale, console review, and states for verified,
  rejected, and needs replacement documents.
- Do not extract action rails, add minimum reason lengths, or migrate staff status adapters until the
  layout-only workbench model has been reviewed.

## Audit Persistence Contract Planning Result

**Started:** 2026-05-12

Planning branch:

- `architecture/audit-persistence-contract-plan`

Completed in this branch:

- Audit persistence contract plan:
  `docs/architecture/AUDIT_PERSISTENCE_CONTRACT_PLAN.md`
- Audit event type matrix:
  `docs/architecture/AUDIT_EVENT_TYPE_MATRIX.md`
- Audit copy stage guide:
  `docs/architecture/AUDIT_COPY_STAGE_GUIDE.md`
- Audit metadata privacy rules:
  `docs/architecture/AUDIT_METADATA_PRIVACY_RULES.md`

Planning conclusion:

- This branch is planning only.
- Real audit persistence was not implemented.
- Audit service/API/database code was not added.
- Reason validation was not changed.
- `ReasonRequiredModal` was not introduced.
- Runtime UI and workflow behavior were not changed.

Recommended next phase:

- AP-2 — mock audit event builder and tests, after this contract is reviewed.

Why AP-2 should come before runtime wiring:

- It proves the event shape, metadata allowlists, and copy-stage assumptions without touching live workflows.
- It keeps Staff document warnings prototype-safe until persistence behavior is explicitly defined.
- It avoids jumping directly to `ReasonRequiredModal` or reason min-length enforcement before the audit persistence model is clear.

## Historical Recommended Phase 2G (Superseded)

This section is preserved as historical planning context. Phase 2G has already been completed
and followed by Phases 2H, 2I, 2J, and 2K. The current recommendation is Phase 2L above.

Recommended: Stage 1 of the Status Config Migration Plan — Data Freshness domain only.

Why data freshness is safest first:

- Only 3 status keys: `fresh`, `stale`, `failed`.
- Only one naming fix required before wiring: `staffData.ts` `current` → `fresh` (mock data only).
- Affects at most 2 indicator components (`ProviderDataFreshnessIndicator`, student `DataFreshnessIndicator`).
- Not connected to governance flows, reason-required modals, disclosure, or export behavior.
- No audit implications.
- Blast radius: 2–3 files maximum.
- No label or tone mismatches to resolve (config and active components already agree).

Phase 2G should remain small:

- Implement `getStatusConfig`, `getStatusLabel`, `getStatusTone`, `badgeToneToClass` as pure functions.
- Wire only the data freshness domain.
- Confirm build passes and visual output is unchanged.
- Do not expand scope to application or document statuses in the same phase.
- One domain per phase until migration pattern is proven stable.
