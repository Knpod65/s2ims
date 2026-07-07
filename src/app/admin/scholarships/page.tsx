import AppShell from '@/components/layout/AppShell'
import RoleScholarshipShell from '@/components/scholarship-shells/RoleScholarshipShell'
import { scholarshipRoleShells } from '@/data/mock/scholarshipRoleShells'

export default function AdminScholarshipsPage() {
  return (
    <AppShell requiredRole="admin" title="ภาพรวมธรรมาภิบาลทุน">
      <RoleScholarshipShell config={scholarshipRoleShells.admin} />
    </AppShell>
  )
}
