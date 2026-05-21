# S²IMS Controlled Demo Route Walkthrough Checklist

**⚠️ DRY RUN USE ONLY — For facilitator rehearsal and pre-demo verification.**  
**No demo session has occurred as of 2026-05-21.**  
**Completing this checklist does NOT constitute a demo session or sign-off.**

---

## How to Use

1. Before a dry run or actual demo, copy this file
2. Run through each route and mark Pass ☑ or Fail ☐
3. Note any issues in the Notes column
4. Do not proceed to a real stakeholder demo until all routes pass

---

## Route Checklist

### Route 1: Login Page

| Field | Value |
|-------|-------|
| **Route** | `/login` |
| **Expected Role** | Any (pre-authentication) |
| **URL** | `http://localhost:3000/login` |
| **Screenshot Ref** | `docs/screenshots/mc68-role-based-user-manual/mc68-001-login.png` |
| **What to Show** | Login form with email + password fields, Sign In button |
| **Safety Note** | Do NOT enter real credentials. Use synthetic demo account only. |
| **Expected Behavior** | Form renders correctly; Sign In button active; redirect to dashboard on success |
| **Forbidden Behavior** | Real credential entry; leaving credentials visible |
| **Pass/Fail** | ☐ Pass  ☐ Fail |
| **Notes** | |

---

### Route 2: Admin Dashboard

| Field | Value |
|-------|-------|
| **Route** | `/admin/dashboard` |
| **Expected Role** | Admin |
| **URL** | `http://localhost:3000/admin/dashboard` |
| **Screenshot Ref** | `docs/screenshots/mc68-role-based-user-manual/mc68-002-admin-dashboard.png` |
| **What to Show** | System-wide metric cards, sidebar navigation, role badge showing "Admin" |
| **Safety Note** | Read-only view; do not submit any forms |
| **Expected Behavior** | Dashboard loads with synthetic metrics; sidebar shows Admin navigation items |
| **Forbidden Behavior** | Clicking any "import" or "confirm" action; editing any values |
| **Pass/Fail** | ☐ Pass  ☐ Fail |
| **Notes** | |

---

### Route 3: Admin Audit Log

| Field | Value |
|-------|-------|
| **Route** | `/admin/audit-log` |
| **Expected Role** | Admin |
| **URL** | `http://localhost:3000/admin/audit-log` |
| **Screenshot Ref** | `docs/screenshots/mc68-role-based-user-manual/mc68-003-admin-audit-log.png` |
| **What to Show** | Table of synthetic audit events; event type, timestamp, actor, description columns |
| **Safety Note** | In-memory only — these events are not persisted to a real database |
| **Expected Behavior** | Audit table renders; synthetic events visible; pagination works |
| **Forbidden Behavior** | Implying events are persisted to a production DB; clicking any modify/delete action |
| **Pass/Fail** | ☐ Pass  ☐ Fail |
| **Notes** | |

---

### Route 4: Admin Candidate Review Demo

| Field | Value |
|-------|-------|
| **Route** | `/admin/candidate-review-demo` |
| **Expected Role** | Admin |
| **URL** | `http://localhost:3000/admin/candidate-review-demo` |
| **Screenshot Ref** | `docs/screenshots/mc68-role-based-user-manual/mc68-004-admin-candidate-review.png` |
| **What to Show** | Preview of candidate review interface; candidate list with status; detail view |
| **Safety Note** | ⚠️ AP-11 BLOCKED. Approve and Reject buttons are intentionally disabled. |
| **Expected Behavior** | Candidate list renders; detail view opens; buttons are visually present but non-functional |
| **Forbidden Behavior** | ❌ DO NOT CLICK Approve · ❌ DO NOT CLICK Reject · Do not imply workflow is active |
| **Pass/Fail** | ☐ Pass  ☐ Fail |
| **Notes** | |

---

### Route 5: Admin Master Data Import Preview

| Field | Value |
|-------|-------|
| **Route** | `/admin/master-data/import-preview` |
| **Expected Role** | Admin |
| **URL** | `http://localhost:3000/admin/master-data/import-preview` |
| **Screenshot Ref** | `docs/screenshots/mc68-role-based-user-manual/mc68-005-admin-master-data.png` |
| **What to Show** | Import preview table with synthetic data rows; preview-only banner |
| **Safety Note** | ⚠️ AP-10B BLOCKED. Confirm Import is intentionally disabled/no-op. |
| **Expected Behavior** | Preview table loads with synthetic rows; any Confirm Import button is disabled or absent |
| **Forbidden Behavior** | ❌ DO NOT CLICK Confirm Import · Do not imply data will be written · Do not call this a real import |
| **Pass/Fail** | ☐ Pass  ☐ Fail |
| **Notes** | |

---

### Route 6: Staff Dashboard

| Field | Value |
|-------|-------|
| **Route** | `/staff/dashboard` |
| **Expected Role** | Scholarship Staff |
| **URL** | `http://localhost:3000/staff/dashboard` |
| **Screenshot Ref** | `docs/screenshots/mc68-role-based-user-manual/mc68-006-staff-dashboard.png` |
| **What to Show** | Staff-specific summary: pending applications count, recent activity, navigation to applications |
| **Safety Note** | Log in as Staff synthetic account; do not use Admin session for this screen |
| **Expected Behavior** | Dashboard loads with staff-scoped data; sidebar shows Staff navigation items |
| **Forbidden Behavior** | Using Admin account to access staff-only views; modifying any data |
| **Pass/Fail** | ☐ Pass  ☐ Fail |
| **Notes** | |

