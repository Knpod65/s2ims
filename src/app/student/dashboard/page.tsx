'use client'
import AppShell from '@/components/layout/AppShell'
import { useAuth } from '@/lib/auth'
import { useLang } from '@/lib/i18n'
import { mockScholarships } from '@/data/mock/scholarships'
import { mockApplications } from '@/data/mock/applications'
import { mockNotifications } from '@/data/mock/notifications'
import ScholarshipCard from '@/components/ScholarshipCard'
import ApplicationTimeline from '@/components/ApplicationTimeline'
import ProfileCompletionRing from '@/components/ProfileCompletionRing'
import { StatCard, PageHeader, StatusBadge } from '@/components/ui/index'
import { APP_STATUS_MAP } from '@/lib/utils'
import { Bell, BookOpen, FileText, Clock } from 'lucide-react'
import Link from 'next/link'

const MISSING = ['ระยะทางจากบ้าน', 'ประเภทที่พัก', 'กิจกรรมชมรม', 'ทักษะพิเศษ']

export default function StudentDashboard() {
  const { user } = useAuth()
  const { lang } = useLang()

  const name = user ? (lang === 'th' ? user.name_th : user.name_en) : ''
  const recommended = mockScholarships.filter(s => s.status === 'OPEN').slice(0, 3)
  const active = mockApplications.filter(a => !['COMPLETED', 'NOT_AWARDED'].includes(a.status)).slice(0, 2)
  const unread = mockNotifications.filter(n => !n.is_read)

  return (
    <AppShell requiredRole="student">
      <PageHeader
        title={`${lang === 'th' ? 'สวัสดี' : 'Hello'}, ${name.split(' ')[0]} 👋`}
        subtitle={lang === 'th' ? 'นี่คือทุนที่แนะนำสำหรับคุณวันนี้' : "Here are today's recommendations for you"}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          value={active.length}
          label={lang === 'th' ? 'ใบสมัครที่ดำเนินการ' : 'Active Applications'}
          icon={<FileText size={16} />}
          color="text-status-info"
        />
        <StatCard
          value={mockScholarships.filter(s => s.is_saved).length}
          label={lang === 'th' ? 'ทุนที่บันทึก' : 'Saved Scholarships'}
          icon={<BookOpen size={16} />}
          color="text-brand"
        />
        <StatCard
          value={unread.length}
          label={lang === 'th' ? 'การแจ้งเตือนใหม่' : 'New Notifications'}
          icon={<Bell size={16} />}
          color="text-status-danger"
        />
        <StatCard
          value={`${Math.min(daysUntilNext(mockScholarships), 99)}`}
          label={lang === 'th' ? 'วันสู่กำหนดส่งถัดไป' : 'Days to next deadline'}
          icon={<Clock size={16} />}
          color="text-status-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile completion */}
          <div className="card p-5">
            <ProfileCompletionRing pct={68} missing={MISSING.map(m => m)} />
            {68 < 100 && (
              <Link href="/student/profile" className="btn-secondary w-full text-center mt-4 text-xs py-2 block">
                {lang === 'th' ? 'เพิ่มเติมโปรไฟล์' : 'Complete Profile'} →
              </Link>
            )}
          </div>

          {/* Recommended scholarships */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-base text-ink-1">
                {lang === 'th' ? '✨ แนะนำสำหรับคุณ' : '✨ Recommended for you'}
              </h2>
              <Link href="/scholarships" className="text-brand text-xs hover:text-brand-light">
                {lang === 'th' ? 'ดูทั้งหมด' : 'View all'} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommended.slice(0,2).map(s => (
                <ScholarshipCard key={s.id} scholarship={s} showMatch />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Active applications */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-ink-1">
                {lang === 'th' ? '📋 ใบสมัครที่ดำเนินการ' : '📋 Active Applications'}
              </h3>
              <Link href="/student/applications" className="text-xs text-brand hover:text-brand-light">
                {lang === 'th' ? 'ทั้งหมด' : 'All'}
              </Link>
            </div>
            <div className="space-y-3">
              {active.map(app => {
                const statusInfo = APP_STATUS_MAP[app.status]
                const title = lang === 'th' ? app.scholarship_title_th : app.scholarship_title_en
                return (
                  <Link key={app.id} href={`/student/applications/${app.id}`} className="block card-sm p-3 hover:border-white/[0.15] transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-xs font-medium text-ink-1 line-clamp-2 flex-1">{title}</div>
                      <StatusBadge label={statusInfo[lang === 'th' ? 'th' : 'en']} color={statusInfo.color} />
                    </div>
                    <ApplicationTimeline steps={app.steps} compact />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-ink-1">
                {lang === 'th' ? '🔔 การแจ้งเตือน' : '🔔 Notifications'}
              </h3>
              <Link href="/student/notifications" className="text-xs text-brand hover:text-brand-light">
                {lang === 'th' ? 'ทั้งหมด' : 'All'}
              </Link>
            </div>
            <div className="space-y-2">
              {unread.slice(0,3).map(n => (
                <div key={n.id} className="flex gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-ink-1">
                      {lang === 'th' ? n.title_th : n.title_en}
                    </div>
                    <div className="text-[10px] text-ink-3 mt-0.5 line-clamp-1">
                      {lang === 'th' ? n.body_th : n.body_en}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function daysUntilNext(scholarships: typeof mockScholarships): number {
  const sorted = scholarships
    .filter(s => s.status === 'OPEN')
    .map(s => Math.ceil((new Date(s.deadline).getTime() - Date.now()) / 86400000))
    .filter(d => d >= 0)
    .sort((a, b) => a - b)
  return sorted[0] ?? 0
}
