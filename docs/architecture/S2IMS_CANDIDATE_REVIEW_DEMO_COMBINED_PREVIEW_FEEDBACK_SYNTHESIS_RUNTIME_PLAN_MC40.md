# S²IMS Candidate Review Demo Combined Preview Feedback Synthesis Mock Runtime Plan MC40

## 1. Purpose

MC40 defines a future pure TypeScript mock/in-memory runtime for converting safe stakeholder feedback notes into safe synthesis records.

Core rule: the synthesis runtime must produce planning-only records. It must not create approval records, official evidence, AP-10B evidence, authority verification, production readiness approval, scholarship decision, assignment decision, audit writes, or persisted records.

## 2. Scope

In scope:
- pure TypeScript runtime plan
- input contract
- output contract
- type definitions
- builder function requirements
- safety guard requirements
- classification rules
- governance-sensitive separation
- no-write/no-persistence rules
- QA checks for future runtime

Out of scope:
- runtime implementation in MC40
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

MC40 builds from:
- MC38 safe feedback note template
- MC39 synthesis output template
- MC39 classification matrix

Current baseline:
- build: 41/41
- token checks: 4/4
- audit/event checks: 440/440
- routes: 6/6 200 OK, including `/admin/candidate-review-demo`
- dev log clean

MC40 does not modify source, runtime, route, navigation, script, backend/API, persistence, migration, SQL, package, or audit writer files.

## 4. Proposed Runtime File

Future runtime file:
- `src/lib/assignment/demoFeedbackSynthesis.ts`

Allowed future exports:
- `DemoFeedbackSynthesisInput`
- `DemoFeedbackSynthesisItem`
- `DemoFeedbackSynthesisThemeCategory`
- `DemoFeedbackSynthesisSeverity`
- `DemoFeedbackSynthesisFollowUpType`
- `createDemoFeedbackSynthesisItems`
- `assertSafeDemoFeedbackSynthesisItem`
- `summarizeDemoFeedbackSynthesisItems`

## 5. Input Contract

Input should be based on MC38 safe note template.

Allowed input fields:
- `sessionId`
- `reviewerCategory`
- `sectionReviewed`
- `feedbackTheme`
- `confusionRisk`
- `suggestedFollowUp`
- `governanceSensitive`
- `nonApprovalConfirmed`

Forbidden input fields:
- real name
- email
- phone
- student/personnel ID
- national ID
- signature
- approval wording
- legal/DPO sign-off wording
- production authorization
- official evidence claim
- scholarship decision
- assignment instruction
- sensitive personal story

## 6. Output Contract

Output should follow MC39 safe synthesis output template.

Allowed output fields:
- `synthesisId`
- `sourceSessionId`
- `themeCategory`
- `affectedSection`
- `summary`
- `severity`
- `suggestedFollowUpType`
- `governanceSensitive`
- `piiExcluded`
- `nonApprovalConfirmed`
- `officialEvidence: false`
- `approvalCollected: false`
- `persisted: false`
- `exported: false`
- `notified: false`
- `isMock: true`

## 7. Theme Classification Rules

Supported categories:
- `clarity_copy`
- `layout_navigation`
- `accessibility`
- `privacy_pdpa`
- `workflow_understanding`
- `training_support`
- `stakeholder_confusion_risk`
- `governance_sensitive`
- `out_of_scope`

Rules:
- governance-sensitive feedback must be classified separately
- out-of-scope feedback must not become implementation backlog
- product feedback must not imply approval
- AP-10B references must not update AP-10B gate

## 8. Safety Guards

Future runtime must reject or throw on:
- missing `nonApprovalConfirmed: true`
- `officialEvidence: true`
- `approvalCollected: true`
- `persisted: true`
- `exported: true`
- `notified: true`
- PII fields
- approval/sign-off wording
- official evidence wording
- production authorization wording
- scholarship decision wording
- assignment instruction wording
- API/fetch/storage/audit-write tokens

## 9. Builder Function Requirements

`createDemoFeedbackSynthesisItems()` must:
- accept safe input records only
- return safe mock synthesis items only
- generate deterministic mock IDs
- set all safety flags explicitly
- call safety guard for every item
- perform no side effects
- write nothing
- persist nothing
- call no backend/API
- call no audit writer
- use no browser storage

## 10. Summary Function Requirements

`summarizeDemoFeedbackSynthesisItems()` may return only:
- total count
- category counts
- severity counts
- governance-sensitive count
- follow-up type counts
- fixed safety flag summary

It must not expose:
- raw notes
- reviewer identity
- PII
- approval wording
- official evidence wording

## 11. QA Checklist

- [ ] MC40 remains documentation-only.
- [ ] No `src/*` changes.
- [ ] No `scripts/*` changes.
- [ ] No `package.json` changes.
- [ ] Runtime plan documented.
- [ ] Input contract documented.
- [ ] Output contract documented.
- [ ] Safety guards documented.
- [ ] Classification rules documented.
- [ ] No-write/no-persistence guarantees documented.
- [ ] AP-10B gate unchanged.
- [ ] AP-10C blocked.
- [ ] AP-11 blocked.
