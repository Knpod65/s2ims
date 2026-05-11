// Staff Phase 6 Mock Data
// Masked student profiles, document verification, match reviews, disclosure requests, data quality issues

export interface MaskedStudentProfile {
  token: string // Student #XXXX
  gpaRange: { min: number; max: number }
  financialNeedPercentile: number
  academicYear: number
  department?: string // Aggregate only if available
}

export interface DocumentVerificationState {
  id: string
  label_th: string
  label_en: string
  required: boolean
  status: 'uploaded' | 'pending' | 'verified' | 'invalid_file_type' | 'rejected' | 'needs_replacement' | 'missing'
  uploadedAt?: string
  fileName?: string
  rejectionReason?: string
  replacementMessage?: string
  staffNote?: string
}

export interface MatchReview {
  id: string
  applicationId: string
  scholarshipId: string
  scholarshipTitle_en: string
  scholarshipTitle_th: string
  studentToken: string // Student #XXXX
  matchScore: number
  confidence: number // 0-1
  confidenceBand: 'excellent' | 'strong' | 'moderate' | 'weak'
  hardEligibilityPass: boolean
  hardEligibilityDetails: string
  softMatchBreakdown: Array<{ criterion: string; contribution: number }>
  fairnessFlag?: {
    type: 'low_income_high_match' | 'high_match_low_gpa' | 'other'
    message: string
  }
  dataFreshness: 'fresh' | 'stale' | 'failed'
  lastUpdated: string
}

export interface ManualOverride {
  id: string
  matchId: string
  originalDecision: 'shortlist' | 'not_shortlist' | 'interview'
  proposedDecision: 'shortlist' | 'not_shortlist' | 'interview'
  reason: string
  overriddenBy: string
  overriddenAt: string
  auditNote: string
}

export interface StaffDisclosureRequest {
  id: string
  scholarshipId: string
  scholarshipTitle_en: string
  scholarshipTitle_th: string
  candidateToken: string // Candidate #C-XXXX
  providerName: string
  providerReason: string
  matchSummary: string
  matchConfidence: number
  status: 'pending_staff_approval' | 'approved' | 'rejected'
  disclosureRiskNote: string
  fieldsToDisclose: string[] // 'name', 'email', 'phone', 'student_id', 'gpa', 'financial_info', etc.
  requestedAt: string
  approvedAt?: string
  rejectionReason?: string
  approvedBy?: string
}

export interface DataQualityIssue {
  id: string
  type: 'missing_gpa' | 'missing_department' | 'duplicate_record' | 'stale_lms_data' | 'consent_missing' | 'finance_mismatch'
  affectedCount: number
  suggestedFix: string
  owner: string
  status: 'open' | 'in_progress' | 'resolved'
  severity: 'high' | 'medium' | 'low'
  createdAt: string
}

export interface StaffNote {
  id: string
  applicationId: string
  content: string
  createdBy: string
  createdAt: string
}

export interface AuditEvent {
  id: string
  timestamp: string
  action: 'document_verified' | 'document_rejected' | 'document_replacement_requested' | 'identity_revealed' | 'manual_override' | 'disclosure_approved' | 'disclosure_rejected' | 'staff_note_added'
  applicationId: string
  actor: string
  reason?: string
  details?: Record<string, any>
}

// Masked Student Profiles (linked to mockApplications)
export const mockMaskedStudents: Record<string, MaskedStudentProfile> = {
  'usr_student_001': {
    token: 'Student #S-1847',
    gpaRange: { min: 3.6, max: 3.8 },
    financialNeedPercentile: 75,
    academicYear: 4,
  },
  'usr_student_002': {
    token: 'Student #S-1923',
    gpaRange: { min: 3.2, max: 3.5 },
    financialNeedPercentile: 45,
    academicYear: 3,
  },
}

