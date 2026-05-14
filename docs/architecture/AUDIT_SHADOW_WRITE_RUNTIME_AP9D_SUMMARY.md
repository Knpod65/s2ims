# Audit Shadow Write Runtime AP-9D Summary

## 1. Overview

AP-9D implements the first runtime slice of the audit shadow write integration defined in AP-9C. It wires optional, feature-flagged, non-blocking shadow writes for two Staff document actions into the existing prototype persistence skeleton created in AP-9A.

**AP-9D does not change any user-facing behavior by default.** All new code is gated behind disabled-by-default feature flags.

## 2. Why AP-9D Exists

AP-9C defined the architecture, guardrails, and insertion points for shadow writes. AP-9D realizes the smallest safe runtime implementation:

- Proves the shadow write pipeline works end-to-end in the prototype persistence skeleton
- Validates that feature flag gating operates correctly
- Confirms non-blocking failure behavior
- Provides developer-safe metrics for future analysis
- Establishes the pattern for future runtime phases (read comparison, Admin display switchover)

## 3. Files Created

| File | Purpose |
|------|---------|
| `src/lib/audit/shadow/auditShadowWriteMetrics.ts` | In-memory, PII-free metrics store for shadow write diagnostics |
| `src/lib/audit/shadow/auditShadowWriteGuards.ts` | Centralized 6-gate guard evaluation for shadow write eligibility |
| `src/lib/audit/shadow/auditShadowWriteService.ts` | Non-blocking shadow write service with testing factory |
| `docs/architecture/AUDIT_SHADOW_WRITE_RUNTIME_AP9D_SUMMARY.md` | This document |

## 4. Files Modified

| File | Change |
|------|--------|
| `src/lib/audit/index.ts` | Added exports for 3 new shadow modules |
| `src/app/staff/applications/[id]/page.tsx` | Wired shadow write calls into `onReject` and `onRequestReplacement` callbacks |
| `scripts/check-audit-events.mjs` | Added 15 AP-9D checks (92 → 107 total) |
| `docs/architecture/NEXT_RENOVATION_STEPS.md` | Added AP-9D result section |

## 5. Runtime Behavior

### Default Behavior (all flags disabled)

- `shadowWriteService.shadowWrite()` is called but immediately returns `skipped` with reason `prototype_disabled`
- No prototype storage interaction occurs
- No metrics are emitted
- Staff UI and toast behavior are identical to pre-AP-9D
- Admin display is unaffected

### When Flags Are Enabled

```
Staff clicks "Reject" or "Request Replacement"
  │
  ├──► onReject / onRequestReplacement callback fires (unchanged)
  │     → Build AuditEvent (unchanged)
  │     → sharedMockAuditWriter.write(event)  ← primary write, source of truth
  │
  ├──► [NEW] shadowWriteService.shadowWrite(event)  ← secondary, non-blocking
  │     ├── Gate 1: prototypeEnabled? → if false, skip
  │     ├── Gate 2: shadowWrites? → if false, skip
  │     ├── Gate 3: persistenceMode acceptable? → blocks real_persisted
  │     ├── Gate 4: assertNoRealPersistence() → defense-in-depth
  │     ├── Gate 5: eventType in allowed list? → only reject + replacement
  │     ├── Gate 6: Privacy guard passes? → validates metadata
  │     ├── Clone event with persistenceMode: 'prototype_only'
  │     ├── Call prototypePersistenceService.recordPrototypeEvent(clone)
  │     │     ├── Success → record 'written' metric
  │     │     └── Failure → catch, record 'failed' metric, log warning
  │     └── Return metric (non-blocking, never throws into UI)
  │
  └──► Toast fires (unchanged, regardless of shadow write result)
```

## 6. Feature Flag Behavior

| Flag | Default | Effect When `true` |
|------|---------|--------------------|
| `prototypeEnabled` | `false` | Allows prototype reads/writes; master switch |
| `shadowWrites` | `false` | Enables dual-write to mock + prototype storage |

Both flags must be `true` for shadow writes to execute. All other AP-9B flags (`readFromPrototype`, `adminCompareVisible`, `metricsEnabled`, `failClosed`) are defined in the config type but remain inactive in AP-9D.

## 7. Shadow Write Sequence

