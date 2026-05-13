# Staff Document Mock Audit Wiring — AP-6D Runtime Summary

Date: 2026-05-13
Branch: `architecture/staff-document-mock-audit-wiring-runtime`
Status: Complete — runtime implemented and validated.

---

## Purpose

Wire Staff document rejection and replacement request callbacks to the AP-4 mock audit writer,
allowing each Staff action to produce a `mock_only` audit event visible in the Admin audit log
built by AP-6A/AP-6B/AP-6C and polished by the Admin Audit UX Polish pass.

---

## Files Modified

| File | Change |
|------|--------|
| `src/lib/audit/sharedMockWriter.ts` | New — shared singleton + 3 helper exports |
| `src/lib/audit/index.ts` | Added named exports for shared writer helpers |
| `src/lib/audit/adminAuditDisplayAdapter.ts` | Merges `sharedMockAuditWriter.list()` into display rows |
| `src/app/staff/applications/[id]/page.tsx` | `onReject` and `onRequestReplacement` wired to shared writer |
| `scripts/check-audit-events.mjs` | 5 new AP-6D checks — total 42/42 |

---

## Implementation Details

### Phase 1 — Shared writer singleton (`src/lib/audit/sharedMockWriter.ts`)

New module-level singleton:

```typescript
export const sharedMockAuditWriter = createMockAuditWriter()
export function writeSharedMockAuditEvent(event: AuditEvent): void { ... }
export function listSharedMockAuditEvents(): AuditEvent[] { ... }
export function clearSharedMockAuditEvents(): void { ... }
```

The singleton is session-scoped. Events persist until page reload — expected for `mock_only` prototype behavior.

### Phase 2 — Adapter updated (`src/lib/audit/adminAuditDisplayAdapter.ts`)

`getAdminAuditDisplayRows` now merges three sources:

```typescript
const fixtureRows = fixtureLogs.map(fixtureToRow)
const demoRows = DEMO_WRITER_EVENTS.map(writerEventToRow)
const liveRows = sharedMockAuditWriter.list().map(writerEventToRow)
const combined = [...fixtureRows, ...demoRows, ...liveRows]
```

Static `DEMO_WRITER_EVENTS` are preserved. Live Staff-triggered events appear as additional writer rows,
sorted by `createdAt` descending alongside fixture and demo rows.

### Phase 3 — Staff reject callback wired (`page.tsx`)

`onReject(docId, reason)` now calls `buildStaffDocumentRejectEvent` and writes to `sharedMockAuditWriter`:

- `actorId`: `'staff_demo_session'` (prototype placeholder)
- `actorDisplayName`: `'Staff (Demo)'` (prototype placeholder)
- `actorRole`: `'staff'`
- `documentId`: from callback arg
- `applicationId`: from route param `id`
- `studentToken`: from `formatStudentToken(app.student_id)`
- `sourceRoute`: `/staff/applications/${id}`
- `reason`: from callback arg (non-empty, trimmed by builder)
- `metadata`: `{ documentId, applicationId, studentToken, previousStatus, nextStatus: 'rejected' }`

Writer failure is wrapped in `try/catch` with `console.warn` — the toast fires regardless.

### Phase 4 — Staff replacement request callback wired (`page.tsx`)

`onRequestReplacement(docId, message)` follows the same pattern:

- `reason`: from `message` callback arg
- `metadata.nextStatus`: `'needs_replacement'`
- Builder: `buildStaffDocumentReplacementRequestEvent`

Writer failure is wrapped in `try/catch` — the toast fires regardless.

### Phase 5 — Check script updated (`scripts/check-audit-events.mjs`)

5 new checks added:

| Check | What it verifies |
|-------|-----------------|
| shared writer starts empty | `clearSharedMockAuditEvents()` resets to 0 |
| shared writer accepts reject event | `buildStaffDocumentRejectEvent` → `sharedMockAuditWriter.write()` succeeds |
| shared writer accepts replacement request event | `buildStaffDocumentReplacementRequestEvent` → `sharedMockAuditWriter.write()` succeeds |
| shared writer events appear in admin display adapter rows | `getAdminAuditDisplayRows([])` includes written events with `source: 'writer'` |
| shared writer clear helper resets count | `clearSharedMockAuditEvents()` brings count back to 0 |

