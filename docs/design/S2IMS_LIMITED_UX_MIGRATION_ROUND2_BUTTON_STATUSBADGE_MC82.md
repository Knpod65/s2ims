# S²IMS MC82 — Limited UX Migration Round 2: Shared Button and StatusBadge

**Date**: 2026-05-22
**Milestone**: MC82
**Branch**: `architecture/s2ims-limited-ux-migration-round2-button-statusbadge-mc82`
**Base HEAD**: `f4ece64` (MC81 post-merge QA)
**Scope**: 1 src page modified — `src/app/admin/audit-log/page.tsx`

---

## Purpose

MC82 is the second limited UX migration to the shared Button and StatusBadge primitives (introduced in MC71). Following the MC80 pattern, only elements with a clean, risk-free migration path were selected. All business logic, handlers, disabled states, and safety boundaries remain unchanged.

---

## Candidate Page Selection

### Pages Inspected

| Page | Risk | Decision | Reason |
|------|------|---------|--------|
| `admin/audit-log` | **LOW** | ✅ SELECTED | 2 raw buttons, 1 legacy StatusBadge, 1 hardcoded span pill — all cleanly mappable |
| `staff/applications` | LOW-AMBIGUOUS | ❌ DEFERRED | StatusBadge uses `APP_STATUS_MAP` color strings (cannot map to status enum without auditing all possible values); document count chips use CSS vars (`bg-role-tint`, `bg-status-danger/10`) — not StatusBadge candidates |
| `staff/applications/[id]` | MEDIUM-HIGH | ❌ DEFERRED | 6 buttons wired to audit event builders and AuditShadowWriteService; complex disabled logic |
| `provider/dashboard` | — | ❌ DEFERRED | Only `<Link>` styled as btn-primary — no button elements to migrate |
| `staff/dashboard` | — | ❌ DEFERRED | No buttons, no status badges — nothing to migrate |

**Login main button + role cards** — remain deferred to MC83+ (complex gradient/state-driven styling, deferred from MC80).

---

## Migration: `src/app/admin/audit-log/page.tsx`

### Import Changes

| Before | After |
|--------|-------|
| `import { PageHeader, StatusBadge } from '@/components/ui/index'` | `import { PageHeader } from '@/components/ui/index'` |
| — | `import { Button } from '@/components/shared/Button'` |
| — | `import { StatusBadge } from '@/components/shared/StatusBadge'` |

### Element 1 — Export CSV Button

| | Detail |
|-|--------|
| Location | Line 59 (inside `PageHeader` `actions` prop) |
| Before | `<button onClick={exportAuditCSV} className="btn-secondary text-xs flex items-center gap-1.5 py-1.5">` |
| After | `<Button variant="secondary" size="sm" onClick={exportAuditCSV} iconStart={<Download size={13}/>}>` |
| Handler | `exportAuditCSV` — unchanged (creates CSV blob from mock data, no API call) |
| Disabled state | None — unchanged |

### Element 2 — "Mock event" StatusBadge (legacy color+dot → shared status)

| | Detail |
|-|--------|
| Location | Lines 127-130 |
| Before | `<StatusBadge label="Mock event" color="bg-purple-500/10 text-purple-600 border-purple-500/20" dot />` |
| After | `<StatusBadge label="เหตุการณ์เดโม / Mock event" status="preview" />` |
| Color change | purple-500/10 → purple-100 (intentional design system alignment) |
| `dot` prop | Removed — not in shared StatusBadge interface; purely decorative |
| Semantic mapping | `status="preview"` is the correct semantic match for a mock/demo indicator |

### Element 3 — Source Type Pill (hardcoded span → shared StatusBadge)

| | Detail |
|-|--------|
| Location | Lines 131-137 |
| Before | Conditional `<span>` with hardcoded Tailwind: indigo (writer) / slate (fixture) |
| After | `<StatusBadge status={row.source === 'writer' ? 'info' : 'neutral'} size="sm">` |
| Color change (writer) | `text-indigo-700 bg-indigo-50 border-indigo-200` → sky (info) — intentional design system alignment |
| Color change (fixture) | `text-slate-600 bg-slate-100 border-slate-200` → gray (neutral) — intentional design system alignment |
| Label | Bilingual (TH/EN) — unchanged |

### Element 4 — "View details" Button

