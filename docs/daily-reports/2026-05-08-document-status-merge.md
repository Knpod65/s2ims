# Document Status Planning — Merge Checkpoint

**Date:** 2026-05-08
**Merge commit:** `84be15e`
**Source branch:** `renovation/document-status-planning`
**Target branch:** `main`

---

## What was merged

**Architecture & planning docs (5 files):**
- `docs/architecture/DOCUMENT_STATUS_MIGRATION_PLAN.md` — full migration strategy for document status display
- `docs/architecture/DOCUMENT_STATUS_STUDENT_ADAPTER_PHASE_1.md` — student-facing status display adapter design
- `docs/architecture/DOCUMENT_STATUS_STUDENT_UPLOAD_CARD_PHASE_2.md` — DocumentUploadCard display migration plan
- `docs/architecture/DOCUMENT_STATUS_BRANCH_REVIEW.md` — branch review package
- `docs/architecture/DOCUMENT_STATUS_MERGE_CHECKLIST.md` — merge readiness checklist

**QA screenshots (5 files):**
- `docs/qa/document-status-student-adapter/` — visual review of student document status adapter across application detail, apply required documents, document upload checklist (EN + TH), and scholarship detail views

**Source files (3 files):**
- `src/config/documentStatusDisplay.ts` — centralised student-facing status display config (label, color, description)
- `src/components/student/RequiredDocumentsList.tsx` — migrated to use display adapter
- `src/components/student/DocumentUploadCard.tsx` — migrated to use display adapter

---

## Validations passed

| Check | Branch | Main |
|---|---|---|
| `npm run build` | PASS | PASS |
| `npm run check:tokens` | PASS | PASS |

No type errors. No lint errors. All 40 static pages generated cleanly.

---

## Intentionally not changed

- `DocumentVerificationPanel` (staff-facing) — untouched
- Routes, auth, and role guards — untouched
- Backend data keys and API contracts — untouched
- Upload behavior — untouched
- Validation behavior — untouched
- Export and disclosure logic — untouched
- `pending` and `verification_pending` remain separate states
- `invalid_file_type` remains a UI validation/display state only
- Student-facing `rejected` maps to recovery-oriented label ("Needs replacement"), not changed

---

## Recommended next step

Begin Phase 3 of the document status migration: extend the display adapter to cover staff-facing views (excluding `DocumentVerificationPanel` until explicitly scoped), and confirm that `pending` vs `verification_pending` distinction is rendered correctly across all student application flows.
