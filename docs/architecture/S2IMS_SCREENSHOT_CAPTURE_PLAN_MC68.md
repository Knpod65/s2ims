# S2IMS Screenshot Capture Plan MC68

## Purpose
This plan defines how screenshots should be captured for the role-based manual. It is intentionally limited to the local development server and synthetic or demo-safe content.

## Screenshot tool availability status
- Browser and screenshot tools are available in this environment.
- Capture has been executed in this branch for the current evidence set.
- Use the evidence index for the captured set and keep the pending index only as a fallback record.

## Local dev server requirement
- Capture screenshots only from a local dev server.
- Use the current app state and safe synthetic/demo data only.
- Do not capture real staff, student, or personnel data.

## Naming convention
- `mc68-001-login.png`
- `mc68-002-admin-dashboard.png`
- `mc68-003-admin-audit-log.png`
- `mc68-004-admin-candidate-review-demo.png`
- `mc68-005-admin-master-data-import-preview.png`
- Continue sequentially for the remaining routes.

## Capture directory
- `docs/screenshots/mc68-role-based-user-manual/`

## Route list
- `/login`
- `/admin/dashboard`
- `/admin/audit-log`
- `/admin/candidate-review-demo`
- `/admin/master-data/import-preview`
- `/staff/dashboard`
- `/staff/applications`
- `/staff/applications/app_001`
- `/staff/applications/app_002`
- `/provider/dashboard`
- `/provider/scholarships`
- `/provider/candidates`
- `/student/applications`
- `/student/applications/[applicationId]`
- `/scholarships`
- `/esq/dashboard`
- `/esq/history`

## Viewport recommendation
- Use a desktop viewport for the primary evidence set.
- Keep width large enough to show the table layouts without truncation where possible.
- Revisit narrow responsive views only if a page’s mobile layout is specifically relevant.

## Safe data rules
- Use mock, synthetic, or demo-only data.
- Avoid any identifier that could be mistaken for real PII.
- Keep screenshots focused on routes, controls, and validation states.

## PII exclusion rules
- Do not capture real names, staff identities, student identities, or real e-mail addresses.
- Do not capture workbook content that implies real production records.
- Do not capture official-signoff language.

## Retake rules
- Retake screenshots if the route title is cropped or if the safety boundary is not visible.
- Retake if a disabled state or preview-only label is missing from the frame.
- Retake if the route does not clearly identify the page purpose.

## Pending screenshot table
| Screenshot id | Planned file path | Route | Role | Capture status | Reason | Safety note |
|---|---|---|---|---|---|---|
| `mc68-001-login.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-001-login.png` | `/login` | Public / all | Captured | Captured locally from the local dev server. | Prototype login only |
| `mc68-002-admin-dashboard.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-002-admin-dashboard.png` | `/admin/dashboard` | Admin | Captured | Captured locally from the local dev server. | Synthetic/demo data only |
| `mc68-003-admin-audit-log.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-003-admin-audit-log.png` | `/admin/audit-log` | Admin | Captured | Captured locally from the local dev server. | No official evidence |
| `mc68-004-admin-candidate-review-demo.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-004-admin-candidate-review-demo.png` | `/admin/candidate-review-demo` | Admin / reviewer | Captured | Captured locally from the local dev server. | Hidden demo route |
| `mc68-005-admin-master-data-import-preview.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-005-admin-master-data-import-preview.png` | `/admin/master-data/import-preview` | Admin | Captured | Captured locally from the local dev server. | Confirm Import disabled |
| `mc68-006-staff-dashboard.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-006-staff-dashboard.png` | `/staff/dashboard` | Staff | Captured | Captured locally from the local dev server. | Preview-safe data only |
| `mc68-007-staff-applications.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-007-staff-applications.png` | `/staff/applications` | Staff | Captured | Captured locally from the local dev server. | Safe mock records only |
| `mc68-008-staff-application-detail.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-008-staff-application-detail.png` | `/staff/applications/app_001` | Staff | Captured | Captured locally from the local dev server. | Safe mock id only |
| `mc68-009-provider-dashboard.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-009-provider-dashboard.png` | `/provider/dashboard` | Provider | Captured | Captured locally from the local dev server. | Synthetic/demo data only |
| `mc68-010-provider-scholarships.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-010-provider-scholarships.png` | `/provider/scholarships` | Provider | Captured | Captured locally from the local dev server. | Preview-safe data only |
| `mc68-011-student-applications.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-011-student-applications.png` | `/student/applications` | Student | Captured | Captured locally from the local dev server. | Demo-safe records only |
| `mc68-012-student-application-detail.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-012-student-application-detail.png` | `/student/applications/[applicationId]` | Student | Captured | Captured locally from the local dev server. | Safe mock ids only |
| `mc68-013-esq-dashboard.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-013-esq-dashboard.png` | `/esq/dashboard` | ESQ / Reviewer | Captured | Captured locally from the local dev server. | Not an approval step |
| `mc68-014-esq-history.png` | `docs/screenshots/mc68-role-based-user-manual/mc68-014-esq-history.png` | `/esq/history` | ESQ / Reviewer | Captured | Captured locally from the local dev server. | Oversight only |
