# S2IMS Candidate Review Demo Feedback Backlog Preview Route Integration Plan MC32

## 1. Purpose

MC32 defines a future safe route integration plan for displaying the MC31 `FeedbackBacklogPreview` component inside the existing hidden MC20 demo route.

Core rule: route integration must remain demo/read-only. It must not collect feedback, save feedback, submit feedback, approve work, assign work, create official evidence, expose navigation, or change AP-10B governance status.

## 2. Scope

In scope:
- future route integration location
- allowed component
- allowed data source
- required route copy
- section placement
- read-only behavior
- route/navigation safety
- QA checks for future implementation

Out of scope:
- runtime implementation
- actual route modification
- new route creation
- navigation exposure
- feedback form implementation
- storage/persistence
- backend/API
- database/schema/migration
- audit write
- official evidence creation
- assignment
- approval
- scholarship decision
- AP-10B governance
- AP-10C
- AP-11

## 3. Source Baseline

MC32 builds from:
- MC20 existing hidden demo route at `/admin/candidate-review-demo`
- MC22 navigation safety checks confirming the demo route remains absent from sidebar, topbar, mobile nav, and navigation config
- MC29 safe feedback backlog sample runtime
- MC31 reusable `FeedbackBacklogPreview` read-only component

Current validation baseline:
- build: 41/41
- token checks: 4/4
- audit/event checks: 406/406
- routes: 6/6 200 OK, including `/admin/candidate-review-demo`
- dev log clean

MC32 does not modify source, runtime, UI, route, navigation, script, backend/API, persistence, migration, SQL, package, or audit writer files.

## 4. Recommended Integration Location

Preferred future location:
- Existing route: `/admin/candidate-review-demo`
- Existing file: `src/app/admin/candidate-review-demo/page.tsx`

Rationale:
- The route is already hidden from navigation.
- The route is already scoped to safe demo context.
- The route already uses safe mock data.
- Reusing the route avoids creating a new exposure surface.
- Reusing the route reduces accidental navigation or public-discovery risk.

## 5. Allowed Component and Data Source

Allowed component:
- `FeedbackBacklogPreview`

Allowed data source:
- default MC29 sample runtime inside `FeedbackBacklogPreview`
- explicit `createDemoFeedbackBacklogSamples()` only if a future route branch needs to pass items directly

Forbidden data sources:
- real feedback submissions
- real stakeholder records
- real student records
- real personnel records
- API/backend
- database
- browser storage
- AP-10B tracker data
- AP-10B evidence data
- audit log evidence data

## 6. Required Route Copy

The future route section must show:
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

The route must preserve the existing demo warning copy and must not replace the candidate review diagnostic preview safety statements.

## 7. Layout and Placement

Future route integration should:
- place the backlog preview below the existing candidate review demo explanation
- avoid making the backlog preview the primary workflow action
- visually separate the candidate review diagnostic preview from the feedback backlog preview
- include heading and boundary copy above the backlog preview section
- preserve existing demo warnings
- avoid enabled action buttons
- avoid form controls
- avoid export/download controls
- avoid save, submit, approve, assign, or decision controls

## 8. Route and Navigation Safety

Future implementation must preserve:
- no sidebar link
- no topbar link
- no mobile nav link
- no menu link
- no public navigation exposure
- no new route
- no route behavior change beyond rendering the read-only preview inside the existing hidden demo route
- no export/download
- no notification
- no feedback collection
- no persistence
- no audit writes
- no AP-10B approval collection

## 9. QA Checklist

- [ ] MC32 remains documentation-only.
- [ ] No `src/*` changes in MC32.
- [ ] No `scripts/*` changes in MC32.
- [ ] No `package.json` changes in MC32.
- [ ] Existing route `/admin/candidate-review-demo` selected as the only future integration target.
- [ ] Existing file `src/app/admin/candidate-review-demo/page.tsx` documented as the only planned future source file.
- [ ] No new route planned.
- [ ] No navigation exposure planned.
- [ ] Allowed component documented: `FeedbackBacklogPreview`.
- [ ] Allowed data source documented: MC29 safe sample runtime only.
- [ ] Required route copy documented.
- [ ] Route and navigation safety documented.
- [ ] Feedback form runtime remains out of scope.
- [ ] Storage/persistence remains out of scope.
- [ ] Backend/API remains out of scope.
- [ ] Audit writes remain out of scope.
- [ ] Official evidence remains out of scope.
- [ ] Assignment, approval, and scholarship decision behavior remain out of scope.
- [ ] AP-10B gate unchanged: owners 0/7, approvals 0/7, blockers 9/9 active.
- [ ] AP-10C blocked.
- [ ] AP-11 blocked.
