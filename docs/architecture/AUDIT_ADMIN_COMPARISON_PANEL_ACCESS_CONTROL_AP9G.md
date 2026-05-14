# Audit Admin Comparison Panel Access Control AP-9G

## 1. Purpose

This document defines the access control model for the future AP-9G Admin debug comparison panel. It specifies which roles may access the panel, how access is enforced, what happens when access is denied, and how access decisions are auditable.

This is a planning document. No panel exists yet.

## 2. Admin-Only Rule

The comparison debug panel is visible only to users with the `admin` role. This is a hard constraint that must be enforced at:
- The component render level (conditional render by role)
- The route level (if the panel is ever placed on its own route)
- The feature flag level (all three flags must be enabled)

**The panel must never be visible to any other role under any circumstance.**

## 3. Forbidden Roles

| Role | Access | Behavior on attempt |
|------|--------|---------------------|
| `admin` | Allowed (when all flags enabled) | Panel renders |
| `staff` | Forbidden | Panel renders nothing (no error) |
| `student` | Forbidden | Panel renders nothing (no error) |
| `provider` | Forbidden | Panel renders nothing (no error) |
| `esq` | Forbidden | Panel renders nothing (no error) |
| Unauthenticated | Forbidden | Redirect to login |

The forbidden behavior is a silent empty render — not a 403 message, not a "panel coming soon" message, not any indicator that comparison data exists. Non-Admin roles must not be able to infer that a comparison panel is present from the page structure.

## 4. Required Permissions

For the panel to render, all of the following must be true:

1. **Role check**: `session.role === 'admin'`
2. **Feature flag 1**: `featureEnabled === true` (AP-9F master gate)
3. **Feature flag 2**: `readCompareEnabled === true` (AP-9F comparison gate)
4. **Feature flag 3**: `adminDebugPanelEnabled === true` (AP-9G panel gate)

If any condition is false, the panel renders nothing. The condition evaluation order matters: role is checked first; flags are only evaluated for Admin users.

## 5. Feature Flag Gates

All three feature flags must be explicitly enabled. The default configuration must have all three as `false`:

```
featureEnabled: false           // existing AP-9F flag
readCompareEnabled: false        // existing AP-9F flag
adminDebugPanelEnabled: false    // new AP-9G flag (not yet implemented)
```

When `adminDebugPanelEnabled` is `false`, the panel component must not mount at all — not even in a hidden or collapsed state visible to DOM inspection.

## 6. Route and Component Placement

Recommended placement: a collapsible section within `/admin/audit-log` or a sub-section of the Admin dashboard at `/admin/dashboard`, guarded by the Admin role check.

The panel must not:
- Be placed on a public route
- Be placed on `/staff/*`, `/student/*`, `/provider/*`, or `/esq/*` routes
- Appear in the navigation menu for non-Admin roles
- Be accessible from any shared component used across roles

If a standalone debug route is ever created (e.g. `/admin/audit-comparison-debug`):
- It must redirect non-Admin sessions to `/admin/dashboard`
- It must redirect unauthenticated sessions to `/login`
- It must not reveal in the redirect destination that a comparison panel exists

## 7. Blocked Access Behavior

When access is blocked:
- **Non-Admin authenticated user**: Component renders nothing. No error message, no placeholder, no indication the panel exists.
- **Unauthenticated user**: Standard redirect to `/login`, matching site-wide behavior.
- **Admin user with flags disabled**: Component renders nothing. No placeholder visible in DOM.
- **Admin user with flags enabled**: Panel renders with comparison data.

The panel must not leave any trace in the rendered HTML (no hidden `div`, no empty container, no comments) when access is blocked or flags are disabled. This prevents role-disclosure through DOM inspection.

## 8. Auditability

When the panel is eventually implemented, display of comparison data by an Admin user should be auditable. Proposed audit event (not implemented in AP-9G):

- Event type: `admin.comparison_panel.viewed`
- Recorded fields: timestamp, actor role (admin), session ID (not actorId)
- Forbidden in audit record: actorId, targetId, any comparison data, PII

This audit event must flow through the standard `sharedMockWriter`/prototype write path and must not bypass the existing audit event format or guards.

## 9. QA Checklist

- [ ] Panel component renders nothing for `staff` role
- [ ] Panel component renders nothing for `student` role
- [ ] Panel component renders nothing for `provider` role
- [ ] Panel component renders nothing for `esq` role
- [ ] Panel component renders nothing for unauthenticated user
- [ ] Panel component renders nothing when `adminDebugPanelEnabled` is `false`
- [ ] Panel component renders nothing when `featureEnabled` is `false`
- [ ] Panel component renders nothing when `readCompareEnabled` is `false`
- [ ] Panel is not visible in rendered HTML when access is blocked (no empty container)
- [ ] No route accessible to non-Admin that reveals panel exists
- [ ] Direct URL access by non-Admin redirects to login or dashboard
- [ ] Navigation menu does not show comparison panel link for non-Admin roles
- [ ] Feature flag defaults are all `false`
- [ ] Role check happens before flag check
