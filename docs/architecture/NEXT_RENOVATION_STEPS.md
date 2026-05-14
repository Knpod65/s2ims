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

## AP-3 Planning Result - Mock Audit Writer Contract

Completed in this branch:

- Added mock audit writer plan:
  - `docs/architecture/MOCK_AUDIT_WRITER_PLAN_PHASE_AP3.md`
- Added mock audit writer UI copy rules:
  - `docs/architecture/MOCK_AUDIT_WRITER_UI_COPY_RULES.md`
- Added mock audit writer admin display plan:
  - `docs/architecture/MOCK_AUDIT_WRITER_ADMIN_DISPLAY_PLAN.md`
- Added mock audit writer first wiring decision:
  - `docs/architecture/MOCK_AUDIT_WRITER_FIRST_WIRING_DECISION.md`

AP-3 constraints honored:

- planning and documentation only
- no runtime code changed
- no mock writer implemented
- no UI wiring added
- no real audit persistence added
- no reason validation changes
- no `ReasonRequiredModal` introduced

Recommended next phase:

- AP-5 — Admin mock audit display planning, or a review checkpoint before UI wiring.
- Keep `src/data/mock/audit-logs.ts` untouched
- Delay UI wiring until mock labels and admin display rules are finalized.

---

## AP-5 Planning Result — Admin Mock Audit Display

Completed in this branch:

- Admin mock audit display plan:
  - `docs/architecture/ADMIN_MOCK_AUDIT_DISPLAY_PLAN_PHASE_AP5.md`
- Admin audit mock copy rules:
  - `docs/architecture/ADMIN_AUDIT_MOCK_COPY_RULES.md`
- Admin audit display privacy rules:
  - `docs/architecture/ADMIN_AUDIT_DISPLAY_PRIVACY_RULES.md`
- Admin mock audit runtime sequence:
  - `docs/architecture/ADMIN_MOCK_AUDIT_RUNTIME_SEQUENCE.md`

AP-5 constraints honored:

- Planning and documentation only.
- No runtime code changed.
- No admin UI modified.
- No mock writer wiring.
- No real persistence added.
- No mock audit fixture mutated.

Key planning outputs:

- Persistence mode badge rules defined for `prototype_only`, `mock_only`, `real_persisted`.
- Admin audit table future columns and filters planned.
- Event detail drawer copy defined.
- Export rules for mock events documented.
- Metadata display privacy rules extended from AP-2.
- Runtime sequence recommends AP-6A (mock badge on existing page) before writer wiring.

Recommended next phase:

- AP-6A — Admin mock badge/filter on existing mock audit log only.
- Do not wire Staff document actions until Admin display is reviewed.

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

## AP-2 Result — Mock Audit Event Builder and Tests

**Started:** 2026-05-12

Completed in this branch:

- Pure audit event builder types:
  `src/lib/audit/auditTypes.ts`
- Metadata privacy validation rules:
  `src/lib/audit/auditMetadataRules.ts`
- Pure builder helpers:
  `src/lib/audit/auditEventBuilder.ts`
- Public audit utility exports:
  `src/lib/audit/index.ts`
- Lightweight check script:
  `scripts/check-audit-events.mjs`
- AP-2 summary:
  `docs/architecture/MOCK_AUDIT_EVENT_BUILDER_PHASE_AP2.md`

AP-2 constraints honored:

- No UI wiring.
- No real audit persistence.
- No mock audit log mutation.
- No component or app page changes.
- No reason validation behavior changes.
- No `ReasonRequiredModal`.

Recommended next phase:

- AP-3 planning for a clearly labeled mock audit writer, or a review checkpoint before runtime wiring.

Do not connect the builder to Staff document actions until the AP-2 contract and checks are reviewed.

---

## AP-4 Result — Pure Mock Audit Writer and Checks

Completed in this branch:

- Pure in-memory mock audit writer:
  - `src/lib/audit/mockAuditWriter.ts`
- Public audit utility exports:
  - `src/lib/audit/index.ts`
- Check script expanded to 37 checks:
  - `scripts/check-audit-events.mjs`
- AP-4 summary:
  - `docs/architecture/MOCK_AUDIT_WRITER_PHASE_AP4.md`

AP-4 constraints honored:

- In-memory only, no persistence
- No UI wiring
- No real persistence added
- No mutation of `src/data/mock/audit-logs.ts`
- No audit builder contract changes
- No backend/API behavior
- No Staff/Student/Provider/Admin/ESQ workflow changes
- No reason validation changes
- No `ReasonRequiredModal` introduced

Writer behavior:

- Creates isolated instances with `createMockAuditWriter(options?)`
- Accepts only `mock_only` persistence mode events
- Returns copies to prevent external mutation
- Supports filtering, clear, seed, snapshot, and count
- Rejects duplicate IDs by default (configurable)
- Preserves insertion order

Check results:

- Original 15 AP-2 checks: passed
- Writer checks: passed
- Total checks: 37/37 passed

Recommended next phase:

- AP-5 — Admin mock audit display planning, or a review checkpoint before UI wiring.
- Keep `src/data/mock/audit-logs.ts` untouched
- Delay UI wiring until mock labels and admin display rules are finalized.

## Audit Shadow Write Runtime QA AP-9D

AP-9D QA checkpoint completed on `architecture/audit-shadow-write-runtime-ap9d`.

Reviewed:
- shadow write metrics, guards, and service
- Staff reject/replacement wiring
- sharedMockWriter source-of-truth boundary
- adminAuditDisplayAdapter active read/display path
- disabled-by-default prototype persistence boundary

