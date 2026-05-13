# Admin Audit Event Detail Drawer AP-6B Runtime Merge Checkpoint

## Overview

Merged `architecture/admin-audit-detail-drawer-runtime` into `main`.

This merge adds the AP-6B runtime implementation: a read-only Admin audit event detail drawer. The drawer allows Admin users to inspect mock/demo audit event context without mistaking these records for official persisted audit evidence.

This is a runtime-and-docs change. No mock writer is wired, no Staff actions are wired, and no real audit persistence is added.

## Merge Result

- Source branch: `architecture/admin-audit-detail-drawer-runtime`
- Target branch: `main`
- Merge commit: `c8efff4`
- Conflict status: no conflicts
- Push result: pushed to `origin/main`

## Files Added

- `src/components/admin/AdminAuditEventDetailDrawer.tsx`
- `docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_AP6B_RUNTIME_SUMMARY.md`

## Files Modified

- `src/app/admin/audit-log/page.tsx`
- `docs/architecture/NEXT_RENOVATION_STEPS.md`

## What Was Added

### `AdminAuditEventDetailDrawer.tsx`

A fixed right-side drawer component that renders over the Admin audit log page when a row's "View details" button is clicked.

Drawer sections:
- Header — Drawer title (Mock/Demo) and event ID
- Mock/demo notice banner — "Mock/demo event — Not official audit evidence"
- Event Identity — ID, timestamp, action, policy version fallback
- Actor — Role badge, actor name, actor ID from fixture
- Target / Entity — Entity type, entity ID, privacy note
- Action / Reason — Action string, "Reason not provided" placeholder
- Persistence / Evidence — `mock_only` badge + full mock-safe copy block
- Metadata — `before`/`after` fields with `FORBIDDEN_AUDIT_METADATA_KEYS` filtering
- Session Context — IP (labeled as mock fixture data)
- Evidence note — Closing statement on demo-only nature
- Footer — Close button

### `src/app/admin/audit-log/page.tsx`

- Added `import AdminAuditEventDetailDrawer`
- Added `selectedLog` state (`useState<... | null>(null)`)
- Added empty `<th>` column header for the actions column
- Added "View details" button to each audit log row
- Conditionally renders `AdminAuditEventDetailDrawer` when a row is selected
- `onClose` clears `selectedLog` to null

## Validation Before Merge

On source branch `architecture/admin-audit-detail-drawer-runtime`:

- `npm run build`: passed — 40 routes, 0 type errors
- `npm run check:tokens`: passed — 4/4
- `npm run check:audit-events`: passed — 37/37
- `/admin/audit-log` built as static route (6.02 kB)

## Validation After Merge

On `main` at merge commit `c8efff4`:

- `npm run build`: passed — 40 routes, 0 type errors
- `npm run check:tokens`: passed — 4/4
- `npm run check:audit-events`: passed — 37/37
- `/admin/audit-log` built as static route (6.02 kB)

## Route Verification

- `/admin/audit-log`: confirmed built as static route at 6.02 kB — before and after merge
- No type errors, no build errors on audit-log route

## Diff Scope Confirmation

`git diff --name-only origin/main...HEAD` before merge showed exactly:

```
docs/architecture/ADMIN_AUDIT_DETAIL_DRAWER_AP6B_RUNTIME_SUMMARY.md
docs/architecture/NEXT_RENOVATION_STEPS.md
src/app/admin/audit-log/page.tsx
src/components/admin/AdminAuditEventDetailDrawer.tsx
```

No forbidden files appeared:
- `src/data/mock/audit-logs.ts` — not changed ✓
- `src/lib/audit/mockAuditWriter.ts` — not changed ✓
- `src/components/staff/*` — not changed ✓
- `src/components/provider/*` — not changed ✓
- `src/components/student/*` — not changed ✓
- `scripts/*` — not changed ✓
- `package.json` — not changed ✓

## Safety Confirmations

- AP-6B runtime merged: yes
- Admin UI changed: yes — "View details" button and drawer added to audit log
- Mock writer wired: no
- Staff actions wired: no
- Real persistence added: no
- Mock audit fixture mutated: no
- Reason validation changed: no
- ReasonRequiredModal introduced: no
- AP-6C started: no

## Copy Rules Confirmed

Approved copy used in drawer:
- "Audit Event Detail (Mock/Demo)"
- "Mock/demo event — Not official audit evidence"
- "This record is shown for mock/demo review. Real audit persistence is not connected yet."
- "This is a mock/demo event. Not official audit evidence."
- "For demonstration purposes only. Not real audit persistence."
- "Reason not provided"
- "No additional metadata"
- "[Hidden by privacy rule]"
- "[Value not available]"
- "Not available in mock fixture"

Prohibited copy not used:
- "Official audit record" — not used
- "Logged and auditable" — not used
- "Persisted / Stored / Saved" (implying real persistence) — not used

## Privacy Handling

`FORBIDDEN_AUDIT_METADATA_KEYS` from `src/lib/audit/auditMetadataRules.ts` is imported into the drawer and applied to all `before`/`after` metadata rendering. Forbidden keys display `[Hidden by privacy rule]`.

Existing AP-6A persistence filter and mock/demo badge on each row remain intact.

## Recommended Next Step

**Review AP-6B UX first, then AP-6C — Connect AP-4 mock writer to Admin display in mock-only mode.**

AP-6C should remain limited to:
- Calling `mockAuditWriter.write(...)` from Staff document `onReject` / `onRequestReplacement` callbacks
- Using `mock_only` persistence mode only
- Not claiming real persistence in any copy
- Not enforcing additional reason validation
- Not introducing `ReasonRequiredModal`

Do not wire Staff document actions yet. Do not start AP-6C without explicit approval.

## Final Status

- Final branch: `main`
- Working tree: clean
- `main` synced with `origin/main`: yes
- AP-6B runtime merged: yes
- Admin UI changed: yes
- Mock writer wired into Admin display: no
- Staff actions wired: no
- Real audit persistence added: no
- Mock audit fixture mutated: no
- Reason validation changed: no
- ReasonRequiredModal introduced: no
- AP-6C started: no
