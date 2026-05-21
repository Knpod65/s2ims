# S²IMS Role-Based Screen Frame Plan — MC72

**Status**: MC72 Design Documentation  
**Date**: 2026-05-21  
**Purpose**: Figma frame-by-frame design plan for all S²IMS role screens

---

## MC72 Scope Statement

Docs-only. No runtime code changes. No page migrations. AP-10B/AP-10C/AP-11 remain locked.

---

## How to Use This Document

For each screen group:
1. Create a Figma frame at 1440×900px (desktop)
2. Use the Frame Name as the Figma frame title
3. Reference the Screenshot for current-state comparison
4. Implement the Layout Structure and Components listed
5. Apply governance notes before handoff

---

## Screen Group 1: Auth / Login

**Frame Name**: `[public] Auth — Login`  
**Route**: `/login`  
**Role**: Public (unauthenticated)  
**Screenshot Reference**: `mc68-001-login-page.png`

**User Goal**: Sign in to access role-appropriate dashboard

**Redesign Objective**: Centered card layout, clean branding, bilingual label, role-selection hint

**Layout Structure**:
- Full-page centered card (480px wide, auto height)
- S²IMS logo + Thai headline at top
- Email/password fields with bilingual labels
- Primary Button "เข้าสู่ระบบ / Sign In"
- Forgot password link below button
- Footer: "ระบบบริหารจัดการทุนการศึกษา S²IMS" + version

**Main Components**:
- `Button` variant=primary size=lg (full width)
- Form inputs with Thai label + English sub-label
- Error state: `StatusBadge` status=error for invalid credentials

**Safety/Governance Notes**: None — public route, no governance gates

**Bilingual Copy**:
- Headline: "เข้าสู่ระบบ" (Sign In)
- Email label: "อีเมล / Email"
- Password label: "รหัสผ่าน / Password"
- Button: "เข้าสู่ระบบ"

**Accessibility Notes**:
- `<form>` with `aria-label="Sign in form"`
- `autocomplete="email"` and `autocomplete="current-password"`
- Error summary announced via `aria-live="polite"`

**What NOT to Imply**: No "Guest access" affordance, no social OAuth

---

## Screen Group 2: Admin Dashboard

**Frame Name**: `[admin] Dashboard — Overview`  
**Route**: `/admin`  
**Role**: Admin  
**Screenshot Reference**: `mc68-002-admin-dashboard.png`

**User Goal**: See system-wide status, recent activity, quick actions

**Redesign Objective**: Metric cards row + recent audit events + quick navigation to key admin functions

**Layout Structure**:
- Sidebar 240px (AdminNav) + Header 64px + Main content area
- Main: 4 metric cards (full-width row, gap-6)
- Below metrics: 2-column grid (recent audit log left, system health right)
- Below grid: recent applications table (5 rows, paginated)

**Main Components**:
- `Button` variant=secondary size=sm for "ดูทั้งหมด" actions
- `StatusBadge` status=success/warning/error for system health
- MetricCard (future) — count + label + optional trend
- DataTable shell (5 rows max on dashboard)
- `RoleBadge` (future) in header showing "ผู้ดูแลระบบ / Admin"

**Safety/Governance Notes**: None on dashboard overview itself

**Bilingual Copy**:
- Metric 1: "ใบสมัครทั้งหมด / Total Applications"
- Metric 2: "รอตรวจสอบ / Pending Review"
- Metric 3: "ทุนที่เปิดรับ / Active Scholarships"
- Metric 4: "ผู้ใช้ที่ลงทะเบียน / Registered Users"

**Accessibility Notes**: Metric cards use `<article>` with `aria-label`

**What NOT to Imply**: No real-time data refresh (demo-safe)

---

## Screen Group 3: Admin Audit Log

**Frame Name**: `[admin] Audit Log — Event History`  
**Route**: `/admin/audit`  
**Role**: Admin  
**Screenshot Reference**: `mc68-003-admin-audit-log.png`

**User Goal**: Review system-wide audit trail for compliance

**Redesign Objective**: Filterable event log table with clear timestamps and actor identification

**Layout Structure**:
- Sidebar + Header
- FilterBar: search + event type filter + date range + role filter
- Full-width DataTable: timestamp | actor | role | event | details
- Pagination: 20 rows per page
- Export button (disabled — AP-10C)

