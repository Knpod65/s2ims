Branch: main

Merge: architecture/s2ims-master-data-import-preview-runtime-hardening-mc57

Implementation commit: bb45b7d
QA commit: 48c03ba
Merge commit: 3000906
Merge checkpoint commit: 0fbbd78
Post-merge QA commit: 37f6f80

Validation results:
- Build: 42/42
- Tokens: 4/4
- Audit checks: 502/502
- Routes: 7×200 OK

Runtime hardening implemented (MC57):
- File size limit checks (5 MB hard block, 2 MB warning)
- Row limit constants (1,000 hard, 500 warning) exported
- Sheet count constant (10)
- Forbidden column alias detection expanded
- Formula-like detection added (warning)
- UI copy shows limits and safety notes
- Confirm Import remains disabled
- No persistence, no backend/API, no audit writes, no official evidence
- Script guard checks maintained

Files changed/added:
- src/lib/master-data-import/config.ts (new)
- src/lib/master-data-import/excelParser.ts (file-size checks)
- src/lib/master-data-import/normalization.ts (forbidden detection helper)
- src/lib/master-data-import/validator.ts (forbidden/formula detection)
- src/lib/master-data-import/types.ts (message codes)
- src/lib/master-data-import/index.ts (export config)
- src/app/admin/master-data/import-preview/page.tsx (UI copy)
- docs/architecture/S2IMS_MASTER_DATA_IMPORT_PREVIEW_RUNTIME_HARDENING_MC57_QA_SUMMARY.md
- docs/qa/s2ims-master-data-import-preview-runtime-hardening-mc57/README.md

Notes:
- No package.json or package-lock.json changes
- No npm audit fix or dependency upgrades executed
- AP-10B remains blocked; AP-10C/AP-11 blocked

Next recommended step:
- Run MC57 post-merge QA checklist and ensure security triage from MC56 is scheduled for a dedicated upgrade branch if any high/critical findings exist.
