// Provider-specific mock data
// Candidate anonymization: ONLY tokens (Candidate #C-XXXX), NO student names/IDs/emails
// Data shown to provider: Aggregate statistics only (ranges, percentiles, distributions)

export interface Scholarship {
  id: string
  title_th: string
  title_en: string
  provider: string // Provider name
  provider_th: string
  amount: number
  num_awards: number
  deadline: string // YYYY-MM-DD
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'ARCHIVED'
  description_th: string
  description_en: string
  gpa_min: number
  academic_year: number[]
  has_essay: boolean
  has_interview: boolean
  has_proposal: boolean
  created_at: string
  // Provider Phase 5 - Extended properties
  matchedCandidates?: CandidateMatch[]
  candidatePoolStats?: CandidatePoolStats
  criteriaConfig?: CriteriaConfig
  providerImpact?: ProviderImpact
}

export interface CandidateMatch {
  id: string
  candidateToken: string // ONLY: Candidate #C-XXXX (no names, IDs, emails)
  scholarshipId: string
  matchConfidence: number // 0-1
  matchRankBand: 'excellent' | 'strong' | 'moderate' | 'weak'
  scoringDetails: Array<{
    criterionName: string
    contribution: number // 0-10
  }>
  aggregateStats: {
    gpaRange: { min: number; max: number }
    financialNeedPercentile: number
  }
}

export interface ShortlistRequest {
  id: string
  scholarshipId: string
  candidateToken: string
  reason: string
  status: 'pending_review' | 'approved' | 'rejected'
  createdAt: string
}

export interface CandidatePoolStats {
  scholarshipId: string
  totalCandidates: number
  excellentMatches: number
  strongMatches: number
  moderateMatches: number
  averageConfidence: number
}

export interface ProviderImpact {
  provider: string
  scholarshipsOffered: number
  awardedCount: number
  totalAwardAmount: number
  averageStudentGPA: number
  studentRetentionRate: number
  careerOutcomeRate: number
}

// Mock Scholarships Base Data (JCC Company Limited)
const mockProviderScholarshipsBase: Scholarship[] = [
  {
    id: 'sch_001',
    title_th: 'ทุน JCC เพื่อนักศึกษาดีเด่น',
    title_en: 'JCC Excellence Scholarship',
    provider: 'JCC Company Limited',
    provider_th: 'บริษัท เจซีซี จำกัด',
    amount: 50000,
    num_awards: 3,
    deadline: '2025-05-30',
    status: 'OPEN',
    description_th: 'เสริมสร้างผู้นำรุ่นใหม่ที่มีความเป็นเลิศทางวิชาการและจิตสาธารณะ',
    description_en: 'Building next-generation leaders with academic excellence and public spirit',
    gpa_min: 3.25,
    academic_year: [2, 3, 4],
    has_essay: true,
    has_interview: true,
    has_proposal: false,
    created_at: '2025-03-20T08:00:00Z',
  },
  {
    id: 'sch_002',
    title_th: 'ทุน JCC สำหรับการเรียนต่อต่างประเทศ',
    title_en: 'JCC International Study Grant',
    provider: 'JCC Company Limited',
    provider_th: 'บริษัท เจซีซี จำกัด',
    amount: 75000,
    num_awards: 2,
    deadline: '2025-06-15',
    status: 'OPEN',
    description_th: 'สนับสนุนนักศึกษาที่มีแผนศึกษาต่อต่างประเทศ',
    description_en: 'Supporting students pursuing international education',
    gpa_min: 3.5,
    academic_year: [3, 4],
    has_essay: true,
    has_interview: true,
    has_proposal: true,
    created_at: '2025-04-01T08:00:00Z',
  },
  {
    id: 'sch_003',
    title_th: 'ทุน JCC ด้านวิทยาศาสตร์และเทคโนโลยี (ร่าง)',
    title_en: 'JCC Science & Technology Scholarship (Draft)',
    provider: 'JCC Company Limited',
    provider_th: 'บริษัท เจซีซี จำกัด',
    amount: 40000,
    num_awards: 5,
    deadline: '2025-07-31',
    status: 'DRAFT',
    description_th: 'มุ่งสนับสนุนนักศึกษาวิทยาศาสตร์และเทคโนโลยี',
    description_en: 'Supporting science and technology students',
    gpa_min: 3.0,
    academic_year: [1, 2, 3, 4],
    has_essay: true,
    has_interview: false,
    has_proposal: true,
    created_at: '2025-04-10T08:00:00Z',
  },
]

