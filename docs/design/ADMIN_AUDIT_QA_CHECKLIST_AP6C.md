# Admin Audit QA Checklist — AP-6C

Date: 2026-05-13
Branch: `design/admin-audit-ux-qa-polish-plan`
Status: Planning only — manual QA checklist for human review of AP-6C implementation.

---

## Purpose

Manual QA checklist for the Admin audit log after AP-6C merge into main. Use this checklist before any AP-6D work begins to confirm the UX state is acceptable.

Each item is marked as Pass / Fail / Skip (not applicable). Record findings in the "Notes" column.

---

## Route Checks

| # | Check | Method | Pass criteria | Notes |
|---|-------|--------|--------------|-------|
| R1 | `/admin/audit-log` returns 200 OK | `curl -sI http://localhost:3000/admin/audit-log` or browser | HTTP 200 | |
| R2 | `/admin/dashboard` returns 200 OK | `curl -sI http://localhost:3000/admin/dashboard` | HTTP 200 | |
| R3 | `/login` returns 200 OK | `curl -sI http://localhost:3000/login` | HTTP 200 | |
| R4 | No 404 or 500 errors in dev server log | `grep -iE "(404|500|error)" /tmp/s2ims-dev.log` | No matches | |
| R5 | No hydration errors in dev server log | `grep -i "hydrat" /tmp/s2ims-dev.log` | No matches | |
| R6 | No duplicate key warnings in dev server log | `grep -i "duplicate" /tmp/s2ims-dev.log` | No matches | |
| R7 | Build passes (40 routes, 0 type errors) | `npm run build` | ✓ Compiled, 40 routes | Automated |
| R8 | Token checks pass | `npm run check:tokens` | 4/4 | Automated |
| R9 | Audit event checks pass | `npm run check:audit-events` | 37/37 | Automated |

---

## Table Display Checks

| # | Check | Expected | Notes |
|---|-------|---------|-------|
| T1 | Table renders with 9 rows when filter = "All" | 9 rows visible (6 fixture + 3 writer) | |
| T2 | Table renders with 9 rows when filter = "Mock/demo only" | 9 rows visible | |
| T3 | Table renders empty state when filter = "Official persisted records" | Empty state card shown, no table | |
| T4 | Empty state heading text | "No official persisted audit records available" | |
| T5 | Empty state detail text | "Real audit persistence has not been connected yet." | |
| T6 | Column headers visible | Time, Actor, Role, Action, Entity, Status, (unlabeled) | |
| T7 | Row striping alternates | Even rows white, odd rows `bg-surface-low/60` | |
| T8 | Timestamps render correctly | Date+time format in locale; fixture rows show 2025 dates, writer rows show 2026 dates | |
| T9 | Actor names render correctly | Thai names display without encoding issues | |
| T10 | Role colors correct | staff=amber, admin=slate, esq=violet, student=blue, provider=emerald | |
| T11 | Action strings render as monospace | `.font-mono text-role-primary` | |
| T12 | Entity type column shows entity type string | e.g., "document", "Announcement", "Application" | |
| T13 | "View details" button visible on every row | Button renders on each row | |
| T14 | Table does not overflow or clip columns at 1280px viewport | All 7 columns visible | |

---

## Badge Checks

| # | Check | Expected | Notes |
|---|-------|---------|-------|
| B1 | Every row has a purple "Mock event" / "เหตุการณ์เดโม" badge | `StatusBadge` with dot, `bg-purple-500/10 text-purple-600` | |
| B2 | Fixture rows show "Fixture mock" source badge | Slate chip: `text-slate-600 bg-slate-100 border-slate-200` | |
| B3 | Writer rows show "Writer mock" source badge | Violet chip: `text-violet-700 bg-violet-50 border-violet-200` | |
| B4 | Writer mock badge (violet) does not visually clash with esq role text on same row | Visual check needed; esq actor rows (row al1) use violet role text | Check row al1 (esq actor) vs writer rows |
| B5 | Source badge in Thai mode | Currently outputs English "Fixture mock"/"Writer mock" for both locales — confirm this is acceptable for prototype | Known gap: no Thai translation |
| B6 | Severity badge in drawer shows correct colors | low=green, medium=amber/warning, critical=red | Check drawer for writer event rows |

---

## Filter Checks

| # | Check | Expected | Notes |
|---|-------|---------|-------|
| F1 | Filter dropdown shows 3 options | All / Mock/demo only / Official persisted records | |
| F2 | Filter label shows "Persistence:" | Left-aligned, `text-xs font-semibold text-ink-2` | |
| F3 | Selecting "All" shows all 9 rows | 9 rows | |
| F4 | Selecting "Mock/demo only" shows all 9 rows | 9 rows (all current records are mock_only) | |
| F5 | Selecting "Official persisted records" shows empty state | 0 rows, empty state card | |
| F6 | Selecting back to "All" from "Official persisted records" restores table | 9 rows visible again | |
| F7 | Filter does not cause page reload | State change only, no route change | |
| F8 | Filter default value is "All" on page load | Dropdown shows "All" on first render | |
| F9 | Filter works in Thai locale | Thai option labels display correctly | |

