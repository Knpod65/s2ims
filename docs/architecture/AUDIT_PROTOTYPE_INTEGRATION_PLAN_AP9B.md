# Audit Prototype Integration Plan AP-9B

**Planned on 2026-05-14.**

Branch: `architecture/audit-prototype-integration-plan-ap9b`

## Overview

AP-9B is a **documentation-only** plan that defines how the AP-9A prototype persistence runtime skeleton should be safely integrated into the system in a future runtime phase. It covers feature-flagged shadow writes, read comparison strategies, Admin display comparison rules, rollback procedures, monitoring signals, and privacy enforcement.

This plan does **not** implement any runtime integration. It defines the architecture, guardrails, and sequencing for a future implementation phase.

## Why AP-9B Exists

AP-9A delivered a working but disabled-by-default prototype persistence skeleton. Before any runtime integration is attempted, we need a detailed plan that answers:

1. How do we safely enable prototype writes alongside the existing mock writer?
2. How do we compare prototype reads against the current mock/fixture reads?
3. How do we ensure Admin display remains trustworthy during the transition?
4. What are the rollback triggers and procedures?
5. What privacy checks must run before any shadow write or read comparison?
6. How do we monitor for regressions?

## Current State (Post AP-9A)

| Component | Implementation | Status |
|-----------|---------------|--------|
| `AuditPersistenceConfig` | `src/lib/audit/storage/auditPersistenceConfig.ts` | Disabled by default |
| `AuditStorageDriverContract` | `src/lib/audit/storage/auditStorageDriver.ts` | Interface defined |
| `InMemoryPrototypeAuditStorageDriver` | `src/lib/audit/storage/inMemoryPrototypeAuditStorageDriver.ts` | In-memory, disabled |
| `PrototypeAuditRepository` | `src/lib/audit/repositories/prototypeAuditRepository.ts` | Wraps driver |
| `AuditPersistenceFeatureGuard` | `src/lib/audit/guards/auditPersistenceFeatureGuard.ts` | Blocks by default |
| `PrototypeAuditPersistenceService` | `src/lib/audit/services/prototypeAuditPersistenceService.ts` | No-op when disabled |
| `sharedMockWriter` | `src/lib/audit/sharedMockWriter.ts` | Active write path |
| `adminAuditDisplayAdapter` | `src/lib/audit/adminAuditDisplayAdapter.ts` | Active read path |
| `AuditDisplayPresenter` | `src/lib/audit/presenters/auditDisplayPresenter.ts` | Display boundary |

## Integration Goals

- Enable prototype persistence in a controlled, reversible manner.
- Validate prototype storage behavior against existing mock data.
- Detect data integrity issues before enabling reads from prototype.
- Preserve zero regression in Staff and Admin workflows.
- Build monitoring and rollback infrastructure before any runtime change.

## Explicit Non-Goals

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
- ❌ Do not start AP-10.

## Proposed Future Runtime Architecture

```
Staff Action (e.g., document reject)
  │
  ├──► [Current Path — always active]
  │     Builder → sharedMockWriter → Admin display reads
  │
  └──► [Future Path — feature-flagged, prototype only]
        Builder → PrivacyGate → MetadataSanitizer
          → PrototypeAuditRepository → InMemoryPrototypeAuditStorageDriver
          → Shadow comparison logging
          → Admin display continues reading from sharedMockWriter
```

### Feature-Flagged Integration Model

All integration points are controlled by feature flags. Each flag gates a specific behavior:

| Flag | Controls | Default |
|------|----------|---------|
| `auditPrototypeEnabled` | Master switch for all prototype behavior | `false` |
| `auditPrototypeShadowWriteEnabled` | Write events to both mock + prototype | `false` |
| `auditPrototypeReadCompareEnabled` | Compare read results from both sources | `false` |
| `auditPrototypeAdminCompareVisible` | Show comparison results in Admin UI | `false` |
| `auditPrototypeMetricsEnabled` | Emit metrics for comparison analysis | `false` |
| `auditPrototypeFailClosed` | Fail closed (reject) vs. fail open (log) on shadow write error | `false` |

When all flags are `false`, the system behaves exactly as it does today.

## Shadow Write Strategy

See: `docs/architecture/AUDIT_SHADOW_WRITE_STRATEGY_AP9B.md`

Key principles:
- `sharedMockWriter` is always the source of truth.
- Shadow writes happen after and in addition to mock writes.
- Shadow write failure must never break the Staff/Admin UI.
- All shadow writes pass through the existing privacy guard and metadata sanitizer.
- Only `prototype_only` events are eligible for shadow writes.

## Read Comparison Strategy

See: `docs/architecture/AUDIT_READ_COMPARISON_PLAN_AP9B.md`

Key principles:
- Admin display continues reading from `adminAuditDisplayAdapter` (mock path).
- Comparison runs as a background/diagnostic operation.
- Mismatches are logged but do not affect display.
- Comparison output is developer-safe (no PII in logs).
- Read comparison requires shadow write data to exist first.

## Admin Display Comparison Model

- No changes to Admin display in AP-9B.
- Comparison output is diagnostic only (logged, not displayed).
- Future Admin integration requires a separate phase with UI review.

## Privacy and Safety Boundaries

See: `docs/architecture/AUDIT_PROTOTYPE_PRIVACY_QA_AP9B.md`

All shadow writes and read comparisons must pass through:
1. Event builder validation (existing)
2. Metadata sanitizer (`FORBIDDEN_AUDIT_METADATA_KEYS`)
3. Privacy policy guard (`AuditPolicyGuardContract`)
4. Feature guard (`canUsePrototypePersistence`)
5. Mode check (`isModeAllowed` — blocks `real_persisted`)

## Rollout Sequence

See: `docs/architecture/AUDIT_PROTOTYPE_ROLLBACK_AND_MONITORING_AP9B.md`

1. Enable `auditPrototypeEnabled` (no writes, monitors only)
2. Enable `auditPrototypeShadowWriteEnabled` (writes to both paths)
3. Enable `auditPrototypeReadCompareEnabled` (compare reads)
4. Evaluate metrics and logs at each stage
5. Enable `auditPrototypeAdminCompareVisible` (Admin UI shows comparison)
6. Each stage has explicit rollback triggers

## Rollback Sequence

1. Disable the flag that caused the issue.
2. Clear in-memory prototype storage if needed.
3. Validate that `sharedMockWriter` path is functioning.
4. Run full check suite (`npm run check:audit-events`).
5. Verify route smoke tests pass.
6. Document incident and resolution.

Rollback is always possible because:
- All flags default to `false`.
- `sharedMockWriter` is never replaced, only augmented.
- No data mutations occur through flags alone.

## QA Gates

Before enabling any flag in a future runtime phase:

- [ ] Build passes 40/40
- [ ] Token check passes 4/4
- [ ] All 92 audit/notification checks pass
- [ ] All 5 smoke routes return 200 OK
- [ ] Dev log clean (no errors, warnings)
- [ ] No PII in shadow write output
- [ ] No forbidden metadata in prototype storage
- [ ] No duplicate audit events detected
- [ ] Comparison metrics show < 1% mismatch rate
- [ ] Rollback tested in staging

## Recommended Next Step

After AP-9B plan review:

1. **AP-9B-QA** — Documentation QA checkpoint (this PR covers planning only)
2. **AP-9C** — Shadow write runtime integration (feature-flagged, `prototype_only`, requires AP-9B plan approval)
3. Do not start real persistence until prototype phase is proven stable and compliant.
4. Do not start AP-10.