// Mock Candidate Matches (Anonymous - Tokens ONLY)
export const mockProviderCandidates: Record<string, CandidateMatch[]> = {
  'sch_001': [
    {
      id: 'match-1',
      candidateToken: 'Candidate #C-2048',
      scholarshipId: 'sch_001',
      matchConfidence: 0.94,
      matchRankBand: 'excellent',
      scoringDetails: [
        { criterionName: 'Academic Excellence', contribution: 28.2 },
        { criterionName: 'Leadership Experience', contribution: 23.5 },
        { criterionName: 'Community Contribution', contribution: 21.7 },
        { criterionName: 'Personal Statement Quality', contribution: 20.6 },
      ],
      aggregateStats: {
        gpaRange: { min: 3.8, max: 4.0 },
        financialNeedPercentile: 65,
      },
    },
    {
      id: 'match-2',
      candidateToken: 'Candidate #C-2049',
      scholarshipId: 'sch_001',
      matchConfidence: 0.87,
      matchRankBand: 'strong',
      scoringDetails: [
        { criterionName: 'Academic Excellence', contribution: 26.1 },
        { criterionName: 'Leadership Experience', contribution: 21.8 },
        { criterionName: 'Community Contribution', contribution: 19.4 },
        { criterionName: 'Personal Statement Quality', contribution: 19.7 },
      ],
      aggregateStats: {
        gpaRange: { min: 3.7, max: 3.9 },
        financialNeedPercentile: 55,
      },
    },
    {
      id: 'match-3',
      candidateToken: 'Candidate #C-2050',
      scholarshipId: 'sch_001',
      matchConfidence: 0.72,
      matchRankBand: 'moderate',
      scoringDetails: [
        { criterionName: 'Academic Excellence', contribution: 21.6 },
        { criterionName: 'Leadership Experience', contribution: 18.2 },
        { criterionName: 'Community Contribution', contribution: 16.8 },
        { criterionName: 'Personal Statement Quality', contribution: 15.4 },
      ],
      aggregateStats: {
        gpaRange: { min: 3.4, max: 3.6 },
        financialNeedPercentile: 45,
      },
    },
    {
      id: 'match-4',
      candidateToken: 'Candidate #C-2051',
      scholarshipId: 'sch_001',
      matchConfidence: 0.58,
      matchRankBand: 'weak',
      scoringDetails: [
        { criterionName: 'Academic Excellence', contribution: 17.4 },
        { criterionName: 'Leadership Experience', contribution: 14.2 },
        { criterionName: 'Community Contribution', contribution: 13.5 },
        { criterionName: 'Personal Statement Quality', contribution: 12.9 },
      ],
      aggregateStats: {
        gpaRange: { min: 3.2, max: 3.4 },
        financialNeedPercentile: 35,
      },
    },
  ],
  'sch_002': [
    {
      id: 'match-5',
      candidateToken: 'Candidate #C-3001',
      scholarshipId: 'sch_002',
      matchConfidence: 0.91,
      matchRankBand: 'excellent',
      scoringDetails: [
        { criterionName: 'Academic Excellence', contribution: 27.3 },
        { criterionName: 'International Background', contribution: 25.4 },
        { criterionName: 'Language Proficiency', contribution: 22.8 },
        { criterionName: 'Global Outlook', contribution: 19.5 },
      ],
      aggregateStats: {
        gpaRange: { min: 3.8, max: 4.0 },
        financialNeedPercentile: 72,
      },
    },
    {
      id: 'match-6',
      candidateToken: 'Candidate #C-3002',
      scholarshipId: 'sch_002',
      matchConfidence: 0.79,
      matchRankBand: 'strong',
      scoringDetails: [
        { criterionName: 'Academic Excellence', contribution: 23.7 },
        { criterionName: 'International Background', contribution: 21.2 },
        { criterionName: 'Language Proficiency', contribution: 19.6 },
        { criterionName: 'Global Outlook', contribution: 16.5 },
      ],
      aggregateStats: {
        gpaRange: { min: 3.6, max: 3.85 },
        financialNeedPercentile: 62,
      },
    },
  ],
}

