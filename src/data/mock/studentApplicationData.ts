import type { LocalizedText } from './studentMatchingData'
import { mockScholarships } from './scholarships'
import { getRecommendationByScholarshipId, studentMissingData } from './studentMatchingData'

export type StudentApplicationState =
  | 'draft'
  | 'ready_to_submit'
  | 'submitted'
  | 'in_review'
  | 'revision_requested'
  | 'approved'
  | 'rejected'
  | 'withdrawn'

export type StudentDocumentState =
  | 'missing'
  | 'uploading'
  | 'uploaded'
  | 'invalid_file_type'
  | 'verification_pending'
  | 'verified'
  | 'rejected'
  | 'needs_replacement'

export interface StudentTimelineEvent {
  id: string
  label: LocalizedText
  description: LocalizedText
  date: string
  state: 'done' | 'active' | 'attention' | 'pending'
}

export interface StudentDocumentItem {
  id: string
  label: LocalizedText
  description: LocalizedText
  state: StudentDocumentState
  required: boolean
  acceptedTypes: string[]
  fileName?: string
  uploadedAt?: string
  progress?: number
  guidance: LocalizedText
}

export interface StudentDraftSection {
  id: string
  label: LocalizedText
  helper: LocalizedText
  value: LocalizedText
  required: boolean
}

export interface StudentApplicationRecord {
  id: string
  scholarshipId: string
  studentId: string
  state: StudentApplicationState
  submittedAt?: string
  updatedAt: string
  deadline: string
  readinessPct: number
  revisionMessage?: LocalizedText
  revisionRequestedBy?: LocalizedText
  revisionDueDate?: string
  timeline: StudentTimelineEvent[]
  documents: StudentDocumentItem[]
  draftSections: StudentDraftSection[]
}

export const applicationStateLabels: Record<StudentApplicationState, LocalizedText> = {
  draft: { th: 'ร่างใบสมัคร', en: 'Draft' },
  ready_to_submit: { th: 'พร้อมส่ง', en: 'Ready to submit' },
  submitted: { th: 'ส่งแล้ว', en: 'Submitted' },
  in_review: { th: 'กำลังตรวจสอบ', en: 'In review' },
  revision_requested: { th: 'ขอแก้ไข', en: 'Revision requested' },
  approved: { th: 'อนุมัติแล้ว', en: 'Approved' },
  rejected: { th: 'ไม่ผ่าน', en: 'Not selected' },
  withdrawn: { th: 'ถอนใบสมัคร', en: 'Withdrawn' },
}

export const applicationStateStyles: Record<StudentApplicationState, string> = {
  draft: 'bg-surface-low text-ink-2 border-line',
  ready_to_submit: 'bg-[#E5EDFF] text-role-primary border-[#0055FF]/20',
  submitted: 'bg-[#E5EDFF] text-role-primary border-[#0055FF]/20',
  in_review: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
  revision_requested: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-surface-low text-ink-2 border-line',
  withdrawn: 'bg-surface-low text-ink-2 border-line',
}

export const documentStateLabels: Record<StudentDocumentState, LocalizedText> = {
  missing: { th: 'เพิ่มเอกสารได้', en: 'Ready to add' },
  uploading: { th: 'กำลังอัปโหลด', en: 'Uploading' },
  uploaded: { th: 'อัปโหลดแล้ว', en: 'Uploaded' },
  invalid_file_type: { th: 'ชนิดไฟล์ไม่รองรับ', en: 'Unsupported file type' },
  verification_pending: { th: 'รอตรวจสอบ', en: 'Verification pending' },
  verified: { th: 'ตรวจสอบแล้ว', en: 'Verified' },
  rejected: { th: 'ควรอัปโหลดใหม่', en: 'Needs replacement' },
  needs_replacement: { th: 'ควรแทนที่ไฟล์', en: 'Replace file' },
}

