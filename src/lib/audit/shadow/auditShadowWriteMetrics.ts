// ---------------------------------------------------------------------------
// Audit Shadow Write Metrics — AP-9D
// ---------------------------------------------------------------------------
// In-memory, developer-safe, PII-free metrics for shadow write diagnostics.
// No localStorage, no backend, no PII.
// ---------------------------------------------------------------------------

import type { AuditEvent } from '../auditTypes'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AuditShadowWriteStatus = 'skipped' | 'written' | 'failed' | 'blocked'

export type AuditShadowWriteSkipReason =
  | 'prototype_disabled'
  | 'shadow_write_disabled'
  | 'real_persisted_blocked'
  | 'unsupported_event_type'
  | 'privacy_guard_failed'
  | 'prototype_service_unavailable'
  | 'write_failed'

export interface AuditShadowWriteMetric {
  id: string
  eventId: string
  eventType: string
  status: AuditShadowWriteStatus
  reason?: AuditShadowWriteSkipReason
  createdAt: string
  safeMessage: string
}

// ---------------------------------------------------------------------------
// Metric Factory
// ---------------------------------------------------------------------------

let _metricIdCounter = 0

export function createAuditShadowWriteMetric(input: {
  eventId: string
  eventType: string
  status: AuditShadowWriteStatus
  reason?: AuditShadowWriteSkipReason
  safeMessage: string
}): AuditShadowWriteMetric {
  _metricIdCounter += 1
  return {
    id: `shadow_metric_${_metricIdCounter}`,
    eventId: input.eventId,
    eventType: input.eventType,
    status: input.status,
    reason: input.reason,
    createdAt: new Date().toISOString(),
    safeMessage: input.safeMessage,
  }
}

// ---------------------------------------------------------------------------
// Metrics Store
// ---------------------------------------------------------------------------

export interface AuditShadowWriteMetricsStore {
  append(metric: AuditShadowWriteMetric): void
  list(): AuditShadowWriteMetric[]
  count(): number
  clear(): void
  countByStatus(status: AuditShadowWriteStatus): number
}

export function createAuditShadowWriteMetricsStore(): AuditShadowWriteMetricsStore {
  let metrics: AuditShadowWriteMetric[] = []

  return {
    append(metric: AuditShadowWriteMetric): void {
      metrics.push(metric)
    },
    list(): AuditShadowWriteMetric[] {
      return metrics.map((m) => ({ ...m }))
    },
    count(): number {
      return metrics.length
    },
    clear(): void {
      metrics = []
    },
    countByStatus(status: AuditShadowWriteStatus): number {
      return metrics.filter((m) => m.status === status).length
    },
  }
}

// ---------------------------------------------------------------------------
// Module-level shared store (for use by the service)
// ---------------------------------------------------------------------------

const sharedMetricsStore = createAuditShadowWriteMetricsStore()

export function getShadowWriteMetrics(): AuditShadowWriteMetricsStore {
  return sharedMetricsStore
}