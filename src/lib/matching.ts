import type {
  EligibilityCriterion,
  EligibilityStatus,
  MatchReason,
  MatchStatus,
  Scholarship,
  ScholarshipMatchResult,
} from './types'

type RequirementInputStatus = EligibilityStatus | 'verified' | 'uploaded' | 'pending' | 'missing' | 'rejected'

export interface ScholarshipMatchingProfile {
  student_id: string
  gpa?: number | null
  academic_year?: number | null
  profileVerificationStatus?: EligibilityStatus
  requirementStatuses?: Record<string, RequirementInputStatus | undefined>
  financialNeedPercentile?: number
  activities?: string[]
  skills?: string[]
}

const STATUS_REVIEW_FLAGS: EligibilityStatus[] = ['PENDING', 'UNCLEAR', 'NOT_VERIFIED']

function normalizeRequirementStatus(status: RequirementInputStatus | undefined): EligibilityStatus {
  if (!status) return 'MISSING'
  if (status === 'verified') return 'PASS'
  if (status === 'uploaded' || status === 'pending') return 'PENDING'
  if (status === 'missing') return 'MISSING'
  if (status === 'rejected') return 'FAIL'
  return status
}

function criterion(
  id: string,
  label: string,
  mandatory: boolean,
  status: EligibilityStatus,
  requirement: string,
  observed_value: EligibilityCriterion['observed_value'],
  maxScore: number,
  reason?: string,
): EligibilityCriterion {
  return {
    id,
    label_th: label,
    label_en: label,
    mandatory,
    status,
    requirement,
    observed_value,
    score_contribution: status === 'PASS' ? maxScore : 0,
    reason,
  }
}

function evaluateGpa(scholarship: Scholarship, profile: ScholarshipMatchingProfile): EligibilityCriterion {
  if (profile.gpa === null || profile.gpa === undefined) {
    return criterion('gpa', 'Minimum GPA', true, 'MISSING', `GPA >= ${scholarship.gpa_min}`, null, 35, 'Student GPA is missing.')
  }

  const passed = profile.gpa >= scholarship.gpa_min
  return criterion(
    'gpa',
    'Minimum GPA',
    true,
    passed ? 'PASS' : 'FAIL',
    `GPA >= ${scholarship.gpa_min}`,
    profile.gpa,
    35,
    passed ? 'GPA meets the minimum requirement.' : 'GPA is below the minimum requirement.',
  )
}

function evaluateAcademicYear(scholarship: Scholarship, profile: ScholarshipMatchingProfile): EligibilityCriterion {
  const eligibleYears = scholarship.academic_year
  if (!eligibleYears || eligibleYears.length === 0) {
    return criterion('academic_year', 'Academic year', true, 'PASS', 'Any academic year', profile.academic_year ?? null, 15, 'No year restriction.')
  }

  if (profile.academic_year === null || profile.academic_year === undefined) {
    return criterion('academic_year', 'Academic year', true, 'MISSING', `Year in ${eligibleYears.join(', ')}`, null, 15, 'Academic year is missing.')
  }

  const passed = eligibleYears.includes(profile.academic_year)
  return criterion(
    'academic_year',
    'Academic year',
    true,
    passed ? 'PASS' : 'FAIL',
    `Year in ${eligibleYears.join(', ')}`,
    profile.academic_year,
    15,
    passed ? 'Academic year is eligible.' : 'Academic year is outside the eligible range.',
  )
}

function evaluateProfileVerification(profile: ScholarshipMatchingProfile): EligibilityCriterion {
  const status = profile.profileVerificationStatus ?? 'NOT_VERIFIED'
  return criterion(
    'profile_verification',
    'Profile verification',
    true,
    status,
    'Student profile verified',
    status,
    10,
    status === 'PASS' ? 'Profile data is verified.' : 'Profile data must be verified before a full match.',
  )
}

function evaluateRequiredMaterial(
  id: 'essay' | 'proposal',
  label: string,
  required: boolean,
  profile: ScholarshipMatchingProfile,
): EligibilityCriterion | null {
  if (!required) return null

  const status = normalizeRequirementStatus(profile.requirementStatuses?.[id])
  return criterion(
    id,
    label,
    true,
    status,
    `${label} verified`,
    profile.requirementStatuses?.[id] ?? null,
    10,
    status === 'PASS' ? `${label} is verified.` : `${label} is not verified.`,
  )
}

