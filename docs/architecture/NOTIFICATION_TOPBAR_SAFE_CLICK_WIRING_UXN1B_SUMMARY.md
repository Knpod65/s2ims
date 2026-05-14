# Notification Topbar Safe Click Wiring UX-N1B Summary

## 1. Overview

UX-N1B adds the first safe runtime click wiring for visible Topbar notifications.

The Topbar notification bell now resolves its destination through the notification navigation service, route registry, role policy, presenter, and copy helper introduced in UX-N1A. The UI layer remains thin and does not build raw notification routes directly.

## 2. Why UX-N1B Exists

The visible notification area previously showed an unread count but did not navigate anywhere when selected.

Current Topbar behavior before this phase:

- The unread count was rendered from `mockNotifications`.
- The Topbar had a bell/count button.
- The Topbar did not render a dropdown notification list.
- The bell button had no click handler.
- Mock notification records still carry legacy `action_url` values, but Topbar did not use them.

UX-N1B uses the smallest safe target first: the Student notification center. Other roles remain blocked until role-specific notification destinations are designed.

## 3. Files Modified

- `src/components/layout/Topbar.tsx`
- `src/lib/notifications/dto/notificationNavigationDto.ts`
- `src/lib/notifications/routes/notificationRouteRegistry.ts`
- `src/lib/notifications/services/notificationNavigationService.ts`
- `scripts/check-audit-events.mjs`
- `docs/architecture/NEXT_RENOVATION_STEPS.md`

## 4. Files Not Modified

- `src/app/student/notifications/page.tsx`
- `src/data/mock/*`
- `src/lib/audit/*`
- Staff document review components
- Admin audit log components
- Backend/API files
- Database migration files
- `package.json`

## 5. Route, Permission, and Privacy Flow

The Topbar creates a serializable notification navigation payload through `createTopbarNotificationPayload`.

That payload is resolved through:

1. `NotificationNavigationService`
2. `NotificationNavigationPolicy`
3. `NOTIFICATION_ROUTE_REGISTRY`
4. `NotificationNavigationPresenter`
5. `NotificationNavigationCopy`

The safe initial route is:

- `student.notifications` -> `/student/notifications`

Rules preserved:

- Topbar does not concatenate raw route strings from notification payloads.
- Route names are resolved through the registry.
- Unsafe PII-like params are still blocked.
- Role mismatch is blocked by policy.
- Non-student roles are kept in a disabled informational state for this slice.

## 6. Laravel/PHP-Inspired Boundary

The runtime wiring follows the UX-N1A Laravel/PHP-inspired split:

- DTO payload -> `NotificationNavigationData`
- Route registry -> `config/notification_routes.php`
- Policy -> `NotificationPolicy`
- Service -> `NotificationNavigationService`
- Presenter -> `NotificationResource`
- Copy helper -> `lang/en/notifications.php` and `lang/th/notifications.php`

The Topbar acts as the thin view layer.

## 7. Runtime Behavior

Runtime behavior changed only for the Topbar notification bell:

- Student role: the bell can navigate to `/student/notifications`.
- Non-student roles: the bell remains disabled/informational because role-specific notification centers are not designed yet.
- The unread badge remains unchanged.
- No dropdown notification list was added.
- No notification read state or persistence was added.

## 8. What Is Intentionally Not Implemented

This phase does not:

- Add backend/API behavior.
- Add database migrations.
- Add real persistence.
- Mutate mock fixtures.
- Implement global notification persistence.
- Normalize Student notification card routes.
- Add a Topbar dropdown list.
- Change Student notification page behavior.
- Change audit behavior.
- Change reason validation.
- Introduce `ReasonRequiredModal`.
- Wire Staff verify actions.
- Start AP-8B, AP-8C, or AP-9.

## 9. Validation Results

Validation must include:

- `npm run build`
- `npm run check:tokens`
- `npm run check:audit-events`
- Local route smoke checks for `/login`, `/admin/audit-log`, `/admin/dashboard`, `/staff/applications/app_001`, and `/staff/applications/app_002`

UX-N1B expands the audit/notification check script beyond the previous 62 checks.

## 10. Safety Confirmations

- Notification click behavior is now wired only through safe route/service/policy/presenter boundaries.
- No raw PII route exposure was added.
- No backend/API behavior was added.
- No real persistence was added.
- No mock fixture was mutated.
- No audit behavior changed.
- No reason validation changed.
- No `ReasonRequiredModal` was introduced.
- No Staff verify action was wired.

## 11. Recommended Next Step

Recommended next phase:

- **UX-N1B-QA** — Review Topbar click behavior, role blocking, mobile accessibility, dev logs, and route smoke checks.

After UX-N1B-QA passes, possible next phases:

- **UX-N1C** — Normalize Student notification card route handling through the same service boundary.
- **AP-8C** — Refactor Admin audit display to the presenter.
- **AP-8B** — Audit database schema planning.

Do not start real persistence yet.
