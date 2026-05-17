# S²IMS Candidate Review Audit Event Plan (MC9)

## Purpose

This document defines the plan for future audit-write design around candidate review local-state actions introduced in MC8. It is documentation-only: no runtime code, no audit writes, no persistence activation are created by this plan. The MC8 runtime is the authoritative source baseline.

## Scope

Covers all candidate review actions that may be audited in future phases (MC9+). Does not cover Staff document rejection/replacement (AP-6D), Admin mock audit display (AP-6A/AP-6B/AP-6C), or production persistence (AP-10B/AP-10C/AP-11).

## Source Baseline

MC8 source baseline files:

- `src/lib/assignment/candidateReviewState.ts` — state machine types, forbidden actions guard, pure transition helpers
- `src/components/assignment/CandidateSelectionReviewShell.tsx` — read-only React UI shell with local state
- `scripts/check-audit-events.mjs` — audit guardrail check script (216/216 check ceiling)
- `docs/architecture/S2IMS_CANDIDATE_REVIEW_LOCAL_STATE_RUNTIME_MC8_SUMMARY.md` — MC8 implementation summary

MC8 confirms:

- All actions update only local React state.
- No storage, no fetch/API, no audit writes, no persistence.
- `FORBIDDEN_ACTIONS` set blocks: `auto_assign_candidate`, `assign_candidate`, `approve_candidate`, `approve_scholarship`, `reject_scholarship`, `collect_ap10b_approval`, `verify_authority`, `mark_as_governance_owner`.

## Allowed Future Event Names

These are the candidate review actions that may be audited in a future audit-write implementation phase. They map directly to `CandidateReviewAction` values from MC8:

| Event Name | Source Action | Semantic Meaning |
|---|---|---|
| `candidate_review.shortlist` | `shortlist_candidate` | Candidate has been shortlisted by a reviewer |
| `candidate_review.skip` | `skip_candidate` | Candidate has been skipped by a reviewer |
| `candidate_review.needs_more_context` | `request_more_context` | Reviewer flagged candidate as needing more information |
| `candidate_review.reject_for_assignment` | `reject_for_assignment` | Candidate rejected for role assignment |
| `candidate_review.manually_selected` | `manually_select_candidate` | Candidate manually selected by a reviewer |
| `candidate_review.clear` | `clear_review_state` | Review state reset to not reviewed |

All future event names must use the `candidate_review.*` double-colon namespace prefix.

## Forbidden Event Names

These event names must never be introduced as audit events for candidate review, consistent with MC8 `FORBIDDEN_ACTIONS`:

| Event Name | Reason |
|---|---|
| `candidate.auto_assign` | Candidate auto-assignment not permitted |
| `candidate.assign` | Assignment action not permitted in review scope |
| `candidate.approve` | Approval action not permitted in review scope |
| `scholarship.approve` | Scholarship approval is out of scope |
| `scholarship.reject` | Scholarship rejection is out of scope |
| `governance.collect_ap10b_approval` | AP-10B approval collection gate is separate |
| `governance.verify_authority` | Authority verification is a separate workflow |
| `governance.mark_as_owner` | Owner designation is a separate workflow |

No candidate review audit event may include approval, assignment, scholarship decision, AP-10B governance, or authority verification semantics.

## Event Meaning Matrix

| Event Name | Actor Role | Target Entity | Requires Reason Code | Free-Text Reason | Outcome |
|---|---|---|---|---|---|
| `candidate_review.shortlist` | staff / admin | candidate | No | No | UI local state only until audit-write phase |
| `candidate_review.skip` | staff / admin | candidate | No | No | UI local state only until audit-write phase |
| `candidate_review.needs_more_context` | staff / admin | candidate | No | No | UI local state only until audit-write phase |
| `candidate_review.reject_for_assignment` | staff / admin | candidate | Yes (safe code) | No | UI local state only until audit-write phase |
| `candidate_review.manually_selected` | staff / admin | candidate | No | No | UI local state only until audit-write phase |
| `candidate_review.clear` | staff / admin | candidate | No | No | UI local state only until audit-write phase |

## Safe Metadata Contract

Future audit events for candidate review must follow this metadata shape:

**Allowed metadata fields:**

