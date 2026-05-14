# Notification Card, Empty State, and Blocked State Guide UX-N1C

## Overview

This document defines the anatomy of notification cards, the empty state, the blocked navigation state, and error states for the notification dropdown/list UI. It establishes consistent presentation across all roles and notification types.

## 2. Notification Card Anatomy

All notification cards share a common structure. Variants differ in styling and interactivity based on notification state and user role.

### 2.1 Card Structure

```
┌─────────────────────────────────────────────────┐
│  [SEVERITY DOT]  Title                          │
│                  Body / Summary text             │
│                  ─────────────────────           │
│                  [Action Label]  →  (if clickable)│
└─────────────────────────────────────────────────┘
```

### 2.2 Card Fields

| Field | Source | Type | Display Rule |
|-------|--------|------|-------------|
| **Severity indicator** | `severity` | Inline dot or icon | Always shown. Color-coded: `info` = blue, `low` = gray, `medium` = amber, `high` = orange, `critical` = red. |
| **Title** | `title` (EN/TH) | Text | Always shown. Single line, truncated with ellipsis if overflow. |
| **Body** | `body` (EN/TH) | Text | Shown below title. Maximum 2 lines, truncated with ellipsis. |
| **Timestamp** | `createdAt` | Relative/absolute | Shown below body or to the right. Relative: "2 hours ago", "3 days ago". Absolute fallback for old items. |
| **Action label** | `presenterOutput.actionLabel` | Text/link | Only shown for clickable items. Rendered as a link or small button. |
| **Read/unread indicator** | `is_read` | Visual marker | Unread cards get a bold left-border accent (3px, blue) and slightly bolder text. Read cards have normal opacity. |
| **Navigation arrow** | Conditional | Icon | Only shown for clickable items. A small right-arrow/chevron icon aligned to the right edge. |
| **Blocked reason** | `presenterOutput.disabledReason` | Text | Only shown for blocked/non-clickable items. Rendered below the title in muted text. |

### 2.3 Card Dimensions

- **Desktop**: Full panel width, minimum 48px height per card.
- **Mobile**: Full sheet width, minimum 56px height per card (larger touch target).
- **Padding**: 12px vertical, 16px horizontal (desktop); 16px vertical, 16px horizontal (mobile).
- **Spacing**: 8px between cards.

### 2.4 Card Variants

#### 2.4.1 Clickable Card (Default)

- Normal background, hover state with subtle background change.
- Left-border accent for unread variant.
- Right-arrow icon visible on hover.
- Cursor: pointer.

#### 2.4.2 Unread Card

- Left-border accent: 3px solid in primary color.
- Title text: slightly bolder weight.
- Background: same as default, no special fill.

#### 2.4.3 Read Card

- Normal opacity.
- No left-border accent.
- No hover effect (if purely informational).

#### 2.4.4 Blocked / Non-Clickable Card

- Muted styling: reduced opacity, gray text.
- No hover effect, no cursor change.
- No right-arrow icon.
- `disabledReason` text shown below the title in a muted, smaller font.
- `cursor: not-allowed` or `cursor: default`.

## 3. Empty State

Shown when there are no notifications to display.

### 3.1 Visual

- Centered in the panel.
- An illustration or icon (not raw text only). Use a bell icon with a line through it or a simple "no items" illustration.
- Minimum size: 64x64px icon area.

### 3.2 Copy

**English:**
- **Headline:** "No notifications"
- **Description:** "You're all caught up. New notifications will appear here."

**Thai:**
- **Headline:** "ไม่มีการแจ้งเตือน"
- **Description:** "ทุกอย่างทันสมัยแล้ว การแจ้งเตือนใหม่จะปรากฏที่นี่"

### 3.3 Rules

- Do not claim "no new activity" — use notification-specific language.
- Do not reference "audit" or "official records" in empty states.
- Keep the tone encouraging, not clinical.

## 4. Blocked State (Individual Card)

When a notification cannot be navigated to, the card shows a blocked state.

### 4.1 Blocked Reasons and Copy

| Reason Code | English | Thai |
|-------------|---------|------|
| `unknown_route` | "This notification target is not available." | "ไม่พบปลายทางของการแจ้งเตือนนี้" |
| `missing_param` | "This notification is missing a safe target." | "การแจ้งเตือนนี้ไม่มีปลายทางที่ปลอดภัยครบถ้วน" |
| `unsafe_param` | "This notification was blocked for privacy protection." | "การแจ้งเตือนนี้ถูกปิดกั้นเพื่อคุ้มครองข้อมูลส่วนบุคคล" |
| `role_scope_mismatch` | "This item is not available from your current workspace." | "รายการนี้ไม่สามารถเปิดได้จากพื้นที่ทำงานปัจจุบัน" |
| `permission_mismatch` | "You may not have permission to open this item." | "คุณอาจไม่มีสิทธิ์เปิดรายการนี้" |
| `route_not_allowed_for_role` | "This route is not available for your current role." | "เส้นทางนี้ไม่พร้อมใช้งานสำหรับบทบาทปัจจุบัน" |
| `not_clickable` | "This notification is informational only." | "การแจ้งเตือนนี้เป็นข้อมูลเท่านั้น" |

### 4.2 Display Rule

- The reason text is shown below the card title in gray, smaller font (12px or equivalent).
- No arrow icon is shown.
- The card remains visible in the list but visually de-emphasized.

## 5. Loading State

- When the panel opens, show a skeleton or spinner at the top of the list area.
- Do not block the entire page — the panel overlays content.
- The panel opens with the loading indicator already visible.
- Skeleton: 3 placeholder rows matching the card height.

## 6. Error State

- If data loading fails, show a brief inline error within the panel.
- Provide a retry button.
- Do not crash the page or show raw error dumps.
- Do not reference URLs or technical error details to the user.

**English error copy:** "Unable to load notifications. Please try again."
**Thai error copy:** "ไม่สามารถโหลดการแจ้งเตือนได้ กรุณาลองอีกครั้ง"

## 7. Footer Actions

If there are unread items, show a footer with:

- **"Mark all as read"** / **"ล้างทั้งหมด"** button.
- This action affects local state only (no persistence at this stage).

If all items are read:

- Footer is not required, or shows a simple count: "3 notifications."

## 8. Role-Based Display Rules

| Role | Card Display |
|------|-------------|
| Student | Full cards with all fields, clickable per navigation rules. |
| Staff (informational) | If no staff-specific notifications, show empty state with "No notifications" copy. |
| Admin (informational) | Same as staff. |
| Provider (informational) | Same as staff, with "Not available from current workspace" if needed. |
| Executive/ESQ (informational) | Same as provider. |

Non-student roles see a disabled bell. If the panel opens for non-student roles, it should show a brief informational message, not an empty list.