// Shortlist Requests (Status tracking)
export const mockProviderShortlists: Record<string, ShortlistRequest> = {
  'req-1': {
    id: 'req-1',
    scholarshipId: 'sch_001',
    candidateToken: 'Candidate #C-2048',
    reason: 'Exceptional academic performance with strong leadership record in community service initiatives.',
    status: 'approved',
    createdAt: '2026-04-20T10:00:00Z',
  },
}

// Candidate Pool Statistics
export const mockProviderPoolStats: Record<string, CandidatePoolStats> = {
  'sch_001': {
    scholarshipId: 'sch_001',
    totalCandidates: 127,
    excellentMatches: 12,
    strongMatches: 35,
    moderateMatches: 58,
    averageConfidence: 0.76,
  },
  'sch_002': {
    scholarshipId: 'sch_002',
    totalCandidates: 89,
    excellentMatches: 8,
    strongMatches: 22,
    moderateMatches: 45,
    averageConfidence: 0.71,
  },
}

// Provider Impact Metrics (Aggregate only - NO individual student data)
export const mockProviderImpactData: ProviderImpact = {
  provider: 'JCC Company Limited',
  scholarshipsOffered: 3,
  awardedCount: 28,
  totalAwardAmount: 700000,
  averageStudentGPA: 3.72,
  studentRetentionRate: 0.92,
  careerOutcomeRate: 0.88,
}

// Matching Criteria (for Criteria Builder)
export interface Criterion {
  id: string
  name: string
  type: 'gpa' | 'test_score' | 'essay_quality' | 'financial_need' | 'community_service' | 'other'
  weight: number // 0-100
}

export interface CriteriaConfig {
  scholarshipId: string
  criteria: Criterion[]
  hardConstraints: Array<{
    id: string
    name: string
    description: string
    type: 'field_of_study' | 'gpa' | 'test_score' | 'other'
  }>
}

export const mockProviderCriteria: Record<string, CriteriaConfig> = {
  'sch_001': {
    scholarshipId: 'sch_001',
    criteria: [
      { id: 'c1', name: 'Academic Excellence', type: 'gpa', weight: 30 },
      { id: 'c2', name: 'Leadership Experience', type: 'other', weight: 25 },
      { id: 'c3', name: 'Community Contribution', type: 'community_service', weight: 25 },
      { id: 'c4', name: 'Personal Statement Quality', type: 'essay_quality', weight: 20 },
    ],
    hardConstraints: [
      {
        id: 'h1',
        name: 'Minimum GPA',
        description: 'GPA must be at least 3.25',
        type: 'gpa',
      },
      {
        id: 'h2',
        name: 'Academic Year',
        description: 'Must be in year 2, 3, or 4',
        type: 'other',
      },
    ],
  },
  'sch_002': {
    scholarshipId: 'sch_002',
    criteria: [
      { id: 'c5', name: 'Academic Excellence', type: 'gpa', weight: 30 },
      { id: 'c6', name: 'International Background', type: 'other', weight: 28 },
      { id: 'c7', name: 'Language Proficiency', type: 'other', weight: 22 },
      { id: 'c8', name: 'Global Outlook', type: 'essay_quality', weight: 20 },
    ],
    hardConstraints: [
      {
        id: 'h3',
        name: 'Minimum GPA',
        description: 'GPA must be at least 3.5',
        type: 'gpa',
      },
      {
        id: 'h4',
        name: 'Academic Year',
        description: 'Must be in year 3 or 4',
        type: 'other',
      },
    ],
  },
}

// Augment scholarships with Phase 5 provider data
export const mockProviderScholarships: Scholarship[] = mockProviderScholarshipsBase.map((sch) => ({
  ...sch,
  matchedCandidates: mockProviderCandidates[sch.id] || [],
  candidatePoolStats: mockProviderPoolStats[sch.id],
  criteriaConfig: mockProviderCriteria[sch.id],
  providerImpact: mockProviderImpactData,
}))
