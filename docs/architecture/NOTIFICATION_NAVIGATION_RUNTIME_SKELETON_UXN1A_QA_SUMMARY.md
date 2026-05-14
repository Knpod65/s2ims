# Notification Navigation Runtime Skeleton UX-N1A QA Summary

## QA Result

Pass with notes.

The merged UX-N1A skeleton creates safe notification navigation boundaries without changing current runtime behavior.

## Contract Review

- Contracts are interface-first.
- DTOs are serializable.
- Contracts avoid UI imports.
- Contracts avoid Next.js router dependency.
- Service, policy, route registry, presenter, and copy boundaries are separated.

## Route Registry Review

- Route registry uses named routes instead of payload-provided raw URLs.
- Known route names are allowlisted.
- Unknown route names are blocked.
- Missing required params are blocked.
- Unsafe PII-looking param keys are blocked.
- Route resolution returns a target object only; it does not call `router.push`.

## Policy Review

- Policy blocks non-clickable payloads.
- Policy blocks unknown routes.
- Policy blocks role scope mismatches.
- Policy blocks route names that are not available for the current role.
- Policy blocks mismatched permission keys.

## Service Review

- Service accepts registry and policy dependencies.
- Service resolves payloads into allowed/blocked results.
- Service does not mutate payloads.
- Service does not call router.
- Service does not mark notifications read.

## Presenter Review

- Presenter returns UI-ready data only.
- Presenter includes clickable state from safe resolution.
- Presenter includes disabled reason when blocked.
- Presenter does not render UI.
- Presenter does not navigate.

## Copy Helper Review

- Copy helper owns Thai/English action and blocked-state labels.
- Blocked copy is privacy-safe and neutral.
- Copy does not reveal private target existence.

## Privacy Review

- Raw student IDs are not required by the contract.
- Unsafe PII-looking parameter keys are blocked by route registry.
- National IDs, emails, phone numbers, bank accounts, raw file paths, raw filenames, and raw guardian info are documented as forbidden payload fields.
- Role mismatch can be blocked before route target exposure.

## Runtime Safety Review

- No current `src/app` or `src/components` files import the notification skeleton.
- Topbar notification behavior is unchanged.
- Student notification page behavior is unchanged.
- Route behavior is unchanged.
- No backend/API behavior was added.
- No database migrations were added.
- No real persistence was added.
- No mock fixture mutation occurred.

## Validation Results

- `npm run build`: passed, 40/40 routes.
- `npm run check:tokens`: passed, 4/4 checks.
- `npm run check:audit-events`: passed, 62/62 checks.

Route verification:

- `/login`: 200 OK
- `/admin/audit-log`: 200 OK
- `/admin/dashboard`: 200 OK
- `/staff/applications/app_001`: 200 OK
- `/staff/applications/app_002`: 200 OK
- Dev log: clean.

## Safety Confirmations

- Runtime code changed in this QA step: no.
- Notification click changed: no.
- Route behavior changed: no.
- PII route exposure added: no.
- Real persistence added: no.
- Backend/API changed: no.
- Database migration added: no.
- Mock fixture mutated: no.
- Audit behavior changed: no.
- Staff verify wired: no.
- Reason validation changed: no.
- `ReasonRequiredModal` introduced: no.
- UX-N1B started: no.
- AP-8B started: no.
- AP-8C started: no.
- AP-9 started: no.

## Recommended Next Step

Recommended next: UX-N1B Topbar notification safe click wiring plan/runtime after UX-N1A QA is reviewed.

Alternatives:

- AP-8C audit display presenter refactor.
- AP-8B audit database schema plan.

Do not start real persistence yet.
Do not expose PII in notification routes.
Do not bypass role policies during notification route resolution.
