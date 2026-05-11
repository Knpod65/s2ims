# S²IMS Status Migration Review — Phase 2K

**Phase:** 2K — Status Migration Review & Stabilization Summary
**Branch:** audit/architecture-renovation-plan
**Date:** 2026-05-11
**Status:** Documentation/review only. No runtime migration in this phase.

---

## Purpose

Phase 2K pauses runtime status migration after four low-risk display migrations:

- Phase 2G — Data freshness
- Phase 2H — Shortlist request display
- Phase 2I — Provider scholarship display
- Phase 2J — Candidate pool display

The goal is to review the helper/config pattern before touching higher-risk domains such as
documents, applications, disclosure, audit/security risk, admin exports, or OCR jobs.

---

## Completed Migration Summary

| Phase | Domain | Runtime scope | Outcome |
|---|---|---|---|
| 2G | `dataFreshness` | Student/provider freshness indicators and staff matching freshness key | Centralized freshness lookup; normalized staff mock key from `current` to `fresh`. |
| 2H | `shortlistRequest` | Provider `ShortlistStatusBadge` display | Centralized label/tone lookup; changed provider-facing `declined` label to `Not approved`. |
| 2I | `scholarship` | Provider scholarship status helpers only | Centralized provider scholarship labels/tones while preserving provider label overrides and `ACTIVE` role styling. |
| 2J | `candidatePool` | Provider scholarship card candidate pool display | Added separate candidate pool domain and centralized display labels/tones. |

---

## Files Modified Per Phase

### Phase 2G — Data Freshness

- `src/config/statusHelpers.ts`
- `src/data/mock/staffData.ts`
- `src/components/staff/MatchReviewCard.tsx`
- `src/components/student/DataFreshnessIndicator.tsx`
- `src/components/provider/ProviderDataFreshnessIndicator.tsx`
- `docs/architecture/DATA_FRESHNESS_MIGRATION_PHASE_2G.md`

### Phase 2H — Shortlist Request Display

- `src/components/provider/ShortlistStatusBadge.tsx`
- `src/config/statuses.ts`
- `docs/architecture/SHORTLIST_STATUS_MIGRATION_PHASE_2H.md`

### Phase 2I — Provider Scholarship Status Display

- `src/components/provider/ProviderScholarshipCard.tsx`
- `docs/architecture/PROVIDER_SCHOLARSHIP_STATUS_MIGRATION_PHASE_2I.md`

### Phase 2J — Candidate Pool Status Display

- `src/config/statuses.ts`
- `src/components/provider/ProviderScholarshipCard.tsx`
- `docs/architecture/CANDIDATE_POOL_STATUS_MIGRATION_PHASE_2J.md`

---

## Runtime Config Domains Now Used

These `STATUS_GROUPS` domains are now used by runtime components:

- `dataFreshness`
- `shortlistRequest`
- `scholarship` for provider scholarship display only
- `candidatePool`

Defined but not broadly migrated:

- `application`
- `document`
- `review`
- `disclosureRequest`
- `auditRisk`

Important nuance: `scholarship` is only partially migrated. Public scholarship pages still use
`SCH_STATUS_MAP` from `src/lib/utils.ts`.

---

## Domains Still Not Migrated

- Application statuses
- Document upload/verification statuses
- Public scholarship statuses
- Disclosure request statuses
- Audit/security risk statuses
- Admin access/export/security alert statuses
- Announcement statuses
- OCR/job statuses
- Student application local states
- Staff data quality issue statuses
- Eligibility/checklist statuses

These domains are intentionally delayed because they have larger blast radius, privacy wording
differences, governance semantics, or key mismatches.

---

## Behavior Changed Vs Unchanged

Behavior intentionally unchanged:

- No routes, auth, role guards, navigation, disclosure behavior, export behavior, backend/API,
  or database behavior changed.
- Provider scholarship `ACTIVE` kept role-aware styling.
- Candidate pool `ready` still controls candidate access.
- Non-ready candidate pools remain locked.
- Shortlist keys remain stable.
- Provider scholarship keys remain stable.

Intentional display changes:

- Staff freshness key changed from `current` to `fresh`, while staff UI still displays
  `Current` / `ปัจจุบัน`.
- Provider shortlist `declined` now displays `Not approved` / `ไม่อนุมัติ`.
- Candidate pool display now has distinct labels:
  - `not_available` → `Not available` / `ยังไม่พร้อม`
  - `ready` → `Ready` / `พร้อมใช้งาน`
  - `pending_staff_approval` → `Pending staff review` / `รอเจ้าหน้าที่ตรวจสอบ`

