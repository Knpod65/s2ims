# S²IMS Candidate Review Demo Feedback Backlog Demo Data Plan MC28

## 1. Purpose

MC28 defines safe demo data requirements for future use with the MC27 feedback backlog mock runtime.

Demo backlog data is mock planning data only. It must not contain PII, approvals, official evidence, real stakeholder records, AP-10B sign-off, scholarship decisions, assignment decisions, or production readiness approvals.

## 2. Scope

In scope:
- demo backlog sample rules
- safe categories
- safe priorities
- safe sample summaries
- forbidden wording
- forbidden fields
- sample data QA
- AP-10B separation

Out of scope:
- runtime implementation
- backlog UI implementation
- feedback form implementation
- storage/persistence
- backend/API
- audit write
- route/navigation changes
- official evidence creation
- assignment
- approval
- scholarship decision
- AP-10B governance
- AP-10C
- AP-11

## 3. Source Baseline

MC28 builds from:
- MC25 feedback review board plan, prioritization matrix, and safe backlog template
- MC26 feedback backlog runtime plan and runtime branch rules
- MC27 pure TypeScript mock feedback backlog runtime

Current validation baseline:
- build: 41/41
- tokens: 4/4
- audit/event checks: 372/372
- route smoke: 6/6 200 OK
- dev log: clean

MC28 does not modify source/runtime files.

## 4. Safe Demo Data Rules

Allowed:
- mock source session IDs such as `demo-session-001`
- stakeholder group categories only
- safe feedback summaries
- safe categories from MC27
- safe priorities from MC27
- `nonApprovalConfirmed: true`
- `officialEvidence: false`
- `approvalCollected: false`
- `persisted: false`
- `exported: false`
- `notified: false`

Forbidden:
- real names
- personal contact information
- signatures
- approval statements
- AP-10B sign-off
- authority verification
- production readiness approval
- real student/personnel identifiers
- national ID
- phone/email
- bank or financial data
- private remarks
- sensitive hardship details
- scholarship decisions
- assignment decisions
- official audit evidence language

## 5. Safe Sample Data Set

Future demo sample data should use these planning-only inputs:

| sourceSessionId | stakeholderGroup | category | summary | safetyConcern | proposedBranchType | ap10bImpact | nonApprovalConfirmed |
|-----------------|------------------|----------|---------|---------------|--------------------|-------------|----------------------|
| `demo-session-001` | Scholarship staff | `ux_clarity` | Clarify why the diagnostic preview is local only. | false | `copy_polish_runtime` | `none` | true |
| `demo-session-002` | Admin reviewer | `copy_content` | Improve wording around mock backlog planning status. | false | `copy_polish_docs` | `none` | true |
| `demo-session-003` | Accessibility reviewer | `accessibility` | Increase keyboard review clarity for preview controls. | true | `accessibility_polish_runtime` | `none` | true |
| `demo-session-004` | Privacy reviewer | `privacy_pdpa` | Clarify that demo feedback samples contain no personal data. | true | `privacy_wording_clarification` | `none` | true |
| `demo-session-005` | Operations reviewer | `workflow_understanding` | Explain the handoff from feedback review to planning backlog. | false | `future_planning_doc` | `none` | true |
| `demo-session-006` | Training facilitator | `training_readiness` | Add facilitator notes for stakeholder walkthrough sessions. | false | `training_doc_update` | `none` | true |
| `demo-session-007` | Risk reviewer | `risk_concern` | Flag confusing wording that could imply production readiness. | true | `copy_polish_runtime` | `none` | true |
| `demo-session-008` | Product reviewer | `future_enhancement` | Explore a read-only backlog preview in a later approved branch. | false | `future_planning_doc` | `none` | true |
| `demo-session-009` | Governance reviewer | `out_of_scope_governance` | Route governance-sensitive requests to planning review only. | true | `no_branch` | `governance_sensitive` | true |

These are proposed sample inputs only. MC28 does not implement sample data runtime.

## 6. Unsafe Sample Examples

These examples must never be used:

| Unsafe Example | Why Forbidden |
|----------------|---------------|
| Dean approved production use | Contains approval and production readiness wording. |
| DPO approved AP-10B | Implies AP-10B approval collection. |
| Student 641610xxx needs urgent support | Contains a raw student identifier pattern and sensitive context. |
| Teacher ID xxx should be assigned | Contains personnel identifier wording and assignment wording. |
| This is official audit evidence | Implies official evidence. |
| Scholarship decision approved | Implies scholarship decision and approval. |

Negative or exclusion examples may appear only in planning docs as forbidden examples. They must not appear in runtime sample fixtures.

## 7. Future Runtime Use

Future runtime may only:
- use sample data as mock fixtures
- pass sample data into the MC27 builder
- render read-only backlog previews
- validate no PII and no approval wording

Future runtime must not:
- collect real feedback
- store feedback
- sync feedback
- export feedback
- notify users
- create official evidence
- change AP-10B gate

Any future sample runtime must happen on a separate explicitly approved branch.

## 8. QA Checklist

- [ ] Docs-only scope confirmed.
- [ ] No `src/*` changes.
- [ ] No `scripts/*` changes.
- [ ] Sample data rules documented.
- [ ] Safe sample catalog documented.
- [ ] Unsafe examples documented.
- [ ] No PII in safe samples.
- [ ] No approval wording in safe samples.
- [ ] AP-10B separation documented.
- [ ] AP-10C blocked.
- [ ] AP-11 blocked.

