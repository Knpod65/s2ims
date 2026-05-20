# S2IMS Import Preview Manual Test Execution Worksheet Plan MC59

## Purpose
Provide a template and process for recording manual test executions of synthetic workbooks against the preview-only import route.

## Test run metadata fields
- tester_name
- tester_role
- date_utc
- branch
- build_hash

## Worksheet template (CSV/Markdown table)
- workbook_filename
- sheet_name
- test_case_id
- test_case_description
- expected_result
- observed_result
- pass_fail
- evidence_screenshot_path
- issue_severity
- remediation_recommendation

## Evidence rules
- Screenshots only; do NOT attach Excel files
- Evidence must hide any accidental real identifiers; if real PII observed, stop and escalate

## Issue severity taxonomy
- Critical: Real PII exposure or persistence attempt
- High: Potential data leak or backend call to upload preview
- Medium: Incorrect validation severity (e.g., formula evaluated instead of detected)
- Low: UI copy minor mis-match

## Stop conditions and escalation
- Stop immediately if real PII appears, Confirm Import becomes enabled, or any network upload occurs
- Escalate to security lead and product owner, record in QA worksheet

## No official evidence note
- Manual test runs are for QA only and do not create official evidence; results and screenshots may be shared in secure channels per governance
