# S²IMS Candidate Review Demo Combined Preview Stakeholder Feedback Session Plan MC38

## 1. Purpose

MC38 defines a safe stakeholder feedback session plan for reviewing the hardened combined demo route after internal dry-run readiness.

Core rule: the stakeholder session collects feedback only. It must not collect approval, sign-off, AP-10B approval, authority verification, production readiness approval, scholarship decision, assignment decision, or official evidence.

## 2. Scope

In scope:
- stakeholder session purpose
- prerequisites
- invitee categories
- facilitation process
- safe feedback boundaries
- privacy and PII handling
- non-approval boundary
- AP-10B separation
- post-session synthesis
- governance-sensitive escalation rules

Out of scope:
- runtime implementation
- route modification
- navigation exposure
- new route creation
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

MC38 builds from:
- MC35 hardened combined demo route
- MC36 walkthrough script and stakeholder Q&A guardrails
- MC37 dry-run package, facilitator checklist, and readiness scorecard

Current baseline:
- build: 41/41
- token checks: 4/4
- audit/event checks: 440/440
- routes: 6/6 200 OK, including `/admin/candidate-review-demo`
- dev log clean

MC38 does not modify source, runtime, route, navigation, script, backend/API, persistence, migration, SQL, package, or audit writer files.

## 4. Session Prerequisites

Before stakeholder session:
- dry-run package completed
- readiness scorecard passes
- facilitator familiar with MC36 walkthrough script
- Q&A guardrails reviewed
- demo route validated
- AP-10B separation statement prepared
- note-taker briefed on forbidden content
- privacy reminders prepared
- stakeholder invitation explains feedback-only purpose

## 5. Invitee Categories

Allowed invitee categories:
- scholarship operations staff
- academic/advisor representatives
- student services representatives
- privacy/PDPA reviewer
- UX/process reviewer
- technical observer

Invitees are reviewers only. They are not AP-10B approval owners and do not provide sign-off through this session.

## 6. Session Flow

Recommended flow:
1. Opening non-approval boundary
2. Explain purpose of demo
3. Explain two preview sections
4. Candidate review diagnostic preview walkthrough
5. Feedback backlog preview walkthrough
6. False safety flag explanation
7. Guided feedback questions
8. Governance-sensitive question handling
9. Closing non-approval reminder
10. Post-session synthesis

## 7. Safe Feedback Collection Boundaries

Allowed feedback:
- clarity
- wording
- layout
- accessibility
- process comprehension
- privacy expectations
- confusion risks
- training usefulness
- stakeholder readiness concerns

Forbidden collection:
- signatures
- approvals
- AP-10B approval statements
- legal/DPO sign-off
- production authorization
- real student/personnel details
- sensitive personal stories
- scholarship decisions
- assignment instructions
- official evidence claims

## 8. Note-Taking Rules

Allowed notes:
- anonymized feedback theme
- role category only
- section reference
- confusion risk
- wording concern
- accessibility concern
- suggested follow-up branch type

Forbidden notes:
- real names
- personal emails/phones
- student/personnel IDs
- national IDs
- financial information
- signatures
- approval wording
- legal/DPO sign-off wording
- production readiness approval

## 9. AP-10B Separation Language

Use this statement:

> "This session is for feedback only. It does not collect AP-10B approval, verify authority, satisfy production persistence blockers, or authorize schema/runtime work."

Facilitators must repeat this if a stakeholder asks whether the session counts as approval, sign-off, evidence, readiness, authority verification, or AP-10B progress.

## 10. Post-Session Synthesis

Synthesis should produce:
- feedback themes
- confusion risks
- UX copy suggestions
- accessibility issues
- training/documentation suggestions
- governance-sensitive items separated
- recommended future branch candidates

Synthesis must not produce:
- approval record
- sign-off record
- official evidence
- AP-10B gate update
- production authorization

## 11. Governance-Sensitive Escalation

If feedback mentions:
- production readiness
- official evidence
- audit write activation
- persistence activation
- AP-10B approval
- legal/DPO sign-off
- authority verification
- scholarship decision
- assignment workflow

Then classify as governance-sensitive. Do not treat it as product feedback. Route only to a separate AP-10B process if explicitly requested later.

## 12. QA Checklist

- [ ] MC38 remains documentation-only.
- [ ] No `src/*` changes.
- [ ] No `scripts/*` changes.
- [ ] No `package.json` changes.
- [ ] Stakeholder session plan documented.
- [ ] Prerequisites documented.
- [ ] Invitee categories documented.
- [ ] Safe feedback boundaries documented.
- [ ] Note-taking rules documented.
- [ ] AP-10B separation documented.
- [ ] Governance-sensitive escalation documented.
- [ ] No approval collection.
- [ ] No sign-off collection.
- [ ] No official evidence creation.
- [ ] AP-10B gate unchanged.
- [ ] AP-10C blocked.
- [ ] AP-11 blocked.
