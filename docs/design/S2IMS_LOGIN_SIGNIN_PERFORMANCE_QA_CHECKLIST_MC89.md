# S²IMS Login Sign-in Performance QA Checklist — MC89

**Date**: 2026-05-23

---

## Role Select Test

- [ ] Click each of the 5 role cards (student, staff, esq, provider, admin)
- [ ] Each selected card shows a role-specific border color (not all the same green)
- [ ] Each selected card icon uses a role-specific gradient
- [ ] Each selected card chevron matches the role color
- [ ] Unselected cards remain warm paper/grey style
- [ ] Clicking a different card deselects the previous one

## Sign-in Elapsed Time Test

- [ ] Select Admin → click "Login as Admin"
- [ ] Navigation to `/admin/dashboard` happens in < 200ms
- [ ] No 600ms loading delay observed
- [ ] Repeat with another role (student → `/student/dashboard`)

## Loading State Test

- [ ] Button shows "Signing in..." text briefly on click
- [ ] Button is disabled (not clickable) during navigation
- [ ] Loading state does not hang (page navigates)

## Redirect Test

- [ ] admin → `/admin/dashboard` ✅
- [ ] staff → `/staff/dashboard` ✅
- [ ] student → `/student/dashboard` ✅
- [ ] provider → `/provider/dashboard` ✅
- [ ] esq → `/esq/dashboard` ✅
- [ ] No double-redirect or loop observed

## Network/API Test

- [ ] No request to `/api/auth/me` or `/api/auth/login` in Network tab
- [ ] No failed network requests on login
- [ ] localStorage `s2ims_role` is set after login (mock persistence)

## Role Theme Color Test (After Login)

- [ ] App shell reflects correct role color via `data-role` attribute
- [ ] Topbar role badge shows correct role-specific color
- [ ] Sidebar role display shows correct color

## Regression Checks

- [ ] `npm run build` passes 42/42
- [ ] `npm run check:tokens` passes 4/4
- [ ] `npm run check:audit-events` passes 502/502
- [ ] Language toggle (TH/EN) works on login page
- [ ] MC88 visual fix preserved: warm paper background, no unstyled elements
- [ ] No API/fetch/audit writes introduced
- [ ] AP-10B / AP-10C / AP-11 remain blocked
