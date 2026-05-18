# S²IMS Candidate Review Demo Combined Preview Feedback Synthesis Plan MC39

## 1. Purpose

MC39 defines how stakeholder feedback from MC38 sessions should be synthesized into safe planning outputs without creating approval records, official evidence, AP-10B evidence, or production authorization.

Core rule: feedback synthesis is for planning only. It must not become approval, sign-off, authority verification, AP-10B approval, production readiness approval, scholarship decision, assignment decision, or official evidence.

## 2. Scope

In scope:
- feedback synthesis workflow
- allowed input materials
- forbidden input materials
- synthesis roles
- theme classification
- governance-sensitive separation
- PII exclusion
- safe output template
- follow-up branch recommendation rules
- QA checklist

Out of scope:
- runtime implementation
- route modification
- navigation exposure
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

MC39 builds from:
- MC38 stakeholder feedback session plan
- MC38 safe feedback note template
- MC36 stakeholder Q&A guardrails

Current baseline:
- build: 41/41
- token checks: 4/4
- audit/event checks: 440/440
- routes: 6/6 200 OK, including `/admin/candidate-review-demo`
- dev log clean

MC39 does not modify source, runtime, route, navigation, script, backend/API, persistence, migration, SQL, package, or audit writer files.

## 4. Allowed Source Materials

Allowed:
- anonymized notes from the MC38 safe note template
- `sectionReviewed`
- `feedbackTheme`
- `confusionRisk`
- `suggestedFollowUp`
- `governanceSensitive` flag
- `nonApprovalConfirmed` flag
- facilitator observations without names
- aggregated session themes

Forbidden:
- real names
- emails or phones
- student/personnel IDs
- national IDs
- signatures
- approval statements
- legal/DPO sign-off statements
- production readiness approval
- official evidence claims
- sensitive personal stories
- scholarship decisions
- assignment instructions

## 5. Synthesis Roles

Synthesis roles:
- synthesis lead
- privacy reviewer
- UX reviewer
- process owner reviewer
- technical reviewer
- governance-sensitive triage observer

These are synthesis roles only. They are not AP-10B approval owners, do not verify authority, and do not provide sign-off through synthesis.

## 6. Theme Classification Model

Classify feedback into:
- `clarity_copy`
- `layout_navigation`
- `accessibility`
- `privacy_pdpa`
- `workflow_understanding`
- `training_support`
- `stakeholder_confusion_risk`
- `governance_sensitive`
- `out_of_scope`

Each theme must include:
- short summary
- affected section
- severity
- suggested follow-up type
- `nonApprovalConfirmed: true`

## 7. Governance-Sensitive Separation

If feedback references:
- AP-10B approval
- official evidence
- production readiness
- audit write activation
- persistence activation
- legal/DPO sign-off
- authority verification
- scholarship decision
- assignment workflow

Then classify it separately as `governance_sensitive` and do not mix it into product backlog synthesis.

Governance-sensitive items may be listed as separate planning concerns only. They must not update AP-10B, start AP-10C, start AP-11, or authorize implementation.

## 8. Safe Synthesis Output Template

Allowed fields:

```text
synthesisId:
sourceSessionId:
themeCategory:
affectedSection:
summary:
severity:
suggestedFollowUpType:
governanceSensitive:
piiExcluded:
nonApprovalConfirmed:
officialEvidence: false
approvalCollected: false
```

Required fixed values:
- `piiExcluded: true`
- `nonApprovalConfirmed: true`
- `officialEvidence: false`
- `approvalCollected: false`

## 9. Follow-up Branch Recommendation Rules

Allowed follow-up branch types:
- `docs_copy_update`
- `walkthrough_update`
- `ux_hardening_plan`
- `ux_hardening_runtime`
- `accessibility_plan`
- `accessibility_runtime`
- `demo_route_copy_polish`
- `governance_escalation_plan`
- `no_action`

Forbidden direct recommendations:
- production deployment
- audit write activation
- persistence activation
- AP-10C
- AP-11
- approval collection
- authority verification
- scholarship decision automation
- assignment workflow activation

## 10. What Must Not Be Concluded

The synthesis must not conclude:
- stakeholders approved the demo
- AP-10B was satisfied
- production readiness was granted
- legal/DPO sign-off was collected
- official evidence was created
- the system may persist data
- scholarship decisions may be automated
- assignment decisions may be automated

## 11. QA Checklist

- [ ] MC39 remains documentation-only.
- [ ] No `src/*` changes.
- [ ] No `scripts/*` changes.
- [ ] No `package.json` changes.
- [ ] Synthesis plan documented.
- [ ] Allowed and forbidden source materials documented.
- [ ] Theme classification documented.
- [ ] Governance-sensitive separation documented.
- [ ] Safe output template documented.
- [ ] Follow-up branch rules documented.
- [ ] No approval interpretation.
- [ ] No official evidence interpretation.
- [ ] AP-10B gate unchanged.
- [ ] AP-10C blocked.
- [ ] AP-11 blocked.
