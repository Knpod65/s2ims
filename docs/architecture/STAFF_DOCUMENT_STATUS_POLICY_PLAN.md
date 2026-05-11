# Staff Document Status Policy Plan

## Purpose

This document defines the staff-facing document status policy before any runtime migration
of `DocumentVerificationPanel`. It establishes role-specific wording decisions, required reason
rules, missing audit gaps, and the recommended migration sequence.

No runtime changes are made in this document.

---

## Current Staff Document Statuses

Source: `src/components/staff/DocumentVerificationPanel.tsx`

Staff-facing `DocumentVerificationState.status` type union:

```
uploaded | pending | verified | invalid_file_type | rejected | needs_replacement | missing
```

Note: Staff uses `pending` (not `verification_pending`). This is the only key that differs from
the student-facing status union, where the equivalent is `verification_pending`.

---

## Current Staff Status Labels

Defined inline in `DocumentVerificationPanel.tsx` (not yet extracted to config):

| Status key         | EN label            | TH label                    |
|--------------------|---------------------|-----------------------------|
| `uploaded`         | Uploaded            | อัปโหลดแล้ว                  |
| `pending`          | Pending             | รอตรวจสอบ                   |
| `verified`         | Verified            | ยืนยันแล้ว                   |
| `invalid_file_type`| Invalid File Type   | ประเภทไฟล์ไม่ถูกต้อง           |
| `rejected`         | Rejected            | ปฏิเสธแล้ว                   |
| `needs_replacement`| Needs Replacement   | ต้องส่งแทน                   |
| `missing`          | Missing             | ขาดหายไป                    |

These labels are embedded in the component and have not been extracted to
`src/config/documentStatusDisplay.ts`, which is currently student-only.

---

## Current Staff Status Colors / Tones

Defined inline in `DocumentVerificationPanel.tsx`:

| Status key              | Badge class                                         |
|-------------------------|-----------------------------------------------------|
| `verified`              | `bg-status-success/10 text-status-success`          |
| `pending` / `uploaded`  | `bg-role-tint text-role-primary`                    |
| `rejected`              | `bg-status-danger/10 text-status-danger`            |
| `invalid_file_type`     | `bg-status-danger/10 text-status-danger`            |
| `missing`               | `bg-status-danger/10 text-status-danger`            |
| `needs_replacement`     | `bg-status-warning/10 text-status-warning`          |
| default (unrecognized)  | `bg-surface-low text-ink-3 border border-line`      |

The staff badge tones use semantic design tokens correctly (success / danger / warning / role-tint).
This is different from the student config, which uses hardcoded hex color strings.

---

## Current Staff Action Buttons

Three action flows are defined in `DocumentVerificationPanel.tsx`:

### 1. Verify Document

- Button label: EN "✓ Verify Document" / TH "✓ ยืนยันเอกสาร"
- Color: `bg-status-success/10 text-status-success`
- Visible when: `onVerify` prop is present AND `status !== 'verified'`
- Hidden additionally for: `rejected`, `needs_replacement` (implicit via `onVerify` gate)
- Reason required: No
- Audit warning shown: No

### 2. Reject Document

- Button label: EN "Send Rejection" / TH "ส่งการปฏิเสธ"
- Color: `bg-status-danger/10 text-status-danger`
- Visible when: `onReject` prop is present AND `status !== 'rejected'`
- Reason capture: Textarea — placeholder "Please specify reason..." / TH "กรุณาระบุเหตุผล..."
- Disabled if: reason is empty or whitespace-only
- Minimum length enforcement: **None currently** (policy requires 20 characters)
- Audit warning shown: **No currently** (`AuditWarningCard` is imported but not rendered)

### 3. Request Replacement

- Button label: EN "Send Request" / TH "ส่งคำขอ"
- Color: `bg-status-warning/10 text-status-warning`
- Visible when: `onRequestReplacement` prop is present AND `status !== 'rejected'`
- Message capture: Textarea — placeholder "Please specify what is needed..." / TH "กรุณาระบุข้อมูลที่ต้องการ..."
- Disabled if: message is empty or whitespace-only
- Minimum length enforcement: **None currently** (policy requires 20 characters)
- Audit warning shown: **No currently** (`AuditWarningCard` is imported but not rendered)

---

## Where Reason / Audit Is Currently Missing

