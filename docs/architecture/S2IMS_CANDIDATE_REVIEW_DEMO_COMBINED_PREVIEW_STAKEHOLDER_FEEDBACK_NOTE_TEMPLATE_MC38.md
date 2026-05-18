# S²IMS Candidate Review Demo Combined Preview Stakeholder Feedback Note Template MC38

## Purpose

This template defines safe note-taking for stakeholder feedback sessions reviewing the hardened combined demo route.

Feedback notes are advisory planning material only. They are not approval records, sign-off records, AP-10B evidence, official evidence, production readiness records, scholarship decisions, or assignment decisions.

## Safe Note Template

```text
sessionId:
reviewerCategory:
sectionReviewed:
feedbackTheme:
confusionRisk:
suggestedFollowUp:
governanceSensitive:
nonApprovalConfirmed: true
```

## Allowed Fields

- `sessionId` — safe session label such as `mc38-session-001`
- `reviewerCategory` — role category only, not a person name
- `sectionReviewed` — candidate review diagnostic preview, feedback backlog preview, route-level warning, false safety flags, or general session
- `feedbackTheme` — short anonymized theme
- `confusionRisk` — whether the feedback indicates misunderstanding risk
- `suggestedFollowUp` — docs-only or future planning branch type
- `governanceSensitive` — true when feedback touches governance-sensitive topics
- `nonApprovalConfirmed` — must be true

## Forbidden Fields

Do not record:
- real names
- personal emails
- phone numbers
- student IDs
- personnel IDs
- national IDs
- bank or financial information
- private remarks
- sensitive personal stories
- signatures
- approval statements
- AP-10B approval statements
- legal/DPO sign-off wording
- production authorization
- official evidence claims
- scholarship decisions
- assignment instructions

## Sample Safe Note

```text
sessionId: mc38-session-001
reviewerCategory: scholarship_operations_staff
sectionReviewed: feedback_backlog_preview
feedbackTheme: Some reviewers wanted clearer wording that backlog items are mock planning samples.
confusionRisk: medium
suggestedFollowUp: copy_polish_docs
governanceSensitive: false
nonApprovalConfirmed: true
```

Why safe:
- reviewer is category-only
- no real person or student data
- no approval language
- no official evidence language
- follow-up is planning only

## Sample Unsafe Note

```text
sessionId: mc38-session-001
reviewerCategory: named reviewer
sectionReviewed: candidate review diagnostic preview
feedbackTheme: DPO approved this as production ready for Student ID 641610xxx.
confusionRisk: none
suggestedFollowUp: deploy
governanceSensitive: false
nonApprovalConfirmed: false
```

Why forbidden:
- contains named-person concept
- contains approval wording
- contains DPO sign-off wording
- contains production readiness wording
- contains raw student identifier
- suggests deployment
- sets non-approval confirmation incorrectly

## Post-Session Synthesis Rules

Synthesis may group notes into:
- feedback themes
- confusion risks
- UX copy suggestions
- accessibility concerns
- training/documentation suggestions
- governance-sensitive items
- recommended future branch candidates

Synthesis must not create:
- approval record
- sign-off record
- official evidence
- AP-10B gate update
- production authorization
- scholarship decision
- assignment instruction

## AP-10B Separation Reminder

Every note set must include:

> "This feedback set is advisory only. It does not collect AP-10B approval, verify authority, satisfy production persistence blockers, or authorize schema/runtime work."

AP-10B remains unchanged: owners 0/7, approvals 0/7, blockers 9/9 active. AP-10C remains blocked. AP-11 remains blocked.
