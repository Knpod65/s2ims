# S²IMS Mock Assignment Candidate Pool Runtime MC1 — Architecture Summary

## Overview

MC1 runtime implementation of the candidate pool adapter for S²IMS. The adapter normalizes Employee and Personnel CSV records into safe `MockAssignmentCandidatePoolItem` objects. No auto-assignment. No UI. No backend API. No database. Six pure TypeScript modules in `src/lib/assignment/`.

The system does NOT auto-assign. Human users manually select assignees on the web. Candidate pool items are selectable workflow options only — not AP-10B governance owners, not approvals, not verified authority.

## What Was Implemented

| File | Purpose |
|------|---------|
| `src/lib/assignment/candidatePoolTypes.ts` | All TypeScript type definitions |
| `src/lib/assignment/candidatePoolPrivacy.ts` | Privacy utility functions and runtime safety guard |
| `src/lib/assignment/employeeCandidatePoolAdapter.ts` | Employee CSV → candidate pool items |
| `src/lib/assignment/personnelCandidatePoolAdapter.ts` | Personnel CSV → candidate pool items |
| `src/lib/assignment/candidatePoolBuilder.ts` | Unified pool builder with summary |
| `src/lib/assignment/index.ts` | Barrel export |

All 6 files are pure TypeScript modules. No side effects. No imports from outside `src/lib/assignment/`. No external packages.

## Candidate Pool Model

- Pool items represent selectable candidates for manual web assignment
- `selectionStatus` uses selection vocabulary: `available_for_selection`, `selected_pending_confirmation`, `selected`, `rejected`, `inactive`
- `selected` means a human user selected this candidate on the web — not approval, not AP-10B authority
- `autoAssignedCount` is always 0 — literal type, never computed
- `manuallyAssignedCount` is always 0 in the pool build result (no selections occur at build time)
- `isMock: true` literal on every item — runtime guard checks this

## Employee Adapter

`mapEmployeeRoleCategory` maps division/unit to `CandidatePoolRoleCategory`:

| Unit | roleCategory |
|------|-------------|
| Student_Development | student_support |
| Education_Services | eligibility_check |
| IT_Communication | system_support |
| Strategy_Quality_Assurance | qa_review |
| Finance_Supplies | finance_review |
| Human_Resources | student_support |
| Research / Academic_Services | document_review |
| International_Relations | document_review |
| division: Education_Student_Quality | scholarship_operations |
| (fallback) | unknown |

`mapEmployeeSelectableContexts` maps to `CandidatePoolContext[]`:

| Unit | contexts |
|------|---------|
| Education_Services | eligibility_review, document_check |
| Student_Development | follow_up, scholarship_review |
| IT_Communication | system_support |
| Strategy_Quality_Assurance | qa_check |
| Finance_Supplies | finance_check |
| Human_Resources | follow_up |
| division: Education_Student_Quality | scholarship_review, follow_up |
| (fallback) | manual_selection |

## Personnel Adapter

`mapPersonnelRoleCategory` maps department to `CandidatePoolRoleCategory`:

| Department | roleCategory |
|-----------|-------------|
| GOV / PA / IA / STB | academic_advisor |
| (fallback) | faculty_reviewer |

`mapPersonnelSelectableContexts`:

| Department | contexts |
|-----------|---------|
| GOV / PA / IA / STB | advisor_review, scholarship_review |
| (fallback) | manual_selection |

STB entries receive a note: "Manual confirmation required for visiting/external faculty."

## Privacy Safety

| Field | Handling |
|-------|---------|
| `mobile` (Employee) | Not copied — FORBIDDEN |
| `mobile` (Personnel) | Not copied — FORBIDDEN |
| `email` (Personnel) | Not copied — FORBIDDEN |
| `remark` (Personnel) | Not copied — FORBIDDEN |
| `cmu_mail` | Stored as `officialEmail` (lowercase + trim); shown only where role-authorised |
| `employee_id` / `teacher_id` | Stored as `sourceId` (internal only, not displayed) |
| `assertSafeCandidatePoolItem` | Runtime guard: throws if forbidden key found or `isMock !== true` |
| `employeeHasUnsafeDisplayFields` | Returns `true` if `mobile` is non-empty |
| `personnelHasUnsafeDisplayFields` | Returns `true` if `mobile`, `email`, or `remark` is non-empty |

## Manual Assignment Boundary

- The system prepares a selectable pool — it does not finalize assignment
- Assignment is performed manually by a human user on the web
- `selected` status means workflow selection only — not approval, not AP-10B authority
- Candidate listing is not approval
- Manual selection does not collect AP-10B approval
- Manual selection does not unblock AP-10C
- Manual selection does not start AP-11
- `autoAssignedCount: 0` — literal type in `CandidatePoolBuildResult`

## Validation Results

| Check | Result |
|-------|--------|
| Build | Compiled successfully — 0 type errors |
| Token check | Passed — 4/4 |
| Audit/event checks | Passed — 139/139 |
| `/login` | 200 OK |
| `/admin/audit-log` | 200 OK |
| `/admin/dashboard` | 200 OK |
| `/staff/applications/app_001` | 200 OK |
| `/staff/applications/app_002` | 200 OK |
| Dev log | Clean |

## Safety Confirmations

| Item | Result |
|------|--------|
| `src/*` changed (other than new assignment files) | No |
| `scripts/*` changed | No |
| `package.json` changed | No |
| Backend/API changed | No |
| Migrations added | No |
| SQL added | No |
| Schema implementation added | No |
| Persistence activated | No |
| Auto-assignment implemented | No |
| UI/UX implemented | No |
| Pages added | No |
| Routes added | No |
| PII exposed | No |
| Approval collection performed | No |
| Any owner named as AP-10B owner | No |
| AP-10C started | No |
| AP-11 started | No |

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

## Recommended Next Step

- UI/UX implementation for candidate pool selection is a separate branch and task
- UI must use "Select" / "Choose from pool" vocabulary — never auto-assign language
- AP-10B owner candidate identification remains the only unblocked governance action
- AP-10C remains blocked
- AP-11 remains blocked