// Document Verification States (per application)
export const mockDocumentStates: Record<string, DocumentVerificationState[]> = {
  'app_001': [
    {
      id: 'd1',
      label_th: 'ใบสมัคร',
      label_en: 'Application Form',
      required: true,
      status: 'verified',
      uploadedAt: '2025-04-10',
      fileName: 'application_form.pdf',
      staffNote: 'Complete and clear',
    },
    {
      id: 'd2',
      label_th: 'ข้อเสนอโครงการ',
      label_en: 'Project Proposal',
      required: true,
      status: 'verified',
      uploadedAt: '2025-04-10',
      fileName: 'proposal.pdf',
    },
    {
      id: 'd3',
      label_th: 'เรียงความ',
      label_en: 'Essay',
      required: true,
      status: 'verified',
      uploadedAt: '2025-04-11',
      fileName: 'essay.pdf',
      staffNote: 'Strong writing, clear vision',
    },
    {
      id: 'd4',
      label_th: 'สำเนาบัตรนักศึกษา',
      label_en: 'Student ID Copy',
      required: true,
      status: 'verified',
      uploadedAt: '2025-04-10',
    },
  ],
  'app_002': [
    {
      id: 'd5',
      label_th: 'ใบสมัคร',
      label_en: 'Application Form',
      required: true,
      status: 'verified',
      uploadedAt: '2025-04-15',
    },
    {
      id: 'd6',
      label_th: 'ทะเบียนบ้าน',
      label_en: 'Household Registration',
      required: true,
      status: 'rejected',
      uploadedAt: '2025-04-20',
      rejectionReason: 'Document expired - needs current registration',
      fileName: 'household_reg_old.pdf',
    },
    {
      id: 'd7',
      label_th: 'หลักฐานรายได้ผู้ปกครอง',
      label_en: 'Guardian Income Proof',
      required: true,
      status: 'needs_replacement',
      replacementMessage: 'Please submit current year tax return or payslip',
    },
  ],
}

// Match Reviews (matching decisions with confidence)
export const mockMatchReviews: MatchReview[] = [
  {
    id: 'match_001',
    applicationId: 'app_001',
    scholarshipId: 'sch_001',
    scholarshipTitle_en: 'Innovation & Social Enterprise Scholarship',
    scholarshipTitle_th: 'ทุนนวัตกรรมฯ',
    studentToken: 'Student #S-1847',
    matchScore: 87,
    confidence: 0.94,
    confidenceBand: 'excellent',
    hardEligibilityPass: true,
    hardEligibilityDetails: 'GPA 3.7 > 3.25 ✓ | Year 4 is eligible ✓',
    softMatchBreakdown: [
      { criterion: 'Academic Excellence', contribution: 28 },
      { criterion: 'Leadership Experience', contribution: 25 },
      { criterion: 'Project Quality', contribution: 22 },
      { criterion: 'Essay Quality', contribution: 12 },
    ],
    fairnessFlag: {
      type: 'low_income_high_match',
      message: 'High match + Low-to-moderate financial need. Verify intent to support low-income students.',
    },
    dataFreshness: 'fresh',
    lastUpdated: '2025-04-22',
  },
  {
    id: 'match_002',
    applicationId: 'app_002',
    scholarshipId: 'sch_003',
    scholarshipTitle_en: 'Faculty Equity Scholarship',
    scholarshipTitle_th: 'ทุนคณะรัฐศาสตร์ฯ',
    studentToken: 'Student #S-1923',
    matchScore: 65,
    confidence: 0.58,
    confidenceBand: 'weak',
    hardEligibilityPass: true,
    hardEligibilityDetails: 'GPA 3.4 > 2.5 ✓ | Financial need documented ✓',
    softMatchBreakdown: [
      { criterion: 'Financial Need', contribution: 35 },
      { criterion: 'Academic Progress', contribution: 18 },
      { criterion: 'Community Engagement', contribution: 12 },
    ],
    fairnessFlag: {
      type: 'high_match_low_gpa',
      message: 'High financial need but lower GPA. Ensure decision aligns with scholarship equity goals.',
    },
    dataFreshness: 'fresh',
    lastUpdated: '2025-04-25',
  },
]

