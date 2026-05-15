# Audit Admin Comparison Debug Panel Stage 3 Plan AP-9G

## 1. Overview

AP-9G Stage 3 plans a staging-only/internal review phase for the Admin Comparison Debug Panel.

This document is documentation-only. It does not implement Stage 3 runtime behavior, does not change feature flags, and does not alter the Admin Audit Log source of truth.

Stage 3 defines how an internal Admin reviewer may safely inspect aggregate audit read comparison status in staging without making prototype reads official and without exposing PII.

## 2. Why Stage 3 Exists

Stage 1 proved the component could exist without rendering. Stage 2 added an Admin-only gated render path that remains disabled by default.

Stage 3 is the planning checkpoint for a future staging-only review. It exists to define the privacy, access, observability, rollout, rollback, and QA boundaries before any visible aggregate comparison review is enabled.

## 3. Current State After Stage 2

- `AdminAuditComparisonDebugPanel` exists on `main`.
- The component does not render by default.
- Non-admin roles receive `null` and no DOM trace.
- `adminDebugPanelEnabled` defaults to `false`.
- Prototype persistence defaults remain disabled.
- `/admin/audit-log` still reads official display rows through `adminAuditDisplayAdapter`.
- `sharedMockWriter` remains the mock audit source of truth.
- Export, drawer, table, route, and navigation behavior are unchanged.
- Audit/notification checks pass 137/137.

## 4. Stage 3 Goals

- Define a staging-only activation model for internal Admin review.
- Define how safe aggregate comparison status may be reviewed.
- Keep prototype reads diagnostic only, never official.
- Preserve the Admin Audit Log table as the official UI surface.
- Prevent PII exposure in the panel, logs, screenshots, and notes.
- Define observability rules for safe aggregate diagnostics.
- Define rollout and rollback gates before any future runtime implementation.

## 5. Explicit Non-Goals

- No Stage 3 runtime implementation in this phase.
- No `src/*` changes.
- No `scripts/*` changes.
- No `package.json` changes.
- No route or navigation changes.
- No export behavior changes.
- No Admin Audit Log data source switch.
- No prototype persistence activation by default.
- No real persistence.
- No backend/API behavior.
- No database migrations.
- No mock fixture mutation.
- No Staff callback changes.
- No notification behavior changes.
- No PII exposure.
- No AP-10.

## 6. Staging-Only Activation Model

Stage 3 may be considered only for a staging/internal environment.

Future conceptual flow:

```
Admin staging session
  -> all debug flags enabled in staging only
  -> hidden/gated panel renders safe aggregate comparison status
  -> reviewer checks mismatch summaries
  -> no table source switch
  -> no export
  -> no official audit interpretation
  -> rollback by disabling flags
```

Production remains disabled by default. Production enablement is not part of Stage 3.

## 7. Internal Review Model

Only internal Admin reviewers may use the future Stage 3 panel. Reviewers may inspect aggregate status, counts, mismatch categories, mismatch dimensions, safe messages, and feature flag state labels.

Reviewers must not inspect raw audit events, event rows, actor IDs, target IDs, reason text, metadata values, raw route params, document identifiers, screenshots containing PII, exports, or copied row-level data.

## 8. Safe Comparison Data Model

Allowed display classes:

- comparison status
- source count
- prototype count
- mismatch count
- mismatch category
- mismatch dimension
- safeMessage
- createdAt timestamp
- aggregate health indicator
- feature flag state labels

Forbidden display classes:

- actorId
- targetId
- sourceEventId
- prototypeEventId
- raw student ID
- national ID
- email
- phone
- bank account
- raw IP
- file name or file path
- OCR text
- reason text
- metadata values
- raw route params
- uploaded document identifiers
- unmasked names

## 9. Admin UI Safety Boundary

The Stage 3 panel must remain visually and functionally separate from the Admin Audit Log table.

The panel must not:

- change table rows
- change drawer rows
- change filters
- change CSV/export
- add routes
- add navigation
- imply prototype data is official
- display row-level audit details

## 10. Prototype Read Authority Boundary

Prototype reads are comparison-only diagnostics. They are never official audit evidence.

The official Admin Audit Log continues to use:

- `adminAuditDisplayAdapter`
- `AuditDisplayPresenter`
- fixture/mock writer rows
- `sharedMockWriter`

Stage 3 must not switch official Admin display to prototype reads.

## 11. Feature Flag Requirements

All future Stage 3 runtime paths must require explicit staging-only flag enablement.

Required gates:

- Admin role gate
- `adminDebugPanelEnabled === true`
- AP-9F master feature gate enabled
- read comparison gate enabled
- staging/internal environment gate

All flags must default to false. Any failed gate must hide the panel or display only a safe Admin-only disabled shell as previously approved.

## 12. Privacy and PII Boundary

Stage 3 must preserve the AP-9G privacy boundary.

No UI, log, screenshot, reviewer note, export, clipboard action, console output, or daily report may include forbidden PII classes. Review evidence must use aggregate language only.

Any PII exposure is an immediate rollback trigger.

## 13. Observability and Diagnostics

Stage 3 observability is aggregate-only.

Safe diagnostics may include:

- total comparison runs
- count by status
- mismatch count
- mismatch count by category
- mismatch count by dimension
- last run timestamp
- panel render status for Admin only
- feature flag state labels

Diagnostics must not include raw event identifiers or PII.

## 14. Rollout Sequence

1. Confirm Stage 2 post-merge QA passed.
2. Review and approve Stage 3 plan and QA docs.
3. Create a separate Stage 3 runtime branch only after explicit approval.
4. Keep flags disabled by default.
5. Enable staging-only flag set in a controlled internal session.
6. Confirm Admin-only visibility.
7. Confirm non-admin no DOM trace.
8. Confirm panel shows safe aggregate metrics only.
9. Confirm Admin Audit Log table, drawer, filters, and export are unchanged.
10. Run build, token checks, audit checks, route smoke, and dev log review.
11. Collect aggregate-only reviewer notes.
12. Disable flags after review.

## 15. Rollback Sequence

Rollback is performed by disabling all AP-9G debug and read comparison flags.

Rollback must also:

- confirm the panel is hidden
- confirm non-admin roles have no DOM trace
- clear in-memory comparison metrics if needed
- validate checks
- route smoke the five standard routes
- confirm Admin Audit Log table behavior is unchanged
- document any privacy or unauthorized access incident

## 16. QA Gates

Required QA gates for future Stage 3 runtime:

- Build passes 40/40.
- Token checks pass 4/4.
- Audit/notification checks pass current expected total.
- Five smoke routes return 200 OK.
- Dev log is clean.
- Admin-only visibility verified.
- Non-admin no DOM trace verified.
- No route, navigation, or export behavior added.
- No PII in panel, logs, screenshots, reviewer notes, or docs.
- Admin Audit Log source of truth unchanged.
- Rollback by disabling flags verified.

## 17. Recommended Next Phase

- AP-9G Stage 3 QA documentation checkpoint.
- Stage 3 runtime only after explicit approval.
- Do not start AP-10.
- Do not activate real persistence.
