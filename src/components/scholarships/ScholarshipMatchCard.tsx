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
  isSelected: boolean
  onViewDetails: () => void
  onSave: () => void
  onDismiss: () => void
}

function formatBaht(amount: number): string {
  return `${amount.toLocaleString('th-TH')} บาท`
}

export default function ScholarshipMatchCard({
  scholarship,
  matchResult,
  isSaved,
  isSelected,
  onViewDetails,
  onSave,
  onDismiss,
}: ScholarshipMatchCardProps) {
  return (
    <article
      className={`rounded-xl border bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur transition-all duration-base ease-cyber hover:-translate-y-0.5 hover:shadow-cyber-glow ${
        isSelected ? 'border-cyber-cyan ring-2 ring-cyber-cyan/45' : 'border-cyber-border/65'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2">
            <MatchStatusBadge status={matchResult.matchStatus} compact />
          </div>
          <h2 className="text-base font-bold leading-snug text-cyber-slate">{scholarship.title_en}</h2>
          <p className="mt-1 text-xs text-cyber-slate/60">{scholarship.provider}</p>
        </div>
        <div className="rounded-lg border border-cyber-border/55 bg-white/55 px-3 py-2 text-right">
          <div className="text-[10px] text-cyber-slate/55">มูลค่า</div>
          <div className="whitespace-nowrap text-sm font-bold">{formatBaht(scholarship.amount)}</div>
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
            <div className="rounded-lg border border-cyber-peach bg-cyber-peach/30 p-2.5">
              <div className="text-[11px] font-bold text-cyber-slate">ยังขาด</div>
              <div className="mt-0.5 text-[11px] leading-snug text-cyber-slate/65">
                {matchResult.missingRequirements.slice(0, 2).join(', ')}
              </div>
            </div>
          )}
          {matchResult.reviewFlags.length > 0 && (
            <div className="rounded-lg border border-cyber-violet bg-cyber-violet/25 p-2.5">
              <div className="text-[11px] font-bold text-cyber-slate">รอตรวจสอบ</div>
              <div className="mt-0.5 text-[11px] leading-snug text-cyber-slate/65">
                {matchResult.reviewFlags.slice(0, 2).join(', ')}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <MatchReasonChips reasons={matchResult.reasons} maxItems={3} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={onViewDetails}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyber-border/70 bg-white/70 px-3 py-2 text-xs font-bold text-cyber-slate transition-colors duration-fast ease-cyber hover:bg-white"
        >
          <Eye size={14} />
          ดูรายละเอียด
        </button>
        <button
          type="button"
          onClick={onSave}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition-colors duration-fast ease-cyber ${
            isSaved
              ? 'border-cyber-mint bg-cyber-mint/50 text-emerald-900'
              : 'border-cyber-border/70 bg-white/70 text-cyber-slate hover:bg-white'
          }`}
          aria-pressed={isSaved}
        >
          {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          บันทึกไว้
        </button>
        <Link
          href={`/student/applications/new?scholarship=${scholarship.id}`}
          className="inline-flex items-center justify-center rounded-lg bg-cyber-slate px-3 py-2 text-center text-xs font-bold text-white shadow-cyber-glow transition-transform duration-fast ease-cyber hover:-translate-y-0.5"
        >
          สมัคร / ไปต่อ
        </Link>
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyber-blush bg-cyber-blush/35 px-3 py-2 text-xs font-bold text-rose-900 transition-colors duration-fast ease-cyber hover:bg-cyber-blush/55"
        >
          <X size={14} />
          ไม่เหมาะกับฉัน
        </button>
      </div>
    </article>
  )
}
