# Staff Document Reject Form Persistence Bugfix Merge Checkpoint

## Overview

Merged `bugfix/staff-document-reject-form-persistence` into `main`.

This bugfix resolves the issue where the Staff document rejection form disappeared after the user started typing a rejection reason.

## Merge Result

- Source branch: `bugfix/staff-document-reject-form-persistence`
- Target branch: `main`
- Merge commit: `a11d78a`
- Conflict status: no conflicts
- Push result: pushed to `origin/main`

## Root Cause

The reject form visibility was tied to whether `rejectReason[doc.id]` was empty.

When the user typed into the textarea, `rejectReason[doc.id]` became non-empty, causing the reject form to disappear.

## Fix Summary

Added explicit local UI state:

`rejectingDocId`

The reject form now:

- opens after clicking `Reject Document`
- stays open while typing
- closes on Cancel
- closes after successful rejection
- preserves the existing `onReject(doc.id, reason)` callback

## Validation

Before merge on source branch:

- `npm run build`: passed — 40 routes, 0 type errors
- `npm run check:tokens`: passed — 4/4
- `/staff/applications/app_001`: 200 OK
- `/staff/applications/app_002`: 200 OK

After merge on main:

- `npm run build`: passed — 40 routes, 0 type errors
- `npm run check:tokens`: passed — 4/4
- `/staff/applications/app_001`: 200 OK
- `/staff/applications/app_002`: 200 OK

## Files Changed

- `src/components/staff/DocumentVerificationPanel.tsx`
- `docs/design/STAFF_DOCUMENT_REJECT_FORM_PERSISTENCE_BUGFIX.md`

## Behavior Preserved

This merge did not change:

- `onReject` callback behavior
- replacement request flow
- verify flow
- document status keys
- mock data
- staff wording
- student wording
- routes
- auth
- backend/API behavior
- export/disclosure behavior
- reason validation minimum length

## Explicit Non-Goals

This merge did not:

- Add `AuditWarningCard`
- Start SW-3A runtime
- Add real audit persistence
- Introduce `ReasonRequiredModal`
- Add minimum reason length
- Change sensitive action policy
- Change document status display adapter logic

## Recommended Next Step

Now SW-3A runtime can begin on a separate branch:

`design/staff-document-audit-awareness-runtime`

SW-3A should be limited to:

- adding prototype-safe `AuditWarningCard` placement for rejection/replacement flows
- removing or softening duplicate amber warning strips
- keeping reason validation unchanged

## Final Status

- Final branch: `main`
- Working tree: clean
- `main` synced with `origin/main`: yes
- Reject form bugfix merged: yes
- SW-3A runtime started: no
