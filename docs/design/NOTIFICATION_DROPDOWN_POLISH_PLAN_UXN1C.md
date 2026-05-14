# Notification Dropdown Polish Plan UX-N1C

## 1. Overview

UX-N1C is a documentation-only planning phase for polishing the notification dropdown/list UX after UX-N1B Topbar safe click wiring. It defines how the notification dropdown behavior, accessibility, mobile interaction, read/unread state, empty state, blocked navigation copy, and Student notification card consistency should be improved.

UX-N1B made the Topbar notification bell safely clickable through the navigation service/policy/registry/presenter chain. UX-N1C plans the next layer of polish: a proper dropdown panel, accessible keyboard interaction, mobile-optimized display, and consistent card/empty/blocked states.

## 2. Current State After UX-N1B

- Topbar bell navigates to `/student/notifications` for Student role
- Non-student roles (staff, admin, provider, executive, esq) see a disabled bell with a tooltip
- The notification navigation service, route registry, policy, presenter, and copy helpers are in place as skeletons
- No dropdown/panel/list UI exists yet — the bell goes directly to the Student notifications page
- Mock notifications exist in `src/data/mock/notifications.ts` with `action_url` fields
- No backend notification persistence or read/unread state API exists

## 3. Problem Statement

Current UX gaps:

1. **No dropdown**: Clicking the bell goes to a full page. A lightweight dropdown/panel would be faster for triage.
2. **No keyboard accessibility**: The bell button works but the destination page has no documented keyboard navigation pattern.
3. **No mobile optimization**: On mobile, the full notifications page may not be the best interaction model.
4. **Inconsistent card states**: The Student notifications page uses direct `action_url` from mock data. Other roles have no notification card UI.
5. **No empty state**: If there are no notifications, there is no empty-state illustration or messaging.
6. **No read/unread differentiation within the dropdown**: The badge count shows unread total, but individual items are not visually distinguished.
7. **Blocked navigation is silent**: When a non-student user clicks the bell, it shows a disabled state, but there is no in-context explanation of why or what they can do instead.

## 4. Design Goals

- Define a dropdown/panel component architecture that reuses existing notification navigation contracts
- Establish consistent card anatomy across all notification types
- Define accessible keyboard and screen reader interaction patterns
- Create mobile-first interaction patterns (bottom sheet or slide-up panel)
- Define empty state, loading state, and error state copy and visuals
- Keep read/unread state management in the planning stage (no persistence)
- Ensure all notification surfaces use the same presenter/copy boundary

## 5. Non-Goals

- **No runtime implementation** — this is documentation only
- **No backend/API** — no notification persistence or read-state API
- **No database migrations** — no schema changes
- **No real persistence** — read/unread state remains mock-only
- **No changes to existing notification click behavior** — UX-N1B wiring stays as-is
- **No new route changes** — existing routes remain unchanged
- **No PII exposure** — no raw identifiers in URLs or payloads
- **No audit behavior changes**
- **No ReasonRequiredModal**
- **No Staff verify wiring**
- **Do not start UX-N1C runtime** — this is planning only
- **Do not start AP-8B, AP-8C, AP-9**

## 6. Dropdown Behavior Model

### 6.1 Trigger

The notification bell in the Topbar triggers the dropdown. The bell already has `aria-label`, `aria-disabled`, and `title` attributes from UX-N1B.

### 6.2 Panel Positioning

- Desktop: Dropdown anchored to the bell button, opening downward (preferred) or upward if insufficient space
- Mobile: Full-width bottom sheet or slide-up panel (preferred over dropdown on small screens)
- Panel should not overlap the Topbar or page header

### 6.3 Panel Content

```
[Notification Panel]
├── Header: "Notifications" / "การแจ้งเตือน"
├── Filter bar (optional): All / Unread / Read tabs
├── Notification list (scrollable)
│   ├── NotificationCard (read)
│   ├── NotificationCard (unread — bold/accented)
│   ├── NotificationCard (blocked/disabled)
│   └── ...
├── Empty state (if no notifications)
├── Error state (if loading fails)
└── Footer: "Mark all as read" / "ล้างทั้งหมด" (if any unread exist)
```

### 6.4 Interaction Model

- Click/Tap on card → navigate via `notificationNavigationService.resolve()` → use resolved `href`
- Keyboard: Enter/Space on focused card triggers navigation if `isClickable`
- Escape closes the panel and returns focus to the bell button
- Tab/Shift+Tab cycles through cards within the panel
- Focus returns to the bell button when panel closes

