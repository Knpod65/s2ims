import type {
  EmployeeSourceRecord,
  MockAssignmentCandidatePoolItem,
  PersonnelSourceRecord,
} from "./candidatePoolTypes";
import { buildEmployeeCandidatePool } from "./employeeCandidatePoolAdapter";
import { buildPersonnelCandidatePool } from "./personnelCandidatePoolAdapter";

export type CandidatePoolInput = {
  employees?: EmployeeSourceRecord[];
  personnel?: PersonnelSourceRecord[];
};

export type CandidatePoolBuildResult = {
  items: MockAssignmentCandidatePoolItem[];
  summary: {
    total: number;
    employeeCount: number;
    personnelCount: number;
    availableForSelectionCount: number;
    manuallyAssignedCount: 0;
    autoAssignedCount: 0;
  };
};

export function buildMockAssignmentCandidatePool(
  input: CandidatePoolInput
): CandidatePoolBuildResult {
  const employeeItems = buildEmployeeCandidatePool(input.employees ?? []);
  const personnelItems = buildPersonnelCandidatePool(input.personnel ?? []);
  const combined = [...employeeItems, ...personnelItems];

  const seen = new Set<string>();
  const deduplicated: MockAssignmentCandidatePoolItem[] = [];
  for (const item of combined) {
    if (!seen.has(item.candidateId)) {
      seen.add(item.candidateId);
      deduplicated.push(item);
    }
  }

  return {
    items: deduplicated,
    summary: {
      total: deduplicated.length,
      employeeCount: employeeItems.length,
      personnelCount: personnelItems.length,
      availableForSelectionCount: deduplicated.filter(
        (i) => i.selectionStatus === "available_for_selection"
      ).length,
      manuallyAssignedCount: 0,
      autoAssignedCount: 0,
    },
  };
}