| | Detail |
|-|--------|
| Location | Lines 141-147 |
| Before | `<button onClick={() => setSelectedLog(row)} className="text-[11px] px-2 py-1 rounded border border-line text-ink-2 hover:bg-surface-low...">` |
| After | `<Button variant="ghost" size="sm" onClick={() => setSelectedLog(row)}>` |
| Handler | `setSelectedLog(row)` — unchanged (opens detail drawer) |
| Disabled state | None — unchanged |
| Variant | `ghost` — matches original ghost-like style (transparent bg, no border, hover on surface) |

---

## What Was NOT Changed

| Element | Status |
|---------|--------|
| `exportAuditCSV` function body | ✅ UNTOUCHED |
| `setSelectedLog` / `selectedLog` state | ✅ UNTOUCHED |
| `ROLE_COLOR` map | ✅ UNTOUCHED |
| `persistenceFilter` state + `<select>` dropdown | ✅ UNTOUCHED |
| AlertCircle warning banner | ✅ UNTOUCHED |
| `AdminAuditComparisonDebugPanel` | ✅ UNTOUCHED |
| `AdminAuditEventDetailDrawer` | ✅ UNTOUCHED |
| Role label `<span>` (line 121) | ✅ UNTOUCHED — not a StatusBadge |
| Action label `<span>` (line 123) | ✅ UNTOUCHED — not a StatusBadge |
| `PageHeader`, `AppShell` | ✅ UNTOUCHED |

---

## Business Logic Preservation

| Concern | Status |
|---------|--------|
| Export CSV handler | ✅ PRESERVED — same function reference |
| View details handler | ✅ PRESERVED — same setState call |
| No audit writes in MC82 scope | ✅ CONFIRMED |
| No disabled state changes | ✅ CONFIRMED |
| No route/navigation changes | ✅ CONFIRMED |
| No auth/role logic changes | ✅ CONFIRMED |

---

## Components Used

| Component | Import | Purpose |
|-----------|--------|---------|
| `Button` | `@/components/shared/Button` | Export CSV (secondary), View details (ghost) |
| `StatusBadge` | `@/components/shared/StatusBadge` | Mock event (preview), Source type pill (info/neutral) |

---

## AP Gates

| Gate | Status |
|------|--------|
| AP-10B (Confirm Import) | 🔒 BLOCKED — no import logic in MC82 scope |
| AP-10C (Export Approval) | 🔒 BLOCKED — CSV export is demo data only, no approval logic |
| AP-11 (Approval Workflows) | 🔒 BLOCKED — no approval workflow logic in MC82 scope |

---

## Accessibility Notes

| Element | Accessibility |
|---------|--------------|
| Export CSV Button | `<button>` element with visible label and iconStart icon (aria-hidden) — readable |
| View details Button | `<button>` element with visible bilingual label — readable |
| Mock event StatusBadge | `role="img"` + `aria-label="เหตุการณ์เดโม / Mock event"` (from shared StatusBadge) |
| Source type StatusBadge | `role="img"` + `aria-label` from label prop (from shared StatusBadge) |

---

## Color Change Notes

All color changes are intentional design system alignment — not regressions:

| Element | Old Color | New Color | Reason |
|---------|-----------|-----------|--------|
| Mock event badge | purple-500/10 (10% opacity) | purple-100 (flat) | Design system `status="preview"` token |
| Source pill — writer | indigo | sky (info) | Design system `status="info"` token |
| Source pill — fixture | slate | gray (neutral) | Design system `status="neutral"` token |

---

## Rollback Plan

Revert the 4 changes to `src/app/admin/audit-log/page.tsx`:
1. Restore import: `import { PageHeader, StatusBadge } from '@/components/ui/index'`
2. Remove shared imports
3. Restore `<button>` elements (Export CSV, View details)
4. Restore legacy `<StatusBadge color=... dot>` and `<span>` pill

No database, persistence, or API rollback needed — visual changes only.

---

## Validation

| Check | Result |
|-------|--------|
| `npm run build` | ✅ Compiled successfully — 42/42 routes |
| `npm run check:tokens` | ✅ All token formatting checks passed |
| `npm run check:audit-events` | ✅ 502/502 |
| Scope check | ✅ SCOPE CLEAN |

---

**Document**: MC82 limited UX migration round 2 — not a sign-off, not a governance record.
**Date**: 2026-05-22
