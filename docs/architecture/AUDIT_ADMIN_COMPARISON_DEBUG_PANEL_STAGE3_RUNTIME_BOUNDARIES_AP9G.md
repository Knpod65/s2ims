# Audit Admin Comparison Debug Panel Stage 3 Runtime Boundaries AP-9G

1. Purpose

This file spells out the runtime boundaries for a future Stage 3 implementation to ensure privacy, safety, and clear non-goals. It is documentation-only.

2. Allowed runtime surface

- Hidden component may render only for Admin when all staging gates are enabled.
- Aggregated metrics only: status, sourceCount, prototypeCount, mismatchCount, mismatch category, mismatch dimension, safeMessage, createdAt timestamp, and aggregate health indicator.
- In-memory ephemeral metrics in staging-only runtime.

3. Forbidden runtime surface

- Replacing the official Admin Audit Log table or changing its data source.
- Exporting row-level comparison results or allowing CSV/download of comparison data.
- Rendering raw event payloads, actor/target IDs, student identifiers, reason text, metadata values, or raw route params.
- Creating routes, navigation, or changing export behavior.
- Enabling real persistence or creating database migrations.

4. Admin Audit Log boundary

- Admin Audit Log remains the authoritative display and MUST continue to use `adminAuditDisplayAdapter` and `AuditDisplayPresenter`.
- Prototype reads must never be wired into the Admin Audit Log export or CSV pipeline.

5. Component boundary

- Any UI wiring must reuse the existing AdminAuditComparisonDebugPanel component location; do not add new pages or routes.
- Non-admin paths must not import or reference the component in a way that leaves a DOM trace.

6. Feature flag boundary

- Feature flags controlling runtime must default to false. See the staging flags doc for names and combinations.

7. Access control boundary

- Access restricted to assigned Admin reviewers. Authentication/authorization must be enforced by existing role checks; no new auth mechanisms are introduced.

8. Data boundary

- Data visible in the panel must be aggregate-only and derived from mock/shared writers and comparison metrics; no real persistence is permitted.

9. Export boundary

- No export paths or navigation entries may be added for comparison data. Any export must remain limited to the official Admin audit rows.

10. Route/navigation boundary

- Do not add routes or navigation. Panel should appear inside the existing audit-log page when all gates pass.

11. Failure boundary

- On privacy/PII detection or any gate failure the panel must hide and emit a safe health status (failed or disabled) — no additional error details should be shown.

12. QA checklist

- Verify Admin-only visibility.
- Verify non-admin no DOM trace.
- Verify no export or CSV of comparison data.
- Verify aggregate-only metrics only.
- Verify feature flags default false and disable by default.
- Verify no src/scripts/package.json changes in runtime branch.
