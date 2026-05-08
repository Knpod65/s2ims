export const CANDIDATE_TOKEN_FORMAT = 'Candidate #C-XXXX'
export const STUDENT_TOKEN_FORMAT = 'Student #S-XXXX'
export const AUDIT_EVENT_TOKEN_FORMAT = 'Audit #A-XXXX'

export const TOKEN_SUFFIX_LENGTH = 4
export const CANDIDATE_TOKEN_PREFIX = 'Candidate #C-'
export const STUDENT_TOKEN_PREFIX = 'Student #S-'
export const AUDIT_EVENT_TOKEN_PREFIX = 'Audit #A-'

export function normalizeTokenSuffix(id: string | number): string {
  const cleaned = String(id).replace(/[^a-zA-Z0-9]/g, '')
  return cleaned.slice(-TOKEN_SUFFIX_LENGTH).toUpperCase().padStart(TOKEN_SUFFIX_LENGTH, '0')
}

export function formatCandidateToken(id: string | number): string {
  return `${CANDIDATE_TOKEN_PREFIX}${normalizeTokenSuffix(id)}`
}

export function formatStudentToken(id: string | number): string {
  return `${STUDENT_TOKEN_PREFIX}${normalizeTokenSuffix(id)}`
}

export function formatAuditEventToken(id: string | number): string {
  return `${AUDIT_EVENT_TOKEN_PREFIX}${normalizeTokenSuffix(id)}`
}
