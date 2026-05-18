# S²IMS Candidate Review Demo Feedback Backlog Preview Implementation Checklist MC30

## Purpose

This checklist defines the minimum safety gates for any future implementation of the read-only feedback backlog preview UI planned by MC30.

MC30 itself is documentation-only and does not implement the preview UI.

## Pre-Implementation Gate

- [ ] Implementation branch is separately approved.
- [ ] Scope is read-only preview only.
- [ ] Data source is MC29 safe sample runtime only.
- [ ] No real feedback intake is included.
- [ ] No persistence is included.
- [ ] No backend/API is included.
- [ ] No audit write is included.
- [ ] No route/navigation exposure is included unless separately approved.

## Data Source Checks

- [ ] Uses `createDemoFeedbackBacklogSamples()` or `summarizeDemoFeedbackBacklogSamples()`.
- [ ] Does not create new sample records.
- [ ] Does not mutate sample items.
- [ ] Does not fetch data.
- [ ] Does not read browser storage.
- [ ] Does not write browser storage.
- [ ] Does not sync, export, or notify.

## Display Safety Checks

- [ ] Displays only MC30 allowed fields.
- [ ] Displays fixed false safety flags.
- [ ] Shows non-approval boundary copy.
- [ ] Shows read-only planning preview copy.
- [ ] Shows safe mock sample data copy.
- [ ] Shows no AP-10B gate change copy.
- [ ] Does not show real names.
- [ ] Does not show contact data.
- [ ] Does not show raw IDs.
- [ ] Does not show private remarks.
- [ ] Does not show financial data.
- [ ] Does not show approval, assignment, or scholarship decision fields.

## UI Behavior Checks

- [ ] Read-only only.
- [ ] No editable form controls.
- [ ] No submit/save/record buttons.
- [ ] No approve/assign/decision actions.
- [ ] No feedback collection form.
- [ ] Empty state uses MC30 required copy.
- [ ] Grouping and filtering are local-only over mock data.
- [ ] Grouping and filtering do not persist.

## Accessibility Checks

- [ ] Semantic headings and sections.
- [ ] Table or list structure has accessible labels.
- [ ] Status flags are text-visible.
- [ ] No color-only state.
- [ ] Keyboard navigation is predictable.
- [ ] Filter controls have accessible names.
- [ ] Boundary warnings are screen-reader readable.
- [ ] Empty state is screen-reader readable.

## Negative Behavior Checks

- [ ] No `fetch`, axios, or XMLHttpRequest.
- [ ] No backend/API route call.
- [ ] No `localStorage`, `sessionStorage`, or IndexedDB.
- [ ] No `sharedMockWriter`.
- [ ] No `AuditService`.
- [ ] No audit repository call.
- [ ] No export/download helper.
- [ ] No notification call.
- [ ] No route/navigation file change unless separately approved.

## AP Separation Checks

- [ ] AP-10B owners remain 0/7.
- [ ] AP-10B approvals remain 0/7.
- [ ] AP-10B blockers remain 9/9 active.
- [ ] AP-10C remains blocked.
- [ ] AP-11 remains blocked.

## Merge Criteria for Future Runtime

- [ ] Build passes, 41/41.
- [ ] Token checks pass, 4/4.
- [ ] Audit/event checks do not regress.
- [ ] Six route smoke checks pass, including `/admin/candidate-review-demo`.
- [ ] Dev log grep is clean.
- [ ] Diff scope matches approved future implementation branch.
