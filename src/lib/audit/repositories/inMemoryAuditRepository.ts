// ---------------------------------------------------------------------------
// InMemoryAuditRepository — AP-8A Runtime Skeleton
// ---------------------------------------------------------------------------
// Minimal in-memory repository implementing AuditRepositoryContract.
// Used for testing and future migration; does NOT touch localStorage or DB.
//
// This is a skeleton: it stores events in a plain array and returns copies
// to prevent external mutation.
//
// Laravel/PHP equivalent: App\Repositories\Audit\InMemoryAuditRepository
// ---------------------------------------------------------------------------

import type {
  AuditEvent,
  AuditEventType,
  AuditActorRole,
  AuditTargetType,
  AuditPrivacyLevel,
  AuditSeverity,
  AuditPersistenceMode,
} from '../auditTypes'
import type { AuditRepositoryContract, AuditRepositoryFilters } from '../contracts/auditContracts'

export class InMemoryAuditRepository implements AuditRepositoryContract {
  private events: AuditEvent[] = []

  /** Append a single event. */
  async append(event: AuditEvent): Promise<void> {
    this.events.push({ ...event })
  }

  /** Append multiple events. */
  async appendMany(events: AuditEvent[]): Promise<void> {
    for (const event of events) {
      this.events.push({ ...event })
    }
  }

  /** Find an event by ID. Returns a copy or undefined. */
  async findById(id: string): Promise<AuditEvent | undefined> {
    const found = this.events.find((e) => e.id === id)
    return found ? { ...found } : undefined
  }

  /** List events matching optional filters. Returns copies. */
  async list(filters?: AuditRepositoryFilters): Promise<AuditEvent[]> {
    let results = [...this.events]

    if (filters) {
      if (filters.eventType) {
        const types = Array.isArray(filters.eventType) ? filters.eventType : [filters.eventType]
        results = results.filter((e) => types.includes(e.eventType))
      }
      if (filters.actorRole) {
        const roles = Array.isArray(filters.actorRole) ? filters.actorRole : [filters.actorRole]
        results = results.filter((e) => roles.includes(e.actorRole))
      }
      if (filters.actorId) {
        const ids = Array.isArray(filters.actorId) ? filters.actorId : [filters.actorId]
        results = results.filter((e) => ids.includes(e.actorId))
      }
      if (filters.targetType) {
        const types = Array.isArray(filters.targetType) ? filters.targetType : [filters.targetType]
        results = results.filter((e) => types.includes(e.targetType))
      }
      if (filters.targetId) {
        const ids = Array.isArray(filters.targetId) ? filters.targetId : [filters.targetId]
        results = results.filter((e) => ids.includes(e.targetId))
      }
      if (filters.persistenceMode) {
        const modes = Array.isArray(filters.persistenceMode) ? filters.persistenceMode : [filters.persistenceMode]
        results = results.filter((e) => modes.includes(e.persistenceMode))
      }
      if (filters.sourceRoute) {
        const routes = Array.isArray(filters.sourceRoute) ? filters.sourceRoute : [filters.sourceRoute]
        results = results.filter((e) => routes.includes(e.sourceRoute))
      }
      if (filters.severity) {
        const sev = Array.isArray(filters.severity) ? filters.severity : [filters.severity]
        results = results.filter((e) => sev.includes(e.severity))
      }
      if (filters.createdAtStart) {
        results = results.filter((e) => e.createdAt >= filters.createdAtStart!)
      }
      if (filters.createdAtEnd) {
        results = results.filter((e) => e.createdAt <= filters.createdAtEnd!)
      }
      if (filters.hasReason !== undefined) {
        results = results.filter((e) => (e.reason !== null && e.reason !== '') === filters.hasReason!)
      }
      if (filters.privacyLevel) {
        const levels = Array.isArray(filters.privacyLevel) ? filters.privacyLevel : [filters.privacyLevel]
        results = results.filter((e) => levels.includes(e.targetPrivacyLevel))
      }
    }

    // Return copies
    return results.map((e) => ({ ...e }))
  }

  /** Count events matching optional filters. */
  async count(filters?: AuditRepositoryFilters): Promise<number> {
    return (await this.list(filters)).length
  }

  /** Clear all stored events — for test/mock use only. */
  async clearMockOnly(): Promise<void> {
    this.events = []
  }

  /** Return how many events are currently stored. */
  get size(): number {
    return this.events.length
  }
}