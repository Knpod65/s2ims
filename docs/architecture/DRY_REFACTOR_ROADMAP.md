# DRY Refactor Roadmap

## Purpose

Define a phased plan for reducing repeated logic across the s2ims codebase.
Each phase is ordered by safety, dependency, and blast radius.
No phase should be started without explicit approval.

This document is a planning artifact. It does not authorize implementation.

---

## Phase DRY-1: Safe Constants / Config Usage

**Goal:** Ensure all existing config files are actually consumed. No new abstractions.

**Why first:** These are the lowest-risk changes — replacing hardcoded strings with
references to constants that already exist.

### Targets

| Item | Current state | Action |
|------|--------------|--------|
| Role labels in `RoleBadge.tsx` | Hardcoded label object | Replace with `getRoleConfig(role).label[lang]` from `src/config/roles.ts` |
| Role colors in `RoleBadge.tsx` | Hardcoded Tailwind classes | Replace with `var(--role-surface)` / `var(--role-primary-hex)` CSS vars |
| Role labels in login page / admin users | Inline strings | Use `getRoleConfig(role).label[lang]` |
| Token prefix strings in `privacy.ts` / `roles.ts` docs | String literals | Import constants from `tokenFormats.ts` |
| Data freshness style maps in `DataFreshnessIndicator.tsx` / `ProviderDataFreshnessIndicator.tsx` | Duplicate inline objects | Share a single `DATA_FRESHNESS_STYLE_MAP` constant |

**Files likely touched:**
- `src/components/admin/RoleBadge.tsx`
- `src/app/login/page.tsx`
- `src/app/admin/users/page.tsx`
- `src/config/privacy.ts` (comments only)
- `src/components/student/DataFreshnessIndicator.tsx`
- `src/components/provider/ProviderDataFreshnessIndicator.tsx`

**Expected risk:** Low. No new abstractions. No behavior change.

**Validation required:** `npm run build`, `npm run check:tokens`. Visual QA of role badges, data freshness indicators.

**Screenshot QA:** Yes — role badge colors and freshness indicator styles must match current output.

---

## Phase DRY-2: Shared Display Adapters

**Goal:** Extract inline status display logic into role-namespaced config or shared helpers.
Build on the student document adapter pattern already established in Phase 2K/2L.

**Status as of this document:**
- Student document status adapter: **complete** (`src/config/documentStatusDisplay.ts`)
- Staff document status adapter: **not yet extracted** (planned in Phase SD-1)
- Application status adapter: **not ready** (wording decisions not finalized)
- Provider/staff/admin adapters: **not started**

### Sub-phases

**DRY-2A: Staff document status display adapter**

- Extract staff labels, tones, icons from `DocumentVerificationPanel.tsx` to
  `src/config/documentStatusDisplay.ts` (new `STAFF_*` section)
- Wire component to use config helpers
- No action gating changes, no reason validation changes, no `AuditWarningCard` wiring
- Details in `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md` Phase SD-1

Files: `src/config/documentStatusDisplay.ts`, `src/components/staff/DocumentVerificationPanel.tsx`

Risk: Low (display only)

**DRY-2B: Status applications list summary badge**

- Extract document status badge logic from `src/app/staff/applications/page.tsx`
  (inline `getDocumentStatus()` function) to a shared helper
- Low complexity: only 3 counts (pending, rejected, verified)

Files: `src/app/staff/applications/page.tsx`

Risk: Low

**DRY-2C: Disclosure request status display**

- Extract inline `getStatusIcon()`, `getStatusLabel()`, `getStatusColor()` from
  `src/components/staff/DisclosureRequestCard.tsx` to use `statusHelpers.ts` functions
- Replace hardcoded hex colors with design tokens

Files: `src/components/staff/DisclosureRequestCard.tsx`

Risk: Low (disclosure card is display-only; status functions do not gate behavior)

**DRY-2D: Admin access request and permission badge**

- Extract inline status functions from `src/components/admin/AccessRequestCard.tsx`
  and `src/components/admin/PermissionStatusBadge.tsx`
- Wire to `statusHelpers.ts`

Files: `src/components/admin/AccessRequestCard.tsx`, `src/components/admin/PermissionStatusBadge.tsx`

