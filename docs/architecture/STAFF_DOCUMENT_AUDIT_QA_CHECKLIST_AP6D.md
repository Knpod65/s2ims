# Staff Document Audit QA Checklist — AP-6D

Date: 2026-05-13
Branch: `architecture/staff-document-mock-audit-wiring-plan`
Status: Planning only — checklist for future AP-6D runtime QA.

---

## Purpose

This checklist covers manual QA required before the AP-6D runtime branch
(`architecture/staff-document-mock-audit-wiring-runtime`) can be merged into `main`.

Complete each section in order. Mark each item PASS or FAIL.

---

## Pre-Runtime Checklist

Before starting AP-6D runtime implementation:

| # | Item | Result |
|---|------|--------|
| P1 | `npm run build` on `main` passes — 40/40 routes, 0 type errors | |
| P2 | `npm run check:tokens` passes — 4/4 | |
| P3 | `npm run check:audit-events` passes — 37/37 | |
| P4 | Working tree is clean: `git status --short` shows no changes | |
| P5 | Planning docs are merged into `main` and available | |
| P6 | `docs/architecture/STAFF_DOCUMENT_MOCK_AUDIT_WIRING_PLAN_AP6D.md` exists | |
| P7 | `docs/architecture/STAFF_DOCUMENT_AUDIT_EVENT_MAPPING_AP6D.md` exists | |
| P8 | `docs/architecture/STAFF_DOCUMENT_MOCK_WRITER_RUNTIME_SEQUENCE_AP6D.md` exists | |
| P9 | Diff scope confirmed — `git diff --name-only origin/main...HEAD` is empty or docs only | |

---

## Build and Check Results

After runtime implementation is complete:

| # | Item | Result |
|---|------|--------|
| B1 | `npm run build` passes — 40/40 routes, 0 type errors | |
| B2 | `npm run check:tokens` passes — 4/4 | |
| B3 | `npm run check:audit-events` passes — 37/37 or more | |
| B4 | No TypeScript errors in `sharedMockWriter.ts` | |
| B5 | No TypeScript errors in updated `adminAuditDisplayAdapter.ts` | |
| B6 | No TypeScript errors in updated `page.tsx` | |

---

## Diff Scope Check

| # | Item | Result |
|---|------|--------|
| D1 | `src/lib/audit/sharedMockWriter.ts` is the only new `src/lib/audit/` file | |
| D2 | `src/lib/audit/auditEventBuilder.ts` is NOT modified | |
| D3 | `src/lib/audit/auditTypes.ts` is NOT modified | |
| D4 | `src/lib/audit/mockAuditWriter.ts` is NOT modified | |
| D5 | `src/data/mock/audit-logs.ts` is NOT modified | |
| D6 | `src/data/mock/staffData.ts` is NOT modified | |
| D7 | No Staff/Provider/Student/ESQ components modified (except `page.tsx`) | |
| D8 | `package.json` is NOT modified | |
| D9 | No new routes or auth files added | |

---

## Staff UI Checklist

Test at `/staff/applications/app_002` (has rejectable documents):

### Reject document flow

| # | Item | Result |
|---|------|--------|
| S1 | Expand document accordion — shows "Reject Document" button for eligible docs | |
| S2 | Click "Reject Document" — opens reject form (textarea + Cancel + Send Rejection) | |
| S3 | AuditWarningCard appears above textarea with Stage 0 prototype-safe copy | |
| S4 | AuditWarningCard does NOT say "logged", "auditable", or "recorded in audit trail" | |
| S5 | Typing in textarea — form stays open (bugfix preserved) | |
| S6 | "Send Rejection" is disabled when reason is empty or whitespace | |
| S7 | "Send Rejection" is enabled when reason has any non-whitespace characters | |
| S8 | Click "Send Rejection" — toast fires with rejection reason | |
| S9 | After rejection — accordion collapses | |
| S10 | After rejection — no console errors in browser DevTools | |
| S11 | Click "Cancel" — form closes, draft reason cleared, no toast | |

### Replacement request flow

| # | Item | Result |
|---|------|--------|
| S12 | AuditWarningCard appears in replacement zone for eligible docs with Stage 0 copy | |
| S13 | AuditWarningCard does NOT say "logged", "auditable", or "recorded" | |
| S14 | "Send Request" is disabled when message is empty or whitespace | |
| S15 | "Send Request" is enabled when message has any non-whitespace characters | |
| S16 | Click "Send Request" — toast fires with replacement message | |
| S17 | After send — accordion collapses | |
| S18 | After send — no console errors in browser DevTools | |

