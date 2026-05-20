# S2IMS Import Preview Controlled Demo Feedback Classification Matrix — MC65

## Purpose
Provide rules to classify feedback from controlled internal demos and map to follow-up actions.

## Theme definitions
- UX/copy_clarity: Suggestions about wording and interface labels
- workflow_understanding: Observations about how users understand the flow
- validation_behavior: Reports on validator outputs and correctness
- accessibility: WCAG/keyboard/screen-reader concerns
- data_privacy: Concerns about PII-like disclosures
- governance_sensitive: Mentions governance or policy concerns (AP-10B scope)
- training_support: Requests for documentation or training materials
- out_of_scope: Items that are not for the demo (eg persistence requests)

## Severity definitions
- Low: Cosmetic or minor suggestions; no immediate action required
- Medium: Functional usability issues that reduce clarity; plan patch
- High: Issues that materially affect safety or show potential leakage of sensitive data; immediate triage
- Blocked: Issues that prevent safe demo continuation (stop conditions)

## Governance-sensitive rules
- Any governance_sensitive=yes items must be recorded and routed to governance_review_group and marked for AP-10B consideration
- Do not treat these as approvals; they are for review and information only

## Unsafe feedback examples
- Requests to enable Confirm Import
- Reports claiming data was persisted or auditable

## Safe follow-up mapping
- UX/copy -> product backlog, low/medium priority
- validation -> engineering, medium/high priority
- accessibility -> accessibility team, medium/high priority
- governance_sensitive -> governance review, high priority

## When to stop session
- Real PII surfaced, Confirm Import enabled, or persistence observed

## When to escalate
- Any High/Blocked severity items escalate to security and product owners immediately

## What must not become approval evidence
- Feedback entries and screenshots are not approval or sign-off documents
