# Staff Document Mock Audit Wiring — AP-6D QA Summary

Date: 2026-05-13
Branch reviewed: `main`
Commits reviewed: `5da04fa` (merge), `89a3224` (checkpoint)

---

## AP-6D QA Result

**Overall: PASS** — with known limitations. See full checklist: `docs/qa/staff-document-mock-audit-wiring-ap6d/README.md`

---

## What Passed

| Area | Evidence |
|------|---------|
| `npm run build` | 40/40 static routes, 0 type errors |
| `npm run check:tokens` | 4/4 |
| `npm run check:audit-events` | 42/42 — 5 new AP-6D checks confirmed shared writer and adapter integration |
| Staff reject callback wired | `onReject` → `buildStaffDocumentRejectEvent` → `sharedMockAuditWriter.write()` in `try/catch` |
| Staff replacement request callback wired | `onRequestReplacement` → `buildStaffDocumentReplacementRequestEvent` → `sharedMockAuditWriter.write()` in `try/catch` |
| Writer failure cannot block Staff UI | Write wrapped in `try/catch`; toast fires regardless |
| Privacy boundary respected | `studentToken` used in metadata — raw `student_id` never in audit event |
| Admin adapter reads live writer events | `getAdminAuditDisplayRows` merges `sharedMockAuditWriter.list()` with fixture and demo rows |
| Official persisted filter intentionally empty | No real events exist; filter shows empty state |
| AuditWarningCard Stage 0 copy preserved | "real audit-log persistence is not connected yet" — unchanged |
| All 5 routes return 200 OK | `/login`, `/staff/applications/app_001`, `/staff/applications/app_002`, `/admin/audit-log`, `/admin/dashboard` |
| Dev log clean | Zero errors, warnings, hydration issues, duplicate keys, chunk errors, 404/500 |

---

## What Was Not Changed

| Item | Status |
|------|--------|
| `src/data/mock/audit-logs.ts` | Not mutated |
| `DocumentVerificationPanel.tsx` interface | Unchanged — no new props |
| `StaffDocumentEvidenceWorkbench.tsx` | Unchanged |
| `DocumentActionRail.tsx` | Unchanged |
| `AuditWarningCard` copy | Stage 0 preserved — unchanged |
| Staff verify action (`onVerify`) | Unwired — toast only, deferred to AP-6E or later |
| Reason validation / min-length | Unchanged — deferred to SW-3B/SD-3 |
| `ReasonRequiredModal` | Not introduced |
| Backend/API behavior | Unchanged |
| Routes, auth, role guards | Unchanged |
| Provider/Student/ESQ flows | Unchanged |
| Real audit persistence | Not added |

---

## Known Limitations Before AP-7

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| Session-scoped mock writer | Staff and Admin must act in same browser session (same module instance) to see live events together; page reload resets | Expected for `mock_only` prototype — clearly labeled "Demo" |
| Stage 0 AuditWarningCard copy | Panel still says "real audit-log persistence is not connected yet" — technically inaccurate now that mock wiring exists | Deferred: copy should be updated to Stage 1/2 only when AP-7 (real persistence) is approved |
| No document status mutation | Panel document status does not update after Staff action (static mock data) | Expected prototype behavior — requires state management or API layer |
| Prototype actor identity | `actorId: 'staff_demo_session'`, `actorDisplayName: 'Staff (Demo)'` — not real session data | Deferred to backend auth integration |
| No reason min-length | Only non-empty check; 20-character minimum deferred to SW-3B/SD-3 | Explicitly deferred per AP-6D plan |
| Headless QA | No browser screenshots captured | Recommend human browser review before AP-7 planning begins |

---

## Module Counts (dev server, AP-6D on main)

| Route | Modules compiled |
|-------|-----------------|
| `/login` | 549 |
| `/staff/applications/[id]` | 679 |
| `/admin/audit-log` | 687 |
| `/admin/dashboard` | 695 |

Staff applications page increased by approximately 2 modules compared to pre-AP-6D (new imports: `buildStaffDocumentRejectEvent`, `buildStaffDocumentReplacementRequestEvent`, `sharedMockAuditWriter`). No unexpected module graph growth.

---

## Recommendation Before AP-7

Before AP-7 (real persistence strategy) planning begins:

1. **Human browser QA:** Open `/staff/applications/app_002`, perform a rejection and a replacement request, then open `/admin/audit-log` in the same session and confirm live events appear.
2. **AuditWarningCard copy decision:** Decide whether to update to Stage 1 copy ("This action is recorded in demo mode only") before or after AP-7 landing.
3. **AP-6E consideration (optional):** Wire `onVerify` to `staff.document.verify` mock event (low-risk, no reason required) — low value but keeps audit coverage consistent.
4. **SW-3B consideration:** Add 20-character minimum reason length for rejection and replacement — requires product approval.

Do not begin AP-7 persistence strategy without explicit approval.
Do not change reason validation before SW-3B is approved.
Do not introduce `ReasonRequiredModal` before SD-3/SW-3B is approved.
