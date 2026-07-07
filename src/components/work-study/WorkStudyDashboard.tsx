'use client'

import { useMemo, useState } from 'react'
import { BriefcaseBusiness } from 'lucide-react'
import { mockWorkLogs, mockWorkScholarshipAssignments } from '@/data/mock/workLogs'
import type { WorkLog } from '@/lib/types'
import WorkLogForm from './WorkLogForm'
import WorkLogTimeline from './WorkLogTimeline'
import WorkSummaryCard from './WorkSummaryCard'

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-bg'

function confirmedHoursForAssignment(logs: WorkLog[], assignmentId: string) {
  return logs
    .filter((log) => log.assignment_id === assignmentId && log.status === 'CONFIRMED')
    .reduce((total, log) => total + (log.actualConfirmedHours ?? 0), 0)
}

export default function WorkStudyDashboard() {
  const [logs, setLogs] = useState<WorkLog[]>(mockWorkLogs)
  const [assignmentId, setAssignmentId] = useState(mockWorkScholarshipAssignments[0]?.id ?? '')

  const assignment = mockWorkScholarshipAssignments.find((item) => item.id === assignmentId) ?? mockWorkScholarshipAssignments[0]
  const assignmentLogs = useMemo(
    () => logs
      .filter((log) => log.assignment_id === assignment.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [assignment.id, logs],
  )
  const confirmedHours = useMemo(
    () => confirmedHoursForAssignment(logs, assignment.id),
    [assignment.id, logs],
  )
  const submittedCount = assignmentLogs.filter((log) => log.status !== 'DRAFT').length
  const pendingCount = assignmentLogs.filter((log) => log.status === 'SUBMITTED').length

  const addLog = (log: WorkLog) => {
    setLogs((current) => [log, ...current])
  }

  return (
    <div className="-m-4 min-h-[calc(100vh-52px)] overflow-x-hidden bg-cyber-bg px-4 py-5 text-cyber-slate md:-m-6 md:px-6 md:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 rounded-xl border border-cyber-border/50 bg-cyber-glass p-4 shadow-cyber-soft backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyber-cyan/65 bg-cyber-cyan/20 px-3 py-1 text-[11px] font-bold text-sky-950">
                <BriefcaseBusiness size={13} aria-hidden="true" />
                Work-Study
              </div>
              <h1 className="break-words font-display text-2xl font-bold tracking-normal text-cyber-slate md:text-3xl">
                บันทึกชั่วโมงทุนทำงาน
              </h1>
              <p className="mt-1 max-w-2xl break-words text-sm leading-relaxed text-cyber-slate/75">
                นักศึกษาส่งงานพร้อมช่วงเวลาและหลักฐาน ส่วนชั่วโมงสะสมจะนับเฉพาะชั่วโมงจริงที่ผู้ดูแลยืนยันแล้ว
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:min-w-[360px]">
              <div className="rounded-lg border border-cyber-mint/45 bg-cyber-mint/30 p-3">
                <div className="text-lg font-bold">{confirmedHours.toFixed(2)}</div>
                <div className="text-[11px] font-semibold text-cyber-slate/70">ชั่วโมงยืนยันแล้ว</div>
              </div>
              <div className="rounded-lg border border-cyber-violet/45 bg-cyber-violet/25 p-3">
                <div className="text-lg font-bold">{pendingCount}</div>
                <div className="text-[11px] font-semibold text-cyber-slate/70">รอตรวจ</div>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-5 rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 shadow-cyber-soft backdrop-blur">
          <div className="mb-3 text-sm font-bold">เลือกงานทุน</div>
          <div className="flex flex-wrap gap-2">
            {mockWorkScholarshipAssignments.map((item) => {
              const active = item.id === assignment.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAssignmentId(item.id)}
                  aria-pressed={active}
                  className={`min-h-11 rounded-full border px-4 py-2 text-xs font-bold transition-colors duration-fast ease-cyber ${focusClass} ${
                    active
                      ? 'border-cyber-slate bg-cyber-slate text-white'
                      : 'border-cyber-border/55 bg-white/65 text-cyber-slate hover:bg-white'
                  }`}
                >
                  {item.title}
                </button>
              )
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,390px)_minmax(0,1fr)]">
          <aside className="space-y-4">
            <WorkSummaryCard
              assignment={assignment}
              confirmedHours={confirmedHours}
              submittedCount={submittedCount}
              pendingCount={pendingCount}
            />
            <WorkLogForm assignment={assignment} onSubmitLog={addLog} />
          </aside>

          <main className="space-y-3">
            <div>
              <h2 className="text-sm font-bold">ไทม์ไลน์งาน</h2>
              <p className="mt-1 text-xs text-cyber-slate/70">
                รายการที่เป็นฉบับร่าง ส่งแล้ว ให้แก้ไข หรือไม่รับรองจะไม่เพิ่มชั่วโมงสะสม
              </p>
            </div>
            <WorkLogTimeline logs={assignmentLogs} />
          </main>
        </div>
      </div>
    </div>
  )
}
