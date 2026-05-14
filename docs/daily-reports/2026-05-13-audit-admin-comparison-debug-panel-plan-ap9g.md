# Audit Admin Comparison Debug Panel Plan AP-9G — 2026-05-15

## Date

2026-05-15

## Branch

`architecture/audit-admin-comparison-debug-panel-plan-ap9g`

## Base Commit

`c38f058` — `docs(qa): review audit read comparison runtime post merge` (main)

## Purpose

Documentation-only planning phase for AP-9G: Admin Debug-only Audit Comparison Panel. Defines the architecture, privacy boundary, access control, UI state model, rollout/rollback strategy, and QA checklist for a future Admin-only, disabled-by-default debug panel that shows safe aggregate comparison metrics from the AP-9F read comparison runtime.

No runtime code is implemented in this phase.

## Validation Results

| Check | Command | Result |
|-------|---------|--------|
| Build | `npm run build` | Passed, 40/40 routes, 0 type errors |
| Token check | `npm run check:tokens` | Passed, 4/4 |
| Audit/notification checks | `npm run check:audit-events` | Passed, 122/122 |

## Route Verification

| Route | Status |
|-------|--------|
| `/login` | 200 OK |
| `/admin/audit-log` | 200 OK |
| `/admin/dashboard` | 200 OK |
| `/staff/applications/app_001` | 200 OK |
| `/staff/applications/app_002` | 200 OK |

Dev log: clean — no errors, warnings, or hydration issues detected.

## Files Created

| File | Purpose |
|------|---------|
| `docs/architecture/AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_PLAN_AP9G.md` | Main AP-9G plan: architecture, goals, non-goals, panel model, privacy, rollout, QA gates |
| `docs/architecture/AUDIT_ADMIN_COMPARISON_PANEL_PRIVACY_BOUNDARY_AP9G.md` | Forbidden and allowed UI data, logging/export/copy restrictions |
| `docs/architecture/AUDIT_ADMIN_COMPARISON_PANEL_ACCESS_CONTROL_AP9G.md` | Admin-only rule, forbidden roles, feature flag gates, blocked access behavior |
| `docs/architecture/AUDIT_ADMIN_COMPARISON_PANEL_UI_SPEC_AP9G.md` | Panel states, summary cards, mismatch table, accessibility, mobile, copy examples |
| `docs/architecture/AUDIT_ADMIN_COMPARISON_PANEL_ROLLOUT_AND_ROLLBACK_AP9G.md` | 5-stage rollout, rollback triggers and actions, verification checklist |
| `docs/architecture/AUDIT_ADMIN_COMPARISON_PANEL_QA_CHECKLIST_AP9G.md` | Full QA checklist for all implementation stages |
| `docs/daily-reports/2026-05-13-audit-admin-comparison-debug-panel-plan-ap9g.md` | This report |

## Files Modified

| File | Change |
|------|--------|
| `docs/architecture/NEXT_RENOVATION_STEPS.md` | Appended AP-9G planning section |

## Safety Confirmations

- Runtime code changed: **No**
- `src/*` changed: **No**
- `scripts/*` changed: **No**
- `package.json` changed: **No**
- Admin UI switched to prototype reads: **No**
- Prototype persistence activated: **No**
- Real persistence added: **No**
- Backend/API changed: **No**
- Database migration added: **No**
- Mock fixture mutated: **No**
- `sharedMockWriter` source of truth preserved: **Yes**
- `adminAuditDisplayAdapter` active read path preserved: **Yes**
- Staff callbacks changed: **No**
- Staff verify wired: **No**
- Reason validation changed: **No**
- `ReasonRequiredModal` introduced: **No**
- Notification behavior changed: **No**
- PII exposure added: **No**
- AP-10 started: **No**

## Recommended Next Phase

- AP-9G-QA: documentation-only review of this planning phase
- Runtime implementation (Stage 1 hidden component) only after explicit approval
- Do not start AP-10
- Do not activate real persistence
