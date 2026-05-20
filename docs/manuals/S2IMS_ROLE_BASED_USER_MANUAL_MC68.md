# S²IMS Role-Based User Manual MC68

## 1. Purpose
This manual explains how to use the current S²IMS web app by role. It is written for the current preview-safe application state and is intentionally limited to the routes and behaviors that exist in this repository.

## 2. System Status
- The app is in a controlled demo / preview-safe state.
- Several pages are mock, demo, or preview-only pages.
- `/admin/master-data/import-preview` is preview-only.
- Confirm Import remains disabled / no-op.
- AP-10B, AP-10C, and AP-11 remain blocked.
- This manual does not authorize production import, approval, persistence, audit writes, or official evidence creation.

## 3. Roles Covered
- Admin
- Scholarship Staff
- Provider
- Student
- ESQ / Reviewer
- Public / unauthenticated user
- Technical / governance viewer, where the routes overlap with admin or ESQ review pages

## 4. Common Navigation Concepts
- Login begins at `/login`.
- The app uses role-based route groups such as `/admin`, `/staff`, `/provider`, `/student`, and `/esq`.
- Some pages are hidden or preview-only and are meant for guided review rather than routine operation.
- Disabled actions are deliberate safety boundaries, not defects.
- Many pages use table, card, and filter patterns for browsing records and review queues.
- Thai and English copy can appear on the same page, depending on the route and selected language.

## 5. Admin Manual
1. Open `/login` and choose the Admin role.
2. Enter the admin dashboard at `/admin/dashboard` and review the system overview, user counts, and recent audit activity.
3. Open `/admin/audit-log` to review the audit trail table and inspect event history.
4. Open `/admin/candidate-review-demo` to inspect the read-only combined preview, backlog preview, and synthesis preview.
5. Open `/admin/master-data/import-preview` to review the preview-only import workflow, validation results, and sheet detection.
6. Visit `/admin/users`, `/admin/permissions`, and `/admin/settings` for identity, access, and configuration review.
7. Use `/admin/export` only as a preview of export-related behavior, not as a production data handoff.
8. Treat disabled actions, blocked options, and “preview-only” labels as safety boundaries.

## 6. Scholarship Staff Manual
1. Open `/login` and choose the Staff role.
2. Review `/staff/dashboard` for the operational overview.
3. Open `/staff/applications` to scan the application queue.
4. Open `/staff/applications/app_001` or `/staff/applications/app_002` to inspect a safe application detail view.
5. Use `/staff/analytics` and `/staff/data-quality` to review dashboard-style operational status.
6. Visit `/staff/ocr`, `/staff/follow-up`, `/staff/disclosure-requests`, and `/staff/matching-review` for the supporting workflow views.
7. Treat matching, disclosure, OCR, and follow-up pages as review surfaces unless a page clearly states otherwise.

## 7. Provider Manual
1. Open `/login` and choose the Provider role.
2. Review `/provider/dashboard` for the provider summary view.
3. Open `/provider/scholarships` to review scholarship listings.
4. Use `/provider/scholarships/[scholarshipId]` routes such as the detail, criteria, edit, candidate, and new pages to understand portfolio management flow.
5. Open `/provider/candidates` for candidate browsing, then use `/provider/impact`, `/provider/insights`, and `/provider/outcomes` for result-oriented views.
6. Treat candidate identifiers and scholarship references as synthetic or preview data unless the page explicitly indicates otherwise.

## 8. Student Manual
1. Open `/login` and choose the Student role.
2. Review `/student/dashboard` for the student overview.
3. Open `/scholarships` for the public scholarship list, then inspect `/scholarships/[id]` for a scholarship detail view.
4. Use `/student/recommendations` and its explanation routes to review recommendation guidance.
5. Open `/student/applications` to review existing applications.
6. Use `/student/applications/new`, `/student/applications/[applicationId]`, `/student/applications/[applicationId]/edit`, and `/student/applications/[applicationId]/documents` to understand the application lifecycle.
7. Visit `/student/profile`, `/student/notifications`, and `/student/follow-up` for profile and progress-related screens.

## 9. ESQ / Reviewer Manual
1. Open `/login` and choose the ESQ role.
2. Review `/esq/dashboard` for the review-centric overview.
3. Open `/esq/history` to inspect prior review history.
4. Use `/esq/announcements/[id]/review` as the structured review page where announcement review is exposed.
5. Treat these routes as review and oversight surfaces, not approval workflows for production use.

## 10. Master Data Import Preview Manual
Route: `/admin/master-data/import-preview`

This page is the preview-only file inspection surface for synthetic master-data workbooks. It accepts local file input for browser-memory parsing, shows validation outcomes, and highlights blocked or future-only source types.

1. Choose a source type that matches the intended workbook family.
2. Select a synthetic workbook only; do not use real personnel, student, or production data.
3. Review the sheet detection panel, summary cards, and row-level validation table.
4. Read warnings, errors, and blocked-row labels as preview feedback, not as approval or import clearance.
5. Use the filter controls to isolate valid rows, warning rows, blocked rows, or mapping issues.
6. Clear the preview when you are done; no persistence should occur.
7. Confirm Import remains disabled and must not be used as a production action.

