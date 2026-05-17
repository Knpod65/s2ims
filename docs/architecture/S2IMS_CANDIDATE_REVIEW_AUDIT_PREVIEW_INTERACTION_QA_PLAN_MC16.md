# S²IMS Candidate Review Audit Preview Interaction QA Plan MC16

## 1. Purpose

MC16 defines user-interaction QA requirements for the MC15 diagnostic preview UI.

Core rule:
Every interaction must reinforce that diagnostic preview is local-only, not saved, not submitted, not official evidence, not assignment, not approval, and not scholarship decision.

MC16 is planning only. It does not modify source/runtime files, implement UI changes, write audit events, persist state, call backend/API, export data, notify anyone, create official evidence, assign candidates, approve scholarships, collect AP-10B approvals, change AP-10B gate status, start AP-10C, or start AP-11.

## 2. Scope

In scope:
- interaction QA scenarios
- empty state QA
- local action QA
- preview generation QA
- clear/reset QA
- false-flag visibility QA
- copy clarity QA
- keyboard accessibility QA
- screen-reader QA
- negative behavior QA
- AP-10B separation QA

Out of scope:
- runtime implementation
- UI code changes
- backend/API
- persistence
- audit write
- route/navigation changes
- export/notification
- official evidence creation
- assignment
- approval
- scholarship decision
- AP-10B governance
- AP-10C
- AP-11

## 3. Source Baseline

MC13 integrated diagnostic no-op preview behavior into `CandidateSelectionReviewShell.tsx`.

MC14 created the UX hardening plan, copy matrix, and checklist for the diagnostic preview UI.

MC15 implemented UX hardening for the diagnostic preview UI:
- diagnostic preview heading
- local-only warning copy
- safety badges
- text-visible false flags
- clarified empty state
- accessibility marker
- no audit writes
- no persistence
- no backend/API calls
- no official evidence
- no assignment
- no approval
- no scholarship decision

MC16 does not modify source/runtime files.

## 4. Interaction QA Matrix

| Scenario | User Action | Expected UI Result | Must Not Happen |
|----------|-------------|-------------------|-----------------|
| Initial render | Load shell with candidates | Candidate list appears; diagnostic preview region shows empty state | No candidate auto-selected, no preview generated automatically |
| No preview empty state | Inspect preview panel before action | `No diagnostic preview has been generated. Review actions remain local UI signals only.` is visible | No save, submit, audit failure, approval missing, or official evidence missing implication |
| Shortlist click | Click `Shortlist` on one candidate | Local diagnostic preview appears for shortlist signal | No audit write, API call, assignment, approval, persistence, or scholarship decision |
| Skip click | Click `Skip` on one candidate | Local diagnostic preview appears for skip signal | No scholarship rejection, audit write, persistence, or notification |
| Needs more context click | Click `Needs more context` | Local diagnostic preview appears for more-context signal | No task creation, backend call, notification, or official evidence |
| Reject for assignment click | Click `Reject for assignment` | Local diagnostic preview appears for assignment-unsuitable signal | No scholarship rejection, approval denial, audit write, or export |
| Select for review click | Click `Select for review` | Local diagnostic preview appears for manual review selection signal | No assignment, approval, default selection, or AP-10B governance change |
| Clear click | Click `Clear diagnostic preview` | Preview returns to empty state | No server deletion, audit deletion, persistence change, or official evidence deletion |
| Repeated action click | Click same action multiple times | Latest local preview remains understandable and local-only | No duplicate persisted record, repeated notification, or audit writes |
| Switching candidate action | Click actions on different candidates | Preview updates to latest local UI signal | No cross-candidate assignment, hidden persistence, or default selection |
| Readonly mode | Inspect readonly shell controls | Controls are disabled and communicated as disabled | No enabled action, no preview action, no assignment or approval |
| Keyboard tab navigation | Navigate controls with keyboard | Focus order is logical and controls can be understood | No keyboard trap, hidden enabled action, or inaccessible status |
| Screen-reader review of preview panel | Read warning, badges, flags, and empty state | Meaning is understandable without relying on color | No color-only status, unlabeled region, or misleading official wording |

## 5. Empty State QA

Expected copy:

`No diagnostic preview has been generated. Review actions remain local UI signals only.`

The empty state must not imply:
- save pending
- submit pending
- audit failure
- approval missing
- official evidence missing
- assignment missing
- scholarship decision missing

## 6. Preview State QA

When a diagnostic preview exists, verify visible:
- `Diagnostic preview`
- `Not saved`
- `Not submitted`
- `Not official evidence`
- `Not an approval`
- `Not an assignment`
- `Local UI signal only`
- `persisted: false`
- `written: false`
- `exported: false`
- `notified: false`
- `officialEvidence: false`
- `diagnosticOnly: true`
- `discardedAfterPreview: true`

These values must be readable text, not color-only indicators.

## 7. Negative Behavior QA

Confirm no:
- audit write
- API call
- backend call
- browser storage
- export/download
- notification
- route change
- staff callback change
- assignment
- approval
- scholarship decision
- AP-10B approval collection
- AP-10B gate change
- AP-10C work
- AP-11 work

## 8. Accessibility QA

Verify:
- keyboard focus order is logical
- disabled/readonly controls are communicated
- warning copy is readable by screen readers
- preview state changes are announced or understandable
- badges are text-visible, not color-only
- false flags are text-visible
- preview region has an accessible label or equivalent context
- local-only meaning is available in text near the preview

## 9. Copy QA

Required copy present:
- `Diagnostic preview`
- `Not saved`
- `Not submitted`
- `Not official evidence`
- `Not an approval`
- `Not an assignment`
- `Local UI signal only`

Forbidden positive copy as active status:
- `Saved`
- `Submitted`
- `Recorded`
- `Official`
- `Evidence collected`
- `Assigned`
- `Approved`
- `Decision completed`
- `AP-10B approval collected`
- `Authority verified`

Negative phrases such as `Not saved`, `Not submitted`, and `Not official evidence` are allowed.

## 10. QA Checklist

- [x] Docs-only scope defined
- [x] No `src/*` changes allowed
- [x] No `scripts/*` changes allowed
- [x] Interaction scenarios documented
- [x] Empty state QA documented
- [x] Preview state QA documented
- [x] Negative behavior QA documented
- [x] Accessibility QA documented
- [x] Copy QA documented
- [x] AP-10B unchanged
- [x] AP-10C blocked
- [x] AP-11 blocked

