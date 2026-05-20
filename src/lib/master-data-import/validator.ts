import {
  detectSheets,
  hasStudentPiiHeaders,
  inferRecordTypeForRow,
  normalizeEmail,
} from './normalization'
import type {
  MasterDataImportMappingCase,
  MasterDataImportMessage,
  MasterDataImportPreviewResult,
  MasterDataImportPreviewRow,
  MasterDataImportRecordType,
  MasterDataImportSourceType,
  MasterDataImportValidationSummary,
  ParsedWorkbookSheet,
} from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INACTIVE_VALUES = new Set(['inactive', 'disabled', 'ลาออก', 'retired'])

function makeMessage(message: MasterDataImportMessage): MasterDataImportMessage {
  return message
}

function displayNameFromRow(values: Record<string, string>): { name_th: string; name_en: string } {
  const name_th = values.name_th || values.full_name || values.name || ''
  const name_en = values.name_en || ''
  return { name_th, name_en }
}

function buildPreviewRow(
  sheetName: string,
  sourceType: MasterDataImportSourceType,
  rowType: MasterDataImportRecordType,
  sourceRowNumber: number,
  values: Record<string, string>,
  sheetBlocked: boolean,
  sheetReason: string,
  sheetInferred: boolean
): MasterDataImportPreviewRow {
  const { name_th, name_en } = displayNameFromRow(values)
  const cmuMail = normalizeEmail(values.cmu_mail || '')
  const unitOrDivision = values.unit || values.division || ''
  const department = values.department || ''
  const status = values.status || ''
  const messages: MasterDataImportMessage[] = []

  if (sheetBlocked) {
    messages.push(makeMessage({
      severity: 'error',
      code: sheetReason.includes('Student') ? 'student_pii_detected' : sheetReason.includes('future') ? 'future_source_blocked' : 'unknown_source_type',
      field: 'source_type',
      reason: sheetReason,
      suggestedAction: 'Use Staff_Master or Teacher_Master source only for MC54 preview.',
    }))
  }

  if (sheetInferred && !sheetBlocked) {
    messages.push(makeMessage({
      severity: 'warning',
      code: 'sheet_inferred_requires_confirmation',
      field: 'sheet',
      reason: 'Sheet type was inferred from source selection or columns.',
      suggestedAction: 'Review sheet detection before any future import approval.',
    }))
  }

  if (!name_th && !name_en) {
    messages.push(makeMessage({
      severity: 'error',
      code: 'missing_required_name',
      field: 'name',
      reason: 'Required name is missing.',
      suggestedAction: 'Add Thai or English name before import.',
    }))
  }

  if (!cmuMail) {
    messages.push(makeMessage({
      severity: 'warning',
      code: 'missing_cmu_mail',
      field: 'cmu_mail',
      reason: 'cmu_mail is missing.',
      suggestedAction: 'Resolve through manual mapping; do not use personal email fallback.',
    }))
  } else if (!EMAIL_PATTERN.test(cmuMail)) {
    messages.push(makeMessage({
      severity: 'error',
      code: 'invalid_email_format',
      field: 'cmu_mail',
      reason: 'cmu_mail format is invalid.',
      suggestedAction: 'Correct the official CMU email value.',
    }))
  }

  if (rowType === 'teacher' && !department) {
    messages.push(makeMessage({
      severity: 'warning',
      code: 'missing_department',
      field: 'department',
      reason: 'Teacher department is missing.',
      suggestedAction: 'Map or confirm department before future import.',
    }))
  }

  if (rowType === 'staff' && !unitOrDivision) {
    messages.push(makeMessage({
      severity: 'warning',
      code: 'missing_unit',
      field: 'unit',
      reason: 'Staff unit/division is missing.',
      suggestedAction: 'Map or confirm unit/division before future import.',
    }))
  }

  if (rowType === 'teacher' && !values.advisor_candidate) {
    messages.push(makeMessage({
      severity: 'warning',
      code: 'advisor_candidate_unresolved',
      field: 'advisor_candidate',
      reason: 'Advisor candidate flag is not set.',
      suggestedAction: 'Confirm advisor eligibility before using this row for assignment.',
    }))
  }

  if (sourceType === 'responsible_person_assignment' && !values.responsible_person && !cmuMail) {
    messages.push(makeMessage({
      severity: 'error',
      code: 'responsible_person_unmatched',
      field: 'responsible_person',
      reason: 'Responsible person assignment has no matched person.',
      suggestedAction: 'Match assignment to Staff_Master or Teacher_Master before activation.',
    }))
  }

  if (INACTIVE_VALUES.has(status.toLowerCase())) {
    messages.push(makeMessage({
      severity: 'warning',
      code: 'inactive_record',
      field: 'status',
      reason: 'Source row appears inactive.',
      suggestedAction: 'Acknowledge or exclude inactive records before future import.',
    }))
  }

  const hasError = messages.some((message) => message.severity === 'error')
  const hasWarning = messages.some((message) => message.severity === 'warning')
  const mappingRequired = messages.some((message) =>
    ['missing_cmu_mail', 'missing_department', 'missing_unit', 'advisor_candidate_unresolved', 'responsible_person_unmatched'].includes(message.code)
  )

  return {
    id: `${sheetName}:${sourceRowNumber}`,
    sourceRowNumber,
    sourceSheetName: sheetName,
    sourceType,
    normalizedRecordType: rowType,
    name_th,
    name_en,
    cmu_mail: cmuMail,
    unitOrDivision,
    department,
    position: values.position || '',
    status,
    advisor_candidate: values.advisor_candidate || '',
    validationStatus: hasError ? 'error' : hasWarning ? 'warning' : messages.length > 0 ? 'info' : 'valid',
    messages,
    mappingRequired,
    mappingStatus: mappingRequired ? 'unresolved' : 'not_required',
    blocked: hasError || mappingRequired,
  }
}

