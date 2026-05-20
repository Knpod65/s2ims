# S²IMS Role & Authority Normalization Plan MC51

## Purpose

Define a canonical role and action authority normalization plan to map business roles to system authorities as part of governance readiness planning. This is a documentation-only plan for MC51.

## Source role list (from MC51 form)

Roles considered:
- Admin
- Scholarship staff
- Advisor
- Governance reviewer
- Privacy reviewer (DPO)
- Technical owner
- Viewer
- Fund provider / scholarship owner
- Student
- ESQ (education quality)

## Action categories
- view demo
- view real data
- create record
- edit record
- submit
- approve
- reject
- export
- view audit
- write audit (system-only)

## Recommended normalization

- Map each role to allowed action categories with justification and safety boundary.
- Treat `write audit` as system-only; humans do not directly hold this action.

Example mapping (planning-only):
- Admin: all view/edit/create except write audit, can manage owner/approver registry
- Scholarship staff: view/edit scholarship-specific records, not write audit
- Advisor: view demo, view limited real-data (if permitted), no approve
- Governance reviewer: view audit, recommend approval, not apply final approve unless AP-10B approved
- Privacy reviewer: view data flow, flag PDPA issues, cannot approve AP-10B
- Technical owner: deploy/operate, not approve AP-10B
- Viewer: read-only demo access
- Fund provider: view aggregated reports, not real student PII
- Student: view own data via authorized channels
- ESQ: view quality metrics, provide feedback

## High-risk Allow values requiring review
- Approval rights (approve/reject) — require AP-10B resolution before assignment
- Export rights — require retention and export policy
- View real data — require PDPA/compliance sign-off

## Assignment principles
- All role-to-action mappings must be configurable by admin
- Changes to mappings must be auditable and require governance sign-off before production

## Implementation notes (design-only)
- Provide a role/action JSON contract used by future services
- Implement guardrails to prevent granting approve/export/view-real-data without blockers cleared

---

**Prepared for MC51 planning.**