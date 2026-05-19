# S²IMS Candidate Review Demo Combined Preview Feedback Synthesis Sample Catalog MC42

## Purpose

This catalog defines safe sample input planning for a future MC41 feedback synthesis sample runtime.

The catalog is documentation-only. It does not implement a sample runtime, route integration, UI, feedback form, persistence, audit write, backend/API, official evidence, approval collection, assignment, AP-10B action, AP-10C, or AP-11.

## Sample Input Table

| Sample ID | Theme Category | Section Reviewed | Severity Intent | Suggested Follow-up | Governance Sensitive? | Safe Summary |
|-----------|----------------|------------------|-----------------|---------------------|------------------------|--------------|
| MC42-SYN-001 | `clarity_copy` | `combined_route` | low | `docs_copy_update` | false | Clarify wording that the preview is not saved. |
| MC42-SYN-002 | `layout_navigation` | `combined_route` | medium | `ux_hardening_plan` | false | Improve section spacing between diagnostic preview and backlog preview. |
| MC42-SYN-003 | `accessibility` | `combined_route` | high | `accessibility_plan` | false | Add clearer keyboard guidance for the demo route. |
| MC42-SYN-004 | `privacy_pdpa` | `general_demo` | high | `demo_route_copy_polish` | false | Clarify that mock data contains no real stakeholder records. |
| MC42-SYN-005 | `workflow_understanding` | `candidate_review_preview` | high | `ux_hardening_runtime` | false | Explain false safety flags in simpler language. |
| MC42-SYN-006 | `training_support` | `feedback_backlog_preview` | medium | `walkthrough_update` | false | Add facilitator training note for the backlog preview section. |
| MC42-SYN-007 | `stakeholder_confusion_risk` | `feedback_backlog_preview` | high | `docs_copy_update` | false | Reduce confusion between feedback backlog and production backlog. |
| MC42-SYN-008 | `governance_sensitive` | `general_demo` | blocked | `governance_escalation_plan` | true | Governance-sensitive comment requires separate planning review. |
| MC42-SYN-009 | `out_of_scope` | `general_demo` | low | `no_action` | false | Out-of-scope request should not become implementation work. |
| MC42-SYN-010 | `accessibility` | `combined_route` | high | `accessibility_runtime` | false | Improve accessible wording for read-only safety flag review. |

## Category Coverage Table

| Theme Category | Covered By |
|----------------|------------|
| `clarity_copy` | MC42-SYN-001 |
| `layout_navigation` | MC42-SYN-002 |
| `accessibility` | MC42-SYN-003, MC42-SYN-010 |
| `privacy_pdpa` | MC42-SYN-004 |
| `workflow_understanding` | MC42-SYN-005 |
| `training_support` | MC42-SYN-006 |
| `stakeholder_confusion_risk` | MC42-SYN-007 |
| `governance_sensitive` | MC42-SYN-008 |
| `out_of_scope` | MC42-SYN-009 |

## Severity Coverage Table

| Severity | Covered By |
|----------|------------|
| `low` | MC42-SYN-001, MC42-SYN-009 |
| `medium` | MC42-SYN-002, MC42-SYN-006 |
| `high` | MC42-SYN-003, MC42-SYN-004, MC42-SYN-005, MC42-SYN-007, MC42-SYN-010 |
| `blocked` | MC42-SYN-008 |

## Follow-up Coverage Table

| Follow-up Type | Covered By |
|----------------|------------|
| `docs_copy_update` | MC42-SYN-001, MC42-SYN-007 |
| `walkthrough_update` | MC42-SYN-006 |
| `ux_hardening_plan` | MC42-SYN-002 |
| `ux_hardening_runtime` | MC42-SYN-005 |
| `accessibility_plan` | MC42-SYN-003 |
| `accessibility_runtime` | MC42-SYN-010 |
| `demo_route_copy_polish` | MC42-SYN-004 |
| `governance_escalation_plan` | MC42-SYN-008 |
| `no_action` | MC42-SYN-009 |

## Governance-Sensitive Sample Notes

MC42-SYN-008 is the only governance-sensitive sample. It is included to verify future sample runtime handling of governance-sensitive separation.

The sample says only that a comment requires separate planning review. It does not say AP-10B is approved, authority is verified, production is approved, evidence is collected, legal review is complete, DPO sign-off exists, persistence is authorized, or blockers are cleared.

## Unsafe Sample Exclusions

The catalog excludes:
- real stakeholder feedback
- names
- emails
- phone numbers
- student/personnel IDs
- national IDs
- signatures
- approval statements
- sign-off statements
- official evidence claims
- AP-10B evidence claims
- production authorization
- scholarship decisions
- assignment instructions
- sensitive personal stories

## AP-10B Separation Reminder

MC42 sample planning does not collect AP-10B approval, verify authority, satisfy production blockers, authorize runtime work, start AP-10C, or start AP-11.

AP-10B remains unchanged: owners 0/7, approvals 0/7, blockers 9/9 active.
