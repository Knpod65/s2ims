# Admin Audit UX QA/Polish Plan — Post AP-6C

Date: 2026-05-13
Branch: `design/admin-audit-ux-qa-polish-plan`
Status: Planning only — no runtime code changed.

---

## Purpose

Review the Admin audit log UX after AP-6A/AP-6B/AP-6C and document polish items before any Staff action wiring (AP-6D) begins.

This document covers: current state, concepts visible, confusion risks, table/badge/filter/drawer/empty-state review, copy risks, layout risks, mobile risks, recommended polish items with priority, and what must not change.

---

## Current Admin Audit UX State (Post AP-6C)

### Page: `/admin/audit-log`

Route: `src/app/admin/audit-log/page.tsx`

| Element | Current state |
|---------|---------------|
| Page header title | "Audit Log" / "ประวัติการใช้งาน (Audit Log)" |
| Page header subtitle | "Demo audit events — not official persistence" |
| Top banner | Purple AlertCircle — mock warning + fixture/writer counts |
| Persistence filter | Dropdown: All / Mock/demo only / Official persisted records |
| Table rows | 9 total: 6 fixture (2025 dates) + 3 writer demo (2026 dates) |
| Table columns | Time, Actor, Role, Action, Entity, Status, (unlabeled action col) |
| Status column | Two stacked badges per row: "Mock event" (purple) + source label (slate/violet) |
| Action column header | Empty `<th>` — no label |
| "View details" button | Per row, opens drawer |
| Official persisted empty state | Shows when filter = real_persisted |
| CSV export | In page header; includes warning header row and Source column |

### Drawer: `AdminAuditEventDetailDrawer`

Component: `src/components/admin/AdminAuditEventDetailDrawer.tsx`

| Element | Current state |
|---------|---------------|
| Panel | Fixed right, `max-w-sm` (384px), z-50, with backdrop |
| Header | Title + source badge + event ID (monospace purple) |
| Mock notice banner | Purple, source-aware copy |
| Sections (writer events) | Event Identity, Actor, Target/Entity, Action/Reason, Persistence/Evidence, Metadata |
| Sections (fixture events) | Event Identity, Actor, Target/Entity, Action/Reason, Persistence/Evidence, Metadata (before/after or empty), Session Context (if IP present) |
| Bottom note | Demo dataset disclaimer |
| Footer | Close button (full width) |

---

## Concepts Currently Visible

An Admin reviewing `/admin/audit-log` currently sees:

1. **Mock event badge** — purple dot badge per row, inherited from AP-6A.
2. **Source label** — "Fixture mock" (slate) or "Writer mock" (violet) per row.
3. **Persistence filter** — three options; official persisted shows empty state.
4. **Source badge in drawer header** — "Fixture mock" or "Writer mock" beside the drawer title.
5. **Severity** — low/medium/critical badge in drawer for writer events only.
6. **Event type vs action** — writer events show structured `eventType` (dot-notation string); fixture events show legacy `action` string (also dot-notation).
7. **Target display token** — writer events show "Student #S-2345" formatted token; fixture events show raw entity IDs from the fixture.
8. **Reason text** — present for two of the three writer demo events; "Reason not provided" for fixture events.
9. **Reason Required** — shown as "Yes/No" for writer events only.
10. **Metadata** — structured key-value for writer events; before/after for fixture events; FORBIDDEN keys render as `[Hidden by privacy rule]`.
11. **IP / Session Context** — shown for fixture events that have an `ip` field.
12. **Policy version** — shown for writer events; "Not available in mock fixture" for fixture events.
13. **Count banner** — "(Fixture mock: 6, Writer mock: 3)" shown in the top warning banner.

---

## Risk of User Confusion

### High Confusion Risk

| Item | Risk |
|------|------|
| **Stacked dual badges in Status column** | Two vertically stacked badges take vertical space and may imply different things. Admin may not understand the difference between "Mock event" and "Fixture mock"/"Writer mock". The visual weight of the two badges competing makes the row harder to scan. |
| **"Writer mock" vs "Fixture mock" not explained anywhere** | The distinction is a developer concept (data origin), not meaningful for an Admin reviewer. There is no tooltip, explanation, or hover state. An Admin may ask: "What is a Writer mock? Why does it matter?" |
| **Technical counts in banner** | "(Fixture mock: 6, Writer mock: 3)" is a developer-facing breakdown. An Admin reviewer cares that these are all mock, not which subsystem generated them. |
| **Fixture dates (2025) vs writer dates (2026)** | The table sorts by timestamp descending, so writer events (2026-05) appear at the top, fixture events (2025-04) at the bottom. A 12-month gap is visually conspicuous and may raise questions like "why are some audit records from last year?" |
| **dot-notation action strings in Action column** | `staff.document.verify`, `admin.role.assign`, `announcement.approved` appear as monospace technical strings. These are not localized and not human-readable to a non-developer Admin. |

