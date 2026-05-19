# S²IMS Candidate Review Demo Combined Preview Feedback Synthesis Sample QA Checklist MC42

## Purpose

This checklist defines QA expectations for MC42 safe sample data planning and for any future sample runtime branch derived from this plan.

MC42 is documentation-only. It does not implement sample data runtime, UI, route changes, navigation changes, feedback forms, persistence, audit writes, backend/API, official evidence, approval collection, assignment, AP-10B work, AP-10C, or AP-11.

## Content Safety Checks

- [ ] All sample summaries are synthetic.
- [ ] All reviewer concepts are role-category only.
- [ ] No sample includes real stakeholder feedback.
- [ ] No sample includes real student, staff, advisor, or personnel information.
- [ ] No sample implies production readiness.
- [ ] No sample implies official workflow activation.

## Coverage Checks

- [ ] All MC41 theme categories are covered.
- [ ] All MC41 severities are covered.
- [ ] All MC41 follow-up types are covered.
- [ ] At least one governance-sensitive sample is present.
- [ ] At least one out-of-scope sample is present.
- [ ] Accessibility, privacy, workflow, training, and confusion-risk scenarios are represented.

## PII Exclusion Checks

Confirm samples exclude:
- names
- emails
- phone numbers
- student/personnel IDs
- national IDs
- bank or financial details
- signatures
- private remarks
- sensitive personal stories

## Forbidden Wording Checks

Confirm samples do not include wording that claims:
- approval
- sign-off
- AP-10B approval
- AP-10B evidence
- legal/DPO approval
- authority verification
- production authorization
- official evidence
- persistence activation
- audit write activation
- scholarship decision
- assignment instruction

## Governance-Sensitive Checks

- [ ] Governance-sensitive sample remains a planning signal only.
- [ ] Governance-sensitive sample does not update AP-10B.
- [ ] Governance-sensitive sample does not clear blockers.
- [ ] Governance-sensitive sample does not start AP-10C.
- [ ] Governance-sensitive sample does not start AP-11.
- [ ] Governance-sensitive follow-up points only to separate planning review.

## Runtime Readiness Checks

Future sample runtime must:
- use MC41 `createDemoFeedbackSynthesisItems`
- assert every generated item with MC41 safety guard behavior
- set `nonApprovalConfirmed: true`
- keep fixed false safety flags
- summarize aggregate counts only
- write nothing
- persist nothing
- call no backend/API
- write no audit events
- use no browser storage
- create no official evidence

## AP-10B Separation Checks

- [ ] AP-10B owners remain 0/7.
- [ ] AP-10B approvals remain 0/7.
- [ ] AP-10B blockers remain 9/9 active.
- [ ] AP-10C remains blocked.
- [ ] AP-11 remains blocked.