Confirmed:
- sharedMockWriter remains the source of truth
- adminAuditDisplayAdapter remains the active Admin read path
- prototype persistence remains disabled by default
- audit/notification checks pass 107/107
- route smoke passed for `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, and `/staff/applications/app_002`
- dev log clean
- runtime code unchanged in QA

Recommended next:
- push/open PR if not pushed
- AP-9E read comparison only after AP-9D merge and approval
- AP-10 only after prototype evidence and compliance review
- do not start real persistence yet

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

## AP-6A Result — Admin Mock Audit Badge/Filter Runtime

Completed on 2026-05-12:

- Added mock/demo badge display to Admin audit log table (6th "Status" column)
- Added persistence mode filter dropdown with 3 options:
  - All (shows 6 mock records)
  - Mock/demo only (shows 6 mock records)
  - Official persisted records (shows empty state)
- Updated page header subtitle from Stage 0 ("Immutable record") to Stage 1 mock copy ("Demo audit events")
- Changed warning banner from red danger styling to purple mock warning styling
- Updated warning copy to clarify records are demo/mock for prototype review
- Updated CSV export with warning header and status column
- Changed export filename to include "-demo" suffix

Implementation details:

- File modified: `src/app/admin/audit-log/page.tsx` only
- New dependency: `StatusBadge` component already available
- All current fixture records treated as `mock_only` for display
- Filter logic handles future persistence mode field (forward compatible)
- No AP-4 writer wiring
- No real persistence connected
- No fixture mutation
- No Staff/Provider/Student component changes
- No backend/API behavior changes

Validation:

- ✅ Build passed: 40 routes, 0 type errors
- ✅ Token checks: 4/4 passed
- ✅ Audit event checks: 37/37 passed
- ✅ Route verification: /admin/audit-log returns 200 OK
- ✅ No hydration errors or warnings

Key non-goals preserved:

- AP-4 mock writer remains in library, not wired
- Real audit persistence not added
- Reason validation unchanged
- ReasonRequiredModal not introduced
- Staff action audit wiring deferred
- Fixture data unchanged
- No export bypass or new behavior

Recommended next phase:

- AP-6B — Admin event detail drawer (plan and runtime)
- Or: Review checkpoint before continuing AP-6C writer wiring


## AP-6B Plan — Admin Audit Event Detail Drawer

Completed in this branch:

- Admin audit event detail drawer plan:
  `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_PLAN_PHASE_AP6B.md`
- Admin audit event detail drawer copy rules:
  `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_COPY_RULES.md`
- Admin audit event detail drawer privacy model:
  `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_PRIVACY_MODEL.md`
- Admin audit event detail drawer runtime sequence:
  `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_RUNTIME_SEQUENCE.md`

AP-6B constraints honored:

- Planning and documentation only.
- No runtime code changed.
- No admin UI modified.
- No mock writer wiring.
- No real persistence added.
- No mock audit fixture mutated.
- No Staff/Student/Provider/Admin/ESQ workflow changes.
- No reason validation changes.
- No ReasonRequiredModal introduced.

Recommended next phase:

- AP-6B runtime — Admin audit event detail drawer implementation (read-only, mock-only).
- Alternative: AP-6C — Connect AP-4 mock writer to Admin display in mock-only mode.
- Do not wire Staff document actions yet.

## AP-6B Runtime Result — Admin Audit Event Detail Drawer

Completed on 2026-05-13:

- Admin audit log now has a read-only mock-safe event detail drawer.
- "View details" button added to each row in the audit log table.
- Clicking opens a fixed right-side drawer showing:
  - Event Identity (ID, timestamp, action, policy version fallback)
  - Actor (role badge, name, mock ID)
  - Target / Entity (entity type, entity ID, privacy note)
  - Action / Reason (action string, "Reason not provided" placeholder)
  - Persistence / Evidence (`mock_only` badge + full mock-safe copy)
  - Metadata (before/after fields filtered through FORBIDDEN_AUDIT_METADATA_KEYS)
  - Session Context (IP from fixture, labeled as mock)
  - Bottom evidence note (demo-only restatement)

Implementation details:

- New component: `src/components/admin/AdminAuditEventDetailDrawer.tsx`
- Modified: `src/app/admin/audit-log/page.tsx` (state + button + conditional render)
- `FORBIDDEN_AUDIT_METADATA_KEYS` applied to all before/after metadata display
- All records displayed as `mock_only`

Safety confirmations:

- No AP-4 mock writer wired into display
- No Staff document actions wired into audit writer
- No real audit persistence added
- `src/data/mock/audit-logs.ts` not mutated
- No reason validation changed
- No ReasonRequiredModal introduced
- Existing AP-6A persistence filter and mock badge retained

Validation:

- ✅ Build passed: 40 routes, 0 type errors
- ✅ Token checks: 4/4 passed
- ✅ Audit event checks: 37/37 passed

Recommended next phase:

- AP-6C — Wire AP-4 mock audit writer into Staff document reject and replacement request callbacks (mock_only persistence mode only).
- Do not start AP-6C without explicit approval.
- Do not claim real persistence in any copy before AP-6C is reviewed.

## AP-6C Runtime Result — Admin Mock Writer Display

Completed on 2026-05-13:

- Admin audit log can now display both fixture mock records and mock writer demo events.
- Added `src/lib/audit/adminAuditDisplayAdapter.ts`:
  - Defines `AdminAuditDisplayRow` unified type for both sources.
  - Builds 3 static demo writer events at module load (verify, reject, role assign).
  - `getAdminAuditDisplayRows()` combines fixture + writer rows sorted by timestamp.
- Updated `src/app/admin/audit-log/page.tsx`:
  - Uses adapter to show 9 total rows (6 fixture + 3 writer demo).
  - Source badge per row: "Fixture mock" (slate) / "Writer mock" (violet).
  - Count in banner: "Fixture mock: N, Writer mock: N".
  - AP-6A persistence filter and official persisted empty state preserved.
- Updated `src/components/admin/AdminAuditEventDetailDrawer.tsx`:
  - Accepts `AdminAuditDisplayRow` instead of `AuditLog`.
  - Shows source badge in header ("Fixture mock" / "Writer mock").
  - Shows richer fields for writer events (severity, eventType, reason, policyVersion, targetDisplayToken).
  - Source-aware copy in mock/demo banner and persistence section.

Writer connection boundary:

- `buildAuditEvent` used in adapter for static demo events only.
- No `createMockAuditWriter` instance created at display time.
- No Staff/Provider/Student actions wired.
- No runtime user action triggers any write.

Safety confirmations:

- `src/data/mock/audit-logs.ts` not mutated.
- No Staff actions wired to mock writer.
- No real persistence added.
- No reason validation changed.
- No ReasonRequiredModal introduced.

Validation:

- ✅ Build passed: 40 routes, 0 type errors
- ✅ Token checks: 4/4 passed
- ✅ Audit event checks: 37/37 passed
- ✅ /admin/audit-log: 200 OK, log clean

Recommended next phase:

- AP-6D — Wire Staff document reject and replacement request callbacks to mock audit writer (mock_only only).
- Do not start AP-6D without explicit approval.
- Do not wire Provider/Student/ESQ actions.
- Do not add real persistence.

## Admin Audit UX QA/Polish Plan after AP-6C

Completed on 2026-05-13:

- Admin audit UX QA/polish plan:
  `docs/design/ADMIN_AUDIT_UX_QA_POLISH_PLAN.md`
- Admin audit copy simplification guide:
  `docs/design/ADMIN_AUDIT_COPY_SIMPLIFICATION_GUIDE.md`
- Admin audit visual hierarchy plan:
  `docs/design/ADMIN_AUDIT_VISUAL_HIERARCHY_PLAN.md`
- Admin audit QA checklist (AP-6C):
  `docs/design/ADMIN_AUDIT_QA_CHECKLIST_AP6C.md`

Planning conclusion:

- Docs-only branch. No runtime UI modified.
- No Staff action wiring performed.
- No reason validation changed.
- No real persistence added.
- No mock fixture mutated.

Key findings:

- Double badge in Status column (primary "Mock event" + secondary "Fixture mock"/"Writer mock") creates visual noise. Source sub-badge should be de-emphasized or removed from table.
- "Writer mock" violet badge conflicts with ESQ role color (`text-violet-700`) in the same table. Change to indigo recommended (M4 in polish plan).
- "Writer mock" / "Fixture mock" source labels have no Thai translations — both locales output English strings. Thai copy needed (M5 in polish plan).
- Technical counts "(Fixture mock: 6, Writer mock: 3)" in banner are developer-facing, not admin-facing. Should be simplified or removed (M3).
- Drawer bottom note is a third restatement of mock nature — redundant with banner and Persistence/Evidence section. Recommend removal (R6).
- Two drawer sections use the same `Activity` icon — recommend using `MessageSquare` for Action/Reason section (R5).
- No Thai translations exist for source badge labels ("Fixture mock" / "Writer mock") — this is a known gap.

Must-have polish items (M1–M5) are identified and documented. See `ADMIN_AUDIT_UX_QA_POLISH_PLAN.md`.

AP-6D status: **blocked until Admin audit UX review is complete.**

Staff action wiring remains blocked:

- AP-6D must not start until the Admin audit log UX has been reviewed and approved by a human reviewer.
- Product sign-off is required on which Staff callbacks (`onReject`, `onRequestReplacement`) should call `mockAuditWriter.write(...)`.
- Mock-safe copy for Staff-triggered entries must be confirmed before any Staff component changes.

Recommended next phase:

1. Human reviewer completes the QA checklist in `docs/design/ADMIN_AUDIT_QA_CHECKLIST_AP6C.md`.
2. Implement must-have polish items M1–M5 (or explicitly defer with rationale) in a `design/admin-audit-ux-polish-runtime` branch.
3. After polish review and approval, begin AP-6D planning (document scope, copy, and test plan).
4. Only after AP-6D plan is approved: implement AP-6D runtime (Staff action wiring to mock writer, mock_only only).

Do not start AP-6D without explicit approval.

## Admin Audit UX Polish Runtime Result

Completed on 2026-05-13:

- Must-have polish items M1–M5 implemented in `design/admin-audit-ux-polish-runtime`.
- Runtime summary: `docs/architecture/ADMIN_AUDIT_UX_POLISH_RUNTIME_SUMMARY.md`

Changes made:

| Item | Change |
|------|--------|
| M1 | Banner copy simplified — developer-facing fixture/writer counts replaced with admin-facing total count |
| M2 | Source badge retained as secondary indicator with updated labels and color (see M4/M5) |
| M3 | `totalCount = ALL_DISPLAY_ROWS.length` (= 9) shown in banner instead of fixture/writer breakdown |
| M4 | Writer mock source badge color changed from violet (`text-violet-700`) to indigo (`text-indigo-700`) — ESQ role color collision resolved |
| M5 | Thai translations added for source labels: "เดโม (สร้างขึ้น)" / "เดโม (ฟิกซ์เจอร์)" |
| R3 | "(mock data)" annotation removed from Actor ID drawer label |
| R5 | Action/Reason section icon changed from `Activity` to `MessageSquare` — duplicate icon resolved |
| R6 | Drawer bottom note (third restatement of mock nature) removed |
| R7 | Policy Version row hidden for fixture events when `policyVersion` is not present |
| Details col | Empty `<th>` for "View details" column now reads "Details" / "รายละเอียด" |

Files modified:

- `src/app/admin/audit-log/page.tsx`
- `src/components/admin/AdminAuditEventDetailDrawer.tsx`

Constraints honored:

- `src/data/mock/audit-logs.ts` not mutated
- Staff/Provider/Student/ESQ components unchanged
- No Staff action wiring performed
- No real persistence added
- No reason validation changed
- No ReasonRequiredModal introduced
- No routes, auth, or role guards changed
- AP-6D not started

Validation:

- ✅ Build passed: 40 routes, 0 type errors
- ✅ Token checks: 4/4 passed
- ✅ Audit event checks: 37/37 passed
- ✅ /admin/audit-log, /admin/dashboard, /login: 200 OK, log clean

AP-6D status: **still blocked — QA browser review required before AP-6D planning begins.**

Recommended next phase:

1. Human reviewer opens `/admin/audit-log` in a browser and confirms:
   - Indigo source badge does not collide with any role color in the table.
   - "Demo (generated)" / "Demo (fixture)" label distinction is clear.
   - Simplified banner copy reads naturally to an Admin audience.
   - Drawer without bottom note still conveys mock/demo evidence limitation.
   - Thai locale source labels render correctly.
2. After QA review passes: begin AP-6D **planning only** (document scope, copy, and test plan — no implementation).
3. Only after AP-6D plan is approved: implement AP-6D runtime (Staff action wiring to mock writer, `mock_only` only).

Do not start AP-6D planning or runtime without explicit approval.

## Staff Document Mock Audit Wiring Plan AP-6D

Completed on 2026-05-13:

Planning branch: `architecture/staff-document-mock-audit-wiring-plan`

Planning documents added:

- `docs/architecture/STAFF_DOCUMENT_MOCK_AUDIT_WIRING_PLAN_AP6D.md`
- `docs/architecture/STAFF_DOCUMENT_AUDIT_EVENT_MAPPING_AP6D.md`
- `docs/architecture/STAFF_DOCUMENT_MOCK_WRITER_RUNTIME_SEQUENCE_AP6D.md`
- `docs/architecture/STAFF_DOCUMENT_AUDIT_QA_CHECKLIST_AP6D.md`

Planning conclusion:

- Planning and documentation only.
- No runtime code changed.
- No Staff actions wired.
- No real persistence added.
- No mock audit fixture mutated.
- No reason validation changed.
- No ReasonRequiredModal introduced.
- No Admin audit runtime changed.
- AP-6D runtime not started.

Key decisions documented:

- In-scope actions: `staff.document.reject` and `staff.document.request_replacement` only.
- Out-of-scope in AP-6D: `staff.document.verify` (deferred), real persistence, reason min-length, ReasonRequiredModal.
- Builder helpers `buildStaffDocumentRejectEvent` and `buildStaffDocumentReplacementRequestEvent` are ready in `auditEventBuilder.ts` — no builder changes needed.
- Shared writer singleton pattern documented: `src/lib/audit/sharedMockWriter.ts` (new file in runtime).
- `adminAuditDisplayAdapter.ts` must be updated in runtime to merge `sharedMockWriter.list()` with `DEMO_WRITER_EVENTS`.
- All events use `persistenceMode: 'mock_only'` — writer only accepts this mode.
- Privacy boundary: `studentToken` (`Student #S-XXXX`) used in metadata — never raw `student_id`.
- `AuditWarningCard` copy must remain Stage 0 prototype-safe — must not change to Stage 2 copy.
- Writer failure must be wrapped in try/catch — must not break Staff UI.
- Reason min-length not changed in AP-6D — still non-empty-only, deferred to SW-3B/SD-3.

Staff actions remain unwired until AP-6D runtime is explicitly approved.

Recommended next branch:

**`architecture/staff-document-mock-audit-wiring-runtime`**

