# S²IMS Advisor Review Status Model MC2

## Overview

This document defines the advisor review status model for S²IMS scholarship workflow. It describes all valid statuses, the transition table, what each status means, what each status does NOT mean, privacy notes, audit requirements, and rollback rules.

These statuses describe the state of an advisor's participation in a scholarship application review — not the state of the scholarship application itself. Scholarship approval is a separate, independent decision by staff and committee/admin.

No status transition auto-assigns an advisor. No status transition creates AP-10B governance evidence.

## Status Enum

| Status | Description |
|--------|-------------|
| `not_required` | No advisor review is required for this application |
| `pending_advisor_review` | An advisor has been assigned; review is pending |
| `advisor_recommended` | Advisor has reviewed and recommends the application |
| `advisor_needs_more_info` | Advisor has reviewed; requests additional information before recommending |
| `advisor_declined` | Advisor has declined to review or declined to recommend |
| `released_to_scholarship_staff` | Advisor review phase is complete; scholarship staff may proceed |

## Transition Table

| From | To | Trigger | Who Can Trigger |
|------|----|---------|----------------|
| *(initial)* | `not_required` | Scholarship criteria do not require advisor review | System (rule-based) or Staff |
| *(initial)* | `pending_advisor_review` | Staff confirms advisor candidate | Staff |
| `pending_advisor_review` | `advisor_recommended` | Advisor submits recommendation | Advisor (future implementation) |
| `pending_advisor_review` | `advisor_needs_more_info` | Advisor requests more information | Advisor (future implementation) |
| `pending_advisor_review` | `advisor_declined` | Advisor declines to review | Advisor (future implementation) or Staff on advisor's behalf |
| `advisor_needs_more_info` | `pending_advisor_review` | Student provides additional information | Staff (re-opens review) |
| `advisor_needs_more_info` | `advisor_recommended` | Advisor receives information and recommends | Advisor (future implementation) |
| `advisor_needs_more_info` | `advisor_declined` | Advisor declines after receiving information | Advisor (future implementation) |
| `advisor_recommended` | `released_to_scholarship_staff` | Staff acknowledges advisor review complete | Staff |
| `advisor_declined` | `released_to_scholarship_staff` | Staff acknowledges and proceeds without advisor recommendation | Staff |
| `advisor_declined` | `pending_advisor_review` | Staff re-assigns a different advisor candidate | Staff (override) |
| `released_to_scholarship_staff` | `pending_advisor_review` | Staff re-opens advisor review (exceptional case) | Staff (with audit reason) |
| `not_required` | `pending_advisor_review` | Scholarship criteria revised to require advisor review | Staff (with audit reason) |

## What Each Status Means

### `not_required`

Advisor review has been determined to be unnecessary for this application. This may be because the scholarship type does not require academic endorsement, or because the applicant's program has no matching advisor candidate available and staff has approved proceeding without advisor review.

### `pending_advisor_review`

An advisor candidate has been confirmed by staff and the advisor has been notified (in future implementation). The advisor is expected to submit a review recommendation. The application is in an advisor-pending state.

### `advisor_recommended`

The advisor has reviewed the application and submitted a recommendation in favor of the applicant. The scholarship staff may now review the advisor's recommendation as one input to their own decision.

### `advisor_needs_more_info`

The advisor has reviewed the application and requires additional information before providing a recommendation. The application is returned to the student or staff to provide the requested information.

### `advisor_declined`

The advisor has declined to participate in the review, or has reviewed and declined to provide a recommendation. The scholarship staff must decide how to proceed — they may re-assign a different advisor or proceed without an advisor recommendation.

### `released_to_scholarship_staff`

The advisor review phase is complete. Scholarship staff may proceed with their own review. This status does not indicate whether the advisor recommended or declined — it simply indicates the advisor phase is closed.

## What Each Status Does NOT Mean

