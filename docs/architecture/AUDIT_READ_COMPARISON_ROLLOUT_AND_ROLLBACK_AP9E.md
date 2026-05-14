# Audit Read Comparison Rollout And Rollback AP-9E

## Overview

This document defines rollout and rollback requirements for future audit read comparison runtime.

AP-9E is documentation-only and does not enable comparison runtime.

## Feature Flags

All future flags must default to false:

- `prototypeEnabled`: false
- `shadowWrites`: false
- `readFromPrototype`: false
- future `readComparisonEnabled`: false
- future `readComparisonLoggingEnabled`: false
- future `readComparisonAdminDebugVisible`: false

## Rollout Preconditions

Comparison can be enabled only after:

- AP-9D shadow write behavior is reviewed and stable
- shadow write data exists in prototype storage
- prototype persistence is explicitly enabled in a non-production-safe test context
- Admin display remains on `adminAuditDisplayAdapter`
- mismatch logging is proven PII-safe
- rollback has been rehearsed

## Rollout Sequence

1. Keep Admin display on mock path.
2. Enable prototype shadow writes only in approved context.
3. Verify prototype storage has expected shadow data.
4. Enable read comparison flag.
5. Compare safe snapshots.
6. Emit aggregate metrics only.
7. Review mismatch categories and rates.
8. Disable comparison if thresholds are exceeded.
9. Keep `readFromPrototype` false.

## Rollback Triggers

Rollback must occur if any of these happen:

- mismatch rate above threshold
- unsafe metadata attempt
- raw ID or PII appears in logs
- route/UI regression
- build/check failure
- audit/notification check failure
- route smoke failure
- dev log errors or warnings
- latency degradation
- Admin table/drawer/export output changes unexpectedly
- comparison affects Staff UI/toasts

## Rollback Sequence

1. Disable future `readComparisonEnabled`.
2. Disable future `readComparisonLoggingEnabled`.
3. Disable future `readComparisonAdminDebugVisible`.
4. Confirm `readFromPrototype` is false.
5. Confirm Admin display remains on `adminAuditDisplayAdapter`.
6. Clear in-memory prototype storage if needed for test reset.
7. Run rollback validation.
8. Document the trigger and result.

## Rollback Validation

After rollback:

- `npm run build`: 40/40
- `npm run check:tokens`: 4/4
- `npm run check:audit-events`: 107/107 or updated approved count
- `/login`: 200 OK
- `/admin/audit-log`: 200 OK
- `/admin/dashboard`: 200 OK
- `/staff/applications/app_001`: 200 OK
- `/staff/applications/app_002`: 200 OK
- dev log clean

## Non-Negotiable Boundaries

- No real persistence.
- No backend/API.
- No database migration.
- No browser storage.
- No Admin read switch.
- No Staff callback change.
- No notification behavior change.
- No PII exposure.
