import type { StudentDocumentState } from '@/data/mock/studentApplicationData'
import type { Lang } from '@/lib/types'

const STUDENT_DOCUMENT_STATUS_LABELS: Record<StudentDocumentState, Record<Lang, string>> = {
  missing: { th: 'เพิ่มเอกสารได้', en: 'Ready to add' },
  uploading: { th: 'กำลังอัปโหลด', en: 'Uploading' },
  uploaded: { th: 'อัปโหลดแล้ว', en: 'Uploaded' },
  invalid_file_type: { th: 'ชนิดไฟล์ไม่รองรับ', en: 'Unsupported file type' },
  verification_pending: { th: 'รอตรวจสอบ', en: 'Verification pending' },
  verified: { th: 'ตรวจสอบแล้ว', en: 'Verified' },
  rejected: { th: 'ควรอัปโหลดใหม่', en: 'Needs replacement' },
  needs_replacement: { th: 'ควรแทนที่ไฟล์', en: 'Replace file' },
}

const STUDENT_DOCUMENT_STATUS_CLASS_NAMES: Record<StudentDocumentState, string> = {
  missing: 'bg-[#E5EDFF] text-role-primary border-[#0055FF]/20',
  uploading: 'bg-blue-50 text-blue-700 border-blue-200',
  uploaded: 'bg-[#E5EDFF] text-role-primary border-[#0055FF]/20',
  invalid_file_type: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
  verification_pending: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
  needs_replacement: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
}

const STUDENT_DOCUMENT_ATTENTION_STATUSES: ReadonlySet<StudentDocumentState> = new Set<StudentDocumentState>([
  'missing',
  'invalid_file_type',
  'rejected',
  'needs_replacement',
])

export function getStudentDocumentStatusLabel(status: StudentDocumentState, lang: Lang) {
  return STUDENT_DOCUMENT_STATUS_LABELS[status][lang]
}

export function getStudentDocumentStatusClassName(status: StudentDocumentState) {
  return STUDENT_DOCUMENT_STATUS_CLASS_NAMES[status]
}

export function requiresStudentDocumentAttention(status: StudentDocumentState) {
  return STUDENT_DOCUMENT_ATTENTION_STATUSES.has(status)
}

export function isStudentDocumentStatusRecoverable(status: StudentDocumentState) {
  return status !== 'verified'
}
