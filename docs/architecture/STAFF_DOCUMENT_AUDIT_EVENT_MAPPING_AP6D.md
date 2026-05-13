# Staff Document Audit Event Mapping — AP-6D

Date: 2026-05-13
Branch: `architecture/staff-document-mock-audit-wiring-plan`
Status: Planning only — no runtime code changed.

---

## Purpose

This document maps each Staff document action to its proposed audit event contract.
Each entry specifies event type, builder call, actor/target fields, reason requirements,
metadata, privacy level, copy stage, and persistence mode.

AP-6D implements rejection and replacement request only. Verify is documented as deferred.

---

## Event 1: Staff Document Rejection

### Summary

| Field | Value |
|-------|-------|
| **eventType** | `staff.document.reject` |
| **actionKey** | `document_rejection` |
| **actorRole** | `staff` |
| **targetType** | `document` |
| **severity** | `medium` |
| **persistenceMode** | `mock_only` |
| **copyStage** | Stage 1 — mock persistence copy |
| **sourceRoute** | `/staff/applications/{applicationId}` |

### Actor Fields

| Field | Value | Source |
|-------|-------|--------|
| `actorId` | `'staff_demo_session'` | Prototype placeholder — real session ID future work |
| `actorRole` | `'staff'` | Fixed |
| `actorDisplayName` | `'Staff (Demo)'` | Prototype placeholder |

### Target Fields

| Field | Value | Source |
|-------|-------|--------|
| `targetType` | `'document'` | Fixed |
| `targetId` | `docId` | From `onReject(docId, reason)` callback arg |
| `targetDisplayToken` | `studentToken` | `formatStudentToken(app.student_id)` → `'Student #S-XXXX'` |
| `targetPrivacyLevel` | `'internal'` | Fixed — staff_internal scope |

### Reason

| Field | Value | Notes |
|-------|-------|-------|
| `reasonRequired` | `true` | Non-empty reason already enforced by UI |
| `reasonMinLength` | `1` | Not increased in AP-6D — unchanged from SW-3A |
| `reason` | Trimmed `reason` string from callback | Builder calls `.trim()` |

### Metadata (allowed)

| Key | Type | Value |
|-----|------|-------|
| `documentId` | `string` | `docId` from callback |
| `applicationId` | `string` | `id` from route param |
| `studentToken` | `string` | `'Student #S-XXXX'` — never raw student ID |
| `nextStatus` | `string` | `'rejected'` |

### Forbidden Metadata

| Key | Reason |
|-----|--------|
| Raw `student_id` | PII — use `studentToken` |
| Student name, email, phone | PII |
| File contents or file path | Not implemented; forbidden |
| Full form payload | Arbitrary dumping forbidden |
| `ip`, `before`, `after` (AuditLog fixture fields) | Not part of `AuditEvent` builder input |

### Builder Call

```typescript
buildStaffDocumentRejectEvent({
  actorId: 'staff_demo_session',
  actorRole: 'staff',
  actorDisplayName: 'Staff (Demo)',
  documentId: docId,
  applicationId: id,
  studentToken: studentToken,
  sourceRoute: `/staff/applications/${id}`,
  reason: reason,
  createdAt: new Date().toISOString(),
  metadata: {
    documentId: docId,
    applicationId: id,
    studentToken: studentToken,
    nextStatus: 'rejected',
  },
})
```

### Copy Stage

Stage 1 (mock persistence):

- Admin display: "Demo (generated)" source badge
- Admin display: no "official audit record" language
- AuditWarningCard in DocumentVerificationPanel: remains Stage 0 prototype-safe copy

Unsafe copy (must not appear):

- "Rejection recorded in audit trail"
- "Official audit record created"
- "This action is logged and auditable"

### Admin Display After AP-6D

When a Staff member rejects a document:

- A new row appears in `/admin/audit-log` with:
  - `action`: `staff.document.reject`
  - `actor`: "Staff (Demo)"
  - `source`: "Demo (generated)" (indigo badge)
  - `reason`: the trimmed rejection reason text
  - `severity`: medium
  - `targetDisplayToken`: `Student #S-XXXX`
- Drawer shows reason text, metadata, no policy version unavailability for writer events

---

## Event 2: Staff Document Replacement Request

### Summary

| Field | Value |
|-------|-------|
| **eventType** | `staff.document.request_replacement` |
| **actionKey** | `document_replacement_request` |
| **actorRole** | `staff` |
| **targetType** | `document` |
| **severity** | `medium` |
| **persistenceMode** | `mock_only` |
| **copyStage** | Stage 1 — mock persistence copy |
| **sourceRoute** | `/staff/applications/{applicationId}` |

### Actor Fields

| Field | Value | Source |
|-------|-------|--------|
| `actorId` | `'staff_demo_session'` | Prototype placeholder |
| `actorRole` | `'staff'` | Fixed |
| `actorDisplayName` | `'Staff (Demo)'` | Prototype placeholder |

### Target Fields

| Field | Value | Source |
|-------|-------|--------|
| `targetType` | `'document'` | Fixed |
| `targetId` | `docId` | From `onRequestReplacement(docId, message)` callback arg |
| `targetDisplayToken` | `studentToken` | `formatStudentToken(app.student_id)` → `'Student #S-XXXX'` |
| `targetPrivacyLevel` | `'internal'` | Fixed — staff_internal scope |

