import AppShell from '@/components/layout/AppShell'
import SupervisorWorkLogQueue from '@/components/work-study/SupervisorWorkLogQueue'

export default function StaffWorkStudyApprovalsPage() {
  return (
    <AppShell requiredRole="staff" title="ตรวจชั่วโมงทุนทำงาน" enableDemoAccess demoAccessLabel="อาจารย์/เจ้าหน้าที่รับรอง">
      <SupervisorWorkLogQueue />
    </AppShell>
  )
}
