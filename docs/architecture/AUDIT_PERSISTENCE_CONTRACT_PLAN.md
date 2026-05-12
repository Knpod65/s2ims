# Audit Persistence Contract Plan

## 1. Purpose

This document defines the future audit persistence contract before real audit logging is implemented in S2IMS.

The current UI has prototype audit-awareness surfaces, most recently SW-3A warnings near Staff document rejection and replacement request flows. Those warnings are intentionally copy-safe: they tell staff that the prototype captures the reason in the UI flow, but that real audit-log persistence is not connected yet.

This plan exists to prevent UI copy, validation, and future shared components from overclaiming backend capability. It is planning only. It does not implement audit persistence, audit services, API behavior, database writes, reason min-length enforcement, or `ReasonRequiredModal`.

## 2. Current State

SW-3A added prototype-safe `AuditWarningCard` placement to `DocumentVerificationPanel` for Staff document rejection and replacement request flows. It also removed the always-visible amber strip from `DocumentActionRail`, leaving the workbench-level prototype strip and action-scoped warning cards.

`AuditWarningCard` has a `requiresReason` prop that renders "This action is logged and auditable." That copy is unsafe for document actions until real persistence exists. SW-3A correctly does not pass `requiresReason` for Staff document rejection or replacement request.

Reason capture already exists in several places:

| Surface | Current reason behavior | Current persistence posture |
|---|---|---|
| Staff document rejection | Non-empty reason required inline; no min length | Callback + toast only |
| Staff document replacement request | Non-empty message required inline; no min length | Callback + toast only |
| Staff disclosure rejection | 15-character minimum | Mock/modal flow |
| Staff disclosure approval | No reason input, but warning implies audit/reason | Mock/modal flow |
| Staff match override | 20-character minimum | Mock/modal flow |
| Provider shortlist request | 10-character minimum | Mock modal state only |
| Admin role assignment/removal component | 20-character minimum in component | Component-level mock callback |
| Admin export | No reason capture | Client-side CSV/JSON download |

Real audit persistence is absent. `src/data/mock/audit-logs.ts` provides demo audit rows using the current `AuditLog` shape from `src/lib/types.ts`: `id`, actor fields, action string, entity fields, optional `before`/`after`, `ip`, and `created_at`. The Admin audit log page renders that mock data and states that records are permanent, but this is demo-driven rather than backed by immutable persistence.

`src/config/sensitiveActions.ts` exists and defines sensitive action keys, risk levels, reason requirements, and warning copy. It is not fully enforced across UI flows.

## 3. Audit Vocabulary

| Term | Definition |
|---|---|
| Audit awareness | UI guidance that tells the user an action has governance significance. It may be prototype-only and must not imply persistence unless persistence exists. |
| Reason capture | A UI input that collects the user's explanation for a sensitive action. Reason capture alone is not audit persistence. |
| Audit event | A structured record describing who did what, to which target, when, under which policy, with which reason and privacy constraints. |
| Audit persistence | Durable storage of audit events in a trusted source of truth. Frontend state, toasts, and mock data are not persistence. |
| Audit viewer | A staff/admin UI that reads audit events. A viewer can be mock-driven, partially persistent, or backed by production persistence. |
| Audit export | A controlled export of audit records. It must use allowlists and should itself create an audit event when real persistence exists. |
| Sensitive action | An action that changes access, identity exposure, decisions, exports, or compliance evidence. |
| Prototype-safe copy | Copy that describes current prototype behavior without claiming a real audit record exists. |
| Real-persistence copy | Copy that may say "logged", "audit record", or "auditable" only after trusted persistence exists. |

## 4. Audit Event Contract

Future audit events should use a stable contract similar to the following. This is a future contract only and must not be implemented in this planning branch.

| Field | Purpose |
|---|---|
| `id` | Unique immutable audit event identifier. |
| `eventType` | Canonical event type such as `staff.document.reject`. |
| `actionKey` | Sensitive action config key when one exists, such as `document_rejection`. |
| `actorId` | Internal user ID of the actor. |
| `actorRole` | Role at the time of action: student, provider, staff, admin, esq, or system. |
| `actorDisplayName` | Role-appropriate actor label. Admin may see stronger labels; provider/executive surfaces should be restricted. |
| `targetType` | Entity type being acted on: document, application, candidate, disclosure request, export, role assignment, OCR job, etc. |
| `targetId` | Internal target ID. Use only in staff/admin contexts where allowed. |
| `targetDisplayToken` | Privacy-preserving display token such as `Student #S-2345` or `Candidate #C-2048`. |
| `targetPrivacyLevel` | Classification such as public, masked, staff_internal, admin_sensitive, pii_restricted. |
| `reason` | Trimmed user-supplied reason when captured. May be null for non-reason actions. |
| `reasonRequired` | Boolean resolved from policy at event time. |
| `reasonMinLength` | Minimum length that was expected when the event was submitted. |
| `metadata` | Allowlisted event-specific data. Must not be arbitrary object dumping. |
| `sourceRoute` | Route or UI surface that initiated the event. |
| `createdAt` | Server-side event creation timestamp. |
| `severity` | low, medium, high, or critical. |
| `policyVersion` | Version of audit/reason/privacy policy used to validate/build the event. |
| `persistenceMode` | prototype_ui_only, mock_persistent, backend_persistent, append_only_production. |

