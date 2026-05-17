# S²IMS Candidate Review Audit Write Safety Checklist (MC9)

## Purpose

This checklist defines the safety gates that must pass before any future runtime branch writes audit events for candidate review actions (MC8). It is documentation-only. No audit writes, runtime changes, or persistence activation are performed by this document or this branch.

The MC8 runtime (candidateReviewState.ts, CandidateSelectionReviewShell.tsx) is the authoritative source baseline. This checklist governs what must hold true before a separate future branch begins audit-write implementation.

---

## Pre-Implementation Gate

Before the first line of audit-write runtime code is written for candidate review:

- [ ] MC9 plan document is approved.
- [ ] MC9 metadata contract document is reviewed and accepted.
- [ ] A runtime branch is explicitly created with a name indicating audit-write intent (do not use this planning branch).
- [ ] AP-10B gate status is re-confirmed: 0/7 owners, 0/7 approvals, 9/9 blockers active.
- [ ] AP-10C is confirmed blocked: no schema, migration, or runtime persistence changes will be in scope.
- [ ] AP-11 is confirmed blocked: no production workflow activation in scope.

---

## No-Persistence-By-Default Checks

- [ ] No `localStorage`, `sessionStorage`, or `IndexedDB` access is introduced in the candidate review module.
- [ ] No new database, schema, migration, SQL, or API endpoint files are created.
- [ ] No `fetch()`, `axios`, or equivalent HTTP client calls are introduced in candidate review code paths.
- [ ] No `sharedMockWriter.write()` or any audit writer call is made from the candidate review shell.
- [ ] No `AuditService.record*` call is made from the candidate review shell.
- [ ] No state persistence beyond React `useState` is introduced.
- [ ] No `prototypeAuditPersistenceService` or any `_persist` service is wired to candidate review actions.

---

## Event Name Checks

- [ ] All introduced event names use the `candidate_review.*` double-colon namespace prefix.
- [ ] No `candidate.auto_assign`, `candidate.assign`, `candidate.approve`, `scholarship.approve`, or `scholarship.reject` event names are introduced.
- [ ] No `governance.collect_ap10b_approval`, `governance.verify_authority`, or `governance.mark_as_owner` event names are introduced.
- [ ] `FORBIDDEN_ACTIONS` set is not modified — all 8 original entries remain.
- [ ] `FORBIDDEN_ACTIONS` entries `auto_assign_candidate`, `assign_candidate`, `approve_candidate`, `approve_scholarship`, `reject_scholarship`, `collect_ap10b_approval`, `verify_authority`, `mark_as_governance_owner` are not referenced in any new code path that would allow them to silently bypass the guard.

---

## Metadata Checks

- [ ] Event metadata contains only allowed fields: `candidateToken`, `nextReviewState`, `reviewAction`, `safeReasonCode`, `sourceRoute`, `replacedEventId` (correction events only).
- [ ] `targetDisplayToken` field verifies `Candidate #C-XXXX` format — raw IDs must be masked before writing.
- [ ] No raw candidate ID, raw student ID, email, personal email, mobile, phone, national ID appears in metadata.
- [ ] No `assignedBy`, `assignedAt`, `approvedBy`, `approvalStatus`, `scholarshipDecision`, or `remark` fields appear.
- [ ] `validateAuditMetadata` (or equivalent) is applied to every event shape before write.
- [ ] No PII field is logged, displayed, or committed in any audit event payload or label.

---

## Reason Code Checks

- [ ] `safeReasonCode` values are drawn from a closed, documented vocabulary.
- [ ] Future vocabulary is enumerated before the first runtime branch is opened.
- [ ] Free-text reason strings are not written into audit event metadata.
- [ ] `reject_for_assignment` events that carry a reason use a `safeReasonCode`, not a free-text field.
- [ ] No reason code implies an approval, assignment, or scholarship decision outcome.

---

## Diagnostic Boundary Checks

- [ ] Any audit events created during a mock or diagnostic phase are labeled with `copyStage: "Mock/Demo"` or an equivalent diagnostic label in display contexts.
- [ ] Diagnostic events are not labeled with official language: not "recorded", "audited", "confirmed", "verified", or "finalized".
- [ ] The `forMockOnlyDisplay` or `diagnosticOnly` pattern is used for any pre-production events (equivalent to the `prototype_only` pattern in the mock writer).
- [ ] A clear cartographer comment states that diagnostic events carry no official evidence weight until a production persistence path is approved.

---

## No-Approval/Decision/AP10B Checks

- [ ] No candidate review audit event carries or implies a scholarship approval outcome.
- [ ] No candidate review audit event is named, labeled, or documented as an approval collect action.
- [ ] No `AP-10B` progress update, owner naming, or approval count change is introduced in any doc or code file.
- [ ] AP-10B gate artifact (`AP-10B approval signature tracker` or equivalent) is not modified.
- [ ] No AP-10C or AP-11 task or reference appears in the future branch.

---

## Rollback and Correction Checks

- [ ] Correction events (`candidate_review.state_corrected`, `candidate_review.bulk_clear`) are defined as separate event types, not reuses of shortlist/skip/etc.
- [ ] Correction events include `replacedEventId` pointing to the event being corrected.
- [ ] If the audit-write implementation is prototype-enabled, a clear disable-and-clear path exists (equivalent to `clearSharedMockAuditEvents()` or `clearMockOnly()`).
- [ ] The rollback path does not require additional approval steps before it can be executed.

---

## QA Gates

Before any future audit-write runtime branch for candidate review can be merged:

- [ ] Build: `npm run build` passes at 40/40.
- [ ] Tokens: `npm run check:tokens` passes at 4/4.
- [ ] Audit checks: `npm run check:audit-events` passes at 216/216 or higher.
- [ ] Route smoke: `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002` all 200 OK.
- [ ] Dev log: clean (no warnings or errors).
- [ ] Docs-only diff confirmed: `git diff --name-only origin/main...HEAD` shows only files under `docs/`.
- [ ] AP-10B gate verified: 0/7 owners, 0/7 approvals, 9/9 blockers active.
- [ ] AP-10C check: no `audit_events` DB schema, migration, or backend route files exist in branch.
- [ ] AP-11 check: no production workflow, persistence activation, or real-workflow assignment files exist in branch.
- [ ] MC1–MC7 review boundary verified: all prior MC module artifacts unchanged.
