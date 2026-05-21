# S²IMS Controlled Demo Dry Run Script

**⚠️ REHEARSAL USE ONLY — This script is for internal facilitator rehearsal.**  
**No real controlled demo session has occurred as of 2026-05-21.**  
**Completing this dry run does NOT constitute a demo session, approval, or sign-off.**

---

## Before You Start

**System state required**:
- S²IMS running at `http://localhost:3000` (or agreed staging URL)
- Browser: Chrome or Firefox, fresh session, no cached data
- Screen sharing active (for actual demo) / solo rehearsal (for dry run)
- This script open in a second window

**Data state**:
- ✅ Synthetic data only — no real student or scholarship data
- ❌ No real PII visible
- ❌ Confirm Import is disabled (button is intentionally inactive)
- ❌ Approve/Reject buttons on candidate-review-demo are intentionally inactive

---

## Opening Script (Read Aloud / Internal Rehearsal)

> "Welcome. Today we will walk through the S²IMS Scholarship and Student Information Management System. This is a demonstration of the current system in its preview state. All data shown is synthetic — it has been generated for demonstration purposes only and does not represent any real student, provider, or scholarship.
>
> This system is currently operating in preview mode. Real data import, persistence, and approval workflows have not yet been activated. We will show you what the system can do and what it is being prepared to do. We will not perform any production actions today.
>
> If at any point something unexpected appears on screen, I will pause the demonstration."

---

## Synthetic Data Disclaimer (State Before Each Role Section)

> "All names, ID numbers, scholarship titles, and application data visible in this demonstration are synthetic. This data was created for demonstration purposes and does not correspond to any real person or organization."

---

## Screen-by-Screen Walkthrough

---

### Screen 1: Login Page

**Route**: `/login`  
**Role**: Any  
**Duration**: ~1 minute

**Say**:
> "This is the S²IMS login page. The system supports six role types: Admin, Scholarship Staff, Provider, Student, ESQ Reviewer, and Public. Each role sees a different set of screens and has different permissions."

**Do**:
- Show the login form
- Enter the Admin test credentials (use synthetic demo account)
- Click "Sign In"

**Do NOT**:
- Log in with real credentials
- Leave real credential values visible on screen

**Expected**: Redirect to Admin Dashboard  
**Stop condition**: If login fails, check dev server status before proceeding

---

### Screen 2: Admin Dashboard

**Route**: `/admin/dashboard`  
**Role**: Admin  
**Duration**: ~2–3 minutes

**Say**:
> "This is the Admin dashboard. The Admin role has the highest system visibility. They can see system-wide metrics, access the audit log, review candidate applications in a preview mode, and manage master data."

**Do**:
- Show the dashboard summary cards / metric counts
- Point out the navigation sidebar

**Do NOT**:
- Click any import or confirm action
- Enter any data

**Expected**: Dashboard with metric cards and sidebar navigation  
**Screenshot reference**: `docs/screenshots/mc68-role-based-user-manual/mc68-002-admin-dashboard.png`

---

### Screen 3: Admin Audit Log

**Route**: `/admin/audit-log`  
**Role**: Admin  
**Duration**: ~2 minutes

**Say**:
> "The audit log records all system actions. In the current preview state, audit events are recorded in memory only — they are not persisted to a production database. This view demonstrates the audit trail that will be maintained once real persistence is enabled."

**Do**:
- Show the audit log table
- Show a few example event rows (synthetic)
- Point out event type, timestamp, and actor columns

**Do NOT**:
- Click any row actions that imply data modification
- Navigate to any external link

**Expected**: Paginated audit event table  
**Screenshot reference**: `docs/screenshots/mc68-role-based-user-manual/mc68-003-admin-audit-log.png`

---

### Screen 4: Admin Candidate Review Demo

**Route**: `/admin/candidate-review-demo`  
**Role**: Admin  
**Duration**: ~2–3 minutes

**⚠️ GOVERNANCE BOUNDARY**: This screen is a preview of a future workflow. The Approve and Reject actions are intentionally disabled. AP-11 (Approval Workflows) is blocked.

**Say**:
> "This screen shows a preview of the candidate review workflow. In the future, approved governance owners will be able to activate the review and approval process. Today, the interface is shown in its current design state — the Approve and Reject buttons are intentionally inactive to prevent any accidental data writes."

**Do**:
- Show the candidate list
- Open one candidate detail view
- Point out the layout, data fields, and status indicators

**Do NOT**:
- ❌ **DO NOT click Approve or Reject** — buttons are intentionally disabled
- ❌ Do not imply these actions are available in production

**Expected**: Candidate list and detail view; Approve/Reject visually present but non-functional  
**Screenshot reference**: `docs/screenshots/mc68-role-based-user-manual/mc68-004-admin-candidate-review.png`

---

### Screen 5: Admin Master Data Import Preview

**Route**: `/admin/master-data/import-preview`  
**Role**: Admin  
**Duration**: ~2–3 minutes

**⚠️ GOVERNANCE BOUNDARY**: This is the most sensitive screen in the demonstration. AP-10B (Confirm Import) is BLOCKED. The Confirm Import button is intentionally disabled/no-op.

