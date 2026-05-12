'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { mockAuditLogs } from '@/data/mock/audit-logs'
import { Download, AlertCircle } from 'lucide-react'
import { useState } from 'react'

type PersistenceMode = 'all' | 'mock_only' | 'real_persisted'

function exportAuditCSV() {
  const header = 'Time,Actor,Role,Action,Entity,Status'
  const warningRow = '# Export contains demo/mock audit data — not official persistence'
  const rows = mockAuditLogs.map(l =>
    `"${l.created_at}","${l.actor_name}","${l.actor_role}","${l.action}","${l.entity_type}","Mock event"`
  )
  const blob = new Blob([[warningRow, header, ...rows].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit-log-demo-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const ROLE_COLOR: Record<string, string> = {
  student: 'text-blue-700', staff: 'text-amber-700',
  esq: 'text-violet-700', provider: 'text-emerald-700', admin: 'text-slate-700',
}

export default function AuditLogPage() {
  const { lang } = useLang()
  const [persistenceFilter, setPersistenceFilter] = useState<PersistenceMode>('all')

  // All current records are treated as mock_only since fixture doesn't have persistenceMode field
  const filteredLogs = persistenceFilter === 'all' 
    ? mockAuditLogs
    : persistenceFilter === 'mock_only'
    ? mockAuditLogs
    : [] // real_persisted shows empty state

  return (
    <AppShell requiredRole="admin">
      <PageHeader
        title={lang==='th'?'ประวัติการใช้งาน (Audit Log)':'Audit Log'}
        subtitle={lang==='th'?'เหตุการณ์การตรวจสอบแบบเดโม — ไม่ใช่การบันทึกอย่างเป็นทางการ':'Demo audit events — not official persistence'}
        actions={<button onClick={exportAuditCSV} className="btn-secondary text-xs flex items-center gap-1.5 py-1.5"><Download size={13}/>{lang==='th'?'ส่งออก CSV':'Export CSV'}</button>}
      />
      <div className="flex items-center gap-2 mb-4 p-3 bg-purple-500/[0.05] border border-purple-500/20 rounded-lg">
        <AlertCircle size={13} className="text-purple-600"/>
        <span className="text-xs text-purple-600">{lang==='th'?'นี่คือเหตุการณ์การตรวจสอบแบบเดโมสำหรับการตรวจทานโปรโตไทป์ ไม่ใช่บันทึกการตรวจสอบอย่างเป็นทางการ':'This audit view shows demo/mock records for prototype review. These records are not official persisted audit evidence.'}</span>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-ink-2">{lang==='th'?'การบันทึก':'Persistence'}:</label>
        <select 
          value={persistenceFilter}
          onChange={(e) => setPersistenceFilter(e.target.value as PersistenceMode)}
          className="px-3 py-1.5 text-xs border border-line rounded-lg bg-bg-000 text-ink-1 focus:outline-none focus:ring-2 focus:ring-role-primary/30"
        >
          <option value="all">{lang==='th'?'ทั้งหมด':'All'}</option>
          <option value="mock_only">{lang==='th'?'เหตุการณ์เดโม':'Mock/demo only'}</option>
          <option value="real_persisted">{lang==='th'?'บันทึกการตรวจสอบอย่างเป็นทางการ':'Official persisted records'}</option>
        </select>
      </div>

      {filteredLogs.length === 0 && persistenceFilter === 'real_persisted' && (
        <div className="card p-6 text-center">
          <div className="text-sm text-ink-2 mb-2">{lang==='th'?'ไม่มีบันทึกการตรวจสอบอย่างเป็นทางการ':'No official persisted audit records available'}</div>
          <div className="text-xs text-ink-3">{lang==='th'?'การบันทึกอย่างเป็นทางการยังไม่ได้เชื่อมต่อ':'Real audit persistence has not been connected yet.'}</div>
        </div>
      )}

      {filteredLogs.length > 0 && (
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-200">
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'เวลา':'Time'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'ผู้ดำเนินการ':'Actor'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'บทบาท':'Role'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'การกระทำ':'Action'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'เอนทิตี':'Entity'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'สถานะ':'Status'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, i) => (
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
                <td className="p-3">
                  <StatusBadge 
                    label={lang==='th'?'เหตุการณ์เดโม':'Mock event'}
                    color="bg-purple-500/10 text-purple-600 border-purple-500/20"
                    dot
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </AppShell>
  )
}
