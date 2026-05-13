# Audit Notification Navigation Note AP-8

## 1. Observed Issue
A notification/alert area is visible in the UI (e.g., in the topbar bell icon area) but is not clickable. This was observed during validation but is **not** part of AP-8 scope.

User-reported issue (Thai): "สิ่งที่เห็นตรงแจ้งเตือนยังคลิกไม่ได้"

## 2. Why This Matters
- Future audit events may generate notifications (e.g., "Document rejected by staff").
- Clickable notifications must lead to a valid route (e.g., the audit event detail in Admin).
- Notification payloads must not expose raw PII in URLs or route parameters.
- Notification actions must respect role permissions (e.g., only staff can see staff document notifications).

## 3. Current AP-8 Decision
- Document only (this file).
- No runtime change.
- No notification click implementation.
- No navigation change.
- This issue is separate from audit persistence planning.

## 4. Future Phase Recommendation
Propose a separate UX/navigation planning phase: `UX-N1 — Notification Navigation Contract Plan`

This phase would:
- Inspect notification routes and payload shapes.
- Define notification click targets (routes, parameters).
- Add permission checks before navigation.
- Ensure notification payloads contain only safe, tokenized identifiers.
- Plan for marking notifications as read.

## 5. Future Contract Ideas
### Notification Payload Shape
```typescript
type NotificationPayload = {
  id: string;
  type: 'audit_document_rejected' | 'audit_verification' | 'audit_export';
  severity: 'info' | 'warning' | 'error';
  title: string; // localized
  body: string; // localized
  targetRouteName: string; // e.g., '/admin/audit-log/[id]'
  targetRouteParams: { id: string }; // tokenized, no PII
  targetDisplayToken: string; // e.g., 'S-123'
  actorRoleScope: 'staff' | 'admin' | 'provider';
  requiresPermission: string; // permission required to view
  createdAt: string; // ISO
  readAt?: string; // ISO or undefined
  actionLabel?: string; // localized action button text
  isClickable: boolean; // computed from permission and route
};
```

### Laravel/PHP Mapping
| S2IMS Concept | Laravel/PHP Equivalent |
|--------------|----------------------|
| `NotificationPayload` | `App\Notifications\AuditEventNotification` |
| Database notification | `notifications` table (Laravel built-in) |
| Route model binding | Controller uses `AuditEventPolicy` before returning view |
| Permission check | Laravel Policy or Gate check before navigation |
| Signed/internal route | Laravel signed route or internal middleware |

## 6. QA Checklist for Future (UX-N1)
Before implementing notification click:
- [ ] Notification is visible in the UI.
- [ ] Notification is clickable (cursor changes to pointer).
- [ ] Clicking navigates to the correct route.
- [ ] Permission is blocked: unauthorized users see safe error page.
- [ ] No raw PII in URL (only tokens).
- [ ] Read/unread state updates correctly.
- [ ] Mobile layout works (touch targets are adequate).
- [ ] Notification can be marked as read without navigation bug.
