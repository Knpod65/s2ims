# Audit Storage Driver Contract AP-9

## Purpose

Define the storage driver abstraction that future prototype persistence must implement.

This contract ensures that any storage backend (in-memory, file-based, or database) can be swapped without changing the service or repository layer.

## Contract Principles

1. **Storage drivers do not build events.** They receive pre-validated, pre-sanitized persistence records.
2. **Storage drivers do not validate reason text.** Validation happens upstream in the service layer via policy.
3. **Storage drivers do not decide visibility.** Access control is enforced by policy and presenter layers.
4. **Storage drivers do not format display labels.** Presentation is handled by the presenter.
5. **Storage drivers only store and retrieve sanitized persistence records.** They are pure data interfaces.
6. **Storage drivers must be replaceable.** The system must function if the driver is swapped (e.g., from in-memory to database).
7. **Failure in storage must not break the Staff UI.** Write failures are logged, not thrown to the user.

## Proposed TypeScript Interface

```typescript
// src/lib/audit/storage/auditStorageDriver.ts
// Planning notation only — not implemented

export type AuditStorageMode = 'mock_only' | 'prototype_only' | 'real_persisted'

export type AuditStorageWriteInput = {
  eventId: string
  eventType: string
  actorRole: string
  actorId: string
  actorDisplayName: string
  targetType: string
  targetId: string
  targetDisplayToken: string
  targetPrivacyLevel: string
  severity: string
  persistenceMode: AuditStorageMode
  sourceRoute?: string
  policyVersion: string
  metadataRef?: string
  reasonRef?: string
  createdAt: string
  ipHash?: string
}

export type AuditStorageRecord = AuditStorageWriteInput & {
  storedAt: string
}

export interface AuditStorageQuery {
  eventType?: string | string[]
  actorRole?: string | string[]
  actorId?: string
  targetType?: string | string[]
  targetToken?: string
  severity?: string | string[]
  persistenceMode?: AuditStorageMode | AuditStorageMode[]
  sourceRoute?: string | string[]
  createdAtStart?: string
  createdAtEnd?: string
  page?: number
  perPage?: number
  sort?: string
  direction?: 'asc' | 'desc'
}

export type AuditStorageQueryResult = {
  records: AuditStorageRecord[]
  total: number
  page: number
  perPage: number
}

export type AuditStorageHealth = {
  status: 'healthy' | 'degraded' | 'unavailable'
  message?: string
  mode: AuditStorageMode
  recordCount: number
  lastWriteAt?: string
}

export type AuditStorageWriteResult = {
  success: boolean
  record?: AuditStorageRecord
  error?: string
}

export interface AuditStorageDriver {
  /** Write a single record. Returns success status and stored record. */
  write(input: AuditStorageWriteInput): Promise<AuditStorageWriteResult>

  /** Write multiple records. */
  writeMany(inputs: AuditStorageWriteInput[]): Promise<AuditStorageWriteResult[]>

  /** Find one record by ID. */
  findById(eventId: string): Promise<AuditStorageRecord | null>

  /** Query records with filters. */
  query(filters: AuditStorageQuery): Promise<AuditStorageQueryResult>

  /** Count records matching filters. */
  count(filters: AuditStorageQuery): Promise<number>

  /** Health check. */
  healthCheck(): Promise<AuditStorageHealth>

  /** Clear all stored records (test/dev utility). */
  clear?(mode?: AuditStorageMode): Promise<void>

  /** Seed with pre-built records (test/dev utility). */
  seed?(records: AuditStorageWriteInput[]): Promise<void>
}
```

## Laravel/PHP Equivalent

```php
// app/Contracts/AuditStorageDriverInterface.php

interface AuditStorageDriverInterface
{
    public function store(AuditStorageWriteInput $input): AuditStorageWriteResult;
    public function storeMany(array $inputs): array; // Collection<AuditStorageWriteResult>
    public function findById(string $eventId): ?AuditStorageRecord;
    public function query(AuditStorageQuery $filters): AuditStorageQueryResult;
    public function count(AuditStorageQuery $filters): int;
    public function healthCheck(): AuditStorageHealth;
    public function clear(?string $mode = null): void;
    public function seed(array $records): void;
}
```

## Driver Types

### 1. InMemoryAuditStorageDriver

- **Purpose:** Development, testing, dev-only mode.
- **Storage:** PHP array / static class property.
- **Persistence:** None — data resets on process exit.
- **Use when:** Running tests, local development, CI environments.
- **Pros:** Fast, no dependencies, easy to clear.
- **Cons:** No durability, no sharing across requests/processes.

### 2. PrototypeFileAuditStorageDriver (Future)

- **Purpose:** Prototype persistence with minimal infrastructure.
- **Storage:** JSON file on local filesystem.
- **Mode:** `prototype_only`
- **Pros:** Simple setup, human-readable, no database needed.
- **Cons:** Not suitable for concurrent writes, no query optimization, file lock risks.

### 3. DatabaseAuditStorageDriver (Future)

- **Purpose:** Real persistence with full query support.
- **Storage:** MySQL/PostgreSQL database tables (per AP-8B schema).
- **Mode:** `real_persisted`
- **Pros:** Full query support, durability, concurrency, retention management.
- **Cons:** Requires database setup, migration, connection management.

**Recommendation:** Start with `InMemoryAuditStorageDriver` for any prototype work. Do not use file or database drivers until compliance review is complete.

## Safety Requirements for All Drivers

Every storage driver must enforce (or rely on upstream enforcement of):

- No raw student ID in any stored field
- No email address
- No phone number
- No national ID
- No raw IP address (only hashed form)
- No raw uploaded file names
- No raw file paths
- No unsanitized metadata blobs (must be pre-sanitized)
- No full document text (OCR content)
- No sensitive reason text stored alongside metadata
- Deterministic, unique event IDs
- Duplicate detection (reject or skip duplicate writes)
- Immutable writes (no update/delete on stored records — soft-delete only)

## Failure Handling

Storage driver failures must:

1. Return a `success: false` result with an error string.
2. NOT throw exceptions that break the caller's workflow.
3. Log a warning to the application log (console in prototype stage).
4. Allow the Staff UI to continue functioning normally.
5. Not leave partial writes (atomic operations preferred).

## Rollback

Storage drivers can be disabled safely by:

1. Switching the active driver back to `InMemoryAuditStorageDriver`.
2. Setting `audit.persistence.enabled = false` in config.
3. Routing all writes back through the shared mock writer (existing AP-6D path).
4. Admin read path can continue reading from the (now stale) storage or fall back to mock/fixture data.

No storage driver removal should affect existing mock data or the Admin display's ability to function.

## Config Mapping

```php
// config/audit.php (future Laravel equivalent)
return [
    'driver' => env('AUDIT_STORAGE_DRIVER', 'memory'),
    'drivers' => [
        'memory' => InMemoryAuditStorageDriver::class,
        'file' => PrototypeFileAuditStorageDriver::class,
        'database' => DatabaseAuditStorageDriver::class,
    ],
    'default_mode' => 'mock_only',
    'prototype_enabled' => false,
    'real_persistence_enabled' => false,
    'shadow_writes' => false, // write to both mock + prototype simultaneously
];
```