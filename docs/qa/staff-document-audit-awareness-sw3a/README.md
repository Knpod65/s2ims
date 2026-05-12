# Staff Document Audit Awareness SW-3A QA

## Date
2026-05-11

## Branch
`design/staff-document-audit-awareness-runtime`

## Commit Under Review
`4912dab feat(staff): add prototype-safe document audit warnings`

## Routes Reviewed
- `/staff/applications/app_001`
- `/staff/applications/app_002`

## Screenshots Captured

Desktop:
- `desktop/app-001-verified-audit-awareness.png`
- `desktop/app-002-reject-replacement-audit-awareness.png`
- `desktop/rejection-warning-zone.png`
- `desktop/replacement-warning-zone.png`
- `desktop/action-rail-without-amber-strip.png`

Mobile 375:
- `mobile-375/app-001-mobile-audit-awareness.png`
- `mobile-375/app-002-mobile-audit-awareness.png`
- `mobile-375/rejection-warning-mobile.png`
- `mobile-375/replacement-warning-mobile.png`

Thai locale:
- `th-locale/app-001-audit-awareness-th.png`
- `th-locale/app-002-audit-awareness-th.png`

States:
- `states/verified-state-no-extra-action-warning.png`
- `states/reject-form-warning-open.png`
- `states/reject-form-typing-persistent.png`
- `states/replacement-warning-visible.png`
- `states/action-rail-no-amber-strip.png`

## Console Review
- No runtime crash observed.
- No duplicate key warnings observed.
- No unsupported `use(params)` errors observed.
- No hydration errors observed.
- No missing chunk errors observed.
- Dev log grep for `error|warn|hydrat|key|unsupported|chunk` returned no matching lines.
- Browser log recorded one generic `404 (Not Found)` resource message; it did not affect either reviewed route or the document audit awareness flow.

## Visual QA Result
- Audit warning appears near the rejection form.
- Audit warning appears near the replacement request form.
- Copy is prototype-safe and says real audit-log persistence is not connected yet.
- No copy claims real audit persistence.
- No copy claims the action is already logged.
- No copy says the action is auditable in the backend.
- `DocumentActionRail` amber strip is removed.
- Workbench-level prototype strip remains by design.
- Warning clutter is reduced compared with the always-visible rail strip.
- Reject form remains open while typing.
- Replacement flow remains unchanged.
- Verified state remains clean and does not show unnecessary reject/replacement action cards.
- Mobile 375px layout remains usable.
- Thai locale content renders without layout breakage in the reviewed states.

## Behavior Preserved
- Callbacks unchanged.
- Reason validation unchanged.
- No `ReasonRequiredModal` introduced.
- No real audit persistence added.
- Document status keys unchanged.
- Mock data unchanged.
- Staff/Student wording boundary preserved.

## Known Non-Blocking Notes
- Workbench-level prototype strip still remains by design.
- Real audit persistence is still future work.
- Reason min-length enforcement remains future SD-3 work.
- One unrelated browser resource `404` appeared during automated console capture; no route crash, hydration issue, duplicate key warning, unsupported `use(params)` error, or missing chunk error was observed.

## QA Verdict
Pass