### Medium Confusion Risk

| Item | Risk |
|------|------|
| **"Persistence:" filter label** | "Persistence" is an architectural term, not admin language. Filter labels like "Record type" or "Data source" are more approachable. |
| **Empty action column header** | The "View details" column has no `<th>` label. Screen readers may not announce this column correctly, and visual scanners lose the table structure hint. |
| **Drawer: Action section reuses Activity icon** | Both "Event Identity" and "Action / Reason" sections use the same `Activity` icon from lucide-react. This breaks visual scanning of sections. |
| **"Reason Required: Yes/No"** | This is an implementation field. It is not meaningful to an Admin unless they understand the audit policy model. Showing it adds noise without adding context. |
| **"Actor ID (mock data)"** | Including "(mock data)" in the label is honest but is a developer annotation. An Admin reading this may wonder if this implies something failed or is suspicious. |
| **"IDs shown are from the mock fixture..."** | The privacy note for fixture events reads as a developer disclaimer. Its tone is different from the rest of the drawer, which reads as admin-facing copy. |

### Low Confusion Risk

| Item | Risk |
|------|------|
| **Source badge in drawer header** | The drawer header already says "Mock/Demo". The source badge beside it (Fixture mock / Writer mock) is redundant for admin-facing review. It matters for developers but not for a QA reviewer. |
| **"Policy Version: Not available in mock fixture"** | Technically accurate but draws attention to a gap. Could simply be omitted for fixture events if no policyVersion is present. |
| **Session Context section (IP)** | Shows for some fixture events, hidden for writer events. Inconsistent section presence may be distracting. |
| **Bottom evidence note text** | "This record is from the S²IMS mock/demo dataset." is clear but nearly identical to the top banner and mock notice. The third restatement adds length without adding new information. |

---

## Table Review

| Element | Observation | Recommended polish |
|---------|-------------|-------------------|
| Column count | 7 columns (Time, Actor, Role, Action, Entity, Status, unlabeled) | Add "Details" label to action column header |
| Status column height | Two stacked badges per row increase row height. On 9 rows, this creates a tall table. | Consider condensing to one badge or moving source label to hover/tooltip |
| Action column | Monospace dot-notation strings — not localized | Add human-readable labels map for known event/action types (deferred to AP-6D+) |
| Date display | 2025-04 fixture dates vs 2026-05 writer dates — 12-month gap | Consider marking the date gap more clearly, or using relative dates for prototype review |
| Row striping | Alternating `bg-surface-low/60` — good. | No change needed |
| Key uniqueness | `row.id` used as key — confirmed unique from source | No change needed |

---

## Badge Review

| Badge | Current | Recommended polish |
|-------|---------|-------------------|
| "Mock event" (purple) | `StatusBadge`, dot prefix, purple | Clear and correct. Consider making this the single primary indicator. |
| "Fixture mock" (slate) | `text-[10px]` inline chip | Secondary indicator — consider moving to tooltip or row tooltip on hover |
| "Writer mock" (violet) | `text-[10px]` inline chip, violet | Violet conflicts with `esq` role color in the same table (`ROLE_COLOR.esq = text-violet-700`). Risk of color collision if esq actor rows appear near writer-source rows. Consider using indigo or teal for writer source badge. |
| Severity badge (drawer) | `text-xs font-mono`, color-coded low/medium/critical | Good. Accurate. No change needed. |
| Source badge in drawer header | Same slate/violet as table — correct mirroring. | If table badge is simplified, update drawer to match. |

---

## Filter Review

| Element | Current | Recommended polish |
|---------|---------|-------------------|
| Filter label | "Persistence:" | Change to "Record type:" or "Show:" — more approachable |
| Option: "All" | Shows all 9 rows | No change needed |
| Option: "Mock/demo only" | Shows all 9 rows (same as All currently) | When AP-6D wires Staff events, this may still show all. Fine for now. |
| Option: "Official persisted records" | Shows empty state | No change needed — empty state is clear and correct |
| Filter select element | `text-xs border border-line rounded-lg` | Consistent with design system. No change needed. |

