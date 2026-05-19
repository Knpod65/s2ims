# S²IMS Candidate Review Demo Combined Preview Feedback Synthesis Safe Sample Data Plan MC42

## 1. Purpose

MC42 defines safe sample input data planning for the MC41 feedback synthesis runtime.

Core rule:
Sample data must be safe mock planning data only. It must not contain real stakeholder feedback, PII, approval wording, AP-10B evidence wording, official evidence claims, scholarship decisions, assignment instructions, or production authorization.

## 2. Scope

In scope:
- sample input catalog
- theme coverage
- severity coverage
- follow-up type coverage
- governance-sensitive sample boundary
- forbidden wording
- forbidden PII
- sample QA checklist
- future runtime implementation rules

Out of scope:
- runtime implementation in MC42
- route modification
- navigation exposure
- UI implementation
- feedback form implementation
- storage/persistence
- backend/API
- database/schema/migration
- audit write
- official evidence creation
- assignment
- approval
- scholarship decision
- AP-10B governance
- AP-10C
- AP-11

## 3. Source Baseline

MC42 builds on:
- MC38 safe feedback note template
- MC39 synthesis classification model
- MC40 runtime contract
- MC41 synthesis runtime

Current baseline:
- build 41/41
- audit checks 455/455
- routes 6×200 OK

MC42 does not modify source/runtime files.

## 4. Sample Input Contract

Samples must match MC41 `DemoFeedbackSynthesisInput`:
- `sessionId`
- `reviewerCategory`
- `sectionReviewed`
- `feedbackTheme`
- `confusionRisk`
- `suggestedFollowUp`
- `governanceSensitive`
- `nonApprovalConfirmed: true`

All sample values must be synthetic, generic, role-category based, and non-identifying.

Allowed `sectionReviewed` values:
- `candidate_review_preview`
- `feedback_backlog_preview`
- `combined_route`
- `general_demo`

## 5. Required Sample Coverage

Sample catalog should include at least one sample for each theme category:
- `clarity_copy`
- `layout_navigation`
- `accessibility`
- `privacy_pdpa`
- `workflow_understanding`
- `training_support`
- `stakeholder_confusion_risk`
- `governance_sensitive`
- `out_of_scope`

Sample catalog should include severities:
- `low`
- `medium`
- `high`
- `blocked`

Sample catalog should include follow-up types:
- `docs_copy_update`
- `walkthrough_update`
- `ux_hardening_plan`
- `ux_hardening_runtime`
- `accessibility_plan`
- `accessibility_runtime`
- `demo_route_copy_polish`
- `governance_escalation_plan`
- `no_action`

## 6. Safe Sample Catalog

Proposed safe sample summaries:
- "Clarify wording that the preview is not saved."
- "Improve section spacing between diagnostic preview and backlog preview."
- "Add clearer keyboard guidance for the demo route."
- "Clarify that mock data contains no real stakeholder records."
- "Explain false safety flags in simpler language."
- "Add facilitator training note for the backlog preview section."
- "Reduce confusion between feedback backlog and production backlog."
- "Governance-sensitive comment requires separate planning review."
- "Out-of-scope request should not become implementation work."
- "Improve accessible wording for read-only safety flag review."

These summaries are safe because they do not include names, emails, IDs, signatures, approvals, official evidence, production authorization, scholarship decisions, assignment instructions, or personal stories.

## 7. Forbidden Sample Content

Forbidden:
- real names
- emails
- phone numbers
- student/personnel IDs
- national IDs
- signatures
- approval statements
- sign-off statements
- legal/DPO approval wording
- production readiness approval
- official evidence claims
- AP-10B approval claims
- scholarship decisions
- assignment instructions
- sensitive personal stories

## 8. Governance-Sensitive Sample Boundary

Governance-sensitive samples may mention that a comment requires separate planning review.

They must not say:
- AP-10B approved
- authority verified
- production approved
- evidence collected
- legal approved
- DPO signed off
- persistence authorized

Governance-sensitive samples are planning signals only. They do not update AP-10B, clear blockers, start AP-10C, or start AP-11.

## 9. Future Runtime Rules

Future sample runtime should:
- create a file only after separate approval
- use MC41 runtime builder
- export safe sample inputs only
- guard generated synthesis items
- summarize aggregate counts only
- expose no raw PII
- write nothing
- persist nothing
- call no API/backend
- create no official evidence

Future sample runtime must not:
- collect feedback
- create UI
- change the hidden demo route
- expose the demo route in navigation
- write audit events
- use browser storage
- activate persistence
- collect approvals
- create AP-10B evidence

## 10. QA Checklist

- [ ] MC42 remains docs-only.
- [ ] No `src/*` changes.
- [ ] No `scripts/*` changes.
- [ ] Sample data plan documented.
- [ ] Safe sample catalog documented.
- [ ] Theme coverage documented.
- [ ] Severity coverage documented.
- [ ] Follow-up coverage documented.
- [ ] Forbidden sample content documented.
- [ ] Governance-sensitive boundary documented.
- [ ] AP-10B unchanged.
- [ ] AP-10C blocked.
- [ ] AP-11 blocked.
