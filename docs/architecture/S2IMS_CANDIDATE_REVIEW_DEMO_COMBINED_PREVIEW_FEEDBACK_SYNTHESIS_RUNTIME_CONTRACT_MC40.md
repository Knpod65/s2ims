# S²IMS Candidate Review Demo Combined Preview Feedback Synthesis Runtime Contract MC40

## Purpose

This contract defines the future pure TypeScript mock/in-memory feedback synthesis runtime interface. MC40 does not implement the runtime.

The future runtime must convert safe MC38 feedback note records into safe MC39 synthesis records for planning only.

## Proposed Types

Future type exports:

```ts
type DemoFeedbackSynthesisThemeCategory =
  | "clarity_copy"
  | "layout_navigation"
  | "accessibility"
  | "privacy_pdpa"
  | "workflow_understanding"
  | "training_support"
  | "stakeholder_confusion_risk"
  | "governance_sensitive"
  | "out_of_scope";

type DemoFeedbackSynthesisSeverity =
  | "low"
  | "medium"
  | "high"
  | "governance";

type DemoFeedbackSynthesisFollowUpType =
  | "docs_copy_update"
  | "walkthrough_update"
  | "ux_hardening_plan"
  | "ux_hardening_runtime"
  | "accessibility_plan"
  | "accessibility_runtime"
  | "demo_route_copy_polish"
  | "governance_escalation_plan"
  | "no_action";
```

## Input Contract Table

| Field | Requirement |
|-------|-------------|
| `sessionId` | safe session label only |
| `reviewerCategory` | role category only, never a name |
| `sectionReviewed` | demo section or session area |
| `feedbackTheme` | short anonymized theme |
| `confusionRisk` | safe risk label or boolean-like value |
| `suggestedFollowUp` | planning-only follow-up hint |
| `governanceSensitive` | true when feedback touches governance triggers |
| `nonApprovalConfirmed` | must be true |

## Output Contract Table

| Field | Requirement |
|-------|-------------|
| `synthesisId` | deterministic mock ID |
| `sourceSessionId` | copied from safe `sessionId` |
| `themeCategory` | MC39 category |
| `affectedSection` | safe section label |
| `summary` | short anonymized planning summary |
| `severity` | low, medium, high, or governance |
| `suggestedFollowUpType` | allowed follow-up type |
| `governanceSensitive` | boolean |
| `piiExcluded` | must be true |
| `nonApprovalConfirmed` | must be true |
| `officialEvidence` | must be false |
| `approvalCollected` | must be false |
| `persisted` | must be false |
| `exported` | must be false |
| `notified` | must be false |
| `isMock` | must be true |

## Safety Flag Requirements

The future runtime must always set:
- `piiExcluded: true`
- `nonApprovalConfirmed: true`
- `officialEvidence: false`
- `approvalCollected: false`
- `persisted: false`
- `exported: false`
- `notified: false`
- `isMock: true`

## Forbidden Field List

Future runtime input and output must reject:
- real names
- emails
- phones
- student IDs
- personnel IDs
- national IDs
- bank or financial fields
- signatures
- private remarks
- sensitive personal stories
- approval fields
- official evidence fields
- scholarship decision fields
- assignment instruction fields

## Forbidden Wording List

Future runtime must reject wording that indicates:
- approval
- sign-off
- AP-10B approval
- legal/DPO sign-off
- authority verification
- production readiness approval
- official evidence
- persistence activation
- audit write activation
- scholarship decision
- assignment instruction

## Builder Function Contract

`createDemoFeedbackSynthesisItems()` must:
- accept only safe MC38-style note records
- create only safe MC39-style synthesis items
- generate deterministic mock IDs
- classify governance-sensitive records separately
- set all fixed safety flags
- validate every input and output
- return in-memory objects only
- perform no side effects

It must not:
- write files
- persist records
- call backend/API
- call audit writers
- use browser storage
- export data
- notify users
- create official evidence

## Summary Function Contract

`summarizeDemoFeedbackSynthesisItems()` may return:
- total count
- theme category counts
- severity counts
- governance-sensitive count
- suggested follow-up type counts
- fixed safety flag summary

It must not return:
- raw feedback notes
- reviewer identity
- PII
- approval wording
- official evidence wording
- assignment or scholarship decision wording

## AP-10B Separation Statement

The future runtime contract is planning-only. It does not collect AP-10B approval, verify authority, clear blockers, start AP-10C, start AP-11, or authorize schema/runtime work.

AP-10B remains unchanged: owners 0/7, approvals 0/7, blockers 9/9 active.
