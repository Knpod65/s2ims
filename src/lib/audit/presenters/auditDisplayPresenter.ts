// ---------------------------------------------------------------------------
// Audit Display Presenter — AP-8C Refactor
// ---------------------------------------------------------------------------
// Converts stored AuditEvent objects into display-ready rows.
// This is the single source of truth for all audit display formatting.
//
// Replaces the duplicated formatting logic that previously lived in:
//   - adminAuditDisplayAdapter.ts (row construction)
//   - AdminAuditEventDetailDrawer.tsx (detail labels)
//   - page.tsx (table cell labels, source badges)
//
// Laravel/PHP equivalent: App\Http\Resources\AuditEventResource
// ---------------------------------------------------------------------------

import type { AuditEvent, AuditSeverity, AuditPersistenceMode, AuditTargetType } from '../auditTypes'
import type { AuditDisplayPresenterContract, AuditDisplayRow, CsvAuditRow } from '../contracts/auditContracts'
import { maskTargetForRole } from '../policies/auditPolicy'
import { resolveCopyStage } from '../copy/auditCopyStage'

// ---------------------------------------------------------------------------
// Presenter implementation
// ---------------------------------------------------------------------------

export class AuditDisplayPresenter implements AuditDisplayPresenterContract {
  constructor(
    private readonly locale: 'en' | 'th' = 'en',
    private readonly viewerRole: string = 'admin',
  ) {}

  /** Convert a single event into a display row with all fields needed for table + drawer. */
  present(event: AuditEvent, options?: { locale?: 'en' | 'th' }): AuditDisplayRow {
    const locale = options?.locale ?? this.locale
    const targetMask = maskTargetForRole(this.viewerRole as any, event)

    return {
      // Identity
      id: event.id,
      createdAt: event.createdAt,
      formattedTime: this._formatTime(event.createdAt, locale),
      actorId: event.actorId,
      actorRole: event.actorRole,

      // Labels (presenter-owned, not duplicated in components)
      actorLabel: event.actorDisplayName,
      actorRoleLabel: _roleLabel(event.actorRole, locale),
      actionLabel: _actionLabel(event.eventType, locale),
      targetLabel: targetMask.displayToken,
      sourceLabel: _sourceLabel(event.sourceRoute, locale),
      sourceType: _sourceType(event.sourceRoute),
      persistenceLabel: _persistenceLabel(event.persistenceMode, locale),
      severityLabel: event.severity ? _severityLabel(event.severity, locale) : undefined,
      canOpenDetail: true,
      copyStage: event.persistenceMode,

      // Drawer detail fields
      eventType: event.eventType,
      actionKey: event.actionKey,
      reason: event.reason,
      reasonRequired: event.reasonRequired,
      targetDisplayToken: event.targetDisplayToken,
      targetPrivacyLevel: event.targetPrivacyLevel,
      targetType: event.targetType,
      targetId: event.targetId,
      sourceRoute: event.sourceRoute,
      policyVersion: event.policyVersion,
      metadata: event.metadata,

      // Legacy fixture fields
      before: event.before as Record<string, unknown> | undefined,
      after: event.after as Record<string, unknown> | undefined,
      ip: event.ip,
    }
  }

  /** Batch convert. */
  presentMany(events: AuditEvent[], options?: { locale?: 'en' | 'th' }): AuditDisplayRow[] {
    return events.map((e) => this.present(e, options))
  }

