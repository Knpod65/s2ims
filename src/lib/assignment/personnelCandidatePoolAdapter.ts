import type {
  CandidatePoolContext,
  CandidatePoolRoleCategory,
  MockAssignmentCandidatePoolItem,
  PersonnelSourceRecord,
} from "./candidatePoolTypes";
import {
  assertSafeCandidatePoolItem,
  buildDisplayName,
  createCandidateId,
  normalizeOfficialEmail,
  normalizeUnitOrDepartment,
} from "./candidatePoolPrivacy";

const ADVISORY_DEPARTMENTS = ["GOV", "PA", "IA", "STB"] as const;
type AdvisoryDepartment = (typeof ADVISORY_DEPARTMENTS)[number];

function isAdvisoryDepartment(dept?: string): dept is AdvisoryDepartment {
  return ADVISORY_DEPARTMENTS.includes(dept as AdvisoryDepartment);
}

export function mapPersonnelRoleCategory(
  record: PersonnelSourceRecord
): CandidatePoolRoleCategory {
  if (isAdvisoryDepartment(record.department)) return "academic_advisor";
  return "faculty_reviewer";
}

export function mapPersonnelSelectableContexts(
  record: PersonnelSourceRecord
): CandidatePoolContext[] {
  if (isAdvisoryDepartment(record.department)) {
    return ["advisor_review", "scholarship_review"];
  }
  return ["manual_selection"];
}

export function personnelToCandidatePoolItem(
  record: PersonnelSourceRecord
): MockAssignmentCandidatePoolItem {
  const sourceId = record.teacher_id?.trim() || "unknown";
  const isStb = record.department === "STB";
  const notes = isStb
    ? "Selectable personnel candidate pool item. Manual confirmation required for visiting/external faculty."
    : "Selectable personnel candidate pool item. Manual web selection required.";

  const item: MockAssignmentCandidatePoolItem = {
    sourceType: "personnel",
    sourceId,
    candidateId: createCandidateId("personnel", record.teacher_id),
    displayName: buildDisplayName(record),
    roleCategory: mapPersonnelRoleCategory(record),
    roleLabel: "Academic Advisor / Faculty Reviewer",
    unitOrDepartment: normalizeUnitOrDepartment(record.department),
    officialEmail: normalizeOfficialEmail(record.cmu_mail),
    selectableContexts: mapPersonnelSelectableContexts(record),
    selectionStatus: "available_for_selection",
    confidence: "rule_based",
    isMock: true,
    privacyLevel: "safe_display",
    notes,
  };
  return assertSafeCandidatePoolItem(item);
}

export function buildPersonnelCandidatePool(
  records: PersonnelSourceRecord[]
): MockAssignmentCandidatePoolItem[] {
  const seen = new Set<string>();
  const result: MockAssignmentCandidatePoolItem[] = [];
  for (const record of records) {
    const item = personnelToCandidatePoolItem(record);
    if (!seen.has(item.candidateId)) {
      seen.add(item.candidateId);
      result.push(item);
    }
  }
  return result;
}
