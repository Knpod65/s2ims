'use client'

import Link from 'next/link'
import { BarChart3, ChevronRight, PlusCircle, ShieldCheck, Users } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import {
  mockProviderImpactData,
  mockProviderOrganization,
  mockProviderScholarships,
} from '@/data/mock/providerData'
import ProviderDashboardSummary from '@/components/provider/ProviderDashboardSummary'
import ProviderPrivacyNotice from '@/components/provider/ProviderPrivacyNotice'
import ProviderScholarshipCard from '@/components/provider/ProviderScholarshipCard'
import ProviderImpactCard from '@/components/provider/ProviderImpactCard'

export default function ProviderDashboard() {
  const { lang } = useLang()
  const activeScholarships = mockProviderScholarships.filter(s => s.status === 'ACTIVE')
  const pendingShortlists = mockProviderScholarships.filter(s => s.shortlistStatus === 'pending_staff_approval')

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'แดชบอร์ดผู้ให้ทุน' : 'Provider Dashboard'}
        subtitle={lang === 'th'
          ? `${mockProviderOrganization.name_th} · พื้นที่จัดการทุนภายใต้ PDPA`
          : `${mockProviderOrganization.name_en} · PDPA-aware scholarship command center`}
        actions={
          <Link href="/provider/scholarships/new" className="btn-primary min-h-11 px-3 text-xs">
            <PlusCircle size={14} />
            {lang === 'th' ? 'สร้างทุนใหม่' : 'New Scholarship'}
          </Link>
        }
      />

      <div className="space-y-6">
        <ProviderPrivacyNotice mode="aggregate" />

        <ProviderDashboardSummary scholarships={mockProviderScholarships} />

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-ink-1">{lang === 'th' ? 'ทุนที่กำลังดำเนินการ' : 'Active portfolio'}</h2>
              <p className="text-sm text-ink-2">{lang === 'th' ? 'ทุนที่เปิดใช้งานและมีชุมชนผู้สมัครแบบนิรนาม' : 'Published scholarships with anonymous candidate pools.'}</p>
            </div>
            <Link href="/provider/scholarships" className="text-xs font-semibold text-role-primary hover:text-role-primary">
              {lang === 'th' ? 'ดูทั้งหมด' : 'View all'}
            </Link>
          </div>
          <div className="space-y-3">
            {activeScholarships.slice(0, 2).map(scholarship => (
              <ProviderScholarshipCard key={scholarship.id} scholarship={scholarship} />
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-ink-1">{lang === 'th' ? 'สถานะคำขอคัดเลือก' : 'Shortlist request status'}</h2>
                <p className="text-sm text-ink-2">
                  {lang === 'th' ? 'คำขอทุกครั้งต้องมีเหตุผลและรอเจ้าหน้าที่อนุมัติ' : 'Every request requires a reason and waits for staff approval.'}
                </p>
              </div>
              <ShieldCheck size={20} className="text-role-primary" />
            </div>
            {pendingShortlists.length > 0 ? (
              <div className="space-y-3">
                {pendingShortlists.map(scholarship => (
                  <Link
                    key={scholarship.id}
                    href={`/provider/scholarships/${scholarship.id}/candidates`}
                    className="flex min-h-16 items-center justify-between gap-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-[#78350F] transition hover:border-role-border hover:bg-role-tint hover:text-role-primary"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{lang === 'th' ? scholarship.title_th : scholarship.title_en}</p>
                      <p className="mt-1 text-xs">{lang === 'th' ? 'รออนุมัติจากเจ้าหน้าที่' : 'Pending staff approval'}</p>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-line bg-white p-4 text-sm text-ink-2">
                {lang === 'th' ? 'ยังไม่มีคำขอคัดเลือกที่รอดำเนินการ' : 'No shortlist requests are pending.'}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <ProviderImpactCard
              icon={BarChart3}
              label={lang === 'th' ? 'การใช้เงินทุน' : 'Fund utilization'}
              value={`${mockProviderImpactData.fundUtilizationPct}%`}
              helper={lang === 'th' ? 'สรุปรวม ไม่ใช่ข้อมูลรายบุคคล' : 'Aggregate only, never individual data'}
            />
            <ProviderImpactCard
              icon={Users}
              label={lang === 'th' ? 'การครอบคลุมกลุ่มเป้าหมาย' : 'Coverage'}
              value={`${mockProviderImpactData.coveragePct}%`}
              helper={lang === 'th' ? 'คำนวณจากกลุ่มข้อมูลที่ปลอดภัย' : 'Calculated from safe cohorts'}
            />
            <Link href="/provider/impact" className="btn-secondary min-h-11 w-full justify-center text-sm">
              {lang === 'th' ? 'ดูผลกระทบรวม' : 'View aggregate impact'}
            </Link>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {[
            { href: '/provider/scholarships', icon: PlusCircle, th: 'จัดการทุน', en: 'Manage scholarships' },
            { href: '/provider/candidates', icon: Users, th: 'ชุมชนผู้สมัคร', en: 'Candidate pools' },
            { href: '/provider/impact', icon: BarChart3, th: 'ผลกระทบรวม', en: 'Aggregate impact' },
          ].map(item => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="card card-hover flex min-h-16 items-center gap-3 p-4">
                <span className="rounded-xl bg-role-tint p-2.5 text-role-primary"><Icon size={18} /></span>
                <span className="flex-1 text-sm font-semibold text-ink-1">{lang === 'th' ? item.th : item.en}</span>
                <ChevronRight size={15} className="text-ink-3" />
              </Link>
            )
          })}
        </section>
      </div>
    </AppShell>
  )
}
