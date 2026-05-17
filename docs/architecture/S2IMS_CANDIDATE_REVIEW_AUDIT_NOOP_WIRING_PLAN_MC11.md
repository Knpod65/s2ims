# S²IMS Candidate Review Audit No-op Wiring Plan (MC11)

## Purpose
This document defines a documentation-only plan for MC11 that outlines how a future runtime phase may connect MC8 local review actions to MC10 diagnostic event objects without writing, persisting, exporting, or treating events as official evidence. MC11 is a prerequisite for any future no-op wiring implementation and must remain documentation-only with no source, runtime, or UI changes.

## Scope
MC11 covers the planning and safety validation for connecting MC8 candidate review local-state transitions to MC10 diagnostic audit-event objects in a no-op (diagnostic-only, non-persistent) manner. It does not introduce any audit writes, persistence, backend/API calls, browser storage, official evidence, assignment, approval, or AP-10B governance actions. The scope is limited to documentation and validation checks that ensure future no-op wiring can be implemented safely on a separate branch.

## Source Baseline
The source baseline for MC11 includes the following files, which are inspected for context only and not modified:
- MC8 local state: `src/lib/assignment/candidateReviewState.ts`
- MC10 audit event builder: `src/lib/assignment/candidateReviewAuditEvent.ts`
- MC8 UI shell: `src/components/assignment/CandidateSelectionReviewShell.tsx`
- Audit validation script: `scripts/check-audit-events.mjs`
- MC9 plan: `docs/architecture/S2IMS_CANDIDATE_REVIEW_AUDIT_EVENT_PLAN_MC9.md`
- MC9 metadata contract: `docs/architecture/S2IMS_CANDIDATE_REVIEW_AUDIT_METADATA_CONTRACT_MC9.md`
- MC9 write safety checklist: `docs/architecture/S2IMS_CANDIDATE_REVIEW_AUDIT_WRITE_SAFETY_CHECKLIST_MC9.md`
- MC10 builder runtime summary: `docs/architecture/S2IMS_CANDIDATE_REVIEW_AUDIT_EVENT_BUILDER_RUNTIME_MC10_SUMMARY.md`
- MC10 builder QA summary: `docs/architecture/S2IMS_CANDIDATE_REVIEW_AUDIT_EVENT_BUILDER_RUNTIME_MC10_QA_SUMMARY.md`
- MC8 local state summary: `docs/architecture/S2IMS_CANDIDATE_REVIEW_LOCAL_STATE_RUNTIME_MC8_SUMMARY.md`
- MC7 action boundary plan: `docs/architecture/S2IMS_CANDIDATE_SELECTION_ACTION_BOUNDARY_PLAN_MC7.md`
- Next renovation steps: `docs/architecture/NEXT_RENOVATION_STEPS.md`

MC11 confirms:
- MC10 builder exists and produces diagnostic-only event objects with `diagnosticOnly: true` and `officialEvidence: false`.
- MC10 does not write audit events, persist data, or call backend/API.
- MC8 local state provides safe transitions and a forbidden-actions set that excludes assignment, approval, and AP-10B governance actions.
- No audit write wiring exists between MC8 and MC10 in the current codebase.
- AP-10B gate remains unchanged (0/7 owners, 0/7 approvals, 9/9 blockers).
- AP-10C and AP-11 remain blocked.

## Future No-op Wiring Behavior
A future no-op wiring implementation (on a separate branch) may:
- Import the MC10 audit event builder function.
- Import MC8 local state transition helpers.
- Build diagnostic event objects from MC8 transitions using the MC10 builder.
- Validate the built event objects against MC9 metadata rules (via the existing audit-check script or equivalent).
- Discard the event objects after validation (no write, no persistence, no export).
- Ensure the lifecycle ends at discard; nothing is saved to browser storage, backend, or official audit log.
- Keep UI copy boundary: label events as "diagnostic preview", "not saved", "not official evidence", etc.
- Maintain safe metadata boundary: no PII, no forbidden fields, no approval/assignment semantics.
- Respect the future no-op runtime gate: only proceed if MC11 plan QA passes, MC10 builder unchanged or reviewed, audit checks increase, and build/tokens/audit/routes all pass.
- Preserve MC1–MC10 boundaries and keep AP-10B gate unchanged, AP-10C blocked, AP-11 blocked.