Do not start AP-6D runtime until explicit approval is given.
Do not wire Staff actions until AP-6D runtime is approved.
Do not add real persistence.
Do not introduce ReasonRequiredModal.
Do not change reason validation.

## AP-6D Runtime Result — Staff Document Mock Audit Wiring

Completed on 2026-05-13:

Runtime branch: `architecture/staff-document-mock-audit-wiring-runtime`

Runtime summary: `docs/architecture/STAFF_DOCUMENT_MOCK_AUDIT_WIRING_AP6D_RUNTIME_SUMMARY.md`

Files changed:

| File | Change |
|------|--------|
| `src/lib/audit/sharedMockWriter.ts` | New — shared singleton + 3 helper exports |
| `src/lib/audit/index.ts` | Named exports for shared writer helpers added |
| `src/lib/audit/adminAuditDisplayAdapter.ts` | Merges live `sharedMockAuditWriter.list()` into display rows |
| `src/app/staff/applications/[id]/page.tsx` | `onReject` and `onRequestReplacement` wired to shared writer |
| `scripts/check-audit-events.mjs` | 5 new AP-6D checks — total 42/42 |

What is now wired:

- Staff document rejection (`onReject`) → `buildStaffDocumentRejectEvent` → `sharedMockAuditWriter.write()`
- Staff replacement request (`onRequestReplacement`) → `buildStaffDocumentReplacementRequestEvent` → `sharedMockAuditWriter.write()`
- Admin audit log (`/admin/audit-log`) now shows Staff-triggered events as live writer rows alongside fixture and demo rows
- Writer failure is wrapped in `try/catch` — toast fires regardless; UI never broken by writer error

What remains deferred:

- `onVerify` not wired — deferred to AP-6E or later
- Real audit persistence — not added
- Reason min-length not changed — deferred to SW-3B/SD-3
- ReasonRequiredModal — not introduced
- Staff identity reveal — separate governance path

Constraints honored:

- `src/data/mock/audit-logs.ts` not mutated
- `AuditWarningCard` copy unchanged (Stage 0 prototype-safe)
- `DocumentVerificationPanel` interface unchanged — no new props
- Provider/Student/ESQ components unchanged
- Routes, auth, role guards unchanged

Validation:

- ✅ Build passed: 40/40 static routes, 0 type errors
- ✅ Token checks: 4/4 passed
- ✅ Audit event checks: 42/42 passed
- ✅ /login, /staff/applications/app_001, /staff/applications/app_002, /admin/audit-log, /admin/dashboard: 200 OK, log clean

Recommended next phase:

- SW-3B — Add 20-character minimum reason length for Staff rejection and replacement request.
- OR: AP-6E — Wire `onVerify` callback to a `staff.document.verify` mock audit event (low-risk, no reason required).
- Do not start either without explicit approval.
- Do not add real persistence.
- Do not introduce ReasonRequiredModal.

## Staff Document Mock Audit Wiring AP-6D QA Result

Completed on 2026-05-13.

QA checklist: `docs/qa/staff-document-mock-audit-wiring-ap6d/README.md`
QA summary: `docs/architecture/STAFF_DOCUMENT_MOCK_AUDIT_WIRING_AP6D_QA_SUMMARY.md`

QA verdict: **PASS** — with known limitations.

What was confirmed:

- Staff reject callback wired and auditable: `onReject` → `buildStaffDocumentRejectEvent` → `sharedMockAuditWriter.write()` in `try/catch`.
- Staff replacement request callback wired and auditable: `onRequestReplacement` → `buildStaffDocumentReplacementRequestEvent` → `sharedMockAuditWriter.write()` in `try/catch`.
- Writer failure cannot block Staff UI — toast fires regardless.
- Privacy boundary confirmed — `studentToken` used in metadata, raw `student_id` excluded.
- Admin audit display adapter reads live shared writer events.
- Official persisted filter intentionally empty — no real events exist.
- AuditWarningCard Stage 0 copy preserved unchanged.
- All checks pass: build 40/40, tokens 4/4, audit events 42/42.
- All routes 200 OK, dev log clean.

Known limitations:

- Shared writer is session-scoped — resets on page reload. Events only visible within the same browser session.
- Stage 0 AuditWarningCard copy says "real audit-log persistence is not connected yet" — technically inaccurate now that mock wiring exists. Copy update deferred to AP-7 or a dedicated copy-stage branch.
- No document status mutation in panel — static mock data.
- Actor identity is prototype placeholder (`staff_demo_session` / `Staff (Demo)`).
- No reason min-length enforcement — deferred to SW-3B/SD-3.
- No browser screenshots captured — headless QA only.

AP-7 not started.

Recommended next phase:

- Human browser QA: open `/staff/applications/app_002`, perform reject + replacement request, then open `/admin/audit-log` in the same session to confirm live events appear.
- After human QA passes: plan AP-7 persistence strategy separately.
- Do not jump directly to real persistence.
- Do not change reason validation yet.
- Do not introduce `ReasonRequiredModal` yet.

## Audit Persistence Strategy Plan AP-7

**Completed on 2026-05-13.**

Planning branch: `architecture/audit-persistence-strategy-plan`

Planning documents added:

- `docs/architecture/AUDIT_PERSISTENCE_STRATEGY_PLAN_AP7.md`
- `docs/architecture/AUDIT_PERSISTENCE_LARAVEL_ARCHITECTURE_MAP.md`
- `docs/architecture/AUDIT_REPOSITORY_AND_SERVICE_BOUNDARY_AP7.md`
- `docs/architecture/AUDIT_PERSISTENCE_MIGRATION_SEQUENCE_AP7.md`
- `docs/architecture/AUDIT_PERSISTENCE_QA_CHECKLIST_AP7.md`

Planning conclusion:

- Planning and documentation only.
- No runtime code changed.
- No real audit persistence implemented.
- No reason validation changed.
- No ReasonRequiredModal introduced.
- No Staff/Provider/Student/ESQ flows changed.
- No backend, API, DB schema, or route changes.
- `src/data/mock/audit-logs.ts` not mutated.
- `AuditWarningCard` copy remains Stage 0 — unchanged.

Key planning outputs:

- Current mock-only state inventoried (AP-6D baseline).
- 7-stage migration sequence defined: Stage 0 (mock-only) → Stage 1 (contract+tests) → Stage 2 (repository abstraction) → Stage 3 (DB schema planning) → Stage 4 (shadow write-through) → Stage 5 (real display) → Stage 6 (copy upgrade) → Stage 7 (reason validation + modal).
- Each stage has explicit rollback plan and gate criteria.
- `AuditWriterInterface` contract planned (not implemented) — covers both mock and future persistent writers.
- `AuditRepository` abstraction planned (not implemented) — decouples service from storage.
- `PersistentAuditWriter` planned (not implemented) — async, API-backed, Stage 4+.
- Laravel/PHP conceptual mapping completed — every TypeScript module mapped to its Laravel equivalent.
- Proposed TypeScript folder restructure documented (current flat → future layered).
- 13-section QA checklist created (sections A–M) — items tagged `[current]` vs `[stage N]`.
- Privacy/PII boundary confirmed — `[current]` items in sections B and J block all stages.
- High/medium/low risk analysis completed.
- DRY boundary rules documented — anti-patterns for AP-8+ identified.

What must NOT change until AP-8 is approved:

- `AuditEvent` type shape
- `auditEventBuilder.ts`
- `mockAuditWriter.ts`
- `sharedMockWriter.ts`
- `AuditWarningCard` copy (Stage 0)
- `src/data/mock/audit-logs.ts`
- Reason validation min-length
- `ReasonRequiredModal`
- Staff verify action wiring (deferred to AP-6E)
- Provider/Student/ESQ flows

Recommended next phase:

- AP-8A — Repository/Service Contract: define `AuditWriterInterface`, `AuditRepository` abstraction, add contract tests; do NOT implement persistent writer.
- AP-8B — Schema and API Design: plan `audit_events` DB table, POST `/api/audit-events`, Admin read API; do NOT create migration or API route.
- Do not start AP-8A or AP-8B without explicit approval.
- Do not add real persistence in AP-8A.
- Do not change reason validation before AP-8B is confirmed.


## AP-8 Audit Repository/Service Contract Plan

AP-8 completed in this branch:

- Audit Repository/Service Contract Plan:
  `docs/architecture/AUDIT_REPOSITORY_SERVICE_CONTRACT_PLAN_AP8.md`
- Audit Service Interface Spec:
  `docs/architecture/AUDIT_SERVICE_INTERFACE_SPEC_AP8.md`
- Audit Repository Contract:
  `docs/architecture/AUDIT_REPOSITORY_CONTRACT_AP8.md`
- Audit Policy and Privacy Contract:
  `docs/architecture/AUDIT_POLICY_AND_PRIVACY_CONTRACT_AP8.md`
- Audit Display Presenter Contract:
  `docs/architecture/AUDIT_DISPLAY_PRESENTER_CONTRACT_AP8.md`
- Audit Notification Navigation Note:
  `docs/architecture/AUDIT_NOTIFICATION_NAVIGATION_NOTE_AP8.md`
- Audit Service QA Checklist:
  `docs/architecture/AUDIT_SERVICE_QA_CHECKLIST_AP8.md`

AP-8 constraints honored:

- Planning and documentation only.
- No runtime code changed.
- No admin UI modified.
- No mock writer wiring changed.
- No real persistence added.
- No mock audit fixture mutated.
- No Staff/Student/Provider/Admin/ESQ workflow changes.
- No reason validation changes.
- No ReasonRequiredModal introduced.
- Notification click issue documented but not fixed.

Key planning outputs:

- Concrete TypeScript interface contracts for AuditService, AuditWriter, AuditRepository, AuditPolicyGuard, AuditDisplayPresenter, AuditCopyStageResolver, AuditEventFactory.
- Concrete DTO shapes for AuditEventInput, AuditActionContext, AuditActorContext, AuditTargetContext, AuditMetadataInput, AuditWriteResult, AuditDisplayRow.
- Laravel/PHP equivalent interfaces and folder structure mapping.
- Repository filter and pagination contract.
- Policy/privacy layer contract with role-based visibility matrix.
- Display presenter contract for Admin table, drawer, and CSV export.
- Notification navigation issue documented as UX-N1 future work.

Recommended next phase:

**AP-8A — Audit Service/Repository Runtime Skeleton**

Suggested branch:

`architecture/audit-service-repository-skeleton`

