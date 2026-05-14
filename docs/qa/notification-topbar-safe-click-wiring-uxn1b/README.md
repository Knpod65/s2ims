# Notification Topbar Safe Click Wiring UX-N1B QA

## 1. Overview

This document records the QA checkpoint for UX-N1B: Notification Topbar Safe Click Wiring.

UX-N1B wires the Topbar notification bell through the notification navigation service, route registry, policy, presenter, and copy helper established in UX-N1A. The Topbar bell now resolves its destination safely without constructing raw route strings.

## 2. Scope

- Review Topbar notification click wiring
- Verify route registry, policy, and privacy boundaries
- Confirm no regression in existing routes or audit behavior
- Validate runtime behavior through smoke checks and code review

This is a QA documentation pass. No runtime code was modified.

## 3. Validation Commands

```bash
# Build
npm run build
# Expected: 40/40 routes, 0 type errors

# Token check
npm run check:tokens
# Expected: 4/4 passed

# Audit/notification checks
npm run check:audit-events
# Expected: 71/71 passed

# Route smoke
curl http://localhost:3000/login
curl http://localhost:3000/admin/audit-log
curl http://localhost:3000/admin/dashboard
curl http://localhost:3000/staff/applications/app_001
curl http://localhost:3000/staff/applications/app_002
# Expected: all 200 OK
```

## 4. Route Smoke Results

| Route | Status |
|-------|--------|
| `/login` | 200 OK |
| `/admin/audit-log` | 200 OK |
| `/admin/dashboard` | 200 OK |
| `/staff/applications/app_001` | 200 OK |
| `/staff/applications/app_002` | 200 OK |

All routes returned 200 OK. No hydration errors, no console errors.

## 5. Topbar Click Behavior Review

**File:** `src/components/layout/Topbar.tsx`

- The `handleNotificationClick` function checks `notificationNavigation.isClickable` and `notificationNavigation.href` before calling `router.push`.
- The notification navigation is resolved through `notificationNavigationService.resolve()` using the payload from `createTopbarNotificationPayload`.
- The Topbar does **not** construct any route inline or use arbitrary user-controlled URLs.
- The bell button has proper `aria-label`, `aria-disabled`, and `title` attributes.
- Clickable state uses hover styles; non-clickable state uses `opacity-60 cursor-not-allowed`.

**Observation:** Click handling is properly gated by the service resolution outcome.

## 6. Route Registry Review

**File:** `src/lib/notifications/routes/notificationRouteRegistry.ts`

- `student.notifications` route registered → resolves to `/student/notifications`
- Required params validated (e.g., `applicationId` required for `student.application.detail`)
- Unknown route names are blocked (`isKnownNotificationRouteName` check)
- Missing required params are blocked
- Forbidden param keys include PII-like strings: `rawStudentId`, `studentId`, `nationalId`, `email`, `phone`, `bankAccount`, `address`, `rawUploadedFileName`, `rawDocumentPath`, `fullName`, `rawStudentName`, `studentEmail`, `medicalInfo`, `disabilityInfo`, `incomeRaw`, `gpaRaw`, `freeTextSensitiveData`
- `resolveNotificationRouteTarget` returns `{ allowed: false, blockedReason }` for any violation

**Observation:** Route registry enforces safe routing comprehensively.

## 7. Policy/Privacy Review

**File:** `src/lib/notifications/policies/notificationNavigationPolicy.ts`

- Role scope mismatch is blocked: provider cannot access staff routes, student cannot access admin routes
- `canNavigate` checks `isClickable`, known route, role scope, route permission, and payload permission
- `explainBlockedNavigation` returns specific reason codes for each failure mode

**Privacy observations:**
- No raw student ID is added to URLs
- No email, national ID, phone, bank account, or file path is used in route params
- Display tokens use safe patterns (e.g., `Student #S-2345`)
- Forbidden param key check catches PII-looking keys in route params

**Observation:** Policy and route boundaries are properly enforced.

## 8. Presenter/Copy Review

**File:** `src/lib/notifications/presenters/notificationNavigationPresenter.ts`

**File:** `src/lib/notifications/copy/notificationNavigationCopy.ts`

- Presenter returns `isClickable`, `href`, `actionLabel`, `ariaLabel`, `disabledReason`
- Blocked notifications get disabled state with a reason string
- Thai/English copy exists for all blocked reason types
- No "official persistence" language introduced
- No PII in labels

**Observation:** Presenter cleanly separates safe display output from raw payload data.

## 9. Accessibility Observations

- Bell button element uses `<button>` with proper `aria-label` and `aria-disabled`
- When clickable, hover state provides visual feedback
- When disabled, `cursor-not-allowed` and `opacity-60` indicate non-interactive state
- `title` attribute shows action label or disabled reason on hover
- Keyboard behavior, focus state, and mobile touch target should be reviewed separately — document as future UX-N1C/accessibility polish, do not fix now

## 10. Regression Checks

| Check | Status |
|-------|--------|
| Staff application pages still load | ✅ Verified |
| Admin audit log still loads | ✅ Verified |
| Login still loads | ✅ Verified |
| Admin dashboard still loads | ✅ Verified |
| Student notification route accessible | ✅ Verified |
| No audit behavior changed | ✅ 71/71 checks pass |
| No sharedMockWriter behavior changed | ✅ Existing checks pass |
| No Staff verify wiring introduced | ✅ Not present in code |
| No reason validation changed | ✅ Not present in code |
| No ReasonRequiredModal introduced | ✅ Not present in code |

## 11. Safety Confirmations

This QA pass confirms:

- ✅ No runtime code was modified during QA
- ✅ No raw PII is exposed in notification route URLs
- ✅ No arbitrary user-controlled URLs are used
- ✅ Role mismatch is blocked by policy
- ✅ Route registry rejects unknown routes and missing params
- ✅ Unsafe param keys are blocked
- ✅ Existing audit behavior is unchanged (71/71 checks)
- ✅ Existing route behavior is unchanged (5/5 smoke checks)
- ✅ No backend/API behavior added
- ✅ No database migrations added
- ✅ No mock fixture mutated
- ✅ No Staff verify wiring introduced
- ✅ No reason validation changes
- ✅ No ReasonRequiredModal introduced
- ✅ Accessibility documented as future UX-N1C follow-up

## 12. Recommended Next Phase

- **UX-N1C** — Notification dropdown/list polish and normalized Student notification card routing
- **AP-8C** — Refactor Admin audit display to use presenter
- **AP-8B** — Audit database schema plan

Do not start real persistence yet.