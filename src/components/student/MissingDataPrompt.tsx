'use client'
import Link from 'next/link'
import { ArrowRight, Info, TrendingUp } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { MissingDataItem, MissingDataSeverity } from '@/data/mock/studentMatchingData'

type MissingDataPromptProps = {
  item: MissingDataItem
  compact?: boolean
  className?: string
}

const SEVERITY_STYLE: Record<MissingDataSeverity, string> = {
  low: 'border-blue-100 bg-blue-50/60 text-blue-700',
  medium: 'border-[#FDE68A] bg-[#FFFBEB] text-[#78350F]',
  high: 'border-amber-200 bg-gradient-to-br from-[#FFFBEB] to-white text-[#78350F]',
}

export default function MissingDataPrompt({ item, compact = false, className = '' }: MissingDataPromptProps) {
  const { lang } = useLang()

  return (
    <div className={`rounded-xl border ${SEVERITY_STYLE[item.severity]} ${compact ? 'p-3' : 'p-4'} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-white/80 p-2 text-role-primary shadow-soft">
          <Info size={compact ? 14 : 16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-sm text-ink-1">{item.label[lang]}</div>
              <p className={`${compact ? 'mt-1 line-clamp-2' : 'mt-1'} text-xs leading-relaxed text-ink-2`}>
                {item.description[lang]}
              </p>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1 rounded-full border border-white bg-white/80 px-2 py-1 text-[10px] font-semibold text-role-primary">
              <TrendingUp size={11} />
              +{item.confidenceImpact}%
            </div>
          </div>
          {!compact && (
            <p className="mt-3 text-xs leading-relaxed text-ink-2">
              {item.impact[lang]}
            </p>
          )}
          <Link
            href={item.ctaHref}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-role-primary shadow-soft transition hover:border-role-border hover:bg-role-tint"
          >
            {item.ctaLabel[lang]}
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
