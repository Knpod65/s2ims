// ---------------------------------------------------------------------------
// Audit Shadow Write Service — AP-9D
// ---------------------------------------------------------------------------
// Non-blocking shadow write service for prototype persistence.
// Receives an already-built AuditEvent after sharedMockWriter write succeeds.
// Accepts mock_only or prototype_only events; converts to prototype_only
// for storage. Never alters the original event.
//
// This service does NOT:
// - Mutate the input event
// - Replace sharedMockWriter
// - Affect Admin display
// - Trigger notifications
// - Expose PII
// - Throw into the UI
// ---------------------------------------------------------------------------

import type { AuditEvent, AuditPersistenceMode } from '../auditTypes'
import type { AuditPersistenceConfig } from '../storage/auditPersistenceConfig'
import { PrototypeAuditPersistenceService } from '../services/prototypeAuditPersistenceService'
import { evaluateAuditShadowWriteGuards, type AuditShadowWriteGuardResult } from './auditShadowWriteGuards'
import { createAuditShadowWriteMetric, getShadowWriteMetrics, type AuditShadowWriteMetric, type AuditShadowWriteSkipReason } from './auditShadowWriteMetrics'

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class AuditShadowWriteService {
  private prototypeService: PrototypeAuditPersistenceService
  private config: AuditPersistenceConfig
  private metrics: ReturnType<typeof getShadowWriteMetrics>

  constructor(
    config: AuditPersistenceConfig,
    prototypeService?: PrototypeAuditPersistenceService,
    metricsStore?: ReturnType<typeof getShadowWriteMetrics>,
  ) {
    this.config = config
    this.prototypeService =
      prototypeService ?? new PrototypeAuditPersistenceService()
    this.metrics = metricsStore ?? getShadowWriteMetrics()
  }

  // ---------------------------------------------------------------------------
  // Main shadow write method
  // ---------------------------------------------------------------------------

  /**
   * Attempts a non-blocking shadow write of the given event to prototype storage.
   * Accepts events with persistenceMode 'mock_only' or 'prototype_only'.
   * Internally converts to 'prototype_only' for the prototype write.
   * Returns a metric describing the outcome. Never throws.
   */
  async shadowWrite(event: AuditEvent): Promise<AuditShadowWriteMetric> {
    // Run all guard checks
    const guardResult = evaluateAuditShadowWriteGuards(event, this.config)

    if (!guardResult.allowed) {
      const metric = createAuditShadowWriteMetric({
        eventId: event.id,
        eventType: event.eventType,
        status: guardResult.status as AuditShadowWriteMetric['status'],
        reason: guardResult.reason as AuditShadowWriteSkipReason | undefined,
        safeMessage: guardResult.safeMessage,
      })
      this.metrics.append(metric)
      return metric
    }

    // Create a clone with prototype_only mode — never alter original event.
    // Shadow service may convert mock_only input to prototype_only copy internally.
    const prototypeEvent: AuditEvent = {
      ...event,
      persistenceMode: 'prototype_only' as AuditPersistenceMode,
      metadata: { ...event.metadata },
    }

    try {
      const result = await this.prototypeService.recordPrototypeEvent(prototypeEvent)

      if (result.success) {
        const metric = createAuditShadowWriteMetric({
          eventId: event.id,
          eventType: event.eventType,
          status: 'written',
          safeMessage: 'Shadow write succeeded',
        })
        this.metrics.append(metric)
        return metric
      } else {
        const metric = createAuditShadowWriteMetric({
          eventId: event.id,
          eventType: event.eventType,
          status: 'failed',
          reason: 'write_failed',
          safeMessage: `Shadow write failed: ${result.reason ?? 'unknown error'}`,
        })
        this.metrics.append(metric)
        // Developer-safe console warning — no PII
        console.warn(`[AUDIT PROTOTYPE] Shadow write failed: ${result.reason ?? 'unknown error'}`)
        return metric
      }
    } catch (error) {
      const metric = createAuditShadowWriteMetric({
        eventId: event.id,
        eventType: event.eventType,
        status: 'failed',
        reason: 'write_failed',
        safeMessage: `Shadow write exception: ${error instanceof Error ? error.message : 'unknown'}`,
      })
      this.metrics.append(metric)
      // Developer-safe console warning — no PII
      console.warn(`[AUDIT PROTOTYPE] Shadow write error: ${error instanceof Error ? error.message : 'unknown'}`)
      return metric
    }
  }

  // ---------------------------------------------------------------------------
  // Diagnostic helpers
  // ---------------------------------------------------------------------------

  /** Returns whether the shadow write service is currently active. */
  isEnabled(): boolean {
    return this.config.prototypeEnabled === true && this.config.shadowWrites === true
  }

  /** Returns a copy of current metrics. */
  getMetrics(): AuditShadowWriteMetric[] {
    return this.metrics.list()
  }

  /** Returns metric count summary. */
  getMetricSummary(): Record<AuditShadowWriteMetric['status'], number> {
    return {
      skipped: this.metrics.countByStatus('skipped'),
      written: this.metrics.countByStatus('written'),
      failed: this.metrics.countByStatus('failed'),
      blocked: this.metrics.countByStatus('blocked'),
    }
  }

  /** Clears all stored metrics (test/dev utility). */
  clearMetrics(): void {
    this.metrics.clear()
  }
}

// ---------------------------------------------------------------------------
// Testing factory
// ---------------------------------------------------------------------------

/**
 * Creates a shadow write service for testing purposes.
 * Uses in-memory prototype storage and configurable options.
 */
export function createAuditShadowWriteServiceForTesting(
  options?: {
    prototypeEnabled?: boolean
    shadowWrites?: boolean
    prototypeStorageEnabled?: boolean
  },
): {
  service: AuditShadowWriteService
  metrics: ReturnType<typeof getShadowWriteMetrics>
  config: AuditPersistenceConfig
} {
  const metrics = getShadowWriteMetrics()

  const config: AuditPersistenceConfig = {
    mode: options?.prototypeEnabled ? 'prototype_only' : 'mock_only',
    prototypeEnabled: options?.prototypeEnabled ?? false,
    shadowWrites: options?.shadowWrites ?? false,
    readFromPrototype: false,
  }

  const driver = new (require('../storage/inMemoryPrototypeAuditStorageDriver').InMemoryPrototypeAuditStorageDriver)(
    { prototypeEnabled: options?.prototypeStorageEnabled ?? false },
  )
  const prototypeService = new PrototypeAuditPersistenceService(driver, config)

  const service = new AuditShadowWriteService(config, prototypeService, metrics)

  return { service, metrics, config }
}