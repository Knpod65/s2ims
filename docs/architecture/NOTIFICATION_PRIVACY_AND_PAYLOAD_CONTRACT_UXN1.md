# Notification Privacy and Payload Contract UX-N1

## 1. Purpose

This document defines privacy-safe notification payload rules for future clickable notifications.

UX-N1 does not change current notification data or runtime behavior.

## 2. Safe Payload Fields

Safe fields:

- `id`
- `type`
- `severity`
- `title`
- `body`
- `targetRouteName`
- `targetRouteParams`
- `targetDisplayToken`
- `actorRoleScope`
- `requiresPermission`
- `createdAt`
- `readAt`
- `actionLabel`
- `aggregateLabel`
- `maskedEntityLabel`
- `isClickable`

## 3. Forbidden Payload Fields

Forbidden fields:

- `rawStudentId`
- `studentId`
- `nationalId`
- `email`
- `phone`
- `bankAccount`
- `address`
- `rawUploadedFileName`
- `rawDocumentPath`
- `rawGuardianInfo`
- `fullName` unless explicitly role-approved
- `rawStudentName`
- `studentEmail`
- `medicalInfo`
- `disabilityInfo`
- `incomeRaw`
- `gpaRaw`
- `freeTextSensitiveData`

## 4. PII Handling Rules

Rules:

- Notification payloads must not store raw PII.
- URLs must not expose raw PII.
- Provider payloads must remain token-only for candidate/student references.
- Executive/ESQ payloads must prefer aggregate labels and policy-level summaries.
- Staff payloads may reference internal safe IDs only when the target route already requires them and role policy allows access.
- Admin payloads may reference audit event IDs, but metadata still needs privacy filtering.

## 5. Target Token Strategy

Use `targetDisplayToken` for visible labels:

- Student-facing: application or scholarship label, not hidden student identity.
- Staff-facing: application ID or student token if already approved for staff context.
- Provider-facing: candidate token, never raw student ID.
- Admin-facing: audit event ID or tokenized target.
- ESQ/executive-facing: aggregate label or policy topic.

## 6. Payload Examples

Safe student application example:

```ts
{
  id: 'notif_001',
  type: 'student.application.document_needed',
  severity: 'medium',
  title: 'Document needs attention',
  body: 'A document in your application needs an update.',
  targetRouteName: 'student.application.documents',
  targetRouteParams: { applicationId: 'app_002' },
  targetDisplayToken: 'Application app_002',
  actorRoleScope: ['student'],
  requiresPermission: 'student.application.view_own',
  createdAt: '2026-05-14T09:00:00Z',
  isClickable: true
}
```

Unsafe example:

```ts
{
  targetRouteParams: { studentId: '650912345' },
  email: 'student@example.edu',
  rawUploadedFileName: 'income-proof-somchai-family.pdf'
}
```

## 7. Audit-Related Notification Payload

Audit-related notifications may later link to Admin audit details only through safe event IDs and mock/real copy-stage labels.

Required:

- `targetRouteName: 'admin.audit.detail'`
- `targetRouteParams: { eventId: 'audit_evt_...' }`
- `requiresPermission: 'admin.audit.view'`
- persistence/copy stage from audit presenter or copy resolver

Not allowed:

- "official audit record" copy while persistence is mock-only.
- Raw target PII in payload or URL.

## 8. Scholarship/Application-Related Payload

Student scholarship/application notifications may route to:

- `student.scholarship.detail`
- `student.application.detail`
- `student.application.documents`

They must only target the student's own application routes.

## 9. Provider-Safe Payload

Provider notification payloads must use:

- `candidateToken`
- `scholarshipId` only when provider owns that scholarship context.
- Aggregate candidate pool labels.

They must not include:

- raw student IDs
- raw student names
- student email or phone
- document paths
- household or financial raw values

## 10. Executive/ESQ-Safe Payload

Executive/ESQ notifications should prefer:

- aggregate labels
- policy topic labels
- review item IDs already scoped to ESQ workflows

They must not expose individual student identity unless explicitly approved by a future policy decision.

## 11. Privacy Failure Modes

Failure modes to test:

- Raw PII in URL.
- Target existence leaked to wrong role.
- Provider sees student identity through notification body.
- ESQ/executive notification links to individual application detail.
- Admin audit notification implies official persistence when event is mock/demo.
- Free-text body includes sensitive details from source metadata.

## 12. QA Checklist

- [ ] Payload contains only safe fields.
- [ ] Forbidden fields are absent.
- [ ] Route params are tokenized or route-safe.
- [ ] Provider payloads are token-only.
- [ ] Executive/ESQ payloads are aggregate or policy-level.
- [ ] Audit payloads include copy stage.
- [ ] Broken/blocked target does not leak target existence.
- [ ] UI body text does not include raw PII.
