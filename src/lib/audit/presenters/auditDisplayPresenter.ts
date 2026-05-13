// ---------------------------------------------------------------------------
// Audit Display Presenter — AP-8A Runtime Skeleton
// ---------------------------------------------------------------------------
// Converts stored AuditEvent objects into display-ready rows.
// This is a skeleton: it provides the structure but does NOT replace
// adminAuditDisplayAdapter.ts (which remains the live adapter for now).
//
// Future: AdminAuditDisplayPresenter will replace the current adapter.
//
// Laravel/PHP equivalent: App\Http\Resources\AuditEventResource
// ---------------------------------------------------------------------------

import type { AuditEvent, AuditSeverity, AuditPersistenceMode } from '../auditTypes'
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

  /** Convert a single event into a display row. */
  present(event: AuditEvent, options?: { locale?: 'en' | 'th' }): AuditDisplayRow {
    const locale = options?.locale ?? this.locale
    const targetMask = maskTargetForRole(this.viewerRole as any, event)

    return {
      id: event.id,
      createdAt: event.createdAt,
      actorLabel: event.actorDisplayName,
      actorRoleLabel: _roleLabel(event.actorRole, locale),
      actionLabel: _actionLabel(event.eventType, locale),
      targetLabel: targetMask.displayToken,
      sourceLabel: event.sourceRoute,
      persistenceLabel: _persistenceLabel(event.persistenceMode, locale),
      severityLabel: event.severity ? _severityLabel(event.severity, locale) : undefined,
      canOpenDetail: true,
      copyStage: event.persistenceMode,
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
}

// ---------------------------------------------------------------------------
// Module-level helper functions (avoid private class fields for ES5 compat)
// ---------------------------------------------------------------------------

function _roleLabel(role: string, locale: 'en' | 'th'): string {
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

function _actionLabel(eventType: string, locale: 'en' | 'th'): string {
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

function _persistenceLabel(mode: AuditPersistenceMode, locale: 'en' | 'th'): string {
  return resolveCopyStage(mode, locale as any)
}

function _severityLabel(severity: AuditSeverity, locale: 'en' | 'th'): string {
  const labels: Record<AuditSeverity, Record<string, string>> = {
    info: { en: 'Info', th: 'ข้อมูล' },
    low: { en: 'Low', th: 'ต่ำ' },
    medium: { en: 'Medium', th: 'ปานกลาง' },
    high: { en: 'High', th: 'สูง' },
    critical: { en: 'Critical', th: 'วิกฤต' },
  }
  return labels[severity]?.[locale] ?? severity
}