Important boundaries:
- Allowed: synthetic workbook preview, validation, row inspection, and safety review.
- Not allowed: production import, persistence, audit writes, official evidence, or AP-10B/AP-10C/AP-11 activation.
- Future-only options remain blocked by design.

## 11. Candidate Review Demo Manual
Route: `/admin/candidate-review-demo`

This is a read-only diagnostic preview that combines candidate review, backlog preview, and synthesis preview sections.

1. Open the page directly by route; it is not a routine navigation target.
2. Review the diagnostic preview section first.
3. Inspect the backlog preview section for planning-only context.
4. Inspect the feedback synthesis preview section for summary-style mock content.
5. Treat every element as read-only and non-official.
6. Do not use this page to imply approval, assignment, or governance action.

## 12. Role Journey Tables

| Role | Starting route | Page | User goal | Action | Expected result | Screenshot reference | Safety note |
|---|---|---|---|---|---|---|---|
| Admin | `/login` | `/admin/dashboard` | Review system status | Open dashboard | Overview loads with counts and audit summary | `mc68-002-admin-dashboard.png` | Synthetic/demo data only |
| Admin | `/admin/dashboard` | `/admin/audit-log` | Inspect audit trail | Open audit log | Event list is visible | `mc68-003-admin-audit-log.png` | No official evidence |
| Admin | `/admin/dashboard` | `/admin/candidate-review-demo` | Review demo diagnostic | Open demo page | Read-only preview appears | `mc68-004-admin-candidate-review-demo.png` | Not approval |
| Admin | `/admin/dashboard` | `/admin/master-data/import-preview` | Inspect workbook preview | Open import preview | Validation and sheet detection render | `mc68-005-admin-master-data-import-preview.png` | Confirm Import disabled |
| Staff | `/login` | `/staff/dashboard` | See operational queue | Open dashboard | Staff overview loads | `mc68-006-staff-dashboard.png` | Synthetic/demo data only |
| Staff | `/staff/dashboard` | `/staff/applications` | Review applications | Open list | Application table loads | `mc68-007-staff-applications.png` | Preview-safe records only |
| Staff | `/staff/applications` | `/staff/applications/app_001` | Inspect one case | Open detail | Application detail page loads | `mc68-008-staff-application-detail.png` | Use safe mock IDs only |
| Provider | `/login` | `/provider/dashboard` | Review provider summary | Open dashboard | Summary cards and lists load | `mc68-009-provider-dashboard.png` | Synthetic/demo data only |
| Provider | `/provider/dashboard` | `/provider/scholarships` | Review scholarship portfolio | Open list | Portfolio list loads | `mc68-010-provider-scholarships.png` | Preview-safe data only |
| Student | `/login` | `/student/applications` | Check own applications | Open applications | Application list loads | `mc68-011-student-applications.png` | Demo-safe records only |
| Student | `/student/applications` | `/student/applications/[applicationId]` | Inspect application detail | Open detail | Detail page loads | `mc68-012-student-application-detail.png` | Safe mock IDs only |
| ESQ / Reviewer | `/login` | `/esq/dashboard` | Review oversight summary | Open dashboard | Review overview loads | `mc68-013-esq-dashboard.png` | No approval language |
| ESQ / Reviewer | `/login` | `/esq/history` | Review history | Open history | History list loads | `mc68-014-esq-history.png` | Oversight only |

## 13. Known Limitations
- Preview and demo pages are intentionally read-only.
- Confirm Import stays disabled.
- AP-10B, AP-10C, and AP-11 remain blocked.
- No real data import is authorized by this manual.
- No production approval workflow exists in this package.

## 14. Troubleshooting
- If a page does not load, confirm the exact route and role before retrying.
- If validation errors appear on import preview, inspect the workbook content and filter state.
- If a button is disabled, treat it as an intentional boundary until the governing feature exists.
- If a route is missing, verify the current branch and build output rather than assuming it exists.
- If a workbook is rejected, confirm it is synthetic and compatible with the preview route.

## 15. Appendix
- Route inventory reference: [S2IMS_ROLE_BASED_ROUTE_INVENTORY_MC68.md](../architecture/S2IMS_ROLE_BASED_ROUTE_INVENTORY_MC68.md)
- Screenshot plan reference: [S2IMS_SCREENSHOT_CAPTURE_PLAN_MC68.md](../architecture/S2IMS_SCREENSHOT_CAPTURE_PLAN_MC68.md)
- Screenshot evidence reference: [S2IMS_SCREENSHOT_EVIDENCE_INDEX_MC68.md](../architecture/S2IMS_SCREENSHOT_EVIDENCE_INDEX_MC68.md)
- Screenshot fallback reference: [S2IMS_SCREENSHOT_CAPTURE_PENDING_INDEX_MC68.md](../architecture/S2IMS_SCREENSHOT_CAPTURE_PENDING_INDEX_MC68.md)
- Manual version: MC68