Total checks: 42/42.

---

## Privacy Boundaries Confirmed

| Boundary | Status |
|----------|--------|
| `studentToken` used in metadata — never raw `student_id` | ✓ Confirmed |
| Raw student name/email/phone not in metadata | ✓ Confirmed |
| `actorId` and `actorDisplayName` are prototype placeholders | ✓ Confirmed |
| `FORBIDDEN_AUDIT_METADATA_KEYS` not violated | ✓ Confirmed via builder validation |
| `AuditWarningCard` copy unchanged (Stage 0 prototype-safe) | ✓ Confirmed |
| Admin display shows `targetDisplayToken` (`Student #S-XXXX`) | ✓ Confirmed via existing adapter |

---

## UI Behavior Preserved

| Behavior | Status |
|----------|--------|
| `onReject(docId, reason)` signature | ✓ Unchanged |
| `onRequestReplacement(docId, message)` signature | ✓ Unchanged |
| `onVerify(docId)` signature | ✓ Unchanged — not wired in AP-6D |
| Toast shown on rejection | ✓ Still fires (try/catch wraps write only) |
| Toast shown on replacement request | ✓ Still fires |
| `rejectingDocId` state flow | ✓ Unchanged |
| `rejectReason` textarea behavior | ✓ Unchanged |
| `replacementMsg` textarea behavior | ✓ Unchanged |
| `AuditWarningCard` in rejection zone | ✓ Stage 0 copy preserved |
| `AuditWarningCard` in replacement zone | ✓ Stage 0 copy preserved |
| `DocumentVerificationPanel` interface | ✓ No new props added |
| `StaffDocumentEvidenceWorkbench` | ✓ Not modified |
| `DocumentActionRail` | ✓ Not modified |
| `src/data/mock/audit-logs.ts` | ✓ Not mutated |
| Routes, auth, role guards | ✓ Not changed |

---

## Validation

| Check | Result |
|-------|--------|
| `npm run build` | PASS — 40/40 static routes, 0 type errors |
| `npm run check:tokens` | PASS — 4/4 |
| `npm run check:audit-events` | PASS — 42/42 |
| `/login` | 200 OK |
| `/staff/applications/app_001` | 200 OK |
| `/staff/applications/app_002` | 200 OK |
| `/admin/audit-log` | 200 OK |
| `/admin/dashboard` | 200 OK |
| Dev log | No errors, no warnings, no hydration issues |

---

## Safety Confirmations

| Item | Status |
|------|--------|
| `src/data/mock/audit-logs.ts` mutated | No |
| Real audit persistence added | No |
| Reason validation changed | No |
| ReasonRequiredModal introduced | No |
| `onVerify` wired | No — deferred to AP-6E or later |
| Staff identity revealed | No |
| Backend/API behavior added | No |
| Provider/Student/ESQ components changed | No |
| Admin audit display routes changed | No |
| `AuditWarningCard` copy or props changed | No |
| `DocumentVerificationPanel` interface changed | No |
| `DEMO_WRITER_EVENTS` removed or changed | No — preserved; live rows are additive |

---

## Diff Scope

Files changed from `main`:

1. `src/lib/audit/sharedMockWriter.ts` — new file
2. `src/lib/audit/index.ts` — 1 line added
3. `src/lib/audit/adminAuditDisplayAdapter.ts` — import + adapter logic updated
4. `src/app/staff/applications/[id]/page.tsx` — 2 imports + 2 callback blocks added
5. `scripts/check-audit-events.mjs` — 2 module loads + 5 new checks + 2 destructure lines
6. `docs/architecture/STAFF_DOCUMENT_MOCK_AUDIT_WIRING_AP6D_RUNTIME_SUMMARY.md` — this file
7. `docs/architecture/NEXT_RENOVATION_STEPS.md` — AP-6D runtime result section added

---

## Recommended Next Phase After AP-6D Runtime

- SW-3B — Add 20-character minimum reason length for rejection and replacement request.
- AP-6E — Wire `onVerify` callback to a `staff.document.verify` event (low-risk, no reason required).
- Do not start either without explicit approval.
- Do not add real audit persistence.
- Do not introduce `ReasonRequiredModal` until SW-3B/SD-3 is approved.