### Verify document flow (unaffected)

| # | Item | Result |
|---|------|--------|
| S19 | Verify Document button present for non-verified, non-rejected docs | |
| S20 | Click "Verify Document" — toast fires "Document verified" | |
| S21 | No audit event written for verify action (verify not wired in AP-6D) | |

---

## Admin Audit Log Checklist

Test at `/admin/audit-log` after performing Staff actions:

### Initial state

| # | Item | Result |
|---|------|--------|
| A1 | Page loads — 9 rows visible (6 fixture + 3 static demo writer) | |
| A2 | No console errors on page load | |
| A3 | Persistence filter "All" selected — 9 rows visible | |
| A4 | Persistence filter "Mock/demo only" — 9 rows visible | |
| A5 | Persistence filter "Official persisted records" — empty state shown | |

### After Staff rejects a document

| # | Item | Result |
|---|------|--------|
| A6 | Navigate to Admin audit log — new row visible at top of table | |
| A7 | New row shows action: `staff.document.reject` | |
| A8 | New row shows actor: "Staff (Demo)" | |
| A9 | New row source badge: "Demo (generated)" (indigo) | |
| A10 | New row time: timestamp is recent (correct `createdAt`) | |
| A11 | New row entity: `document` | |

### After Staff requests replacement

| # | Item | Result |
|---|------|--------|
| A12 | Navigate to Admin audit log — second new row visible | |
| A13 | New row shows action: `staff.document.request_replacement` | |
| A14 | New row source badge: "Demo (generated)" (indigo) | |
| A15 | New row actor: "Staff (Demo)" | |

### Static demo rows unchanged

| # | Item | Result |
|---|------|--------|
| A16 | `staff.document.verify` static demo row still visible | |
| A17 | `staff.document.reject` static demo row still visible (different from live row) | |
| A18 | `admin.role.assign` static demo row still visible | |
| A19 | All 6 fixture rows still visible | |
| A20 | Rows sorted correctly by `createdAt` descending — newest at top | |

---

## Drawer Checklist

Test by clicking "View details" on a live Staff-triggered event row:

| # | Item | Result |
|---|------|--------|
| DR1 | Drawer opens for live `staff.document.reject` event | |
| DR2 | Drawer header: "Audit Event Detail (Mock/Demo)" or equivalent | |
| DR3 | Drawer header shows "Demo (generated)" source badge (indigo) | |
| DR4 | Event Identity section: shows `staff.document.reject` event type | |
| DR5 | Event Identity section: shows severity "medium" badge | |
| DR6 | Event Identity section: shows timestamp matching the rejection time | |
| DR7 | Actor section: shows "Staff (Demo)" | |
| DR8 | Actor section: shows `actorId` label as "Actor ID" (no "(mock data)" annotation) | |
| DR9 | Target section: shows `Student #S-XXXX` token — no raw student ID | |
| DR10 | Target section: does NOT show raw student_id (e.g. `650912345`) | |
| DR11 | Action/Reason section: shows actual rejection reason text | |
| DR12 | Action/Reason section: shows "Reason Required: Yes" | |
| DR13 | Persistence/Evidence section: mock_only badge — no real persistence language | |
| DR14 | Persistence/Evidence section: does NOT say "Official audit record" | |
| DR15 | Metadata section: shows `documentId`, `applicationId`, `studentToken`, `nextStatus` | |
| DR16 | Metadata section: no forbidden keys visible | |
| DR17 | No bottom evidence note (removed in UX polish) | |
| DR18 | Close button works | |
| DR19 | Backdrop click closes drawer | |

Repeat DR1–DR19 for `staff.document.request_replacement` event.

---

## Mock-Only Copy Checklist

Verify no real persistence copy appears anywhere in the prototype:

| # | Location | Forbidden copy | Result |
|---|----------|---------------|--------|
| CP1 | Staff reject `AuditWarningCard` | "logged", "recorded in audit trail", "cannot be undone" | Not present |
| CP2 | Staff replacement `AuditWarningCard` | "logged", "recorded", "permanently saved" | Not present |
| CP3 | Admin audit log banner | "Official audit evidence" | Not present |
| CP4 | Admin audit table row badges | "Official", "Persisted", "Logged" | Not present |
| CP5 | Admin drawer mock notice | "Official audit record", "Production audit" | Not present |
| CP6 | Admin drawer Persistence section | "Real persistence", "Permanent record" | Not present |
| CP7 | AuditWarningCard in reject zone | `requiresReason` prop used | Not present (Stage 0 only) |
| CP8 | AuditWarningCard in replacement zone | `requiresReason` prop used | Not present (Stage 0 only) |

