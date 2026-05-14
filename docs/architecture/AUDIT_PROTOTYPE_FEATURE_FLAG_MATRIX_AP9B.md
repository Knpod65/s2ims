# Audit Prototype Feature Flag Matrix AP-9B

**Planned on 2026-05-14.**

Branch: `architecture/audit-prototype-integration-plan-ap9b`

## Purpose

Define the feature flags that control prototype persistence integration, their defaults, allowed combinations, and rollback behavior.

## Flag Naming Rules

- All flags use the prefix `auditPrototype`.
- Flags use camelCase in TypeScript config.
- Laravel/PHP equivalents use SCREAMING_SNAKE_CASE in `config/audit.php`.
- Environment variable equivalents use `AUDIT_` prefix with underscores.

## Required Flags

| Flag Name | TypeScript Config Key | Laravel Config Key | Env Variable | Default | Description |
|-----------|----------------------|-------------------|--------------|---------|-------------|
| `auditPrototypeEnabled` | `prototypeEnabled` | `prototype_enabled` | `AUDIT_PROTOTYPE_ENABLED` | `false` | Master switch for all prototype behavior |
| `auditPrototypeShadowWriteEnabled` | `shadowWrites` | `shadow_writes` | `AUDIT_PROTOTYPE_SHADOW_WRITE` | `false` | Write events to both mock and prototype |
| `auditPrototypeReadCompareEnabled` | `readFromPrototype` | `read_from_prototype` | `AUDIT_PROTOTYPE_READ_COMPARE` | `false` | Compare reads from mock and prototype |
| `auditPrototypeAdminCompareVisible` | `adminCompareVisible` | `admin_compare_visible` | `AUDIT_PROTOTYPE_ADMIN_COMPARE` | `false` | Show comparison results in Admin UI |
| `auditPrototypeMetricsEnabled` | `metricsEnabled` | `metrics_enabled` | `AUDIT_PROTOTYPE_METRICS` | `false` | Emit comparison metrics |
| `auditPrototypeFailClosed` | `failClosed` | `fail_closed` | `AUDIT_PROTOTYPE_FAIL_CLOSED` | `false` | Fail closed on shadow write error |

## Default Values

```typescript
// Current config (AP-9A, unchanged)
const DEFAULT_AUDIT_PERSISTENCE_CONFIG: AuditPersistenceConfig = {
  mode: 'mock_only',
  prototypeEnabled: false,
  shadowWrites: false,
  readFromPrototype: false,
}

// Proposed AP-9B config extension (not implemented yet)
type AuditPrototypeConfig = AuditPersistenceConfig & {
  adminCompareVisible: boolean
  metricsEnabled: boolean
  failClosed: boolean
}

const DEFAULT_AUDIT_PROTOTYPE_CONFIG: AuditPrototypeConfig = {
  mode: 'mock_only',
  prototypeEnabled: false,
  shadowWrites: false,
  readFromPrototype: false,
  adminCompareVisible: false,
  metricsEnabled: false,
  failClosed: false,
}
```

## Allowed Combinations

| Phase | prototypeEnabled | shadowWrites | readFromPrototype | adminCompareVisible | metricsEnabled | failClosed |
|-------|-----------------|-------------|-------------------|--------------------|---------------:|-----------|
| 0: Disabled | `false` | `false` | `false` | `false` | `false` | `false` |
| 1: Monitoring | `true` | `false` | `false` | `false` | `true` | `false` |
| 2: Shadow Write | `true` | `true` | `false` | `false` | `true` | `false` |
| 3: Read Compare | `true` | `true` | `true` | `false` | `true` | `false` |
| 4: Admin Visible | `true` | `true` | `true` | `true` | `true` | `false` |

## Forbidden Combinations

| Combination | Reason |
|-------------|--------|
| `prototypeEnabled: false`, `shadowWrites: true` | Shadow write requires prototype enabled |
| `prototypeEnabled: false`, `readFromPrototype: true` | Read comparison requires prototype enabled |
| `shadowWrites: false`, `readFromPrototype: true` | Read comparison requires shadow write data to exist |
| `readFromPrototype: false`, `adminCompareVisible: true` | Admin comparison requires read comparison enabled |
| `prototypeEnabled: true` without privacy review | Privacy review required before enabling |
| `failClosed: true` in production | Fail closed is for testing only |

## Rollback Behavior per Flag

| Flag | Rollback Action | Impact |
|------|----------------|--------|
| `prototypeEnabled` → `false` | Stops all prototype writes and reads | Zero impact, system reverts to mock-only |
| `shadowWrites` → `false` | Stops secondary writes | Prototype storage stops growing; mock unaffected |
| `readFromPrototype` → `false` | Stops read comparison | Comparison logs stop; Admin display unchanged |
| `adminCompareVisible` → `false` | Hides comparison UI | No UI impact on end users |
| `metricsEnabled` → `false` | Stops metric emission | Metrics collection stops; no runtime impact |
| `failClosed` → `false` | Errors become non-blocking | Shadow write failures are logged and ignored |

## Environment Guidance

| Environment | Recommended Config |
|-------------|-------------------|
| Local dev | `prototypeEnabled: true`, `shadowWrites: true`, other flags `false` |
| CI/Coverage | `prototypeEnabled: true`, `shadowWrites: true`, `readFromPrototype: true`, `metricsEnabled: true`, other flags `false` |
| Staging | Same as CI, with `adminCompareVisible: true` for QA |
| Production | All flags `false` until explicit approval per phase |

## Laravel/PHP Config Mapping

```php
// config/audit.php
return [
    // Existing from AP-9A
    'enabled' => env('AUDIT_PERSISTENCE_ENABLED', false),
    'mode' => env('AUDIT_PERSISTENCE_MODE', 'mock_only'),
    'write_shadow' => env('AUDIT_PERSISTENCE_SHADOW_WRITE', false),
    'read_from_prototype' => env('AUDIT_PERSISTENCE_READ_COMPARE', false),

    // New in AP-9B
    'admin_compare_visible' => env('AUDIT_PROTOTYPE_ADMIN_COMPARE', false),
    'metrics_enabled' => env('AUDIT_PROTOTYPE_METRICS', false),
    'fail_closed' => env('AUDIT_PROTOTYPE_FAIL_CLOSED', false),
];
```

## QA Checklist

- [ ] All flags default to `false`
- [ ] Forbidden combinations are enforced at config validation time
- [ ] Rolling back any flag reverts behavior immediately
- [ ] No flag grants `real_persisted` access
- [ ] Environment-specific configs match guidance table
- [ ] Laravel/PHP config mapping is consistent with TypeScript config
- [ ] Feature guard reads all flags, not just `prototypeEnabled`
- [ ] Rolling back `prototypeEnabled` clears in-memory prototype storage
- [ ] Metrics are disabled by default and opt-in only
- [ ] `failClosed` is `false` by default and not recommended for production