# Mock Audit Event Builder Phase AP-2

## Purpose

AP-2 adds a pure mock audit event builder foundation and lightweight checks for the future S2IMS audit persistence contract.

This phase does not wire audit events into runtime UI. It does not add real audit persistence, API behavior, database writes, mock audit log mutation, reason validation changes, or `ReasonRequiredModal`.

## Files Added

- `src/lib/audit/auditTypes.ts`
- `src/lib/audit/auditMetadataRules.ts`
- `src/lib/audit/auditEventBuilder.ts`
- `src/lib/audit/index.ts`
- `scripts/check-audit-events.mjs`
- `docs/architecture/MOCK_AUDIT_EVENT_BUILDER_PHASE_AP2.md`

## Files Modified

- `package.json`
- `docs/architecture/NEXT_RENOVATION_STEPS.md`

## What the Builder Does

The builder creates in-memory audit event objects using the AP-1 contract fields:

- event type
- sensitive action key
- actor identity and role
- target type, ID, display token, and privacy level
- reason and reason policy fields
- allowlisted metadata
- source route
- created timestamp
- severity
- policy version
- persistence mode

It defaults to:

- `policyVersion: "audit-contract-v1"`
- `persistenceMode: "mock_only"`

It supports deterministic `id` and `createdAt` values for checks and future tests.

## What the Builder Does Not Do

- Does not write to `mockAuditLogs`.
- Does not write to localStorage, browser APIs, backend APIs, or a database.
- Does not mutate runtime workflows.
- Does not change reason validation in any component.
- Does not introduce `ReasonRequiredModal`.
- Does not change Staff/Student/Provider/Admin/ESQ behavior.
- Does not claim real audit persistence.

## Event Types Covered

The type layer defines the AP-1 event type set:

- `staff.document.verify`
- `staff.document.reject`
- `staff.document.request_replacement`
- `staff.disclosure.approve_identity_reveal`
- `staff.disclosure.reject_identity_reveal`
- `staff.match.override_decision`
- `provider.shortlist.request`
- `provider.shortlist.submit_reason`
- `admin.role.assign`
- `admin.role.remove`
- `admin.export.generate`
- `admin.permission.change`
- `system.ocr.process_document`
- `system.data_quality.flag`
- `system.integration.sync_failed`

AP-2 implements specialized helper builders for the first safe runtime candidates:

- `buildStaffDocumentVerifyEvent`
- `buildStaffDocumentRejectEvent`
- `buildStaffDocumentReplacementRequestEvent`

These helpers are not wired into UI.

## Metadata Privacy Validation

`auditMetadataRules.ts` exports:

- `FORBIDDEN_AUDIT_METADATA_KEYS`
- `SAFE_AUDIT_METADATA_KEYS`
- `validateAuditMetadata(metadata, context)`

Validation returns `{ valid, errors, warnings }`.

Forbidden metadata includes raw student identity and sensitive data keys such as:

- `rawStudentName`
- `studentName`
- `studentEmail`
- `rawStudentId`
- `nationalId`
- `bankAccount`
- `incomeRaw`
- `medicalInfo`
- `freeTextSensitiveData`

Provider metadata fails validation if it includes raw student identity keys. Executive/ESQ metadata receives warnings for individual target details and should prefer aggregate/policy metadata.

## Checks Added

`scripts/check-audit-events.mjs` is a lightweight Node check script. It uses the existing TypeScript dev dependency to transpile local TS modules in memory, avoiding a new test runner or dependency.

The script checks:

- base builder creates required fields
- deterministic `id`
- deterministic `createdAt`
- default `persistenceMode` is `mock_only`
- default policy version is present
- Staff document verify does not require reason
- Staff document reject requires reason
- Staff document replacement request requires reason
- missing required reason fails
- safe metadata passes
- forbidden metadata fails
- provider raw student identity metadata fails
- mock audit log length is not mutated
- `sourceRoute` is present
- target privacy level is present

## How to Run

```bash
npm run build
npm run check:tokens
npm run check:audit-events
```

## Limitations

- This is not a production audit service.
- No real persistence exists.
- No API or database contract is implemented.
- No UI flow calls the builder.
- Reason min-length behavior is unchanged in all existing components.
- `ReasonRequiredModal` remains future work.
- The Admin audit log page still reads mock audit logs.

## Recommended Next Phase

Recommended next phase: AP-3 planning for a clearly labeled mock audit writer, or a review checkpoint before any runtime wiring.

Do not jump directly to real persistence, reason min-length enforcement, or `ReasonRequiredModal`. Those require separate product and persistence decisions.

## Confirmation

- No UI wiring was added.
- No real audit persistence was added.
- No reason validation behavior changed.
- No component or app page was modified.