### 6.5 Dismissal

- Click outside the panel (light dismiss)
- Escape key
- Selecting a notification item (auto-close after navigation)
- Do NOT close on scroll (to avoid accidental dismiss on mobile)

## 7. Notification Item Hierarchy

### 7.1 Priority Order

1. **Unread items** — displayed first, visually accented
2. **Recently read items** — displayed after unread, normal styling
3. **Older items** — chronological order within each group
4. **Blocked/disabled items** — shown last or filtered out depending on design decision

### 7.2 Card Fields

| Field | Source | Display Rule |
|-------|--------|-------------|
| Title | `payload.title` | Always shown |
| Body/summary | `payload.body` | Shown below title, truncated if long |
| Severity indicator | `payload.severity` | Color-coded dot or icon |
| Time/date | `payload.createdAt` | Relative (e.g., "2 hours ago") or absolute |
| Action label | `presenterOutput.actionLabel` | Shown as link/button text |
| Read/unread badge | Calculated from `readAt` | Dot, bold, or background accent |
| Navigation arrow | Conditional | Only shown for clickable items |

### 7.3 Card Variants

- **Clickable card**: Normal state, shows hover/active effects, has navigation arrow
- **Unread card**: Same as clickable but with bold text or left-border accent
- **Blocked card**: Grayed out, shows `disabledReason` on hover or below title, no arrow
- **Read card**: Normal opacity, no accent

## 8. Clickable vs Non-Clickable Item States

### 8.1 Clickable (allowed: true)

- Card uses interactive styling (hover background, pointer cursor)
- Enter/Space triggers navigation
- Shows right-arrow icon or chevron
- `href` is the resolved safe URL from the presenter output

### 8.2 Non-Clickable (allowed: false)

- Card uses muted styling (grayed text, no hover effect)
- `cursor-not-allowed` or default cursor
- No right-arrow icon
- `disabledReason` text shown below the title or as tooltip
- Enter/Space does nothing (preventDefault)

### 8.3 Blocked Reason Display

Use the `NotificationNavigationCopy` blocked reason strings:

| Reason | English | Thai |
|--------|---------|------|
| unknown_route | "This notification target is not available." | "ไม่พบปลายทางของการแจ้งเตือนนี้" |
| missing_param | "This notification is missing a safe target." | "การแจ้งเตือนนี้ไม่มีปลายทางที่ปลอดภัยครบถ้วน" |
| unsafe_param | "This notification was blocked for privacy protection." | "การแจ้งเตือนนี้ถูกปิดกั้นเพื่อคุ้มครองข้อมูลส่วนบุคคล" |
| role_scope_mismatch | "This item is not available from your current workspace." | "รายการนี้ไม่สามารถเปิดได้จากพื้นที่ทำงานปัจจุบัน" |
| permission_mismatch | "You may not have permission to open this item." | "คุณอาจไม่มีสิทธิ์เปิดรายการนี้" |
| route_not_allowed_for_role | "This route is not available for your current role." | "เส้นทางนี้ไม่พร้อมใช้งานสำหรับบทบาทปัจจุบัน" |
| not_clickable | "This notification is informational only." | "การแจ้งเตือนนี้เป็นข้อมูลเท่านั้น" |

## 9. Empty State

### 9.1 Visual

- Centered illustration or icon (no raw text only)
- Short headline + description

### 9.2 Copy

**English:**
- Headline: "No notifications"
- Description: "You're all caught up. New notifications will appear here."

**Thai:**
- Headline: "ไม่มีการแจ้งเตือน"
- Description: "ทุกอย่างทันสมัยแล้ว การแจ้งเตือนใหม่จะปรากฏที่นี่"

### 9.3 Rules

- Empty state should not claim "no new activity" — use notification-specific language
- Do not reference "audit" or "official records" in empty states
- Keep copy encouraging, not clinical

## 10. Loading/Error State

### 10.1 Loading

- Show a skeleton or spinner in the panel while data loads
- Do not block the entire page — the panel should overlay content
- Loading state should be non-blocking (panel opens with loading indicator)

### 10.2 Error

- Show a brief inline error message within the panel
- Provide a retry button
- Do not crash the page or show raw error dumps
- Do not reference URLs or technical errors to the user

**English error copy:** "Unable to load notifications. Please try again."
**Thai error copy:** "ไม่สามารถโหลดการแจ้งเตือนได้ กรุณาลองอีกครั้ง"

