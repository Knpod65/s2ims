import Link from 'next/link'
import { Bookmark, BookmarkCheck, Eye, X } from 'lucide-react'
import type { Scholarship, ScholarshipMatchResult } from '@/lib/types'
import EligibilityChecklist from './EligibilityChecklist'
import MatchReasonChips from './MatchReasonChips'
import MatchScoreMeter from './MatchScoreMeter'
import MatchStatusBadge from './MatchStatusBadge'

interface ScholarshipMatchCardProps {
  scholarship: Scholarship
  matchResult: ScholarshipMatchResult
  isSaved: boolean
  isStarted?: boolean
  isSelected: boolean
  onViewDetails: () => void
  onSave: () => void
  onStart?: () => void
  onDismiss: () => void
}

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-bg'

function formatBaht(amount: number): string {
  return `${amount.toLocaleString('th-TH')} บาท`
}

export default function ScholarshipMatchCard({
  scholarship,
  matchResult,
  isSaved,
  isStarted = false,
  isSelected,
  onViewDetails,
  onSave,
  onStart,
  onDismiss,
}: ScholarshipMatchCardProps) {
  return (
    <article
      aria-current={isSelected ? 'true' : undefined}
      className={`rounded-xl border bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur transition-all duration-base ease-cyber hover:-translate-y-0.5 ${
        isSelected ? 'border-cyber-cyan/90 ring-2 ring-cyber-cyan/35' : 'border-cyber-border/50'
      }`}
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2">
            <MatchStatusBadge status={matchResult.matchStatus} compact />
          </div>
          <h2 className="break-words text-base font-bold leading-snug text-cyber-slate">{scholarship.title_en}</h2>
          <p className="mt-1 break-words text-xs text-cyber-slate/70">{scholarship.provider}</p>
          {isStarted && (
            <div className="mt-2 inline-flex rounded-full border border-cyber-violet/45 bg-cyber-violet/20 px-2.5 py-1 text-[10px] font-bold text-cyber-slate">
              เริ่มสมัครแล้ว
            </div>
          )}
        </div>
        <div className="w-full rounded-lg border border-cyber-border/45 bg-white/60 px-3 py-2 sm:w-auto sm:min-w-[116px] sm:text-right">
          <div className="text-[10px] font-medium text-cyber-slate/70">มูลค่า</div>
          <div className="break-words text-sm font-bold">{formatBaht(scholarship.amount)}</div>
        </div>
      </div>

      <div className="mb-4">
        <MatchScoreMeter score={matchResult.matchScore} compact />
      </div>

      <div className="mb-4">
        <EligibilityChecklist criteria={matchResult.criteria} compact />
      </div>

      {(matchResult.missingRequirements.length > 0 || matchResult.reviewFlags.length > 0) && (
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {matchResult.missingRequirements.length > 0 && (
            <div className="rounded-lg border border-cyber-peach/70 bg-cyber-peach/25 p-2.5">
              <div className="text-[11px] font-bold text-cyber-slate">ยังขาด</div>
              <div className="mt-0.5 break-words text-[11px] leading-snug text-cyber-slate/75">
                {matchResult.missingRequirements.slice(0, 2).join(', ')}
              </div>
            </div>
          )}
          {matchResult.reviewFlags.length > 0 && (
            <div className="rounded-lg border border-cyber-violet/70 bg-cyber-violet/25 p-2.5">
              <div className="text-[11px] font-bold text-cyber-slate">รอตรวจสอบ</div>
              <div className="mt-0.5 break-words text-[11px] leading-snug text-cyber-slate/75">
                {matchResult.reviewFlags.slice(0, 2).join(', ')}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <MatchReasonChips reasons={matchResult.reasons} maxItems={3} />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={onViewDetails}
          className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-cyber-border/60 bg-white/70 px-3 py-2.5 text-xs font-bold text-cyber-slate transition-colors duration-fast ease-cyber hover:bg-white ${focusClass}`}
          aria-label={`ดูรายละเอียด ${scholarship.title_en}`}
        >
          <Eye size={14} aria-hidden="true" />
          <span className="break-words text-center">ดูรายละเอียด</span>
        </button>
        <button
          type="button"
          onClick={onSave}
          className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-bold transition-colors duration-fast ease-cyber ${focusClass} ${
            isSaved
              ? 'border-cyber-mint/80 bg-cyber-mint/45 text-emerald-950'
              : 'border-cyber-border/60 bg-white/70 text-cyber-slate hover:bg-white'
          }`}
          aria-label={`${isSaved ? 'ยกเลิกบันทึก' : 'บันทึกไว้'} ${scholarship.title_en}`}
          aria-pressed={isSaved}
        >
          {isSaved ? <BookmarkCheck size={14} aria-hidden="true" /> : <Bookmark size={14} aria-hidden="true" />}
          <span className="break-words text-center">บันทึกไว้</span>
        </button>
        <Link
          href={`/student/applications/new?scholarship=${scholarship.id}`}
          onClick={onStart}
          className={`inline-flex min-h-11 items-center justify-center rounded-lg bg-cyber-slate px-3 py-2.5 text-center text-xs font-bold text-white shadow-sm transition-transform duration-fast ease-cyber hover:-translate-y-0.5 ${focusClass}`}
          aria-label={`สมัครหรือไปต่อสำหรับ ${scholarship.title_en}`}
        >
          สมัคร / ไปต่อ
        </Link>
        <button
          type="button"
          onClick={onDismiss}
          className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-cyber-blush/80 bg-cyber-blush/35 px-3 py-2.5 text-xs font-bold text-rose-950 transition-colors duration-fast ease-cyber hover:bg-cyber-blush/55 ${focusClass}`}
          aria-label={`ไม่เหมาะกับฉัน ${scholarship.title_en}`}
        >
          <X size={14} aria-hidden="true" />
          <span className="break-words text-center">ไม่เหมาะกับฉัน</span>
        </button>
      </div>
    </article>
  )
}
