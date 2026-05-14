# Notification UI Accessibility QA UX-N1

## 1. Purpose

This document defines future QA expectations for clickable notification UI.

UX-N1 does not implement clickable notification behavior.

## 2. Current Issue To Verify

Current visible issue:

- The Topbar notification bell shows unread count but does not navigate.
- The Student notifications page supports card click through `action_url`, but it does not use a shared route/permission/privacy resolver.

## 3. Future Clickable-State Checklist

- [ ] Notification visually indicates clickability.
- [ ] Click target has button or link semantics.
- [ ] Disabled notification target communicates why it cannot open.
- [ ] Notification body and title remain readable in Thai and English.
- [ ] Badge count remains accurate after read-state changes.
- [ ] Read/unread update does not require full reload.

## 4. Keyboard Accessibility

- [ ] Enter works for link-style notification targets.
- [ ] Space works if the notification is rendered as a button.
- [ ] Focus ring is visible.
- [ ] Focus order is logical from Topbar to menu/list to individual item.
- [ ] Escape closes notification popover/drawer if one exists.

## 5. Screen Reader Labels

- [ ] Bell announces unread count.
- [ ] Notification item announces title, severity, time, and action label.
- [ ] Disabled/blocked item announces safe unavailable state.
- [ ] Mock/demo audit notifications do not announce "official audit record".

## 6. Mobile/Touch Targets

- [ ] Touch target is at least 44px.
- [ ] Mobile layout does not overlap sticky bottom nav.
- [ ] Notification popover/list is scrollable without trapping the page.
- [ ] Tap outside behavior is predictable.
- [ ] Long Thai text wraps cleanly.

## 7. Loading/Error States

- [ ] Pending route resolution shows non-blocking loading state.
- [ ] Broken route does not crash app.
- [ ] Missing target shows safe fallback.
- [ ] Permission-denied state does not reveal target existence.

## 8. Permission-Denied State

Safe blocked copy:

- "This item is not available from your current workspace."
- "You may not have permission to open this item."

Avoid:

- "Application app_002 exists but is forbidden."
- "Student S-2345 cannot be opened."

## 9. Read/Unread State

- [ ] Read state updates without full reload.
- [ ] Failed navigation does not accidentally mark sensitive notification as read unless approved.
- [ ] Mark all read remains available and keyboard accessible.

## 10. Dev Log Checks

Future runtime QA should check:

- No hydration error.
- No duplicate key warning.
- No chunk error.
- No unsupported `use(params)` error.
- No 404/500 caused by notification route resolution.

## 11. Regression Checks

- [ ] Existing Student notifications page still works.
- [ ] Topbar badge count still renders.
- [ ] Toast behavior unchanged.
- [ ] Admin audit mock/demo copy remains safe.
- [ ] Staff document audit warnings remain unchanged.
- [ ] Provider, Admin, Staff, Student, ESQ route guards remain unchanged.