## No-op Event Lifecycle
1. **Trigger**: MC8 local state transition occurs (e.g., user clicks "Shortlist").
2. **Input**: Transition object passed to MC10 builder (along with actor, workflow, etc.).
3. **Build**: MC10 builder returns a diagnostic event object with `diagnosticOnly: true` and `officialEvidence: false`.
4. **Validate**: Event object validated against MC9 allowed/forbidden names and metadata (no mutations).
5. **Discard**: Event object is discarded; no write, no persistence, no export, no backend call.
6. **End**: Lifecycle terminates; no official evidence created.

## UI Copy Boundary
Future no-op wiring UI must:
- Label events as "diagnostic preview", "not saved", "not official evidence", "for validation only", etc.
- Avoid forbidden terms: "saved", "submitted", "approved", "assigned", "recorded", "audited", "confirmed", "verified", "finalized".
- Not imply assignment, approval, scholarship decision, or AP-10B governance.
- Use the same copy patterns as MC10 diagnostic events (e.g., `copyStage: "Mock/Demo"` or equivalent).
- Ensure UI remains read-only and does not enable assignment/approval actions.

## Safe Metadata Boundary
Future no-op wiring must enforce:
- Allowed metadata fields only: `candidateToken`, `nextReviewState`, `reviewAction`, `safeReasonCode`, `sourceRoute`.
- Forbidden metadata fields must never appear: `rawStudentId`, `studentEmail`, `personalEmail`, `mobile`/`phone`, `nationalId`, `assignedBy`, `assignedAt`, `approvedBy`, `approvalStatus`, `scholarshipDecision`, `remark`, `fullName`.
- `safeReasonCode` must be from a closed vocabulary (if present) and not imply approval/assignment/scholarship.
- `candidateToken` must be in `Candidate #C-XXXX` format (masked).
- Metadata validation must use the existing `validateAuditMetadata` pattern or equivalent.

## Future No-op Runtime Gate
A future no-op runtime branch may proceed only after:
- MC11 plan document is approved via QA checkpoint.
- MC10 builder remains unchanged or has been reviewed and approved.
- Audit checks increase (or at least do not decrease) from the MC10 baseline.
- Build: `npm run build` passes at 40/40.
- Tokens: `npm run check:tokens` passes at 4/4.
- Route smoke: `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002` all return 200 OK.
- Dev log: clean (no warnings or errors).
- AP-10B gate verified unchanged: 0/7 owners, 0/7 approvals, 9/9 blockers active.
- AP-10C and AP-11 remain blocked.
- MC1–MC10 boundaries preserved.

## Rollback and Failure Behavior
Future no-op wiring must:
- Have no persistence, so rollback is implicit (nothing to roll back).
- On validation failure, discard the event object and log a dev-only warning (no UI impact).
- On build/test failure, the branch must not be merged.
- On any forbidden detection (write, persistence, PII, etc.), the branch must be rejected.
- Failure to meet the no-op runtime gate blocks merge.

## QA Checklist
Before MC11 documentation is considered complete:
- [x] All MC11 documents created (this plan, safety checklist, implementation checklist, daily report).
- [x] MC11 is documentation-only: no changes to `src/`, `scripts/`, or `package.json`.
- [x] No audit writes introduced.
- [x] No persistence (no `localStorage`, `sessionStorage`, `IndexedDB`, DB, schema, migration).
- [x] No backend/API calls (no `fetch`, `axios`, `AuditService.record*`).
- [x] No browser storage introduced.
- [x] No official evidence (`officialEvidence` remains `false` in MC10 builder).
- [x] No assignment, approval, scholarship decision, or AP-10B governance actions enabled.
- [x] UI copy boundary documented (diagnostic preview, not saved).
- [x] Safe metadata boundary documented (allowed/forbidden fields).
- [x] Future no-op runtime gate documented.
- [x] Rollback and failure behavior documented.
- [x] AP-10B gate unchanged (0/7 owners, 0/7 approvals, 9/9 blockers).
- [x] AP-10C blocked.
- [x] AP-11 blocked.
- [x] MC1–MC10 boundaries preserved.