function applyCrossRowValidation(rows: MasterDataImportPreviewRow[]): MasterDataImportPreviewRow[] {
  const byEmail = new Map<string, MasterDataImportPreviewRow[]>()
  const byName = new Map<string, MasterDataImportPreviewRow[]>()

  rows.forEach((row) => {
    if (row.cmu_mail) {
      byEmail.set(row.cmu_mail, [...(byEmail.get(row.cmu_mail) ?? []), row])
    }
    const nameKey = `${row.name_th || row.name_en}`.trim().toLowerCase()
    if (nameKey) {
      byName.set(nameKey, [...(byName.get(nameKey) ?? []), row])
    }
  })

  return rows.map((row) => {
    const messages = [...row.messages]
    const duplicates = row.cmu_mail ? byEmail.get(row.cmu_mail) ?? [] : []
    const sameNameRows = byName.get(`${row.name_th || row.name_en}`.trim().toLowerCase()) ?? []

    if (duplicates.length > 1) {
      messages.push(makeMessage({
        severity: 'error',
        code: 'duplicate_cmu_mail',
        field: 'cmu_mail',
        reason: 'Duplicate cmu_mail found in preview rows.',
        suggestedAction: 'Resolve duplicate email before future import.',
      }))
    }

    if (sameNameRows.length > 1 && new Set(sameNameRows.map((item) => item.cmu_mail || item.id)).size > 1) {
      messages.push(makeMessage({
        severity: 'warning',
        code: 'duplicate_display_name',
        field: 'name',
        reason: 'Duplicate display name appears with different row identity.',
        suggestedAction: 'Review whether these rows represent separate people.',
      }))
    }

    if (
      duplicates.length > 1 &&
      new Set(duplicates.map((item) => item.normalizedRecordType)).size > 1
    ) {
      messages.push(makeMessage({
        severity: 'warning',
        code: 'teacher_staff_overlap',
        field: 'cmu_mail',
        reason: 'Same cmu_mail appears across staff and teacher rows.',
        suggestedAction: 'Confirm whether this is one person with multiple roles.',
      }))
    }

    const hasError = messages.some((message) => message.severity === 'error')
    const hasWarning = messages.some((message) => message.severity === 'warning')
    const mappingRequired = messages.some((message) =>
      [
        'missing_cmu_mail',
        'missing_department',
        'missing_unit',
        'duplicate_display_name',
        'teacher_staff_overlap',
        'advisor_candidate_unresolved',
        'responsible_person_unmatched',
      ].includes(message.code)
    )

    return {
      ...row,
      messages,
      validationStatus: hasError ? 'error' : hasWarning ? 'warning' : messages.length > 0 ? 'info' : 'valid',
      mappingRequired,
      mappingStatus: mappingRequired ? 'unresolved' : row.mappingStatus,
      blocked: hasError || mappingRequired,
    }
  })
}