export const studentScholarshipRequiredDocuments: Record<string, StudentDocumentItem[]> = {
  sch_001: [
    {
      id: 'transcript',
      label: { th: 'ใบแสดงผลการเรียน', en: 'Transcript' },
      description: { th: 'ใช้ยืนยัน GPA และชั้นปี', en: 'Confirms GPA and academic year.' },
      state: 'verified',
      required: true,
      acceptedTypes: ['PDF'],
      fileName: 'transcript_650912345.pdf',
      uploadedAt: '2026-05-02',
      guidance: {
        th: 'เอกสารนี้พร้อมใช้กับใบสมัครนี้แล้ว',
        en: 'This document is ready to use for this application.',
      },
    },
    {
      id: 'essay',
      label: { th: 'เรียงความ', en: 'Essay' },
      description: { th: 'อธิบายแรงจูงใจและเป้าหมายของคุณ', en: 'Explains your motivation and goals.' },
      state: 'missing',
      required: true,
      acceptedTypes: ['PDF', 'DOCX'],
      guidance: {
        th: 'เพิ่มเรียงความเพื่อช่วยให้ใบสมัครพร้อมขึ้น',
        en: 'Add your essay to make this application more complete.',
      },
    },
    {
      id: 'proposal',
      label: { th: 'ข้อเสนอโครงการ', en: 'Project proposal' },
      description: { th: 'สรุปแนวคิดกิจกรรมหรือผลกระทบทางสังคม', en: 'Summarizes your activity or social-impact idea.' },
      state: 'verification_pending',
      required: true,
      acceptedTypes: ['PDF'],
      fileName: 'community_proposal.pdf',
      uploadedAt: '2026-05-06',
      guidance: {
        th: 'ไฟล์อยู่ระหว่างตรวจสอบเบื้องต้น',
        en: 'This file is waiting for preliminary verification.',
      },
    },
    {
      id: 'activity-evidence',
      label: { th: 'หลักฐานกิจกรรม', en: 'Activity evidence' },
      description: { th: 'ช่วยสนับสนุนความเหมาะสมด้านกิจกรรม', en: 'Supports activity-focused fit.' },
      state: 'needs_replacement',
      required: false,
      acceptedTypes: ['PDF', 'JPG', 'PNG'],
      fileName: 'activity_photo.heic',
      uploadedAt: '2026-05-05',
      guidance: {
        th: 'อัปโหลดเป็น PDF, JPG หรือ PNG เพื่อให้ตรวจสอบได้ง่ายขึ้น',
        en: 'Upload as PDF, JPG, or PNG so it can be reviewed more easily.',
      },
    },
  ],
  sch_003: [
    {
      id: 'transcript',
      label: { th: 'ใบแสดงผลการเรียน', en: 'Transcript' },
      description: { th: 'ใช้ยืนยันเกณฑ์พื้นฐาน', en: 'Confirms basic eligibility.' },
      state: 'verified',
      required: true,
      acceptedTypes: ['PDF'],
      fileName: 'transcript_650912345.pdf',
      uploadedAt: '2026-05-01',
      guidance: { th: 'พร้อมใช้', en: 'Ready to use.' },
    },
    {
      id: 'household',
      label: { th: 'ทะเบียนบ้าน', en: 'Household registration' },
      description: { th: 'ช่วยอธิบายบริบทครอบครัว', en: 'Helps explain household context.' },
      state: 'missing',
      required: true,
      acceptedTypes: ['PDF', 'JPG', 'PNG'],
      guidance: {
        th: 'เพิ่มทะเบียนบ้านเพื่อให้ใบสมัครสมบูรณ์ขึ้น',
        en: 'Add household registration to complete this application.',
      },
    },
    {
      id: 'income',
      label: { th: 'หลักฐานรายได้หรือค่าใช้จ่าย', en: 'Income or expense evidence' },
      description: { th: 'ช่วยยืนยันบริบทความต้องการทุน', en: 'Supports need-context explanation.' },
      state: 'invalid_file_type',
      required: true,
      acceptedTypes: ['PDF', 'JPG', 'PNG'],
      fileName: 'income-sheet.xlsx',
      uploadedAt: '2026-05-04',
      guidance: {
        th: 'ใช้ไฟล์ PDF, JPG หรือ PNG เพื่อให้ตรวจสอบได้',
        en: 'Use PDF, JPG, or PNG so the file can be reviewed.',
      },
    },
    {
      id: 'expense-summary',
      label: { th: 'สรุปค่าใช้จ่าย', en: 'Expense summary' },
      description: { th: 'สรุปรายจ่ายสำคัญระหว่างเรียน', en: 'Summarizes major study expenses.' },
      state: 'uploading',
      required: false,
      acceptedTypes: ['PDF'],
      fileName: 'expense-summary.pdf',
      progress: 62,
      guidance: {
        th: 'กำลังจำลองสถานะอัปโหลด ไม่มีการจัดเก็บไฟล์จริง',
        en: 'Mock upload progress only; no real file storage is used.',
      },
    },
  ],
  sch_005: [
    {
      id: 'transcript',
      label: { th: 'ใบแสดงผลการเรียน', en: 'Transcript' },
      description: { th: 'ใช้ยืนยัน GPA และชั้นปี', en: 'Confirms GPA and academic year.' },
      state: 'verified',
      required: true,
      acceptedTypes: ['PDF'],
      fileName: 'transcript_650912345.pdf',
      uploadedAt: '2026-05-01',
      guidance: { th: 'พร้อมใช้', en: 'Ready to use.' },
    },
    {
      id: 'research-proposal',
      label: { th: 'ข้อเสนอโครงการวิจัย', en: 'Research proposal' },
      description: { th: 'สรุปหัวข้อและวิธีการวิจัยเบื้องต้น', en: 'Summarizes topic and initial method.' },
      state: 'missing',
      required: true,
      acceptedTypes: ['PDF'],
      guidance: {
        th: 'เพิ่มข้อเสนอวิจัยเพื่อช่วยให้ใบสมัครพร้อมขึ้น',
        en: 'Add your research proposal to make this application more complete.',
      },
    },
    {
      id: 'writing-sample',
      label: { th: 'ตัวอย่างงานเขียน', en: 'Writing sample' },
      description: { th: 'ช่วยแสดงความพร้อมด้านวิจัย', en: 'Shows research readiness.' },
      state: 'rejected',
      required: false,
      acceptedTypes: ['PDF'],
      fileName: 'draft-notes.txt',
      uploadedAt: '2026-05-03',
      guidance: {
        th: 'ลองแทนที่ด้วยไฟล์ PDF ที่อ่านง่ายขึ้น',
        en: 'Replace with an easier-to-review PDF file.',
      },
    },
  ],
}

