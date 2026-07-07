import type { WorkScholarshipAssignment } from '@/lib/types'
import WorkHourProgressBar from './WorkHourProgressBar'

interface WorkSummaryCardProps {
  assignment: WorkScholarshipAssignment
  confirmedHours: number
  submittedCount: number
  pendingCount: number
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
}

export default function WorkSummaryCard({
  assignment,
  confirmedHours,
  submittedCount,
  pendingCount,
}: WorkSummaryCardProps) {
  return (
    <section className="rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur">
      <div className="mb-4">
        <div className="mb-2 inline-flex rounded-full border border-cyber-mint/60 bg-cyber-mint/35 px-3 py-1 text-[11px] font-bold">
          {assignment.category.replace(/_/g, ' ')}
        </div>
        <h2 className="break-words text-lg font-bold leading-snug">{assignment.title}</h2>
        <p className="mt-1 break-words text-xs text-cyber-slate/70">
          ผู้ดูแล: {assignment.supervisor_name} · {formatDate(assignment.starts_at)} - {formatDate(assignment.ends_at)}
        </p>
      </div>

      <WorkHourProgressBar confirmedHours={confirmedHours} requiredHours={assignment.required_hours} />

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-cyber-border/35 bg-white/60 p-3">
          <div className="text-lg font-bold">{submittedCount}</div>
          <div className="text-[11px] font-semibold text-cyber-slate/70">รายการที่ส่งทั้งหมด</div>
        </div>
        <div className="rounded-lg border border-cyber-border/35 bg-white/60 p-3">
          <div className="text-lg font-bold">{pendingCount}</div>
          <div className="text-[11px] font-semibold text-cyber-slate/70">รอตรวจชั่วโมงจริง</div>
        </div>
      </div>
    </section>
  )
}
