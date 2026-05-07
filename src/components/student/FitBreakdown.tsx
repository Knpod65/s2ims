'use client'
import { useLang } from '@/lib/i18n'
import type { FitContribution } from '@/data/mock/studentMatchingData'

type FitBreakdownProps = {
  items: FitContribution[]
  className?: string
}

export default function FitBreakdown({ items, className = '' }: FitBreakdownProps) {
  /**
   * FitBreakdown
   *
   * This component visualizes weighted soft-fit contributions toward a match score.
   * - Semantics: items represent contributory factors with relative weights (soft-fit).
   * - Use: provide explanation of how different factors contributed to the computed match score.
   * - Do NOT use as a hard eligibility gate; use `EligibilityChecklist` for MUST-pass requirements.
   *
   * Props:
   * - `items`: array of contributions with `label`, `description`, and numeric `value`.
   */
  const { lang } = useLang()
  const total = Math.max(1, items.reduce((sum, item) => sum + item.value, 0))

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map(item => {
        const width = Math.max(8, Math.round((item.value / total) * 100))
        return (
          <div key={item.id}>
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-ink-1">{item.label[lang]}</div>
                <div className="mt-0.5 text-xs leading-relaxed text-ink-3">{item.description[lang]}</div>
              </div>
              <div className="font-mono text-sm font-semibold text-role-primary">{item.value}</div>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#E5EDFF]">
              <div
                className="h-full rounded-full bg-role-gradient"
                style={{ width: `${width}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
