// Provider Phase 4 mock data
// Privacy boundary: provider candidate data is anonymous, banded, and aggregate-only.
// Do not add student names, raw student IDs, emails, phone numbers, addresses, exact GPA, or raw financial values here.

export type ProviderScholarshipStatus = 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE' | 'CLOSED'
export type CandidatePoolStatus = 'not_available' | 'ready' | 'pending_staff_approval'
export type ShortlistStatus = 'none' | 'pending_staff_approval' | 'approved' | 'declined'
export type CandidateRankBand = 'top_band' | 'strong_band' | 'developing_band' | 'watch_band'
export type ProviderMatchConfidence = 'low' | 'medium' | 'high'

export interface ProviderOrganization {
  id: string
  name_en: string
  name_th: string
  representativeRole_en: string
  representativeRole_th: string
}

export interface ProviderRequiredDocument {
  id: string
  label_en: string
  label_th: string
  required: boolean
}

export interface Scholarship {
  id: string
  title_th: string
  title_en: string
  provider: string
  provider_th: string
  providerOrganizationId: string
  amount: number
  num_awards: number
  deadline: string
  status: ProviderScholarshipStatus
  candidatePoolStatus: CandidatePoolStatus
  shortlistStatus: ShortlistStatus
  description_th: string
  description_en: string
  gpa_min: number
  academic_year: number[]
  departmentBands: string[]
  has_essay: boolean
  has_interview: boolean
  has_proposal: boolean
  requiredDocuments: ProviderRequiredDocument[]
  created_at: string
  matchedCandidates?: CandidateMatch[]
  candidatePoolStats?: CandidatePoolStats
  criteriaConfig?: CriteriaConfig
  providerImpact?: ProviderImpact
}

export interface CandidateMatch {
  candidateToken: string
  scholarshipId: string
  matchScore: number
  confidence: ProviderMatchConfidence
  rankBand: CandidateRankBand
  eligibilitySummary_en: string
  eligibilitySummary_th: string
  eligibilityPreview: Array<{
    label_en: string
    label_th: string
    status: 'met' | 'review'
  }>
  academicBand_en: string
  academicBand_th: string
  needBand_en: string
  needBand_th: string
  departmentBand_en: string
  departmentBand_th: string
  aggregateNotes_en: string
  aggregateNotes_th: string
  shortlistStatus: ShortlistStatus
}

export interface ShortlistRequest {
  id: string
  scholarshipId: string
  candidateTokens: string[]
  reason: string
  status: Exclude<ShortlistStatus, 'none'>
  createdAt: string
}

export interface CandidatePoolStats {
  scholarshipId: string
  totalCandidates: number
  topBand: number
  strongBand: number
  developingBand: number
  averageMatchScore: number
  candidatePoolStatus: CandidatePoolStatus
  aggregateNeedMix_en: string
  aggregateNeedMix_th: string
  aggregateAcademicMix_en: string
  aggregateAcademicMix_th: string
}

export interface ProviderImpact {
  provider: string
  activeScholarships: number
  totalCommittedAmount: number
  awardedCount: number
  fundUtilizationPct: number
  coveragePct: number
  cohortBands: Array<{
    label_en: string
    label_th: string
    value: number
  }>
  departmentBands: Array<{
    label_en: string
    label_th: string
    value: number
  }>
  dataFreshness: {
    status: 'fresh' | 'stale' | 'failed'
    syncedAt_en: string
    syncedAt_th: string
  }
}

export interface Criterion {
  id: string
  name_en: string
  name_th: string
  type: 'academic' | 'financial_need' | 'essay_quality' | 'community_service' | 'leadership' | 'field_alignment'
  weight: number
}

export interface CriteriaConfig {
  scholarshipId: string
  criteria: Criterion[]
  hardConstraints: Array<{
    id: string
    label_en: string
    label_th: string
    value_en: string
    value_th: string
  }>
  candidateVolumeEstimate: {
    eligible: number
    readyForPool: number
    note_en: string
    note_th: string
  }
}

export const mockProviderOrganization: ProviderOrganization = {
  id: 'provider_jcc',
  name_en: 'JCC Company Limited',
  name_th: 'บริษัท เจซีซี จำกัด',
  representativeRole_en: 'Scholarship Program Manager',
  representativeRole_th: 'ผู้จัดการโครงการทุน',
}

