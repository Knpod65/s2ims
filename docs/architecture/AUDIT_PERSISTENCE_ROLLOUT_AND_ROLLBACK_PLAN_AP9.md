# Audit Persistence Rollout and Rollback Plan AP-9

**Planned on 2026-05-14.**

Branch: `architecture/audit-prototype-persistence-plan-ap9`

## Purpose

Define the staged rollout and rollback strategy for transitioning from mock-only audit events to prototype persistence. This plan ensures that every stage is reversible and that no production data is at risk during the transition.

This is a **documentation-only** phase. No runtime code is created or modified.

## Rollout Stages

### Stage 0: Current State — Mock Only (Completed)

- All events are `persistenceMode: 'mock_only'`.
- In-memory writer (`sharedMockWriter`) holds events for the current session only.
- Admin display reads from mock writer + fixture data through the adapter/presenter.
- No data survives page reload.
- **Exit criteria:** AP-6D runtime wiring complete, QA passed.

### Stage 1: Prototype Storage Disabled Behind Config

- Add `AuditStorageDriver` interface and `InMemoryAuditStorageDriver`.
- Feature flag `audit.persistence.enabled = false` (default).
- No events are written to the prototype driver yet.
- Purpose: validate the storage contract and driver wiring in isolation.
- **Exit criteria:** Storage driver contract tests pass. Build and token checks pass.

### Stage 2: Prototype Storage Write Shadow Mode

- `audit.persistence.enabled = true`, `audit.persistence.writeShadow = true`.
- Events are written to **both** the existing `sharedMockWriter` **and** the prototype storage driver.
- Admin display still reads from `sharedMockWriter` only.
- Prototype data is written but never displayed.
- Purpose: verify write correctness, ID generation, and sanitizer output without display impact.
- **Exit criteria:** Row counts match between mock writer and prototype storage across a test session. No forbidden metadata detected.

### Stage 3: Admin Read Comparison Mode

- `audit.persistence.readFromPrototype = true` (experimental flag).
- Admin display reads from **both** sources and shows a diagnostic badge: "Prototype: N events | Mock: M events".
- No user-facing behavior change — comparison is diagnostic only.
- Purpose: verify data integrity and presenter output for prototype-sourced rows.
- **Exit criteria:** Presenter produces identical `AuditDisplayRow` shape for both data sources. Counts and field values match.

### Stage 4: Admin Prototype Read Mode

- `audit.persistence.readFromPrototype = true` (production flag).
- Admin display switches to reading from the prototype repository exclusively.
- `sharedMockWriter` remains writable (backward compatibility).
- Purpose: validate the full read path end-to-end through repository → presenter → display.
- **Exit criteria:** Admin display renders correctly with prototype data. All existing UI behaviors preserved. Dev log clean.

### Stage 5: Write Path Switch

- `audit.persistence.writeToPrototype = true`.
- All Staff writes go through the prototype repository → storage driver.
- `sharedMockWriter` becomes read-only for backward compatibility reads.
- Purpose: full write migration to prototype storage.
- **Exit criteria:** All Staff actions produce prototype-persisted events. Mock writer is no longer the write path.

### Stage 6: Cleanup

- `sharedMockWriter` removed from production code.
- Retained only in test fixtures and mock factories.
- Prototype storage becomes the sole write and read path.
- **Exit criteria:** No references to `sharedMockWriter` in production code paths. Build passes. Tests pass.

### Stage 7: Real Persistence Transition (Future — Not in AP-9)

- `persistenceMode` changes from `prototype_only` to `real_persisted`.
- Requires separate compliance review and explicit approval.
- UI copy changes from "Prototype event" to official display language.
- Database migrations executed (per AP-8B schema plan).
- **Not part of AP-9.** Deferred to a future phase.

## Feature Flags / Config

```typescript
// Future config structure (not implemented)
auditPersistence: {
  enabled: false,           // Master switch — default off
  mode: 'mock_only',        // 'mock_only' | 'prototype_only' | 'real_persisted'
  writeShadow: false,       // Write to both mock + prototype simultaneously
  readFromPrototype: false, // Read from prototype storage for Admin display
  writeToPrototype: false,  // Route Staff writes through prototype repository
  allowExport: false,       // Enable CSV/JSON export (prototype data only)
  allowReasonStorage: false,// Store reason text separately
  allowMetadataStorage: false // Store sanitized metadata
}
```

