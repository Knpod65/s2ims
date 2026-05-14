// ---------------------------------------------------------------------------
// Notification Route Registry — UX-N1A Runtime Skeleton
// ---------------------------------------------------------------------------
// Safe named-route registry for future notification navigation. This module
// only resolves targets; it does not call router.push or mutate read state.
// ---------------------------------------------------------------------------

import type {
  NotificationNavigationPayload,
  NotificationNavigationResolution,
  NotificationRouteName,
  NotificationRoleScope,
} from '../dto/notificationNavigationDto'
import type { NotificationRouteRegistryContract } from '../contracts/notificationNavigationContracts'

type RouteDefinition = {
  routeName: NotificationRouteName
  template: string
  requiredParams: string[]
  allowedRoles: NotificationRoleScope[]
  permission: string
}

const FORBIDDEN_PARAM_KEYS = [
  'rawStudentId',
  'studentId',
  'nationalId',
  'email',
  'phone',
  'bankAccount',
  'address',
  'rawUploadedFileName',
  'rawDocumentPath',
  'rawGuardianInfo',
  'fullName',
  'rawStudentName',
  'studentEmail',
  'medicalInfo',
  'disabilityInfo',
  'incomeRaw',
  'gpaRaw',
  'freeTextSensitiveData',
]

export const NOTIFICATION_ROUTE_REGISTRY: Record<NotificationRouteName, RouteDefinition> = {
  'student.notifications': {
    routeName: 'student.notifications',
    template: '/student/notifications',
    requiredParams: [],
    allowedRoles: ['student'],
    permission: 'student.notifications.view_own',
  },
  'student.application.detail': {
    routeName: 'student.application.detail',
    template: '/student/applications/[applicationId]',
    requiredParams: ['applicationId'],
    allowedRoles: ['student'],
    permission: 'student.application.view_own',
  },
  'student.application.documents': {
    routeName: 'student.application.documents',
    template: '/student/applications/[applicationId]/documents',
    requiredParams: ['applicationId'],
    allowedRoles: ['student'],
    permission: 'student.application.view_own',
  },
  'student.scholarship.detail': {
    routeName: 'student.scholarship.detail',
    template: '/student/scholarships/[scholarshipId]',
    requiredParams: ['scholarshipId'],
    allowedRoles: ['student'],
    permission: 'student.scholarship.view',
  },
  'staff.application.detail': {
    routeName: 'staff.application.detail',
    template: '/staff/applications/[id]',
    requiredParams: ['id'],
    allowedRoles: ['staff'],
    permission: 'staff.application.view',
  },
  'staff.followUp': {
    routeName: 'staff.followUp',
    template: '/staff/follow-up',
    requiredParams: [],
    allowedRoles: ['staff'],
    permission: 'staff.follow_up.view',
  },
  'student.followUp': {
    routeName: 'student.followUp',
    template: '/student/follow-up',
    requiredParams: [],
    allowedRoles: ['student'],
    permission: 'student.follow_up.view_own',
  },
  'admin.audit.detail': {
    routeName: 'admin.audit.detail',
    template: '/admin/audit-log',
    requiredParams: ['eventId'],
    allowedRoles: ['admin'],
    permission: 'admin.audit.view',
  },
  'admin.dashboard': {
    routeName: 'admin.dashboard',
    template: '/admin/dashboard',
    requiredParams: [],
    allowedRoles: ['admin'],
    permission: 'admin.dashboard.view',
  },
  'provider.candidate.pool': {
    routeName: 'provider.candidate.pool',
    template: '/provider/scholarships/[scholarshipId]/candidates',
    requiredParams: ['scholarshipId'],
    allowedRoles: ['provider'],
    permission: 'provider.candidate_pool.view',
  },
  'esq.announcement.review': {
    routeName: 'esq.announcement.review',
    template: '/esq/announcements/[id]/review',
    requiredParams: ['id'],
    allowedRoles: ['esq'],
    permission: 'esq.announcement.review',
  },
  'role.dashboard': {
    routeName: 'role.dashboard',
    template: '/login',
    requiredParams: [],
    allowedRoles: ['student', 'staff', 'provider', 'admin', 'executive', 'esq'],
    permission: 'role.dashboard.view',
  },
}

export function isKnownNotificationRouteName(routeName: string): routeName is NotificationRouteName {
  return routeName in NOTIFICATION_ROUTE_REGISTRY
}

export function hasUnsafeNotificationRouteParams(params: Record<string, string>): boolean {
  return Object.keys(params).some((key) => FORBIDDEN_PARAM_KEYS.includes(key))
}

export function resolveNotificationRouteTarget(
  payload: NotificationNavigationPayload
): NotificationNavigationResolution {
  if (!isKnownNotificationRouteName(payload.targetRouteName)) {
    return { allowed: false, isClickable: false, blockedReason: 'unknown_route' }
  }

  const definition = NOTIFICATION_ROUTE_REGISTRY[payload.targetRouteName]
  const params = { ...payload.targetRouteParams }

  if (hasUnsafeNotificationRouteParams(params)) {
    return { allowed: false, isClickable: false, blockedReason: 'unsafe_param' }
  }

  const missingParam = definition.requiredParams.find((param) => !params[param])
  if (missingParam) {
    return { allowed: false, isClickable: false, blockedReason: 'missing_param' }
  }

  const href = definition.requiredParams.reduce(
    (path, param) => path.replace(`[${param}]`, encodeURIComponent(params[param])),
    definition.template
  )

  return {
    allowed: true,
    isClickable: true,
    target: {
      routeName: definition.routeName,
      href,
      params,
      displayToken: payload.targetDisplayToken,
      permission: definition.permission,
    },
  }
}

export const notificationRouteRegistry: NotificationRouteRegistryContract = {
  isKnownRouteName: isKnownNotificationRouteName,
  resolveTarget: resolveNotificationRouteTarget,
}