const defaultDocuments: ProviderRequiredDocument[] = [
  { id: 'transcript', label_en: 'Transcript', label_th: 'ใบแสดงผลการเรียน', required: true },
  { id: 'statement', label_en: 'Personal statement', label_th: 'เรียงความแนะนำตัว', required: true },
  { id: 'activity', label_en: 'Activity evidence', label_th: 'หลักฐานกิจกรรม', required: false },
  { id: 'portfolio', label_en: 'Portfolio or proposal', label_th: 'แฟ้มผลงานหรือข้อเสนอโครงการ', required: false },
]

const mockProviderScholarshipsBase: Scholarship[] = [
  {
    id: 'sch_001',
    title_th: 'ทุน JCC เพื่อนักศึกษาดีเด่น',
    title_en: 'JCC Excellence Scholarship',
    provider: mockProviderOrganization.name_en,
    provider_th: mockProviderOrganization.name_th,
    providerOrganizationId: mockProviderOrganization.id,
    amount: 50000,
    num_awards: 3,
    deadline: '2026-06-30',
    status: 'ACTIVE',
    candidatePoolStatus: 'ready',
    shortlistStatus: 'pending_staff_approval',
    description_th: 'เสริมสร้างผู้นำรุ่นใหม่ที่มีความเป็นเลิศทางวิชาการและจิตสาธารณะ',
    description_en: 'Building next-generation leaders with academic strength and public spirit.',
    gpa_min: 3.25,
    academic_year: [2, 3, 4],
    departmentBands: ['Social sciences', 'Business', 'Public administration'],
    has_essay: true,
    has_interview: true,
    has_proposal: false,
    requiredDocuments: defaultDocuments.slice(0, 3),
    created_at: '2026-03-20T08:00:00Z',
  },
  {
    id: 'sch_002',
    title_th: 'ทุน JCC สำหรับการเรียนต่อต่างประเทศ',
    title_en: 'JCC International Study Grant',
    provider: mockProviderOrganization.name_en,
    provider_th: mockProviderOrganization.name_th,
    providerOrganizationId: mockProviderOrganization.id,
    amount: 75000,
    num_awards: 2,
    deadline: '2026-07-15',
    status: 'ACTIVE',
    candidatePoolStatus: 'ready',
    shortlistStatus: 'none',
    description_th: 'สนับสนุนนักศึกษาที่มีแผนศึกษาต่อต่างประเทศและพร้อมเป็นตัวแทนมหาวิทยาลัย',
    description_en: 'Supporting students pursuing international education and university representation.',
    gpa_min: 3.5,
    academic_year: [3, 4],
    departmentBands: ['International programs', 'Language-ready cohorts'],
    has_essay: true,
    has_interview: true,
    has_proposal: true,
    requiredDocuments: defaultDocuments,
    created_at: '2026-04-01T08:00:00Z',
  },
  {
    id: 'sch_003',
    title_th: 'ทุน JCC ด้านวิทยาศาสตร์และเทคโนโลยี',
    title_en: 'JCC Science & Technology Scholarship',
    provider: mockProviderOrganization.name_en,
    provider_th: mockProviderOrganization.name_th,
    providerOrganizationId: mockProviderOrganization.id,
    amount: 40000,
    num_awards: 5,
    deadline: '2026-08-31',
    status: 'DRAFT',
    candidatePoolStatus: 'not_available',
    shortlistStatus: 'none',
    description_th: 'มุ่งสนับสนุนนักศึกษาวิทยาศาสตร์และเทคโนโลยี',
    description_en: 'Supporting science and technology students.',
    gpa_min: 3.0,
    academic_year: [1, 2, 3, 4],
    departmentBands: ['STEM cohorts'],
    has_essay: true,
    has_interview: false,
    has_proposal: true,
    requiredDocuments: defaultDocuments,
    created_at: '2026-04-10T08:00:00Z',
  },
  {
    id: 'sch_004',
    title_th: 'ทุน JCC ชุมชนและนวัตกรรม',
    title_en: 'JCC Community Innovation Grant',
    provider: mockProviderOrganization.name_en,
    provider_th: mockProviderOrganization.name_th,
    providerOrganizationId: mockProviderOrganization.id,
    amount: 30000,
    num_awards: 4,
    deadline: '2026-09-20',
    status: 'PENDING_REVIEW',
    candidatePoolStatus: 'not_available',
    shortlistStatus: 'none',
    description_th: 'รอเจ้าหน้าที่ตรวจสอบก่อนเผยแพร่และเปิดระบบจับคู่',
    description_en: 'Awaiting staff review before publication and candidate matching.',
    gpa_min: 2.8,
    academic_year: [2, 3, 4],
    departmentBands: ['Community projects', 'Social innovation'],
    has_essay: true,
    has_interview: false,
    has_proposal: true,
    requiredDocuments: defaultDocuments,
    created_at: '2026-04-22T08:00:00Z',
  },
]

