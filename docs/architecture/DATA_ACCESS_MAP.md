# S2IMS Data Access Map

## Purpose

This document maps current mock data files to their importers and future service-layer candidates. Today, S2IMS is mock-data driven and pages/components import `src/data/mock/*` directly.

Future renovation should introduce service boundaries gradually without changing behavior.

## Mock Data Files

| Mock file | Data shape summary | Current importers | Roles using it | Future service-layer candidates |
|---|---|---|---|---|
| `src/data/mock/adminData.ts` | Admin users/roles/permissions, access requests, security alerts, export events, sensitive access events, role assignment history | Admin components: `AccessRequestCard`, `ExportEventCard`, `PermissionMatrixTable`, `RoleAssignmentPanel`, `SecurityAlertCard`, `SensitiveAccessCard` | Admin | `adminPermissionService`, `adminSecurityService`, `auditService`, `accessRequestService` |
| `src/data/mock/announcements.ts` | Announcement records and ESQ review states | `staff/announcements/[id]/preview`, `esq/dashboard`, `esq/history`, `esq/announcements/[id]/review` | Staff, ESQ | `announcementService`, `esqApprovalService`, `auditService` |
| `src/data/mock/applications.ts` | Legacy application records, statuses, steps, docs | `student/dashboard`, `staff/applications`, `staff/applications/[id]`, `staff/students/[id]`, `admin/export` | Student, staff, admin | `applicationService`, `staffReviewService`, `studentApplicationService`, `exportService` |
| `src/data/mock/audit-logs.ts` | Admin audit log entries | `admin/dashboard`, `admin/audit-log`, `admin/export` | Admin | `adminAuditService`, `auditLogService`, `exportService` |
| `src/data/mock/notifications.ts` | Notifications and read state seed data | `student/notifications`, `student/dashboard`, `layout/Topbar` | Student, all via Topbar count | `notificationService` |
| `src/data/mock/providerData.ts` | Provider organization, scholarships, criteria, anonymous candidates, shortlist requests, impact metrics | Provider routes and provider components | Provider | `providerService`, `providerScholarshipService`, `providerCandidateService`, `shortlistService`, `privacyService`, `matchingService` |
| `src/data/mock/scholarships.ts` | Public scholarship catalog | `/`, `/scholarships`, `/scholarships/[id]`, `student/applications/new`, `admin/export` | Public, student, admin | `scholarshipService`, `publicCatalogService`, `exportService` |
| `src/data/mock/staffData.ts` | Staff match reviews, disclosure requests, document states, notes, audit events, data quality issues | Staff routes and staff components | Staff | `staffReviewService`, `disclosureService`, `documentVerificationService`, `dataQualityService`, `auditService`, `privacyService` |
| `src/data/mock/studentApplicationData.ts` | Phase 3 student application records, document states, timeline, readiness helpers | Student application/scholarship routes and student application components | Student | `studentApplicationService`, `documentService`, `applicationReadinessService` |
| `src/data/mock/studentMatchingData.ts` | Student profile summary, completeness, missing data, recommendations, eligibility, fit breakdown, freshness | Student dashboard/profile/recommendation/application routes and student matching components | Student | `matchingService`, `studentProfileService`, `profileCompletenessService`, `privacyService` |
| `src/data/mock/users.ts` | Mock users and roles | `lib/auth`, `admin/users`, `admin/export`, `staff/students/[id]`, `student/applications/new` | Auth, student, staff, admin | `authUserService`, `userService`, `studentProfileService`, `exportService` |

## Direct Data Access Pattern

Current pattern:

```ts
import { mockApplications } from '@/data/mock/applications'
```

Then pages/components filter, map, reduce, or find records directly.

Examples:

- Student dashboard filters applications and recommendations in the page.
- Provider dashboard filters active scholarships and pending shortlists in the page.
- Staff application pages filter document states and audit events in the page.
- Admin export maps mock data directly into CSV/JSON rows inside the page.

## Current Helper Functions In Mock Data

Some mock files already include lookup/helper functions:

- `studentApplicationData.ts` has student application and scholarship helper functions.
- `studentMatchingData.ts` has recommendation and scholarship matching helper functions.
- `providerData.ts` has provider scholarship/candidate/criteria/pool lookup helpers.

These are useful stepping stones, but they are still mock-data modules, not service boundaries.

## Future Service Boundary Candidates

| Service candidate | First responsibilities | Later responsibilities |
|---|---|---|
| `studentService` | Own profile display selectors, completeness selectors | Profile update, consent, ownership checks |
| `studentApplicationService` | Application lookup, status grouping, document readiness | Submit/edit/document API calls |
| `scholarshipService` | Public scholarship lookup/filtering | Provider ownership, publication rules |
| `matchingService` | Role-safe score and fit breakdown selectors | Real matching API/data integration |
| `providerService` | Provider dashboard/portfolio selectors | Provider ownership checks |
| `providerCandidateService` | Anonymous candidate DTOs and pool stats | Candidate privacy enforcement |
| `shortlistService` | Reason-required request validation | Staff approval workflow integration |
| `staffReviewService` | Staff application review selectors | Status updates and review audit events |
| `disclosureService` | Disclosure request selectors and reason validation | Staff approval/rejection persistence |
| `adminAuditService` | Audit log selectors and filter config | Immutable audit store |
| `exportService` | Export field allowlists and format helpers | Export audit, permission checks |
| `privacyService` | Masking/tokenization utilities | Field-level role policy and tests |
| `authAccessService` | Route/action permission helpers | Server middleware/session integration |

## Recommended Migration Pattern

Do not replace all mock imports at once.

Safe pattern:

1. Create a pure service selector that reads existing mock data.
2. Use it in one route.
3. Verify UI output remains unchanged.
4. Add route smoke check or snapshot/manual QA.
5. Repeat gradually.

Example future path:

`page.tsx -> providerCandidateService.getCandidatePool(scholarshipId) -> providerData mock helpers -> components`

Later, the service can swap mock helpers for an API/database client without rewriting every page.

## Privacy-Sensitive Data Access Notes

- Provider data is currently safest because `providerData.ts` uses token-only candidates and banded fields.
- Staff data is the most sensitive because it includes disclosure requests, document review, and identity reveal flows.
- Admin export is the highest export risk because it maps user emails and student IDs directly into downloadable files.
- Student data should remain self-scoped when real auth exists.

