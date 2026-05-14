# Audit Shadow Write Strategy AP-9B

**Planned on 2026-05-14.**

Branch: `architecture/audit-prototype-integration-plan-ap9b`

## Purpose

Define how audit events are safely written to both the existing `sharedMockWriter` and the new prototype storage driver simultaneously, without affecting current runtime behavior.

## Shadow Write Definition

A shadow write is a write operation that stores an event to **two targets simultaneously**:

1. **Primary target:** `sharedMockWriter` (existing, always active)
2. **Secondary target:** Prototype storage driver via `PrototypeAuditPersistenceService` (feature-flagged)

The primary target is always the source of truth. The secondary target is for diagnostic and validation purposes only.

## Source-of-Truth Rule

- `sharedMockWriter` is always the authoritative source of audit events for the current runtime.
- Prototype storage is subordinate and never promoted to source of truth in `prototype_only` mode.
- Admin display, exports, and Staff workflows always read from `sharedMockWriter` (via `adminAuditDisplayAdapter`) until a future phase explicitly changes this.
- No event is written to prototype storage without first being written to `sharedMockWriter`.

## Allowed Events for Shadow Write

- All event types with `persistenceMode: 'mock_only'` that pass through the Staff callback pipeline.
- These include from AP-6D:
  - `staff.document.reject`
  - `staff.document.request_replacement`
- Future events added to the pipeline are eligible if they use `prototype_only` mode.

## Blocked Events

- Events with `persistenceMode: 'real_persisted'` — never written in AP-9B.
- Events that fail metadata sanitizer checks (forbidden keys present).
- Events where the prototype feature flag is disabled.

## Feature Flag Requirements

Shadow writes are gated by:

```
auditPrototypeEnabled === true
AND auditPrototypeShadowWriteEnabled === true
```

If either flag is `false`, shadow writes are skipped.

## Write Sequence (Future Runtime)

```
1. Staff action triggers callback
2. Event builder constructs AuditEvent (as today)
3. sharedMockWriter.write(event) — primary write (as today)
4. If (shadow write flag enabled):
   a. PrivacyPolicy.check(event) — verify allowed
   b. MetadataSanitizer.sanitize(event.metadata) — strip forbidden fields
   c. PrototypeAuditPersistenceService.recordPrototypeEvent(event)
   d. Log success or non-blocking failure
5. Return Staff response (as today, no change)
```

## Error Handling

- Shadow write failure must **never** break the Staff/Admin workflow.
- Shadow write failures are logged as warnings only.
- If `auditPrototypeFailClosed` is `false` (default): shadow write errors are logged and ignored.
- If `auditPrototypeFailClosed` is `true`: shadow write errors throw (only for testing/debugging).

## Rollback Behavior

- Disabling `auditPrototypeShadowWriteEnabled` stops all shadow writes immediately.
- No cleanup of existing prototype data is required (shadow writes are additive).
- The existing `sharedMockWriter` path continues unaffected.
- Clear prototype storage via `PrototypeAuditPersistenceService.clearPrototypeEventsForTesting()` if needed.

## Privacy Checks Before Shadow Write

Before any shadow write, the following checks must pass:

1. **Metadata sanitizer:** `FORBIDDEN_AUDIT_METADATA_KEYS` must not be present.
2. **Privacy policy:** `AuditPolicyGuardContract.requiresAudit()` must return `true`.
3. **Mode check:** Event must have `persistenceMode: 'prototype_only'`.
4. **IP handling:** Raw IP must not be present in event metadata.
5. **Reason handling:** Reason text must not contain PII (validated upstream by Staff UI).

## Duplicate Prevention

- Each shadow write uses the same event ID as the primary write (deterministic).
- The prototype repository checks for duplicate IDs before writing.
- Duplicate writes are idempotent — overwriting is safe because data is identical.

## Metrics to Collect

When `auditPrototypeMetricsEnabled` is active:

| Metric | Description |
|--------|-------------|
| shadow_write_count | Total shadow writes attempted |
| shadow_write_success | Successful shadow writes |
| shadow_write_failure | Failed shadow writes (by error type) |
| shadow_write_latency_ms | Time taken for shadow write path |
| metadata_rejected_count | Events rejected due to forbidden metadata |
| duplicate_detected_count | Duplicate event IDs detected |

## QA Checklist

- [ ] Shadow writes do not affect Staff workflow timing.
- [ ] Shadow write failures are non-blocking.
- [ ] Prototype events contain no raw PII.
- [ ] Prototype events use same IDs as primary events.
- [ ] Metadata sanitizer rejects forbidden keys before shadow write.
- [ ] `sharedMockWriter` remains the source of truth after shadow writes.
- [ ] Disabling shadow write flag stops all shadow writes.
- [ ] Clearing prototype storage does not affect mock data.
- [ ] All 92 existing checks still pass.
- [ ] Route smoke tests pass with shadow writes enabled.