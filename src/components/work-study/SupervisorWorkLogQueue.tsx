'use client'

import { useMemo, useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import { mockWorkLogs } from '@/data/mock/workLogs'
import type { WorkLog } from '@/lib/types'
import SupervisorStudentList from './SupervisorStudentList'
import WorkEvidencePreviewPanel from './WorkEvidencePreviewPanel'
import WorkLogApprovalCard from './WorkLogApprovalCard'
import WorkLogStatusBadge from './WorkLogStatusBadge'

function confirmedHours(logs: WorkLog[]) {
  return logs
    .filter((log) => log.status === 'CONFIRMED')
    .reduce((total, log) => total + (log.actualConfirmedHours ?? 0), 0)
}

export default function SupervisorWorkLogQueue() {
  const [logs, setLogs] = useState<WorkLog[]>(mockWorkLogs)
  const [selectedStudentId, setSelectedStudentId] = useState(mockWorkLogs[0]?.student_id ?? '')
  const [selectedLogId, setSelectedLogId] = useState<string | undefined>(
    mockWorkLogs.find((log) => log.status === 'SUBMITTED')?.id ?? mockWorkLogs[0]?.id,
  )

  const studentLogs = useMemo(
    () => logs
      .filter((log) => log.student_id === selectedStudentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [logs, selectedStudentId],
  )
  const selectedLog = studentLogs.find((log) => log.id === selectedLogId) ?? studentLogs[0]
  const pendingCount = logs.filter((log) => log.status === 'SUBMITTED').length
  const returnedCount = logs.filter((log) => log.status === 'RETURNED').length
  const totalConfirmedHours = confirmedHours(logs)

  const updateLog = (logId: string, patch: Partial<WorkLog>) => {
    setLogs((current) => current.map((log) => (log.id === logId ? { ...log, ...patch, updatedAt: new Date().toISOString() } : log)))
  }

  const confirmLog = (logId: string, actualConfirmedHours: number) => {
    updateLog(logId, {
      status: 'CONFIRMED',
      actualConfirmedHours,
      reviewedAt: new Date().toISOString(),
      supervisor_note: 'ยืนยันชั่วโมงจริงโดยผู้ดูแล',
    })
  }

  const returnLog = (logId: string, note: string) => {
    updateLog(logId, {
      status: 'RETURNED',
      reviewedAt: new Date().toISOString(),
      supervisor_note: note,
      actualConfirmedHours: undefined,
    })
  }

  const rejectLog = (logId: string, note: string) => {
    updateLog(logId, {
      status: 'REJECTED',
      reviewedAt: new Date().toISOString(),
      supervisor_note: note,
      actualConfirmedHours: undefined,
    })
  }

  return (
    <div className="-m-4 min-h-[calc(100vh-52px)] overflow-x-hidden bg-cyber-bg px-4 py-5 text-cyber-slate md:-m-6 md:px-6 md:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 rounded-xl border border-cyber-border/50 bg-cyber-glass p-4 shadow-cyber-soft backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyber-cyan/65 bg-cyber-cyan/20 px-3 py-1 text-[11px] font-bold text-sky-950">
                <ClipboardCheck size={13} aria-hidden="true" />
                Supervisor Review
              </div>
              <h1 className="break-words font-display text-2xl font-bold tracking-normal text-cyber-slate md:text-3xl">
                ตรวจชั่วโมงทุนทำงาน
              </h1>
              <p className="mt-1 max-w-2xl break-words text-sm leading-relaxed text-cyber-slate/75">
                ตรวจรายการที่นักศึกษาส่ง ปรับชั่วโมงจริง ส่งกลับให้แก้ไข หรือไม่รับรองในหน้าจอจำลองนี้
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:min-w-[420px]">
              <div className="rounded-lg border border-cyber-cyan/45 bg-cyber-cyan/25 p-3">
                <div className="text-lg font-bold">{pendingCount}</div>
                <div className="text-[11px] font-semibold text-cyber-slate/70">รอตรวจ</div>
              </div>
              <div className="rounded-lg border border-cyber-peach/45 bg-cyber-peach/30 p-3">
                <div className="text-lg font-bold">{returnedCount}</div>
                <div className="text-[11px] font-semibold text-cyber-slate/70">ส่งกลับ</div>
              </div>
              <div className="rounded-lg border border-cyber-mint/45 bg-cyber-mint/30 p-3">
                <div className="text-lg font-bold">{totalConfirmedHours.toFixed(2)}</div>
                <div className="text-[11px] font-semibold text-cyber-slate/70">ชม. ยืนยัน</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          <SupervisorStudentList
            logs={logs}
            selectedStudentId={selectedStudentId}
            onSelectStudent={(studentId) => {
              setSelectedStudentId(studentId)
              setSelectedLogId(logs.find((log) => log.student_id === studentId)?.id)
            }}
          />

          <section className="space-y-3">
            <div>
              <h2 className="text-sm font-bold">รายการงานที่ส่ง</h2>
              <p className="mt-1 text-xs text-cyber-slate/70">
                เฉพาะรายการที่ยืนยันแล้วเท่านั้นที่จะเพิ่มชั่วโมงสะสม
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {studentLogs.map((log) => {
                const active = selectedLog?.id === log.id
                return (
                  <button
                    key={log.id}
                    type="button"
                    onClick={() => setSelectedLogId(log.id)}
                    aria-pressed={active}
                    className={`min-h-20 rounded-xl border p-3 text-left transition-colors duration-fast ease-cyber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-bg ${
                      active
                        ? 'border-cyber-slate bg-cyber-slate text-white'
                        : 'border-cyber-border/45 bg-cyber-glass text-cyber-slate shadow-cyber-soft hover:bg-white/75'
                    }`}
                  >
                    <WorkLogStatusBadge status={log.status} />
                    <div className={`mt-2 break-words text-xs font-bold ${active ? 'text-white' : 'text-cyber-slate'}`}>
                      {log.task_description}
                    </div>
                  </button>
                )
              })}
            </div>

            {selectedLog && (
              <WorkLogApprovalCard
                log={selectedLog}
                onConfirm={confirmLog}
                onReturn={returnLog}
                onReject={rejectLog}
              />
            )}
          </section>

          {selectedLog && <WorkEvidencePreviewPanel log={selectedLog} />}
        </div>
      </div>
    </div>
  )
}
