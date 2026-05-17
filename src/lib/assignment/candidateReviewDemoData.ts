import type { CombinedCandidatePoolItem } from "./combinedCandidatePool";
import type { AdvisorCandidatePoolItem } from "./advisorCandidateGenerator";
import type { StaffCandidatePoolItem } from "./staffCandidateGenerator";

export function createCandidateReviewDemoCandidates(): CombinedCandidatePoolItem[] {
  const advisors: Array<AdvisorCandidatePoolItem & { poolType: "advisor" }> = [
    {
      candidateId: "demo-advisor-001",
      sourceType: "personnel",
      sourceId: "demo-source-001",
      displayName: "Advisor Demo 1",
      roleCategory: "academic_advisor",
      roleLabel: "Academic Advisor (Demo)",
      unitOrDepartment: "Demo Department",
      assignmentContexts: ["advisor_review"],
      status: "suggested",
      confidence: "mock",
      isMock: true,
      autoAssigned: false,
      privacyLevel: "safe_display",
      poolType: "advisor",
    },
    {
      candidateId: "demo-advisor-002",
      sourceType: "personnel",
      sourceId: "demo-source-002",
      displayName: "Advisor Demo 2",
      roleCategory: "faculty_reviewer",
      roleLabel: "Faculty Reviewer (Demo)",
      unitOrDepartment: "Demo Faculty",
      assignmentContexts: ["scholarship_academic_review"],
      status: "suggested",
      confidence: "mock",
      isMock: true,
      autoAssigned: false,
      privacyLevel: "safe_display",
      poolType: "advisor",
    },
  ];

  const staff: Array<StaffCandidatePoolItem & { poolType: "staff" }> = [
    {
      candidateId: "demo-staff-001",
      sourceType: "employee",
      sourceId: "demo-source-003",
      displayName: "Staff Demo 1",
      roleCategory: "scholarship_operations",
      roleLabel: "Scholarship Operations (Demo)",
      unitOrDepartment: "Demo Unit",
      assignmentContexts: ["scholarship_application_review"],
      status: "suggested",
      confidence: "mock",
      isMock: true,
      autoAssigned: false,
      privacyLevel: "safe_display",
      poolType: "staff",
    },
    {
      candidateId: "demo-staff-002",
      sourceType: "employee",
      sourceId: "demo-source-004",
      displayName: "Staff Demo 2",
      roleCategory: "document_checker",
      roleLabel: "Document Checker (Demo)",
      unitOrDepartment: "Demo Support",
      assignmentContexts: ["document_review"],
      status: "suggested",
      confidence: "mock",
      isMock: true,
      autoAssigned: false,
      privacyLevel: "safe_display",
      poolType: "staff",
    },
  ];

  return [...advisors, ...staff];
}

export function assertSafeCandidateReviewDemoData(
  items: CombinedCandidatePoolItem[]
): void {
  for (const item of items) {
    if (!item.candidateId.startsWith("demo-")) {
      throw new Error(
        `Demo candidate ID must start with "demo-": ${item.candidateId}`
      );
    }
    if (!item.isMock) {
      throw new Error(
        `Demo candidates must have isMock: true: ${item.candidateId}`
      );
    }
    if (item.autoAssigned !== false) {
      throw new Error(
        `Demo candidates must have autoAssigned: false: ${item.candidateId}`
      );
    }
    if (item.privacyLevel !== "safe_display") {
      throw new Error(
        `Demo candidates must have privacyLevel: "safe_display": ${item.candidateId}`
      );
    }
  }
}
