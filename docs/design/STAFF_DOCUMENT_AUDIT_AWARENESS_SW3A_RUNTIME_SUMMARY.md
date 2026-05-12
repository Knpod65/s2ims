# Staff Document Audit Awareness — SW-3A Runtime Summary

Date: 2026-05-11
Branch: `design/staff-document-audit-awareness-runtime`
Phase: SW-3A runtime implementation

---

## What Changed

### A — `DocumentVerificationPanel.tsx`

Added prototype-safe `AuditWarningCard` to two action zones.

**Rejection zone** (inside the `rejectingDocId === doc.id` branch, before the reject label):

```tsx
<AuditWarningCard
  title={lang === 'th' ? 'การตรวจสอบการปฏิเสธเอกสาร' : 'Document rejection review'}
  message={lang === 'th'
    ? 'ต้นแบบนี้บันทึกเหตุผลของเจ้าหน้าที่ใน UI เท่านั้น การบันทึก audit จริงยังไม่ได้เชื่อมต่อ กรุณาระบุเหตุผลที่ชัดเจนและเหมาะสมสำหรับการตรวจสอบในอนาคต'
    : 'This prototype captures the staff reason in the UI flow, but real audit-log persistence is not connected yet. Keep the reason clear, factual, and appropriate for future audit review.'}
/>
```

The card appears when the staff clicks "Reject Document" to open the form. It is not
shown before the form is opened or on documents that are already rejected.

**Replacement request zone** (before the replacement label, always shown when the action
zone is visible):

```tsx
<AuditWarningCard
  title={lang === 'th' ? 'การตรวจสอบคำขอส่งแทน' : 'Replacement request review'}
  message={lang === 'th'
    ? 'ต้นแบบนี้บันทึกข้อความของเจ้าหน้าที่ใน UI เท่านั้น การบันทึก audit จริงยังไม่ได้เชื่อมต่อ กรุณาระบุคำขอที่เจาะจงและดำเนินการได้สำหรับนักศึกษา'
    : 'This prototype captures the staff message in the UI flow, but real audit-log persistence is not connected yet. Keep the request specific, factual, and student-actionable.'}
/>
```

`requiresReason` prop was NOT passed to either card. That prop's copy ("This action is
logged and auditable") implies real persistence which does not yet exist. See
`STAFF_DOCUMENT_AUDIT_COPY_GUIDE.md` for the full banned-copy list.

### B — `DocumentActionRail.tsx`

Removed the rail-level amber prototype audit awareness strip. This strip appeared at the
bottom of the `DocumentActionRail` card and was duplicating page-level audit awareness
already provided by the `StaffDocumentEvidenceWorkbench` SW-1 strip. With per-action
`AuditWarningCard` now present inside `DocumentVerificationPanel`, the rail strip was no
longer the closest governance signal to the action.

