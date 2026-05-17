# S²IMS Candidate Selection Action Boundary Plan MC7

## 1. Purpose

MC7 defines safe boundaries for future candidate review actions before any action wiring is implemented.

This document does not implement action wiring. It only defines what future actions may mean and what they must never mean.

Core rule: candidate actions are workflow review signals only. They are not automatic assignments, approvals, scholarship decisions, AP-10B governance approvals, or evidence of authority.

## 2. Scope

In scope:
- future action semantics
- allowed review actions
- forbidden actions
- action state meanings
- action state non-meanings
- safe metadata model
- forbidden metadata model
- audit-awareness requirements
- rollback and manual correction model
- QA checklist for future action wiring

Out of scope:
- runtime implementation
- UI action wiring
- backend/API behavior
- database persistence
- audit write implementation
- notification behavior
- export behavior
- auto-assignment
- approval collection
- scholarship decision
- AP-10B governance
- AP-10C
- AP-11

## 3. Source Baseline

MC7 builds on the current S²IMS candidate baseline:
- MC1 provides the candidate pool foundation.
- MC2 generates safe advisor/faculty reviewer candidates from Personnel records.
- MC3 generates safe staff/operations candidates from Employee records.
- MC4 combines MC2 advisor candidates and MC3 staff candidates into one safe combined candidate pool.
- MC5 defines the manual candidate selection/review planning model.
- MC6 adds an isolated display/review UI shell with disabled placeholder actions only.

MC7 does not modify any MC1-MC6 files.

Current preserved boundaries:
- combined candidates remain workflow suggestions only
- no candidate is auto-assigned
- no candidate is selected by default
- no Assign, Approve, or Decision action is enabled
- no scholarship approval is performed
- no AP-10B approval collection is performed
- AP-10B owners remain 0/7
- AP-10B approvals remain 0/7
- AP-10B blockers remain 9/9 active
- AP-10C remains blocked
- AP-11 remains blocked

## 4. Future Allowed Review Actions

Future action wiring may define the following actions only after a separate explicitly approved implementation phase.

| Action | User intent | Allowed trigger role | Safe metadata allowed | UI feedback | Does not mean |
|--------|-------------|----------------------|------------------------|-------------|---------------|
| `view_candidate` | Reviewer opens or inspects a safe candidate suggestion | Authorized workflow reviewer | action type, candidate ID, pool type, role category, actor role, timestamp, workflow context | Candidate viewed state or passive record | Assignment, approval, decision, AP-10B evidence |
| `shortlist_candidate` | Reviewer marks a candidate as worth closer review | Authorized workflow reviewer | safe reason code, safe note category, previous/next review state | Candidate appears shortlisted | Assignment, approval, final selection |
| `skip_candidate` | Reviewer skips candidate for now | Authorized workflow reviewer | safe reason code, workflow context, previous/next review state | Candidate appears skipped | Permanent rejection, scholarship rejection |
| `request_more_context` | Reviewer needs more safe context before selecting | Authorized workflow reviewer | safe reason code, safe note category, workflow context | Candidate appears as needing context | Approval, rejection, sensitive data request |
| `reject_for_assignment` | Reviewer rejects candidate for this workflow assignment context | Authorized workflow reviewer | safe reason code, safe note category, previous/next review state | Candidate appears rejected for assignment | Scholarship rejection, HR/personnel judgment |
| `manually_select_candidate` | Reviewer explicitly selects candidate for workflow routing consideration | Authorized workflow reviewer with confirmation | safe reason code, workflow context, previous/next review state | Candidate appears manually selected | Auto-assignment, approval, scholarship decision, AP-10B authority |

Allowed trigger roles are future workflow roles only. They do not become AP-10B governance owners unless separately named and approved through the AP-10B lifecycle.

## 5. Forbidden Actions

These actions must not exist in MC7 and must not be implemented in future action wiring unless a separate approved phase explicitly authorizes them:
- `auto_assign_candidate`
- `approve_candidate`
- `approve_scholarship`
- `reject_scholarship`
- `collect_ap10b_approval`
- `verify_authority`
- `mark_as_governance_owner`
- `export_candidate_decision`
- `notify_candidate_automatically`
- `persist_sensitive_reason`

