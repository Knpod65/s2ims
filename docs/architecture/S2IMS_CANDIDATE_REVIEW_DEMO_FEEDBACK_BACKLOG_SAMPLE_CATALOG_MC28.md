# S²IMS Candidate Review Demo Feedback Backlog Sample Catalog MC28

## 1. Purpose

This catalog defines safe planning-only sample records for future demo feedback backlog use with the MC27 mock runtime.

The samples are not runtime fixtures in MC28. They are documentation examples only.

## 2. Sample Catalog

| Sample ID | Category | Priority Intent | Safe Summary | Proposed Branch Type | AP-10B Impact |
|-----------|----------|-----------------|--------------|----------------------|---------------|
| MC28-S01 | `ux_clarity` | `P3_ux_clarity` | Clarify why the diagnostic preview is local only. | `copy_polish_runtime` | `none` |
| MC28-S02 | `copy_content` | `P1_misleading_copy_or_workflow` | Improve wording around mock backlog planning status. | `copy_polish_docs` | `none` |
| MC28-S03 | `accessibility` | `P2_accessibility_blocker` | Increase keyboard review clarity for preview controls. | `accessibility_polish_runtime` | `none` |
| MC28-S04 | `privacy_pdpa` | `P0_safety_privacy` | Clarify that demo feedback samples contain no personal data. | `privacy_wording_clarification` | `none` |
| MC28-S05 | `workflow_understanding` | `P1_misleading_copy_or_workflow` | Explain the handoff from feedback review to planning backlog. | `future_planning_doc` | `none` |
| MC28-S06 | `training_readiness` | `P4_training_documentation` | Add facilitator notes for stakeholder walkthrough sessions. | `training_doc_update` | `none` |
| MC28-S07 | `risk_concern` | `P0_safety_privacy` | Flag confusing wording that could imply production readiness. | `copy_polish_runtime` | `none` |
| MC28-S08 | `future_enhancement` | `P3_ux_clarity` | Explore a read-only backlog preview in a later approved branch. | `future_planning_doc` | `none` |
| MC28-S09 | `out_of_scope_governance` | `out_of_scope_governance` | Route governance-sensitive requests to planning review only. | `no_branch` | `governance_sensitive` |

## 3. Source Input Shape

Each future sample should include:
- `sourceSessionId`
- `stakeholderGroup`
- `category`
- `summary`
- `safetyConcern`
- `proposedBranchType`
- `ap10bImpact`
- `nonApprovalConfirmed`

Safe source session IDs should use mock values such as `demo-session-001`.

## 4. Coverage Matrix

| Coverage Area | Samples |
|---------------|---------|
| UX clarity | MC28-S01 |
| Copy/content | MC28-S02 |
| Accessibility | MC28-S03 |
| Privacy/PDPA | MC28-S04 |
| Workflow understanding | MC28-S05 |
| Training/readiness | MC28-S06 |
| Risk/concern | MC28-S07 |
| Future enhancement | MC28-S08 |
| Out-of-scope/governance | MC28-S09 |

## 5. Unsafe Sample Exclusions

Do not include:
- real names
- phone numbers
- email addresses
- raw student IDs
- teacher IDs
- national IDs
- bank details
- signatures
- private remarks
- sensitive hardship details
- approval wording
- assignment wording
- official evidence wording
- AP-10B sign-off wording

## 6. AP-10B Separation Notes

Sample records are not:
- AP-10B approvals
- AP-10B owner evidence
- authority verification
- official sign-off
- production readiness approval
- scholarship decisions
- assignment decisions

AP-10B remains unchanged: owners 0/7, approvals 0/7, blockers 9/9 active.

