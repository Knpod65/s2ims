# Notification Navigation Runtime Skeleton UX-N1A Summary

## 1. Overview

Implemented UX-N1A: Notification Navigation Runtime Skeleton on branch `architecture/notification-navigation-runtime-skeleton`.

This phase adds a minimal TypeScript skeleton for safe notification navigation. It creates contracts, DTOs, route registry, policy, service, presenter, and copy helpers based on the UX-N1 planning package.

No current notification click behavior was changed.

## 2. Why UX-N1A Exists

UX-N1 documented that a visible notification/alert area exists but the Topbar notification bell is not clickable. It also identified that current mock notifications can carry direct `action_url` values without a shared route, permission, or privacy contract.

UX-N1A creates the safe runtime foundation before any UI wiring:

- named route registry
- role/permission policy boundary
- safe target resolution
- presenter output for future UI use
- Thai/English copy helper
- lightweight guardrail checks

## 3. Files Created

- `src/lib/notifications/contracts/notificationNavigationContracts.ts`
- `src/lib/notifications/dto/notificationNavigationDto.ts`
- `src/lib/notifications/routes/notificationRouteRegistry.ts`
- `src/lib/notifications/policies/notificationNavigationPolicy.ts`
- `src/lib/notifications/services/notificationNavigationService.ts`
- `src/lib/notifications/presenters/notificationNavigationPresenter.ts`
- `src/lib/notifications/copy/notificationNavigationCopy.ts`
- `src/lib/notifications/index.ts`
- `docs/architecture/NOTIFICATION_NAVIGATION_RUNTIME_SKELETON_UXN1A_SUMMARY.md`

## 4. Files Modified

- `scripts/check-audit-events.mjs`
- `docs/architecture/NEXT_RENOVATION_STEPS.md`

## 5. Laravel/PHP-Inspired Mapping

| TypeScript skeleton | Laravel/PHP equivalent |
|---|---|
| `NotificationNavigationPayload` | `App\Data\Notification\NotificationNavigationData` |
| `NotificationNavigationTarget` | `App\Data\Notification\NotificationTargetData` |
| `NotificationNavigationResolution` | `App\Data\Notification\NotificationNavigationResultData` |
| `NotificationNavigationServiceContract` | `App\Contracts\Notification\NotificationNavigationServiceInterface` |
| `NotificationNavigationService` | `App\Services\Notification\NotificationNavigationService` |
| `NotificationNavigationPolicy` | `App\Policies\NotificationPolicy` |
| `NOTIFICATION_ROUTE_REGISTRY` | `config/notification_routes.php` |
| `NotificationNavigationPresenter` | `App\Http\Resources\NotificationResource` |
| `NotificationNavigationCopy` | `lang/en/notifications.php` and `lang/th/notifications.php` |

## 6. DRY Boundaries Now Represented In Code

The skeleton separates:

- DTOs from route resolution
- route registry from policy
- policy from service
- service from UI navigation
- presenter output from rendered components
- copy labels from behavior

Future Topbar, notification list, dashboards, and alert surfaces can reuse the same resolver instead of composing direct `router.push()` targets inline.

## 7. What Is Intentionally Not Wired Yet

UX-N1A intentionally does not:

- implement notification click behavior
- make the Topbar bell clickable
- change Student notification page behavior
- normalize existing mock `action_url` values
- change routes
- add backend/API behavior
- add database migrations
- add real persistence
- mutate mock fixtures
- change audit behavior
- change reason validation
- introduce `ReasonRequiredModal`
- wire Staff verify action
- start AP-8B, AP-8C, or AP-9

The new service/registry/policy/presenter skeleton is available for future runtime wiring only.

## 8. Validation Results

Validation commands to run:

- `npm run build`
- `npm run check:tokens`
- `npm run check:audit-events`

UX-N1A added lightweight notification navigation checks to `scripts/check-audit-events.mjs`, covering:

- known route recognition
- unknown route blocking
- missing parameter blocking
- safe Staff application route resolution
- raw PII-looking parameter blocking
- role mismatch blocking
- Staff route permission success
- service immutability
- presenter blocked-state output
- Thai/English blocked reason copy

## 9. Safety Confirmations

- No notification click behavior implemented.
- No Topbar click behavior changed.
- No Student notification page behavior changed.
- No route behavior changed.
- No PII route exposure added.
- No backend/API added.
- No database migrations added.
- No real persistence added.
- No mock fixture mutation.
- No audit behavior changed.
- No Staff verify wiring.
- No reason validation change.
- No `ReasonRequiredModal` introduced.

## 10. Recommended Next Step

Recommended next options:

- UX-N1A-QA: review skeleton boundaries, route registry, and check coverage.
- UX-N1B: wire Topbar notification safe click behavior after UX-N1A QA passes.
- UX-N1C: normalize Student notification card routing from direct `action_url` toward named route payloads.

Recommendation: UX-N1A-QA first, because the notification route and permission model should be reviewed before any clickable behavior is implemented.