**Main Components**:
- `Button` variant=ghost size=sm for filter actions
- `Button` variant=secondary size=sm disabled for "ส่งออก / Export" (AP-10C)
- `StatusBadge` for event type (create=info, update=warning, delete=error, view=neutral)
- FilterBar (future)
- DataTable shell

**Safety/Governance Notes**:
- Export button must show `DisabledActionHint`: "การส่งออกข้อมูลยังไม่เปิดใช้งาน (AP-10C)"

**Bilingual Copy**:
- Column headers: "เวลา / Time", "ผู้กระทำ / Actor", "บทบาท / Role", "เหตุการณ์ / Event"
- Empty state: "ไม่พบรายการ / No events found"

**Accessibility Notes**: Table with `role="table"`, `aria-sort` on sortable columns

**What NOT to Imply**: No "undo" or "rollback" affordance on audit events

---

## Screen Group 4: Admin Candidate Review Demo

**Frame Name**: `[admin] Candidate Review — Demo`  
**Route**: `/admin/candidate-review-demo`  
**Role**: Admin  
**Screenshot Reference**: `mc68-004-admin-candidate-review.png`

**User Goal**: Preview candidate review workflow (demo mode)

**Redesign Objective**: Candidate cards with match scores, review checklist — all in demo/preview state

**Layout Structure**:
- **SafetyBanner at top** (amber, full width): "หน้าจอตัวอย่างเท่านั้น — ระบบอนุมัติยังไม่เปิดใช้งาน"
- Sidebar + Header
- 3-column candidate card grid
- Each card: photo placeholder, name (masked), match score ring, scholarship name, criteria checklist preview
- Card footer: "อนุมัติ / Approve" + "ปฏิเสธ / Reject" buttons — both DISABLED

**Main Components**:
- SafetyBanner (future) — amber variant
- `Button` variant=primary disabled for "อนุมัติ"
- `Button` variant=danger disabled for "ปฏิเสธ"
- `DisabledActionHint` on both buttons: "ระบบอนุมัติยังไม่เปิดใช้งาน (AP-11)"
- `StatusBadge` status=preview for candidate status
- Match score ring (visual only — no interaction)

**Safety/Governance Notes**:
- AP-11 locked — approve/reject are disabled
- SafetyBanner is non-dismissible
- Student names must be masked: "นักเรียน #ST-XXXX"

**What NOT to Imply**: No active approval workflow, no email notification on action

---

## Screen Group 5: Admin Master Data Import Preview

**Frame Name**: `[admin] Import Preview — Master Data`  
**Route**: `/admin/master-data/import-preview`  
**Role**: Admin  
**Screenshot Reference**: `mc68-005-admin-import-preview.png`

**User Goal**: Preview imported master data before (future) confirmation

**Redesign Objective**: Data preview table with SafetyBanner, no import affordance

**Layout Structure**:
- **SafetyBanner at top**: "หน้าจอตัวอย่างเท่านั้น — การนำเข้าข้อมูลจริงยังไม่เปิดใช้งาน (AP-10B)"
- Sidebar + Header
- Preview statistics row: total rows, new records, updated records, errors
- Full-width DataTable: mock records with status column
- Bottom bar: "นำเข้าข้อมูล / Import" Button (disabled) + "ยกเลิก / Cancel" Button

**Main Components**:
- SafetyBanner — amber variant
- `Button` variant=primary size=md disabled for "นำเข้าข้อมูล"
- `DisabledActionHint`: "การนำเข้าข้อมูลจริงยังไม่เปิดใช้งาน (AP-10B)"
- `Button` variant=secondary for "ยกเลิก"
- `StatusBadge` status=success/warning/error for row validation status

**Safety/Governance Notes**:
- No file upload drag-and-drop affordance (would imply real import)
- Import button disabled with AP-10B notice
- Table shows mock data only — no real file path shown

**What NOT to Imply**: No real CSV upload, no "confirm and process" step

---

## Screen Group 6: Staff Dashboard

**Frame Name**: `[staff] Dashboard — Workflow Overview`  
**Route**: `/staff`  
**Role**: Scholarship Staff  
**Screenshot Reference**: `mc68-006-staff-dashboard.png`

**User Goal**: See daily work queue, pending actions, quick stats

**Redesign Objective**: Queue-first dashboard with urgency indicators

**Layout Structure**:
- Sidebar (StaffNav) + Header
- Top row: 3 metric cards (pending applications, pending OCR corrections, upcoming deadlines)
- Below: 2-column (pending queue left — 5 items, analytics snapshot right)
- Below: Recent activity feed (5 items)

