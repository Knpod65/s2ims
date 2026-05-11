# Document Status Branch Review

Date: 2026-05-11
Branch: `renovation/document-status-planning`
Scope: document status planning branch review package.

## Branch Purpose

This branch centralizes student-facing document status display while preserving existing runtime behavior, role boundaries, and internal status keys. The work intentionally keeps staff document verification separate and avoids changing upload behavior, route structure, auth/role guards, exports, disclosure, or backend behavior.

## Commits Included

- `f4e8e87` `docs(architecture): plan document status migration`
- `f7b473f` `refactor(status): add student document status display adapter`
- `e715ff5` `docs(qa): review student document status adapter`
- `2bd1fd6` `refactor(status): migrate student document upload card display`

## Files Created Or Modified

Key branch files and artifacts:

- `docs/architecture/DOCUMENT_STATUS_MIGRATION_PLAN.md`
- `src/config/documentStatusDisplay.ts`
- `src/components/student/RequiredDocumentsList.tsx`
- `src/components/student/DocumentUploadCard.tsx`
- `docs/architecture/DOCUMENT_STATUS_STUDENT_ADAPTER_PHASE_1.md`
- `docs/architecture/DOCUMENT_STATUS_STUDENT_UPLOAD_CARD_PHASE_2.md`
- `docs/qa/document-status-student-adapter/application-detail-documents.png`
- `docs/qa/document-status-student-adapter/apply-required-documents.png`
- `docs/qa/document-status-student-adapter/document-upload-checklist-th.png`
- `docs/qa/document-status-student-adapter/document-upload-checklist.png`
- `docs/qa/document-status-student-adapter/scholarship-detail-required-documents.png`

## What Changed

### Document status migration plan

The planning doc established the safe migration sequence, the product wording constraints, and the separation between student-facing display changes and staff verification behavior. It also documented the status-key overlap between student and staff surfaces so the runtime adapter could stay role-aware instead of normalizing data keys too early.

### Student document status display adapter

A shared student adapter was introduced in `src/config/documentStatusDisplay.ts` so student labels, badge class names, and attention/recoverability rules can be reused without changing the underlying document state model.

### RequiredDocumentsList migration

The student required-documents list was moved onto the shared adapter for label and badge styling, while preserving the same icon set, progress behavior, invalid-file helper, and action-button visibility.

### DocumentUploadCard migration

The student upload card now renders the same student status display through the shared adapter and keeps the existing upload button, progress helper, invalid-file display, and recovery-oriented action copy.

### QA / visual review result

The student routes were visually reviewed and no visual differences were found in the migrated surfaces.

## What Was Intentionally Not Changed

- Staff `DocumentVerificationPanel`
- Document data keys
- Upload behavior
- Validation behavior
- Routes
- Auth and role guards
- Exports
- Disclosure behavior
- Backend/API/database behavior
- Student readiness counts and application summary logic

## Product Wording Decisions

- Student `rejected` uses recovery wording, not an operational rejection label, so students see `Needs replacement` / `ควรอัปโหลดใหม่`.
- Staff `rejected` remains operational and untouched.
- `pending` and `verification_pending` remain separate because they describe different product surfaces and should not be merged implicitly.
- `invalid_file_type` remains a UI validation/display state rather than a data-model change.

## Validation

- `npm run build`
- `npm run check:tokens`

Both checks passed on this branch.

## Visual Review

Routes reviewed:

- `/student/applications/app_002/documents`
- `/student/applications/app_002`
- `/student/scholarships/sch_001/apply`

Outcome:

- No visual differences found in the migrated student document upload card flow.
- Screenshots were not added in this package; existing QA artifacts already live under `docs/qa/document-status-student-adapter/`.

## Risks / Next Decisions

- Staff document verification still uses its own local styling and operational wording, so any future staff adapter work should remain separate.
- `pending` versus `verification_pending` still needs a product decision before any key normalization or data migration.
- Additional migration work should not reuse student wording assumptions for staff surfaces.

## Reviewer Checklist

- Confirm the student upload card still shows the same labels, icons, and helper text.
- Confirm `rejected` reads as recovery wording for students.
- Confirm `needs_replacement` and `invalid_file_type` still use recovery and validation wording respectively.
- Confirm `verification_pending` still reads as pending review, not as a final decision.
- Confirm the upload button, progress indicator, and validation helper still behave as before.
- Confirm staff verification UI is unchanged.
- Confirm build and token checks passed.

## Suggested Merge Strategy

Merge this branch as a documentation-backed, behavior-preserving review package. Keep staff verification and any key-model changes for a separate follow-up branch after product wording and severity rules are explicitly approved.
