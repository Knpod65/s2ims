// ---------------------------------------------------------------------------
// Audit Read Comparison Service — AP-9F
// ---------------------------------------------------------------------------
// Compares source (mock/admin) audit events with prototype audit events
// in memory. Disabled-by-default. Never switches Admin UI to prototype reads.
// Never mutates input events. Never exposes PII in mismatch output.
// Failures return status 'failed' — never throw into UI.
//
// This service does NOT:
// - Switch Admin UI to prototype reads
// - Promote prototype events as source of truth
// - Activate real persistence
// - Mutate source or prototype event arrays
// - Expose actorId, targetId, reason, or metadata values in mismatches
// - Affect Admin table, drawer, CSV/export, or Staff UI
// ---------------------------------------------------------------------------

import type { AuditEvent } from '../auditTypes'
import { AuditDisplayPresenter } from '../presenters/auditDisplayPresenter'
import {
  type AuditReadComparisonInput,
  type AuditReadComparisonResult,
  type AuditReadComparisonMismatch,
  type AuditReadComparisonMismatchCategory,
  type AuditReadComparisonDimension,
} from './auditReadComparisonTypes'
import {
  evaluateAuditReadComparisonGuards,
} from './auditReadComparisonGuards'
import {
  createAuditReadComparisonMetricsStore,
  getReadComparisonMetrics,
  type AuditReadComparisonMetricsStore,
} from './auditReadComparisonMetrics'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mismatch(
  category: AuditReadComparisonMismatchCategory,
  dimension: AuditReadComparisonDimension,
  safeMessage: string,
  opts?: {
    sourceEventId?: string
    prototypeEventId?: string
    sourceSafeToken?: string
    prototypeSafeToken?: string
  },
): AuditReadComparisonMismatch {
  return {
    category,
    dimension,
    safeMessage,
    sourceEventId: opts?.sourceEventId,
    prototypeEventId: opts?.prototypeEventId,
    sourceSafeToken: opts?.sourceSafeToken,
    prototypeSafeToken: opts?.prototypeSafeToken,
  }
}

