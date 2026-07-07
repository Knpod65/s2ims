import type { MatchStatus } from '@/lib/types'
import { AlertCircle, CheckCircle2, Clock3, Sparkles } from 'lucide-react'

export const MATCH_STATUS_COPY: Record<MatchStatus, { label: string; helper: string; tone: string }> = {
  MATCHED: {
    label: 'แมตช์แล้ว',
    helper: 'เงื่อนไขครบ แต่ยังไม่ใช่ผลอนุมัติ',
    tone: 'border-cyber-mint/80 bg-cyber-mint/45 text-cyber-slate',
  },
  NEAR_MATCH: {
    label: 'ใกล้แมตช์',
    helper: 'ยังขาดข้อมูลหรือเอกสารบางอย่าง',
    tone: 'border-cyber-peach/85 bg-cyber-peach/55 text-cyber-slate',
  },
  PENDING_REVIEW: {
    label: 'รอตรวจสอบ',
    helper: 'ต้องให้เจ้าหน้าที่ตรวจสอบข้อมูลก่อน',
    tone: 'border-cyber-violet/85 bg-cyber-violet/45 text-cyber-slate',
  },
  NOT_ELIGIBLE: {
    label: 'ยังไม่เข้าเงื่อนไข',
    helper: 'มีเงื่อนไขสำคัญที่ยังไม่ผ่าน',
    tone: 'border-cyber-blush/85 bg-cyber-blush/50 text-cyber-slate',
  },
}

const ICONS = {
  MATCHED: CheckCircle2,
  NEAR_MATCH: Sparkles,
  PENDING_REVIEW: Clock3,
  NOT_ELIGIBLE: AlertCircle,
} satisfies Record<MatchStatus, typeof CheckCircle2>

interface MatchStatusBadgeProps {
  status: MatchStatus
  compact?: boolean
}

export default function MatchStatusBadge({ status, compact = false }: MatchStatusBadgeProps) {
  const copy = MATCH_STATUS_COPY[status]
  const Icon = ICONS[status]

  return (
    <div
      className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm ${copy.tone}`}
      aria-label={`${copy.label}: ${copy.helper}`}
    >
      <Icon size={compact ? 14 : 16} className="flex-shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <div className="break-words text-xs font-bold leading-tight">{copy.label}</div>
        {!compact && <div className="break-words text-[10px] leading-tight text-cyber-slate/75">{copy.helper}</div>}
      </div>
    </div>
  )
}