export const mockProviderCandidates: Record<string, CandidateMatch[]> = {
  sch_001: [
    {
      candidateToken: 'Candidate #C-2048',
      scholarshipId: 'sch_001',
      matchScore: 94,
      confidence: 'high',
      rankBand: 'top_band',
      eligibilitySummary_en: 'Meets all hard gates; strong leadership and service alignment.',
      eligibilitySummary_th: 'ผ่านเงื่อนไขหลักทั้งหมด และมีแนวโน้มสอดคล้องกับภาวะผู้นำและจิตสาธารณะ',
      eligibilityPreview: [
        { label_en: 'Academic gate', label_th: 'เงื่อนไขวิชาการ', status: 'met' },
        { label_en: 'Year level', label_th: 'ชั้นปี', status: 'met' },
        { label_en: 'Documents ready', label_th: 'เอกสารพร้อม', status: 'review' },
      ],
      academicBand_en: 'High academic band',
      academicBand_th: 'กลุ่มผลการเรียนสูง',
      needBand_en: 'Moderate need band',
      needBand_th: 'กลุ่มความจำเป็นปานกลาง',
      departmentBand_en: 'Social sciences band',
      departmentBand_th: 'กลุ่มสังคมศาสตร์',
      aggregateNotes_en: 'Tokenized profile shows strong fit across academic, service, and essay signals.',
      aggregateNotes_th: 'โปรไฟล์แบบโทเค็นแสดงความสอดคล้องสูงด้านวิชาการ บริการชุมชน และเรียงความ',
      shortlistStatus: 'pending_staff_approval',
    },
    {
      candidateToken: 'Candidate #C-2049',
      scholarshipId: 'sch_001',
      matchScore: 87,
      confidence: 'high',
      rankBand: 'strong_band',
      eligibilitySummary_en: 'Meets hard gates with balanced academic and service signals.',
      eligibilitySummary_th: 'ผ่านเงื่อนไขหลักและมีสัญญาณด้านวิชาการกับจิตสาธารณะสมดุล',
      eligibilityPreview: [
        { label_en: 'Academic gate', label_th: 'เงื่อนไขวิชาการ', status: 'met' },
        { label_en: 'Year level', label_th: 'ชั้นปี', status: 'met' },
        { label_en: 'Documents ready', label_th: 'เอกสารพร้อม', status: 'met' },
      ],
      academicBand_en: 'High academic band',
      academicBand_th: 'กลุ่มผลการเรียนสูง',
      needBand_en: 'Moderate need band',
      needBand_th: 'กลุ่มความจำเป็นปานกลาง',
      departmentBand_en: 'Business and policy band',
      departmentBand_th: 'กลุ่มธุรกิจและนโยบาย',
      aggregateNotes_en: 'Strong overall fit; confidence may improve after document verification.',
      aggregateNotes_th: 'ความสอดคล้องโดยรวมดี และความมั่นใจอาจเพิ่มหลังตรวจเอกสาร',
      shortlistStatus: 'none',
    },
    {
      candidateToken: 'Candidate #C-2050',
      scholarshipId: 'sch_001',
      matchScore: 72,
      confidence: 'medium',
      rankBand: 'developing_band',
      eligibilitySummary_en: 'Meets hard gates; soft-fit evidence is still developing.',
      eligibilitySummary_th: 'ผ่านเงื่อนไขหลัก แต่หลักฐานด้านความสอดคล้องเชิงคุณภาพยังอยู่ระหว่างพัฒนา',
      eligibilityPreview: [
        { label_en: 'Academic gate', label_th: 'เงื่อนไขวิชาการ', status: 'met' },
        { label_en: 'Year level', label_th: 'ชั้นปี', status: 'met' },
        { label_en: 'Documents ready', label_th: 'เอกสารพร้อม', status: 'review' },
      ],
      academicBand_en: 'Eligible academic band',
      academicBand_th: 'กลุ่มผลการเรียนที่เข้าเกณฑ์',
      needBand_en: 'Higher need band',
      needBand_th: 'กลุ่มความจำเป็นสูง',
      departmentBand_en: 'Public administration band',
      departmentBand_th: 'กลุ่มรัฐประศาสนศาสตร์',
      aggregateNotes_en: 'May be a strong mission-fit candidate if supporting evidence is verified.',
      aggregateNotes_th: 'อาจสอดคล้องกับเป้าหมายทุนมากขึ้นหากหลักฐานประกอบได้รับการยืนยัน',
      shortlistStatus: 'none',
    },
    {
      candidateToken: 'Candidate #C-2051',
      scholarshipId: 'sch_001',
      matchScore: 58,
      confidence: 'medium',
      rankBand: 'watch_band',
      eligibilitySummary_en: 'Meets basic gates; several fit factors need staff-side validation.',
      eligibilitySummary_th: 'ผ่านเงื่อนไขพื้นฐาน แต่ปัจจัยความสอดคล้องบางส่วนต้องรอเจ้าหน้าที่ยืนยัน',
      eligibilityPreview: [
        { label_en: 'Academic gate', label_th: 'เงื่อนไขวิชาการ', status: 'met' },
        { label_en: 'Year level', label_th: 'ชั้นปี', status: 'review' },
        { label_en: 'Documents ready', label_th: 'เอกสารพร้อม', status: 'review' },
      ],
      academicBand_en: 'Eligible academic band',
      academicBand_th: 'กลุ่มผลการเรียนที่เข้าเกณฑ์',
      needBand_en: 'Moderate need band',
      needBand_th: 'กลุ่มความจำเป็นปานกลาง',
      departmentBand_en: 'Cross-disciplinary band',
      departmentBand_th: 'กลุ่มข้ามสาขา',
      aggregateNotes_en: 'Useful to monitor if the provider wants a wider shortlist.',
      aggregateNotes_th: 'เหมาะสำหรับติดตามหากผู้ให้ทุนต้องการรายชื่อสำรองที่กว้างขึ้น',
      shortlistStatus: 'none',
    },
  ],
  sch_002: [
    {
      candidateToken: 'Candidate #C-3001',
      scholarshipId: 'sch_002',
      matchScore: 91,
      confidence: 'high',
      rankBand: 'top_band',
      eligibilitySummary_en: 'Meets international-readiness gates with strong language evidence.',
      eligibilitySummary_th: 'ผ่านเงื่อนไขความพร้อมต่างประเทศและมีหลักฐานด้านภาษาที่แข็งแรง',
      eligibilityPreview: [
        { label_en: 'Academic gate', label_th: 'เงื่อนไขวิชาการ', status: 'met' },
        { label_en: 'Language readiness', label_th: 'ความพร้อมภาษา', status: 'met' },
        { label_en: 'Proposal ready', label_th: 'ข้อเสนอพร้อม', status: 'review' },
      ],
      academicBand_en: 'High academic band',
      academicBand_th: 'กลุ่มผลการเรียนสูง',
      needBand_en: 'Higher need band',
      needBand_th: 'กลุ่มความจำเป็นสูง',
      departmentBand_en: 'International program band',
      departmentBand_th: 'กลุ่มหลักสูตรนานาชาติ',
      aggregateNotes_en: 'Strong international alignment without exposing identity details.',
      aggregateNotes_th: 'สอดคล้องกับเป้าหมายต่างประเทศโดยไม่เปิดเผยข้อมูลระบุตัวตน',
      shortlistStatus: 'none',
    },
    {
      candidateToken: 'Candidate #C-3002',
      scholarshipId: 'sch_002',
      matchScore: 79,
      confidence: 'medium',
      rankBand: 'strong_band',
      eligibilitySummary_en: 'Meets core gates; global-outlook evidence is still being verified.',
      eligibilitySummary_th: 'ผ่านเงื่อนไขหลัก และหลักฐานด้านมุมมองสากลอยู่ระหว่างการยืนยัน',
      eligibilityPreview: [
        { label_en: 'Academic gate', label_th: 'เงื่อนไขวิชาการ', status: 'met' },
        { label_en: 'Language readiness', label_th: 'ความพร้อมภาษา', status: 'review' },
        { label_en: 'Proposal ready', label_th: 'ข้อเสนอพร้อม', status: 'met' },
      ],
      academicBand_en: 'Eligible academic band',
      academicBand_th: 'กลุ่มผลการเรียนที่เข้าเกณฑ์',
      needBand_en: 'Moderate need band',
      needBand_th: 'กลุ่มความจำเป็นปานกลาง',
      departmentBand_en: 'Language-ready cohort band',
      departmentBand_th: 'กลุ่มที่มีความพร้อมด้านภาษา',
      aggregateNotes_en: 'Good fit with some evidence pending verification.',
      aggregateNotes_th: 'มีความสอดคล้องดี และมีบางหลักฐานรอการยืนยัน',
      shortlistStatus: 'none',
    },
  ],
}