---

## Visual And Label Decisions Made

- `dataFreshness`: Surface-specific labels/classes stayed local because provider and student
  freshness copy differs from the generic config.
- `shortlistRequest`: Internal key `declined` stayed stable while the provider-facing label
  became `Not approved`.
- `scholarship`: Provider-facing `ACTIVE` keeps `bg-role-tint text-role-primary border-role-border`
  instead of hard-coded emerald.
- `scholarship`: Provider Thai labels for `DRAFT`, `ACTIVE`, and `CLOSED` remain adapter overrides.
- `candidatePool`: Candidate pool is its own domain and not an alias of shortlist request status.
- `candidatePool`: `ready` uses role-aware success styling through role tokens.

---

## Helper Functions Currently Used

Implemented in `src/config/statusHelpers.ts`:

- `getStatusConfig(domain, status)`
- `getStatusLabel(domain, status, lang)`
- `getStatusTone(domain, status)`
- `isTerminalStatus(domain, status)`
- `requiresAction(domain, status)`

Runtime usage today:

- `getStatusConfig`: freshness indicators
- `getStatusLabel`: shortlist, provider scholarship, candidate pool
- `getStatusTone`: shortlist, provider scholarship, candidate pool

Not yet used at runtime:

- `isTerminalStatus`
- `requiresAction`

---

## Remaining Hard-Coded Status Logic

Known remaining status maps and helpers:

- `src/lib/utils.ts`
  - `APP_STATUS_MAP`
  - `SCH_STATUS_MAP`
  - `ANN_STATUS_MAP`
- `src/components/staff/DocumentVerificationPanel.tsx`
  - inline document labels, colors, icons
- `src/components/staff/DisclosureRequestCard.tsx`
  - inline disclosure labels/colors
- `src/components/staff/StaffDataQualityIssueCard.tsx`
  - inline data quality status/severity display
- `src/components/admin/AccessRequestCard.tsx`
  - inline admin access status labels/colors
- `src/components/admin/SecurityAlertCard.tsx`
  - inline alert status labels
- `src/components/admin/ExportEventCard.tsx`, `SensitiveAccessCard.tsx`
  - inline risk colors
- Student-facing application/document readiness components
  - local readiness/checklist states that are not yet shared persistence statuses

Known remaining status logic checks:

- Application filters and status transition UI
- Document verification conditional detail rendering
- Disclosure request approval/rejection conditionals
- Candidate pool access checks
- Public scholarship open/published checks
- Admin/security conditional actions

Many of these should remain logic checks even after label/color migration. The migration target
should be display maps first, not behavior gates.

---

## Risks Before Higher-Risk Domains

- Config labels sometimes differ from current role-specific UI labels.
- Some domains use different key conventions for the same lifecycle.
- Some statuses control disclosure, export, approval, or lock/unlock behavior.
- Existing screenshots are not captured, so subtle visual regressions are easy to miss.
- Helper tests do not exist yet.
- `isTerminalStatus` and `requiresAction` are defined but unproven in runtime flows.
- Tone-to-class mapping is still adapter-local rather than centralized.

---

## Risk Gate Before Next Runtime Migration

### Document Statuses

Required product decision:

- Decide whether `rejected` should display as `Rejected`, `Needs replacement`, or role-specific text.
- Decide whether invalid/rejected document states are amber/actionable or red/danger.
- Decide if `verification_pending` should be added to staff verification UI.

Required screenshot QA:

- Student document list.
- Staff document verification panel.
- Application detail document sections.
- TH and EN for rejected, invalid, pending, uploaded, verified, and missing states.

Likely files touched:

- `src/components/staff/DocumentVerificationPanel.tsx`
- `src/components/student/RequiredDocumentsList.tsx`
- `src/data/mock/staffData.ts`
- `src/data/mock/studentApplicationData.ts`
- Application document pages that render document statuses.

Reason to delay or proceed:

- Delay until label/tone policy is confirmed because document status wording affects student
  trust and staff review severity. Proceed only as a plan-only or screenshot-backed phase.

### Application Statuses

Required product decision:

- Resolve uppercase config keys versus lowercase student application state keys.
- Decide whether student-facing application states and staff application lifecycle are one domain
  or two related domains.
