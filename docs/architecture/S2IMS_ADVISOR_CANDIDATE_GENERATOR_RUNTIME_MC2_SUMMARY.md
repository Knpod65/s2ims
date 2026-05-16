# S²IMS Advisor Candidate Generator Runtime MC2 Summary

## Purpose

Implements the MC2 advisor candidate generator runtime as a pure TypeScript module in `src/lib/assignment/advisorCandidateGenerator.ts`. Converts `PersonnelAdvisorSourceRecord` inputs into safe `AdvisorCandidatePoolItem` objects. No auto-assignment. No UI. No backend. No persistence.

Advisor candidates are workflow suggestions only — not automatic assignments, not approvals, not AP-10B governance owners, not scholarship authorizations.

## Files Created

- `src/lib/assignment/advisorCandidateGenerator.ts` — new pure TypeScript module (types + functions)

## Files Modified

- `src/lib/assignment/index.ts` — barrel export appended: `export * from "./advisorCandidateGenerator"`
- `scripts/check-audit-events.mjs` — 16 MC2 advisor runtime checks added (total: 155)
- `docs/architecture/NEXT_RENOVATION_STEPS.md` — MC2 runtime section appended
- `docs/daily-reports/2026-05-16-s2ims-advisor-candidate-generator-runtime-mc2.md` — daily report

## Runtime Scope

Pure TypeScript. No React. No Next.js. No API routes. No database. No persistence layer. No network calls. All functions are synchronous and pure.

Reuses MC1 utilities from `candidatePoolPrivacy.ts`:
- `buildDisplayName` — display name from title/name/surname
- `normalizeOfficialEmail` — cmu_mail normalization only; never personal email
- `normalizeUnitOrDepartment` — department normalization

## Safe Output Contract

### Types

```ts
export type PersonnelAdvisorSourceRecord = {
  teacher_id: string;        // required
  title?: string;
  name: string;              // required
  surname: string;           // required
  department?: string;
  cmu_mail?: string;
  email?: string;            // in input — NEVER copied to output
  mobile?: string;           // in input — NEVER copied to output
  remark?: string;           // in input — NEVER copied to output
};

export type AdvisorCandidatePoolItem = {
  candidateId: string;       // format: "advisor:{teacher_id}"
  sourceType: "personnel";
  sourceId: string;          // teacher_id (internal only)
  displayName: string;
  roleCategory: "academic_advisor" | "program_reviewer" | "faculty_reviewer" | "scholarship_academic_reviewer";
  roleLabel: string;
  unitOrDepartment: string;
  officialEmail?: string;    // cmu_mail only — never personal email
  assignmentContexts: Array<"advisor_review" | "scholarship_academic_review" | "program_eligibility_review" | "student_follow_up">;
  status: "suggested";       // literal — always "suggested"
  confidence: "mock" | "rule_based" | "manual";
  isMock: true;              // literal
  autoAssigned: false;       // literal — always false
  privacyLevel: "safe_display";
};

export type AdvisorCandidatePoolBuildResult = {
  items: AdvisorCandidatePoolItem[];
  sourceRecordCount: number;
  candidateCount: number;
  autoAssignedCount: 0;      // literal — always 0
  unsafeRecordCount: number;
};
```

### Functions

| Function | Description |
|----------|-------------|
| `mapAdvisorRoleCategory(dept?)` | GOV/PA/IA/STB → `academic_advisor`; fallback → `faculty_reviewer` |
| `mapAdvisorAssignmentContexts(dept?)` | GOV/PA/IA/STB → `["advisor_review","scholarship_academic_review"]`; fallback → `["advisor_review"]` |
| `assertSafeAdvisorCandidate(candidate)` | Throws if forbidden keys present or literals wrong |
| `normalizeAdvisorCandidate(record)` | Produces a safe `AdvisorCandidatePoolItem`; calls `assertSafeAdvisorCandidate` before return |
| `buildAdvisorCandidatePool(records)` | Maps records, catches per-record errors, deduplicates by `candidateId` |

## Privacy Rules