- `candidateToken` — masked candidate token, e.g. `Candidate #C-2048` (token format only, no raw ID)
- `nextReviewState` — the resulting `CandidateReviewState` value
- `reviewAction` — the `CandidateReviewAction` value
- `safeReasonCode` — optional short code string (not free text)
- `sourceRoute` — route from which the action originated

**Forbidden metadata fields (must never appear in any candidate review audit event):**

- `rawStudentId` — raw student ID
- `studentEmail` — any email field
- `personalEmail` — personal email
- `mobile` / `phone` — contact fields
- `nationalId` — identification number
- `assignedBy` / `assignedAt` — assignment tracking fields
- `approvedBy` / `approvalStatus` — approval tracking fields
- `scholarshipDecision` — scholarship decision field
- `remark` — free-text note

This list mirrors the `FORBIDDEN_METADATA_KEYS` pattern established in `auditMetadataRules.ts`.

## Diagnostic vs Official Evidence Boundary

Candidate review events in the local state stage are **diagnostic tools** only. They do not create official audit evidence.

The boundary between diagnostic and official evidence:

- **Diagnostic (MC8, current):** React `useState` map, local-only, resets on navigation, zero persistence guarantee.
- **Official (future, blocked until MC9 approval):** Audit events written via `AuditService` into verified repository, with persistence mode `mock_only` or `real_persisted`, visible in Admin audit log.

No candidate review action in MC8 or any future diagnostic phase implies approval, assignment, or scholarship decision.

## Reason Code Boundary

Candidate review audit events may carry a `safeReasonCode` — a short, fixed vocabulary code string (e.g., `insufficient_qualification`, `schedule_conflict`).

Reason code constraints:

- Must be a short string code, not a free-text sentence.
- No PII in reason codes.
- Reason code vocabulary must be enumerated in a separate future plan document before the first audit-write implementation.
- No reason code maps to approval, scholarship decision, or AP-10B outcome.
- `reject_for_assignment` may carry a safe reason code; all other actions do not require one but may optionally carry one.

## Rollback and Correction Events

Future rollback and correction events for candidate review must use distinct, explicitly named events. They must not reuse existing action event types as "corrections."

Planned future rollback events:

| Event Name | Purpose |
|---|---|
| `candidate_review.state_corrected` | Explicit state correction by a supervisor or system action |
| `candidate_review.bulk_clear` | Bulk clear of review state (admin-initiated only) |

These events must be audited with a `replacedEventId` field pointing to the event being corrected. `replacedEventId` is an allowed metadata field for correction events only.

## Future Audit Write Gate

Audit writes for candidate review events may be implemented only after:

1. This MC9 plan is approved.
2. A separate MC9+ runtime branch is opened.
3. The `safeReasonCode` vocabulary is documented and approved.
4. All existing validation (build 40/40, tokens 4/4, audit checks 216/216) continues to pass.
5. AP-10B gate remains separate — no candidate review audit event touches AP-10B.
6. AP-10C remains blocked until AP-10B approvals are complete.
7. AP-11 remains blocked.

Any future audit-write implementation for candidate review must be on a branch explicitly tagged as a runtime phase, not merged into this planning branch.

## QA Checklist

Before any future audit-write runtime branch for candidate review is merged:

- [ ] Build: `npm run build` passes at 40/40
- [ ] Tokens: `npm run check:tokens` passes at 4/4
- [ ] Audit checks: `npm run check:audit-events` passes at 216/216 or higher
- [ ] Route smoke: `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002` all 200 OK
- [ ] Dev log clean
- [ ] No audit write code in the candidate review shell component
- [ ] No persistence, localStorage, sessionStorage, IndexedDB
- [ ] No backend/API calls (no fetch, no axios, no service mutation)
- [ ] No PII fields in any audit event shape
- [ ] `FORBIDDEN_ACTIONS` set still contains all 8 entries
- [ ] `auto_assign_candidate`, `assign_candidate`, `approve_candidate`, `approve_scholarship`, `reject_scholarship`, `collect_ap10b_approval`, `verify_authority`, `mark_as_governance_owner` are not in any future code path
- [ ] AP-10B gate verified unchanged: 0/7 owners, 0/7 approvals, 9/9 blockers
- [ ] AP-10C blocked — no schema/migration/runtime changes
- [ ] AP-11 blocked — no real persistence or production workflow activation
- [ ] MC1–MC7 review boundary preserved
