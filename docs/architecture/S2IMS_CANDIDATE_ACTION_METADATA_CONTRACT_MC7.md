# S²IMS Candidate Action Metadata Contract MC7

## Purpose

This document defines the safe metadata contract for future S²IMS candidate review actions.

The contract is documentation-only. It does not implement action wiring, persistence, backend/API behavior, audit writes, assignment, approval, scholarship decision, AP-10B governance, AP-10C, or AP-11.

## Allowed Action Types

Allowed future action types:
- `view_candidate`
- `shortlist_candidate`
- `skip_candidate`
- `request_more_context`
- `reject_for_assignment`
- `manually_select_candidate`

All allowed actions are workflow review signals only.

## Allowed Metadata Fields

Future action metadata may include:
- `actionType`
- `candidateId`
- `poolType`
- `roleCategory`
- `actorRole`
- `createdAt`
- `safeReasonCode`
- `safeNoteCategory`
- `workflowContext`
- `previousReviewState`
- `nextReviewState`

Allowed metadata must be sufficient for workflow review and diagnostics without exposing PII, authority evidence, approval state, assignment state, or scholarship decision state.

## Forbidden Metadata Fields

Future action metadata must not include:
- mobile
- phone
- `personalEmail`
- `rawEmail`
- `privateEmail`
- remark
- `rawStudentId`
- national ID
- bank account
- full reason text containing PII
- health or disability details
- family or private hardship details
- financial details
- `scholarshipDecision`
- `approvalStatus`
- `approvedBy`
- `assignedBy`
- `assignedAt`
- AP-10B owner evidence
- authority verification evidence

## Reason Code Model

Safe reason codes should be short, controlled values. Examples:
- `PROGRAM_MATCH`
- `ROLE_ALIGNMENT`
- `CAPACITY_CONCERN`
- `NEEDS_CONTEXT`
- `NOT_RELEVANT_FOR_CONTEXT`
- `DUPLICATE_REVIEWER`
- `TEMPORARILY_UNAVAILABLE`
- `ENTERED_IN_ERROR`

Reason codes must not encode student PII, protected attributes, health details, financial details, raw identifiers, approval status, or scholarship decision status.

## Safe Note Category Model

Safe note categories may describe the nature of a review note without storing sensitive free text. Examples:
- `workflow_fit`
- `role_capacity`
- `context_missing`
- `manual_correction`
- `reviewer_availability`
- `routing_consideration`

Safe note categories must not contain raw reason text or private student details.

## Audit-Awareness Notes

Future audit-aware events may reference the same safe metadata contract. Audit metadata must:
- identify the safe candidate token only
- identify pool type and role category
- identify the action type
- identify safe reason code when needed
- exclude PII
- exclude approval wording
- exclude scholarship decision wording
- exclude AP-10B authority evidence

MC7 does not implement audit writes.

## Future Validation Rules

Future implementation must validate:
- `actionType` is one of the allowed action types
- `poolType` is advisor or staff
- `candidateId` is a safe candidate ID, not raw student ID
- `safeReasonCode` uses an approved controlled value
- `safeNoteCategory` uses an approved controlled value
- forbidden metadata keys are rejected
- free-text reason fields are absent by default
- approval, assignment, scholarship decision, AP-10B authority, and PII fields are rejected

## Examples of Valid Metadata

```json
{
  "actionType": "shortlist_candidate",
  "candidateId": "advisor-T001",
  "poolType": "advisor",
  "roleCategory": "academic_advisor",
  "actorRole": "staff",
  "createdAt": "2026-05-16T09:00:00Z",
  "safeReasonCode": "PROGRAM_MATCH",
  "safeNoteCategory": "workflow_fit",
  "workflowContext": "advisor_review",
  "previousReviewState": "not_reviewed",
  "nextReviewState": "shortlisted"
}
```

```json
{
  "actionType": "manually_select_candidate",
  "candidateId": "staff-E002",
  "poolType": "staff",
  "roleCategory": "operations_support",
  "actorRole": "admin",
  "createdAt": "2026-05-16T09:05:00Z",
  "safeReasonCode": "ROLE_ALIGNMENT",
  "safeNoteCategory": "routing_consideration",
  "workflowContext": "document_check",
  "previousReviewState": "shortlisted",
  "nextReviewState": "manually_selected"
}
```

## Examples of Invalid Metadata

```json
{
  "actionType": "approve_scholarship",
  "studentId": "650912345",
  "phone": "...",
  "approvalStatus": "approved"
}
```

```json
{
  "actionType": "reject_for_assignment",
  "candidateId": "advisor-T001",
  "personalEmail": "private@example.com",
  "reasonText": "Rejected because of private family hardship details",
  "scholarshipDecision": "rejected"
}
```

Invalid examples are rejected because they include forbidden action types, raw identifiers, contact details, free-text PII, approval fields, or scholarship decision fields.
