'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { EmptyState, PageHeader } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import { mockProviderScholarships, type ProviderScholarshipStatus } from '@/data/mock/providerData'
import ProviderPrivacyNotice from '@/components/provider/ProviderPrivacyNotice'
import ProviderScholarshipCard, { scholarshipStatusLabel } from '@/components/provider/ProviderScholarshipCard'

const statusOptions: Array<ProviderScholarshipStatus | 'ALL'> = ['ALL', 'ACTIVE', 'DRAFT', 'PENDING_REVIEW', 'CLOSED']

export default function ProviderScholarshipsPage() {
  const { lang } = useLang()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ProviderScholarshipStatus | 'ALL'>('ALL')

  const scholarships = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mockProviderScholarships.filter(scholarship => {
      const matchesStatus = status === 'ALL' || scholarship.status === status
      const title = `${scholarship.title_en} ${scholarship.title_th}`.toLowerCase()
      return matchesStatus && (!q || title.includes(q))
    })
  }, [query, status])

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'พอร์ตโฟลิโอทุน' : 'Scholarship Portfolio'}
        subtitle={lang === 'th' ? 'ค้นหา กรอง และจัดการทุนขององค์กรคุณ' : 'Search, filter, and manage your organization scholarship portfolio.'}
        actions={
          <Link href="/provider/scholarships/new" className="btn-primary min-h-11 px-3 text-xs">
            <Plus size={14} />
            {lang === 'th' ? 'สร้างทุน' : 'Create scholarship'}
          </Link>
        }
      />

      <div className="space-y-5">
        <ProviderPrivacyNotice mode="review" />

        <div className="card p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <label className="relative block">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                className="input-base min-h-11 pl-9"
                placeholder={lang === 'th' ? 'ค้นหาชื่อทุน' : 'Search scholarship name'}
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {statusOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatus(option)}
                  className={`min-h-11 whitespace-nowrap rounded-lg border px-3 text-xs font-semibold transition ${
                    status === option
                      ? 'border-role-border bg-role-tint text-role-primary'
                      : 'border-line bg-white text-ink-2 hover:border-role-border hover:text-role-primary'
                  }`}
                >
                  {option === 'ALL' ? (lang === 'th' ? 'ทั้งหมด' : 'All') : scholarshipStatusLabel(option, lang)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {scholarships.map(scholarship => (
            <ProviderScholarshipCard key={scholarship.id} scholarship={scholarship} />
          ))}
          {scholarships.length === 0 && (
            <EmptyState
              title={lang === 'th' ? 'ไม่พบทุนที่ตรงกับเงื่อนไข' : 'No scholarships match this filter'}
              description={lang === 'th' ? 'ลองปรับคำค้นหาหรือสถานะ' : 'Try adjusting the search query or status filter.'}
              action={<Link href="/provider/scholarships/new" className="btn-primary min-h-11 px-4 text-sm">{lang === 'th' ? 'สร้างทุนใหม่' : 'Create scholarship'}</Link>}
            />
          )}
        </div>
      </div>
    </AppShell>
  )
}
