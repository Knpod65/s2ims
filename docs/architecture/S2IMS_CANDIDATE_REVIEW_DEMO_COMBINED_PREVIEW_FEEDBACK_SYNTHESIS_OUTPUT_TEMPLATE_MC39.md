# S²IMS Candidate Review Demo Combined Preview Feedback Synthesis Output Template MC39

## Purpose

This document defines a safe planning-only output template for synthesizing stakeholder feedback collected under MC38.

Synthesis outputs are advisory planning artifacts only. They are not approval records, sign-off records, AP-10B evidence, official evidence, production readiness records, scholarship decisions, or assignment decisions.

## Safe Synthesis Record Template

```text
synthesisId:
sourceSessionId:
themeCategory:
affectedSection:
summary:
severity:
suggestedFollowUpType:
governanceSensitive:
piiExcluded: true
nonApprovalConfirmed: true
officialEvidence: false
approvalCollected: false
```

## Allowed Fields

- `synthesisId` — safe synthetic label such as `mc39-synthesis-001`
- `sourceSessionId` — safe MC38 session label only
- `themeCategory` — one of the MC39 classification categories
- `affectedSection` — candidate review diagnostic preview, feedback backlog preview, route-level warning, false safety flags, walkthrough script, Q&A guardrails, or general session
- `summary` — short anonymized planning summary
- `severity` — low, medium, high, or governance
- `suggestedFollowUpType` — allowed planning branch recommendation
- `governanceSensitive` — true only when the theme touches governance-sensitive subjects
- `piiExcluded` — must be true
- `nonApprovalConfirmed` — must be true
- `officialEvidence` — must be false
- `approvalCollected` — must be false

## Forbidden Fields

Do not include:
- real names
- emails or phones
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

## Sample Safe Synthesis

```text
synthesisId: mc39-synthesis-001
sourceSessionId: mc38-session-001
themeCategory: clarity_copy
affectedSection: feedback_backlog_preview
summary: Reviewers wanted clearer wording that backlog preview items are mock planning themes only.
severity: medium
suggestedFollowUpType: demo_route_copy_polish
governanceSensitive: false
piiExcluded: true
nonApprovalConfirmed: true
officialEvidence: false
approvalCollected: false
```

Why safe:
- uses session label only
- contains no person or student data
- contains no approval or official evidence claim
- recommends planning-only follow-up

## Sample Unsafe Synthesis

```text
synthesisId: mc39-synthesis-002
sourceSessionId: mc38-session-001
themeCategory: production_ready
affectedSection: candidate review diagnostic preview
summary: Named reviewer approved production use for Student ID 641610xxx.
severity: approved
suggestedFollowUpType: deploy
governanceSensitive: false
piiExcluded: false
nonApprovalConfirmed: false
officialEvidence: true
approvalCollected: true
```

Why forbidden:
- contains named-person concept
- contains approval wording
- contains production authorization
- contains raw student identifier
- treats feedback as official evidence
- sets required safety values incorrectly

## Follow-up Recommendation Rules

Allowed recommendations:
- docs copy update
- walkthrough update
- UX hardening plan
- UX hardening runtime in a separate approved branch
- accessibility plan
- accessibility runtime in a separate approved branch
- demo route copy polish
- governance escalation plan
- no action

Forbidden recommendations:
- production deployment
- audit write activation
- persistence activation
- AP-10C start
- AP-11 start
- approval collection
- authority verification
- scholarship decision automation
- assignment workflow activation

## AP-10B Separation Reminder

Every synthesis output set must include:

> "This synthesis is advisory planning material only. It does not collect AP-10B approval, verify authority, satisfy production persistence blockers, or authorize schema/runtime work."

AP-10B remains unchanged: owners 0/7, approvals 0/7, blockers 9/9 active. AP-10C remains blocked. AP-11 remains blocked.
