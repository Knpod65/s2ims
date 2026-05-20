import type {
  MasterDataImportDetectedSheet,
  MasterDataImportRecordType,
  MasterDataImportRawRow,
  MasterDataImportSourceType,
  ParsedWorkbookSheet,
} from './types'

const HEADER_ALIASES: Record<string, string> = {
  cmu_mail: 'cmu_mail',
  cmu_email: 'cmu_mail',
  official_email: 'cmu_mail',
  mail: 'cmu_mail',
  email_cmu: 'cmu_mail',
  name_th: 'name_th',
  thai_name: 'name_th',
  full_name_th: 'name_th',
  name: 'name_th',
  fullname: 'name_th',
  full_name: 'name_th',
  display_name: 'name_th',
  name_en: 'name_en',
  english_name: 'name_en',
  full_name_en: 'name_en',
  employee_id: 'employee_id',
  staff_id: 'employee_id',
  teacher_id: 'teacher_id',
  lecturer_id: 'teacher_id',
  unit: 'unit',
  division: 'division',
  department: 'department',
  dept: 'department',
  position: 'position',
  role: 'position',
  status: 'status',
  employment_status: 'status',
  active_status: 'status',
  advisor_candidate: 'advisor_candidate',
  advisor: 'advisor_candidate',
  responsible_person: 'responsible_person',
  responsibility_type: 'responsibility_type',
  student_id: 'student_id',
  student_name: 'student_name',
  student_email: 'student_email',
  enrollment: 'enrollment',
  course_code: 'course_code',
  opencourse: 'opencourse',
}

const STUDENT_PII_HEADERS = new Set([
  'student_id',
  'student_name',
  'student_email',
  'national_id',
  'phone',
  'mobile',
])

export function normalizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function normalizeHeader(value: string): string {
  const token = normalizeToken(value)
  return HEADER_ALIASES[token] ?? token
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function normalizeCellValue(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'object' && 'text' in value && typeof value.text === 'string') {
    return value.text.trim()
  }
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).trim()
}

export function createHeaderMap(headers: string[]): Record<string, string> {
  const map: Record<string, string> = {}
  headers.forEach((header) => {
    const normalized = normalizeHeader(header)
    if (normalized) map[normalized] = header
  })
  return map
}

export function hasStudentPiiHeaders(headerMap: Record<string, string>): boolean {
  return Object.keys(headerMap).some((key) => STUDENT_PII_HEADERS.has(key))
}

export function detectRecordTypeForSheet(
  sheetName: string,
  headerMap: Record<string, string>,
  selectedSourceType: MasterDataImportSourceType
): Pick<MasterDataImportDetectedSheet, 'detectedType' | 'inferred' | 'blocked' | 'reason'> {
  const normalizedSheetName = normalizeToken(sheetName)
  const headers = new Set(Object.keys(headerMap))

  if (selectedSourceType === 'student_enrollment_future' || hasStudentPiiHeaders(headerMap)) {
    return {
      detectedType: 'future_only',
      inferred: normalizedSheetName !== 'student' && normalizedSheetName !== 'enrollment',
      blocked: true,
      reason: 'Student/enrollment source is future-only and blocked from broad import.',
    }
  }

  if (selectedSourceType === 'lecturer_future' || normalizedSheetName.includes('lecturer')) {
    return {
      detectedType: 'future_only',
      inferred: normalizedSheetName !== 'lecturer',
      blocked: true,
      reason: 'Lecturer source is future-only until governance approves broader import.',
    }
  }

  if (selectedSourceType === 'opencourse_future' || normalizedSheetName.includes('opencourse')) {
    return {
      detectedType: 'future_only',
      inferred: true,
      blocked: true,
      reason: 'OpenCourse source is future-only until governance approves broader import.',
    }
  }

  if (selectedSourceType === 'responsible_person_assignment') {
    return {
      detectedType: 'responsible_person_assignment',
      inferred: normalizedSheetName !== 'responsible_person' && normalizedSheetName !== 'assignment',
      blocked: false,
      reason: 'Responsible person assignment draft selected by admin.',
    }
  }

  if (selectedSourceType === 'account_profile') {
    return {
      detectedType: 'account_profile',
      inferred: normalizedSheetName !== 'account' && normalizedSheetName !== 'profile',
      blocked: false,
      reason: 'Account profile draft selected by admin.',
    }
  }

  if (normalizedSheetName.includes('staff')) {
    return { detectedType: 'staff', inferred: false, blocked: false, reason: 'Explicit staff sheet name.' }
  }

  if (normalizedSheetName.includes('teacher')) {
    return { detectedType: 'teacher', inferred: false, blocked: false, reason: 'Explicit teacher sheet name.' }
  }

  if (selectedSourceType === 'staff_master') {
    return { detectedType: 'staff', inferred: true, blocked: false, reason: 'Staff master source type selected.' }
  }

  if (selectedSourceType === 'teacher_master') {
    return { detectedType: 'teacher', inferred: true, blocked: false, reason: 'Teacher master source type selected.' }
  }

  if (headers.has('teacher_id') || headers.has('advisor_candidate') || headers.has('department')) {
    return { detectedType: 'teacher', inferred: true, blocked: false, reason: 'Teacher-like columns detected.' }
  }

  if (headers.has('employee_id') || headers.has('unit') || headers.has('division')) {
    return { detectedType: 'staff', inferred: true, blocked: false, reason: 'Staff-like columns detected.' }
  }

  if (normalizedSheetName.includes('personnel')) {
    return { detectedType: 'unknown', inferred: false, blocked: false, reason: 'Personnel sheet requires row-level separation.' }
  }

  return { detectedType: 'unknown', inferred: true, blocked: true, reason: 'Unknown source type.' }
}

export function detectSheets(
  sheets: ParsedWorkbookSheet[],
  sourceType: MasterDataImportSourceType
): MasterDataImportDetectedSheet[] {
  return sheets.map((sheet) => {
    const detected = detectRecordTypeForSheet(sheet.sheetName, sheet.headerMap, sourceType)
    return {
      sheetName: sheet.sheetName,
      normalizedSheetName: normalizeToken(sheet.sheetName),
      headerMap: sheet.headerMap,
      rowCount: sheet.rows.length,
      ...detected,
    }
  })
}

export function inferRecordTypeForRow(
  sheetType: MasterDataImportRecordType,
  row: MasterDataImportRawRow
): MasterDataImportRecordType {
  if (sheetType !== 'unknown') return sheetType
  if (row.values.teacher_id || row.values.advisor_candidate || row.values.department) return 'teacher'
  if (row.values.employee_id || row.values.unit || row.values.division) return 'staff'
  return 'unknown'
}
