# Audit Read Comparison Runtime AP-9F QA

## Overview

AP-9F added a disabled-by-default read comparison runtime skeleton for comparing source mock/admin audit events with prototype audit events in memory.

This QA confirms the skeleton is safe, PII-free, not wired to Admin UI, and does not change runtime behavior. All feature flags remain disabled by default. The comparison service is available for future use only.

## Scope

QA covers:
- `auditReadComparisonTypes` — type definitions
- `auditReadComparisonMetrics` — in-memory metrics store
- `auditReadComparisonGuards` — 6-gate guard evaluation
- `auditReadComparisonService` — core comparison service and testing factory
- `src/lib/audit/index.ts` — AP-9F export additions
- `scripts/check-audit-events.mjs` — AP-9F checks (107 → 122)
- Admin read path preservation (`adminAuditDisplayAdapter`)
- `sharedMockWriter` source-of-truth preservation
- `AuditDisplayPresenter` formatting boundary
- Privacy and PII safety review
- Validation (build, token check, audit checks)
- Route smoke tests

## Validation Results

- Build: passed, generated **40/40** static pages/routes, 0 type errors.
- Token check: passed **4/4**.
- Audit/notification check: passed **122/122** (was 107/107 before AP-9F).
- Route smoke:
  - `/login`: 200 OK
  - `/admin/audit-log`: 200 OK
  - `/admin/dashboard`: 200 OK
  - `/staff/applications/app_001`: 200 OK
  - `/staff/applications/app_002`: 200 OK
- Dev log: clean — no errors, warnings, hydration issues, or unexpected output.

## QA Checklist

### Runtime Boundary

- [x] Admin UI is not switched to prototype reads
- [x] Admin table behavior unchanged
- [x] Drawer behavior unchanged
- [x] CSV/export behavior unchanged
- [x] `sharedMockWriter` remains source of truth
- [x] `adminAuditDisplayAdapter` remains active read path
- [x] `AuditDisplayPresenter` remains formatting boundary
- [x] Prototype persistence remains disabled by default
- [x] Real persistence not added

### Comparison Types

- [x] Status types are safe (`disabled` | `skipped` | `matched` | `mismatched` | `failed`)
- [x] Mismatch categories are complete (14 categories covering all comparison dimensions)
- [x] Comparison dimensions are complete (12 dimensions)
- [x] `AuditReadComparisonInput` does not include raw PII fields — only event arrays and feature flag booleans
- [x] `AuditReadComparisonMismatch` uses `safeMessage`/`category`/`dimension`/`sourceSafeToken`/`prototypeSafeToken` only — no `actorId`, `targetId`, `reason`, or metadata values

### Metrics Store

- [x] In-memory only — closure-based store with private `results` array
- [x] No localStorage, sessionStorage, or indexedDB
- [x] No backend/API calls
- [x] No database writes
- [x] Stores only safe `AuditReadComparisonResult` summaries — no raw event data
- [x] `list()` returns deep copies: `results.map(r => ({ ...r, mismatches: r.mismatches.map(m => ({ ...m })) }))`
- [x] `countByStatus()` works correctly

### Guards

- [x] Returns `disabled` when `featureEnabled` is false (Gate 1)
- [x] Returns `disabled` when `readCompareEnabled` is false (Gate 2)
- [x] Returns `skipped` when source events missing/empty (Gate 3)
- [x] Returns `skipped` when prototype events missing/empty (Gate 4)
- [x] Returns `failed` (not throws) when `real_persisted` event detected in either list (Gate 5)
- [x] Returns `failed` (not throws) when unsafe metadata key detected (Gate 6)
- [x] `COMPARISON_UNSAFE_METADATA_KEYS` covers `FORBIDDEN_AUDIT_METADATA_KEYS` plus `studentId`, `rawStudentId`, `nationalId`, `email`, `phone`, `bankAccount`, `ip`, `rawIp`, `fileName`, `filePath`, `ocrText`
- [x] No throws for normal disabled/skipped states
- [x] `assertNoRealPersistedReadComparison` correctly throws for `real_persisted` events
- [x] `hasUnsafeComparisonMetadata` correctly returns true for events with PII keys

### Service

- [x] Returns `matched` for identical safe event lists
- [x] Detects count mismatch (`event_count` dimension)
- [x] Detects missing prototype event (`missing_in_prototype`)
- [x] Detects extra prototype event (`extra_in_prototype`)
- [x] Detects event type mismatch (`event_type_mismatch`)
- [x] Detects target display token mismatch (`target_display_token_mismatch`)
- [x] Does not mutate input source or prototype event arrays
- [x] Does not expose `actorId`, `targetId`, `reason`, or metadata values in mismatch output
- [x] Presenter comparison wrapped in try/catch — non-blocking on presenter failure
- [x] `compareEventLists` wrapped in try/catch in `compare()` — failures return `{ status: 'failed' }`, never throw into UI
- [x] `createAuditReadComparisonServiceForTesting` uses isolated metrics store
- [x] All Map/Set iteration uses `Array.from()` — compatible with TypeScript target

### Safety

- [x] No `src/app/*` changes
- [x] No `src/components/*` changes
- [x] No mock fixture (`src/data/mock/audit-logs.ts`) mutation
- [x] No Staff callback change
- [x] No Staff verify wiring
- [x] No reason validation change
- [x] No `ReasonRequiredModal` introduced
- [x] No notification behavior change
- [x] No PII in comparison output (type-level enforcement + guard enforcement)
- [x] AP-10 not started

## Result

**AP-9F QA passed.**

The read comparison runtime skeleton is disabled by default, PII-free, isolated from Admin display, and does not change any runtime behavior. `sharedMockWriter` remains the source of truth. `adminAuditDisplayAdapter` remains the active Admin read path. The comparison service is available for future developer use only.

## Recommended Next Step

- Push `architecture/audit-read-comparison-runtime-ap9f` branch after QA approval.
- Open PR targeting `main`.
- Merge only after review and approval.
- Run AP-9F post-merge QA after merge to confirm main state.
- Do not start AP-10.
- Do not activate real persistence.
