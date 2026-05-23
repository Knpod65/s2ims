# S²IMS MC100 Critical Route Verification Matrix

**Date:** 2026-05-23  
**Purpose:** Define the minimum set of routes that must be verified for mock-ready closure.

## Core Route Set (Minimum for MC100)

### Auth / Shell
- `/login` — Role selection, mock login

### Admin
- `/admin/dashboard`
- `/admin/audit-log`
- `/admin/users`
- `/admin/candidate-review-demo`
- `/admin/master-data/import-preview` (AP-10B critical)

### Staff
- `/staff/dashboard`
- `/staff/applications`
- `/staff/applications/app_001`
- `/staff/applications/app_002`

### Provider
- `/provider/dashboard`
- `/provider/scholarships`
- `/provider/scholarships/new`

### Student
- `/student/dashboard`
- `/student/applications`
- `/student/recommendations`
- `/student/notifications`

### ESQ
- `/esq/dashboard`
- `/esq/history`
- `/esq/announcements/ann_001/review` (or actual ID; substitute if different)

### Public
- `/scholarships`
- `/scholarships/[id]` (use a real scholarship ID from mock data if possible)

## Verification Columns
- Route
- Primary Role
- Expected HTTP (200 or redirect)
- Last Major Touch (MCxx)
- Key Safety Rule
- Screenshot Required (Yes/No)
- Result (Pass/Fail/Notes)
- Notes

## Substitution Rule
If a route ID differs (e.g., no `ann_001`), use the first available mock ID and document the substitution in the final closure report.

This matrix will be populated during PHASE 5 route smoke and PHASE 7 governance checks.
