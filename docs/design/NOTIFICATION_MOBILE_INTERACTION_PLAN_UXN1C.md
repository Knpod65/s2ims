# Notification Mobile Interaction Plan UX-N1C

## Overview

This document defines the mobile interaction patterns for the notification dropdown/list UI. On mobile devices, the notification panel transforms from a desktop dropdown into a bottom sheet or slide-up panel for improved usability on small screens.

## 2. Mobile Panel Behavior

### 2.1 Trigger

- The notification bell in the Topbar triggers the mobile panel.
- Same bell behavior as desktop — disabled for non-student roles, clickable for students.

### 2.2 Panel Type: Bottom Sheet

- On screens narrower than **768px**, the panel renders as a **bottom sheet** that slides up from the bottom of the viewport.
- The sheet covers approximately **70–80%** of the viewport height.
- A semi-transparent overlay covers the background content.
- The sheet has a visible handle/drag indicator at the top for affordance.

### 2.3 Opening Animation

- The sheet slides up with a smooth transition (300ms ease-out).
- The overlay fades in simultaneously.
- If `prefers-reduced-motion` is set, no animation — the sheet appears instantly.

### 2.4 Closing

- **Swipe down**: The user can drag the sheet downward to dismiss. A partial swipe reveals the handle; releasing before a threshold snaps the sheet back. Swiping past the threshold closes the sheet.
- **Tap outside**: Tapping the overlay area dismisses the sheet and clears the overlay.
- **Escape key**: On hardware keyboards, Escape closes the sheet.
- **Item selection**: Selecting a notification dismisses the sheet after navigation (same as desktop).

### 2.5 Preventing Accidental Dismissal

- The sheet should **not** close on scroll within the notification list. This prevents accidental dismissals while browsing notifications on mobile.
- Only intentional swipe-to-dismiss gestures or taps outside dismiss the sheet.

## 3. Mobile Layout

### 3.1 Header

```
┌────────────────────────────────┐
│  ✕ Close        Notifications  │
│  ───────────────────── handle  │
└────────────────────────────────┘
```

- A close button (✕) on the left.
- "Notifications" title centered.
- Handle indicator below the header (visual drag affordance).

### 3.2 Filter Bar (Optional)

```
┌────────────────────────────────┐
│  [All] [Unread] [Read]         │
└────────────────────────────────┘
```

- Tab-style filter bar if filter functionality is implemented.
- Active tab is visually highlighted.

### 3.3 Notification List

- Cards are stacked vertically with the same anatomy as desktop.
- Minimum card height: **56dp** for comfortable touch targets.
- Cards are full-width within the sheet.

### 3.4 Empty State (Mobile)

- Same copy as desktop, centered within the sheet.
- Uses the same illustration/icon.

## 4. Touch Targets

- Minimum touch target: **48x48 dp** (Material Design) or **44x44 CSS pixels** (Apple HIG).
- Maintain **8dp** minimum spacing between interactive elements.
- Cards are tappable as a whole unit — the entire card row is a touch target.

## 5. Gesture Specifications

| Gesture | Action |
|---------|--------|
| Tap on card | Navigate to notification target (if clickable) |
| Tap on close button | Dismiss sheet |
| Tap on overlay | Dismiss sheet |
| Swipe down on handle | Partial reveal or dismiss (velocity-based) |
| Scroll within list | Scroll through notifications (sheet stays open) |
| Escape key | Dismiss sheet |

## 6. Interaction Differences: Desktop vs Mobile

| Aspect | Desktop | Mobile |
|--------|---------|--------|
| Panel type | Dropdown anchored to bell | Bottom sheet from screen bottom |
| Width | ~400px or bell-width | Full viewport width |
| Height | Up to ~400px, scrollable | ~70-80vh, scrollable |
| Dismissal | Light dismiss, Escape, item select | Swipe down, overlay tap, Escape, item select |
| Card width | Fixed panel width | Full sheet width |
| Touch targets | Standard (44px) | Same, but with more generous spacing |

## 7. Accessibility Considerations for Mobile

- The bottom sheet has `role="dialog"` and `aria-modal="true"`.
- Focus is trapped within the sheet while open.
- The close button is the first focusable element when the sheet opens.
- Swipe-to-dismiss does not interfere with screen reader navigation.
- When the sheet closes, focus returns to the bell button.

## 8. Performance

- The sheet content should be rendered (or ready to render) before the user opens it — avoid loading delays on open.
- If loading is needed, show a skeleton state within the sheet while data loads.
- Do not re-fetch data on every sheet open — use cached data from the current session.