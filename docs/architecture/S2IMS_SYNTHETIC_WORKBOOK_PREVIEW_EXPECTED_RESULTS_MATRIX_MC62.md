# S2IMS Synthetic Workbook Preview Expected Results Matrix — MC62

Filename | Source Type | Expected Validation Status | Expected Warnings/Errors | Expected UI Behavior | Confirm Import Status | Pass/Fail Criteria
---|---:|---|---|---|---|---
synthetic_staff_master_valid.xlsx | staff | Valid | none | Preview accepts, shows row summary | Disabled | Pass if preview shows valid rows and no safety warnings
synthetic_teacher_master_valid.xlsx | teacher | Valid | none | Preview accepts, shows row summary | Disabled | Pass
synthetic_personnel_combined_valid.xlsx | combined | Valid | none | Multiple sheets recognized, mapping UI shows both | Disabled | Pass
synthetic_staff_duplicate_email.xlsx | staff | Blocked/Warning | duplicate cmu_mail detected | Validator shows duplicate email error rows highlighted | Disabled | Pass if duplicates are correctly reported as blocked or warning per validator
synthetic_teacher_missing_email.xlsx | teacher | Warning | missing cmu_mail mapping required | UI prompts manual mapping for missing cmu_mail | Disabled | Pass if missing cmu_mail handled per mapping rules (warning with manual mapping option)
synthetic_invalid_email.xlsx | staff/teacher | Error | invalid email formats | Validator marks invalid email rows | Disabled | Pass if invalid email formats reported
synthetic_forbidden_columns.xlsx | staff | Error/Warning | forbidden column headers present | Validator flags forbidden headers and suggests removal | Disabled | Pass if forbidden headers detected and blocked per rules
synthetic_formula_cells.xlsx | staff | Warning/Error | formula cells present | Validator flags formula detection; preview indicates formula cells | Disabled | Pass if formula cells detected and flagged
synthetic_row_limit_warning.xlsx | staff | Warning | row count near WARNING_PREVIEW_ROWS | Preview shows warning about large row count and may truncate | Disabled | Pass if row-limit warning appears
synthetic_unknown_sheet.xlsx | unknown | Error | unknown sheet names | Validator rejects or asks mapping for unknown sheets | Disabled | Pass if unknown sheet reported
synthetic_th_en_names.xlsx | staff | Valid | none | Thai/English name columns preserved and shown | Disabled | Pass if both name columns preserved and displayed
