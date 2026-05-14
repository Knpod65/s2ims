// ---------------------------------------------------------------------------
// In-Memory Prototype Audit Storage Driver — AP-9A Runtime Skeleton
// ---------------------------------------------------------------------------
// An in-memory implementation of AuditStorageDriverContract for
// prototype testing. Data is held in a module-level array and is
// lost when the module is reloaded (page refresh, server restart).
//
// This driver:
//   - Does NOT use localStorage or sessionStorage
//   - Does NOT write to any database or file
//   - Does NOT call any backend API
//   - Is isolated from the existing sharedMockWriter
//   - Is disabled by default (see AuditPersistenceConfig)
//
// Laravel/PHP equivalent:
//   App\Storage\InMemoryAuditStorageDriver
// ---------------------------------------------------------------------------

import type {
  AuditStorageDriverContract,
  AuditStorageWriteInput,
  AuditStorageRecord,
  AuditStorageReadFilters,
  AuditStorageQueryResult,
  AuditStorageDriverHealth,
  AuditStorageWriteResult,
  AuditStorageMode,
} from './auditStorageDriver'
import { isPrototypePersistenceEnabled } from './auditPersistenceConfig'

// ---------------------------------------------------------------------------
// Driver Implementation
// ---------------------------------------------------------------------------

