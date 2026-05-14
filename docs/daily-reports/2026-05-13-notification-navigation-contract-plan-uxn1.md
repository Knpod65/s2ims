# Notification Navigation Contract Plan UX-N1 Merge Checkpoint

## Overview

Merged `architecture/notification-navigation-contract-plan` into `main`.

UX-N1 is documentation-only. It documents how visible notifications and alert surfaces in S²IMS should become safely clickable in a future runtime phase, without implementing click behavior yet.

The plan covers safe navigation payloads, route/permission boundaries, privacy-safe target tokens, UI/accessibility QA expectations, and Laravel/PHP-inspired architecture mapping.

## Merge Result

- Source branch: `architecture/notification-navigation-contract-plan`
- Target branch: `main`
- Merge commit: `51a767e`
- Conflict status: no conflicts
- Push result: pushed to `origin/main`

## Files Added

- `docs/architecture/NOTIFICATION_NAVIGATION_CONTRACT_PLAN_UXN1.md`
- `docs/architecture/NOTIFICATION_ROUTE_AND_PERMISSION_MODEL_UXN1.md`
- `docs/architecture/NOTIFICATION_PRIVACY_AND_PAYLOAD_CONTRACT_UXN1.md`
- `docs/architecture/NOTIFICATION_UI_ACCESSIBILITY_QA_UXN1.md`
- `docs/architecture/NOTIFICATION_LARAVEL_PHP_ARCHITECTURE_MAP_UXN1.md`

## Files Modified

- `docs/architecture/NEXT_RENOVATION_STEPS.md`

## Observed Issue

The user reported:

> สิ่งที่เห็นตรงแจ้งเตือนยังคลิกไม่ได้

The visible notification/alert area needs a future safe navigation contract before runtime click behavior is implemented.

## What Changed

- Planned notification navigation payload contract.
- Planned route and permission model.
- Planned privacy-safe payload and forbidden PII rules.
- Planned UI/accessibility QA checklist.
- Added Laravel/PHP architecture mapping.
- Documented UX-N1 as future notification click/navigation work.
- Preserved current runtime behavior.

## Validation

Before merge on source branch:

- `npm run build`: passed, 40/40 routes.
- `npm run check:tokens`: passed, 4/4 checks.
- `npm run check:audit-events`: passed, 52/52 checks.
- `/login`: 200 OK.
- `/admin/audit-log`: 200 OK.
- `/admin/dashboard`: 200 OK.
- `/staff/applications/app_001`: 200 OK.
- `/staff/applications/app_002`: 200 OK.
- Dev log review: clean, no matching error/warning lines.

After merge on main:

- `npm run build`: passed, 40/40 routes.
- `npm run check:tokens`: passed, 4/4 checks.
- `npm run check:audit-events`: passed, 52/52 checks.
- `/login`: 200 OK.
- `/admin/audit-log`: 200 OK.
- `/admin/dashboard`: 200 OK.
- `/staff/applications/app_001`: 200 OK.
- `/staff/applications/app_002`: 200 OK.
- Dev log review: clean, no matching error/warning lines.

## Safety Confirmations

This merge did not:

- change runtime code
- modify `src/*`
- modify `scripts/*`
- modify `package.json`
- implement notification click behavior
- change route behavior
- expose PII in routes
- add backend/API behavior
- create database migrations
- add real persistence
- mutate mock fixtures
- change audit behavior
- change reason validation
- introduce ReasonRequiredModal
- wire Staff verify action
- start UX-N1A
- start AP-8B
- start AP-8C
- start AP-9

## Laravel/PHP-Inspired Direction

Future notification navigation should preserve:

- NotificationNavigationData DTO
- NotificationNavigationServiceInterface contract
- NotificationNavigationService service layer
- NotificationPolicy authorization boundary
- NotificationResource presenter/resource
- route map config
- translation copy in lang/en and lang/th
- controller/service separation
- policy checks before navigation

## Recommended Next Step

Choose one:

**Option A — UX-N1A: Notification Navigation Runtime Skeleton**

Suggested branch:

`architecture/notification-navigation-runtime-skeleton`

Scope:

- minimal TypeScript contracts/service skeleton
- safe route registry shape
- no click implementation yet unless separately approved
- no backend/API
- no migrations

**Option B — AP-8C: Refactor Admin Audit Display to Presenter**

Suggested branch:

`architecture/audit-display-presenter-refactor`

Scope:

- start using AP-8A presenter for Admin audit display
- preserve current UI behavior
- no real persistence
- no route changes

**Option C — AP-8B: Audit Database Schema Plan**

Suggested branch:

`architecture/audit-database-schema-plan`

Scope:

- docs-only
- schema planning
- Laravel migration equivalent
- no actual migration yet

Recommended:
Start UX-N1A if notification clickability is the user-facing priority.
Start AP-8C if DRY audit runtime usage is the technical priority.
Start AP-8B if persistence readiness is the architectural priority.

Do not implement notification click behavior until route, permission, and privacy model is reviewed.
Do not expose raw PII in notification payloads or URLs.
Do not bypass role policies.

## Final Status

- Final branch: `main`
- Working tree: clean
- `main` synced with `origin/main`: yes
- UX-N1 merged: yes
- Runtime code changed: no
- Notification click changed: no
- Route behavior changed: no
- Real persistence added: no
- Backend/API changed: no
- Database migration added: no
- PII route exposure added: no
- Mock fixture mutated: no
- Staff/Admin/Student/Provider/ESQ behavior changed: no
- UX-N1A started: no
- AP-8B started: no
- AP-8C started: no
- AP-9 started: no
- Laravel/PHP mapping added: yes
- DRY boundaries documented: yes
