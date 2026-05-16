# S²IMS Staff Candidate Generator Runtime MC3 Summary

## Purpose

Implements the MC3 staff candidate generator runtime as a pure TypeScript module in `src/lib/assignment/staffCandidateGenerator.ts`. Converts `EmployeeStaffSourceRecord` inputs into safe `StaffCandidatePoolItem` objects for scholarship workflow staff assignment. No auto-assignment. No UI. No backend. No persistence.

Staff candidates are workflow suggestions only — not automatic assignments, not approvals, not AP-10B governance owners, not scholarship authorizations.

## Files Created

- `src/lib/assignment/staffCandidateGenerator.ts` — new pure TypeScript module (types + functions)

## Files Modified

- `src/lib/assignment/index.ts` — barrel export appended: `export * from "./staffCandidateGenerator"`
- `scripts/check-audit-events.mjs` — 23 MC3 staff runtime checks added (total: 178)
- `docs/architecture/NEXT_RENOVATION_STEPS.md` — MC3 runtime section appended
- `docs/daily-reports/2026-05-16-s2ims-staff-candidate-generator-runtime-mc3.md` — daily report

## Runtime Scope

Pure TypeScript. No React. No Next.js. No API routes. No database. No persistence layer. No network calls. All functions are synchronous and pure.

Reuses MC1 utilities from `candidatePoolPrivacy.ts`:
- `buildDisplayName` — display name from title/name/surname
- `normalizeOfficialEmail` — cmu_mail normalization only; never mobile or personal email

## Input / Output Contract

### Input type

```ts
export type EmployeeStaffSourceRecord = {
  employee_id: string;      // required
  title?: string;
  name: string;             // required
  surname: string;          // required
  role?: string;
  department?: string;
  division?: string;
  unit?: string;
  ext?: string;             // in input; never on output
  mobile?: string;          // in input; NEVER on output
  cmu_mail?: string;
};
```

### Output type

```ts
export type StaffCandidatePoolItem = {
  candidateId: string;       // format: "staff:{employee_id}"
  sourceType: "employee";
  sourceId: string;          // employee_id (internal only)
  displayName: string;
  roleCategory: "scholarship_operations" | "student_support" | "document_checker"
    | "eligibility_checker" | "qa_reviewer" | "system_support"
    | "finance_checker" | "rollback_operator" | "admin_support";
  roleLabel: string;
  unitOrDepartment: string;
  officialEmail?: string;    // cmu_mail only — never mobile or personal email
  assignmentContexts: Array<"scholarship_application_review" | "document_review"
    | "eligibility_check" | "student_follow_up" | "qa_review"
    | "technical_support" | "finance_disbursement_check" | "rollback_support" | "admin_operations">;
  status: "suggested";       // literal — always "suggested"
  confidence: "mock" | "rule_based" | "manual";
  isMock: true;              // literal
  autoAssigned: false;       // literal — always false
  privacyLevel: "safe_display";
};
```

### Build result type

```ts
export type StaffCandidatePoolBuildResult = {
  items: StaffCandidatePoolItem[];
  sourceRecordCount: number;
  candidateCount: number;
  autoAssignedCount: 0;      // literal — always 0
  unsafeRecordCount: number;
};
```

## Employee Source Mapping

| unit / division / role | roleCategory | contexts | confidence |
|------------------------|--------------|---------|------------|
| unit = Student_Development | student_support | student_follow_up, scholarship_application_review | rule_based |
| unit = Education_Services | eligibility_checker | eligibility_check, document_review | rule_based |
| unit = IT_Communication | system_support | technical_support | rule_based |
| unit = Strategy_Quality_Assurance | qa_reviewer | qa_review | rule_based |
| unit = Finance_Supplies | finance_checker | finance_disbursement_check | rule_based |
| unit/role contains "rollback" | rollback_operator | rollback_support | rule_based |
| unit/role contains "admin" | admin_support | admin_operations | rule_based |
| division = Education_Student_Quality | scholarship_operations | scholarship_application_review, student_follow_up | rule_based |
| fallback | scholarship_operations | scholarship_application_review | mock |

Priority: unit check first, then division, then fallback.

`unitOrDepartment` resolution: unit → division → department → `"Unassigned Unit"`.

## Functions

| Function | Description |
|----------|-------------|
| `deriveStaffRoleCategory(record)` | Returns roleCategory from unit/division mapping |
| `deriveStaffAssignmentContexts(record)` | Returns assignmentContexts array from unit/division mapping |
| `assertSafeStaffCandidate(candidate)` | Throws if forbidden keys present or literals wrong |
| `normalizeStaffCandidate(record)` | Produces a safe `StaffCandidatePoolItem`; calls `assertSafeStaffCandidate` before return |
| `buildStaffCandidatePool(records)` | Maps records with per-record try/catch, deduplicates by `candidateId` |

## Privacy Rules

| Field | Rule |
|-------|------|
| `mobile` | FORBIDDEN — never on `StaffCandidatePoolItem` |
| `phone` | FORBIDDEN — never on `StaffCandidatePoolItem` |
| `email` (personal) | FORBIDDEN — never on `StaffCandidatePoolItem` |
| `remark` | FORBIDDEN — never on `StaffCandidatePoolItem` |
| `cmu_mail` → `officialEmail` | Allowed (role-gated display) — normalized via `normalizeOfficialEmail` |
| `employee_id` → `sourceId` | Internal only — not for display |
| `candidateId` | `staff:{employee_id}` — internal only |
| Student ID | Not in scope of this module |
| `ext` | In input type but never on output type |

`assertSafeStaffCandidate` enforces the following forbidden keys at runtime:
`mobile`, `phone`, `email`, `personalEmail`, `privateEmail`, `remark`, `rawStudentId`, `studentId`, `nationalId`, `approvalStatus`, `approvedBy`, `approvalCollected`, `scholarshipDecision`, `decisionStatus`, `assignedBy`, `assignedAt`

Also enforces: `autoAssigned === false`, `isMock === true`, `status === "suggested"`, `sourceType === "employee"`.

## No Auto-Assignment Confirmation

- `autoAssigned: false` — literal on every `StaffCandidatePoolItem`
- `autoAssignedCount: 0` — literal in `StaffCandidatePoolBuildResult`
- `status: "suggested"` — initial status; staff must confirm before assignment
- `assertSafeStaffCandidate` throws if `autoAssigned !== false`
- No auto-assignment logic in any function in this module

## No Approval Confirmation

- No `approvalStatus` field on any type
- No `scholarshipDecision` field on any type
- No AP-10B governance fields on any type
- `assertSafeStaffCandidate` throws on `approvalStatus`, `approvedBy`, `approvalCollected`, `scholarshipDecision`, `decisionStatus`, `assignedBy`, `assignedAt`
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
- `StaffCandidatePoolItem` is a distinct type — does not replace MC1's type

## MC2 Boundary

- `src/lib/assignment/advisorCandidateGenerator.ts` — unchanged
- `AdvisorCandidatePoolItem` — unchanged
- `PersonnelAdvisorSourceRecord` — unchanged
- `buildAdvisorCandidatePool` — unchanged
- `assertSafeAdvisorCandidate` — unchanged

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
| `phone` on output type | No |
| `email` on output type | No |
| `remark` on output type | No |
| `officialEmail` uses `cmu_mail` only | Yes |
| `autoAssigned: false` literal | Yes |
| `status: "suggested"` literal | Yes |
| `isMock: true` literal | Yes |
| `autoAssignedCount: 0` literal | Yes |
| `assertSafeStaffCandidate` guards at runtime | Yes |