export const studentApplications: StudentApplicationRecord[] = [
  {
    id: 'app_001',
    scholarshipId: 'sch_001',
    studentId: 'usr_student_001',
    state: 'in_review',
    submittedAt: '2026-05-06',
    updatedAt: '2026-05-07',
    deadline: '2026-06-18',
    readinessPct: 84,
    timeline: [
      {
        id: 'draft',
        label: { th: 'สร้างร่างใบสมัคร', en: 'Draft created' },
        description: { th: 'เริ่มจากคำแนะนำทุน', en: 'Started from a recommendation.' },
        date: '2026-05-04',
        state: 'done',
      },
      {
        id: 'documents',
        label: { th: 'เตรียมเอกสาร', en: 'Documents prepared' },
        description: { th: 'เอกสารหลักส่วนใหญ่พร้อมใช้งาน', en: 'Most core documents are ready.' },
        date: '2026-05-06',
        state: 'done',
      },
      {
        id: 'review',
        label: { th: 'อยู่ระหว่างตรวจสอบ', en: 'Under review' },
        description: { th: 'เจ้าหน้าที่กำลังตรวจสอบข้อมูลที่ส่ง', en: 'Staff are reviewing submitted details.' },
        date: '2026-05-07',
        state: 'active',
      },
      {
        id: 'decision',
        label: { th: 'ผลการพิจารณา', en: 'Decision' },
        description: { th: 'รอขั้นตอนถัดไป', en: 'Waiting for the next step.' },
        date: '2026-06-02',
        state: 'pending',
      },
    ],
    documents: studentScholarshipRequiredDocuments.sch_001,
    draftSections: [
      {
        id: 'statement',
        label: { th: 'คำแถลงส่วนตัว', en: 'Personal statement' },
        helper: { th: 'เล่าแรงจูงใจและเป้าหมายของคุณ', en: 'Describe your motivation and goals.' },
        value: {
          th: 'ฉันสนใจสร้างโครงการที่ช่วยเชื่อมโยงนักศึกษากับชุมชนในพื้นที่',
          en: 'I want to build a project that connects students with local communities.',
        },
        required: true,
      },
      {
        id: 'supporting-context',
        label: { th: 'ข้อมูลสนับสนุน', en: 'Supporting context' },
        helper: { th: 'เพิ่มบริบทที่ช่วยอธิบายความเหมาะสม', en: 'Add context that helps explain your fit.' },
        value: {
          th: 'เคยร่วมกิจกรรมชุมชนและสนใจงานนโยบายสาธารณะ',
          en: 'I have joined community activities and care about public policy.',
        },
        required: false,
      },
    ],
  },
  {
    id: 'app_002',
    scholarshipId: 'sch_003',
    studentId: 'usr_student_001',
    state: 'revision_requested',
    submittedAt: '2026-05-02',
    updatedAt: '2026-05-07',
    deadline: '2026-06-30',
    readinessPct: 61,
    revisionRequestedBy: { th: 'ทีมทุนคณะ', en: 'Faculty scholarship team' },
    revisionDueDate: '2026-05-14',
    revisionMessage: {
      th: 'โปรดเพิ่มทะเบียนบ้านและอัปโหลดหลักฐานรายได้เป็น PDF, JPG หรือ PNG เพื่อให้ตรวจสอบได้สะดวกขึ้น',
      en: 'Please add household registration and upload income evidence as PDF, JPG, or PNG so it can be reviewed more easily.',
    },
    timeline: [
      {
        id: 'submitted',
        label: { th: 'ส่งใบสมัคร', en: 'Application submitted' },
        description: { th: 'ส่งข้อมูลชุดแรกแล้ว', en: 'Initial application submitted.' },
        date: '2026-05-02',
        state: 'done',
      },
      {
        id: 'revision',
        label: { th: 'ขอแก้ไขเอกสาร', en: 'Revision requested' },
        description: { th: 'เพิ่มเอกสารบางรายการเพื่อให้ตรวจสอบต่อได้', en: 'Add a few documents so review can continue.' },
        date: '2026-05-07',
        state: 'attention',
      },
      {
        id: 'resubmit',
        label: { th: 'ส่งกลับเพื่อตรวจสอบ', en: 'Resubmit for review' },
        description: { th: 'รอคุณอัปเดตเอกสาร', en: 'Waiting for your document update.' },
        date: '2026-05-14',
        state: 'pending',
      },
    ],
    documents: studentScholarshipRequiredDocuments.sch_003,
    draftSections: [
      {
        id: 'statement',
        label: { th: 'คำแถลงส่วนตัว', en: 'Personal statement' },
        helper: { th: 'อธิบายว่าทุนนี้ช่วยเป้าหมายการเรียนอย่างไร', en: 'Explain how this scholarship supports your study goals.' },
        value: {
          th: 'ทุนนี้จะช่วยลดภาระค่าใช้จ่ายและทำให้ฉันมีเวลาเรียนและทำกิจกรรมมากขึ้น',
          en: 'This scholarship would reduce expense pressure and give me more time for study and activities.',
        },
        required: true,
      },
      {
        id: 'financial-context',
        label: { th: 'บริบทค่าใช้จ่าย', en: 'Financial context' },
        helper: { th: 'ใช้ภาษาที่สบายใจและเท่าที่จำเป็น', en: 'Share only what feels relevant and comfortable.' },
        value: {
          th: 'ฉันทำงานพาร์ทไทม์และช่วยดูแลค่าใช้จ่ายบางส่วนของตนเอง',
          en: 'I work part-time and help cover part of my own expenses.',
        },
        required: true,
      },
    ],
  },
  {
    id: 'app_003',
    scholarshipId: 'sch_005',
    studentId: 'usr_student_001',
    state: 'draft',
    updatedAt: '2026-05-05',
    deadline: '2026-07-12',
    readinessPct: 48,
    timeline: [
      {
        id: 'draft',
        label: { th: 'สร้างร่าง', en: 'Draft created' },
        description: { th: 'ยังเติมข้อมูลเพิ่มเติมได้', en: 'You can still add more details.' },
        date: '2026-05-05',
        state: 'active',
      },
      {
        id: 'documents',
        label: { th: 'เตรียมเอกสาร', en: 'Prepare documents' },
        description: { th: 'เพิ่มข้อเสนอวิจัยเมื่อพร้อม', en: 'Add your proposal when ready.' },
        date: '2026-07-01',
        state: 'pending',
      },
    ],
    documents: studentScholarshipRequiredDocuments.sch_005,
    draftSections: [
      {
        id: 'statement',
        label: { th: 'คำแถลงส่วนตัว', en: 'Personal statement' },
        helper: { th: 'เล่าความสนใจด้านวิจัย', en: 'Describe your research interests.' },
        value: { th: '', en: '' },
        required: true,
      },
      {
        id: 'research-plan',
        label: { th: 'แผนวิจัยเบื้องต้น', en: 'Initial research plan' },
        helper: { th: 'สรุปหัวข้อ คำถาม และวิธีการ', en: 'Summarize topic, question, and method.' },
        value: { th: '', en: '' },
        required: true,
      },
    ],
  },
]