Risk: Low

**DRY-2E: Application status adapter (deferred)**

- Defer until product wording for application statuses is finalized
- Two parallel status systems (`UNDER_REVIEW` vs `in_review`) must be resolved first
- See `DO_NOT_DRY_YET.md`

**DRY-2F: Provider scholarship / candidate pool adapter refinement**

- `ProviderScholarshipCard.tsx` already uses `getStatusLabel()` / `getStatusTone()` but adds
  inline wrapper functions
- Remove wrappers; call shared helpers directly

Files: `src/components/provider/ProviderScholarshipCard.tsx`

Risk: Low

---

## Phase DRY-3: Shared Governance Primitives

**Goal:** Normalize audit warning cards, privacy notices, and token display into consistent,
reusable UI primitives.

**Why after DRY-2:** Display adapters must be stable before governance overlays are added to them.

### Sub-phases

**DRY-3A: Normalize `AuditWarningCard` variants**

- Unify `src/components/staff/AuditWarningCard.tsx` and
  `src/components/admin/AdminAuditWarningCard.tsx` into a single component with an optional
  `consequence` block
- Replace hardcoded hex colors with design tokens (or define amber as a Tailwind config extension)

Files: `src/components/staff/AuditWarningCard.tsx`, `src/components/admin/AdminAuditWarningCard.tsx`

Risk: Low (purely visual normalization)

**DRY-3B: Wire `AuditWarningCard` into `DocumentVerificationPanel`**

- Add `AuditWarningCard` before rejection and replacement reason textareas
- This is a visual UI change — plan in Phase SD-2 of staff document migration
- Requires screenshot QA

Files: `src/components/staff/DocumentVerificationPanel.tsx`

Risk: Medium (adds new UI element visible to staff)

**DRY-3C: Normalize `PrivacyNotice` variants**

- Rewrite `src/components/student/StudentPrivacyNotice.tsx` to use the `PrivacyNotice`
  wrapper from `src/components/ui/index.tsx`, matching the pattern in `ProviderPrivacyNotice.tsx`
- Replace hardcoded hex colors with `role-tint` / `role-primary` CSS variables

Files: `src/components/student/StudentPrivacyNotice.tsx`

Risk: Low (display only; content unchanged)

**DRY-3D: Create `TokenDisplay` primitive (optional)**

- Create `src/components/ui/TokenDisplay.tsx` — accepts a pre-formatted token string and
  renders it in `font-mono` with consistent dashed border styling
- Replace 6 inline token display patterns

Files: New `src/components/ui/TokenDisplay.tsx`, plus 6 consumer components

Risk: Low (display primitive; no formatting logic change)

**DRY-3E: Normalize `AggregateOnlyBadge` and `MaskedIdentityCard`**

- Audit ESQ and admin views for repeated aggregate-only indicators
- Define shared `AggregateOnlyBadge` if 2+ components implement the same pattern

Files: TBD — requires component audit

Risk: Low

---

## Phase DRY-4: Shared Service / Query Layer

**Goal:** Introduce a typed data access layer to replace scattered `.find()` / `.filter()` calls.

**Why after DRY-3:** Governance and display should be stable before the data layer moves.
Also: a service layer will be more valuable once the display layer is clean.

### Sub-phases

**DRY-4A: Core query helpers (mock)**

- Create `src/lib/dataQueries.ts` with typed finders for the most-queried entities:

```typescript
export function findApplicationById(id: string): Application | undefined
export function findScholarshipById(id: string): Scholarship | undefined
export function findStudentById(id: string): User | undefined
export function findMatchReviewById(id: string): MatchReview | undefined
export function findAnnouncementById(id: string): Announcement | undefined
```

- Replace scattered `.find()` calls in dynamic route pages

Files affected: All `src/app/**/[id]/page.tsx` dynamic route pages (5+)

Risk: Low (pure refactor; same data returned)

**DRY-4B: Aggregate query helpers (mock)**

- Add filter/count helpers for dashboard metrics:

```typescript
export function countActiveApplications(): number
export function countFlaggedMatches(): number
export function countPendingDisclosures(): number
```

