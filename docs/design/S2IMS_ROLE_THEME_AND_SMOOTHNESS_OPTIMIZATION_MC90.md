# S²IMS Role Theme Propagation & Smoothness Optimization — MC90

**Date**: 2026-05-23  
**Branch**: perf/s2ims-role-theme-smoothness-optimization-mc90  
**Scope**: Login button role-specific color; notification bell investigation; app-wide delay audit

---

## Issue Summary

After MC89, role cards on the login page display role-specific colors when selected. However, the login button continued to show a fixed civic green gradient (`#2E5B4A → #1F3D32`) regardless of the selected role. The user expects the entire selection UI — card, badge, and button — to immediately reflect the chosen role's color.

---

## Fix: Login Button Role-Specific Color

**File**: `src/app/login/page.tsx`

The `roleColors` variable was computed inside the `ROLE_META.map()` closure, making it inaccessible at the button's render position.

**Solution**: Compute `selectedRoleColors` at the component level, derived from the `selected` state:

```tsx
const selectedRoleColors = selected ? softCivicRoles[selected as SoftCivicRoleKey] : null
```

The login button's style now uses this value:

```tsx
style={selected && !loading && selectedRoleColors
  ? {
      background: `linear-gradient(135deg, ${selectedRoleColors.base}, ${selectedRoleColors.base}CC)`,
      boxShadow: `0 18px 45px ${selectedRoleColors.base}2E`,
    }
  : undefined}
```

The shadow is expressed as an inline style (not Tailwind class) because its value must be dynamic per role; Tailwind JIT cannot generate class names from runtime values.

### Before / After

| Role selected | Button color (before) | Button color (after) |
|---------------|-----------------------|----------------------|
| Student | Civic green `#2E5B4A` | Civic blue `#2E5B8C` |
| Staff | Civic green `#2E5B4A` | Staff green `#2E5B4A` (same — coincidence) |
| ESQ | Civic green `#2E5B4A` | Mauve `#6B3B6B` |
| Provider | Civic green `#2E5B4A` | Warm amber `#8B5E2B` |
| Admin | Civic green `#2E5B4A` | Deep purple `#3B2E7E` |
| No selection | Neutral disabled | Neutral disabled (unchanged) |

---

## Notification Bell Findings — Deferred to MC91

**File**: `src/components/layout/Topbar.tsx`, line 32

```ts
const unread = mockNotifications.filter((n) => !n.is_read).length
```

The unread count derives from a **static import** (`mockNotifications`). It reflects the initial mock data (3 unread items) and never updates at runtime. Clicking the bell navigates to the role-specific notifications page.

The `is_read` field is defined in `src/lib/types.ts` and the student notification page has local `markRead` / `markAllRead` handlers — but these are page-local state and do not sync back to Topbar.

**Why deferred**: Making read-state propagate to Topbar requires a shared notification context or store consumed by both Topbar and the notification pages. This is a well-scoped but medium-complexity change (new context, provider wiring, page updates) — appropriate for MC91.

---

## App-wide Delay Audit — Documented, Not Modified

All `setTimeout` delays found in the codebase (excluding login, which was fixed in MC89):

| File | Line | Delay | Purpose |
|------|------|-------|---------|
| `src/app/student/profile/page.tsx` | 104 | 600ms | Mock save |
| `src/app/student/applications/new/page.tsx` | 76 | 1000ms | Mock submit |
| `src/app/admin/settings/page.tsx` | 23 | 700ms | Mock save |
| `src/app/admin/export/page.tsx` | 51 | 600ms | Mock export |
| `src/app/staff/ocr/page.tsx` | 28, 30 | 1500ms | Mock OCR transitions |
| `src/app/staff/announcements/[id]/preview/page.tsx` | 24, 33 | 700ms / 1500ms | Mock publish |
| `src/components/ui/Toast.tsx` | 29 | 3500ms | Toast auto-dismiss |

**Recommendation**: The 1000–1500ms delays are noticeable. MC91 should review whether they can be reduced to 200–400ms without hurting UX perception. Toast auto-dismiss at 3500ms is standard and appropriate.

---

## Framework Detection

- Next.js App Router: confirmed (package.json, src/app/page.tsx pattern)
- Laravel/PHP: NOT present (`artisan`, `composer.json`, `routes/web.php`, `routes/api.php` absent)

---

## Files Changed

| File | Change |
|------|--------|
| `src/app/login/page.tsx` | Add `selectedRoleColors` at component scope; use for button gradient + shadow |

---

## Validation

- Build: 42/42 ✅
- Tokens: 4/4 ✅
- Audit: 502/502 ✅
- No API/fetch/audit writes in login ✅
- AP-10B / AP-10C / AP-11 remain blocked ✅