---

## Drawer Review

| Element | Current | Recommended polish |
|---------|---------|-------------------|
| Panel width | `max-w-sm` (384px) | Acceptable for desktop. On small laptops (1024px), 384px is reasonable. No change needed. |
| Header | Title + source badge + event ID | Simplify: source badge is redundant for admin review; the mock notice banner below already explains source context. |
| Mock notice banner | Source-aware copy | Good. Consider unifying fixture and writer copy to a single shorter sentence. |
| Event Identity section | Timestamp, event/action, policy version, severity | "Policy Version: Not available in mock fixture" — could be hidden when unavailable to reduce noise. |
| Actor section | Role badge, name, actor ID | "(mock data)" label annotation is developer-facing. Consider removing parenthetical. |
| Target/Entity section | Token or ID, privacy level, privacy note | Privacy note reads as developer copy. Could be removed or moved to a small inline help icon. |
| Action/Reason — Action section icon | `Activity` (same as Event Identity) | Use a different icon: `MessageSquare` or `FileText` for Reason sections. |
| "Reason Required: Yes/No" | Shown for writer events | Consider removing or placing in a collapsed detail — not meaningful to Admin reviewer. |
| Persistence/Evidence section | `mock_only` badge + copy block | Good and necessary. No change needed. |
| Metadata section | Key-value with forbidden key filtering | Good. "No additional metadata" placeholder is clear. |
| Session Context section | IP shown for some fixture events | Inconsistent presence (not all fixture events have IP). Consider always showing the section header with a consistent "Not available in mock fixture" rather than hiding the section entirely. |
| Bottom evidence note | Third restatement of mock nature | Consider removing or condensing to one line. Two restatements (banner + drawer top notice) are sufficient. |
| Footer close button | Full-width, text-only | Acceptable. No change needed. |

---

## Empty State Review

| State | Current copy | Assessment |
|-------|-------------|------------|
| Official persisted — no records | "No official persisted audit records available" + "Real audit persistence has not been connected yet." | Clear, correct, uses approved Stage 1 copy. No change needed. |
| All / Mock-only — records present | Table renders normally | No change needed. |

---

## Copy Risks

| Location | Copy | Risk |
|----------|------|------|
| Top banner | "(Fixture mock: 6, Writer mock: 3)" | Technical counts not relevant to admin reviewers. |
| Banner text | "Not official persisted audit evidence" | Slightly different from drawer text "Not official audit evidence" — minor inconsistency. |
| Filter label | "Persistence:" | Technical architectural term. |
| Action column | dot-notation strings `staff.document.verify` | Not human-readable for non-developer Admins. |
| Drawer: Actor ID label | "Actor ID (mock data)" | "(mock data)" annotation is developer note, not admin copy. |
| Drawer: Privacy note | "IDs shown are from the mock fixture and are not privacy-masked tokens." | Developer explanation, not admin copy tone. |
| Drawer: Policy Version | "Not available in mock fixture" | Developer-facing fallback text. |
| Source labels | "Writer mock" / "Fixture mock" | Unexplained technical distinction. |
| "Reason Required" | Yes/No field | Implementation detail, not admin concept. |

---

## Layout Risks

| Item | Risk |
|------|------|
| Table row height | Two stacked badges in Status column increase row height. 9 rows × ~56px = long scroll on small viewports. |
| Drawer sections | 7–9 sections create a long scroll in the drawer body. On a 768px tall viewport, all sections may not be visible without scrolling. |
| Action column overlap | "View details" button is narrow; on < 1024px width, the table may compress. |
| Banner + filter + table | Three separate UI elements stacked before the table creates ~120px of header content that pushes the table down. |

---

## Mobile Risks

| Item | Risk |
|------|------|
| Drawer on 375px viewport | `max-w-sm` (384px) wider than 375px viewport — drawer will cover full screen with no visible backdrop. The backdrop click-to-close is the only affordance beyond the X button. |
| No swipe-to-close | No touch gesture to close drawer on mobile. User must tap X or the backdrop. |
| 7-column table on mobile | Table will overflow horizontally on small viewports. No horizontal scroll wrapper is specified; overflow may be clipped or cause layout break. |
| Filter + badge area | "Persistence:" filter + stacked status column badges on mobile will be cramped. |

