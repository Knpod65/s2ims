'use client'

// AP-9G Stage 2 + Stage 3 Admin Audit Comparison Debug Panel
// Stage 2: gated debug shell (disabled by default) — present on audit-log page
// Stage 3: optional staging-only aggregate observability rendering when
// additional staging flags are enabled. All Stage 3 behavior is gated and
// defaults to disabled.

import { getReadComparisonMetrics } from '@/lib/audit/comparison/auditReadComparisonMetrics'

export type AdminAuditComparisonDebugPanelProps = {
  role?: string
  enabled?: boolean
  featureEnabled?: boolean
  readCompareEnabled?: boolean
  prototypeMetricsEnabled?: boolean
  stagingReviewEnabled?: boolean
}

export function AdminAuditComparisonDebugPanel(
  props: AdminAuditComparisonDebugPanelProps,
) {
  const {
    role,
    enabled = false,
    featureEnabled = false,
    readCompareEnabled = false,
    prototypeMetricsEnabled = false,
    stagingReviewEnabled = false,
  } = props

  // Non-admins must see no DOM trace
  if (role !== 'admin') return null
  if (!enabled) return null

  // Stage 2 behavior: early-disabled or feature not ready
  if (!featureEnabled || !readCompareEnabled) {
    return (
      <section
        aria-label="Developer Debug: Audit Comparison Panel"
        className="mb-4 rounded border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-700"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">Developer Debug: Audit Read Comparison</span>
          <span
            role="status"
            aria-live="polite"
            className="rounded border border-slate-300 bg-white px-2 py-0.5 font-mono text-[10px] uppercase tracking-normal text-slate-600"
          >
            Disabled
          </span>
        </div>
        <p className="mt-2 text-slate-600">Comparison debug panel is disabled.</p>
      </section>
    )
  }

  // Stage 3: if staging-specific metrics and review gates are enabled,
  // render a safe aggregate-only observability surface. Otherwise, show
  // the Stage 2 enabled shell (non-authoritative placeholder).
  if (prototypeMetricsEnabled && stagingReviewEnabled) {
    const metrics = getReadComparisonMetrics()
    const total = metrics.count()
    const matched = metrics.countByStatus('matched')
    const mismatched = metrics.countByStatus('mismatched')
    const failed = metrics.countByStatus('failed')
    const recent = metrics.list().slice(-5).reverse()

    return (
      <section aria-label="Stage 3 Audit Comparison Observability" className="mb-4 rounded border border-dashed border-slate-300 bg-amber-50 p-3 text-xs text-amber-900">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Stage 3: Audit Read Comparison — Observability (staging only)</div>
          <div className="text-[11px] font-mono">Runs: {total} • matched: {matched} • mismatched: {mismatched} • failed: {failed}</div>
        </div>
        <div className="mt-2 text-amber-900">
          <ul className="mt-2 list-disc list-inside">
            {recent.map((r) => (
              <li key={r.createdAt} className="mb-1">
                <span className="font-mono">{r.createdAt}</span> — {r.safeMessage} — {r.status} — sourceCount={r.sourceCount} prototypeCount={r.prototypeCount} mismatchCount={r.mismatchCount}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-2 text-[10px] text-amber-800">Note: Aggregate-only diagnostics. Prototype reads are diagnostic — not official audit evidence.</div>
      </section>
    )
  }

  return (
    <section
      aria-label="Developer Debug: Audit Comparison Panel"
      className="mb-4 rounded border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-700"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">Developer Debug: Audit Read Comparison</span>
        <span role="status" aria-live="polite" className="rounded border border-amber-300 bg-amber-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-normal text-amber-700">
          Enabled
        </span>
      </div>
      <p className="mt-2 text-slate-600">Aggregate comparison display is not enabled in Stage 2.</p>
    </section>
  )
}

export default AdminAuditComparisonDebugPanel
