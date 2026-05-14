# Notification Navigation Contract Plan UX-N1

## 1. Overview

UX-N1 plans how visible S2IMS notifications and alert surfaces should become safely clickable in a future runtime phase.

This phase is documentation-only. It does not implement click behavior, route changes, persistence, backend/API behavior, or UI changes.

## 2. Observed Issue

User-reported issue:

> สิ่งที่เห็นตรงแจ้งเตือนยังคลิกไม่ได้

Current source review found:

- `src/components/layout/Topbar.tsx` renders a notification bell with unread count, but the bell has no navigation handler.
- `src/app/student/notifications/page.tsx` renders notification cards as buttons and navigates with `router.push(n.action_url)` when the mock notification has `action_url`.
- `src/data/mock/notifications.ts` stores `action_url` strings directly.
- Admin/staff alert surfaces exist, but they are not part of a shared notification navigation contract.

## 3. Why This Matters

Clickable notifications can improve workflow speed, but they also create privacy and permission risks:

- A notification can reveal that a private target exists.
- A route can expose raw student identifiers in URLs.
- A cross-role click can bypass intended Staff/Admin/Provider/ESQ boundaries.
- Audit-related notifications can overclaim persistence if copy is not tied to audit copy stage.
- Mobile and keyboard users need a clear focusable target and predictable fallback behavior.

## 4. Current System State

Current notification-related surfaces include:

- Topbar notification bell with unread count.
- Student notifications page with local read/unread state.
- Student dashboard unread notification data.
- Toast feedback through `ToastProvider`.
- Admin security alert cards.
- Admin audit log mock/demo display.
- Staff document action toast feedback.

Current limitations:

- No shared notification navigation contract.
- No shared route resolver for notification targets.
- Mock notification payloads use direct `action_url` strings.
- No role-based notification permission boundary.
- No shared safe fallback behavior when a target is blocked or missing.
- No backend notification persistence.

## 5. Target Future Behavior

Future clickable notifications should:

- Resolve through a dedicated service/helper, not inline UI route strings.
- Use safe route names and safe parameters.
- Avoid raw PII in URLs and payloads.
- Respect role permission checks before navigation.
- Fall back safely when a target is blocked, missing, or unavailable.
- Mark notifications read without requiring a full reload.
- Provide keyboard and mobile accessible click targets.
- Preserve audit copy-stage boundaries when notifications reference audit events.

## 6. Non-Goals for UX-N1

UX-N1 does not:

- Implement notification click behavior.
- Change Topbar, Student notifications page, or alert cards.
- Change routes.
- Add backend/API behavior.
- Add database migrations.
- Add real persistence.
- Mutate mock fixtures.
- Change audit behavior.
- Change reason validation.
- Introduce `ReasonRequiredModal`.
- Start AP-8B, AP-8C, AP-9, or UX-N1A.

## 7. Notification Navigation Lifecycle

Future lifecycle:

1. A notification is created from a domain event or mock fixture.
2. Payload stores a safe route name and safe route parameters.
3. UI asks the notification navigation service whether the current role can open it.
4. UI renders clickable or disabled state based on `isClickable`.
5. On click, the service resolves a safe navigation target.
6. Route permission is checked before navigation.
7. If allowed, navigate and mark read.
8. If blocked, mark read only if appropriate and show a safe fallback message.

Pseudo-code:

```ts
type NotificationNavigationPayload = {
  id: string
  type: string
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical'
  title: string
  body: string
  targetRouteName: string
  targetRouteParams: Record<string, string>
  targetDisplayToken?: string
  actorRoleScope: string[]
  requiresPermission: string
  createdAt: string
  readAt?: string
  actionLabel?: string
  isClickable: boolean
}
```

Future service boundary:

```ts
interface NotificationNavigationServiceContract {
  resolveTarget(payload: NotificationNavigationPayload, actorRole: string): SafeNavigationTarget
  canOpen(payload: NotificationNavigationPayload, actorRole: string): boolean
  markAsRead(notificationId: string): Promise<void>
}
```

## 8. Contract Boundaries

The future contract should keep these boundaries separate:

| Boundary | Responsibility | Must Not Do |
|---|---|---|
| Notification payload | Store safe summary, route name, and safe params | Store raw PII or raw backend paths |
| Navigation service | Resolve route target and permission | Render UI or mutate domain objects |
| Permission policy | Decide whether role can open target | Reveal blocked target details |
| UI component | Render clickable/disabled state | Build raw route strings inline |
| Read-state service | Mark notification read | Decide target permission |
| Audit presenter | Provide safe audit labels | Claim official persistence unless real |

## 9. DRY Boundary Model

Do not duplicate notification route logic in Topbar, notification lists, dashboards, and alert cards.

Future DRY model:

- `NotificationNavigationPayload` defines the data contract.
- `NotificationRouteRegistry` maps route names to internal route templates.
- `NotificationNavigationService` resolves safe targets.
- `NotificationPolicy` checks access.
- UI components render state from resolved navigation metadata.

## 10. Laravel/PHP-Inspired Mapping

| S2IMS Concept | Laravel/PHP Equivalent |
|---|---|
| `NotificationNavigationPayload` | `App\Data\Notification\NotificationNavigationData` |
| `NotificationNavigationServiceContract` | `App\Contracts\Notification\NotificationNavigationServiceInterface` |
| `NotificationNavigationService` | `App\Services\Notification\NotificationNavigationService` |
| Route registry | `config/notification_routes.php` |
| Permission checks | `App\Policies\NotificationPolicy` |
| Response serialization | `App\Http\Resources\NotificationResource` |
| Validation | `App\Http\Requests\Notification\ResolveNotificationRequest` |
| Mark read | Laravel notification `markAsRead()` or service action |
| Copy | `lang/en/notifications.php`, `lang/th/notifications.php` |

## 11. Future Runtime Phases

Recommended future sequence:

- UX-N1A: Add pure notification navigation service and route registry checks only.
- UX-N1B: Wire Topbar bell to `/student/notifications` or role-safe notification center.
- UX-N1C: Replace direct `action_url` with safe route names in mock notification payloads.
- UX-N1D: Add permission-aware navigation fallback and read-state behavior.
- UX-N1E: Add audit-related notification detail linking only after AP-8C/AP-8B decisions.

## 12. Risks

- Raw PII in notification URLs.
- Role mismatch revealing that a private target exists.
- Direct `router.push(action_url)` becoming a bypass around policy checks.
- Audit notification copy implying official persistence before AP-9.
- Mobile notification target overlapping bottom navigation.
- Broken target routes causing app crashes or 404/500 loops.
- Multiple notification surfaces diverging if route logic is duplicated.

## 13. Rollback/Safety Notes

Future runtime phases should be easy to roll back:

- Keep current notification display unchanged until route resolver tests pass.
- Add service/helper behind existing UI first.
- Preserve current static fallback for notifications without targets.
- If permission resolution fails, show a neutral message and do not navigate.
- Do not mutate audit, application, document, or identity data during navigation.

## 14. Recommended Next Step

Recommended next: UX-N1A runtime skeleton for notification navigation service and route registry checks.

Alternatives:

- AP-8C if the priority is DRY Admin audit display through the presenter.
- AP-8B if the priority is audit database schema planning.

Do not implement notification click behavior until this route, permission, and privacy model is reviewed.
