'use client'
import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { mockApplications } from '@/data/mock/applications'
import { mockDocumentStates } from '@/data/mock/staffData'
import {
  filterStaffApplications,
  getDocumentStatusSummary,
  getStaffQueueStats,
  isActionNeeded,
} from '@/lib/queries'
import { EmptyState, PageHeader, StatusBadge } from '@/components/ui/index'
import { SafetyBanner } from '@/components/shared/SafetyBanner'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { APP_STATUS_MAP } from '@/lib/utils'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, ClipboardList, Clock, FileCheck, FileX, Search } from 'lucide-react'

export default function StaffApplicationsPage() {
  const { lang } = useLang()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = filterStaffApplications(mockApplications, search, statusFilter, lang)

  const queueStats = getStaffQueueStats(filtered, mockDocumentStates)

  const summaryCards = [
    {
      label: lang === 'th' ? 'รายการที่แสดง' : 'Visible items',
      value: queueStats.total,
      icon: ClipboardList,
      note: lang === 'th' ? 'หลังใช้ตัวกรอง' : 'after filters',
    },
    {
      label: lang === 'th' ? 'ต้องดูแลก่อน' : 'Needs attention',
      value: queueStats.needsAttention,
      icon: AlertTriangle,
      note: lang === 'th' ? 'สถานะที่ควรติดตาม' : 'follow-up statuses',
    },
    {
      label: lang === 'th' ? 'ประเด็นเอกสาร' : 'Document issues',
      value: queueStats.documentIssues,
      icon: FileX,
      note: lang === 'th' ? 'รอหรือควรเปลี่ยน' : 'pending or rejected',
    },
    {
      label: lang === 'th' ? 'เอกสารพร้อม' : 'Documents clear',
      value: queueStats.allClear,
      icon: CheckCircle2,
      note: lang === 'th' ? 'ไม่มี pending/rejected' : 'no pending/rejected',
    },
  ]

  return (
    <AppShell requiredRole="staff">
      <PageHeader
        title={lang==='th'?'คิวงานใบสมัครเจ้าหน้าที่':'Staff Work Queue'}
        subtitle={lang==='th'
          ? `แสดง ${filtered.length} รายการจากข้อมูลต้นแบบ เพื่อเตรียมการตรวจเอกสารและติดตามสถานะ`
          : `${filtered.length} applications shown from prototype data for document review preparation and status follow-up`}
        roleIndicator
      />

      <SafetyBanner
        tone="info"
        title={lang==='th'?'Mock work queue — decision-support only':'Mock work queue — decision-support only'}
        description={lang==='th'
          ? 'คิวนี้ใช้ข้อมูลต้นแบบเพื่อช่วยจัดลำดับการตรวจเอกสารเท่านั้น ไม่มีการบันทึก approval จากหน้านี้ และไม่มีการเขียน audit event หรือ persistence'
          : 'This queue uses prototype data to help staff prepare document review only. No approval is recorded from this screen, and no audit event or persistence is written.'}
        apCodes={['AP-11']}
        className="mb-5"
      />

      <div className="grid gap-3 mb-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-2xl font-bold leading-none text-ink-1">{item.value}</div>
                  <div className="mt-1 text-xs font-semibold text-ink-2">{item.label}</div>
                  <div className="mt-0.5 text-xs text-ink-3">{item.note}</div>
                </div>
                <div className="rounded-lg bg-role-tint p-2 text-role-primary">
                  <Icon size={16} aria-hidden="true" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <SectionHeader
        title={lang==='th'?'ตัวกรองคิวงาน':'Queue Filters'}
        description={lang==='th'
          ? 'ค้นหาด้วยชื่อทุนหรือรหัสนักศึกษาเดิม โดยไม่เปลี่ยนข้อมูลต้นแบบ'
          : 'Search by scholarship or existing student identifier without changing prototype data.'}
      />

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

      <SectionHeader
        title={lang==='th'?'รายการใบสมัคร':'Application Queue'}
        description={lang==='th'
          ? 'เอกสารและสถานะแสดงเพื่อเตรียมการตรวจเท่านั้น ไม่ใช่การอนุมัติหรือการตัดสินใจอย่างเป็นทางการ'
          : 'Documents and statuses are shown for review preparation only, not approval or official decision-making.'}
      />

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-200">
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
              <tr>
                <td colSpan={7}>
                  <EmptyState
                    icon={<Search size={36} />}
                    title={lang==='th'?'ไม่พบรายการที่ตรงกับตัวกรอง':'No applications match these filters'}
                    description={lang==='th'
                      ? 'ลองปรับคำค้นหาหรือสถานะ ตัวกรองนี้ไม่เปลี่ยนข้อมูลและไม่สร้างการตัดสินใจ'
                      : 'Try adjusting the search or status filter. Filtering does not change data or create a decision.'}
                  />
                </td>
              </tr>
            )}
            {filtered.map((app, i) => {
              const si = APP_STATUS_MAP[app.status]
              const title = lang==='th' ? app.scholarship_title_th : app.scholarship_title_en
              const actionNeeded = isActionNeeded(app.status)
              const docStatus = getDocumentStatusSummary(app.id, mockDocumentStates)
              return (
                <tr key={app.id} className={`border-b border-line hover:bg-surface-low transition-all ${i%2===1?'bg-surface-low/60':''} ${actionNeeded?'border-l-2 border-l-status-danger':''}`}>
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
                      <div className="flex flex-wrap items-center gap-1.5">
                        {docStatus.rejected > 0 && (
                          <div className="flex items-center gap-1 text-xs bg-status-danger/10 text-status-danger px-2 py-1 rounded">
                            <FileX size={12} />
                            <span>{docStatus.rejected} {lang==='th'?'ควรเปลี่ยน':'rejected'}</span>
                          </div>
                        )}
                        {docStatus.pending > 0 && (
                          <div className="flex items-center gap-1 text-xs bg-role-tint text-role-primary px-2 py-1 rounded">
                            <Clock size={12} />
                            <span>{docStatus.pending} {lang==='th'?'รอตรวจ':'pending'}</span>
                          </div>
                        )}
                        {docStatus.rejected === 0 && docStatus.pending === 0 && (
                          <div className="flex items-center gap-1 text-xs bg-status-success/10 text-status-success px-2 py-1 rounded">
                            <FileCheck size={12} />
                            <span>{docStatus.verified}/{docStatus.total} {lang==='th'?'พร้อม':'verified'}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-ink-3">−</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-xs font-bold text-role-primary">{app.match_score}%</span>
                  </td>
                  <td className="p-3 text-xs text-ink-3 font-mono whitespace-nowrap">
                    {app.updated_at.split('T')[0]}
                  </td>
                  <td className="p-3">
                    <Link href={`/staff/applications/${app.id}`} className="text-xs text-role-primary hover:text-role-primary transition-colors">
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