AP-8A should:

- Create TypeScript interface files in planned folder structure.
- Implement `InMemoryAuditRepository` as concrete class.
- Create minimal `AuditService` that delegates to writer/repository.
- Keep existing `sharedMockWriter` unchanged (feature-flagged or config-driven).
- Not wire into existing UI yet (docs-only planning becomes runtime skeleton).

Alternative:

**AP-8B — Audit Database Schema Plan**

Suggested branch:

`architecture/audit-database-schema-plan`

AP-8B should:

- Plan database schema (table name, columns, indexes, foreign keys).
- Define migration file template.
- Define seed data for testing.
- Remain docs-only until AP-8A validates interfaces.

Do not jump directly to real persistence (AP-9).
Do not change reason validation yet.
Do not introduce ReasonRequiredModal yet.
Do not start notification runtime fix yet.

## Audit Service/Repository Runtime Skeleton AP-8A

**Completed on 2026-05-13.**

Branch: `architecture/audit-service-repository-runtime-skeleton`

Created TypeScript contract/DTO/repository/service/policy/presenter/copy skeletons:

- `src/lib/audit/contracts/auditContracts.ts` — 8 interfaces
- `src/lib/audit/dto/auditDto.ts` — typed DTOs for all layers
- `src/lib/audit/repositories/inMemoryAuditRepository.ts` — skeleton repository
- `src/lib/audit/policies/auditPolicy.ts` — role-based visibility and masking
- `src/lib/audit/presenters/auditDisplayPresenter.ts` — display row conversion
- `src/lib/audit/copy/auditCopyStage.ts` — copy stage resolution
- `src/lib/audit/services/auditService.ts` — orchestration layer with factory helper
- `docs/architecture/AUDIT_SERVICE_REPOSITORY_RUNTIME_SKELETON_AP8A_SUMMARY.md`

Updated:
- `src/lib/audit/index.ts` — exports new modules without breaking existing imports
- `scripts/check-audit-events.mjs` — 7 new skeleton checks, total now 49/49

Constraints honored:
- No behavior change — existing AP-6D mock writer remains live path
- No real persistence, no backend/API, no migrations
- No mutation of mock fixtures
- No reason validation changes
- No ReasonRequiredModal
- No Staff/Provider/Student/Admin workflow changes
- No notification click changes

Recommended next:

- **AP-8A-QA** — Human review of skeleton contracts, then wire a single workflow through the new service
- **AP-8C** — Refactor Admin display adapter to use presenter
- **AP-8B** — Database schema plan informed by repository filter contract

Do not start real persistence yet.
Do not start AP-8B.
Do not start AP-8C.
Do not start AP-9.
Do not start UX-N1.

## Audit Service/Repository Runtime Skeleton QA AP-8A-QA

**Completed on 2026-05-13.**

QA reviewed the merged AP-8A runtime skeleton:

- `src/lib/audit/contracts/auditContracts.ts`
- `src/lib/audit/dto/auditDto.ts`
- `src/lib/audit/repositories/inMemoryAuditRepository.ts`
- `src/lib/audit/services/auditService.ts`
- `src/lib/audit/policies/auditPolicy.ts`
- `src/lib/audit/presenters/auditDisplayPresenter.ts`
- `src/lib/audit/copy/auditCopyStage.ts`

QA artifacts:

- `docs/qa/audit-service-repository-runtime-skeleton-ap8a/README.md`
- `docs/architecture/AUDIT_SERVICE_REPOSITORY_RUNTIME_SKELETON_AP8A_QA_SUMMARY.md`
- `docs/daily-reports/2026-05-13-audit-service-repository-runtime-skeleton-qa-ap8a.md`

Result:

- AP-8A skeleton boundaries reviewed.
- Contract, DTO, repository, service, policy, presenter, and copy-stage layers are separated cleanly.
- Laravel/PHP-inspired mapping confirmed.
- Build passed 40/40.
- Token check passed 4/4.
- Audit event check passed 52/52.
- Routes verified: `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002`.
- Current runtime still uses `sharedMockWriter` and `adminAuditDisplayAdapter`.
- No real persistence added.
- No backend/API added.
- No database migrations added.
- No mock fixture mutation.
- No Staff callback rewiring.
- No Staff verify wiring.
- No notification click behavior change.

Recommended next options:

- **AP-8C** — Refactor Admin display to use the presenter.
- **AP-8B** — Database schema plan.
- **UX-N1** — Notification navigation contract plan.

Recommendation:

- Choose AP-8C first if the goal is DRY runtime usage.
- Choose AP-8B first if the goal is persistence readiness.
- Choose UX-N1 first if user-facing notification clickability is the priority.

Do not start AP-8B, AP-8C, UX-N1, or AP-9 without explicit approval.

## Notification Navigation Contract Plan UX-N1

**Completed on 2026-05-14.**

Branch: `architecture/notification-navigation-contract-plan`

UX-N1 documented the visible notification click issue and planned a safe future navigation contract.

Documents added:

- `docs/architecture/NOTIFICATION_NAVIGATION_CONTRACT_PLAN_UXN1.md`
- `docs/architecture/NOTIFICATION_ROUTE_AND_PERMISSION_MODEL_UXN1.md`
- `docs/architecture/NOTIFICATION_PRIVACY_AND_PAYLOAD_CONTRACT_UXN1.md`
- `docs/architecture/NOTIFICATION_UI_ACCESSIBILITY_QA_UXN1.md`
- `docs/architecture/NOTIFICATION_LARAVEL_PHP_ARCHITECTURE_MAP_UXN1.md`

Result:

- Visible notification click issue documented.
- Navigation payload contract planned.
- Route and permission model planned.
- Privacy payload rules planned.
- UI/accessibility QA checklist planned.
- Laravel/PHP architecture mapping added.
- Runtime unchanged.
- No notification click implementation yet.
- No route behavior changed.
- No backend/API added.
- No database migrations added.
- No audit behavior changed.

Recommended next options:

- **UX-N1A** — Runtime skeleton for notification navigation service and safe route registry checks.
- **AP-8C** — Refactor Admin display to use the audit presenter.
- **AP-8B** — Audit database schema plan.

Important guardrails:

- Do not implement click behavior until the route, permission, and privacy model is reviewed.
- Do not expose raw PII in notification payloads or URLs.
- Do not bypass role policies during notification route resolution.

## Notification Navigation Runtime Skeleton UX-N1A

**Completed on 2026-05-14.**

Branch: `architecture/notification-navigation-runtime-skeleton`

UX-N1A added a minimal runtime skeleton for safe notification navigation.

Created:

- `src/lib/notifications/contracts/notificationNavigationContracts.ts`
- `src/lib/notifications/dto/notificationNavigationDto.ts`
- `src/lib/notifications/routes/notificationRouteRegistry.ts`
- `src/lib/notifications/policies/notificationNavigationPolicy.ts`
- `src/lib/notifications/services/notificationNavigationService.ts`
- `src/lib/notifications/presenters/notificationNavigationPresenter.ts`
- `src/lib/notifications/copy/notificationNavigationCopy.ts`
- `src/lib/notifications/index.ts`
- `docs/architecture/NOTIFICATION_NAVIGATION_RUNTIME_SKELETON_UXN1A_SUMMARY.md`

Updated:

- `scripts/check-audit-events.mjs` — added UX-N1A notification navigation checks.
- `docs/architecture/NEXT_RENOVATION_STEPS.md`

Result:

- TypeScript notification navigation contracts, DTOs, route registry, service, policy, presenter, and copy skeletons created.
- Laravel/PHP boundary reflected in code.
- DRY route-resolution boundary represented.
- Notification click behavior unchanged.
- Topbar notification bell behavior unchanged.
- Student notification page behavior unchanged.
- Route behavior unchanged.
- No PII route exposure added.
- No backend/API added.
- No database migrations added.
- No real persistence added.
- Checks updated.

Recommended next options:

- **UX-N1A-QA** — Review skeleton boundaries, route registry, policy, and checks.
- **UX-N1B** — Topbar notification safe click wiring after UX-N1A QA passes.
- **UX-N1C** — Student notification card route normalization after safe payload decisions.

Do not implement notification click behavior until UX-N1A QA passes.

## Notification Navigation Runtime Skeleton QA UX-N1A

**Completed on 2026-05-13.**

QA checkpoint reviewed the merged UX-N1A skeleton on `main`.

QA artifacts:

- `docs/qa/notification-navigation-runtime-skeleton-uxn1a/README.md`
- `docs/architecture/NOTIFICATION_NAVIGATION_RUNTIME_SKELETON_UXN1A_QA_SUMMARY.md`
- `docs/daily-reports/2026-05-13-notification-navigation-runtime-skeleton-qa-uxn1a.md`

Result:

- UX-N1A skeleton reviewed.
- No runtime behavior changed in QA.
- No click behavior implemented.
- Route registry, policy, service, presenter, and copy boundaries reviewed.
- Privacy safety reviewed.
- Existing Topbar notification behavior unchanged.
- Existing Student notification page behavior unchanged.
- Build passed 40/40.
- Token check passed 4/4.
- Audit/notification checks passed 62/62.
- Local routes verified: `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002`.

Recommended next options:

- **UX-N1B** — Topbar notification safe click wiring plan/runtime.
- **AP-8C** — Audit display presenter refactor.
- **AP-8B** — Audit database schema plan.

Important guardrails:

- Do not start real persistence yet.
- Do not expose PII in notification routes.
- Do not bypass role policies during notification route resolution.

## Notification Topbar Safe Click Wiring UX-N1B

**Runtime slice completed on 2026-05-14.**

UX-N1B wires the existing Topbar notification bell through the UX-N1A notification navigation boundary.

Files updated:

- `src/components/layout/Topbar.tsx`
- `src/lib/notifications/dto/notificationNavigationDto.ts`
- `src/lib/notifications/routes/notificationRouteRegistry.ts`
- `src/lib/notifications/services/notificationNavigationService.ts`
- `scripts/check-audit-events.mjs`
- `docs/architecture/NOTIFICATION_TOPBAR_SAFE_CLICK_WIRING_UXN1B_SUMMARY.md`

Result:

