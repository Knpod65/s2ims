'use client'

import { useLang } from '@/lib/i18n'
import { getStatusLabel, getStatusTone } from '@/config/statusHelpers'
import type { ShortlistStatus } from '@/data/mock/providerData'

interface ShortlistStatusBadgeProps {
  status: ShortlistStatus
}

export default function ShortlistStatusBadge({ status }: ShortlistStatusBadgeProps) {
  const { lang } = useLang()

  function styleForTone(tone: ReturnType<typeof getStatusTone>) {
    if (tone === 'amber') return 'bg-[#FFFBEB] border border-[#FDE68A] text-[#78350F]'
    if (tone === 'success') return 'bg-emerald-50 border border-emerald-200 text-emerald-700'
    return 'bg-surface-low border border-line text-ink-2'
  }

  const statusStyleOverrides: Partial<Record<ShortlistStatus, string>> = {
    none: 'bg-white border border-line text-ink-3',
    declined: 'bg-surface-low border border-line text-ink-2',
  }

  const style = statusStyleOverrides[status] ?? styleForTone(getStatusTone('shortlistRequest', status))
  const label = getStatusLabel('shortlistRequest', status, lang === 'th' ? 'th' : 'en')

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      <span>{label}</span>
    </span>
  )
}