| Status | Does NOT Mean |
|--------|--------------|
| `advisor_recommended` | The scholarship is approved |
| `advisor_recommended` | AP-10B governance authority has been established |
| `advisor_recommended` | The advisor is an AP-10B owner |
| `advisor_declined` | The scholarship application is rejected |
| `advisor_declined` | The student is ineligible |
| `released_to_scholarship_staff` | The advisor approved the scholarship |
| `released_to_scholarship_staff` | Staff must follow the advisor's recommendation |
| `not_required` | The student is disadvantaged in the process |
| Any status | AP-10B approval has been collected |
| Any status | AP-10C may open |
| Any status | AP-11 may open |

## Privacy Notes

| Transition | Privacy Requirement |
|-----------|-------------------|
| Any → `pending_advisor_review` | Advisor candidate `displayName` and `officialEmail` (if authorized) may be recorded. Mobile must not be recorded. |
| Any | Student ID must be masked in all advisor-visible records |
| Any | Student GPA, financial need, disability status must not appear in advisor review context unless explicitly authorized |
| `advisor_recommended` | Recommendation text must not include student PII beyond what is authorized in the student's profile |
| `advisor_needs_more_info` | Information request must not expose what the advisor can see beyond their role-authorized view |
| `advisor_declined` | Decline reason (if recorded) must be role-scoped — not visible to the student |
| `released_to_scholarship_staff` | No raw advisor contact details in the release record |

## Audit Requirements

The following transitions must be auditable in any future implementation:

| Transition | Audit Requirement |
|-----------|------------------|
| *(initial)* → `pending_advisor_review` | Record which staff member confirmed the advisor, the advisor `candidateId`, and the timestamp |
| `pending_advisor_review` → `advisor_recommended` | Record that recommendation was submitted; do not record recommendation content in audit log unless explicitly required |
| `pending_advisor_review` → `advisor_declined` | Record that advisor declined; record who triggered if staff-triggered |
| `advisor_declined` → `pending_advisor_review` | Record staff override; record new advisor `candidateId`; require audit reason field |
| `released_to_scholarship_staff` → `pending_advisor_review` | Record exceptional re-open; require audit reason field |
| Any unexpected transition | Log as invalid transition attempt; do not silently succeed |

Audit logs must not contain:
- Student mobile numbers
- Student personal email
- Advisor mobile numbers
- Advisor personal email
- Raw source IDs (teacher_id, student_id)
- Content of private remarks

## Rollback / Manual Correction

| Scenario | Correction Path |
|---------|----------------|
| Wrong advisor confirmed | Staff re-assigns: `pending_advisor_review` → `advisor_declined` → `pending_advisor_review` with new candidate |
| Advisor unavailable after assignment | Staff transitions to `advisor_declined` and re-assigns or proceeds to `released_to_scholarship_staff` |
| Advisor review needed after `not_required` | Staff transitions: `not_required` → `pending_advisor_review` with audit reason |
| Review re-opened after release | Staff transitions: `released_to_scholarship_staff` → `pending_advisor_review` with audit reason (exceptional case) |
| Incorrect `advisor_recommended` recorded | Requires staff admin correction with audit trail; cannot be silently reverted |

All rollback and correction operations must be logged with:
- Actor (staff member)
- Timestamp
- Audit reason
- Previous state
- New state

Rollback operations do NOT create AP-10B governance evidence.

## AP-10B Separation

- No advisor review status transition constitutes an AP-10B approval.
- No advisor review status creates AP-10B ownership evidence.
- Advisor review is a workflow step for scholarship academic assessment only.
- AP-10B governance requires independent authority verification and explicit approval collection — entirely separate from the advisor workflow.
- AP-10C and AP-11 remain blocked regardless of advisor review outcomes.

## Implementation Notes (Future)

When MC2 runtime is implemented:
- Each transition must be validated against the transition table above — invalid transitions must throw.
- Transition logic must be a pure function (no side effects) at the domain layer.
- Side effects (notifications, audit writes) must be triggered from the application layer after the domain transition succeeds.
- `autoAssigned: false` on the `AdvisorCandidate` object must be enforced at runtime — no code path may set this to `true`.
- `assertSafeAdvisorCandidate` runtime guard (to be defined in MC2 runtime) must check that no forbidden fields exist on the output object before returning it.
