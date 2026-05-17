import type { CandidateReviewAuditEvent } from './candidateReviewAuditEvent';
import {
  createCandidateReviewAuditEvent,
  type CandidateReviewAuditEventInput,
  assertSafeCandidateReviewAuditEvent,
} from './candidateReviewAuditEvent';
import type { CandidateReviewStateTransition } from './candidateReviewState';

// Input type for no-op wiring
export type CandidateReviewAuditNoopWiringInput = {
  transition: CandidateReviewStateTransition;
  poolType: "advisor" | "staff";
  roleCategory: string;
  actorRole: CandidateReviewAuditEvent["actorRole"];
  workflowContext: CandidateReviewAuditEvent["workflowContext"];
  safeNoteCategory?: string;
  createdAt?: string;
};

// Result type with explicit false flags
export type CandidateReviewAuditNoopWiringResult = {
  event: CandidateReviewAuditEvent;
  mode: "noop";
  persisted: false;
  written: false;
  exported: false;
  notified: false;
  officialEvidence: false;
  diagnosticOnly: true;
  discardedAfterPreview: true;
  message: "Diagnostic preview only — not saved, not submitted, not official evidence.";
};

// Build no-op preview from transition input
export function buildCandidateReviewAuditNoopPreview(
  input: CandidateReviewAuditNoopWiringInput
): CandidateReviewAuditNoopWiringResult {
  const eventInput: CandidateReviewAuditEventInput = {
    transition: input.transition,
    poolType: input.poolType,
    roleCategory: input.roleCategory,
    actorRole: input.actorRole,
    workflowContext: input.workflowContext,
    safeNoteCategory: input.safeNoteCategory,
    createdAt: input.createdAt,
  };

  const event = createCandidateReviewAuditEvent(eventInput);
  assertSafeCandidateReviewAuditEvent(event);

  const result: CandidateReviewAuditNoopWiringResult = {
    event,
    mode: "noop",
    persisted: false,
    written: false,
    exported: false,
    notified: false,
    officialEvidence: false,
    diagnosticOnly: true,
    discardedAfterPreview: true,
    message: "Diagnostic preview only — not saved, not submitted, not official evidence.",
  };

  assertSafeCandidateReviewAuditNoopResult(result);

  return result;
}

// Safety guard for no-op result
export function assertSafeCandidateReviewAuditNoopResult(
  result: CandidateReviewAuditNoopWiringResult
): void {
  if (result.mode !== "noop") {
    throw new Error("mode must be 'noop'");
  }
  if (result.persisted !== false) {
    throw new Error("persisted must be false");
  }
  if (result.written !== false) {
    throw new Error("written must be false");
  }
  if (result.exported !== false) {
    throw new Error("exported must be false");
  }
  if (result.notified !== false) {
    throw new Error("notified must be false");
  }
  if (result.officialEvidence !== false) {
    throw new Error("officialEvidence must be false");
  }
  if (result.diagnosticOnly !== true) {
    throw new Error("diagnosticOnly must be true");
  }
  if (result.discardedAfterPreview !== true) {
    throw new Error("discardedAfterPreview must be true");
  }
  if (result.event.officialEvidence !== false) {
    throw new Error("event.officialEvidence must be false");
  }
  if (result.event.diagnosticOnly !== true) {
    throw new Error("event.diagnosticOnly must be true");
  }
  if (result.event.source !== "candidate_review_local_state") {
    throw new Error("event source must be 'candidate_review_local_state'");
  }
}

// Summarize no-op result
export function summarizeCandidateReviewAuditNoopResult(
  result: CandidateReviewAuditNoopWiringResult
) {
  return {
    eventName: result.event.eventName,
    mode: "noop",
    persisted: false,
    written: false,
    exported: false,
    notified: false,
    officialEvidence: false,
    diagnosticOnly: true,
    discardedAfterPreview: true,
  };
}