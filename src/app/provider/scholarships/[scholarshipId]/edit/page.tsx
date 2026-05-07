'use client'

import Link from 'next/link'
import { ArrowLeft, Target, Users } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { EmptyState, PageHeader } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import { getProviderScholarshipById } from '@/data/mock/providerData'
import ProviderScholarshipForm from '@/components/provider/ProviderScholarshipForm'

export default function EditScholarshipPage({ params }: { params: { scholarshipId: string } }) {
  const { lang } = useLang()
  const scholarship = getProviderScholarshipById(params.scholarshipId)

  if (!scholarship) {
    return (
      <AppShell requiredRole="provider">
        <EmptyState
          title={lang === 'th' ? 'ไม่พบทุน' : 'Scholarship not found'}
          action={<Link href="/provider/scholarships" className="btn-primary min-h-11 px-4 text-sm">{lang === 'th' ? 'กลับพอร์ตโฟลิโอ' : 'Back to portfolio'}</Link>}
        />
      </AppShell>
    )
  }

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'แก้ไขทุน' : 'Edit Scholarship'}
        subtitle={lang === 'th' ? 'อัปเดตรายละเอียดทุนและส่งการเปลี่ยนแปลงให้เจ้าหน้าที่ตรวจสอบ' : 'Update scholarship details and submit changes for staff review.'}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/provider/scholarships" className="btn-secondary min-h-11 px-3 text-xs">
              <ArrowLeft size={14} />
              {lang === 'th' ? 'พอร์ตโฟลิโอ' : 'Portfolio'}
            </Link>
            <Link href={`/provider/scholarships/${scholarship.id}/criteria`} className="btn-secondary min-h-11 px-3 text-xs">
              <Target size={14} />
              {lang === 'th' ? 'เกณฑ์' : 'Criteria'}
            </Link>
            {scholarship.candidatePoolStatus === 'ready' && (
              <Link href={`/provider/scholarships/${scholarship.id}/candidates`} className="btn-secondary min-h-11 px-3 text-xs">
                <Users size={14} />
                {lang === 'th' ? 'ผู้สมัคร' : 'Candidates'}
              </Link>
            )}
          </div>
        }
      />
      <ProviderScholarshipForm mode="edit" scholarship={scholarship} />
    </AppShell>
  )
}
