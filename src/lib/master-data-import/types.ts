export type MasterDataImportSourceType =
  | 'staff_master'
  | 'teacher_master'
  | 'combined_personnel'
  | 'responsible_person_assignment'
  | 'account_profile'
  | 'lecturer_future'
  | 'opencourse_future'
  | 'student_enrollment_future'

export type MasterDataImportRecordType =
  | 'staff'
  | 'teacher'
  | 'responsible_person_assignment'
  | 'account_profile'
  | 'future_only'
  | 'unknown'

export type MasterDataImportSeverity = 'error' | 'warning' | 'info'

export type MasterDataImportValidationStatus = 'valid' | 'error' | 'warning' | 'info'

export type MasterDataImportMappingStatus =
  | 'not_required'
  | 'unresolved'
  | 'resolved'
  | 'deferred'

export type MasterDataImportFilter =
  | 'all'
  | 'valid'
  | 'errors'
  | 'warnings'
  | 'duplicate_cmu_mail'
  | 'missing_cmu_mail'
  | 'manual_mapping'
  | 'blocked'

export type MasterDataImportMessage = {
  severity: MasterDataImportSeverity
  code:
    | 'duplicate_cmu_mail'
    | 'missing_cmu_mail'
    | 'missing_required_name'
    | 'invalid_email_format'
    | 'unknown_source_type'
    | 'conflicting_status'
    | 'missing_english_name'
    | 'missing_department'
    | 'missing_unit'
    | 'duplicate_display_name'
    | 'inactive_record'
    | 'teacher_staff_overlap'
    | 'student_pii_detected'
    | 'future_source_blocked'
    | 'responsible_person_unmatched'
    | 'advisor_candidate_unresolved'
    | 'sheet_inferred_requires_confirmation'
    | 'source_context'
    | 'formula_detected'
    | 'forbidden_column_detected'
  field?: string
  reason: string
  suggestedAction: string
}

export type MasterDataImportRawRow = {
  sourceRowNumber: number
  values: Record<string, string>
}

export type MasterDataImportDetectedSheet = {
  sheetName: string
  normalizedSheetName: string
  detectedType: MasterDataImportRecordType
  inferred: boolean
  blocked: boolean
  reason: string
  headerMap: Record<string, string>
  rowCount: number
}

export type MasterDataImportPreviewRow = {
  id: string
  sourceRowNumber: number
  sourceSheetName: string
  sourceType: MasterDataImportSourceType
  normalizedRecordType: MasterDataImportRecordType
  name_th: string
  name_en: string
  cmu_mail: string
  unitOrDivision: string
  department: string
  position: string
  status: string
  advisor_candidate: string
  validationStatus: MasterDataImportValidationStatus
  messages: MasterDataImportMessage[]
  mappingRequired: boolean
  mappingStatus: MasterDataImportMappingStatus
  blocked: boolean
}

export type MasterDataImportValidationSummary = {
  total_rows: number
  valid_rows: number
  warning_rows: number
  error_rows: number
  duplicate_email_count: number
  missing_email_count: number
  unresolved_mapping_count: number
  blocked_rows: number
  ready_to_confirm: boolean
}

export type MasterDataImportMappingCase = {
  id: string
  sourceRowNumber: number
  sourceSheetName: string
  recordType: MasterDataImportRecordType
  caseType:
    | 'duplicate_name'
    | 'missing_cmu_mail'
    | 'unknown_department'
    | 'unknown_unit'
    | 'staff_teacher_overlap'
    | 'unresolved_advisor_candidate'
    | 'responsible_person_unmatched'
  displayName: string
  reason: string
  status: MasterDataImportMappingStatus
}

export type MasterDataImportPreviewResult = {
  fileName: string
  sourceType: MasterDataImportSourceType
  sheets: MasterDataImportDetectedSheet[]
  rows: MasterDataImportPreviewRow[]
  mappingQueue: MasterDataImportMappingCase[]
  summary: MasterDataImportValidationSummary
  createdAt: string
}

export type ParsedWorkbookSheet = {
  sheetName: string
  rows: MasterDataImportRawRow[]
  headerMap: Record<string, string>
}
