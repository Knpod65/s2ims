# Staff Document Mock Writer Runtime Sequence — AP-6D

Date: 2026-05-13
Branch: `architecture/staff-document-mock-audit-wiring-plan`
Status: Planning only — no runtime code changed.

---

## Purpose

This document defines the step-by-step implementation sequence for AP-6D runtime: wiring
Staff document rejection and replacement request callbacks to the mock audit writer.

No implementation occurs in this planning branch.

---

## Recommended Runtime Branch Name

```
architecture/staff-document-mock-audit-wiring-runtime
```

Branch from: `main` (after this planning branch is merged).

---

## Pre-Implementation Checks

Before starting the runtime branch:

1. `npm run build` passes on `main` (40/40, 0 type errors).
2. `npm run check:tokens` passes (4/4).
3. `npm run check:audit-events` passes (37/37).
4. `git diff --name-only origin/main` shows clean working tree.
5. Planning documents are merged and available.

---

## File-by-File Implementation Order

### Step 1 — Create shared writer singleton

**File:** `src/lib/audit/sharedMockWriter.ts` (new file)

```typescript
import { createMockAuditWriter } from './mockAuditWriter'

// Module-level singleton — in-memory, session-scoped.
// Accepts mock_only events. Resets on full page reload.
export const sharedMockWriter = createMockAuditWriter()
```

Changes: new file only. No existing files modified.

Validation after Step 1:

- `npm run build` — must pass 40/40
- New file compiles cleanly — confirm no TypeScript errors

---

### Step 2 — Export shared writer from audit index

**File:** `src/lib/audit/index.ts` (modified)

Add export:

```typescript
export { sharedMockWriter } from './sharedMockWriter'
```

Keep all existing exports unchanged.

Validation after Step 2:

- `npm run build` — must pass 40/40
- No new type errors

---

### Step 3 — Update adapter to merge live writer events

**File:** `src/lib/audit/adminAuditDisplayAdapter.ts` (modified)

Import `sharedMockWriter`:

```typescript
import { sharedMockWriter } from './sharedMockWriter'
```

In `getAdminAuditDisplayRows`, add live writer events to combined list:

```typescript
export function getAdminAuditDisplayRows(fixtureLogs: AuditLog[]): AdminAuditDisplayRow[] {
  const fixtureRows = fixtureLogs.map(fixtureToRow)
  const demoRows = DEMO_WRITER_EVENTS.map(writerEventToRow)
  const liveRows = sharedMockWriter.list().map(writerEventToRow)  // new
  const combined = [...fixtureRows, ...demoRows, ...liveRows]     // updated
  combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return combined
}
```

Validation after Step 3:

- `npm run build` — must pass 40/40
- `/admin/audit-log` — still shows 9 rows (no live events yet — writer is empty)
- `npm run check:audit-events` — must still pass 37/37
- Dev log: no hydration errors

---

### Step 4 — Wire reject callback in Staff application page

**File:** `src/app/staff/applications/[id]/page.tsx` (modified)

Add imports:

```typescript
import { buildStaffDocumentRejectEvent } from '@/lib/audit/auditEventBuilder'
import { sharedMockWriter } from '@/lib/audit/sharedMockWriter'
```

Update `onReject` handler:

```typescript
onReject={(docId, reason) => {
  try {
    const event = buildStaffDocumentRejectEvent({
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
    sharedMockWriter.write(event)
  } catch (err) {
    console.warn('[AP-6D] Mock audit write failed (reject)', err)
  }
  addToast(
    lang === 'th'
      ? `เอกสารปฏิเสธแล้ว: ${reason}`
      : `Document rejected: ${reason}`,
    'info'
  )
}}
```

Validation after Step 4:

- `npm run build` — must pass 40/40
- `/staff/applications/app_002` — reject flow works; toast fires
- `/admin/audit-log` — after rejecting a document, navigate to admin page; new row appears

---

### Step 5 — Wire replacement request callback in Staff application page

**File:** `src/app/staff/applications/[id]/page.tsx` (modified, same file as Step 4)

