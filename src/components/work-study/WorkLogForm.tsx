'use client'

import { useMemo, useState } from 'react'
import { Send } from 'lucide-react'
import { calculateSubmittedHours } from '@/lib/matching'
import type { WorkCategory, WorkLog, WorkScholarshipAssignment } from '@/lib/types'

interface WorkLogFormProps {
  assignment: WorkScholarshipAssignment
  onSubmitLog: (log: WorkLog) => void
}

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-bg'

function toIsoWithBangkokOffset(value: string) {
  return value ? `${value}:00+07:00` : ''
}

export default function WorkLogForm({ assignment, onSubmitLog }: WorkLogFormProps) {
  const [taskDescription, setTaskDescription] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [evidenceReference, setEvidenceReference] = useState('')

  const submittedHours = useMemo(
    () => calculateSubmittedHours(toIsoWithBangkokOffset(startAt), toIsoWithBangkokOffset(endAt)),
    [startAt, endAt],
  )
  const canSubmit = taskDescription.trim().length >= 8 && startAt && endAt && submittedHours > 0

  const submit = () => {
    if (!canSubmit) return

    const now = new Date().toISOString()
    onSubmitLog({
      id: `local_worklog_${Date.now()}`,
      assignment_id: assignment.id,
      student_id: assignment.student_id,
      category: assignment.category as WorkCategory,
      task_description: taskDescription.trim(),
      start_at: toIsoWithBangkokOffset(startAt),
      end_at: toIsoWithBangkokOffset(endAt),
      submittedHours,
      evidence_reference: evidenceReference.trim() || undefined,
      status: 'SUBMITTED',
      createdAt: now,
      submittedAt: now,
      supervisor_id: assignment.supervisor_id,
      supervisor_name: assignment.supervisor_name,
      supervisor_role: assignment.supervisor_role,
    })

    setTaskDescription('')
    setStartAt('')
    setEndAt('')
    setEvidenceReference('')
  }

  return (
    <section className="rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur">
      <div className="mb-4">
        <h2 className="text-sm font-bold">ส่งชั่วโมงงาน</h2>
        <p className="mt-1 text-xs leading-relaxed text-cyber-slate/70">
          ระบบคำนวณชั่วโมงที่ส่งจากวันเวลาเริ่มและสิ้นสุด แต่ชั่วโมงสะสมจะเพิ่มเมื่อผู้ดูแลยืนยันชั่วโมงจริงเท่านั้น
        </p>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="text-xs font-bold text-cyber-slate">รายละเอียดงาน</span>
          <textarea
            value={taskDescription}
            onChange={(event) => setTaskDescription(event.target.value)}
            className={`mt-1 min-h-24 w-full rounded-lg border border-cyber-border/55 bg-white/70 px-3 py-2 text-sm text-cyber-slate outline-none ${focusClass}`}
            placeholder="เช่น ช่วยจัดเตรียมเอกสารและสรุปผลกิจกรรม"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold text-cyber-slate">เริ่มงาน</span>
            <input
              type="datetime-local"
              value={startAt}
              onChange={(event) => setStartAt(event.target.value)}
              className={`mt-1 min-h-11 w-full rounded-lg border border-cyber-border/55 bg-white/70 px-3 py-2 text-sm text-cyber-slate outline-none ${focusClass}`}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-cyber-slate">สิ้นสุดงาน</span>
            <input
              type="datetime-local"
              value={endAt}
              onChange={(event) => setEndAt(event.target.value)}
              className={`mt-1 min-h-11 w-full rounded-lg border border-cyber-border/55 bg-white/70 px-3 py-2 text-sm text-cyber-slate outline-none ${focusClass}`}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-bold text-cyber-slate">หลักฐานอ้างอิง</span>
          <input
            value={evidenceReference}
            onChange={(event) => setEvidenceReference(event.target.value)}
            className={`mt-1 min-h-11 w-full rounded-lg border border-cyber-border/55 bg-white/70 px-3 py-2 text-sm text-cyber-slate outline-none ${focusClass}`}
            placeholder="ลิงก์เอกสาร หรือเลขอ้างอิงงาน"
          />
        </label>

        <div className="rounded-lg border border-cyber-border/35 bg-white/60 p-3 text-sm">
          <div className="font-bold">{submittedHours.toFixed(2)} ชั่วโมงที่ส่ง</div>
          <div className="text-xs text-cyber-slate/70">ถ้าเวลาสิ้นสุดไม่มากกว่าเวลาเริ่ม ระบบจะแสดง 0 ชั่วโมง</div>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyber-slate px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors duration-fast ease-cyber disabled:cursor-not-allowed disabled:opacity-45 ${focusClass}`}
        >
          <Send size={15} aria-hidden="true" />
          ส่งให้ผู้ดูแลตรวจสอบ
        </button>
      </div>
    </section>
  )
}
