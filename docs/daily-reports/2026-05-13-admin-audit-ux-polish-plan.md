# Admin Audit UX QA/Polish Plan Merge Checkpoint

Date: 2026-05-13
Branch merged: `design/admin-audit-ux-qa-polish-plan` → `main`
Phase: Admin Audit UX QA/Polish Planning (post AP-6C)

---

## Overview

This checkpoint records the merge of the Admin Audit UX QA/Polish planning package into main.

AP-6C connected mock writer demo events to the Admin audit log display. Before Staff action wiring (AP-6D) can begin, the Admin audit UX was reviewed for clarity, copy risk, visual hierarchy, privacy interpretation, and readiness. The result is a set of docs-only planning documents identifying polish items, copy simplification guidance, visual hierarchy recommendations, and a manual QA checklist.

No runtime code was changed. No Staff actions were wired. No real persistence was added.

---

## Merge Details

| Field | Value |
|-------|-------|
| Source branch | `design/admin-audit-ux-qa-polish-plan` |
| Target branch | `main` |
| Merge commit | `aa74b4b` |
| Merge strategy | `--no-ff` (ort) |
| Conflict status | None |
| Push result | `8206492..aa74b4b main -> main` — PASS |

---

## Files Added

| File | Purpose |
|------|---------|
| `docs/design/ADMIN_AUDIT_UX_QA_POLISH_PLAN.md` | Full UX review: current state, confusion risks, table/badge/filter/drawer/empty-state analysis, must-have and recommended polish items, what must not change |
| `docs/design/ADMIN_AUDIT_COPY_SIMPLIFICATION_GUIDE.md` | Recommended copy for every Admin audit surface, prohibited copy list, Thai/English guidance, known Thai gap (source label translations) |
| `docs/design/ADMIN_AUDIT_VISUAL_HIERARCHY_PLAN.md` | Badge hierarchy (primary/secondary), violet/ESQ color conflict, warning copy placement, drawer section order and icon recommendations, mobile notes |
| `docs/design/ADMIN_AUDIT_QA_CHECKLIST_AP6C.md` | 100-item manual QA checklist covering route, table, badge, filter, drawer, copy, privacy, and regression checks; readiness criteria before AP-6D |

---

## Files Modified

| File | Change |
|------|--------|
| `docs/architecture/NEXT_RENOVATION_STEPS.md` | Added "Admin Audit UX QA/Polish Plan after AP-6C" section documenting findings, blocking AP-6D, and recommended next steps |

---

## Validation Before Merge (source branch)

| Check | Result |
|-------|--------|
| `npm run build` | PASS — 40/40 routes, 0 type errors |
| `npm run check:tokens` | PASS — 4/4 |
| `npm run check:audit-events` | PASS — 37/37 |

---

## Validation After Merge (main)

| Check | Result |
|-------|--------|
| `npm run build` | PASS — 40/40 routes, 0 type errors |
| `npm run check:tokens` | PASS — 4/4 |
| `npm run check:audit-events` | PASS — 37/37 |

---

## Key Findings from Planning Documents

| Finding | Location in docs |
|---------|-----------------|
| "Writer mock" violet badge conflicts with ESQ role color in same table | UX Polish Plan M4 |
| Source badge labels ("Fixture mock" / "Writer mock") have no Thai translations | UX Polish Plan M5 |
| Technical fixture/writer counts in banner are developer-facing, not admin-facing | UX Polish Plan M3 |
| Drawer has three restatements of mock-only nature — bottom note is redundant | UX Polish Plan R6 |
| Two drawer sections share the same `Activity` icon — visual scanning is ambiguous | UX Polish Plan R5 |
| Empty `<th>` in action column — no label for "View details" column | UX Polish Plan M1 |
| Status column stacks two badges vertically — increases row height, splits visual weight | UX Polish Plan M2 |

Must-have polish items (M1–M5) documented in `ADMIN_AUDIT_UX_QA_POLISH_PLAN.md`.

---

## Safety Confirmations

| Item | Status |
|------|--------|
| Admin audit UX polish plan merged | Yes |
| Runtime code changed | No |
| Admin UI changed | No |
| Staff actions wired | No |
| Real persistence added | No |
| Mock audit fixture mutated (`src/data/mock/audit-logs.ts`) | No |
| Reason validation changed | No |
| ReasonRequiredModal introduced | No |
| Admin audit polish runtime started | No |
| AP-6D started | No |
| Forbidden files changed (`src/`, `scripts/`, `package.json`) | No |

---

## Recommended Next Step

**Implement must-have polish items M1–M5 in a new runtime branch:**
`design/admin-audit-ux-polish-runtime`

Must-have items (from `ADMIN_AUDIT_UX_QA_POLISH_PLAN.md`):

| # | Item | Location |
|---|------|---------|
| M1 | Add "Details" label to empty action column `<th>` | `src/app/admin/audit-log/page.tsx` |
| M2 | Simplify Status column — reduce or remove secondary source badge from table | `src/app/admin/audit-log/page.tsx` |
| M3 | Remove or simplify technical fixture/writer counts from banner | `src/app/admin/audit-log/page.tsx` |
| M4 | Change "Writer mock" badge color from violet to indigo | `page.tsx` + `AdminAuditEventDetailDrawer.tsx` |
| M5 | Add Thai translations for "Fixture mock" / "Writer mock" source labels | Both files |

After the polish runtime branch is merged and the QA checklist is completed by a human reviewer:
- Product sign-off on which Staff callbacks should call `mockAuditWriter.write(...)`
- Confirm mock-safe copy for Staff-triggered entries
- Then begin AP-6D planning (document scope only before any implementation)

**Do not start AP-6D yet.**
**Do not wire Staff document actions yet.**

---

## Final Status

```
On branch: main
Merge commit: aa74b4b
Push: 8206492..aa74b4b main -> main — PASS
Working tree: clean
```
