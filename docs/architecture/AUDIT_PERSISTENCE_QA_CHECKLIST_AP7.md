# Audit Persistence QA Checklist — AP-7

Date: 2026-05-13
Branch: `architecture/audit-persistence-strategy-plan`
Status: Planning only — checklist for future AP-8+ stages.

---

## Purpose

This checklist must be completed before advancing each stage of the audit persistence
migration. Items marked `[current]` apply to the current mock-only state and should
be verified at every merge. Items marked `[stage N]` are only applicable from that stage.

---

## A — Contract Tests

- [ ] `npm run build` passes 40/40 static routes, 0 type errors
- [ ] `npm run check:tokens` passes 4/4
- [ ] `npm run check:audit-events` passes (42/42 in Stage 0; higher in later stages)
- [ ] All new checks added to `check-audit-events.mjs` when new modules are introduced
- [ ] Builder throws `AuditEventValidationError` for missing required fields [current]
- [ ] Builder throws for whitespace-only reason when `reasonRequired: true` [current]
- [ ] Builder correctly sets `persistenceMode: 'mock_only'` as default [current]
- [ ] Builder sets `policyVersion` from `AUDIT_POLICY_VERSION` when not supplied [current]
- [ ] `MockAuditWriter` starts empty per instance [current]
- [ ] `MockAuditWriter` rejects `real_persisted` and `prototype_only` events [current]
- [ ] `MockAuditWriter` rejects duplicate IDs by default (configurable) [current]
- [ ] `AuditWriterInterface` contract tests pass for both mock and persistent implementations [stage 1+]
- [ ] `PersistentAuditWriter` rejects client-supplied `createdAt` (server overrides) [stage 4+]
- [ ] `PersistentAuditWriter` rejects placeholder `actorId` pattern [stage 4+]

---

## B — Privacy Metadata

- [ ] No event contains `rawStudentName`, `studentEmail`, `rawStudentId`, `phone`, `address`, `nationalId` [current]
- [ ] All metadata keys are in `SAFE_AUDIT_METADATA_KEYS` or explicitly documented [current]
- [ ] Provider actor events never include raw student identity keys [current]
- [ ] Executive/ESQ actor events warned against individual `studentToken` / `applicationId` keys [current]
- [ ] `studentToken` (`Student #S-XXXX`) is used in metadata — not raw `student_id` numeric value [current]
- [ ] `candidateToken` (`Candidate #C-XXXX`) is used for provider metadata — not raw student data [current]
- [ ] Server-side forbidden key validation matches client-side `FORBIDDEN_AUDIT_METADATA_KEYS` [stage 4+]
- [ ] Server rejects any event with forbidden keys regardless of client validation [stage 4+]
- [ ] No audit event metadata contains file contents, full form payload, or arbitrary objects [current]

---

## C — Staff Document Reject Flow

- [ ] Staff reject "Reject Document" button visible for `uploaded`/`pending`/`needs_replacement` documents [current]
- [ ] Staff reject button hidden for already-`rejected` documents [current]
- [ ] Staff reject form stays open while typing reason [current]
- [ ] "Send Rejection" button disabled when reason is empty or whitespace-only [current]
- [ ] `onReject(docId, reason)` signature unchanged [current]
- [ ] `buildStaffDocumentRejectEvent` called with correct `actorId`, `actorRole`, `documentId`, `applicationId`, `studentToken` [current]
- [ ] Metadata includes `{ documentId, applicationId, studentToken, previousStatus, nextStatus: 'rejected' }` [current]
- [ ] `sharedMockAuditWriter.write(event)` wrapped in `try/catch` [current]
- [ ] Toast fires regardless of writer success or failure [current]
- [ ] `[AP-6D] Mock audit write failed (reject)` logged to `console.warn` on writer error [current]
- [ ] Reason min-length is `1` (non-empty) in Stage 0 — not 20 yet [current]
- [ ] Reason min-length enforced at 20 characters for reject actions [stage 7]
- [ ] `actorId` is real authenticated session ID — not `staff_demo_session` [stage 4+]

---

