// ---------------------------------------------------------------------------
// Notification Navigation DTOs — UX-N1A Runtime Skeleton
// ---------------------------------------------------------------------------
// Serializable shapes for future notification navigation.
//
// Laravel/PHP equivalents:
// - NotificationNavigationPayload -> App\Data\Notification\NotificationNavigationData
// - NotificationNavigationTarget  -> App\Data\Notification\NotificationTargetData
// - NotificationNavigationResolution -> App\Data\Notification\NotificationNavigationResultData
// ---------------------------------------------------------------------------

export type NotificationSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical'

export type NotificationRoleScope =
  | 'student'
  | 'staff'
  | 'provider'
  | 'admin'
  | 'executive'
  | 'esq'
  | 'system'

export type NotificationRouteName =
  | 'student.application.detail'
  | 'student.application.documents'
  | 'student.scholarship.detail'
  | 'staff.application.detail'
  | 'staff.followUp'
  | 'student.followUp'
  | 'admin.audit.detail'
  | 'admin.dashboard'
  | 'provider.candidate.pool'
  | 'esq.announcement.review'
  | 'role.dashboard'

export type NotificationNavigationPayload = {
  id: string
  type: string
  severity: NotificationSeverity
  title: string
  body: string
  targetRouteName: string
  targetRouteParams: Record<string, string>
  targetDisplayToken?: string
  actorRoleScope: string[]
  requiresPermission: string
  createdAt: string
  readAt?: string
  actionLabel?: string
  isClickable: boolean
}

export type NotificationNavigationTarget = {
  routeName: NotificationRouteName
  href: string
  params: Record<string, string>
  displayToken?: string
  permission: string
}

export type NotificationNavigationBlockedReason =
  | 'unknown_route'
  | 'missing_param'
  | 'unsafe_param'
  | 'role_scope_mismatch'
  | 'permission_mismatch'
  | 'route_not_allowed_for_role'
  | 'not_clickable'

export type NotificationNavigationResolution =
  | {
      allowed: true
      isClickable: true
      target: NotificationNavigationTarget
      blockedReason?: never
    }
  | {
      allowed: false
      isClickable: false
      target?: never
      blockedReason: NotificationNavigationBlockedReason
    }

export type NotificationNavigationOptions = {
  actorRole: string
  lang?: 'en' | 'th'
}

export type NotificationNavigationPresenterOutput = {
  id: string
  title: string
  body: string
  severity: NotificationSeverity
  isClickable: boolean
  href?: string
  actionLabel: string
  ariaLabel: string
  disabledReason?: string
  targetDisplayToken?: string
}
