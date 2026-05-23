'use client'

import AppShell from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/index'
import { SafetyBanner } from '@/components/shared/SafetyBanner'
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
      <SafetyBanner
        tone="info"
        title={lang === 'th' ? 'ต้องผ่านการตรวจสอบก่อนเผยแพร่' : 'Staff review required before publication'}
        description={lang === 'th'
          ? 'หลังส่งฟอร์ม เจ้าหน้าที่จะตรวจสอบรายละเอียดทุนก่อนเปิดให้นักศึกษาสมัคร ยังไม่มีการบันทึกข้อมูลจริง'
          : 'After submission, staff will review scholarship details before candidate access. No real data is written.'}
        className="mb-4"
      />
      <ProviderScholarshipForm mode="new" />
    </AppShell>
  )
}
