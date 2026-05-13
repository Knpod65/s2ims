# AP-6D QA Checkpoint — Staff Document Mock Audit Wiring

**Date:** 2026-05-13
**Branch reviewed:** `main`
**Commits reviewed:** `5da04fa` (merge), `89a3224` (checkpoint)
**Environment:** headless dev server — no browser screenshots captured
**QA method:** code review + HTTP route verification + dev server log analysis

---

## Routes Reviewed

| Route | Status | Modules compiled |
|-------|--------|-----------------|
| `/login` | 200 OK | 549 |
| `/staff/applications/app_001` | 200 OK | 679 |
| `/staff/applications/app_002` | 200 OK | 679 (cached) |
| `/admin/audit-log` | 200 OK | 687 |
| `/admin/dashboard` | 200 OK | 695 |

All routes returned 200 OK. Dev log: no errors, no warnings, no hydration issues, no duplicate key warnings, no chunk errors, no unexpected 404/500.

---

## Checks Run

| Check | Result |
|-------|--------|
| `npm run build` | PASS — 40/40 static routes, 0 type errors |
| `npm run check:tokens` | PASS — 4/4 |
| `npm run check:audit-events` | PASS — 42/42 |

---

## Staff Page QA — `/staff/applications/app_002`

### Document inventory for app_002

| Doc ID | Label | Status | Actions available |
|--------|-------|--------|------------------|
| `d5` | Application Form | `verified` | None (all actions hidden for verified docs) |
| `d6` | Household Registration | `rejected` | None (reject + replacement both hidden for already-rejected docs) |
| `d7` | Guardian Income Proof | `needs_replacement` | Reject + Replacement request visible; Verify hidden |

### Reject flow (document `d7`) — code verified

1. **Reject button visible:** `onReject && doc.status !== 'rejected'` — `d7` has `needs_replacement` status, so button is shown. ✓
2. **Reject form opens on click:** `setRejectingDocId(doc.id)` opens the inline form with `AuditWarningCard` + textarea. ✓
3. **AuditWarningCard copy (Stage 0):** "This prototype captures the staff reason in the UI flow, but real audit-log persistence is not connected yet. Keep the reason clear, factual, and appropriate for future audit review." — Stage 0 prototype-safe copy preserved. ✓
4. **Send Rejection disabled until reason typed:** `disabled={!rejectReason[doc.id]?.trim()}` — button cannot be clicked with empty/whitespace reason. ✓
5. **Send Rejection fires callback:** `onReject(doc.id, rejectReason[doc.id])` → in `page.tsx` callback:
   - Calls `buildStaffDocumentRejectEvent(...)` with `actorId: 'staff_demo_session'`, `actorDisplayName: 'Staff (Demo)'`, `studentToken`, `metadata: { documentId, applicationId, studentToken, previousStatus, nextStatus: 'rejected' }`.
   - Calls `sharedMockAuditWriter.write(event)` inside `try/catch`.
   - On error: `console.warn('[AP-6D] Mock audit write failed (reject)', err)` — UI never blocked.
   - Toast fires regardless: "Document rejected: [reason]". ✓
6. **Document status in panel:** Panel state does not mutate — `d7` still shows `needs_replacement` after action (no state update in mock). This is expected prototype behavior. ✓
7. **No reason min-length enforcement added:** Only `trim()` check — deferred to SW-3B/SD-3. ✓
8. **onVerify remains unwired:** `onVerify` fires only toast — no builder call, no writer write. ✓

### Replacement request flow (document `d7`) — code verified

1. **Replacement request area visible:** `onRequestReplacement && doc.status !== 'rejected'` — `d7` has `needs_replacement` status, so area is shown. ✓
2. **AuditWarningCard copy (Stage 0):** "This prototype captures the staff message in the UI flow, but real audit-log persistence is not connected yet. Keep the request specific, factual, and student-actionable." — Stage 0 copy preserved. ✓
3. **Send Request disabled until message typed:** `disabled={!replacementMsg[doc.id]?.trim()}`. ✓
4. **Send Request fires callback:** `onRequestReplacement(doc.id, replacementMsg[doc.id])` → in `page.tsx` callback:
   - Calls `buildStaffDocumentReplacementRequestEvent(...)` with same actor/privacy boundary pattern.
   - Calls `sharedMockAuditWriter.write(event)` inside `try/catch`.
   - Toast fires regardless: "Replacement requested: [message]". ✓
