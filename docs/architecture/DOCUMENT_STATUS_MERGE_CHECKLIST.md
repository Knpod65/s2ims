# Document Status Merge Checklist

Branch: `renovation/document-status-planning`
Date: 2026-05-11

## Pre-Merge Steps

- Pull the latest `main` branch.
- Rebase or merge this branch onto the updated `main` if required by the review process.
- Run the project validation checks before merge.

## Validation

- `npm run build`
- `npm run check:tokens`

Both checks must pass before merging.

## Smoke Routes

Verify the following routes in a student session:

- `/student/scholarships/sch_001`
- `/student/scholarships/sch_001/apply`
- `/student/applications/app_002`
- `/student/applications/app_002/documents`

## Student Document Label Checks

Confirm the student-facing document states render with the intended wording:

- `rejected` uses recovery wording, not a hard rejection label.
- `needs_replacement` uses recovery wording.
- `invalid_file_type` uses validation-oriented wording.
- `verification_pending` uses pending-review wording.

## Staff Verification Check

- Confirm staff document verification remains unchanged.
- Confirm staff `DocumentVerificationPanel` behavior and wording are untouched.

## Scope Guardrails

- No route changes.
- No auth or role-guard changes.
- No backend, API, or database changes.
- No disclosure, export, or upload-behavior changes.
- No document data key changes.

## Merge Readiness

- Build passes.
- Token format checks pass.
- Student document status wording is verified.
- Staff document verification remains unchanged.
