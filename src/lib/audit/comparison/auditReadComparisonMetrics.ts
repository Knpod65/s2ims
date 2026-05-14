// ---------------------------------------------------------------------------
// Audit Read Comparison Metrics — AP-9F
// ---------------------------------------------------------------------------
// In-memory, developer-safe, PII-free metrics store for read comparison
// diagnostics. No localStorage, no sessionStorage, no indexedDB, no backend.
// Stores only safe result summaries. Never stores metadata values or reason text.
// ---------------------------------------------------------------------------

import type { AuditReadComparisonStatus, AuditReadComparisonResult } from './auditReadComparisonTypes'

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

export interface AuditReadComparisonMetricsStore {
  append(result: AuditReadComparisonResult): void
  list(): AuditReadComparisonResult[]
  count(): number
  countByStatus(status: AuditReadComparisonStatus): number
  clear(): void
}

// ---------------------------------------------------------------------------
// Factory — each call creates an isolated in-memory store
// ---------------------------------------------------------------------------

export function createAuditReadComparisonMetricsStore(): AuditReadComparisonMetricsStore {
  let results: AuditReadComparisonResult[] = []

  return {
    append(result: AuditReadComparisonResult): void {
      results.push(result)
    },

    list(): AuditReadComparisonResult[] {
      // Return shallow copies to prevent external mutation of internal state
      return results.map((r) => ({
        ...r,
        mismatches: r.mismatches.map((m) => ({ ...m })),
      }))
    },

    count(): number {
      return results.length
    },

    countByStatus(status: AuditReadComparisonStatus): number {
      return results.filter((r) => r.status === status).length
    },

    clear(): void {
      results = []
    },
  }
}

// ---------------------------------------------------------------------------
// Module-level shared store
// ---------------------------------------------------------------------------

const sharedReadComparisonMetricsStore = createAuditReadComparisonMetricsStore()

export function getReadComparisonMetrics(): AuditReadComparisonMetricsStore {
  return sharedReadComparisonMetricsStore
}
