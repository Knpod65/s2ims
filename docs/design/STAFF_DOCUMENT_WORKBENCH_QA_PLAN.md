# Staff Document Workbench QA Plan

Date: 2026-05-11
Scope: QA plan for future runtime work. No screenshots captured in this planning phase.

## QA Routes

Primary routes:

- `/staff/applications/app_001`
- `/staff/applications/app_002`

Why:

- `app_001` exercises mostly verified document states.
- `app_002` exercises rejected and needs replacement document states.

## Desktop Screenshots

Required desktop screenshots:

- default verified documents
- rejected document state
- needs replacement state
- masked student context
- action rail
- audit warning strip
- staff notes and timeline context
- identity reveal affordance

Suggested files:

- `docs/qa/staff-document-evidence-workbench/desktop/app-001-default.png`
- `docs/qa/staff-document-evidence-workbench/desktop/app-002-rejected.png`
- `docs/qa/staff-document-evidence-workbench/desktop/app-002-needs-replacement.png`
- `docs/qa/staff-document-evidence-workbench/desktop/action-rail.png`
- `docs/qa/staff-document-evidence-workbench/desktop/audit-strip.png`

## Mobile 375px Screenshots

Required mobile screenshots:

- evidence rail stacking
- action rail placement
- masked profile section
- document action accessibility
- reason textarea and disabled/enabled action button
- audit warning strip wrapping

Suggested files:

- `docs/qa/staff-document-evidence-workbench/mobile-375/app-001-mobile.png`
- `docs/qa/staff-document-evidence-workbench/mobile-375/app-002-mobile.png`
- `docs/qa/staff-document-evidence-workbench/mobile-375/action-rail-mobile.png`
- `docs/qa/staff-document-evidence-workbench/mobile-375/audit-strip-mobile.png`

## Thai Locale Screenshots

Set:

```js
localStorage.setItem('s2ims_lang', 'th')
location.reload()
```

Review:

- document labels
- reason/action labels
- audit warning text
- long status/replacement messages
- reveal identity copy
- staff status labels

Suggested files:

- `docs/qa/staff-document-evidence-workbench/th-locale/app-001-th.png`
- `docs/qa/staff-document-evidence-workbench/th-locale/app-002-th.png`
- `docs/qa/staff-document-evidence-workbench/th-locale/action-rail-th.png`
- `docs/qa/staff-document-evidence-workbench/th-locale/audit-strip-th.png`

## Console Checks

Confirm:

- no duplicate key warnings
- no hydration errors
- no `use(params)` errors
- no runtime crashes
- no missing route errors
- no controlled/uncontrolled textarea warnings

Acceptable only if documented:

- React DevTools dev message
- existing unrelated favicon 404

## Visual QA Checklist

Confirm:

- Workbench feels like staff operations, not generic detail cards.
- Evidence column is the primary surface.
- Selected document status is easy to scan.
- Action rail is visible and attached to evidence.
- Audit strip appears near sensitive action context.
- Masked student profile remains masked by default.
- Identity reveal remains visibly sensitive.
- Staff operational labels remain unchanged unless approved.
- Student recovery wording does not appear in the staff surface.
- Rejected and needs replacement remain distinct.
- Invalid file type remains diagnostic/validation state.
- Button availability matches previous behavior.
- Reason textareas preserve previous behavior unless a later phase explicitly changes it.
- Thai text wraps cleanly.
- Mobile action controls are reachable and tappable.

## Behavioral QA Checklist

Confirm:

- Verify action still calls `onVerify(docId)`.
- Reject action still calls `onReject(docId, reason)`.
- Replacement action still calls `onRequestReplacement(docId, message)`.
- Staff notes still work.
- Application status update still works.
- Identity reveal modal still opens.
- Identity reveal reason behavior remains unchanged.
- No new PII appears.
- No route changes occurred.

## Merge Gate

Do not merge a runtime workbench phase unless:

- `npm run build` passes.
- `npm run check:tokens` passes.
- Desktop screenshots are captured.
- Mobile 375px screenshots are captured.
- Thai locale screenshots are captured.
- Console review is documented.
- Behavior preservation checklist is explicitly answered.
