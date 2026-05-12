# Mock Audit Writer UI Copy Rules

This document defines the wording that is allowed when S2IMS uses a mock audit writer. It is planning-only and does not change runtime behavior.

## Copy Stages

### `prototype_only`

Allowed copy:

- "This prototype captures the reason in the UI flow"
- "Real audit persistence is not connected yet"
- "Audit awareness is shown for review only"

Not allowed:

- "Logged"
- "Official audit record"
- "Permanently recorded"
- "Auditable"

### `mock_only`

Allowed copy:

- "Saved to demo audit trail"
- "Mock audit event captured for prototype review"
- "This is not an official audit record"

Not allowed:

- "Logged"
- "Official audit record"
- "Compliance complete"

### `real_persisted`

Allowed copy:

- "Recorded in audit log"
- "Official audit record"
- "Available for authorized review"

Not allowed:

- mock-only disclaimers that would weaken the production guarantee

## Role-Specific Copy Rules

### Staff copy

Use operational, review-oriented language.

Allowed:

- "This prototype captures the staff reason in the UI flow"
- "Keep the reason clear, factual, and appropriate for future review"

Not allowed:

- "This action is logged"
- "This rejection is permanently recorded"

### Provider copy

Use token-only and privacy-first language.

Allowed:

- "Staff will review your reason before any next step"
- "Names, raw student IDs, emails, and identity details are not revealed in this phase"

Not allowed:

- "The audit log contains student identity"
- "Your request is officially recorded"

### Admin copy

Use explicit mock/real separation.

Allowed:

- "Demo audit event - not official persistence"
- "Mock event"
- "Persistence mode: mock_only"

Not allowed:

- "Permanent audit record" for mock data
- "Compliance complete" when only mock data exists

### Executive / ESQ copy

Use aggregate or policy-level wording by default.

Allowed:

- "Aggregate audit activity"
- "Policy-level review only"
- "No individual row-level audit evidence in this view"

Not allowed:

- raw student or candidate identity statements
- mock rows presented as official compliance evidence

## Forbidden Words Until Real Persistence Exists

Do not use the following words in any mock audit writer surface until real persistence exists:

- logged
- auditable
- official
- permanent
- irreversible
- compliant
- audit record
- audit trail

These terms can only be used when the underlying persistence mode is truly `real_persisted` and the surrounding workflow is approved for it.

## Document Rejection Examples

### Prototype only

- "This prototype captures the staff reason in the UI flow, but real audit persistence is not connected yet."
- "Keep the reason clear, factual, and appropriate for future review."

### Mock only

- "Mock audit event captured for prototype review."
- "Saved to demo audit trail."

### Real persisted

- "This rejection will be recorded in the audit log."
- "Provide a clear reason for the audit record."

## Document Replacement Examples

### Prototype only

- "This prototype captures the staff message in the UI flow, but real audit persistence is not connected yet."
- "Keep the request specific, factual, and student-actionable."

### Mock only

- "Mock audit event captured for prototype review."
- "Saved to demo audit trail."

### Real persisted

- "This replacement request will be recorded in the audit log."
- "Provide a clear reason for the audit record."

## Admin Audit Log Examples

### Mock event row

- "Demo audit event - not official persistence"
- "Mock event"
- "Persistence mode: mock_only"

### Real event row

- "Official audit record"
- "Persistence mode: real_persisted"
- "Authorized audit review only"

## PR and Checkpoint Wording

Use these phrases in PR bodies, checkpoints, and docs when mock audit writer work is still non-production:

- "planning only"
- "mock-only"
- "demo audit trail"
- "not official persistence"
- "no runtime code changed"
- "no real audit persistence added"

Do not write checkpoint text that implies a real audit system exists if the work is still mock-only.
