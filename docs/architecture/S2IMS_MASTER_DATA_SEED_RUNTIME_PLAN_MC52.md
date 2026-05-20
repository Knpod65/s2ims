# S2IMS Master Data Seed Runtime Plan - MC52

Seed preview-first flow:
1. Admin uploads a source file (CSV/XLSX) - docs-only
2. System parses file in-memory and presents a preview (first N rows) with validation errors highlighted
3. Admin reviews duplicates, resolves conflicts in preview UI (design-only)
4. Admin confirms preview; system generates an import plan (dry-run) showing records to be created/updated
5. Admin may export import plan as CSV for offline review; no runtime import or persistence in MC52

Validation Rules:
- Required fields: cmu_mail, full_name, role
- Email format check
- Department must match known departments list (configurable)
- Row-level error reporting

Sample Runtime Behavior (in-memory preview only):
- Use in-memory data structures; never write to DB
- Generate sample seed set from Personnel_120226.xlsx metadata

Failure Modes & Mitigation:
- File parsing errors: surface row number and error
- Duplicate resolution conflicts: mark as requires manual review
- Large file (>10k rows): recommend splitting and offline review

Validation Checklist:
- Preview renders first N rows correctly
- Validation errors displayed per-row
- Duplicate suggested matches shown
- Admin export of import plan available (docs-only)

---