  /** Convert to CSV-friendly row. */
  toCsvRow(event: AuditEvent, options?: { locale?: 'en' | 'th' }): CsvAuditRow {
    const row = this.present(event, options)
    return {
      id: row.id,
      createdAt: row.createdAt,
      actor: row.actorLabel,
      actorRole: row.actorRoleLabel,
      action: row.actionLabel,
      target: row.targetLabel,
      source: row.sourceLabel,
      persistence: row.persistenceLabel,
      severity: row.severityLabel ?? '',
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private _formatTime(iso: string, locale: 'en' | 'th'): string {
    return new Date(iso).toLocaleString(
      locale === 'th' ? 'th-TH' : 'en-US',
      { dateStyle: 'medium', timeStyle: 'medium' }
    )
  }
}

// ---------------------------------------------------------------------------
// Module-level helper functions (shared between presenter and tests)
// ---------------------------------------------------------------------------

export function _roleLabel(role: string, locale: 'en' | 'th'): string {
  const labels: Record<string, Record<string, string>> = {
    staff: { en: 'Staff', th: 'เจ้าหน้าที่' },
    admin: { en: 'Admin', th: 'ผู้ดูแลระบบ' },
    provider: { en: 'Provider', th: 'ผู้ให้บริการ' },
    student: { en: 'Student', th: 'นักศึกษา' },
    executive: { en: 'Executive', th: 'ผู้บริหาร' },
    esq: { en: 'ESQ', th: 'ESQ' },
    system: { en: 'System', th: 'ระบบ' },
  }
  return labels[role]?.[locale] ?? role
}

export function _actionLabel(eventType: string, locale: 'en' | 'th'): string {
  const map: Record<string, Record<string, string>> = {
    'staff.document.verify': { en: 'Verified document', th: 'ตรวจสอบเอกสาร' },
    'staff.document.reject': { en: 'Rejected document', th: 'ปฏิเสธเอกสาร' },
    'staff.document.request_replacement': { en: 'Requested replacement', th: 'ขอเอกสารแทน' },
    'staff.disclosure.approve_identity_reveal': { en: 'Approved identity reveal', th: 'อนุมัติการเปิดเผย' },
    'staff.disclosure.reject_identity_reveal': { en: 'Rejected identity reveal', th: 'ปฏิเสธการเปิดเผย' },
    'staff.match.override_decision': { en: 'Overrode match decision', th: 'ยกเลิกผลการแมตช์' },
    'admin.role.assign': { en: 'Assigned role', th: 'กำหนดบทบาท' },
    'admin.role.remove': { en: 'Removed role', th: 'เพิกถอนบทบาท' },
    'admin.export.generate': { en: 'Generated export', th: 'สร้างการส่งออก' },
    'admin.permission.change': { en: 'Changed permission', th: 'เปลี่ยนสิทธิ์' },
  }
  return map[eventType]?.[locale] ?? eventType
}

/** Derive source label from route path. */
export function _sourceLabel(sourceRoute: string | undefined, locale: 'en' | 'th'): string {
  if (!sourceRoute) return locale === 'th' ? 'ไม่ทราบ' : 'Unknown'
  const map: Record<string, Record<string, string>> = {
    '/staff/applications': { en: 'Staff review', th: 'ตรวจเอกสาร' },
    '/admin/users': { en: 'Admin users', th: 'ผู้ใช้' },
    '/admin/audit-log': { en: 'Audit log', th: 'ประวัติการตรวจสอบ' },
    '/admin/dashboard': { en: 'Admin dashboard', th: 'แดชบอร์ด' },
    '/staff/applications/app_002': { en: 'Application review', th: 'ตรวจใบสมัคร' },
    '/staff/writer-test': { en: 'Writer test', th: 'ทดสอบระบบ' },
  }
  // Try exact match first
  if (map[sourceRoute]) return map[sourceRoute][locale]
  // Fallback: try prefix match
  for (const [prefix, labels] of Object.entries(map)) {
    if (sourceRoute.startsWith(prefix)) return labels[locale]
  }
  return sourceRoute
}

/** Determine if the event came from the mock writer or fixture. */
export function _sourceType(sourceRoute: string | undefined): 'fixture' | 'writer' {
  // Events with source routes containing 'writer-test' or not matching
  // known fixture routes are from the writer.
  // Everything else is from fixture/static data.
  if (!sourceRoute) return 'fixture'
  if (sourceRoute.includes('writer-test') || sourceRoute.includes('writer_test')) return 'writer'
  // Default: fixture (the existing display logic treats the 'source' field
  // as 'writer' only for DEMO_WRITER_EVENTS which carry a specific sourceRoute)
  return 'fixture'
}

export function _persistenceLabel(mode: AuditPersistenceMode, locale: 'en' | 'th'): string {
  return resolveCopyStage(mode, locale as any)
}

export function _severityLabel(severity: AuditSeverity, locale: 'en' | 'th'): string {
  const labels: Record<AuditSeverity, Record<string, string>> = {
    info: { en: 'Info', th: 'ข้อมูล' },
    low: { en: 'Low', th: 'ต่ำ' },
    medium: { en: 'Medium', th: 'ปานกลาง' },
    high: { en: 'High', th: 'สูง' },
    critical: { en: 'Critical', th: 'วิกฤต' },
  }
  return labels[severity]?.[locale] ?? severity
}