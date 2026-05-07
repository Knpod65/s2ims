'use client'
import Link from 'next/link'
import { Bookmark, BookmarkCheck, Clock, Trophy, Users } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { daysUntil, deadlineColor, formatAmount, formatAmountEn } from '@/lib/utils'
import { StatusBadge } from './ui/index'
import { SCH_STATUS_MAP } from '@/lib/utils'
import type { Scholarship } from '@/lib/types'
import StudentMatchScoreRing from './student/MatchScoreRing'

interface Props {
  scholarship: Scholarship
  showMatch?: boolean
  onSave?: (id: string) => void
}

export function MatchScoreRing({ pct }: { pct: number }) {
  return <StudentMatchScoreRing score={pct} size="sm" showConfidenceLabel={false} />
}

export default function ScholarshipCard({ scholarship: s, showMatch = false, onSave }: Props) {
  const { lang } = useLang()
  const days = daysUntil(s.deadline)
  const title = lang === 'th' ? s.title_th : s.title_en
  const provider = lang === 'th' ? s.provider_th : s.provider
  const amount = lang === 'th' ? formatAmount(s.amount) : formatAmountEn(s.amount)
  const statusInfo = SCH_STATUS_MAP[s.status]

  return (
    <div className="card card-hover flex flex-col h-full">
      <div className="p-4 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-ink-3 mb-1">{provider}</div>
            <h3 className="font-semibold text-ink-1 text-sm leading-snug line-clamp-2">{title}</h3>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
            {showMatch && s.match_pct !== undefined && (
              <MatchScoreRing pct={s.match_pct} />
            )}
            <StatusBadge label={statusInfo[lang === 'th' ? 'th' : 'en']} color={statusInfo.color} />
          </div>
        </div>

        {/* Key info */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="card-sm p-2">
            <div className="text-[10px] text-ink-3 flex items-center gap-1 mb-0.5">
              <Trophy size={10} />
              {lang === 'th' ? 'จำนวนเงิน' : 'Amount'}
            </div>
            <div className="text-xs font-semibold text-role-primary">{amount}</div>
          </div>
          <div className="card-sm p-2">
            <div className="text-[10px] text-ink-3 flex items-center gap-1 mb-0.5">
              <Users size={10} />
              {lang === 'th' ? 'จำนวนทุน' : 'Awards'}
            </div>
            <div className="text-xs font-semibold text-ink-1">{s.num_awards} {lang === 'th' ? 'ทุน' : 'awards'}</div>
          </div>
        </div>

        {/* Deadline */}
        <div className={`flex items-center gap-1.5 text-xs ${deadlineColor(days)}`}>
          <Clock size={12} className={days <= 1 && days >= 0 ? 'deadline-pulse' : ''} />
          {days < 0
            ? (lang === 'th' ? 'ปิดรับแล้ว' : 'Closed')
            : days === 0
            ? (lang === 'th' ? 'วันสุดท้ายวันนี้!' : 'Last day today!')
            : `${days} ${lang === 'th' ? 'วัน เหลือเวลา' : 'days left'}`
          }
          <span className="text-ink-3">·</span>
          <span className="text-ink-3">GPA ≥ {s.gpa_min}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {s.has_essay && (
            <span className="text-[10px] px-1.5 py-0.5 bg-white border border-line text-ink-3 rounded">
              {lang === 'th' ? 'เรียงความ' : 'Essay'}
            </span>
          )}
          {s.has_interview && (
            <span className="text-[10px] px-1.5 py-0.5 bg-white border border-line text-ink-3 rounded">
              {lang === 'th' ? 'สัมภาษณ์' : 'Interview'}
            </span>
          )}
          {s.has_proposal && (
            <span className="text-[10px] px-1.5 py-0.5 bg-white border border-line text-ink-3 rounded">
              {lang === 'th' ? 'ข้อเสนอ' : 'Proposal'}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-line p-3 flex gap-2">
        <Link
          href={`/scholarships/${s.id}`}
          className="btn-primary flex-1 text-center text-xs py-2"
        >
          {lang === 'th' ? 'ดูรายละเอียด' : 'View Details'}
        </Link>
        <button
          onClick={() => onSave?.(s.id)}
          className={`p-2 rounded-lg border transition-all ${
            s.is_saved
              ? 'border-role-border bg-role-tint text-role-primary'
              : 'border-line bg-surface-low text-ink-3 hover:text-role-primary hover:border-role-border'
          }`}
          title={lang === 'th' ? 'บันทึก' : 'Save'}
        >
          {s.is_saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
        </button>
      </div>
    </div>
  )
}
