# Staff Document Evidence Workbench SW-1 Summary

Date: 2026-05-11
Branch: `design/staff-document-evidence-workbench-runtime`

## Phase

SW-1 — Layout-only workbench shell around the existing `DocumentVerificationPanel`.

## Route Touched

- `/staff/applications/[id]`

Primary QA routes:

- `/staff/applications/app_001`
- `/staff/applications/app_002`

## Components Created

- `src/components/staff/StaffDocumentEvidenceWorkbench.tsx`

Purpose:

- Provide a staff operations workbench shell.
- Organize existing document evidence, review context, staff operations, and audit awareness.
- Compose existing children and callbacks without owning document action logic.

## Files Modified

- `src/app/staff/applications/[id]/page.tsx`
  - Replaced the previous generic grid/card arrangement with `StaffDocumentEvidenceWorkbench`.
  - Passed the existing `DocumentVerificationPanel` into the evidence zone.
  - Kept existing masked profile, timeline, staff notes, status update, and audit trail behavior.

## Behavior Preserved

Preserved:

- document verification behavior
- document status keys
- mock data
- `onVerify(docId)` callback behavior
- `onReject(docId, reason)` callback behavior
- `onRequestReplacement(docId, message)` callback behavior
- document action button availability
- reason validation behavior
- staff document wording
- student document wording
- identity reveal modal behavior
- staff notes behavior
- application status update behavior
- audit trail display behavior

## Intentionally Not Changed

This phase did not:

- change `DocumentVerificationPanel` internals
- extract action logic
- migrate staff document statuses to a new adapter
- add minimum reason lengths
- add real audit writes
- imply real audit persistence for document actions
- change routes
- change auth or role guards
- change backend/API/export/disclosure/provider/student/admin/ESQ behavior
- change mock data or data shapes

## Audit Awareness Copy

The workbench adds a prototype audit awareness strip with explicit non-persistence wording:

> Document decisions should include clear review notes. Audit logging is currently represented in the prototype UI only.

This is intentionally visual/contextual only.

## QA Routes

- `/staff/applications/app_001`
- `/staff/applications/app_002`

QA should confirm:

- route renders without crashing
- existing document actions still appear
- rejected / needs replacement copy remains staff-operational
- verify/reject/request replacement controls still appear where they did before
- no additional student PII is exposed
- audit strip does not claim real persistence
- mobile and Thai screenshots are captured before merge

## Rollback Instructions

To rollback:

- Remove `src/components/staff/StaffDocumentEvidenceWorkbench.tsx`.
- Restore `src/app/staff/applications/[id]/page.tsx` to its previous grid layout.
- No data, status, action, callback, or mock rollback is required.

## Known Limitations

- `DocumentVerificationPanel` remains internally card/accordion based.
- Action controls still live inside the existing panel.
- Reason minimum-length policy remains unchanged.
- Audit writing remains mock/prototype-only.
- Screenshot QA is still required before merge.

## Next Phase Recommendation

Recommended next phase after SW-1 review:

SW-2 — Extract `DocumentActionRail` from `DocumentVerificationPanel` while preserving callbacks and action availability.

Do not begin SW-2 until SW-1 visual QA confirms the workbench model.
