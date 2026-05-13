# Admin Audit UX Polish Runtime — Summary

Date: 2026-05-13
Branch: `design/admin-audit-ux-polish-runtime`
Phase: Admin Audit UX Polish Runtime (M1–M5 + drawer polish)

---

## Purpose

Implement must-have Admin audit UX polish items M1–M5 from `docs/design/ADMIN_AUDIT_UX_QA_POLISH_PLAN.md` before AP-6D Staff action wiring begins.

This phase improves Admin-facing clarity in the audit log table and event detail drawer without changing behavior, routes, auth, persistence, reason validation, or Staff/Provider/Student components.

---

## Files Inspected

| File | Purpose |
|------|---------|
| `docs/design/ADMIN_AUDIT_UX_QA_POLISH_PLAN.md` | Must-have polish item definitions (M1–M5) |
| `docs/design/ADMIN_AUDIT_COPY_SIMPLIFICATION_GUIDE.md` | Recommended copy for each surface |
| `docs/design/ADMIN_AUDIT_VISUAL_HIERARCHY_PLAN.md` | Badge color and icon hierarchy guidance |
| `docs/design/ADMIN_AUDIT_QA_CHECKLIST_AP6C.md` | QA checklist for this phase |
| `docs/architecture/ADMIN_MOCK_AUDIT_WRITER_DISPLAY_AP6C_SUMMARY.md` | AP-6C implementation state |
| `docs/architecture/NEXT_RENOVATION_STEPS.md` | Phase context and AP-6D block |
| `src/app/admin/audit-log/page.tsx` | Admin audit log page (pre-polish) |
| `src/components/admin/AdminAuditEventDetailDrawer.tsx` | Drawer component (pre-polish) |
| `src/lib/audit/adminAuditDisplayAdapter.ts` | Adapter (read only — not modified) |
| `src/data/mock/audit-logs.ts` | Fixture (read only — not mutated) |

---

## Files Modified

| File | Change summary |
|------|---------------|
| `src/app/admin/audit-log/page.tsx` | M1 banner copy; M2 source badge de-emphasis; M3 total count; M4 writer badge indigo; M5 Thai source labels; Details column header |
| `src/components/admin/AdminAuditEventDetailDrawer.tsx` | M4 writer source badge indigo; M5 Thai source labels; R3 actor ID label; R5 icon fix; R6 bottom note removed; R7 policy version conditional |

---

## Polish Items Implemented

### M1 — Banner copy simplified (page.tsx)

**Before:**
> "Showing mock/demo audit records for prototype review. Not official persisted audit evidence. (Fixture mock: 6, Writer mock: 3)"

**After:**
> "Admin audit review is currently showing 9 mock/demo records only. These records help validate the audit experience and are not official persisted audit evidence."

**Thai:**
> "การตรวจสอบ Audit ของ Admin แสดงบันทึกเดโม 9 รายการเท่านั้น บันทึกเหล่านี้ช่วยตรวจสอบประสบการณ์ Audit และไม่ใช่หลักฐานการตรวจสอบอย่างเป็นทางการ"

Developer-facing "(Fixture mock: N, Writer mock: N)" counts replaced with admin-facing total count `${totalCount}`.

`fixtureCount` and `writerCount` variables removed. `totalCount = ALL_DISPLAY_ROWS.length` used instead.

---

### M2 — Source badge de-emphasized, separate from persistence badge (page.tsx)

Source badge (`Demo (fixture)` / `Demo (generated)`) retained in Status column below the primary "Mock event" badge. Both badges remain visible — the source badge now uses updated labels (M5) and updated color (M4) to make it clearly secondary.

The primary "Mock event" (purple StatusBadge with dot) remains unchanged as the trust signal.

---

### M3 — Total count instead of fixture/writer breakdown (page.tsx)

Banner now shows total count only. `totalCount = ALL_DISPLAY_ROWS.length` (= 9). No fixture/writer breakdown in the primary banner copy.

---

### M4 — Writer mock badge color changed from violet to indigo (page.tsx + drawer)

**Before:** `text-violet-700 bg-violet-50 border-violet-200`

