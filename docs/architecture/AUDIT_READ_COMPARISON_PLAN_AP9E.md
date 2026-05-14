# Audit Read Comparison Plan AP-9E

## 1. Overview

AP-9E is a documentation-only plan for comparing the current mock audit read path with future prototype audit reads.

This plan does not implement runtime comparison. It defines the architecture, privacy boundaries, rollout gates, and rollback criteria needed before any future read comparison runtime is approved.

## 2. Why AP-9E Exists

AP-9D added disabled-by-default shadow write runtime hooks for Staff document rejection and Staff document replacement request. Before any Admin read path can even be considered for prototype data, the system needs a safe comparison model that can answer:

- whether prototype events match the existing mock/read source
- whether prototype reads preserve ordering and display semantics
- whether privacy and metadata rules remain consistent
- whether mismatches can be diagnosed without exposing PII
- whether Admin UI stays stable while comparison runs separately

## 3. Current State After AP-9D

- `sharedMockWriter` remains the source of truth.
- `adminAuditDisplayAdapter` remains the active Admin read path.
- `AuditDisplayPresenter` remains the display formatting boundary.
- AP-9D shadow writes exist for Staff reject/replacement request.
- Prototype persistence remains disabled by default.
- `readFromPrototype` remains false by default.
- Audit/notification checks pass 107/107.
- No real persistence, backend/API, database migration, or browser storage exists.

## 4. Explicit Non-Goals

- No runtime comparison in AP-9E.
- No `src/*` changes.
- No `scripts/*` changes.
- No `package.json` changes.
- No backend/API behavior.
- No database migrations.
- No prototype persistence activation.
- No real persistence.
- No Admin UI switch to prototype reads.
- No replacement of `sharedMockWriter`.
- No replacement of `adminAuditDisplayAdapter`.
- No Staff callback changes.
- No Staff verify wiring.
- No reason validation changes.
- No `ReasonRequiredModal`.
- No notification behavior changes.
- No PII exposure.
- No AP-10.

## 5. Current Read Source

The current Admin read source remains:

```text
mockAuditLogs fixture
  + DEMO_WRITER_EVENTS
  + sharedMockAuditWriter.list()
  -> adminAuditDisplayAdapter
  -> AuditDisplayPresenter
  -> Admin table/drawer/export display rows
```

This path is the active source for Admin display and must remain unchanged during AP-9E planning and any future comparison-only runtime.

## 6. Future Comparison Read Source

The future comparison source is prototype storage only:

```text
PrototypeAuditPersistenceService
  -> PrototypeAuditRepository
  -> InMemoryPrototypeAuditStorageDriver
```

Prototype reads are comparison-only in the future AP-9E runtime. They must not become Admin display input unless a separate, explicitly approved phase changes that boundary.

## 7. Comparison Architecture

The future architecture should compare two read snapshots without mutating either:

```text
Admin-safe mock snapshot
  -> normalize safe fields
  -> present through AuditDisplayPresenter

Prototype snapshot
  -> normalize safe fields
  -> present through AuditDisplayPresenter

Comparator
  -> aggregate mismatch metrics
  -> developer-safe logs
  -> no UI read switch
```

The comparator should operate on safe, derived fields. It should not log raw event payloads, full metadata values, reason text, actor IDs, target IDs, or raw route parameters.

## 8. Feature Flag Model

All future AP-9E runtime flags must default to false:

| Flag | Purpose | Default |
|---|---|---|
| `prototypeEnabled` | master switch for prototype behavior | `false` |
| `shadowWrites` | writes mock event copies to prototype | `false` |
| `readFromPrototype` | switches Admin reads to prototype | `false` and not used by AP-9E |
| future `readComparisonEnabled` | allows comparison reads only | `false` |
| future `readComparisonLoggingEnabled` | allows developer-safe aggregate logs | `false` |

AP-9E runtime must not turn on `readFromPrototype`. Comparison reads and Admin display reads are separate concerns.

## 9. Comparison Flow

Future runtime flow:

1. Confirm comparison flag is enabled.
2. Confirm prototype storage has shadow write data.
3. Read current Admin-safe mock rows through the existing adapter path.
4. Read prototype events through the prototype service/repository.
5. Normalize both snapshots to safe comparable fields.
6. Run comparison dimensions.
7. Record aggregate counts and mismatch categories.
8. Emit developer-safe logs only if logging flag is enabled.
9. Keep Admin table, drawer, CSV/export, and Staff UI unchanged.

## 10. Admin Display Boundary

- Admin UI still reads from `adminAuditDisplayAdapter`.
- `AuditDisplayPresenter` remains the single display formatting boundary.
- Prototype comparison must not alter Admin table rows.
- Prototype comparison must not alter drawer rows.
- Prototype comparison must not alter CSV/export rows.
- Prototype comparison must not activate the real persisted filter.
- Any future debug panel must be separate, admin-only, explicitly approved, and PII-safe.

## 11. Privacy And Logging Rules

Comparison output may include:

- event counts
- mismatch category
- event type
- actor role
- safe target display token
- persistence mode distribution
- timestamp order status
- safe metadata key names only

Comparison output must not include:

- actor ID
- target ID
- reason text
- metadata values
- raw route params
- raw student ID
- national ID
- email
- phone
- bank details
- raw IP
- file names
- OCR text

## 12. Mismatch Handling

Mismatch handling is diagnostic only:

- Missing, extra, duplicate, ordering, metadata, mode, presenter, and copy-stage mismatches are counted.
- Unsafe metadata attempts are critical rollback triggers.
- Mismatches do not block Staff UI.
- Mismatches do not change Admin display.
- Mismatches do not trigger notifications.
- Mismatches do not write to backend/API/database.

## 13. Rollout Sequence

1. AP-9E documentation review.
2. AP-9E QA documentation checkpoint.
3. Future AP-9F runtime plan/approval.
4. Implement comparison runtime behind disabled-by-default flags only after approval.
5. Enable comparison only after safe shadow write data exists.
6. Review aggregate mismatch metrics.
7. Keep Admin display on mock path until a later approved phase.

## 14. Rollback Sequence

Rollback must be one flag change:

1. Disable future `readComparisonEnabled`.
2. Disable future `readComparisonLoggingEnabled` if needed.
3. Leave `sharedMockWriter` and `adminAuditDisplayAdapter` untouched.
4. Validate build, token checks, audit/notification checks, route smoke, and dev log.
5. Document mismatch or rollback reason.

No data cleanup should be required because prototype storage remains in-memory and non-authoritative.

## 15. QA Gates

Before any runtime comparison phase:

- Build passes 40/40.
- Token checks pass 4/4.
- Audit/notification checks pass 107/107 or updated approved count.
- `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002` return 200.
- Dev log is clean.
- No Admin read switch.
- No `src/data/mock/audit-logs.ts` mutation.
- No PII appears in metrics or logs.
- Rollback flag behavior is documented and tested.

## 16. Recommended Next Phase

- AP-9E-QA docs-only review.
- AP-9F read comparison runtime only after explicit approval.
- Do not start real persistence.
- Do not start AP-10.
