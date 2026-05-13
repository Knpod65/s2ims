# Staff Document Mock Audit Wiring Plan — AP-6D

Date: 2026-05-13
Branch: `architecture/staff-document-mock-audit-wiring-plan`
Status: Planning only — no runtime code changed.

---

## Purpose

AP-6D connects Staff document rejection and replacement request callbacks to the AP-4 mock
audit writer, allowing each Staff action to produce a `mock_only` audit event visible in
the Admin audit log display built by AP-6A/AP-6B/AP-6C.

This plan defines scope, event contracts, builder calls, privacy boundaries, UI behavior
constraints, risk analysis, implementation sequence, and rollback strategy.

No runtime wiring is implemented in this branch.

---

## Current State

### Callback behavior (pre-AP-6D)

| Callback | Location | Current behavior | Audit behavior |
|----------|----------|-----------------|---------------|
| `onVerify(docId)` | `DocumentVerificationPanel.tsx` via `page.tsx` | Toast: "Document verified" | No audit write |
| `onReject(docId, reason)` | `DocumentVerificationPanel.tsx` via `page.tsx` | Toast: "Document rejected: {reason}" | No audit write |
| `onRequestReplacement(docId, message)` | `DocumentVerificationPanel.tsx` via `page.tsx` | Toast: "Replacement requested: {message}" | No audit write |

### Audit infrastructure available

| Module | Status |
|--------|--------|
| `src/lib/audit/auditTypes.ts` | ✓ `StaffDocumentAuditInput`, `AuditEvent`, `AuditPersistenceMode` |
| `src/lib/audit/auditEventBuilder.ts` | ✓ `buildStaffDocumentRejectEvent`, `buildStaffDocumentReplacementRequestEvent`, `buildStaffDocumentVerifyEvent` |
| `src/lib/audit/mockAuditWriter.ts` | ✓ `createMockAuditWriter`, `write`, `list`, `snapshot` — in-memory only |
| `src/lib/audit/adminAuditDisplayAdapter.ts` | ✓ `getAdminAuditDisplayRows` — reads static DEMO_WRITER_EVENTS only |
| `src/lib/audit/index.ts` | ✓ Public exports |
| `src/lib/audit/auditMetadataRules.ts` | ✓ `FORBIDDEN_AUDIT_METADATA_KEYS`, `validateAuditMetadata` |

### Staff application context available at callback site

In `src/app/staff/applications/[id]/page.tsx`:

| Context | Value | Source |
|---------|-------|--------|
| `id` (applicationId) | `params.id` (e.g. `app_002`) | Route param |
| `studentToken` | `formatStudentToken(app.student_id)` → `Student #S-XXXX` | Computed from mock data |
| `actorId` | Mock staff ID (prototype-safe placeholder) | Hardcoded or from future session |
| `actorDisplayName` | Mock staff name (prototype-safe placeholder) | Hardcoded or from future session |
| `actorRole` | `'staff'` | Fixed |
| `sourceRoute` | `/staff/applications/${id}` | Route param |
| `docId` | Passed from `onReject(docId, reason)` | Callback arg |
| `reason` | Passed from `onReject(docId, reason)` | Callback arg (non-empty, trimmed) |
| `message` | Passed from `onRequestReplacement(docId, message)` | Callback arg (non-empty, trimmed) |

### Admin audit display state (post-AP-6C/polish)

The Admin audit log at `/admin/audit-log` shows 9 rows:
- 6 fixture mock rows from `src/data/mock/audit-logs.ts`
- 3 static demo writer rows from `DEMO_WRITER_EVENTS` in `adminAuditDisplayAdapter.ts`

After AP-6D is wired, real-time Staff-triggered events should appear in the Admin audit
log as additional writer rows. The adapter will need to read from the shared writer
instance rather than only from static `DEMO_WRITER_EVENTS`.

---

## Target Future Runtime Behavior (AP-6D)

When a Staff member rejects a document or requests a replacement in
`DocumentVerificationPanel`, the callback at the page level should:

1. Call the appropriate builder helper to create a validated `AuditEvent`.
2. Write the event to a shared `MockAuditWriter` instance using `writer.write(event)`.
3. Show the existing toast notification (unchanged behavior).
4. The event becomes visible in the Admin audit log at `/admin/audit-log` on next render.

No real persistence occurs. All events are `mock_only`. The Admin audit log display will
show these events as "Demo (generated)" source rows, clearly labeled.

---

## Staff Actions In Scope

