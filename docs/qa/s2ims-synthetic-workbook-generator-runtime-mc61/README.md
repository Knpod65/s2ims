# MC61 QA README

This QA README documents how to validate the MC61 Synthetic Workbook Generator runtime.

Steps for QA reviewer:
1. Checkout branch: architecture/s2ims-synthetic-workbook-generator-runtime-mc61
2. Confirm only docs and tools/ changes present
3. Run validations: npm run build; npm run check:tokens; npm run check:audit-events
4. Run generator locally: node tools/generate-synthetic-master-data-workbooks.mjs --rows 20
5. Confirm artifacts/ contains generated .xlsx files and they are not staged/tracked
6. Remove artifacts/ or ensure .gitignore contains artifacts/synthetic-master-data-workbooks/ before pushing
7. Record generator output in QA summary

Do NOT commit generated .xlsx files.