The contract should preserve internal keys and privacy boundaries while allowing role-specific display mapping. Frontend should never be the production source of truth for audit records.

## 5. Event Types

| Event type | Actor | Target | Reason required? | Persistence priority | Privacy risk | Severity | Copy before persistence | Copy after persistence |
|---|---|---|---|---|---|---|---|---|
| `staff.document.verify` | Staff/Admin | Document/Application | No by default | Medium | Staff internal | low | "Document decisions should include clear review notes." | "Verification is recorded in the audit log." |
| `staff.document.reject` | Staff/Admin | Document/Application | Yes | High | Staff internal, student impact | medium | "This prototype captures the staff reason in the UI flow, but real audit-log persistence is not connected yet." | "This rejection will be recorded in the audit log." |
| `staff.document.request_replacement` | Staff/Admin | Document/Application | Yes | High | Staff internal, student impact | medium | "This prototype captures the staff message in the UI flow, but real audit-log persistence is not connected yet." | "This replacement request will be recorded in the audit log." |
| `staff.disclosure.approve_identity_reveal` | Staff/Admin | Disclosure request/Candidate | Yes, decision needed | Critical | Identity exposure | critical | "Prototype disclosure decision; confirm fields before proceeding." | "This approval is logged and may expose identity fields." |
| `staff.disclosure.reject_identity_reveal` | Staff/Admin | Disclosure request/Candidate | Yes | High | Provider privacy boundary | medium | "Provide a clear reason for keeping this candidate masked." | "This rejection is recorded in the audit log." |
| `staff.match.override_decision` | Staff/Admin | Match/Application | Yes | High | Decision override | high | "Manual override requires clear justification." | "This override is recorded in the audit log." |
| `provider.shortlist.request` | Provider | Candidate shortlist request | Yes | Medium | Provider must stay token-only | medium | "Staff will review your reason before any next step." | "This shortlist request is recorded for staff review." |
| `provider.shortlist.submit_reason` | Provider | Shortlist request | Yes | Medium | Provider must stay token-only | medium | "Reason is used for staff review." | "Reason is saved with the shortlist request audit record." |
| `admin.role.assign` | Admin | User/Role assignment | Yes | Critical | Access governance | critical | "Role changes require documented reason." | "Role assignment is logged and cannot be silently altered." |
| `admin.role.remove` | Admin | User/Role assignment | Yes | Critical | Access governance | critical | "Role removals require documented reason." | "Role removal is logged and cannot be silently altered." |
| `admin.export.generate` | Admin/Staff/ESQ as allowed | Export job/report | Yes for sensitive exports | High | PII/export risk | high | "Exports must follow the approved allowlist." | "This export is logged and available for audit review." |
| `admin.permission.change` | Admin | Permission/scope | Yes | Critical | Access governance | critical | "Permission changes require documented reason." | "Permission changes are logged with policy version." |
| `system.ocr.process_document` | System | OCR job/document | No | Medium | Document processing | medium | "OCR processing is represented in prototype data." | "OCR processing result is recorded by the system." |
| `system.data_quality.flag` | System/Staff | Data quality issue | Optional or policy-specific | Medium | Data quality governance | medium | "Issue is tracked in prototype data." | "Data quality flag is recorded for review." |
| `system.integration.sync_failed` | System | Integration/sync job | No, note optional | Medium | Operational integrity | medium | "Sync failure is shown in prototype status." | "Sync failure is recorded in the audit/event log." |

## 6. Reason Requirement Matrix

| Domain | Action | Current reason capture | Current validation | Should reason be required? | Suggested min length | Audit persistence priority | Notes |
|---|---|---|---|---|---:|---|---|
| Staff documents | Document rejection | Inline textarea | Non-empty trim only | Yes | 20 | High | SW-3A warning is prototype-safe; no real write. |
| Staff documents | Document replacement request | Inline textarea | Non-empty trim only | Yes | 20 | High | Message should be specific and student-actionable. |
| Staff documents | Document verification | None | N/A | Optional note only | 0 | Medium | Verification may be audited without forcing reason. |
| Staff disclosure | Disclosure approval | No reason input | N/A | Yes, product decision needed | 30 | Critical | Current warning implies real logging/reason but approval has no reason field. |
| Staff disclosure | Disclosure rejection | Modal textarea | 15-character minimum | Yes | 20 | High | Current min length differs from policy. |
| Staff matching | Match override | Modal textarea | 20-character minimum | Yes | 30 | High | Policy suggests high risk. |
| Provider shortlist | Shortlist request | Modal reason field | 10-character minimum | Yes | 20 | Medium | Provider metadata must remain token-only. |
| Admin access | Role assignment | Component textarea | 20-character minimum | Yes | 40 | Critical | Component exists; admin route wiring should be confirmed before runtime changes. |
| Admin access | Role removal | Component textarea | 20-character minimum | Yes | 40 | Critical | Should use same contract as role assignment. |
| Admin export | Export generation | None | N/A | Yes for sensitive export | 30 | High | Current export downloads directly from client. |

