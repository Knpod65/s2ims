# Audit Copy Stage Guide

This guide defines which audit-related copy is allowed at each persistence stage. It is planning-only.

## Stage 0: Prototype Copy

Stage 0 means no real audit persistence exists. The UI may collect a reason, show a warning, or display mock audit rows, but no trusted audit event is written.

Safe copy:

- "This prototype captures the staff reason in the UI flow, but real audit-log persistence is not connected yet."
- "Audit logging is currently represented in the prototype UI only."
- "Document decisions should include clear review notes."
- "This action should be auditable in production."

Unsafe copy:

- "This action is logged and auditable."
- "This rejection will be recorded in the audit trail."
- "Audit record created."
- "This action cannot be undone."
- "Compliance complete."

## Stage 1: Mock Persistence Copy

Stage 1 means the app writes to a mock audit store or local in-memory/demo data. This is useful for UI tests but is still not official persistence.

Safe copy:

- "Saved in the demo audit trail."
- "Shown in the prototype audit view."
- "Mock audit event created for review."

Unsafe copy:

- "Official audit record created."
- "Production audit log updated."
- "Permanent audit record."

## Stage 2: Real Persistence Copy

Stage 2 means server-side audit persistence exists and is the source of truth.

Safe copy:

- "This action will be logged in the audit trail."
- "An audit record will be created."
- "This decision is auditable by authorized staff/admins."
- "Provide a clear reason for the audit record."

Still unsafe:

- "Available for official export" if export/review workflow is not implemented.
- "Visible to all admins" if role-scoped audit viewing is not implemented.

## Stage 3: Official Audit/Export Copy

Stage 3 means real persistence exists and authorized review/export workflows exist.

Safe copy:

- "This action will be included in official audit review."
- "This export will be logged and available to authorized audit reviewers."
- "Audit records can be exported by authorized admins."

Unsafe copy:

- Any copy implying provider, executive, or non-authorized users can view individual audit records.
- Any copy implying raw PII will be exported without allowlist review.

## Safe Copy Examples

| Context | Stage | Copy |
|---|---|---|
| Staff document rejection | 0 | "This prototype captures the staff reason in the UI flow, but real audit-log persistence is not connected yet." |
| Staff document replacement | 0 | "This prototype captures the staff message in the UI flow, but real audit-log persistence is not connected yet." |
| Mock audit writer | 1 | "Saved in the demo audit trail for prototype review." |
| Real persisted rejection | 2 | "This rejection will be recorded in the audit log." |
| Admin audit export | 3 | "This export will be logged and available for authorized audit review." |

## Unsafe Copy Examples

| Copy | Why unsafe before real persistence |
|---|---|
| "This action is logged and auditable." | Claims real persistence. |
| "This decision is irreversible." | Claims durable governance consequence. |
| "Audit record created." | Claims event creation. |
| "Saved permanently." | Claims immutable storage. |
| "Official audit trail updated." | Claims production audit system. |

## Component Guidance for `AuditWarningCard`

`AuditWarningCard` may be used in Stage 0 only when the `message` explicitly states the prototype limitation or avoids persistence claims.

Do not pass `requiresReason` in Stage 0 for document actions. That prop renders the copy "This action is logged and auditable", which is real-persistence copy.

For Stage 0 Staff document flows:

```tsx
<AuditWarningCard
  title="Document rejection review"
  message="This prototype captures the staff reason in the UI flow, but real audit-log persistence is not connected yet. Keep the reason clear, factual, and appropriate for future audit review."
/>
```

## Rule for `requiresReason`

`requiresReason` can be used safely only when one of these is true:

1. Real backend persistence exists for the action.
2. The prop copy is changed so it no longer says "logged and auditable".
3. The component is rendered in a clearly labeled mock-persistence context and the prop copy is updated to say "demo audit trail", not "logged and auditable".

Until then, do not use `requiresReason` for Staff document rejection or replacement request.
