'use client'
import { AlertTriangle, CheckCircle2, RefreshCw, XCircle } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { DataFreshness, DataFreshnessStatus } from '@/data/mock/studentMatchingData'

type DataFreshnessIndicatorProps = {
  freshness: DataFreshness
  compact?: boolean
  className?: string
}

const STYLE_MAP: Record<DataFreshnessStatus, string> = {
  fresh: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  stale: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
  failed: 'bg-red-50 text-red-700 border-red-200',
}

const ICON_MAP = {
  fresh: CheckCircle2,
  stale: RefreshCw,
  failed: XCircle,
}

function formatUpdatedAt(value: string, lang: 'th' | 'en') {
  return new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function DataFreshnessIndicator({
  freshness,
  compact = false,
  className = '',
}: DataFreshnessIndicatorProps) {
  const { lang } = useLang()
  const Icon = ICON_MAP[freshness.status] ?? AlertTriangle
  const label = {
    fresh: { th: 'ข้อมูลสดใหม่', en: 'Fresh' },
    stale: { th: 'ควรอัปเดต', en: 'Stale' },
    failed: { th: 'ซิงก์ไม่สำเร็จ', en: 'Sync failed' },
  }[freshness.status][lang]

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${STYLE_MAP[freshness.status]} ${className}`}
      title={freshness.source[lang]}
    >
      <Icon size={compact ? 13 : 14} className="shrink-0" />
      <span>{label}</span>
      {!compact && (
        <span className="font-normal opacity-80">
          {formatUpdatedAt(freshness.lastUpdated, lang)}
        </span>
      )}
    </div>
  )
}
