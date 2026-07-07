import AppShell from '@/components/layout/AppShell'
import RoleScholarshipShell from '@/components/scholarship-shells/RoleScholarshipShell'
import { scholarshipRoleShells } from '@/data/mock/scholarshipRoleShells'

export default function StaffScholarshipsPage() {
  return (
    <AppShell requiredRole="staff" title="ศูนย์ปฏิบัติการทุน">
      <RoleScholarshipShell config={scholarshipRoleShells.staff} />
    </AppShell>
  )
}