- Student Topbar notification click resolves to `/student/notifications`.
- Topbar does not build raw notification routes directly.
- Route resolution goes through named route registry.
- Role permission checks go through notification policy.
- UI-ready clickable/disabled state goes through presenter.
- Thai/English blocked navigation copy remains centralized.
- Non-student Topbar notifications remain disabled/informational until role-specific destinations are approved.
- No dropdown notification list was added.
- No mock fixtures were mutated.
- No backend/API behavior was added.
- No real persistence was added.
- No PII route exposure was added.
- No audit behavior changed.

Recommended next options:

- **UX-N1B-QA** — Review Topbar click behavior, role blocking, mobile/accessibility, and dev logs.
- **UX-N1C** — Normalize Student notification card route handling through the same service boundary.
- **AP-8C** — Refactor Admin audit display to presenter.
- **AP-8B** — Audit database schema plan.

Important guardrails:

- Do not start real persistence yet.
- Do not expose PII in notification routes or payloads.
- Do not bypass role policies during notification navigation.
- Do not wire additional notification surfaces until UX-N1B-QA passes.

## Notification Topbar Safe Click Wiring QA UX-N1B-QA

**Completed on 2026-05-14.**

UX-N1B QA checkpoint verified the merged Topbar notification click wiring through code review and route smoke testing.

QA artifacts:

- `docs/qa/notification-topbar-safe-click-wiring-uxn1b/README.md`
- `docs/architecture/NOTIFICATION_TOPBAR_SAFE_CLICK_WIRING_UXN1B_QA_SUMMARY.md`
- `docs/daily-reports/2026-05-13-notification-topbar-safe-click-wiring-qa-uxn1b.md`

Validation:

- Build passed 40/40, 0 type errors
- Token check passed 4/4
- Audit/notification checks passed 71/71
- Route smoke: `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002` — all 200 OK
- Dev log: clean, no errors
- Topbar click wiring reviewed: safe resolution through service/policy/registry/presenter chain
- No PII in route params, no raw route construction, role mismatch blocked
- Existing routes and audit behavior confirmed unchanged

Recommended next:

- **UX-N1C** — Notification dropdown polish, accessibility review, Student notification card normalization
- **AP-8C** — Refactor Admin audit display to presenter
- **AP-8B** — Audit database schema plan

Do not start UX-N1C.
Do not start AP-8B.
Do not start AP-8C.
Do not start AP-9.
Do not start real persistence.

## Notification Dropdown Polish & Accessibility Review Plan UX-N1C

**Completed on 2026-05-14.**

UX-N1C is a documentation-only planning phase for polishing the notification dropdown/list UX after UX-N1B Topbar safe click wiring.

Branch:

`design/notification-dropdown-accessibility-polish-plan`

Documents added:

- `docs/design/NOTIFICATION_DROPDOWN_POLISH_PLAN_UXN1C.md` — Dropdown behavior model, card anatomy, interaction model
- `docs/design/NOTIFICATION_ACCESSIBILITY_REVIEW_UXN1C.md` — Keyboard, screen reader, focus, touch target, color contrast specs
- `docs/design/NOTIFICATION_CARD_AND_EMPTY_STATE_GUIDE_UXN1C.md` — Card variants, empty/blocked/error state copy
- `docs/design/NOTIFICATION_READ_UNREAD_STATE_PLAN_UXN1C.md` — Read/unread state plan (local-only, no persistence)
- `docs/design/NOTIFICATION_MOBILE_INTERACTION_PLAN_UXN1C.md` — Bottom sheet interaction patterns for mobile
- `docs/design/NOTIFICATION_QA_CHECKLIST_UXN1C.md` — QA checklist for future implementation phases

Updated:

- `docs/architecture/NEXT_RENOVATION_STEPS.md`

Planning conclusion:

- This phase is documentation only.
- No runtime code changed.
- No notification click behavior changed.
- No route behavior changed.
- No PII exposed in routes or payloads.
- No audit behavior changed.
- No real persistence added.
- No backend/API added.
- No database migrations added.
- No mock fixture mutated.
- No ReasonRequiredModal introduced.
- No Staff verify action wired.
- Existing UX-N1A/UX-N1B notification navigation contracts preserved as the foundation.

Key design outputs:

- Dropdown panel anchored to Topbar bell with desktop dropdown + mobile bottom sheet.
- Notification card anatomy with severity, title, body, timestamp, action label, read/unread indicator, and optional navigation arrow.
- Empty state (EN/TH), error state (EN/TH), and blocked state with 7 reason-specific copy strings (EN/TH).
- Keyboard navigation: arrow keys between cards, Enter/Space to activate, Escape to close, Tab/Shift+Tab cycling, Home/End to jump.
- Screen reader: `role="dialog"`, `aria-modal="true"`, `aria-live="polite"` for state changes, per-card state announcements.
- Touch targets: minimum 44x44px (Apple HIG) / 48x48dp (Material).
- Read/unread state: local-only toggle, no persistence, "mark all as read" in footer.
- Privacy boundary: no raw PII in payloads, all URLs resolved through route registry.

Recommended next options:

- **UX-N1C Runtime** — Implement the dropdown panel, accessibility features, mobile bottom sheet, and card components as a runtime branch.
- **AP-8C** — Refactor Admin audit display to use the presenter layer.
- **AP-8B** — Audit database schema plan.

Do not start UX-N1C runtime without explicit approval.
Do not start AP-8B without explicit approval.
Do not start AP-8C without explicit approval.
Do not start AP-9.
Do not start real persistence.

## Audit Display Presenter Refactor AP-8C

**Completed on 2026-05-14.**

Refactored Admin Audit Log display flow to use the AP-8A `AuditDisplayPresenter` as the single formatting boundary.

Branch:

`architecture/audit-display-presenter-refactor-ap8c`

Result:

- `AuditDisplayPresenter.present()` now produces complete `AuditDisplayRow` with all display fields: formatted time, role labels, action labels, source type, drawer detail fields.
- `adminAuditDisplayAdapter.ts` simplified — composes raw AuditEvents, delegates formatting to presenter.
- `AdminAuditEventDetailDrawer.tsx` and `page.tsx` consume presenter output directly; no inline formatting.

Files modified:

- `src/lib/audit/contracts/auditContracts.ts` — extended `AuditDisplayRow`, added `AdminAuditDisplayRow`, moved `CsvAuditRow` forward.
- `src/lib/audit/auditTypes.ts` — added `before`/`after`/`ip` fields to `AuditEvent` for legacy fixture carry-forward.
- `src/lib/audit/presenters/auditDisplayPresenter.ts` — enhanced to produce fully-populated display rows.
- `src/lib/audit/adminAuditDisplayAdapter.ts` — simplified adapter using presenter.
- `src/app/admin/audit-log/page.tsx` — uses presenter-formatted fields.
- `src/components/admin/AdminAuditEventDetailDrawer.tsx` — uses presenter-populated fields.

Constraints honored:

- No runtime behavior changed — visual output identical.
- No real persistence, no backend/API, no migrations.
- `src/data/mock/audit-logs.ts` not mutated.
- `sharedMockWriter` preserved.
- No notification, route, auth, or audit behavior changes.
- No PII exposure.
- No Staff verify, ReasonRequiredModal, or Staff document behavior changes.

Validation:

- Build passed 40/40, 0 type errors
- Token check passed 4/4
- Audit event checks passed 71/71
- All 5 routes 200 OK, dev log clean

Recommended next:

- **AP-8B** — Audit database schema plan
- **UX-N1C Runtime** — Notification dropdown implementation
- **AP-6D Runtime** — Staff document mock audit wiring (unblocked)

Do not start AP-8B without explicit approval.
Do not start AP-9.
Do not start real persistence.

## Audit Display Presenter Refactor QA AP-8C

**Completed on 2026-05-14.**

AP-8C QA checkpoint verified the merged Audit Display Presenter Refactor through automated checks, route smoke tests, and source-level review.

QA artifacts:

- `docs/qa/audit-display-presenter-refactor-ap8c/README.md`
- `docs/architecture/AUDIT_DISPLAY_PRESENTER_REFACTOR_AP8C_QA_SUMMARY.md`
- `docs/daily-reports/2026-05-13-audit-display-presenter-refactor-qa-ap8c.md`

Validation:

- Build passed 40/40, 0 type errors
- Token check passed 4/4
- Audit/notification checks passed 71/71
- All 5 routes 200 OK, dev log clean

QA findings:

- Presenter boundary confirmed working as intended
- Adapter correctly delegates display formatting to presenter
- Admin Audit Log table renders fixture + demo rows correctly
- Detail drawer displays all fields safely (fixture legacy + writer metadata)
- Source labels render correctly (Demo fixture / Demo generated)
- Persistence labels remain mock-safe
- Real persisted filter shows safe empty state
- Forbidden metadata keys filtered in drawer
- CSV export uses presenter-safe labels with warning header
- No PII exposure found
- No runtime workflow regression

Recommended next:

- **AP-8B** — Audit database schema plan (docs-only)
- **AP-9** — Real persistence planning only after AP-8B schema review

Do not start AP-8B without explicit approval.
Do not start AP-9.
Do not start real persistence.

## Audit Database Schema Plan AP-8B

**Planned on 2026-05-14.**

Branch:

`architecture/audit-database-schema-plan-ap8b`

AP-8B plans the future audit database schema as a Laravel/PHP migration equivalent. This is a docs-only phase — no runtime code, no migrations, no real persistence.

Documents created:

- `docs/architecture/AUDIT_DATABASE_SCHEMA_PLAN_AP8B.md` — Full schema plan
- `docs/daily-reports/2026-05-13-audit-database-schema-plan-ap8b.md` — Daily report

What the schema plan covers:

- 5 tables: `audit_events`, `audit_reasons`, `audit_metadata_blobs`, `audit_retention_policies`, `audit_archived_events`
- Index optimization for `AuditRepositoryFilters` patterns (actor, target, event type, persistence mode, severity, source route)
- Archive table + `audit_events_all` database view for unified querying
- Retention policy defaults: 365 days (info) through 3650 days (critical/admin role changes)
- Phased implementation: Phase 0 (no persistence) → Phase 1 (prototype) → Phase 2 (real persistence + privacy) → Phase 3 (archive/retention) → Phase 4 (optimization)
- Privacy model: IP hashed, metadata sanitized, reason text separated, role-based access matrix
- Rollback plan: all migrations additive with independent rollback steps

Constraints honored:

- No runtime code created or modified
- No database migrations executed
- No mock fixtures mutated
- No backend/API behavior added
- No PII exposure
- No real persistence started
- No AP-9 started

