# S²IMS Candidate Review Demo Feedback Backlog Sample QA Checklist MC28

## 1. Purpose

This checklist defines QA rules for future safe sample backlog data based on the MC28 plan.

MC28 is documentation-only. This checklist does not implement runtime sample data.

## 2. PII Scan Checklist

- [ ] No real names.
- [ ] No phone numbers.
- [ ] No email addresses.
- [ ] No raw student IDs.
- [ ] No teacher IDs.
- [ ] No national IDs.
- [ ] No bank or financial details.
- [ ] No signatures.
- [ ] No private remarks.
- [ ] No sensitive hardship details.

## 3. Approval Wording Checklist

- [ ] No approval statements.
- [ ] No sign-off statements.
- [ ] No AP-10B approval wording.
- [ ] No authority verification wording.
- [ ] No production readiness approval wording.
- [ ] No scholarship decision wording.
- [ ] No assignment decision wording.
- [ ] No official audit evidence wording.

## 4. Forbidden Field Checklist

- [ ] No `mobile`.
- [ ] No `phone`.
- [ ] No `email`.
- [ ] No `personalEmail`.
- [ ] No `rawEmail`.
- [ ] No `privateEmail`.
- [ ] No `privateRemark`.
- [ ] No `rawStudentId`.
- [ ] No `studentId`.
- [ ] No `teacherId`.
- [ ] No `nationalId`.
- [ ] No `bankAccount`.
- [ ] No `signature`.
- [ ] No `approvalStatus`.
- [ ] No `approvedBy`.
- [ ] No `assignedBy`.
- [ ] No `assignedAt`.
- [ ] No `scholarshipDecision`.

## 5. Category Coverage Checklist

- [ ] `ux_clarity`
- [ ] `copy_content`
- [ ] `accessibility`
- [ ] `privacy_pdpa`
- [ ] `workflow_understanding`
- [ ] `training_readiness`
- [ ] `risk_concern`
- [ ] `future_enhancement`
- [ ] `out_of_scope_governance`

## 6. Priority Coverage Checklist

- [ ] `P0_safety_privacy`
- [ ] `P1_misleading_copy_or_workflow`
- [ ] `P2_accessibility_blocker`
- [ ] `P3_ux_clarity`
- [ ] `P4_training_documentation`
- [ ] `out_of_scope_governance`

## 7. AP-10B Separation Checklist

- [ ] Samples are not AP-10B approvals.
- [ ] Samples are not owner evidence.
- [ ] Samples are not authority verification.
- [ ] Samples are not official evidence.
- [ ] Samples do not change AP-10B gate status.
- [ ] AP-10C remains blocked.
- [ ] AP-11 remains blocked.

## 8. Future Runtime Readiness Checklist

- [ ] Future sample runtime is on a separate explicitly approved branch.
- [ ] Future sample runtime passes samples through MC27 validation.
- [ ] Future sample runtime remains mock-only.
- [ ] Future sample runtime does not collect real feedback.
- [ ] Future sample runtime does not persist, export, notify, or write audit events.
- [ ] Future sample runtime does not expose the demo route in navigation.

