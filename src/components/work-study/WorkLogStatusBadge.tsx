import type { WorkLogStatus } from '@/lib/types'
import { AlertCircle, CheckCircle2, Clock3, FilePenLine, RotateCcw } from 'lucide-react'

const STATUS_COPY: Record<WorkLogStatus, { label: string; helper: string; tone: string; icon: typeof FilePenLine }> = {
  DRAFT: {
    label: 'ฉบับร่าง',
    helper: 'ยังไม่ได้ส่งให้ผู้ดูแล',
    tone: 'border-cyber-border/55 bg-white/65 text-cyber-slate',
    icon: FilePenLine,
  },
  SUBMITTED: {
    label: 'ส่งแล้ว',
    helper: 'รอผู้ดูแลตรวจชั่วโมงจริง',
    tone: 'border-cyber-cyan/75 bg-cyber-cyan/25 text-cyber-slate',
    icon: Clock3,
  },
  CONFIRMED: {
    label: 'ยืนยันแล้ว',
    helper: 'นับเป็นชั่วโมงสะสม',
    tone: 'border-cyber-mint/80 bg-cyber-mint/45 text-cyber-slate',
    icon: CheckCircle2,
  },
  RETURNED: {
    label: 'ให้แก้ไข',
    helper: 'ต้องแก้ข้อมูลก่อนส่งใหม่',
    tone: 'border-cyber-peach/85 bg-cyber-peach/45 text-cyber-slate',
    icon: RotateCcw,
  },
  REJECTED: {
    label: 'ไม่รับรอง',
    helper: 'ไม่ถูกนับเป็นชั่วโมงสะสม',
    tone: 'border-cyber-blush/85 bg-cyber-blush/50 text-cyber-slate',
    icon: AlertCircle,
  },
}

export function getWorkLogStatusCopy(status: WorkLogStatus) {
  return STATUS_COPY[status]
}

export default function WorkLogStatusBadge({ status }: { status: WorkLogStatus }) {
  const copy = STATUS_COPY[status]
  const Icon = copy.icon

  return (
    <div className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm ${copy.tone}`}>
      <Icon size={14} className="flex-shrink-0" aria-hidden="true" />
      <span className="break-words text-xs font-bold">{copy.label}</span>
    </div>
  )
}
