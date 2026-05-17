export type CandidateReviewState =
  | "not_reviewed"
  | "shortlisted"
  | "skipped"
  | "needs_more_context"
  | "rejected_for_assignment"
  | "manually_selected";

export type CandidateReviewAction =
  | "shortlist_candidate"
  | "skip_candidate"
  | "request_more_context"
  | "reject_for_assignment"
  | "manually_select_candidate"
  | "clear_review_state";

export type CandidateReviewStateTransition = {
  candidateId: string;
  actionType: CandidateReviewAction;
  previousState: CandidateReviewState;
  nextState: CandidateReviewState;
  safeReasonCode?: string;
};

// Forbidden actions that must never be introduced in MC8
const FORBIDDEN_ACTIONS = new Set([
  "auto_assign_candidate",
  "assign_candidate",
  "approve_candidate",
  "approve_scholarship",
  "reject_scholarship",
  "collect_ap10b_approval",
  "verify_authority",
  "mark_as_governance_owner",
]);

export function getNextCandidateReviewState(
  previousState: CandidateReviewState,
  actionType: CandidateReviewAction
): CandidateReviewState {
  switch (actionType) {
    case "shortlist_candidate":
      return "shortlisted";
    case "skip_candidate":
      return "skipped";
    case "request_more_context":
      return "needs_more_context";
    case "reject_for_assignment":
      return "rejected_for_assignment";
    case "manually_select_candidate":
      return "manually_selected";
    case "clear_review_state":
      return "not_reviewed";
    default:
      return previousState;
  }
}

export function createCandidateReviewStateTransition(input: {
  candidateId: string;
  previousState: CandidateReviewState;
  actionType: CandidateReviewAction;
  safeReasonCode?: string;
}): CandidateReviewStateTransition {
  const { candidateId, previousState, actionType, safeReasonCode } = input;
  const nextState = getNextCandidateReviewState(previousState, actionType);
  const transition: CandidateReviewStateTransition = {
    candidateId,
    actionType,
    previousState,
    nextState,
    ...(safeReasonCode ? { safeReasonCode } : {}),
  };
  assertSafeCandidateReviewTransition(transition);
  return transition;
}

export function assertSafeCandidateReviewTransition(
  transition: CandidateReviewStateTransition
): void {
  if (FORBIDDEN_ACTIONS.has(transition.actionType as string)) {
    throw new Error("Forbidden review action used in MC8 transition");
  }
  if (transition.safeReasonCode !== undefined && typeof transition.safeReasonCode !== "string") {
    throw new Error("safeReasonCode must be a short code string when provided");
  }
  // No free-text reasons allowed in MC8. No PII allowed in transition shape.
}