## D — Staff Document Replacement Request Flow

- [ ] Replacement request area visible for `uploaded`/`pending`/`needs_replacement`/`verified` documents (not `rejected`) [current]
- [ ] `AuditWarningCard` replacement message is Stage 0 copy [current]
- [ ] "Send Request" button disabled when message is empty or whitespace-only [current]
- [ ] `onRequestReplacement(docId, message)` signature unchanged [current]
- [ ] `buildStaffDocumentReplacementRequestEvent` called correctly [current]
- [ ] Metadata includes `{ documentId, applicationId, studentToken, previousStatus, nextStatus: 'needs_replacement' }` [current]
- [ ] Writer call wrapped in `try/catch` [current]
- [ ] Toast fires regardless of writer outcome [current]
- [ ] Reason min-length is `1` (non-empty) in Stage 0 [current]
- [ ] Reason min-length enforced at 20 characters for replacement request actions [stage 7]

---

## E — Staff Document Verify Flow

- [ ] Verify button hidden for `rejected`/`needs_replacement` documents [current]
- [ ] `onVerify(docId)` fires toast only — no builder call, no writer write [current]
- [ ] `buildStaffDocumentVerifyEvent` NOT called in current Staff page [current]
- [ ] `onVerify` remains unwired until AP-6E is approved [current]

---

## F — Admin Audit Log Display

- [ ] Admin audit log page returns 200 OK [current]
- [ ] Mock/demo banner visible and copy is mock/demo-safe [current]
- [ ] Fixture mock rows (6) appear [current]
- [ ] Static demo writer rows (3) appear [current]
- [ ] Live shared mock writer events appear after Staff action in same session [current]
- [ ] "Demo (generated)" badge shown in indigo for writer events [current]
- [ ] "Demo (fixture)" badge shown in slate for fixture events [current]
- [ ] Thai source labels render correctly [current]
- [ ] Rows sorted by `createdAt` descending [current]
- [ ] "Official persisted records" filter shows intentionally empty state [current]
- [ ] "Official persisted records" filter shows real events [stage 5+]
- [ ] `real_persisted` events shown with distinct badge from `mock_only` events [stage 5+]
- [ ] `DEMO_WRITER_EVENTS` suppressed or clearly labeled when real events exist [stage 5+]
- [ ] CSV export includes header warning about mock/demo data [current]
- [ ] CSV export filename includes `-demo` suffix [current]
- [ ] CSV export updated for real events with appropriate column [stage 5+]

---

## G — Admin Detail Drawer

- [ ] "View details" / "รายละเอียด" button opens drawer for each row [current]
- [ ] Drawer source badge: "Demo (generated)" (indigo) or "Demo (fixture)" (slate) [current]
- [ ] Drawer shows event ID, timestamp, event type, actor name, actor role [current]
- [ ] Drawer shows reason or "Reason not provided" placeholder [current]
- [ ] Drawer shows `mock_only` persistence mode badge [current]
- [ ] Drawer hides Policy Version when not present (fixture rows) [current]
- [ ] Drawer does NOT show third restatement of mock nature (removed in UX polish) [current]
- [ ] Metadata in drawer filtered through `FORBIDDEN_AUDIT_METADATA_KEYS` [current]
- [ ] Drawer shows `real_persisted` badge for real events [stage 5+]
- [ ] Drawer shows real `policyVersion` from DB [stage 5+]
- [ ] Drawer shows real `actorId` from DB (role-scoped — admin sees full, others do not) [stage 5+]

---

## H — Official Persisted Records Filter

- [ ] Filter option exists in Admin audit log page [current]
- [ ] Selecting "Official persisted records" shows empty state in Stage 0 [current]
- [ ] Empty state copy is appropriate for admin reviewer [current]
- [ ] Empty state removed or replaced when real events exist [stage 5+]
- [ ] Filter correctly limits display to `persistenceMode === 'real_persisted'` [stage 5+]

---

## I — Copy Stage Rules

