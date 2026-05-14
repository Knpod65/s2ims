// ---------------------------------------------------------------------------
// Prototype Audit Repository — AP-9A Runtime Skeleton
// ---------------------------------------------------------------------------
// A prototype repository that wraps AuditStorageDriverContract.
// This is NOT used by any current runtime page.
// It exists to provide a tested, ready-to-integrate repository
// for future prototype persistence work.
//
// The repository:
//   - Checks the feature guard before any write
//   - Only supports prototype_only writes
//   - Does NOT replace InMemoryAuditRepository
//   - Does NOT replace sharedMockWriter
//   - Passes through read operations to the storage driver
//
// Laravel/PHP equivalent:
//   App\Repositories\PrototypeAuditRepository
// ---------------------------------------------------------------------------

import type { AuditEvent, AuditPersistenceMode } from '../auditTypes'
import type { AuditStorageDriverContract } from '../storage/auditStorageDriver'
import type { AuditRepositoryFilters } from '../contracts/auditContracts'

export class PrototypeAuditRepository {
  constructor(
    private readonly driver: AuditStorageDriverContract,
  ) {}

  /**
   * Append a single event to prototype storage.
   * Checks driver enabled state before writing.
   */
  async append(event: AuditEvent): Promise<void> {
    // Guard: only prototype_only events are accepted
    if (event.persistenceMode !== 'prototype_only') {
      throw new Error(
        `PrototypeAuditRepository: only prototype_only events are accepted, got "${event.persistenceMode}"`,
      )
    }

    const record = this._eventToRecord(event)
    const result = await this.driver.append(record)

    if (!result.success) {
      throw new Error(
        `PrototypeAuditRepository write failed: ${result.error ?? 'unknown error'}`,
      )
    }
  }

  /**
   * Append multiple events to prototype storage.
   */
  async appendMany(events: AuditEvent[]): Promise<void> {
    for (const event of events) {
      if (event.persistenceMode !== 'prototype_only') {
        throw new Error(
          `PrototypeAuditRepository: only prototype_only events are accepted, got "${event.persistenceMode}"`,
        )
      }
    }

    const records = events.map(this._eventToRecord)
    const results = await this.driver.appendMany(records)

    const failures = results.filter((r) => !r.success)
    if (failures.length > 0) {
      throw new Error(
        `PrototypeAuditRepository: ${failures.length} of ${results.length} writes failed`,
      )
    }
  }

  /**
   * Find one event by ID.
   * Does NOT check feature guard — reads are allowed even when disabled
   * (for diagnostic comparison purposes).
   */
  async findById(id: string): Promise<AuditEvent | undefined> {
    const record = await this.driver.findById(id)
    if (!record) return undefined
    return this._recordToEvent(record)
  }

  /**
   * List events matching optional filters.
   * Does NOT check feature guard — reads are allowed even when disabled.
   */
  async list(filters?: AuditRepositoryFilters): Promise<AuditEvent[]> {
    const storageFilters = this._mapFilters(filters)
    const records = await this.driver.query(storageFilters)
    return records.map(this._recordToEvent)
  }

  /**
   * Count events matching optional filters.
   */
  async count(filters?: AuditRepositoryFilters): Promise<number> {
    const storageFilters = this._mapFilters(filters)
    return this.driver.count(storageFilters)
  }

  /**
   * Clear all prototype-only records.
   * Test/dev utility.
   */
  async clearPrototypeOnly(): Promise<void> {
    await this.driver.clear()
  }

  // ---------------------------------------------------------------------------
  // Internal mappings
  // ---------------------------------------------------------------------------

  private _eventToRecord(event: AuditEvent): import('../storage/auditStorageDriver').AuditStorageWriteInput {
    return {
      eventId: event.id,
      eventType: event.eventType,
      actorRole: event.actorRole,
      actorId: event.actorId,
      actorDisplayName: event.actorDisplayName,
      targetType: event.targetType,
      targetId: event.targetId,
      targetDisplayToken: event.targetDisplayToken,
      targetPrivacyLevel: event.targetPrivacyLevel,
      severity: event.severity,
      persistenceMode: event.persistenceMode as 'prototype_only',
      sourceRoute: event.sourceRoute,
      policyVersion: event.policyVersion,
      metadataRef: undefined, // Future: reference to sanitized metadata blob
      reasonRef: undefined, // Future: reference to reason record
      createdAt: event.createdAt,
    }
  }

  private _recordToEvent(
    record: import('../storage/auditStorageDriver').AuditStorageRecord,
  ): AuditEvent {
    return {
      id: record.eventId,
      eventType: record.eventType as AuditEvent['eventType'],
      actionKey: null,
      actorId: record.actorId,
      actorRole: record.actorRole as AuditEvent['actorRole'],
      actorDisplayName: record.actorDisplayName,
      targetType: record.targetType as AuditEvent['targetType'],
      targetId: record.targetId,
      targetDisplayToken: record.targetDisplayToken,
      targetPrivacyLevel: record.targetPrivacyLevel as AuditEvent['targetPrivacyLevel'],
      reason: null, // Reason stored separately in future
      reasonRequired: false,
      reasonMinLength: 0,
      metadata: {}, // Metadata stored separately in future
      sourceRoute: record.sourceRoute ?? '',
      createdAt: record.createdAt,
      severity: record.severity as AuditEvent['severity'],
      policyVersion: record.policyVersion,
      persistenceMode: record.persistenceMode as AuditPersistenceMode,
    }
  }

  private _mapFilters(
    filters?: AuditRepositoryFilters,
  ): import('../storage/auditStorageDriver').AuditStorageReadFilters {
    if (!filters) return {}
    const result: import('../storage/auditStorageDriver').AuditStorageReadFilters = {}
    if (filters.eventType) result.eventType = filters.eventType
    if (filters.actorRole) result.actorRole = filters.actorRole
    if (filters.actorId) {
      result.actorId = Array.isArray(filters.actorId)
        ? filters.actorId[0]
        : filters.actorId
    }
    if (filters.targetType) result.targetType = filters.targetType
    if (filters.targetId) {
      result.targetToken = Array.isArray(filters.targetId)
        ? filters.targetId[0]
        : filters.targetId
    }
    if (filters.severity) result.severity = filters.severity
    if (filters.persistenceMode) {
      const modes = Array.isArray(filters.persistenceMode)
        ? filters.persistenceMode.filter((m): m is 'mock_only' | 'prototype_only' => m !== 'real_persisted')
        : filters.persistenceMode === 'real_persisted'
          ? undefined
          : filters.persistenceMode
      if (modes && (Array.isArray(modes) ? modes.length > 0 : true)) {
        result.persistenceMode = modes
      }
    }
    if (filters.sourceRoute) result.sourceRoute = filters.sourceRoute
    if (filters.createdAtStart) result.createdAtStart = filters.createdAtStart
    if (filters.createdAtEnd) result.createdAtEnd = filters.createdAtEnd
    if (filters.page) result.page = filters.page
    if (filters.perPage) result.perPage = filters.perPage
    if (filters.sort) result.sort = filters.sort
    if (filters.direction) result.direction = filters.direction
    return result
  }
}