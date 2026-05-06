'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { mockAnnouncements } from '@/data/mock/announcements'
import { PageHeader, StatCard, StatusBadge } from '@/components/ui/index'
import { ANN_STATUS_MAP } from '@/lib/utils'
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function ESQDashboard() {
  const { lang } = useLang()
  const pending = mockAnnouncements.filter(a => a.status === 'SUBMITTED')
  const approved = mockAnnouncements.filter(a => a.status === 'APPROVED')
  const urgent = pending.filter(a => a.sla_hours !== undefined && a.sla_hours < 24)

  return (
    <AppShell requiredRole="esq">
      <PageHeader
        title={lang==='th'?'แดชบอร์ดการอนุมัติ':'Approval Dashboard'}
        subtitle={lang==='th'?'ประกาศที่รออนุมัติก่อนเผยแพร่':'Announcements pending approval before publishing'}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <StatCard
          value={pending.length}
          label={lang==='th'?'รออนุมัติ':'Pending Approvals'}
          icon={<Clock size={16}/>}
          color="text-brand"
          delta={urgent.length > 0 ? `${urgent.length} ด่วน · ต่ำกว่า 24h` : undefined}
          deltaUp={false}
        />
        <StatCard
          value={5}
          label={lang==='th'?'อนุมัติสัปดาห์นี้':'Approved This Week'}
          icon={<CheckCircle2 size={16}/>}
          color="text-status-success"
          delta="+2 vs last week"
          deltaUp
        />
        <StatCard
          value="8h"
          label={lang==='th'?'เวลาเฉลี่ยอนุมัติ':'Avg. Turnaround'}
          color="text-status-track"
        />
      </div>

      {/* Urgent alert */}
      {urgent.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-status-danger/[0.07] border border-status-danger/25 rounded-xl mb-5">
          <AlertTriangle size={16} className="text-status-danger flex-shrink-0"/>
          <div className="text-sm text-status-danger font-medium">
            {urgent.length} {lang==='th'?'ประกาศมี SLA เหลือน้อยกว่า 24 ชั่วโมง':'announcement(s) have SLA under 24 hours remaining'}
          </div>
        </div>
      )}

      {/* Pending queue */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-ink-3 uppercase tracking-widest mb-3">
          {lang==='th'?'รออนุมัติ':'Pending Review'} ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-ink-3 text-sm">{lang==='th'?'ไม่มีประกาศที่รออนุมัติ':'No announcements pending approval'}</div>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(ann => {
              const isUrgent = ann.sla_hours !== undefined && ann.sla_hours < 24
              return (
                <div key={ann.id} className={`card p-5 ${isUrgent?'border-status-danger/30':''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-ink-1 mb-1 line-clamp-1">
                        {lang==='th'?ann.title_th:ann.title_en}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-ink-3 flex-wrap">
                        <span>ID: <span className="font-mono">{ann.id}</span></span>
                        <span>สร้าง: {ann.created_at.split('T')[0]}</span>
                        {ann.sla_hours !== undefined && (
                          <span className={`flex items-center gap-1 font-medium ${isUrgent?'text-status-danger':'text-brand'}`}>
                            <Clock size={10}/>
                            {ann.sla_hours}{lang==='th'?'ชม.':'h'} {lang==='th'?'ที่เหลือ':'remaining'}
                            {isUrgent && ' ⚠️'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        href={`/esq/announcements/${ann.id}/review`}
                        className="btn-primary text-xs py-1.5 px-4"
                      >
                        {lang==='th'?'ตรวจสอบ':'Review'} →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recently approved */}
      <div>
        <h2 className="text-xs font-semibold text-ink-3 uppercase tracking-widest mb-3">
          {lang==='th'?'อนุมัติล่าสุด':'Recently Approved'}
        </h2>
        <div className="space-y-2">
          {mockAnnouncements.filter(a=>a.status==='APPROVED').map(ann => (
            <div key={ann.id} className="card-sm p-3 flex items-center justify-between gap-3">
              <div className="text-xs text-ink-2 line-clamp-1 flex-1">{lang==='th'?ann.title_th:ann.title_en}</div>
              <StatusBadge label={lang==='th'?'อนุมัติแล้ว':'Approved'} color="bg-status-success/15 text-green-300 border-status-success/25"/>
            </div>
          ))}
          {mockAnnouncements.filter(a=>a.status==='APPROVED').length === 0 && (
            <div className="text-xs text-ink-3 py-3">{lang==='th'?'ยังไม่มีประกาศที่อนุมัติแล้ว':'No approved announcements yet'}</div>
          )}
        </div>
      </div>
    </AppShell>
  )
}