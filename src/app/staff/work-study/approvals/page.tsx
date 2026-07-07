import AppShell from '@/components/layout/AppShell'
import SupervisorWorkLogQueue from '@/components/work-study/SupervisorWorkLogQueue'

export default function StaffWorkStudyApprovalsPage() {
  return (
    <AppShell requiredRole="staff" title="ตรวจชั่วโมงทุนทำงาน">
      <SupervisorWorkLogQueue />
    </AppShell>
  )
}
