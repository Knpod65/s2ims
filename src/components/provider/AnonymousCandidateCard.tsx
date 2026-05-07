'use client'

import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react'
import MatchScoreRing from '@/components/MatchScoreRing'
import { StatusBadge } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import type { CandidateMatch, CandidateRankBand } from '@/data/mock/providerData'
import ShortlistStatusBadge from './ShortlistStatusBadge'

type AnonymousCandidateCardProps = {
  candidate: CandidateMatch
  selected?: boolean
  onToggle?: (candidateToken: string) => void
}

function rankLabel(rank: CandidateRankBand, lang: 'th' | 'en') {
  const labels = {
    top_band: { en: 'Top band', th: 'กลุ่มบนสุด' },
    strong_band: { en: 'Strong band', th: 'กลุ่มดี' },
    developing_band: { en: 'Developing band', th: 'กลุ่มกำลังพัฒนา' },
    watch_band: { en: 'Watch band', th: 'กลุ่มติดตาม' },
  }
  return labels[rank][lang]
}

function rankColor(rank: CandidateRankBand) {
  if (rank === 'top_band') return 'bg-role-tint text-role-primary border-role-border'
  if (rank === 'strong_band') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (rank === 'developing_band') return 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]'
  return 'bg-surface-low text-ink-2 border-line'
}

export default function AnonymousCandidateCard({ candidate, selected = false, onToggle }: AnonymousCandidateCardProps) {
  const { lang } = useLang()

  return (
    <article
      className={`group card card-hover relative overflow-hidden p-4 ${selected ? 'border-role-border bg-role-tint' : ''} ${onToggle ? 'cursor-pointer' : ''}`}
      onClick={() => onToggle?.(candidate.candidateToken)}
    >
      <div className={`absolute inset-y-0 left-0 w-1 bg-role-gradient transition-opacity ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex items-start gap-3 md:flex-1">
          {onToggle && (
            <button
              type="button"
              aria-label={selected ? 'Deselect candidate' : 'Select candidate'}
              className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-ink-3"
              onClick={event => {
                event.stopPropagation()
                onToggle(candidate.candidateToken)
              }}
            >
              {selected ? <CheckCircle2 size={20} className="text-role-primary" /> : <Circle size={20} />}
            </button>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-mono text-sm font-bold text-ink-1">{candidate.candidateToken}</h3>
              <StatusBadge label={rankLabel(candidate.rankBand, lang)} color={rankColor(candidate.rankBand)} dot />
              {candidate.shortlistStatus !== 'none' && <ShortlistStatusBadge status={candidate.shortlistStatus} />}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              {lang === 'th' ? candidate.eligibilitySummary_th : candidate.eligibilitySummary_en}
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-3">
                <p className="text-[11px] text-ink-3">{lang === 'th' ? 'กลุ่มวิชาการ' : 'Academic band'}</p>
                <p className="mt-1 text-xs font-semibold text-ink-1">{lang === 'th' ? candidate.academicBand_th : candidate.academicBand_en}</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-[11px] text-ink-3">{lang === 'th' ? 'กลุ่มความจำเป็น' : 'Need band'}</p>
                <p className="mt-1 text-xs font-semibold text-ink-1">{lang === 'th' ? candidate.needBand_th : candidate.needBand_en}</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-[11px] text-ink-3">{lang === 'th' ? 'กลุ่มสาขา' : 'Department band'}</p>
                <p className="mt-1 text-xs font-semibold text-ink-1">{lang === 'th' ? candidate.departmentBand_th : candidate.departmentBand_en}</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-line bg-white p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ink-2">
                <ShieldCheck size={13} className="text-role-primary" />
                {lang === 'th' ? 'ตัวอย่างคุณสมบัติ' : 'Eligibility preview'}
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.eligibilityPreview.map(item => (
                  <span key={item.label_en} className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${item.status === 'met' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-[#FDE68A] bg-[#FFFBEB] text-[#78350F]'}`}>
                    {lang === 'th' ? item.label_th : item.label_en}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-3">
              {lang === 'th' ? candidate.aggregateNotes_th : candidate.aggregateNotes_en}
            </p>
          </div>
        </div>

        <div className="flex justify-start md:w-28 md:justify-end">
          <MatchScoreRing score={candidate.matchScore} size="md" confidence={candidate.confidence} />
        </div>
      </div>
    </article>
  )
}