Also removed the `AlertTriangle` import from `lucide-react`, which was only used by the
removed strip. The rail retains its header, count chips, and per-doc guidance rows.

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/staff/DocumentVerificationPanel.tsx` | Added `AuditWarningCard` to rejection zone and replacement zone |
| `src/components/staff/DocumentActionRail.tsx` | Removed rail-level amber strip; removed unused `AlertTriangle` import |

---

## Why Prototype-Safe Copy Was Used

Real audit writes are not implemented. When staff reject a document or request replacement,
the `onReject(docId, reason)` and `onRequestReplacement(docId, message)` callbacks fire a
toast notification only — no event is written to any audit store.

Using copy that says "this action is logged" or "this is recorded in the audit trail"
would be factually incorrect and could mislead staff or reviewers into believing audit
persistence exists before it does.

The copy used instead:
- Describes what the prototype captures ("captures the staff reason in the UI flow")
- Explicitly states the gap ("real audit-log persistence is not connected yet")
- Gives actionable guidance ("Keep the reason clear, factual, and appropriate for future
  audit review")

This pattern follows `STAFF_DOCUMENT_AUDIT_COPY_GUIDE.md` Section 1 (Approved
Prototype-Safe Copy) and Section 3 (How to Phrase "Should Be Auditable" Without Saying
"Logged").

---

## What Was Intentionally Not Changed

| Item | Status |
|------|--------|
| `onReject(doc.id, reason)` callback | Unchanged |
| `onRequestReplacement(doc.id, message)` callback | Unchanged |
| `onVerify(doc.id)` callback | Unchanged |
| Reject form open/close behavior (`rejectingDocId` state) | Unchanged |
| Textarea value handling, `onChange` | Unchanged |
| Cancel behavior | Unchanged |
| Send Rejection / Send Request disabled conditions | Unchanged |
| Minimum reason length | Unchanged (still absent — deferred to SW-3B/SD-3) |
| Document status keys | Unchanged |
| Mock data | Unchanged |
| Staff document status labels and wording | Unchanged |
| Student document wording | Unchanged |
| Staff/Student wording boundary | Maintained |
| `ReasonRequiredModal` | Not introduced |
| `DocumentActionRail` counts and guidance rows | Unchanged |
| `StaffDocumentEvidenceWorkbench` SW-1 amber strip | Unchanged |
| Real audit persistence | Not implemented |
| Routes, auth, role guards | Unchanged |
| Backend/API, export, disclosure, provider/student/admin/ESQ | Unchanged |

---

## Amber Strip State After SW-3A

| Strip | Status | Location |
|-------|--------|----------|
| SW-1 workbench-level strip | Retained — always visible | `StaffDocumentEvidenceWorkbench.tsx` |
| SW-2A rail-level strip | Removed in this phase | Was: `DocumentActionRail.tsx` bottom |
| SW-3A rejection `AuditWarningCard` | Added — visible when reject form open | `DocumentVerificationPanel.tsx` |
| SW-3A replacement `AuditWarningCard` | Added — visible when action zone rendered | `DocumentVerificationPanel.tsx` |

Net result: one always-visible strip (workbench) + per-action cards visible during
action flow only. Maximum simultaneous amber: workbench strip + one expanded per-action
card = two amber zones. Amber fatigue is reduced from the three-zone state that would
have existed without consolidation.

---

## Behavior Preserved

- All document actions (verify, reject, request replacement) continue to work identically.
- Reject form stays open while typing (persisted from bugfix branch `3d23678`).
- Cancel clears draft and closes reject form.
- AuditWarningCard is visually informational only — no state or validation logic is tied to it.
- DocumentActionRail remains informational-only: no buttons, no callbacks.

---

## Validation Results

- `npm run build`: PASS — 40 routes, 0 type errors
- `npm run check:tokens`: PASS — 4/4
- `/staff/applications/app_001`: 200 OK
- `/staff/applications/app_002`: 200 OK
- Dev server log: no errors, no warnings, no hydration errors, no duplicate key warnings

---

## Known Remaining Limitations

| Item | Status |
|------|--------|
| Real audit writes for rejection | Not implemented — prototype UI only |
| Real audit writes for replacement | Not implemented — prototype UI only |
| Minimum reason length for rejection | Not enforced — deferred to SW-3B/SD-3 |
| Minimum reason length for replacement | Not enforced — deferred to SW-3B/SD-3 |
| Per-action governance modals | Not introduced — deferred to Option B planning |
| `ReasonRequiredModal` shared primitive | Not introduced — blocked by `DO_NOT_DRY_YET.md` items 9–10 |
| Staff document status display adapter | Not extracted — deferred to SD-1 |

---

## Recommended Next Phase

**SW-3B / SD-3 — Add 20-character minimum to rejection and replacement reason fields.**

Prerequisites:
- Product/stakeholder sign-off on uniform minimum character length.
- Consistent policy across all reason-capture surfaces
  (`DisclosureRejectionModal` currently 15, `MatchOverrideModal` currently 20).

Do not start SW-3B automatically. Requires explicit approval.

The SD-1 (staff display adapter extraction) may be approached in parallel as it is
display-only and does not touch action/validation behavior.
