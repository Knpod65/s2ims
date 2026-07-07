import Link from 'next/link'
import { CalendarDays, GraduationCap, Landmark, X } from 'lucide-react'
import type { Scholarship, ScholarshipMatchResult } from '@/lib/types'
import EligibilityChecklist from './EligibilityChecklist'
import MatchReasonChips from './MatchReasonChips'
import MatchScoreMeter from './MatchScoreMeter'
import MatchStatusBadge from './MatchStatusBadge'

interface ScholarshipDetailPanelProps {
  scholarship: Scholarship
  matchResult: ScholarshipMatchResult
  onClose?: () => void
}

function formatBaht(amount: number): string {
  return `${amount.toLocaleString('th-TH')} บาท`
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
}

export default function ScholarshipDetailPanel({ scholarship, matchResult, onClose }: ScholarshipDetailPanelProps) {
  return (
    <section className="rounded-xl border border-cyber-border/70 bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2">
            <MatchStatusBadge status={matchResult.matchStatus} />
          </div>
          <h2 className="text-lg font-bold leading-snug text-cyber-slate">{scholarship.title_en}</h2>
          <p className="mt-1 text-xs text-cyber-slate/60">{scholarship.provider}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-cyber-border/60 bg-white/60 p-2 text-cyber-slate/70 transition-colors duration-fast ease-cyber hover:text-cyber-slate"
            aria-label="ปิดรายละเอียด"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="mb-4">
        <MatchScoreMeter score={matchResult.matchScore} />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-cyber-border/45 bg-white/55 p-3">
          <Landmark size={15} className="mb-1 text-cyan-700" />
          <div className="text-[10px] text-cyber-slate/55">จำนวนทุน</div>
          <div className="text-sm font-bold">{scholarship.num_awards} ทุน</div>
        </div>
        <div className="rounded-lg border border-cyber-border/45 bg-white/55 p-3">
          <GraduationCap size={15} className="mb-1 text-violet-700" />
          <div className="text-[10px] text-cyber-slate/55">มูลค่า</div>
          <div className="text-sm font-bold">{formatBaht(scholarship.amount)}</div>
        </div>
        <div className="rounded-lg border border-cyber-border/45 bg-white/55 p-3">
          <CalendarDays size={15} className="mb-1 text-rose-700" />
          <div className="text-[10px] text-cyber-slate/55">กำหนดส่ง</div>
          <div className="text-sm font-bold">{formatDate(scholarship.deadline)}</div>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-cyber-border/45 bg-white/50 p-3">
        <h3 className="mb-1 text-xs font-bold">แนวคิดทุน</h3>
        <p className="text-xs leading-relaxed text-cyber-slate/70">{scholarship.philosophy_en}</p>
      </div>

      {(matchResult.missingRequirements.length > 0 || matchResult.reviewFlags.length > 0) && (
        <div className="mb-4 grid grid-cols-1 gap-2">
          {matchResult.missingRequirements.length > 0 && (
            <div className="rounded-lg border border-cyber-peach bg-cyber-peach/30 p-3">
              <h3 className="mb-1 text-xs font-bold">สิ่งที่ยังขาด</h3>
              <ul className="space-y-1 text-xs text-cyber-slate/70">
                {matchResult.missingRequirements.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}
          {matchResult.reviewFlags.length > 0 && (
            <div className="rounded-lg border border-cyber-violet bg-cyber-violet/25 p-3">
              <h3 className="mb-1 text-xs font-bold">รอเจ้าหน้าที่ตรวจสอบ</h3>
              <ul className="space-y-1 text-xs text-cyber-slate/70">
                {matchResult.reviewFlags.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <EligibilityChecklist criteria={matchResult.criteria} />
      </div>

      <div className="mb-4">
        <h3 className="mb-2 text-xs font-bold text-cyber-slate">เหตุผลประกอบ</h3>
        <MatchReasonChips reasons={matchResult.reasons} maxItems={8} />
      </div>

      <Link
        href={`/student/applications/new?scholarship=${scholarship.id}`}
        className="block rounded-lg bg-cyber-slate px-4 py-3 text-center text-sm font-bold text-white shadow-cyber-glow transition-transform duration-fast ease-cyber hover:-translate-y-0.5"
      >
        สมัคร / ไปต่อ
      </Link>
    </section>
  )
}