5. **Privacy boundary confirmed:** `studentToken` (`Student #S-XXXX`) used in metadata — raw `student_id` never included. ✓

### Verify flow — code verified

- Verify button is only shown when `doc.status !== 'rejected' && doc.status !== 'needs_replacement'`.
- For app_002: `d5` is `verified` (all actions hidden), `d6` is `rejected` (actions hidden), `d7` is `needs_replacement` (verify hidden).
- `onVerify` callback: fires toast only — no builder call, no writer write. Correctly remains unwired. ✓

---

## Admin Audit Log QA — `/admin/audit-log`

### Banner copy — code verified

**English:** "Admin audit review is currently showing [N] mock/demo records only. These records help validate the audit experience and are not official persisted audit evidence."

**Thai:** "การตรวจสอบ Audit ของ Admin แสดงบันทึกเดโม [N] รายการเท่านั้น บันทึกเหล่านี้ช่วยตรวจสอบประสบการณ์ Audit และไม่ใช่หลักฐานการตรวจสอบอย่างเป็นทางการ"

Banner copy is simplified admin-facing copy (M1 from UX polish). No developer-facing fixture/writer counts. ✓

### Row sources — code verified

`getAdminAuditDisplayRows` merges three sources:

| Source | Count (initial session) | Notes |
|--------|------------------------|-------|
| Fixture rows | 6 | From `src/data/mock/audit-logs.ts` — never mutated |
| Static demo writer events | 3 | `DEMO_WRITER_EVENTS` in adapter — built at module load |
| Live shared writer events | 0 initially; +1 per Staff action | `sharedMockAuditWriter.list()` — resets on page reload |

Initial page load total: 9 rows. After Staff rejection or replacement request in same session: 10+ rows. ✓

### Source badges — code verified

| Source | English badge | Thai badge | Color |
|--------|--------------|-----------|-------|
| Writer events | "Demo (generated)" | "เดโม (สร้างขึ้น)" | Indigo |
| Fixture events | "Demo (fixture)" | "เดโม (ฟิกซ์เจอร์)" | Slate |

Badge colors are visually distinct from ESQ role color (`text-violet-700`). ✓

### Persistence filter — code verified

| Filter option | Expected result |
|---------------|----------------|
| All | Shows all mock/demo rows |
| Mock/demo only | Shows all mock/demo rows |
| Official persisted records | **Empty state** — intentional; no real events exist |

Official persisted empty state correctly preserved. ✓

### Detail drawer — code verified

Drawer available for each row via "View details" / "รายละเอียด" button. Drawer shows:

- Event Identity (ID, timestamp, action, policy version if present)
- Actor (role badge, display name, actor ID)
- Target / Entity (entity type, entity ID, privacy note)
- Action / Reason (action string, reason or "Reason not provided")
- Persistence / Evidence (`mock_only` badge + mock-safe copy)
- Metadata (filtered through `FORBIDDEN_AUDIT_METADATA_KEYS`)
- Session Context (IP for fixture events, labeled mock)

Source badge in drawer header: "Demo (generated)" (indigo) or "Demo (fixture)" (slate). ✓
Bottom evidence note: removed in UX polish pass. ✓
Policy version: hidden for fixture events when not present. ✓

### Session scope limitation

The shared mock writer is module-scoped and session-scoped. Events written by Staff actions are visible in the Admin audit log only within the same browser session (same client-side module instance). On page reload, the writer resets and returns to 9 rows. This is expected and documented `mock_only` prototype behavior.

---

## Dev Log Findings

