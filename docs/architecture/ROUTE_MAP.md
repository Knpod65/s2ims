# S2IMS Route Map

## Purpose

This document records the current App Router surface before architecture renovation. It is a map of the app as it exists now, not a proposal to change routes.

Current routing model:

`URL -> src/app route -> page.tsx -> AppShell requiredRole when protected -> mock data import -> React render`

There is no `middleware.ts` and no API route layer currently detected. Role protection is handled by `AppShell` on the client using mock auth state from `localStorage`.

## Public Routes

| Route | Page file | Dynamic params | Role access expectation | Current data sources | Risk notes |
|---|---|---|---|---|---|
| `/` | `src/app/page.tsx` | None | Public | `mockScholarships`, `useAuth` | Public page uses mock auth context for dashboard/login routing. Low risk. |
| `/login` | `src/app/login/page.tsx` | None | Public | `useAuth`, `ROLE_META` local list | Mock role login writes to `localStorage`. Not production auth. |
| `/scholarships` | `src/app/scholarships/page.tsx` | None | Public | `mockScholarships`, `useAuth` | Public scholarship list also supports saved UI state locally. |
| `/scholarships/[id]` | `src/app/scholarships/[id]/page.tsx` | `id` | Public, student CTA when logged in | `mockScholarships`, `useAuth` | Dynamic param uses generic `id`. Public detail can link into student application flow. |

## Student Routes

| Route | Page file | Dynamic params | Role access expectation | Current data sources | Risk notes |
|---|---|---|---|---|---|
| `/student/dashboard` | `src/app/student/dashboard/page.tsx` | None | Student only | `mockApplications`, `mockNotifications`, `studentMatchingData`, `useAuth` | Mixes dashboard aggregation and presentation in page. |
| `/student/profile` | `src/app/student/profile/page.tsx` | None | Student only | `useAuth`, `studentMatchingData` | Displays own identity fields. OK for student self-view, but should remain self-only. |
| `/student/profile/completion` | `src/app/student/profile/completion/page.tsx` | None | Student only | `studentMatchingData` | Missing-data guidance should stay supportive and privacy-aware. |
| `/student/profile/improve` | `src/app/student/profile/improve/page.tsx` | None | Student only | `studentMatchingData` | Improvement prompts are current UI logic. Candidate for service/copy centralization. |
| `/student/recommendations` | `src/app/student/recommendations/page.tsx` | None | Student only | `studentMatchingData` | Matching explanation must avoid raw internal scoring leakage. |
| `/student/recommendations/explanation` | `src/app/student/recommendations/explanation/page.tsx` | None | Student only | `studentMatchingData` | General matching explanation. Privacy copy should remain visible. |
| `/student/recommendations/[scholarshipId]/explanation` | `src/app/student/recommendations/[scholarshipId]/explanation/page.tsx` | `scholarshipId` | Student only | `studentMatchingData` | Scholarship-specific explanation. Keep student-only. |
| `/student/scholarships/[scholarshipId]` | `src/app/student/scholarships/[scholarshipId]/page.tsx` | `scholarshipId` | Student only | `studentApplicationData`, `studentMatchingData` | Reuses student documents and matching data. |
| `/student/scholarships/[scholarshipId]/apply` | `src/app/student/scholarships/[scholarshipId]/apply/page.tsx` | `scholarshipId` | Student only | `studentApplicationData`, `studentMatchingData` | Mock application start. No real submission. |
| `/student/applications` | `src/app/student/applications/page.tsx` | None | Student only | `studentApplicationData`, `studentMatchingData` | Tracker is self-view. Future service should enforce ownership. |
| `/student/applications/new` | `src/app/student/applications/new/page.tsx` | Query `scholarship` | Student only | `mockScholarships`, `mockUsers`, `useAuth` | Large page and older application flow. Candidate for later consolidation. |
| `/student/applications/[applicationId]` | `src/app/student/applications/[applicationId]/page.tsx` | `applicationId` | Student only | `studentApplicationData`, `studentMatchingData` | Future access must check application owner. |
| `/student/applications/[applicationId]/edit` | `src/app/student/applications/[applicationId]/edit/page.tsx` | `applicationId` | Student only | `studentApplicationData`, `studentMatchingData` | Inline edit state and mock validation. Candidate for validation schema. |
| `/student/applications/[applicationId]/documents` | `src/app/student/applications/[applicationId]/documents/page.tsx` | `applicationId` | Student only | `studentApplicationData`, `studentMatchingData` | Mock upload only. Future file handling must be separate. |
| `/student/notifications` | `src/app/student/notifications/page.tsx` | None | Student only | `mockNotifications` | Local read/unread state only. Future notification service needed. |
| `/student/follow-up` | `src/app/student/follow-up/page.tsx` | None | Student only | Local mock state | Mock follow-up report. No backend write. |

