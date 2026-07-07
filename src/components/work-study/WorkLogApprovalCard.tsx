'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { WorkLog } from '@/lib/types'
import ActualHourInput from './ActualHourInput'
import ReturnForRevisionPanel from './ReturnForRevisionPanel'
import WorkLogStatusBadge from './WorkLogStatusBadge'

interface WorkLogApprovalCardProps {
  log: WorkLog
  onConfirm: (logId: string, actualConfirmedHours: number) => void
  onReturn: (logId: string, note: string) => void
  onReject: (logId: string, note: string) => void
}

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-bg'

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default function WorkLogApprovalCard({ log, onConfirm, onReturn, onReject }: WorkLogApprovalCardProps) {
  const [actualHours, setActualHours] = useState(log.actualConfirmedHours ?? log.submittedHours)
  const [note, setNote] = useState(log.supervisor_note ?? '')
  const canConfirm = log.status === 'SUBMITTED' || log.status === 'RETURNED'

  return (
    <article className="rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <WorkLogStatusBadge status={log.status} />
          <h2 className="mt-2 break-words text-base font-bold leading-snug">{log.task_description}</h2>
          <p className="mt-1 break-words text-xs text-cyber-slate/70">
            {formatDateTime(log.start_at)} - {formatDateTime(log.end_at)}
          </p>
        </div>
        <div className="rounded-lg border border-cyber-border/35 bg-white/60 p-3 text-right">
          <div className="text-[10px] font-semibold text-cyber-slate/65">นักศึกษาส่ง</div>
          <div className="text-lg font-bold">{log.submittedHours.toFixed(2)} ชม.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
        <ActualHourInput value={actualHours} submittedHours={log.submittedHours} onChange={setActualHours} />
        <ReturnForRevisionPanel
          note={note}
          onNoteChange={setNote}
          onReturn={() => onReturn(log.id, note.trim())}
          onReject={() => onReject(log.id, note.trim())}
        />
      </div>

      <button
        type="button"
        onClick={() => onConfirm(log.id, actualHours)}
        disabled={!canConfirm || actualHours <= 0}
        className={`mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyber-slate px-4 py-2.5 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-45 ${focusClass}`}
      >
        <CheckCircle2 size={16} aria-hidden="true" />
        ยืนยันชั่วโมงจริง
      </button>
    </article>
  )
}
