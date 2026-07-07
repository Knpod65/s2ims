import type { MatchReason } from '@/lib/types'
import { AlertTriangle, Check, FileQuestion, ShieldAlert } from 'lucide-react'

const TYPE_VIEW: Record<MatchReason['type'], { label: string; className: string; icon: typeof Check }> = {
  strength: {
    label: 'จุดแข็ง',
    className: 'border-cyber-mint/80 bg-cyber-mint/35 text-emerald-950',
    icon: Check,
  },
  missing_requirement: {
    label: 'ต้องเติม',
    className: 'border-cyber-peach/80 bg-cyber-peach/45 text-orange-950',
    icon: FileQuestion,
  },
  review_flag: {
    label: 'รอตรวจ',
    className: 'border-cyber-violet/80 bg-cyber-violet/40 text-violet-950',
    icon: AlertTriangle,
  },
  disqualifier: {
    label: 'ไม่ผ่าน',
    className: 'border-cyber-blush/80 bg-cyber-blush/50 text-rose-950',
    icon: ShieldAlert,
  },
}

interface MatchReasonChipsProps {
  reasons: MatchReason[]
  maxItems?: number
}

export default function MatchReasonChips({ reasons, maxItems = 4 }: MatchReasonChipsProps) {
  const visible = reasons.slice(0, maxItems)

  if (visible.length === 0) {
    return <div className="break-words text-xs text-cyber-slate/70">ยังไม่มีเหตุผลประกอบ</div>
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((reason) => {
        const view = TYPE_VIEW[reason.type]
        const Icon = view.icon

        return (
          <span
            key={reason.id}
            className={`inline-flex max-w-full items-start gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${view.className}`}
            title={reason.detail}
          >
            <Icon size={12} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span className="flex-shrink-0">{view.label}</span>
            <span className="min-w-0 break-words font-medium opacity-85">{reason.label_th || reason.label_en}</span>
          </span>
        )
      })}
      {reasons.length > visible.length && (
        <span className="rounded-full border border-cyber-border/45 bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-cyber-slate/70">
          +{reasons.length - visible.length}
        </span>
      )}
    </div>
  )
}