function createMappingQueue(rows: MasterDataImportPreviewRow[]): MasterDataImportMappingCase[] {
  return rows.flatMap((row) => {
    const displayName = row.name_th || row.name_en || `Row ${row.sourceRowNumber}`
    return row.messages
      .map((message): MasterDataImportMappingCase | null => {
        const base = {
          id: `${row.id}:${message.code}`,
          sourceRowNumber: row.sourceRowNumber,
          sourceSheetName: row.sourceSheetName,
          recordType: row.normalizedRecordType,
          displayName,
          reason: message.reason,
          status: 'unresolved' as const,
        }

        if (message.code === 'missing_cmu_mail') return { ...base, caseType: 'missing_cmu_mail' }
        if (message.code === 'missing_department') return { ...base, caseType: 'unknown_department' }
        if (message.code === 'missing_unit') return { ...base, caseType: 'unknown_unit' }
        if (message.code === 'duplicate_display_name') return { ...base, caseType: 'duplicate_name' }
        if (message.code === 'teacher_staff_overlap') return { ...base, caseType: 'staff_teacher_overlap' }
        if (message.code === 'advisor_candidate_unresolved') return { ...base, caseType: 'unresolved_advisor_candidate' }
        if (message.code === 'responsible_person_unmatched') return { ...base, caseType: 'responsible_person_unmatched' }
        return null
      })
      .filter((item): item is MasterDataImportMappingCase => item !== null)
  })
}

function summarize(rows: MasterDataImportPreviewRow[], mappingQueue: MasterDataImportMappingCase[]): MasterDataImportValidationSummary {
  const emailCounts = new Map<string, number>()
  rows.forEach((row) => {
    if (row.cmu_mail) emailCounts.set(row.cmu_mail, (emailCounts.get(row.cmu_mail) ?? 0) + 1)
  })

  const duplicateEmailCount = Array.from(emailCounts.values()).filter((count) => count > 1).reduce((sum, count) => sum + count, 0)

  return {
    total_rows: rows.length,
    valid_rows: rows.filter((row) => row.validationStatus === 'valid').length,
    warning_rows: rows.filter((row) => row.validationStatus === 'warning').length,
    error_rows: rows.filter((row) => row.validationStatus === 'error').length,
    duplicate_email_count: duplicateEmailCount,
    missing_email_count: rows.filter((row) => !row.cmu_mail).length,
    unresolved_mapping_count: mappingQueue.filter((item) => item.status === 'unresolved').length,
    blocked_rows: rows.filter((row) => row.blocked).length,
    ready_to_confirm: false,
  }
}

export function createMasterDataImportPreview(
  fileName: string,
  sourceType: MasterDataImportSourceType,
  parsedSheets: ParsedWorkbookSheet[]
): MasterDataImportPreviewResult {
  const detectedSheets = detectSheets(parsedSheets, sourceType)
  const rows = parsedSheets.flatMap((sheet) => {
    const detected = detectedSheets.find((item) => item.sheetName === sheet.sheetName)
    const sheetType = detected?.detectedType ?? 'unknown'
    const sheetBlocked = Boolean(detected?.blocked || hasStudentPiiHeaders(sheet.headerMap))
    const sheetReason = detected?.reason ?? 'Unknown source type.'
    const sheetInferred = Boolean(detected?.inferred)

    return sheet.rows.map((row) => {
      const rowType = inferRecordTypeForRow(sheetType, row)
      return buildPreviewRow(
        sheet.sheetName,
        sourceType,
        rowType,
        row.sourceRowNumber,
        row.values,
        sheetBlocked,
        sheetReason,
        sheetInferred
      )
    })
  })

  const validatedRows = applyCrossRowValidation(rows)
  const mappingQueue = createMappingQueue(validatedRows)

  return {
    fileName,
    sourceType,
    sheets: detectedSheets,
    rows: validatedRows,
    mappingQueue,
    summary: summarize(validatedRows, mappingQueue),
    createdAt: new Date().toISOString(),
  }
}
