'use client'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLang } from '@/lib/i18n'

type NextBestActionPanelProps = {
  title: string
  description: string
  primaryAction: ReactNode
  secondaryActions?: ReactNode
  eyebrow?: string
  className?: string
}

export default function NextBestActionPanel({
  title,
  description,
  primaryAction,
  secondaryActions,
  eyebrow,
  className = '',
}: NextBestActionPanelProps) {
  const { lang } = useLang()

  return (
    <section className={`rounded-[1.5rem] border border-[#0055FF]/20 bg-[#E5EDFF] p-5 text-role-primary shadow-soft ${className}`}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold shadow-soft">
            <ArrowRight size={12} />
            {eyebrow ?? (lang === 'th' ? 'ขั้นตอนที่แนะนำ' : 'Recommended next step')}
          </div>
          <h2 className="mt-3 font-display text-xl font-bold text-ink-1">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">{description}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-stretch">
          {primaryAction}
          {secondaryActions}
        </div>
      </div>
    </section>
  )
}