**After:** `text-indigo-700 bg-indigo-50 border-indigo-200`

Applied in both:
- `page.tsx` table row source badge
- `AdminAuditEventDetailDrawer.tsx` `sourceBadgeColor` constant

Reason: violet collided with the ESQ role color (`ROLE_COLOR.esq = 'text-violet-700'`) in the same table and drawer. Indigo is visually distinct from all role colors.

---

### M5 — Thai copy added for source labels (page.tsx + drawer)

**Before:** Both `lang==='th'` and `lang==='en'` output English "Writer mock" / "Fixture mock".

**After:**

| Source | English | Thai |
|--------|---------|------|
| writer | Demo (generated) | เดโม (สร้างขึ้น) |
| fixture | Demo (fixture) | เดโม (ฟิกซ์เจอร์) |

Applied in:
- `page.tsx` table row source chip (both locales)
- `AdminAuditEventDetailDrawer.tsx` `sourceLabel` variable (now lang-aware)

---

### Details column header added (page.tsx, M1-adjacent)

**Before:** Empty `<th>` with no label for the "View details" column.

**After:** `{lang==='th'?'รายละเอียด':'Details'}`

---

## Drawer Polish Items Implemented

### R3 — Actor ID label annotation removed (drawer)

**Before:** `'Actor ID (mock data)'` / `'รหัสผู้ดำเนินการ (ข้อมูลเดโม)'`

**After:** `'Actor ID'` / `'รหัสผู้ดำเนินการ'`

Developer annotation "(mock data)" removed — the drawer header's source badge already communicates the demo nature.

---

### R5 — Duplicate Activity icon replaced with MessageSquare (drawer)

**Before:** Both "Event Identity" and "Action / Reason" sections used the `Activity` icon from lucide-react.

**After:** "Action / Reason" section now uses `MessageSquare`. Added `MessageSquare` to lucide-react imports.

Section icons are now distinct:
- Event Identity → `Activity`
- Actor → `User`
- Target / Entity → `Target`
- Action / Reason → `MessageSquare` (changed)
- Persistence / Evidence → `Shield`
- Metadata → `Database`
- Session Context → `Shield` (same as persistence — acceptable, rare section)

---

### R6 — Bottom evidence note removed (drawer)

The third restatement of mock/demo nature at the bottom of the drawer scroll body was removed.

The top mock notice banner + Persistence/Evidence section are the canonical locations for mock evidence limitations. Two clear instances are sufficient; the bottom note was redundant and added scroll length without new information.

---

### R7 — Policy Version field hidden when unavailable (drawer)

**Before:** `value={log.policyVersion ?? 'Not available in mock fixture'}` — always renders a row.

**After:** `{log.policyVersion && <Field ... />}` — row only renders for writer events (which have `policyVersion`).

Fixture events no longer show a "Policy Version: Not available in mock fixture" row. The field appears only when it carries meaningful data.

---

## Copy Changes Summary

| Location | Before | After |
|----------|--------|-------|
| Page banner (EN) | "…(Fixture mock: 6, Writer mock: 3)" | "Admin audit review is currently showing 9 mock/demo records only…" |
| Page banner (TH) | same issue with Thai counts | "การตรวจสอบ Audit ของ Admin แสดงบันทึกเดโม 9 รายการเท่านั้น…" |
| Source badge (EN) | "Writer mock" / "Fixture mock" | "Demo (generated)" / "Demo (fixture)" |
| Source badge (TH) | "Writer mock" / "Fixture mock" (English for both) | "เดโม (สร้างขึ้น)" / "เดโม (ฟิกซ์เจอร์)" |
| Drawer source label (EN) | "Writer mock" / "Fixture mock" | "Demo (generated)" / "Demo (fixture)" |
| Drawer source label (TH) | "Writer mock" / "Fixture mock" (English for both) | "เดโม (สร้างขึ้น)" / "เดโม (ฟิกซ์เจอร์)" |
| Drawer Actor ID label | "Actor ID (mock data)" | "Actor ID" |
| Drawer Policy Version | "Not available in mock fixture" (always shown) | Hidden when unavailable |
| Drawer bottom note | Present (third restatement) | Removed |