Do not change actual validation in this branch.

## 7. Privacy and PDPA Boundary

Provider-facing audit records must not expose raw student names, emails, raw student IDs, phone numbers, household details, financial documents, or internal application IDs unless a future policy explicitly allows a masked mapping. Provider audit surfaces should use candidate tokens and provider-owned request IDs.

Staff audit records may reference masked profiles or internal student tokens depending on role and route. Staff should see enough context for operations without unnecessary raw PII.

Admin audit records may include stronger identifiers, but they still require allowlists and role checks. Raw payload dumping is not acceptable.

Executive/ESQ audit views should remain aggregate, trend-level, or policy-level unless explicitly approved. ESQ should not receive individual case audit rows by default.

Audit metadata must avoid unnecessary sensitive fields. Store what is needed to prove action, actor, target, policy, reason, timestamp, and allowed context. Do not store whole form payloads, uploaded document contents, unmasked candidate/student records, access tokens, or browser localStorage state.

## 8. Prototype Copy vs Real Persistence Copy

| Stage | Persistence state | Allowed copy | Not allowed |
|---|---|---|---|
| Stage 0 | No persistence | "prototype captures this in the UI flow", "real audit-log persistence is not connected yet", "should be auditable in production" | "logged", "auditable", "audit record created", "cannot be undone" |
| Stage 1 | Mock persistence only | "saved in demo audit trail", "shown in prototype audit view" | "official audit record", "production audit log" |
| Stage 2 | Real persistence enabled | "logged", "audit record", "auditable", "recorded in audit log" | Claims that export/review workflow exists if it does not |
| Stage 3 | Real persistence plus export/review workflow | "official audit review", "available for audit export", "reviewable by authorized admins" | Any copy implying broader access than role policy allows |

Safe Stage 0 examples:

- "This prototype captures the staff reason in the UI flow, but real audit-log persistence is not connected yet."
- "Document decisions should include clear review notes."
- "Audit logging is currently represented in the prototype UI only."

Unsafe Stage 0 examples:

- "This action is logged and auditable."
- "This rejection will be recorded in the audit trail."
- "An audit record has been created."
- "This action cannot be undone."

## 9. Integration Boundaries

Future implementation should separate responsibilities:

| Boundary | Responsibility |
|---|---|
| `auditEventBuilder` | Convert action context into a typed audit event payload. |
| `auditPersistenceService` | Persist audit events to the current persistence mode. |
| `auditPolicyService` | Resolve action policy, reason requirements, severity, and copy stage. |
| `reasonValidationService` | Apply min-length, trimming, and error copy consistently. |
| `privacyAuditMapper` | Map actor/target metadata into role-safe audit metadata. |
| `adminAuditViewerService` | Read, filter, and export audit events for authorized admin surfaces. |

These names are planning boundaries only. No code is introduced here.

## 10. Data Storage Considerations

| Option | Pros | Limits |
|---|---|---|
| Frontend mock only | Fast for prototype and UI QA | Not persistence; unsafe for official audit claims |
| Local JSON/mock data | Useful for demos and tests | Mutable, client-visible, not authoritative |
| Backend API | Enables server-side timestamps and actor context | Needs auth and policy enforcement |
| Database audit table | Queryable and admin-friendly | Must guard mutation and PII spread |
| Append-only audit log | Strongest audit posture | Requires lifecycle, redaction, retention, and export design |

Recommendation: production should use append-only backend persistence. Frontend should never be the audit source of truth. Audit records should be immutable except for tightly governed redaction or legal correction workflows.

## 11. Migration Sequence

| Phase | Scope |
|---|---|
| AP-1 | Planning contract only. This branch. |
| AP-2 | Add mock audit event builder tests only. No UI wiring. |
| AP-3 | Wire document rejection/replacement to mock audit writer only, clearly labeled mock. |
| AP-4 | Introduce reason min-length via shared config. |
| AP-5 | Introduce shared `ReasonRequiredModal` after persistence/copy decision. |
| AP-6 | Backend/API persistence design. |
| AP-7 | Admin audit viewer alignment. |
| AP-8 | Export/audit policy enforcement. |

Do not jump directly to `ReasonRequiredModal`. Do not claim real persistence before AP-6 or an equivalent approved backend persistence phase.

## 12. Risks

- UI overclaiming audit capability.
- Reason captured but not persisted.
- Inconsistent reason length across sensitive actions.
- Raw PII in metadata.
- Provider privacy boundary leak.
- Audit log mutability.
- Staff thinking an action is officially recorded when it is not.
- Duplicate warning fatigue reducing the impact of important warnings.
- Admin audit/export pages implying stronger permanence than mock data can provide.

## 13. Recommended Next Phase

Recommended next phase: AP-2 — mock audit event builder and tests planning or implementation, but only after this document is reviewed.

Alternative: SD-3 reason validation planning, but not implementation. Reason validation should not move ahead of the audit copy and persistence stage decision.