**Main Components**:
- `Button` variant=primary size=sm "จัดการ / Process" on queue items
- `StatusBadge` status=warning for pending items, status=error for overdue
- MetricCard with urgency color coding
- `RoleBadge` staff variant in header

**Bilingual Copy**:
- "รอดำเนินการ / Pending": [count]
- "แก้ไข OCR / OCR Corrections": [count]
- "กำหนดส่ง / Deadlines": [count]

**Accessibility Notes**: Queue list uses `<ul>` with `role="list"`, each item is `<li>`

**What NOT to Imply**: No real-time notification push

---

## Screen Group 7: Staff Applications List

**Frame Name**: `[staff] Applications — All`  
**Route**: `/staff/applications`  
**Role**: Scholarship Staff  
**Screenshot Reference**: `mc68-007-staff-applications-list.png`

**User Goal**: View, filter, and manage all scholarship applications

**Redesign Objective**: Filterable table with batch action capability

**Layout Structure**:
- Sidebar + Header
- PageHeader: "ใบสมัครทั้งหมด" + "นำออก" Button (disabled AP-10C)
- FilterBar: search + status filter + scholarship filter + date range
- Full-width DataTable: checkbox | ID | applicant | scholarship | status | submitted | actions
- Pagination: 20 per page
- Bulk action bar (appears when rows selected): "เปลี่ยนสถานะ" + "ส่งอีเมล"

**Main Components**:
- `Button` variant=secondary disabled for export
- `Button` variant=primary size=sm "ดูรายละเอียด / View" per row
- `StatusBadge` for application status (8 statuses)
- FilterBar (future)
- DataTable with sortable columns

**Bilingual Copy**:
- Columns: "รหัส / ID", "ผู้สมัคร / Applicant", "ทุน / Scholarship", "สถานะ / Status", "วันที่ / Date"

---

## Screen Group 8: Staff Application Detail

**Frame Name**: `[staff] Application — Detail View`  
**Route**: `/staff/applications/[id]`  
**Role**: Scholarship Staff  
**Screenshot Reference**: `mc68-008-staff-application-detail.png`

**User Goal**: Review full application, update status, add notes

**Redesign Objective**: Tabbed detail view with status timeline sidebar

**Layout Structure**:
- Sidebar + Header
- PageHeader: application ID + applicant name (partial mask) + current StatusBadge + action buttons
- 2-column: Main content (left, 2/3) + Status timeline (right, 1/3)
- Main tabs: "ข้อมูลส่วนตัว / Profile", "เอกสาร / Documents", "คะแนน / Score", "บันทึก / Notes"
- Status timeline: vertical list of status history with timestamps

**Main Components**:
- `Button` variant=primary "บันทึกสถานะ / Update Status"
- `Button` variant=secondary "ส่งอีเมล / Send Email"
- `Button` variant=ghost "พิมพ์ / Print"
- `StatusBadge` for current status (large, md size)
- Timeline component (future) — vertical status history

**Privacy Notes**: Student ID card number masked as "X-XXXX-XXXXX-XX-X"

---

## Screen Group 9: Staff Analytics & Data Quality

**Frame Name**: `[staff] Analytics — Application Stats`  
**Route**: `/staff/analytics` + `/staff/data-quality`  
**Role**: Scholarship Staff  
**Screenshot References**: `mc68-015-staff-analytics.png`, `mc68-016-staff-data-quality.png`

**User Goal**: Analyze application pipeline, identify data quality issues

**Redesign Objective**: Chart-driven analytics page with data quality heatmap

**Layout Structure**:
- Sidebar + Header
- Analytics: Tab nav (ภาพรวม / รายงาน / คุณภาพข้อมูล)
- Tab 1 — Overview: 2 charts (application trend + status distribution) + metric row
- Tab 2 — Report: summary table + export button (disabled AP-10C)
- Tab 3 — Data Quality: rule violations heatmap table, error count by field

**Main Components**:
- `Button` variant=secondary disabled for export (AP-10C)
- `StatusBadge` status=error/warning for data quality issues
- Chart placeholders (bar chart, pie/donut) — use placeholder rectangles in Figma

---

## Screen Group 10: Staff OCR & Follow-Up

