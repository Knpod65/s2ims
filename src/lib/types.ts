// ── Role ──────────────────────────────────────────────────────────
export type Role = 'student' | 'staff' | 'esq' | 'provider' | 'admin'

// ── Scholarship ────────────────────────────────────────────────────
export type ScholarshipStatus =
  | 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'PUBLISHED'
  | 'OPEN' | 'CLOSED' | 'AWARDED'

export type ScholarshipType = 'merit' | 'need' | 'research' | 'activity' | 'international'

export interface Scholarship {
  id: string
  title_th: string
  title_en: string
  type: ScholarshipType
  amount: number
  num_awards: number
  deadline: string          // ISO date string
  status: ScholarshipStatus
  provider: string
  provider_th: string
  gpa_min: number
  academic_year?: number[]  // [1,2,3,4]
  has_essay: boolean
  has_interview: boolean
  has_proposal: boolean
  philosophy_th: string
  philosophy_en: string
  match_pct?: number        // Only for logged-in student
  is_saved?: boolean
  created_at: string
}

// ── Application ────────────────────────────────────────────────────
export type ApplicationStatus =
  | 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'NEEDS_DOCS'
  | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'AWARDED'
  | 'NOT_AWARDED' | 'CONFIRMED' | 'FINANCE_PENDING'
  | 'PAYMENT_PROCESSING' | 'COMPLETED' | 'FOLLOW_UP_REQUIRED'
  | 'REPORT_OVERDUE'

export interface ApplicationStep {
  label_th: string
  label_en: string
  status: 'done' | 'active' | 'pending' | 'error'
  date?: string
  note?: string
}

export interface Application {
  id: string
  scholarship_id: string
  scholarship_title_th: string
  scholarship_title_en: string
  student_id: string
  status: ApplicationStatus
  applied_at: string
  updated_at: string
  match_score: number
  steps: ApplicationStep[]
  docs_required: DocumentItem[]
  awarded_amount?: number
  override_reason?: string
}

export interface DocumentItem {
  id: string
  label_th: string
  label_en: string
  required: boolean
  status: 'pending' | 'uploaded' | 'verified' | 'rejected' | 'missing'
  file_name?: string
  uploaded_at?: string
  note?: string
}

// ── Announcement ────────────────────────────────────────────────────
export type AnnouncementType =
  | 'APPLICATION' | 'INTERVIEW_LIST' | 'INTERVIEW_SCHEDULE'
  | 'RESULT' | 'INDIVIDUAL_NOTIFY' | 'POST_AWARD_DOCS'
  | 'FOLLOW_UP_REMINDER' | 'FORFEITURE' | 'INTERNAL_DRAFT'

export type AnnouncementStatus =
  | 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED'
  | 'REVISION_REQUESTED' | 'REJECTED'

export interface Announcement {
  id: string
  scholarship_id: string
  type: AnnouncementType
  status: AnnouncementStatus
  title_th: string
  title_en: string
  body_th: string
  body_en: string
  deadline: string
  publish_date: string
  created_by: string
  esq_approved_by?: string
  esq_comment?: string
  created_at: string
  updated_at: string
  sla_hours?: number        // For ESQ dashboard
}

// ── Notification ───────────────────────────────────────────────────
export type NotificationType =
  | 'SCHOLARSHIP_OPEN' | 'DEADLINE_REMINDER' | 'MISSING_DOC'
  | 'SHORTLISTED' | 'INTERVIEW_SCHEDULE' | 'RESULT_AWARDED'
  | 'RESULT_NOT_AWARDED' | 'CONFIRM_NEEDED' | 'FINANCE_DOCS'
  | 'REPORT_DUE' | 'REPORT_OVERDUE' | 'ESQ_APPROVAL_NEEDED'
  | 'ANNOUNCEMENT_APPROVED'

export interface Notification {
  id: string
  type: NotificationType
  title_th: string
  title_en: string
  body_th: string
  body_en: string
  is_read: boolean
  created_at: string
  action_url?: string
}

