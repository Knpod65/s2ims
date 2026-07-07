'use client'

import { RotateCcw, XCircle } from 'lucide-react'

interface ReturnForRevisionPanelProps {
  note: string
  onNoteChange: (note: string) => void
  onReturn: () => void
  onReject: () => void
}

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-bg'

export default function ReturnForRevisionPanel({
  note,
  onNoteChange,
  onReturn,
  onReject,
}: ReturnForRevisionPanelProps) {
  return (
    <div className="rounded-lg border border-cyber-peach/45 bg-cyber-peach/25 p-3">
      <label className="block">
        <span className="text-xs font-bold text-cyber-slate">หมายเหตุถึงนักศึกษา</span>
        <textarea
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          className={`mt-1 min-h-20 w-full rounded-lg border border-cyber-border/55 bg-white/75 px-3 py-2 text-sm text-cyber-slate outline-none ${focusClass}`}
          placeholder="ระบุข้อมูลที่ต้องแก้ไข หรือเหตุผลที่ไม่รับรอง"
        />
      </label>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onReturn}
          disabled={!note.trim()}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-cyber-peach/80 bg-cyber-peach/45 px-3 py-2 text-xs font-bold text-cyber-slate disabled:cursor-not-allowed disabled:opacity-45 ${focusClass}`}
        >
          <RotateCcw size={14} aria-hidden="true" />
          ส่งกลับให้แก้ไข
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={!note.trim()}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-cyber-blush/80 bg-cyber-blush/45 px-3 py-2 text-xs font-bold text-rose-950 disabled:cursor-not-allowed disabled:opacity-45 ${focusClass}`}
        >
          <XCircle size={14} aria-hidden="true" />
          ไม่รับรองรายการนี้
        </button>
      </div>
    </div>
  )
}
