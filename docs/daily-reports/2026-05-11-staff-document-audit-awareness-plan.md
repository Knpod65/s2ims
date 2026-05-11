# Staff Document Audit Awareness Planning Merge Checkpoint

## Overview

Merged `design/staff-document-audit-awareness-plan` into `main`.

This completes the SW-3A planning package for Staff document audit awareness placement.

## Merge Result

- Source branch: `design/staff-document-audit-awareness-plan`
- Target branch: `main`
- Merge commit: `da40fe5`
- Conflict status: no conflicts
- Push result: pushed to `origin/main`

## Validation

Before merge on source branch:

- `npm run build`: passed — 40 routes, 0 type errors
- `npm run check:tokens`: passed — 4/4

After merge on main:

- `npm run build`: passed — 40 routes, 0 type errors
- `npm run check:tokens`: passed — 4/4

## Files Added

- `docs/design/STAFF_DOCUMENT_AUDIT_AWARENESS_SW3A_PLAN.md`
- `docs/design/STAFF_DOCUMENT_AUDIT_COPY_GUIDE.md`
- `docs/design/STAFF_DOCUMENT_AMBER_STRIP_CONSOLIDATION_PLAN.md`

## Key Planning Decisions

- SW-3A should add `AuditWarningCard` above rejection and replacement textareas.
- SW-3A should use prototype-safe copy only.
- SW-3A should not pass `requiresReason` because its current copy implies real persisted audit logging.
- SW-3A should keep reason validation unchanged.
- SW-3A should not introduce shared `ReasonRequiredModal`.
- SW-3A should reduce duplicate amber warning clutter.
- The reject form disappearing issue should be fixed in a separate bugfix branch before SW-3A runtime.

## Explicit Non-Goals

This merge did not:

- Modify runtime code
- Render `AuditWarningCard`
- Fix the reject form bug
- Change reason validation
- Add minimum reason length
- Add shared `ReasonRequiredModal`
- Add real audit persistence
- Change document status keys
- Change Staff wording
- Change Student wording
- Change mock data
- Change routes/auth/backend/API/export/disclosure behavior

## Recommended Next Step

Do not start SW-3A runtime immediately.

Recommended next branch:

`bugfix/staff-document-reject-form-persistence`

Purpose:

Fix the reject form disappearing issue in `DocumentVerificationPanel` before adding audit warnings near the reject textarea.

After that bugfix is validated and merged, create:

`design/staff-document-audit-awareness-runtime`

for SW-3A runtime implementation.

## Final Status

- Final branch: `main`
- Working tree: clean
- `main` synced with `origin/main`: yes
- SW-3A planning merged: yes
- SW-3A runtime started: no
