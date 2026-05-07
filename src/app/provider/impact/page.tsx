'use client'

import Link from 'next/link'
import { BarChart3, CircleDollarSign, PieChart, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import { mockProviderImpactData, mockProviderScholarships } from '@/data/mock/providerData'
import ProviderDataFreshnessIndicator from '@/components/provider/ProviderDataFreshnessIndicator'
import ProviderImpactCard from '@/components/provider/ProviderImpactCard'
import ProviderPrivacyNotice from '@/components/provider/ProviderPrivacyNotice'

export default function ProviderImpactPage() {
  const { lang } = useLang()
  const impact = mockProviderImpactData

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'ผลกระทบรวม' : 'Aggregate Impact'}
        subtitle={lang === 'th' ? 'ดูผลลัพธ์เชิงภาพรวมแบบไม่เปิดเผยข้อมูลรายบุคคล' : 'Review aggregate outcomes without exposing individual student records.'}
        badge={
          <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-role-border bg-role-tint px-3 py-1 text-xs font-semibold text-role-primary">
            <ShieldCheck size={13} />
            {lang === 'th' ? 'ภาพรวมเท่านั้น' : 'Aggregate only'}
          </span>
        }
        actions={
          <ProviderDataFreshnessIndicator
            status={impact.dataFreshness.status}
            label_en={impact.dataFreshness.syncedAt_en}
            label_th={impact.dataFreshness.syncedAt_th}
          />
        }
      />

      <div className="space-y-6">
        <ProviderPrivacyNotice mode="aggregate" />

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ProviderImpactCard
            icon={CircleDollarSign}
            label={lang === 'th' ? 'วงเงินที่จัดสรร' : 'Committed funding'}
            value={`฿${impact.totalCommittedAmount.toLocaleString()}`}
            helper={lang === 'th' ? 'รวมทุกทุนในพอร์ต' : 'Across active portfolio'}
          />
          <ProviderImpactCard
            icon={PieChart}
            label={lang === 'th' ? 'การใช้เงินทุน' : 'Fund utilization'}
            value={`${impact.fundUtilizationPct}%`}
            helper={lang === 'th' ? 'คำนวณรวม ไม่ระบุรายบุคคล' : 'Aggregate calculation only'}
          />
          <ProviderImpactCard
            icon={Users}
            label={lang === 'th' ? 'ผู้รับทุนรวม' : 'Recipients awarded'}
            value={impact.awardedCount}
            helper={lang === 'th' ? 'แสดงเฉพาะจำนวนรวม' : 'Count only, no identities'}
          />
          <ProviderImpactCard
            icon={TrendingUp}
            label={lang === 'th' ? 'ครอบคลุมกลุ่มเป้าหมาย' : 'Coverage'}
            value={`${impact.coveragePct}%`}
            helper={lang === 'th' ? 'ตาม cohort band ที่ปลอดภัย' : 'Across safe cohort bands'}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 size={17} className="text-role-primary" />
              <h2 className="font-semibold text-ink-1">{lang === 'th' ? 'กลุ่มชั้นปี' : 'Cohort bands'}</h2>
            </div>
            <div className="space-y-3">
              {impact.cohortBands.map(item => (
                <div key={item.label_en}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-ink-2">{lang === 'th' ? item.label_th : item.label_en}</span>
                    <span className="font-mono font-semibold text-role-primary">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-low">
                    <div className="h-full rounded-full bg-role-gradient" style={{ width: `${Math.min(100, item.value * 2)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 size={17} className="text-role-primary" />
              <h2 className="font-semibold text-ink-1">{lang === 'th' ? 'กลุ่มสาขา' : 'Department bands'}</h2>
            </div>
            <div className="space-y-3">
              {impact.departmentBands.map(item => (
                <div key={item.label_en}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-ink-2">{lang === 'th' ? item.label_th : item.label_en}</span>
                    <span className="font-mono font-semibold text-role-primary">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-low">
                    <div className="h-full rounded-full bg-role-gradient" style={{ width: `${Math.min(100, item.value * 2)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-ink-1">{lang === 'th' ? 'สรุปตามทุน' : 'Scholarship portfolio summary'}</h2>
              <p className="mt-1 text-sm text-ink-2">
                {lang === 'th' ? 'แสดงสถานะและวงเงินรวม ไม่แสดงข้อมูลรายบุคคล' : 'Status and funding summary only, no individual student data.'}
              </p>
            </div>
            <Link href="/provider/scholarships" className="text-xs font-semibold text-role-primary">
              {lang === 'th' ? 'จัดการทุน' : 'Manage'}
            </Link>
          </div>
          <div className="space-y-3">
            {mockProviderScholarships.map(scholarship => (
              <div key={scholarship.id} className="grid gap-3 rounded-xl border border-line bg-white p-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-ink-1">{lang === 'th' ? scholarship.title_th : scholarship.title_en}</h3>
                  <p className="mt-1 text-xs text-ink-3">{lang === 'th' ? scholarship.provider_th : scholarship.provider}</p>
                </div>
                <div className="text-xs text-ink-2">
                  {lang === 'th' ? 'จำนวนทุน' : 'Awards'} <span className="font-mono font-semibold text-ink-1">{scholarship.num_awards}</span>
                </div>
                <div className="text-xs text-ink-2">
                  {lang === 'th' ? 'วงเงิน' : 'Funding'} <span className="font-mono font-semibold text-role-primary">฿{(scholarship.amount * scholarship.num_awards).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
