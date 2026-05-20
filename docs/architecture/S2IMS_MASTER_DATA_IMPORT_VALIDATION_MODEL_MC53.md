# S²IMS Master Data Import Validation Model MC53

## Purpose

This document defines the future validation model for the S²IMS master data import preview workflow. It is documentation-only for MC53 and does not implement parser code, upload UI, persistence, database schema, backend/API endpoints, audit writes, or data import.

The model applies first to Staff_Master, Teacher_Master, Account_Profile, and Responsible_Person_Assignment preview flows. Lecturer, OpenCourse, and student/enrollment files remain future-only, with student/enrollment handling limited to aggregate/count-first planning until PII policy is approved.

## Validation Severity Model

| Severity | Meaning | Future import behavior |
|---|---|---|
| Error | Blocks import | Row or source cannot be confirmed until resolved |
| Warning | Requires admin acknowledgement | Can proceed only with explicit acknowledgement if no blocking errors remain |
| Info | Non-blocking context | Provides source or normalization context |

Severity rules:
- Error = blocks import.
- Warning = can proceed only with admin acknowledgement.
- Info = non-blocking context.
- The future confirm import gate must use the highest severity present in the source preview.

## Blocking Errors

Blocking errors include:
- Duplicate `cmu_mail` in the import set.
- Missing required name.
- Invalid `cmu_mail` format.
- Unknown source type.
- Conflicting active/inactive status.
- Required sheet inferred but not confirmed by admin.
- Responsible person assignment without matched Staff_Master or Teacher_Master person.
- Student PII detected in a Staff_Master or Teacher_Master import source.

Blocking behavior:
- Blocking rows count toward `blocked_rows`.
- The future confirm import control remains disabled while blocking errors exist.
- Blocking errors must be visible in the validation summary and row-level preview.

## Warnings

Warnings include:
- Missing English name.
- Missing department.
- Missing unit/division.
- Duplicate display name with different email.
- Inactive record.
- Possible teacher/staff role overlap.
- Missing `cmu_mail` when a future approved fallback mapping is possible.
- Department or unit value not found in the current reference list but eligible for manual mapping.

Warning behavior:
- Warning rows count toward `warning_rows`.
- Warnings require explicit admin acknowledgement before future import confirmation.
- Warnings must not be silently normalized into confirmed records.

## Informational Notes

Informational notes include:
- Source file name and source type.
- Detected sheet name.
- Inferred source type confidence.
- Normalized email casing.
- Trimmed whitespace.
- Source row number.
- Manual mapping decision already supplied during preview.

Info behavior:
- Info notes do not block confirmation.
- Info notes must not include student PII, personal mobile numbers, personal email fallback, or private remarks.

## Validation Summary Schema

Future validation summary fields:

| Field | Type | Meaning |
|---|---|---|
| `total_rows` | number | Count of parsed rows in the selected source scope |
| `valid_rows` | number | Rows with no errors or warnings |
| `warning_rows` | number | Rows with at least one warning and no blocking error |
| `error_rows` | number | Rows with at least one blocking error |
| `duplicate_email_count` | number | Count of duplicate `cmu_mail` findings |
| `missing_email_count` | number | Count of rows missing `cmu_mail` |
| `unresolved_mapping_count` | number | Count of unresolved manual mapping cases |
| `blocked_rows` | number | Rows blocked by errors or required unresolved mappings |
| `ready_to_confirm` | boolean | True only when the future confirm import gate is satisfied |

Summary rules:
- `ready_to_confirm` must be false when `error_rows`, `blocked_rows`, or required unresolved mappings are present.
- Missing `cmu_mail` contributes to `missing_email_count` and usually creates a manual mapping case.
- Duplicate `cmu_mail` contributes to `duplicate_email_count` and blocks confirmation until resolved.

## Row Validation Schema

Future row validation fields:

| Field | Type | Meaning |
|---|---|---|
| `source_row_number` | number | Row number from the source sheet |
| `source_sheet_name` | string | Detected sheet name |
| `source_type` | string | Staff, Teacher, combined personnel, assignment, or account profile |
| `normalized_record_type` | string | Target preview type |
| `cmu_mail` | string or empty | Normalized CMU email when present |
| `display_name` | string | Name used for preview matching |
| `validation_status` | string | error, warning, info, or valid |
| `messages` | list | Row-level validation messages |
| `mapping_required` | boolean | Whether manual mapping is required |
| `mapping_status` | string | unresolved, resolved, deferred, or not_required |
| `blocked` | boolean | Whether row blocks confirmation |

Row message fields:
- Severity
- Code
- Human-readable reason
- Affected field
- Suggested admin action

## Duplicate Handling

Duplicate `cmu_mail` handling:
- Exact duplicate `cmu_mail` is an error by default.
- Duplicate rows must be grouped together in preview.
- The future UI must show whether duplicates are within one sheet or across Staff_Master and Teacher_Master sections.
- Admin resolution choices should distinguish merge, keep separate roles, mark stale duplicate, or exclude row.
- No automatic merge may occur without admin confirmation.

Duplicate display name handling:
- Duplicate display name with different `cmu_mail` is a warning.
- If department/unit also conflicts, the row should enter manual mapping.
- Name-only matching must not be used as a final import key without explicit approval.

## Missing Email Handling

Missing `cmu_mail` handling:
- Missing `cmu_mail` creates a manual mapping case.
- Missing `cmu_mail` must not fall back to personal email by default.
- Source ID fallback may be allowed only after a future approved policy defines the allowed source and review requirement.
- Rows with missing `cmu_mail` remain blocked when they are needed for account profile creation or responsible person assignment.

Manual decisions for missing `cmu_mail`:
- Map to an existing Staff_Master or Teacher_Master record.
- Defer as non-imported pending enrichment.
- Exclude from import.
- Accept source ID fallback only if a future approved policy allows it.

## Manual Mapping Cases

Manual mapping cases:
- Duplicate name.
- Missing `cmu_mail`.
- Unknown department.
- Unknown unit/division.
- Staff/teacher overlap.
- Unresolved advisor candidate.
- Responsible person assignment without matched person.
- Account profile draft without reliable person match.

Mapping queue acceptance rules:
- Each required mapping must have a selected decision before `ready_to_confirm` can become true.
- Deferred required mappings keep import blocked unless the future policy explicitly marks that mapping type deferrable.
- Mapping reason text must not include student PII or private source notes.

## Acceptance Criteria

MC53 documentation acceptance:
- Validation severity model is documented.
- Blocking errors, warnings, and info notes are documented.
- Validation summary schema contains all required MC53 fields.
- Row validation schema is documented.
- Duplicate `cmu_mail` handling is blocking until resolved.
- Missing `cmu_mail` handling enters manual mapping and avoids personal email fallback.
- Manual mapping cases are listed.
- No runtime implementation, parser, upload UI, persistence, API, migration, SQL, or audit write is introduced.
- AP-10B remains blocked.
- AP-10C and AP-11 remain blocked.
