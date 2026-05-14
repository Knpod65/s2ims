# Audit Prototype Repository Implementation Plan AP-9

## Purpose

Plan the future implementation of a prototype audit repository without implementing it. This document describes the repository classes, their relationships, the write/read flows, and migration strategy from the current mock-only system.

## Current Repository State

| Component | File | Status |
|-----------|------|--------|
| `AuditRepositoryContract` | `src/lib/audit/contracts/auditContracts.ts` | Interface defined (AP-8A) |
| `InMemoryAuditRepository` | `src/lib/audit/repositories/inMemoryAuditRepository.ts` | AP-8A skeleton, in-memory only |
| `sharedMockAuditWriter` | `src/lib/audit/sharedMockWriter.ts` | Current AP-6D write path |
| `mockAuditWriter` | `src/lib/audit/mockAuditWriter.ts` | In-memory writer class |
| `AuditService` | `src/lib/audit/services/auditService.ts` | AP-8A skeleton |
| `AdminAuditDisplayAdapter` | `src/lib/audit/adminAuditDisplayAdapter.ts` | Current read path (composes rows) |

## Future Repository Classes

These will be created when AP-9A begins (not now):

```
src/lib/audit/repositories/prototypeAuditRepository.ts
src/lib/audit/storage/auditStorageDriver.ts
src/lib/audit/storage/inMemoryAuditStorageDriver.ts
src/lib/audit/storage/prototypeFileAuditStorageDriver.ts  (optional)
src/lib/audit/mappers/auditPersistenceMapper.ts
src/lib/audit/sanitizers/auditPersistenceSanitizer.ts
```

## Write Flow (Future)

```
Staff UI callback
    → AuditService.recordDocumentRejection(input)
        → BuildAuditEventInput validation (FormRequest-like)
        → auditEventBuilder.buildStaffDocumentRejectEvent(input)
            → AuditEvent (validated, sanitized)
        → AuditMetadataSanitizer.sanitize(event.metadata)
        → PolicyGuard.validateWrite(actor, event)
        → Repository.append(event)
            → PrototypeAuditRepository
                → AuditStorageDriver.write(persistenceRecord)
                    → Storage backend (in-memory / file / DB)
        → WriteResult { success, eventId, error? }
```

### Key Design Decisions

1. **Service orchestrates, never writes directly.** The `AuditService` is the single entry point for all audit writes.
2. **Builder produces AuditEvent, not persistence records.** A separate mapper converts `AuditEvent` → storage record.
3. **Sanitizer runs before repository.** Metadata is sanitized by a dedicated class before persistence.
4. **Policy guard checks before everything.** The policy gate prevents unauthorized writes at the service boundary.

## Read Flow (Future)

```
Admin page (page.tsx)
    → getAdminAuditDisplayRows(source)
        → PrototypeAuditRepository.query(filters)
            → storage.driver.query(filters)
                → AuditStorageRecord[]
        → records.map(presenter.present())
            → AdminAuditDisplayRow[]
        → page renders table + drawer
```

### Display Path Preservation

The `AdminAuditDisplayRow` shape remains identical regardless of data source. The presenter (`AuditDisplayPresenter`) produces the same output whether reading from fixture, mock writer, or prototype storage. This is the key architectural invariant.

## Migration Strategy from sharedMockWriter

The transition from mock-only to prototype persistence follows a staged approach:

### Stage 1: Parallel Write (Shadow Mode)
- Both `sharedMockWriter` and prototype repository receive writes.
- Admin display still reads from `sharedMockWriter` only.
- Prototype data is written but not displayed.
- Purpose: verify write correctness without affecting display.
- Config: `audit.shadowWrites = true`

### Stage 2: Admin Read Comparison
- Admin display reads from both sources.
- UI shows a comparison badge: "Prototype: N events | Mock: M events".
- No user-facing behavior change, only diagnostic.
- Purpose: verify row counts and data integrity match.
- Config: `audit.compareReads = true`

### Stage 3: Admin Prototype Read
- Admin display switches to reading from the prototype repository.
- `sharedMockWriter` is still writable (backward compatibility).
- Admin UI shows prototype data exclusively.
- Purpose: validate read path end-to-end.
- Config: `audit.readFromPrototype = true`

