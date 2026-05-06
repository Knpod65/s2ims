'use client'

import { useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { mockProviderScholarships } from '@/data/mock/providerData'
import { Plus, Edit, Users, Target } from 'lucide-react'
import Link from 'next/link'

export default function ProviderScholarshipsPage() {
  const router = useRouter()
  const { lang } = useLang()

  const scholarships = mockProviderScholarships

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        title={lang === 'th' ? 'พอร์ตโฟลิโอทุน' : 'Scholarship Portfolio'}
        subtitle={lang === 'th' ? 'จัดการและติดตามทุนการศึกษาของคุณ' : 'Manage and track your scholarships'}
        actions={
          <Link href="/provider/scholarships/new" className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5">
            <Plus size={13} />
            {lang === 'th' ? 'สร้างใหม่' : 'New Scholarship'}
          </Link>
        }
      />

      <div className="space-y-4">
        {scholarships.map((scholarship) => {
          const statusColor =
            scholarship.status === 'OPEN'
              ? 'bg-status-success/[0.12] text-status-success'
              : scholarship.status === 'DRAFT'
              ? 'bg-bg-100 text-ink-3'
              : 'bg-status-danger/[0.12] text-status-danger'

          return (
            <div key={scholarship.id} className="card p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink-1">
                    {lang === 'th' ? scholarship.title_th : scholarship.title_en}
                  </h3>
                  <p className="text-xs text-ink-3 mt-1 line-clamp-2">
                    {lang === 'th' ? scholarship.description_th : scholarship.description_en}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusColor}`}>
                  {scholarship.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-bg-100 rounded p-2">
                  <p className="text-ink-3">{lang === 'th' ? 'จำนวนเงิน' : 'Amount'}</p>
                  <p className="font-semibold text-ink-1">฿{scholarship.amount.toLocaleString()}</p>
                </div>
                <div className="bg-bg-100 rounded p-2">
                  <p className="text-ink-3">{lang === 'th' ? 'ทุน' : 'Awards'}</p>
                  <p className="font-semibold text-ink-1">{scholarship.num_awards}</p>
                </div>
                <div className="bg-bg-100 rounded p-2">
                  <p className="text-ink-3">{lang === 'th' ? 'ปิดรับ' : 'Deadline'}</p>
                  <p className="font-semibold text-ink-1">{new Date(scholarship.deadline).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US')}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/provider/scholarships/${scholarship.id}/edit`}
                  className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  <Edit size={13} />
                  {lang === 'th' ? 'แก้ไข' : 'Edit'}
                </Link>
                <Link
                  href={`/provider/scholarships/${scholarship.id}/criteria`}
                  className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  <Target size={13} />
                  {lang === 'th' ? 'เกณฑ์' : 'Criteria'}
                </Link>
                {scholarship.status === 'OPEN' && (
                  <Link
                    href={`/provider/scholarships/${scholarship.id}/candidates`}
                    className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    <Users size={13} />
                    {lang === 'th' ? 'ผู้สมัคร' : 'Candidates'}
                  </Link>
                )}
              </div>
            </div>
          )
        })}

        {scholarships.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-ink-3 text-sm mb-4">
              {lang === 'th' ? 'ยังไม่มีทุนการศึกษา' : 'No scholarships yet'}
            </p>
            <Link href="/provider/scholarships/new" className="btn-primary text-sm px-4 py-2">
              {lang === 'th' ? 'สร้างทุนใหม่' : 'Create First Scholarship'}
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  )
}
