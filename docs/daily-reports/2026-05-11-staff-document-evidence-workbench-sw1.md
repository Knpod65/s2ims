# Staff Document Evidence Workbench SW-1 Merge Checkpoint

## Overview

Merged `design/staff-document-evidence-workbench-runtime` into `main`.

This completes Phase SW-1 of the Staff Document Evidence Workbench refresh.

## Merge Result

- Source branch: `design/staff-document-evidence-workbench-runtime`
- Target branch: `main`
- Merge commit: `92b705b`
- Conflict status: no conflicts
- Push result: pushed to `origin/main`

## Validation

Before merge on source branch:

- `npm run build`: passed
- `npm run check:tokens`: passed
- `/staff/applications/app_001`: 200 OK
- `/staff/applications/app_002`: 200 OK

After merge on main:

- `npm run build`: passed
- `npm run check:tokens`: passed
- `/staff/applications/app_001`: 200 OK
- `/staff/applications/app_002`: 200 OK

## Scope Summary

This merge adds the SW-1 layout-only Staff Document Evidence Workbench shell.

Included changes:

- Added `StaffDocumentEvidenceWorkbench`.
- Reorganized Staff application detail into evidence, review context, and audit awareness zones.
- Preserved existing `DocumentVerificationPanel` behavior.
- Added QA screenshots and README.
- Added SW-1 implementation summary.

## Files Added

- `src/components/staff/StaffDocumentEvidenceWorkbench.tsx`
- `docs/design/STAFF_DOCUMENT_EVIDENCE_WORKBENCH_SW1_SUMMARY.md`
- `docs/qa/staff-document-evidence-workbench-sw1/README.md`
- `docs/qa/staff-document-evidence-workbench-sw1/desktop/`
- `docs/qa/staff-document-evidence-workbench-sw1/mobile-375/`
- `docs/qa/staff-document-evidence-workbench-sw1/th-locale/`
- `docs/qa/staff-document-evidence-workbench-sw1/states/`

## Files Modified

- `src/app/staff/applications/[id]/page.tsx`

## Behavior Preserved

This merge did not change:

- `DocumentVerificationPanel` internals
- Document status keys
- Mock data
- Verify/reject/request replacement callbacks
- Button availability
- Reason validation
- Staff document wording
- Student document wording
- Auth or role guards
- Backend/API behavior
- Disclosure/export behavior
- Provider/student/admin/ESQ workflows
- Audit persistence

## Governance Notes

- No new student PII was exposed.
- Staff wording remains operational and separate from Student recovery wording.
- Audit awareness remains visual/prototype-only and does not imply real persisted audit logging.
- Staff document status adapter migration was not implemented in this PR.
- SW-2 has not started.

## QA Evidence

QA screenshots and review notes are available under:

- `docs/qa/staff-document-evidence-workbench-sw1/`

QA covered:

- Desktop
- Mobile 375px
- Thai locale
- Verified document state
- Rejected document state
- Needs replacement state
- Audit awareness copy

Console review from the PR branch found:

- No runtime crash
- No duplicate key warnings
- No unsupported `use(params)` errors
- No hydration errors
- No new missing chunk errors

## Recommended Next Step

Do not start SW-2 immediately without approval.

Recommended next options:

1. SW-2 planning only — Extract Document Action Rail Plan.
2. Staff document status adapter planning.
3. Shared `ReasonRequiredModal` planning.

Recommended safest next step:

SW-2 planning only, because extracting action logic touches sensitive staff review behavior.

## Final Status

- Final branch: `main`
- Working tree: clean
- `main` synced with `origin/main`: yes
- SW-1 complete: yes
- SW-2 started: no