// Manual Overrides (history of overrides)
export const mockManualOverrides: ManualOverride[] = [
  {
    id: 'override_001',
    matchId: 'match_002',
    originalDecision: 'shortlist',
    proposedDecision: 'not_shortlist',
    reason: 'Student contacted declining further consideration due to family circumstances',
    overriddenBy: 'รัตนา มะลิวัลย์',
    overriddenAt: '2025-04-25T14:30:00Z',
    auditNote: 'Student withdrawal confirmed via email on 2025-04-24',
  },
]

// Staff Disclosure Requests (from Provider Phase 5 shortlist requests, now awaiting staff approval)
export const mockStaffDisclosureRequests: StaffDisclosureRequest[] = [
  {
    id: 'disc_req_001',
    scholarshipId: 'sch_001',
    scholarshipTitle_en: 'JCC Excellence Scholarship',
    scholarshipTitle_th: 'ทุน JCC เพื่อนักศึกษาดีเด่น',
    candidateToken: 'Candidate #C-2048',
    providerName: 'JCC Company Limited',
    providerReason: 'Exceptional academic performance with strong leadership record in community service initiatives.',
    matchSummary: 'Excellent match (94% confidence). Hard eligibility: PASS. Soft score: 87/100.',
    matchConfidence: 0.94,
    status: 'pending_staff_approval',
    disclosureRiskNote: 'Provider requested identity disclosure. If approved, provider will have full PII access for direct engagement.',
    fieldsToDisclose: ['name', 'email', 'phone', 'student_id', 'gpa', 'department', 'academic_year'],
    requestedAt: '2026-04-20T10:00:00Z',
  },
  {
    id: 'disc_req_002',
    scholarshipId: 'sch_002',
    scholarshipTitle_en: 'JCC International Study Grant',
    scholarshipTitle_th: 'ทุน JCC สำหรับการเรียนต่อต่างประเทศ',
    candidateToken: 'Candidate #C-3001',
    providerName: 'JCC Company Limited',
    providerReason: 'Strong international background and language proficiency. Fits program requirements.',
    matchSummary: 'Excellent match (91% confidence). Hard eligibility: PASS. Soft score: 89/100.',
    matchConfidence: 0.91,
    status: 'approved',
    disclosureRiskNote: 'APPROVED by Staff on 2026-04-21. Provider can now engage directly with recipient.',
    fieldsToDisclose: ['name', 'email', 'phone', 'gpa'],
    requestedAt: '2026-04-20T11:30:00Z',
    approvedAt: '2026-04-21T09:00:00Z',
    approvedBy: 'นายสมชาย ใจเย็น',
  },
  {
    id: 'disc_req_003',
    scholarshipId: 'sch_001',
    scholarshipTitle_en: 'JCC Excellence Scholarship',
    scholarshipTitle_th: 'ทุน JCC เพื่อนักศึกษาดีเด่น',
    candidateToken: 'Candidate #C-2049',
    providerName: 'JCC Company Limited',
    providerReason: 'Strong match. Leadership potential evident.',
    matchSummary: 'Strong match (87% confidence). Hard eligibility: PASS. Soft score: 85/100.',
    matchConfidence: 0.87,
    status: 'rejected',
    disclosureRiskNote: 'REJECTED by Staff on 2026-04-21. Reason: Candidate flagged for further verification before disclosure.',
    fieldsToDisclose: [],
    requestedAt: '2026-04-20T12:15:00Z',
    rejectionReason: 'Candidate flagged for further verification before disclosure. Please resubmit after verification complete.',
    approvedBy: 'นายสมชาย ใจเย็น',
  },
]