### 1. Document rejection

Trigger: Staff clicks "Send Rejection" in `DocumentVerificationPanel`.
Callback: `onReject(docId, reason)` fires in `page.tsx`.

AP-6D wiring: call `buildStaffDocumentRejectEvent` and write to shared writer.

### 2. Replacement request

Trigger: Staff clicks "Send Request" in `DocumentVerificationPanel`.
Callback: `onRequestReplacement(docId, message)` fires in `page.tsx`.

AP-6D wiring: call `buildStaffDocumentReplacementRequestEvent` and write to shared writer.

---

## Staff Actions Out of Scope

| Action | Reason out of scope |
|--------|-------------------|
| Document verification (`onVerify`) | Lower audit priority; no reason captured; deferred to AP-6D+ or later phase |
| Real audit persistence | Not implemented; would require backend/API; out of scope |
| Reason min-length enforcement | Deferred to SW-3B/SD-3; must not be changed here |
| ReasonRequiredModal | Must not be introduced; separate product decision required |
| AuditWarningCard copy changes | SW-3A copy is Stage 0 prototype-safe; no copy changes until real persistence |
| Provider/Student/ESQ actions | Out of scope |
| Admin export wiring | Out of scope |
| Staff identity reveal | Separate governance path; higher risk; deferred |
| Staff notes | Low-priority operational log; deferred |

---

## Proposed Event Types

### `staff.document.reject`

| Field | Value |
|-------|-------|
| `eventType` | `'staff.document.reject'` |
| `actionKey` | `'document_rejection'` |
| `actorRole` | `'staff'` |
| `targetType` | `'document'` |
| `severity` | `'medium'` |
| `reasonRequired` | `true` |
| `reasonMinLength` | `1` (existing minimum — not increased in AP-6D) |
| `persistenceMode` | `'mock_only'` |
| `targetPrivacyLevel` | `'internal'` |

### `staff.document.request_replacement`

| Field | Value |
|-------|-------|
| `eventType` | `'staff.document.request_replacement'` |
| `actionKey` | `'document_replacement_request'` |
| `actorRole` | `'staff'` |
| `targetType` | `'document'` |
| `severity` | `'medium'` |
| `reasonRequired` | `true` |
| `reasonMinLength` | `1` (existing minimum — not increased in AP-6D) |
| `persistenceMode` | `'mock_only'` |
| `targetPrivacyLevel` | `'internal'` |

---

## Proposed Builder Calls

### Reject event

```typescript
import { buildStaffDocumentRejectEvent } from '@/lib/audit/auditEventBuilder'

const event = buildStaffDocumentRejectEvent({
  actorId: 'staff_demo_session',          // prototype placeholder
  actorRole: 'staff',
  actorDisplayName: 'Staff (Demo)',        // prototype placeholder
  documentId: docId,
  applicationId: id,                       // from route params
  studentToken: studentToken,             // formatStudentToken(app.student_id)
  sourceRoute: `/staff/applications/${id}`,
  reason: reason,                         // from onReject callback
  createdAt: new Date().toISOString(),
  metadata: {
    documentId: docId,
    applicationId: id,
    studentToken: studentToken,
    nextStatus: 'rejected',
  },
})
sharedWriter.write(event)
```

### Replacement request event

```typescript
import { buildStaffDocumentReplacementRequestEvent } from '@/lib/audit/auditEventBuilder'

const event = buildStaffDocumentReplacementRequestEvent({
  actorId: 'staff_demo_session',          // prototype placeholder
  actorRole: 'staff',
  actorDisplayName: 'Staff (Demo)',        // prototype placeholder
  documentId: docId,
  applicationId: id,
  studentToken: studentToken,
  sourceRoute: `/staff/applications/${id}`,
  reason: message,                        // from onRequestReplacement callback
  createdAt: new Date().toISOString(),
  metadata: {
    documentId: docId,
    applicationId: id,
    studentToken: studentToken,
    nextStatus: 'needs_replacement',
  },
})
sharedWriter.write(event)
```

---

## Shared Writer Instance

The mock writer is in-memory and per-module-load. AP-6D should export a shared singleton
instance from `src/lib/audit/index.ts` or a new `src/lib/audit/sharedMockWriter.ts`:

```typescript
// src/lib/audit/sharedMockWriter.ts (new file — AP-6D runtime only)
import { createMockAuditWriter } from './mockAuditWriter'

export const sharedMockWriter = createMockAuditWriter()
```

