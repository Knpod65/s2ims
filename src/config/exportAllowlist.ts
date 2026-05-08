export type ExportScope =
  | 'aggregate'
  | 'provider_safe'
  | 'staff_review'
  | 'admin_audit'

export interface ExportScopeConfig {
  scope: ExportScope
  description: string
  allowedFields: readonly string[]
  requiresReason: boolean
  requiresAudit: boolean
}

export const AGGREGATE_MIN_CELL_SIZE = 5

export const AGGREGATE_EXPORT_FIELDS = [
  'scholarshipId',
  'scholarshipTitle',
  'totalApplications',
  'totalCandidates',
  'fundUtilizationPct',
  'coveragePct',
  'departmentBand',
  'cohortBand',
  'needBand',
  'academicBand',
  'averageMatchScoreBand',
] as const

export const PROVIDER_SAFE_EXPORT_FIELDS = [
  'scholarshipId',
  'scholarshipTitle',
  'candidateToken',
  'rankBand',
  'matchScoreBand',
  'confidence',
  'eligibilitySummary',
  'needBand',
  'academicBand',
  'departmentBand',
  'shortlistStatus',
] as const

export const STAFF_REVIEW_EXPORT_FIELDS = [
  'studentToken',
  'candidateToken',
  'applicationStatus',
  'documentStatus',
  'reviewStatus',
  'scholarshipId',
  'scholarshipTitle',
  'maskedProfileSummary',
  'reason',
  'reviewedAt',
] as const

export const ADMIN_AUDIT_EXPORT_FIELDS = [
  'auditEventToken',
  'actorRole',
  'action',
  'entityType',
  'entityToken',
  'riskLevel',
  'reason',
  'createdAt',
] as const

export const NEVER_EXPORT_FIELDS = [
  'name_th',
  'name_en',
  'email',
  'phone',
  'address',
  'nationalId',
  'rawStudentId',
  'student_id',
  'studentId',
  'exactGpa',
  'rawFinancialValue',
  'transcriptFileUrl',
  'documentStoragePath',
  'password',
  'accessToken',
] as const

export const REASON_AND_AUDIT_REQUIRED_FIELDS = [
  'studentToken',
  'candidateToken',
  'actorId',
  'actorName',
  'ip',
  'reason',
  'disclosureFields',
  'exportDestination',
  'roleChangeReason',
] as const

export const EXPORT_ALLOWLIST_CONFIG = {
  aggregate: {
    scope: 'aggregate',
    description: `Aggregate reports should use n >= ${AGGREGATE_MIN_CELL_SIZE} to reduce small-cell re-identification risk.`,
    allowedFields: AGGREGATE_EXPORT_FIELDS,
    requiresReason: false,
    requiresAudit: true,
  },
  provider_safe: {
    scope: 'provider_safe',
    description: 'Provider exports must remain tokenized and must not include direct student identity.',
    allowedFields: PROVIDER_SAFE_EXPORT_FIELDS,
    requiresReason: true,
    requiresAudit: true,
  },
  staff_review: {
    scope: 'staff_review',
    description: 'Staff review exports should use Student #S-XXXX and Candidate #C-XXXX tokens by default.',
    allowedFields: STAFF_REVIEW_EXPORT_FIELDS,
    requiresReason: true,
    requiresAudit: true,
  },
  admin_audit: {
    scope: 'admin_audit',
    description: 'Admin audit exports should expose event context with tokenized entities by default.',
    allowedFields: ADMIN_AUDIT_EXPORT_FIELDS,
    requiresReason: true,
    requiresAudit: true,
  },
} as const satisfies Record<ExportScope, ExportScopeConfig>
