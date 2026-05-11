# Student Document Recovery Refresh Summary

Date: 2026-05-11
Branch: `design/student-document-recovery-refresh`

## Scope

This runtime UI refresh is the first small implementation slice after the UI Pattern Fatigue Audit. It focuses only on student document recovery and application readiness surfaces.

## Routes Touched

- `/student/applications/[applicationId]/documents`
- `/student/applications/[applicationId]`
- `/student/scholarships/[scholarshipId]/apply`

Primary QA IDs:
- `applicationId`: `app_002`
- `scholarshipId`: `sch_001`

## Components Created

- `StudentReadinessPath`
  - Reframes readiness as a journey/path instead of summary cards.
  - Uses existing document state and missing-data inputs.
  - Does not change readiness calculation or data keys.

- `DocumentRecoveryPanel`
  - Groups documents into action-oriented sections:
    - ready to add or replace
    - uploaded or pending review
    - ready for this application
  - Reuses `DocumentUploadCard` so upload controls, status labels, icons, validation messages, and progress behavior remain unchanged.
  - Uses the existing student document status adapter.

- `NextBestActionPanel`
  - Provides a single recommended next-step surface.
  - Keeps existing links, buttons, and callbacks supplied by the route.

## Components Modified

- `src/components/student/index.ts`
  - Exports the new student pattern components.

- `src/app/student/applications/[applicationId]/documents/page.tsx`
  - Replaced the generic summary card and flat upload checklist framing with:
    - `StudentReadinessPath`
    - `DocumentRecoveryPanel`
    - `NextBestActionPanel`
  - Preserved the existing save-draft toast callback and mock upload button.

- `src/app/student/applications/[applicationId]/page.tsx`
  - Added readiness journey framing.
  - Replaced the passive missing-document alert with a recovery-focused next action.
  - Preserved application status logic, document link behavior, and timeline rendering.

- `src/app/student/scholarships/[scholarshipId]/apply/page.tsx`
  - Replaced the generic readiness card with `StudentReadinessPath`.
  - Added a next-step panel for draft creation while preserving the existing draft link.
  - Preserved `RequiredDocumentsList`, eligibility confirmation, and privacy surfaces.

## Behavior Preserved

- No routes changed.
- No auth, role guard, backend, export, disclosure, staff, provider, or admin behavior changed.
- No mock data changed.
- No document status keys changed.
- No upload behavior changed.
- No document validation behavior changed.
- Student-facing document labels continue to come from `src/config/documentStatusDisplay.ts`.
- `DocumentUploadCard` remains the source for upload controls, progress, unsupported-file messaging, attention buttons, and status icons.
- Existing button callbacks and links were preserved.

## Design Audit Rules Applied

- Reduced generic card stacking on the document management route.
- Reframed readiness as a journey/path.
- Grouped document recovery by what the student can do next.
- Used Aurora Blue for active progress and primary action emphasis, not decoration only.
- Kept one recommended next action visible.
- Used supportive student language.
- Kept privacy notices and document status wording intact.

## QA Routes

- `/student/applications/app_002/documents`
- `/student/applications/app_002`
- `/student/scholarships/sch_001/apply`

## Screenshots Required

Recommended screenshot QA before merge:

- Desktop and mobile: `/student/applications/app_002/documents`
- Desktop and mobile: `/student/applications/app_002`
- Desktop and mobile: `/student/scholarships/sch_001/apply`
- Thai language pass for document status wrapping and next-action copy.

## Known Limitations

- This slice does not redesign the broader student dashboard or recommendations pages.
- `DocumentUploadCard` still uses its previous card styling internally to preserve behavior and minimize risk.
- The upload flow remains mock-only.
- The apply page still keeps the existing sticky draft action to preserve current navigation behavior.

## Rollback Notes

Rollback is low-risk:

- Remove the three new components.
- Restore the three touched route layouts to their previous card/checklist structure.
- Remove the new component exports from `src/components/student/index.ts`.
- No data, route, adapter, or upload-state rollback is required.