// Data Quality Issues (staff-facing quality tracker)
export const mockDataQualityIssues: DataQualityIssue[] = [
  {
    id: 'dq_001',
    type: 'missing_gpa',
    affectedCount: 3,
    suggestedFix: 'Contact student to submit official transcript from registrar',
    owner: 'สมชาย ใจเย็น',
    status: 'open',
    severity: 'high',
    createdAt: '2026-04-15',
  },
  {
    id: 'dq_002',
    type: 'stale_lms_data',
    affectedCount: 12,
    suggestedFix: 'Sync with LMS API to refresh enrollment status (last sync: 2 weeks ago)',
    owner: 'IT Support',
    status: 'in_progress',
    severity: 'high',
    createdAt: '2026-04-10',
  },
  {
    id: 'dq_003',
    type: 'duplicate_record',
    affectedCount: 2,
    suggestedFix: 'Merge student records S-1234 and S-5678 (same email, different IDs)',
    owner: 'Database Admin',
    status: 'open',
    severity: 'high',
    createdAt: '2026-04-18',
  },
  {
    id: 'dq_004',
    type: 'consent_missing',
    affectedCount: 5,
    suggestedFix: 'Re-send consent form request to affected students',
    owner: 'รัตนา มะลิวัลย์',
    status: 'resolved',
    severity: 'medium',
    createdAt: '2026-04-12',
  },
  {
    id: 'dq_005',
    type: 'finance_mismatch',
    affectedCount: 1,
    suggestedFix: 'Update financial information for Student #S-1847 (income discrepancy with LMS)',
    owner: 'สมชาย ใจเย็น',
    status: 'open',
    severity: 'medium',
    createdAt: '2026-04-20',
  },
]

// Staff Notes (per application)
export const mockStaffNotes: Record<string, StaffNote[]> = {
  'app_001': [
    {
      id: 'note_001',
      applicationId: 'app_001',
      content: 'Excellent project proposal - shows strong innovation thinking. Recommend for interview.',
      createdBy: 'นายสมชาย ใจเย็น',
      createdAt: '2025-04-18',
    },
    {
      id: 'note_002',
      applicationId: 'app_001',
      content: 'Interview scheduled for 2025-05-05 at 13:00. Student confirmed attendance.',
      createdBy: 'รัตนา มะลิวัลย์',
      createdAt: '2025-04-22',
    },
  ],
  'app_002': [
    {
      id: 'note_003',
      applicationId: 'app_002',
      content: 'Documents incomplete - requested household registration and income proof on 2025-04-20.',
      createdBy: 'นายสมชาย ใจเย็น',
      createdAt: '2025-04-20',
    },
  ],
}

// Audit Events (timeline of all staff actions)
export const mockAuditEvents: AuditEvent[] = [
  {
    id: 'audit_001',
    timestamp: '2026-04-21T09:00:00Z',
    action: 'disclosure_approved',
    applicationId: 'app_001',
    actor: 'นายสมชาย ใจเย็น',
    reason: 'Match confidence high, all documents verified',
    details: { disclosureRequestId: 'disc_req_002', candidateToken: 'Candidate #C-3001' },
  },
  {
    id: 'audit_002',
    timestamp: '2026-04-21T09:15:00Z',
    action: 'disclosure_rejected',
    applicationId: 'app_002',
    actor: 'นายสมชาย ใจเย็น',
    reason: 'Candidate flagged for further verification before disclosure',
    details: { disclosureRequestId: 'disc_req_003', candidateToken: 'Candidate #C-2049' },
  },
  {
    id: 'audit_003',
    timestamp: '2025-04-18T14:30:00Z',
    action: 'document_verified',
    applicationId: 'app_001',
    actor: 'รัตนา มะลิวัลย์',
    details: { documentId: 'd3', label: 'Essay' },
  },
  {
    id: 'audit_004',
    timestamp: '2025-04-20T10:00:00Z',
    action: 'document_rejected',
    applicationId: 'app_002',
    actor: 'นายสมชาย ใจเย็น',
    reason: 'Document expired - needs current registration',
    details: { documentId: 'd6', label: 'Household Registration' },
  },
  {
    id: 'audit_005',
    timestamp: '2025-04-20T10:05:00Z',
    action: 'document_replacement_requested',
    applicationId: 'app_002',
    actor: 'นายสมชาย ใจเย็น',
    reason: 'Please submit current year tax return or payslip',
    details: { documentId: 'd7', label: 'Guardian Income Proof' },
  },
  {
    id: 'audit_006',
    timestamp: '2025-04-22T16:45:00Z',
    action: 'staff_note_added',
    applicationId: 'app_001',
    actor: 'รัตนา มะลิวัลย์',
    details: { noteId: 'note_002', content: 'Interview scheduled for 2025-05-05 at 13:00' },
  },
]
