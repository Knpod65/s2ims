import type { EligibilityCriterion, EligibilityStatus } from '@/lib/types'
import { AlertCircle, CheckCircle2, Clock3, FileQuestion, HelpCircle, XCircle } from 'lucide-react'

const STATUS_VIEW: Record<EligibilityStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  PASS: {
    label: 'ผ่าน',
    icon: CheckCircle2,
    className: 'border-cyber-mint/80 bg-cyber-mint/35 text-emerald-900',
  },
  FAIL: {
    label: 'ไม่ผ่าน',
    icon: XCircle,
    className: 'border-cyber-blush/80 bg-cyber-blush/45 text-rose-900',
  },
  MISSING: {
    label: 'ขาดข้อมูล',
    icon: FileQuestion,
    className: 'border-cyber-peach/80 bg-cyber-peach/45 text-orange-900',
  },
  PENDING: {
    label: 'รอข้อมูล',
    icon: Clock3,
    className: 'border-cyber-violet/80 bg-cyber-violet/40 text-violet-950',
  },
  UNCLEAR: {
    label: 'ไม่ชัดเจน',
    icon: HelpCircle,
    className: 'border-cyber-violet/75 bg-cyber-violet/35 text-violet-950',
  },
  NOT_VERIFIED: {
    label: 'ยังไม่ตรวจสอบ',
    icon: AlertCircle,
    className: 'border-cyber-cyan/80 bg-cyber-cyan/30 text-sky-950',
  },
}

interface EligibilityChecklistProps {
  criteria: EligibilityCriterion[]
  compact?: boolean
}

export default function EligibilityChecklist({ criteria, compact = false }: EligibilityChecklistProps) {
  const mandatory = criteria.filter((item) => item.mandatory)
  const visible = compact ? mandatory.slice(0, 3) : mandatory

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <h3 className="break-words text-xs font-bold text-cyber-slate">เงื่อนไขบังคับ</h3>
        <span className="flex-shrink-0 text-[10px] font-medium text-cyber-slate/70">
          {mandatory.filter((item) => item.status === 'PASS').length}/{mandatory.length} ผ่าน
        </span>
      </div>
      <div className="space-y-2">
        {visible.map((item) => {
          const view = STATUS_VIEW[item.status]
          const Icon = view.icon

          return (
            <div key={item.id} className="rounded-lg border border-cyber-border/40 bg-white/60 p-2.5">
              <div className="flex items-start gap-2">
                <span className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full border ${view.className}`}>
                  <Icon size={14} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <div className="break-words text-xs font-semibold text-cyber-slate">
                      {item.label_th || item.label_en}
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${view.className}`}>
                      {view.label}
                    </span>
                  </div>
                  <div className="mt-0.5 break-words text-[11px] leading-snug text-cyber-slate/75">
                    {item.requirement}
                  </div>
                  {!compact && item.reason && (
                    <div className="mt-1 break-words text-[11px] leading-snug text-cyber-slate/65">
                      {item.reason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {compact && mandatory.length > visible.length && (
        <div className="break-words text-[11px] text-cyber-slate/70">
          +{mandatory.length - visible.length} เงื่อนไขเพิ่มเติม
        </div>
      )}
    </div>
  )
}
