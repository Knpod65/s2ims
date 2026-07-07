import AppShell from '@/components/layout/AppShell'
import RoleScholarshipShell from '@/components/scholarship-shells/RoleScholarshipShell'
import { scholarshipRoleShells } from '@/data/mock/scholarshipRoleShells'

export default function EsQScholarshipsPage() {
  return (
    <AppShell requiredRole="esq" title="มุมมองกำกับคุณภาพทุน">
      <RoleScholarshipShell config={scholarshipRoleShells.esq} />
    </AppShell>
  )
}
