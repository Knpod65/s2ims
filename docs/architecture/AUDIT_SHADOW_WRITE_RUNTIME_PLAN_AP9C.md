# Audit Shadow Write Runtime Plan AP-9C

**Planned on 2026-05-14.**

Branch: `architecture/audit-shadow-write-runtime-plan-ap9c`

## 1. Overview

AP-9C is a **documentation-only** plan that defines how the AP-9A prototype persistence runtime skeleton should be integrated into the system as a future runtime phase using feature-flagged, non-blocking shadow writes.

This plan does **not** implement any runtime integration. It defines the architecture, guardrails, sequencing, and safety boundaries for a future implementation phase.

## 2. Why AP-9C Exists

AP-9A delivered a disabled-by-default prototype persistence runtime skeleton. AP-9B defined the integration architecture at a high level. Before any runtime integration is attempted, we need a detailed plan that answers:

1. Which Staff audit-producing actions are candidates for shadow writes?
2. Where exactly should shadow write logic be inserted in future code?
3. How must feature flags gate every prototype write?
4. How must prototype write failure be non-blocking?
5. How does `sharedMockWriter` remain the single source of truth?
6. How is prototype storage prevented from becoming an Admin display source?
7. How do privacy gates execute before every prototype write?
8. How does rollback work by disabling flags?
9. How should QA prove zero user-facing behavior change?

## 3. Current State After AP-9A/AP-9B

| Component | Implementation | Status |
|-----------|---------------|--------|
| `AuditPersistenceConfig` | `src/lib/audit/storage/auditPersistenceConfig.ts` | Disabled by default |
| `AuditStorageDriverContract` | `src/lib/audit/storage/auditStorageDriver.ts` | Interface defined |
| `InMemoryPrototypeAuditStorageDriver` | `src/lib/audit/storage/inMemoryPrototypeAuditStorageDriver.ts` | In-memory, disabled |
| `PrototypeAuditRepository` | `src/lib/audit/repositories/prototypeAuditRepository.ts` | Wraps driver |
| `AuditPersistenceFeatureGuard` | `src/lib/audit/guards/auditPersistenceFeatureGuard.ts` | Blocks by default |
| `PrototypeAuditPersistenceService` | `src/lib/audit/services/prototypeAuditPersistenceService.ts` | No-op when disabled |
| `sharedMockWriter` | `src/lib/audit/sharedMockWriter.ts` | Active write path |
| `mockAuditWriter` | `src/lib/audit/mockAuditWriter.ts` | Unchanged |
| `adminAuditDisplayAdapter` | `src/lib/audit/adminAuditDisplayAdapter.ts` | Active read path |
| `AuditDisplayPresenter` | `src/lib/audit/presenters/auditDisplayPresenter.ts` | Display boundary |
| `auditEventBuilder` | `src/lib/audit/auditEventBuilder.ts` | Builds events with metadata guard |
| `auditMetadataRules` | `src/lib/audit/auditMetadataRules.ts` | Forbidden key enforcement |

## 4. Runtime Integration Goal

Enable prototype persistence in a controlled, reversible manner for specific Staff audit-producing actions, using shadow writes that:

- Are secondary to `sharedMockWriter`
- Are gated behind feature flags
- Are non-blocking on failure
- Pass through privacy guards before write
- Do not affect Admin display, Staff UI, or notification behavior
- Produce developer-safe metrics only

## 5. Explicit Non-Goals

- ❌ No runtime integration in this phase.
- ❌ No `real_persisted` mode — `prototype_only` only.
- ❌ No backend/API changes.
- ❌ No database migrations.
- ❌ No Staff callback modifications.
- ❌ No Staff verify wiring.
- ❌ No reason validation changes.
- ❌ No `ReasonRequiredModal`.
- ❌ No notification behavior changes.
- ❌ No PII exposure.
- ❌ No `src/app/*` or `src/components/*` modifications.
- ❌ No `package.json` changes.
- ❌ No mock fixture mutations.
- ❌ Do not replace `sharedMockWriter`.
- ❌ Do not replace `adminAuditDisplayAdapter`.
- ❌ Do not change Admin display read path.
- ❌ Do not start AP-10.

## 6. Source-of-Truth Rule