Files affected: All dashboard pages

Risk: Low

**DRY-4C: Role-scoped service boundaries (future)**

Separate service modules per role. These are forward-looking boundaries, not immediate refactors:

| Service | Scope |
|---------|-------|
| `studentService` | Student profile, applications, documents, recommendations |
| `providerService` | Provider scholarships, candidate pool, impact data |
| `staffService` | Applications queue, document review, disclosures, matching |
| `adminService` | Users, audit logs, permissions, exports |
| `privacyService` | Masking, tokenization, field allowlists |
| `matchingService` | Match scores, explanations, fairness flags |

Do not implement until backend integration is planned.

Risk: Medium (cross-cutting scope boundaries require agreement before implementation)

---

## Phase DRY-5: Form and Validation Utilities

**Goal:** Standardize reason field validation, modal shells, and document upload guidance.

**Why later:** Forms touch behavior. Consistent validation rules require governance sign-off.

### Sub-phases

**DRY-5A: Standardize reason field minimum length**

- Align all reason fields to 20-character minimum per `SENSITIVE_ACTION_POLICY_PHASE_2E.md`
- Currently: 10 chars (shortlist), none (disclosures), 20 chars (match override, role assignment)
- Requires product/stakeholder confirmation before changing existing lower minimums

Files: `ShortlistRequestModal.tsx`, `ShortlistReasonField.tsx`, `DisclosureRejectionModal.tsx`,
`DocumentVerificationPanel.tsx`

Risk: Medium (behavioral change — staff/providers may currently use short reasons)

**DRY-5B: Extract shared `<Modal>` wrapper**

- Create `src/components/ui/Modal.tsx` with shared backdrop, header, close button, body structure
- Replace identical shell in 5 modal components

Files: New `src/components/ui/Modal.tsx`, 5 modal consumer files

Risk: Medium (structural change to 5 active modal components)

**DRY-5C: Shared `ReasonRequiredField` component**

- Formalize existing `ShortlistReasonField.tsx` or create `src/components/ui/ReasonRequiredField.tsx`
- Props: `minLength`, `value`, `onChange`, `label`, `placeholder`, `showCharCount`
- Replace inline textarea + validation in `DocumentVerificationPanel`, `MatchOverrideModal`,
  `RoleAssignmentPanel`, `DisclosureRejectionModal`

Files: New shared component, 4 consumer files

Risk: Medium (affects reason capture in governance-sensitive actions)

**DRY-5D: Document upload validation constants**

- Centralize file type allowlist, max size constants into a shared config
- Currently scattered or implicit

Files: TBD

Risk: Low

---

## Phase DRY-6: Automated Checks

**Goal:** Add lightweight checks that verify architecture boundaries hold over time.

**Status as of this document:**
- `npm run check:tokens` — already exists and runs on CI

### Sub-phases

**DRY-6A: Status helper usage check**

- Check that no component in `src/components/provider/` imports document status keys directly
- Check that no student component imports from staff config

Risk: Low (read-only script)

**DRY-6B: Privacy boundary check (lint rule or script)**

- Verify that `src/components/provider/` does not import `STUDENT_IDENTITY_FIELDS`
- Verify that no provider component renders raw `student_id`

Risk: Low

**DRY-6C: Smoke route checks**

- Add lightweight check that all expected routes exist at build time (currently verified
  implicitly by `npm run build`)
- Optional: add explicit route existence check to `check:tokens` script or separate script

Risk: Low

---

## Phase Summary

| Phase | Goal | Risk | Requires approval before |
|-------|------|------|--------------------------|
| DRY-1 | Consume existing configs (role labels, CSS vars, freshness maps) | Low | DRY-2 |
| DRY-2 | Extract inline status display logic to adapters | Low | DRY-3 |
| DRY-3 | Normalize governance primitives (audit warning, privacy notice, token display) | Low–Medium | DRY-4 |
| DRY-4 | Shared data query layer | Low–Medium | DRY-5; backend planning required before DRY-4C |
| DRY-5 | Form/validation normalization | Medium | Governance sign-off on min length changes |
| DRY-6 | Automated architecture checks | Low | None — can run in parallel |