## Provider Routes

| Route | Page file | Dynamic params | Role access expectation | Current data sources | Risk notes |
|---|---|---|---|---|---|
| `/provider/dashboard` | `src/app/provider/dashboard/page.tsx` | None | Provider only | `providerData` | Aggregate and token-only posture. Future service should enforce no student identity. |
| `/provider/scholarships` | `src/app/provider/scholarships/page.tsx` | None | Provider only | `providerData` | Search/filter local state. Candidate for provider service selector. |
| `/provider/scholarships/new` | `src/app/provider/scholarships/new/page.tsx` | None | Provider only | Form component state | Mock create flow. No backend write. |
| `/provider/scholarships/[scholarshipId]/edit` | `src/app/provider/scholarships/[scholarshipId]/edit/page.tsx` | `scholarshipId` | Provider only | `providerData` | Future access must verify scholarship belongs to provider. |
| `/provider/scholarships/[scholarshipId]/criteria` | `src/app/provider/scholarships/[scholarshipId]/criteria/page.tsx` | `scholarshipId` | Provider only | `providerData` | Criteria changes are mock-only. Future validation and audit required. |
| `/provider/scholarships/[scholarshipId]/candidates` | `src/app/provider/scholarships/[scholarshipId]/candidates/page.tsx` | `scholarshipId` | Provider only | `providerData` | High privacy importance. Must remain token-only until staff-approved disclosure exists. |
| `/provider/candidates` | `src/app/provider/candidates/page.tsx` | None | Provider only | `providerData` | Pool selector. Must not import student internals. |
| `/provider/impact` | `src/app/provider/impact/page.tsx` | None | Provider only | `providerData` | Aggregate-only metrics. Future reporting service should enforce grouping thresholds. |
| `/provider/insights` | `src/app/provider/insights/page.tsx` | None | Provider only | Local chart constants | Legacy aggregate route. Needs scope alignment with Phase 4 impact route. |
| `/provider/outcomes` | `src/app/provider/outcomes/page.tsx` | None | Provider only | Local constants | Legacy aggregate route. Needs consolidation decision later. |

## Staff Routes

| Route | Page file | Dynamic params | Role access expectation | Current data sources | Risk notes |
|---|---|---|---|---|---|
| `/staff/dashboard` | `src/app/staff/dashboard/page.tsx` | None | Staff only | `staffData` | Operational dashboard with governance queues. |
| `/staff/announcements/new` | `src/app/staff/announcements/new/page.tsx` | None | Staff only | Local form state | Mock creation flow. Future validation and ESQ submission service needed. |
| `/staff/announcements/[id]/preview` | `src/app/staff/announcements/[id]/preview/page.tsx` | `id` | Staff only | `mockAnnouncements` | Dynamic announcement preview. Future permission check needed. |
| `/staff/applications` | `src/app/staff/applications/page.tsx` | None | Staff only | `mockApplications`, `staffData` | Staff can search by student ID. Privacy review needed. |
| `/staff/applications/[id]` | `src/app/staff/applications/[id]/page.tsx` | `id` | Staff only | `mockApplications`, `staffData` | Sensitive route. Shows student ID in title and reveal modal. Requires audit/masking service later. |
| `/staff/students/[id]` | `src/app/staff/students/[id]/page.tsx` | `id` | Staff only | `mockUsers`, `mockApplications` | Says masked but displays student ID/email. High PDPA review priority. |
| `/staff/ocr` | `src/app/staff/ocr/page.tsx` | None | Staff only | Local OCR field constants | Mock OCR. Future document handling and audit required. |
| `/staff/analytics` | `src/app/staff/analytics/page.tsx` | None | Staff only | Local constants | Aggregate analytics. Export function is local. |
| `/staff/follow-up` | `src/app/staff/follow-up/page.tsx` | None | Staff only | Local mock follow-ups | Contains student names and IDs in local constants. Privacy review needed. |
| `/staff/matching-review` | `src/app/staff/matching-review/page.tsx` | None | Staff only | `staffData` | Governance-sensitive matching review. |
| `/staff/matching-review/[matchId]` | `src/app/staff/matching-review/[matchId]/page.tsx` | `matchId` | Staff only | `staffData` | Match override flow. Requires reason/audit consistency. |
| `/staff/disclosure-requests` | `src/app/staff/disclosure-requests/page.tsx` | None | Staff only | `staffData` | Disclosure approval/rejection. High audit and privacy importance. |
| `/staff/data-quality` | `src/app/staff/data-quality/page.tsx` | None | Staff only | `staffData` | Data quality issues can include sensitive implications. |

