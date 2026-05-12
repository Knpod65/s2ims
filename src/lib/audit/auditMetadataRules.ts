import type { AuditActorRole, AuditMetadata, AuditTargetType } from './auditTypes'

export const FORBIDDEN_AUDIT_METADATA_KEYS = [
  'rawStudentName',
  'studentName',
  'email',
  'studentEmail',
  'phone',
  'address',
  'nationalId',
  'rawStudentId',
  'bankAccount',
  'gpaRaw',
  'incomeRaw',
  'medicalInfo',
  'disabilityInfo',
  'freeTextSensitiveData',
] as const

export const SAFE_AUDIT_METADATA_KEYS = [
  'documentId',
  'documentType',
  'previousStatus',
  'nextStatus',
  'applicationId',
  'scholarshipId',
  'candidateToken',
  'studentToken',
  'reasonCode',
  'decision',
  'sourceComponent',
  'uiStage',
  'persistenceStage',
  'providerId',
  'shortlistRequestId',
  'exportType',
  'format',
  'rowCount',
  'fieldAllowlistVersion',
  'roleBefore',
  'roleAfter',
  'permissionKey',
  'jobId',
  'integrationName',
  'outcome',
  'errorCategory',
] as const

export interface AuditMetadataValidationContext {
  actorRole: AuditActorRole
  targetType: AuditTargetType
}

export interface AuditMetadataValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

const forbiddenKeySet = new Set<string>(FORBIDDEN_AUDIT_METADATA_KEYS)
const safeKeySet = new Set<string>(SAFE_AUDIT_METADATA_KEYS)
const providerRawIdentityKeys = new Set([
  'rawStudentName',
  'studentName',
  'email',
  'studentEmail',
  'phone',
  'address',
  'nationalId',
  'rawStudentId',
])
const aggregateAvoidKeys = new Set([
  'targetId',
  'studentToken',
  'candidateToken',
  'applicationId',
  'documentId',
  'rawStudentId',
])

export function validateAuditMetadata(
  metadata: AuditMetadata,
  context: AuditMetadataValidationContext
): AuditMetadataValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return {
      valid: false,
      errors: ['metadata must be a plain object'],
      warnings,
    }
  }

  for (const key of Object.keys(metadata)) {
    if (forbiddenKeySet.has(key)) {
      errors.push(`metadata key "${key}" is forbidden`)
    }

    if (!safeKeySet.has(key)) {
      warnings.push(`metadata key "${key}" is not in the safe audit metadata allowlist`)
    }

    if (context.actorRole === 'provider' && providerRawIdentityKeys.has(key)) {
      errors.push(`provider metadata must not include raw student identity key "${key}"`)
    }

    if ((context.actorRole === 'executive' || context.actorRole === 'esq') && aggregateAvoidKeys.has(key)) {
      warnings.push(`executive/esq metadata should avoid individual target key "${key}"`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