export function getScholarshipById(scholarshipId: string) {
  return mockScholarships.find(s => s.id === scholarshipId)
}

export function getStudentApplicationById(applicationId: string) {
  return studentApplications.find(application => application.id === applicationId)
}

export function getStudentApplicationByScholarshipId(scholarshipId: string) {
  return studentApplications.find(application => application.scholarshipId === scholarshipId)
}

export function getRequiredDocumentsForScholarship(scholarshipId: string) {
  return studentScholarshipRequiredDocuments[scholarshipId] ?? []
}

export function getApplicationReadiness(scholarshipId: string) {
  const application = getStudentApplicationByScholarshipId(scholarshipId)
  const recommendation = getRecommendationByScholarshipId(scholarshipId)
  const documents = getRequiredDocumentsForScholarship(scholarshipId)
  const readyDocs = documents.filter(doc => ['verified', 'uploaded', 'verification_pending'].includes(doc.state)).length
  const requiredDocs = documents.filter(doc => doc.required).length

  return {
    application,
    recommendation,
    readinessPct: application?.readinessPct ?? Math.max(42, Math.min(92, (recommendation?.matchScore ?? 60) - 8)),
    readyDocs,
    requiredDocs,
    missingDocuments: documents.filter(doc => ['missing', 'invalid_file_type', 'rejected', 'needs_replacement'].includes(doc.state)),
    missingData: studentMissingData.slice(0, scholarshipId === 'sch_005' ? 2 : 1),
  }
}