## ESQ / Executive Routes

| Route | Page file | Dynamic params | Role access expectation | Current data sources | Risk notes |
|---|---|---|---|---|---|
| `/esq/dashboard` | `src/app/esq/dashboard/page.tsx` | None | ESQ only | `mockAnnouncements` | Approval dashboard. Future policy should enforce ESQ-only approval. |
| `/esq/announcements/[id]/review` | `src/app/esq/announcements/[id]/review/page.tsx` | `id` | ESQ only | `mockAnnouncements` | Approval/rejection/revision action is mock. Audit needed later. |
| `/esq/history` | `src/app/esq/history/page.tsx` | None | ESQ only | `mockAnnouncements` | Historical approval list. Low current risk. |

## Admin Routes

| Route | Page file | Dynamic params | Role access expectation | Current data sources | Risk notes |
|---|---|---|---|---|---|
| `/admin/dashboard` | `src/app/admin/dashboard/page.tsx` | None | Admin only | `mockAuditLogs` | System overview. |
| `/admin/users` | `src/app/admin/users/page.tsx` | None | Admin only | `mockUsers` | Displays user names/emails. Admin-only but needs future policy. |
| `/admin/permissions` | `src/app/admin/permissions/page.tsx` | None | Admin only | Local feature matrix | Permission matrix is static UI, not enforcement. |
| `/admin/audit-log` | `src/app/admin/audit-log/page.tsx` | None | Admin only | `mockAuditLogs` | Audit viewer and CSV export. Future immutable audit source needed. |
| `/admin/export` | `src/app/admin/export/page.tsx` | None | Admin only | `mockUsers`, `mockApplications`, `mockScholarships`, `mockAuditLogs` | High risk before production. Exports PII-like fields and student IDs. |
| `/admin/settings` | `src/app/admin/settings/page.tsx` | None | Admin only | Local settings state | Settings are mock-only. Future config boundary needed. |

## Dynamic Route Params

| Param | Routes | Notes |
|---|---|---|
| `[id]` | `/scholarships/[id]`, `/staff/announcements/[id]/preview`, `/staff/applications/[id]`, `/staff/students/[id]`, `/esq/announcements/[id]/review` | Generic and varies by entity. Future route map should document each entity type. |
| `[scholarshipId]` | Student recommendation/scholarship pages, provider scholarship pages | Clearer domain naming. |
| `[applicationId]` | Student application detail/edit/documents | Clearer domain naming. |
| `[matchId]` | Staff matching review detail | Clearer domain naming. |

## Cross-Cutting Route Risks

- Role protection is client-side only.
- Pages import mock data directly.
- No central policy layer currently decides action permissions.
- No central audit writer currently records sensitive actions.
- No central masking service currently controls display of student identity fields.
- Provider Phase 4 routes currently avoid student component imports and use token-only candidate data, but this boundary is not yet enforced by lint/test.

