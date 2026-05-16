import type {
  CandidatePoolContext,
  CandidatePoolRoleCategory,
  EmployeeSourceRecord,
  MockAssignmentCandidatePoolItem,
} from "./candidatePoolTypes";
import {
  assertSafeCandidatePoolItem,
  buildDisplayName,
  createCandidateId,
  normalizeOfficialEmail,
  normalizeUnitOrDepartment,
} from "./candidatePoolPrivacy";

export function mapEmployeeRoleCategory(
  record: EmployeeSourceRecord
): CandidatePoolRoleCategory {
  const unit = record.unit;
  const division = record.division;

  if (unit === "Student_Development") return "student_support";
  if (unit === "Education_Services") return "eligibility_check";
  if (unit === "IT_Communication") return "system_support";
  if (unit === "Strategy_Quality_Assurance") return "qa_review";
  if (unit === "Finance_Supplies") return "finance_review";
  if (unit === "Human_Resources") return "student_support";
  if (unit === "Research" || unit === "Academic_Services") return "document_review";
  if (unit === "International_Relations") return "document_review";
  if (division === "Education_Student_Quality") return "scholarship_operations";
  return "unknown";
}

export function mapEmployeeSelectableContexts(
  record: EmployeeSourceRecord
): CandidatePoolContext[] {
  const unit = record.unit;
  const division = record.division;

  if (unit === "Education_Services") return ["eligibility_review", "document_check"];
  if (unit === "Student_Development") return ["follow_up", "scholarship_review"];
  if (unit === "IT_Communication") return ["system_support"];
  if (unit === "Strategy_Quality_Assurance") return ["qa_check"];
  if (unit === "Finance_Supplies") return ["finance_check"];
  if (unit === "Human_Resources") return ["follow_up"];
  if (division === "Education_Student_Quality") return ["scholarship_review", "follow_up"];
  return ["manual_selection"];
}

export function employeeToCandidatePoolItem(
  record: EmployeeSourceRecord
): MockAssignmentCandidatePoolItem {
  const sourceId = record.employee_id?.trim() || "unknown";
  const item: MockAssignmentCandidatePoolItem = {
    sourceType: "employee",
    sourceId,
    candidateId: createCandidateId("employee", record.employee_id),
    displayName: buildDisplayName(record),
    roleCategory: mapEmployeeRoleCategory(record),
    roleLabel:
      [record.role, record.unit, record.division].filter(Boolean).join(" / ") ||
      "Staff",
    unitOrDepartment: normalizeUnitOrDepartment(
      record.unit ?? record.division ?? record.department
    ),
    officialEmail: normalizeOfficialEmail(record.cmu_mail),
    selectableContexts: mapEmployeeSelectableContexts(record),
    selectionStatus: "available_for_selection",
    confidence: "rule_based",
    isMock: true,
    privacyLevel: "safe_display",
    notes: "Selectable employee candidate pool item. Manual web selection required.",
  };
  return assertSafeCandidatePoolItem(item);
}

export function buildEmployeeCandidatePool(
  records: EmployeeSourceRecord[]
): MockAssignmentCandidatePoolItem[] {
  const seen = new Set<string>();
  const result: MockAssignmentCandidatePoolItem[] = [];
  for (const record of records) {
    const item = employeeToCandidatePoolItem(record);
    if (!seen.has(item.candidateId)) {
      seen.add(item.candidateId);
      result.push(item);
    }
  }
  return result;
}
