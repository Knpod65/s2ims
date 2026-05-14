# Notification QA Checklist UX-N1C

## Overview

This checklist defines quality assurance criteria for the UX-N1C: Notification Dropdown Accessibility Polish Plan. It should be executed before any runtime implementation begins and revisited after implementation is complete.

## 2. Pre-Implementation Checks (Planning Phase)

These checks confirm the design documentation is complete and consistent.

### 2.1 Design Completeness

| # | Check | Status |
|---|-------|--------|
| 1 | Dropdown behavior model documented (trigger, positioning, dismissal) | [ ] |
| 2 | Notification card anatomy defined (all fields, variants) | [ ] |
| 3 | Empty state copy finalized (EN + TH) | [ ] |
| 4 | Error state copy finalized (EN + TH) | [ ] |
| 5 | Blocked state copy finalized for all reason codes (EN + TH) | [ ] |
| 6 | Read/unread state plan documented (no persistence) | [ ] |
| 7 | Mobile interaction pattern specified (bottom sheet) | [ ] |
| 8 | Accessibility review completed (keyboard, screen reader, touch) | [ ] |
| 9 | Privacy/PII constraints documented and enforceable | [ ] |
| 10 | Laravel/PHP mapping provided for all components | [ ] |

### 2.2 Safety Confirmations

| # | Check | Status |
|---|-------|--------|
| 11 | No runtime code changes in the plan | [ ] |
| 12 | No backend/API behavior added | [ ] |
| 13 | No database migrations created | [ ] |
| 14 | No mock fixtures mutated | [ ] |
| 15 | No notification click behavior changed | [ ] |
| 16 | No route behavior changed | [ ] |
| 17 | No PII exposed in routes or payloads | [ ] |
| 18 | No audit behavior changed | [ ] |
| 19 | UX-N1B wiring preserved unchanged | [ ] |

## 3. Post-Implementation Checks

These checks apply after a future runtime implementation is completed.

### 3.1 Build & Validation

| # | Check | Command | Expected |
|---|-------|---------|----------|
| 20 | Build passes | `npm run build` | 40/40 routes, 0 errors |
| 21 | Token check passes | `npm run check:tokens` | 4/4 |
| 22 | Audit/notification checks pass | `npm run check:audit-events` | 71/71 (or updated count) |

### 3.2 Route Verification

| # | Route | Expected |
|---|-------|----------|
| 23 | `/login` | 200 OK |
| 24 | `/admin/audit-log` | 200 OK |
| 25 | `/admin/dashboard` | 200 OK |
| 26 | `/staff/applications/app_001` | 200 OK |
| 27 | `/staff/applications/app_002` | 200 OK |
| 28 | `/student/notifications` | 200 OK |

### 3.3 Dev Log

| # | Check | Expected |
|---|-------|----------|
| 29 | No errors, warnings, hydration issues | Clean log |
| 30 | No duplicate keys | Clean log |
| 31 | No unsupported chunk errors | Clean log |
| 32 | No 404 or 500 errors | Clean log |

### 3.4 Accessibility Verification

| # | Check | Method |
|---|-------|--------|
| 33 | Tab key opens/closes panel | Manual |
| 34 | Arrow keys navigate between cards | Manual |
| 35 | Enter/Space activates clickable cards | Manual |
| 36 | Enter/Space on blocked cards does nothing | Manual |
| 37 | Escape closes panel, focus returns to bell | Manual |
| 38 | Focus ring visible on all focusable elements | Visual |
| 39 | Screen reader announces panel role and count | Manual (screen reader) |
| 40 | Screen reader announces card state (read/unread/blocked) | Manual (screen reader) |
| 41 | Live region announces count changes | Manual (screen reader) |
| 42 | Touch targets are ≥44x44px | Dev tools inspection |
| 43 | WCAG AA contrast on all text | Contrast checker |
| 44 | `prefers-reduced-motion` disables animations | Dev tools emulation |
| 45 | 200% zoom is usable without horizontal scroll | Browser zoom test |

### 3.5 Mobile Verification

| # | Check | Method |
|---|-------|--------|
| 46 | Bottom sheet appears on screens < 768px | Resize/dev tools |
| 47 | Swipe down dismisses sheet | Manual on device |
| 48 | Close button dismisses sheet | Manual |
| 49 | Tap outside sheet dismisses it | Manual |
| 50 | Scrolling within sheet does not dismiss it | Manual |
| 51 | Sheet does not block page scroll when closed | Manual |

### 3.6 Behavioral Verification

| # | Check | Method |
|---|-------|--------|
| 52 | Student role: bell is clickable, opens panel/correctly navigates | Manual |
| 53 | Non-student role: bell is disabled with tooltip | Manual |
| 54 | Unread cards visually distinguished from read cards | Visual |
| 55 | Badge count matches unread count | Manual |
| 56 | "Mark all as read" updates badge count | Manual |
| 57 | Blocked cards show reason text and are non-clickable | Manual |
| 58 | Empty state shown when no notifications | Manual |
| 59 | Error state shown when loading fails (if applicable) | Manual |
| 60 | No PII visible in notification content or URLs | Manual |

## 4. Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| QA Lead | | | [ ] |
| Design Lead | | | [ ] |
| Accessibility Lead | | | [ ] |
| Tech Lead | | | [ ] |

## 5. Known Limitations

- Read/unread state does not persist across page reloads (by design at this stage).
- No real backend API for notification data — mock data only.
- Touch device testing requires physical device or browser devtools device emulation.
- Screen reader testing requires NVDA, VoiceOver, or TalkBack.