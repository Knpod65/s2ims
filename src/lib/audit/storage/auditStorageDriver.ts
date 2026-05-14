// ---------------------------------------------------------------------------
// Audit Storage Driver Contract — AP-9A Runtime Skeleton
// ---------------------------------------------------------------------------
// Defines the interface that all audit storage drivers must implement.
// This is the abstraction layer between the repository and the actual
// storage backend (in-memory, file, database).
//
// Laravel/PHP equivalent:
//   App\Contracts\Audit\AuditStorageDriverInterface
//   App\Storage\InMemoryAuditStorageDriver
//   App\Storage\DatabaseAuditStorageDriver (future)
// ---------------------------------------------------------------------------

import type { AuditEvent, AuditPersistenceMode } from '../auditTypes'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Supported storage driver modes. */
export type AuditStorageMode = 'mock_only' | 'prototype_only'

/** Input shape for writing a single record to storage. */
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

/** A stored record returned from the driver. */
export type AuditStorageRecord = AuditStorageWriteInput & {
  storedAt: string
}

/** Filter options for querying stored records. */
export type AuditStorageReadFilters = {
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

/** Result of a query operation. */
export type AuditStorageQueryResult = {
  records: AuditStorageRecord[]
  total: number
  page: number
  perPage: number
}

/** Health status of a storage driver. */
export type AuditStorageDriverHealth = {
  status: 'healthy' | 'degraded' | 'unavailable'
  message?: string
  mode: AuditStorageMode
  recordCount: number
  lastWriteAt?: string
}

/** Result of a write operation. */
export type AuditStorageWriteResult = {
  success: boolean
  record?: AuditStorageRecord
  error?: string
}

// ---------------------------------------------------------------------------
// Contract Interface
// ---------------------------------------------------------------------------

/**
 * Interface that all audit storage drivers must implement.
 *
 * Drivers are responsible for storing and retrieving sanitized,
 * pre-validated persistence records. They must NOT:
 * - Build or validate events (that happens upstream)
 * - Decide visibility or access control (policy layer)
 * - Format display labels (presenter layer)
 * - Store raw PII (enforced by upstream sanitizer)
 */
export interface AuditStorageDriverContract {
  /** The mode this driver operates in. */
  readonly mode: AuditStorageMode

  /** Whether the driver is currently enabled. */
  isEnabled(): boolean

  /** Health check for the storage backend. */
  health(): Promise<AuditStorageDriverHealth>

  /** Write a single record. Returns success/failure with the stored record. */
  append(record: AuditStorageWriteInput): Promise<AuditStorageWriteResult>

  /** Write multiple records. */
  appendMany(records: AuditStorageWriteInput[]): Promise<AuditStorageWriteResult[]>

  /** Find one record by its event ID. */
  findById(eventId: string): Promise<AuditStorageRecord | null>

  /** Query records matching the given filters. */
  query(filters: AuditStorageReadFilters)
    : Promise<AuditStorageRecord[]>

  /** Count records matching the given filters. */
  count(filters: AuditStorageReadFilters): Promise<number>

  /** Clear all stored records (test/dev utility). */
  clear(): Promise<void>
}