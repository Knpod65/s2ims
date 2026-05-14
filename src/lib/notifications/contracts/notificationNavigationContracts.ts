// ---------------------------------------------------------------------------
// Notification Navigation Contracts — UX-N1A Runtime Skeleton
// ---------------------------------------------------------------------------
// Interfaces only. No UI imports, no Next.js router dependency, and no click
// implementation. These contracts mirror the UX-N1 Laravel/PHP direction:
// service, policy, resource/presenter, route config, and copy boundaries.
// ---------------------------------------------------------------------------

import type {
  NotificationNavigationBlockedReason,
  NotificationNavigationOptions,
  NotificationNavigationPayload,
  NotificationNavigationPresenterOutput,
  NotificationNavigationResolution,
  NotificationNavigationTarget,
} from '../dto/notificationNavigationDto'

export interface NotificationRouteRegistryContract {
  isKnownRouteName(routeName: string): boolean
  resolveTarget(payload: NotificationNavigationPayload): NotificationNavigationResolution
}

export interface NotificationNavigationPolicyContract {
  canSeeNotification(role: string, payload: NotificationNavigationPayload): boolean
  canUseRoute(role: string, routeName: string): boolean
  canNavigate(role: string, payload: NotificationNavigationPayload): boolean
  explainBlockedNavigation(
    role: string,
    payload: NotificationNavigationPayload
  ): NotificationNavigationBlockedReason | null
}

export interface NotificationNavigationServiceContract {
  resolve(
    payload: NotificationNavigationPayload,
    options: NotificationNavigationOptions
  ): NotificationNavigationResolution
  canNavigate(payload: NotificationNavigationPayload, options: NotificationNavigationOptions): boolean
  getTarget(
    payload: NotificationNavigationPayload,
    options: NotificationNavigationOptions
  ): NotificationNavigationTarget | null
}

export interface NotificationNavigationPresenterContract {
  present(
    payload: NotificationNavigationPayload,
    resolution: NotificationNavigationResolution,
    options?: Pick<NotificationNavigationOptions, 'lang'>
  ): NotificationNavigationPresenterOutput
  presentList(
    payloads: NotificationNavigationPayload[],
    resolutions: NotificationNavigationResolution[],
    options?: Pick<NotificationNavigationOptions, 'lang'>
  ): NotificationNavigationPresenterOutput[]
}

export interface NotificationNavigationCopyContract {
  getActionLabel(payload: NotificationNavigationPayload, lang?: 'en' | 'th'): string
  getBlockedReasonCopy(reason: NotificationNavigationBlockedReason, lang?: 'en' | 'th'): string
  getAriaLabel(payload: NotificationNavigationPayload, lang?: 'en' | 'th'): string
}