export class InMemoryPrototypeAuditStorageDriver
  implements AuditStorageDriverContract
{
  readonly mode: AuditStorageMode = 'prototype_only'

  // Internal storage — module-scoped, not persisted anywhere.
  private records: AuditStorageRecord[] = []

  // Optional config override for testing.
  private configOverride?: { prototypeEnabled?: boolean }

  constructor(config?: { prototypeEnabled?: boolean }) {
    this.configOverride = config
  }

  /**
   * Whether the driver is currently enabled.
   * Respects the global config if no override is provided.
   */
isEnabled(): boolean {
     // Prefer instance-level config override
     if (this.configOverride?.prototypeEnabled !== undefined) {
       return this.configOverride.prototypeEnabled
     }
     // Fall back to global config
     const { isPrototypePersistenceEnabled } = require('./auditPersistenceConfig') as typeof import('./auditPersistenceConfig')
     return isPrototypePersistenceEnabled()
   }

  /** Health check — always returns healthy for the in-memory driver. */
  async health(): Promise<AuditStorageDriverHealth> {
    return {
      status: 'healthy',
      mode: this.mode,
      recordCount: this.records.length,
      lastWriteAt:
        this.records.length > 0
          ? this.records[this.records.length - 1].storedAt
          : undefined,
    }
  }

  /**
   * Append a single record.
   * Returns success=false if prototype persistence is not enabled.
   */
  async append(
    record: AuditStorageWriteInput,
  ): Promise<AuditStorageWriteResult> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error:
          'InMemoryPrototypeAuditStorageDriver: prototype persistence is not enabled',
      }
    }

    // Validate mode: only prototype_only is accepted
    if (record.persistenceMode !== 'prototype_only') {
      throw new Error(
        `InMemoryPrototypeAuditStorageDriver: mode "${record.persistenceMode}" is not supported.`,
      )
    }

    const storedRecord: AuditStorageRecord = {
      ...record,
      storedAt: new Date().toISOString(),
    }

    this.records.push(storedRecord)

    return {
      success: true,
      record: { ...storedRecord },
    }
  }

  /** Append multiple records. */
  async appendMany(
    records: AuditStorageWriteInput[],
  ): Promise<AuditStorageWriteResult[]> {
    return Promise.all(records.map((r) => this.append(r)))
  }

  /** Find one record by event ID. Returns a copy to prevent mutation. */
  async findById(
    eventId: string,
  ): Promise<AuditStorageRecord | null> {
    const found = this.records.find((r) => r.eventId === eventId)
    return found ? { ...found } : null
  }

  /** Query records with optional filters. Returns copies. */
  async query(
    filters?: AuditStorageReadFilters,
  ): Promise<AuditStorageRecord[]> {
    let results = [...this.records]

    if (filters) {
      if (filters.eventType) {
        const types = Array.isArray(filters.eventType)
          ? filters.eventType
          : [filters.eventType]
        results = results.filter((r) => types.includes(r.eventType))
      }

      if (filters.actorRole) {
        const roles = Array.isArray(filters.actorRole)
          ? filters.actorRole
          : [filters.actorRole]
        results = results.filter((r) => roles.includes(r.actorRole))
      }

      if (filters.actorId) {
        results = results.filter((r) => r.actorId === filters.actorId)
      }

      if (filters.targetType) {
        const types = Array.isArray(filters.targetType)
          ? filters.targetType
          : [filters.targetType]
        results = results.filter((r) => types.includes(r.targetType))
      }

      if (filters.targetToken) {
        results = results.filter(
          (r) => r.targetDisplayToken === filters.targetToken,
        )
      }

      if (filters.severity) {
        const sev = Array.isArray(filters.severity)
          ? filters.severity
          : [filters.severity]
        results = results.filter((r) => sev.includes(r.severity))
      }

      if (filters.persistenceMode) {
        const modes = Array.isArray(filters.persistenceMode)
          ? filters.persistenceMode
          : [filters.persistenceMode]
        results = results.filter((r) =>
          modes.includes(r.persistenceMode as AuditStorageMode),
        )
      }

      if (filters.sourceRoute) {
        const routes = Array.isArray(filters.sourceRoute)
          ? filters.sourceRoute
          : [filters.sourceRoute]
        results = results.filter((r) =>
          r.sourceRoute ? routes.includes(r.sourceRoute) : false,
        )
      }

      if (filters.createdAtStart) {
        results = results.filter(
          (r) => r.createdAt >= filters.createdAtStart!,
        )
      }

      if (filters.createdAtEnd) {
        results = results.filter(
          (r) => r.createdAt <= filters.createdAtEnd!,
        )
      }

      // Pagination
      const page = filters.page ?? 1
      const perPage = filters.perPage ?? 50

      if (filters.sort) {
        const dir = filters.direction === 'desc' ? -1 : 1
        results.sort((a, b) => {
          const aVal = (a as any)[filters.sort!]
          const bVal = (b as any)[filters.sort!]
          if (aVal < bVal) return -1 * dir
          if (aVal > bVal) return 1 * dir
          return 0
        })
      }

      const start = (page - 1) * perPage
      const end = start + perPage
      results = results.slice(start, end)
    }

    // Return copies to prevent external mutation
    return results.map((r) => ({ ...r }))
  }

  /** Count records matching filters. */
  async count(
    filters?: AuditStorageReadFilters,
  ): Promise<number> {
    // For counting, we need to apply the same filters without pagination.
    const allRecords = [...this.records]

    if (!filters) return allRecords.length

    let results = allRecords

    if (filters.eventType) {
      const types = Array.isArray(filters.eventType)
        ? filters.eventType
        : [filters.eventType]
      results = results.filter((r) => types.includes(r.eventType))
    }

    if (filters.actorRole) {
      const roles = Array.isArray(filters.actorRole)
        ? filters.actorRole
        : [filters.actorRole]
      results = results.filter((r) => roles.includes(r.actorRole))
    }

    if (filters.actorId) {
      results = results.filter((r) => r.actorId === filters.actorId)
    }

    if (filters.targetType) {
      const types = Array.isArray(filters.targetType)
        ? filters.targetType
        : [filters.targetType]
      results = results.filter((r) => types.includes(r.targetType))
    }

    if (filters.targetToken) {
      results = results.filter(
        (r) => r.targetDisplayToken === filters.targetToken,
      )
    }

    if (filters.severity) {
      const sev = Array.isArray(filters.severity)
        ? filters.severity
        : [filters.severity]
      results = results.filter((r) => sev.includes(r.severity))
    }

    if (filters.persistenceMode) {
      const modes = Array.isArray(filters.persistenceMode)
        ? filters.persistenceMode
        : [filters.persistenceMode]
      results = results.filter((r) =>
        modes.includes(r.persistenceMode as AuditStorageMode),
      )
    }

    if (filters.sourceRoute) {
      const routes = Array.isArray(filters.sourceRoute)
        ? filters.sourceRoute
        : [filters.sourceRoute]
      results = results.filter((r) =>
        r.sourceRoute ? routes.includes(r.sourceRoute) : false,
      )
    }

    if (filters.createdAtStart) {
      results = results.filter(
        (r) => r.createdAt >= filters.createdAtStart!,
      )
    }

    if (filters.createdAtEnd) {
      results = results.filter(
        (r) => r.createdAt <= filters.createdAtEnd!,
      )
    }

    return results.length
  }

  /** Clear all stored prototype records (test/dev utility). */
  async clear(): Promise<void> {
    this.records = []
  }

  /** Return snapshot for diagnostics (test utility). */
  snapshot(): { records: AuditStorageRecord[]; count: number } {
    return {
      records: this.records.map((r) => ({ ...r })),
      count: this.records.length,
    }
  }
}