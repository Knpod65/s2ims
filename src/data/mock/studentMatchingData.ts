import type { Scholarship } from '@/lib/types'
import { mockScholarships } from './scholarships'

export type LocalizedText = {
  th: string
  en: string
}

export type MatchConfidence = 'low' | 'medium' | 'high'
export type EligibilityStatus = 'met' | 'unmet' | 'unknown'
export type MissingDataSeverity = 'low' | 'medium' | 'high'
export type DataFreshnessStatus = 'fresh' | 'stale' | 'failed'
export type ProfileSignalStatus = 'verified' | 'self-reported'

export interface DataFreshness {
  status: DataFreshnessStatus
  lastUpdated: string
  source: LocalizedText
}

export interface MissingDataItem {
  id: string
  label: LocalizedText
  description: LocalizedText
  impact: LocalizedText
  severity: MissingDataSeverity
  confidenceImpact: number
  ctaLabel: LocalizedText
  ctaHref: string
}

export interface EligibilityRow {
  id: string
  requirement: LocalizedText
  studentValue: LocalizedText
  status: EligibilityStatus
  note: LocalizedText
}

export interface FitContribution {
  id: string
  label: LocalizedText
  value: number
  description: LocalizedText
}

export interface StudentRecommendation {
  id: string
  scholarshipId: string
  deadline: string
  matchScore: number
  confidence: MatchConfidence
  confidencePercent: number
  eligibilityMet: number
  eligibilityTotal: number
  eligibilitySummary: LocalizedText
  hardEligibilitySummary: LocalizedText
  softFitSummary: LocalizedText
  needContextSummary: LocalizedText
  missingDataImpact: LocalizedText
  eligibilityChecklist: EligibilityRow[]
  fitBreakdown: FitContribution[]
}

export const studentDataFreshness: DataFreshness = {
  status: 'fresh',
  lastUpdated: '2026-05-07T09:30:00+07:00',
  source: {
    th: 'อัปเดตจากโปรไฟล์นักศึกษาและใบสมัครล่าสุด',
    en: 'Updated from your student profile and latest applications',
  },
}

export const studentProfileSummary = {
  completeness: 72,
  completedFields: 13,
  totalFields: 18,
  academic: [
    {
      label: { th: 'เกรดเฉลี่ยสะสม', en: 'Cumulative GPA' },
      value: { th: '3.25', en: '3.25' },
      status: 'verified' as ProfileSignalStatus,
    },
    {
      label: { th: 'ชั้นปี', en: 'Academic year' },
      value: { th: 'ปี 3', en: 'Year 3' },
      status: 'verified' as ProfileSignalStatus,
    },
    {
      label: { th: 'สาขาวิชา', en: 'Major' },
      value: { th: 'รัฐศาสตร์', en: 'Political Science' },
      status: 'verified' as ProfileSignalStatus,
    },
  ],
  financialNeed: [
    {
      label: { th: 'การทำงานระหว่างเรียน', en: 'Part-time work' },
      value: { th: 'มีงานพาร์ทไทม์', en: 'Works part-time' },
      status: 'self-reported' as ProfileSignalStatus,
    },
    {
      label: { th: 'ที่พักระหว่างเรียน', en: 'Term-time housing' },
      value: { th: 'หอพักมหาวิทยาลัย', en: 'University dormitory' },
      status: 'self-reported' as ProfileSignalStatus,
    },
    {
      label: { th: 'ภาระค่าใช้จ่าย', en: 'Expense context' },
      value: { th: 'ช่วยดูแลค่าใช้จ่ายของตนเองบางส่วน', en: 'Covers part of own expenses' },
      status: 'self-reported' as ProfileSignalStatus,
    },
  ],
  activities: [
    {
      label: { th: 'กิจกรรมอาสา', en: 'Volunteer work' },
      value: { th: 'กิจกรรมชุมชน 18 ชั่วโมง', en: '18 community hours' },
      status: 'self-reported' as ProfileSignalStatus,
    },
    {
      label: { th: 'บทบาทชมรม', en: 'Club role' },
      value: { th: 'รอข้อมูลเพิ่มเติม', en: 'Needs more detail' },
      status: 'self-reported' as ProfileSignalStatus,
    },
  ],
  documentReadiness: [
    {
      label: { th: 'ใบแสดงผลการเรียน', en: 'Transcript' },
      value: { th: 'พร้อมใช้งาน', en: 'Ready' },
      status: 'verified' as ProfileSignalStatus,
    },
    {
      label: { th: 'หลักฐานรายได้/ค่าใช้จ่าย', en: 'Income or expense evidence' },
      value: { th: 'ยังไม่ครบ', en: 'Incomplete' },
      status: 'self-reported' as ProfileSignalStatus,
    },
    {
      label: { th: 'เอกสารกิจกรรม', en: 'Activity evidence' },
      value: { th: 'ต้องอัปเดต', en: 'Needs update' },
      status: 'self-reported' as ProfileSignalStatus,
    },
  ],
}

