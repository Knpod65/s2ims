# S²IMS Login Sign-in Performance & Role Theme Review — MC89

**Date**: 2026-05-23  
**Branch**: fix/s2ims-login-signin-performance-role-theme-mc89  
**Scope**: Login page sign-in speed + role theme color consistency

---

## Issue Summary

After MC88 visual regression fix, the login page rendered correctly but sign-in felt slow (~600ms from click to navigation).

---

## Root Cause: Sign-in Delay

**Location**: `src/app/login/page.tsx`, line 35 (pre-fix)  
**Cause**: A single `await new Promise(r => setTimeout(r, 600))` artificial delay preceded `login()` and `router.push()`.

```ts
// Before
const handleLogin = async () => {
  if (!selected) return
  setLoading(true)
  await new Promise(r => setTimeout(r, 600)) // mock delay  ← removed
  login(selected)
  router.push(ROLE_HOME[selected])
}
```

There was no other delay source:
- No middleware (`middleware.ts` absent)
- No API call to `/api/auth/me` or `/api/auth/login`
- No guard redirect loop
- No hydration bottleneck
- `login()` in `src/lib/auth.tsx` is fully synchronous (state + localStorage write)

**Fix**: Delete the `await new Promise(...)` line. Sign-in is now immediate.

---

## Role Theme Color Findings

Three independent color systems exist in the codebase:

| Layer | System | Role-specific? |
|-------|--------|---------------|
| App shell / Topbar / Sidebar | `[data-role="..."]` CSS vars in `globals.css` | ✅ Applied correctly after login |
| Shared `RoleBadge` component | `softCivicRoles` from `theme.ts` via inline styles | ✅ Applied correctly everywhere |
| Login card selected state | Hardcoded `#2E5B4A` civic green | ❌ Same for all roles — fixed in MC89 |

### CSS Variable System (globals.css)

Each `[data-role="..."]` block defines a full set of CSS custom properties:
- `--role-primary-hex`, `--role-tint`, `--role-surface`, `--role-border`, `--role-glow`, etc.

`AppShell.tsx` sets `data-role={role}` on the root container, cascading these variables throughout the entire post-login UI. Topbar and Sidebar consume them via `var(--role-...)` inline styles. This system was already correct before MC89.

### softCivicRoles Token System (theme.ts)

```ts
export const softCivicRoles = {
  admin:    { base: '#3B2E7E', light: '#EDE9F8' },
  staff:    { base: '#2E5B4A', light: '#E8F1ED' },
  provider: { base: '#8B5E2B', light: '#F5EDE3' },
  student:  { base: '#2E5B8C', light: '#E8EEF6' },
  esq:      { base: '#6B3B6B', light: '#F3E9F3' },
  public:   { base: '#4A5B3A', light: '#EEF2E8' },
} as const
```

These MC87 tokens were used by `RoleBadge` but not by the login card selected state. MC89 wires them into the card selection UI.

### Login Card Fix

Border color, shadow tint, icon gradient, and chevron now derive from `softCivicRoles[role]` via inline styles. Tailwind JIT cannot generate dynamic class names at runtime, so inline styles are the correct approach.

---

## Files Changed

| File | Change |
|------|--------|
| `src/app/login/page.tsx` | Remove 600ms delay; import + apply `softCivicRoles` per card |

---

## Validation

- Build: 42/42 ✅
- Tokens: 4/4 ✅
- Audit: 502/502 ✅
- No API calls / localStorage / audit writes in login ✅
- AP-10B / AP-10C / AP-11 remain blocked ✅
