# S2IMS Master Data Intake Contract - MC52

Purpose: Define the contract for master data intake (Staff_Master, Teacher_Master) for S2IMS. Documentation-only; no runtime imports or persistence.

Scope:
- Allowed sources: Personnel_120226.xlsx (staff, teacher), verified HR exports, canonical staff rosters
- Denied sources: Student PII files, external unvetted sources

Contract Fields:
- staff_id: internal identifier (optional)
- cmu_mail: primary join key (recommended)
- full_name
- given_name
- family_name
- email
- role: staff|teacher|admin
- department
- employment_status
- source_file_id
- source_row

Normalization Rules:
- Trim whitespace, normalize unicode, lowercase emails
- Standardize thai name order (planning note: require legal/PDPA check)

Duplicate Resolution:
- Match by cmu_mail primary; fallback to full_name+department fuzzy match
- Produce preview of duplicates for admin decision (preview-only)

Privacy & PDPA Notes:
- No student PII allowed in source files until PDPA/legal review completes.
- All PII handling requires legal sign-off; this is a planning document only.

Limitations:
- Docs-only. No code changes, no migrations, and no persistence are included in MC52.

---
