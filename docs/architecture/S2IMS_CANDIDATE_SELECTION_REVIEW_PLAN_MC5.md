# S²IMS Candidate Selection Review Plan MC5

## 1. Purpose

MC5 plans a future manual candidate selection and review experience on top of the MC4 combined candidate pool.

This document does not implement UI. It defines how a future UI should behave safely.

Core rule: suggested candidates are not assignments, approvals, authorities, AP-10B governance owners, or scholarship decisions.

## 2. Scope

In scope:
- manual review workflow
- candidate card/table display rules
- filter, sort, and search behavior
- advisor vs staff candidate grouping
- manual confirmation model
- rejection and skip model
- override reason boundary
- audit awareness
- privacy display rules
- QA checklist for future UI implementation

Out of scope:
- runtime code
- React components
- routes/pages
- backend/API behavior
- database persistence
- auto-assignment
- approval collection
- scholarship decision
- AP-10B governance
- AP-10C
- AP-11

## 3. Source Runtime Baseline

MC5 depends on the current MC1-MC4 candidate baseline:
- MC1 provides the candidate pool foundation.
- MC2 generates safe advisor/faculty reviewer candidates from Personnel records.
- MC3 generates safe staff/operations candidates from Employee records.
- MC4 combines MC2 advisor candidates and MC3 staff candidates into one safe combined candidate pool.

The MC4 combined pool preserves:
- `status: "suggested"`
- `autoAssigned: false`
- `isMock: true`
- `autoAssignedCount: 0`
- no mobile, phone, personal email, private remark, raw student ID, approval fields, assignment fields, or scholarship decision fields

Combined candidates remain workflow suggestions only.

## 4. Future UI User Roles

Future reviewers may include:
- Scholarship staff
- Admin
- Student support staff
- Program/faculty coordinator
- Advisor reviewer
- QA reviewer

These are UI workflow users. They are not AP-10B governance owners by default and do not receive AP-10B approval authority from this plan.

## 5. Candidate Review States

Future UI-level review states:
- `not_reviewed`
- `shortlisted`
- `manually_selected`
- `skipped`
- `rejected_for_assignment`
- `needs_more_context`

These are UI review states only. They do not modify MC4 candidate `status`, do not mean approval, and do not mean assignment unless a later explicit implementation phase defines a safe assignment workflow.

## 6. Manual Selection Rules

Manual selection rules:
- selection must be user-triggered
- no automatic selection
- no batch auto-selection
- no default selected candidate
- confirmation must require explicit user action
- system may suggest but never decide
- selected candidate remains workflow selection only
- selected candidate is not an AP-10B owner
- selected candidate is not scholarship approval

## 7. Candidate Display Rules

Safe fields allowed:
- `displayName`
- `poolType`
- `roleCategory`
- `roleLabel`
- `unitOrDepartment`
- `assignmentContexts`
- `status`
- `confidence`
- `isMock`
- `privacyLevel`
- `officialEmail` only if role-authorized and sourced from `cmu_mail`

Forbidden fields:
- `mobile`
- `phone`
- personal email
- raw email
- private remark
- raw student ID
- national ID
- bank account
- private notes
- `approvalStatus`
- `approvedBy`
- `scholarshipDecision`
- `assignedBy`
- `assignedAt`

## 8. Filtering and Sorting Rules

Future UI may filter by:
- `poolType` advisor/staff
- `roleCategory`
- `unitOrDepartment`
- `assignmentContexts`
- `confidence`
- safe status

Future UI must not filter by:
- sensitive student attributes
- GPA
- financial need
- disability
- raw student ID
- private notes
- protected class
- hidden remarks

Those filters require a later privacy-reviewed phase before they may be considered.

## 9. Override and Reason Boundary

Manual override may be allowed later, but:
- override reason must be role-scoped
- override reason must not contain PII
- override reason must not contain sensitive student details
- override reason must not be exported by default
- override must be audit-aware
- override does not equal approval

## 10. Advisor-Specific Review Behavior

Advisor candidates:
- may be reviewed for advisor workflow routing
- do not become scholarship approvers by being selected
- do not make scholarship decisions
- do not collect AP-10B approval
- require manual confirmation

Advisor recommendation does not mean scholarship approval. Advisor decline does not automatically reject a scholarship application.

## 11. Staff-Specific Review Behavior

Staff candidates:
- may be reviewed for document checking, eligibility checking, QA, finance check, support, or rollback support
- do not become scholarship approvers by being selected
- do not make scholarship decisions
- do not collect AP-10B approval
- require manual confirmation

## 12. Empty/Unavailable Candidate States

Future UI should handle:
- no candidates available
- advisor candidates unavailable
- staff candidates unavailable
- unsafe candidates filtered out
- missing `officialEmail`
- source data stale
- candidate inactive

Unavailable states must not trigger auto-assignment or default selection.

## 13. Audit Awareness

Future implementation should consider safe audit events for:
- candidate viewed
- candidate shortlisted
- candidate manually selected
- candidate skipped
- candidate rejected for assignment
- override reason submitted

This planning phase does not implement audit writes.

Audit metadata must exclude:
- mobile
- phone
- personal email
- raw student ID
- private remark
- sensitive student attributes
- approval fields
- scholarship decision fields

## 14. Privacy and PDPA

Future UI must follow:
- data minimization
- role-based visibility
- masked student token only
- safe display only
- no unnecessary contact details
- no sensitive matching attributes
- no AP-10B evidence creation
- no export by default

The future UI must not expose mobile, phone, personal email, private remarks, raw student IDs, protected attributes, or approval/decision fields.

## 15. Future UI QA Checklist

- [ ] No UI implementation in MC5 planning package
- [ ] No runtime modification in MC5 planning package
- [ ] No auto-selection
- [ ] No default selected candidate
- [ ] No sensitive fields rendered
- [ ] Advisor/staff pool separation clear
- [ ] `officialEmail` role-authorized
- [ ] Selected does not mean approved
- [ ] Recommendation does not mean approval
- [ ] Skip/reject does not mean scholarship decision
- [ ] Override reason boundary documented
- [ ] Audit awareness documented but not implemented
- [ ] MC1 boundary preserved
- [ ] MC2 boundary preserved
- [ ] MC3 boundary preserved
- [ ] MC4 boundary preserved
- [ ] AP-10B unchanged
- [ ] AP-10C blocked
- [ ] AP-11 blocked

