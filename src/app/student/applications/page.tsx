'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { mockApplications } from '@/data/mock/applications'
import { APP_STATUS_MAP } from '@/lib/utils'
import { StatusBadge, PageHeader } from '@/components/ui/index'
import ApplicationTimeline from '@/components/ApplicationTimeline'
import Link from 'next/link'

export default function StudentApplicationsPage() {
  const { lang } = useLang()
  const active = mockApplications.filter(a => !['COMPLETED','NOT_AWARDED'].includes(a.status))
  const done = mockApplications.filter(a => ['COMPLETED','NOT_AWARDED'].includes(a.status))
  return (
    <AppShell requiredRole="student">
      <PageHeader title={lang==='th'?'ใบสมัครของฉัน':'My Applications'} subtitle={`${mockApplications.length} ${lang==='th'?'รายการทั้งหมด':'total applications'}`}/>
      {active.length > 0 && <><h2 className="font-semibold text-sm text-ink-2 mb-3">{lang==='th'?'กำลังดำเนินการ':'Active'}</h2>
      <div className="space-y-3 mb-6">
        {active.map(app => {
          const si = APP_STATUS_MAP[app.status]
          const title = lang==='th' ? app.scholarship_title_th : app.scholarship_title_en
          const actionNeeded = ['NEEDS_DOCS','CONFIRMED','FOLLOW_UP_REQUIRED'].includes(app.status)
          return (
            <Link key={app.id} href={`/student/applications/${app.id}`} className={`card block p-4 hover:border-white/20 transition-all ${actionNeeded ? 'border-status-danger/30' : ''}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div><div className="text-xs text-ink-3 mb-0.5">{lang==='th'?'ทุน':'Scholarship'}</div><div className="font-semibold text-sm text-ink-1">{title}</div></div>
                <StatusBadge label={si[lang==='th'?'th':'en']} color={si.color}/>
              </div>
              {actionNeeded && <div className="text-xs text-status-danger mb-2">⚠️ {lang==='th'?'ต้องดำเนินการ':'Action required'}</div>}
              <ApplicationTimeline steps={app.steps.slice(-3)} compact/>
            </Link>
          )
        })}
      </div></>}
    </AppShell>
  )
}