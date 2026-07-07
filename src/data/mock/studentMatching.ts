import type { ScholarshipMatchingProfile } from '@/lib/matching'

type RequirementStatuses = NonNullable<ScholarshipMatchingProfile['requirementStatuses']>

interface MatchingProfileOverride extends Omit<Partial<ScholarshipMatchingProfile>, 'requirementStatuses'> {
  requirementStatuses?: RequirementStatuses
}

export const mockStudentMatchingProfile: ScholarshipMatchingProfile = {
  student_id: 'mock_student_matching_001',
  gpa: 3.1,
  academic_year: 3,
  profileVerificationStatus: 'PASS',
  financialNeedPercentile: 85,
  activities: ['student council', 'community volunteer', 'policy club', 'social enterprise project'],
  skills: ['English communication', 'research writing'],
  requirementStatuses: {
    essay: 'verified',
    proposal: 'verified',
  },
}

export const mockScholarshipProfileOverrides: Record<string, MatchingProfileOverride> = {
  sch_001: {
    requirementStatuses: {
      essay: 'missing',
      proposal: 'verified',
    },
  },
  sch_002: {
    gpa: 3.1,
    requirementStatuses: {
      essay: 'verified',
    },
  },
  sch_003: {
    financialNeedPercentile: 90,
  },
  sch_004: {
    profileVerificationStatus: 'NOT_VERIFIED',
    requirementStatuses: {
      essay: 'verified',
    },
    skills: ['English communication', 'IELTS preparation'],
  },
  sch_005: {
    requirementStatuses: {
      proposal: 'uploaded',
    },
  },
}

export function getMockMatchingProfileForScholarship(scholarshipId: string): ScholarshipMatchingProfile {
  const override = mockScholarshipProfileOverrides[scholarshipId] ?? {}

  return {
    ...mockStudentMatchingProfile,
    ...override,
    requirementStatuses: {
      ...mockStudentMatchingProfile.requirementStatuses,
      ...override.requirementStatuses,
    },
  }
}
