# S²IMS Combined Candidate Pool Runtime MC4 Summary

## Purpose

MC4 implements a pure TypeScript combined candidate pool integration under `src/lib/assignment/`. It merges already-safe MC2 advisor candidates (`AdvisorCandidatePoolItem`) and MC3 staff candidates (`StaffCandidatePoolItem`) into one combined pool result (`CombinedCandidatePoolItem`). No new source normalization is performed — the module only wraps and merges safe outputs from MC2 and MC3.

Combined candidates are workflow suggestions only. No candidate is auto-assigned, no approval is collected, no scholarship decision is made, and no AP-10B governance action is taken.

## Files Created

- `src/lib/assignment/combinedCandidatePool.ts`

## Files Modified

- `src/lib/assignment/index.ts` — added `export * from "./combinedCandidatePool";`
- `scripts/check-audit-events.mjs` — added 20 MC4 runtime checks (total 178 → 198)

## Runtime Scope

Pure TypeScript module under `src/lib/assignment/`. No React. No Next.js. No API routes. No database. No network calls. No side effects.

## Input/Output Contract

**Input:** optionally an `AdvisorCandidatePoolBuildResult` from MC2 and/or a `StaffCandidatePoolBuildResult` from MC3.

**Output:** `CombinedCandidatePoolBuildResult` containing:
- `items`: `CombinedCandidatePoolItem[]` — union of `(AdvisorCandidatePoolItem & { poolType: "advisor" })` and `(StaffCandidatePoolItem & { poolType: "staff" })`
- `advisorCandidateCount`: count of advisor candidates
- `staffCandidateCount`: count of staff candidates
- `candidateCount`: total combined count
- `autoAssignedCount: 0` — literal type, never changes
- `unsafeRecordCount`: sum of source pools' `unsafeRecordCount`
- `poolTypes`: which source pools were provided

## MC2 Advisor Input

`AdvisorCandidatePoolBuildResult` from `buildAdvisorCandidatePool`. Items are `AdvisorCandidatePoolItem` with `sourceType: "personnel"`, `status: "suggested"`, `autoAssigned: false`, `isMock: true`. Each item is safe-display only — no mobile, email, or remark.

## MC3 Staff Input

`StaffCandidatePoolBuildResult` from `buildStaffCandidatePool`. Items are `StaffCandidatePoolItem` with `sourceType: "employee"`, `status: "suggested"`, `autoAssigned: false`, `isMock: true`. Each item is safe-display only — no mobile, phone, email, or remark.

## Combined Pool Contract

- Advisor candidates listed first, then staff candidates
- No cross-source deduplication (candidateId namespaces `advisor:xxx` vs `staff:xxx` cannot collide)
- Each item adds only `poolType: "advisor"` or `poolType: "staff"` — no other fields added
- No assignment/approval/decision fields added
- `autoAssignedCount` is literal `0` — never writable
- `assertSafeCombinedCandidate` called on every item during merge

## Safe Output Contract

- `CombinedCandidatePoolItem` adds only `poolType` to existing safe MC2/MC3 fields
- All original safety invariants from MC2 and MC3 are preserved
- `assertSafeCombinedCandidate` delegates to `assertSafeAdvisorCandidate` or `assertSafeStaffCandidate` based on poolType
- Throws if poolType is invalid, autoAssigned is not false, isMock is not true, or status is not "suggested"

## Privacy Rules

- `mobile` — FORBIDDEN; not on `AdvisorCandidatePoolItem` or `StaffCandidatePoolItem`
- `phone` — FORBIDDEN; not on either type
- `email` (personal) — FORBIDDEN; not on either type
- `remark` — FORBIDDEN; not on either type
- `officialEmail` — from `cmu_mail` only (enforced in MC2/MC3); preserved in combined output
- `employee_id` / `teacher_id` → `sourceId` — internal only
- No student ID in scope of this module
- No PII exposed

## No Auto-Assignment Confirmation

- `autoAssigned: false` literal preserved on every combined item
- `autoAssignedCount: 0` literal on `CombinedCandidatePoolBuildResult`
- No auto-assignment logic in any function in this module
- `assertSafeCombinedCandidate` throws if `autoAssigned !== false`
- `status: "suggested"` preserved on every combined item — candidates must be confirmed before assignment

## No Approval Confirmation

- No `approvalStatus`, `approvedBy`, `approvalCollected` fields on any type
- No `scholarshipDecision`, `decisionStatus` fields on any type
- No `assignedBy`, `assignedAt` fields on any type
- `assertSafeCombinedCandidate` delegates to MC2/MC3 guards which throw on all forbidden approval/decision keys

## MC1 Boundary Confirmation

- `candidatePoolBuilder.ts` — unchanged
- `employeeCandidatePoolAdapter.ts` — unchanged
- `personnelCandidatePoolAdapter.ts` — unchanged
- `candidatePoolTypes.ts` — unchanged
- `candidatePoolPrivacy.ts` — unchanged
- `MockAssignmentCandidatePoolItem` — unchanged
- `assertSafeCandidatePoolItem` — unchanged
- `CombinedCandidatePoolItem` is a distinct type — does not replace or conflict with MC1 types

## MC2 Boundary Confirmation

- `advisorCandidateGenerator.ts` — unchanged
- `AdvisorCandidatePoolItem` — unchanged
- `assertSafeAdvisorCandidate` — unchanged and reused
- `CombinedCandidatePoolItem` adds poolType to `AdvisorCandidatePoolItem` — not replacing it

## MC3 Boundary Confirmation

- `staffCandidateGenerator.ts` — unchanged
- `StaffCandidatePoolItem` — unchanged
- `assertSafeStaffCandidate` — unchanged and reused
- `CombinedCandidatePoolItem` adds poolType to `StaffCandidatePoolItem` — not replacing it

## AP-10B Unaffected

- No AP-10B governance fields on any type
- No owner named
- No approval collected
- AP-10B gate unchanged: 0/7 owners, 0/7 approvals, 9/9 blockers active
- AP-10C: Blocked
- AP-11: Blocked

## QA Checklist

- [x] Build: 0 type errors
- [x] npm run check:tokens: 4/4
- [x] npm run check:audit-events: 198/198 (20 new MC4 checks added)
- [x] Routes: /login /admin/audit-log /admin/dashboard /staff/applications/app_001 /staff/applications/app_002 — 5×200 OK, dev log clean
- [x] Diff scope: only `combinedCandidatePool.ts`, `index.ts`, `check-audit-events.mjs`, 2 docs, `NEXT_RENOVATION_STEPS.md`
- [x] No unexpected files

## Recommended Next Step

- Run MC4 runtime QA checkpoint on feature branch
- Merge only after QA passes
- Create merge checkpoint after merge
- Run post-merge QA on main after merge checkpoint
- Future UI integration is a separate explicitly approved branch and task
- AP-10B owner candidate identification remains the only unblocked governance action
- AP-10C remains blocked
- AP-11 remains blocked
