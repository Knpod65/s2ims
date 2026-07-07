import AppShell from '@/components/layout/AppShell'
import WorkStudyDashboard from '@/components/work-study/WorkStudyDashboard'

export default function StudentWorkStudyPage() {
  return (
    <AppShell requiredRole="student" title="บันทึกชั่วโมงทุนทำงาน">
      <WorkStudyDashboard />
    </AppShell>
  )
}
