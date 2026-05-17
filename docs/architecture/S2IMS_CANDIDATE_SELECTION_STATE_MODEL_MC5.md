# S²IMS Candidate Selection State Model MC5

## Purpose

This document defines the future UI review states for manual candidate selection on top of the MC4 combined candidate pool.

These states are planning states only. They do not modify MC4 runtime candidate `status`, do not auto-assign candidates, do not collect approvals, and do not make scholarship decisions.

## UI Review States

| State | Meaning | Does Not Mean |
|-------|---------|---------------|
| `not_reviewed` | Candidate has not been reviewed in the future UI | Not rejected, not approved, not assigned |
| `shortlisted` | Reviewer marked the candidate for closer review | Not selected, not approved, not assigned |
| `manually_selected` | Reviewer explicitly selected candidate for workflow consideration | Not scholarship approval, not AP-10B approval, not automatic assignment |
| `skipped` | Reviewer chose not to use candidate for now | Not permanent rejection, not scholarship decision |
| `rejected_for_assignment` | Reviewer rejected candidate for this workflow assignment context | Not scholarship rejection, not HR/personnel judgment |
| `needs_more_context` | Reviewer needs more safe information before selecting | Not approval, not rejection, not assignment |

## State Transition Table

| From | To | Trigger | Meaning | Does Not Mean |
|------|----|---------|---------|---------------|
| `not_reviewed` | `shortlisted` | Authorized reviewer shortlists | Candidate is queued for closer manual review | Approval, assignment, AP-10B authority |
| `not_reviewed` | `manually_selected` | Authorized reviewer confirms selection | Candidate is selected for workflow consideration | Auto-assignment, scholarship approval |
| `not_reviewed` | `skipped` | Authorized reviewer skips | Candidate is not used now | Permanent rejection |
| `not_reviewed` | `rejected_for_assignment` | Authorized reviewer rejects for assignment context | Candidate is unsuitable for this assignment context | Scholarship rejection |
| `not_reviewed` | `needs_more_context` | Authorized reviewer requests more context | More safe context is needed | Approval or rejection |
| `shortlisted` | `manually_selected` | Authorized reviewer confirms selection | Shortlisted candidate is selected manually | Auto-assignment |
| `shortlisted` | `skipped` | Authorized reviewer skips | Shortlisted candidate is not used now | Permanent rejection |
| `shortlisted` | `rejected_for_assignment` | Authorized reviewer rejects | Candidate rejected for this assignment context | Scholarship rejection |
| `needs_more_context` | `shortlisted` | Safe context resolves concern | Candidate can be reviewed further | Approval |
| `needs_more_context` | `manually_selected` | Safe context resolves and reviewer confirms | Candidate selected manually | Auto-assignment |
| `needs_more_context` | `skipped` | Reviewer skips after context review | Candidate not used now | Scholarship decision |
| `manually_selected` | `shortlisted` | Reviewer corrects selection | Candidate returns to review queue | Approval reversal |
| `manually_selected` | `skipped` | Reviewer clears selection | Candidate no longer selected for this context | Scholarship rejection |
| `rejected_for_assignment` | `needs_more_context` | Reviewer reopens with safe reason | Re-review may occur | Approval |
| `skipped` | `shortlisted` | Reviewer reopens candidate | Candidate may be reviewed again | Approval |

## Allowed Triggering Role

Allowed triggering roles must be explicitly authorized in a future implementation. Planning roles may include:
- Scholarship staff
- Admin
- Student support staff
- Program/faculty coordinator
- Advisor reviewer
- QA reviewer

These roles are workflow reviewers only. They are not AP-10B governance owners unless separately named through AP-10B owner intake and approval collection.

## What Each State Does Not Mean

No UI review state means:
- AP-10B approval
- scholarship approval
- scholarship rejection
- final assignment
- verified authority
- database persistence
- backend/API state change
- notification dispatch
- export authorization

## Privacy Rules

State labels and transition notes must not contain:
- mobile
- phone
- personal email
- private remark
- raw student ID
- sensitive student attributes
- approval fields
- scholarship decision fields

Any future reason text must be role-scoped, PII-free, and excluded from default export.

## Audit-Awareness Notes

A future implementation may audit safe state transitions. Audit events must use safe labels and aggregate context only. This planning document does not implement audit writes.

## Rollback / Manual Correction Notes

Future UI must support manual correction from any non-final review state without implying approval reversal or scholarship decision reversal. Rollback must hide selection state from unauthorized users and must not mutate MC4 source candidate records.