export const mockProviderPoolStats: Record<string, CandidatePoolStats> = {
  sch_001: {
    scholarshipId: 'sch_001',
    totalCandidates: 127,
    topBand: 12,
    strongBand: 35,
    developingBand: 58,
    averageMatchScore: 76,
    candidatePoolStatus: 'ready',
    aggregateNeedMix_en: 'Mostly moderate and higher need bands',
    aggregateNeedMix_th: 'ส่วนใหญ่เป็นกลุ่มความจำเป็นปานกลางและสูง',
    aggregateAcademicMix_en: 'Eligible to high academic bands',
    aggregateAcademicMix_th: 'กลุ่มผลการเรียนเข้าเกณฑ์ถึงสูง',
  },
  sch_002: {
    scholarshipId: 'sch_002',
    totalCandidates: 89,
    topBand: 8,
    strongBand: 22,
    developingBand: 45,
    averageMatchScore: 71,
    candidatePoolStatus: 'ready',
    aggregateNeedMix_en: 'Balanced need distribution',
    aggregateNeedMix_th: 'การกระจายความจำเป็นค่อนข้างสมดุล',
    aggregateAcademicMix_en: 'Mostly high academic and language-ready bands',
    aggregateAcademicMix_th: 'ส่วนใหญ่เป็นกลุ่มผลการเรียนสูงและพร้อมด้านภาษา',
  },
}

