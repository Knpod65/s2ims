import type {
  CandidatePoolSourceType,
  EmployeeSourceRecord,
  MockAssignmentCandidatePoolItem,
  PersonnelSourceRecord,
} from "./candidatePoolTypes";

export function buildDisplayName({
  title,
  name,
  surname,
}: {
  title?: string;
  name?: string;
  surname?: string;
}): string {
  const parts = [title, name, surname].filter(
    (p): p is string => typeof p === "string" && p.trim().length > 0
  );
  return parts.join(" ") || "Unknown Candidate";
}

export function normalizeOfficialEmail(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.toLowerCase().trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function createCandidateId(
  sourceType: CandidatePoolSourceType,
  sourceId?: string
): string {
  return `${sourceType}:${sourceId?.trim() || "unknown"}`;
}

export function normalizeUnitOrDepartment(value?: string): string {
  if (!value) return "Unknown";
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "Unknown";
}

export function assertSafeCandidatePoolItem(
  item: MockAssignmentCandidatePoolItem
): MockAssignmentCandidatePoolItem {
  const record = item as Record<string, unknown>;
  const forbidden = ["mobile", "email", "personalEmail", "remark"];
  for (const key of forbidden) {
    if (key in record) {
      throw new Error("Unsafe candidate pool item");
    }
  }
  if (item.isMock !== true) {
    throw new Error("Unsafe candidate pool item");
  }
  return item;
}

export function employeeHasUnsafeDisplayFields(
  record: EmployeeSourceRecord
): boolean {
  return typeof record.mobile === "string" && record.mobile.length > 0;
}

export function personnelHasUnsafeDisplayFields(
  record: PersonnelSourceRecord
): boolean {
  return (
    (typeof record.mobile === "string" && record.mobile.length > 0) ||
    (typeof record.email === "string" && record.email.length > 0) ||
    (typeof record.remark === "string" && record.remark.length > 0)
  );
}