Recommended next:

- **AP-9** — Prototype persistence implementation (after AP-8B review approval)
- **AP-8C-QA follow-up** — Verify schema alignment with presenter contract

Do not start AP-9 without AP-8B schema plan review approval.
Do not start real persistence yet.

## Audit Database Schema Plan QA AP-8B

**Completed on 2026-05-14.**

AP-8B QA checkpoint verified the Audit Database Schema Plan through automated checks, route smoke tests, and source-level review.

QA artifacts:

- `docs/qa/audit-database-schema-plan-ap8b/README.md`
- `docs/architecture/AUDIT_DATABASE_SCHEMA_PLAN_AP8B_QA_SUMMARY.md`
- `docs/daily-reports/2026-05-13-audit-database-schema-plan-qa-ap8b.md`

Validation:

- Build passed 40/40, 0 type errors
- Token check passed 4/4
- Audit/notification checks passed 71/71
- All 5 routes 200 OK, dev log clean

QA findings:

- Schema covers all 5 tables with complete column definitions
- Index optimization matches AuditRepositoryFilters query patterns
- Privacy model confirmed: IP hashed, metadata sanitized, reason text separated, access control matrix defined
- Retention policy defaults appropriate (365–3650 days by severity)
- Rollback plan: all migrations additive with independent steps
- TypeScript contracts consistent with database schema
- No runtime code, scripts, or mock fixture changes
- No PII exposure in schema design

Recommended next:

- **AP-9** — Prototype persistence implementation (after explicit approval)
- Security/compliance review of privacy model before Phase 2

Do not start AP-9 without AP-8B schema plan review approval.
Do not start real persistence yet.
Do not create migrations yet.

## Audit Prototype Persistence Plan AP-9

**Completed on 2026-05-14.**

Branch:

`architecture/audit-prototype-persistence-plan-ap9`

AP-9 is a documentation-only planning phase that defines how the system can safely move from mock-only/in-memory audit behavior toward prototype persistence. No runtime code was created or modified.

Documents created:

- `docs/architecture/AUDIT_PROTOTYPE_PERSISTENCE_PLAN_AP9.md` — Main AP-9 plan: overview, problem statement, layered architecture, persistence modes, AP-9A scope, non-goals, risk analysis
- `docs/architecture/AUDIT_STORAGE_DRIVER_CONTRACT_AP9.md` — Storage driver abstraction: TypeScript interface, driver types, safety requirements, failure handling, rollback, config mapping
- `docs/architecture/AUDIT_PROTOTYPE_REPOSITORY_IMPLEMENTATION_PLAN_AP9.md` — Repository implementation plan: write/read flows, migration strategy, duplicate prevention, query filters, storage recommendations
- `docs/architecture/AUDIT_PERSISTENCE_PRIVACY_ENFORCEMENT_PLAN_AP9.md` — Privacy enforcement: 8 enforcement layers, forbidden/safe fields, reason text handling, metadata handling, IP handling, role matrix
- `docs/architecture/AUDIT_PERSISTENCE_ROLLOUT_AND_ROLLBACK_PLAN_AP9.md` — Rollout stages (0–7), feature flags config, rollback triggers/actions, QA gates, copy requirements
- `docs/architecture/AUDIT_PERSISTENCE_QA_CHECKLIST_AP9.md` — 15-section QA checklist (sections A–O)
- `docs/daily-reports/2026-05-13-audit-prototype-persistence-plan-ap9.md` — Daily report

AP-9 constraints honored:

- Documentation and planning only.
- No runtime code created or modified.
- No backend/API added.
- No database migrations created.
- No real persistence added.
- No prototype persistence runtime added.
- No mock fixture mutated.
- No Staff callbacks changed.
- No Staff verify action wired.
- No reason validation changed.
- No ReasonRequiredModal introduced.
- No notification behavior changed.
- No PII exposed in any route, label, payload, export, log, metadata, or display output.

Key planning outputs:

- Layered write/read architecture defined (UI → Service → Policy → Sanitizer → Repository → Storage Driver → Storage)
- Three persistence modes defined: `mock_only`, `prototype_only`, `real_persisted`
- Storage driver contract (`AuditStorageDriver`) with TypeScript interface and Laravel/PHP equivalent
- Privacy enforcement across 8 layers before data reaches storage
- Rollout plan with 7 stages from mock-only to real persistence (Stage 7 deferred)
- Rollback plan preserves existing mock-only flow at every stage
- Role-based access matrix for all 6 actor roles
- Reason text separated from metadata with independent access control
- IP handling plan: no raw IP storage, optional salted hash only
- Storage drivers are replaceable (interface-based)

Recommended next:

- **AP-9A** — Prototype Audit Persistence Runtime Skeleton (after AP-9 review approval)
- **AP-9A Privacy Review** — optional dedicated privacy review before runtime if needed
- Do not start real persistence yet.
- Do not create migrations yet.
- Do not start AP-9A without explicit approval.

## Audit Prototype Persistence Plan QA AP-9

**Completed on 2026-05-14.**

QA checkpoint reviewed the merged AP-9 documentation through automated checks, route smoke tests, and source-level review.

QA artifacts:

- `docs/qa/audit-prototype-persistence-plan-ap9/README.md` — Full QA checklist with source-level review of 11 runtime files
- `docs/architecture/AUDIT_PROTOTYPE_PERSISTENCE_PLAN_AP9_QA_SUMMARY.md` — QA summary with findings, risks, and safety confirmations
- `docs/daily-reports/2026-05-13-audit-prototype-persistence-plan-qa-ap9.md` — Daily report

Validation:

- ✅ Build passed 40/40, 0 type errors
- ✅ Token check passed 4/4
- ✅ Audit/notification checks passed 71/71
- ✅ All 5 routes 200 OK (`/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002`)
- ✅ Dev log clean (no errors, no warnings)

QA findings:

- Docs-only scope confirmed — no runtime code modified
- Storage driver boundary confirmed — replaceable interface, prototype separated from real
- Repository plan confirmed — staged migration with duplicate prevention
- Privacy enforcement confirmed — 8-layer model, all forbidden fields addressed
- Rollback plan confirmed — every stage reversible, mock-only preserved
- No PII exposure found — source review of 11 runtime files clean
- No runtime workflow regression — all routes and behaviors unchanged

Recommended next:

- **AP-9A** — Prototype Audit Persistence Runtime Skeleton (requires explicit approval, feature-flagged, `prototype_only` only)
- Do not start real persistence yet
- Do not start AP-10 yet

## Audit Prototype Persistence Runtime Skeleton AP-9A

**Completed on 2026-05-14.**

AP-9A implemented a disabled-by-default prototype persistence runtime skeleton. No existing behavior was changed.

Created:

- `src/lib/audit/storage/auditStorageDriver.ts` — Storage driver contract interface
- `src/lib/audit/storage/auditPersistenceConfig.ts` — Config model with safe defaults
- `src/lib/audit/storage/inMemoryPrototypeAuditStorageDriver.ts` — In-memory prototype driver
- `src/lib/audit/repositories/prototypeAuditRepository.ts` — Prototype repository
- `src/lib/audit/guards/auditPersistenceFeatureGuard.ts` — Feature guard functions
- `src/lib/audit/services/prototypeAuditPersistenceService.ts` — Prototype persistence service
- `docs/architecture/AUDIT_PROTOTYPE_PERSISTENCE_RUNTIME_SKELETON_AP9A_SUMMARY.md` — Summary

Modified:

- `src/lib/audit/index.ts` — Added exports for new AP-9A modules
- `scripts/check-audit-events.mjs` — Added 21 AP-9A checks (92 total)
- `docs/architecture/NEXT_RENOVATION_STEPS.md` — This section

AP-9A constraints honored:

- Prototype persistence is disabled by default.
- No real persistence (real_persisted) is available.
- No backend/API behavior added.
- No database migrations created.
- No existing runtime behavior changed.
- sharedMockWriter remains the active write path.
- All existing checks continue to pass (92/92).

Key design decisions:

- Storage driver is replaceable via interface.
- Feature flag must be explicitly enabled (prototypeEnabled: true).
- In-memory driver only — no localStorage, sessionStorage, or file writes.
- real_persisted mode is not reachable from this config.
- Prototype repository does not replace existing InMemoryAuditRepository.
- Service returns safe no-op result when disabled (no errors thrown).

Recommended next:

- **AP-9A-QA** — Formal QA checkpoint review (optional, build validation serves as primary gate)
- **AP-9B** — Feature-flagged integration plan (shadow writes, read comparison) — docs only
- Do not start real persistence yet
- Do not start AP-10 yet

## Audit Prototype Persistence Runtime Skeleton QA AP-9A

**Completed on 2026-05-14.**

QA checkpoint reviewed the merged AP-9A runtime skeleton through automated checks, route smoke tests, and source-level review of all new and existing modules.

QA artifacts:

- `docs/qa/audit-prototype-persistence-runtime-skeleton-ap9a/README.md` — Full QA checklist with source-level review
- `docs/architecture/AUDIT_PROTOTYPE_PERSISTENCE_RUNTIME_SKELETON_AP9A_QA_SUMMARY.md` — QA summary with findings and risk follow-ups
- `docs/daily-reports/2026-05-13-audit-prototype-persistence-runtime-skeleton-qa-ap9a.md` — Daily report

Validation:

- ✅ Build passed 40/40, 0 type errors
- ✅ Token check passed 4/4
- ✅ Audit/notification checks passed 92/92 (up from 71)
- ✅ All 5 routes 200 OK
- ✅ Dev log clean (no errors, no warnings)

QA findings:

- Disabled-by-default config confirmed
- prototype_only isolation confirmed — driver rejects real_persisted
- real_persisted blocked at guard level — always returns false / throws
- sharedMockWriter remains active AP-6D write path
- adminAuditDisplayAdapter remains active display read path
- No Staff/Admin workflow rewiring detected
- No PII exposure found in source review
- No runtime workflow regression — all routes and behaviors unchanged
- Existing 71 checks preserved; 21 new checks added without weakening

Safety confirmations:

