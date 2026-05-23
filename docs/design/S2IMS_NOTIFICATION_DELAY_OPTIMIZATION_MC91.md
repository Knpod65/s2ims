# S²IMS Notification Read-State & Delay Optimization — MC91

**Date**: 2026-05-23  
**Branch**: perf/s2ims-full-app-mock-excellence-mc91

---

## Problem Statement

### 1. Notification Bell Count Never Updates

**Symptom**: The Topbar bell badge shows "3" regardless of user action. Reading all notifications on the student notifications page has no effect on the badge.

**Root cause**: `Topbar.tsx` computed unread count from a static module import:

```tsx
import { mockNotifications } from '@/data/mock/notifications'
const unread = mockNotifications.filter((n) => !n.is_read).length
```

This value is computed once at module evaluation time. No React state, no context, no subscription. The student notifications page had its own isolated `useState(mockNotifications)` — updates to that state were invisible to Topbar.

### 2. Excessive Mock Delays

Eight `setTimeout` delays across 6 pages ranged from 600ms to 1500ms. These simulate "server round-trips" in a fully client-side mock that has no real latency. The result is a sluggish prototype that does not reflect real UX quality.

---

## Solution

### NotificationProvider Context

A new `src/lib/notification-context.tsx` provides shared in-memory notification state:

- `notifications: Notification[]` — array initialized from `mockNotifications`
- `unread: number` — derived count, reactive
- `markRead(id)` — marks one notification read, updates state
- `markAllRead()` — marks all read, updates state

Zero persistence. Zero API. Zero localStorage writes. Pure React in-memory state that resets on page refresh — correct prototype behavior.

**Provider placement**: Inside `AppShell`, after `ToastProvider`. All authenticated content renders inside `AppShell`, so `useNotifications()` is available everywhere in the app shell tree.

**Notifications page pattern**: The page-level component cannot call `useNotifications()` because it renders `AppShell` (the provider) in its return. An inner `NotificationsContent` component is rendered as a child of `AppShell` — this component safely calls `useNotifications()` and `useToast()`.

### Delay Reduction Table

| File | Old | New | Reduction |
|------|-----|-----|-----------|
| `student/profile/page.tsx` | 600ms | 200ms | −67% |
| `student/applications/new/page.tsx` | 1000ms | 300ms | −70% |
| `admin/settings/page.tsx` | 700ms | 200ms | −71% |
| `admin/export/page.tsx` | 600ms | 200ms | −67% |
| `staff/ocr/page.tsx` (outer) | 800ms | 400ms | −50% |
| `staff/ocr/page.tsx` (inner) | 1500ms | 400ms | −73% |
| `staff/announcements/preview` (publish) | 700ms | 200ms | −71% |
| `staff/announcements/preview` (redirect) | 1500ms | 400ms | −73% |

Toast auto-dismiss (3500ms in `Toast.tsx:29`) is unchanged — standard UX convention.

---

## Before / After

| Scenario | Before | After |
|----------|--------|-------|
| Student reads notification | Bell badge stays at 3 | Bell badge decreases; zero → badge disappears |
| Mark all read on notifications page | Bell stays at 3 | Bell immediately shows 0 |
| Profile save | 600ms wait | 200ms wait |
| Application submit | 1000ms wait | 300ms wait |
| OCR job complete | 800ms + 1500ms = 2.3s total | 400ms + 400ms = 800ms total |

---

## Files Modified

| File | Change |
|------|--------|
| `src/lib/notification-context.tsx` | NEW — NotificationProvider + useNotifications |
| `src/components/layout/AppShell.tsx` | Add NotificationProvider wrapper |
| `src/components/layout/Topbar.tsx` | Replace static import with `useNotifications().unread` |
| `src/app/student/notifications/page.tsx` | Inner component pattern; use context state |
| 6 pages with delays | setTimeout values reduced |
