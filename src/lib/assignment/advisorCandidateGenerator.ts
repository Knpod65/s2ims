import {
  buildDisplayName,
  normalizeOfficialEmail,
  normalizeUnitOrDepartment,
} from "./candidatePoolPrivacy";

export type PersonnelAdvisorSourceRecord = {
  teacher_id: string;
  title?: string;
  name: string;
  surname: string;
  department?: string;
  cmu_mail?: string;
  email?: string;
  mobile?: string;
  remark?: string;
};

export type AdvisorCandidatePoolItem = {
  candidateId: string;
  sourceType: "personnel";
  sourceId: string;
  displayName: string;
  roleCategory:
    | "academic_advisor"
    | "program_reviewer"
    | "faculty_reviewer"
    | "scholarship_academic_reviewer";
  roleLabel: string;
  unitOrDepartment: string;
  officialEmail?: string;
  assignmentContexts: Array<
    | "advisor_review"
    | "scholarship_academic_review"
    | "program_eligibility_review"
    | "student_follow_up"
  >;
  status: "suggested";
  confidence: "mock" | "rule_based" | "manual";
  isMock: true;
  autoAssigned: false;
  privacyLevel: "safe_display";
};

export type AdvisorCandidatePoolBuildResult = {
  items: AdvisorCandidatePoolItem[];
  sourceRecordCount: number;
  candidateCount: number;
  autoAssignedCount: 0;
  unsafeRecordCount: number;
};

const ADVISORY_DEPARTMENTS = ["GOV", "PA", "IA", "STB"] as const;
type AdvisoryDepartment = (typeof ADVISORY_DEPARTMENTS)[number];

function isAdvisoryDepartment(dept?: string): dept is AdvisoryDepartment {
  return ADVISORY_DEPARTMENTS.includes(dept as AdvisoryDepartment);
}

export function mapAdvisorRoleCategory(
  department?: string
): AdvisorCandidatePoolItem["roleCategory"] {
  return isAdvisoryDepartment(department) ? "academic_advisor" : "faculty_reviewer";
}

export function mapAdvisorAssignmentContexts(
  department?: string
): AdvisorCandidatePoolItem["assignmentContexts"] {
  return isAdvisoryDepartment(department)
    ? ["advisor_review", "scholarship_academic_review"]
    : ["advisor_review"];
}

export function assertSafeAdvisorCandidate(
  candidate: AdvisorCandidatePoolItem
): void {
  const record = candidate as Record<string, unknown>;
  const forbidden = [
    "mobile",
    "email",
    "personalEmail",
    "remark",
    "approvalStatus",
    "scholarshipDecision",
    "apOwner",
    "ap10bOwner",
    "approvalEvidence",
  ];
  for (const key of forbidden) {
    if (key in record) {
      throw new Error("Unsafe advisor candidate");
    }
  }
  if (candidate.autoAssigned !== false) {
    throw new Error("Unsafe advisor candidate");
  }
  if (candidate.isMock !== true) {
    throw new Error("Unsafe advisor candidate");
  }
  if (candidate.status !== "suggested") {
    throw new Error("Unsafe advisor candidate");
  }
}

export function normalizeAdvisorCandidate(
  record: PersonnelAdvisorSourceRecord
): AdvisorCandidatePoolItem {
  const dept = record.department;
  const roleCategory = mapAdvisorRoleCategory(dept);
  let roleLabel: string;
  if (dept === "STB") {
    roleLabel = "Academic Advisor (Visiting/External)";
  } else if (isAdvisoryDepartment(dept)) {
    roleLabel = "Academic Advisor";
  } else {
    roleLabel = "Faculty Reviewer";
  }

  const item: AdvisorCandidatePoolItem = {
    candidateId: `advisor:${record.teacher_id.trim()}`,
    sourceType: "personnel",
    sourceId: record.teacher_id.trim(),
    displayName: buildDisplayName({
      title: record.title,
      name: record.name,
      surname: record.surname,
    }),
    roleCategory,
    roleLabel,
    unitOrDepartment: normalizeUnitOrDepartment(dept),
    officialEmail: normalizeOfficialEmail(record.cmu_mail),
    assignmentContexts: mapAdvisorAssignmentContexts(dept),
    status: "suggested",
    confidence: "rule_based",
    isMock: true,
    autoAssigned: false,
    privacyLevel: "safe_display",
  };

  assertSafeAdvisorCandidate(item);
  return item;
}

export function buildAdvisorCandidatePool(
  records: PersonnelAdvisorSourceRecord[]
): AdvisorCandidatePoolBuildResult {
  let unsafeRecordCount = 0;
  const normalized: AdvisorCandidatePoolItem[] = [];

  for (const record of records) {
    try {
      normalized.push(normalizeAdvisorCandidate(record));
    } catch {
      unsafeRecordCount++;
    }
  }

  const seen = new Set<string>();
  const deduped: AdvisorCandidatePoolItem[] = [];
  for (const item of normalized) {
    if (!seen.has(item.candidateId)) {
      seen.add(item.candidateId);
      deduped.push(item);
    }
  }

  return {
    items: deduped,
    sourceRecordCount: records.length,
    candidateCount: deduped.length,
    autoAssignedCount: 0,
    unsafeRecordCount,
  };
}