export const studentMissingData: MissingDataItem[] = [
  {
    id: 'distance-from-home',
    label: { th: 'ระยะทางจากบ้าน', en: 'Distance from home' },
    description: {
      th: 'เพิ่มระยะทางโดยประมาณเพื่อให้ระบบเข้าใจบริบทการเดินทางและค่าใช้จ่าย',
      en: 'Add an approximate distance so S2IMS can understand travel and expense context.',
    },
    impact: {
      th: 'ช่วยเพิ่มความมั่นใจในการจับคู่ทุนที่พิจารณาบริบททางเศรษฐกิจ',
      en: 'Improves confidence for scholarships that consider economic context.',
    },
    severity: 'high',
    confidenceImpact: 14,
    ctaLabel: { th: 'เพิ่มระยะทาง', en: 'Add distance' },
    ctaHref: '/student/profile/improve#distance-from-home',
  },
  {
    id: 'income-evidence',
    label: { th: 'หลักฐานรายได้หรือค่าใช้จ่าย', en: 'Income or expense evidence' },
    description: {
      th: 'แนบหรือสรุปเอกสารที่ช่วยยืนยันบริบทความต้องการทุน',
      en: 'Attach or summarize evidence that supports your need context.',
    },
    impact: {
      th: 'ลดความไม่แน่นอนในทุนที่ใช้ปัจจัยความต้องการเป็นหลัก',
      en: 'Reduces uncertainty for need-sensitive scholarships.',
    },
    severity: 'high',
    confidenceImpact: 18,
    ctaLabel: { th: 'เตรียมข้อมูล', en: 'Prepare details' },
    ctaHref: '/student/profile/improve#income-evidence',
  },
  {
    id: 'club-role',
    label: { th: 'บทบาทในชมรมหรือกิจกรรม', en: 'Club or activity role' },
    description: {
      th: 'บอกบทบาทและผลงานสั้น ๆ เพื่อช่วยจับคู่ทุนด้านกิจกรรมและผู้นำ',
      en: 'Describe your role and contribution for activity and leadership scholarships.',
    },
    impact: {
      th: 'ช่วยให้ทุนด้านกิจกรรมเห็นความเหมาะสมได้ชัดขึ้น',
      en: 'Helps activity-focused scholarships understand your fit.',
    },
    severity: 'medium',
    confidenceImpact: 9,
    ctaLabel: { th: 'ปรับปรุงกิจกรรม', en: 'Improve activity info' },
    ctaHref: '/student/profile/improve#club-role',
  },
  {
    id: 'special-skills',
    label: { th: 'ทักษะพิเศษ', en: 'Special skills' },
    description: {
      th: 'เพิ่มทักษะที่เกี่ยวข้อง เช่น ภาษา การเขียน งานวิจัย หรือเทคโนโลยี',
      en: 'Add relevant skills such as language, writing, research, or technology.',
    },
    impact: {
      th: 'เพิ่มรายละเอียดสำหรับทุนที่ดูศักยภาพหรือความเหมาะสมเฉพาะด้าน',
      en: 'Adds useful detail for scholarships that consider specific strengths.',
    },
    severity: 'low',
    confidenceImpact: 5,
    ctaLabel: { th: 'เพิ่มทักษะ', en: 'Add skills' },
    ctaHref: '/student/profile/improve#special-skills',
  },
]

