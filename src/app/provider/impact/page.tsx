'use client'

import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { mockProviderScholarships } from '@/data/mock/providerData'
import { TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function ProviderImpactPage() {
  const { lang } = useLang()

  // Calculate aggregate metrics from all scholarships
  const allImpactData = mockProviderScholarships
    .map((s) => s.providerImpact)
    .filter((x): x is NonNullable<typeof x> => x !== undefined)

  const totalScholarshipsOffered = allImpactData.reduce((sum, impact) => sum + (impact?.scholarshipsOffered || 0), 0)
  const totalAwardedCount = allImpactData.reduce((sum, impact) => sum + (impact?.awardedCount || 0), 0)
  const totalAmountDistributed = allImpactData.reduce((sum, impact) => sum + (impact?.totalAwardAmount || 0), 0)
  const averageGPA = allImpactData.length > 0 ? (allImpactData.reduce((sum, impact) => sum + (impact?.averageStudentGPA || 0), 0) / allImpactData.length).toFixed(2) : '0.00'
  const avgRetentionRate = allImpactData.length > 0 ? Math.round(allImpactData.reduce((sum, impact) => sum + (impact?.studentRetentionRate || 0), 0) / allImpactData.length) : 0
  const avgCareerOutcomeRate = allImpactData.length > 0 ? Math.round(allImpactData.reduce((sum, impact) => sum + (impact?.careerOutcomeRate || 0), 0) / allImpactData.length) : 0

  const metrics = [
    {
      icon: DollarSign,
      label_en: 'Total Distributed',
      label_th: 'รวมจำหน่ายไป',
      value: `฿${totalAmountDistributed.toLocaleString()}`,
      color: 'text-status-success',
      bgColor: 'bg-status-success/[0.12]',
    },
    {
      icon: Users,
      label_en: 'Total Recipients',
      label_th: 'ทั้งหมดผู้ได้รับ',
      value: totalAwardedCount.toString(),
      color: 'text-status-info',
      bgColor: 'bg-status-info/[0.12]',
    },
    {
      icon: BarChart3,
      label_en: 'Scholarships Offered',
      label_th: 'ทุนที่เสนอ',
      value: totalScholarshipsOffered.toString(),
      color: 'text-role-primary',
      bgColor: 'bg-role-tint',
    },
    {
      icon: TrendingUp,
      label_en: 'Avg GPA',
      label_th: 'คะแนนเฉลี่ย',
      value: averageGPA.toString(),
      color: 'text-status-warning',
      bgColor: 'bg-status-warning/[0.12]',
    },
  ]

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        title={lang === 'th' ? 'ผลกระทบของทุน' : 'Scholarship Impact'}
        subtitle={lang === 'th' ? 'ดูผลกระทบรวมของทุนการศึกษาของคุณ' : 'View the aggregate impact of your scholarships'}
      />

      <div className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon
            return (
              <div key={idx} className={`card p-4 ${metric.bgColor}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-ink-3 mb-2">
                      {lang === 'th' ? metric.label_th : metric.label_en}
                    </p>
                    <p className={`text-2xl font-semibold ${metric.color}`}>
                      {metric.value}
                    </p>
                  </div>
                  <Icon size={24} className={`${metric.color} flex-shrink-0 opacity-60`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Outcomes Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Retention Rate */}
          <div className="card p-6">
            <h3 className="font-semibold text-ink-1 mb-4">
              {lang === 'th' ? 'อัตราการคงอยู่' : 'Retention Rate'}
            </h3>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-xs text-ink-3">
                    {lang === 'th' ? 'อัตรา' : 'Rate'}
                  </span>
                  <span className="text-2xl font-semibold text-status-success">{avgRetentionRate}%</span>
                </div>
                <div className="h-3 bg-bg-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-status-success transition-all"
                    style={{ width: `${avgRetentionRate}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-ink-3 mt-4">
              {lang === 'th'
                ? 'ส่วนของผู้ได้รับทุนที่ยังคงศึกษาต่อในสถาบันการศึกษา'
                : 'Percentage of recipients continuing their studies'}
            </p>
          </div>

          {/* Career Outcome Rate */}
          <div className="card p-6">
            <h3 className="font-semibold text-ink-1 mb-4">
              {lang === 'th' ? 'อัตราความสำเร็จในอาชีพ' : 'Career Outcome Rate'}
            </h3>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-xs text-ink-3">
                    {lang === 'th' ? 'อัตรา' : 'Rate'}
                  </span>
                  <span className="text-2xl font-semibold text-role-primary">{avgCareerOutcomeRate}%</span>
                </div>
                <div className="h-3 bg-bg-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-role-primary transition-all"
                    style={{ width: `${avgCareerOutcomeRate}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-ink-3 mt-4">
              {lang === 'th'
                ? 'ส่วนของผู้ได้รับทุนที่ได้งานหรือประสบความสำเร็จในอาชีพ'
                : 'Percentage of recipients employed or successful in career'}
            </p>
          </div>
        </div>

        {/* Scholarship Breakdown */}
        <div className="card p-6">
          <h3 className="font-semibold text-ink-1 mb-4">
            {lang === 'th' ? 'รายละเอียดตามทุน' : 'Scholarship Details'}
          </h3>
          <div className="space-y-3">
            {mockProviderScholarships.map((scholarship) => {
              const impact = scholarship.providerImpact
              return (
                <div key={scholarship.id} className="flex items-center justify-between p-3 bg-bg-100 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-ink-1 text-sm truncate">
                      {lang === 'th' ? scholarship.title_th : scholarship.title_en}
                    </h4>
                    <p className="text-xs text-ink-3 mt-1">
                      {lang === 'th' ? 'ผู้ได้รับ:' : 'Recipients:'} {impact?.awardedCount} | {lang === 'th' ? 'จำหน่าย:' : 'Distributed:'} ฿{impact?.totalAwardAmount?.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-role-primary">
                    {impact?.averageStudentGPA?.toFixed(2)} {lang === 'th' ? 'GPA' : ''}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="card p-4 rounded-xl bg-status-info/[0.06] border border-status-info/20">
          <p className="text-xs text-status-info/80">
            <span className="font-semibold">🔒 {lang === 'th' ? 'ข้อมูลรวม' : 'Aggregate Data'}</span>
            <br />
            {lang === 'th'
              ? 'สถิติที่แสดงนี้เป็นข้อมูลรวมเท่านั้น ไม่มีข้อมูลส่วนบุคคลของผู้ได้รับทุน'
              : 'All metrics shown are aggregate statistics. No individual recipient data is displayed.'}
          </p>
        </div>

        {/* Call to Action */}
        <div className="card p-6 bg-role-tint border border-role-border">
          <h3 className="font-semibold text-ink-1 mb-2">
            {lang === 'th' ? 'ดูรายละเอียดเพิ่มเติม' : 'View More Details'}
          </h3>
          <p className="text-sm text-ink-3 mb-4">
            {lang === 'th'
              ? 'เข้าไปในแต่ละทุนเพื่อดูผู้สมัครและจัดการเกณฑ์การจับคู่'
              : 'Access individual scholarships to view candidates and manage matching criteria'}
          </p>
          <Link
            href="/provider/scholarships"
            className="inline-block btn-primary text-sm py-2 px-4"
          >
            {lang === 'th' ? 'ไปยังการจัดการทุน' : 'Go to Scholarship Management'}
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
