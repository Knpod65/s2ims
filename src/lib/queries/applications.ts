// Pure query helpers for mockApplications (staff queue + shared application logic)
// All functions are pure, accept data as arguments, produce no side effects.

import type { Application } from '@/lib/types'
import type { DocumentVerificationState } from '@/data/mock/staffData'

export const ACTION_NEEDED_STATUSES = ['NEEDS_DOCS', 'FOLLOW_UP_REQUIRED', 'REPORT_OVERDUE'] as const
export type ActionNeededStatus = typeof ACTION_NEEDED_STATUSES[number]

export interface DocumentStatusSummary {
  pending: number
  rejected: number
  verified: number
  total: number
}

export function getDocumentStatusSummary(
  appId: string,
  docStates: Record<string, DocumentVerificationState[]>
): DocumentStatusSummary | null {
  const docs = docStates[appId] || []
  if (docs.length === 0) return null
  const pending = docs.filter((d) => d.status === 'pending').length
  const rejected = docs.filter((d) => d.status === 'rejected').length
  const verified = docs.filter((d) => d.status === 'verified').length
  return { pending, rejected, verified, total: docs.length }
}

export function isActionNeeded(status: string): boolean {
  return (ACTION_NEEDED_STATUSES as readonly string[]).includes(status)
}

export function filterStaffApplications(
  applications: Application[],
  search: string,
  statusFilter: string,
  lang: 'th' | 'en'
): Application[] {
  return applications.filter(a => {
    const title = lang === 'th' ? a.scholarship_title_th : a.scholarship_title_en
    const matchSearch = title.toLowerCase().includes(search.toLowerCase()) || a.student_id.includes(search)
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })
}

export interface StaffQueueStats {
  total: number
  needsAttention: number
  documentIssues: number
  allClear: number
}

export function getStaffQueueStats(
  filteredApplications: Application[],
  docStates: Record<string, DocumentVerificationState[]>
): StaffQueueStats {
  return filteredApplications.reduce(
    (acc, app) => {
      const docStatus = getDocumentStatusSummary(app.id, docStates)
      const actionNeeded = isActionNeeded(app.status)
      if (actionNeeded) acc.needsAttention += 1
      if (docStatus && (docStatus.rejected > 0 || docStatus.pending > 0)) acc.documentIssues += 1
      if (docStatus && docStatus.total > 0 && docStatus.rejected === 0 && docStatus.pending === 0) acc.allClear += 1
      return acc
    },
    { total: filteredApplications.length, needsAttention: 0, documentIssues: 0, allClear: 0 }
  )
}
