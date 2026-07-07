import type { WorkLog } from '@/lib/types'
import WorkLogCard from './WorkLogCard'

export default function WorkLogTimeline({ logs }: { logs: WorkLog[] }) {
  if (!logs.length) {
    return (
      <div className="rounded-xl border border-cyber-border/45 bg-cyber-glass p-6 text-center text-sm text-cyber-slate/70 shadow-cyber-soft">
        ยังไม่มีรายการชั่วโมงสำหรับงานนี้
      </div>
    )
  }

  return (
    <section className="space-y-3">
      {logs.map((log) => (
        <WorkLogCard key={log.id} log={log} />
      ))}
    </section>
  )
}