export const mockProviderShortlists: Record<string, ShortlistRequest> = {
  req_001: {
    id: 'req_001',
    scholarshipId: 'sch_001',
    candidateTokens: ['Candidate #C-2048'],
    reason: 'Requesting staff approval to review this anonymous candidate for shortlist fit.',
    status: 'pending_staff_approval',
    createdAt: '2026-05-06T10:00:00Z',
  },
}

export const mockProviderImpactData: ProviderImpact = {
  provider: mockProviderOrganization.name_en,
  activeScholarships: 2,
  totalCommittedAmount: 500000,
  awardedCount: 28,
  fundUtilizationPct: 84,
  coveragePct: 67,
  cohortBands: [
    { label_en: 'Year 2', label_th: 'ชั้นปี 2', value: 18 },
    { label_en: 'Year 3', label_th: 'ชั้นปี 3', value: 31 },
    { label_en: 'Year 4', label_th: 'ชั้นปี 4', value: 24 },
  ],
  departmentBands: [
    { label_en: 'Social sciences', label_th: 'สังคมศาสตร์', value: 34 },
    { label_en: 'Business and policy', label_th: 'ธุรกิจและนโยบาย', value: 27 },
    { label_en: 'International programs', label_th: 'หลักสูตรนานาชาติ', value: 16 },
  ],
  dataFreshness: {
    status: 'fresh',
    syncedAt_en: 'Synced recently',
    syncedAt_th: 'ซิงก์ล่าสุดเมื่อไม่นานนี้',
  },
}

