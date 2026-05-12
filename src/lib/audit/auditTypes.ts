import type { SensitiveActionKey } from '@/config/sensitiveActions'

export type AuditActorRole =
  | 'student'
  | 'staff'
  | 'provider'
  | 'admin'
  | 'executive'
  | 'esq'
  | 'system'

export type AuditTargetType =
  | 'document'
  | 'application'
  | 'student'
  | 'candidate'
  | 'disclosure_request'
  | 'match_review'
  | 'shortlist_request'
  | 'role_assignment'
  | 'export_job'
  | 'permission'
  | 'ocr_job'
  | 'integration_job'

export type AuditSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical'

export type AuditPersistenceMode = 'prototype_only' | 'mock_only' | 'real_persisted'

export type AuditPrivacyLevel =
  | 'public'
  | 'masked'
  | 'internal'
  | 'restricted'
  | 'aggregate_only'

export type AuditEventType =
  | 'staff.document.verify'
  | 'staff.document.reject'
  | 'staff.document.request_replacement'
  | 'staff.disclosure.approve_identity_reveal'
  | 'staff.disclosure.reject_identity_reveal'
  | 'staff.match.override_decision'
  | 'provider.shortlist.request'
  | 'provider.shortlist.submit_reason'
  | 'admin.role.assign'
  | 'admin.role.remove'
  | 'admin.export.generate'
  | 'admin.permission.change'
  | 'system.ocr.process_document'
  | 'system.data_quality.flag'
  | 'system.integration.sync_failed'

export type AuditMetadata = Record<string, unknown>

export interface AuditEvent {
  id: string
  eventType: AuditEventType
  actionKey: SensitiveActionKey | null
  actorId: string
  actorRole: AuditActorRole
  actorDisplayName: string
  targetType: AuditTargetType
  targetId: string
  targetDisplayToken: string
  targetPrivacyLevel: AuditPrivacyLevel
  reason: string | null
  reasonRequired: boolean
  reasonMinLength: number
  metadata: AuditMetadata
  sourceRoute: string
  createdAt: string
  severity: AuditSeverity
  policyVersion: string
  persistenceMode: AuditPersistenceMode
}

export interface AuditActorInput {
  actorId: string
  actorRole: AuditActorRole
  actorDisplayName: string
}

export interface AuditTargetInput {
  targetType: AuditTargetType
  targetId: string
  targetDisplayToken: string
  targetPrivacyLevel: AuditPrivacyLevel
}

export interface BuildAuditEventInput extends AuditActorInput, AuditTargetInput {
  id?: string
  eventType: AuditEventType
  actionKey?: SensitiveActionKey | null
  reason?: string | null
  reasonRequired?: boolean
  reasonMinLength?: number
  metadata?: AuditMetadata
  sourceRoute: string
  createdAt?: string
  severity?: AuditSeverity
  policyVersion?: string
  persistenceMode?: AuditPersistenceMode
}

export interface StaffDocumentAuditInput extends AuditActorInput {
  documentId: string
  applicationId: string
  studentToken: string
  sourceRoute: string
  id?: string
  createdAt?: string
  reason?: string | null
  metadata?: AuditMetadata
}
