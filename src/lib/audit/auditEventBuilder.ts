import type {
  AuditEvent,
  AuditEventType,
  AuditMetadata,
  BuildAuditEventInput,
  StaffDocumentAuditInput,
} from './auditTypes'
import { validateAuditMetadata } from './auditMetadataRules'

export const AUDIT_POLICY_VERSION = 'audit-contract-v1'

export class AuditEventValidationError extends Error {
  readonly errors: string[]

  constructor(errors: string[]) {
    super(errors.join('; '))
    this.name = 'AuditEventValidationError'
    this.errors = errors
  }
}

function requiredString(value: unknown, field: string, errors: string[]) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push(`${field} is required`)
  }
}

function stableId(eventType: AuditEventType, targetId: string, createdAt: string) {
  const safeType = eventType.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')
  const safeTarget = targetId.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')
  const safeTime = createdAt.replace(/[^0-9a-z]+/gi, '')
  return `audit_${safeType}_${safeTarget}_${safeTime}`
}

function copyMetadata(metadata: AuditMetadata | undefined): AuditMetadata {
  return { ...(metadata ?? {}) }
}

export function buildAuditEvent(input: BuildAuditEventInput): AuditEvent {
  const errors: string[] = []

  requiredString(input.eventType, 'eventType', errors)
  requiredString(input.actorId, 'actorId', errors)
  requiredString(input.actorRole, 'actorRole', errors)
  requiredString(input.actorDisplayName, 'actorDisplayName', errors)
  requiredString(input.targetType, 'targetType', errors)
  requiredString(input.targetId, 'targetId', errors)
  requiredString(input.targetDisplayToken, 'targetDisplayToken', errors)
  requiredString(input.targetPrivacyLevel, 'targetPrivacyLevel', errors)
  requiredString(input.sourceRoute, 'sourceRoute', errors)

  const reasonRequired = input.reasonRequired ?? false
  const reasonMinLength = input.reasonMinLength ?? 0
  const reason = typeof input.reason === 'string' ? input.reason.trim() : null

  if (reasonRequired && !reason) {
    errors.push('reason is required')
  }

  if (reason && reason.length < reasonMinLength) {
    errors.push(`reason must be at least ${reasonMinLength} characters`)
  }

  const metadata = copyMetadata(input.metadata)
  const metadataResult = validateAuditMetadata(metadata, {
    actorRole: input.actorRole,
    targetType: input.targetType,
  })

  if (!metadataResult.valid) {
    errors.push(...metadataResult.errors)
  }

  if (errors.length > 0) {
    throw new AuditEventValidationError(errors)
  }

  const createdAt = input.createdAt ?? new Date(0).toISOString()

  return {
    id: input.id ?? stableId(input.eventType, input.targetId, createdAt),
    eventType: input.eventType,
    actionKey: input.actionKey ?? null,
    actorId: input.actorId,
    actorRole: input.actorRole,
    actorDisplayName: input.actorDisplayName,
    targetType: input.targetType,
    targetId: input.targetId,
    targetDisplayToken: input.targetDisplayToken,
    targetPrivacyLevel: input.targetPrivacyLevel,
    reason,
    reasonRequired,
    reasonMinLength,
    metadata,
    sourceRoute: input.sourceRoute,
    createdAt,
    severity: input.severity ?? 'info',
    policyVersion: input.policyVersion ?? AUDIT_POLICY_VERSION,
    persistenceMode: input.persistenceMode ?? 'mock_only',
  }
}

export function buildStaffDocumentVerifyEvent(input: StaffDocumentAuditInput): AuditEvent {
  return buildAuditEvent({
    ...input,
    eventType: 'staff.document.verify',
    actionKey: null,
    targetType: 'document',
    targetId: input.documentId,
    targetDisplayToken: input.studentToken,
    targetPrivacyLevel: 'internal',
    reasonRequired: false,
    reasonMinLength: 0,
    severity: 'low',
    metadata: {
      documentId: input.documentId,
      applicationId: input.applicationId,
      studentToken: input.studentToken,
      nextStatus: 'verified',
      ...(input.metadata ?? {}),
    },
  })
}

export function buildStaffDocumentRejectEvent(input: StaffDocumentAuditInput): AuditEvent {
  return buildAuditEvent({
    ...input,
    eventType: 'staff.document.reject',
    actionKey: 'document_rejection',
    targetType: 'document',
    targetId: input.documentId,
    targetDisplayToken: input.studentToken,
    targetPrivacyLevel: 'internal',
    reasonRequired: true,
    reasonMinLength: 1,
    severity: 'medium',
    metadata: {
      documentId: input.documentId,
      applicationId: input.applicationId,
      studentToken: input.studentToken,
      nextStatus: 'rejected',
      ...(input.metadata ?? {}),
    },
  })
}

export function buildStaffDocumentReplacementRequestEvent(input: StaffDocumentAuditInput): AuditEvent {
  return buildAuditEvent({
    ...input,
    eventType: 'staff.document.request_replacement',
    actionKey: 'document_replacement_request',
    targetType: 'document',
    targetId: input.documentId,
    targetDisplayToken: input.studentToken,
    targetPrivacyLevel: 'internal',
    reasonRequired: true,
    reasonMinLength: 1,
    severity: 'medium',
    metadata: {
      documentId: input.documentId,
      applicationId: input.applicationId,
      studentToken: input.studentToken,
      nextStatus: 'needs_replacement',
      ...(input.metadata ?? {}),
    },
  })
}
