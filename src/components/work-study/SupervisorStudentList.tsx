import type { WorkLog } from '@/lib/types'

interface SupervisorStudentListProps {
  logs: WorkLog[]
  selectedStudentId: string
  onSelectStudent: (studentId: string) => void
}

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-bg'

export default function SupervisorStudentList({ logs, selectedStudentId, onSelectStudent }: SupervisorStudentListProps) {
  const studentIds = Array.from(new Set(logs.map((log) => log.student_id)))

  return (
    <section className="rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur">
      <h2 className="mb-3 text-sm font-bold">นักศึกษาในคิว</h2>
      <div className="space-y-2">
        {studentIds.map((studentId) => {
          const active = selectedStudentId === studentId
          const studentLogs = logs.filter((log) => log.student_id === studentId)
          const pendingCount = studentLogs.filter((log) => log.status === 'SUBMITTED').length

          return (
            <button
              key={studentId}
              type="button"
              onClick={() => onSelectStudent(studentId)}
              aria-pressed={active}
              className={`min-h-14 w-full rounded-lg border px-3 py-2 text-left transition-colors duration-fast ease-cyber ${focusClass} ${
                active
                  ? 'border-cyber-slate bg-cyber-slate text-white'
                  : 'border-cyber-border/45 bg-white/65 text-cyber-slate hover:bg-white'
              }`}
            >
              <div className="break-words text-sm font-bold">{studentId}</div>
              <div className={`mt-0.5 text-[11px] ${active ? 'text-white/75' : 'text-cyber-slate/65'}`}>
                {pendingCount} รายการรอตรวจ · {studentLogs.length} รายการทั้งหมด
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
