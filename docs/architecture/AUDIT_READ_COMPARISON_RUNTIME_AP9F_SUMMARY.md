# Audit Read Comparison Runtime AP-9F Summary

## 1. Overview

AP-9F adds a minimal, disabled-by-default read comparison runtime skeleton to the S2IMS audit subsystem. It provides safe utilities to compare current mock/admin read output with prototype read output in memory. The skeleton is available for future use but is not wired to any UI, Admin table, or active data path.

The Admin UI continues reading exclusively from `adminAuditDisplayAdapter`. The `sharedMockWriter` remains the source of truth. `AuditDisplayPresenter` remains the formatting boundary. No prototype reads enter the Admin display path.

## 2. Why AP-9F Exists

AP-9E (documentation-only) defined the comparison architecture, privacy boundaries, and rollout gates. AP-9D added shadow write runtime hooks. AP-9F provides the next step: a safe, in-memory comparison runtime that can validate whether prototype events match the existing mock read source. This is required before any future consideration of switching the Admin read path.

The skeleton proves the comparison contract is implementable before any real data flows through it.

## 3. Files Created

| File | Purpose |
|------|---------|
| `src/lib/audit/comparison/auditReadComparisonTypes.ts` | Pure type definitions — status, mismatch categories, dimensions, input/result shapes |
| `src/lib/audit/comparison/auditReadComparisonMetrics.ts` | In-memory, PII-free metrics store for comparison run summaries |
| `src/lib/audit/comparison/auditReadComparisonGuards.ts` | 6-gate guard evaluation for comparison eligibility |
| `src/lib/audit/comparison/auditReadComparisonService.ts` | Core comparison service with 11 dimensions and testing factory |
| `docs/architecture/AUDIT_READ_COMPARISON_RUNTIME_AP9F_SUMMARY.md` | This document |

## 4. Files Modified

| File | Change |
|------|--------|
| `src/lib/audit/index.ts` | Added exports for 4 new comparison modules |
| `scripts/check-audit-events.mjs` | Added 15 AP-9F checks (107 → 122 total) |
| `docs/architecture/NEXT_RENOVATION_STEPS.md` | Added AP-9F result section |

## 5. Runtime Boundaries

The comparison service operates entirely in memory. It:

- Accepts two `AuditEvent[]` arrays (source and prototype) as direct input
- Compares them across safe dimensions
- Returns an `AuditReadComparisonResult` with aggregate counts and safe mismatch descriptions
- Appends the result to an in-memory metrics store
- Never writes to any persistent storage
- Never changes what the Admin UI displays
- Never switches any read path

The Admin read path remains:

```
mockAuditLogs
  + DEMO_WRITER_EVENTS
  + sharedMockAuditWriter.list()
  -> adminAuditDisplayAdapter
  -> AuditDisplayPresenter
  -> Admin table / drawer / export
```

This path is unchanged.

## 6. Feature Flags / Disabled-by-Default Behavior

All comparison behavior is gated behind two flags in `AuditReadComparisonInput`:

| Flag | Default | Effect |
|------|---------|--------|
| `featureEnabled` | `false` | Master switch — must be `true` for any comparison |
| `readCompareEnabled` | `false` | Read comparison switch — must be `true` to compare |
| `adminCompareVisible` | `false` | Future debug panel switch — not wired in AP-9F |

When either `featureEnabled` or `readCompareEnabled` is `false`, the service returns `{ status: 'disabled', mismatchCount: 0, mismatches: [] }` immediately without running any comparison logic.

## 7. Comparison Dimensions Implemented

