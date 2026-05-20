# S2IMS Admin Responsible Person Registry Plan - MC52

Purpose: Design the admin registry schema and process for assigning responsible persons (owners, approvers) for master data intake.

Registry Schema (planning-only):
- registry_id
- role_name (owner, approver, steward)
- person_name
- person_email
- person_staff_id
- effective_from
- effective_to
- assigned_by
- assigned_at
- notes

Required Roles:
- master_data_owner
- master_data_approver
- data_steward
- legal_contact
- pdpa_contact

Assignment Process:
- Admin UI to propose assignments (design-only)
- Changes require governance workflow and audit trail (design-only)
- Do NOT implement runtime registry until AP-10B is cleared

Audit & Versioning (design-only):
- Maintain changelog of registry modifications
- Produce evidence snapshots for governance reviews

Limitations:
- This is a planning doc only — no runtime code, no DB schema changes, no persistence

---
