# Daily Report — Login Soft Civic Visual Fix MC88

**Date**: 2026-05-23  
**Branch**: fix/s2ims-login-soft-civic-visual-regression-mc88  
**Scope**: Fix visual regression on `/login` page introduced during MC88 integration

## Problem

MC88 merged the 7 MC87 safety primitives into `src/app/login/page.tsx`. The build passed but the page rendered with visual regressions:
- Cool lavender background (`bg-surface` = `#FAF8FF`) instead of Soft Civic warm paper (`#FBFAF6`)
- Role card hover/icon backgrounds used cool `#F4F1FB` instead of warm `#F4F0E6`
- Selected card border, icon gradient, login button, and chevron all used hardcoded brand blue (`#0055FF`) instead of Soft Civic civic green (`#2E5B4A`)
- Badge collision in card title row: `RoleBadge` rendered "AD Admin" pill directly next to the "Admin" role label text, displaying as "AdminADAdminSelected"

## Fix Applied

Single file changed: `src/app/login/page.tsx`

| Change | Before | After |
|--------|--------|-------|
| Page background | `bg-surface` (`#FAF8FF`) | `bg-[#FBFAF6]` |
| Card unselected hover | `hover:bg-surface-low` | `hover:bg-[#F4F0E6]` |
| Card icon bg | `bg-surface-low` | `bg-[#F4F0E6]` |
| Selected card border | `border-[#0055FF]/40` | `border-[#2E5B4A]/40` |
| Selected card shadow | `rgba(0,85,255,.12)` | `rgba(46,91,74,.12)` |
| Selected icon gradient | `#0055FF → #8B5CF6` | `#2E5B4A → #1F3D32` |
| Badge collision | `RoleBadge` + `StatusBadge` | `StatusBadge` only (role name already in title) |
| Chevron | `text-[#0055FF]` | `text-[#2E5B4A]` |
| Login button gradient | `#0055FF → #8B5CF6` | `#2E5B4A → #1F3D32` |
| Login button shadow | `rgba(0,85,255,.18)` | `rgba(46,91,74,.18)` |

## Validation

- Build: 42/42 ✅
- Tokens: 4/4 ✅
- Audit: 502/502 ✅
- No localStorage/sessionStorage/fetch/API/audit calls ✅
- Only `src/app/login/page.tsx` modified ✅
- AP-10B / AP-10C / AP-11 remain blocked ✅