**Say**:
> "This screen shows the master data import preview. It allows an Admin to preview what data would be imported before committing it to the system. This is the AP-10B workflow — the Confirm Import step. This step has not yet been enabled. The system shows the preview of what a real import would look like, but the Confirm Import action is intentionally inactive. Real data import requires governance approval that has not yet been granted."

**Do**:
- Show the import preview table with synthetic data rows
- Point out the preview-only banner or notice
- Explain the two-step process (preview → confirm)

**Do NOT**:
- ❌ **DO NOT click Confirm Import** — this action is intentionally disabled
- ❌ Do not imply that import is enabled
- ❌ Do not scroll to or highlight any "confirm" button

**Expected**: Import preview table with synthetic rows; Confirm Import button disabled or absent  
**Screenshot reference**: `docs/screenshots/mc68-role-based-user-manual/mc68-005-admin-master-data.png`

---

### Screen 6: Staff Dashboard

**Route**: `/staff/dashboard`  
**Role**: Scholarship Staff  
**Duration**: ~1–2 minutes

**Say**:
> "This is the Scholarship Staff dashboard. Staff can view and manage scholarship applications, perform data quality checks, and coordinate with OCR and follow-up workflows."

**Do**:
- Log in as Staff test account (or demonstrate role switching if available)
- Show the Staff dashboard summary

**Do NOT**:
- Modify any application data
- Approve or reject any applications

**Expected**: Staff dashboard with application summary  
**Screenshot reference**: `docs/screenshots/mc68-role-based-user-manual/mc68-006-staff-dashboard.png`

---

### Screen 7: Staff Applications List

**Route**: `/staff/applications`  
**Role**: Scholarship Staff  
**Duration**: ~2 minutes

**Say**:
> "The applications list shows all scholarship applications that Staff can view. Applications can be filtered and searched. Each application has a status indicator showing where it is in the workflow."

**Do**:
- Show the applications list with status badges
- Point out search/filter controls

**Do NOT**:
- Modify any status values
- Submit any form inputs

**Expected**: Paginated applications list with status badges  
**Screenshot reference**: `docs/screenshots/mc68-role-based-user-manual/mc68-007-staff-applications.png`

---

### Screen 8: Staff Application Detail (app_001)

**Route**: `/staff/applications/app_001`  
**Role**: Scholarship Staff  
**Duration**: ~2 minutes

**Say**:
> "This is an individual application detail view. Staff can see all fields submitted by the student, the current review status, and any notes. In the current preview state, data shown here is synthetic."

**Do**:
- Show application field values (synthetic)
- Point out status, timeline, and any documents

**Do NOT**:
- Edit any field values
- Submit any form

**Expected**: Application detail with synthetic data  
**Screenshot reference**: `docs/screenshots/mc68-role-based-user-manual/mc68-008-staff-application-detail.png`

---

### Screen 9: Staff Application Detail (app_002)

**Route**: `/staff/applications/app_002`  
**Role**: Scholarship Staff  
**Duration**: ~1 minute

**Say**:
> "Here is a second application example showing a different status state — this helps illustrate how the system handles multiple stages of the application lifecycle."

**Do**:
- Navigate to app_002
- Point out the status difference vs app_001

**Do NOT**:
- Modify any data

**Expected**: Second application detail with different status

---

## Transition Script (Between Role Sections)

> "I'll now log out and demonstrate the system from the perspective of [next role]."

---

## Stop Conditions

Stop the dry run immediately if any of the following occur:

| Condition | Action |
|-----------|--------|
| Browser shows an unhandled error page | Stop, note the error, do not proceed |
| Data that appears to be real PII is visible | Stop immediately, close browser, report |
| An unexpected form submission or confirmation dialog appears | Stop, do NOT confirm, close the dialog |
| Network request fails and synthetic data is missing | Stop, reload, retry once |
| Any governance-blocked button appears clickable | Stop, do NOT click, report to developer |

---

## Closing Script (Read Aloud / Internal Rehearsal)

> "That concludes our walkthrough of the S²IMS system. We have demonstrated the Admin and Scholarship Staff roles in preview mode. The system also supports Provider, Student, ESQ Reviewer, and Public roles, which follow similar patterns.
>
> To summarize what we showed today: the dashboard views, application management workflows, audit logging, and import preview screens — all in their current synthetic/preview state.
>
> To summarize what was NOT shown or activated: real data import (AP-10B is not yet enabled), approval workflows (AP-11 is not yet enabled), and export approval (AP-10C is not yet enabled).
>
> Next steps will be determined based on your feedback. Thank you."

---

## Post Dry Run Reminders

- ✅ This dry run was internal rehearsal — it is NOT a recorded demo session
- ✅ No stakeholders attended this dry run
- ✅ No feedback was collected during this dry run
- ✅ No approvals were given or implied
- ✅ AP-10B, AP-10C, AP-11 remain blocked
- ✅ Fill in the Demo Execution Report (`S2IMS_CONTROLLED_DEMO_EXECUTION_REPORT_TEMPLATE_MC73.md`) only after a real stakeholder session

---

**Script Version**: MC74 (2026-05-21)  
**Use for**: Internal facilitator rehearsal only  
**Not for**: Actual stakeholder sessions, approval processes, or sign-off