1. **Staff action fires** → callback builds event via existing `auditEventBuilder.ts`
2. **Primary write** → `sharedMockAuditWriter.write(event)` (unchanged, always executes)
3. **Shadow write** → `shadowWriteService.shadowWrite(event)` (new, non-blocking)
   - Evaluates 6 gates in order (see Guards section)
   - On skip/blocked: appends metric, returns immediately
   - On allowed: clones event to `prototype_only`, writes to prototype storage
   - Catches all errors, records metric, never propagates to UI
4. **UI continues** → toast, state updates, all identical to pre-AP-9D behavior

## 8. Source-of-Truth Preservation

- `sharedMockWriter` remains the **sole authoritative write path**
- Shadow writes are **secondary** — they happen after and in addition to primary writes
- No event is written to prototype storage without first being written to `sharedMockWriter`
- `adminAuditDisplayAdapter` continues reading exclusively from `sharedMockWriter`
- Prototype storage is never promoted to source of truth in AP-9D

## 9. Privacy and Safety Boundaries

### Forbidden Data (never in shadow writes)

Raw student ID, national ID, email, phone, bank account, raw IP, raw file names, full OCR text, unredacted reason with PII, uploaded file metadata (EXIF), arbitrary URLs, raw route params with PII

### Privacy Gate Sequence

1. Event builder validation (required fields) — upstream, before shadow write
2. Metadata sanitizer (`FORBIDDEN_AUDIT_METADATA_KEYS`) — in builder
3. Mode check — only `mock_only` or `prototype_only` accepted
4. Real persistence block — `assertNoRealPersistence()` always throws for `real_persisted`
5. Event type allowlist — only `staff.document.reject` and `staff.document.request_replacement`
6. Metadata privacy check — `validateAuditMetadata()` + raw IP check

### Failure Handling

| Class | Behavior |
|-------|----------|
| Flag disabled | Skip silently, no error |
| Unsupported event type | Block with safe message |
| Unsafe metadata | Block before write |
| `real_persisted` detected | Block with critical message |
| Prototype write failure | Log warning, record metric, continue |
| Unexpected exception | Catch, log, record metric, continue |

**Hard rule: Never throw into the UI.** All shadow write failures are caught and logged at `warn` level with `[AUDIT PROTOTYPE]` prefix.

## 10. Validation Results

| Check | Result |
|-------|--------|
| Build | ✅ 40/40 routes, 0 type errors |
| Token check | ✅ 4/4 passed |
| Audit/notification checks | ✅ 107/107 (was 92/92) |
| `/login` | ✅ 200 OK |
| `/admin/audit-log` | ✅ 200 OK |
| `/admin/dashboard` | ✅ 200 OK |
| `/staff/applications/app_001` | ✅ 200 OK |
| `/staff/applications/app_002` | ✅ 200 OK |
| Dev log | ✅ Clean |

## 11. What Is Intentionally Not Changed

- ❌ No real persistence (`real_persisted` remains blocked at type + guard level)
- ❌ No backend/API changes
- ❌ No database migrations
- ❌ No localStorage/sessionStorage/indexedDB
- ❌ No Admin read switch to prototype storage
- ❌ No Staff verify wiring
- ❌ No reason validation changes
- ❌ No `ReasonRequiredModal` introduction
- ❌ No notification behavior changes
- ❌ No PII exposure
- ❌ No mutation of `src/data/mock/audit-logs.ts`
- ❌ No changes to `DocumentVerificationPanel` props
- ❌ Start AP-10

## 12. Rollback

Immediate rollback — disable either feature flag:

```typescript
// Option A: Disable all prototype behavior
{ mode: 'mock_only', prototypeEnabled: false, shadowWrites: false, readFromPrototype: false }

// Option B: Disable shadow writes only (prototype storage remains available for future use)
{ mode: 'mock_only', prototypeEnabled: true, shadowWrites: false, readFromPrototype: false }
```

No code changes required. No data cleanup needed (in-memory prototype storage resets on process exit). `sharedMockWriter` path is never affected.

## 13. Recommended Next Step

**AP-9D-QA** — Formal documentation QA checkpoint for this implementation. Then:

1. **AP-9E** — Read comparison planning/runtime (separate phase, not started)
2. Do not start real persistence until prototype phase is proven stable and compliant
3. Do not start AP-10 until AP-9C/AP-9D evidence and compliance review complete