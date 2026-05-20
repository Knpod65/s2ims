2026-05-20 — MC61 Authoring

Branch: architecture/s2ims-synthetic-workbook-generator-runtime-mc61

Created:
- tools/generate-synthetic-master-data-workbooks.mjs
- .gitignore entry: artifacts/synthetic-master-data-workbooks/
- docs/architecture/S2IMS_SYNTHETIC_WORKBOOK_GENERATOR_RUNTIME_MC61_SUMMARY.md

Validation to run locally:
- npm run build (expect 42/42)
- npm run check:tokens (expect 4/4)
- npm run check:audit-events (expect 502/502)
- node tools/generate-synthetic-master-data-workbooks.mjs --rows 50

Notes:
- Generated .xlsx files are written to artifacts/synthetic-master-data-workbooks/ and must NOT be committed.
- Do not run npm install or modify package.json.
