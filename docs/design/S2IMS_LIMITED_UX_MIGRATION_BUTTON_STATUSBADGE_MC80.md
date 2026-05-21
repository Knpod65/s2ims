# S²IMS MC80 — Limited UX Migration: Shared Button and StatusBadge

**Date**: 2026-05-22
**Milestone**: MC80
**Branch**: `architecture/s2ims-limited-ux-migration-button-statusbadge-mc80`
**Trigger**: Explicit written approval from Project Lead (MC75 decision gate MC80)
**Scope**: 2 src page files · visual layer only · no business logic changes

---

## Purpose

MC71 introduced shared primitives (`Button`, `StatusBadge`, `theme.ts`) but explicitly did not migrate any existing pages. MC80 performs the first minimal adoption of those primitives in two pages:

1. `src/app/admin/master-data/import-preview/page.tsx` — fixes incorrect `StatusBadge` props and migrates one `<button>` to `<Button>`
2. `src/app/login/page.tsx` — migrates the language toggle `<button>` to `<Button>` and the "Selected" `<span>` to `<StatusBadge>`

No business logic is touched. No AP gates are affected. Confirm Import remains disabled.

---

## Components Used

| Component | File | Source Milestone |
|-----------|------|-----------------|
| `Button` | `src/components/shared/Button.tsx` | MC71 |
| `StatusBadge` | `src/components/shared/StatusBadge.tsx` | MC71 |

---

## Before / After: import-preview

### 1. Page Header StatusBadge

| Field | Before | After |
|-------|--------|-------|
| Import | `@/components/ui/index` (legacy) | `@/components/shared/StatusBadge` |
| Props | `label="Preview only" color="bg-amber-50 text-amber-700 border-amber-200" dot` | `label="Preview only" status="preview"` |
| Risk | — | Low — visual alignment only |

### 2. Sheet Detection StatusBadge

| Field | Before | After |
|-------|--------|-------|
| Props | `color={blocked ? 'bg-red-50...' : inferred ? 'bg-amber-50...' : 'bg-emerald-50...'}` + `dot` | `status={blocked ? 'blocked' : inferred ? 'warning' : 'success'}` |
| Risk | — | Low — visual alignment only |

### 3. Validation Table StatusBadge

| Field | Before | After |
|-------|--------|-------|
| Props | `color={statusColor(validationStatus)}` + `dot` | `status={validationStatus === 'error' ? 'error' : validationStatus === 'warning' ? 'warning' : validationStatus === 'info' ? 'info' : 'success'}` |
| Mapping basis | `statusColor()` fn: error→red, warning→amber, info→blue, default→emerald | StatusBadge enum: error/warning/info/success |
| Risk | — | Low — visual alignment only |

### 4. Reset Preview Button

| Field | Before | After |
|-------|--------|-------|
| Element | `<button type="button" className="btn-secondary w-full justify-center text-sm">` | `<Button variant="secondary" className="w-full">` |
| Handler | `onClick={resetPreview}` | `onClick={resetPreview}` — **identical** |
| Icon | `<RotateCcw size={14} />` inline child | `iconStart={<RotateCcw size={14} />}` |
| Risk | — | Low — same handler, same visual result |

---

## Before / After: login

### 1. Language Toggle Button

| Field | Before | After |
|-------|--------|-------|
| Element | `<button onClick={...} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-white border border-line text-ink-2 hover:text-ink-1 hover:bg-surface-low transition-all">` | `<Button variant="ghost" size="sm" iconStart={<Globe size={12}/>}>` |
| Handler | `onClick={() => setLang(lang === 'th' ? 'en' : 'th')}` | `onClick={() => setLang(lang === 'th' ? 'en' : 'th')}` — **identical** |
| Text | `{lang === 'th' ? 'EN' : 'ภาษาไทย'}` | `{lang === 'th' ? 'EN' : 'ภาษาไทย'}` — **identical** |
| Risk | — | Low — same handler, no state impact |

### 2. "Selected" Role Badge

| Field | Before | After |
|-------|--------|-------|
| Element | `<span className="text-[10px] px-2 py-0.5 rounded-full border border-[#0055FF]/20 bg-[#E5EDFF] text-[#0055FF] font-semibold">` | `<StatusBadge status="info" label={...} size="sm" />` |
| Label | `{lang === 'th' ? 'เลือกแล้ว' : 'Selected'}` | `label={lang === 'th' ? 'เลือกแล้ว' : 'Selected'}` — **identical bilingual** |
| Risk | — | Low — purely visual |

---

## What Was NOT Migrated

| Item | Reason | Deferred To |
|------|--------|-------------|
| Login main button (`handleLogin`, `disabled={!selected \|\| loading}`) | Complex disabled logic + gradient styling tied to auth flow | MC81+ |
| 5 role cards | State-driven `className` and `style` logic per `isSelected` | MC81+ |
| Confirm Import `<button disabled>` | Permanently hardcoded disabled (MC54 governance constraint) | Never — governance gate |
| Other pages (dashboard, candidate-review-demo) | No `<button>` candidates found during exploration | MC81+ |

---

## Business Logic Preserved

| Handler | Status |
|---------|--------|
| `resetPreview` | ✅ Unchanged — wired identically to Button's `onClick` |
| `setLang` language toggle | ✅ Unchanged — wired identically to Button's `onClick` |
| `handleLogin` | ✅ Unchanged — login main button left as-is |
| `setSelected` role card selection | ✅ Unchanged — role cards left as-is |

---

## Disabled States Preserved

| Element | State |
|---------|-------|
| Confirm Import button | `disabled` hardcoded + `cursor-not-allowed` + labeled "disabled in MC54" — **entirely untouched** |
| Login main button | `disabled={!selected \|\| loading}` logic — **entirely untouched** |

---

## AP Gate Status

| Gate | Status |
|------|--------|
| AP-10B (Confirm Import) | 🔒 BLOCKED — unchanged by MC80 |
| AP-10C (Export Approval) | 🔒 BLOCKED — unchanged by MC80 |
| AP-11 (Approval Workflows) | 🔒 BLOCKED — unchanged by MC80 |

MC80 is a visual-layer migration only. It does not affect governance gates.

---

## Safety Banners / Warnings Preserved

| Item | Status |
|------|--------|
| Import-preview red safety banner | ✅ Untouched |
| Import-preview amber warning banner | ✅ Untouched |
| Login prototype warning (`⚠️ This is a prototype...`) | ✅ Untouched |

---

## Validation Results

| Check | Result |
|-------|--------|
| `npm run build` | ✅ 42/42 routes — route count unchanged |
| `npm run check:tokens` | ✅ All token formatting checks passed |
| `npm run check:audit-events` | ✅ 502/502 |
| Scope check | ✅ Only `import-preview/page.tsx` + `login/page.tsx` modified |
| Framework check | ✅ Not Laravel — Next.js verification used |

---

## Rollback Plan

To revert MC80:

```bash
git revert HEAD
# or for full branch revert:
git checkout main
```

The two modified files are self-contained page components. Reverting the MC80 commit restores the previous `<button>` and legacy `StatusBadge` usage without any cascade effect.

---

**Document**: MC80 design record — implementation reference only, not a sign-off or governance document.
**Date**: 2026-05-22