| Gap | Component | Policy expectation |
|-----|-----------|-------------------|
| No minimum length on rejection reason | `DocumentVerificationPanel` | 20 characters per `SENSITIVE_ACTION_POLICY_PHASE_2E.md` |
| No minimum length on replacement message | `DocumentVerificationPanel` | 20 characters per `SENSITIVE_ACTION_POLICY_PHASE_2E.md` |
| `AuditWarningCard` imported but not rendered | `DocumentVerificationPanel` | Should be shown before rejection and replacement |
| No character counter displayed | `DocumentVerificationPanel` | Present in `RoleAssignmentPanel`, missing here |
| Audit trail in application detail is decorative | `src/app/staff/applications/[id]/page.tsx` | Shows `mockAuditEvents` but no real write occurs |

---

## Student vs Staff Wording Differences

This distinction is intentional and must be preserved:

| Data key            | Student-facing label    | Staff-facing label    | Rationale |
|---------------------|-------------------------|-----------------------|-----------|
| `rejected`          | "Needs replacement"     | "Rejected"            | Student sees recovery instruction; staff sees operational status |
| `missing`           | "Ready to add"          | "Missing"             | Student sees invitation; staff sees compliance gap |
| `invalid_file_type` | "Unsupported file type" | "Invalid File Type"   | Student sees user-error framing; staff sees technical classification |
| `verification_pending` | "Verification pending" | (uses `pending`)   | Different key names; same concept; must not be merged yet |
| `needs_replacement` | "Replace file"          | "Needs Replacement"   | Student sees action; staff sees document state |
| `verified`          | "Verified"              | "Verified"            | Same — no distinction needed |
| `uploaded`          | "Uploaded"              | "Uploaded"            | Same — no distinction needed |

---

## Recommended Staff-Facing Labels (Ratified)

No label changes recommended for staff. Current inline labels are accurate for staff-operational use.
The migration goal is extraction to config, not label change.

Recommended staff config output (future `documentStatusDisplay.ts` extension):

| Status key          | EN label             | TH label                    | Tone     |
|---------------------|----------------------|-----------------------------|----------|
| `uploaded`          | Uploaded             | อัปโหลดแล้ว                  | neutral  |
| `pending`           | Pending Review       | รอตรวจสอบ                   | neutral  |
| `verified`          | Verified             | ยืนยันแล้ว                   | success  |
| `invalid_file_type` | Invalid File Type    | ประเภทไฟล์ไม่ถูกต้อง           | danger   |
| `rejected`          | Rejected             | ปฏิเสธแล้ว                   | danger   |
| `needs_replacement` | Needs Replacement    | ต้องส่งแทน                   | warning  |
| `missing`           | Missing              | ขาดหายไป                    | danger   |

---

## Recommended Student-Facing Labels (Confirmed from Phase 1)

Already in `src/config/documentStatusDisplay.ts`. No changes needed.

| Status key            | EN label             | TH label                |
|-----------------------|----------------------|-------------------------|
| `missing`             | Ready to add         | เพิ่มเอกสารได้            |
| `uploading`           | Uploading            | กำลังอัปโหลด              |
| `uploaded`            | Uploaded             | อัปโหลดแล้ว               |
| `invalid_file_type`   | Unsupported file type| ชนิดไฟล์ไม่รองรับ         |
| `verification_pending`| Verification pending | รอตรวจสอบ               |
| `verified`            | Verified             | ตรวจสอบแล้ว              |
| `rejected`            | Needs replacement    | ควรอัปโหลดใหม่            |
| `needs_replacement`   | Replace file         | ควรแทนที่ไฟล์             |

---

## `rejected` vs `needs_replacement` Distinction

These two status keys must remain separate:

| | `rejected` | `needs_replacement` |
|---|---|---|
| Set by | Staff (manual action) | Staff (manual action) |
| Meaning | Staff has formally rejected the document | Staff has requested a new file be submitted |
| Student display | "Needs replacement" (recovery-oriented) | "Replace file" |
| Staff display | "Rejected" | "Needs Replacement" |
| Reason required | Yes (min 20 chars) | Yes (min 20 chars) |
| Can be followed by re-upload | Yes | Yes |
| Audit implication | Higher severity — formal rejection | Lower severity — guidance request |
| Action gate | Hides Verify and Reject buttons | Hides Reject button only |

Do not collapse these two statuses. They carry different governance weights.

---

## `invalid_file_type`: Validation State or Review State

Decision: **Validation/display state only** — not a staff-initiated review action.

- Set by: system/upload validation, not staff action
- Staff cannot set this status manually via current panel
- Displayed to staff as read-only diagnostic information
- Should not require a reason field
- Should not trigger `AuditWarningCard`
- Audit log is still useful if system sets this status (but no staff-reason needed)

This decision was established in the student adapter phase and carries forward to staff display.

