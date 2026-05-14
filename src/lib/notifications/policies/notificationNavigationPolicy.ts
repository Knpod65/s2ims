// ---------------------------------------------------------------------------
// Notification Navigation Policy — UX-N1A Runtime Skeleton
// ---------------------------------------------------------------------------
// Conservative role/permission boundary for future notification navigation.
// This module does not render UI and does not navigate.
// ---------------------------------------------------------------------------

import type { NotificationNavigationPolicyContract } from '../contracts/notificationNavigationContracts'
import type {
  NotificationNavigationBlockedReason,
  NotificationNavigationPayload,
} from '../dto/notificationNavigationDto'
import {
  isKnownNotificationRouteName,
  NOTIFICATION_ROUTE_REGISTRY,
} from '../routes/notificationRouteRegistry'

export class NotificationNavigationPolicy implements NotificationNavigationPolicyContract {
  canSeeNotification(role: string, payload: NotificationNavigationPayload): boolean {
    return payload.actorRoleScope.includes(role)
  }

  canUseRoute(role: string, routeName: string): boolean {
    if (!isKnownNotificationRouteName(routeName)) return false
    return NOTIFICATION_ROUTE_REGISTRY[routeName].allowedRoles.includes(role as any)
  }

  canNavigate(role: string, payload: NotificationNavigationPayload): boolean {
    return this.explainBlockedNavigation(role, payload) === null
  }

  explainBlockedNavigation(
    role: string,
    payload: NotificationNavigationPayload
  ): NotificationNavigationBlockedReason | null {
    if (!payload.isClickable) return 'not_clickable'
    if (!isKnownNotificationRouteName(payload.targetRouteName)) return 'unknown_route'
    if (!this.canSeeNotification(role, payload)) return 'role_scope_mismatch'
    if (!this.canUseRoute(role, payload.targetRouteName)) return 'route_not_allowed_for_role'

    const definition = NOTIFICATION_ROUTE_REGISTRY[payload.targetRouteName]
    if (payload.requiresPermission !== definition.permission) return 'permission_mismatch'

    return null
  }
}

export const notificationNavigationPolicy = new NotificationNavigationPolicy()

export function canNavigate(role: string, payload: NotificationNavigationPayload): boolean {
  return notificationNavigationPolicy.canNavigate(role, payload)
}

export function canSeeNotification(role: string, payload: NotificationNavigationPayload): boolean {
  return notificationNavigationPolicy.canSeeNotification(role, payload)
}

export function canUseRoute(role: string, routeName: string): boolean {
  return notificationNavigationPolicy.canUseRoute(role, routeName)
}

export function explainBlockedNavigation(
  role: string,
  payload: NotificationNavigationPayload
): NotificationNavigationBlockedReason | null {
  return notificationNavigationPolicy.explainBlockedNavigation(role, payload)
}