The `adminAuditDisplayAdapter.ts` should then be updated to merge `sharedMockWriter.list()`
events with `DEMO_WRITER_EVENTS` (or replace `DEMO_WRITER_EVENTS` with the live list).

Because Next.js with `'use client'` components runs per-render and module state is reset on
full page reload, the writer acts as a session-scoped in-memory store only. Events written
in one browser session persist until reload. This is appropriate for `mock_only` prototype
behavior.

---

## Proposed Metadata

Allowed metadata per `AUDIT_METADATA_PRIVACY_RULES.md`:

| Field | Type | Notes |
|-------|------|-------|
| `documentId` | string | Internal document ID |
| `applicationId` | string | Internal application ID |
| `studentToken` | string | `Student #S-XXXX` — never raw student ID |
| `nextStatus` | string | `'rejected'` or `'needs_replacement'` |

Forbidden metadata (must never be included):

| Field | Reason |
|-------|--------|
| Raw `student_id` (e.g. `650912345`) | Must use `studentToken` instead |
| Raw student name, email, phone | PII — not allowed in audit metadata |
| File contents or file path | Document storage not implemented |
| Full form payload | Arbitrary dumping forbidden |
| Unredacted `reason` beyond what builder accepts | Builder trims and validates |

---

## Privacy Boundaries

| Boundary | Rule |
|----------|------|
| Student identity | Always use `studentToken` (e.g. `Student #S-2345`), never raw `student_id` |
| Document content | Never in metadata — document IDs only |
| Reason text | Stored as-is (trimmed); displayed in Admin drawer; not shown in student-facing surfaces |
| Admin audit display | Shows `targetDisplayToken` (`Student #S-XXXX`) — no raw student ID |
| Provider access | Provider must never see Staff audit event metadata or raw student identity |
| ESQ access | ESQ views remain aggregate; AP-6D events not visible to ESQ by default |

---

## UI Behavior That Must Remain Unchanged

The following behaviors must not change in AP-6D runtime:

| Behavior | Requirement |
|----------|-------------|
| `onReject(docId, reason)` signature | Must remain identical |
| `onRequestReplacement(docId, message)` signature | Must remain identical |
| `onVerify(docId)` signature | Must remain identical |
| Toast shown on rejection | Must still show |
| Toast shown on replacement request | Must still show |
| `rejectingDocId` state flow | Must remain unchanged |
| `rejectReason` textarea behavior | Must remain unchanged |
| `replacementMsg` textarea behavior | Must remain unchanged |
| `AuditWarningCard` copy in rejection zone | Must remain Stage 0 prototype-safe copy |
| `AuditWarningCard` copy in replacement zone | Must remain Stage 0 prototype-safe copy |
| `requiresReason` prop on `AuditWarningCard` | Must NOT be added for document actions |
| Document status labels | Must remain unchanged |
| Student-facing wording | Must remain unchanged |
| `DocumentVerificationPanel` component interface | `documents`, `onVerify`, `onReject`, `onRequestReplacement` — no new props |
| `StaffDocumentEvidenceWorkbench` | Must remain unchanged |
| `DocumentActionRail` | Must remain unchanged |
| `src/data/mock/audit-logs.ts` | Must not be mutated |
| `src/data/mock/staffData.ts` | Must not be mutated |
| Routes, auth, role guards | Must remain unchanged |

---

## Risk Analysis

### High risks

| Risk | Mitigation |
|------|-----------|
| Writer singleton reset on page reload | Accepted for `mock_only` — expected prototype behavior; clearly labeled in Admin display |
| `buildStaffDocumentRejectEvent` throws `AuditEventValidationError` | Wrap write call in try/catch; swallow error and still fire toast — writer failure must not break UI |
| Duplicate event IDs if same action fires twice quickly | Builder auto-generates stable ID from eventType + targetId + createdAt; two separate clicks will have different timestamps |
| `studentToken` not available at callback site if app not found | Guard: `if (!app) return` already exists in page; student token is derived from app — cannot be null if app exists |
| Mock audit copy implies real persistence | Audit copy must stay Stage 1; Admin display must continue to say "Demo (generated)"; AuditWarningCard must not change to real-persistence copy |

### Medium risks