export const studentRecommendations: StudentRecommendation[] = [
  {
    id: 'rec_sch_001',
    scholarshipId: 'sch_001',
    deadline: '2026-06-18',
    matchScore: 87,
    confidence: 'high',
    confidencePercent: 88,
    eligibilityMet: 4,
    eligibilityTotal: 4,
    eligibilitySummary: {
      th: 'ผ่านเงื่อนไขหลักทั้งหมดที่ตรวจสอบได้',
      en: 'Meets all currently checkable hard criteria.',
    },
    hardEligibilitySummary: {
      th: 'เกรดเฉลี่ย ชั้นปี และสถานะนักศึกษาตรงตามข้อกำหนด',
      en: 'GPA, academic year, and student status match the requirements.',
    },
    softFitSummary: {
      th: 'กิจกรรมชุมชนและความสนใจด้านสังคมสอดคล้องกับแนวทุน',
      en: 'Community activity and social-impact interests align with the scholarship.',
    },
    needContextSummary: {
      th: 'บริบทค่าใช้จ่ายช่วยสนับสนุนความเหมาะสม แต่ยังเพิ่มหลักฐานได้',
      en: 'Expense context supports the match, with room to add more evidence.',
    },
    missingDataImpact: {
      th: 'เพิ่มบทบาทกิจกรรมและหลักฐานค่าใช้จ่ายจะทำให้คำอธิบายแม่นขึ้น',
      en: 'Adding activity role details and expense evidence would make the explanation stronger.',
    },
    eligibilityChecklist: [
      {
        id: 'gpa',
        requirement: { th: 'GPA ขั้นต่ำ 2.50', en: 'Minimum GPA 2.50' },
        studentValue: { th: '3.25', en: '3.25' },
        status: 'met',
        note: { th: 'ผ่านจากข้อมูลทะเบียน', en: 'Verified from registry data.' },
      },
      {
        id: 'year',
        requirement: { th: 'เปิดรับทุกชั้นปี', en: 'Open to all academic years' },
        studentValue: { th: 'ปี 3', en: 'Year 3' },
        status: 'met',
        note: { th: 'ตรงตามช่วงชั้นปี', en: 'Within the accepted academic year range.' },
      },
      {
        id: 'essay',
        requirement: { th: 'ต้องมีเรียงความ', en: 'Essay required' },
        studentValue: { th: 'ยังไม่เริ่มในระบบ', en: 'Not started in S2IMS' },
        status: 'unmet',
        note: { th: 'ยังสมัครได้ แต่ควรเตรียมก่อนส่งใบสมัคร', en: 'Still eligible, but prepare before submitting.' },
      },
      {
        id: 'proposal',
        requirement: { th: 'ต้องมีข้อเสนอโครงการ', en: 'Proposal required' },
        studentValue: { th: 'มีร่างกิจกรรมชุมชน', en: 'Community project draft exists' },
        status: 'met',
        note: { th: 'ข้อมูลกิจกรรมช่วยสนับสนุนส่วนนี้', en: 'Activity context supports this requirement.' },
      },
    ],
    fitBreakdown: [
      {
        id: 'eligibility',
        label: { th: 'เงื่อนไขหลัก', en: 'Hard eligibility' },
        value: 34,
        description: { th: 'ข้อมูลทะเบียนและ GPA ผ่านเกณฑ์', en: 'Registry data and GPA meet the criteria.' },
      },
      {
        id: 'activity',
        label: { th: 'กิจกรรมและผลกระทบ', en: 'Activity and impact' },
        value: 28,
        description: { th: 'กิจกรรมชุมชนสอดคล้องกับแนวทุน', en: 'Community activity aligns with the scholarship intent.' },
      },
      {
        id: 'need',
        label: { th: 'บริบทความต้องการ', en: 'Need context' },
        value: 18,
        description: { th: 'บริบทค่าใช้จ่ายช่วยเพิ่มความเหมาะสม', en: 'Expense context improves fit.' },
      },
      {
        id: 'freshness',
        label: { th: 'ความสดใหม่ของข้อมูล', en: 'Data freshness' },
        value: 7,
        description: { th: 'ข้อมูลโปรไฟล์เพิ่งอัปเดต', en: 'Profile data was updated recently.' },
      },
    ],
  },
  {
    id: 'rec_sch_003',
    scholarshipId: 'sch_003',
    deadline: '2026-06-30',
    matchScore: 82,
    confidence: 'medium',
    confidencePercent: 74,
    eligibilityMet: 3,
    eligibilityTotal: 3,
    eligibilitySummary: {
      th: 'ผ่านเงื่อนไขหลัก แต่ความมั่นใจยังขึ้นกับหลักฐานค่าใช้จ่าย',
      en: 'Meets hard criteria, with confidence depending on expense evidence.',
    },
    hardEligibilitySummary: {
      th: 'GPA และชั้นปีตรงตามทุนเสมอภาคของคณะ',
      en: 'GPA and academic year align with the faculty equity scholarship.',
    },
    softFitSummary: {
      th: 'ความเหมาะสมหลักมาจากบริบทความต้องการ ไม่ใช่กิจกรรม',
      en: 'The fit is driven mostly by need context rather than activities.',
    },
    needContextSummary: {
      th: 'ข้อมูลการทำงานและที่พักช่วยอธิบายบริบท แต่ยังไม่มีหลักฐานครบ',
      en: 'Work and housing signals help, but evidence is still incomplete.',
    },
    missingDataImpact: {
      th: 'หลักฐานรายได้หรือค่าใช้จ่ายจะช่วยเพิ่มความมั่นใจอย่างมาก',
      en: 'Income or expense evidence would substantially improve confidence.',
    },
    eligibilityChecklist: [
      {
        id: 'gpa',
        requirement: { th: 'GPA ขั้นต่ำ 2.00', en: 'Minimum GPA 2.00' },
        studentValue: { th: '3.25', en: '3.25' },
        status: 'met',
        note: { th: 'ผ่านจากข้อมูลทะเบียน', en: 'Verified from registry data.' },
      },
      {
        id: 'year',
        requirement: { th: 'เปิดรับทุกชั้นปี', en: 'Open to all academic years' },
        studentValue: { th: 'ปี 3', en: 'Year 3' },
        status: 'met',
        note: { th: 'ตรงตามเกณฑ์', en: 'Matches the requirement.' },
      },
      {
        id: 'need',
        requirement: { th: 'ข้อมูลบริบทความต้องการทุน', en: 'Need-context information' },
        studentValue: { th: 'มีบางส่วน', en: 'Partially provided' },
        status: 'unmet',
        note: { th: 'ยังไม่ใช่การปฏิเสธ แค่ควรเพิ่มข้อมูล', en: 'Not a rejection, just a prompt to add detail.' },
      },
    ],
    fitBreakdown: [
      {
        id: 'eligibility',
        label: { th: 'เงื่อนไขหลัก', en: 'Hard eligibility' },
        value: 30,
        description: { th: 'ข้อมูลทะเบียนผ่านเกณฑ์ขั้นต่ำ', en: 'Registry data meets minimum criteria.' },
      },
      {
        id: 'need',
        label: { th: 'บริบทความต้องการ', en: 'Need context' },
        value: 32,
        description: { th: 'งานพาร์ทไทม์และที่พักเป็นสัญญาณสำคัญ', en: 'Part-time work and housing are useful signals.' },
      },
      {
        id: 'documents',
        label: { th: 'ความพร้อมเอกสาร', en: 'Document readiness' },
        value: 12,
        description: { th: 'หลักฐานยังไม่ครบ ทำให้ความมั่นใจลดลง', en: 'Incomplete evidence lowers confidence.' },
      },
      {
        id: 'freshness',
        label: { th: 'ความสดใหม่ของข้อมูล', en: 'Data freshness' },
        value: 8,
        description: { th: 'ข้อมูลล่าสุดยังใช้ได้', en: 'Recent data is usable.' },
      },
    ],
  },
  {
    id: 'rec_sch_005',
    scholarshipId: 'sch_005',
    deadline: '2026-07-12',
    matchScore: 69,
    confidence: 'medium',
    confidencePercent: 63,
    eligibilityMet: 2,
    eligibilityTotal: 3,
    eligibilitySummary: {
      th: 'ใกล้เคียงมาก แต่ควรเสริมทักษะหรือประสบการณ์วิจัย',
      en: 'A close match, but research skills or experience would help.',
    },
    hardEligibilitySummary: {
      th: 'GPA และชั้นปีผ่านเกณฑ์สำหรับทุนวิจัย',
      en: 'GPA and academic year meet the research scholarship requirements.',
    },
    softFitSummary: {
      th: 'ยังมีข้อมูลทักษะพิเศษน้อย ระบบจึงอธิบายความเหมาะสมได้จำกัด',
      en: 'Skill data is still light, limiting the fit explanation.',
    },
    needContextSummary: {
      th: 'ปัจจัยบริบทมีผลรองสำหรับทุนนี้',
      en: 'Need/context factors have a smaller role for this scholarship.',
    },
    missingDataImpact: {
      th: 'เพิ่มทักษะวิจัยหรือผลงานเขียนจะช่วยให้คะแนนความเหมาะสมชัดขึ้น',
      en: 'Adding research skills or writing samples would clarify the fit.',
    },
    eligibilityChecklist: [
      {
        id: 'gpa',
        requirement: { th: 'GPA ขั้นต่ำ 3.00', en: 'Minimum GPA 3.00' },
        studentValue: { th: '3.25', en: '3.25' },
        status: 'met',
        note: { th: 'ผ่านเกณฑ์ขั้นต่ำ', en: 'Meets the minimum.' },
      },
      {
        id: 'year',
        requirement: { th: 'ชั้นปี 3-4', en: 'Years 3-4' },
        studentValue: { th: 'ปี 3', en: 'Year 3' },
        status: 'met',
        note: { th: 'อยู่ในช่วงที่รับสมัคร', en: 'Within accepted range.' },
      },
      {
        id: 'proposal',
        requirement: { th: 'ข้อเสนอโครงการวิจัย', en: 'Research proposal' },
        studentValue: { th: 'ยังไม่มีในโปรไฟล์', en: 'Not in profile yet' },
        status: 'unmet',
        note: { th: 'เตรียมได้ก่อนสมัคร', en: 'Can be prepared before applying.' },
      },
    ],
    fitBreakdown: [
      {
        id: 'eligibility',
        label: { th: 'เงื่อนไขหลัก', en: 'Hard eligibility' },
        value: 31,
        description: { th: 'ผ่าน GPA และชั้นปี', en: 'GPA and year are eligible.' },
      },
      {
        id: 'research',
        label: { th: 'ความพร้อมด้านวิจัย', en: 'Research readiness' },
        value: 17,
        description: { th: 'ยังต้องเพิ่มหลักฐานทักษะหรือข้อเสนอ', en: 'Needs more skill or proposal evidence.' },
      },
      {
        id: 'skills',
        label: { th: 'ทักษะเฉพาะด้าน', en: 'Specific skills' },
        value: 13,
        description: { th: 'ข้อมูลทักษะยังไม่ครบ', en: 'Skills data is incomplete.' },
      },
      {
        id: 'freshness',
        label: { th: 'ความสดใหม่ของข้อมูล', en: 'Data freshness' },
        value: 8,
        description: { th: 'ข้อมูลทะเบียนใช้ได้', en: 'Registry data is usable.' },
      },
    ],
  },
]

