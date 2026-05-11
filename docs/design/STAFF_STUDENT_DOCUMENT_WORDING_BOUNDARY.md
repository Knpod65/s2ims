# Staff and Student Document Wording Boundary

Date: 2026-05-11
Branch: `design/staff-document-action-rail-plan`
Status: Planning only. No runtime changes authorized.

## Purpose

This document defines the permanent wording boundary between staff-facing and student-facing
document status labels. It explains why they must remain separate adapters, what each label
means for each audience, and what is safe to share vs. what must stay separated.

This boundary is a product decision, not a code convenience. It must be preserved across
all future refactors.

---

## Why the Labels Are Different

Staff and students see the same document states from different roles and intents:

- Staff: operational. They need to know the formal status for their workflow.
- Student: recovery-oriented. They need to know what action to take next.

A student seeing "Rejected" stops engaging. A student seeing "Needs replacement" understands
what to do. A staff member seeing "Needs replacement" as a status label loses the operational
clarity they need. These are not formatting preferences — they are product decisions about
how each role processes information.

---

## Status Label Boundary Table

| Data key | Student-facing label (EN) | Staff-facing label (EN) | Rationale |
|----------|--------------------------|------------------------|-----------|
| `rejected` | "Needs replacement" | "Rejected" | Student sees recovery invitation. Staff sees formal operational status. Must stay separate. |
| `missing` | "Ready to add" | "Missing" | Student sees invitation to act. Staff sees a compliance gap. Must stay separate. |
| `invalid_file_type` | "Unsupported file type" | "Invalid File Type" | Student sees a user-error frame. Staff sees a technical classification. Must stay separate. |
| `needs_replacement` | "Replace file" | "Needs Replacement" | Student sees action instruction. Staff sees document state. Must stay separate. |
| `verification_pending` (student) / `pending` (staff) | "Verification pending" | "Pending" or "Pending Review" | Different keys from different type definitions. Do not merge. |
| `verified` | "Verified" | "Verified" | Same. No distinction needed. |
| `uploaded` | "Uploaded" | "Uploaded" | Same. No distinction needed. |

Thai labels follow the same per-role policy. See `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md`
for the full bilingual table.

---

## Where Each Adapter Lives

### Student adapter (exists)

File: `src/config/documentStatusDisplay.ts`

Exports:
- `getStudentDocumentStatusLabel(status, lang)` — returns recovery-oriented copy.
- `getStudentDocumentStatusClassName(status)` — returns CSS class string.
- `requiresStudentDocumentAttention(status)` — returns true for `missing`, `rejected`, etc.
- `isStudentDocumentStatusRecoverable(status)` — true for all except `verified`.

Components using this adapter:
- `src/components/student/RequiredDocumentsList.tsx`
- `src/components/student/DocumentUploadCard.tsx`

### Staff adapter (planned, not yet extracted)

File (future): `src/config/documentStatusDisplay.ts` — a new `STAFF_*` section or a
separate `src/config/staffDocumentStatusDisplay.ts`.

Labels will be extracted from inline logic in `DocumentVerificationPanel` unchanged.
See `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md` Phase SD-1.

Components that will use this adapter:
- `src/components/staff/DocumentVerificationPanel.tsx`

---

## What Is Safe to Share

These aspects of document status display are safe to unify between roles:

| Item | Safe to share | Notes |
|------|--------------|-------|
| Icon mapping (CheckCircle2, RotateCcw, AlertCircle) | Yes | Status-to-icon logic does not carry wording. Can use a shared icon helper. |
| Semantic tone names (success / warning / danger / neutral) | Yes | Tone is an abstract concept, not role-specific copy. |
| `<TokenDisplay>` primitive | Yes | Renders a pre-formatted token string. No role-specific label. |
| `<PrivacyNotice>` wrapper | Yes (wrapper only) | Content must remain separate per role. |

---

## What Must Stay Separated

| Item | Must stay separate | Reason |
|------|-------------------|--------|
| `rejected` label | Staff and student adapters separate | Intentional framing difference. Finalized product decision. |
| `missing` label | Staff and student adapters separate | Intentional framing difference. Finalized product decision. |
| `invalid_file_type` label | Staff and student adapters separate | Intentional tone difference. Finalized product decision. |
| `needs_replacement` label | Staff and student adapters separate | Action framing vs. state framing. |
| `pending` (staff) vs `verification_pending` (student) | Must stay as separate keys | Different type definitions. Backend schema not yet decided. |
| Status formatting functions | Must stay as separate exports | Do not create a generic `getDocumentStatusLabel(role, status, lang)` — this merges the boundary. |

---

## Constraints on Future Staff Adapter Implementation

When Phase SD-1 extracts the staff display adapter, it must:

1. Use a separate config section (`STAFF_DOCUMENT_STATUS_DISPLAY`) — do not extend the
   `STUDENT_DOCUMENT_STATUS_LABELS` object.
2. Export separate functions (`getStaffDocumentStatusLabel`, `getStaffDocumentStatusClassName`).
3. Not import from the student adapter.
4. Not accept a `role` parameter — role-branching inside a single function is the antipattern
   that the adapter separation prevents.

The student adapter must:

1. Not be imported by any staff component.
2. Not be extended with staff-specific keys.
3. Not use `pending` as a key (staff-only key).

---

## Disclosure of Identity: Staff vs Student Framing

Staff disclose student identity to providers. Students are notified when their identity is
disclosed to a matched provider. These are different governance flows:

- Staff: "Approve Disclosure" / "Reject Disclosure" — governance decision language.
- Student: "A provider has been matched" — notification language.

Do not reuse disclosure modal copy for student notification.
Do not reuse student notification copy for staff modal content.

---

## Connection to DRY_SYSTEM_AUDIT.md and DO_NOT_DRY_YET.md

This boundary is enforced by:

- `DO_NOT_DRY_YET.md` items 1, 2, 3, 4 — `rejected`, `missing`, `invalid_file_type`,
  `pending` vs `verification_pending` all kept separate.
- `DRY_SYSTEM_AUDIT.md` Category A — staff inline status functions are a DRY violation,
  but the fix is extraction to a staff-specific adapter, not merging with the student adapter.
- `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md` — ratified staff labels are operational wording.

The wording boundary is not a DRY violation. Two adapters for two audiences are correct
architecture, not repetition.

---

## What Not To Do

- Do not create a single `getDocumentStatusLabel(role, status, lang)` function that
  branches on role — this conflates the two adapters into one coupled function.
- Do not import `getStudentDocumentStatusLabel` in `DocumentVerificationPanel`.
- Do not add student recovery copy to staff tooltips, action labels, or modal copy.
- Do not add staff operational copy to student document cards, requirement lists, or
  recovery prompts.
- Do not unify `pending` and `verification_pending` keys before a backend schema decision.
- Do not use `invalid_file_type` as a staff-initiated action. It is a system classification
  only — staff cannot set it manually and it does not require a reason.
