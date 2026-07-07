import type { WorkLog } from '@/lib/types'
import EvidenceAttachmentChip from './EvidenceAttachmentChip'
import WorkLogStatusBadge, { getWorkLogStatusCopy } from './WorkLogStatusBadge'

interface WorkLogCardProps {
  log: WorkLog
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default function WorkLogCard({ log }: WorkLogCardProps) {
  const statusCopy = getWorkLogStatusCopy(log.status)

  return (
    <article className="rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <WorkLogStatusBadge status={log.status} />
          <h3 className="mt-2 break-words text-sm font-bold leading-snug">{log.task_description}</h3>
          <p className="mt-1 break-words text-xs text-cyber-slate/70">
            {formatDateTime(log.start_at)} - {formatDateTime(log.end_at)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:min-w-[220px]">
          <div className="rounded-lg border border-cyber-border/35 bg-white/60 p-2">
            <div className="text-[10px] font-semibold text-cyber-slate/65">นักศึกษาส่ง</div>
            <div className="text-sm font-bold">{log.submittedHours.toFixed(2)} ชม.</div>
          </div>
          <div className="rounded-lg border border-cyber-mint/45 bg-cyber-mint/25 p-2">
            <div className="text-[10px] font-semibold text-cyber-slate/65">ผู้ดูแลยืนยัน</div>
            <div className="text-sm font-bold">
              {log.status === 'CONFIRMED' && typeof log.actualConfirmedHours === 'number'
                ? `${log.actualConfirmedHours.toFixed(2)} ชม.`
                : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <EvidenceAttachmentChip reference={log.evidence_reference} />
        <span className="inline-flex min-h-8 items-center rounded-full border border-cyber-border/45 bg-white/60 px-3 py-1 text-[11px] font-semibold text-cyber-slate/70">
          {statusCopy.helper}
        </span>
      </div>

      {log.supervisor_note && (
        <div className="mt-3 rounded-lg border border-cyber-violet/35 bg-cyber-violet/20 p-3">
          <div className="text-[11px] font-bold text-cyber-slate">หมายเหตุจากผู้ดูแล</div>
          <p className="mt-1 break-words text-xs leading-relaxed text-cyber-slate/75">{log.supervisor_note}</p>
        </div>
      )}
    </article>
  )
}
