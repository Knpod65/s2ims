# MC58 QA README

This QA README accompanies the MC58 manual test pack and security triage plan for the preview-only master data import route.

Validation baseline
- Build: 42/42
- Tokens: 4/4
- Audit checks: 502/502

Triage owner: TBD (security lead)

Instructions for QA reviewers
1. Verify branch: architecture/s2ims-master-data-import-preview-manual-test-security-triage-plan-mc58
2. Confirm docs-only changes in this branch
3. Run local validations: npm run build; npm run check:tokens; npm run check:audit-events
4. Execute manual tests per S2IMS_MASTER_DATA_IMPORT_PREVIEW_MANUAL_TEST_PACK_MC58.md using synthetic-only files retained locally
5. Record results in S2IMS_MASTER_DATA_IMPORT_PREVIEW_MANUAL_TEST_PACK_MC58_QA_SUMMARY.md

Do NOT commit any Excel or Word files; keep evidence as screenshots only.
