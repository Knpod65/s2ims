'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { mockAuditLogs } from '@/data/mock/audit-logs'
import { Download, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import AdminAuditEventDetailDrawer from '@/components/admin/AdminAuditEventDetailDrawer'
import { getAdminAuditDisplayRows } from '@/lib/audit/adminAuditDisplayAdapter'
import type { AdminAuditDisplayRow } from '@/lib/audit/contracts/auditContracts'

type PersistenceMode = 'all' | 'mock_only' | 'real_persisted'

// Combined fixture + writer demo rows — computed once at module level.
// mockAuditLogs is static; DEMO_WRITER_EVENTS inside adapter are static.
// No runtime writes occur from this call.
const ALL_DISPLAY_ROWS = getAdminAuditDisplayRows(mockAuditLogs)

function exportAuditCSV() {
  const header = 'Time,Actor,Role,Action,Entity,Source,Status'
  const warningRow = '# Export contains demo/mock audit data — not official persistence'
  const rows = ALL_DISPLAY_ROWS.map(r =>
    `"${r.formattedTime ?? r.createdAt}","${r.actorLabel}","${r.actorRoleLabel}","${r.actionLabel}","${r.targetLabel}","${r.sourceLabel}","${r.persistenceLabel}"`
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
  const [selectedLog, setSelectedLog] = useState<AdminAuditDisplayRow | null>(null)

  // All combined rows are mock_only; real_persisted shows empty state
  const filteredLogs = persistenceFilter === 'real_persisted' ? [] : ALL_DISPLAY_ROWS

  const totalCount = ALL_DISPLAY_ROWS.length
  const t = lang === 'th' ? 'th' : 'en'

  return (
    <AppShell requiredRole="admin">
      <PageHeader
        title={t==='th'?'ประวัติการใช้งาน (Audit Log)':'Audit Log'}
        subtitle={t==='th'?'เหตุการณ์การตรวจสอบแบบเดโม — ไม่ใช่การบันทึกอย่างเป็นทางการ':'Demo audit events — not official persistence'}
        actions={<button onClick={exportAuditCSV} className="btn-secondary text-xs flex items-center gap-1.5 py-1.5"><Download size={13}/>{t==='th'?'ส่งออก CSV':'Export CSV'}</button>}
      />
      <div className="flex items-center gap-2 mb-4 p-3 bg-purple-500/[0.05] border border-purple-500/20 rounded-lg">
        <AlertCircle size={13} className="text-purple-600"/>
        <span className="text-xs text-purple-600">
          {t==='th'
            ? `การตรวจสอบ Audit ของ Admin แสดงบันทึกเดโม ${totalCount} รายการเท่านั้น บันทึกเหล่านี้ช่วยตรวจสอบประสบการณ์ Audit และไม่ใช่หลักฐานการตรวจสอบอย่างเป็นทางการ`
            : `Admin audit review is currently showing ${totalCount} mock/demo records only. These records help validate the audit experience and are not official persisted audit evidence.`}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-ink-2">{t==='th'?'การบันทึก':'Persistence'}:</label>
        <select
          value={persistenceFilter}
          onChange={(e) => setPersistenceFilter(e.target.value as PersistenceMode)}
          className="px-3 py-1.5 text-xs border border-line rounded-lg bg-bg-000 text-ink-1 focus:outline-none focus:ring-2 focus:ring-role-primary/30"
        >
          <option value="all">{t==='th'?'ทั้งหมด':'All'}</option>
          <option value="mock_only">{t==='th'?'เหตุการณ์เดโม':'Mock/demo only'}</option>
          <option value="real_persisted">{t==='th'?'บันทึกการตรวจสอบอย่างเป็นทางการ':'Official persisted records'}</option>
        </select>
      </div>

      {filteredLogs.length === 0 && persistenceFilter === 'real_persisted' && (
        <div className="card p-6 text-center">
          <div className="text-sm text-ink-2 mb-2">{t==='th'?'ไม่มีบันทึกการตรวจสอบอย่างเป็นทางการ':'No official persisted audit records available'}</div>
          <div className="text-xs text-ink-3">{t==='th'?'การบันทึกอย่างเป็นทางการยังไม่ได้เชื่อมต่อ':'Real audit persistence has not been connected yet.'}</div>
        </div>
      )}

      {filteredLogs.length > 0 && (
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-200">
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{t==='th'?'เวลา':'Time'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{t==='th'?'ผู้ดำเนินการ':'Actor'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{t==='th'?'บทบาท':'Role'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{t==='th'?'การกระทำ':'Action'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{t==='th'?'เอนทิตี':'Entity'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{t==='th'?'สถานะ':'Status'}</th>
              <th className="p-3 text-xs text-ink-3 font-semibold">{t==='th'?'รายละเอียด':'Details'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((row, i) => (
              <tr key={row.id} className={`border-b border-line ${i%2===1?'bg-surface-low/60':''}`}>
                <td className="p-3 text-xs text-ink-3 font-mono whitespace-nowrap">
                  {row.formattedTime ?? row.createdAt}
                </td>
                <td className="p-3 text-xs text-ink-1 max-w-[140px]"><div className="truncate">{row.actorLabel}</div></td>
                <td className="p-3">
                  <span className={`text-xs font-mono ${ROLE_COLOR[row.actorRole]||'text-ink-3'}`}>{row.actorRoleLabel}</span>
                </td>
                <td className="p-3"><span className="font-mono text-xs text-role-primary">{row.actionLabel}</span></td>
                <td className="p-3 text-xs text-ink-3">{row.targetLabel}</td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <StatusBadge
                      label={t==='th'?'เหตุการณ์เดโม':'Mock event'}
                      color="bg-purple-500/10 text-purple-600 border-purple-500/20"
                      dot
                    />
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border w-fit ${
                      row.source === 'writer'
                        ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
                        : 'text-slate-600 bg-slate-100 border-slate-200'
                    }`}>
                      {t==='th'
                        ? (row.source === 'writer' ? 'เดโม (สร้างขึ้น)' : 'เดโม (ฟิกซ์เจอร์)')
                        : (row.source === 'writer' ? 'Demo (generated)' : 'Demo (fixture)')}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedLog(row)}
                    className="text-[11px] px-2 py-1 rounded border border-line text-ink-2 hover:bg-surface-low hover:text-ink-1 transition-colors whitespace-nowrap"
                  >
                    {t==='th'?'ดูรายละเอียด':'View details'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {selectedLog && (
        <AdminAuditEventDetailDrawer
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </AppShell>
  )
}