### Stage 4: Write Path Switch
- All Staff writes go through the prototype repository.
- `sharedMockWriter` becomes read-only for backward reads.
- Purpose: full write migration.
- Config: `audit.writeToPrototype = true`

### Stage 5: Cleanup
- `sharedMockWriter` removed from production code.
- Retained only in test fixtures and mock factories.
- Purpose: eliminate duplication.

### Stage 6: Real Persistence Transition
- `persistenceMode` changes from `prototype_only` to `real_persisted`.
- Compliance review must be completed first.
- UI copy changes from "Prototype event" to official display.
- Config: `audit.mode = 'real_persisted'`

## Duplicate Prevention

| Mechanism | Where | How |
|-----------|-------|-----|
| Deterministic IDs | Event builder | `stableId(eventType, targetId, createdAt)` |
| Duplicate detection | Repository write | Check existing ID before append |
| Idempotent writes | Storage driver | Upsert semantics (update if exists) |
| Write result status | Service | Return `{ success, eventId, error }` for caller feedback |
| Display dedup | Adapter/presenter | Deduplicate by ID before rendering |

## Query Filters (mapped to AP-8B indexes)

| Filter Field | Storage Column | Index Used |
|-------------|---------------|------------|
| `eventType` | `event_type` | `idx_audit_events_event_type` |
| `actorRole` | `actor_role` | `idx_audit_events_actor_role` |
| `actorId` | `actor_id` | `idx_audit_events_actor_id` |
| `targetType` | `target_type` | `idx_audit_events_target` |
| `targetToken` | `target_display_token` | Full-text / secondary |
| `severity` | `severity` | `idx_audit_events_severity` |
| `persistenceMode` | `persistence_mode` | `idx_audit_events_persistence` |
| `createdAt` range | `created_at` | `idx_audit_events_created_at` |
| `sourceRoute` | `source_route` | `idx_audit_events_source_route` |
| Composite (admin) | multiple | `idx_audit_events_composite_admin` |

## Prototype Storage Options (Comparison)

| Option | Durability | Query Support | Setup Complexity | Recommended For |
|--------|-----------|--------------|-----------------|----------------|
| In-memory extension | None | Full (in-process) | Trivial | Tests, CI, dev |
| Session storage | Per-browser tab | Key-value only | Low | Browser-only prototype |
| File (JSON) | Disk-persistent | Scanning/loading | Low | Local dev, solo QA |
| SQLite | Disk-persistent | Full SQL | Medium | Team dev, staging |
| PostgreSQL | Disk-persistent, replicated | Full SQL + indexes | High | Production (after approval) |

**Current recommendation:** Use the existing `InMemoryAuditRepository` with an extended storage driver interface. Add `prototype_file` storage only when team-based QA requires shared state.

## Laravel/PHP Equivalent

- `AuditRepositoryInterface` → `App\Contracts\Audit\AuditRepositoryInterface`
- `PrototypeAuditRepository` → `App\Repositories\PrototypeAuditRepository`
- `AuditStorageDriver` → `App\Contracts\Audit\AuditStorageDriverInterface`
- `AuditPersistenceMapper` → `App\Mappings\AuditPersistenceMapping` (DTO to model)
- `AuditPersistenceSanitizer` → `App\Services\Audit\AuditPersistenceSanitizer`
- `AuditEvent` Eloquent model → `App\Models\AuditEvent`
- `AuditReason` Eloquent model → `App\Models\AuditReason`
- `AuditMetadataBlob` Eloquent model → `App\Models\AuditMetadataBlob`

## Non-Goals for This Phase

- ❌ No runtime implementation
- ❌ No storage driver code
- ❌ No repository implementation
- ❌ No database migrations
- ❌ No API endpoints
- ❌ No feature flag implementation
- ❌ No prototype file storage code
- ❌ No changes to Staff workflow
- ❌ No reason validation changes
- ❌ No notification changes

**These are deferred to AP-9A runtime implementation phase.**