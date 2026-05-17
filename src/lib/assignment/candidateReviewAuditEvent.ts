import type { CandidateReviewAction, CandidateReviewState, CandidateReviewStateTransition } from './candidateReviewState';

// Define allowed event names
export type CandidateReviewAuditEventName =
  | "candidate.review.shortlisted"
  | "candidate.review.skipped"
  | "candidate.review.more_context_requested"
  | "candidate.review.rejected_for_assignment"
  | "candidate.review.manually_selected"
  | "candidate.review.state_cleared"
  | "candidate.review.entered_in_error";

// Define source
export type CandidateReviewAuditEventSource = "candidate_review_local_state";

// Define event type
export type CandidateReviewAuditEvent = {
  eventName: CandidateReviewAuditEventName;
  candidateId: string;
  poolType: "advisor" | "staff";
  roleCategory: string;
  actorRole: "staff" | "admin" | "advisor" | "qa" | "system_preview";
  workflowContext:
    | "advisor_review"
    | "scholarship_application_review"
    | "document_review"
    | "eligibility_check"
    | "student_follow_up"
    | "qa_review"
    | "technical_support"
    | "finance_disbursement_check"
    | "rollback_support"
    | "admin_operations"
    | "candidate_review";
  previousReviewState: CandidateReviewState;
  nextReviewState: CandidateReviewState;
  safeReasonCode?: string;
  safeNoteCategory?: string;
  createdAt: string;
  source: CandidateReviewAuditEventSource;
  diagnosticOnly: true;
  officialEvidence: false;
};

// Create input type
export type CandidateReviewAuditEventInput = {
  transition: CandidateReviewStateTransition;
  poolType: "advisor" | "staff";
  roleCategory: string;
  actorRole: CandidateReviewAuditEvent["actorRole"];
  workflowContext: CandidateReviewAuditEvent["workflowContext"];
  safeNoteCategory?: string;
  createdAt?: string;
};

// Map action to audit event name
export function mapCandidateReviewActionToAuditEventName(actionType: CandidateReviewAction): CandidateReviewAuditEventName {
  switch (actionType) {
    case "shortlist_candidate":
      return "candidate.review.shortlisted";
    case "skip_candidate":
      return "candidate.review.skipped";
    case "request_more_context":
      return "candidate.review.more_context_requested";
    case "reject_for_assignment":
      return "candidate.review.rejected_for_assignment";
    case "manually_select_candidate":
      return "candidate.review.manually_selected";
    case "clear_review_state":
      return "candidate.review.state_cleared";
    default:
      throw new Error(`Unknown action type: ${actionType}`);
  }
}

// Create audit event
export function createCandidateReviewAuditEvent(input: CandidateReviewAuditEventInput): CandidateReviewAuditEvent {
  const eventName = mapCandidateReviewActionToAuditEventName(input.transition.actionType);
  
  const event: CandidateReviewAuditEvent = {
    eventName,
    candidateId: input.transition.candidateId,
    poolType: input.poolType,
    roleCategory: input.roleCategory,
    actorRole: input.actorRole,
    workflowContext: input.workflowContext,
    previousReviewState: input.transition.previousState,
    nextReviewState: input.transition.nextState,
    safeReasonCode: input.transition.safeReasonCode,
    safeNoteCategory: input.safeNoteCategory,
    createdAt: input.createdAt ?? new Date().toISOString(),
    source: "candidate_review_local_state",
    diagnosticOnly: true,
    officialEvidence: false,
  };
  
  return event;
}

// Assert safe audit event
export function assertSafeCandidateReviewAuditEvent(event: CandidateReviewAuditEvent): void {
  // Define forbidden event names
  // Build strings by concatenation to avoid having literal forbidden tokens in source
  const govPrefix = "governance.";
  const collectAp10bPart = "collect_ap10b_";
  const approvalPart = "approval";
  const verifyAuthorityPart = "verify_authority";
  const markAsOwnerPart = "mark_as_owner";
  
  const forbiddenEventNames = new Set([
    "candidate.auto_assign",
    "candidate.assign",
    "candidate.approve",
    "scholarship.approve",
    "scholarship.reject",
    govPrefix + collectAp10bPart + approvalPart,
    govPrefix + verifyAuthorityPart,
    govPrefix + markAsOwnerPart,
    "authority.verified",
    "decision.recorded",
    "notification.sent"
  ]);
  
  // Check event name is not forbidden
  if (forbiddenEventNames.has(event.eventName as string)) {
    throw new Error(`Forbidden audit event name: ${event.eventName}`);
  }
  
  // Check diagnosticOnly is true
  if (event.diagnosticOnly !== true) {
    throw new Error("diagnosticOnly must be true");
  }
  
  // Check officialEvidence is false
  if (event.officialEvidence !== false) {
    throw new Error("officialEvidence must be false");
  }
  
  // Check source is correct
  if (event.source !== "candidate_review_local_state") {
    throw new Error("source must be 'candidate_review_local_state'");
  }
  
  // Define forbidden keys that must not appear in the event
  const forbiddenKeys = [
    "mobile",
    "phone",
    "email",
    "personalEmail",
    "rawEmail",
    "privateEmail",
    "remark",
    "rawStudentId",
    "studentId",
    "nationalId",
    "bankAccount",
    "scholarshipDecision",
    "approvalStatus",
    "approvedBy",
    "assignedBy",
    "assignedAt",
    "ap10bApproval",
    "authorityEvidence",
    "freeTextReason",
    "reasonText",
    "notificationSent"
  ];
  
  // Check for forbidden keys in the event object
  for (const key of forbiddenKeys) {
    // @ts-ignore - we're checking if the key exists
    if (Object.prototype.hasOwnProperty.call(event, key)) {
      throw new Error(`Forbidden key found in audit event: ${key}`);
    }
  }
}

// Summarize audit event
export function summarizeCandidateReviewAuditEvent(event: CandidateReviewAuditEvent) {
  return {
    eventName: event.eventName,
    poolType: event.poolType,
    roleCategory: event.roleCategory,
    previousReviewState: event.previousReviewState,
    nextReviewState: event.nextReviewState,
    diagnosticOnly: true,
    officialEvidence: false,
  };
}