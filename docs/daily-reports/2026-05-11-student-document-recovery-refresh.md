# Student Document Recovery Refresh Merge Checkpoint

Date: 2026-05-11

## Merge Summary

- Merge commit: `d83cabb`
- Source branch: `design/student-document-recovery-refresh`
- Target branch: `main`
- Merge message: `Merge student document recovery refresh`

## Validation

- Source branch `npm run build`: passed
- Source branch `npm run check:tokens`: passed
- Main branch `npm run build`: passed after merge
- Main branch `npm run check:tokens`: passed after merge

## Routes Affected

- `/student/applications/[applicationId]/documents`
- `/student/applications/[applicationId]`
- `/student/scholarships/[scholarshipId]/apply`

Primary QA routes:

- `/student/applications/app_002/documents`
- `/student/applications/app_002`
- `/student/scholarships/sch_001/apply`

## Screenshots Location

QA screenshots and console review are stored in:

- `docs/qa/student-document-recovery-refresh/desktop/`
- `docs/qa/student-document-recovery-refresh/mobile-375/`
- `docs/qa/student-document-recovery-refresh/th-locale/`
- `docs/qa/student-document-recovery-refresh/states/`
- `docs/qa/student-document-recovery-refresh/console-review.json`
- `docs/qa/student-document-recovery-refresh/README.md`

## Behavior Preserved

This merge preserved:

- route structure
- auth and role guards
- backend/API behavior
- upload behavior
- mock data
- document status keys
- document status logic
- student document status adapter behavior
- staff document verification behavior
- provider, admin, and ESQ flows

The refresh only changed the student-facing presentation for readiness and document recovery.

## Summary

The Student document/application readiness flow now uses a clearer journey model:

- `StudentReadinessPath`
- `DocumentRecoveryPanel`
- `NextBestActionPanel`

The documents page now groups items by what the student can do next, while preserving existing upload cards, status labels, validation messages, and mock interactions.

## Next Recommended Refresh Candidate

Recommended next candidate:

1. Staff Application Detail -> Document Evidence Workbench

Reason:

- Staff application detail currently has strong privacy and document pieces, but evidence, actions, notes, and audit context are split across generic card columns.
- This is a higher-risk workflow than the student refresh, so it should start with a small planning/QA pass before runtime changes.

Other candidates:

2. Provider Candidate Pool -> Candidate Decision Workbench
3. Student Matching Explanation -> Match Reasoning Canvas
