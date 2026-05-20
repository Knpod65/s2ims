# S²IMS Master Data Import Preview Runtime Plan MC53

## 1. Purpose

MC53 defines a future runtime plan for a preview-first master data import workflow. It translates the MC51 governance readiness and MC52 master data intake contract into a safer future operating model for Staff_Master, Teacher_Master, Account_Profile, and Responsible_Person_Assignment preview.

MC53 is planning-only. It does not create runtime import code, upload UI, parsing code, database migrations, backend/API endpoints, persistence, audit writes, official evidence, or AP-10B gate changes.

## 2. Scope

In scope:
- Future import preview workflow
- Source file handling boundaries
- Staff_Master preview
- Teacher_Master preview
- Account_Profile preview
- Responsible_Person_Assignment preview
- Validation and error model
- Manual mapping queue
- Confirm import gate
- Rollback and import session plan

Out of scope:
- Runtime implementation in MC53
- Actual data import
- Persistence
- Backend/API
- Database migration
- Audit write activation
- Official evidence
- AP-10B opening
- AP-10C or AP-11 work

## 3. Target Future Page

Recommended future route:
- `/admin/master-data/import-preview`

Important:
- This route must not be created in MC53.
- Navigation exposure requires separate planning and approval.
- The future page must remain admin-only and must not be reachable through public or staff navigation until governance and implementation scope are approved.

## 4. Preview-First Workflow

Future flow:
1. Select source type.
2. Upload `.xlsx`.
3. Detect sheets.
4. Parse rows in memory.
5. Normalize columns.
6. Validate required fields.
7. Show validation summary.
8. Show row-level preview.
9. Resolve manual mapping queue.
10. Confirm import.
11. Create import session record.
12. Post-import QA.

Runtime boundary for the future implementation:
- Steps 1-9 must be preview-only until the admin explicitly confirms.
- MC53 does not implement any of these steps.
- Future parsing must avoid persisting raw source data before an approved import confirmation and retention rule.
- Future post-import QA must not create official evidence unless a later governance milestone explicitly allows it.

## 5. Source Type Options

Initial future source types:
- Staff master
- Teacher master
- Staff + Teacher combined personnel file
- Responsible person assignment draft
- Account profile draft

Future only:
- Lecturer
- OpenCourse
- Student/enrollment aggregate

Source boundaries:
- `Personnel_120226.xlsx` remains a planning reference for a combined staff/teacher personnel file.
- Employee/staff roster files may support staff-role and account mapping after approval.
- Lecturer, OpenCourse, and student/enrollment files must not be broadly imported until data and PII rules are approved.
- Student data must not be displayed broadly.
- Enrollment handling must be aggregate/count-first until PII policy is approved.

## 6. Sheet Detection Rules

Rules:
- Prefer explicit sheet names: `staff`, `teacher`, `personnel`, `lecturer`.
- If sheet names are unknown, infer by columns.
- Do not import an inferred sheet without admin confirmation.
- A mixed staff/teacher file must show source separation before confirmation.

Recommended future sheet classification:

| Sheet signal | Future classification | Required admin behavior |
|---|---|---|
| `staff` sheet name | Staff master | Confirm source type before preview confirmation |
| `teacher` sheet name | Teacher master | Confirm source type before preview confirmation |
| `personnel` sheet name with role columns | Combined personnel file | Confirm staff/teacher separation |
| Staff fields such as unit/division/role | Staff master candidate | Confirm inferred mapping |
| Teacher fields such as department/advisor fields | Teacher master candidate | Confirm inferred mapping |
| Lecturer/OpenCourse/student fields | Future-only source | Block broad import; allow only future approved aggregate preview |

## 7. Preview Table Columns

Staff preview table:
- Row number
- `name_th`
- `name_en`
- `cmu_mail`
- Unit/division
- Position
- Status
- Validation status
- Warning/error reason

Teacher preview table:
- Row number
- `name_th`
- `name_en`
- `cmu_mail`
- Department
- Position
- `advisor_candidate`
- Validation status
- Warning/error reason

Preview rules:
- `cmu_mail` is the recommended reliable join key where available.
- Personal email, mobile, remark, and source notes must not be displayed broadly.
- Raw source row identifiers may be used for manual reconciliation but should remain admin-only.
- Student identifiers must not appear in Staff_Master or Teacher_Master preview.

## 8. Validation Summary Model

