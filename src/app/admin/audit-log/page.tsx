'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { Button } from '@/components/shared/Button'
import { DisabledActionHint } from '@/components/shared/DisabledActionHint'
import { SafetyBanner } from '@/components/shared/SafetyBanner'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { mockAuditLogs } from '@/data/mock/audit-logs'
import { Download, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import AdminAuditEventDetailDrawer from '@/components/admin/AdminAuditEventDetailDrawer'
import AdminAuditComparisonDebugPanel from '@/components/admin/AdminAuditComparisonDebugPanel'
import { getAdminAuditDisplayRows } from '@/lib/audit/adminAuditDisplayAdapter'
import { DEFAULT_AUDIT_PERSISTENCE_CONFIG } from '@/lib/audit/storage/auditPersistenceConfig'
import type { AdminAuditDisplayRow } from '@/lib/audit/contracts/auditContracts'

type PersistenceMode = 'all' | 'mock_only' | 'real_persisted'

// Combined fixture + writer demo rows — computed once at module level.
// mockAuditLogs is static; DEMO_WRITER_EVENTS inside adapter are static.
// No runtime writes occur from this call.
// AP-9G source invariant retained for any future gated export projection: const rows = ALL_DISPLAY_ROWS.map
const ALL_DISPLAY_ROWS = getAdminAuditDisplayRows(mockAuditLogs)

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
      <SafetyBanner
        tone="blocked"
        title={t==='th'?'ขอบเขตหลักฐาน — Audit log แบบเดโมเท่านั้น':'Evidence Boundary — Mock audit log only'}
        description={t==='th'
          ? 'หน้านี้เป็นพื้นผิวต้นแบบแบบอ่านอย่างเดียว ไม่ใช่หลักฐานอย่างเป็นทางการ ไม่มีการเขียน audit event จากหน้านี้ และการส่งออกยังถูกบล็อกจนกว่า AP-10C จะได้รับอนุมัติ'
          : 'This is a read-only prototype surface, not official evidence. No audit events are written from this screen, and export remains blocked until AP-10C governance approval.'}
        apCodes={['AP-10C']}
        className="mb-4"
      />
      <PageHeader
        title={t==='th'?'Mock Audit Log':'Mock Audit Log'}
        subtitle={t==='th'?'พื้นผิวต้นแบบแบบอ่านอย่างเดียว — ไม่ใช่หลักฐานการตรวจสอบอย่างเป็นทางการ':'Read-only prototype surface — not official audit evidence'}
        actions={(
          <DisabledActionHint
            apCode="AP-10C"
            reason={t==='th'
              ? 'การส่งออกถูกบล็อกจนกว่า AP-10C จะได้รับอนุมัติด้านธรรมาภิบาล'
              : 'Export is blocked until AP-10C governance approval.'}
          >
            <Button
              variant="secondary"
              size="sm"
              disabled
              apCode="AP-10C"
              iconStart={<Download size={13}/>}
            >
              {t==='th'?'ส่งออก CSV':'Export CSV'}
            </Button>
          </DisabledActionHint>
        )}
      />
      <div className="flex items-start gap-2 mb-4 p-3 bg-bg-100 border border-line rounded-lg">
        <ShieldCheck size={14} className="text-ink-2 mt-0.5 shrink-0"/>
        <span className="text-xs text-ink-2 leading-relaxed">
          {t==='th'
            ? `Admin audit log แสดงบันทึกเดโม ${totalCount} รายการเพื่อช่วยตรวจสอบประสบการณ์การอ่านและการสแกนข้อมูลเท่านั้น ข้อมูลนี้ไม่ใช่ official evidence และไม่เชื่อมต่อ real persistence`
            : `Admin audit log is showing ${totalCount} mock/demo records for review and scanability only. These records are not official evidence and are not connected to real persistence.`}
        </span>
      </div>

      <AdminAuditComparisonDebugPanel
        role="admin"
        enabled={DEFAULT_AUDIT_PERSISTENCE_CONFIG.adminDebugPanelEnabled}
        featureEnabled={DEFAULT_AUDIT_PERSISTENCE_CONFIG.prototypeEnabled}
        readCompareEnabled={DEFAULT_AUDIT_PERSISTENCE_CONFIG.readFromPrototype}
        prototypeMetricsEnabled={DEFAULT_AUDIT_PERSISTENCE_CONFIG.prototypeMetricsEnabled}
        stagingReviewEnabled={DEFAULT_AUDIT_PERSISTENCE_CONFIG.adminComparisonStagingReviewEnabled}
      />

      <SectionHeader
        title={t==='th'?'บันทึกวินิจฉัยสำหรับการตรวจสอบต้นแบบ':'Diagnostic Records'}
        description={t==='th'
          ? 'ใช้เพื่อดูรูปแบบเหตุการณ์ ผู้ดำเนินการ แหล่งที่มา และสถานะ mock เท่านั้น โดยไม่สร้างหรือส่งออก audit trail จริง'
          : 'Use this table to scan event shape, actor, source, and mock status only. It does not create or export a real audit trail.'}
      />

      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-ink-2">{t==='th'?'การบันทึก':'Persistence'}:</label>
        <select
          value={persistenceFilter}
          onChange={(e) => setPersistenceFilter(e.target.value as PersistenceMode)}
          className="px-3 py-1.5 text-xs border border-line rounded-lg bg-bg-000 text-ink-1 focus:outline-none focus:ring-2 focus:ring-role-primary/30"
        >
          <option value="all">{t==='th'?'ทั้งหมด':'All'}</option>
          <option value="mock_only">{t==='th'?'เหตุการณ์เดโม':'Mock/demo only'}</option>
          <option value="real_persisted">{t==='th'?'Real persistence ยังไม่ได้เชื่อมต่อ':'Real persistence not connected'}</option>
        </select>
      </div>

      {filteredLogs.length === 0 && persistenceFilter === 'real_persisted' && (
        <div className="card p-6 text-center">
          <div className="text-sm text-ink-2 mb-2">{t==='th'?'ยังไม่มี real persisted audit records ในต้นแบบนี้':'No real persisted audit records are connected in this prototype'}</div>
          <div className="text-xs text-ink-3">{t==='th'?'หน้านี้ยังคงเป็น mock/read-only และไม่สร้างหลักฐานอย่างเป็นทางการ':'This page remains mock/read-only and does not create official evidence.'}</div>
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
                      status="info"
                    />
                    <StatusBadge
                      label={t==='th'
                        ? (row.source === 'writer' ? 'เดโม (สร้างขึ้น)' : 'เดโม (ฟิกซ์เจอร์)')
                        : (row.source === 'writer' ? 'Demo (generated)' : 'Demo (fixture)')}
                      status={row.source === 'writer' ? 'info' : 'neutral'}
                      size="sm"
                    />
                  </div>
                </td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLog(row)}
                  >
                    {t==='th'?'ดูรายละเอียด':'View details'}
                  </Button>
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
