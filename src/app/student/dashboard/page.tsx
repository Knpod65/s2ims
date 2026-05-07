'use client'
import Link from 'next/link'
import { ArrowRight, Bell, BookOpen, CalendarDays, Clock, FileText, ListChecks } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { useAuth } from '@/lib/auth'
import { useLang } from '@/lib/i18n'
import { mockApplications } from '@/data/mock/applications'
import { mockNotifications } from '@/data/mock/notifications'
import ApplicationTimeline from '@/components/ApplicationTimeline'
import { PageHeader, StatCard, StatusBadge } from '@/components/ui/index'
import { APP_STATUS_MAP } from '@/lib/utils'
import {
  getScholarshipForRecommendation,
  studentDataFreshness,
  studentMissingData,
  studentProfileSummary,
  studentRecommendations,
} from '@/data/mock/studentMatchingData'
import {
  DataFreshnessIndicator,
  MissingDataPrompt,
  ProfileCompletenessCard,
  RecommendationCard,
  StudentPrivacyNotice,
} from '@/components/student'

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const { lang } = useLang()

  const name = user ? (lang === 'th' ? user.name_th : user.name_en) : ''
  const active = mockApplications.filter(a => !['COMPLETED', 'NOT_AWARDED'].includes(a.status)).slice(0, 2)
  const unread = mockNotifications.filter(n => !n.is_read)
  const needsAction = mockApplications.filter(a => ['NEEDS_DOCS', 'CONFIRMED', 'FOLLOW_UP_REQUIRED', 'REPORT_OVERDUE'].includes(a.status))
  const nextDeadlines = studentRecommendations
    .map(rec => ({ rec, scholarship: getScholarshipForRecommendation(rec), days: daysUntil(rec.deadline) }))
    .filter(item => item.scholarship)
    .sort((a, b) => a.days - b.days)
    .slice(0, 3)

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={`${lang === 'th' ? 'สวัสดี' : 'Hello'}, ${name.split(' ')[0]}`}
        subtitle={lang === 'th' ? 'ภาพรวมคำแนะนำทุนและข้อมูลที่ช่วยให้การจับคู่แม่นขึ้น' : 'Your scholarship recommendations and the profile signals that make matching stronger.'}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          value={studentProfileSummary.completeness + '%'}
          label={lang === 'th' ? 'ความพร้อมโปรไฟล์' : 'Profile readiness'}
          icon={<ListChecks size={16} />}
          color="text-role-primary"
          roleAccent
        />
        <StatCard
          value={studentRecommendations.length}
          label={lang === 'th' ? 'ทุนที่แนะนำ' : 'Recommended matches'}
          icon={<BookOpen size={16} />}
          color="text-role-primary"
          roleAccent
        />
        <StatCard
          value={active.length}
          label={lang === 'th' ? 'ใบสมัครที่ดำเนินการ' : 'Active applications'}
          icon={<FileText size={16} />}
          color="text-status-info"
        />
        <StatCard
          value={needsAction.length}
          label={lang === 'th' ? 'รายการที่ควรดู' : 'Needs attention'}
          icon={<Bell size={16} />}
          color="text-status-warning"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          <ProfileCompletenessCard
            percentage={studentProfileSummary.completeness}
            completedFields={studentProfileSummary.completedFields}
            totalFields={studentProfileSummary.totalFields}
            missingItems={studentMissingData}
          />

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-ink-1">
                  {lang === 'th' ? 'ทุนที่เหมาะกับคุณ' : 'Recommended scholarships'}
                </h2>
                <p className="text-sm text-ink-2">
                  {lang === 'th' ? 'เรียงตามความเหมาะสมและความมั่นใจของข้อมูล' : 'Ranked by fit and confidence in your available data.'}
                </p>
              </div>
              <Link href="/student/recommendations" className="btn-secondary inline-flex min-h-11 items-center gap-2 px-3 py-2 text-xs">
                {lang === 'th' ? 'ดูทั้งหมด' : 'View all'}
                <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {studentRecommendations.slice(0, 2).map(recommendation => {
                const scholarship = getScholarshipForRecommendation(recommendation)
                return scholarship ? (
                  <RecommendationCard key={recommendation.id} recommendation={recommendation} scholarship={scholarship} />
                ) : null
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <StudentPrivacyNotice />

          {studentMissingData[0] && (
            <MissingDataPrompt item={studentMissingData[0]} />
          )}

          <section className="card p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-sm text-ink-1">
                  {lang === 'th' ? 'กำหนดส่งใกล้เข้ามา' : 'Upcoming deadlines'}
                </h3>
                <p className="text-xs text-ink-3">
                  {lang === 'th' ? 'จากทุนที่แนะนำ' : 'From your recommended matches'}
                </p>
              </div>
              <CalendarDays size={18} className="text-role-primary" />
            </div>
            <div className="space-y-3">
              {nextDeadlines.map(({ rec, scholarship, days }) => (
                <Link
                  key={rec.id}
                  href={`/student/recommendations/${rec.scholarshipId}/explanation`}
                  className="block rounded-xl border border-line bg-surface-low p-3 transition hover:border-role-border hover:bg-role-tint"
                >
                  <div className="line-clamp-1 text-sm font-semibold text-ink-1">
                    {lang === 'th' ? scholarship?.title_th : scholarship?.title_en}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-2">
                    <Clock size={12} />
                    {days <= 0
                      ? (lang === 'th' ? 'ควรตรวจสอบกำหนดส่ง' : 'Check deadline')
                      : `${days} ${lang === 'th' ? 'วัน' : 'days'}`}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="card p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-sm text-ink-1">
                {lang === 'th' ? 'สถานะใบสมัคร' : 'Application status'}
              </h3>
              <Link href="/student/applications" className="text-xs font-semibold text-role-primary">
                {lang === 'th' ? 'ทั้งหมด' : 'All'}
              </Link>
            </div>
            <div className="space-y-3">
              {active.map(app => {
                const statusInfo = APP_STATUS_MAP[app.status]
                const title = lang === 'th' ? app.scholarship_title_th : app.scholarship_title_en
                return (
                  <Link key={app.id} href={`/student/applications/${app.id}`} className="block rounded-xl border border-line bg-white p-3 transition hover:border-role-border">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="line-clamp-2 flex-1 text-xs font-medium text-ink-1">{title}</div>
                      <StatusBadge label={statusInfo[lang === 'th' ? 'th' : 'en']} color={statusInfo.color} />
                    </div>
                    <ApplicationTimeline steps={app.steps} compact />
                  </Link>
                )
              })}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  )
}