Future validation summary fields:
- `total_rows`
- `valid_rows`
- `warning_rows`
- `error_rows`
- `duplicate_email_count`
- `missing_email_count`
- `unresolved_mapping_count`
- `blocked_rows`
- `ready_to_confirm`

Interpretation:
- `ready_to_confirm` is true only when the confirm import gate is satisfied.
- `blocked_rows` includes rows with blocking errors and rows blocked by unresolved required mapping.
- `warning_rows` can proceed only with explicit admin acknowledgement in a future approved runtime.

## 9. Row-Level Error/Warning Model

Error examples:
- Duplicate `cmu_mail`
- Missing required name
- Invalid email format
- Unknown source type
- Conflicting active/inactive status

Warning examples:
- Missing English name
- Missing department
- Duplicate display name with different email
- Inactive record
- Possible teacher/staff role overlap

Duplicate `cmu_mail` handling:
- Exact duplicate `cmu_mail` within the same source set is blocking until resolved.
- Duplicate `cmu_mail` across Staff_Master and Teacher_Master must be shown as a possible role overlap, not silently merged.
- Admin must choose whether the row represents one person with multiple roles, a stale duplicate, or a source-file error.

Missing `cmu_mail` handling:
- Missing `cmu_mail` enters the manual mapping queue.
- Missing `cmu_mail` must not silently fall back to personal email.
- Future fallback to source ID or name + department requires explicit approval and row-level acknowledgement.

## 10. Manual Mapping Queue

Purpose:
- Resolve uncertain records before import.

Mapping cases:
- Duplicate name
- Missing `cmu_mail`
- Unknown department
- Staff/teacher overlap
- Unresolved advisor candidate
- Responsible person assignment without matched person

Future queue behavior:
- Each queue item should preserve source type, source row, detected issue, candidate matches, admin decision, and decision reason.
- Queue decisions must be preview-stage decisions until import is confirmed.
- Deferred mappings must be counted in `unresolved_mapping_count` unless a later approved policy allows import with deferred non-blocking mapping.

## 11. Confirm Import Gate

Confirm import must be disabled until:
- No blocking errors remain.
- Required source type is confirmed.
- Mapping queue is resolved or explicitly deferred.
- Admin acknowledges no AP-10B opening.
- Admin acknowledges no official evidence creation.
- Admin acknowledges import is master-data seed only.

Required future confirmations:
- "This does not open AP-10B."
- "This does not create official evidence."
- "This import is master-data seed only."

MC53 does not implement the confirm import button, gate logic, or acknowledgement persistence.

## 12. Rollback / Import Session Plan

Future import session should record:
- `import_session_id`
- Source file name
- Source type
- Row counts
- Validation summary
- `imported_by`
- `imported_at`
- Import status
- `rollback_available`
- `rollback_reason`
- No official evidence flag

Rollback planning rules:
- Rollback must be scoped to records changed by one import session.
- Rollback must not delete unrelated manually maintained master data.
- Rollback must not claim to reverse official evidence because no official evidence should be created by this flow.
- Rollback behavior requires a later approved persistence and audit design before implementation.

## 13. Responsible Person Registry Integration

Future import should allow admin to:
- Select responsible person from Staff_Master / Teacher_Master.
- Assign responsibility type.
- Set scope.
- Set active/inactive.
- Version assignment.
- Require reason code for changes.

Integration boundaries:
- Responsible_Person_Assignment rows must match a Staff_Master or Teacher_Master person before activation.
- Assignment changes require versioning and reason capture in a future approved runtime.
- Registry integration must not hardcode MC51 interim contact assignments.
- AP-10B owner/approver readiness remains blocked until the separate governance process clears it.

## 14. Safety Boundaries

MC53 safety boundaries:
- No student PII import.
- No persistence until future approved runtime.
- No audit write activation in MC53.
- No AP-10B opening.
- No official evidence.
- No runtime route creation.
- No navigation exposure.
- No backend/API endpoint.
- No database migration.
- No SQL.
- No Excel data committed.
- No AP-10C or AP-11 work.

Why MC53 is planning-only:
- MC52 established the intake contract and seed runtime plan, but no runtime import was implemented.
- The repository still requires governance approval for persistence, audit writes, retention, owner/approver authority, and official evidence classification.
- A future runtime implementation should happen only in a separate approved milestone, recommended as MC54, after MC53 documentation is reviewed.
