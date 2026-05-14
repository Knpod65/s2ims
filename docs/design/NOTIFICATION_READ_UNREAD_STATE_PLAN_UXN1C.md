# Notification Read/Unread State Plan UX-N1C

## Overview

This document defines how read/unread state for notifications is handled in the UX-N1C planning phase. **No persistence is implemented at this stage.** All state management is local and mock-only.

## 2. Current State

- `mockNotifications` in `src/data/mock/notifications.ts` includes an `is_read` boolean on each item.
- Unread count is calculated as `mockNotifications.filter(n => !n.is_read).length`.
- The Topbar bell badge reflects this count.
- State resets on page reload — there is no persistence layer.

## 3. Read/Unread in the Dropdown (Local State)

### 3.1 Toggle Behavior

- When the user clicks a notification card in the dropdown, it should **not** automatically mark as read.
- Explicit action is required: the user toggles read/unread via a dedicated UI control (e.g., a checkbox, tap on a read/unread indicator, or a "Mark as read" action on the card).
- This design choice prevents accidental state changes during navigation.

### 3.2 Mark All as Read

- A "Mark all as read" / "ล้างทั้งหมด" action is available in the panel footer when unread items exist.
- This sets all visible items' `is_read` to `true` in local state.
- The badge count updates immediately.
- State does not survive page reload.

### 3.3 Individual Toggle

- Each card has an individual read/unread toggle (e.g., clicking a dot or icon).
- Toggling a single item updates the badge count incrementally.
- Visual feedback occurs immediately (bold/accent removed or applied).

## 4. State Shape

```typescript
interface NotificationReadState {
  // Keyed by notification id
  [notificationId: string]: boolean // true = read, false = unread
}
```

- Default state is derived from `mockNotifications[].is_read`.
- Changes are stored in React state (or a simple store) for the current session only.

## 5. Deferred Persistence

### 5.1 Future Implementation

When persistence is approved, the following architecture is recommended:

- A **`NotificationReadStateService`** handles batch read/unread operations.
- Read state changes go through the service boundary, not inline in components.
- The service writes to a backend API endpoint (to be designed).
- State survives page reload once the backend is connected.

### 5.2 Constraints for Future Work

- Do **not** infer read state from URL clicks — explicit action required.
- Do **not** auto-mark as read when a card is clicked for navigation.
- Do **not** persist read state to `localStorage` at this stage — it will be handled in a dedicated persistence phase.

## 6. Acceptance Criteria (Planning Phase)

- [ ] Read/unread toggle UI is specified in design docs.
- [ ] Badge count updates on local state change.
- [ ] "Mark all as read" action is specified.
- [ ] No persistence is implemented at this stage.
- [ ] Read/unread state does not survive page reload (explicitly by design).
- [ ] Future persistence is scoped to a dedicated service, not inline.