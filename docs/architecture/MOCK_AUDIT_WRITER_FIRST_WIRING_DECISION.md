# Mock Audit Writer First Wiring Decision

This document ranks the first runtime actions that should eventually connect to a mock audit writer. It is planning-only and does not change runtime behavior.

## Candidate Comparison

| Candidate action | User benefit | Owner benefit | Risk | Reason needed | Privacy sensitivity | Mock writer suitability | Recommended phase |
|---|---|---|---|---|---|---|---|
| Staff document reject | High | High | Medium | Yes | Staff internal | High | AP-4 |
| Staff document replacement request | High | High | Medium | Yes | Staff internal | High | AP-4 |
| Staff document verify | Medium | Medium | Low | No | Lower | Medium | AP-5 |
| Staff disclosure approve | Medium | High | High | Yes | Very high | Medium | AP-6 or later |
| Staff disclosure reject | Medium | High | High | Yes | Very high | Medium | AP-6 or later |
| Staff match override | Medium | High | High | Yes | High | Medium | AP-6 |
| Provider shortlist request | Medium | Medium | High | Yes | High | Medium | AP-6 |
| Admin export | Medium | High | High | Yes | High | Low until admin display rules are ready | AP-7 or later |
| Admin role assignment | Medium | High | High | Yes | High | Low until admin display and privacy rules are ready | AP-7 or later |

## Why Staff Document Reject Is the Best First Candidate

Staff document reject is the safest first wiring candidate because:

- it already has prototype-safe copy work in place
- it is a known sensitive action with clear reason capture
- it is operationally easy to understand for staff and reviewers
- it can be labeled as mock-only without implying compliance
- it is narrower than disclosure, export, or role-management flows

The replacement request flow is the natural second candidate because it shares the same document-review context and the same mock-writer boundary concerns.

## Why Other Candidates Should Wait

- Staff disclosure approval/rejection should wait because identity exposure risk is high and the copy already implies stronger governance consequences.
- Match override should wait because its risk profile is high and it overlaps with decision-authority policy.
- Provider shortlist request should wait because provider-visible privacy rules need to be stable before any mock writer makes the flow feel authoritative.
- Admin export should wait because export surfaces can easily be mistaken for official evidence.
- Admin role assignment should wait because access governance needs stricter admin display rules first.

## Recommended First Wiring Candidate

Recommended first wiring candidate: staff document reject, followed immediately by staff document replacement request once the mock writer and admin display language are in place.

Why:

- it is the clearest prototype-to-mock transition
- it keeps the user-facing meaning narrow
- it supports QA without expanding into compliance claims
- it creates a safe template for later sensitive actions

## Notes for AP-4 and Beyond

AP-4 should still keep the writer pure and test-only.

Do not wire this into UI until:

- mock writer labels are finalized
- admin audit display rules are approved
- copy rules are ready for prototype vs mock vs real modes
- no runtime code can confuse demo storage with official audit persistence
