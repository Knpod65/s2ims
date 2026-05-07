'use client'
import Link from 'next/link'
import { ArrowRight, Award, Building2, CalendarDays, CheckCircle2 } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { formatAmount, formatAmountEn } from '@/lib/utils'
import type { Scholarship } from '@/lib/types'
import type { StudentRecommendation } from '@/data/mock/studentMatchingData'
import MatchScoreRing, { confidenceLabel } from './MatchScoreRing'

type RecommendationCardProps = {
  recommendation: StudentRecommendation
  scholarship: Scholarship
  selected?: boolean
  className?: string
}

function formatDeadline(date: string, lang: 'th' | 'en') {
  return new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export default function RecommendationCard({
  recommendation,
  scholarship,
  selected = false,
  className = '',
}: RecommendationCardProps) {
  const { lang } = useLang()
  const title = lang === 'th' ? scholarship.title_th : scholarship.title_en
  const provider = lang === 'th' ? scholarship.provider_th : scholarship.provider
  const amount = lang === 'th' ? formatAmount(scholarship.amount) : formatAmountEn(scholarship.amount)
  const confidence = confidenceLabel(recommendation.confidence, lang)

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-role-border hover:shadow-role ${
        selected ? 'border-role-border ring-2 ring-[#0055FF]/15' : 'border-line'
      } ${className}`}
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-role-gradient opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-ink-3">
            <Building2 size={13} />
            <span className="truncate">{provider}</span>
          </div>
          <h3 className="font-display text-base font-bold leading-snug text-ink-1">{title}</h3>
        </div>
        <MatchScoreRing
          score={recommendation.matchScore}
          confidence={recommendation.confidence}
          size="sm"
          showConfidenceLabel={false}
          className="shrink-0"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-line bg-surface-low p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">
            <Award size={12} />
            {lang === 'th' ? 'จำนวนเงิน' : 'Amount'}
          </div>
          <div className="mt-1 text-sm font-bold text-role-primary">{amount}</div>
        </div>
        <div className="rounded-lg border border-line bg-surface-low p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">
            <CalendarDays size={12} />
            {lang === 'th' ? 'กำหนดส่ง' : 'Deadline'}
          </div>
          <div className="mt-1 text-sm font-bold text-ink-1">{formatDeadline(recommendation.deadline, lang)}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0055FF]/20 bg-[#E5EDFF] px-2.5 py-1 text-xs font-semibold text-role-primary">
          {lang === 'th' ? 'ความมั่นใจ' : 'Confidence'}: {confidence}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 size={13} />
          {recommendation.eligibilityMet}/{recommendation.eligibilityTotal}
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-2">
        {recommendation.eligibilitySummary[lang]}
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href={`/student/recommendations/${recommendation.scholarshipId}/explanation`}
          className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-3 py-2 text-xs"
        >
          {lang === 'th' ? 'ทำไมถึงเหมาะ?' : 'Why this match?'}
          <ArrowRight size={13} />
        </Link>
        <Link
          href={`/scholarships/${recommendation.scholarshipId}`}
          className="btn-secondary inline-flex min-h-11 items-center justify-center px-3 py-2 text-xs"
        >
          {lang === 'th' ? 'รายละเอียดทุน' : 'Details'}
        </Link>
      </div>
    </article>
  )
}