- ❌ No runtime code modified for QA
- ❌ No src/*, scripts/*, package.json changes
- ❌ No mock fixture mutated
- ✅ Feature flag disabled by default
- ✅ prototype_only mode only, real_persisted unreachable
- ✅ Full rollback by disabling config flag
- ✅ Existing behavior preserved

Recommended next:

- Merge AP-9A to main after QA approval
- **AP-9B** — Feature-flagged integration plan (shadow writes, read comparison) — docs only
- **AP-10** — Real persistence — only after prototype review and compliance approval
- Do not start real persistence yet
- Do not start AP-10 yet

## Audit Prototype Integration Plan AP-9B

**Completed on 2026-05-14.**

AP-9B defines a documentation-only plan for feature-flagged prototype integration using shadow writes, read comparison, and rollback gates.

Documents created:

- `docs/architecture/AUDIT_PROTOTYPE_INTEGRATION_PLAN_AP9B.md` — Main AP-9B plan overview
- `docs/architecture/AUDIT_SHADOW_WRITE_STRATEGY_AP9B.md` — Shadow write strategy and source-of-truth rules
- `docs/architecture/AUDIT_READ_COMPARISON_PLAN_AP9B.md` — Read comparison dimensions and privacy rules
- `docs/architecture/AUDIT_PROTOTYPE_FEATURE_FLAG_MATRIX_AP9B.md` — 6 feature flags, defaults, allowed/forbidden combos
- `docs/architecture/AUDIT_PROTOTYPE_ROLLBACK_AND_MONITORING_AP9B.md` — Monitoring signals, rollback triggers, incident template
- `docs/architecture/AUDIT_PROTOTYPE_PRIVACY_QA_AP9B.md` — Privacy enforcement: forbidden/safe fields, role matrix, gates
- `docs/architecture/AUDIT_PROTOTYPE_INTEGRATION_QA_CHECKLIST_AP9B.md` — 11-section QA checklist (sections A-K)
- `docs/daily-reports/2026-05-13-audit-prototype-integration-plan-ap9b.md` — Daily report

AP-9B constraints honored:

- Documentation and planning only
- No runtime code created or modified
- No backend/API added
- No database migrations created
- No real persistence added
- No prototype runtime integration started
- No mock fixtures mutated
- No Staff callbacks changed
- No Staff verify action wired
- No reason validation changed
- No ReasonRequiredModal introduced
- No notification behavior changed
- No PII exposed
- `real_persisted` mode remains blocked

Key design outputs:

- 6 feature flags all defaulting to `false`
- Phased rollout: monitoring -> shadow write -> read compare -> admin visible
- Source-of-truth rule: `sharedMockWriter` always authoritative
- Rollback: disable any flag to revert immediately
- Privacy gates run before every shadow write and read comparison
- Monitoring signals with alert thresholds defined

Recommended next:

- **AP-9B-QA** — Formal QA checkpoint for documentation (optional)
- **AP-9C** — Shadow write runtime integration (feature-flagged, `prototype_only`)
- Do not start real persistence yet
- Do not start AP-10 yet

## Audit Prototype Integration Plan QA AP-9B

**Completed on 2026-05-14.**

QA checkpoint reviewed the merged AP-9B documentation through automated checks, route smoke tests, source-level review, and documentation analysis.

QA artifacts:

- `docs/qa/audit-prototype-integration-plan-ap9b/README.md` — Full QA checklist covering docs-only safety, integration plan, shadow write strategy, read comparison, feature flags, privacy, and runtime preservation
- `docs/architecture/AUDIT_PROTOTYPE_INTEGRATION_PLAN_AP9B_QA_SUMMARY.md` — Architecture QA summary with findings, risks, safety confirmations
- `docs/daily-reports/2026-05-13-audit-prototype-integration-plan-qa-ap9b.md` — Daily report

Validation:

- ✅ Build passed 40/40, 0 type errors
- ✅ Token check passed 4/4
- ✅ Audit/notification checks passed 92/92
- ✅ All 5 routes 200 OK (`/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002`)
- ✅ Dev log clean (no errors, no warnings)

QA findings:

- Docs-only scope confirmed — no runtime code modified
- Shadow write strategy safe — `sharedMockWriter` is source of truth, failure is non-blocking
- Read comparison strategy safe — Admin UI does not switch read source, comparison is diagnostic-only
- Feature flags conservative — all 6 flags default `false`, forbidden combinations documented
- Rollback plan complete — 11 monitoring signals, 9 rollback triggers, post-rollback verification defined
- Privacy plan complete — 11 forbidden data classes, role visibility matrix, display presenter safety preserved
- No runtime workflow regression — all existing behavior preserved
- No PII exposure found — source review of 11 runtime files clean
- AP-9B runtime not started — all flags disabled, `real_persisted` blocked at guard level
- AP-10 not started

Runtime preservation confirmed:

- `sharedMockWriter` unchanged (active write path)
- `adminAuditDisplayAdapter` unchanged (active read path)
- `AuditDisplayPresenter` unchanged (single formatting boundary)
- `auditPersistenceConfig.ts` defaults `prototypeEnabled: false`
- `auditPersistenceFeatureGuard.ts` blocks `real_persisted` always
- Prototype repository isolated from existing `InMemoryAuditRepository`

Recommended next:

- **AP-9C** — Shadow write runtime integration only after explicit approval
- **AP-10** — Real persistence planning only after AP-9C evidence and compliance review
- Do not start real persistence yet
- Do not start AP-10 yet

## Audit Shadow Write Runtime Plan AP-9C

**Completed on 2026-05-14.**

AP-9C is a documentation-only plan that defines how the AP-9A prototype persistence skeleton should be integrated as a future runtime phase using feature-flagged, non-blocking shadow writes.

Documents created:

- `docs/architecture/AUDIT_SHADOW_WRITE_RUNTIME_PLAN_AP9C.md` — Main shadow write runtime architecture, candidate actions, source-of-truth rules, failure handling, rollback plan, QA gates, Laravel/PHP mapping
- `docs/architecture/AUDIT_SHADOW_WRITE_CALLBACK_MAPPING_AP9C.md` — Maps Staff callbacks (reject, replacement request) to current write paths and future shadow write insertion points
- `docs/architecture/AUDIT_SHADOW_WRITE_FEATURE_FLAG_GUARDS_AP9C.md` — Feature flag defaults, gate sequence, forbidden combinations, fail-open/fail-closed rules, pseudo-code, Laravel/PHP config mapping
- `docs/architecture/AUDIT_SHADOW_WRITE_PRIVACY_AND_FAILURE_BOUNDARY_AP9C.md` — Privacy enforcement (forbidden/safe data classes), gate sequence, failure classes, logging rules, rollback behavior
- `docs/architecture/AUDIT_SHADOW_WRITE_QA_CHECKLIST_AP9C.md` — 12-section QA checklist (sections A-L)
- `docs/daily-reports/2026-05-13-audit-shadow-write-runtime-plan-ap9c.md` — Daily report

AP-9C constraints honored:

- Documentation and planning only
- No runtime code created or modified
- No backend/API added
- No database migrations created
- No real persistence added
- No prototype persistence activated
- No mock fixtures mutated
- No Staff callbacks changed
- No Staff verify action wired
- No reason validation changed
- No ReasonRequiredModal introduced
- No notification behavior changed
- No PII exposed
- sharedMockWriter remains active source of truth
- adminAuditDisplayAdapter remains active read/display path
- AuditDisplayPresenter remains single formatting boundary
- real_persisted remains blocked at type and guard level

Key design outputs:

- Two candidate actions identified for shadow writes: staff.document.reject and staff.document.request_replacement
- Shadow write sequence: sharedMockWriter first, then non-blocking prototype write
- 8-gate feature flag sequence documented
- 7-gate privacy enforcement sequence before every shadow write
- 10 failure classes defined with severity and non-blocking behavior
- Fail-open default for all user-facing prototype flows
- Fail-closed only for real_persisted attempts and privacy gate violations
- Rollback achievable by disabling any feature flag
- Laravel/PHP config mapping provided for all new flags

Recommended next:

- **AP-9C-QA** — Formal documentation QA checkpoint (peer review of all 6 plan files)
- **AP-9D** — Shadow write runtime implementation (only after AP-9C plan approval)
- Do not start real persistence yet
- Do not start AP-10 yet

## Audit Shadow Write Runtime Plan QA AP-9C

**Completed on 2026-05-14.**

QA checkpoint reviewed the merged AP-9C documentation through automated checks, route smoke tests, source-level review, and documentation analysis.

QA artifacts:

- `docs/qa/audit-shadow-write-runtime-plan-ap9c/README.md` — Full QA checklist covering documentation completeness, source-of-truth preservation, candidate actions, feature flags, privacy/failure boundary, runtime preservation
- `docs/architecture/AUDIT_SHADOW_WRITE_RUNTIME_PLAN_AP9C_QA_SUMMARY.md` — Architecture QA summary with findings, risks, safety confirmations
- `docs/daily-reports/2026-05-13-audit-shadow-write-runtime-plan-qa-ap9c.md` — Daily report

Validation:

- ✅ Build passed 40/40, 0 type errors
- ✅ Token check passed 4/4
- ✅ Audit/notification checks passed 92/92
- ✅ All 5 routes 200 OK (`/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002`)
- ✅ Dev log clean (no errors, no warnings)

QA findings:

- AP-9C documentation complete and consistent with AP-9B/AP-9A
- Source-of-truth boundary confirmed — `sharedMockWriter` remains single authoritative write path
- Active read boundary confirmed — `adminAuditDisplayAdapter` remains active display path
- AP-9A prototype remains disabled by default — feature guard and config defaults prevent activation
- `real_persisted` blocked at type system and guard level
- `prototype_only` remains the only prototype path
- Privacy model complete — 12 forbidden data classes, 11 safe classes, 7-gate privacy chain
- Failure model complete — 8 failure classes with non-blocking behavior documented
- Rollback achievable by disabling any feature flag
- Staff verify excluded (deferred to AP-6E)
- No reason validation change, no ReasonRequiredModal
- No notification behavior change
- No PII exposure found — source review of runtime files clean
- No runtime source modified — all `src/*` files unchanged from AP-9B QA baseline
- AP-9D runtime not started, AP-10 not started

Recommended next:

- **AP-9D** — Shadow write runtime implementation only after explicit approval
- Do not start real persistence yet
- Do not start AP-10 yet

## Audit Shadow Write Runtime AP-9D

**Completed on 2026-05-14.**

Branch: `architecture/audit-shadow-write-runtime-ap9d`

Result:

- Implemented shadow write runtime integration for Staff document reject and replacement request
- Created 3 new modules: `auditShadowWriteMetrics.ts`, `auditShadowWriteGuards.ts`, `auditShadowWriteService.ts`
- Wired shadow writes into `onReject` and `onRequestReplacement` callbacks in Staff application page
- Updated check script with 15 new AP-9D checks (92 → 107 total)
- All feature flags disabled by default — no user-facing behavior change

Constraints honored:

- `sharedMockWriter` remains the single source of truth
- `adminAuditDisplayAdapter` remains active read path
- Shadow writes are secondary and non-blocking
- No real persistence added
- No backend/API changes
- No database migrations
- No localStorage/sessionStorage
- Mock fixture not mutated
- `DocumentVerificationPanel` props unchanged
- Staff callback signatures unchanged
- Reason validation unchanged
- No `ReasonRequiredModal`
- No notification behavior change
- No PII exposure
- `real_persisted` remains blocked at type + guard level
- AP-10 not started

Key design decisions:

- Shadow service accepts both `mock_only` and `prototype_only` input events (converts to `prototype_only` internally)
- 6-gate guard sequence: master switch → shadow write flag → mode check → real persistence block → event type allowlist → privacy guard
- Fire-and-forget pattern: `void shadowWriteService.shadowWrite(event)` — never awaits, never blocks UI
- Module-level shared metrics store for developer diagnostics
- Testing factory `createAuditShadowWriteServiceForTesting()` for isolated unit testing

Validation:

- Build: 40/40 routes, 0 type errors
- Tokens: 4/4 passed
- Audit/notification checks: 107/107 (was 92/92)
- Route smoke: 5/5 routes return 200 OK
- Dev log: clean

Recommended next:

- **AP-9D-QA** — Formal documentation QA checkpoint for this implementation
- Then consider **AP-9E** read comparison planning (separate phase)
- Do not start real persistence until prototype phase is proven stable and compliant
- Do not start AP-10 until AP-9C/AP-9D evidence and compliance review complete

## Audit Shadow Write Runtime Post-Merge QA AP-9D

AP-9D post-merge QA completed on `main`.

Confirmed:
- `main` validated after AP-9D merge and merge checkpoint
- build passed, 40/40
- token checks passed, 4/4
- audit/notification checks passed, 107/107
- route smoke passed for `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, and `/staff/applications/app_002`
- dev log clean
- runtime code unchanged in post-merge QA
- `sharedMockWriter` source of truth confirmed
- `adminAuditDisplayAdapter` active read path confirmed
- `AuditDisplayPresenter` display boundary confirmed
- prototype persistence remains disabled by default
- no real persistence, backend/API, database migration, browser storage, mock fixture mutation, notification behavior change, or PII exposure found

Recommended next:
- AP-9E read comparison planning only after explicit approval
- no real persistence
- no AP-10

## Audit Read Comparison Plan AP-9E

AP-9E docs-only plan added on `architecture/audit-read-comparison-plan-ap9e`.

Planned:
- read comparison architecture between current Admin mock reads and future prototype reads
- comparison dimensions for event counts, ids, event types, actor roles, safe target tokens, persistence modes, severity, timestamp order, source routes, safe metadata key sets, presenter output, and copy-stage consistency
- mismatch categories for missing, extra, duplicate, order, metadata, unsafe metadata, persistence mode, presenter output, and copy-stage mismatches
- privacy/logging boundaries with aggregate-only, developer-safe output
- Admin display boundary preserving `adminAuditDisplayAdapter` and `AuditDisplayPresenter`
- rollout/rollback plan with all comparison flags disabled by default
- QA checklist for docs-only review and future runtime readiness

Confirmed:
- runtime unchanged
- no Admin read switch
- no prototype activation
- no real persistence
- no backend/API
- no database migrations
- no Staff callback change
- no notification behavior change
- no PII exposure

Recommended next:
- AP-9E-QA docs-only review
- AP-9F read comparison runtime only after approval
- do not start real persistence
- do not start AP-10

## Audit Read Comparison Plan QA AP-9E

AP-9E QA checkpoint completed on `architecture/audit-read-comparison-plan-ap9e`.

Confirmed:
- docs-only scope confirmed
- Admin read path preserved through `adminAuditDisplayAdapter`
- `sharedMockWriter` source of truth confirmed
- `AuditDisplayPresenter` formatting boundary confirmed
- privacy/logging reviewed and PII-safe
- rollout/rollback reviewed and flag-based
- checks pass 107/107
- route smoke passed for `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, and `/staff/applications/app_002`
- dev log clean
- runtime code unchanged in QA
- no Admin prototype read switch
- no prototype activation
- no real persistence
- no AP-9E runtime, AP-9F, or AP-10 started

Recommended next:
- merge AP-9E after review
- AP-9F read comparison runtime only after explicit approval
- no real persistence
- no AP-10

## Audit Read Comparison Plan Post-Merge QA AP-9E

AP-9E post-merge QA completed on `main`.

Confirmed:
- main validated after AP-9E merge and merge checkpoint
- build passed, 40/40
- token checks passed, 4/4
- audit/notification checks passed, 107/107
- route smoke passed for `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, and `/staff/applications/app_002`
- dev log clean
- runtime code unchanged in QA
- Admin read path preserved through `adminAuditDisplayAdapter`
- `sharedMockWriter` source of truth confirmed
- `AuditDisplayPresenter` boundary confirmed
- no prototype read switch
- AP-9E remains documentation-only
- no prototype activation, real persistence, backend/API, database migration, mock fixture mutation, notification behavior change, or PII exposure found

Recommended next:
- AP-9F read comparison runtime only after explicit approval
- no real persistence
- no AP-10

## Audit Read Comparison Runtime AP-9F

AP-9F runtime skeleton added on branch `architecture/audit-read-comparison-runtime-ap9f`.

Files created:
- `src/lib/audit/comparison/auditReadComparisonTypes.ts` — pure type definitions
- `src/lib/audit/comparison/auditReadComparisonMetrics.ts` — in-memory PII-free metrics store
- `src/lib/audit/comparison/auditReadComparisonGuards.ts` — 6-gate guard evaluation
- `src/lib/audit/comparison/auditReadComparisonService.ts` — core comparison service with 11 dimensions and testing factory

Files modified:
- `src/lib/audit/index.ts` — added AP-9F comparison module exports
- `scripts/check-audit-events.mjs` — added 15 AP-9F checks (107 → 122)

Safety boundaries preserved:
- No Admin UI switch to prototype reads
- No prototype read as source of truth
- No real persistence activated
- No backend/API changes
- No database migrations
- No mock fixture mutation
- `sharedMockWriter` source of truth preserved
- `adminAuditDisplayAdapter` active read path preserved
- All comparison feature flags disabled by default

Audit/notification checks: 107 → 122 (15 new checks).

Recommended next:
- AP-9F-QA — formal documentation QA checkpoint for the runtime skeleton
- Future Admin debug-only comparison panel only after explicit approval, separate QA gate, and PII safety review
- Do not start AP-10 yet
- Do not activate real persistence

## Audit Read Comparison Runtime QA AP-9F

AP-9F QA checkpoint completed on branch `architecture/audit-read-comparison-runtime-ap9f`.

QA confirmed:
- Runtime skeleton source-reviewed: all 4 new comparison modules reviewed
- Admin UI read path preserved: `adminAuditDisplayAdapter` unchanged, still reads from `sharedMockAuditWriter.list()` and fixture logs
- `sharedMockWriter` source of truth confirmed: unchanged, no comparison path reads or writes to it
- `AuditDisplayPresenter` formatting boundary confirmed: unchanged
- Comparison guards reviewed: 6-gate chain blocks disabled flags, missing event arrays, `real_persisted` events, and unsafe metadata keys correctly
- Metrics store reviewed: in-memory closure only, no browser storage, no backend calls, `list()` returns deep copies
- Mismatch output reviewed as PII-free: `AuditReadComparisonMismatch` has no `actorId`, `targetId`, `reason`, or metadata value fields — enforced at type level and by 122-check suite
- Checks pass: 122/122
- Routes pass: all 5 smoke routes 200 OK
- Dev log: clean
- Runtime code unchanged during QA

Safety confirmations:
- No `src/*` or `scripts/*` changes during QA
- No Admin UI prototype read switch
- No prototype persistence activation
- No real persistence added
- No backend/API changes
- No database migration
- No mock fixture mutation
- No Staff callback change
- No notification behavior change
- No PII exposure found
- AP-10 not started

Recommended next:
- Push `architecture/audit-read-comparison-runtime-ap9f` branch after QA approval
- Open PR targeting `main`
- Merge only after review and approval
- Run AP-9F post-merge QA after merge to confirm `main` state (build, token check, 122/122 audit checks, route smoke, dev log)
- Do not start AP-10
- Do not activate real persistence

## Audit Read Comparison Runtime Post-Merge QA AP-9F

AP-9F post-merge QA completed on `main` after merge commit `e9a14ed` (checkpoint `8a8a32c`).

Post-merge QA confirmed:
- Comparison modules present on main: all 4 modules in `src/lib/audit/comparison/`
- Admin UI read path preserved: `adminAuditDisplayAdapter` unchanged, still reads from `sharedMockAuditWriter.list()` and fixture logs
- `sharedMockWriter` source of truth confirmed: unchanged, no comparison path reads or writes to it
- `AuditDisplayPresenter` formatting boundary confirmed: unchanged
- Prototype persistence remains disabled: `DEFAULT_AUDIT_PERSISTENCE_CONFIG` has `prototypeEnabled: false`, `shadowWrites: false`, `readFromPrototype: false`
- Real persistence not added
- Checks pass: 122/122
- Routes pass: all 5 smoke routes 200 OK
- Dev log: clean
- Runtime code unchanged during post-merge QA

Safety confirmations:
- No `src/*` or `scripts/*` changes during QA
- No Admin UI prototype read switch
- No prototype persistence activation
- No real persistence added
- No backend/API changes
- No database migration
- No mock fixture mutation
- No Staff callback change
- No notification behavior change
- No PII exposure found
- AP-10 not started

Recommended next:
- AP-9G planning only after explicit approval
- Admin debug-only comparison panel only after explicit approval, with separate QA gate and PII safety review
- Do not start AP-10
- Do not activate real persistence

## End of AP-9B