export function getScholarshipForRecommendation(recommendation: StudentRecommendation): Scholarship | undefined {
  return mockScholarships.find(s => s.id === recommendation.scholarshipId)
}

export function getRecommendationByScholarshipId(scholarshipId: string): StudentRecommendation | undefined {
  return studentRecommendations.find(r => r.scholarshipId === scholarshipId)
}

export const generalMatchingExplanation = {
  hardEligibility: {
    th: 'S2IMS ตรวจเงื่อนไขพื้นฐานก่อน เช่น GPA ชั้นปี สถานะเปิดรับสมัคร และเอกสารที่จำเป็น',
    en: 'S2IMS checks hard criteria first, such as GPA, academic year, open status, and required documents.',
  },
  softFit: {
    th: 'จากนั้นระบบดูความสอดคล้องเชิงบริบท เช่น กิจกรรม ความสนใจ ทักษะ และเป้าหมายของทุน',
    en: 'Then it considers contextual fit, such as activities, interests, skills, and scholarship intent.',
  },
  needContext: {
    th: 'ข้อมูลความต้องการทุนช่วยให้ระบบอธิบายความเหมาะสมอย่างยุติธรรม โดยไม่เปิดเผยข้อมูลต่อผู้ให้ทุน',
    en: 'Need-context data helps the system explain fit fairly without exposing it to providers.',
  },
  missingData: {
    th: 'ข้อมูลที่ยังไม่ครบไม่ได้แปลว่าไม่ผ่าน แต่ทำให้ความมั่นใจของคำแนะนำลดลง',
    en: 'Missing data does not mean rejection, but it can lower recommendation confidence.',
  },
}
