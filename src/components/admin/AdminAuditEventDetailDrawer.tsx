'use client'

import { X, AlertCircle, User, Target, Activity, Shield, Database } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { AdminAuditDisplayRow } from '@/lib/audit/adminAuditDisplayAdapter'
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

export default function AdminAuditEventDetailDrawer({ log, onClose }: Props) {
  const { lang } = useLang()

  const isWriterEvent = log.source === 'writer'

  const formattedTime = new Date(log.createdAt).toLocaleString(
    lang === 'th' ? 'th-TH' : 'en-US',
    { dateStyle: 'medium', timeStyle: 'medium' }
  )

  const structuredMetadata = isWriterEvent ? (log.metadata ?? {}) : {}
  const metadataEntries = Object.entries(structuredMetadata)

  const legacyBefore = !isWriterEvent ? (log.before ?? {}) : {}
  const legacyAfter = !isWriterEvent ? (log.after ?? {}) : {}
  const hasLegacyMeta = Object.keys(legacyBefore).length > 0 || Object.keys(legacyAfter).length > 0

  const sourceLabel = isWriterEvent ? 'Writer mock' : 'Fixture mock'
  const sourceBadgeColor = isWriterEvent
    ? 'text-violet-700 bg-violet-50 border-violet-200'
    : 'text-slate-600 bg-slate-100 border-slate-200'

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
                {lang === 'th' ? 'รายละเอียดเหตุการณ์ Audit (เดโม)' : 'Audit Event Detail (Mock/Demo)'}
              </div>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${sourceBadgeColor}`}>
                {sourceLabel}
              </span>
            </div>
            <div className="text-[10px] text-purple-600 mt-0.5 font-mono">{log.id}</div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1 rounded hover:bg-surface-low text-ink-3 hover:text-ink-1 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mock/demo notice banner */}
        <div className="flex items-start gap-2 mx-4 mt-3 p-2.5 bg-purple-500/[0.06] border border-purple-500/20 rounded-lg shrink-0">
          <AlertCircle size={12} className="text-purple-600 mt-0.5 shrink-0" />
          <div>
            <div className="text-[10px] font-semibold text-purple-700">
              {lang === 'th' ? 'เหตุการณ์เดโม — ไม่ใช่หลักฐาน Audit อย่างเป็นทางการ' : 'Mock/demo event — Not official audit evidence'}
            </div>
            <div className="text-[10px] text-purple-600 mt-0.5">
              {isWriterEvent
                ? (lang === 'th'
                  ? 'สร้างโดย mock audit writer สำหรับการตรวจสอบการแสดงผลเท่านั้น'
                  : 'Generated from the mock audit writer for display review only.')
                : (lang === 'th'
                  ? 'บันทึกนี้แสดงเพื่อการตรวจสอบเดโมเท่านั้น การบันทึก Audit จริงยังไม่ได้เชื่อมต่อ'
                  : 'This record is shown for mock/demo review. Real audit persistence is not connected yet.')}
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">

          {/* Event Identity */}
          <section>
            <SectionHeader icon={Activity} label={lang === 'th' ? 'ข้อมูลเหตุการณ์' : 'Event Identity'} />
            <div className="space-y-2.5">
              <Field label={lang === 'th' ? 'รหัสเหตุการณ์' : 'Event ID'} value={log.id} mono />
              <Field label={lang === 'th' ? 'เวลา' : 'Timestamp'} value={formattedTime} />
              <Field
                label={lang === 'th' ? 'ประเภทเหตุการณ์' : 'Event / Action'}
                value={log.eventType ?? log.action}
                mono
              />
              <Field
                label={lang === 'th' ? 'เวอร์ชันนโยบาย' : 'Policy Version'}
                value={log.policyVersion ?? 'Not available in mock fixture'}
              />
              {log.severity && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-ink-3">{lang === 'th' ? 'ระดับความรุนแรง' : 'Severity'}</span>
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded w-fit ${SEVERITY_COLOR[log.severity] ?? 'text-ink-3 bg-surface-low'}`}>
                    {log.severity}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Actor */}
          <section>
            <SectionHeader icon={User} label={lang === 'th' ? 'ผู้ดำเนินการ' : 'Actor'} />
            <div className="space-y-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-ink-3">{lang === 'th' ? 'บทบาท' : 'Role'}</span>
                <span className={`text-xs font-mono font-medium px-1.5 py-0.5 rounded w-fit ${ROLE_COLOR[log.actorRole] ?? 'text-ink-3 bg-surface-low'}`}>
                  {log.actorRole}
                </span>
              </div>
              <Field
                label={lang === 'th' ? 'ชื่อผู้ดำเนินการ' : 'Actor Name'}
                value={log.actorName || '[Actor not available]'}
              />
              <Field
                label={lang === 'th' ? 'รหัสผู้ดำเนินการ (ข้อมูลเดโม)' : 'Actor ID (mock data)'}
                value={log.actorId}
                mono
              />
            </div>
          </section>

          {/* Target / Entity */}
          <section>
            <SectionHeader icon={Target} label={lang === 'th' ? 'เป้าหมาย / เอนทิตี' : 'Target / Entity'} />
            <div className="space-y-2.5">
              <Field label={lang === 'th' ? 'ประเภทเอนทิตี' : 'Entity Type'} value={log.entityType || '[Entity type not available]'} />
              {log.targetDisplayToken ? (
                <Field label={lang === 'th' ? 'โทเคนเป้าหมาย' : 'Target Display Token'} value={log.targetDisplayToken} mono />
              ) : (
                <Field label={lang === 'th' ? 'รหัสเอนทิตี' : 'Entity ID'} value={log.entityId || '[Entity ID not available]'} mono />
              )}
              {log.targetPrivacyLevel && (
                <Field label={lang === 'th' ? 'ระดับความเป็นส่วนตัว' : 'Privacy Level'} value={log.targetPrivacyLevel} mono />
              )}
              {!log.targetDisplayToken && (
                <div className="p-2 rounded bg-surface-low/60 border border-line">
                  <div className="text-[10px] text-ink-3">
                    {lang === 'th'
                      ? 'รหัสที่แสดงมาจากข้อมูลเดโม ไม่ใช่ token ที่ผ่านการปกปิดตัวตน'
                      : 'IDs shown are from the mock fixture and are not privacy-masked tokens.'}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Action / Reason */}
          <section>
            <SectionHeader icon={Activity} label={lang === 'th' ? 'การกระทำ / เหตุผล' : 'Action / Reason'} />
            <div className="space-y-2.5">
              <Field label={lang === 'th' ? 'การกระทำ' : 'Action'} value={log.eventType ?? log.action} mono />
              {log.sourceRoute && (
                <Field label={lang === 'th' ? 'เส้นทางต้นทาง' : 'Source Route'} value={log.sourceRoute} mono />
              )}
              {log.reason ? (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-ink-3">{lang === 'th' ? 'เหตุผล' : 'Reason'}</span>
                  <span className="text-xs text-ink-1 p-2 rounded bg-surface-low/60 border border-line leading-relaxed">
                    {log.reason}
                  </span>
                </div>
              ) : (
                <Field
                  label={lang === 'th' ? 'เหตุผล' : 'Reason'}
                  value={lang === 'th' ? 'ไม่ได้ระบุเหตุผล' : 'Reason not provided'}
                />
              )}
              {log.reasonRequired !== undefined && (
                <Field
                  label={lang === 'th' ? 'ต้องการเหตุผล' : 'Reason Required'}
                  value={log.reasonRequired ? 'Yes' : 'No'}
                />
              )}
            </div>
          </section>

          {/* Persistence / Evidence */}
          <section>
            <SectionHeader icon={Shield} label={lang === 'th' ? 'สถานะการบันทึก / หลักฐาน' : 'Persistence / Evidence'} />
            <div className="space-y-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-ink-3">{lang === 'th' ? 'โหมดการบันทึก' : 'Persistence Mode'}</span>
                <span className="text-xs font-mono font-medium text-purple-700 bg-purple-500/10 px-1.5 py-0.5 rounded w-fit">
                  {log.persistenceMode}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-500/[0.05] border border-purple-500/15">
                <div className="text-xs text-purple-700 font-medium">
                  {lang === 'th'
                    ? 'เหตุการณ์นี้เป็นส่วนหนึ่งของชุดข้อมูลเดโม/จำลอง ไม่ใช่หลักฐาน Audit อย่างเป็นทางการ'
                    : 'This is a mock/demo event. Not official audit evidence.'}
                </div>
                <div className="text-[10px] text-purple-600 mt-1">
                  {isWriterEvent
                    ? (lang === 'th'
                      ? 'สร้างโดย mock audit writer — สำหรับการสาธิตเท่านั้น'
                      : 'Generated from the mock audit writer — for demonstration purposes only.')
                    : (lang === 'th'
                      ? 'สำหรับการสาธิตเท่านั้น ไม่ใช่การบันทึก Audit จริง'
                      : 'For demonstration purposes only. Not real audit persistence.')}
                </div>
              </div>
            </div>
          </section>

          {/* Metadata — writer events */}
          {isWriterEvent && (
            <section>
              <SectionHeader icon={Database} label={lang === 'th' ? 'ข้อมูลเพิ่มเติม' : 'Metadata'} />
              {metadataEntries.length > 0 ? (
                <div className="space-y-1">
                  {metadataEntries.map(([key, val]) => (
                    <div key={key} className="flex items-start justify-between gap-2 p-1.5 rounded bg-surface-low/60 border border-line">
                      <span className="text-[10px] font-mono text-ink-2 shrink-0">{key}</span>
                      <span className="text-[10px] text-ink-1 text-right break-all">
                        {renderMetadataValue(key, val)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-ink-3 italic">
                  {lang === 'th' ? 'ไม่มีข้อมูลเมตาเพิ่มเติม' : 'No additional metadata'}
                </div>
              )}
            </section>
          )}

          {/* Before/After — fixture events with metadata */}
          {!isWriterEvent && hasLegacyMeta && (
            <section>
              <SectionHeader icon={Database} label={lang === 'th' ? 'ข้อมูลเพิ่มเติม' : 'Metadata'} />
              {Object.keys(legacyBefore).length > 0 && (
                <div className="mb-2">
                  <div className="text-[10px] text-ink-3 mb-1">{lang === 'th' ? 'ก่อน' : 'Before'}</div>
                  <div className="space-y-1">
                    {Object.entries(legacyBefore).map(([key, val]) => (
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
              {Object.keys(legacyAfter).length > 0 && (
                <div>
                  <div className="text-[10px] text-ink-3 mb-1">{lang === 'th' ? 'หลัง' : 'After'}</div>
                  <div className="space-y-1">
                    {Object.entries(legacyAfter).map(([key, val]) => (
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

          {/* No metadata — fixture events without before/after */}
          {!isWriterEvent && !hasLegacyMeta && (
            <section>
              <SectionHeader icon={Database} label={lang === 'th' ? 'ข้อมูลเพิ่มเติม' : 'Metadata'} />
              <div className="text-[11px] text-ink-3 italic">
                {lang === 'th' ? 'ไม่มีข้อมูลเมตาเพิ่มเติม' : 'No additional metadata'}
              </div>
            </section>
          )}

          {/* Session context — fixture events only */}
          {log.ip && (
            <section>
              <SectionHeader icon={Shield} label={lang === 'th' ? 'บริบทเซสชัน (เดโม)' : 'Session Context (Mock)'} />
              <Field label="IP (mock fixture)" value={log.ip} mono />
            </section>
          )}

          {/* Bottom evidence note */}
          <div className="p-3 rounded-lg border border-line bg-surface-low/40">
            <div className="text-[10px] text-ink-3 leading-relaxed">
              {lang === 'th'
                ? 'บันทึกนี้มาจากชุดข้อมูลเดโม S²IMS ไม่สามารถใช้เป็นหลักฐาน Audit อย่างเป็นทางการได้ การบันทึก Audit จริงจะพร้อมใช้งานในเฟสถัดไป'
                : 'This record is from the S²IMS mock/demo dataset. It cannot be used as official audit evidence. Real audit persistence will be available in a future phase.'}
            </div>
          </div>

        </div>

        {/* Drawer footer */}
        <div className="shrink-0 p-4 border-t border-line bg-surface-low/60">
          <button
            onClick={onClose}
            className="w-full text-xs py-2 px-4 rounded-lg border border-line text-ink-2 hover:bg-surface-low transition-colors"
          >
            {lang === 'th' ? 'ปิด' : 'Close'}
          </button>
        </div>
      </div>
    </>
  )
}
