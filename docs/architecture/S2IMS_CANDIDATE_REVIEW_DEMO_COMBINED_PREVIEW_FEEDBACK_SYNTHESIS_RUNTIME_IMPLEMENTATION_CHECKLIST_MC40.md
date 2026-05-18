# S²IMS Candidate Review Demo Combined Preview Feedback Synthesis Runtime Implementation Checklist MC40

## Purpose

This checklist defines future implementation checks for a pure TypeScript mock/in-memory feedback synthesis runtime. MC40 is planning-only and does not implement the runtime.

## Allowed Future Files

Allowed in a future explicitly approved runtime branch:
- `src/lib/assignment/demoFeedbackSynthesis.ts`
- `src/lib/assignment/index.ts`
- `scripts/check-audit-events.mjs`
- related docs and QA artifacts under `docs/**`

## Forbidden Future Files

Do not modify without a separate approved plan:
- routes/pages
- navigation config
- sidebar/topbar/mobile nav components
- backend/API files
- database or migrations
- SQL/schema files
- notification files
- export files
- fixtures
- package files

## Type Checks

- [ ] Input type matches MC38 safe note template.
- [ ] Output type matches MC39 safe synthesis output template plus mock/no-write flags.
- [ ] Theme category union includes only MC39 categories.
- [ ] Severity union includes only low, medium, high, and governance.
- [ ] Follow-up union includes only allowed planning follow-up types.
- [ ] No approval, evidence, scholarship decision, assignment, or PII fields are included.

## Builder Checks

- [ ] Builder accepts an array of safe input records.
- [ ] Builder returns an array of safe synthesis items.
- [ ] Builder generates deterministic mock IDs.
- [ ] Builder maps `sessionId` to `sourceSessionId`.
- [ ] Builder derives safe category, severity, and follow-up type.
- [ ] Builder separates governance-sensitive records.
- [ ] Builder calls safety guards for every input and output.
- [ ] Builder performs no side effects.

## Safety Guard Checks

- [ ] Reject missing `nonApprovalConfirmed: true`.
- [ ] Reject PII-like keys.
- [ ] Reject approval/sign-off wording.
- [ ] Reject official evidence wording.
- [ ] Reject production authorization wording.
- [ ] Reject scholarship decision wording.
- [ ] Reject assignment instruction wording.
- [ ] Reject `officialEvidence: true`.
- [ ] Reject `approvalCollected: true`.
- [ ] Reject `persisted: true`.
- [ ] Reject `exported: true`.
- [ ] Reject `notified: true`.

## Summary Checks

- [ ] Summary returns total count only.
- [ ] Summary returns category counts.
- [ ] Summary returns severity counts.
- [ ] Summary returns governance-sensitive count.
- [ ] Summary returns follow-up type counts.
- [ ] Summary returns fixed safety flag summary.
- [ ] Summary does not expose raw notes.
- [ ] Summary does not expose reviewer identity.
- [ ] Summary does not expose PII or approval/evidence wording.

## No-Write / No-Persistence Checks

- [ ] No `fetch` or API calls.
- [ ] No backend imports.
- [ ] No audit writer imports.
- [ ] No repository imports.
- [ ] No `localStorage`.
- [ ] No `sessionStorage`.
- [ ] No `IndexedDB`.
- [ ] No export/download behavior.
- [ ] No notification behavior.
- [ ] No file writes.
- [ ] No official evidence creation.

## Validation Commands

Future runtime implementation branch must run:
- `npm run build`
- `npm run check:tokens`
- `npm run check:audit-events`
- route smoke for `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002`, and `/admin/candidate-review-demo`
- dev log grep for `error|warn|hydrat|key|unsupported|chunk|500|404`

## Merge / Post-Merge QA Criteria

- [ ] Build passes 41/41 or current route count baseline.
- [ ] Token checks pass 4/4.
- [ ] Audit checks pass at current expected count.
- [ ] Six-route smoke passes.
- [ ] Dev log is clean.
- [ ] Diff scope matches approved files only.
- [ ] No route/navigation exposure.
- [ ] No persistence/API/audit write behavior.
- [ ] AP-10B unchanged.
- [ ] AP-10C blocked.
- [ ] AP-11 blocked.
