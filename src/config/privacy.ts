export type PrivacyCategoryKey =
  | 'public'
  | 'internal'
  | 'masked'
  | 'aggregate'
  | 'sensitive'
  | 'restricted'

export interface PrivacyCategory {
  key: PrivacyCategoryKey
  label: {
    en: string
    th: string
  }
  description: string
  defaultHandling: string
}

export const PRIVACY_CATEGORIES = {
  public: {
    key: 'public',
    label: { en: 'Public', th: 'สาธารณะ' },
    description: 'Information intentionally visible without sensitive student context.',
    defaultHandling: 'Can be displayed when route and publication status allow it.',
  },
  internal: {
    key: 'internal',
    label: { en: 'Internal', th: 'ภายใน' },
    description: 'Operational information for approved internal users.',
    defaultHandling: 'Restrict by role and avoid exporting unless explicitly allowed.',
  },
  masked: {
    key: 'masked',
    label: { en: 'Masked', th: 'ปกปิดตัวตน' },
    description: 'Tokenized or partially obscured personal data.',
    defaultHandling: 'Use Candidate #C-XXXX or Student #S-XXXX tokens by default.',
  },
  aggregate: {
    key: 'aggregate',
    label: { en: 'Aggregate', th: 'ข้อมูลสรุป' },
    description: 'Grouped metrics that should not identify one person.',
    defaultHandling: 'Use n >= 5 where possible and avoid small-cell disclosure.',
  },
  sensitive: {
    key: 'sensitive',
    label: { en: 'Sensitive', th: 'ข้อมูลอ่อนไหว' },
    description: 'Personal, academic, financial, document, or governance data that needs careful handling.',
    defaultHandling: 'Require role scope, reason when appropriate, and audit for access or export.',
  },
  restricted: {
    key: 'restricted',
    label: { en: 'Restricted', th: 'จำกัดสูง' },
    description: 'Identity reveal, raw identifiers, or high-risk governance data.',
    defaultHandling: 'Block by default; allow only through approved reason, policy, and audit event.',
  },
} as const satisfies Record<PrivacyCategoryKey, PrivacyCategory>

export const STUDENT_IDENTITY_FIELDS = [
  'studentId',
  'student_id',
  'name_th',
  'name_en',
  'email',
  'phone',
  'address',
  'nationalId',
  'avatar',
] as const

export const CANDIDATE_IDENTITY_FIELDS = [
  'candidateToken',
  'rankBand',
  'matchScore',
  'confidence',
  'eligibilitySummary',
] as const

export const ACADEMIC_FIELDS = [
  'gpa',
  'gpaBand',
  'academicBand',
  'academicYear',
  'department',
  'departmentBand',
  'major',
  'transcript',
] as const

export const FINANCIAL_NEED_FIELDS = [
  'financialNeedBand',
  'needBand',
  'householdIncomeBand',
  'scholarshipNeedContext',
  'rawFinancialValue',
] as const

export const DOCUMENT_FIELDS = [
  'documentId',
  'documentType',
  'fileName',
  'fileType',
  'documentStatus',
  'uploadedAt',
  'verificationNote',
  'storagePath',
] as const

export const AUDIT_FIELDS = [
  'auditId',
  'actorId',
  'actorRole',
  'action',
  'entityType',
  'entityId',
  'before',
  'after',
  'ip',
  'createdAt',
] as const

export const PROVIDER_SAFE_FIELDS = [
  'candidateToken',
  'rankBand',
  'matchScore',
  'confidence',
  'eligibilitySummary',
  'academicBand',
  'needBand',
  'departmentBand',
  'aggregateNotes',
  'shortlistStatus',
] as const

export const STAFF_SAFE_FIELDS = [
  'studentToken',
  'candidateToken',
  'applicationStatus',
  'documentStatus',
  'reviewStatus',
  'disclosureRequestStatus',
  'maskedProfileSummary',
] as const

export const ADMIN_AUDIT_SAFE_FIELDS = [
  'auditEventToken',
  'actorRole',
  'action',
  'entityType',
  'entityToken',
  'riskLevel',
  'createdAt',
] as const

export const ESQ_AGGREGATE_ONLY_FIELDS = [
  'totalApplications',
  'approvalRate',
  'coverageBand',
  'departmentBand',
  'cohortBand',
  'equityIndicator',
  'fundUtilization',
] as const

export const PRIVACY_BOUNDARY_NOTES = [
  'Provider must see Candidate #C-XXXX only.',
  'Staff sees Student #S-XXXX by default.',
  'Executive/ESQ sees aggregate-only data.',
  'Admin audit views use tokens by default.',
  'Identity reveal requires reason and audit event.',
] as const