---

## Privacy Checklist

| # | Item | Result |
|---|------|--------|
| PV1 | Admin drawer Target section shows `Student #S-XXXX` token — not raw ID | |
| PV2 | Admin drawer Metadata section shows `studentToken: Student #S-XXXX` — not raw ID | |
| PV3 | Admin audit table row does not display raw student_id in any column | |
| PV4 | Metadata does not contain student name, email, or phone | |
| PV5 | Metadata does not contain file contents or file paths | |
| PV6 | Drawer reason field shows staff-operational reason text — student-safe to read by admins | |
| PV7 | Provider-facing surfaces are unaffected by AP-6D | |
| PV8 | Student-facing surfaces are unaffected by AP-6D | |
| PV9 | ESQ-facing surfaces are unaffected by AP-6D | |
| PV10 | `FORBIDDEN_AUDIT_METADATA_KEYS` applied in Admin drawer metadata display | |

---

## Regression Checklist

Confirm existing behaviors are unaffected:

| # | Item | Result |
|---|------|--------|
| R1 | `/staff/applications/app_001` — loads without errors (all docs verified; no reject available) | |
| R2 | `/staff/applications/app_002` — loads without errors | |
| R3 | `/admin/audit-log` — loads 9 rows before any Staff action | |
| R4 | `/admin/dashboard` — loads without errors | |
| R5 | `/login` — loads without errors | |
| R6 | Fixture rows (6) still visible in Admin audit log | |
| R7 | Static demo writer rows (3) still visible in Admin audit log | |
| R8 | Persistence filter "Official persisted records" still shows correct empty state | |
| R9 | CSV export still works in Admin audit log | |
| R10 | Locale switching (EN ↔ TH) works on Admin audit log | |
| R11 | Locale switching (EN ↔ TH) works on Staff application page | |
| R12 | StaffDocumentEvidenceWorkbench prototype amber strip still visible | |
| R13 | DocumentActionRail counts and guidance rows still correct | |
| R14 | MaskedStudentProfileCard still shows `Student #S-XXXX` token | |
| R15 | Identity reveal modal still opens and closes correctly | |
| R16 | Staff notes still add correctly | |
| R17 | Application status change still works | |
| R18 | Dev log: no errors, warnings, hydration issues, duplicate key warnings, 404/500 | |

---

## Readiness Criteria Before Merge

All of the following must be PASS before AP-6D runtime branch can be merged into `main`:

| Criterion | Requirement |
|-----------|-------------|
| Build | `npm run build` passes — 40/40, 0 type errors |
| Token checks | `npm run check:tokens` passes — 4/4 |
| Audit event checks | `npm run check:audit-events` passes — 37/37 or more |
| Diff scope | Only allowed files in diff — no forbidden files |
| Staff UI | S1–S21 all PASS |
| Admin audit log | A1–A20 all PASS |
| Drawer | DR1–DR19 all PASS for both event types |
| Mock-only copy | CP1–CP8 all "Not present" |
| Privacy | PV1–PV10 all PASS |
| Regression | R1–R18 all PASS |
| AuditWarningCard | Stage 0 prototype-safe copy preserved — not changed to Stage 2 |
| Mock fixture | `src/data/mock/audit-logs.ts` not mutated |
| Writer only | `persistenceMode: 'mock_only'` on all AP-6D events — confirmed in drawer |
| No ReasonRequiredModal | Not introduced |
| No reason min-length change | Still non-empty-only validation |
| No real persistence | Not added |
| AP-6D runtime | Complete — both reject and replacement request wired |

---

## Post-Merge Recommended Actions

After AP-6D runtime is merged:

1. Create checkpoint document in `docs/daily-reports/`.
2. Update `docs/architecture/NEXT_RENOVATION_STEPS.md` with AP-6D runtime result.
3. Human reviewer opens `/admin/audit-log` and `/staff/applications/app_002` in a browser
   and performs reject and replacement actions to visually verify end-to-end.
4. Evaluate whether reason min-length (SW-3B) should follow before additional wiring.
5. Do not start `staff.document.verify` wiring or disclosure wiring without explicit approval.