| Issue category | Matches found |
|---------------|---------------|
| Runtime crash | 0 |
| Hydration errors | 0 |
| Duplicate key warnings | 0 |
| Chunk errors | 0 |
| Unexpected 404/500 | 0 |

Dev log: **clean**.

---

## Safety Confirmations

| Item | Status |
|------|--------|
| `src/data/mock/audit-logs.ts` mutated | No |
| Real audit persistence added | No |
| Reason validation changed | No |
| ReasonRequiredModal introduced | No |
| Staff verify action wired | No |
| Staff identity reveal changed | No |
| Backend/API behavior changed | No |
| Provider/Student/ESQ flows changed | No |
| Routes/auth/role guards changed | No |
| AuditWarningCard copy changed to Stage 2 | No — Stage 0 preserved |
| DocumentVerificationPanel interface changed | No |

---

## Known Limitations

| Limitation | Description | Resolution |
|-----------|-------------|-----------|
| Session-scoped writer | Shared mock writer resets on page reload — Staff and Admin must act within the same browser session to see live events together | Expected for `mock_only` prototype; real persistence is AP-7 |
| Stage 0 AuditWarningCard copy | Copy still says "real audit-log persistence is not connected yet" — technically inaccurate now that mock persistence is wired | Copy update deferred until AP-7 (real persistence) is approved and a Stage 2 copy decision is made |
| No visual document status update | Staff reject/replacement callbacks do not update the document status in the panel — mock data is static | Expected prototype behavior; status mutation requires state management or API layer |
| Actor identity is placeholder | `actorId: 'staff_demo_session'`, `actorDisplayName: 'Staff (Demo)'` — not real session identity | Deferred to future backend auth integration |
| No reason min-length enforcement | Minimum non-empty only; 20-char min deferred to SW-3B/SD-3 | Explicitly deferred per AP-6D plan |
| Headless QA only | Screenshots not captured — no browser available in this environment | Manual browser QA recommended before AP-7 planning |

---

## Screenshots

Screenshots not captured — headless environment only.

Recommended screenshots for future human browser QA:

- `desktop/staff-app-002-initial.png` — app_002 page with d7 needs_replacement doc visible
- `desktop/staff-reject-form-open.png` — reject inline form open with AuditWarningCard
- `desktop/staff-reject-toast.png` — toast after rejection
- `desktop/staff-replacement-form.png` — replacement request area with AuditWarningCard
- `desktop/staff-replacement-toast.png` — toast after replacement request
- `desktop/admin-audit-log-9rows.png` — admin audit log before Staff action (9 rows)
- `desktop/admin-audit-log-live-event.png` — admin audit log after Staff action (10+ rows)
- `desktop/admin-drawer-reject-event.png` — drawer for live rejection event
- `desktop/admin-official-empty.png` — official persisted filter empty state
- `states/d7-needs-replacement.png` — d7 document card state

---

## QA Verdict

| Area | Result |
|------|--------|
| Staff reject flow wired | ✓ Confirmed via code review |
| Staff replacement request flow wired | ✓ Confirmed via code review |
| Staff verify flow correctly unwired | ✓ Confirmed via code review |
| Mock writer write guarded in try/catch | ✓ Confirmed via code review |
| Toast always fires regardless of writer | ✓ Confirmed via code review |
| Privacy boundary: studentToken only in metadata | ✓ Confirmed via code review |
| Admin adapter reads live writer events | ✓ Confirmed via code review + check script |
| Admin banner copy mock/demo-safe | ✓ Confirmed via code review |
| Official persisted filter intentionally empty | ✓ Confirmed via code review |
| AuditWarningCard Stage 0 copy preserved | ✓ Confirmed via code review |
| No real persistence added | ✓ Confirmed |
| Mock fixture not mutated | ✓ Confirmed |
| Build/token/audit checks pass | ✓ 40/40, 4/4, 42/42 |
| Dev log clean | ✓ 0 matches |

**Overall QA verdict: PASS** — with known limitations documented above. AP-7 persistence strategy planning may proceed once approved.