| Risk | Mitigation |
|------|-----------|
| `adminAuditDisplayAdapter.ts` reads static events only | Adapter must be updated to merge live writer events; update must be reviewed carefully to avoid changing fixture display |
| React module-level singleton not available in SSR | Page is `'use client'`; adapter also runs client-side; singleton is safe |
| Reason text longer than expected — displayed in Admin drawer | Reason is already captured from textarea; no length cap needed at AP-6D; Admin display truncates long text cleanly |
| `actorId` and `actorDisplayName` are prototype placeholders | This is expected; real session-based actor identity is a future backend concern |

### Low risks

| Risk | Mitigation |
|------|-----------|
| Admin sees Staff events interleaved with fixture and static demo events | Correct behavior; sorted by `createdAt` descending; source badge distinguishes entries |
| Check script does not cover live writer path | New checks can be added for the module export; existing 37 checks must still pass |

---

## Safe Implementation Sequence

### Phase 1 — Shared writer module (new file only)

Create `src/lib/audit/sharedMockWriter.ts`:
- Exports `sharedMockWriter = createMockAuditWriter()`
- No other file modified in this step

### Phase 2 — Update adapter to read live events

Modify `src/lib/audit/adminAuditDisplayAdapter.ts`:
- Import `sharedMockWriter` from `sharedMockWriter.ts`
- In `getAdminAuditDisplayRows`, merge `sharedMockWriter.list()` with `DEMO_WRITER_EVENTS`
  and convert to rows via `writerEventToRow`
- Confirm build passes and existing Admin display unchanged

### Phase 3 — Wire reject callback

Modify `src/app/staff/applications/[id]/page.tsx`:
- Import `buildStaffDocumentRejectEvent` and `sharedMockWriter`
- In `onReject` handler: call builder, write event, catch errors
- Confirm toast still fires
- Confirm Admin audit log shows new event

### Phase 4 — Wire replacement request callback

Modify `src/app/staff/applications/[id]/page.tsx`:
- In `onRequestReplacement` handler: call builder, write event, catch errors
- Confirm toast still fires
- Confirm Admin audit log shows new event

### Phase 5 — Validate and QA

- Run `npm run build` — must pass 40/40
- Run `npm run check:tokens` — must pass 4/4
- Run `npm run check:audit-events` — must pass 37/37 (add new checks if needed)
- Verify `/staff/applications/app_002`, `/admin/audit-log`, `/admin/dashboard`
- Confirm Admin audit log reflects Staff rejection and replacement events
- Confirm no real persistence copy present

---

## Rollback Plan

| Rollback trigger | Action |
|-----------------|--------|
| Build fails after adapter change | Revert `adminAuditDisplayAdapter.ts` to static DEMO_WRITER_EVENTS only |
| Build fails after callback wiring | Revert callback wiring in `page.tsx`; remove sharedMockWriter import |
| Writer throws and breaks UI | Wrap all `sharedMockWriter.write()` calls in try/catch; swallow silently |
| Admin display shows wrong events | Check adapter merge logic; confirm `DEMO_WRITER_EVENTS` still included |
| AuditEventValidationError thrown | Debug builder input; check `studentToken` and `documentId` are non-empty |

Full rollback: `git checkout main` on runtime branch. No changes to `src/data/mock/` so fixture data is always safe.

---

## What Must Not Change

| Item | Reason |
|------|--------|
| `src/data/mock/audit-logs.ts` | Must never be mutated |
| `src/lib/audit/auditEventBuilder.ts` | Core contract — must stay unchanged in AP-6D |
| `src/lib/audit/auditTypes.ts` | Core types — must stay unchanged in AP-6D |
| `src/lib/audit/mockAuditWriter.ts` | Writer implementation — must stay unchanged |
| `DocumentVerificationPanel.tsx` component interface | No new props; callbacks unchanged |
| `StaffDocumentEvidenceWorkbench.tsx` | Not in scope |
| `DocumentActionRail.tsx` | Not in scope |
| `AuditWarningCard` copy or props | Stage 0 prototype-safe copy must be preserved |
| Reason validation / min-length | Must not change — deferred to SW-3B/SD-3 |
| ReasonRequiredModal | Must not be introduced |
| Routes, auth, role guards | Must not change |
| Backend/API behavior | Not in scope |
| Provider/Student/ESQ components | Not in scope |
| Real audit persistence | Must not be added |

---

## Recommended Next Phase After AP-6D

After AP-6D runtime is reviewed and approved:

- SW-3B — Add 20-character minimum reason length for rejection and replacement.
- OR: AP-6E — Wire `onVerify` callback to a `staff.document.verify` event (low-risk, no reason required).
- Do not start either without explicit approval.