export const mockProviderCriteria: Record<string, CriteriaConfig> = {
  sch_001: {
    scholarshipId: 'sch_001',
    criteria: [
      { id: 'c1', name_en: 'Academic strength band', name_th: 'กลุ่มความแข็งแรงทางวิชาการ', type: 'academic', weight: 30 },
      { id: 'c2', name_en: 'Leadership evidence', name_th: 'หลักฐานภาวะผู้นำ', type: 'leadership', weight: 25 },
      { id: 'c3', name_en: 'Community contribution', name_th: 'การมีส่วนร่วมกับชุมชน', type: 'community_service', weight: 25 },
      { id: 'c4', name_en: 'Statement quality', name_th: 'คุณภาพเรียงความ', type: 'essay_quality', weight: 20 },
    ],
    hardConstraints: [
      { id: 'h1', label_en: 'Minimum academic gate', label_th: 'เงื่อนไขวิชาการขั้นต่ำ', value_en: 'Provider-defined GPA threshold', value_th: 'เกณฑ์ GPA ที่ผู้ให้ทุนกำหนด' },
      { id: 'h2', label_en: 'Academic year', label_th: 'ชั้นปี', value_en: 'Year 2, 3, or 4', value_th: 'ชั้นปี 2, 3 หรือ 4' },
      { id: 'h3', label_en: 'Required documents', label_th: 'เอกสารจำเป็น', value_en: 'Transcript and personal statement', value_th: 'ใบแสดงผลการเรียนและเรียงความ' },
    ],
    candidateVolumeEstimate: {
      eligible: 127,
      readyForPool: 105,
      note_en: 'Volume estimate uses anonymous, banded student data only.',
      note_th: 'การประมาณจำนวนใช้ข้อมูลนักศึกษาแบบไม่ระบุตัวตนและเป็นกลุ่มเท่านั้น',
    },
  },
  sch_002: {
    scholarshipId: 'sch_002',
    criteria: [
      { id: 'c5', name_en: 'Academic strength band', name_th: 'กลุ่มความแข็งแรงทางวิชาการ', type: 'academic', weight: 30 },
      { id: 'c6', name_en: 'International readiness', name_th: 'ความพร้อมต่างประเทศ', type: 'field_alignment', weight: 28 },
      { id: 'c7', name_en: 'Language evidence', name_th: 'หลักฐานด้านภาษา', type: 'field_alignment', weight: 22 },
      { id: 'c8', name_en: 'Global outlook statement', name_th: 'เรียงความมุมมองสากล', type: 'essay_quality', weight: 20 },
    ],
    hardConstraints: [
      { id: 'h4', label_en: 'Minimum academic gate', label_th: 'เงื่อนไขวิชาการขั้นต่ำ', value_en: 'Provider-defined GPA threshold', value_th: 'เกณฑ์ GPA ที่ผู้ให้ทุนกำหนด' },
      { id: 'h5', label_en: 'Academic year', label_th: 'ชั้นปี', value_en: 'Year 3 or 4', value_th: 'ชั้นปี 3 หรือ 4' },
      { id: 'h6', label_en: 'International plan', label_th: 'แผนศึกษาต่อต่างประเทศ', value_en: 'Proposal or study plan required', value_th: 'ต้องมีข้อเสนอหรือแผนการศึกษา' },
    ],
    candidateVolumeEstimate: {
      eligible: 89,
      readyForPool: 74,
      note_en: 'Language and proposal evidence remain anonymized until staff-approved disclosure.',
      note_th: 'หลักฐานด้านภาษาและข้อเสนอยังคงไม่ระบุตัวตนจนกว่าจะมีการอนุมัติจากเจ้าหน้าที่',
    },
  },
}

export const mockProviderScholarships: Scholarship[] = mockProviderScholarshipsBase.map((scholarship) => ({
  ...scholarship,
  matchedCandidates: mockProviderCandidates[scholarship.id] || [],
  candidatePoolStats: mockProviderPoolStats[scholarship.id],
  criteriaConfig: mockProviderCriteria[scholarship.id],
  providerImpact: mockProviderImpactData,
}))

export function getProviderScholarshipById(scholarshipId: string) {
  return mockProviderScholarships.find((scholarship) => scholarship.id === scholarshipId)
}

export function getProviderCandidatesForScholarship(scholarshipId: string) {
  return mockProviderCandidates[scholarshipId] || []
}

export function getProviderCriteriaForScholarship(scholarshipId: string) {
  return mockProviderCriteria[scholarshipId]
}

export function getProviderPoolStatsForScholarship(scholarshipId: string) {
  return mockProviderPoolStats[scholarshipId]
}
