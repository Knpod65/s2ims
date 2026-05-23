// Pure query helpers for studentApplications (student-facing application tracking)
// All functions are pure, accept data as arguments, produce no side effects.

import type {
  StudentApplicationRecord,
  StudentApplicationState,
} from '@/data/mock/studentApplicationData'

import { computeDaysUntil } from './utils'

export const STUDENT_APPLICATION_FILTERS: Array<StudentApplicationState | 'all'> = [
  'all',
  'draft',
  'revision_requested',
  'in_review',
  'approved',
]

const BAD_DOCUMENT_STATES = ['missing', 'invalid_file_type', 'rejected', 'needs_replacement'] as const

export function listStudentApplications(
  applications: StudentApplicationRecord[],
  filter: StudentApplicationState | 'all'
): StudentApplicationRecord[] {
  if (filter === 'all') return applications
  return applications.filter(application => application.state === filter)
}

export interface StudentApplicationStats {
  total: number
  revisionCount: number
  missingDocumentCount: number
  nearestDeadline: number
}

export function getStudentApplicationStats(
  applications: StudentApplicationRecord[]
): StudentApplicationStats {
  const total = applications.length
  const revisionCount = applications.filter(application => application.state === 'revision_requested').length

  const missingDocumentCount = applications.reduce(
    (count, application) =>
      count + application.documents.filter(doc => BAD_DOCUMENT_STATES.includes(doc.state as any)).length,
    0,
  )

  const nearestDeadline =
    applications.length > 0
      ? Math.min(...applications.map(application => Math.max(0, computeDaysUntil(application.deadline))))
      : 0

  return { total, revisionCount, missingDocumentCount, nearestDeadline }
}
