# Notification Accessibility Review UX-N1C

## Overview

This document specifies accessibility requirements for the notification dropdown/list UI planned in UX-N1C. It covers keyboard interaction, screen reader behavior, focus management, touch targets, and ARIA semantics.

These requirements apply to the future `NotificationDropdown` component and any notification list surfaces that render notification cards.

## 2. Keyboard Navigation

### 2.1 Focus Trap Within Panel

When the notification panel is open (desktop dropdown or mobile bottom sheet), focus is trapped within the panel. Pressing Tab at the last interactive element returns focus to the first interactive element. Pressing Shift+Tab at the first element returns to the last.

### 2.2 Arrow Key Navigation

- Up/Down arrow keys move focus between notification cards in the list.
- Focus moves to the next/previous card regardless of card variant (clickable, read, blocked).
- If the list is empty, no arrow key behavior applies.

### 2.3 Activation

- Enter or Space on a focused clickable card triggers navigation via `notificationNavigationService.resolve()`.
- Enter or Space on a focused non-clickable card is ignored (no action, preventDefault).
- The focused card must be visually indicated with a focus ring (CSS `:focus-visible`).

### 2.4 Escape

- Escape closes the panel.
- Focus returns to the triggering bell button.
- If a search/filter input exists within the panel, Escape from the input does not close the panel; it clears the input or moves focus out of the input.

### 2.5 Home / End

- Home moves focus to the first notification card in the list.
- End moves focus to the last notification card in the list.

### 2.6 Page-Level Keyboard

When the panel is closed, Tab order resumes normal page flow. The bell button remains in the natural tab order of the Topbar.

## 3. Screen Reader Behavior

### 3.1 Bell Button (Trigger)

```html
<button
  aria-label="Notifications: 3 unread"
  aria-haspopup="dialog"
  aria-expanded="true|false"
  aria-controls="notification-panel"
>
```

- `aria-haspopup="dialog"` indicates the panel is a dialog-like overlay.
- `aria-expanded` reflects the current open/closed state.
- `aria-controls` points to the panel's `id`.
- The unread count is announced as part of the label.

### 3.2 Panel (Dropdown / Bottom Sheet)

```html
<div
  id="notification-panel"
  role="dialog"
  aria-modal="true"
  aria-label="Notifications"
>
```

- `role="dialog"` indicates an overlay panel.
- `aria-modal="true"` prevents screen readers from interacting with background content.
- `aria-label` provides a descriptive title for the panel.

### 3.3 Notification List

```html
<ul role="list" aria-label="Notification items">
  <li role="listitem" tabindex="0">...</li>
  <li role="listitem" tabindex="-1">...</li>
</ul>
```

- Use a semantic list (`<ul>`/`<li>`) for the notification items.
- Focusable items have `tabindex="0"`.
- Non-interactive items (blocked, read-only) may use `tabindex="-1"` if they are included for screen reader context but should not be focusable via Tab.

### 3.4 Individual Card

```html
<li
  role="listitem"
  tabindex="0"
  aria-label="New scholarship you may qualify for, unread, clickable"
  aria-describedby="card-desc-n1"
>
  <span id="card-desc-n1" class="sr-only">
    Clickable. Press Enter to navigate.
  </span>
</li>
```

- Announce card state (read/unread/blocked) via `aria-label` or visually hidden text.
- For non-clickable cards: "Blocked: This notification is informational only."
- For unread cards: include "unread" in the accessible label.

### 3.5 Live Region for State Changes

```html
<div aria-live="polite" id="notification-status">
  3 unread notifications
</div>
```

- When the user marks items as read/unread, announce the updated count via a live region.
- When the panel opens, announce the number of items: "3 notifications available."
- When the panel closes, no announcement needed.

## 4. ARIA Attributes Summary

| Element | Attribute | Value |
|---------|-----------|-------|
| Bell button | `aria-haspopup` | `"dialog"` |
| Bell button | `aria-expanded` | `"true"` / `"false"` |
| Bell button | `aria-controls` | `"notification-panel"` |
| Panel container | `role` | `"dialog"` |
| Panel container | `aria-modal` | `"true"` |
| Panel container | `aria-label` | `"Notifications"` |
| Card list | `role` | `"list"` |
| Card item | `role` | `"listitem"` |
| Clickable card | `tabindex` | `"0"` |
| Non-clickable card | `tabindex` | `"-1"` |
| Status announcer | `aria-live` | `"polite"` |

## 5. Touch Target Sizes

- Minimum touch target: **44x44 CSS pixels** (Apple HIG) or **48x48 dp** (Material).
- On mobile bottom sheet, each notification card should be at least 48dp tall.
- Tap targets must not overlap; maintain at least 8dp spacing between cards.

## 6. Color and Contrast

- All text must meet **WCAG AA** contrast ratio: **4.5:1** for normal text, **3:1** for large text (18px+ or 14px bold).
- Status indicators (severity dots, read/unread badges) must not rely solely on color — pair with text or icon.
- Focus ring must be visible against the panel background with at least **3:1** contrast.

## 7. Reduced Motion

- If the user has `prefers-reduced-motion` enabled, disable panel open/close animations.
- If the user has `prefers-reduced-transparency` enabled, avoid translucent panel backgrounds.

## 8. Zoom and Scaling

- The panel must remain usable at **200% browser zoom** without horizontal scrolling.
- Text must reflow within the panel at increased zoom levels.
- Touch targets must remain at least 44x44 CSS pixels at any zoom level.

## 9. RTL Support

- The panel should mirror layout for RTL languages (Thai context: not needed for Thai, but relevant for Arabic or Hebrew future support).
- Focus traversal order should follow visual order.

## 10. Testing Checklist

| Test | Expected Result |
|------|----------------|
| Tab to bell button, press Enter/Space | Panel opens, focus moves into panel |
| Arrow keys inside panel | Focus moves between cards |
| Enter/Space on clickable card | Navigation triggered |
| Enter/Space on blocked card | Nothing happens |
| Escape key | Panel closes, focus returns to bell |
| Screen reader reads panel | Role, label, and item count announced |
| Screen reader reads each card | State (read/unread/blocked) announced |
| Mark-as-read action | Live region announces updated count |
| Touch target inspection | Minimum 44x44px on all interactive elements |
| Color contrast check | WCAG AA pass on all text and UI elements |
| Prefers-reduced-motion | Animations disabled |
| 200% zoom | No horizontal scroll, all content accessible |