# Notification Route and Permission Model UX-N1

## 1. Purpose

This document defines the future route and permission model for clickable S2IMS notifications.

It is documentation-only. No route or runtime behavior is changed in UX-N1.

## 2. Route Target Types

Future notification targets should use route names instead of direct URLs:

- Admin audit route
- Staff application detail route
- Student application route
- Provider candidate route
- ESQ review route
- Dashboard fallback route

Example route names:

| Route name | Example target | Allowed roles |
|---|---|---|
| `admin.audit.detail` | `/admin/audit-log` with drawer event ID | admin |
| `staff.application.detail` | `/staff/applications/:applicationId` | staff |
| `student.application.detail` | `/student/applications/:applicationId` | student |
| `provider.candidate.pool` | `/provider/scholarships/:scholarshipId/candidates` | provider |
| `esq.announcement.review` | `/esq/announcements/:id/review` | esq |
| `role.dashboard` | role home/dashboard | current role |

## 3. Role-Based Navigation Matrix

| Notification target | Student | Provider | Staff | Admin | ESQ | Executive |
|---|---:|---:|---:|---:|---:|---:|
| Student application | Own only | No | No | No | No | No |
| Staff application detail | No | No | Assigned/allowed only | Optional support only | No | No |
| Provider candidate pool | No | Own scholarship only | No | No | No | No |
| Admin audit detail | No | No | No | Yes | No | No |
| ESQ review | No | No | No | No | Yes | No |
| Dashboard fallback | Yes | Yes | Yes | Yes | Yes | Yes |

## 4. Safe Route Names

Safe route names must be allowlisted.

Suggested allowlist:

- `student.application.detail`
- `student.application.documents`
- `student.scholarship.detail`
- `staff.application.detail`
- `staff.matching.review`
- `provider.candidate.pool`
- `provider.scholarship.detail`
- `admin.audit.detail`
- `admin.dashboard`
- `esq.announcement.review`
- `role.dashboard`

Route resolution must happen through a service/helper, not inline UI components.

## 5. Unsafe Route Patterns

Unsafe patterns:

- Raw `student_id` in URL.
- Raw email, national ID, phone, bank account, or file path in URL.
- Provider route containing a raw student identifier.
- Executive/ESQ route containing individual student/application IDs unless explicitly approved.
- Notification payload storing arbitrary `href` that UI pushes directly.
- Cross-role route targets without permission checks.

Never navigate to raw `student_id` in a URL. Prefer safe internal IDs only when already used by current route conventions, or display tokens when the route does not require a raw identifier.

## 6. Permission Check Boundary

Future permission checks should happen before navigation:

1. Validate payload shape.
2. Validate route name is allowlisted.
3. Validate role is in `actorRoleScope`.
4. Validate permission key in `requiresPermission`.
5. Resolve safe route params.
6. Navigate only after all checks pass.

Role mismatch must not expose target existence.

## 7. Fallback Behavior When Route Is Blocked

Blocked navigation should:

- Not crash.
- Not reveal whether the target exists.
- Show neutral copy such as "This item is no longer available from your current workspace."
- Route to the role dashboard only if safe.
- Avoid changing sensitive state.
- Optionally mark as read only if product approves.

## 8. Laravel/PHP Policy Mapping

| Concern | Laravel/PHP mapping |
|---|---|
| Route permission | `NotificationPolicy::viewTarget()` |
| Route resolution | `NotificationNavigationService` |
| Route registry | `config/notification_routes.php` |
| Resource output | `NotificationResource` |
| Controller boundary | `Controller::authorize()` before redirect/detail |
| Route model binding | Use scoped bindings; avoid raw PII |
| Signed/internal routes | Use when target needs anti-tamper protection |

## 9. QA Expectations

Future runtime QA must verify:

- Safe route names only.
- Blocked roles cannot navigate.
- Blocked route does not reveal target existence.
- Missing route resolves to safe fallback.
- No raw PII appears in URLs.
- No 404/500 on notification click.
- Mobile and keyboard interaction works.
- Admin audit mock/demo copy remains safe.
