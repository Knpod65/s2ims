'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { mockAuditLogs } from '@/data/mock/audit-logs'
import { Download, Lock } from 'lucide-react'

function exportAuditCSV() {
  const header = 'Time,Actor,Role,Action,Entity'
  const rows = mockAuditLogs.map(l =>
    `"${l.created_at}","${l.actor_name}","${l.actor_role}","${l.action}","${l.entity_type}"`
  )
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const ROLE_COLOR: Record<string, string> = {
  student: 'text-blue-700', staff: 'text-amber-700',
  esq: 'text-violet-700', provider: 'text-emerald-700', admin: 'text-slate-700',
}

export default function AuditLogPage() {
  const { lang } = useLang()
  return (
    <AppShell requiredRole="admin">
      <PageHeader
        title={lang==='th'?'ประวัติการใช้งาน (Audit Log)':'Audit Log'}
        subtitle={lang==='th'?'บันทึกที่ไม่สามารถแก้ไขหรือลบได้':'Immutable record — cannot be edited or deleted'}
        actions={<button onClick={exportAuditCSV} className="btn-secondary text-xs flex items-center gap-1.5 py-1.5"><Download size={13}/>{lang==='th'?'ส่งออก CSV':'Export CSV'}</button>}
      />
      <div className="flex items-center gap-2 mb-4 p-3 bg-status-danger/[0.05] border border-status-danger/20 rounded-lg">
        <Lock size={13} className="text-status-danger"/>
        <span className="text-xs text-status-danger">{lang==='th'?'บันทึกทั้งหมดเป็นแบบถาวร — ไม่สามารถแก้ไขหรือลบได้':'All records are permanent — no edit or delete allowed'}</span>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-200">
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'เวลา':'Time'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'ผู้ดำเนินการ':'Actor'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'บทบาท':'Role'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'การกระทำ':'Action'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'เอนทิตี':'Entity'}</th>
            </tr>
          </thead>
          <tbody>
            {mockAuditLogs.map((log, i) => (
              <tr key={log.id} className={`border-b border-line ${i%2===1?'bg-surface-low/60':''}`}>
                <td className="p-3 text-xs text-ink-3 font-mono whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString(lang==='th'?'th-TH':'en-US',{dateStyle:'short',timeStyle:'short'})}
                </td>
                <td className="p-3 text-xs text-ink-1 max-w-[140px]"><div className="truncate">{log.actor_name}</div></td>
                <td className="p-3">
                  <span className={`text-xs font-mono ${ROLE_COLOR[log.actor_role]||'text-ink-3'}`}>{log.actor_role}</span>
                </td>
                <td className="p-3"><span className="font-mono text-xs text-role-primary">{log.action}</span></td>
                <td className="p-3 text-xs text-ink-3">{log.entity_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
