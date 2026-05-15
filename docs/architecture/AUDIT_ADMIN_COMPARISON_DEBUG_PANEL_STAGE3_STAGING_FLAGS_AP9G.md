# Audit Admin Comparison Debug Panel Stage 3 Staging Flags AP-9G

1. Purpose

Document the staging-only feature flags and safe combinations required to enable a future Stage 3 runtime review.

2. Required flags (proposed names)

- `auditPrototypeEnabled` — master prototype feature gate (default: false)
- `auditPrototypeShadowWriteEnabled` — allow prototype shadow writes to metrics store (default: false)
- `auditPrototypeReadCompareEnabled` — enable read comparison calculation (default: false)
- `auditAdminComparisonDebugPanelEnabled` — UI debug panel visibility flag (default: false)
- `auditPrototypeMetricsEnabled` — emit in-memory comparison metrics (default: false)
- `auditAdminComparisonStagingReviewEnabled` — enable staging review controls (default: false)

3. Default values

- All flags MUST default to false in all environments.

4. Allowed combinations

- To enable panel in staging: all of these must be true AND environment must be a staging/internal environment and user must be Admin.

5. Forbidden combinations

- Any flag enabled in production by default.
- `auditAdminComparisonDebugPanelEnabled` true without `auditPrototypeReadCompareEnabled`.
- `auditPrototypeMetricsEnabled` or `auditPrototypeShadowWriteEnabled` enabled in public/prod environments.

6. Staging-only enablement

- Flags may be toggled in staging for a single Admin reviewer session; toggles must be audited and disabled after review.

7. Production defaults

- All flags remain false in production. No promotion of flags from staging to production without explicit program-level approval and compliance review.

8. Fail-closed vs fail-open behavior

- Fail-closed: if any required gate is missing or privacy checks fail, the panel remains hidden.

9. Rollback by flag disable

- Disabling these flags must hide the panel, stop metrics emission, and clear in-memory metrics. This is the primary rollback mechanism.

10. QA checklist

- Verify all flags default to false.
- Verify admin-only visibility requires all flags and environment gate.
- Verify disabling flags hides panel and clears metrics.
