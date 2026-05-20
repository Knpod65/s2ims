# S²IMS Master Data Intake Plan MC51

## 1. Purpose

MC51 Master Data Intake Plan documents how S²IMS will intake, validate, and prepare master personnel datasets (Teacher_Master and Staff_Master) as the authoritative sources for future admin-configurable owner/approver assignments and other governance tooling. This is documentation-only; no runtime import is performed in MC51.

## 2. Source Files (planning-only)

- Personnel_120226.xlsx (reference)
  - teacher sheet (~44 rows)
  - staff sheet (~37 rows)
- Employee/staff roster files (where available)
- Lecturer/opencourse/student enrollment files (future sources; aggregate-only until PDPA approved)

Notes:
- These files are referenced for planning and sample matching only. No production import or seed is performed by MC51.

## 3. Priority Import Order (pilot-first)

1. Staff_Master (priority) — HR / employee roster
2. Teacher_Master (priority) — lecturers and teaching staff
3. Staff-role / account mappings (roster)
4. Lecturer/opencourse (aggregate preview only)
5. Student enrollment (aggregate counts only)

Rationale: Staff and teacher master data provide authoritative identity and contact fields (cmu_mail) for owner/approver assignment.

## 4. Staff/Teacher Master Data Rules

- Required fields for initial seed (pilot):
  - internalId (synthetic)
  - sourceId (original ID)
  - cmu_mail (preferred unique join key)
  - displayName (concatenated)
  - unitOrDepartment
  - roleCategory (e.g., academic_advisor, scholarship_operations)
  - officialEmail (cmu_mail if present)
  - isMock (false for production data; true when synthetic)

- Validation rules:
  - cmu_mail format check (email regex)
  - cmu_mail uniqueness within dataset
  - required fields presence
  - forbidden PII fields removed from public outputs

- Matching strategy:
  - Use cmu_mail as primary join key where available
  - Fall back to sourceId for systems without cmu_mail

## 5. Admin-Configurable Responsible Person Registry

Design (planning-only):
- A registry of roles and assigned persons linked to Staff_Master/Teacher_Master
- Assignment schema:
  - id, roleKey, personId (ref to Staff/Teacher), unit, effectiveFrom, effectiveTo, notes, createdBy, createdAt
- Admin UI flows: add, remove, edit assignments with preview and audit reason
- Change history: versioned records and append-only audit log (design, not enabled in MC51)

## 6. Known Prior Data Issues

- Missing cmu_mail for some legacy records — require manual enrich/lookup
- Inconsistent name formats — normalize during intake
- Duplicate entries across teacher/staff files — resolve via cmu_mail where present

## 7. Preview-First Import Flow (pilot)

1. Upload CSV/XLSX in admin preview UI
2. Run schema validation and report errors/warnings
3. Allow editor to map columns and fix obvious issues (normalize emails)
4. Allow selection of records to include (preview mode)
5. Persist only after governance sign-off in a later milestone

## 8. Validation Rules

- Email format validation for cmu_mail
- Uniqueness enforcement for cmu_mail
- Required fields enforcement
- Forbidden field scrubbing (PII removal for public outputs)

## 9. No Runtime Import in MC51

MC51 is strictly documentation-only. Do not import any real data into runtime, do not enable persistence, and do not seed master tables in code during MC51.

---

**Prepared as part of MC51 planning package.**