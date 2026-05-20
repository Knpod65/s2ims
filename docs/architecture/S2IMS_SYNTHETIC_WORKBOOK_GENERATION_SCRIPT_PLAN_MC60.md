# S2IMS Synthetic Workbook Generation Script Plan MC60

## 1. Purpose
Document a future script plan for generating deterministic synthetic master data workbooks suitable for manual QA against the preview-only import route. MC60 is documentation-only and does not create scripts or files.

## 2. Scope
In scope:
- Script design and contract
- Output workbook catalog (aligned with MC59)
- Synthetic data rules and enforcement
- Output directory and fixture policy
- QA validation checklist
- MC61 runtime implementation boundaries and approvals

Out of scope:
- Creating the generator script in MC60
- Generating or committing .xlsx files
- Modifying runtime code
- Persistence, backend/API, audit writes, official evidence
- Opening AP-10B/AP-10C/AP-11

## 3. Proposed script path (future)
- tools/generate-synthetic-master-data-workbooks.mjs (recommended)

Note: This file must NOT be implemented in MC60.

## 4. Allowed output workbook catalog
(Use MC59 canonical list)
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

## 5. Synthetic data rules
- Use deterministic seeding so test artifacts are reproducible
- Use safe example domains (example.test/example.local)
- No real names, emails, IDs, phones, bank accounts, signatures, health data, or raw documents
- Forbidden headers must be possible to inject as test cases but with synthetic placeholder values
- Hash or mask any accidental real-values if discovered during generation (fail-fast preferred)

## 6. Output directory policy
- Recommended future output directory: artifacts/synthetic-master-data-workbooks/
- Generated files MUST NOT be committed to main without governance approval
- Approved fixture directory (if used) must be clearly gated and documented; default: gitignored

## 7. Commit policy
- By default, generated .xlsx files should NOT be committed
- If fixtures need committing, require separate explicit approval (AP-10B owner assignment and security sign-off), and store under approved fixtures path only

## 8. Script input/output contract
Inputs (CLI flags or config JSON):
- --spec <path|name> (which workbook spec to generate)
- --rows <number>
- --seed <number> (deterministic seed)
- --include-forbidden-columns [true|false]
- --formula-ratio <0-1>
- --duplicate-rate <0-1>
- --output-dir <path>

Outputs:
- .xlsx file saved in output-dir
- JSON manifest printed to stdout with file list, row counts, seed, hash of content, generation timestamp
- Exit non-zero if any no-real-data assertion fails

## 9. Workbook generation scenarios
- Minimal valid: small file with canonical headers and 5 rows
- Large valid: file with N rows (for stress testing up to MAX_PREVIEW_ROWS and beyond for warning/block tests)
- Duplicate cmu_mail: generate duplicates to trigger duplicate detection
- Missing cmu_mail: leave cmu_mail blank for some rows
- Invalid emails: inject invalid formats
- Forbidden columns: add headers from FORBIDDEN_COLUMN_ALIASES
- Formula cells: inject cells beginning with '=' to test formula detection
- Multi-sheet combined: create multiple sheets per combined scenario

## 10. QA validation checklist
Before any human uses generated files for manual preview testing:
- Confirm manifest lists files and their seed
- Confirm emails use example.test/local domains
- Run npm run build and npm run check:audit-events (42/42, 4/4, 502/502)
- Manually load files in preview route locally and verify expected validator messages (do not persist)
- Record results in manual test execution worksheet and keep screenshots only

## 11. No-real-data enforcement
- Script must contain strict validation: regex checks for known forbidden patterns (e.g., Thai national IDs, real email domains), and abort on matches
- Generation acceptance test: run a local check that asserts no realistic identifiers present

## 12. Future MC61 runtime implementation boundaries
- MC61 may implement generation scripts and optionally commit approved fixtures under approved path only after:
  - Security triage completes (MC56/MC58 references)
  - Governance (AP-10B) owner assignment and approval
  - QA checklist and manifest verification
- MC61 must not enable Confirm Import, create persistence, or write audit events as part of generation

## 13. Example manifest schema (JSON)
{
  "files": [
    {"filename": "synthetic_staff_master_valid.xlsx", "rows": 50, "seed": 12345, "hash": "..."}
  ],
  "generatedAt": "2026-05-20T00:00:00Z",
  "scriptVersion": "0.1.0"
}

## 14. Governance & approval checklist
- Security lead attestation
- Governance owner sign-off (AP-10B) required before committing fixtures
- QA acceptance of deterministic generation and manifest integrity

Final safety note: MC60 documents the design and governance requirements for a future synthetic workbook generator script. No scripts or files are created in this phase.