- [ ] `AuditWarningCard` rejection message is Stage 0 copy [current]
- [ ] `AuditWarningCard` replacement message is Stage 0 copy [current]
- [ ] No component uses `requiresReason` prop for document actions in Stage 0 [current]
- [ ] Admin banner copy says "mock/demo" — not "official" or "persisted" [current]
- [ ] `DEMO_WRITER_EVENTS` display source labeled "Demo (generated)" — not "logged" [current]
- [ ] `AuditWarningCard` copy updated to Stage 2 only after Stage 5 confirmed [stage 6]
- [ ] `requiresReason` prop safe to use for document actions only after Stage 6 [stage 6]
- [ ] No Stage 0 copy remains after Stage 6 copy upgrade [stage 6]

---

## J — No PII Leakage

- [ ] No raw student ID (numeric) in any audit event field [current]
- [ ] No student name/email/phone in any audit event metadata [current]
- [ ] No full document content in any audit event metadata [current]
- [ ] No form payload dump in any audit event metadata [current]
- [ ] No unmasked candidate record in provider-context metadata [current]
- [ ] Admin audit display shows `targetDisplayToken` (`Student #S-XXXX`) not raw `targetId` numeric [current]
- [ ] Provider-facing audit surfaces (if any) show only candidate tokens [current]
- [ ] ESQ views remain aggregate — no individual student/application audit rows [current]

---

## K — Laravel-Style Boundary Review

- [ ] Page callbacks do not construct `AuditEvent` directly — use builders [current]
- [ ] Page callbacks do not call `validateAuditMetadata` directly — builder handles this [current]
- [ ] `buildAuditEvent` is the single validated event construction path [current]
- [ ] Writer is the single write boundary — no direct DB or localStorage calls [current]
- [ ] `adminAuditDisplayAdapter` is the single normalization/presenter for Admin display [current]
- [ ] No audit event construction logic in JSX render functions [current]
- [ ] Service layer orchestrates builder → writer (no direct builder + writer in components) [stage 2+]
- [ ] Repository interface abstracts storage — service does not import `sharedMockAuditWriter` directly [stage 2+]
- [ ] `AuditMetadataPolicy` runs server-side before DB write [stage 4+]

---

## L — DRY Review

- [ ] No duplicated audit event construction across page callbacks [current]
- [ ] No duplicated reason validation logic across components [current]
- [ ] No duplicated `writerEventToRow` / `fixtureToRow` logic outside adapter [current]
- [ ] No duplicated `FORBIDDEN_AUDIT_METADATA_KEYS` definition [current]
- [ ] No duplicated copy stage strings across components [current]
- [ ] Builder helpers are the single source of event type/severity/metadata defaults [current]
- [ ] `check-audit-events.mjs` covers all public builder + writer + adapter paths [current]
- [ ] No duplicated persistent/mock writer logic — both implement the same interface [stage 1+]
- [ ] No duplicated API validation — server mirrors client `FORBIDDEN_AUDIT_METADATA_KEYS` [stage 4+]

---

## M — Future Migration Readiness

- [ ] `AuditEvent` type shape is stable — no breaking field removals or renames needed [current]
- [ ] `AdminAuditDisplayRow` shape is stable — adapter can accept new data sources [current]
- [ ] `MockAuditWriter` interface can be extended to `AuditWriterInterface` without breaking existing usage [current]
- [ ] Builder helpers produce events with `persistenceMode: 'mock_only'` — can be changed to `real_persisted` [current]
- [ ] `policyVersion` field is stamped on all events — ready for versioned audit contract [current]
- [ ] `getAdminAuditDisplayRows` signature can be extended to accept API rows [current]
- [ ] `AUDIT_POLICY_VERSION` constant allows audit contract versioning [current]
- [ ] `check-audit-events.mjs` can be extended with persistent writer conformance checks [current]

---

## Checklist Usage

- Run this checklist at each stage gate before advancing.
- Items marked `[current]` must pass at every merge checkpoint.
- Items marked `[stage N]` are not applicable until that stage begins.
- Document any failures with the specific check that failed and the reason.
- A single failure in a `[current]` item blocks the merge.
- A single failure in a privacy/PII item (`B`, `J`) blocks all stages.