// ── OCR ────────────────────────────────────────────────────────────
export interface OcrField {
  key: string
  label_th: string
  label_en: string
  value: string
  confidence: number        // 0–1
  edited?: boolean
}

export interface OcrJob {
  id: string
  file_name: string
  file_type: string
  status: 'pending' | 'extracting' | 'needs_review' | 'confirmed'
  fields: OcrField[]
  created_at: string
  confirmed_by?: string
  confirmed_at?: string
}

// ── User / Auth ────────────────────────────────────────────────────
export interface User {
  id: string
  name_th: string
  name_en: string
  email: string
  role: Role
  student_id?: string
  major?: string
  academic_year?: number
  avatar?: string
  is_active: boolean
  created_at: string
  last_login?: string
}

// ── Audit Log ──────────────────────────────────────────────────────
export interface AuditLog {
  id: string
  actor_id: string
  actor_name: string
  actor_role: Role
  action: string            // e.g. "announcement.approved"
  entity_type: string
  entity_id: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  ip: string
  created_at: string
}

// ── Analytics ──────────────────────────────────────────────────────
export interface FunnelStage {
  label_th: string
  label_en: string
  value: number
  dropoff?: number
  color?: string
}

// ── Navigation ─────────────────────────────────────────────────────
export interface NavItem {
  label_th: string
  label_en: string
  href: string
  icon: string
  badge?: number
  children?: NavItem[]
}

// ── Lang ───────────────────────────────────────────────────────────
export type Lang = 'th' | 'en'

// Scholarship Matching
export type EligibilityStatus =
  | 'PASS'
  | 'FAIL'
  | 'MISSING'
  | 'PENDING'
  | 'UNCLEAR'
  | 'NOT_VERIFIED'

export type MatchStatus = 'MATCHED' | 'NEAR_MATCH' | 'PENDING_REVIEW' | 'NOT_ELIGIBLE'

export interface EligibilityCriterion {
  id: string
  label_th: string
  label_en: string
  mandatory: boolean
  status: EligibilityStatus
  requirement: string
  observed_value?: string | number | boolean | null
  score_contribution: number
  reason?: string
}

export interface MatchReason {
  id: string
  type: 'strength' | 'missing_requirement' | 'review_flag' | 'disqualifier'
  label_th: string
  label_en: string
  detail?: string
  criterion_id?: string
}

export interface ScholarshipMatchResult {
  scholarship_id: string
  student_id: string
  matchStatus: MatchStatus
  matchScore: number
  criteria: EligibilityCriterion[]
  reasons: MatchReason[]
  missingRequirements: string[]
  reviewFlags: string[]
}

// TA / Work Scholarship
export type WorkLogStatus = 'DRAFT' | 'SUBMITTED' | 'CONFIRMED' | 'RETURNED' | 'REJECTED'

export type WorkCategory =
  | 'TEACHING_ASSISTANT'
  | 'RESEARCH_ASSISTANT'
  | 'ADMIN_SUPPORT'
  | 'EVENT_SUPPORT'
  | 'COMMUNITY_SERVICE'

export type SupervisorRole = 'FACULTY_SUPERVISOR' | 'STAFF_SUPERVISOR' | 'PROGRAM_COORDINATOR'

export interface WorkLog {
  id: string
  assignment_id: string
  student_id: string
  category: WorkCategory
  task_description: string
  start_at: string
  end_at: string
  submittedHours: number
  evidence_reference?: string
  status: WorkLogStatus
  createdAt: string
  updatedAt?: string
  submittedAt?: string
  reviewedAt?: string
  supervisor_id?: string
  supervisor_name?: string
  supervisor_role?: SupervisorRole
  actualConfirmedHours?: number
  supervisor_note?: string
}

export interface WorkScholarshipAssignment {
  id: string
  scholarship_id: string
  student_id: string
  supervisor_id: string
  supervisor_name: string
  supervisor_role: SupervisorRole
  category: WorkCategory
  title: string
  required_hours: number
  accumulatedConfirmedHours: number
  starts_at: string
  ends_at: string
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED'
}
