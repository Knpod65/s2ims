// Pure query helpers for provider mock data (dashboard + shared provider logic)
// All functions are pure, accept data as arguments, produce no side effects.

import type { Scholarship } from '@/data/mock/providerData'

export function getActiveScholarships(scholarships: Scholarship[]): Scholarship[] {
  return scholarships.filter(s => s.status === 'ACTIVE')
}

export function getPendingShortlistRequests(scholarships: Scholarship[]): Scholarship[] {
  return scholarships.filter(s => s.shortlistStatus === 'pending_staff_approval')
}