## 11. Read/Unread State

### 11.1 Current Behavior

- Unread count is calculated from `mockNotifications.filter(n => !n.is_read).length`
- Individual `is_read` flags exist on mock notification objects
- No persistence — state resets on page reload

### 11.2 Proposed Behavior (No Persistence)

- Marking read/unread can toggle in local state only
- "Mark all as read" sets all visible items' `is_read` to true in local state
- Badge count updates immediately on local state change
- State does not survive page reload (acceptable for mock-only stage)

### 11.3 Future Persistence Stage

- Read state should be persisted through the service/repository boundary (not inline)
- A separate `NotificationReadStateService` should handle batch read/unread operations
- Do not infer read state from URL clicks — explicit action required

## 12. Role-Aware Behavior

| Role | Bell Behavior | Dropdown Content |
|------|---------------|-----------------|
| Student | Clickable → `/student/notifications` | Shows student notifications |
| Staff | Disabled (informational) | Shows "Not available" state or staff-specific notifications if/when available |
| Admin | Disabled (informational) | Shows admin-specific notifications if/when available |
| Provider | Disabled (informational) | Shows "Not available from current workspace" |
| Executive/ESQ | Disabled (informational) | Shows "Not available from current workspace" |

- Non-student roles should see a clear, non-frustrating disabled state
- The dropdown may still open for non-student roles to show informational messages
- Do not show a dropdown with no actionable content — prefer a brief tooltip/disabled state

## 13. Privacy/PII Constraints

- No raw student ID, email, phone, or name in notification payloads visible in the dropdown
- Use display tokens (e.g., "Student #S-123", "Application APP-001")
- Notification titles/bodies must not contain PII
- Do not build URLs with user-controlled parameters in the dropdown
- All URL resolution goes through the route registry

## 14. Laravel/PHP-Inspired Boundary

| Component | TypeScript (current) | Laravel/PHP equivalent |
|-----------|---------------------|----------------------|
| Dropdown component | `NotificationDropdown.tsx` | Blade component or Livewire |
| Notification list API | `NotificationListService` | `App\Services\Notification\ListService` |
| Read state service | `NotificationReadService` | `App\Services\Notification\ReadStateService` |
| Card presenter | `NotificationCardPresenter` | `App\Http\Resources\NotificationCardResource` |
| Empty/error view | `EmptyState` / `ErrorState` | Blade partial views |
| Copy/translation | `notificationNavigationCopy` | `lang/en/notifications.php`, `lang/th/notifications.php` |

## 15. Runtime Implementation Sequence (Future)

When UX-N1C runtime is approved, the implementation sequence should be:

1. Create `NotificationDropdown` component (shell only — no data fetching)
2. Wire the dropdown to the existing `notificationNavigationService`
3. Implement local read/unread toggle (mock-only)
4. Add empty state and error state components
5. Add keyboard navigation (focus trap, arrow keys, escape)
6. Add mobile bottom sheet behavior
7. Accessibility audit (screen reader, keyboard, touch)
8. Integrate with existing `mockNotifications` data
9. QA pass (new checklist in UX-N1C QA doc)

**Do not begin any of these without explicit approval after this plan is reviewed.**

## 16. Risks

- **Over-engineering the dropdown** before the notification navigation service is stable
- **Accessibility gaps** if keyboard focus trap is not implemented correctly
- **Mobile scroll trap** if the bottom sheet does not allow page scrolling
- **Inconsistent card design** if the dropdown and Student notification page cards diverge
- **Performance**: Opening the dropdown should not trigger heavy data loading on each click
- **Localization**: Thai text expansion (up to 30%) may break mobile layouts

## 17. Acceptance Criteria

- [ ] Dropdown panel layout and behavior are documented
- [ ] Card anatomy with all fields is specified
- [ ] Empty state copy (EN/TH) is finalized
- [ ] Error state copy (EN/TH) is finalized
- [ ] Blocked state copy (EN/TH) for each reason is available
- [ ] Keyboard interaction sequence is documented and feasible
- [ ] Mobile interaction model (bottom sheet) is specified
- [ ] Read/unread state behavior is defined (local-only at this stage)
- [ ] Privacy/PII constraints are documented and enforceable
- [ ] Laravel/PHP mapping is provided for all components
- [ ] No runtime code was changed during planning
- [ ] All existing UX-N1B behavior is preserved
- [ ] DRY boundary between dropdown and Student notification page is clear