---

## Recommended Polish Items

### Must-Have (before AP-6D)

| # | Item | Location | Change |
|---|------|---------|--------|
| M1 | Add "Details" label to action column `<th>` | `page.tsx` table header | Add header text to empty `<th>` |
| M2 | Simplify Status column to single badge | `page.tsx` table rows | Show one badge: "Mock event" only. Move source label to a smaller secondary indicator or remove from table entirely. |
| M3 | Simplify top banner — remove technical counts | `page.tsx` banner | Remove "(Fixture mock: 6, Writer mock: 3)" or replace with just "9 demo records" |
| M4 | Fix "Writer mock" violet badge color conflict with esq role | `page.tsx` + `AdminAuditEventDetailDrawer.tsx` | Change writer source badge to `text-indigo-700 bg-indigo-50 border-indigo-200` to avoid violet collision |
| M5 | Add Thai translations for "Fixture mock" / "Writer mock" source labels | Both files | Thai copy needed; currently both `lang==='th'` and `lang==='en'` return English strings |

### Recommended (polish before or with AP-6D)

| # | Item | Location | Change |
|---|------|---------|--------|
| R1 | Rename filter label from "Persistence:" to "Show:" | `page.tsx` | Simpler filter label |
| R2 | Remove or hide "Reason Required" field from drawer | `AdminAuditEventDetailDrawer.tsx` | Remove or collapse into metadata |
| R3 | Remove "(mock data)" annotation from Actor ID label | `AdminAuditEventDetailDrawer.tsx` | Change to just "Actor ID" |
| R4 | Replace developer privacy note with smaller inline help | `AdminAuditEventDetailDrawer.tsx` | "IDs shown are demo data" — 1 line max |
| R5 | Use distinct icons for Event Identity vs Action/Reason sections | `AdminAuditEventDetailDrawer.tsx` | Change one section's icon to avoid duplication |
| R6 | Remove bottom evidence note (third restatement) | `AdminAuditEventDetailDrawer.tsx` | Banner + drawer top notice are sufficient |
| R7 | Hide Policy Version row when unavailable | `AdminAuditEventDetailDrawer.tsx` | Only show if `log.policyVersion` exists |
| R8 | Unify banner and drawer mock notice copy | Both files | "Not official persisted audit evidence" vs "Not official audit evidence" — pick one |

### Deferred (after AP-6D or AP-7)

| # | Item | Reason |
|---|------|--------|
| D1 | Human-readable action/event type labels | Requires event type label map — scope belongs in AP-6D or later |
| D2 | Horizontal scroll wrapper for mobile table | Requires layout change, scope risk |
| D3 | Swipe-to-close drawer on mobile | Requires gesture handler, out of scope for polish |
| D4 | Relative dates for fixture 2025 vs writer 2026 gap | Data quality issue, deferred |
| D5 | Remove Writer mock / Fixture mock distinction from table entirely | After Staff actions are wired in AP-6D, the distinction may become meaningful — defer decision |

---

## What Must Not Change in This Polish Phase

| Item | Reason |
|------|--------|
| `src/data/mock/audit-logs.ts` | Must never be mutated |
| `src/lib/audit/mockAuditWriter.ts` | Not wired — must stay unchanged |
| `src/lib/audit/auditEventBuilder.ts` | Core contract — must stay unchanged |
| Staff/Provider/Student/ESQ components | Not in scope |
| Routes, auth, role guards | Not in scope |
| Backend/API behavior | Not in scope |
| Real audit persistence | Not implemented, must not be added |
| Reason validation | Must not change |
| ReasonRequiredModal | Must not be introduced |
| AP-6D runtime wiring | Must not start without explicit approval |

---

## Recommended Before AP-6D Starts

Before AP-6D (Staff action wiring) begins, the following should be reviewed and resolved:

1. **M1–M5** (must-have polish items) should be implemented or explicitly deferred with rationale.
2. Admin reviewer should view the current UI in a browser (not headless) and confirm:
   - Source badge distinction is clear or acceptable.
   - Drawer section flow is understandable.
   - Copy is appropriate for Admin audience.
3. Agreement on whether "Fixture mock" / "Writer mock" distinction should remain in the table when AP-6D adds real-time written Staff events (which will also be Writer-source rows).
