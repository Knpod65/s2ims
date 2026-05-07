import type { ApplicationStatus, ScholarshipStatus, AnnouncementStatus } from './types'

export const APP_STATUS_MAP: Record<ApplicationStatus, { th: string; en: string; color: string; icon: string }> = {
  DRAFT:               { th: 'ร่าง',           en: 'Draft',              color: 'bg-surface-low text-ink-2 border-line',             icon: '✏️' },
  SUBMITTED:           { th: 'ส่งแล้ว',         en: 'Submitted',          color: 'bg-blue-50 text-blue-700 border-blue-200',           icon: '📨' },
  UNDER_REVIEW:        { th: 'กำลังพิจารณา',     en: 'Under Review',       color: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',       icon: '🔍' },
  NEEDS_DOCS:          { th: 'ต้องการเอกสาร',    en: 'Needs Documents',    color: 'bg-red-50 text-red-700 border-red-200',             icon: '📄' },
  SHORTLISTED:         { th: 'ผ่านคัดเลือก',     en: 'Shortlisted',        color: 'bg-blue-50 text-blue-700 border-blue-200',           icon: '⭐' },
  INTERVIEW_SCHEDULED: { th: 'นัดสัมภาษณ์แล้ว',  en: 'Interview Scheduled', color: 'bg-violet-50 text-violet-700 border-violet-200',   icon: '📅' },
  AWARDED:             { th: 'ได้รับทุน',         en: 'Awarded',            color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🏆' },
  NOT_AWARDED:         { th: 'ไม่ผ่าน',          en: 'Not Awarded',        color: 'bg-surface-low text-ink-2 border-line',             icon: '❌' },
  CONFIRMED:           { th: 'ยืนยันแล้ว',        en: 'Confirmed',          color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✅' },
  FINANCE_PENDING:     { th: 'รอเอกสารการเงิน',   en: 'Finance Docs Needed', color: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',      icon: '💳' },
  PAYMENT_PROCESSING:  { th: 'กำลังดำเนินการ',    en: 'Processing Payment',  color: 'bg-violet-50 text-violet-700 border-violet-200',   icon: '⚙️' },
  COMPLETED:           { th: 'เสร็จสิ้น',         en: 'Completed',          color: 'bg-teal-50 text-teal-700 border-teal-200',          icon: '🎓' },
  FOLLOW_UP_REQUIRED:  { th: 'ต้องส่งรายงาน',     en: 'Follow-up Required', color: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',       icon: '📋' },
  REPORT_OVERDUE:      { th: 'รายงานล่าช้า',       en: 'Report Overdue',     color: 'bg-red-50 text-red-700 border-red-200',             icon: '⚠️' },
}

export const SCH_STATUS_MAP: Record<ScholarshipStatus, { th: string; en: string; color: string }> = {
  DRAFT:        { th: 'ร่าง',       en: 'Draft',        color: 'bg-surface-low text-ink-2 border-line' },
  SUBMITTED:    { th: 'ส่งแล้ว',    en: 'Submitted',    color: 'bg-blue-50 text-blue-700 border-blue-200' },
  UNDER_REVIEW: { th: 'รออนุมัติ',  en: 'Under Review', color: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]' },
  PUBLISHED:    { th: 'เผยแพร่แล้ว', en: 'Published',   color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  OPEN:         { th: 'เปิดรับสมัคร', en: 'Open',       color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CLOSED:       { th: 'ปิดรับแล้ว', en: 'Closed',       color: 'bg-surface-low text-ink-2 border-line' },
  AWARDED:      { th: 'มอบทุนแล้ว', en: 'Awarded',      color: 'bg-teal-50 text-teal-700 border-teal-200' },
}

export const ANN_STATUS_MAP: Record<AnnouncementStatus, { th: string; en: string; color: string }> = {
  DRAFT:              { th: 'ร่าง',         en: 'Draft',              color: 'bg-surface-low text-ink-2 border-line' },
  SUBMITTED:          { th: 'ส่งรออนุมัติ', en: 'Pending ESQ',        color: 'bg-blue-50 text-blue-700 border-blue-200' },
  UNDER_REVIEW:       { th: 'กำลังตรวจสอบ', en: 'Under Review',       color: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]' },
  APPROVED:           { th: 'อนุมัติแล้ว',  en: 'Approved',           color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  PUBLISHED:          { th: 'เผยแพร่แล้ว', en: 'Published',           color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REVISION_REQUESTED: { th: 'ขอแก้ไข',     en: 'Revision Requested', color: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]' },
  REJECTED:           { th: 'ไม่อนุมัติ',  en: 'Rejected',           color: 'bg-red-50 text-red-700 border-red-200' },
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
  if (days <= 7) return 'text-role-primary'
  return 'text-ink-2'
}

export function confidenceColor(c: number): string {
  if (c >= 0.85) return 'text-status-success'
  if (c >= 0.5) return 'text-role-primary'
  return 'text-status-danger'
}
