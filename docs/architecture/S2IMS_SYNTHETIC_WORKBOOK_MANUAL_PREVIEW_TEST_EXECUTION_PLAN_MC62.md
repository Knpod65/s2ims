# S²IMS Synthetic Workbook Manual Preview Test Execution Plan MC62

## 1. Purpose
This document defines the manual test execution plan for running MC61-generated synthetic workbooks against the preview-only master data import route. It is documentation-only and does not create or commit any Excel files, does not modify runtime code, and does not enable persistence or audit writes.

## 2. Scope
In scope:
- Local synthetic workbook generation using the MC61 generator
- Manual browser-based preview testing against /admin/master-data/import-preview
- Recording validation outcomes, screenshots, and issues per template
- Stop conditions and escalation guidance

Out of scope:
- Committing generated workbooks to the repository
- Using real data or real identifiers
- Enabling Confirm Import
- Writing audit events or persistence operations
- Creating backend/API changes or opening AP-10B/AP-10C/AP-11

## 3. Test Environment
- Baseline branch: main at current HEAD
- Route under test: /admin/master-data/import-preview
- Generator script: tools/generate-synthetic-master-data-workbooks.mjs
- Generator output directory: artifacts/synthetic-master-data-workbooks/
- Default generator rows per workbook: 50 (override with --rows)

## 4. Execution Protocol
1. Ensure working tree is clean and on main: git checkout main; git pull --ff-only origin main
2. Run validations: npm run build; npm run check:tokens; npm run check:audit-events
3. Create local synthetic workbooks: node tools/generate-synthetic-master-data-workbooks.mjs --rows 50
   - Confirm artifacts/ contains generated files
   - Do NOT git add or commit artifacts/
4. For each workbook in the catalog, perform a manual preview test:
   a. Open the import preview route in a browser
   b. Upload the workbook from artifacts/ to the preview UI
   c. Observe validator messages, warnings, and UI behavior
   d. Capture screenshots of the preview and any validation dialogs
   e. Record results in the issue register template (one row per test case)
   f. Clear/close preview and repeat for next workbook
5. After testing, either delete generated files or keep locally outside of git tracking

## 5. Safety & Required Checks
- Confirm generator output contains only synthetic.example.test emails (no @cmu.ac.th)
- Confirm no generated files are staged: git status --short
- Confirm Confirm Import button remains disabled/no-op
- Confirm no persistence or audit writes recorded in local environment
- If any real data or forbidden tokens are found, abort testing and notify security lead

## 6. Evidence and Screenshots
- Capture screenshots only (PNG/JPEG). Do NOT attach Excel files.
- Redact or omit any real PII if accidentally present and abort the run.
- Store screenshots in QA evidence store (location agreed by team) — do not commit to repo unless approved
- Each screenshot must reference workbook filename, sheet name, and test case id

## 7. Stop Conditions and Escalation
Stop and escalate immediately if:
- Preview appears to persist data beyond the diagnostic preview (Confirm Import enabled or data appears saved)
- Audit events are written during preview
- Any UI shows real data from production
- Generation produced files containing forbidden domains or real PII
Escalation path: Security lead → Repo owner → QA lead

## 8. No-Real-Data Rule
- All synthetic data must use example.test domain
- No real Thai names, national IDs, phone numbers, bank accounts, or signatures
- Any accidental real data discovered must trigger an immediate abort and wipe of generated artifacts

## 9. Evidence Handling Rules
- Screenshots only, no Excel attachments
- No official evidence statements in screenshots (no approvals)
- Maintain audit trail of test run in QA summary docs only

## 10. Pass/Fail Criteria
- Pass: UI shows expected validation messages per expected-results matrix, no persistence, no audit writes, and Confirm Import remains disabled
- Fail (High): Data appears to be persisted, audit writes observed, or Confirm Import enabled
- Fail (Medium): Unexpected validator errors that block preview, or UI crashes
- Fail (Low): Minor UI/copy issues that do not affect preview safety

## 11. Readiness Decision for MC63
- MC63 may be scheduled only after:
  - All MC62 test runs complete and recorded
  - No high-severity failures remain unresolved
  - Security lead confirms no real-data exposure
  - Governance confirms AP-10B gating requirements or explicitly approves fixture committing

## 12. References
- tools/generate-synthetic-master-data-workbooks.mjs
- docs/architecture/S2IMS_SYNTHETIC_MASTER_DATA_TEST_WORKBOOK_CATALOG_MC59.md
- docs/architecture/S2IMS_SYNTHETIC_MASTER_DATA_WORKBOOK_FIELD_SPEC_MC59.md
- docs/architecture/S2IMS_MASTER_DATA_IMPORT_PREVIEW_MANUAL_TEST_PACK_MC58.md
- docs/architecture/S2IMS_MASTER_DATA_IMPORT_PREVIEW_GO_NO_GO_CHECKLIST_MC58.md

