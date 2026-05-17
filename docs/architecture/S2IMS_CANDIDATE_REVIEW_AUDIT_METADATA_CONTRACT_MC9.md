# S²IMS Candidate Review Audit Metadata Contract (MC9)

## Purpose

This document specifies the allowed and forbidden metadata fields for candidate review audit events in any future audit-write implementation. It is part of the MC9 planning package and is documentation-only. It does not introduce runtime code, audit writes, or persistence activation.

## Source Baseline

Reference types from MC8 (`src/lib/assignment/candidateReviewState.ts`):

```typescript
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
```

## Allowed Event Names

Events that may be audited in the future for candidate review actions:

| Event Name | Action Key | Requires Reason | Requires Safe Code |
|---|---|---|---|
| `candidate_review.shortlist` | `shortlist_candidate` | No | Optional |
| `candidate_review.skip` | `skip_candidate` | No | Optional |
| `candidate_review.needs_more_context` | `request_more_context` | No | Optional |
| `candidate_review.reject_for_assignment` | `reject_for_assignment` | Yes | Required |
| `candidate_review.manually_selected` | `manually_select_candidate` | No | Optional |
| `candidate_review.clear` | `clear_review_state` | No | Optional |

## Forbidden Event Names

| Event Name | Reason Forbidden |
|---|---|
| `candidate.auto_assign` | Auto-assignment explicitly forbidden in MC8 |
| `candidate.assign` | Assignment action out of review scope |
| `candidate.approve` | Approval not a review action |
| `scholarship.approve` | Scholarship approval is a separate governance flow |
| `scholarship.reject` | Scholarship rejection is a separate governance flow |
| `governance.collect_ap10b_approval` | AP-10B is a separate approval gate |
| `governance.verify_authority` | Authority verification is a separate governance step |
| `governance.mark_as_owner` | Owner designation is a separate governance step |

## Allowed Metadata Fields

For all `candidate_review.*` events:

| Field | Type | Constraint |
|---|---|---|
| `candidateToken` | string | Must be a masked token in format `Candidate #C-XXXX`. Raw candidate IDs are forbidden. |
| `nextReviewState` | string | Must be one of the `CandidateReviewState` union values. |
| `reviewAction` | string | Must be one of the `CandidateReviewAction` union values. |
| `safeReasonCode` | string (optional) | Short vocabulary code only (see Safe Reason Code Model below). Not free text. |
| `sourceRoute` | string | Originating route path. Must be a valid path string, not a PII identifier. |

Allowed for correction/rollback events only (`candidate_review.state_corrected`, `candidate_review.bulk_clear`):

| Field | Type | Constraint |
|---|---|---|
| `replacedEventId` | string | Must reference an existing audit event ID. Used only in correction events. |

## Forbidden Metadata Fields

These fields must never appear in any `candidate_review.*` audit event, directly or nested:

| Field | Reason |
|---|---|
| `rawStudentId` | Raw student identifier is a PII field |
| `studentEmail` | Email address is PII |
| `personalEmail` | Personal email is PII |
| `mobile` / `phone` | Contact number is PII |
| `nationalId` | Government ID is high-sensitivity PII |
| `assignedBy` | Assignment metadata is out of review scope |
| `assignedAt` | Assignment metadata is out of review scope |
| `approvedBy` | Approval metadata is out of review scope |
| `approvalStatus` | Approval status is out of review scope |
| `scholarshipDecision` | Scholarship decision is a separate governance flow |
| `remark` | Free-text note carries PII and approval risk |
| `fullName` | Raw name may be PII in some contexts; display name must be routed through a token/privacy layer first |

These mirror the `FORBIDDEN_METADATA_KEYS` governance pattern from `auditMetadataRules.ts`.

## Safe Reason Code Model

`safeReasonCode` is an optional short code string, not free text. It must satisfy:

1. It is a lowercase `snake_case` string from a closed vocabulary.
2. It is under 40 characters.
3. It contains no email-like content, no names, no document IDs, no student identifiers.
4. No reason code implies an approval, assignment, or scholarship decision.

Example safe codes (documented here as guidance only; vocabulary finalization is a future step):

