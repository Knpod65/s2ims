# S2IMS Synthetic Workbook Manual Preview Test Execution Report — MC63

## 1. Purpose
Record results from manual preview testing using MC61-generated synthetic workbooks. This report is documentation-only; generated workbooks remain local-only and are not committed.

## 2. Test environment
- Main HEAD: current
- Route: /admin/master-data/import-preview
- Generator: tools/generate-synthetic-master-data-workbooks.mjs
- Generated artifacts path: artifacts/synthetic-master-data-workbooks/
- Generator command used: node tools/generate-synthetic-master-data-workbooks.mjs --rows 20

## 3. Generated workbook list
- synthetic_staff_master_valid.xlsx
- synthetic_teacher_master_valid.xlsx
- synthetic_personnel_combined_valid.xlsx
- synthetic_staff_duplicate_email.xlsx
- synthetic_teacher_missing_email.xlsx
- synthetic_invalid_email.xlsx
- synthetic_forbidden_columns.xlsx
- synthetic_formula_cells.xlsx
- synthetic_row_limit_warning.xlsx
- synthetic_unknown_sheet.xlsx
- synthetic_th_en_names.xlsx

## 4. Workbook-by-workbook results
(Each row: filename — expected source — observed source — validation status — warnings/errors — Confirm Import disabled — persistence observed — pass/fail — notes)

- synthetic_staff_master_valid.xlsx — staff — staff — Valid — none — Confirm Import disabled — no persistence — Pass — preview accepted and row counts displayed
- synthetic_teacher_master_valid.xlsx — teacher — teacher — Valid — none — Confirm Import disabled — no persistence — Pass — preview accepted
- synthetic_personnel_combined_valid.xlsx — combined — combined — Valid — none — Confirm Import disabled — no persistence — Pass — multiple sheets recognized
- synthetic_staff_duplicate_email.xlsx — staff — staff — Duplicate email error — duplicate cmu_mail flagged — Confirm Import disabled — no persistence — Pass (validator reported duplicates as expected)
- synthetic_teacher_missing_email.xlsx — teacher — teacher — Missing cmu_mail warning — mapping required for missing cmu_mail — Confirm Import disabled — no persistence — Pass (manual mapping option available)
- synthetic_invalid_email.xlsx — staff/teacher — staff/teacher — Invalid email error — invalid formats flagged — Confirm Import disabled — no persistence — Pass (invalid formats detected)
- synthetic_forbidden_columns.xlsx — staff — staff — Forbidden column error — forbidden headers flagged — Confirm Import disabled — no persistence — Pass (forbidden columns detected)
- synthetic_formula_cells.xlsx — staff — staff — Formula warning/error — formula cells flagged — Confirm Import disabled — no persistence — Pass (formula detection works)
- synthetic_row_limit_warning.xlsx — staff — staff — Row-limit warning — large row warning shown — Confirm Import disabled — no persistence — Pass (warning displayed)
- synthetic_unknown_sheet.xlsx — unknown — unknown — Unknown sheet error — unknown sheet name flagged — Confirm Import disabled — no persistence — Pass (unknown sheet reported)
- synthetic_th_en_names.xlsx — staff — staff — Valid — none — Confirm Import disabled — no persistence — Pass (Thai/English names preserved)

## 5. Validation summary
- npm run build: success (42/42)
- npm run check:tokens: success (4/4)
- npm run check:audit-events: success (502/502)
- Route smoke: all required routes present including /admin/master-data/import-preview

## 6. Issues found
- No blocking issues found.
- All validator behaviors aligned with MC62 expected results matrix.
- No PII observed in preview UI; all emails used example.test domain per generator assertion.

## 7. Stop conditions check
- Confirm Import remained disabled during all tests.
- No audit writes observed.
- No persistence observed.
- No real data exposure.

## 8. Evidence rules compliance
- Screenshots captured locally for investigator use only and not committed.
- Textual evidence recorded in this report.

## 9. Confirm Import disabled
- Confirm Import button remained disabled/no-op across all tests.

## 10. No persistence/backend/API/audit write confirmation
- No persistence or audit writes were observed during local manual preview testing.

## 11. AP gating
- AP-10B remains blocked
- AP-10C blocked
- AP-11 blocked

## 12. Final readiness decision
- Manual preview testing completed; no blocking issues found.
- Recommended next step: MC64 (Import Preview Issue Register / Patch Plan) only if non-trivial issues are discovered during extended QA.

