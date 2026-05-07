'use client'

import { useLang } from '@/lib/i18n'
import type { ShortlistStatus } from '@/data/mock/providerData'

interface ShortlistStatusBadgeProps {
  status: ShortlistStatus
}

export default function ShortlistStatusBadge({ status }: ShortlistStatusBadgeProps) {
  const { lang } = useLang()
  const statusConfig = {
    none: {
      style: 'bg-white border border-line text-ink-3',
      label: { en: 'Not requested', th: 'ยังไม่ขอ' },
    },
    pending_staff_approval: {
      style: 'bg-[#FFFBEB] border border-[#FDE68A] text-[#78350F]',
      label: { en: 'Pending Staff Approval', th: 'รออนุมัติจากเจ้าหน้าที่' },
    },
    approved: {
      style: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
      label: { en: 'Approved', th: 'อนุมัติแล้ว' },
    },
    declined: {
      style: 'bg-surface-low border border-line text-ink-2',
      label: { en: 'Declined', th: 'ไม่อนุมัติ' },
    },
  }

  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      <span>{config.label[lang === 'th' ? 'th' : 'en']}</span>
    </span>
  )
}
