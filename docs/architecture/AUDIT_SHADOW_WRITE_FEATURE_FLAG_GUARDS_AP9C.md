# Audit Shadow Write Feature Flag Guards AP-9C

**Planned on 2026-05-14.**

Branch: `architecture/audit-shadow-shadow-write-runtime-plan-ap9c`

## 1. Purpose

Define the feature flag guard sequence that must be evaluated before every prototype shadow write in a future runtime phase. This document specifies which flags are required, their defaults, forbidden combinations, and the guard evaluation order.

## 2. Required Flags

| Flag | TypeScript Config Key | Default | Role in AP-9C |
|------|----------------------|---------|--------------|
| `auditPrototypeEnabled` | `prototypeEnabled` | `false` | Master switch — all prototype behavior requires this |
| `auditPrototypeShadowWriteEnabled` | `shadowWrites` | `false` | Enables dual-write to both `sharedMockWriter` and prototype storage |
| `auditPrototypeMetricsEnabled` | `metricsEnabled` | `false` | Enables developer-safe metric emission for shadow write analysis |

## 3. Flags NOT Active in AP-9C

The following flags from the AP-9B feature flag matrix are **not** activated in AP-9C scope:

| Flag | Reason |
|------|--------|
| `auditPrototypeReadCompareEnabled` | Read comparison is separately planned; not activated in AP-9C |
| `auditPrototypeAdminCompareVisible` | Admin UI comparison is out of scope for write integration |
| `auditPrototypeFailClosed` | Fail-closed is for testing only; fail-open is the default for user-facing prototype flows |

## 4. Default Values

```typescript
// AP-9C defaults — all flags disabled
const DEFAULT_AUDIT_PROTOTYPE_CONFIG = {
  auditPrototypeEnabled: false,
  auditPrototypeShadowWriteEnabled: false,
  auditPrototypeMetricsEnabled: false,
} as const
```

When all flags are `false`, the system behaves **exactly** as it does today. No shadow writes, no metrics, no prototype interaction.

## 5. Gate Order

Every shadow write attempt must pass through the following gates **in order**. If any gate fails, the shadow write is skipped entirely.

| Step | Gate | Check | Failure Action |
|------|------|-------|---------------|
| 1 | Master switch | `auditPrototypeEnabled === true` | Skip (log debug) |
| 2 | Shadow write enabled | `auditPrototypeShadowWriteEnabled === true` | Skip (log debug) |
| 3 | Persistence mode | Event `persistenceMode === 'prototype_only'` | Skip (log warning) |
| 4 | Real persistence blocked | `assertNoRealPersistence(event)` does not throw | Skip (log critical) |
| 5 | Privacy gate passed | No forbidden metadata keys in event | Skip event (log warning) |
| 6 | Event type allowed | Action is in AP-9C candidate list | Skip (log debug) |
| 7 | Storage health | `prototypePersistenceService.isEnabled()` returns `true` | Skip (log warning) |
| 8 | Execute shadow write | `prototypePersistenceService.recordPrototypeEvent(event)` | Log result |

**All gates must pass for a shadow write to execute.**

## 6. Forbidden Flag States

| Combination | Why Forbidden |
|-------------|--------------|
| `auditPrototypeEnabled: false`, `auditPrototypeShadowWriteEnabled: true` | Shadow writes require the master switch |
| `auditPrototypeEnabled: false`, `auditPrototypeMetricsEnabled: true` | Metrics without prototype enabled produce no data |
| Any flag `true` with `mode: 'real_persisted'` | Real persistence is not available in AP-9A/AP-9C runtime |
| `auditPrototypeAdminCompareVisible: true` during AP-9C | Admin comparison is out of scope for write integration |
| `auditPrototypeReadCompareEnabled: true` during AP-9C | Read comparison is separate phase, not activated here |
| `auditPrototypeFailClosed: true` in user-facing prototype | Fail-closed risks blocking Staff workflows |

When a forbidden combination is detected, the **more restrictive** flag takes effect (i.e., the shadow write is skipped).

## 7. Fail-Open vs Fail-Closed

| Scenario | Behavior |
|----------|----------|
| Flag disabled (default) | **Fail-open**: no shadow write, no error, system behaves as today |
| Shadow write failure | **Fail-open**: log warning, continue UI flow |
| Unsupported persistence mode | **Fail-open**: skip write, log warning |
| Privacy gate failure | **Fail-closed for the write**: event not written to prototype, but sharedMockWriter already succeeded |
| `real_persisted` attempted | **Fail-closed**: throw error, block entirely |

The default behavior for all user-facing prototype flows is **fail-open** — errors in the shadow path must never degrade the primary `sharedMockWriter` path.

