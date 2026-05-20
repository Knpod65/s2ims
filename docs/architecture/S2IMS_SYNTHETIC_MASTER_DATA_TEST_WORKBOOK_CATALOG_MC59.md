# S2IMS Synthetic Master Data Test Workbook Catalog MC59

## 1. Purpose
Define the catalog of synthetic master data workbooks that QA can generate and use to exercise the preview-only master data import route (/admin/master-data/import-preview). This is a planning-only artifact that does not create any Excel files.

## 2. Non-Real-Data Rule
All synthetic workbooks MUST follow the non-real-data rule:
- No real staff names
- No real teacher names
- No real student data
- No real cmu_mail or real email domains (use example.test or example.local)
- No real personnel IDs or national IDs
- No phone numbers that resemble real numbers
- No bank account numbers
- No signatures or scanned documents
- No health or medical data
- No raw/attachment binary content

## 3. Workbook Catalog (planned filenames)
- synthetic_staff_master_valid.xlsx
- synthetic_teacher_master_valid.xlsx
- synthetic_personnel_combined_valid.xlsx
- synthetic_staff_duplicate_email.xlsx
- synthetic_teacher_missing_email.xlsx
- synthetic_invalid_email.xlsx
- synthetic_forbidden_columns.xlsx
- synthetic_formula_cells.xlsx
- synthetic_row_limit_warning.xlsx
- synthetic_row_limit_block.xlsx
- synthetic_unknown_sheet.xlsx
- synthetic_th_en_names.xlsx

NOTE: Filenames MUST be prefixed with `synthetic_` and must not include real person names or production dates. These files are NOT created or committed in MC59.
