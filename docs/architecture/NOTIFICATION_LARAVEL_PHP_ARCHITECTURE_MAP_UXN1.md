# Notification Laravel/PHP Architecture Map UX-N1

## 1. Purpose

This document maps the future S2IMS notification navigation contract to Laravel/PHP architecture.

It is planning only and does not introduce backend/API behavior.

## 2. TypeScript To Laravel/PHP Mapping

| TypeScript concept | Laravel/PHP equivalent |
|---|---|
| `NotificationNavigationPayload` | `App\Data\Notification\NotificationNavigationData` |
| `NotificationNavigationServiceContract` | `App\Contracts\Notification\NotificationNavigationServiceInterface` |
| `NotificationNavigationService` | `App\Services\Notification\NotificationNavigationService` |
| Notification route map | `config/notification_routes.php` |
| Notification policy | `App\Policies\NotificationPolicy` |
| Notification resource | `App\Http\Resources\NotificationResource` |
| Copy strings | `lang/en/notifications.php`, `lang/th/notifications.php` |
| Request validation | `App\Http\Requests\Notification\ResolveNotificationRequest` |

## 3. Suggested Laravel Folders

```text
app/
  Contracts/Notification/
    NotificationNavigationServiceInterface.php
  Data/Notification/
    NotificationNavigationData.php
    SafeNavigationTargetData.php
  Services/Notification/
    NotificationNavigationService.php
    NotificationRouteRegistry.php
  Policies/
    NotificationPolicy.php
  Http/Requests/Notification/
    ResolveNotificationRequest.php
  Http/Resources/
    NotificationResource.php
config/
  notification_routes.php
lang/
  en/notifications.php
  th/notifications.php
```

## 4. Notification Class

Future Laravel notification classes should contain:

- type
- severity
- localized title/body keys
- safe route name
- safe route params
- target display token
- role scope
- required permission

They should not contain raw PII.

## 5. NotificationResource

`NotificationResource` should:

- Serialize only safe payload fields.
- Include `isClickable` after policy evaluation.
- Include safe action labels.
- Include read/unread state.
- Exclude forbidden PII fields.

## 6. NotificationPolicy

`NotificationPolicy` should answer:

- Can this actor view the notification?
- Can this actor open the target?
- Can this actor mark it read?
- Can this actor see target metadata?

The policy must not reveal target existence when access is denied.

## 7. NotificationNavigationService

The service should:

- Validate route name against `config/notification_routes.php`.
- Validate route params.
- Ask policy whether the current actor can open the target.
- Return a `SafeNavigationTargetData` or a safe blocked state.
- Avoid raw URL construction in UI components.

## 8. Route Model Binding

Future backend route model binding should:

- Use scoped bindings where possible.
- Authorize in controllers before returning a page/resource.
- Avoid raw student identity in public path segments.
- Use signed/internal routes only when anti-tamper protection is needed.

## 9. Controller Boundary

Controllers should:

- Validate payload through a FormRequest-like request.
- Call `NotificationNavigationService`.
- Authorize the resolved target.
- Return safe route target or blocked response.

Controllers should not:

- Build notification route strings inline.
- Expose raw model identifiers in JSON.
- Skip policy checks because the notification was already visible.

## 10. Blade/Inertia/React UI Boundary

The UI should:

- Render payloads from `NotificationResource`.
- Use service-resolved route metadata.
- Show accessible clickable state.
- Show safe blocked state.

The UI should not:

- Compose arbitrary URLs from notification payloads.
- Store raw PII in browser state.
- Infer permissions from role label alone.

## 11. FormRequest-Like Validation

Future request validation should enforce:

- Known notification ID.
- Known route name.
- Safe route params.
- Current actor context.
- Required permission key.
- No forbidden payload fields.

## 12. Testing Approach

Future Laravel/PHP tests:

- Unit test `NotificationNavigationService`.
- Policy test each role/target combination.
- Resource test forbidden fields are absent.
- Feature test blocked target does not reveal existence.
- Feature test mark-as-read does not bypass policy.
- Browser test keyboard/mobile click behavior.
