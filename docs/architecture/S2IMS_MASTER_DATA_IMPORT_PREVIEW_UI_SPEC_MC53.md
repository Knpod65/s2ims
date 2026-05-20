# S²IMS Master Data Import Preview UI Specification MC53

## Purpose

This document specifies the future UI behavior for a preview-first S²IMS master data import page. MC53 is documentation-only and does not create the route, page, navigation item, upload component, parser, backend/API, persistence, audit write, database migration, SQL, or real data import.

Required future page route:
- `/admin/master-data/import-preview`

This route must not be created in MC53.

## Page Layout

Future page regions:
- Safety banner.
- Source type selector.
- Upload zone.
- Sheet detection panel.
- Validation summary cards.
- Row-level preview table.
- Error/warning filters.
- Manual mapping panel.
- Confirm import gate area.

The first visible state must make clear:
- "Preview only"
- "No data has been imported yet"
- "This does not open AP-10B"
- "This does not create official evidence"
- "Student PII import is not allowed in this flow"

## Source Type Selector

Future source type options:
- Staff master
- Teacher master
- Staff + Teacher combined personnel file
- Responsible person assignment draft
- Account profile draft

Future-only disabled or guarded options:
- Lecturer
- OpenCourse
- Student/enrollment aggregate

Selector behavior:
- Source type must be selected or confirmed before import confirmation.
- Inferred source type must be shown as an admin-confirmed decision, not silently accepted.
- Student/enrollment source must show aggregate/count-first restrictions and must not permit broad student PII import.

## Upload Zone

Future upload zone behavior:
- Accept `.xlsx` only for the MC53-defined future workflow unless a later plan expands supported formats.
- Show selected file name before parsing.
- Show "Preview only" near the upload action.
- Show "No data has been imported yet" after parsing and before confirmation.

MC53 restriction:
- No upload component is created in MC53.
- No parser code is created in MC53.
- No file is persisted in MC53.
- No Excel file is committed in MC53.

## Sheet Detection Panel

Future sheet detection panel should show:
- Detected sheet names.
- Inferred source type for each sheet.
- Confidence or reason for inference.
- Staff/Teacher separation for mixed personnel files.
- Admin confirmation control for inferred sheets.

Rules:
- Prefer explicit sheet names: `staff`, `teacher`, `personnel`, `lecturer`.
- If sheet names are unknown, infer by columns.
- Do not import inferred sheet without admin confirmation.
- Mixed staff/teacher file must show source separation.

## Validation Summary Cards

Future summary cards should show:
- `total_rows`
- `valid_rows`
- `warning_rows`
- `error_rows`
- `duplicate_email_count`
- `missing_email_count`
- `unresolved_mapping_count`
- `blocked_rows`
- `ready_to_confirm`

Summary card behavior:
- Error cards must clearly indicate confirmation is blocked.
- Warning cards must clearly indicate admin acknowledgement is required.
- Info-only previews can proceed only if the confirm import gate is otherwise satisfied.

## Row-Level Preview Table

Staff table columns:
- Row number
- `name_th`
- `name_en`
- `cmu_mail`
- Unit/division
- Position
- Status
- Validation status
- Warning/error reason

Teacher table columns:
- Row number
- `name_th`
- `name_en`
- `cmu_mail`
- Department
- Position
- `advisor_candidate`
- Validation status
- Warning/error reason

Table behavior:
- Rows with errors should be visually distinct from warnings.
- Duplicate `cmu_mail` rows should be grouped or cross-referenced.
- Missing `cmu_mail` rows should link to the manual mapping panel.
- Personal mobile, personal email fallback, private remarks, and student identifiers must not be displayed broadly.

## Error/Warning Filters

Future filters:
- All rows
- Valid
- Errors
- Warnings
- Duplicate `cmu_mail`
- Missing `cmu_mail`
- Manual mapping required
- Blocked rows

Filter behavior:
- Filters must not hide the existence of blocking errors from the summary.
- Filter state must not change row validation state.
- Export or copy behavior is not part of MC53 and must not be implemented here.

## Manual Mapping Panel

Purpose:
- Resolve uncertain records before import.

Future panel cases:
- Duplicate name.
- Missing `cmu_mail`.
- Unknown department.
- Unknown unit/division.
- Staff/teacher overlap.
- Unresolved advisor candidate.
- Responsible person assignment without matched person.
- Account profile draft without reliable person match.

Panel behavior:
- Show source row and issue reason.
- Show candidate Staff_Master or Teacher_Master matches where allowed.
- Require admin decision and reason for required mappings.
- Mark unresolved required mappings in `unresolved_mapping_count`.
- Avoid student PII and private source notes.

## Confirm Import Disabled State

Confirm import must be disabled until:
- No blocking errors remain.
- Required source type is confirmed.
- Mapping queue is resolved or explicitly deferred.
- Admin acknowledges no AP-10B opening.
- Admin acknowledges no official evidence creation.
- Admin acknowledges import is master-data seed only.

Required copy near the disabled or enabled confirmation area:
- "This does not open AP-10B"
- "This does not create official evidence"
- "No data has been imported yet"

MC53 restriction:
- No confirm import runtime is implemented.
- No session record is persisted.
- No audit event is written.

## Safety Banner

Required banner copy:
- "Preview only"
- "No data has been imported yet"
- "This does not open AP-10B"
- "This does not create official evidence"
- "Student PII import is not allowed in this flow"

Banner behavior:
- The banner must remain visible during source selection, sheet detection, validation, manual mapping, and pre-confirmation review.
- If future implementation adds a confirmation step, the banner must still state that AP-10B and official evidence are not created by this flow.

## Accessibility Requirements

Future UI accessibility requirements:
- Source type selector must have an accessible label.
- Upload zone must be keyboard reachable.
- Sheet detection decisions must be operable by keyboard.
- Summary cards must not rely on color alone.
- Row-level errors and warnings must expose text reasons.
- Filters must have visible selected state.
- Manual mapping controls must have clear labels and focus order.
- Disabled confirm import must explain why it is disabled.

## Empty States

Future empty states:
- No file selected: show "Preview only" and source-type guidance.
- File selected but not parsed: show "No data has been imported yet".
- No recognized sheets: explain that source type cannot be confirmed.
- No rows found: show zero-row summary and keep confirm disabled.
- No errors or warnings: show ready-to-review state, still requiring confirmation acknowledgements.
- Manual mapping empty: show no unresolved mapping items.

## No-Runtime Implementation Note

MC53 does not create:
- Runtime route.
- Navigation item.
- Upload component.
- Parser code.
- API endpoint.
- Database migration.
- SQL.
- Persistence.
- Audit writes.
- Official evidence.
- AP-10B opening.
- AP-10C or AP-11 work.

This UI specification is a future implementation reference only.
