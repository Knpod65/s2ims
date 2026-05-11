'use client'

import { AlertCircle, CheckCircle2, Clock3 } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { getStatusConfig } from '@/config/statusHelpers'

type ProviderDataFreshnessIndicatorProps = {
  status?: 'fresh' | 'stale' | 'failed'
  label_en?: string
  label_th?: string
}

const styles = {
  fresh: 'bg-role-tint text-role-primary border-role-border',
  stale: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
  failed: 'bg-surface-low text-ink-2 border-line',
}

export default function ProviderDataFreshnessIndicator({
  status = 'fresh',
  label_en,
  label_th,
}: ProviderDataFreshnessIndicatorProps) {
  const { lang } = useLang()
  const statusConfig = getStatusConfig('dataFreshness', status)
  const Icon = status === 'fresh' ? CheckCircle2 : status === 'stale' ? Clock3 : AlertCircle
  const fallback = {
    fresh: { en: 'Fresh', th: 'ข้อมูลใหม่' },
    stale: { en: 'Needs sync', th: 'ควรซิงก์ใหม่' },
    failed: { en: 'Sync unavailable', th: 'ซิงก์ไม่ได้' },
  }
  const label =
    lang === 'th'
      ? label_th ?? fallback[status]?.th ?? statusConfig.label.th
      : label_en ?? fallback[status]?.en ?? statusConfig.label.en

  return (
    <span className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      <Icon size={13} />
      {label}
    </span>
  )
}
