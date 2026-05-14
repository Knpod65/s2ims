// ---------------------------------------------------------------------------
// Notification Navigation Service — UX-N1A Runtime Skeleton
// ---------------------------------------------------------------------------
// Resolves notification targets through route registry and policy boundaries.
// It does not call router.push, mark notifications read, or mutate payloads.
// ---------------------------------------------------------------------------

import type {
  NotificationNavigationPolicyContract,
  NotificationNavigationServiceContract,
  NotificationRouteRegistryContract,
} from '../contracts/notificationNavigationContracts'
import type {
  NotificationNavigationOptions,
  NotificationNavigationPayload,
  NotificationNavigationResolution,
  NotificationNavigationTarget,
} from '../dto/notificationNavigationDto'
import { notificationRouteRegistry } from '../routes/notificationRouteRegistry'
import { notificationNavigationPolicy } from '../policies/notificationNavigationPolicy'

export class NotificationNavigationService implements NotificationNavigationServiceContract {
  constructor(
    private readonly routeRegistry: NotificationRouteRegistryContract = notificationRouteRegistry,
    private readonly policy: NotificationNavigationPolicyContract = notificationNavigationPolicy,
  ) {}

  resolve(
    payload: NotificationNavigationPayload,
    options: NotificationNavigationOptions
  ): NotificationNavigationResolution {
    const policyBlock = this.policy.explainBlockedNavigation(options.actorRole, payload)
    if (policyBlock) {
      return { allowed: false, isClickable: false, blockedReason: policyBlock }
    }

    return this.routeRegistry.resolveTarget(payload)
  }

  canNavigate(payload: NotificationNavigationPayload, options: NotificationNavigationOptions): boolean {
    return this.resolve(payload, options).allowed
  }

  getTarget(
    payload: NotificationNavigationPayload,
    options: NotificationNavigationOptions
  ): NotificationNavigationTarget | null {
    const resolution = this.resolve(payload, options)
    return resolution.allowed ? resolution.target : null
  }
}

export const notificationNavigationService = new NotificationNavigationService()

export function createTopbarNotificationPayload(options: {
  role?: string | null
  unreadCount: number
  lang?: 'en' | 'th'
}): NotificationNavigationPayload {
  const { role, unreadCount, lang = 'en' } = options
  const isStudent = role === 'student'
  const hasUnread = unreadCount > 0

  return {
    id: 'topbar-notification-center',
    type: 'topbar.notification_center',
    severity: hasUnread ? 'info' : 'low',
    title: lang === 'th' ? 'การแจ้งเตือน' : 'Notifications',
    body: hasUnread
      ? lang === 'th'
        ? `มีการแจ้งเตือนที่ยังไม่ได้อ่าน ${unreadCount} รายการ`
        : `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
      : lang === 'th'
        ? 'ไม่มีการแจ้งเตือนใหม่'
        : 'No new notifications',
    targetRouteName: isStudent ? 'student.notifications' : 'role.dashboard',
    targetRouteParams: {},
    targetDisplayToken: isStudent
      ? lang === 'th'
        ? 'ศูนย์การแจ้งเตือน'
        : 'Notification center'
      : undefined,
    actorRoleScope: isStudent ? ['student'] : role ? [role] : [],
    requiresPermission: isStudent ? 'student.notifications.view_own' : 'role.dashboard.view',
    createdAt: '1970-01-01T00:00:00.000Z',
    actionLabel: lang === 'th' ? 'ดูการแจ้งเตือน' : 'View notifications',
    isClickable: isStudent,
  }
}
