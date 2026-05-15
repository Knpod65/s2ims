# Audit Admin Comparison Debug Panel Stage 3 QA Checklist AP-9G

## A. Docs-Only Safety

- [ ] No `src/*` changes.
- [ ] No `scripts/*` changes.
- [ ] No `package.json` changes.
- [ ] No backend/API changes.
- [ ] No database migrations.
- [ ] No mock fixture mutation.
- [ ] Stage 3 runtime not started.
- [ ] AP-10 not started.

## B. Staging-Only Scope

- [ ] Stage 3 is documented as staging-only.
- [ ] No production enablement.
- [ ] Internal reviewers only.
- [ ] Admin reviewers only.
- [ ] Flags disabled after review.

## C. Admin-Only Visibility

- [ ] Admin role required.
- [ ] Admin debug panel flag required.
- [ ] Read comparison flag required.
- [ ] Master comparison flag required.
- [ ] Staging/internal gate required.

## D. Non-Admin No-DOM-Trace

- [ ] Staff receives no DOM trace.
- [ ] Student receives no DOM trace.
- [ ] Provider receives no DOM trace.
- [ ] ESQ receives no DOM trace.
- [ ] Unauthenticated users receive no comparison output.

## E. Feature Flag Safety

- [ ] All flags default false.
- [ ] Any false gate hides the panel or shows only approved Admin disabled shell.
- [ ] Rollback by disabling flags is documented.
- [ ] Feature state labels are safe.

## F. Privacy and PII

- [ ] No actorId.
- [ ] No targetId.
- [ ] No raw student ID.
- [ ] No national ID.
- [ ] No email.
- [ ] No phone.
- [ ] No bank account.
- [ ] No raw IP.
- [ ] No file name or file path.
- [ ] No OCR text.
- [ ] No reason text.
- [ ] No metadata values.
- [ ] No raw route params.
- [ ] No sourceEventId or prototypeEventId.
- [ ] No uploaded document identifiers.
- [ ] No unmasked names.
- [ ] No PII exposure.

## G. Safe Metrics Display

- [ ] Status labels only.
- [ ] sourceCount only.
- [ ] prototypeCount only.
- [ ] mismatchCount only.
- [ ] mismatch category only.
- [ ] mismatch dimension only.
- [ ] safeMessage only.
- [ ] aggregate health indicator only.
- [ ] feature flag state labels only.

## H. Export and Copy Restrictions

- [ ] No route added.
- [ ] No navigation added.
- [ ] No export behavior changed.
- [ ] No CSV includes comparison data.
- [ ] No clipboard copy of row-level comparison data.
- [ ] No screenshot with PII.
- [ ] No external notes with row-level data.

## I. Admin Audit Log Source-of-Truth Preservation

- [ ] Admin Audit Log table behavior unchanged.
- [ ] Drawer behavior unchanged.
- [ ] Filter behavior unchanged.
- [ ] Export behavior unchanged.
- [ ] `sharedMockWriter` preserved.
- [ ] `adminAuditDisplayAdapter` preserved.
- [ ] `AuditDisplayPresenter` preserved.
- [ ] Prototype reads not official.

## J. Observability and Logging

- [ ] Metrics are aggregate-only.
- [ ] Logs are aggregate-only.
- [ ] Console output excludes PII.
- [ ] Failure categories are safe enum labels.
- [ ] Reviewer diagnostics exclude PII.

## K. Rollback Readiness

- [ ] Rollback triggers documented.
- [ ] Rollback actions documented.
- [ ] Flags can be disabled.
- [ ] Panel hidden after rollback.
- [ ] In-memory metrics clear path documented.
- [ ] Post-rollback validation documented.

## L. Validation

- [ ] `npm run build` passes 40/40.
- [ ] `npm run check:tokens` passes 4/4.
- [ ] `npm run check:audit-events` passes current approved total.
- [ ] `/login` returns 200 OK.
- [ ] `/admin/audit-log` returns 200 OK.
- [ ] `/admin/dashboard` returns 200 OK.
- [ ] `/staff/applications/app_001` returns 200 OK.
- [ ] `/staff/applications/app_002` returns 200 OK.
- [ ] Dev log clean.

## M. Final Approval Checklist

- [ ] Docs-only scope confirmed.
- [ ] Privacy review passed.
- [ ] Access control review passed.
- [ ] Staging review plan approved.
- [ ] Rollout/rollback plan approved.
- [ ] No Staff callback changes.
- [ ] No notification behavior changes.
- [ ] No real persistence.
- [ ] No AP-10.
- [ ] Explicit approval required before Stage 3 runtime.
