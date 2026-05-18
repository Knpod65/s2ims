# S²IMS Candidate Review Demo Feedback Backlog Preview UI Plan MC30

## 1. Purpose

MC30 defines a future read-only preview UI for candidate review demo feedback backlog items.

The preview UI is intended to help reviewers inspect safe mock backlog planning items generated from the MC29 sample runtime. It is not a feedback form, approval workflow, assignment workflow, audit evidence surface, persistence feature, or production readiness signal.

Core rule: candidate review demo feedback backlog preview UI is read-only planning visibility only. It must not create official evidence, collect approvals, write audit events, persist state, call backend/API, expose PII, change navigation, or affect AP-10B/AP-10C/AP-11.

## 2. Scope

In scope:
- future read-only backlog preview behavior
- allowed MC29 sample data source
- allowed display fields
- forbidden display fields
- required status and boundary copy
- empty state copy
- grouping and filtering expectations
- accessibility expectations
- QA checks for future implementation

Out of scope:
- runtime/UI implementation in MC30
- routes/pages
- navigation exposure
- backlog UI runtime
- feedback form runtime
- backend/API
- persistence or browser storage
- audit writes
- export or notification behavior
- official evidence
- approval collection
- assignment decisions
- scholarship decisions
- AP-10B governance
- AP-10C
- AP-11

## 3. Source Baseline

MC30 builds from:
- MC27 pure TypeScript mock feedback backlog builder
- MC28 safe demo backlog sample data plan
- MC29 pure TypeScript sample runtime

Current baseline:
- build: 41/41
- token checks: 4/4
- audit/event checks: 387/387
- routes: 6/6 200 OK, including `/admin/candidate-review-demo`
- demo route remains hidden from navigation
- feedback backlog mock runtime exists
- feedback backlog sample runtime exists
- no backlog UI exists
- no feedback form exists
- no audit writes
- no persistence
- no backend/API
- no official evidence

MC30 does not modify source, scripts, routes, navigation, runtime, UI, backend/API, persistence, migrations, SQL, or package files.

## 4. Allowed Data Source

Future preview UI may use only:
- `DEMO_FEEDBACK_BACKLOG_SAMPLE_INPUTS`
- `createDemoFeedbackBacklogSamples()`
- `summarizeDemoFeedbackBacklogSamples()`

The preview must treat MC29 output as mock planning data only.

Future preview UI must not:
- collect real feedback
- create new backlog records
- mutate MC29 samples
- persist preview state
- fetch remote data
- call backend/API
- read browser storage
- write audit events
- expose the demo route through navigation

## 5. Allowed Display Fields

Future preview UI may display:
- `backlogId`
- `sourceSessionId`
- `stakeholderGroup`
- `category`
- `priority`
- `summary`
- `safetyConcern`
- `proposedBranchType`
- `ap10bImpact`
- `status`
- `nonApprovalConfirmed`
- `isMock`
- `officialEvidence`
- `approvalCollected`
- `persisted`
- `exported`
- `notified`

The UI should prefer safe labels over raw code-style terms when useful, while keeping false safety flags visible.

## 6. Forbidden Display Fields

Future preview UI must never display or request:
- real names
- personal contact information
- mobile
- phone
- email
- personal email
- raw email
- private email
- national ID
- raw student ID
- student ID
- teacher ID
- bank or financial data
- private remarks
- hardship details
- signatures
- approval statements
- approved by / approval status
- assigned by / assigned at
- scholarship decisions
- AP-10B sign-off
- authority verification
- official audit evidence content

## 7. Required UI Copy

Future preview UI must visibly include:
- `Demo feedback backlog preview`
- `Read-only planning preview`
- `Uses safe mock sample data only`
- `Not saved`
- `Not submitted`
- `Not official evidence`
- `Not an approval`
- `Not an assignment`
- `No AP-10B gate change`

Required boundary copy:

`Feedback backlog preview items are mock planning artifacts only. They are not approvals, assignments, scholarship decisions, AP-10B evidence, authority verification, production readiness approval, or official audit evidence.`

Forbidden positive status copy:
- Saved
- Submitted
- Recorded
- Official evidence
- Approved
- Assigned
- Decision completed
- AP-10B approval collected
- Authority verified

Negative phrases such as `Not saved` and `Not official evidence` are allowed and required.

## 8. Grouping and Filtering

Future preview UI may group by:
- `category`
- `priority`
- `status`
- `proposedBranchType`
- `ap10bImpact`
- `safetyConcern`

Future preview UI may filter by:
- category
- priority
- planning status
- safety concern
- proposed branch type
- AP-10B impact marker

Filtering and grouping must be client-local over MC29 mock sample data only. They must not call backend/API, persist preferences, create audit writes, or change navigation.

## 9. Empty State

Required empty state:

`No demo feedback backlog preview items are available. This preview uses safe mock sample data only and does not collect or save feedback.`

The empty state must not imply:
- failed persistence
- missing approval
- missing audit evidence
- production readiness gap
- AP-10B blocker resolution
- pending submission

## 10. Accessibility Requirements

Future preview UI must:
- use semantic headings and table/list structure
- provide text labels for status and safety flags
- avoid color-only meaning
- support keyboard navigation through grouping/filter controls
- expose filter state with accessible labels
- keep empty state and boundary warnings readable by screen readers
- identify read-only controls clearly
- keep focus order predictable

## 11. QA Checklist

- [ ] MC30 remains documentation-only.
- [ ] No `src/*` changes.
- [ ] No `scripts/*` changes.
- [ ] No `package.json` changes.
- [ ] No routes/pages created.
- [ ] No navigation exposure.
- [ ] No backlog UI runtime.
- [ ] No feedback form runtime.
- [ ] No backend/API.
- [ ] No persistence or browser storage.
- [ ] No audit writes.
- [ ] No export or notification behavior.
- [ ] Allowed data source is MC29 sample runtime only.
- [ ] Allowed display fields reviewed.
- [ ] Forbidden display fields reviewed.
- [ ] Required UI copy documented.
- [ ] Empty state documented.
- [ ] Grouping and filtering expectations documented.
- [ ] Accessibility requirements documented.
- [ ] No official evidence.
- [ ] No approval collection.
- [ ] No assignment.
- [ ] No scholarship decision.
- [ ] AP-10B gate unchanged.
- [ ] AP-10C blocked.
- [ ] AP-11 blocked.

## 12. Safety Confirmation

MC30 is documentation-only.

No source/runtime/UI changes were made. No route/navigation changes were made. No backlog UI runtime was implemented. No feedback form runtime was implemented. No audit writes, persistence, backend/API, export, notification, official evidence, approval collection, assignment, scholarship decision, AP-10B gate change, AP-10C, or AP-11 behavior was introduced.
