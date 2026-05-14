# Audit Admin Comparison Debug Panel Plan AP-9G

## 1. Overview

AP-9G plans a future Admin-only, disabled-by-default, debug-only panel for viewing safe aggregate audit read comparison metrics produced by AP-9F. This document is **documentation-only**. No runtime code is implemented in this phase.

The panel, when implemented, will display safe aggregate comparison status alongside the existing Admin Audit Log page — not replacing it. The Admin Audit Log table remains powered by the existing mock/admin read path through `adminAuditDisplayAdapter` and `sharedMockWriter`. The comparison panel is strictly diagnostic, never authoritative.

## 2. Why AP-9G Exists

AP-9F added a disabled-by-default, in-memory read comparison service that can compare source (mock/admin) audit events against prototype audit events. However, AP-9F provided no way to observe comparison results in the Admin UI — metrics are only accessible programmatically in developer tooling.

AP-9G defines a safe path for Admin users to observe comparison health (aggregate counts, status, mismatch categories) during development and staging phases, without:
- changing the source of truth for the Admin Audit Log
- exposing prototype reads as authoritative
- exposing any PII

## 3. Current State After AP-9F

- `AuditReadComparisonService` is present on main, isolated from all UI
- `AuditReadComparisonMetricsStore` holds in-memory comparison results (closure-based, no persistence)
- All feature flags are disabled by default: `featureEnabled: false`, `readCompareEnabled: false`
- Admin Audit Log still reads from `sharedMockAuditWriter.list()` + fixture via `adminAuditDisplayAdapter`
- 122/122 audit/notification checks pass
- `real_persisted` events are blocked by guards
- No PII is exposed in comparison output

## 4. Goals

- Document a safe architecture for an Admin-only debug panel showing comparison aggregate metrics
- Define the privacy boundary: what aggregate data may be shown and what is forbidden
- Define access control: Admin role only, feature-flag-gated, hidden by default
- Define the UI state model: disabled, no-data, matched, mismatched, failed, blocked states
- Define a staged rollout and rollback strategy
- Define QA gates and approval criteria for future implementation
- Produce a complete QA checklist template for when AP-9G is implemented

## 5. Explicit Non-Goals

- This document does **not** implement the panel
- Does **not** modify `src/*`, `scripts/*`, or `package.json`
- Does **not** switch Admin UI to prototype reads
- Does **not** change `adminAuditDisplayAdapter` or `sharedMockWriter`
- Does **not** make prototype reads a source of truth
- Does **not** activate prototype persistence
- Does **not** add real persistence
- Does **not** add backend/API behavior or database migrations
- Does **not** mutate mock fixtures
- Does **not** expose PII
- Does **not** change Staff callbacks, reason validation, or notification behavior
- Does **not** start AP-10

## 6. Proposed Future Panel Architecture

```
AuditReadComparisonMetricsStore (in-memory, AP-9F)
  → AdminAuditComparisonDebugPanel (future component)
      gated by: featureEnabled AND adminDebugPanelEnabled AND isAdminRole
      reads:    getReadComparisonMetrics().list()
      displays: safe aggregate summary only
      never:    switches Admin Audit Log data source
                exposes PII
                shows prototype reads as authoritative

Admin Audit Log page (unchanged)
  → adminAuditDisplayAdapter
      → sharedMockAuditWriter.list() + fixture
      → AuditDisplayPresenter
      → Admin table / drawer / CSV
```

The panel is a separate, collapsible or tab-isolated section in the Admin area. It never appears on Staff, Student, Provider, or ESQ routes.

## 7. Admin-Only Visibility Model

- The panel component must render only when:
  - `role === 'admin'` (checked server-side or via session)
  - `adminDebugPanelEnabled === true` (feature flag)
  - `featureEnabled === true` (AP-9F feature flag)
- Any other role must receive an empty render (not a 403 message — the panel must not reveal that comparison data exists)
- Direct URL access to debug panel routes must redirect to the Admin dashboard, not show an error

## 8. Debug-Only Feature Flag Model

Proposed feature flags (documentation-only, not implemented yet):

| Flag | Default | Purpose |
|------|---------|---------|
| `featureEnabled` | `false` | Master AP-9F gate (already exists) |
| `readCompareEnabled` | `false` | Enables comparison runs (already exists) |
| `adminDebugPanelEnabled` | `false` | Enables Admin debug panel visibility (new in AP-9G) |

All three flags must be `true` for the panel to render. Any single `false` hides the panel entirely.

## 9. Safe Metrics Display Model

The panel may display only aggregate and category-level information from `AuditReadComparisonResult`:

