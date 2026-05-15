'use client'

// AP-9G Stage 2 gated debug shell.
// Default and blocked states return null. The visible shell is Admin-only,
// disabled-by-default, aggregate-placeholder only, and never changes the
// Admin Audit Log source of truth.

export type AdminAuditComparisonDebugPanelProps = {
  role?: string
  enabled?: boolean
  featureEnabled?: boolean
  readCompareEnabled?: boolean
}

export function AdminAuditComparisonDebugPanel(
  props: AdminAuditComparisonDebugPanelProps,
) {
  const {
    role,
    enabled = false,
    featureEnabled = false,
    readCompareEnabled = false,
  } = props

  if (role !== 'admin') return null
  if (!enabled) return null

  if (!featureEnabled || !readCompareEnabled) {
    return (
      <section
        aria-label="Developer Debug: Audit Comparison Panel"
        className="mb-4 rounded border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-700"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">
            Developer Debug: Audit Read Comparison
          </span>
          <span
            role="status"
            aria-live="polite"
            className="rounded border border-slate-300 bg-white px-2 py-0.5 font-mono text-[10px] uppercase tracking-normal text-slate-600"
          >
            Disabled
          </span>
        </div>
        <p className="mt-2 text-slate-600">
          Comparison debug panel is disabled.
        </p>
      </section>
    )
  }

  return (
    <section
      aria-label="Developer Debug: Audit Comparison Panel"
      className="mb-4 rounded border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-700"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">
          Developer Debug: Audit Read Comparison
        </span>
        <span
          role="status"
          aria-live="polite"
          className="rounded border border-amber-300 bg-amber-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-normal text-amber-700"
        >
          Enabled
        </span>
      </div>
      <p className="mt-2 text-slate-600">
        Aggregate comparison display is not enabled in Stage 2.
      </p>
    </section>
  )
}

export default AdminAuditComparisonDebugPanel