## 8. Runtime Guard Pseudo-Code

```typescript
// Pseudo-code — no implementation in AP-9C
// This represents what the future runtime guard would look like

async function attemptShadowWrite(event: AuditEvent, config: AuditPrototypeConfig): Promise<void> {
  // Gate 1: Master switch
  if (!config.auditPrototypeEnabled) return

  // Gate 2: Shadow write enabled
  if (!config.auditPrototypeShadowWriteEnabled) return

  // Gate 3: Mode check
  if (event.persistenceMode !== 'prototype_only') {
    console.warn('[AUDIT PROTOTYPE] Shadow write skipped: not prototype_only mode')
    return
  }

  // Gate 4: Real persistence blocked
  try {
    assertNoRealPersistence(event)
  } catch {
    console.error('[AUDIT PROTOTYPE] Shadow write blocked: real_persisted detected')
    return
  }

  // Gate 5: Privacy gate
  const privacyResult = validateAuditMetadata(event.metadata, {
    actorRole: event.actorRole,
    targetType: event.targetType,
  })
  if (!privacyResult.valid) {
    console.warn('[AUDIT PROTOTYPE] Shadow write skipped: forbidden metadata')
    return
  }

  // Gate 6: Event type allowed
  if (!AP9C_CANDIDATE_ACTIONS.includes(event.eventType)) {
    console.debug('[AUDIT PROTOTYPE] Shadow write skipped: action not in candidate list')
    return
  }

  // Gate 7: Service available
  if (!prototypePersistenceService.isEnabled()) {
    console.warn('[AUDIT PROTOTYPE] Shadow write skipped: service disabled')
    return
  }

  // Gate 8: Execute shadow write (non-blocking)
  try {
    const result = await prototypePersistenceService.recordPrototypeEvent(event)
    if (!result.success) {
      console.warn(`[AUDIT PROTOTYPE] Shadow write failed: ${result.reason}`)
    }
    // Record developer-safe metric
    recordShadowWriteMetric(result.success ? 'success' : 'failure', event.eventType)
  } catch (error) {
    console.warn(`[AUDIT PROTOTYPE] Shadow write error: ${(error as Error).message}`)
    recordShadowWriteMetric('error', event.eventType)
  }
}
```

## 9. Laravel/PHP Config Mapping

```php
// config/audit.php — Laravel/PHP equivalent

return [
    // ... existing AP-9A config ...

    // AP-9C shadow write flags
    'shadow_write_enabled' => env('AUDIT_SHADOW_WRITE_ENABLED', false),
    'metrics_enabled' => env('AUDIT_PROTOTYPE_METRICS', false),
    'fail_closed' => env('AUDIT_PROTOTYPE_FAIL_CLOSED', false),

    // Read comparison (not active in AP-9C)
    'read_from_prototype' => env('AUDIT_PROTOTYPE_READ_COMPARE', false),
    'admin_compare_visible' => env('AUDIT_PROTOTYPE_ADMIN_COMPARE', false),
];
```

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `AUDIT_PROTOTYPE_ENABLED` | `false` | Master switch for all prototype behavior |
| `AUDIT_SHADOW_WRITE_ENABLED` | `false` | Enable shadow writes alongside mock writer |
| `AUDIT_PROTOTYPE_METRICS` | `false` | Enable developer-safe metrics |
| `AUDIT_PROTOTYPE_READ_COMPARE` | `false` | Read comparison (not active in AP-9C) |
| `AUDIT_PROTOTYPE_ADMIN_COMPARE` | `false` | Admin UI comparison (not active in AP-9C) |
| `AUDIT_PROTOTYPE_FAIL_CLOSED` | `false` | Fail-closed mode (testing only) |

## 10. QA Checklist

- [ ] All flags default to `false`
- [ ] Master switch gates all prototype behavior
- [ ] `auditPrototypeShadowWriteEnabled` requires `auditPrototypeEnabled`
- [ ] Forbidden flag combinations documented and enforced at config validation
- [ ] Gate order documented and matches implementation intent
- [ ] Fail-open behavior for shadow write errors
- [ ] Fail-closed behavior for `real_persisted` attempts
- [ ] Laravel/PHP config mapping is consistent with TypeScript config
- [ ] Environment variable names match between TS and PHP
- [ ] Privacy gate runs before any prototype write
- [ ] Service availability checked before write attempt
- [ ] Metrics are aggregate and PII-free
- [ ] No flag grants `real_persisted` access
- [ ] Rolling back any flag to `false` immediately stops its behavior
- [ ] All existing 92 audit checks pass with flags disabled
- [ ] Route smoke tests pass with flags disabled