| Dimension | What Is Compared |
|-----------|-----------------|
| `event_count` | Source event count vs prototype event count |
| `event_ids` | Presence of all source IDs in prototype; detection of extra/duplicate IDs |
| `event_types` | `eventType` field for each matched pair |
| `actor_role` | `actorRole` field for each matched pair |
| `target_display_token` | `targetDisplayToken` safe token for each matched pair |
| `persistence_mode` | Blocks `real_persisted` in either list; mock_only vs prototype_only is expected and not flagged |
| `severity` | `severity` field for each matched pair |
| `timestamp_order` | Sorted `createdAt` order across matched events |
| `safe_metadata_keys` | Metadata key name sets (names only — never values) |
| `presenter_output` | `actionLabel`, `actorRoleLabel`, `persistenceLabel` via `AuditDisplayPresenter` |
| `copy_stage` | `copyStage` field via presenter output |

Event matching is by event ID. Shadow writes preserve the source event ID, so matched pairs share the same `id`.

## 8. Privacy and Logging Safety

### What comparison output may include

- Event counts (aggregate)
- Mismatch category and dimension
- Internal event IDs (for matching purposes — not displayed to users)
- Safe target display tokens (e.g. `Student #S-2345`)
- Developer-safe `safeMessage` strings describing the mismatch type

### What comparison output must not include (enforced by type design and guards)

- `actorId`
- `targetId`
- `actorDisplayName`
- Reason text
- Metadata values
- Raw route params
- Raw student ID, national ID, email, phone, bank account
- Raw IP, file names, OCR text

The `AuditReadComparisonMismatch` type does not include fields for PII. The guards block any event with unsafe metadata keys before comparison runs.

### Unsafe metadata key blocklist

The guards block all keys in `FORBIDDEN_AUDIT_METADATA_KEYS` plus:
`studentId`, `rawStudentId`, `nationalId`, `email`, `phone`, `bankAccount`, `ip`, `rawIp`, `fileName`, `filePath`, `ocrText`

## 9. What Is Intentionally Not Wired

- Admin UI is not switched to prototype reads
- Prototype events are not used as a source of truth for any display
- Real persistence (`real_persisted`) is not activated
- No backend/API changes
- No database migrations
- No browser storage (no localStorage, sessionStorage, indexedDB)
- No Staff callback changes
- No Staff verify action wired
- No reason validation changes
- No `ReasonRequiredModal` introduced
- No notification behavior changes
- No Admin table, drawer, or CSV/export output changes
- No debug panel added (future phase, requires separate approval)
- AP-10 not started

The comparison service exists as available-for-future-use infrastructure only.

## 10. Validation Results

| Check | Result |
|-------|--------|
| Build | 40/40 routes |
| Token check | 4/4 |
| Audit/notification checks | 122/122 (was 107/107) |
| `/login` | 200 OK |
| `/admin/audit-log` | 200 OK |
| `/admin/dashboard` | 200 OK |
| `/staff/applications/app_001` | 200 OK |
| `/staff/applications/app_002` | 200 OK |
| Dev log | Clean |

## 11. Safety Confirmations

- Runtime changed? **No** — Admin UI, Staff UI, and all display paths are unchanged
- Admin UI switched to prototype reads? **No**
- Prototype persistence activated? **No** — disabled by default
- Real persistence added? **No**
- Backend/API changed? **No**
- Database migration added? **No**
- Mock fixture mutated? **No**
- `sharedMockWriter` source of truth preserved? **Yes**
- `adminAuditDisplayAdapter` active read path preserved? **Yes**
- Staff callbacks changed? **No**
- Staff verify wired? **No**
- Reason validation changed? **No**
- `ReasonRequiredModal` introduced? **No**
- Notification behavior changed? **No**
- PII exposure found? **No**
- AP-10 started? **No**

## 12. Recommended Next Phase

1. **AP-9F-QA** — Formal documentation QA checkpoint for this implementation
2. After QA: review aggregate mismatch metrics after enabling shadow writes in a safe test context
3. Future: Admin debug-only comparison panel **only** after explicit approval, separate QA gate, and PII safety review
4. Do not start AP-10 until prototype phase evidence and compliance review are complete
5. Do not activate real persistence
