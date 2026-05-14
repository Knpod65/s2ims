# AP-8B — Audit Database Schema Plan (Docs-Only)

**Planned on 2026-05-14.**

Branch:

`architecture/audit-database-schema-plan-ap8b`

## Overview

This document plans the future audit database schema as a Laravel/PHP migration equivalent. It defines tables, columns, types, indexes, constraints, retention policies, privacy rules, and a rollback strategy. This is **not** a runnable migration — it is a design contract that a future implementation phase will translate into actual Laravel migrations.

No runtime code is created or modified. No src/* files are touched.

## Source of Truth

This schema is derived from existing TypeScript contracts:

- `src/lib/audit/contracts/auditContracts.ts` — `AuditEvent`, `AuditDisplayRow`, `AdminAuditDisplayRow`, `CsvAuditRow`, `AuditRepositoryFilters`
- `src/lib/audit/auditTypes.ts` — `AuditEvent`, `AuditActorInput`, `AuditTargetInput`, `BuildAuditEventInput`, `AuditMetadata`, `AuditPersistenceMode`, `AuditPrivacyLevel`, `AuditSeverity`, `AuditEventType`, `AuditActorRole`, `AuditTargetType`
- `src/lib/notifications/contracts/notificationNavigationContracts.ts` — notification reference patterns (not modified)

## Schema Design Principles

1. **Privacy-first** — PII is never stored in plain text in the main event table.
2. **Immutable events** — Audit events are append-only. No UPDATE or DELETE on core rows.
3. **Separation of concerns** — Metadata, reasons, and targets are in separate tables with independent access control.
4. **Retention-aware** — Each event carries retention metadata; purging is automated per policy.
5. **Index-optimized** — Indexes match the filter patterns defined in `AuditRepositoryFilters`.
6. **Rollback-safe** — Schema changes are additive; rollback drops only new tables/columns.

## Table: `audit_events`

Core event table. One row per audit action.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | CHAR(36) | NO | UUID v4 | Deterministic ID from event hash (see `audit_event_id` generation) |
| `event_type` | VARCHAR(64) | NO | — | Enum-like; see `AuditEventType` union type |
| `action_key` | VARCHAR(64) | YES | NULL | Maps to `SensitiveActionKey` from `sensitiveActions` config |
| `actor_id` | VARCHAR(64) | NO | — | Internal user/app identifier |
| `actor_role` | VARCHAR(32) | NO | — | Enum: `student`, `staff`, `provider`, `admin`, `executive`, `esq`, `system` |
| `actor_display_name` | VARCHAR(255) | YES | NULL | Display name — may contain PII; see privacy section |
| `target_type` | VARCHAR(32) | NO | — | Enum: `document`, `application`, `student`, `candidate`, `disclosure_request`, `match_review`, `shortlist_request`, `role_assignment`, `export_job`, `permission`, `ocr_job`, `integration_job` |
| `target_id` | VARCHAR(64) | NO | — | Target entity identifier |
| `target_display_token` | VARCHAR(255) | YES | NULL | Privacy-masked token (e.g., "Student #S-2345") |
| `target_privacy_level` | VARCHAR(16) | NO | 'internal' | Enum: `public`, `masked`, `internal`, `restricted`, `aggregate_only` |
| `reason_id` | BIGINT UNSIGNED | YES | NULL | FK to `audit_reasons.id` |
| `reason_required` | TINYINT(1) | NO | 0 | Boolean: was a reason required for this action? |
| `metadata_id` | BIGINT UNSIGNED | YES | NULL | FK to `audit_metadata_blobs.id` |
| `source_route` | VARCHAR(255) | YES | NULL | Originating route/URL |
| `severity` | VARCHAR(16) | NO | 'info' | Enum: `info`, `low`, `medium`, `high`, `critical` |
| `policy_version` | VARCHAR(16) | NO | — | Policy version at time of creation |
| `persistence_mode` | VARCHAR(16) | NO | 'mock_only' | Enum: `prototype_only`, `mock_only`, `real_persisted` |
| `created_at` | TIMESTAMP(6) | NO | CURRENT_TIMESTAMP(6) | Microsecond precision |
| `ip_address` | VARCHAR(45) | YES | NULL | IPv4/IPv6; see privacy section |
| `is_deleted` | TINYINT(1) | NO | 0 | Soft-delete flag for rollback |
| `deleted_at` | TIMESTAMP(6) | YES | NULL | When soft-deleted |

### Indexes on `audit_events`

| Index Name | Columns | Purpose |
|------------|---------|---------|
| `idx_audit_events_id` | `id` | Primary lookup |
| `idx_audit_events_actor_role` | `actor_role`, `created_at` | Filter by role + time range |
| `idx_audit_events_actor_id` | `actor_id`, `created_at` | Actor-centric queries |
| `idx_audit_events_target` | `target_type`, `target_id`, `created_at` | Target-centric queries |
| `idx_audit_events_event_type` | `event_type`, `created_at` | Event type filtering |
| `idx_audit_events_persistence` | `persistence_mode`, `created_at` | Persistence mode filtering |
| `idx_audit_events_severity` | `severity`, `created_at` | Severity-based queries |
| `idx_audit_events_created_at` | `created_at` | Time-based pagination and purging |
| `idx_audit_events_source_route` | `source_route` | Source-based filtering (prefix match) |
| `idx_audit_events_composite_admin` | `persistence_mode`, `created_at`, `severity` | Admin dashboard composite filter |

### Primary Key

```sql
PRIMARY KEY (id)
```

---

## Table: `audit_reasons`

Stores reason text separately from events for privacy and deduplication.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Surrogate key |
| `reason_text` | TEXT | NO | — | The full reason text |
| `reason_hash` | CHAR(64) | NO | — | SHA-256 of `reason_text` for dedup |
| `created_at` | TIMESTAMP(6) | NO | CURRENT_TIMESTAMP(6) | |

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| `idx_audit_reasons_hash` | `reason_hash` | Deduplication lookup |

### Notes

- Reason text may contain PII (e.g., "Student ID 12345 failed to submit"). Storing it separately allows independent access control and purge.
- The `reason_hash` enables deduplication — multiple events can reference the same reason.

---

## Table: `audit_metadata_blobs`

Stores event metadata as a JSON blob, keyed for access control.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | |
| `metadata_json` | JSON | NO | — | Full metadata object |
| `sanitized_json` | JSON | YES | NULL | Copy with forbidden keys removed |
| `privacy_level` | VARCHAR(16) | NO | 'internal' | Highest privacy level among entries |
| `created_at` | TIMESTAMP(6) | NO | CURRENT_TIMESTAMP(6) | |

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| `idx_audit_metadata_blobs_privacy` | `privacy_level` | Filter by privacy level |

### Privacy Rules for Metadata

- `metadata_json` stores the raw, unsanitized metadata as received from the event builder.
- `sanitized_json` stores a copy with forbidden keys removed (using `AuditMetadataSanitizerContract`).
- Forbidden keys are defined in `audit_metadata_rules` configuration (analogous to `FORBIDDEN_AUDIT_METADATA_KEYS` in TS).
- Access to `metadata_json` is restricted to admin roles only through application-layer policy.
- `sanitized_json` is what gets returned through the API and displayed in the drawer.

### Example Forbidden Keys

```
student_token, student_national_id, student_full_name, 
student_address, student_phone, raw_ssn
```

---

## Table: `audit_retention_policies`

Defines retention rules per event type / severity combination.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | |
| `event_type` | VARCHAR(64) | NO | — | `*` for wildcard / all events |
| `severity` | VARCHAR(16) | YES | NULL | NULL means all severities |
| `retention_days` | INT UNSIGNED | NO | 365 | Days to keep; NULL = permanent |
| `archive_after_days` | INT UNSIGNED | YES | NULL | Move to archive table after N days |
| `purge_on_delete` | TINYINT(1) | NO | 0 | Hard-delete on purge (vs. archive) |
| `created_at` | TIMESTAMP(6) | NO | CURRENT_TIMESTAMP(6) | |
| `updated_at` | TIMESTAMP(6) | YES | NULL | |

### Default Retention Rules

| Event Type | Severity | Retention | Archive After |
|------------|----------|-----------|---------------|
| `*` (all) | `info` | 365 days | 180 days |
| `*` (all) | `low` | 730 days | 365 days |
| `*` (all) | `medium` | 1095 days | 730 days |
| `*` (all) | `high` | 2190 days | 1095 days |
| `*` (all) | `critical` | 3650 days | 2190 days |
| `admin.role.*` | any | 3650 days | 2190 days |
| `staff.document.*` | any | 2190 days | 1095 days |
| `student.*` (system-generated) | any | 365 days | 180 days |

---

## Table: `audit_archived_events`

Cold storage for events past their archive threshold.

Mirrors `audit_events` columns, with the addition of:

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `archived_at` | TIMESTAMP(6) | NO | CURRENT_TIMESTAMP(6) | When archived |
| `original_created_at` | TIMESTAMP(6) | NO | — | Preserves the original timestamp |

### Notes

- Archived events are queried through a database view (`audit_events_all`) that unions both tables.
- Archive queries are read-only. No writes to the archive table from the application.
- Archival is performed by a scheduled task (Laravel scheduler command).

---

## Database View: `audit_events_all`

```sql
CREATE VIEW audit_events_all AS
SELECT *, 'active' AS storage_status FROM audit_events
UNION ALL
SELECT *, 'archived' AS storage_status FROM audit_archived_events;
```

This view provides a unified query surface for reporting and admin display.

---

## Privacy and PII Handling

### PII Fields in `audit_events`

| Field | PII Risk | Mitigation |
|-------|----------|------------|
| `actor_display_name` | **High** — contains real names | Tokenized to role-based display in `target_display_token`. Raw name stored for audit trail but access-restricted. |
| `ip_address` | **High** — direct identifier | Stored as SHA-256 hash in a separate column `ip_address_hash` (not plain). Full IP accessible only via admin override. Added as an extension column, not in main table. |
| `source_route` | **Low** — route paths only | No PII in routes by design (enforced by notification policy). Stored as-is. |
| `reason_id` → `reason_text` | **Medium** — may contain incidental PII | Stored in separate table. Access logged. Sanitized display in UI via `renderMetadataValue` equivalent. |

### Proposed Additional Column for IP Privacy

```sql
ALTER TABLE audit_events ADD COLUMN ip_hash CHAR(64) GENERATED ALWAYS AS (SHA2(IP_ADDRESS, 256)) STORED;
```

- The `ip_address` column is nullable and set to NULL after the retention warm-up period (e.g., 30 days).
- The `ip_hash` column persists for deduplication and abuse detection.

### Access Control Model

| Role | Can Read `actor_display_name` | Can Read `ip_address` | Can Read `reason_text` | Can Read Raw Metadata |
|------|-------------------------------|----------------------|----------------------|----------------------|
| Student | No — sees `student_token` only | No | No | No |
| Staff | Yes (own actions only) | No | Yes (own events) | No — sees sanitized only |
| Admin | Yes | Yes (with override) | Yes | Yes (raw + sanitized) |
| Provider/Executive | No — sees `actor_role` + `target_display_token` only | No | No | No |

This access model is enforced in the application layer (policy/service), not in database grants.

---

## Laravel Migration Plan (Equivalent)

The following describes what Laravel migrations would look like. These are **not** executed — they serve as a blueprint for the implementation phase.

### Migration 1: `create_audit_events_table`

```php
Schema::create('audit_events', function (Blueprint $table) {
    $table->string('id', 36)->primary();
    $table->string('event_type', 64);
    $table->string('action_key', 64)->nullable();
    $table->string('actor_id', 64);
    $table->string('actor_role', 32);
    $table->string('actor_display_name', 255)->nullable();
    $table->string('target_type', 32);
    $table->string('target_id', 64);
    $table->string('target_display_token', 255)->nullable();
    $table->string('target_privacy_level', 16)->default('internal');
    $table->unsignedBigInteger('reason_id')->nullable();
    $table->boolean('reason_required')->default(false);
    $table->unsignedBigInteger('metadata_id')->nullable();
    $table->string('source_route', 255)->nullable();
    $table->string('severity', 16)->default('info');
    $table->string('policy_version', 16);
    $table->string('persistence_mode', 16)->default('mock_only');
    $table->timestamp('created_at', 6)->useCurrent();
    $table->string('ip_address', 45)->nullable();
    $table->boolean('is_deleted')->default(false);
    $table->timestamp('deleted_at', 6)->nullable();

    // Indexes
    $table->index(['actor_role', 'created_at']);
    $table->index(['actor_id', 'created_at']);
    $table->index(['target_type', 'target_id', 'created_at']);
    $table->index(['event_type', 'created_at']);
    $table->index(['persistence_mode', 'created_at']);
    $table->index(['severity', 'created_at']);
    $table->index('created_at');
    $table->index('source_route');
    $table->index(['persistence_mode', 'created_at', 'severity']);

    $table->foreign('reason_id')->references('id')->on('audit_reasons');
    $table->foreign('metadata_id')->references('id')->on('audit_metadata_blobs');
});
```

### Migration 2: `create_audit_reasons_table`

```php
Schema::create('audit_reasons', function (Blueprint $table) {
    $table->id();
    $table->text('reason_text');
    $table->string('reason_hash', 64);
    $table->timestamp('created_at', 6)->useCurrent();

    $table->unique('reason_hash');
});
```

### Migration 3: `create_audit_metadata_blobs_table`

```php
Schema::create('audit_metadata_blobs', function (Blueprint $table) {
    $table->id();
    $table->json('metadata_json');
    $table->json('sanitized_json')->nullable();
    $table->string('privacy_level', 16)->default('internal');
    $table->timestamp('created_at', 6)->useCurrent();

    $table->index('privacy_level');
});
```

### Migration 4: `create_audit_retention_policies_table`

```php
Schema::create('audit_retention_policies', function (Blueprint $table) {
    $table->id();
    $table->string('event_type', 64);
    $table->string('severity', 16)->nullable();
    $table->unsignedInteger('retention_days')->default(365);
    $table->unsignedInteger('archive_after_days')->nullable();
    $table->boolean('purge_on_delete')->default(false);
    $table->timestamps(precision: 6);

    $table->index(['event_type', 'severity']);
});
```

### Migration 5: `create_audit_archived_events_table`

```php
Schema::create('audit_archived_events', function (Blueprint $table) {
    // Same columns as audit_events, minus foreign keys
    $table->string('id', 36)->primary();
    $table->string('event_type', 64);
    // ... (all audit_events columns)
    $table->timestamp('archived_at', 6)->useCurrent();
    $table->timestamp('original_created_at', 6);
});
```

### Migration 6: `audit_events_ip_hash` (additive)

```php
Schema::table('audit_events', function (Blueprint $table) {
    $table->char('ip_hash', 64)->storedAs('SHA2(IP_ADDRESS, 256)')->nullable();
});
```

---

## Rollback Plan

All migrations are additive — no existing columns are renamed or removed.

| Rollback Step | Action | Impact |
|---------------|--------|--------|
| 1 | Drop `audit_archived_events` table | No data loss (archive copy only) |
| 2 | Drop `audit_retention_policies` table | Retention reverts to manual only |
| 3 | Drop `audit_metadata_blobs` table + FK on `audit_events` | Metadata stored inline (as before) |
| 4 | Drop `audit_reasons` table + FK on `audit_events` | Reason text stored inline as nullable VARCHAR on `audit_events` |
| 5 | Drop new indexes on `audit_events` | Performance reverts to previous |
| 6 | Drop `audit_events` table entirely | **Full data loss** — only in catastrophic rollback |

**Recommended rollback boundary:** Steps 1–4 are safe to rollback independently. Step 5 is performance-only. Step 6 is emergency-only.

---

## Phased Implementation Plan

### Phase 0 (Current) — No Persistence
- `persistence_mode = 'mock_only'` for all events
- InMemoryAuditRepository in use
- No database writes

### Phase 1 — Prototype Persistence (AP-8B → AP-8C-QA → AP-9)
- Create `audit_events` table only
- `persistence_mode = 'prototype_only'`
- Write events but with soft-delete capability
- Admin view filters to `persistence_mode IN ('mock_only', 'prototype_only')`
- No metadata table — metadata stored as JSON column on `audit_events`

### Phase 2 — Real Persistence with Privacy Controls
- Create `audit_reasons`, `audit_metadata_blobs` tables
- Implement `AuditMetadataSanitizerContract` at write time
- Separate raw and sanitized metadata
- Implement access control model per role
- Enable `ip_hash` column, begin phasing out plain IP storage

### Phase 3 — Archive and Retention
- Create `audit_archived_events` table
- Create `audit_retention_policies` table with defaults
- Implement scheduled archival command
- Implement scheduled purge command (soft-delete → hard-delete after grace period)
- Create `audit_events_all` view

### Phase 4 — Optimization
- Add composite indexes based on query patterns observed in production
- Partition `audit_events` by `created_at` range (monthly or quarterly)
- Consider read replicas for admin reporting
- Add database-level audit triggers for compliance

---

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Schema changes after initial migration | All migrations are additive; rollback plan provided |
| PII leak through metadata | Sanitized copy + access control model |
| IP address exposure | Hashed column + NULL after warm-up period |
| Reason text containing PII | Separate table with restricted access |
| Performance degradation | Index-optimized for known filter patterns |
| Data loss during archival | Archive table preserves all columns; soft-delete on active table |
| Retention policy too aggressive | Default 365-day minimum; critical events retained 10 years |
| Rollback complexity | Phased rollback with independent steps |

---

## Dependencies and Prerequisites

Before implementing:

1. ✅ AP-8A — Audit service/repository/policy/presenter contracts (done)
2. ✅ AP-8C — Audit display presenter refactor (done)
3. AP-8C-QA — QA checkpoint for presenter refactor (recommended before starting persistence)
4. Review of `AuditMetadataSanitizerContract` implementation in TS
5. Decision on database engine (PostgreSQL recommended for JSONB and partitioning support)

## Recommended Next Step

After review and approval:

**Option A:** AP-9 — Implement prototype persistence (Phase 1) — create `audit_events` table, implement `InMemoryAuditRepository → DatabaseAuditRepository` transition, keep `persistence_mode = 'prototype_only'`.

**Option B:** Write Laravel migrations for Phase 1 only, hold Phases 2–4 for later.

**Option C:** Revisit after AP-8C-QA passes, to ensure the presenter boundary is stable before persisting to the database.

Do not start real persistence without explicit approval.
Do not start AP-9 without the schema plan being reviewed and approved.