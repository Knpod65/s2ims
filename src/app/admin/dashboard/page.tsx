'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader, StatCard } from '@/components/ui/index'
import { mockAuditLogs } from '@/data/mock/audit-logs'
import { Users, Activity, Database, Shield } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { lang } = useLang()
  return (
    <AppShell requiredRole="admin">
      <PageHeader title={lang==='th'?'แดชบอร์ดผู้ดูแลระบบ':'Admin Dashboard'} subtitle={lang==='th'?'ภาพรวมระบบและสุขภาพข้อมูล':'System overview and data health'}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard value="5" label={lang==='th'?'ผู้ใช้ทั้งหมด':'Total Users'} icon={<Users size={16}/>} color="text-status-info"/>
        <StatCard value="3" label={lang==='th'?'เซสชันที่ใช้งาน':'Active Sessions'} icon={<Activity size={16}/>} color="text-status-success"/>
        <StatCard value="99.8%" label={lang==='th'?'ความพร้อมใช้งาน':'Uptime'} icon={<Database size={16}/>} color="text-status-track"/>
        <StatCard value={mockAuditLogs.length} label={lang==='th'?'เหตุการณ์ล่าสุด':'Audit Events'} icon={<Shield size={16}/>} color="text-role-primary"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-sm text-ink-1">{lang==='th'?'ผู้ใช้งานตามบทบาท':'Users by Role'}</h3><Link href="/admin/users" className="text-xs text-role-primary">{lang==='th'?'จัดการ':'Manage'} →</Link></div>
          {[['นักศึกษา','Student','1'],['เจ้าหน้าที่','Staff','1'],['หัวหน้า ESQ','ESQ Head','1'],['ผู้ให้ทุน','Provider','1'],['ผู้ดูแลระบบ','Admin','1']].map(([th,en,count]) => (
            <div key={th} className="flex items-center justify-between py-2 border-b border-line last:border-0">
              <span className="text-sm text-ink-1">{lang==='th'?th:en}</span>
              <span className="font-mono text-xs text-ink-2">{count} {lang==='th'?'คน':'user'}</span>
            </div>
          ))}
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-sm text-ink-1">{lang==='th'?'เหตุการณ์ล่าสุด':'Recent Audit Events'}</h3><Link href="/admin/audit-log" className="text-xs text-role-primary">{lang==='th'?'ดูทั้งหมด':'View all'} →</Link></div>
          <div className="space-y-2">
            {mockAuditLogs.slice(0,5).map(log => (
              <div key={log.id} className="text-xs p-2 card-sm">
                <div className="flex items-center gap-2 flex-wrap"><span className="font-mono text-role-primary">{log.action}</span><span className="text-ink-3">·</span><span className="text-ink-3">{log.actor_name}</span></div>
                <div className="text-ink-3 mt-0.5 font-mono text-[10px]">{new Date(log.created_at).toLocaleString(lang==='th'?'th-TH':'en-US')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}