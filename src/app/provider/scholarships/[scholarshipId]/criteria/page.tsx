'use client'

import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { EmptyState, PageHeader } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import {
  getProviderCriteriaForScholarship,
  getProviderScholarshipById,
} from '@/data/mock/providerData'
import ProviderCriteriaBuilder from '@/components/provider/ProviderCriteriaBuilder'

export default function CriteriaPage({ params }: { params: { scholarshipId: string } }) {
  const { lang } = useLang()
  const scholarship = getProviderScholarshipById(params.scholarshipId)
  const criteria = getProviderCriteriaForScholarship(params.scholarshipId)

  if (!scholarship || !criteria) {
    return (
      <AppShell requiredRole="provider">
        <EmptyState
          title={lang === 'th' ? 'ไม่พบเกณฑ์ทุน' : 'Scholarship criteria not found'}
          action={<Link href="/provider/scholarships" className="btn-primary min-h-11 px-4 text-sm">{lang === 'th' ? 'กลับพอร์ตโฟลิโอ' : 'Back to portfolio'}</Link>}
        />
      </AppShell>
    )
  }

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'ตัวสร้างเกณฑ์การจับคู่' : 'Matching Criteria Builder'}
        subtitle={lang === 'th' ? scholarship.title_th : scholarship.title_en}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/provider/scholarships" className="btn-secondary min-h-11 px-3 text-xs">
              <ArrowLeft size={14} />
              {lang === 'th' ? 'พอร์ตโฟลิโอ' : 'Portfolio'}
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

      <ProviderCriteriaBuilder criteria={criteria} />
    </AppShell>
  )
}
