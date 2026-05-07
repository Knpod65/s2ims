'use client'
import Link from 'next/link'
import { ArrowRight, Award, Building2, CalendarDays, Users } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { formatAmount, formatAmountEn } from '@/lib/utils'
import type { Scholarship } from '@/lib/types'
import type { StudentRecommendation } from '@/data/mock/studentMatchingData'
import MatchScoreRing, { confidenceLabel } from './MatchScoreRing'

type ScholarshipDetailCardProps = {
  scholarship: Scholarship
  recommendation?: StudentRecommendation
  applyHref?: string
  explanationHref?: string
  className?: string
}

function formatDeadline(date: string, lang: 'th' | 'en') {
  return new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export default function ScholarshipDetailCard({
  scholarship,
  recommendation,
  applyHref,
  explanationHref,
  className = '',
}: ScholarshipDetailCardProps) {
  const { lang } = useLang()
  const title = lang === 'th' ? scholarship.title_th : scholarship.title_en
  const provider = lang === 'th' ? scholarship.provider_th : scholarship.provider
  const amount = lang === 'th' ? formatAmount(scholarship.amount) : formatAmountEn(scholarship.amount)
  const deadline = recommendation?.deadline ?? scholarship.deadline
  const score = recommendation?.matchScore ?? scholarship.match_pct ?? 64

  return (
    <section className={`card p-5 ${className}`}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-ink-3">
            <span className="inline-flex items-center gap-1.5">
              <Building2 size={13} />
              {provider}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={13} />
              {formatDeadline(deadline, lang)}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold leading-tight text-ink-1">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2">
            {lang === 'th' ? scholarship.philosophy_th : scholarship.philosophy_en}
          </p>
        </div>
        <MatchScoreRing score={score} confidence={recommendation?.confidence} size="lg" className="justify-self-start lg:justify-self-end" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-line bg-surface-low p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">
            <Award size={12} />
            {lang === 'th' ? 'จำนวนเงิน' : 'Amount'}
          </div>
          <div className="mt-1 text-sm font-bold text-role-primary">{amount}</div>
        </div>
        <div className="rounded-xl border border-line bg-surface-low p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">
            <Users size={12} />
            {lang === 'th' ? 'จำนวนทุน' : 'Awards'}
          </div>
          <div className="mt-1 text-sm font-bold text-ink-1">{scholarship.num_awards}</div>
        </div>
        <div className="rounded-xl border border-line bg-surface-low p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">GPA</div>
          <div className="mt-1 font-mono text-sm font-bold text-ink-1">≥ {scholarship.gpa_min}</div>
        </div>
        <div className="rounded-xl border border-[#0055FF]/15 bg-[#E5EDFF] p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-role-primary">
            {lang === 'th' ? 'ความมั่นใจ' : 'Confidence'}
          </div>
          <div className="mt-1 text-sm font-bold text-role-primary">
            {recommendation ? confidenceLabel(recommendation.confidence, lang) : (lang === 'th' ? 'กำลังประเมิน' : 'Estimated')}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {applyHref && (
          <Link href={applyHref} className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
            {lang === 'th' ? 'เริ่มสมัครทุนนี้' : 'Apply for this scholarship'}
            <ArrowRight size={14} />
          </Link>
        )}
        {explanationHref && (
          <Link href={explanationHref} className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
            {lang === 'th' ? 'ทำไมถึงเหมาะ?' : 'Why this match?'}
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </section>
  )
}
