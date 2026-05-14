'use client'

import { X, AlertCircle, User, Target, Activity, Shield, Database, MessageSquare } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { AdminAuditDisplayRow } from '@/lib/audit/contracts/auditContracts'
import { FORBIDDEN_AUDIT_METADATA_KEYS } from '@/lib/audit/auditMetadataRules'

interface Props {
  log: AdminAuditDisplayRow
  onClose: () => void
}

const FORBIDDEN_SET = new Set<string>(FORBIDDEN_AUDIT_METADATA_KEYS)

function renderMetadataValue(key: string, value: unknown): string {
  if (FORBIDDEN_SET.has(key)) return '[Hidden by privacy rule]'
  if (value === null || value === undefined) return '[Value not available]'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const t = (en: string, th: string) => en // placeholder — actual locale resolved in component

const ROLE_COLOR: Record<string, string> = {
  student: 'text-blue-700 bg-blue-50',
  staff: 'text-amber-700 bg-amber-50',
  esq: 'text-violet-700 bg-violet-50',
  provider: 'text-emerald-700 bg-emerald-50',
  admin: 'text-slate-700 bg-slate-100',
}

const SEVERITY_COLOR: Record<string, string> = {
  info: 'text-ink-3 bg-surface-low',
  low: 'text-status-success bg-status-success/10',
  medium: 'text-status-warning bg-status-warning/10',
  high: 'text-status-danger bg-status-danger/10',
  critical: 'text-status-danger bg-status-danger/20 font-semibold',
}

const SOURCE_LABEL: Record<'fixture' | 'writer', Record<'en' | 'th', { badge: string; banner: string }>> = {
  fixture: {
    en: { badge: 'Demo (fixture)', banner: 'This record is shown for mock/demo review. Real audit persistence is not connected yet.' },
    th: { badge: 'เดโม (ฟิกซ์เจอร์)', banner: 'บันทึกนี้แสดงเพื่อการตรวจสอบเดโมเท่านั้น การบันทึก Audit จริงยังไม่ได้เชื่อมต่อ' },
  },
  writer: {
    en: { badge: 'Demo (generated)', banner: 'Generated from the mock audit writer for display review only.' },
    th: { badge: 'เดโม (สร้างขึ้น)', banner: 'สร้างโดย mock audit writer สำหรับการตรวจสอบการแสดงผลเท่านั้น' },
  },
}

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-line">
      <Icon size={12} className="text-ink-3 shrink-0" />
      <span className="text-[11px] font-semibold text-ink-2 uppercase tracking-wide">{label}</span>
    </div>
  )
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-ink-3">{label}</span>
      <span className={`text-xs text-ink-1 break-all ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

export default function AdminAuditEventDetailDrawer({ log, onClose }: Props) {
  const { lang } = useLang()
  const isTh = lang === 'th'
  const tl = (en: string, th: string) => isTh ? th : en

  const sourceLang = SOURCE_LABEL[log.source]?.[isTh ? 'th' : 'en'] ?? SOURCE_LABEL.fixture[isTh ? 'th' : 'en']

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col overflow-hidden">
        {/* Drawer header */}
        <div className="flex items-start justify-between gap-3 p-4 border-b border-line bg-surface-low/60 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="text-sm font-semibold text-ink-1">
                {tl('Audit Event Detail', 'รายละเอียดเหตุการณ์ Audit')}
              </div>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                log.source === 'writer'
                  ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
                  : 'text-slate-600 bg-slate-100 border-slate-200'
              }`}>
                {sourceLang.badge}
              </span>
            </div>
            <div className="text-[10px] text-purple-600 mt-0.5 font-mono">{log.id}</div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1 rounded hover:bg-surface-low text-ink-3 hover:text-ink-1 transition-colors"
            aria-label={tl('Close', 'ปิด')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Mock/demo notice banner */}
        <div className="flex items-start gap-2 mx-4 mt-3 p-2.5 bg-purple-500/[0.06] border border-purple-500/20 rounded-lg shrink-0">
          <AlertCircle size={12} className="text-purple-600 mt-0.5 shrink-0" />
          <div>
            <div className="text-[10px] font-semibold text-purple-700">
              {tl('Mock/demo event — Not official audit evidence', 'เหตุการณ์เดโม — ไม่ใช่หลักฐาน Audit อย่างเป็นทางการ')}
            </div>
            <div className="text-[10px] text-purple-600 mt-0.5">
              {sourceLang.banner}
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">

          {/* Event Identity */}
          <section>
            <SectionHeader icon={Activity} label={tl('Event Identity', 'ข้อมูลเหตุการณ์')} />
            <div className="space-y-2.5">
              <Field label={tl('Event ID', 'รหัสเหตุการณ์')} value={log.id} mono />
              <Field label={tl('Timestamp', 'เวลา')} value={log.formattedTime} />
              <Field
                label={tl('Event / Action', 'ประเภทเหตุการณ์')}
                value={log.eventType ?? log.actionLabel}
                mono
              />
              {log.policyVersion && (
                <Field
                  label={tl('Policy Version', 'เวอร์ชันนโยบาย')}
                  value={log.policyVersion}
                />
              )}
              {log.severityLabel && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-ink-3">{tl('Severity', 'ระดับความรุนแรง')}</span>
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded w-fit ${SEVERITY_COLOR[log.severityLabel as keyof typeof SEVERITY_COLOR] ?? 'text-ink-3 bg-surface-low'}`}>
                    {log.severityLabel}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Actor */}
          <section>
            <SectionHeader icon={User} label={tl('Actor', 'ผู้ดำเนินการ')} />
            <div className="space-y-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-ink-3">{tl('Role', 'บทบาท')}</span>
                <span className={`text-xs font-mono font-medium px-1.5 py-0.5 rounded w-fit ${ROLE_COLOR[log.actorRole as keyof typeof ROLE_COLOR] ?? 'text-ink-3 bg-surface-low'}`}>
                  {log.actorRoleLabel}
                </span>
              </div>
              <Field
                label={tl('Actor Name', 'ชื่อผู้ดำเนินการ')}
                value={log.actorLabel || '[Actor not available]'}
              />
              <Field
                label={tl('Actor ID', 'รหัสผู้ดำเนินการ')}
                value={log.actorId}
                mono
              />
            </div>
          </section>

          {/* Target / Entity */}
          <section>
            <SectionHeader icon={Target} label={tl('Target / Entity', 'เป้าหมาย / เอนทิตี')} />
            <div className="space-y-2.5">
              <Field label={tl('Entity Type', 'ประเภทเอนทิตี')} value={log.targetType || '[Entity type not available]'} />
              {log.targetDisplayToken ? (
                <Field label={tl('Target Display Token', 'โทเคนเป้าหมาย')} value={log.targetDisplayToken} mono />
              ) : (
                <Field label={tl('Entity ID', 'รหัสเอนทิตี')} value={log.targetId || '[Entity ID not available]'} mono />
              )}
              {log.targetPrivacyLevel && (
                <Field label={tl('Privacy Level', 'ระดับความเป็นส่วนตัว')} value={log.targetPrivacyLevel} mono />
              )}
              {!log.targetDisplayToken && (
                <div className="p-2 rounded bg-surface-low/60 border border-line">
                  <div className="text-[10px] text-ink-3">
                    {tl('IDs shown are from the mock fixture and are not privacy-masked tokens.', 'รหัสที่แสดงมาจากข้อมูลเดโม ไม่ใช่ token ที่ผ่านการปกปิดตัวตน')}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Action / Reason */}
          <section>
            <SectionHeader icon={MessageSquare} label={tl('Action / Reason', 'การกระทำ / เหตุผล')} />
            <div className="space-y-2.5">
              <Field label={tl('Action', 'การกระทำ')} value={log.eventType ?? log.actionLabel} mono />
              {log.sourceRoute && (
                <Field label={tl('Source Route', 'เส้นทางต้นทาง')} value={log.sourceRoute} mono />
              )}
              {log.reason ? (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-ink-3">{tl('Reason', 'เหตุผล')}</span>
                  <span className="text-xs text-ink-1 p-2 rounded bg-surface-low/60 border border-line leading-relaxed">
                    {log.reason}
                  </span>
                </div>
              ) : (
                <Field
                  label={tl('Reason', 'เหตุผล')}
                  value={tl('Reason not provided', 'ไม่ได้ระบุเหตุผล')}
                />
              )}
              {log.reasonRequired !== undefined && (
                <Field
                  label={tl('Reason Required', 'ต้องการเหตุผล')}
                  value={log.reasonRequired ? 'Yes' : 'No'}
                />
              )}
            </div>
          </section>

          {/* Persistence / Evidence */}
          <section>
            <SectionHeader icon={Shield} label={tl('Persistence / Evidence', 'สถานะการบันทึก / หลักฐาน')} />
            <div className="space-y-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-ink-3">{tl('Persistence Mode', 'โหมดการบันทึก')}</span>
                <span className="text-xs font-mono font-medium text-purple-700 bg-purple-500/10 px-1.5 py-0.5 rounded w-fit">
                  {log.copyStage}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-500/[0.05] border border-purple-500/15">
                <div className="text-xs text-purple-700 font-medium">
                  {tl('This is a mock/demo event. Not official audit evidence.', 'เหตุการณ์นี้เป็นส่วนหนึ่งของชุดข้อมูลเดโม/จำลอง ไม่ใช่หลักฐาน Audit อย่างเป็นทางการ')}
                </div>
                <div className="text-[10px] text-purple-600 mt-1">
                  {tl('Generated from the mock audit writer — for demonstration purposes only.', 'สร้างโดย mock audit writer — สำหรับการสาธิตเท่านั้น')}
                </div>
              </div>
            </div>
          </section>

          {log.source === 'writer' && log.metadata && Object.keys(log.metadata).length > 0 && (
            <section>
              <SectionHeader icon={Database} label={tl('Metadata', 'ข้อมูลเพิ่มเติม')} />
              <div className="space-y-1">
                {Object.entries(log.metadata).map(([key, val]) => (
                  <div key={key} className="flex items-start justify-between gap-2 p-1.5 rounded bg-surface-low/60 border border-line">
                    <span className="text-[10px] font-mono text-ink-2 shrink-0">{key}</span>
                    <span className="text-[10px] text-ink-1 text-right break-all">
                      {renderMetadataValue(key, val)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {log.source === 'fixture' && (log.before || log.after) && (
            <section>
              <SectionHeader icon={Database} label={tl('Metadata', 'ข้อมูลเพิ่มเติม')} />
              {log.before && Object.keys(log.before).length > 0 && (
                <div className="mb-2">
                  <div className="text-[10px] text-ink-3 mb-1">{tl('Before', 'ก่อน')}</div>
                  <div className="space-y-1">
                    {Object.entries(log.before).map(([key, val]) => (
                      <div key={`before-${key}`} className="flex items-start justify-between gap-2 p-1.5 rounded bg-surface-low/60 border border-line">
                        <span className="text-[10px] font-mono text-ink-2 shrink-0">{key}</span>
                        <span className="text-[10px] text-ink-1 text-right break-all">
                          {renderMetadataValue(key, val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {log.after && Object.keys(log.after).length > 0 && (
                <div>
                  <div className="text-[10px] text-ink-3 mb-1">{tl('After', 'หลัง')}</div>
                  <div className="space-y-1">
                    {Object.entries(log.after).map(([key, val]) => (
                      <div key={`after-${key}`} className="flex items-start justify-between gap-2 p-1.5 rounded bg-surface-low/60 border border-line">
                        <span className="text-[10px] font-mono text-ink-2 shrink-0">{key}</span>
                        <span className="text-[10px] text-ink-1 text-right break-all">
                          {renderMetadataValue(key, val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {log.source === 'fixture' && !log.before && !log.after && (
            <section>
              <SectionHeader icon={Database} label={tl('Metadata', 'ข้อมูลเพิ่มเติม')} />
              <div className="text-[11px] text-ink-3 italic">
                {tl('No additional metadata', 'ไม่มีข้อมูลเมตาเพิ่มเติม')}
              </div>
            </section>
          )}

          {log.ip && (
            <section>
              <SectionHeader icon={Shield} label={tl('Session Context (Mock)', 'บริบทเซสชัน (เดโม)')} />
              <Field label="IP (mock fixture)" value={log.ip} mono />
            </section>
          )}

        </div>

        {/* Drawer footer */}
        <div className="shrink-0 p-4 border-t border-line bg-surface-low/60">
          <button
            onClick={onClose}
            className="w-full text-xs py-2 px-4 rounded-lg border border-line text-ink-2 hover:bg-surface-low hover:text-ink-1 transition-colors"
          >
            {tl('Close', 'ปิด')}
          </button>
        </div>
      </div>
    </>
  )
}