**Frame Name**: `[staff] OCR Corrections — Queue`  
**Route**: `/staff/ocr-corrections` + `/staff/follow-up`  
**Role**: Scholarship Staff  
**Screenshot References**: `mc68-017-staff-ocr.png`, `mc68-018-staff-followup.png`

**User Goal**: Correct OCR errors in scanned documents, track follow-up actions

**Redesign Objective**: Side-by-side document preview + correction form

**Layout Structure**:
- OCR: 2-column (document image left, correction form right)
- Correction form: field-by-field comparison (OCR-read value vs. corrected value)
- Follow-up: list with status + due date + assignee

**Main Components**:
- `Button` variant=primary "บันทึกการแก้ไข / Save Corrections"
- `Button` variant=secondary "ข้ามรายการนี้ / Skip"
- `StatusBadge` for correction confidence (high=success, medium=warning, low=error)

---

## Screen Group 11: Provider Dashboard

**Frame Name**: `[provider] Dashboard — Scholarship Overview`  
**Route**: `/provider`  
**Role**: Provider  
**Screenshot Reference**: `mc68-009-provider-dashboard.png`

**User Goal**: See all managed scholarships, applicant pipeline, recent activity

**Redesign Objective**: Scholarship health cards + applicant pipeline summary

**Layout Structure**:
- Sidebar (ProviderNav) + Header
- Top: 3 metric cards (active scholarships, total applicants, pending review)
- Below: Scholarship cards grid (2 columns, up to 4 cards) + "ดูทั้งหมด / View All" link
- Below: Recent applications table (5 rows)
- `RoleBadge` provider variant in header

**Bilingual Copy**:
- "ทุนที่ดูแล / Managed Scholarships", "ผู้สมัคร / Applicants", "รอตรวจสอบ / Pending Review"

---

## Screen Group 12: Provider Scholarships

**Frame Name**: `[provider] Scholarships — Manage`  
**Route**: `/provider/scholarships`  
**Role**: Provider  
**Screenshot Reference**: `mc68-010-provider-scholarships.png`

**User Goal**: Manage scholarship listings (CRUD)

**Redesign Objective**: Card grid with inline status + edit/view actions

**Layout Structure**:
- Sidebar + Header
- PageHeader: "ทุนการศึกษา / Scholarships" + "เพิ่มทุน / Add Scholarship" Button
- Filter: status filter + search
- Card grid (3 columns): scholarship name + status badge + deadline + applicant count + actions

**Main Components**:
- `Button` variant=primary "เพิ่มทุน / Add"
- `Button` variant=ghost size=sm "แก้ไข / Edit" per card
- `Button` variant=ghost size=sm "ดู / View" per card
- `StatusBadge` status=success/warning/neutral for scholarship status

---

## Screen Group 13: Provider Candidates & Outcomes

**Frame Name**: `[provider] Candidates — Matched`  
**Routes**: `/provider/candidates`, `/provider/outcomes`  
**Role**: Provider  
**Screenshot References**: `mc68-021-provider-candidates.png`, `mc68-024-provider-outcomes.png`

**User Goal**: View matched candidates, record scholarship outcomes

**Redesign Objective**: Candidate list with match score visualization, outcome recording form

**Layout Structure**:
- Candidates: Table with match score column (visual bar or score badge) + status + action
- Outcomes: Summary cards (awarded, declined, pending) + outcome recording form

**Privacy Notes**: Candidate names shown to Provider (they are the scholarship grantor)

**Main Components**:
- `StatusBadge` for candidate stage
- `Button` variant=primary "บันทึกผล / Record Outcome"

---

## Screen Group 14: Student Applications

**Frame Name**: `[student] Applications — My Journey`  
**Routes**: `/student/applications`, `/student/applications/[id]`  
**Role**: Student  
**Screenshot References**: `mc68-011-student-applications.png`, `mc68-012-student-application-detail.png`

**User Goal**: Track all submitted applications, see status updates

**Redesign Objective**: Personal timeline view — application status cards with progress indicators

