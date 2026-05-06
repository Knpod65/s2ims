'use client'
import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { mockApplications } from '@/data/mock/applications'
import { mockDocumentStates } from '@/data/mock/staffData'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { APP_STATUS_MAP } from '@/lib/utils'
import Link from 'next/link'
import { Search, Filter, FileCheck, FileX, Clock } from 'lucide-react'

export default function StaffApplicationsPage() {
  const { lang } = useLang()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const getDocumentStatus = (appId: string) => {
    const docs = mockDocumentStates[appId] || []
    if (docs.length === 0) return null
    const pending = docs.filter((d) => d.status === 'pending').length
    const rejected = docs.filter((d) => d.status === 'rejected').length
    const verified = docs.filter((d) => d.status === 'verified').length
    return { pending, rejected, verified, total: docs.length }
  }

  const filtered = mockApplications.filter(a => {
    const title = lang==='th' ? a.scholarship_title_th : a.scholarship_title_en
    const matchSearch = title.toLowerCase().includes(search.toLowerCase()) || a.student_id.includes(search)
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <AppShell requiredRole="staff">
      <PageHeader
        title={lang==='th'?'จัดการใบสมัคร':'Application Manager'}
        subtitle={`${filtered.length} ${lang==='th'?'รายการ':'applications'}`}
      />

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"/>
          <input
            className="input-base pl-9"
            placeholder={lang==='th'?'ค้นหาชื่อทุน หรือ รหัสนักศึกษา...':'Search by scholarship or student ID...'}
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
        </div>
        <select className="input-base w-auto" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="all">{lang==='th'?'ทุกสถานะ':'All Status'}</option>
          <option value="SUBMITTED">{lang==='th'?'ส่งแล้ว':'Submitted'}</option>
          <option value="UNDER_REVIEW">{lang==='th'?'กำลังพิจารณา':'Under Review'}</option>
          <option value="NEEDS_DOCS">{lang==='th'?'ต้องการเอกสาร':'Needs Docs'}</option>
          <option value="SHORTLISTED">{lang==='th'?'ผ่านคัดเลือก':'Shortlisted'}</option>
          <option value="AWARDED">{lang==='th'?'ได้รับทุน':'Awarded'}</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-bg-200">
              <th className="text-left p-3 text-xs text-ink-3 font-semibold uppercase tracking-wider">{lang==='th'?'ทุน':'Scholarship'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold uppercase tracking-wider">{lang==='th'?'นักศึกษา':'Student'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold uppercase tracking-wider">{lang==='th'?'สถานะ':'Status'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold uppercase tracking-wider">{lang==='th'?'เอกสาร':'Documents'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold uppercase tracking-wider">{lang==='th'?'คะแนน':'Score'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold uppercase tracking-wider">{lang==='th'?'อัปเดต':'Updated'}</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-ink-3 text-sm">{lang==='th'?'ไม่พบรายการ':'No applications found'}</td></tr>
            )}
            {filtered.map((app, i) => {
              const si = APP_STATUS_MAP[app.status]
              const title = lang==='th' ? app.scholarship_title_th : app.scholarship_title_en
              const actionNeeded = ['NEEDS_DOCS','FOLLOW_UP_REQUIRED','REPORT_OVERDUE'].includes(app.status)
              const docStatus = getDocumentStatus(app.id)
              return (
                <tr key={app.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-all ${i%2===1?'bg-white/[0.01]':''} ${actionNeeded?'border-l-2 border-l-status-danger':''}`}>
                  <td className="p-3">
                    <div className="text-xs font-medium text-ink-1 line-clamp-1 max-w-[180px]">{title}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-mono text-xs text-ink-3">{app.student_id}</div>
                  </td>
                  <td className="p-3">
                    <StatusBadge label={si[lang==='th'?'th':'en']} color={si.color}/>
                  </td>
                  <td className="p-3">
                    {docStatus ? (
                      <div className="flex items-center gap-1">
                        {docStatus.rejected > 0 && (
                          <div className="flex items-center gap-0.5 text-xs bg-status-danger/10 text-status-danger px-2 py-1 rounded">
                            <FileX size={12} />
                            {docStatus.rejected}
                          </div>
                        )}
                        {docStatus.pending > 0 && (
                          <div className="flex items-center gap-0.5 text-xs bg-brand/10 text-brand px-2 py-1 rounded">
                            <Clock size={12} />
                            {docStatus.pending}
                          </div>
                        )}
                        {docStatus.rejected === 0 && docStatus.pending === 0 && (
                          <div className="flex items-center gap-0.5 text-xs bg-status-success/10 text-status-success px-2 py-1 rounded">
                            <FileCheck size={12} />
                            {docStatus.verified}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-ink-3">−</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-xs font-bold text-brand">{app.match_score}%</span>
                  </td>
                  <td className="p-3 text-xs text-ink-3 font-mono whitespace-nowrap">
                    {app.updated_at.split('T')[0]}
                  </td>
                  <td className="p-3">
                    <Link href={`/staff/applications/${app.id}`} className="text-xs text-brand hover:text-brand-light transition-colors">
                      {lang==='th'?'ดู':'View'} →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}