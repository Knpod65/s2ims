'use client'
import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { EligibilityRow, EligibilityStatus } from '@/data/mock/studentMatchingData'

type EligibilityChecklistProps = {
  rows: EligibilityRow[]
  className?: string
}

const STATUS_STYLE: Record<EligibilityStatus, string> = {
  met: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  unmet: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
  unknown: 'bg-surface-low text-ink-2 border-line',
}

const STATUS_ICON = {
  met: CheckCircle2,
  unmet: AlertTriangle,
  unknown: HelpCircle,
}

export default function EligibilityChecklist({ rows, className = '' }: EligibilityChecklistProps) {
  /**
   * EligibilityChecklist
   *
   * This component renders a list of hard eligibility gates for a scholarship.
   * - Semantics: each row represents a MUST-pass requirement (hard eligibility).
   * - Use: show explicit requirement, student-provided value, and status (met / unmet / unknown).
   * - Do NOT use for soft-fit explanations; use `FitBreakdown` for weighted contribution details.
   *
   * Props:
   * - `rows`: array of eligibility rows with `requirement`, `studentValue`, `note`, and `status`.
   */
  const { lang } = useLang()
  const statusLabel = {
    met: { th: 'ผ่าน', en: 'Met' },
    unmet: { th: 'ควรเตรียม', en: 'Needs attention' },
    unknown: { th: 'รอข้อมูล', en: 'Unknown' },
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-line bg-white ${className}`}>
      <div className="hidden grid-cols-[1.3fr_1fr_0.8fr] gap-3 border-b border-line bg-surface-low px-4 py-3 text-xs font-semibold text-ink-2 md:grid">
        <div>{lang === 'th' ? 'ข้อกำหนด' : 'Requirement'}</div>
        <div>{lang === 'th' ? 'ข้อมูลของคุณ' : 'Student value'}</div>
        <div>{lang === 'th' ? 'สถานะ' : 'Status'}</div>
      </div>
      <div className="divide-y divide-line">
        {rows.map(row => {
          const Icon = STATUS_ICON[row.status]
          return (
            <div key={row.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1.3fr_1fr_0.8fr] md:items-center">
              <div>
                <div className="text-sm font-semibold text-ink-1">{row.requirement[lang]}</div>
                <div className="mt-1 text-xs leading-relaxed text-ink-3">{row.note[lang]}</div>
              </div>
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3 md:hidden">
                  {lang === 'th' ? 'ข้อมูลของคุณ' : 'Student value'}
                </div>
                <span className="font-mono text-sm font-semibold text-ink-1">{row.studentValue[lang]}</span>
              </div>
              <div>
                <span className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[row.status]}`}>
                  <Icon size={13} />
                  {statusLabel[row.status][lang]}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