- `sharedMockWriter` is **always** the authoritative source of audit events for the current runtime.
- Prototype storage is subordinate and **never** promoted to source of truth in `prototype_only` mode.
- Admin display, exports, and Staff workflows **always** read from `sharedMockWriter` (via `adminAuditDisplayAdapter`) until a future phase explicitly changes this with separate approval.
- No event is written to prototype storage without first being written to `sharedMockWriter`.
- The write sequence is: **sharedMockWriter first, then shadow write second**.

## 7. Future Shadow Write Architecture

```
Staff Action (e.g., document reject)
  │
  ├──► [Current Path — always active]
  │     Staff callback → buildAuditEvent() → sharedMockWriter.write(event)
  │     → toast/UI response (unchanged)
  │
  └──► [Future Path — feature-flagged, prototype only]
        if (canUsePrototypePersistence(config) && canShadowWrite(config))
          → PrivacyGate.check(event)
          → MetadataSanitizer.sanitize(event.metadata)
          → PrototypeAuditPersistenceService.recordPrototypeEvent(event)
            → PrototypeAuditRepository.append(event)
              → InMemoryPrototypeAuditStorageDriver.append(record)
          → Log non-blocking success/failure
          → Record developer-safe metric (no PII)
          [UI flow continues regardless of shadow write result]
```

## 8. Feature Flag Gate Sequence

All flags must be checked in order. If any check fails, shadow write is skipped.

| Step | Gate | Flag/Check | Failure Action |
|------|------|------------|---------------|
| 1 | Master switch | `auditPrototypeEnabled` === `true` | Skip |
| 2 | Shadow write enabled | `auditPrototypeShadowWriteEnabled` === `true` | Skip |
| 3 | Mode check | `persistenceMode === 'prototype_only'` | Skip |
| 4 | Real persistence blocked | `assertNoRealPersistence()` must not throw | Skip (error logged) |
| 5 | Privacy guard | `FORBIDDEN_AUDIT_METADATA_KEYS` not present | Skip event |
| 6 | Event type allowed | Action is in candidate list | Skip |
| 7 | Storage driver available | `isEnabled()` returns `true` | Skip |
| 8 | Execute shadow write | `prototypePersistenceService.record(event)` | Log warning, continue |

## 9. Candidate Write Points

AP-9C defines the following Staff actions as candidates for future shadow write integration. These are **not implemented yet** — they are planned insertion points for a future runtime phase.

### 9.1 Staff Document Rejection

- **Current callback:** `onReject` in `DocumentVerificationPanel`
- **Current flow:** `onReject` → toast only (no audit write in current code)
- **Future shadow write insertion:** After `sharedMockWriter.write()` (when AP-6D runtime is implemented), add prototype shadow write
- **Builder:** `buildStaffDocumentRejectEvent()` from `auditEventBuilder.ts`
- **Required flags:** `auditPrototypeEnabled`, `auditPrototypeShadowWriteEnabled`

### 9.2 Staff Document Replacement Request

- **Current callback:** `onRequestReplacement` in `DocumentVerificationPanel`
- **Current flow:** `onRequestReplacement` → toast only (no audit write in current code)
- **Future shadow write insertion:** After `sharedMockWriter.write()` (when AP-6D runtime is implemented), add prototype shadow write
- **Builder:** `buildStaffDocumentReplacementRequestEvent()` from `auditEventBuilder.ts`
- **Required flags:** `auditPrototypeEnabled`, `auditPrototypeShadowWriteEnabled`

## 10. Staff Document Reject Future Flow

```
Staff clicks "Reject" on DocumentVerificationPanel
  │
  ├──► onReject callback fires (unchanged)
  │     → Staff UI shows toast: "Document rejected" (unchanged)
  │
  ├──► Build AuditEvent using buildStaffDocumentRejectEvent()
  │     → Event fields: eventType, actorId, actorRole, targetType,
  │       targetId, targetDisplayToken, metadata, reason, etc.
  │     → Metadata sanitized against FORBIDDEN_AUDIT_METADATA_KEYS
  │     → persistenceMode: 'prototype_only'
  │
  ├──► Write to sharedMockWriter (source of truth)
  │     → sharedMockAuditWriter.write(event)
  │     → [Future: shared writer persists to mock store]
  │
  ├──► If prototype flags allow:
  │     try {
  │       prototypePersistenceService.recordPrototypeEvent(event)
  │       → PrivacyGuard.check(event) — pass
  │       → MetadataSanitizer.sanitize(event.metadata) — pass
  │       → PrototypeAuditRepository.append(event)
  │       → InMemoryPrototypeAuditStorageDriver.append(record)
  │       → recordMetric('shadow_write_success')
  │     } catch (error) {
  │       → logWarning(`Shadow write failed: ${error.message}`)
  │       → recordMetric('shadow_write_failure')
  │       → [UI continues — no impact]
  │     }
  │
  └──► Return Staff response (toast, UI update) — unchanged
```

