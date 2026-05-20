# S2IMS Synthetic Workbook Generation Method Plan MC59

## Purpose
Document recommended methods for generating synthetic master data workbooks for manual QA. This plan recommends safe practices, deterministic generation options, and governance controls for future fixture creation. MC59 does not create any files.

## Generation options

1. Manual Excel authoring (small sets)
- Suitable for one-off review and small hand-crafted cases (for example: invalid header, forbidden column tests).
- Use templates that contain header rows and small sample rows.
- Strictly follow synthetic naming and `synthetic_` filename policy.

2. Scripted generation (recommended for scale)
- Use a small script (Node.js or Python) that produces synthetic rows deterministically using a fixed seed for random data.
- Provide configuration inputs: row_count, sheet_count, duplication_rate, forbidden_column_inclusion, formula_cell_ratio.
- Scripts must never fetch or import production data.
- Example output domain: example.test or example.local for all generated emails.

3. Hybrid approach
- Combine templates with script-driven bulk generation for stress tests (row limits, file size targets).

## Where generated files may live (policy)
- Generated workbooks must not be committed to main without governance approval.
- Approved fixture storage policy (future): an explicit directory such as `docs/test-fixtures/approved/` may be used only after AP-10B owner assignment and formal approval.

## Why MC59 does not create files
- Avoid accidental commits of sensitive data and to respect AP-10B blocked governance.
- Ensure security triage and governance decisions occur before any fixture storage.

## Fixture approval requirements (pre-commit)
- Security lead review (MC56/MC58 findings acknowledged)
- Governance owner approval (AP-10B owner(s) assigned and sign-off)
- QA checklist verification (synthetic-only, deterministic seeding, no PII)

## QA pre-use checklist
- Validate generated file against field spec (S2IMS_SYNTHETIC_MASTER_DATA_WORKBOOK_FIELD_SPEC_MC59.md)
- Run local build and audit checks (42/42, 4/4, 502/502)
- Validate that import-preview rejects or warns as expected in local manual runs
- Record test metadata in manual execution worksheet and store screenshots only

Final note: MC59 is planning-only and must not generate or commit any files by itself.