function calculateSoftScore(scholarship: Scholarship, profile: ScholarshipMatchingProfile): number {
  if (scholarship.type === 'need') {
    return Math.min(20, Math.round((profile.financialNeedPercentile ?? 0) / 5))
  }

  if (scholarship.type === 'merit' && profile.gpa !== null && profile.gpa !== undefined) {
    return Math.min(20, Math.max(0, Math.round((profile.gpa - scholarship.gpa_min) * 20)))
  }

  if (scholarship.type === 'activity') {
    return Math.min(20, (profile.activities ?? []).length * 5)
  }

  if (scholarship.type === 'research') {
    return profile.requirementStatuses?.proposal === 'verified' ? 20 : Math.min(12, (profile.skills ?? []).length * 4)
  }

  if (scholarship.type === 'international') {
    const hasLanguageSignal = (profile.skills ?? []).some((skill) => /english|ielts|toefl|language/i.test(skill))
    return hasLanguageSignal ? 20 : 0
  }

  return 0
}

export function getMatchStatus(criteria: EligibilityCriterion[]): MatchStatus {
  const mandatory = criteria.filter((item) => item.mandatory)

  if (mandatory.some((item) => item.status === 'FAIL')) {
    return 'NOT_ELIGIBLE'
  }

  if (mandatory.some((item) => STATUS_REVIEW_FLAGS.includes(item.status))) {
    return 'PENDING_REVIEW'
  }

  if (mandatory.some((item) => item.status === 'MISSING')) {
    return 'NEAR_MATCH'
  }

  return 'MATCHED'
}

function buildReasons(criteria: EligibilityCriterion[], score: number): MatchReason[] {
  return criteria.flatMap((item): MatchReason[] => {
    if (item.status === 'PASS') {
      return [{
        id: `strength_${item.id}`,
        type: 'strength',
        label_th: item.label_th,
        label_en: item.label_en,
        detail: item.reason,
        criterion_id: item.id,
      }]
    }

    if (item.status === 'FAIL') {
      return [{
        id: `disqualifier_${item.id}`,
        type: 'disqualifier',
        label_th: item.label_th,
        label_en: item.label_en,
        detail: item.reason,
        criterion_id: item.id,
      }]
    }

    return [{
      id: `review_${item.id}`,
      type: item.status === 'MISSING' ? 'missing_requirement' : 'review_flag',
      label_th: item.label_th,
      label_en: item.label_en,
      detail: item.reason,
      criterion_id: item.id,
    }]
  }).concat(score >= 85 ? [{
    id: 'strong_soft_fit',
    type: 'strength',
    label_th: 'Strong overall fit',
    label_en: 'Strong overall fit',
    detail: 'Soft score is high, but mandatory criteria still control the final status.',
  }] : [])
}

export function calculateScholarshipMatch(
  scholarship: Scholarship,
  profile: ScholarshipMatchingProfile,
): ScholarshipMatchResult {
  const materialCriteria = [
    evaluateRequiredMaterial('essay', 'Essay', scholarship.has_essay, profile),
    evaluateRequiredMaterial('proposal', 'Project proposal', scholarship.has_proposal, profile),
  ].filter((item): item is EligibilityCriterion => Boolean(item))

  const criteria = [
    evaluateGpa(scholarship, profile),
    evaluateAcademicYear(scholarship, profile),
    evaluateProfileVerification(profile),
    ...materialCriteria,
  ]

  const matchScore = Math.min(100, criteria.reduce((total, item) => total + item.score_contribution, 0) + calculateSoftScore(scholarship, profile))
  const matchStatus = getMatchStatus(criteria)
  const incompleteMandatory = criteria.filter((item) => item.mandatory && item.status !== 'PASS')

  return {
    scholarship_id: scholarship.id,
    student_id: profile.student_id,
    matchStatus,
    matchScore,
    criteria,
    reasons: buildReasons(criteria, matchScore),
    missingRequirements: incompleteMandatory
      .filter((item) => item.status === 'MISSING')
      .map((item) => item.requirement),
    reviewFlags: incompleteMandatory
      .filter((item) => STATUS_REVIEW_FLAGS.includes(item.status))
      .map((item) => item.requirement),
  }
}

export function calculateScholarshipMatches(
  scholarships: Scholarship[],
  profile: ScholarshipMatchingProfile,
): ScholarshipMatchResult[] {
  return scholarships
    .map((scholarship) => calculateScholarshipMatch(scholarship, profile))
    .sort((a, b) => b.matchScore - a.matchScore)
}

export function calculateSubmittedHours(startAt: string, endAt: string): number {
  const start = new Date(startAt).getTime()
  const end = new Date(endAt).getTime()

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return 0
  }

  return Math.round(((end - start) / 3_600_000) * 100) / 100
}