## 11. Staff Document Replacement Request Future Flow

```
Staff clicks "Request Replacement" on DocumentVerificationPanel
  │
  ├──► onRequestReplacement callback fires (unchanged)
  │     → Staff UI shows toast: "Replacement requested" (unchanged)
  │
  ├──► Build AuditEvent using buildStaffDocumentReplacementRequestEvent()
  │     → Event fields: eventType, actorId, actorRole, targetType,
  │       targetId, targetDisplayToken, metadata, reason, etc.
  │     → Metadata sanitized against FORBIDDEN_AUDIT_METADATA_KEYS
  │     → persistenceMode: 'prototype_only'
  │
  ├──► Write to sharedMockWriter (source of truth)
  │     → sharedMockAuditWriter.write(event)
  │     → [Future: shared writer persists to mock store]
  │
  ├──► If prototype flags allow:
  │     try {
  │       prototypePersistenceService.recordPrototypeEvent(event)
  │       → PrivacyGuard.check(event) — pass
  │       → MetadataSanitizer.sanitize(event.metadata) — pass
  │       → PrototypeAuditRepository.append(event)
  │       → InMemoryPrototypeAuditStorageDriver.append(record)
  │       → recordMetric('shadow_write_success')
  │     } catch (error) {
  │       → logWarning(`Shadow write failed: ${error.message}`)
  │       → recordMetric('shadow_write_failure')
  │       → [UI continues — no impact]
  │     }
  │
  └──► Return Staff response (toast, UI update) — unchanged
```

## 12. Excluded Actions

The following actions are **not** candidates for shadow write in AP-9C:

| Action | Reason |
|--------|--------|
| `staff.document.verify` | Verify action deferred to AP-6E; not yet wired |
| Admin `role.assign` | Not triggered by Staff UI; separate governance path |
| Admin `role.remove` | Not triggered by Staff UI; separate governance path |
| Admin `export.generate` | Backend/API not in scope |
| Admin `permission.change` | Not a Staff-facing action |
| `provider.shortlist.request` | Provider workflow — separate review |
| `provider.shortlist.submit_reason` | Provider workflow — separate review |
| `staff.disclosure.approve_identity_reveal` | Requires separate privacy review |
| `staff.disclosure.reject_identity_reveal` | Requires separate privacy review |
| `staff.match.override_decision` | Not currently wired to audit |
| `system.ocr.process_document` | System-level; requires backend integration |
| `system.data_quality.flag` | System-level; requires backend integration |
| `system.integration.sync_failed` | System-level; requires backend integration |

## 13. Failure Handling Model

### Failure Classes

| Class | Example | Severity | Behavior |
|-------|---------|----------|----------|
| Flag disabled | `auditPrototypeEnabled` is `false` | Info | Skip silently |
| Event type not allowed | Action not in candidate list | Info | Skip silently |
| Unsafe metadata | Forbidden key detected | Warning | Skip event, log warning |
| Duplicate ID | Event ID already in prototype storage | Warning | Skip, increment counter |
| Prototype driver unavailable | In-memory driver error | Error | Log warning, continue |
| Prototype write failure | Unexpected error during append | Error | Log warning, continue |
| Unexpected persistence mode | `real_persisted` event reaches guard | Critical | Throw, block write |
| Privacy gate violation | PII bypasses sanitizer | Critical | Block, alert, rollback trigger |

### Failure Behavior

- **Never throw into UI**: All shadow write errors are caught and logged.
- **Never block Staff action**: The `try/catch` wrapper ensures UI flow continues.
- **Never prevent toast**: Staff feedback is independent of shadow write result.
- **Never change Admin display**: `adminAuditDisplayAdapter` is not affected.
- **Never retry infinitely**: Single attempt, log result, move on.
- **Never send notification side effects**: No email, push, or webhook on failure.
- **Log developer-safe warning only**: No PII in log messages.
- **Metrics must be aggregate and PII-free**: Counts only, no event details.