**Allowed:**
- `status` — `'disabled' | 'skipped' | 'matched' | 'mismatched' | 'failed'`
- `sourceCount` — number of source events compared
- `prototypeCount` — number of prototype events compared
- `mismatchCount` — number of mismatches found
- `createdAt` — run timestamp
- `safeMessage` — the pre-formatted safe message string
- Mismatch `category` — e.g. `missing_in_prototype`
- Mismatch `dimension` — e.g. `event_count`
- Mismatch `safeMessage`
- `sourceSafeToken` — only if it is already in masked form (e.g. `Student #S-2345`)
- `prototypeSafeToken` — same constraint

**Forbidden (see full list in privacy boundary doc):**
- `sourceEventId`, `prototypeEventId` — internal IDs, not user-facing
- Any raw event data fields
- Any PII

## 10. What the Panel May Show

- Comparison run status badge (matched / mismatched / failed / disabled)
- Source event count
- Prototype event count
- Mismatch count
- Last comparison run timestamp
- Guard status (which gate blocked the run, if disabled/skipped)
- Mismatch list: category + dimension + safeMessage only
- Safe health indicator: green/amber/red aggregate status
- Feature flag status: enabled/disabled labels for developer reference

## 11. What the Panel Must Never Show

- Actor IDs, target IDs, student IDs, national IDs
- Email, phone, bank account, raw IP
- File names, file paths, OCR text
- Reason text (full or partial)
- Metadata values
- Raw route params
- Uploaded document identifiers
- Any unmasked name not already approved for the Admin Audit Log table
- Prototype events as the "official" audit log
- Any indication that prototype data is authoritative
- Any data from `sharedMockWriter` that is not already shown in the existing Admin Audit Log

## 12. Relationship to Admin Audit Log Table

The Admin Audit Log table behavior is unchanged by AP-9G:
- Data source: `mockAuditLogs` (fixture) + `sharedMockAuditWriter.list()`
- Read path: `adminAuditDisplayAdapter` → `AuditDisplayPresenter`
- Display: existing table, drawer, CSV export

The comparison debug panel is a separate, clearly-labeled section. It must not:
- Modify the audit table's data source
- Inject comparison rows into the audit table
- Change the drawer behavior
- Change the CSV/export format
- Be visible unless all three feature flags are enabled

The panel must have a clear label indicating it is a developer/debug view, not the official audit log.

## 13. Relationship to AP-9F Comparison Service

The panel reads from `getReadComparisonMetrics()` — the shared in-memory metrics store from AP-9F. It:
- Only reads `list()` — never appends, clears, or mutates the store directly
- Does not trigger new comparisons itself
- Does not wire into the existing Admin Audit Log display path
- Shows historical comparison results from the current server session only (in-memory, not persisted)

## 14. Privacy and PII Boundaries

See `AUDIT_ADMIN_COMPARISON_PANEL_PRIVACY_BOUNDARY_AP9G.md` for the full specification.

Key rules:
- Only aggregate-level data is displayed
- `AuditReadComparisonMismatch.safeMessage` is the only free-text field permitted in the UI
- Masked display tokens (`sourceSafeToken`, `prototypeSafeToken`) are permitted if and only if they are in the format already used by `AuditDisplayPresenter` (e.g. `Student #S-2345`)
- No raw IDs, no raw event data, no metadata values

## 15. Rollout Sequence

See `AUDIT_ADMIN_COMPARISON_PANEL_ROLLOUT_AND_ROLLBACK_AP9G.md` for the full staged plan.

Summary:
1. **Stage 0** (current): Docs-only. No panel exists.
2. **Stage 1**: Hidden component added, not rendered for any role, all flags disabled.
3. **Stage 2**: Admin-only debug panel rendered when all three flags are enabled.
4. **Stage 3**: Staging-only review with comparison flags enabled for internal testing.
5. **Stage 4**: Production release with all flags disabled by default; Admin can enable per-session.

Each stage requires its own QA gate before proceeding to the next.

## 16. Rollback Sequence

Any of the following triggers immediate rollback to Stage 0 behavior (panel hidden):
- PII discovered in panel output
- Admin Audit Log source of truth confused
- Prototype data shown as authoritative
- Route regression or build failure
- Unauthorized role access
- Accessibility regression

See rollout/rollback doc for detailed rollback actions.

## 17. QA Gates

Before each implementation stage, the following must be confirmed:
- `npm run build` passes 40/40
- `npm run check:tokens` passes 4/4
- `npm run check:audit-events` passes 122/122
- All 5 route smoke tests pass
- Dev log clean
- Privacy review: no PII in panel output
- Access review: non-Admin roles cannot see the panel
- Source-of-truth review: Admin Audit Log unchanged

## 18. Recommended Next Phase

- AP-9G-QA: documentation-only QA checkpoint for this planning doc
- Runtime implementation (Stage 1 hidden component) only after explicit approval
- No AP-10
- No real persistence
