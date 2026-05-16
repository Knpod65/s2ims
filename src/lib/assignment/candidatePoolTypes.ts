export type CandidatePoolSourceType = "employee" | "personnel";

export type CandidatePoolConfidence = "mock" | "rule_based" | "manual";

export type CandidatePoolPrivacyLevel = "safe_display" | "internal_only";

export type CandidatePoolSelectionStatus =
  | "available_for_selection"
  | "selected_pending_confirmation"
  | "selected"
  | "rejected"
  | "inactive";

export type CandidatePoolRoleCategory =
  | "scholarship_operations"
  | "student_support"
  | "document_review"
  | "eligibility_check"
  | "system_support"
  | "qa_review"
  | "finance_review"
  | "academic_advisor"
  | "program_reviewer"
  | "faculty_reviewer"
  | "unknown";

export type CandidatePoolContext =
  | "scholarship_review"
  | "advisor_review"
  | "document_check"
  | "eligibility_review"
  | "follow_up"
  | "qa_check"
  | "system_support"
  | "finance_check"
  | "manual_selection";

export type EmployeeSourceRecord = {
  employee_id?: string;
  title?: string;
  name?: string;
  surname?: string;
  role?: string;
  department?: string;
  division?: string;
  unit?: string;
  ext?: string;
  mobile?: string;
  cmu_mail?: string;
};

export type PersonnelSourceRecord = {
  teacher_id?: string;
  title?: string;
  name?: string;
  surname?: string;
  department?: string;
  ext?: string;
  mobile?: string;
  cmu_mail?: string;
  email?: string;
  remark?: string;
};

export type MockAssignmentCandidatePoolItem = {
  candidateId: string;
  sourceType: CandidatePoolSourceType;
  sourceId: string;
  displayName: string;
  roleCategory: CandidatePoolRoleCategory;
  roleLabel: string;
  unitOrDepartment: string;
  officialEmail?: string;
  selectableContexts: CandidatePoolContext[];
  selectionStatus: CandidatePoolSelectionStatus;
  confidence: CandidatePoolConfidence;
  isMock: true;
  privacyLevel: CandidatePoolPrivacyLevel;
  notes?: string;
};