- Confirm labels for `ready_to_submit`, `revision_requested`, `approved`, `rejected`, and `withdrawn`.

Required screenshot QA:

- Student dashboard.
- Student applications list/detail/edit.
- Staff applications list/detail.
- Staff student detail application cards.
- All application status filters and status transition controls.

Likely files touched:

- `src/lib/utils.ts`
- `src/data/mock/studentApplicationData.ts`
- `src/app/student/dashboard/page.tsx`
- `src/app/student/applications/**`
- `src/app/staff/applications/**`
- `src/app/staff/students/[id]/page.tsx`

Reason to delay or proceed:

- Delay. This is high blast radius and has incompatible key conventions. A plan-only Phase 2L
  would be safer than runtime migration.

### Disclosure Statuses

Required product decision:

- Confirm whether rejected disclosure should display as `Rejected` or `Not approved` for staff.
- Confirm if disclosure labels differ for staff, provider, and student contexts.
- Confirm governance/audit wording for pending and rejected states.

Required screenshot QA:

- Staff disclosure request list.
- Disclosure approval modal.
- Disclosure rejection modal.
- Any provider/student surfaces that reference disclosure outcomes.

Likely files touched:

- `src/components/staff/DisclosureRequestCard.tsx`
- `src/components/staff/DisclosureApprovalModal.tsx`
- `src/components/staff/DisclosureRejectionModal.tsx`
- `src/app/staff/disclosure-requests/page.tsx`
- `src/data/mock/staffData.ts`

Reason to delay or proceed:

- Delay. Disclosure status wording has privacy/governance implications and should not be bundled
  with ordinary badge cleanup.

### Audit/Security Risk Statuses

Required product decision:

- Decide whether `high` and `critical` should use amber or danger styling.
- Confirm where `critical` must render and whether current components need a missing-case fix.
- Decide whether audit risk and security alert severity are one domain or separate domains.

Required screenshot QA:

- Admin audit log.
- Admin export.
- Admin dashboard security alert cards.
- Sensitive access cards and elevated access warnings.

Likely files touched:

- `src/components/admin/UserRiskBadge.tsx`
- `src/components/admin/ElevatedAccessWarning.tsx`
- `src/components/admin/SensitiveAccessCard.tsx`
- `src/components/admin/ExportEventCard.tsx`
- `src/components/admin/SecurityAlertCard.tsx`
- `src/data/mock/adminData.ts`

Reason to delay or proceed:

- Delay until `critical` handling and tone policy are explicitly approved. This is governance UI.

### Admin Export Statuses

Required product decision:

- Define export event lifecycle/status domain separately from risk severity.
- Confirm status labels for export attempts, completed exports, denied exports, failed logins,
  and sensitive access events.
- Confirm audit wording and redaction expectations.

Required screenshot QA:

- Admin export page.
- Audit log cards.
- Export event cards.
- TH/EN labels for export type and risk.

Likely files touched:

- `src/components/admin/ExportEventCard.tsx`
- `src/app/admin/export/page.tsx`
- `src/app/admin/audit-log/page.tsx`
- `src/data/mock/adminData.ts`
- `src/config/exportAllowlist.ts`

Reason to delay or proceed:

- Delay. Export UI touches privacy, allowlists, and audit semantics; it should be planned with
  the export policy work rather than status cleanup alone.

### OCR/Job Statuses

Required product decision:

- Decide whether OCR job status belongs in central status config or remains page-local because it
  is prototype-only and not a persistence status.
- Confirm labels for queued, processing, success, failed, and retry states.

Required screenshot QA:

- Staff OCR page before upload.
- Uploading/processing state.
- Success result state.
- Failure/retry state.

Likely files touched:

- `src/app/staff/ocr/page.tsx`
- Any future OCR mock data or config files if introduced.

Reason to delay or proceed:

- Delay unless OCR work becomes a maintained workflow. Current status appears page-local and may
  not justify shared config yet.

---

## Recommendation

Recommended next phase: **Option C — Phase 2L: Pause renovation branch and prepare PR/merge review**.

Why:

- The branch now contains several runtime migrations plus documentation.
- The helper pattern is useful but still adapter-heavy and untested.
- The remaining domains have higher governance, privacy, and behavior risk.
- A PR/merge review can validate that the low-risk pattern is acceptable before spreading it into
  application, document, disclosure, audit, admin export, or OCR surfaces.

If runtime work must continue instead, the safest alternative is a plan-only document status phase,
not a document runtime migration.
