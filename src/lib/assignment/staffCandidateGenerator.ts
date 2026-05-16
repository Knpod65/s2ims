import {
  buildDisplayName,
  normalizeOfficialEmail,
} from "./candidatePoolPrivacy";

export type EmployeeStaffSourceRecord = {
  employee_id: string;
  title?: string;
  name: string;
  surname: string;
  role?: string;
  department?: string;
  division?: string;
  unit?: string;
  ext?: string;
  mobile?: string;
  cmu_mail?: string;
};

export type StaffCandidatePoolItem = {
  candidateId: string;
  sourceType: "employee";
  sourceId: string;
  displayName: string;
  roleCategory:
    | "scholarship_operations"
    | "student_support"
    | "document_checker"
    | "eligibility_checker"
    | "qa_reviewer"
    | "system_support"
    | "finance_checker"
    | "rollback_operator"
    | "admin_support";
  roleLabel: string;
  unitOrDepartment: string;
  officialEmail?: string;
  assignmentContexts: Array<
    | "scholarship_application_review"
    | "document_review"
    | "eligibility_check"
    | "student_follow_up"
    | "qa_review"
    | "technical_support"
    | "finance_disbursement_check"
    | "rollback_support"
    | "admin_operations"
  >;
  status: "suggested";
  confidence: "mock" | "rule_based" | "manual";
  isMock: true;
  autoAssigned: false;
  privacyLevel: "safe_display";
};

export type StaffCandidatePoolBuildResult = {
  items: StaffCandidatePoolItem[];
  sourceRecordCount: number;
  candidateCount: number;
  autoAssignedCount: 0;
  unsafeRecordCount: number;
};

type StaffRoleMapping = {
  roleCategory: StaffCandidatePoolItem["roleCategory"];
  roleLabel: string;
  assignmentContexts: StaffCandidatePoolItem["assignmentContexts"];
  confidence: StaffCandidatePoolItem["confidence"];
};

function resolveStaffRoleMapping(record: EmployeeStaffSourceRecord): StaffRoleMapping {
  const unit = record.unit ?? "";
  const role = record.role ?? "";
  const division = record.division ?? "";
  const unitLower = unit.toLowerCase();
  const roleLower = role.toLowerCase();

  if (unit === "Student_Development") {
    return {
      roleCategory: "student_support",
      roleLabel: "Student Support Staff",
      assignmentContexts: ["student_follow_up", "scholarship_application_review"],
      confidence: "rule_based",
    };
  }
  if (unit === "Education_Services") {
    return {
      roleCategory: "eligibility_checker",
      roleLabel: "Eligibility Checker",
      assignmentContexts: ["eligibility_check", "document_review"],
      confidence: "rule_based",
    };
  }
  if (unit === "IT_Communication") {
    return {
      roleCategory: "system_support",
      roleLabel: "System Support Staff",
      assignmentContexts: ["technical_support"],
      confidence: "rule_based",
    };
  }
  if (unit === "Strategy_Quality_Assurance") {
    return {
      roleCategory: "qa_reviewer",
      roleLabel: "QA Reviewer",
      assignmentContexts: ["qa_review"],
      confidence: "rule_based",
    };
  }
  if (unit === "Finance_Supplies") {
    return {
      roleCategory: "finance_checker",
      roleLabel: "Finance Checker",
      assignmentContexts: ["finance_disbursement_check"],
      confidence: "rule_based",
    };
  }
  if (unitLower.includes("rollback") || roleLower.includes("rollback")) {
    return {
      roleCategory: "rollback_operator",
      roleLabel: "Rollback Support Operator",
      assignmentContexts: ["rollback_support"],
      confidence: "rule_based",
    };
  }
  if (unitLower.includes("admin") || roleLower.includes("admin")) {
    return {
      roleCategory: "admin_support",
      roleLabel: "Administrative Support",
      assignmentContexts: ["admin_operations"],
      confidence: "rule_based",
    };
  }
  if (division === "Education_Student_Quality") {
    return {
      roleCategory: "scholarship_operations",
      roleLabel: "Scholarship Operations Staff",
      assignmentContexts: ["scholarship_application_review", "student_follow_up"],
      confidence: "rule_based",
    };
  }
  return {
    roleCategory: "scholarship_operations",
    roleLabel: "Scholarship Operations Staff",
    assignmentContexts: ["scholarship_application_review"],
    confidence: "mock",
  };
}

export function deriveStaffRoleCategory(
  record: EmployeeStaffSourceRecord
): StaffCandidatePoolItem["roleCategory"] {
  return resolveStaffRoleMapping(record).roleCategory;
}

export function deriveStaffAssignmentContexts(
  record: EmployeeStaffSourceRecord
): StaffCandidatePoolItem["assignmentContexts"] {
  return resolveStaffRoleMapping(record).assignmentContexts;
}

export function assertSafeStaffCandidate(
  candidate: StaffCandidatePoolItem
): void {
  const record = candidate as Record<string, unknown>;
  const forbidden = [
    "mobile",
    "phone",
    "email",
    "personalEmail",
    "privateEmail",
    "remark",
    "rawStudentId",
    "studentId",
    "nationalId",
    "approvalStatus",
    "approvedBy",
    "approvalCollected",
    "scholarshipDecision",
    "decisionStatus",
    "assignedBy",
    "assignedAt",
  ];
  for (const key of forbidden) {
    if (key in record) {
      throw new Error("Unsafe staff candidate");
    }
  }
  if (candidate.autoAssigned !== false) {
    throw new Error("Unsafe staff candidate");
  }
  if (candidate.isMock !== true) {
    throw new Error("Unsafe staff candidate");
  }
  if (candidate.status !== "suggested") {
    throw new Error("Unsafe staff candidate");
  }
  if (candidate.sourceType !== "employee") {
    throw new Error("Unsafe staff candidate");
  }
}

function resolveUnitOrDepartment(record: EmployeeStaffSourceRecord): string {
  if (record.unit && record.unit.trim().length > 0) return record.unit.trim();
  if (record.division && record.division.trim().length > 0) return record.division.trim();
  if (record.department && record.department.trim().length > 0) return record.department.trim();
  return "Unassigned Unit";
}

export function normalizeStaffCandidate(
  record: EmployeeStaffSourceRecord
): StaffCandidatePoolItem {
  const mapping = resolveStaffRoleMapping(record);

  const item: StaffCandidatePoolItem = {
    candidateId: `staff:${record.employee_id.trim()}`,
    sourceType: "employee",
    sourceId: record.employee_id.trim(),
    displayName: buildDisplayName({
      title: record.title,
      name: record.name,
      surname: record.surname,
    }),
    roleCategory: mapping.roleCategory,
    roleLabel: mapping.roleLabel,
    unitOrDepartment: resolveUnitOrDepartment(record),
    officialEmail: normalizeOfficialEmail(record.cmu_mail),
    assignmentContexts: mapping.assignmentContexts,
    status: "suggested",
    confidence: mapping.confidence,
    isMock: true,
    autoAssigned: false,
    privacyLevel: "safe_display",
  };

  assertSafeStaffCandidate(item);
  return item;
}

export function buildStaffCandidatePool(
  records: EmployeeStaffSourceRecord[]
): StaffCandidatePoolBuildResult {
  let unsafeRecordCount = 0;
  const normalized: StaffCandidatePoolItem[] = [];

  for (const record of records) {
    try {
      normalized.push(normalizeStaffCandidate(record));
    } catch {
      unsafeRecordCount++;
    }
  }

  const seen = new Set<string>();
  const deduped: StaffCandidatePoolItem[] = [];
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
