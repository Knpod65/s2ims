Audit Production Persistence Database Model AP-10

1. Conceptual storage model

The production audit log is an append-only event store. Each row represents one discrete audit event. The store is never used for queries that return mutable projections or aggregated views intended as official evidence — each row is the atomic unit of evidence.

Design constraints:
- Append-only: no UPDATE on core fields after write.
- No bulk DELETE outside a documented PDPA erasure procedure (see section 6).
- The store is isolated from the prototype comparison path. The in-memory `auditReadComparisonMetrics` store is a separate, diagnostic-only structure and shares no table or schema with the production event store.
- The production store is the only authoritative source for `exportAuditCSV` and Admin evidence review. The prototype/comparison path may not be used as a fallback read source.

2. Required fields per event

Every production audit event must include all of the following fields. Missing any required field is a write rejection — partial records are not admitted to the official store.

| Field | Type | Notes |
|-------|------|-------|
| `eventId` | UUID | Immutable. Generated at write time. Never reused. |
| `actorId` | string | Hashed/tokenized. Raw actor identity is not stored. See section 3 for forbidden patterns. |
| `actorRole` | enum | Role at time of action (admin, staff). Not derived post-hoc. |
| `targetId` | string | Hashed/tokenized. Raw target identity (student ID, national ID) is not stored. |
| `targetType` | enum | Type of entity acted upon (application, document, user record, etc.). |
| `action` | enum | Controlled vocabulary. Free-text action labels are not permitted. |
| `reason` | string | May be empty string for actions that do not require a reason. Must not contain raw PII. |
| `createdAt` | UTC timestamp | Server-assigned. Client-provided timestamps are not accepted. Immutable after write. |
| `environment` | enum | `staging` or `production`. Set at write time. Never derived from runtime context post-hoc. |
| `sessionId` | UUID | Session-scoped identifier. Not the same as user identity. Rotated per session. |
| `checksumHash` | string | SHA-256 of the concatenation of: `eventId`, `actorId`, `actorRole`, `targetId`, `targetType`, `action`, `reason`, `createdAt`, `environment`, `sessionId`. Computed at write time. Verified at read time. |

3. Forbidden storage patterns

The following patterns must never appear in the production event store:

- Raw national ID numbers (Thai ID, passport number, foreign national ID)
- Raw email addresses
- Raw phone numbers
- Raw bank account numbers or financial identifiers
- Raw file paths, file names, or OCR-extracted text
- Raw IP addresses linked to an identifiable individual
- Mutable core fields: any write that changes `eventId`, `actorId`, `targetId`, `action`, or `createdAt` after initial insert
- Bulk delete of event rows without a corresponding erasure log entry and DPO approval reference
- Non-append operations (UPDATE, REPLACE, UPSERT) on the core event table
- Storing the prototype comparison metrics in the production event table or any joined view
- Combining prototype read results with production event rows in any query result returned as official evidence

4. Indexing strategy

The following indexes are planned for the production event store. All index decisions are subject to DPO and engineering review before the schema is finalized in phase (b).

| Index | Columns | Purpose |
|-------|---------|---------|
| Primary | `eventId` | Immutable row identity; used for erasure log references |
| Actor-time | `actorId`, `createdAt` | Admin actor-scoped review (who did what, over what period) |
| Target-time | `targetId`, `createdAt` | Target-scoped review (what happened to a given subject) |
| Action-time | `action`, `createdAt` | Action-type review (all access events in a date range) |
| Environment-time | `environment`, `createdAt` | Partition staging events from production events |

Excluded from indexing without explicit privacy review:
- Full-text index on `reason` — reason text may contain indirect PII and must not be indexed for full-text search in production without a separate DPO-reviewed justification.
- Index on `actorId` alone without `createdAt` — unbounded actor scans are not an approved access pattern.

5. Retention periods

Retention periods are aligned with Thailand regulatory requirements. All periods are measured from `createdAt` of the event.

| Record type | Retention period | Basis |
|-------------|-----------------|-------|
| Standard access/view events | 3 years | Regulatory minimum for access logging |
| Data modification events | 7 years | Regulatory requirement for record integrity |
| PDPA-sensitive events (events touching PII fields) | Subject to erasure schedule; maximum 7 years | PDPA data minimization |
| Staging events | 90 days maximum | Staging data has no regulatory retention obligation |
| Erasure log entries | 7 years | Regulatory requirement; erasure logs are themselves audit evidence |

Retention schedule review: a scheduled review must occur at least annually. Each review requires DPO approval for any batch deletion. Reviews are logged as audit events.

6. Deletion and right-to-erasure policy

PDPA Article 33 erasure procedure:

- Erasure does not delete the row. The immutable skeletal record (`eventId`, `action`, `createdAt`, `environment`) is preserved to maintain audit trail continuity.
- PII fields are suppressed in-place: `actorId`, `targetId`, `reason`, and `sessionId` are replaced with a documented erasure token (e.g., `[erased:YYYYMMDD]`).
- The `checksumHash` of the suppressed record is recomputed and updated at erasure time. The original `checksumHash` is preserved in the erasure log for forensic continuity.
- Each erasure event must be logged in a separate erasure log table with: erasure batch ID, DPO approval reference, affected `eventId` list (hashed), date of erasure, and operator identity.
- Bulk deletes (physical row removal) are prohibited on the core event table. Only in-place suppression is permitted.
- Restricted records (PDPA restriction, not full erasure) are flagged with a `restricted` boolean and excluded from standard Admin review queries. Restricted records may only be accessed by DPO or authorized legal counsel.

7. Migration strategy from mock to production

The migration from the existing `sharedMockWriter` path to the production event store proceeds in four phases. Each phase requires explicit approval and a documented rollback test before proceeding.

Phase 1 — Shadow write:
- `AuditPersistenceService` writes new audit events to the production store in parallel with the existing `sharedMockWriter`.
- The `adminAuditDisplayAdapter` continues to read exclusively from the mock path.
- Purpose: confirm production write path is operational and checksums are valid. Admin display is unaffected.

Phase 2 — Dual read:
- `adminAuditDisplayAdapter` reads from both the mock path and the production store.
- A diff comparison is run against both results for a defined review window (minimum 72 hours in staging).
- Any mismatch triggers an alert and review. Promotion does not proceed if mismatch rate > 0.1%.

Phase 3 — Promotion:
- `adminAuditDisplayAdapter` is switched to read exclusively from the production store.
- The mock path (`sharedMockWriter`) remains active but is demoted to a secondary write path for a defined deprecation window.
- `exportAuditCSV` is updated to read from the production store only.

Phase 4 — Mock path deprecation:
- After the dual-read comparison window confirms parity, the mock write path is disabled.
- `sharedMockWriter` is not deleted immediately — it remains in the codebase but is no longer invoked.
- A separate deprecation PR removes the mock path after a defined stabilization period.

8. Backup and recovery

The production event store requires:

- Point-in-time recovery (PITR): the backup system must support recovery to any point within the last 30 days.
- Recovery point objective (RPO): ≤ 1 hour.
- Recovery time objective (RTO): ≤ 4 hours.
- Backup encryption: all backup artifacts must be encrypted at rest using a key managed separately from the database encryption key.
- Backup access: access to backup artifacts is restricted to DBA role + DPO written sign-off for any restore that involves PII-bearing records.
- Backup retention: backup artifacts are retained for 90 days. Backup deletion follows the same DPO approval process as record deletion.
- Backup location: backup storage must be confirmed as Thailand-region only. Cross-border backup transfer requires the same authorization as cross-border data transfer (see AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md section 8).
