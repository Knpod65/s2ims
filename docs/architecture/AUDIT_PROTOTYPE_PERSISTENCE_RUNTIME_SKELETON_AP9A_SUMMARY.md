# Audit Prototype Persistence Runtime Skeleton AP-9A Summary

## Overview

AP-9A introduces a **disabled-by-default** prototype audit persistence skeleton. It adds the storage, repository, and service infrastructure needed to eventually enable prototype persistence — without changing any current runtime behavior.

This is **not** real persistence. It does not write to a database, backend API, or browser storage. It provides an in-memory prototype driver that is completely isolated from the existing system.

## Why AP-9A Exists

AP-9 defined the architecture for prototype persistence. AP-9A provides tested, compilable runtime skeletons so that:

- The storage driver contract is validated through actual code.
- The repository pattern is proven to work with the existing type system.
- The feature flag / config model is functional and testable.
- Future integration work (shadow writes, read comparison) can proceed from a working foundation.

## Files Created

| File | Description |
|------|-------------|
| `src/lib/audit/storage/auditStorageDriver.ts` | Storage driver contract — types and interface |
| `src/lib/audit/storage/auditPersistenceConfig.ts` | Config model and default (disabled) settings |
| `src/lib/audit/storage/inMemoryPrototypeAuditStorageDriver.ts` | In-memory prototype driver implementation |
| `src/lib/audit/repositories/prototypeAuditRepository.ts` | Prototype repository wrapping the driver |
| `src/lib/audit/guards/auditPersistenceFeatureGuard.ts` | Feature guard functions for prototype/real checks |
| `src/lib/audit/services/prototypeAuditPersistenceService.ts` | Orchestration service for prototype writes/reads |
| `docs/architecture/AUDIT_PROTOTYPE_PERSISTENCE_RUNTIME_SKELETON_AP9A_SUMMARY.md` | This summary document |

## Files Modified

| File | Change |
|------|--------|
| `src/lib/audit/index.ts` | Added exports for new AP-9A modules |
| `scripts/check-audit-events.mjs` | Added 16 AP-9A checks (total now 87+) |
| `docs/architecture/NEXT_RENOVATION_STEPS.md` | Added AP-9A result section |

## Runtime Behavior Impact

**Zero.** The current application behaves identically before and after AP-9A.

- `sharedMockWriter` remains the active write path for Staff actions
- `mockAuditWriter` remains unchanged (accepts `mock_only` only)
- `adminAuditDisplayAdapter` remains the read path for Admin display
- `AuditDisplayPresenter` remains the single formatting boundary
- No UI components are modified
- No Staff callbacks are changed
- No notification behavior is affected

Prototype persistence is **disabled by default**. Unless a developer explicitly sets `prototypeEnabled: true` in the config, none of the new code executes at runtime.

## Feature Flag / Config Model

```typescript
// Default config (disabled)
const DEFAULT_AUDIT_PERSISTENCE_CONFIG = {
  mode: 'mock_only',           // Current runtime mode
  prototypeEnabled: false,      // Prototype storage OFF by default
  shadowWrites: false,          // No dual-write to mock + prototype
  readFromPrototype: false,     // Admin reads from mock path
}
```

To enable prototype persistence for testing, a developer would change:

```typescript
const config: AuditPersistenceConfig = {
  mode: 'prototype_only',
  prototypeEnabled: true,
  shadowWrites: true,   // Optional: write to both paths
  readFromPrototype: true, // Optional: read from prototype
}
```

## Storage Driver Boundary

The `AuditStorageDriverContract` interface defines all storage operations:

- `append(record)` — Write a sanitized record
- `appendMany(records)` — Batch write
- `findById(id)` — Find by event ID
- `query(filters)` — Filtered query with pagination
- `count(filters)` — Count with filters
- `clear()` — Test/dev utility
- `health()` — Health check

The **in-memory prototype driver** (`InMemoryPrototypeAuditStorageDriver`) implements this interface using a plain array. No localStorage, sessionStorage, database, or file system is used.

All drivers reject `real_persisted` mode — this mode is not part of the `AuditStorageMode` type in AP-9A.

## Repository / Service Boundary

- `PrototypeAuditRepository` wraps the storage driver and enforces prototype-only writes.
- `PrototypeAuditPersistenceService` orchestrates writes through the repository with config checks.
- Both are completely isolated from the existing `InMemoryAuditRepository` and `AuditService`.
- The existing `sharedMockAuditWriter` is never modified or referenced by the new code.

## Privacy and Metadata Safety

- Prototype events must have `persistenceMode: 'prototype_only'` — enforced at repository level.
- Events with `real_persisted` mode are rejected by both the config guard and the driver.
- Metadata sanitization follows the same `FORBIDDEN_AUDIT_METADATA_KEYS` rules from `auditMetadataRules.ts`.
- The storage driver contract only accepts pre-sanitized `AuditStorageWriteInput` — no raw metadata blob.
- IP handling: no raw IP stored; optional `ipHash` field for future salted hashing.
- All 14 forbidden metadata keys remain blocked upstream in the event builder.

## What Is Intentionally Not Wired

| Component | Status |
|-----------|--------|
| Staff document reject/replacement callbacks | Still use `sharedMockWriter` (AP-6D path) |
| Staff document verify callback | Not wired (deferred) |
| Admin audit display | Still reads from `adminAuditDisplayAdapter` (fixture + mock writer) |
| `AuditWarningCard` copy | Unchanged (Stage 0) |
| Reason validation | Unchanged |
| `ReasonRequiredModal` | Not introduced |
| Notification behavior | Unchanged |
| Database migrations | Not created |
| Backend/API routes | Not added |
| Real persistence | Not available |

## Validation Results

Build, token checks, audit/notification checks all pass. New AP-9A checks verified:

- Default config disabled ✓
- Feature guard blocks prototype by default ✓
- Feature guard blocks real persistence ✓
- Driver rejects writes when disabled ✓
- Driver accepts prototype_only when enabled ✓
- Driver rejects real_persisted events ✓
- Driver list returns copies (no mutation) ✓
- Driver findById, count, clear, health work ✓
- Repository blocks writes when disabled ✓
- Repository writes when enabled ✓
- Service records when enabled ✓
- Service returns disabled when not enabled ✓
- Service list returns empty when disabled ✓
- Prototype writes do not mutate sharedMockWriter ✓
- Mock fixture remains unmutated ✓

## Safety Confirmations

This implementation:

- ❌ Does not add real persistence
- ❌ Does not add backend/API behavior
- ❌ Does not create database migrations
- ❌ Does not write to localStorage/sessionStorage
- ❌ Does not change Staff callbacks
- ❌ Does not wire Staff verify action
- ❌ Does not change reason validation
- ❌ Does not introduce ReasonRequiredModal
- ❌ Does not change notification behavior
- ❌ Does not expose PII
- ❌ Does not replace `sharedMockWriter`
- ❌ Does not replace `adminAuditDisplayAdapter`
- ❌ Does not modify `src/data/mock/audit-logs.ts`
- ❌ Does not modify `src/app/*` or `src/components/*`
- ✅ Feature flag disabled by default
- ✅ Prototype-only mode, no `real_persisted`
- ✅ Full rollback by disabling config flag
- ✅ Existing behavior preserved

## Recommended Next Step

After review:

1. **AP-9A-QA** — Formal QA checkpoint for the skeleton (if separate from build validation)
2. **AP-9B** — Feature-flagged integration plan (shadow writes, read comparison) — docs-only
3. **AP-10** — Real persistence planning — only after prototype review and compliance approval

Do not jump directly to real persistence. Do not start AP-10.