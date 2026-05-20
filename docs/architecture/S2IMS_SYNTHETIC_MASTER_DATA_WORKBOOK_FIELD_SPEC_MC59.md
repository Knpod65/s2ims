# S2IMS Synthetic Master Data Workbook Field Spec MC59

## Purpose
Provide canonical column lists and field behaviors for synthetic staff/teacher workbooks used in manual preview testing.

## Staff sheet columns (canonical order)
- cmu_mail (string, required for matching; synthetic pattern required)
- name_th (string)
- name_en (string)
- unit (string)
- department (string)
- position (string)
- status (string; active/inactive)
- remark (optional string)

## Teacher sheet columns
- cmu_mail (string, required)
- name_th
- name_en
- unit
- position
- advisory_role (optional)
- status

## Combined workbook rules
- Multiple sheets allowed; recommended sheet names: "Staff_Master", "Teacher_Master".
- Each sheet must follow the column contract for its type.
- MAX_SHEETS for preview testing: test up to 10 sheets (MC57 runtime limit).

## Valid synthetic cmu_mail pattern (examples)
- staff001@example.test
- teacher001@example.test
- advisor001@example.test

Do NOT use @cmu.ac.th or any real domain.

## Invalid cmu_mail examples (for validator tests)
- missing_at_symbol
- user@@example.test
- user@invalid

## Duplicate email scenarios
- Two rows in same sheet with same cmu_mail -> `duplicate_cmu_mail` error expected
- Same email across staff and teacher sheets -> duplication rules apply per MC57 validation model

## Missing field scenarios
- Missing cmu_mail -> `missing_cmu_mail` mappingRequired case
- Missing name_en/name_th -> validation warning or error depending on sourceType

## Forbidden column scenarios
- Headers matching forbidden aliases (national_id, bank_account, phone, ลายเซ็น, etc.) must be present in test header to assert `forbidden_column_detected` behavior; cell values must be synthetic placeholders (e.g., "REDACTED")

## Formula cell scenarios
- Cells beginning with '=' should be included in formula-like tests; validator should mark `formula_detected` (warning) but not evaluate formulas
- Include examples where formula-like content occurs in header or data cells

## Thai / English naming examples
- Thai synthetic: นาย ทดสอบ หนึ่ง (use obviously synthetic names)
- English synthetic: Test Staff 001
- Ensure transliteration does not use real person names

## No-real-data rule
- Reiterate: all values must be synthetic and cannot be traced to real individuals.