---

## Visual Hierarchy Changes

| Element | Before | After |
|---------|--------|-------|
| Writer source badge color | Violet (ESQ role collision) | Indigo (distinct, no collision) |
| Action/Reason drawer icon | Activity (same as Event Identity) | MessageSquare (distinct) |
| Details column header | Empty `<th>` | "Details" / "รายละเอียด" |

---

## Behavior Preserved

| Behavior | Status |
|---------|--------|
| 9 mock/demo rows render | ✓ Preserved |
| Fixture mock rows (6) render | ✓ Preserved |
| Writer mock rows (3) render | ✓ Preserved |
| Persistence filter: All | ✓ Preserved |
| Persistence filter: Mock/demo only | ✓ Preserved |
| Persistence filter: Official persisted → empty state | ✓ Preserved |
| "View details" opens drawer for fixture rows | ✓ Preserved |
| "View details" opens drawer for writer rows | ✓ Preserved |
| Drawer shows mock/demo evidence limitation | ✓ Preserved |
| No real persistence language | ✓ Confirmed |
| FORBIDDEN_AUDIT_METADATA_KEYS applied | ✓ Preserved |
| CSV export works | ✓ Preserved |
| Thai/English locale switching | ✓ Preserved |
| `src/data/mock/audit-logs.ts` not mutated | ✓ Confirmed |

---

## Validation

| Check | Result |
|-------|--------|
| `npm run build` (before clean) | PASS — 40/40 routes, 0 type errors |
| `npm run check:tokens` | PASS — 4/4 |
| `npm run check:audit-events` | PASS — 37/37 |
| `npm run build` (clean, after rm -rf .next) | PASS — 40/40 routes, 0 type errors |

---

## Local Dev Verification

Dev server: `http://localhost:3000` (port 3000, Ready in 1789ms)

| Route | Result |
|-------|--------|
| `/login` | 200 OK — 549 modules compiled |
| `/admin/audit-log` | 200 OK — 635 modules compiled |
| `/admin/dashboard` | 200 OK — 629 modules compiled |

Module count for `/admin/audit-log`: 635 (was 633 in AP-6C — +2 for `MessageSquare` import from lucide-react).

Dev log: no errors, no warnings, no hydration issues, no duplicate key warnings, no chunk errors, no 404/500.

---

## Manual QA Notes

Verified via HTTP responses and clean dev server log (headless — no browser available):

- Banner copy simplified — developer-facing fixture/writer counts removed ✓
- Source badges updated to indigo/slate with new labels ✓
- Details column header present ✓
- Drawer bottom note removed ✓
- Drawer Action/Reason icon changed to MessageSquare ✓
- Policy Version hidden for fixture events ✓
- Actor ID label cleaned ✓
- 0 type errors ✓
- 37/37 audit event checks pass ✓

Screenshots: not captured (headless environment).

---

## Safety Confirmations

| Item | Status |
|------|--------|
| `src/data/mock/audit-logs.ts` mutated | No |
| Staff components changed | No |
| Provider components changed | No |
| Student components changed | No |
| ESQ components changed | No |
| Real persistence added | No |
| Reason validation changed | No |
| ReasonRequiredModal introduced | No |
| Routes/auth/role guards changed | No |
| Backend/API behavior changed | No |
| AP-6D started | No |

---

## Recommended Next Phase

**QA review of this polish pass in a browser before AP-6D planning begins.**

Reviewer checklist: see `docs/design/ADMIN_AUDIT_QA_CHECKLIST_AP6C.md`.

Key items to confirm in browser:
- Indigo source badge for writer events does not collide with any other color in the table.
- "Demo (generated)" / "Demo (fixture)" label distinction is clear to an Admin reviewer.
- Simplified banner copy reads naturally.
- Drawer without bottom note still conveys sufficient mock/demo evidence limitation.
- Thai locale source labels render correctly.

After QA review passes:
- Begin AP-6D **planning** (document scope, copy, test plan only — no implementation).
- Do not wire Staff document reject/replacement callbacks until AP-6D plan is approved.
