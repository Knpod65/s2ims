import type { AuditEvent, AuditEventType, AuditActorRole, AuditTargetType, AuditPrivacyLevel, AuditSeverity } from './auditTypes'

export interface MockAuditWriterOptions {
  allowDuplicateIds?: boolean
}

export interface MockAuditWriterFilter {
  eventType?: AuditEventType
  actorRole?: AuditActorRole
  targetType?: AuditTargetType
  targetPrivacyLevel?: AuditPrivacyLevel
  severity?: AuditSeverity
  sourceRoute?: string
  persistenceMode?: 'mock_only' | 'prototype_only' | 'real_persisted'
}

export interface MockAuditWriterSnapshot {
  events: AuditEvent[]
  count: number
}

export class MockAuditWriterError extends Error {
  readonly code: 'INVALID_PERSISTENCE_MODE' | 'DUPLICATE_ID' | 'INVALID_EVENT'

  constructor(code: MockAuditWriterError['code'], message: string) {
    super(message)
    this.name = 'MockAuditWriterError'
    this.code = code
  }
}

export interface MockAuditWriter {
  write(event: AuditEvent): AuditEvent
  writeMany(events: AuditEvent[]): AuditEvent[]
  list(filter?: MockAuditWriterFilter): AuditEvent[]
  getById(id: string): AuditEvent | undefined
  clear(): void
  seed(events: AuditEvent[]): void
  snapshot(): MockAuditWriterSnapshot
  count(): number
}

function isMockOnlyMode(mode: string): boolean {
  return mode === 'mock_only'
}

function shallowCopyEvent(event: AuditEvent): AuditEvent {
  return { ...event }
}

export function createMockAuditWriter(options?: MockAuditWriterOptions): MockAuditWriter {
  let events: AuditEvent[] = []
  const allowDuplicateIds = options?.allowDuplicateIds ?? false

  const write = (event: AuditEvent): AuditEvent => {
    if (!isMockOnlyMode(event.persistenceMode)) {
      throw new MockAuditWriterError(
        'INVALID_PERSISTENCE_MODE',
        `Writer only accepts mock_only events, got ${event.persistenceMode}`
      )
    }

    if (!allowDuplicateIds) {
      const existing = events.find((e) => e.id === event.id)
      if (existing) {
        throw new MockAuditWriterError(
          'DUPLICATE_ID',
          `Event with id "${event.id}" already exists`
        )
      }
    }

    const copy = shallowCopyEvent(event)
    events.push(copy)
    return copy
  }

  const writeMany = (inputEvents: AuditEvent[]): AuditEvent[] => {
    const results: AuditEvent[] = []
    for (const event of inputEvents) {
      results.push(write(event))
    }
    return results
  }

  const list = (filter?: MockAuditWriterFilter): AuditEvent[] => {
    if (!filter) {
      return events.map(shallowCopyEvent)
    }

    return events
      .filter((event) => {
        if (filter.eventType && event.eventType !== filter.eventType) return false
        if (filter.actorRole && event.actorRole !== filter.actorRole) return false
        if (filter.targetType && event.targetType !== filter.targetType) return false
        if (filter.targetPrivacyLevel && event.targetPrivacyLevel !== filter.targetPrivacyLevel) return false
        if (filter.severity && event.severity !== filter.severity) return false
        if (filter.sourceRoute && event.sourceRoute !== filter.sourceRoute) return false
        if (filter.persistenceMode && event.persistenceMode !== filter.persistenceMode) return false
        return true
      })
      .map(shallowCopyEvent)
  }

  const getById = (id: string): AuditEvent | undefined => {
    const event = events.find((e) => e.id === id)
    return event ? shallowCopyEvent(event) : undefined
  }

  const clear = (): void => {
    events = []
  }

  const seed = (inputEvents: AuditEvent[]): void => {
    clear()
    writeMany(inputEvents)
  }

  const snapshot = (): MockAuditWriterSnapshot => ({
    events: events.map(shallowCopyEvent),
    count: events.length,
  })

  const count = (): number => events.length

  return {
    write,
    writeMany,
    list,
    getById,
    clear,
    seed,
    snapshot,
    count,
  }
}