---

## `pending` vs `verification_pending` Decision

Decision: **Keep separate with separate keys per role surface**.

- Staff data model uses `pending` (in `DocumentVerificationState`)
- Student data model uses `verification_pending` (in `StudentDocumentState`)
- Both describe "awaiting staff review" but come from different type definitions
- Do not unify the keys in this phase
- A future backend-backed schema may unify them, but that is out of scope for renovation
- Display adapters should handle each key independently per role surface

---

## Which Actions Require Reason

| Action | Reason required | Minimum length | Who provides |
|--------|----------------|----------------|--------------|
| Staff marks verified | No (optional reviewer note) | n/a | Staff |
| Staff marks rejected | **Yes** | 20 characters | Staff |
| Staff marks needs_replacement | **Yes** | 20 characters | Staff |
| System marks invalid_file_type | No | n/a | System |
| Student uploads from missing | No | n/a | n/a |
| Student re-uploads after rejection | No | n/a | n/a |

---

## Which Actions Require Audit Warning

| Action | `AuditWarningCard` required | Tone |
|--------|-----------------------------|------|
| Staff marks rejected | **Yes** | Warning (amber) |
| Staff marks needs_replacement | **Yes** | Warning (amber) |
| Staff marks verified | No | — |
| System marks invalid_file_type | No | — |

---

## Which Actions Should Compose Future `ReasonRequiredModal`

Per `REASON_REQUIRED_MODAL_PROPOSAL_PHASE_2E.md`, document actions are Phase 3:

| Action | Modal candidate | Risk level |
|--------|----------------|------------|
| Staff marks rejected | Yes — should use `ReasonRequiredModal` when built | Medium |
| Staff marks needs_replacement | Yes — should use `ReasonRequiredModal` when built | Medium |
| Staff marks verified | No — no reason needed | — |

The current inline textarea pattern is acceptable until the shared modal is implemented.

---

## Which Actions Should Stay Mock-Only for Now

All three action callbacks (`onVerify`, `onReject`, `onRequestReplacement`) are currently mock-only:
- Parent page (`/staff/applications/[id]/page.tsx`) shows toast notifications only
- No backend write occurs
- Audit trail shown on the page uses static `mockAuditEvents`

These must remain mock-only until:
- A real API layer exists
- Real audit event writing is approved
- Staff access/session auth is real

No action needed now. Document this expectation only.

---

## Risks Before Runtime Migration of Staff Display

| Risk | Description | Mitigation |
|------|-------------|------------|
| Staff label changes are visible | Any label change will change what staff see in the panel | Extract first, verify labels match current inline values exactly |
| `AuditWarningCard` being wired | Adding the warning card changes the UI visually | Plan a separate UI phase; do not add it in the display extraction phase |
| Min-length enforcement on reasons | Adding min-length validation changes staff's ability to submit with short reasons | Plan a separate governance phase; do not add in display extraction phase |
| `pending` vs `verification_pending` key mismatch | If the wrong key is passed between student and staff contexts, documents may appear invisible | Keep display adapters strictly role-namespaced |
| Staff badge color changes | Switching from inline classes to config-driven classes could cause visual drift | Audit computed class output before and after |

---

## Safest Future Migration Sequence for Staff Display

### Phase SD-1 (Next): Extract staff display config (display-only, no behavior change)

- Create `STAFF_DOCUMENT_STATUS_DISPLAY` config entry in `src/config/documentStatusDisplay.ts`
- Extract labels, colors, icons to config
- Wire `DocumentVerificationPanel` to use config functions
- No action gating changes
- No reason validation changes
- No `AuditWarningCard` wiring
- Build passes, screenshot QA confirms labels/colors match current

### Phase SD-2: Add `AuditWarningCard` to rejection and replacement flows

- Wire `AuditWarningCard` before the reason textarea in rejection and replacement flows
- Visually adds amber warning block — UI change, but no behavior change
- Requires screenshot QA

### Phase SD-3: Add minimum length enforcement and character counter

- Add 20-character minimum validation for rejection reason and replacement message
- Add character counter display
- Consistent with `RoleAssignmentPanel` pattern already in codebase
- Behavioral change — staff cannot submit rejection with fewer than 20 characters
- Requires product/stakeholder sign-off before implementation

### Phase SD-4: Wire `ReasonRequiredModal` (future, shared modal available)

- Replace inline textarea flows with shared `ReasonRequiredModal`
- Only after the modal is built and approved in Phase 2E roadmap

### Phase SD-5: Backend / real audit write (out of renovation scope)

- Out of scope until real API layer exists