---

## Drawer Checks

| # | Check | Expected | Notes |
|---|-------|---------|-------|
| D1 | Clicking "View details" opens drawer | Drawer slides in from right | |
| D2 | Drawer opens for fixture event rows | Drawer shows fixture-specific content (before/after metadata, IP) | |
| D3 | Drawer opens for writer event rows | Drawer shows writer-specific content (severity, targetDisplayToken, metadata, policyVersion) | |
| D4 | Drawer closes on X button click | Drawer dismissed, selectedLog cleared | |
| D5 | Drawer closes on backdrop click | Clicking outside drawer closes it | |
| D6 | Drawer has correct title | "Audit Event Detail (Mock/Demo)" for all events | |
| D7 | Source badge in drawer header | "Fixture mock" (slate) or "Writer mock" (violet) beside title | |
| D8 | Event ID shown in monospace purple below title | `text-[10px] text-purple-600 font-mono` | |
| D9 | Mock notice banner present below header | Purple AlertCircle banner with appropriate copy | |
| D10 | Mock notice banner copy — fixture event | "This record is shown for mock/demo review. Real audit persistence is not connected yet." | |
| D11 | Mock notice banner copy — writer event | "Generated from the mock audit writer for display review only." | |
| D12 | Event Identity section shows Event ID | Same as header event ID | |
| D13 | Event Identity section shows timestamp | Human-readable date and time | |
| D14 | Event Identity section — writer: shows eventType | dot-notation string e.g. `staff.document.verify` | |
| D15 | Event Identity section — fixture: shows action | Legacy action string e.g. `announcement.approved` | |
| D16 | Event Identity section — fixture: policy version fallback | "Not available in mock fixture" | |
| D17 | Event Identity section — writer: shows severity badge | Color-coded badge: low (green), medium (warning), critical (danger) | |
| D18 | Actor section shows role badge | Color-coded role badge | |
| D19 | Actor section shows actor name | Name renders without encoding issues (Thai names) | |
| D20 | Target section — writer: shows targetDisplayToken | "Student #S-2345" formatted token | |
| D21 | Target section — fixture: shows entityId | Raw entity ID from fixture | |
| D22 | Target section — fixture: shows privacy note | "IDs shown are from the mock fixture and are not privacy-masked tokens." | |
| D23 | Action/Reason section — writer with reason: shows reason text | Formatted in a bordered box | |
| D24 | Action/Reason section — no reason: shows "Reason not provided" | Not the reason text | |
| D25 | Action/Reason section — writer: shows sourceRoute | `/staff/applications/app_002` or `/admin/users` | |
| D26 | Persistence/Evidence section shows `mock_only` mode badge | Purple monospace badge | |
| D27 | Persistence/Evidence section shows evidence limitation copy | "This is a mock/demo event. Not official audit evidence." | |
| D28 | Metadata section — writer: shows key-value pairs | Key in monospace, value right-aligned | |
| D29 | Metadata section — forbidden keys show "[Hidden by privacy rule]" | FORBIDDEN_AUDIT_METADATA_KEYS applied | Check if any fixture before/after has forbidden keys |
| D30 | Metadata section — fixture with before/after: shows Before/After groups | Separate "Before" and "After" sub-labels | |
| D31 | Metadata section — no metadata: shows "No additional metadata" | Italic placeholder text | Check fixture rows without before/after |
| D32 | Session Context section — fixture events with IP: shows IP | "IP (mock fixture)" label | |
| D33 | Session Context section — writer events: not shown | No session context section for writer events | |
| D34 | Bottom note text present | "This record is from the S²IMS mock/demo dataset..." | |
| D35 | Drawer body scrolls independently | Header and footer fixed; body scrollable | |
| D36 | Footer Close button works | Closes drawer | |
| D37 | Drawer does not cause layout shift on page behind it | Table and page content remain stable when drawer is open | |
| D38 | Drawer z-index above table | Drawer appears over table content at z-50 | |
| D39 | No console errors when opening drawer | Browser console clean | |

---

## Copy Checks

| # | Check | Expected | Notes |
|---|-------|---------|-------|
| C1 | No "Official audit record" anywhere | Not present in any visible copy | |
| C2 | No "Logged and auditable" anywhere | Not present | |
| C3 | No "Persisted" / "Stored" / "Saved" implying real persistence | Not present for mock events | |
| C4 | No "Verified" / "Confirmed" / "Validated" (evidentiary weight) | Not present | |
| C5 | No "Audit trail" implying real backend | Not present | |
| C6 | All mock/demo claims are Stage 1-compliant | See `docs/architecture/AUDIT_COPY_STAGE_GUIDE.md` | |
| C7 | Banner copy does not imply real persistence | "Not official persisted audit evidence" is present | |
| C8 | Empty state copy does not imply persistence is coming soon | "Real audit persistence has not been connected yet." — no ETA language | |
| C9 | Thai copy present for: banner, filter, table columns, drawer title, drawer sections | Thai-locale renders without blank strings | |
| C10 | "Fixture mock" / "Writer mock" source labels — Thai locale check | Currently English for both locales — document as known gap | Known gap: no Thai translation for source labels |
| C11 | CSV export warning header present | "# Export contains demo/mock audit data — not official persistence" | |
| C12 | CSV export filename includes "-demo" | `audit-log-demo-YYYY-MM-DD.csv` | |

