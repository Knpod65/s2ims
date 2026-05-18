# S2IMS Candidate Review Demo Feedback Backlog Preview Route Safety Checklist MC32

## Purpose

This checklist defines safety requirements for a future branch that may wire the MC31 `FeedbackBacklogPreview` component into the existing hidden demo route.

MC32 itself is documentation-only. It does not authorize runtime implementation, route changes, navigation changes, persistence, audit writes, backend/API work, feedback collection, official evidence, approval, assignment, scholarship decision behavior, or AP-10B governance changes.

## Pre-Implementation Route Checks

- Confirm `FeedbackBacklogPreview` exists and is exported from `src/components/assignment/index.ts`.
- Confirm `/admin/candidate-review-demo` already exists.
- Confirm the demo route remains hidden from navigation.
- Confirm route/page/navigation files do not already import `FeedbackBacklogPreview`.
- Confirm MC29 sample runtime remains the only allowed feedback backlog data source.
- Confirm build, token, audit, and route smoke baseline before any future runtime edit.

## Allowed Future Source Files

Future runtime integration may only consider:
- `src/app/admin/candidate-review-demo/page.tsx`

Any future implementation must be separately approved and must remain limited to rendering the read-only preview in the existing hidden demo route.

## Forbidden Source Files

Future integration must not modify:
- navigation config files
- sidebar components
- topbar components
- mobile navigation components
- route layout files
- backend/API files
- database/schema/migration files
- notification files
- export files
- fixture files containing real data
- package files
- audit writer files

## Navigation Safety Checks

Future QA must verify:
- `/admin/candidate-review-demo` is absent from sidebar navigation.
- `/admin/candidate-review-demo` is absent from topbar navigation.
- `/admin/candidate-review-demo` is absent from mobile navigation.
- `/admin/candidate-review-demo` is absent from navigation config/menu lists.
- No new route is created for feedback backlog preview.
- No public link exposes the demo route.

## Data Source Checks

Allowed:
- MC31 component default data source using MC29 safe samples
- explicit `createDemoFeedbackBacklogSamples()` if future route code passes items directly

Forbidden:
- real feedback submissions
- real stakeholder data
- real student/personnel data
- API/backend responses
- database records
- browser storage
- audit log evidence
- AP-10B tracker or approval data

## Copy Checks

Required route section copy:
- `Demo backlog preview`
- `Safe mock data only`
- `Read-only`
- `Not saved`
- `Not submitted`
- `Not official evidence`
- `Not approval`
- `Not assignment`
- `Not AP-10B evidence`
- `No real stakeholder/student/personnel data`

The future route must also preserve the existing demo warning copy and the MC31 boundary statement.

## No-Action / No-Form Checks

Future implementation must not add:
- feedback form
- text input
- file input
- save button
- submit button
- approve button
- assign button
- decision button
- export/download control
- notification control
- AP-10B approval collection control

## Validation Commands

Future implementation QA must run:
- `npm run build`
- `npm run check:tokens`
- `npm run check:audit-events`

Route smoke must cover:
- `/login`
- `/admin/audit-log`
- `/admin/dashboard`
- `/staff/applications/app_001`
- `/staff/applications/app_002`
- `/admin/candidate-review-demo`

Expected MC32 planning baseline:
- build 41/41
- tokens 4/4
- audit checks 406/406
- routes 6/6 200 OK
- dev log clean

## Post-Merge QA Checks

- Confirm route still returns 200 OK.
- Confirm route remains hidden from navigation.
- Confirm no new route was created.
- Confirm no backend/API files changed.
- Confirm no persistence or browser storage was introduced.
- Confirm no audit writes were introduced.
- Confirm no export or notification behavior was introduced.
- Confirm no official evidence was created.
- Confirm no approval, assignment, or scholarship decision behavior was introduced.

## AP-10B Separation

AP-10B remains unchanged:
- owners: 0/7
- approvals: 0/7
- blockers: 9/9 active

The future route integration must not collect AP-10B approvals, create AP-10B evidence, mark AP-10B blockers resolved, start AP-10C, or start AP-11.