### Try/Catch Pattern (Future Implementation)

```typescript
// Pseudo-code — not implementation
try {
  const result = await prototypePersistenceService.recordPrototypeEvent(event)
  if (!result.success) {
    logger.warn(`[AUDIT PROTOTYPE] Shadow write failed: ${result.reason}`)
    recordMetric('shadow_write_failure', { reason: result.reason })
  } else {
    recordMetric('shadow_write_success')
  }
} catch (error) {
  logger.warn(`[AUDIT PROTOTYPE] Shadow write error: ${error.message}`)
  recordMetric('shadow_write_error', { type: error.constructor?.name })
}
```

## 14. Privacy Enforcement Model

### Privacy Gate Sequence (Pre-Write)

Before any shadow write, the following gates execute in order:

1. **Event builder validation** — Rejects events with missing required fields.
2. **Metadata sanitizer** — Rejects events with forbidden metadata keys (`FORBIDDEN_AUDIT_METADATA_KEYS`).
3. **Privacy policy guard** — Validates actor/target/action authorization.
4. **Mode check** — Only `prototype_only` events are accepted.
5. **Real persistence block** — `assertNoRealPersistence()` always throws for `real_persisted`.
6. **IP check** — Raw IP is not included in the shadow write payload.
7. **Reason text separation** — Reason stored separately, not mixed into metadata.

If any gate fails, the shadow write is skipped. The primary `sharedMockWriter` write has already completed and is unaffected.

### Forbidden Data in Shadow Writes

| Data Class | Examples |
|------------|----------|
| Raw student ID | `650912345`, `S-2345` |
| National ID | Government-issued identifier |
| Email address | `user@example.com` |
| Phone number | `+66-812-345-678` |
| Bank account | Account numbers, routing codes |
| Raw IP address | `192.168.1.1` |
| Raw uploaded file name | `สมัครเรียน_นางสาวก_1234.pdf` |
| Raw document / file path | `/uploads/students/...` |
| Full OCR text | Complete document text content |
| Unredacted reason with PII | Reason containing student name + ID |
| Uploaded file metadata | EXIF data, embedded names |
| Arbitrary URL | May contain PII in query params |
| Raw route parameter with PII | URL segments with identifiers |

### Safe Data in Shadow Writes

| Data Class | Examples |
|------------|----------|
| Target display token | `Student #S-2345` |
| Actor role | `staff`, `admin`, `provider` |
| Event type | `staff.document.reject` |
| Document type | `transcript`, `id_card` |
| Reason category/code | `INSUFFICIENT_DOCS`, `INVALID_FORMAT` |
| Source route name | `/staff/applications/app_001` |
| Policy version | `v1`, `v2` |
| Severity | `info`, `low`, `medium`, `high`, `critical` |
| Persistence mode | `prototype_only` |
| Timestamps | `2026-05-14T10:30:00.000Z` |
| Actor internal ID | App-internal UUID |

## 15. Admin Display Impact

- **No changes** to Admin display in AP-9C.
- Admin UI continues reading exclusively from `adminAuditDisplayAdapter`.
- Prototype storage is **not** queried for display purposes.
- No "prototype" banner, label, or indicator appears in the UI.
- No Admin UI flag indicates prototype data presence to end users.
- Comparison of prototype vs. mock data is deferred to a future phase (AP-9B read comparison, not activated).

## 16. Rollback Plan

### Immediate Rollback

1. Set `auditPrototypeEnabled` to `false` in config.
2. Set `auditPrototypeShadowWriteEnabled` to `false` in config.
3. Restart application if config requires restart.
4. Verify `sharedMockWriter` path is functioning.

### Verification After Rollback

5. Staff actions still record to mock writer.
6. Admin display shows mock + fixture data.
7. All routes return 200 OK.
8. Run full check suite (`npm run check:audit-events`).
9. Verify route smoke tests pass.
10. Verify dev log is clean.

### Why Rollback Is Always Possible

- All flags default to `false`.
- `sharedMockWriter` is never replaced — it is always the source of truth.
- No data mutations occur through flags alone.
- Shadow writes are additive — they do not modify existing mock data.
- Prototype storage (`InMemoryPrototypeAuditStorageDriver`) is in-memory only and resets on process exit.

## 17. QA Gates

