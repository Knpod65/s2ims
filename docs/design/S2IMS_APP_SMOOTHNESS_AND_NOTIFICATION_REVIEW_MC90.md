# S²IMS App Smoothness & Notification Bell Review — MC90

**Date**: 2026-05-23

---

## Artificial Delay Scan

Login delay was removed in MC89. Remaining delays in non-login pages:

| File | Line | Delay | Action |
|------|------|-------|--------|
| `src/app/student/profile/page.tsx` | 104 | 600ms | Documented — MC91 candidate |
| `src/app/student/applications/new/page.tsx` | 76 | 1000ms | Documented — MC91 candidate |
| `src/app/admin/settings/page.tsx` | 23 | 700ms | Documented — MC91 candidate |
| `src/app/admin/export/page.tsx` | 51 | 600ms | Documented — MC91 candidate |
| `src/app/staff/ocr/page.tsx` | 28, 30 | 1500ms | Documented — MC91 candidate |
| `src/app/staff/announcements/[id]/preview/page.tsx` | 24, 33 | 700ms / 1500ms | Documented — MC91 candidate |
| `src/components/ui/Toast.tsx` | 29 | 3500ms | Standard — keep |

**MC90 action**: None. Touching multiple non-login pages is out of scope for this MC.  
**MC91 recommendation**: Reduce 1000–1500ms delays to 200–400ms for snappier UX.

---

## Loading State Scan

No stuck loading states found in login flow. Auth is synchronous mock — no async loading risk.

---

## Route Smoke (Static Build)

All 42 routes pass Next.js static generation. No route failures detected.

Key routes verified:
- `/login` — ✅
- `/admin/audit-log` — ✅
- `/admin/dashboard` — ✅
- `/staff/applications` — ✅
- `/staff/applications/app_001` — ✅
- `/staff/applications/app_002` — ✅
- `/admin/candidate-review-demo` — ✅
- `/admin/master-data/import-preview` — ✅

---

## Notification Bell Findings

**Component**: `src/components/layout/Topbar.tsx`  
**Current behavior**: Reads unread count from static `mockNotifications` import. Count is fixed at 3 (initial mock data) and never updates at runtime. Bell click navigates to role-specific notifications page.

**Infrastructure already in place**:
- `is_read` field defined in `src/lib/types.ts` (Notification type)
- Mock data includes mix of read/unread (`src/data/mock/notifications.ts`)
- Student notifications page has local `markRead` / `markAllRead` handlers

**Gap**: No shared state between Topbar and notification pages. Marking a notification as read on the page does not reduce the Topbar badge count.

**MC90 decision**: **Deferred to MC91**  
**Reason**: Requires a shared notification context/store wired to both Topbar and all notification pages — medium complexity, out of MC90's minimal-change scope.

---

## Notification Fix — MC91 Scope Preview

For MC91, the recommended approach:
1. Create `src/lib/notification-context.tsx` — shared state initialized from `mockNotifications`
2. Wrap AppShell with `NotificationProvider`
3. Topbar consumes context for `unread` count
4. Notification pages consume context for `markRead` / `markAllRead`
5. Zero persistence, zero API calls — purely in-memory mock state

---

## Laravel / PHP Dry Detection

- `artisan`: NOT FOUND
- `composer.json`: NOT FOUND
- `routes/web.php`: NOT FOUND
- `routes/api.php`: NOT FOUND

Confirmed: S2IMS is a Next.js App Router project only.
