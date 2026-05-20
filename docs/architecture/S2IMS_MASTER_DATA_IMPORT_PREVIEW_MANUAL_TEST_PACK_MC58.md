# S²IMS Master Data Import Preview Manual Test Pack MC58

## 1. Purpose
This manual test pack documents controlled, synthetic-only manual tests for the preview-only Master Data Import route (/admin/master-data/import-preview). It verifies validation behavior, safety copy, limits, and forbidden-column/formula detection while enforcing strict no-persistence and no-audit constraints.

## 2. Scope
In scope:
- Manual testing of the import preview UI and validator outputs using synthetic local files only
- File/row/sheet limit behavior, formula detection, forbidden-column detection
- Safety copy and Confirm Import disabled behavior

Out of scope:
- Any real data import
- Upload-to-server or persistence
- Audit-event writes or official evidence
- Enabling Confirm Import or opening AP-10B/AP-10C/AP-11

## 3. Test Environment
Route: /admin/master-data/import-preview
Baseline validation: Build 42/42; Tokens 4/4; Audit checks 502/502; Routes 7×200 OK
Browser: Latest Chrome/Chromium or Firefox, use private profile with no production cookies

## 4. Allowed Test File Types
Allowed (synthetic-only):
- staff_master.xlsx (synthetic staff rows)
- teacher_master.xlsx (synthetic teacher rows)
- combined_personnel.xlsx (multiple sheets)
- edge_case_workbook.xlsx (hidden columns, many sheets for stress tests)
- forbidden_columns_workbook.xlsx (contains header aliases from FORBIDDEN_COLUMN_ALIASES)

Forbidden (immediate stop if present):
- Real student/staff PII (national ID, bank account, phone, health, signatures)
- Production exports or any file derived from live systems

Do NOT commit any .xlsx/.csv files to the repo.

## 5. Core Test Cases (steps + expected results)
1. Empty/no file: UI shows empty preview state; no parse; no errors.
2. Valid staff sheet: summary shows valid_rows == row count; rows marked 'valid'.
3. Valid teacher sheet: similar to staff.
4. Combined workbook: sheet detection lists sheets; inferred types for each sheet.
5. Duplicate cmu_mail: validator returns message code `duplicate_cmu_mail`; affected rows blocked.
6. Missing cmu_mail: `missing_cmu_mail` messages; mappingRequired true.
7. Invalid email formats: row flagged warning/error per validator.
8. Missing required name fields: error severity and blocked row.
9. Forbidden column alias detected: `forbidden_column_detected` message surfaced in UI.
10. Formula-like cell (starts with `=`): `formula_detected` message (warning); content not evaluated.
11. File > 5 MB: parser rejects file with hard block message.
12. Rows > 1,000: hard rejection; >500 triggers warning.
13. Sheets > MAX_SHEETS (10): sheet count messaging; test only up to 10 in manual tests.
14. Reset preview: clicking Reset preview clears all preview state; reload discards state.
15. Confirm Import disabled: Confirm Import button is disabled and labelled accordingly.

For each test, capture: steps run, synthetic file description (no file content), exact UI copy observed, validator message codes, and screenshot (no PII).

## 6. Expected Results
For each case define:
- validationStatus expected (valid/warning/error/blocked)
- UI message snippets to assert
- severity level
- confirmation that preview state is not persisted after reload
- confirmation that no network upload occurred (Network tab)

## 7. Evidence Capture Rules
Allowed evidence:
- Screenshots of UI with synthetic data only
- Copy of validator summary counts and message codes
- Console/network logs showing client-only parsing and no outbound requests
- Build and script outputs (npm run build, check:tokens, check:audit-events)

Forbidden evidence:
- Screenshots containing real PII
- Committing source Excel/CSV files
- Any exported files attached to the repo

## 8. Stop Conditions (immediate halt)
Stop and escalate if:
- Real PII appears in UI or logs
- Confirm Import becomes enabled or actionable
- Any outbound network request attempts to send parsed data
- Preview state persists after page reload
- Any audit write occurs
- UI copy suggests AP-10B opening or official evidence creation

## 9. Go / No-Go Criteria
Go if:
- All pre-run validations pass (Build 42/42, check:tokens 4/4, check:audit-events 502/502)
- Confirm Import disabled
- Test files synthetic and conform to Synthetic Test Data Spec
- No High/Critical MC56 findings impacting browser-only parse path

No-Go if any of the Stop Conditions occur or if the above checks fail.

## 10. Test Execution Template
For each test case record:
- Test ID
- Purpose
- Steps performed
- Synthetic file description (columns, rows)
- Expected result
- Observed result
- Evidence artifacts (screenshots, logs)
- Pass/Fail

## 11. Reporting
Record all test runs in docs/qa/s2ims-master-data-import-preview-manual-test-security-triage-plan-mc58/README.md and append results into S2IMS_MASTER_DATA_IMPORT_PREVIEW_MANUAL_TEST_PACK_MC58_QA_SUMMARY.md

## 12. Final safety note
This pack is documentation-only. No code or runtime changes are made by MC58. Any follow-up runtime changes must be handled in a separate feature or security branch with AP-10B governance clearance.