function safeKeySet(metadata: AuditEvent['metadata']): Set<string> {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return new Set()
  }
  return new Set(Object.keys(metadata))
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false
  return Array.from(a).every((key) => b.has(key))
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class AuditReadComparisonService {
  private metrics: AuditReadComparisonMetricsStore
  private presenter: AuditDisplayPresenter

  constructor(
    metricsStore?: AuditReadComparisonMetricsStore,
    presenter?: AuditDisplayPresenter,
  ) {
    this.metrics = metricsStore ?? getReadComparisonMetrics()
    this.presenter = presenter ?? new AuditDisplayPresenter('en', 'admin')
  }

  // ---------------------------------------------------------------------------
  // compare — main entry point
  // ---------------------------------------------------------------------------

  compare(input: AuditReadComparisonInput): AuditReadComparisonResult {
    const createdAt = input.createdAt ?? new Date().toISOString()

    // Run guards
    const guardResult = evaluateAuditReadComparisonGuards(input)

    if (!guardResult.allowed) {
      const result: AuditReadComparisonResult = {
        status: guardResult.status,
        sourceCount: input.sourceEvents?.length ?? 0,
        prototypeCount: input.prototypeEvents?.length ?? 0,
        mismatchCount: 0,
        mismatches: [],
        createdAt,
        safeMessage: guardResult.safeMessage,
      }
      this.metrics.append(result)
      return result
    }

    // Run comparison — failures are caught and returned as 'failed', never thrown
    try {
      const mismatches = this.compareEventLists(
        input.sourceEvents,
        input.prototypeEvents,
      )

      const status = mismatches.length > 0 ? 'mismatched' : 'matched'
      const result: AuditReadComparisonResult = {
        status,
        sourceCount: input.sourceEvents.length,
        prototypeCount: input.prototypeEvents.length,
        mismatchCount: mismatches.length,
        mismatches,
        createdAt,
        safeMessage:
          status === 'matched'
            ? `Comparison matched: ${input.sourceEvents.length} source events`
            : `Comparison found ${mismatches.length} mismatch(es)`,
      }
      this.metrics.append(result)
      return result
    } catch (error) {
      const result: AuditReadComparisonResult = {
        status: 'failed',
        sourceCount: input.sourceEvents.length,
        prototypeCount: input.prototypeEvents.length,
        mismatchCount: 0,
        mismatches: [],
        createdAt,
        safeMessage: `Comparison failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      }
      this.metrics.append(result)
      return result
    }
  }

  // ---------------------------------------------------------------------------
  // compareEventLists — core dimension checks
  // ---------------------------------------------------------------------------

  compareEventLists(
    sourceEvents: AuditEvent[],
    prototypeEvents: AuditEvent[],
  ): AuditReadComparisonMismatch[] {
    const mismatches: AuditReadComparisonMismatch[] = []

    // --- Dimension: event_count ---
    if (sourceEvents.length !== prototypeEvents.length) {
      mismatches.push(
        mismatch(
          'missing_in_prototype',
          'event_count',
          `Event count mismatch: source=${sourceEvents.length} prototype=${prototypeEvents.length}`,
        ),
      )
    }

    // Build ID maps — detect duplicates in prototype
    const sourceById = new Map<string, AuditEvent>()
    const protoById = new Map<string, AuditEvent>()
    const protoDuplicateIds = new Set<string>()

    for (const e of sourceEvents) {
      sourceById.set(e.id, e)
    }

    for (const e of prototypeEvents) {
      if (protoById.has(e.id)) {
        protoDuplicateIds.add(e.id)
      } else {
        protoById.set(e.id, e)
      }
    }

    // --- Dimension: event_ids — duplicates ---
    Array.from(protoDuplicateIds).forEach((dupId) => {
      mismatches.push(
        mismatch('duplicate_in_prototype', 'event_ids', `Duplicate event ID in prototype: ${dupId}`, {
          prototypeEventId: dupId,
        }),
      )
    })

    // --- Dimension: event_ids — missing in prototype ---
    Array.from(sourceById.entries()).forEach(([id, srcEvent]) => {
      if (!protoById.has(id)) {
        mismatches.push(
          mismatch('missing_in_prototype', 'event_ids', `Event missing in prototype: ${id}`, {
            sourceEventId: id,
            sourceSafeToken: srcEvent.targetDisplayToken,
          }),
        )
      }
    })

    // --- Dimension: event_ids — extra in prototype ---
    Array.from(protoById.entries()).forEach(([id, protoEvent]) => {
      if (!sourceById.has(id)) {
        mismatches.push(
          mismatch('extra_in_prototype', 'event_ids', `Extra event in prototype: ${id}`, {
            prototypeEventId: id,
            prototypeSafeToken: protoEvent.targetDisplayToken,
          }),
        )
      }
    })

    // --- Per-matched-pair dimension checks ---
    Array.from(sourceById.entries()).forEach(([id, srcEvent]) => {
      const protoEvent = protoById.get(id)
      if (!protoEvent) return // already handled in missing_in_prototype

      // event_types
      if (srcEvent.eventType !== protoEvent.eventType) {
        mismatches.push(
          mismatch('event_type_mismatch', 'event_types', `Event type mismatch for ${id}`, {
            sourceEventId: id,
            prototypeEventId: id,
            sourceSafeToken: srcEvent.targetDisplayToken,
            prototypeSafeToken: protoEvent.targetDisplayToken,
          }),
        )
      }

      // actor_role
      if (srcEvent.actorRole !== protoEvent.actorRole) {
        mismatches.push(
          mismatch('actor_role_mismatch', 'actor_role', `Actor role mismatch for ${id}`, {
            sourceEventId: id,
            prototypeEventId: id,
          }),
        )
      }

      // target_display_token
      if (srcEvent.targetDisplayToken !== protoEvent.targetDisplayToken) {
        mismatches.push(
          mismatch(
            'target_display_token_mismatch',
            'target_display_token',
            `Target display token mismatch for ${id}`,
            {
              sourceEventId: id,
              prototypeEventId: id,
              sourceSafeToken: srcEvent.targetDisplayToken,
              prototypeSafeToken: protoEvent.targetDisplayToken,
            },
          ),
        )
      }

      // persistence_mode — only flag real_persisted; mock_only vs prototype_only is expected
      if (srcEvent.persistenceMode === 'real_persisted') {
        mismatches.push(
          mismatch(
            'persistence_mode_mismatch',
            'persistence_mode',
            `Source event has real_persisted mode — not allowed in comparison`,
            { sourceEventId: id },
          ),
        )
      }
      if (protoEvent.persistenceMode === 'real_persisted') {
        mismatches.push(
          mismatch(
            'persistence_mode_mismatch',
            'persistence_mode',
            `Prototype event has real_persisted mode — not allowed in comparison`,
            { prototypeEventId: id },
          ),
        )
      }

      // severity
      if (srcEvent.severity !== protoEvent.severity) {
        mismatches.push(
          mismatch('severity_mismatch', 'severity', `Severity mismatch for ${id}`, {
            sourceEventId: id,
            prototypeEventId: id,
          }),
        )
      }

      // safe_metadata_keys — compare key names only, never values
      const srcKeys = safeKeySet(srcEvent.metadata)
      const protoKeys = safeKeySet(protoEvent.metadata)
      if (!setsEqual(srcKeys, protoKeys)) {
        mismatches.push(
          mismatch('metadata_key_mismatch', 'safe_metadata_keys', `Metadata key set mismatch for ${id}`, {
            sourceEventId: id,
            prototypeEventId: id,
          }),
        )
      }

      // presenter_output — compare safe display fields only
      try {
        const srcRow = this.presenter.present(srcEvent)
        const protoRow = this.presenter.present(protoEvent)
        const presenterDiffers =
          srcRow.actionLabel !== protoRow.actionLabel ||
          srcRow.actorRoleLabel !== protoRow.actorRoleLabel ||
          srcRow.persistenceLabel !== protoRow.persistenceLabel
        if (presenterDiffers) {
          mismatches.push(
            mismatch('presenter_output_mismatch', 'presenter_output', `Presenter output mismatch for ${id}`, {
              sourceEventId: id,
              prototypeEventId: id,
            }),
          )
        }

        // copy_stage
        if (srcRow.copyStage !== protoRow.copyStage) {
          mismatches.push(
            mismatch('copy_stage_mismatch', 'copy_stage', `Copy stage mismatch for ${id}`, {
              sourceEventId: id,
              prototypeEventId: id,
            }),
          )
        }
      } catch {
        // Presenter failure is non-blocking — skip presenter dimension for this pair
      }
    })

    // --- Dimension: timestamp_order ---
    const sourceSorted = [...sourceEvents].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    const protoSorted = [...prototypeEvents].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    const srcIds = sourceSorted.map((e) => e.id)
    const protoIds = protoSorted.filter((e) => sourceById.has(e.id)).map((e) => e.id)
    // Compare matched event order only
    const srcMatchedOrder = srcIds.filter((id) => protoById.has(id))
    if (srcMatchedOrder.join(',') !== protoIds.join(',')) {
      mismatches.push(
        mismatch('order_mismatch', 'timestamp_order', 'Timestamp sort order differs between source and prototype'),
      )
    }

    return mismatches
  }

  // ---------------------------------------------------------------------------
  // Diagnostic helpers
  // ---------------------------------------------------------------------------

  getMetrics(): ReturnType<AuditReadComparisonMetricsStore['list']> {
    return this.metrics.list()
  }

  getMetricSummary(): Record<string, number> {
    return {
      disabled: this.metrics.countByStatus('disabled'),
      skipped: this.metrics.countByStatus('skipped'),
      matched: this.metrics.countByStatus('matched'),
      mismatched: this.metrics.countByStatus('mismatched'),
      failed: this.metrics.countByStatus('failed'),
    }
  }

  clearMetrics(): void {
    this.metrics.clear()
  }
}

// ---------------------------------------------------------------------------
// Testing factory
// ---------------------------------------------------------------------------

/**
 * Creates a read comparison service for testing purposes.
 * Uses an isolated in-memory metrics store.
 */
export function createAuditReadComparisonServiceForTesting(options?: {
  featureEnabled?: boolean
  readCompareEnabled?: boolean
}): {
  service: AuditReadComparisonService
  metrics: AuditReadComparisonMetricsStore
  buildInput: (
    sourceEvents: AuditEvent[],
    prototypeEvents: AuditEvent[],
  ) => AuditReadComparisonInput
} {
  const metrics = createAuditReadComparisonMetricsStore()
  const service = new AuditReadComparisonService(metrics)

  function buildInput(
    sourceEvents: AuditEvent[],
    prototypeEvents: AuditEvent[],
  ): AuditReadComparisonInput {
    return {
      sourceEvents,
      prototypeEvents,
      featureEnabled: options?.featureEnabled ?? true,
      readCompareEnabled: options?.readCompareEnabled ?? true,
      adminCompareVisible: false,
    }
  }

  return { service, metrics, buildInput }
}
