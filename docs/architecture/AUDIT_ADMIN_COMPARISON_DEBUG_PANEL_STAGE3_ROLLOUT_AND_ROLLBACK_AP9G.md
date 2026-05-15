# Audit Admin Comparison Debug Panel Stage 3 Rollout and Rollback AP-9G

## 1. Purpose

This document defines the rollout and rollback plan for a future AP-9G Stage 3 staging-only review.

## 2. Stage 3 Prerequisites

- Stage 2 post-merge QA passed.
- Stage 3 plan reviewed.
- Stage 3 QA checklist reviewed.
- Privacy review completed.
- Staging-only environment available.
- Admin reviewer assigned.
- Rollback owner assigned.
- No AP-10 or real persistence work in scope.

## 3. Rollout Sequence

1. Confirm Stage 2 post-merge QA passed.
2. Enable staging-only flag set.
3. Confirm Admin-only visibility.
4. Confirm non-admin no DOM trace.
5. Confirm panel shows safe aggregate metrics only.
6. Confirm no export.
7. Confirm Admin Audit Log table unchanged.
8. Run validation.
9. Collect aggregate-only reviewer notes.
10. Disable flags after review.

## 4. Allowed Environments

Allowed:

- staging
- internal review environment
- local development for implementation testing only

Forbidden:

- production default enablement
- public environments
- non-admin sessions

## 5. Feature Flag Sequence

All flags default false.

Future Stage 3 enablement order:

1. Confirm environment is staging/internal.
2. Enable master comparison feature gate.
3. Enable read comparison gate.
4. Enable admin debug panel gate.
5. Confirm Admin role.
6. Confirm panel visible only for Admin.

Rollback reverses all flags to false.

## 6. Staging Review Procedure

- Open `/admin/audit-log` as Admin.
- Confirm official table remains unchanged.
- Confirm panel is visibly debug-only.
- Confirm aggregate metrics only.
- Confirm no row-level event data.
- Confirm no export or CSV/download.
- Confirm non-admin no DOM trace in a separate session.
- Record aggregate-only notes.
- Disable flags.

## 7. Rollback Triggers

- any PII in panel
- any non-admin DOM trace
- prototype data appears official
- export includes comparison data
- Admin table behavior changes
- route/nav regression
- build/check failure
- reviewer confusion
- dev log errors

## 8. Rollback Actions

- disable all AP-9G debug flags
- disable read comparison flags
- confirm panel hidden
- clear in-memory comparison metrics if needed
- validate 137/137 checks
- route smoke 5 routes
- confirm Admin Audit Log unchanged
- document incident if PII or unauthorized access occurred

## 9. Post-Rollback Verification

- Build passes 40/40.
- Token checks pass 4/4.
- Audit/notification checks pass 137/137 or the current approved total.
- `/login` returns 200 OK.
- `/admin/audit-log` returns 200 OK.
- `/admin/dashboard` returns 200 OK.
- `/staff/applications/app_001` returns 200 OK.
- `/staff/applications/app_002` returns 200 OK.
- Dev log is clean.
- Panel hidden for Admin and non-admin when flags are false.

## 10. Exit Criteria

Stage 3 review may close when:

- reviewer notes are aggregate-only
- no PII exposure occurred
- Admin-only visibility passed
- non-admin no DOM trace passed
- Admin Audit Log table, drawer, filters, and export remained unchanged
- rollback was verified
- validation passed

## 11. QA Checklist

- [ ] Stage 2 post-merge QA confirmed.
- [ ] Staging-only environment confirmed.
- [ ] Feature flags default false.
- [ ] Admin-only visibility confirmed.
- [ ] Non-admin no DOM trace confirmed.
- [ ] Safe aggregate metrics only.
- [ ] No export path.
- [ ] Admin Audit Log table unchanged.
- [ ] Rollback triggers reviewed.
- [ ] Rollback actions verified.
- [ ] Post-rollback validation passed.
