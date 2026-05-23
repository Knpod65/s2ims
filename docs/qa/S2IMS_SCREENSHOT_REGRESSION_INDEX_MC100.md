# S²IMS MC100 Screenshot Regression Index

**Date:** 2026-05-23

## Screenshot Location
`docs/screenshots/mc100-mock-ready-closure/`

## Captured Screenshots (or Plan)

| Filename | Route | Role | Status | Notes |
|----------|-------|------|--------|-------|
| mc100-001-login.png | /login | All | Plan | Capture login with role buttons and Soft Civic styling |
| mc100-005-import-preview.png | /admin/master-data/import-preview | Admin | Plan | Must show disabled Confirm Import + AP-10B SafetyBanner + DisabledActionHint |
| mc100-007-staff-applications.png | /staff/applications | Staff | Plan | Verify decision-support only language and document badges |
| mc100-012-esq-dashboard.png | /esq/dashboard | ESQ | Plan | Verify "recommendation" language and review queue |
| mc100-013-esq-review.png | /esq/announcements/[id]/review | ESQ | Plan | Critical — must show recommendation language only (no approval) |
| mc100-014-public-scholarships.png | /scholarships | Public | Plan | Verify clean public listing |

## Capture Instructions (if screenshots not yet taken)
- Use 1440x1200 viewport
- Stable mock data state
- Include SafetyBanner / SectionHeader where present
- Highlight any disabled actions with their hints
- Do not capture real PII (none exists in mock)

If tooling is unavailable in the current environment, this index serves as the official capture plan for the governance owner.

**MC100 Screenshot Regression Evidence Status:** Plan documented; actual images to be added during controlled demo preparation if required by governance.