### Reason

| Field | Value | Notes |
|-------|-------|-------|
| `reasonRequired` | `true` | Non-empty message already enforced by UI |
| `reasonMinLength` | `1` | Not increased in AP-6D — unchanged from SW-3A |
| `reason` | Trimmed `message` string from callback | The replacement message serves as the audit reason |

### Metadata (allowed)

| Key | Type | Value |
|-----|------|-------|
| `documentId` | `string` | `docId` from callback |
| `applicationId` | `string` | `id` from route param |
| `studentToken` | `string` | `'Student #S-XXXX'` — never raw student ID |
| `nextStatus` | `string` | `'needs_replacement'` |

### Forbidden Metadata

Same as Event 1 — no raw student ID, no PII, no file contents.

### Builder Call

```typescript
buildStaffDocumentReplacementRequestEvent({
  actorId: 'staff_demo_session',
  actorRole: 'staff',
  actorDisplayName: 'Staff (Demo)',
  documentId: docId,
  applicationId: id,
  studentToken: studentToken,
  sourceRoute: `/staff/applications/${id}`,
  reason: message,
  createdAt: new Date().toISOString(),
  metadata: {
    documentId: docId,
    applicationId: id,
    studentToken: studentToken,
    nextStatus: 'needs_replacement',
  },
})
```

### Copy Stage

Stage 1 (mock persistence) — same as rejection. Admin display uses "Demo (generated)"
label. AuditWarningCard in DocumentVerificationPanel remains Stage 0.

### Admin Display After AP-6D

When a Staff member requests replacement:

- A new row appears in `/admin/audit-log` with:
  - `action`: `staff.document.request_replacement`
  - `actor`: "Staff (Demo)"
  - `source`: "Demo (generated)" (indigo badge)
  - `reason`: the trimmed replacement message
  - `severity`: medium
  - `targetDisplayToken`: `Student #S-XXXX`

---

## Event 3: Staff Document Verify — Deferred

### Summary

| Field | Value |
|-------|-------|
| **eventType** | `staff.document.verify` |
| **actionKey** | `null` |
| **severity** | `low` |
| **persistenceMode** | `mock_only` |
| **reasonRequired** | `false` |
| **status** | Deferred — not wired in AP-6D |

### Why Deferred

- No reason is captured for verify actions in the current UI.
- Severity is low — the governance value of wiring verify is lower than reject/replacement.
- The builder helper `buildStaffDocumentVerifyEvent` already exists in `auditEventBuilder.ts`.
- AP-6D focuses on the two highest-value Staff actions.
- Wiring verify can be added later without changing any interface.

### Future Builder Call (reference only — not for AP-6D)

```typescript
buildStaffDocumentVerifyEvent({
  actorId: 'staff_demo_session',
  actorRole: 'staff',
  actorDisplayName: 'Staff (Demo)',
  documentId: docId,
  applicationId: id,
  studentToken: studentToken,
  sourceRoute: `/staff/applications/${id}`,
  createdAt: new Date().toISOString(),
  metadata: {
    documentId: docId,
    applicationId: id,
    studentToken: studentToken,
    nextStatus: 'verified',
  },
})
```

### When to Wire

Wire `staff.document.verify` only after:
1. AP-6D reject and replacement wiring is reviewed and stable.
2. There is a product reason to audit verification events.
3. Explicit approval for the addition.

---

## Error Handling Contract

All builder calls in AP-6D runtime must be wrapped in try/catch:

```typescript
try {
  const event = buildStaffDocumentRejectEvent({ ... })
  sharedMockWriter.write(event)
} catch (err) {
  // Builder or writer errors must never break the UI flow
  // Toast still fires; write failure is silently swallowed in mock_only context
  console.warn('[AP-6D] Mock audit write failed', err)
}
```

Rationale: `buildStaffDocumentRejectEvent` throws `AuditEventValidationError` if required
fields are missing or metadata contains forbidden keys. In a mock prototype context, audit
write failure must not block the Staff UI action.

---

## Persistence Mode Contract

| Mode | Used | Notes |
|------|------|-------|
| `mock_only` | Yes — all AP-6D events | Writer only accepts `mock_only` |
| `prototype_only` | No | Rejected by writer |
| `real_persisted` | No | Not implemented; rejected by writer |

---

## Summary Table

| Event | In scope | Builder available | reasonRequired | severity | Deferred |
|-------|----------|-------------------|----------------|----------|---------|
| `staff.document.reject` | ✓ AP-6D | ✓ `buildStaffDocumentRejectEvent` | true | medium | No |
| `staff.document.request_replacement` | ✓ AP-6D | ✓ `buildStaffDocumentReplacementRequestEvent` | true | medium | No |
| `staff.document.verify` | Deferred | ✓ `buildStaffDocumentVerifyEvent` | false | low | Yes |
| `staff.disclosure.approve_identity_reveal` | Out of scope | Not built | — | critical | Yes |
| `admin.role.assign` | Already in DEMO_WRITER_EVENTS | ✓ `buildAuditEvent` | — | critical | Static demo only |
