'use client'

import AppShell from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import ProviderScholarshipForm from '@/components/provider/ProviderScholarshipForm'

export default function ProviderNewScholarshipPage() {
  const { lang } = useLang()

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'สร้างทุนใหม่' : 'Create Scholarship'}
        subtitle={lang === 'th' ? 'ตั้งค่ารายละเอียด เงื่อนไข และเอกสารที่ต้องใช้ ก่อนส่งให้เจ้าหน้าที่ตรวจสอบ' : 'Define details, eligibility, and required documents before staff review.'}
      />
      <ProviderScholarshipForm mode="new" />
    </AppShell>
  )
}
