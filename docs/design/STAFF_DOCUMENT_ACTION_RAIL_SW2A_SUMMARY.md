# Staff Document Action Rail — SW-2A Summary

Date: 2026-05-11
Branch: `design/staff-document-action-rail-runtime`
Phase: SW-2A — DocumentActionRail shell only

## Goal

Create a visible action status area that helps staff understand which documents need
attention before expanding the accordion panel. The rail is informational — it does not
duplicate action buttons or own any reason/validation logic.

---

## Files Inspected

- `src/app/staff/applications/[id]/page.tsx`
- `src/components/staff/StaffDocumentEvidenceWorkbench.tsx`
- `src/components/staff/DocumentVerificationPanel.tsx`
- `src/components/staff/AuditWarningCard.tsx`
- `src/data/mock/staffData.ts`
- `src/config/documentStatusDisplay.ts`
- `src/config/sensitiveActions.ts`
- `docs/design/STAFF_DOCUMENT_ACTION_RAIL_OPTIMIZATION_PLAN.md`
- `docs/design/STAFF_REASON_REQUIRED_MODAL_COMPARISON.md`
- `docs/design/STAFF_AUDIT_AWARENESS_PLACEMENT_GUIDE.md`
- `docs/design/STAFF_STUDENT_DOCUMENT_WORDING_BOUNDARY.md`
- `docs/design/STAFF_DOCUMENT_EVIDENCE_WORKBENCH_SW1_SUMMARY.md`
- `docs/design/STAFF_DOCUMENT_WORKBENCH_BEHAVIOR_CONTRACT.md`

---

## Files Created

- `src/components/staff/DocumentActionRail.tsx`
- `docs/design/STAFF_DOCUMENT_ACTION_RAIL_SW2A_SUMMARY.md`

---

## Files Modified

- `src/components/staff/StaffDocumentEvidenceWorkbench.tsx`
  - Added `actionRail?: ReactNode` to props type and destructure.
  - Renders `actionRail` inside the evidence section card above `{evidence}`, wrapped
    in `<div className="mb-4">` when present. No other changes.

- `src/app/staff/applications/[id]/page.tsx`
  - Added import for `DocumentActionRail`.
  - Passed `actionRail={<DocumentActionRail documents={appDocs} />}` to
    `StaffDocumentEvidenceWorkbench`. No other changes.

---

## Whether DocumentVerificationPanel Internals Changed

No. `DocumentVerificationPanel.tsx` was not modified.

---

## Whether Callbacks Changed

No. `onVerify`, `onReject`, `onRequestReplacement` are unchanged. The rail receives no
callbacks. All actions continue to originate from `DocumentVerificationPanel`.

---

## Whether Reason Validation Changed

No. Reason textarea behavior, empty/whitespace guard, and absence of minimum-length
enforcement are all unchanged.

---

## Whether Audit Persistence Was Added

No. The rail includes a prototype audit awareness strip using safe copy:

> "Prototype audit awareness — real audit persistence is not yet connected.
>  Document actions should be auditable in production."

This explicitly does not claim persistence. No real audit write is performed.

---

## Action Rail — Informational or Callback-Connected

SW-2A: **Informational only.**

The rail computes document action status from the `documents` prop and shows:
- Per-document status with icon, document label, and guidance text.
- Quick count chips for verified / awaiting review / needs attention.
- An "All documents verified" state when no work remains.
- Prototype audit awareness strip.

No buttons. No callbacks. No reason capture.

This satisfies the planning constraint:
> "Prefer no duplicate actionable buttons over risky duplicated callbacks."

---

## Audit Wording Used

Prototype-safe. Per `STAFF_AUDIT_AWARENESS_PLACEMENT_GUIDE.md`:

EN: "Prototype audit awareness — real audit persistence is not yet connected.
Document actions should be auditable in production."

TH: "บริบท audit ต้นแบบ — การบันทึก audit จริงยังไม่ได้เชื่อมต่อ
การดำเนินการเอกสารควรสามารถตรวจสอบได้ในระบบจริง"

Does not use: "logged", "recorded", "saved permanently", "compliance complete".

---

## Guidance Copy by Status

| Status | EN guidance |
|--------|-------------|
| `pending` | Expand below to verify, reject, or request replacement |
| `uploaded` | Expand below to review and verify |
| `rejected` | Rejected — awaiting student re-upload |
| `needs_replacement` | Replacement requested — awaiting student |
| `missing` | Not yet submitted — no staff action available |
| `invalid_file_type` | System validation state — not a staff-initiated action |
| `verified` | (excluded from work list — shown only in count chip) |

Staff wording is operational. Student recovery wording is not imported or reused.

---

## Behavior Preserved

- Document status keys: unchanged.
- Mock data: unchanged.
- Verify callback: unchanged.
- Reject callback: unchanged.
- Request replacement callback: unchanged.
- Button availability: unchanged.
- Reason textarea: unchanged.
- Minimum-length enforcement: unchanged (still absent, per policy plan).
- `AuditWarningCard` in panel: still not rendered (per SD-2 planning).
- Staff document wording: unchanged.
- Student document wording: unchanged.
- Routes, auth, role guards, backend/API, export, disclosure: unchanged.
- Identity reveal modal: unchanged.
- Staff notes: unchanged.
- Application status update: unchanged.
- Audit trail display: unchanged.

---

## What Was Intentionally Not Changed

- `DocumentVerificationPanel` internals.
- Reason validation behavior.
- AuditWarningCard wiring inside the panel (deferred to SD-2/SW-3A).
- Staff status labels (still inline in panel; extraction deferred to SD-1).
- Student display adapter (`documentStatusDisplay.ts`).
- `sensitiveActions.ts`.
- Any non-staff routes.

---

## Validation

- `npm run build`: PASS — 40 routes, 0 type errors.
- `npm run check:tokens`: PASS — 4/4.
- `/staff/applications/app_001`: 200 OK.
- `/staff/applications/app_002`: 200 OK.
- Dev server log: no errors, no warnings, no duplicate key warnings.

---

## Recommended Next Phases

### SW-2B — Visual QA (before merge)

- Open `/staff/applications/app_001` and `/staff/applications/app_002` in browser.
- Confirm action rail renders above the document accordion.
- Confirm existing accordion expand/collapse still works.
- Confirm document action buttons still appear when expanded.
- Confirm no PII is exposed in the rail.
- Confirm prototype audit copy is present and does not claim persistence.
- Capture screenshots (mobile 375px + desktop).

### SW-3A — Add AuditWarningCard to rejection and replacement zones

- Wire `AuditWarningCard` above the reason textarea in each flow inside
  `DocumentVerificationPanel`.
- Use prototype-safe copy from `STAFF_AUDIT_AWARENESS_PLACEMENT_GUIDE.md`.
- Separate commit. Do not combine with min-length enforcement.
- Requires approval before starting.

### SW-3B — Add 20-char minimum and character counter (after product approval)

- Add validation and counter to rejection and replacement textareas.
- Behavioral change — requires stakeholder sign-off.

### SD-1 — Extract staff status display adapter

- Create `STAFF_DOCUMENT_STATUS_DISPLAY` section in `documentStatusDisplay.ts`.
- Wire `DocumentVerificationPanel` to use config functions.
- Display-only — no action, reason, or wording changes.
- Requires approval before starting.