Add import (if not already added in Step 4):

```typescript
import { buildStaffDocumentReplacementRequestEvent } from '@/lib/audit/auditEventBuilder'
```

Update `onRequestReplacement` handler:

```typescript
onRequestReplacement={(docId, message) => {
  try {
    const event = buildStaffDocumentReplacementRequestEvent({
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
    sharedMockWriter.write(event)
  } catch (err) {
    console.warn('[AP-6D] Mock audit write failed (replacement)', err)
  }
  addToast(
    lang === 'th'
      ? `ขอส่งแทน: ${message}`
      : `Replacement requested: ${message}`,
    'info'
  )
}}
```

Validation after Step 5:

- `npm run build` — must pass 40/40
- `/staff/applications/app_002` — replacement request flow works; toast fires
- `/admin/audit-log` — replacement event appears in audit log

---

### Step 6 — Update check script (optional but recommended)

**File:** `scripts/check-audit-events.mjs` (modified)

Add checks to verify shared writer module loads correctly and exports `sharedMockWriter`:

```javascript
// Verify shared writer exports
const sharedWriterModule = loadTsModule('./src/lib/audit/sharedMockWriter.ts')
assert(typeof sharedWriterModule.sharedMockWriter === 'object', 'sharedMockWriter is exported')
assert(typeof sharedWriterModule.sharedMockWriter.write === 'function', 'sharedMockWriter.write is a function')
assert(typeof sharedWriterModule.sharedMockWriter.list === 'function', 'sharedMockWriter.list is a function')
assert(sharedWriterModule.sharedMockWriter.count() === 0, 'sharedMockWriter starts empty')
```

Expected after Step 6: `npm run check:audit-events` — passes 40/40 (or more if additional checks added).

---

### Step 7 — Full validation

Run all three checks:

```bash
source ~/.nvm/nvm.sh
npm run build
npm run check:tokens
npm run check:audit-events
```

Expected:
- `npm run build`: PASS — 40/40 routes, 0 type errors
- `npm run check:tokens`: PASS — 4/4
- `npm run check:audit-events`: PASS — 37/37 (or more if new checks added)

---

## QA Routes

Routes to verify during AP-6D runtime development:

| Route | Test |
|-------|------|
| `/staff/applications/app_002` | Reject document `d7` (Guardian Income Proof, `needs_replacement`) — confirm toast fires and no console error |
| `/staff/applications/app_002` | Request replacement on same doc — confirm toast fires |
| `/admin/audit-log` | Navigate after Staff action — confirm new writer row appears |
| `/admin/audit-log` | Click "View details" on new event — confirm drawer shows correct reason and metadata |
| `/admin/dashboard` | Confirm unaffected |
| `/login` | Confirm unaffected |

Note: `/staff/applications/app_001` has all documents already `verified` — no reject or
replacement actions are available. Use `app_002` for QA.

---

## Local Route Verification Sequence

```bash
# Kill stale servers
lsof -ti tcp:3000 | xargs kill -9 2>/dev/null || true
lsof -ti tcp:3001 | xargs kill -9 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
rm -rf .next

# Clean rebuild
source ~/.nvm/nvm.sh && npm run build

# Start dev server
source ~/.nvm/nvm.sh && npm run dev > /tmp/s2ims-dev-ap6d-runtime.log 2>&1 &

# Wait for startup
sleep 7
cat /tmp/s2ims-dev-ap6d-runtime.log

# Verify routes (port 3000 or 3001 based on log)
curl -sI http://localhost:3000/login | head -2
curl -sI http://localhost:3000/staff/applications/app_002 | head -2
curl -sI http://localhost:3000/admin/audit-log | head -2
curl -sI http://localhost:3000/admin/dashboard | head -2
```

Expected: all 200 OK.

---

## Dev Log Checks

```bash
grep -iE "(error|warn|hydrat|key|unsupported|chunk|500|404)" /tmp/s2ims-dev-ap6d-runtime.log | head -50
```

