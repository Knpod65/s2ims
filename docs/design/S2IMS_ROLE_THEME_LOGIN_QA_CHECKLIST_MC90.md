# S²IMS Role Theme Login QA Checklist — MC90

**Date**: 2026-05-23

---

## Selected Role Card Color Test

- [ ] Select Student → card border/icon/chevron shows civic blue `#2E5B8C`
- [ ] Select Staff → card border/icon/chevron shows staff green `#2E5B4A`
- [ ] Select ESQ → card border/icon/chevron shows mauve `#6B3B6B`
- [ ] Select Provider → card border/icon/chevron shows warm amber `#8B5E2B`
- [ ] Select Admin → card border/icon/chevron shows deep purple `#3B2E7E`

## Login Button Color Test

- [ ] Select Student → login button gradient changes to civic blue
- [ ] Select Staff → login button gradient changes to staff green
- [ ] Select ESQ → login button gradient changes to mauve
- [ ] Select Provider → login button gradient changes to warm amber
- [ ] Select Admin → login button gradient changes to deep purple
- [ ] Button glow/shadow also reflects role color (not civic green)
- [ ] Color changes happen immediately on card click (no delay)

## Disabled State Test

- [ ] No role selected → button is neutral grey, disabled, unclickable
- [ ] Loading state (during sign-in) → button disabled, shows "Signing in..."

## Role Redirect Test

- [ ] Student login → navigates to `/student/dashboard`
- [ ] Admin login → navigates to `/admin/dashboard`
- [ ] Staff login → navigates to `/staff/dashboard`
- [ ] No unexpected redirect loops

## Sign-in Responsiveness Test

- [ ] Click login → navigation begins immediately (no 600ms delay)
- [ ] No failed network requests in browser Network tab

## Accessibility / Focus Test

- [ ] Login button has visible focus ring when focused via keyboard
- [ ] Disabled button has `disabled` attribute (not just visual)
- [ ] Role cards are keyboard-selectable

## No API / Audit / Persistence Test

- [ ] No requests to `/api/auth/*` in Network tab
- [ ] `localStorage['s2ims_role']` is set after login (existing mock behavior)
- [ ] No new localStorage/sessionStorage keys added
- [ ] No audit writes triggered
- [ ] AP-10B / AP-10C / AP-11 remain blocked

## Regression Checks

- [ ] `npm run build` passes 42/42
- [ ] `npm run check:tokens` passes 4/4
- [ ] `npm run check:audit-events` passes 502/502
- [ ] Language toggle (TH/EN) works correctly
- [ ] MC88/MC89 visual fixes preserved (warm paper bg, no badge collision)
