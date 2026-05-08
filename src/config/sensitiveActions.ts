import type { Role } from '@/lib/types'

export type SensitiveActionKey =
  | 'identity_reveal'
  | 'matching_override'
  | 'disclosure_approval'
  | 'disclosure_rejection'
  | 'role_change'
  | 'scope_change'
  | 'export_report'
  | 'sync_retry'
  | 'document_rejection'
  | 'document_replacement_request'
  | 'shortlist_request'
  | 'manual_data_correction'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface SensitiveActionConfig {
  key: SensitiveActionKey
  requiresReason: boolean
  requiresAudit: boolean
  defaultRiskLevel: RiskLevel
  allowedRolesDraft: readonly Role[]
  description: string
  warningCopy: {
    en: string
    th: string
  }
}

export const SENSITIVE_ACTION_CONFIG = {
  identity_reveal: {
    key: 'identity_reveal',
    requiresReason: true,
    requiresAudit: true,
    defaultRiskLevel: 'high',
    allowedRolesDraft: ['staff', 'admin'],
    description: 'Reveal a masked student identity after approved governance review.',
    warningCopy: {
      en: 'Identity reveal requires a documented reason and will be audit logged.',
      th: 'การเปิดเผยตัวตนต้องมีเหตุผลที่บันทึกไว้และจะถูกบันทึกใน audit log',
    },
  },
  matching_override: {
    key: 'matching_override',
    requiresReason: true,
    requiresAudit: true,
    defaultRiskLevel: 'high',
    allowedRolesDraft: ['staff', 'admin'],
    description: 'Manually override a matching or eligibility decision.',
    warningCopy: {
      en: 'Manual matching changes must include a clear reason for audit review.',
      th: 'การปรับผล matching ด้วยมือจำเป็นต้องระบุเหตุผลเพื่อการตรวจสอบ',
    },
  },
  disclosure_approval: {
    key: 'disclosure_approval',
    requiresReason: true,
    requiresAudit: true,
    defaultRiskLevel: 'high',
    allowedRolesDraft: ['staff', 'admin'],
    description: 'Approve a request to disclose masked candidate identity or details.',
    warningCopy: {
      en: 'Disclosure approval may expose personal data and must be justified.',
      th: 'การอนุมัติการเปิดเผยข้อมูลอาจเกี่ยวข้องกับข้อมูลส่วนบุคคลและต้องมีเหตุผลรองรับ',
    },
  },
  disclosure_rejection: {
    key: 'disclosure_rejection',
    requiresReason: true,
    requiresAudit: true,
    defaultRiskLevel: 'medium',
    allowedRolesDraft: ['staff', 'admin'],
    description: 'Reject a disclosure request while keeping identity masked.',
    warningCopy: {
      en: 'Record why this disclosure request should remain masked.',
      th: 'บันทึกเหตุผลว่าทำไมคำขอนี้จึงควรคงสถานะปกปิดตัวตน',
    },
  },
  role_change: {
    key: 'role_change',
    requiresReason: true,
    requiresAudit: true,
    defaultRiskLevel: 'critical',
    allowedRolesDraft: ['admin'],
    description: 'Change a user role or role assignment.',
    warningCopy: {
      en: 'Role changes affect access scope and require audit tracking.',
      th: 'การเปลี่ยนบทบาทส่งผลต่อขอบเขตการเข้าถึงและต้องบันทึก audit',
    },
  },
  scope_change: {
    key: 'scope_change',
    requiresReason: true,
    requiresAudit: true,
    defaultRiskLevel: 'high',
    allowedRolesDraft: ['admin'],
    description: 'Change permissions, access scope, or visibility boundaries.',
    warningCopy: {
      en: 'Scope changes can expose more data and should be reviewed carefully.',
      th: 'การเปลี่ยนขอบเขตสิทธิ์อาจเพิ่มการเข้าถึงข้อมูลและต้องตรวจอย่างรอบคอบ',
    },
  },
  export_report: {
    key: 'export_report',
    requiresReason: true,
    requiresAudit: true,
    defaultRiskLevel: 'high',
    allowedRolesDraft: ['staff', 'esq', 'admin'],
    description: 'Export report data from operational, aggregate, or audit surfaces.',
    warningCopy: {
      en: 'Exports must follow the approved allowlist and be audit logged.',
      th: 'การส่งออกข้อมูลต้องเป็นไปตาม allowlist ที่อนุมัติและต้องบันทึก audit',
    },
  },
  sync_retry: {
    key: 'sync_retry',
    requiresReason: false,
    requiresAudit: true,
    defaultRiskLevel: 'medium',
    allowedRolesDraft: ['staff', 'admin'],
    description: 'Retry a data sync or integration task.',
    warningCopy: {
      en: 'Sync retry will be logged because it can update operational data.',
      th: 'การลองซิงก์ใหม่จะถูกบันทึกเพราะอาจเปลี่ยนข้อมูลปฏิบัติการ',
    },
  },
  document_rejection: {
    key: 'document_rejection',
    requiresReason: true,
    requiresAudit: true,
    defaultRiskLevel: 'medium',
    allowedRolesDraft: ['staff', 'admin'],
    description: 'Reject a submitted document after review.',
    warningCopy: {
      en: 'Use supportive wording and avoid exposing unnecessary document details.',
      th: 'ใช้ถ้อยคำเชิงสนับสนุนและหลีกเลี่ยงการเปิดเผยรายละเอียดเอกสารที่ไม่จำเป็น',
    },
  },
  document_replacement_request: {
    key: 'document_replacement_request',
    requiresReason: true,
    requiresAudit: true,
    defaultRiskLevel: 'medium',
    allowedRolesDraft: ['staff', 'admin'],
    description: 'Ask a student to replace or update a document.',
    warningCopy: {
      en: 'Explain what to improve without blame language.',
      th: 'อธิบายสิ่งที่ควรปรับปรุงโดยไม่ใช้ถ้อยคำกล่าวโทษ',
    },
  },
  shortlist_request: {
    key: 'shortlist_request',
    requiresReason: true,
    requiresAudit: true,
    defaultRiskLevel: 'medium',
    allowedRolesDraft: ['provider'],
    description: 'Provider requests staff approval for an anonymous shortlist.',
    warningCopy: {
      en: 'Shortlist requests require a reason and remain pending staff approval.',
      th: 'คำขอ shortlist ต้องระบุเหตุผลและจะอยู่ในสถานะรอเจ้าหน้าที่อนุมัติ',
    },
  },
  manual_data_correction: {
    key: 'manual_data_correction',
    requiresReason: true,
    requiresAudit: true,
    defaultRiskLevel: 'high',
    allowedRolesDraft: ['staff', 'admin'],
    description: 'Correct operational, profile, matching, or governance data manually.',
    warningCopy: {
      en: 'Manual data correction must describe the source and reason for the change.',
      th: 'การแก้ไขข้อมูลด้วยมือต้องระบุแหล่งที่มาและเหตุผลของการเปลี่ยนแปลง',
    },
  },
} as const satisfies Record<SensitiveActionKey, SensitiveActionConfig>