---

## Privacy Checks

| # | Check | Expected | Notes |
|---|-------|---------|-------|
| P1 | Forbidden metadata keys hidden in drawer | `rawStudentId`, `studentName`, `email`, `phone`, `address`, `nationalId`, `rawStudentId`, `bankAccount`, `gpaRaw`, `incomeRaw`, `medicalInfo`, `disabilityInfo`, `freeTextSensitiveData` → "[Hidden by privacy rule]" | Check fixture rows al3, al5 (have before/after) |
| P2 | No raw student identity data in visible rows | No raw student names, national IDs, or emails in table cells | |
| P3 | Actor names shown are from mock fixture (non-PII in mock context) | Thai names like "น.ส.รัตนา มะลิวัลย์" are mock data | |
| P4 | Writer events use targetDisplayToken, not raw student IDs | "Student #S-2345" format | |
| P5 | No raw "before/after" values contain forbidden keys in displayed data | Check al3 before `{status: 'SUBMITTED'}` after `{status: 'SHORTLISTED'}` — safe | |
| P6 | Privacy note present for fixture events without token | "IDs shown are from the mock fixture..." | |
| P7 | "targetPrivacyLevel" shown only for writer events | Not present for fixture events | |

---

## Regression Checks (AP-6A/AP-6B Features)

| # | Check | Expected | Notes |
|---|-------|---------|-------|
| RG1 | AP-6A: Persistence filter still works | All three filter options work correctly | |
| RG2 | AP-6A: Mock event badge present on all rows | Purple "Mock event" badge visible on every row | |
| RG3 | AP-6A: Official persisted empty state still works | Empty state shown when filter = real_persisted | |
| RG4 | AP-6A: CSV export still works | CSV download triggers; file includes warning row and Source column | |
| RG5 | AP-6A: Page header subtitle is Stage 1 copy | "Demo audit events — not official persistence" | |
| RG6 | AP-6B: "View details" button present on every row | Button renders correctly | |
| RG7 | AP-6B: Drawer opens for any row | Fixture and writer rows both open drawer | |
| RG8 | AP-6B: Backdrop click closes drawer | Click outside drawer closes it | |
| RG9 | AP-6B: FORBIDDEN_AUDIT_METADATA_KEYS applied | Hidden keys render as "[Hidden by privacy rule]" | |
| RG10 | AP-6C: Writer events appear in table | 3 writer demo rows visible | |
| RG11 | AP-6C: Fixture events appear in table | 6 fixture rows visible | |
| RG12 | AP-6C: Banner shows fixture + writer counts | "(Fixture mock: 6, Writer mock: 3)" visible in banner | |
| RG13 | AP-6C: Drawer shows richer fields for writer events | Severity, targetDisplayToken, policyVersion, sourceRoute present for writer events | |
| RG14 | AP-6C: Source badge correct per row | Fixture=slate, Writer=violet | |
| RG15 | AP-6C: No `src/data/mock/audit-logs.ts` mutation | Fixture file unchanged — 6 records static | `git diff src/data/mock/audit-logs.ts` → no changes |
| RG16 | Staff/Provider/Student components unchanged | No changes in `src/components/staff/`, `src/components/student/`, `src/components/provider/` | |
| RG17 | No runtime writes to mock writer from display | Opening/closing drawer does not add events to `DEMO_WRITER_EVENTS` | |

---

## Readiness Criteria Before AP-6D

All of the following must be true before AP-6D (Staff action wiring) begins:

| Criterion | Status |
|-----------|--------|
| AP-6C merged to main | ✓ Done (merge commit `d132f9e`) |
| R7: Build passes 40 routes, 0 type errors | Confirm on clean build |
| R8: Token checks 4/4 | Confirm |
| R9: Audit event checks 37/37 | Confirm |
| T1: 9 rows visible in audit log | Confirm via browser or curl |
| F5: Official persisted empty state works | Confirm |
| D1–D6: Drawer opens and closes correctly | Confirm via browser |
| C1–C6: No prohibited copy present | Confirm via code review |
| P1–P4: Privacy rules applied correctly | Confirm via code review |
| RG15: Mock fixture not mutated | Confirm via git diff |
| **Admin UX review complete** | Human sign-off required |
| **Product sign-off on Staff action wiring scope** | Required — which Staff callbacks should call `mockAuditWriter.write(...)` |
| **Mock-safe copy for Staff-triggered entries approved** | Required — copy for Staff-triggered mock writer events must follow this guide |

---

## Post-Checklist Notes

- Screenshot evidence is preferred for each section (table view, badge display, all three filter states, drawer open for fixture event, drawer open for writer event, empty state).
- Thai-locale screenshots are needed if bilingual copy gaps (source label Thai translations) are to be resolved.
- If badge color collision (Writer mock violet vs ESQ role violet) is confirmed visually, log it as M4 from the polish plan and track for resolution before AP-6D adds more writer-source events.
