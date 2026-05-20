# S2IMS Synthetic Workbook Scenario Contract MC60

## Purpose
Define a scenario contract that maps planned generated workbooks to expected validator outcomes and UI behavior for manual preview testing.

## Scenario table (summary)
- synthetic_staff_master_valid.xlsx — staff_master — 50 rows — required columns present — expected: all valid — severity: info — Confirm Import: disabled — no-persistence
- synthetic_teacher_master_valid.xlsx — teacher_master — 50 rows — required columns present — expected: all valid — severity: info — Confirm Import: disabled — no-persistence
- synthetic_personnel_combined_valid.xlsx — combined_personnel — 2 sheets (Staff_Master, Teacher_Master) — 100 rows total — expected: valid per sheet — severity: info — Confirm Import: disabled — no-persistence
- synthetic_staff_duplicate_email.xlsx — staff_master — 50 rows with duplicates — expected: `duplicate_cmu_mail` errors — severity: error — Confirm Import: disabled — no-persistence
- synthetic_teacher_missing_email.xlsx — teacher_master — 50 rows with missing cmu_mail in 5 rows — expected: `missing_cmu_mail` warnings/manual mapping — severity: warning — Confirm Import: disabled — no-persistence
- synthetic_invalid_email.xlsx — staff_master — 50 rows with invalid email formats — expected: validation warnings/errors for invalid email — severity: warning — Confirm Import: disabled — no-persistence
- synthetic_forbidden_columns.xlsx — staff_master — includes forbidden headers — expected: `forbidden_column_detected` errors — severity: error/blocked — Confirm Import: disabled — no-persistence
- synthetic_formula_cells.xlsx — staff_master — formula-like cells present — expected: `formula_detected` warnings — severity: warning — Confirm Import: disabled — no-persistence
- synthetic_row_limit_warning.xlsx — staff_master — 600 rows — expected: warning at WARNING_PREVIEW_ROWS (500) — severity: warning — Confirm Import: disabled — no-persistence
- synthetic_row_limit_block.xlsx — staff_master — 1,200 rows — expected: hard block at MAX_PREVIEW_ROWS (1000) — severity: error/blocked — Confirm Import: disabled — no-persistence
- synthetic_unknown_sheet.xlsx — sheet name unknown — expected: inferred/inferred_blocked states in sheet detection — severity: info/warning — Confirm Import: disabled — no-persistence
- synthetic_th_en_names.xlsx — staff_master — Thai and English name variations — expected: normalization behavior and correct display — severity: info — Confirm Import: disabled — no-persistence

## Notes
- Row counts and severity mapping reference MC57 config (MAX_PREVIEW_ROWS, WARNING_PREVIEW_ROWS, MAX_SHEETS).
- This document is a contract for what generated files should contain; MC60 does not produce files.
