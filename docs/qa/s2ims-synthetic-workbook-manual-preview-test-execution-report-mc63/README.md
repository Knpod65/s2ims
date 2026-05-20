# MC63 QA README

This QA README documents the checklist to validate MC63 manual preview test execution report.

Steps for QA reviewer:
1. Checkout branch: architecture/s2ims-synthetic-workbook-manual-preview-test-execution-report-mc63
2. Confirm only docs/ changes present
3. Re-run validations: npm run build; npm run check:tokens; npm run check:audit-events
4. Confirm generator run and local artifacts exist (artifacts/synthetic-master-data-workbooks/) but are not committed
5. Review MC63 report, issue register, and evidence summary
6. Record QA confirmations in S2IMS_SYNTHETIC_WORKBOOK_MANUAL_PREVIEW_TEST_EXECUTION_REPORT_MC63_QA_SUMMARY.md