**Layout Structure**:
- Sidebar (StudentNav) + Header (shows student's own RoleBadge)
- Top: Active application cards (status-prominent, 1 column mobile, 2 column desktop)
- Each card: scholarship name + status badge (large) + progress bar + key dates + action
- Below: Past applications (collapsed, expandable)

**Main Components**:
- `StatusBadge` size=md (prominent on each card)
- `Button` variant=primary "ดูรายละเอียด / View Details"
- `Button` variant=secondary "ติดต่อเจ้าหน้าที่ / Contact Staff"
- Progress indicator (visual, not interactive)

**Privacy Notes**: Student sees ONLY their own data — no other students visible

---

## Screen Group 15: Public Scholarships

**Frame Name**: `[public] Scholarships — Browse`  
**Routes**: `/scholarships`, `/scholarships/[id]`  
**Role**: Public (unauthenticated)  
**Screenshot References**: `mc68-026-public-scholarships.png`, `mc68-027-public-scholarship-detail.png`

**User Goal**: Discover available scholarships, check eligibility

**Redesign Objective**: Card-based discovery with clear eligibility tags

**Layout Structure**:
- No sidebar — full-width layout with top navbar
- Hero section: "ค้นหาทุนการศึกษา / Find Scholarships" + search bar
- Filter row: field of study + funding level + nationality + deadline
- Card grid (3 columns): scholarship logo placeholder + name + provider + deadline + amount + apply Button
- Detail: Full scholarship description + eligibility + required documents + apply Button

**Main Components**:
- `Button` variant=primary "สมัครเลย / Apply Now"
- `Button` variant=secondary "บันทึก / Save" (requires login)
- `StatusBadge` status=success/warning for deadline urgency

**What NOT to Imply**: "Apply Now" leads to login — not directly to form without auth

---

## Screen Group 16: ESQ Dashboard, History & Review

**Frame Name**: `[esq] Dashboard — Review Queue`  
**Routes**: `/esq`, `/esq/history`, `/esq/review`  
**Role**: ESQ (External Scholarship Qualifier)  
**Screenshot References**: `mc68-013-esq-dashboard.png`, `mc68-014-esq-review.png`, `mc68-030-esq-history.png`

**User Goal**: Review qualification criteria for candidates, record recommendations

**Redesign Objective**: Checklist-based review form + history table

**Layout Structure**:
- Sidebar (ESQNav) + Header
- Dashboard: pending review count + recent items + quick access
- Review: Candidate summary (masked name + ID) + qualification criteria checklist + recommendation radio group + notes field + submit
- History: Filterable table of completed reviews

**Main Components**:
- `Button` variant=primary "ส่งคำแนะนำ / Submit Recommendation"
- `Button` variant=secondary "บันทึกร่าง / Save Draft"
- `StatusBadge` status=success/warning for review status
- Checklist items with checkbox + label + helper text

**Governance Notes**:
- ESQ recommendation is read-only advisory — no binding approval
- No "Approve" or "Reject" language — use "แนะนำ / Recommend" and "ไม่แนะนำ / Not Recommend"
- AP-11 remains locked — this is a pre-qualification step only

---

## Summary Table

| # | Frame Name | Route | Role | Screenshot |
|---|-----------|-------|------|-----------|
| 1 | Auth — Login | `/login` | Public | mc68-001 |
| 2 | Admin Dashboard | `/admin` | Admin | mc68-002 |
| 3 | Admin Audit Log | `/admin/audit` | Admin | mc68-003 |
| 4 | Admin Candidate Review | `/admin/candidate-review-demo` | Admin | mc68-004 |
| 5 | Admin Import Preview | `/admin/master-data/import-preview` | Admin | mc68-005 |
| 6 | Staff Dashboard | `/staff` | Staff | mc68-006 |
| 7 | Staff Applications | `/staff/applications` | Staff | mc68-007 |
| 8 | Staff App Detail | `/staff/applications/[id]` | Staff | mc68-008 |
| 9 | Staff Analytics | `/staff/analytics` + `/staff/data-quality` | Staff | mc68-015, 016 |
| 10 | Staff OCR/Follow-Up | `/staff/ocr-corrections` + `/staff/follow-up` | Staff | mc68-017, 018 |
| 11 | Provider Dashboard | `/provider` | Provider | mc68-009 |
| 12 | Provider Scholarships | `/provider/scholarships` | Provider | mc68-010 |
| 13 | Provider Candidates | `/provider/candidates` + `/provider/outcomes` | Provider | mc68-021, 024 |
| 14 | Student Applications | `/student/applications` + detail | Student | mc68-011, 012 |
| 15 | Public Scholarships | `/scholarships` + detail | Public | mc68-026, 027 |
| 16 | ESQ Review | `/esq` + `/esq/review` + `/esq/history` | ESQ | mc68-013, 014, 030 |

---

**Document Status**: MC72 Design Documentation  
**Last Updated**: 2026-05-21