Before enabling any shadow write in a future runtime phase:

- [ ] Build passes 40/40
- [ ] Token check passes 4/4
- [ ] All 92 audit/notification checks pass
- [ ] All 5 smoke routes return 200 OK
- [ ] Dev log clean (no errors, no warnings)
- [ ] No PII in shadow write output
- [ ] No forbidden metadata in prototype storage
- [ ] No duplicate audit events detected
- [ ] Shadow write failure does not block UI
- [ ] `sharedMockWriter` remains sole write path
- [ ] Rollback tested in staging
- [ ] Privacy review completed

## 18. Laravel/PHP-Inspired Mapping

### TypeScript → Laravel/PHP

| TypeScript File | Laravel/PHP Equivalent |
|----------------|----------------------|
| `auditStorageDriver.ts` | `App\Contracts\Audit\AuditStorageDriverInterface` |
| `auditPersistenceConfig.ts` | `config/audit.php` |
| `inMemoryPrototypeAuditStorageDriver.ts` | `App\Storage\InMemoryAuditStorageDriver` |
| `prototypeAuditRepository.ts` | `App\Repositories\PrototypeAuditRepository` |
| `auditPersistenceFeatureGuard.ts` | `App\Policies\AuditPersistencePolicy` |
| `prototypeAuditPersistenceService.ts` | `App\Services\Audit\PrototypeAuditPersistenceService` |
| `auditEventBuilder.ts` | `App\Builders\AuditEventBuilder` |
| `auditMetadataRules.ts` | Server-side metadata validation middleware |
| `sharedMockWriter.ts` | `App\Services\Audit\SharedMockAuditWriter` |
| `adminAuditDisplayAdapter.ts` | `App\Http\Resources\AuditEventResource` |
| `auditDisplayPresenter.ts` | Presenter / Formatter layer |

### Config Mapping (`config/audit.php`)

```php
return [
    // Existing from AP-9A
    'enabled' => env('AUDIT_PERSISTENCE_ENABLED', false),
    'mode' => env('AUDIT_PERSISTENCE_MODE', 'mock_only'),
    'write_shadow' => env('AUDIT_PERSISTENCE_SHADOW_WRITE', false),
    'read_from_prototype' => env('AUDIT_PERSISTENCE_READ_COMPARE', false),

    // AP-9C shadow write flags
    'shadow_write_enabled' => env('AUDIT_SHADOW_WRITE_ENABLED', false),

    // Metrics
    'metrics_enabled' => env('AUDIT_PROTOTYPE_METRICS', false),

    // Fail behavior
    'fail_closed' => env('AUDIT_PROTOTYPE_FAIL_CLOSED', false),
];
```

## 19. Recommended Next Phase

After AP-9C plan review and approval:

1. **AP-9C-QA** — Formal documentation QA checkpoint (this plan should be reviewed by a second reviewer).
2. **AP-9D** — Shadow write runtime implementation:
   - Wire shadow write into existing Staff callbacks
   - Implement try/catch wrapper in callback handlers
   - Add developer-safe metrics
   - Verify all feature flags in config
   - Test rollback path
3. Do not start real persistence.
4. Do not start AP-10.

## Appendix A: Full Flag Dependency Graph

```
auditPrototypeEnabled (master switch)
  └── auditPrototypeShadowWriteEnabled
        └── [shadow writes active]
  └── auditPrototypeReadCompareEnabled (separate, not in AP-9C scope)
        └── auditPrototypeAdminCompareVisible (separate, not in AP-9C scope)
  └── auditPrototypeMetricsEnabled
  └── auditPrototypeFailClosed
```

## Appendix B: Sequence Diagram (Conceptual)

```
Staff          Backend           sharedMockWriter    PrototypeService    PrototypeDriver
  │                │                     │                     │                │
  │── reject ─────►│                     │                     │                │
  │                │── build event ────►│                     │                │
  │                │                     │── write(event) ────►│                │
  │                │                     │                     │                │
  │                │                     │                     │── if flags ──►│
  │                │                     │                     │    ├── check ──►│
  │                │                     │                     │    ├── privacy ─►│
  │                │                     │                     │    ├── append──►│
  │                │                     │                     │    └── result ──►│
  │                │                     │                     │                │
  │                │◄── toast ───────────│                     │                │
  │◄── UI update ──│                     │                     │                │
```