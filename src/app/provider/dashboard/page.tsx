'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader, StatCard } from '@/components/ui/index'
import { mockScholarships } from '@/data/mock/scholarships'
import { mockApplications } from '@/data/mock/applications'
import { Shield, PlusCircle, TrendingUp, ChevronRight, BookOpen, Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function ProviderDashboard() {
  const { lang } = useLang()

  const myScholarships = mockScholarships.filter(s => s.provider === 'JCC Company Limited')
  const myIds = new Set(myScholarships.map(s => s.id))
  const myApps = mockApplications.filter(a => myIds.has(a.scholarship_id))
  const shortlisted = myApps.filter(a => ['SHORTLISTED', 'INTERVIEW_SCHEDULED'].includes(a.status))
  const awarded = myApps.filter(a => ['AWARDED', 'CONFIRMED', 'COMPLETED'].includes(a.status))
  const confirmed = myApps.filter(a => a.status === 'CONFIRMED' || a.status === 'COMPLETED')
  const confirmedPct = awarded.length > 0 ? Math.round((confirmed.length / awarded.length) * 100) : 0

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        title={lang === 'th' ? 'แดชบอร์ดผู้ให้ทุน' : 'Provider Dashboard'}
        subtitle={lang === 'th' ? 'ข้อมูลรวมภายใต้การคุ้มครอง PDPA' : 'Aggregated data under PDPA protection'}
        actions={
          <Link href="/provider/scholarships/new" className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5">
            <PlusCircle size={13} />
            {lang === 'th' ? 'สร้างทุนใหม่' : 'New Scholarship'}
          </Link>
        }
      />

      <div className="p-3 mb-6 rounded-xl bg-status-info/[0.06] border border-status-info/20 flex items-center gap-3">
        <Shield size={14} className="text-status-info flex-shrink-0" />
        <span className="text-xs text-status-info/80">
          {lang === 'th'
            ? 'ข้อมูลทั้งหมดเป็นแบบรวม — ไม่มีข้อมูลส่วนตัวนักศึกษา (PDPA มาตรา 26)'
            : 'All data is aggregated — no individual student data displayed (PDPA Section 26)'}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard value={myApps.length} label={lang === 'th' ? 'ผู้สมัครทั้งหมด' : 'Total Applicants'} color="text-brand" />
        <StatCard value={shortlisted.length} label={lang === 'th' ? 'ผ่านคัดเลือก' : 'Shortlisted'} color="text-status-info" />
        <StatCard value={awarded.length} label={lang === 'th' ? 'ได้รับทุน' : 'Awarded'} color="text-status-success" />
        <StatCard value={`${confirmedPct}%`} label={lang === 'th' ? 'ยืนยันแล้ว' : 'Confirmed'} color="text-status-track" />
      </div>

      {/* Per-scholarship breakdown */}
      <div className="mb-6">
        <h2 className="font-semibold text-sm text-ink-1 mb-3">
          {lang === 'th' ? 'ทุนของฉัน' : 'My Scholarships'}
        </h2>
        <div className="space-y-3">
          {myScholarships.map(s => {
            const apps = mockApplications.filter(a => a.scholarship_id === s.id)
            const awd = apps.filter(a => ['AWARDED', 'CONFIRMED', 'COMPLETED'].includes(a.status))
            return (
              <div key={s.id} className="card p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-ink-1 truncate">
                    {lang === 'th' ? s.title_th : s.title_en}
                  </div>
                  <div className="text-xs text-ink-3 mt-0.5">
                    {lang === 'th' ? 'เปิดรับถึง' : 'Deadline'}: {new Date(s.deadline).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US')}
                  </div>
                </div>
                <div className="flex gap-4 text-center flex-shrink-0">
                  <div><div className="text-sm font-bold text-brand">{apps.length}</div><div className="text-[10px] text-ink-3">{lang === 'th' ? 'สมัคร' : 'Applied'}</div></div>
                  <div><div className="text-sm font-bold text-status-success">{awd.length}</div><div className="text-[10px] text-ink-3">{lang === 'th' ? 'ได้รับทุน' : 'Awarded'}</div></div>
                </div>
              </div>
            )
          })}
          {myScholarships.length === 0 && (
            <div className="card p-8 text-center text-ink-3 text-sm">
              {lang === 'th' ? 'ยังไม่มีทุนการศึกษา' : 'No scholarships yet'}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {[
          { href: '/provider/scholarships', icon: BookOpen, th: 'พอร์ตโฟลิโอทุน', en: 'Scholarship Portfolio', sub_th: 'จัดการและติดตามทุนของคุณ', sub_en: 'Manage and track your scholarships' },
          { href: '/provider/candidates', icon: Users, th: 'ชุมชนผู้สมัคร', en: 'Candidate Pools', sub_th: 'ดูและเลือกผู้สมัครที่เข้าเงื่อนไข', sub_en: 'View and shortlist qualified candidates' },
          { href: '/provider/impact', icon: BarChart3, th: 'ผลกระทบของทุน', en: 'Scholarship Impact', sub_th: 'ผลกระทบรวมของทุนของคุณ', sub_en: 'View aggregate impact metrics' },
          { href: '/provider/insights', icon: TrendingUp, th: 'สถิติผู้สมัคร', en: 'Applicant Insights', sub_th: 'GPA รวม, ชั้นปี, แนวโน้ม', sub_en: 'Aggregate GPA, year, trends' },
          { href: '/provider/outcomes', icon: ChevronRight, th: 'ผลลัพธ์ทุน', en: 'Scholarship Outcomes', sub_th: 'อัตราสำเร็จการศึกษา, ผลระยะยาว', sub_en: 'Graduation rates, long-term impact' },
        ].map(({ href, icon: Icon, th, en, sub_th, sub_en }) => (
          <Link key={href} href={href} className="card p-4 flex items-center gap-3 hover:border-white/[0.2] transition-all">
            <div className="p-2 rounded-lg bg-brand/[0.08]"><Icon size={16} className="text-brand" /></div>
            <div className="flex-1"><div className="text-sm font-medium text-ink-1">{lang === 'th' ? th : en}</div><div className="text-xs text-ink-3">{lang === 'th' ? sub_th : sub_en}</div></div>
            <ChevronRight size={14} className="text-ink-3" />
          </Link>
        ))}
      </div>
    </AppShell>
  )
}