Expected: no output. If any output present — investigate before proceeding.

---

## Expected Admin Audit Display Changes After AP-6D

Before AP-6D runtime (current state):
- 9 rows: 6 fixture + 3 static demo writer events
- No Staff interaction produces new rows

After AP-6D runtime (expected):
- Initial page load: 9 rows (unchanged)
- After Staff rejects a document: new row appears with `staff.document.reject`
- After Staff requests replacement: new row appears with `staff.document.request_replacement`
- New rows show source badge "Demo (generated)" (indigo)
- New rows appear at the top (most recent by `createdAt` desc)
- Drawer for new rows shows: reason text, `Student #S-XXXX` token, document ID, application ID, severity: medium, `nextStatus` metadata field
- No real persistence language in Admin display

---

## Exact Non-Goals

| Non-goal | Status |
|----------|--------|
| Real audit persistence | Not implemented |
| `onVerify` callback wiring | Deferred |
| Reason min-length enforcement | Not changed — deferred to SW-3B |
| ReasonRequiredModal | Not introduced |
| AuditWarningCard copy change to Stage 2 | Not changed — Stage 0 copy preserved |
| Provider/Student/ESQ actions wired | Not in scope |
| Staff identity reveal wiring | Not in scope |
| `src/data/mock/audit-logs.ts` mutated | Never |
| `src/data/mock/staffData.ts` mutated | Never |
| Backend/API behavior changed | Not in scope |
| Routes, auth, role guards changed | Not in scope |
| DocumentVerificationPanel interface changed | Not in scope — no new props |

---

## Merge Checklist

Before merging AP-6D runtime branch into `main`:

### Diff scope check

```bash
git diff --name-only origin/main...HEAD
```

Allowed files:
- `src/lib/audit/sharedMockWriter.ts` (new)
- `src/lib/audit/index.ts` (updated export)
- `src/lib/audit/adminAuditDisplayAdapter.ts` (live events merge)
- `src/app/staff/applications/[id]/page.tsx` (callback wiring)
- `scripts/check-audit-events.mjs` (optional new checks)
- `docs/architecture/STAFF_DOCUMENT_MOCK_AUDIT_WIRING_RUNTIME_SUMMARY_AP6D.md` (new summary)
- `docs/architecture/NEXT_RENOVATION_STEPS.md` (updated)
- `docs/daily-reports/YYYY-MM-DD-staff-document-mock-audit-wiring-ap6d.md` (new checkpoint)

Forbidden files — if present, stop and investigate:
- `src/data/mock/audit-logs.ts`
- `src/data/mock/staffData.ts`
- `src/lib/audit/auditEventBuilder.ts`
- `src/lib/audit/auditTypes.ts`
- `src/lib/audit/mockAuditWriter.ts`
- Staff/Provider/Student/ESQ components (other than `page.tsx` change above)
- `package.json`

### Build and check results

- `npm run build` — 40/40, 0 type errors: ✓ / ✗
- `npm run check:tokens` — 4/4: ✓ / ✗
- `npm run check:audit-events` — 37/37 or more: ✓ / ✗

### Route verification results

- `/login` — 200 OK: ✓ / ✗
- `/staff/applications/app_002` — 200 OK: ✓ / ✗
- `/admin/audit-log` — 200 OK: ✓ / ✗
- `/admin/dashboard` — 200 OK: ✓ / ✗

### Dev log: no errors, warnings, hydration issues: ✓ / ✗

### Safety confirmations

- Staff callback wiring does not break existing toast behavior: ✓ / ✗
- Admin audit log shows new Staff events as "Demo (generated)": ✓ / ✗
- No real persistence copy present anywhere: ✓ / ✗
- `AuditWarningCard` copy unchanged — still Stage 0: ✓ / ✗
- `src/data/mock/audit-logs.ts` not mutated: ✓ / ✗
- No `ReasonRequiredModal` introduced: ✓ / ✗
- No reason min-length changed: ✓ / ✗
- AP-6D is mock_only only — no real persistence: ✓ / ✗