| Field | Rule |
|-------|------|
| `mobile` | FORBIDDEN — never on `AdvisorCandidatePoolItem` |
| `email` (personal) | FORBIDDEN — never on `AdvisorCandidatePoolItem` |
| `remark` | FORBIDDEN — internal only; never on `AdvisorCandidatePoolItem` |
| `cmu_mail` → `officialEmail` | Allowed (role-gated display) — normalized via `normalizeOfficialEmail` |
| `teacher_id` → `sourceId` | Internal only — not for display |
| `candidateId` | `advisor:{teacher_id}` — internal only |
| Student ID | Not applicable to advisor module |

`assertSafeAdvisorCandidate` enforces the following forbidden keys at runtime:
`mobile`, `email`, `personalEmail`, `remark`, `approvalStatus`, `scholarshipDecision`, `apOwner`, `ap10bOwner`, `approvalEvidence`

Also enforces: `autoAssigned === false`, `isMock === true`, `status === "suggested"`.

## No Auto-Assignment Confirmation

- `autoAssigned: false` — literal on every `AdvisorCandidatePoolItem`
- `autoAssignedCount: 0` — literal in `AdvisorCandidatePoolBuildResult`
- `status: "suggested"` — initial status; staff must confirm before assignment
- `assertSafeAdvisorCandidate` throws if `autoAssigned !== false`
- No auto-assignment logic in any function in this module

## No Approval Confirmation

- No `approvalStatus` field on any type
- No `scholarshipDecision` field on any type
- No AP-10B governance fields on any type
- `assertSafeAdvisorCandidate` throws on `approvalStatus`, `scholarshipDecision`, `apOwner`, `ap10bOwner`, `approvalEvidence`
- No approval collection performed

## MC1 Boundary

- `src/lib/assignment/candidatePoolBuilder.ts` — unchanged
- `src/lib/assignment/employeeCandidatePoolAdapter.ts` — unchanged
- `src/lib/assignment/personnelCandidatePoolAdapter.ts` — unchanged
- `src/lib/assignment/candidatePoolTypes.ts` — unchanged
- `src/lib/assignment/candidatePoolPrivacy.ts` — unchanged (utilities reused, not modified)
- `MockAssignmentCandidatePoolItem` — unchanged
- `assertSafeCandidatePoolItem` — unchanged
- `autoAssignedCount: 0` literal in MC1 builder — unchanged
- `AdvisorCandidatePoolItem` is a distinct type — does not replace MC1's type

## AP-10B Gate Status

| Metric | Status |
|--------|--------|
| Candidate owners identified | 0/7 |
| Authority verified | 0/7 |
| Named owners | 0/7 |
| Approvals collected | 0/7 |
| Blocking conditions active | 9/9 |
| Blocking conditions cleared | 0/9 |
| AP-10C may open | No |
| AP-11 may open | No |

AP-10C remains blocked. AP-11 remains blocked.

## Validation Results

| Check | Result |
|-------|--------|
| Build | Compiled successfully — 0 type errors |
| Token check | Passed — 4/4 |
| Audit/event checks | Passed — 155/155 |
| `/login` | 200 OK |
| `/admin/audit-log` | 200 OK |
| `/admin/dashboard` | 200 OK |
| `/staff/applications/app_001` | 200 OK |
| `/staff/applications/app_002` | 200 OK |
| Dev log | Clean |

## QA Checklist

| Item | Result |
|------|--------|
| `src/*` changed outside `src/lib/assignment/` | No |
| `scripts/*` changed outside `check-audit-events.mjs` | No |
| `package.json` changed | No |
| Backend/API files created | No |
| Migrations created | No |
| SQL created | No |
| Persistence activated | No |
| Auto-assignment implemented | No |
| UI/UX implemented | No |
| PII exposed | No |
| Approval collection performed | No |
| AP-10B owner named | No |
| AP-10C started | No |
| AP-11 started | No |
| `mobile` on output type | No |
| `email` on output type | No |
| `remark` on output type | No |
| `officialEmail` uses `cmu_mail` only | Yes |
| `autoAssigned: false` literal | Yes |
| `status: "suggested"` literal | Yes |
| `isMock: true` literal | Yes |
| `autoAssignedCount: 0` literal | Yes |
| `assertSafeAdvisorCandidate` guards at runtime | Yes |