| safeReasonCode | Semantic Meaning |
|---|---|
| `insufficient_qualification` | Candidate does not meet minimum qualification threshold |
| `schedule_conflict` | Candidate availability conflicts with role schedule |
| `experience_gap` | Candidate lacks required experience |
| `location_mismatch` | Candidate location does not match role requirements |
| `duplicate_candidate` | Duplicate entry identified and collapsed |
| `reject_for_assignment` | Explicit reject-for-assignment signal (must also be event name when used) |
| `stale_review_data` | Candidate data is stale and requires refresh |

The full vocabulary must be enumerated and approved before the first audit-write implementation for candidate review.

## Diagnostic Evidence Label

When candidate review events are surfaced in Admin display in a diagnostic or mock mode, the copy label must use "Demo/Mock" or an equivalent label. It must not use official language (e.g., "recorded", "audited", "confirmed", "verified") until the event is written through a production-persistence path.

Current `DiagnosticCopyStage` pattern for mock/demo events:

```typescript
// Mock/demo label — diagnostic context only, not official evidence
copyStage: "Mock/Demo"
```

## Valid and Invalid Event Examples

### Valid Event (future audit-write shape, illustrative only)

```json
{
  "id": "candidate_review_shortlist_001",
  "eventType": "candidate_review.shortlist",
  "actionKey": "shortlist",
  "actorId": "usr_staff_001",
  "actorRole": "staff",
  "actorDisplayName": "Staff reviewer",
  "targetType": "candidate",
  "targetId": "cand_001",
  "targetDisplayToken": "Candidate #C-2048",
  "targetPrivacyLevel": "internal",
  "nextReviewState": "shortlisted",
  "reviewAction": "shortlist_candidate",
  "safeReasonCode": null,
  "reason": null,
  "reasonRequired": false,
  "sourceRoute": "/staff/candidates/review",
  "createdAt": "2026-05-17T09:00:00.000Z",
  "severity": "info",
  "policyVersion": "",
  "persistenceMode": "mock_only",
  "metadata": {
    "candidateToken": "Candidate #C-2048",
    "nextReviewState": "shortlisted",
    "reviewAction": "shortlist_candidate"
  }
}
```

### Invalid Event — Free-text reason in metadata

```json
{
  "eventType": "candidate_review.reject_for_assignment",
  "metadata": {
    "reason": "Candidate seems unreliable and dishonest"  // FORBIDDEN — free text
  }
}
```

### Invalid Event — Raw student identifier

```json
{
  "eventType": "candidate_review.shortlist",
  "metadata": {
    "rawCandidateId": "2048"  // FORBIDDEN — use candidateToken instead
  }
}
```

### Invalid Event — Approval implication

```json
{
  "eventType": "candidate_review.manually_selected",
  "metadata": {
    "approvedBy": "admin_001",    // FORBIDDEN — approval field
    "approvalStatus": "confirmed" // FORBIDDEN — approval status field
  }
}
```

### Invalid Event — Scholarship decision field

```json
{
  "eventType": "candidate_review.skip",
  "metadata": {
    "scholarshipDecision": "awarded" // FORBIDDEN — scholarship field is out of scope
  }
}
```

## Future Validation Rules

When a future audit-write implementation phase for candidate review begins, the following validation rules must be enforced before any event is persisted or displayed:

1. **Event name must be in the `candidate_review.*` namespace.** Reject any event with a different namespace as a schema violation.
2. **`targetType` must be `"candidate"`.** Reject any event with a different target type for candidate review audit entries.
3. **`persistenceMode` must never be `real_persisted` without a separate AP-10C runtime approval.** Mock-only and prototype-only are acceptable during planning; real persistence is blocked.
4. **Metadata `safeReasonCode` must match a closed vocabulary entry.** Free-text values are rejected.
5. **Metadata must not contain any forbidden field keys.** Enforce via the existing `validateAuditMetadata` pattern.
6. **`targetDisplayToken` must use the `Candidate #C-XXXX` format.** Raw IDs must be masked through token formatter.
7. **No event in any future candidate review phase may carry `approvedBy`, `approvalStatus`, `scholarshipDecision`, or `assignedBy`.** These fields would imply governance outcomes that are separate from review state.
