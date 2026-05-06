import type { ApplicationStatus, ScholarshipStatus, AnnouncementStatus } from './types'

export const APP_STATUS_MAP: Record<ApplicationStatus, { th: string; en: string; color: string; icon: string }> = {
  DRAFT:               { th: 'ร่าง',           en: 'Draft',              color: 'bg-ink-3/20 text-ink-2 border-ink-3/30',                       icon: '✏️' },
  SUBMITTED:           { th: 'ส่งแล้ว',         en: 'Submitted',          color: 'bg-status-info/15 text-blue-300 border-status-info/25',         icon: '📨' },
  UNDER_REVIEW:        { th: 'กำลังพิจารณา',     en: 'Under Review',       color: 'bg-brand/15 text-brand-light border-brand/25',                  icon: '🔍' },
  NEEDS_DOCS:          { th: 'ต้องการเอกสาร',    en: 'Needs Documents',    color: 'bg-status-danger/15 text-red-300 border-status-danger/25',      icon: '📄' },
  SHORTLISTED:         { th: 'ผ่านคัดเลือก',     en: 'Shortlisted',        color: 'bg-status-info/15 text-blue-300 border-status-info/25',         icon: '⭐' },
  INTERVIEW_SCHEDULED: { th: 'นัดสัมภาษณ์แล้ว',  en: 'Interview Scheduled', color: 'bg-status-ai/15 text-purple-300 border-status-ai/25',          icon: '📅' },
  AWARDED:             { th: 'ได้รับทุน',         en: 'Awarded',            color: 'bg-status-success/15 text-green-300 border-status-success/25',  icon: '🏆' },
  NOT_AWARDED:         { th: 'ไม่ผ่าน',          en: 'Not Awarded',        color: 'bg-ink-3/20 text-ink-2 border-ink-3/30',                       icon: '❌' },
  CONFIRMED:           { th: 'ยืนยันแล้ว',        en: 'Confirmed',          color: 'bg-status-success/15 text-green-300 border-status-success/25',  icon: '✅' },
  FINANCE_PENDING:     { th: 'รอเอกสารการเงิน',   en: 'Finance Docs Needed', color: 'bg-brand/15 text-brand-light border-brand/25',                 icon: '💳' },
  PAYMENT_PROCESSING:  { th: 'กำลังดำเนินการ',    en: 'Processing Payment',  color: 'bg-status-ai/15 text-purple-300 border-status-ai/25',          icon: '⚙️' },
  COMPLETED:           { th: 'เสร็จสิ้น',         en: 'Completed',          color: 'bg-status-track/15 text-teal-300 border-status-track/25',      icon: '🎓' },
  FOLLOW_UP_REQUIRED:  { th: 'ต้องส่งรายงาน',     en: 'Follow-up Required', color: 'bg-brand/15 text-brand-light border-brand/25',                  icon: '📋' },
  REPORT_OVERDUE:      { th: 'รายงานล่าช้า',       en: 'Report Overdue',     color: 'bg-status-danger/15 text-red-300 border-status-danger/25',      icon: '⚠️' },
}

export const SCH_STATUS_MAP: Record<ScholarshipStatus, { th: string; en: string; color: string }> = {
  DRAFT:        { th: 'ร่าง',       en: 'Draft',        color: 'bg-ink-3/20 text-ink-2 border-ink-3/30' },
  SUBMITTED:    { th: 'ส่งแล้ว',    en: 'Submitted',    color: 'bg-status-info/15 text-blue-300 border-status-info/25' },
  UNDER_REVIEW: { th: 'รออนุมัติ',  en: 'Under Review', color: 'bg-brand/15 text-brand-light border-brand/25' },
  PUBLISHED:    { th: 'เผยแพร่แล้ว', en: 'Published',   color: 'bg-status-success/15 text-green-300 border-status-success/25' },
  OPEN:         { th: 'เปิดรับสมัคร', en: 'Open',       color: 'bg-status-success/15 text-green-300 border-status-success/25' },
  CLOSED:       { th: 'ปิดรับแล้ว', en: 'Closed',       color: 'bg-ink-3/20 text-ink-2 border-ink-3/30' },
  AWARDED:      { th: 'มอบทุนแล้ว', en: 'Awarded',      color: 'bg-status-track/15 text-teal-300 border-status-track/25' },
}

export const ANN_STATUS_MAP: Record<AnnouncementStatus, { th: string; en: string; color: string }> = {
  DRAFT:              { th: 'ร่าง',         en: 'Draft',              color: 'bg-ink-3/20 text-ink-2 border-ink-3/30' },
  SUBMITTED:          { th: 'ส่งรออนุมัติ', en: 'Pending ESQ',        color: 'bg-status-info/15 text-blue-300 border-status-info/25' },
  UNDER_REVIEW:       { th: 'กำลังตรวจสอบ', en: 'Under Review',       color: 'bg-brand/15 text-brand-light border-brand/25' },
  APPROVED:           { th: 'อนุมัติแล้ว',  en: 'Approved',           color: 'bg-status-success/15 text-green-300 border-status-success/25' },
  PUBLISHED:          { th: 'เผยแพร่แล้ว', en: 'Published',           color: 'bg-status-success/15 text-green-300 border-status-success/25' },
  REVISION_REQUESTED: { th: 'ขอแก้ไข',     en: 'Revision Requested', color: 'bg-brand/15 text-brand-light border-brand/25' },
  REJECTED:           { th: 'ไม่อนุมัติ',  en: 'Rejected',           color: 'bg-status-danger/15 text-red-300 border-status-danger/25' },
}

export function formatAmount(n: number): string {
  return n.toLocaleString('th-TH') + ' บาท'
}

export function formatAmountEn(n: number): string {
  return '฿' + n.toLocaleString('en-US')
}

export function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function deadlineColor(days: number): string {
  if (days < 0) return 'text-ink-3'
  if (days <= 1) return 'text-status-danger animate-pulse-soft'
  if (days <= 3) return 'text-status-danger'
  if (days <= 7) return 'text-brand'
  return 'text-ink-2'
}

export function confidenceColor(c: number): string {
  if (c >= 0.85) return 'text-status-success'
  if (c >= 0.5) return 'text-brand'
  return 'text-status-danger'
}
