# S²IMS Candidate Review UI Safety Checklist MC5

## Purpose

This checklist defines the safety gates for a future MC5 manual candidate selection/review UI.

MC5 is documentation-only. This checklist does not implement UI, runtime behavior, persistence, routes, backend/API, notifications, or audit writes.

## No-Auto-Assignment Checks

- [ ] No candidate is selected automatically.
- [ ] No candidate is selected by default.
- [ ] No batch auto-selection exists.
- [ ] `autoAssigned: false` remains preserved.
- [ ] `autoAssignedCount: 0` remains preserved.
- [ ] Suggested candidates require explicit user action before any workflow selection.
- [ ] Selection is not scholarship approval.

## Display Safety Checks

- [ ] Display uses safe candidate labels only.
- [ ] Advisor and staff candidates are visibly separated.
- [ ] `officialEmail` is shown only when role-authorized and sourced from `cmu_mail`.
- [ ] Mobile is not displayed.
- [ ] Phone is not displayed.
- [ ] Personal email is not displayed by default.
- [ ] Private remark is not displayed.
- [ ] Raw student ID is not displayed.
- [ ] Approval and scholarship decision fields are not displayed.

## Filtering/Sorting Safety Checks

- [ ] Filtering by `poolType` is allowed.
- [ ] Filtering by `roleCategory` is allowed.
- [ ] Filtering by `unitOrDepartment` is allowed.
- [ ] Filtering by `assignmentContexts` is allowed.
- [ ] Filtering by safe status is allowed.
- [ ] Filtering by sensitive student attributes is not allowed.
- [ ] Filtering by GPA, financial need, disability, protected class, raw student ID, or private notes is not allowed.
- [ ] Sorting does not reveal protected or hidden attributes.

## Advisor Candidate Checks

- [ ] Advisor candidates remain suggested workflow reviewers.
- [ ] Advisor recommendation does not mean scholarship approval.
- [ ] Advisor decline does not automatically reject scholarship.
- [ ] Advisor candidate selection remains manual.
- [ ] Advisor candidates are not AP-10B governance owners.

## Staff Candidate Checks

- [ ] Staff candidates remain suggested workflow reviewers/operators.
- [ ] Staff selection does not mean approval.
- [ ] Staff selection does not mean scholarship decision.
- [ ] Staff selection does not collect AP-10B approval.
- [ ] Staff candidate selection remains manual.

## Override Reason Checks

- [ ] Override reason is role-scoped.
- [ ] Override reason excludes PII.
- [ ] Override reason excludes sensitive student details.
- [ ] Override reason is not exported by default.
- [ ] Override does not equal approval.
- [ ] Override does not mutate source candidate records.

## Audit Metadata Checks

- [ ] Audit awareness is documented before implementation.
- [ ] No audit writes are implemented by MC5 planning.
- [ ] Future audit metadata excludes mobile, phone, personal email, raw student ID, private remark, sensitive student attributes, approval fields, and scholarship decision fields.
- [ ] Future audit events use safe status labels only.

## AP-10B Separation Checks

- [ ] Candidate reviewers are not AP-10B governance owners.
- [ ] Candidate selection does not collect AP-10B approval.
- [ ] AP-10B owners remain 0/7.
- [ ] AP-10B approvals remain 0/7.
- [ ] AP-10B blockers remain 9/9 active.

## AP-10C/AP-11 Safety Checks

- [ ] AP-10C remains blocked.
- [ ] AP-11 remains blocked.
- [ ] No runtime/schema/SQL/migration/backend/API work is introduced.
- [ ] No prototype persistence is activated.
- [ ] No real persistence is activated.

