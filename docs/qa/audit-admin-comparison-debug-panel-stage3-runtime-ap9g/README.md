# Audit Admin Comparison Debug Panel Stage 3 Runtime AP-9G QA

## Overview

AP-9G Stage 3 runtime adds staging-only aggregate observability rendering to `AdminAuditComparisonDebugPanel`. Stage 3 behavior is gated by two additional flags (`prototypeMetricsEnabled` and `adminComparisonStagingReviewEnabled`), both defaulting to `false`. In the default configuration, the panel renders nothing — the same as Stage 1.

This QA confirms Stage 3 runtime is correctly gated, renders only safe aggregate data, exposes no PII, preserves all existing Admin UI behavior, and leaves all safety boundaries intact.

## Scope

QA covers:
- `AdminAuditComparisonDebugPanel` component Stage 3 rendering logic
- Stage 3 flag gating (`prototypeMetricsEnabled && stagingReviewEnabled`)
- Safe aggregate-only data surface (count, status, `safeMessage` only)
- `auditPersistenceConfig.ts` new flags (all default `false`)
- `src/app/admin/audit-log/page.tsx` wiring (all props from `DEFAULT_AUDIT_PERSISTENCE_CONFIG`)
- `check-audit-events.mjs` check expansion
- Runtime boundary preservation (`adminAuditDisplayAdapter`, `sharedMockWriter`)
- PII safety
- Validation and route smoke

## Validation Results

| Check | Command | Result |
|-------|---------|--------|
| Build | `npm run build` | Passed, 40/40 routes, 0 type errors |
| Token check | `npm run check:tokens` | Passed, 4/4 |
| Audit/notification checks | `npm run check:audit-events` | Passed, 139/139 |

| Route | Status |
|-------|--------|
| `/login` | 200 OK |
| `/admin/audit-log` | 200 OK |
| `/admin/dashboard` | 200 OK |
| `/staff/applications/app_001` | 200 OK |
| `/staff/applications/app_002` | 200 OK |

Dev log: clean — no errors, warnings, or hydration issues detected.

## QA Checklist

### Stage 3 Gating

- [x] Panel renders nothing when `adminDebugPanelEnabled` is `false` (default)
- [x] Panel renders nothing for non-admin roles (role guard is first check)
- [x] Stage 3 surface only activates when both `prototypeMetricsEnabled` AND `stagingReviewEnabled` are `true`
- [x] Both new flags default to `false` in `DEFAULT_AUDIT_PERSISTENCE_CONFIG`
- [x] Stage 2 disabled shell shown when `featureEnabled || readCompareEnabled` is false but panel is enabled
- [x] Stage 2 enabled shell shown when feature flags pass but Stage 3 flags are off

### Safe Aggregate Data Surface (Stage 3 Path)

- [x] Only aggregate counts displayed: total, matched, mismatched, failed
- [x] Only last 5 results shown (`metrics.list().slice(-5).reverse()`)
- [x] Per-result fields shown: `createdAt`, `safeMessage`, `status`, `sourceCount`, `prototypeCount`, `mismatchCount`
- [x] No `actorId` displayed
- [x] No `targetId` displayed
- [x] No `reason` displayed
- [x] No metadata values displayed
- [x] No raw event IDs displayed
- [x] No student ID displayed
- [x] No national ID displayed
- [x] Note rendered: "Prototype reads are diagnostic — not official audit evidence"

### Admin Page Wiring

- [x] Component wired in `src/app/admin/audit-log/page.tsx`
- [x] All props sourced from `DEFAULT_AUDIT_PERSISTENCE_CONFIG`
- [x] `enabled={DEFAULT_AUDIT_PERSISTENCE_CONFIG.adminDebugPanelEnabled}` — defaults `false`
- [x] `featureEnabled={DEFAULT_AUDIT_PERSISTENCE_CONFIG.prototypeEnabled}` — defaults `false`
- [x] `readCompareEnabled={DEFAULT_AUDIT_PERSISTENCE_CONFIG.readFromPrototype}` — defaults `false`
- [x] `prototypeMetricsEnabled={DEFAULT_AUDIT_PERSISTENCE_CONFIG.prototypeMetricsEnabled}` — defaults `false`
- [x] `stagingReviewEnabled={DEFAULT_AUDIT_PERSISTENCE_CONFIG.adminComparisonStagingReviewEnabled}` — defaults `false`
- [x] Wiring is read-only from config — no runtime state mutation

### Config Safety

- [x] `adminDebugPanelEnabled: false` in `DEFAULT_AUDIT_PERSISTENCE_CONFIG`
- [x] `prototypeMetricsEnabled: false` in `DEFAULT_AUDIT_PERSISTENCE_CONFIG`
- [x] `adminComparisonStagingReviewEnabled: false` in `DEFAULT_AUDIT_PERSISTENCE_CONFIG`
- [x] `prototypeEnabled: false` unchanged
- [x] `shadowWrites: false` unchanged
- [x] `readFromPrototype: false` unchanged

### Runtime Boundary Preservation

- [x] `adminAuditDisplayAdapter` active read path preserved (unchanged)
- [x] `sharedMockWriter` source of truth preserved (unchanged)
- [x] `AuditDisplayPresenter` formatting boundary preserved (unchanged)
- [x] Prototype persistence remains disabled by default
- [x] Real persistence not added
- [x] Backend/API not changed
- [x] Database migration not added
- [x] Mock fixture not mutated

### Safety

- [x] No `src/data/mock/audit-logs.ts` changed
- [x] No Staff callbacks changed
- [x] No Staff verify wired
- [x] No reason validation changed
- [x] No `ReasonRequiredModal` introduced
- [x] No notification behavior changed
- [x] No PII exposure
- [x] AP-9G Stage 4 not started
- [x] AP-10 not started

## Result

**AP-9G Stage 3 runtime QA passed.**

Stage 3 runtime is correctly gated behind `adminDebugPanelEnabled`, `prototypeMetricsEnabled`, and `adminComparisonStagingReviewEnabled` — all defaulting to `false`. In the default configuration the panel renders nothing. Stage 3 aggregate data surface shows only safe counts, statuses, and `safeMessage` — no PII. All 139 audit/notification checks pass. All route smoke tests pass.

## Recommended Next Step

- Do not push without explicit instruction
- Do not merge without explicit instruction
- Stage 4 (production disabled-by-default) only after explicit approval
- Do not start AP-10
- Do not activate real persistence
