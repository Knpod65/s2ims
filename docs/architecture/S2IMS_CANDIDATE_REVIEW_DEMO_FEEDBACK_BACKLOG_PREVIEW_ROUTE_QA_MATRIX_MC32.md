# S2IMS Candidate Review Demo Feedback Backlog Preview Route QA Matrix MC32

## Purpose

This matrix defines future QA scenarios for safely integrating the MC31 `FeedbackBacklogPreview` component into the existing hidden `/admin/candidate-review-demo` route.

MC32 is documentation-only. It does not wire the component into the route.

## Scenario Table

| Scenario | Expected Result | Must Not Happen |
|----------|-----------------|-----------------|
| Initial route render after future integration | Existing demo route renders candidate review demo plus read-only backlog preview section. | New route is created or navigation is exposed. |
| Backlog preview section placement | Preview appears below existing candidate review demo explanation with clear separation. | Preview replaces candidate demo warning or becomes primary workflow action. |
| Allowed component use | Route renders `FeedbackBacklogPreview`. | Route renders a custom feedback form or alternate data collection UI. |
| Allowed data source | Preview uses MC29 safe sample runtime only. | Real feedback, API/backend, database, browser storage, or AP-10B data is used. |
| Required copy | Route shows required read-only, mock-only, not-saved, not-official, not-approval, not-assignment, and no-AP-10B-evidence labels. | Copy implies saved, submitted, official, approved, assigned, production ready, or AP-10B evidence. |
| False flag visibility | Preview keeps safety flags visible as text. | Safety meaning is color-only or hidden. |
| Empty state | Empty state remains safe and says no feedback is collected or saved. | Empty state implies failed persistence, missing approval, or missing evidence. |
| Keyboard review | User can tab through static content and any links already on the page in logical order. | New form controls or action controls are introduced. |
| Screen-reader review | Section headings, labels, and boundary copy are understandable. | Safety state is unavailable to assistive technology. |
| Navigation hidden check | Demo route remains absent from sidebar, topbar, mobile nav, and menu lists. | `/admin/candidate-review-demo` appears in navigation. |
| Negative behavior check | No audit write, persistence, API/backend call, export, notification, or browser storage occurs. | Any write, call, export, notification, or storage behavior is introduced. |
| AP-10B separation | AP-10B owners 0/7, approvals 0/7, blockers 9/9 active; AP-10C and AP-11 remain blocked. | AP-10B approvals are collected or gate status changes. |

## Route Rendering Checks

- Existing `/admin/candidate-review-demo` route returns 200 OK.
- Existing candidate review diagnostic preview remains available.
- Future backlog preview appears as a secondary read-only planning section.
- No route/page outside the existing demo route is changed.

## Navigation Hidden Checks

- Sidebar does not include `/admin/candidate-review-demo`.
- Topbar does not include `/admin/candidate-review-demo`.
- Mobile navigation does not include `/admin/candidate-review-demo`.
- Navigation config/menu data does not include `/admin/candidate-review-demo`.
- No new route is added.

## Copy Checks

Required visible copy:
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

Forbidden positive status copy:
- Saved
- Submitted
- Official evidence
- Approved
- Assigned
- Decision completed
- AP-10B approval collected
- Authority verified
- Production readiness approved

Negative labels such as `Not saved` and `Not official evidence` are required and allowed.

## False Flag Visibility Checks

Future route QA must confirm the preview keeps these safety flags visible:
- `nonApprovalConfirmed: true`
- `isMock: true`
- `officialEvidence: false`
- `approvalCollected: false`
- `persisted: false`
- `exported: false`
- `notified: false`

## Accessibility Checks

- Backlog preview section has a clear heading.
- Boundary copy is readable by screen readers.
- Status labels are text-visible.
- Safety flags are not color-only.
- Focus order remains predictable.
- No hidden interactive controls are introduced.

## Negative Behavior Checks

Future route integration must not:
- collect feedback
- create feedback forms
- save or submit data
- write audit events
- call backend/API
- use browser storage
- export/download data
- send notifications
- create official evidence
- assign candidates or work
- approve scholarships or work
- collect AP-10B approvals

## AP-10B Separation Checks

- AP-10B owners remain 0/7.
- AP-10B approvals remain 0/7.
- AP-10B blockers remain 9/9 active.
- AP-10C remains blocked.
- AP-11 remains blocked.
