// Pure query helpers for ESQ mock data (dashboard review queue)
// All functions are pure, accept data as arguments, produce no side effects.
// Language must remain "recommendation / review support" — never "approval".

export interface EsqReviewSummary {
  pendingCount: number
  approvedCount: number
  urgentCount: number
}

export function getPendingAnnouncements<T extends { status: string }>(announcements: T[]): T[] {
  return announcements.filter(a => a.status === 'SUBMITTED')
}

export function getApprovedAnnouncements<T extends { status: string }>(announcements: T[]): T[] {
  return announcements.filter(a => a.status === 'APPROVED')
}

export function getUrgentAnnouncements<T extends { sla_hours?: number }>(pending: T[]): T[] {
  return pending.filter(a => a.sla_hours !== undefined && a.sla_hours < 24)
}

export function getEsqReviewQueueSummary<T extends { status: string; sla_hours?: number }>(
  announcements: T[]
): EsqReviewSummary {
  const pending = getPendingAnnouncements(announcements)
  const approved = getApprovedAnnouncements(announcements)
  const urgent = getUrgentAnnouncements(pending)
  return {
    pendingCount: pending.length,
    approvedCount: approved.length,
    urgentCount: urgent.length,
  }
}