## 6. Action Meaning Matrix

| Action | Means | Does Not Mean |
|--------|-------|---------------|
| `view_candidate` | Candidate suggestion was viewed in a workflow review context | Assignment, approval, scholarship decision, AP-10B approval |
| `shortlist_candidate` | Candidate is worth further safe review | Assignment, approval, final selection, AP-10B authority |
| `skip_candidate` | Candidate is not used right now | Permanent rejection, scholarship rejection, HR/personnel judgment |
| `request_more_context` | Reviewer needs more safe workflow context | Permission to expose PII, approval, rejection, assignment |
| `reject_for_assignment` | Candidate is not suitable for this workflow assignment context | Scholarship rejection, candidate misconduct, employment judgment |
| `manually_select_candidate` | User selected candidate for workflow routing consideration | Assigned, approved, scholarship decision, AP-10B owner, evidence of authority |

## 7. Safe Action Metadata

Future action wiring may record only safe metadata:
- `actionType`
- `candidateId`
- `poolType`
- `roleCategory`
- `actorRole`
- `createdAt`
- `safeReasonCode`
- `safeNoteCategory`
- `workflowContext`
- `previousReviewState`
- `nextReviewState`

Forbidden metadata:
- mobile
- phone
- `personalEmail`
- `rawEmail`
- `privateEmail`
- remark
- `rawStudentId`
- national ID
- bank account
- full reason text containing PII
- `scholarshipDecision`
- `approvalStatus`
- `approvedBy`
- AP-10B owner evidence
- authority verification evidence

## 8. Reason Boundary

Future reason input must:
- use safe reason codes where possible
- avoid free-text PII
- be role-scoped
- be non-exported by default
- be reviewable by authorized roles only

Reason input must not:
- include raw student IDs
- include financial details
- include health or disability details
- include family or private hardship details
- include phone or email
- include approval wording
- imply assignment or scholarship decision

## 9. Audit Awareness

Future implementation may record audit-aware events for:
- candidate viewed
- candidate shortlisted
- candidate skipped
- candidate needs more context
- candidate rejected for assignment
- candidate manually selected

This planning phase does not implement audit writes.

Future audit events must:
- use safe `candidateId`
- use `poolType`
- use `roleCategory`
- use safe reason code
- exclude PII
- exclude approval or decision wording
- exclude AP-10B authority evidence
- avoid raw free-text reason content by default

## 10. Rollback and Manual Correction

Future action wiring must support:
- clearing a local review state
- reverting shortlist
- reverting manual selection
- marking an action entered in error
- preserving a safe audit trail if audit writes are implemented later

Rollback does not:
- delete official scholarship decision
- delete AP-10B evidence
- imply approval or rejection
- mutate MC4 source candidate records
- authorize persistence or backend changes by itself

## 11. UI Guardrails for Future Implementation

Future UI must:
- keep action buttons explicit
- avoid default selected candidate
- avoid enabled approve or decision buttons
- warn that actions are workflow review signals only
- separate advisor and staff candidates clearly
- require confirmation for manual selection
- show safe fields only
- never show forbidden fields
- keep AP-10B governance status outside candidate review actions

## 12. QA Checklist

- [ ] Docs-only scope confirmed
- [ ] No `src/*` changes
- [ ] No `scripts/*` changes
- [ ] No `package.json` changes
- [ ] No action wiring implemented
- [ ] No persistence implemented
- [ ] No backend/API added
- [ ] No migrations or SQL added
- [ ] Allowed actions reviewed
- [ ] Forbidden actions reviewed
- [ ] Safe metadata reviewed
- [ ] Forbidden metadata reviewed
- [ ] Reason boundary reviewed
- [ ] Audit awareness documented but not implemented
- [ ] Rollback/manual correction boundary documented
- [ ] No auto-assignment
- [ ] No approval collection
- [ ] No scholarship decision
- [ ] AP-10B unchanged
- [ ] AP-10C blocked
- [ ] AP-11 blocked