---

### Route 7: Staff Applications List

| Field | Value |
|-------|-------|
| **Route** | `/staff/applications` |
| **Expected Role** | Scholarship Staff |
| **URL** | `http://localhost:3000/staff/applications` |
| **Screenshot Ref** | `docs/screenshots/mc68-role-based-user-manual/mc68-007-staff-applications.png` |
| **What to Show** | Paginated list of synthetic applications; status badges (StatusBadge component); search/filter bar |
| **Safety Note** | All applications are synthetic — do not modify any |
| **Expected Behavior** | Application list renders; filters work; pagination active; status badges colour-coded |
| **Forbidden Behavior** | Submitting filter/search with real student names or IDs; modifying any application status |
| **Pass/Fail** | ☐ Pass  ☐ Fail |
| **Notes** | |

---

### Route 8: Staff Application Detail — app_001

| Field | Value |
|-------|-------|
| **Route** | `/staff/applications/app_001` |
| **Expected Role** | Scholarship Staff |
| **URL** | `http://localhost:3000/staff/applications/app_001` |
| **Screenshot Ref** | `docs/screenshots/mc68-role-based-user-manual/mc68-008-staff-application-detail.png` |
| **What to Show** | Full detail view: applicant info (synthetic), scholarship, status, timeline, documents |
| **Safety Note** | Synthetic data only; PII fields are masked per role rules |
| **Expected Behavior** | Detail view loads; all fields populated with synthetic data; status badge visible |
| **Forbidden Behavior** | Editing any field; submitting any action button that writes data |
| **Pass/Fail** | ☐ Pass  ☐ Fail |
| **Notes** | |

---

### Route 9: Staff Application Detail — app_002

| Field | Value |
|-------|-------|
| **Route** | `/staff/applications/app_002` |
| **Expected Role** | Scholarship Staff |
| **URL** | `http://localhost:3000/staff/applications/app_002` |
| **Screenshot Ref** | `docs/screenshots/mc68-role-based-user-manual/mc68-008-staff-application-detail.png` |
| **What to Show** | Second example application — demonstrate a different status state than app_001 |
| **Safety Note** | Synthetic data only |
| **Expected Behavior** | Detail view loads; status differs from app_001 (demonstrates multiple states) |
| **Forbidden Behavior** | Editing any field; modifying status |
| **Pass/Fail** | ☐ Pass  ☐ Fail |
| **Notes** | |

---

### Route 10: Provider Dashboard (Optional / Time Permitting)

| Field | Value |
|-------|-------|
| **Route** | `/provider/dashboard` |
| **Expected Role** | Provider |
| **URL** | `http://localhost:3000/provider/dashboard` |
| **Screenshot Ref** | `docs/screenshots/mc68-role-based-user-manual/mc68-009-provider-dashboard.png` |
| **What to Show** | Provider-facing view: scholarship listings they manage, outcome summaries |
| **Safety Note** | Log in as Provider synthetic account; no editing |
| **Expected Behavior** | Provider dashboard loads with synthetic scholarship data |
| **Forbidden Behavior** | Creating or modifying scholarships; submitting Provider forms |
| **Pass/Fail** | ☐ Pass  ☐ Fail (optional) |
| **Notes** | Optional — show only if time permits |

---

### Route 11: Student Applications (Optional / Time Permitting)

| Field | Value |
|-------|-------|
| **Route** | `/student/applications` |
| **Expected Role** | Student |
| **URL** | `http://localhost:3000/student/applications` |
| **Screenshot Ref** | `docs/screenshots/mc68-role-based-user-manual/mc68-011-student-applications.png` |
| **What to Show** | Student view of their applications and status |
| **Safety Note** | Synthetic student account; no real student data |
| **Expected Behavior** | Student applications list loads; status badges visible |
| **Forbidden Behavior** | Submitting new applications using real data |
| **Pass/Fail** | ☐ Pass  ☐ Fail (optional) |
| **Notes** | Optional |

---

## Overall Dry Run Pass/Fail

| # | Route | Pass/Fail |
|---|-------|-----------|
| 1 | `/login` | ☐ |
| 2 | `/admin/dashboard` | ☐ |
| 3 | `/admin/audit-log` | ☐ |
| 4 | `/admin/candidate-review-demo` | ☐ |
| 5 | `/admin/master-data/import-preview` | ☐ |
| 6 | `/staff/dashboard` | ☐ |
| 7 | `/staff/applications` | ☐ |
| 8 | `/staff/applications/app_001` | ☐ |
| 9 | `/staff/applications/app_002` | ☐ |
| 10 | `/provider/dashboard` (optional) | ☐ |
| 11 | `/student/applications` (optional) | ☐ |

**Mandatory routes passed (1–9)**: ☐ All pass — Ready for stakeholder demo  
**Any failure**: ☐ Resolve issues before scheduling real session

---

## Governance Gate Confirmation (Check Before Any Real Demo)

| Gate | Status | Confirmed |
|------|--------|-----------|
| AP-10B (Confirm Import) | 🔒 BLOCKED | ☐ |
| AP-10C (Export Approval) | 🔒 BLOCKED | ☐ |
| AP-11 (Approval Workflows) | 🔒 BLOCKED | ☐ |
| Real data: none in use | ✅ | ☐ |
| Synthetic data loaded | ✅ | ☐ |

---

**Checklist Version**: MC74 (2026-05-21)  
**Use for**: Dry run rehearsal only — not a demo sign-off record
