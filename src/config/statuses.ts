export type BadgeTone =
  | 'neutral'
  | 'aurora'
  | 'emerald'
  | 'amber'
  | 'violet'
  | 'graphite'
  | 'success'
  | 'warning'

export interface StatusConfig {
  key: string
  label: {
    en: string
    th: string
  }
  semanticIntent: string
  recommendedBadgeTone: BadgeTone
  terminal: boolean
  requiresAction: boolean
  sensitiveAuditable: boolean
}

export interface StatusGroupConfig {
  group: string
  description: string
  statuses: readonly StatusConfig[]
}

export const APPLICATION_STATUSES = [
  {
    key: 'DRAFT',
    label: { en: 'Draft', th: 'ฉบับร่าง' },
    semanticIntent: 'Student can continue editing before submission.',
    recommendedBadgeTone: 'neutral',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: false,
  },
  {
    key: 'SUBMITTED',
    label: { en: 'Submitted', th: 'ส่งแล้ว' },
    semanticIntent: 'Application has been submitted for review.',
    recommendedBadgeTone: 'aurora',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'UNDER_REVIEW',
    label: { en: 'Under review', th: 'อยู่ระหว่างตรวจสอบ' },
    semanticIntent: 'Staff or scholarship team is reviewing the application.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'NEEDS_DOCS',
    label: { en: 'Documents needed', th: 'ต้องเพิ่มเอกสาร' },
    semanticIntent: 'Student should provide or replace documents.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
  {
    key: 'SHORTLISTED',
    label: { en: 'Shortlisted', th: 'ผ่านการคัดเลือกเบื้องต้น' },
    semanticIntent: 'Application is in a shortlist stage.',
    recommendedBadgeTone: 'success',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'INTERVIEW_SCHEDULED',
    label: { en: 'Interview scheduled', th: 'นัดสัมภาษณ์แล้ว' },
    semanticIntent: 'Student has an interview milestone.',
    recommendedBadgeTone: 'aurora',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
  {
    key: 'AWARDED',
    label: { en: 'Awarded', th: 'ได้รับทุน' },
    semanticIntent: 'Scholarship has been awarded.',
    recommendedBadgeTone: 'success',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
  {
    key: 'NOT_AWARDED',
    label: { en: 'Not awarded', th: 'ไม่ได้รับทุน' },
    semanticIntent: 'Application was not selected.',
    recommendedBadgeTone: 'neutral',
    terminal: true,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'CONFIRMED',
    label: { en: 'Confirmed', th: 'ยืนยันแล้ว' },
    semanticIntent: 'Student has confirmed award acceptance or required step.',
    recommendedBadgeTone: 'success',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'FINANCE_PENDING',
    label: { en: 'Finance pending', th: 'รอดำเนินการการเงิน' },
    semanticIntent: 'Finance processing has not completed.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'PAYMENT_PROCESSING',
    label: { en: 'Payment processing', th: 'กำลังดำเนินการจ่ายเงิน' },
    semanticIntent: 'Payment workflow is in progress.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'COMPLETED',
    label: { en: 'Completed', th: 'เสร็จสมบูรณ์' },
    semanticIntent: 'Application and award workflow is complete.',
    recommendedBadgeTone: 'success',
    terminal: true,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'FOLLOW_UP_REQUIRED',
    label: { en: 'Follow-up required', th: 'ต้องรายงานติดตามผล' },
    semanticIntent: 'Student should submit required follow-up information.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
  {
    key: 'REPORT_OVERDUE',
    label: { en: 'Report overdue', th: 'รายงานเกินกำหนด' },
    semanticIntent: 'Required follow-up report is late.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
] as const satisfies readonly StatusConfig[]

export const DOCUMENT_STATUSES = [
  {
    key: 'missing',
    label: { en: 'Add document', th: 'เพิ่มเอกสาร' },
    semanticIntent: 'Document has not been provided yet.',
    recommendedBadgeTone: 'neutral',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: false,
  },
  {
    key: 'pending',
    label: { en: 'Pending', th: 'รอตรวจสอบ' },
    semanticIntent: 'Document is present but not verified.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'uploading',
    label: { en: 'Uploading', th: 'กำลังอัปโหลด' },
    semanticIntent: 'Mock upload state is in progress.',
    recommendedBadgeTone: 'aurora',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: false,
  },
  {
    key: 'uploaded',
    label: { en: 'Uploaded', th: 'อัปโหลดแล้ว' },
    semanticIntent: 'Document upload has completed.',
    recommendedBadgeTone: 'aurora',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'invalid_file_type',
    label: { en: 'File type needs update', th: 'ต้องเปลี่ยนประเภทไฟล์' },
    semanticIntent: 'Provided file type is not accepted.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
  {
    key: 'verification_pending',
    label: { en: 'Verification pending', th: 'รอยืนยันเอกสาร' },
    semanticIntent: 'Document is awaiting verification.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'verified',
    label: { en: 'Verified', th: 'ยืนยันแล้ว' },
    semanticIntent: 'Document has passed verification.',
    recommendedBadgeTone: 'success',
    terminal: true,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'rejected',
    label: { en: 'Needs replacement', th: 'ต้องส่งเอกสารใหม่' },
    semanticIntent: 'Document cannot be accepted in its current form.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
  {
    key: 'needs_replacement',
    label: { en: 'Replace document', th: 'เปลี่ยนเอกสาร' },
    semanticIntent: 'Student should replace the current document.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
] as const satisfies readonly StatusConfig[]

export const SCHOLARSHIP_STATUSES = [
  {
    key: 'DRAFT',
    label: { en: 'Draft', th: 'ฉบับร่าง' },
    semanticIntent: 'Provider or staff is preparing the scholarship.',
    recommendedBadgeTone: 'neutral',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: false,
  },
  {
    key: 'SUBMITTED',
    label: { en: 'Submitted', th: 'ส่งตรวจแล้ว' },
    semanticIntent: 'Scholarship has been submitted for review.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'UNDER_REVIEW',
    label: { en: 'Under review', th: 'อยู่ระหว่างตรวจสอบ' },
    semanticIntent: 'Staff or governance reviewer is checking the scholarship.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'PENDING_REVIEW',
    label: { en: 'Pending review', th: 'รอตรวจสอบ' },
    semanticIntent: 'Scholarship is queued for staff review.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'PUBLISHED',
    label: { en: 'Published', th: 'เผยแพร่แล้ว' },
    semanticIntent: 'Scholarship is visible to eligible audiences.',
    recommendedBadgeTone: 'success',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'OPEN',
    label: { en: 'Open', th: 'เปิดรับสมัคร' },
    semanticIntent: 'Applications can be submitted.',
    recommendedBadgeTone: 'success',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: false,
  },
  {
    key: 'ACTIVE',
    label: { en: 'Active', th: 'ใช้งานอยู่' },
    semanticIntent: 'Provider-facing active scholarship state.',
    recommendedBadgeTone: 'emerald',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: false,
  },
  {
    key: 'CLOSED',
    label: { en: 'Closed', th: 'ปิดรับสมัคร' },
    semanticIntent: 'Application window has closed.',
    recommendedBadgeTone: 'neutral',
    terminal: true,
    requiresAction: false,
    sensitiveAuditable: false,
  },
  {
    key: 'AWARDED',
    label: { en: 'Awarded', th: 'ประกาศผลแล้ว' },
    semanticIntent: 'Award decisions have been made.',
    recommendedBadgeTone: 'success',
    terminal: true,
    requiresAction: false,
    sensitiveAuditable: true,
  },
] as const satisfies readonly StatusConfig[]

export const SHORTLIST_REQUEST_STATUSES = [
  {
    key: 'none',
    label: { en: 'Not requested', th: 'ยังไม่ขอ' },
    semanticIntent: 'No shortlist request has been made.',
    recommendedBadgeTone: 'neutral',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: false,
  },
  {
    key: 'draft',
    label: { en: 'Draft request', th: 'ร่างคำขอ' },
    semanticIntent: 'Provider is preparing a shortlist request.',
    recommendedBadgeTone: 'neutral',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: false,
  },
  {
    key: 'pending_staff_approval',
    label: { en: 'Pending Staff Approval', th: 'รออนุมัติจากเจ้าหน้าที่' },
    semanticIntent: 'Shortlist request is waiting for staff governance review.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'approved',
    label: { en: 'Approved', th: 'อนุมัติแล้ว' },
    semanticIntent: 'Staff has approved the shortlist request.',
    recommendedBadgeTone: 'success',
    terminal: true,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'declined',
    label: { en: 'Not approved', th: 'ไม่อนุมัติ' },
    semanticIntent: 'Staff did not approve the shortlist request.',
    recommendedBadgeTone: 'neutral',
    terminal: true,
    requiresAction: false,
    sensitiveAuditable: true,
  },
] as const satisfies readonly StatusConfig[]

export const CANDIDATE_POOL_STATUSES = [
  {
    key: 'not_available',
    label: { en: 'Not available', th: 'ยังไม่พร้อม' },
    semanticIntent: 'Candidate pool is not available for provider access yet.',
    recommendedBadgeTone: 'neutral',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: false,
  },
  {
    key: 'ready',
    label: { en: 'Ready', th: 'พร้อมใช้งาน' },
    semanticIntent: 'Candidate pool is available with tokenized and banded candidate data.',
    recommendedBadgeTone: 'emerald',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: false,
  },
  {
    key: 'pending_staff_approval',
    label: { en: 'Pending staff review', th: 'รอเจ้าหน้าที่ตรวจสอบ' },
    semanticIntent: 'Candidate pool availability is waiting for staff review.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
] as const satisfies readonly StatusConfig[]

export const REVIEW_STATUSES = [
  {
    key: 'pending',
    label: { en: 'Pending', th: 'รอดำเนินการ' },
    semanticIntent: 'Review has not started.',
    recommendedBadgeTone: 'neutral',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: false,
  },
  {
    key: 'in_review',
    label: { en: 'In review', th: 'กำลังตรวจสอบ' },
    semanticIntent: 'Reviewer is actively reviewing the item.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'revision_requested',
    label: { en: 'Revision requested', th: 'ขอให้แก้ไข' },
    semanticIntent: 'Owner should update the item and resubmit.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
  {
    key: 'approved',
    label: { en: 'Approved', th: 'อนุมัติแล้ว' },
    semanticIntent: 'Reviewer approved the item.',
    recommendedBadgeTone: 'success',
    terminal: true,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'rejected',
    label: { en: 'Not approved', th: 'ไม่อนุมัติ' },
    semanticIntent: 'Reviewer rejected the item without exposing sensitive detail in the status label.',
    recommendedBadgeTone: 'neutral',
    terminal: true,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'overridden',
    label: { en: 'Overridden', th: 'มีการปรับผลโดยเจ้าหน้าที่' },
    semanticIntent: 'A reviewer manually changed a system decision.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'resolved',
    label: { en: 'Resolved', th: 'แก้ไขแล้ว' },
    semanticIntent: 'Review issue has been resolved.',
    recommendedBadgeTone: 'success',
    terminal: true,
    requiresAction: false,
    sensitiveAuditable: true,
  },
] as const satisfies readonly StatusConfig[]

export const DISCLOSURE_REQUEST_STATUSES = [
  {
    key: 'pending_staff_approval',
    label: { en: 'Pending staff approval', th: 'รอเจ้าหน้าที่อนุมัติ' },
    semanticIntent: 'Disclosure request is queued for privacy review.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
  {
    key: 'approved',
    label: { en: 'Approved', th: 'อนุมัติแล้ว' },
    semanticIntent: 'Disclosure request was approved with governance controls.',
    recommendedBadgeTone: 'success',
    terminal: true,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'rejected',
    label: { en: 'Not approved', th: 'ไม่อนุมัติ' },
    semanticIntent: 'Disclosure request was rejected without revealing identity.',
    recommendedBadgeTone: 'neutral',
    terminal: true,
    requiresAction: false,
    sensitiveAuditable: true,
  },
] as const satisfies readonly StatusConfig[]

export const AUDIT_RISK_STATUSES = [
  {
    key: 'low',
    label: { en: 'Low risk', th: 'ความเสี่ยงต่ำ' },
    semanticIntent: 'Routine event with limited sensitive exposure.',
    recommendedBadgeTone: 'neutral',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'medium',
    label: { en: 'Medium risk', th: 'ความเสี่ยงปานกลาง' },
    semanticIntent: 'Event involves sensitive context or privileged access.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: true,
  },
  {
    key: 'high',
    label: { en: 'High risk', th: 'ความเสี่ยงสูง' },
    semanticIntent: 'Event involves identity disclosure, export, or manual override.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
  {
    key: 'critical',
    label: { en: 'Critical risk', th: 'ความเสี่ยงวิกฤต' },
    semanticIntent: 'Event requires immediate governance review.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
] as const satisfies readonly StatusConfig[]

export const DATA_FRESHNESS_STATUSES = [
  {
    key: 'fresh',
    label: { en: 'Fresh', th: 'ข้อมูลล่าสุด' },
    semanticIntent: 'Data has synced recently.',
    recommendedBadgeTone: 'success',
    terminal: false,
    requiresAction: false,
    sensitiveAuditable: false,
  },
  {
    key: 'stale',
    label: { en: 'Needs refresh', th: 'ควรอัปเดตข้อมูล' },
    semanticIntent: 'Data is usable but may be outdated.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: false,
  },
  {
    key: 'failed',
    label: { en: 'Sync issue', th: 'ซิงก์ข้อมูลไม่สำเร็จ' },
    semanticIntent: 'Data sync failed and should be retried or reviewed.',
    recommendedBadgeTone: 'amber',
    terminal: false,
    requiresAction: true,
    sensitiveAuditable: true,
  },
] as const satisfies readonly StatusConfig[]

export const STATUS_GROUPS = {
  application: {
    group: 'application',
    description: 'Student application lifecycle states.',
    statuses: APPLICATION_STATUSES,
  },
  document: {
    group: 'document',
    description: 'Student document upload and verification states.',
    statuses: DOCUMENT_STATUSES,
  },
  scholarship: {
    group: 'scholarship',
    description: 'Scholarship publishing, review, and lifecycle states.',
    statuses: SCHOLARSHIP_STATUSES,
  },
  shortlistRequest: {
    group: 'shortlistRequest',
    description: 'Provider shortlist request governance states.',
    statuses: SHORTLIST_REQUEST_STATUSES,
  },
  candidatePool: {
    group: 'candidatePool',
    description: 'Provider candidate pool availability states.',
    statuses: CANDIDATE_POOL_STATUSES,
  },
  review: {
    group: 'review',
    description: 'Generic staff, ESQ, and governance review states.',
    statuses: REVIEW_STATUSES,
  },
  disclosureRequest: {
    group: 'disclosureRequest',
    description: 'Identity disclosure request states.',
    statuses: DISCLOSURE_REQUEST_STATUSES,
  },
  auditRisk: {
    group: 'auditRisk',
    description: 'Risk labels for audit and governance surfaces.',
    statuses: AUDIT_RISK_STATUSES,
  },
  dataFreshness: {
    group: 'dataFreshness',
    description: 'Data freshness and sync health states.',
    statuses: DATA_FRESHNESS_STATUSES,
  },
} as const satisfies Record<string, StatusGroupConfig>
