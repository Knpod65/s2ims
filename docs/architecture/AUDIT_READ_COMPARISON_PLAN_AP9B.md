# Audit Read Comparison Plan AP-9B

**Planned on 2026-05-14.**

Branch: `architecture/audit-prototype-integration-plan-ap9b`

## Purpose

Define how audit event reads compare between the existing mock/fixture data source and the prototype storage driver to validate data integrity before any UI integration.

## Why Compare Reads

Before Admin display reads from prototype storage, we must verify that:

- Prototype data matches mock data for the same events.
- No events are lost or duplicated in prototype storage.
- Display formatting via `AuditDisplayPresenter` produces identical output for both sources.
- Privacy rules are consistently enforced across both paths.

## Current Read Source

- `adminAuditDisplayAdapter` reads from:
  1. `src/data/mock/audit-logs.ts` (fixture data, 6 rows)
  2. `sharedMockAuditWriter.list()` (live mock-only events)
  3. Static `DEMO_WRITER_EVENTS` (3 rows)
- All composed and sorted by `createdAt` descending.
- Display goes through `AuditDisplayPresenter` → `AuditDisplayRow[]`.

## Future Comparison Source

- `PrototypeAuditRepository` → `InMemoryPrototypeAuditStorageDriver`
- Events written via shadow writes during AP-9C runtime integration.
- Read via `list()`, `findById()`, `count()` methods on the repository.

## Comparison Dimensions

| Dimension | Description | Tolerance |
|-----------|-------------|-----------|
| Event count | Total number of events in each source | Must match exactly |
| Event IDs | Set of all event IDs | Must match exactly |
| Event types | Distribution of `AuditEventType` values | Must match exactly |
| Actor role | Distribution of `AuditActorRole` values | Must match exactly |
| Target display token | Privacy-masked target identifiers | Must match exactly |
| Persistence mode | Distribution of `persistenceMode` values | Must match exactly |
| Metadata keys | Allowlisted metadata keys present | Must pass sanitizer |
| Timestamp order | Events sorted by `createdAt` | Order must be stable |
| Presenter output | `AuditDisplayRow` fields from presenter | Must be identical |

## Mismatch Categories

| Category | Description | Severity |
|----------|-------------|----------|
| Missing in prototype | Event exists in mock but not in prototype | High |
| Extra in prototype | Event exists in prototype but not in mock | High |
| Different order | Same events but different sort order | Low |
| Unsafe metadata mismatch | Forbidden metadata key present in prototype | Critical |
| Copy-stage mismatch | `AuditCopyStage` differs for same event | Medium |
| Display presenter mismatch | `AuditDisplayRow` fields differ for same event | High |

## Admin Display Safety

- **AP-9B does not change Admin display read path.**
- Admin UI continues reading exclusively from `adminAuditDisplayAdapter`.
- Comparison output is diagnostic only, not displayed in UI.
- No Admin UI flag indicates prototype data presence to end users.
- Comparison logs are accessible only to developers with system access.

## Metrics

| Metric | Description |
|--------|-------------|
| comparison_event_count | Number of events compared |
| comparison_mismatch_count | Total mismatches detected |
| comparison_missing_prototype | Events missing in prototype |
| comparison_extra_prototype | Extra events in prototype |
| comparison_metadata_rejections | Forbidden metadata keys detected |
| comparison_presenter_diffs | Display formatting differences |

## Debug Output Rules

- Debug output includes event ID, event type, actor role, timestamp, and mismatch category.
- Debug output **must not** include raw student IDs, names, emails, phone numbers, or any PII.
- Debug output is written to application logs at `debug` level only when explicitly enabled.
- Debug output is disabled by default in production.

## Privacy Rules

- Comparison queries respect the same privacy filters as display queries.
- Only privacy-safe fields are included in comparison output.
- Role-based access control is simulated for comparison data.
- Exported comparison data (if any) uses `CsvAuditRow` with standard redaction.

## Rollback

- Disabling `auditPrototypeReadCompareEnabled` stops comparison immediately.
- No cleanup of comparison logs is required (they contain no PII).
- Admin display continues reading from mock path without interruption.

## QA Checklist

- [ ] Read comparison does not affect Admin display output.
- [ ] Comparison output contains no raw PII.
- [ ] Mismatch detection works for missing, extra, and modified events.
- [ ] Metadata sanitizer rejections are counted but not stored.
- [ ] Presenter output is identical for events from both sources.
- [ ] Comparison is gated behind feature flag.
- [ ] Debug logs do not contain sensitive data.
- [ ] All existing 92 audit checks still pass.
- [ ] Route smoke tests pass with comparison enabled.
- [ ] Rollback to mock-only path works without data loss.