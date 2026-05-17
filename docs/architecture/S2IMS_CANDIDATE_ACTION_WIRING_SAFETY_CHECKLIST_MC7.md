# S²IMS Candidate Action Wiring Safety Checklist MC7

## Purpose

This checklist defines the safety gates that must be satisfied before any future candidate review action wiring is implemented.

MC7 is documentation-only. It does not implement action wiring, runtime behavior, backend/API behavior, persistence, audit writes, notification behavior, export behavior, assignment, approval, AP-10B governance, AP-10C, or AP-11.

## Pre-Implementation Gate

- [ ] MC7 plan reviewed and approved
- [ ] Future implementation branch explicitly approved
- [ ] Action semantics reviewed against MC5 state model
- [ ] MC6 UI shell boundaries reviewed
- [ ] Privacy/PII boundary reviewed
- [ ] AP-10B separation reviewed
- [ ] No implementation starts from MC7 itself

## No-Auto-Assignment Checks

- [ ] No candidate is selected automatically
- [ ] No candidate is selected by default
- [ ] No batch auto-selection exists
- [ ] `autoAssigned: false` remains preserved
- [ ] `autoAssignedCount: 0` remains preserved
- [ ] Manual selection requires explicit user action
- [ ] Manual selection remains workflow routing consideration only

## No-Approval Checks

- [ ] No candidate review action means approval
- [ ] No advisor review action means scholarship approval
- [ ] No staff review action means scholarship approval
- [ ] No action collects advisor approval
- [ ] No action collects staff approval
- [ ] No action collects AP-10B approval
- [ ] No action marks a candidate as AP-10B governance owner
- [ ] No action verifies authority

## No-Decision Checks

- [ ] No candidate action approves scholarship
- [ ] No candidate action rejects scholarship
- [ ] No candidate action changes eligibility outcome
- [ ] No candidate action changes official scholarship status
- [ ] No action writes scholarship decision metadata
- [ ] Skip/reject-for-assignment is not scholarship rejection

## Safe Metadata Checks

- [ ] Metadata uses allowed action types only
- [ ] Metadata uses safe `candidateId`
- [ ] Metadata includes `poolType` only as advisor/staff
- [ ] Metadata uses safe `roleCategory`
- [ ] Metadata uses safe `actorRole`
- [ ] Metadata uses controlled `safeReasonCode`
- [ ] Metadata uses controlled `safeNoteCategory`
- [ ] Metadata uses safe workflow context
- [ ] Metadata stores previous/next review state only when safe

## Reason Input Checks

- [ ] Safe reason codes preferred over free text
- [ ] Free text is absent by default
- [ ] Reason input excludes raw student IDs
- [ ] Reason input excludes financial details
- [ ] Reason input excludes health/disability details
- [ ] Reason input excludes family/private hardship details
- [ ] Reason input excludes phone/email
- [ ] Reason input excludes approval wording
- [ ] Reason input is not exported by default

## UI Guardrail Checks

- [ ] Action buttons are explicit
- [ ] No default selected candidate
- [ ] No enabled approve button
- [ ] No enabled decision button
- [ ] No auto-assign button
- [ ] Manual selection requires confirmation
- [ ] Advisor and staff candidates remain clearly separated
- [ ] Warning copy states actions are workflow review signals only
- [ ] Safe fields only are displayed
- [ ] Forbidden fields are never displayed

## Audit-Awareness Checks

- [ ] Audit awareness documented before implementation
- [ ] No audit writes are implemented by MC7
- [ ] Future audit events use safe action type
- [ ] Future audit events use safe candidate ID
- [ ] Future audit events exclude PII
- [ ] Future audit events exclude approval wording
- [ ] Future audit events exclude decision wording
- [ ] Future audit events exclude AP-10B authority evidence

## Rollback / Manual Correction Checks

- [ ] Reviewer can clear local review state
- [ ] Reviewer can revert shortlist
- [ ] Reviewer can revert manual selection
- [ ] Reviewer can mark action entered in error
- [ ] Manual correction does not imply approval reversal
- [ ] Manual correction does not imply scholarship decision reversal
- [ ] MC4 source candidate records are not mutated

## AP-10B Separation Checks

- [ ] Candidate reviewers are not AP-10B governance owners by default
- [ ] Candidate action does not collect AP-10B approval
- [ ] Candidate action does not create AP-10B evidence
- [ ] Candidate action does not verify AP-10B authority
- [ ] AP-10B owners remain 0/7
- [ ] AP-10B approvals remain 0/7
- [ ] AP-10B blockers remain 9/9 active

## AP-10C / AP-11 Safety Checks

- [ ] AP-10C remains blocked
- [ ] AP-11 remains blocked
- [ ] No schema work introduced
- [ ] No SQL introduced
- [ ] No migrations introduced
- [ ] No backend/API introduced
- [ ] No prototype persistence activated
- [ ] No real persistence activated