```php
// Future Laravel config equivalent: config/audit.php
return [
    'enabled' => env('AUDIT_PERSISTENCE_ENABLED', false),
    'mode' => env('AUDIT_PERSISTENCE_MODE', 'mock_only'),
    'write_shadow' => false,
    'read_from_prototype' => false,
    'write_to_prototype' => false,
    'allow_export' => false,
    'allow_reason_storage' => false,
    'allow_metadata_storage' => false,
];
```

## Rollback Triggers

Any of the following conditions should trigger rollback:

| Trigger | Severity | Detection Method |
|---------|----------|-----------------|
| Build or type-check failure | High | CI/CD pipeline |
| Route returning non-200 | High | Route smoke tests |
| Duplicate audit rows detected | Medium | Row count comparison, dedup check |
| PII detected in stored data | Critical | Privacy grep on storage |
| Forbidden metadata key stored | Critical | Sanitizer validation log |
| Staff workflow regression | High | Manual QA, automated checks |
| Admin display regression | High | Visual diff, route smoke |
| Export producing unsafe data | High | Export QA review |
| Policy bypass detected | Critical | Audit of write path |
| Dev log warnings or errors | Medium | Log grep |

## Rollback Actions

1. **Immediate:** Disable feature flags — set `audit.persistence.enabled = false`.
2. **Display fallback:** Admin read path reverts to `sharedMockWriter` (existing path).
3. **Write fallback:** Staff callbacks revert to writing through `sharedMockWriter` only.
4. **Storage:** Stop prototype write path. Clear prototype storage only if safe and approved.
5. **Preserve:** Mock-only flow must remain fully functional at all times.
6. **Document:** Record incident, trigger, and resolution in daily report.

**Rollback must never break the existing mock-only flow.** The mock writer is the safety net.

## QA Gates

Each stage transition requires passing all gates:

| Gate | Tool / Method | Expected Result |
|------|--------------|-----------------|
| Build check | `npm run build` | 40/40 routes, 0 type errors |
| Token check | `npm run check:tokens` | 4/4 passed |
| Audit event check | `npm run check:audit-events` | All checks passed |
| Route smoke | Manual or automated | `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, `/staff/applications/app_002` — all 200 OK |
| Dev log grep | `grep -iE "(error|warn)"` | No output |
| Privacy grep | Search for forbidden PII patterns in stored data | No matches |
| Manual browser QA | Open pages, trigger actions | No visual regression, no errors |
| Export QA | Attempt export in prototype mode | Disabled or safe empty state |
| Rollback test | Disable feature flag | System reverts to mock-only seamlessly |

## Copy Requirements

- Prototype storage must **not** be labeled as "official" or "permanent" in any UI copy.
- Events in `prototype_only` mode must display a "Prototype" badge or banner.
- The phrase "official audit evidence" must not appear until `real_persisted` mode is approved.
- Export filenames for prototype data must include `-prototype` suffix.
- Tooltips and help text must clarify that prototype data is non-official and may be cleared.

## Laravel / PHP Mapping

| Concept | Laravel / PHP Equivalent |
|---------|--------------------------|
| Feature flags | `config/audit.php` + `env()` variables |
| Stage transition logic | Maintenance command or migration seed |
| Prototype storage driver | `App\Contracts\Audit\AuditStorageDriverInterface` |
| Shadow write | Dual-dispatch in `AuditService` |
| Rollback command | `php artisan audit:rollback-prototype` |
| Diagnostic comparison | `php artisan audit:compare-mock-prototype` |
| Clear prototype storage | `php artisan audit:clear-prototype` |

## Non-Goals

- ❌ No real persistence (`real_persisted` mode) in AP-9.
- ❌ No database migration.
- ❌ No backend API endpoint.
- ❌ No changes to Staff workflow.
- ❌ No notification behavior changes.
- ❌ No reason validation changes.
- ❌ No ReasonRequiredModal.
- ❌ No export enablement (export remains disabled in prototype mode).